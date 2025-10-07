from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import timedelta 

load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client["brain_db"]
predictions = db["predictions"]
users = db["users"]

async def get_user_prediction_history(user_email: str):
    user = await users.find_one({"email": user_email})
    if not user:
        return []

    user_id = user["user_id"]
    history_cursor = predictions.find({"user_id": user_id}).sort("timestamp", -1)
    history_docs = await history_cursor.to_list(length=100)

    processed_history = []
    for h in history_docs:
        utc_timestamp = h["timestamp"]
        local_timestamp = utc_timestamp + timedelta(hours=5)
        
        processed_history.append({
            "id": str(h["_id"]), 
            "disease": h["label"],
            "confidence": h["confidence"],
            "image_url": h["image_url"],
            "timestamp": utc_timestamp.isoformat(),
            "displayTime": local_timestamp.strftime("%I:%M %p")
        })

    return processed_history
