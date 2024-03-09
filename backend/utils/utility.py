from schemas.user import userEntity, usersEntity
from config.db import conn
from datetime import datetime, timedelta
import jwt
from passlib.hash import pbkdf2_sha256
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
import random
import aiosmtplib
from email.message import EmailMessage


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


user_collection = conn["users"]["permanent_users"]

# Helper functions for password hashing and verification
def verify_password(plain_password, hashed_password):
    return pbkdf2_sha256.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pbkdf2_sha256.hash(password)

def authenticate_user(phone_number: str, password: str):
    user = user_collection.find_one({"phoneNumber": phone_number})
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return userEntity(user)

# JWT token creation
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        phone_number: Optional[str] = payload.get("phoneNumber")

        if phone_number is None or payload.get("exp") < datetime.utcnow().timestamp():
            raise credentials_exception
        user = user_collection.find_one({"phoneNumber": phone_number})
        if user is None:
            raise credentials_exception
        return user
    except:
        raise credentials_exception


async def send_email(email_address: str, subject: str, content: str):
    message = EmailMessage()
    message["From"] = "your_email@example.com"
    message["To"] = email_address
    message["Subject"] = subject
    message.set_content(content)
    
    await aiosmtplib.send(
        message,
        hostname="smtp.gmail.com",  # Your SMTP server
        port=465,  # Your SMTP port
        username="gandharvakulkarni2003@gmail.com",
        password="clpd zwmx oibc lscp",
        use_tls=True,
    )

def generate_otp(length=4):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])


def prepare_user_data_for_permanent_storage(user_data):
    user_data.pop("expiresAt", None)
    user_data.pop("otp", None)
    return user_data