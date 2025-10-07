import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
import io

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


def upload_to_cloudinary(raw_image_bytes):
    upload_result = cloudinary.uploader.upload(
        io.BytesIO(raw_image_bytes), resource_type="image")
    return upload_result["secure_url"]
