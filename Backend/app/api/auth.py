from fastapi import APIRouter, Depends, Response, HTTPException, status, BackgroundTasks
from fastapi_jwt_auth import AuthJWT
from app.models.schema import UserCreate, UserLogin, UserResponse
from app.services.auth_services import hash_password, verify_password, set_access_token_cookie, clear_access_token_cookie
from app.config import conf
from fastapi_mail import FastMail, MessageSchema, MessageType
from motor.motor_asyncio import AsyncIOMotorClient
from app.models.user_model import UserDB
import random
from datetime import datetime
import os

router = APIRouter()
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["brain_db"]
users = db["users"]

async def get_next_user_id():
    last = await users.find_one(sort=[("user_id", -1)])
    return last["user_id"] + 1 if last else 1

# Send verification email
async def send_verification_email(email: str, token: str, username: str):
    fm = FastMail(conf)
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    verification_link = f"{frontend_url}/verify-email?email={email}&token={token}"

    html_body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
                margin: 0;
                padding: 20px;
                background-color: #f8fafc; /* slate-50 */
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                overflow: hidden;
            }}
            .header {{
                text-align: center;
                padding: 20px;
                border-bottom: 1px solid #e5e7eb; /* gray-200 */
                background-color: #f1f5f9; /* slate-100 */
            }}
            .header img {{
                width: 48px;
                height: 48px;
            }}
            .header h1 {{
                font-size: 24px;
                font-weight: 700;
                color: #111827; /* gray-900 */
                margin: 10px 0 0;
            }}
            .content {{
                padding: 30px 20px;
                color: #374151; /* gray-700 */
                line-height: 1.6;
            }}
            .content h2 {{
                font-size: 20px;
                color: #111827;
                margin-top: 0;
            }}
            .content p {{
                margin: 0 0 16px;
            }}
            .button-container {{
                text-align: center;
                margin: 30px 0;
            }}
            .button {{
                display: inline-block;
                padding: 14px 28px;
                font-size: 16px;
                font-weight: 600;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 8px;
                background: linear-gradient(to right, #2563eb, #9333ea); /* blue-600 to purple-600 */
            }}
            .footer {{
                text-align: center;
                font-size: 12px;
                color: #6b7280; /* gray-500 */
                padding: 20px;
                border-top: 1px solid #e5e7eb; /* gray-200 */
                background-color: #f8fafc;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dapaxygk0/image/upload/f_auto,q_auto/brain-circuit_xpu8ov" alt="NeuroDetect Logo">
                <h1>NeuroDetect</h1>
            </div>
            <div class="content">
                <h2>Hello {username},</h2>
                <p>Thank you for signing up for NeuroDetect. To complete your registration, please verify your email address by clicking the button below.</p>
                <div class="button-container">
                    <a href="{verification_link}" class="button">Verify Now</a>
                </div>
                <p>If you did not create an account, no further action is required.</p>
            </div>
            <div class="footer">
                <p><b>Disclaimer:</b> NeuroDetect is a tool for informational and research purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</p>
                <p>&copy; {datetime.now().year} NeuroDetect. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """

    message = MessageSchema(
        subject="Verify Your NeuroDetect Account",
        recipients=[email],
        body=html_body,
        subtype=MessageType.html
    )
    await fm.send_message(message)

# REGISTER
@router.post("/register")
async def register(user: UserCreate, background_tasks: BackgroundTasks):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    existing = await users.find_one({"email": user.email})
    if existing:
        if existing.get("is_verified"):
            raise HTTPException(
                status_code=400, detail="Email is already verified. Please log in.")
        else:
            raise HTTPException(
                status_code=400, detail="Email already registered. Please check your inbox to verify your account.")

    user_id = await get_next_user_id()
    hashed_pw = hash_password(user.password)
    token = str(random.randint(100000, 999999))
    user_doc = UserDB(
        user_id=user_id,
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
        is_verified=False
    ).dict()
    user_doc["verify_token"] = token
    await users.insert_one(user_doc)

    background_tasks.add_task(send_verification_email,
                              user.email, token, user.username)
    return {"msg": "User created. Check your Gmail to verify."}

# VERIFY EMAIL
@router.get("/verify-email")
async def verify_email(email: str, token: str):
    user = await users.find_one({"email": email})
    if not user or user.get("verify_token") != token:
        raise HTTPException(status_code=400, detail="Invalid token or email.")

    await users.update_one({"email": email}, {"$set": {"is_verified": True}, "$unset": {"verify_token": ""}})
    return {"msg": "Email verified. You can now log in."}

# LOGIN
@router.post("/login")
async def login(user: UserLogin, response: Response, Authorize: AuthJWT = Depends()):
    db_user = await users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    if not db_user.get("is_verified"):
        raise HTTPException(
            status_code=403, detail="Please verify your email first.")

    set_access_token_cookie(response, Authorize, subject=user.email)
    return {"msg": "Login successful"}

# LOGOUT
@router.post("/logout")
async def logout(response: Response, Authorize: AuthJWT = Depends()):
    clear_access_token_cookie(response, Authorize)
    return {"msg": "Logged out"}

# GET CURRENT USER
@router.get("/me", response_model=UserResponse)
async def get_current_user(Authorize: AuthJWT = Depends()):
    """
    Retrieves the details of the currently authenticated user.
    """
    Authorize.jwt_required()

    current_user_email = Authorize.get_jwt_subject()
    user = await users.find_one({"email": current_user_email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user
