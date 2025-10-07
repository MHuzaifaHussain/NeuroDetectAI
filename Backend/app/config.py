import os
from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from typing import Optional


load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Email settings
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

# Cloudinary settings
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")


class JWTSettings(BaseModel):
    authjwt_secret_key: str = JWT_SECRET_KEY
    authjwt_cookie_secure: bool = False
    authjwt_cookie_samesite: str = "lax"
    authjwt_cookie_csrf_protect: bool = False
    authjwt_token_location: set = {"cookies"}
    authjwt_access_cookie_key: str = "access_token"
    authjwt_cookie_domain: Optional[str] = None  # Set this if frontend domain differs

@AuthJWT.load_config
def get_config():
    return JWTSettings()
