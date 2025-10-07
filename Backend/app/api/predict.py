from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from app.services.prediction_services import predict_and_save

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()

    try:
        current_user = Authorize.get_jwt_subject()
        result = await predict_and_save(file, user_email=current_user)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
