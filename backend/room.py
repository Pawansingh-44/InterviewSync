from fastapi import APIRouter
from pydantic import BaseModel
from database import rooms_collection
import random
import string

router = APIRouter()


class CreateRoom(BaseModel):
    interviewer: str


class JoinRoom(BaseModel):
    roomId: str


@router.post("/create")
def create_room(data: CreateRoom):

    room_id = "ROOM-" + "".join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=6
        )
    )

    room_data = {
        "roomId": room_id,
        "interviewer": data.interviewer,
        "status": "active"
    }

    rooms_collection.insert_one(room_data)

    return {
        "roomId": room_id
    }


@router.post("/join")
def join_room(data: JoinRoom):

    room = rooms_collection.find_one({
        "roomId": data.roomId
    })

    if not room:
        return {
            "success": False,
            "message": "Room not found"
        }

    return {
        "success": True,
        "roomId": room["roomId"]
    }