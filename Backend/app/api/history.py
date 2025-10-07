from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT
from app.services.history_services import get_user_prediction_history

router = APIRouter()

@router.get("/history")
async def get_history(Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    current_user = Authorize.get_jwt_subject()

    history = await get_user_prediction_history(current_user)
    return {"history": history}
