from fastapi import APIRouter, HTTPException
from database import db
from bson import ObjectId
from datetime import datetime

router = APIRouter()

# ================= ADD MONEY =================
@router.post("/add-money")
def add_money(data: dict):

    try:
        user_id = ObjectId(data["userId"])
    except:
        raise HTTPException(status_code=400, detail="Invalid userId")

    if data["amount"] <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    user = db.users.find_one({"_id": user_id})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 💰 update balance
    db.users.update_one(
        {"_id": user_id},
        {"$inc": {"walletBalance": data["amount"]}}
    )

    # 📒 log transaction
    db.transactions.insert_one({
        "userId": data["userId"],
        "type": "CREDIT",
        "amount": data["amount"],
        "createdAt": datetime.utcnow()
    })

    return {"message": "Money added successfully"}


# ================= GET TRANSACTIONS =================
@router.get("/transactions/{userId}")
def get_transactions(userId: str):

    try:
        user_id = ObjectId(userId)
    except:
        raise HTTPException(status_code=400, detail="Invalid userId")

    txns = list(db.transactions.find({"userId": userId}))

    for t in txns:
        t["_id"] = str(t["_id"])

    return txns