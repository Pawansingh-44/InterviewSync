from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from websocket_manager import connect, disconnect, broadcast, broadcast_count, get_other
import json

router = APIRouter()

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await connect(room_id, websocket)

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            msg_type = data.get("type")

            # WebRTC signaling — sirf dusre peer ko bhejo
            if msg_type in ("offer", "answer", "ice_candidate"):
                other = get_other(room_id, websocket)
                if other:
                    try:
                        await other.send_text(raw)
                    except Exception:
                        pass

            # Baaki sab — broadcast (tera purana logic)
            elif msg_type in (
                "code",
                "chat",
                "remote_screen_share_started",
                "remote_screen_share_stopped",
            ):
                await broadcast(room_id, raw, websocket)

    except WebSocketDisconnect:
        disconnect(room_id, websocket)
        await broadcast_count(room_id)