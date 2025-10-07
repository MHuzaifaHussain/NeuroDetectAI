from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    username: str
    email: EmailStr

class EmailVerificationSchema(BaseModel):
    email: EmailStr
    token: str

class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    image_url: Optional[str]
    timestamp: datetime

class PredictionHistory(BaseModel):
    user_id: int
    predictions: List[PredictionResponse]
