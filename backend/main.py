from ws import router as ws_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router
from room import router as room_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router,
    prefix="/auth"
)

app.include_router(
    room_router,
    prefix="/room"
)
app.include_router(ws_router)

@app.get("/")
def home():
    return {
        "message": "InterviewSync Backend Running"
    }