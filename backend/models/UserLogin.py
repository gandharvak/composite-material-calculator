from pydantic import BaseModel

class UserLogin(BaseModel):
    phoneNumber: str
    password: str