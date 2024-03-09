from pydantic import BaseModel

class VerifyOtpRequest(BaseModel):
    phoneNumber: str
    otp: str