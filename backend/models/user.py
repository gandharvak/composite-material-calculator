from pydantic import BaseModel

class User(BaseModel):
    name: str
    collegeName: str
    email: str
    phoneNumber: str
    password: str
    useFor: str
    isFreeTrialOver: bool = False
    isSubscribed: bool = False

