from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow.keras.models import load_model
import numpy as np
from app.utils.image_utils import preprocess_image
router = APIRouter()

# Load model

model = load_model("models/best_model.h5", compile=False)
class_names = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary']


@router.post("/guest-predict")
async def guest_predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image_array = preprocess_image(contents)
        prediction = model.predict(image_array)
        index = int(np.argmax(prediction))
        confidence = float(np.max(prediction))

        return {
            "disease":  class_names[index],
            "confidence": round(confidence * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Prediction failed")
