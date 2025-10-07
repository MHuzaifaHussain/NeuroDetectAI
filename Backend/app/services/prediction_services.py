import numpy as np
from tensorflow.keras.models import load_model
from app.utils.cloudinary_helper import upload_to_cloudinary
from datetime import datetime, timezone, timedelta 
import os
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.image_utils import preprocess_image
from tensorflow.keras.models import load_model

model = load_model("models/best_model.h5", compile=False)

class_names = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']
client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["brain_db"]
predictions = db["predictions"]
users = db["users"]


async def predict_and_save(file, user_email: str):
    user = await users.find_one({"email": user_email})
    if not user:
        raise ValueError("User not found")

    contents = await file.read()

    # Preprocess and predict
    img_array = preprocess_image(contents)
    pred = model.predict(img_array)
    class_index = int(np.argmax(pred))
    confidence = float(np.max(pred))
    label = class_names[class_index]

    if confidence >= 0.5:
        cloudinary_url = upload_to_cloudinary(contents)
        utc_timestamp = datetime.now(timezone.utc)
        local_timestamp = utc_timestamp + timedelta(hours=5)
        display_time = local_timestamp.strftime("%I:%M %p")

        await predictions.insert_one({
            "user_id": user["user_id"],
            "email": user_email,
            "label": label,
            "confidence": round(confidence * 100, 2),
            "image_url": cloudinary_url,
            "timestamp": utc_timestamp 
        })

        return {
            "disease": label,
            "confidence": round(confidence * 100, 2),
            "image_url": cloudinary_url,
            "timestamp": utc_timestamp.isoformat(), 
            "displayTime": display_time 
        }

    else:
        raise ValueError("Prediction confidence too low")
