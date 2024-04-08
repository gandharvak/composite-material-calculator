from config.db import conn
from fastapi import APIRouter, HTTPException, status, Depends
from schemas.feedback import feedbackEntity, feedbackEntities
from models.feedback import Feedback
from utils import utility

feedback = APIRouter(prefix="/feedback")

feedbacks_collection = conn["users"]["feedbacks"]

@feedback.post("/submit", status_code=status.HTTP_201_CREATED)
async def post_feedback(feedback_data: Feedback, current_user: dict = Depends(utility.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Insert the feedback data into the database, linked with the current user
    feedback_data_with_user = feedback_data.dict()
    feedback_data_with_user["user_id"] = current_user["_id"]
    
    result = feedbacks_collection.insert_one(feedback_data_with_user)
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to post feedback")

    # Optionally, you can update the user's access token or perform other actions here

    return {"message": "Feedback submitted successfully", "id": str(result.inserted_id)}