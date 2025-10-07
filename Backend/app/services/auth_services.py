from passlib.context import CryptContext
from fastapi_jwt_auth import AuthJWT
from datetime import timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hashing password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify plain vs hashed password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT token and set it in a secure HTTP-only cookie
def set_access_token_cookie(response, Authorize: AuthJWT, subject: str):
    access_token = Authorize.create_access_token(subject=subject, expires_time=timedelta(days=3))
    Authorize.set_access_cookies(access_token, response)
    return access_token

# Clear the cookie on logout
def clear_access_token_cookie(response, Authorize: AuthJWT):
    Authorize.unset_jwt_cookies(response)
