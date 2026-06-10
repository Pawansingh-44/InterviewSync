from fastapi import APIRouter
from pydantic import BaseModel
from database import users_collection

router = APIRouter()


# =========================
# Register Model
# =========================
class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: str


# =========================
# Login Model
# =========================
class UserLogin(BaseModel):
    email: str
    password: str


# =========================
# Register API
# =========================
@router.post("/register")
def register(user: UserRegister):

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if existing_user:
        return {
            "message": "Email already exists"
        }

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "role": user.role
    }

    users_collection.insert_one(user_data)

    return {
        "message": "User registered successfully"
    }


# =========================
# Login API
# =========================
@router.post("/login")
def login(user: UserLogin):

    existing_user = users_collection.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "message": "User not found"
        }

    if existing_user["password"] != user.password:
        return {
            "message": "Incorrect password"
        }

    return {
        "message": "Login successful",
        "name": existing_user["name"],
        "role": existing_user["role"]
    }