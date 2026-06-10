from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["interviewsync"]

users_collection = db["users"]
rooms_collection = db["rooms"]

print("MongoDB Connected Successfully")