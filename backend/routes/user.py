from fastapi import APIRouter, HTTPException, status, Depends
from models.user import User
from models.UpdateUser import UpdateUser
from config.db import conn
from schemas.user import userEntity, usersEntity
from bson import ObjectId
from models.UserLogin import UserLogin
from models.OTPModel import VerifyOtpRequest
from utils import utility
from datetime import timedelta
import datetime
from datetime import datetime
from utils.otp import sendOTP
from config.razorpay_config import razorpay_client


ACCESS_TOKEN_EXPIRE_MINUTES = 30

user = APIRouter()

temp_user_collection = conn["users"]["temp_users"]
user_collection = conn["users"]["permanent_users"]


temp_user_collection.create_index("expiresAt", expireAfterSeconds=0)

# @user.get("/", status_code=status.HTTP_200_OK)
# async def find_all_users():
#     users = usersEntity(user_collection.find())

#     if not users:
#         raise HTTPException(status_code=404, detail= "No Users")

#     return usersEntity(user_collection.find())


@user.get("/{id}", status_code=status.HTTP_200_OK)
async def get_user(id):
    return userEntity(user_collection.find_one({"_id":ObjectId(id)}))


@user.patch("/{id}", status_code=status.HTTP_200_OK)
async def update_user(id: str, user: UpdateUser):
    update_data = user.dict(exclude_unset=True)
    user_collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": update_data})
    return userEntity(user_collection.find_one({"_id": ObjectId(id)}))


# @user.delete('/', status_code=status.HTTP_200_OK)
# async def delete_user(id):
#     return userEntity(user_collection.find_one_and_delete({"_id": ObjectId(id)}))

@user.post("/login", status_code=status.HTTP_200_OK)
async def login_for_access_token(form_data: UserLogin):
    user = utility.authenticate_user(form_data.phoneNumber, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect phone number or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utility.create_access_token(
        data={"id":user["id"], "phoneNumber": user["phoneNumber"], "isFreeTrialOver": user["isFreeTrialOver"], "isSubscribed": user["isSubscribed"]}, expires_delta=access_token_expires
    )
    return {"token": access_token}


@user.post("/register", status_code=status.HTTP_200_OK)
async def register_user(user: User):
    db_user = user_collection.find_one({"phoneNumber": user.phoneNumber})
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    current_time = datetime.utcnow()
    expires_at = current_time + timedelta(minutes=1)

    hashed_password = utility.get_password_hash(user.password)
    otp = utility.generate_otp()
    user_data = dict(user)
    user_data.update({"password": hashed_password, "otp": otp, "expiresAt": expires_at})

    await sendOTP(otp, user.phoneNumber)
    
    temp_user_collection.insert_one(user_data)
    
    return {"message": "User successfully registered. check your phone for the OTP to verify your account.", "status_code": 200}

@user.post("/verify_otp", status_code=status.HTTP_201_CREATED)
async def verify_otp(request: VerifyOtpRequest):
    # Find the user in the temporary collection
    temp_user = temp_user_collection.find_one({"phoneNumber": request.phoneNumber})
    if not temp_user:
        raise HTTPException(status_code=404, detail="User not found.")

    # Check if the OTP has expired
    if temp_user["expiresAt"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP has expired.")
    
    # Verify the OTP
    if temp_user["otp"] == request.otp:
        # Prepare user data for permanent storage (e.g., remove otp and expiresAt fields)
        user_data = utility.prepare_user_data_for_permanent_storage(temp_user)
        # Insert the user data into the permanent user collection
        user_collection.insert_one(user_data)
        # Delete the temporary user data
        temp_user_collection.delete_one({"phoneNumber": request.phoneNumber})
        return {"message": "OTP verified successfully. User registration complete.", "status_code": 200}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP.")


@user.post("/subscribe", status_code=status.HTTP_200_OK)
async def subscribe(current_user: dict = Depends(utility.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_collection.update_one({"_id": current_user["_id"]}, {"$set": {"isSubscribed": True}})

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utility.create_access_token(
        data={"phoneNumber": current_user["phoneNumber"], "isFreeTrialOver": current_user["isFreeTrialOver"], "isSubscribed": True}, expires_delta=access_token_expires
    )

    return {"message": "Subscribed successfully", "isSubscribed": True, "token": access_token}

@user.post("/unsubscribe", status_code=status.HTTP_200_OK)
async def unsubscribe(current_user: dict = Depends(utility.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_collection.update_one({"_id": current_user["_id"]}, {"$set": {"isSubscribed": False}})

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utility.create_access_token(
        data={"phoneNumber": current_user["phoneNumber"], "isFreeTrialOver": current_user["isFreeTrialOver"], "isSubscribed": False}, expires_delta=access_token_expires
    )
    return {"message": "Unsubscribed successfully", "isSubscribed": False, "token": access_token}


@user.post("/trial-over", status_code=status.HTTP_200_OK)
async def trial_over(current_user: dict = Depends(utility.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update the `isFreeTrialOver` field in the database
    user_collection.update_one({"_id": current_user["_id"]}, {"$set": {"isFreeTrialOver": True}})

    # Generate a new access token with the updated `isFreeTrialOver` field
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = utility.create_access_token(
        data={"phoneNumber": current_user["phoneNumber"], "isFreeTrialOver": True, "isSubscribed": current_user["isSubscribed"]}, expires_delta=access_token_expires
    )

    return {"message": "Trial period marked as over", "isFreeTrialOver": True, "token": access_token}

@user.post("/create_payment_order")
async def create_payment_order(amount: int):
    try:
        data = {"amount": amount * 100, "currency": "INR", "payment_capture": '1'}
        order = razorpay_client.order.create(data=data)
        return {"order_id": order['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@user.post("/verify_payment")
async def verify_payment(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str):
    params_dict = {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": razorpay_signature,
    }

    try:
        razorpay_client.utility.verify_payment_signature(params_dict)
        return {"status": "Payment successfully verified"}
    except:
        raise HTTPException(status_code=400, detail="Payment verification failed")
