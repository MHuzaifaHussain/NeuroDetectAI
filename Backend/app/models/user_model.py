from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserDB(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    hashed_password: str
    is_verified: bool = False
    created_at: datetime = datetime.utcnow()
