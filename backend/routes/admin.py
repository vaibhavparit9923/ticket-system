from fastapi import APIRouter, HTTPException, Depends
from database import db
from bson import ObjectId
from datetime import datetime
from utils.auth import get_current_admin

router = APIRouter()

# ================= GET ALL BOOKINGS =================
@router.get("/admin/bookings")
def get_all_bookings(admin=Depends(get_current_admin)):

    bookings = list(db.bookings.find())

    for b in bookings:
        b["_id"] = str(b["_id"])

    return bookings


# ================= GET ALL TRANSACTIONS =================
@router.get("/admin/transactions")
def get_all_transactions(admin=Depends(get_current_admin)):

    txns = list(db.transactions.find())

    for t in txns:
        t["_id"] = str(t["_id"])

    return txns


# ================= CANCEL BOOKING + REFUND =================
@router.post("/admin/cancel-booking")
def cancel_booking(data: dict, admin=Depends(get_current_admin)):

    booking = db.bookings.find_one({"_id": ObjectId(data["bookingId"])})

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking["status"] == "CANCELLED":
        raise HTTPException(status_code=400, detail="Already cancelled")

    # 💰 Refund wallet
    db.users.update_one(
        {"_id": ObjectId(booking["userId"])},
        {"$inc": {"walletBalance": booking["amount"]}}
    )

    # 📒 Transaction log
    db.transactions.insert_one({
        "userId": booking["userId"],
        "type": "REFUND",
        "amount": booking["amount"],
        "createdAt": datetime.utcnow()
    })

    # 🎟 Update seats back to AVAILABLE
    db.seats.update_many(
        {"_id": {"$in": [ObjectId(id) for id in booking["seatIds"]]}},
        {
            "$set": {
                "status": "AVAILABLE",
                "reservedBy": None,
                "reservedAt": None
            }
        }
    )

    # ❌ Mark booking cancelled
    db.bookings.update_one(
        {"_id": ObjectId(data["bookingId"])},
        {"$set": {"status": "CANCELLED"}}
    )

    return {"message": "Booking cancelled & refunded"}