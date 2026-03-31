import asyncio
from passlib.context import CryptContext
from database import db   # ✅ correct import

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_admin():

    existing = db.users.find_one({"email": "admin@gmail.com"})
    
    if existing:
        print("Admin already exists")
        return

    hashed = pwd.hash("admin123")

    db.users.insert_one({
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": hashed,
        "role": "ADMIN",
        "walletBalance": 0
    })

    print("Admin created successfully")

if __name__ == "__main__":
    create_admin()