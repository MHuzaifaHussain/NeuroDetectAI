from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, predict, guest, history
from fastapi_jwt_auth.exceptions import AuthJWTException
from fastapi.responses import JSONResponse
from pymongo.errors import ServerSelectionTimeoutError

app = FastAPI(
    title="Brain Tumor Detection API",
    description="FastAPI backend with image classification, JWT auth, Cloudinary, and MongoDB",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
]

# Enable cross-origin cookies
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Handle auth errors globally
@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

@app.exception_handler(ServerSelectionTimeoutError)
async def db_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Database connection error. Please try again later."}
    )

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Brain Tumor Detection API! Visit /docs for API documentation."}

# Register API routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(predict.router, tags=["Prediction"])
app.include_router(guest.router, tags=["Guest"])
app.include_router(history.router, tags=["History"])
