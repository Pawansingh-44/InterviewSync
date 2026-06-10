from fastapi import WebSocket
import json

rooms: dict[str, list[WebSocket]] = {}


async def connect(room_id: str, websocket: WebSocket):
    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append(websocket)

    # Notify everyone in room about new participant count
    await broadcast_count(room_id)


def disconnect(room_id: str, websocket: WebSocket):
    if room_id in rooms:
        if websocket in rooms[room_id]:
            rooms[room_id].remove(websocket)

        # Clean up empty room
        if not rooms[room_id]:
            del rooms[room_id]


async def broadcast(room_id: str, message: str, sender: WebSocket):
    """Send message to all OTHER participants in the room."""
    if room_id in rooms:
        for connection in rooms[room_id]:
            if connection != sender:
                await connection.send_text(message)


async def broadcast_count(room_id: str):
    """Broadcast current participant count to everyone in the room."""
    count = len(rooms.get(room_id, []))
    msg = json.dumps({"type": "participant_count", "count": count})

    for connection in rooms.get(room_id, []):
        try:
            await connection.send_text(msg)
        except Exception:
            pass


def get_other(room_id: str, sender: WebSocket) -> WebSocket | None:
    """Return the other participant in a 2-person room."""
    for connection in rooms.get(room_id, []):
        if connection != sender:
            return connection
    return None