from pydantic import BaseModel
from typing import Optional
class UpdateUser(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    collegeName: Optional[str] = None