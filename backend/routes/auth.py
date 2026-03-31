from fastapi import APIRouter, HTTPException
from database import db
from models.user import UserCreate
from passlib.context import CryptContext
from jose import jwt

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET = "secret123"

# ================= REGISTER =================
@router.post("/register")
def register(user: UserCreate):

    existing = db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user.password)

    db.users.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "walletBalance": 0,
        "role": user.role
    })

    return {"message": "User registered successfully"}


# ================= USER LOGIN =================
@router.post("/login")
def login(user: dict):

    db_user = db.users.find_one({"email": user["email"]})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(user["password"], db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = jwt.encode(
        {
            "userId": str(db_user["_id"]),
            "role": db_user["role"]
        },
        SECRET,
        algorithm="HS256"
    )

    return {
        "message": "Login successful",
        "token": token
    }


# ================= ADMIN LOGIN =================
@router.post("/admin/login")
def admin_login(user: dict):

    db_user = db.users.find_one({"email": user["email"]})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Not an admin")

    if not pwd_context.verify(user["password"], db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = jwt.encode(
        {
            "userId": str(db_user["_id"]),
            "role": "ADMIN"
        },
        SECRET,
        algorithm="HS256"
    )

    return {
        "message": "Admin login successful",
        "token": token
    }