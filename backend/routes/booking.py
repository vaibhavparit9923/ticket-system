from fastapi import APIRouter, HTTPException
from database import db, client
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

# ================= RESERVE SEAT =================
@router.post("/reserve")
def reserve(data: dict):

    seat = db.seats.find_one_and_update(
        {
            "_id": ObjectId(data["seatId"]),
            "status": "AVAILABLE"
        },
        {
            "$set": {
                "status": "RESERVED",
                "reservedBy": data["userId"],
                "reservedAt": datetime.utcnow()
            }
        }
    )

    if not seat:
        raise HTTPException(status_code=400, detail="Seat already reserved/booked")

    return {"message": "Seat reserved"}


# ================= BOOK SEATS (ATOMIC 🔥) =================
@router.post("/book")
def book(data: dict):

    with client.start_session() as session:
        with session.start_transaction():

            user = db.users.find_one(
                {"_id": ObjectId(data["userId"])},
                session=session
            )

            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            if user["walletBalance"] < data["amount"]:
                raise HTTPException(status_code=400, detail="Insufficient balance")

            seat_ids = [ObjectId(id) for id in data["seatIds"]]

            seats = list(db.seats.find(
                {"_id": {"$in": seat_ids}},
                session=session
            ))

            # 🔥 VALIDATION (IMPORTANT)
            for seat in seats:

                # reserved check
                if seat["status"] != "RESERVED":
                    raise HTTPException(status_code=400, detail="Seat not reserved")

                # reserved by same user
                if seat["reservedBy"] != data["userId"]:
                    raise HTTPException(status_code=400, detail="Seat reserved by another user")

                # ⏳ expiry check
                if datetime.utcnow() - seat["reservedAt"] > timedelta(minutes=5):
                    raise HTTPException(status_code=400, detail="Reservation expired")

            # 💰 Deduct wallet
            db.users.update_one(
                {"_id": ObjectId(data["userId"])},
                {"$inc": {"walletBalance": -data["amount"]}},
                session=session
            )

            # 📒 Transaction log
            db.transactions.insert_one({
                "userId": data["userId"],
                "type": "DEBIT",
                "amount": data["amount"],
                "createdAt": datetime.utcnow()
            }, session=session)

            # 🎟 Update seats
            db.seats.update_many(
                {"_id": {"$in": seat_ids}},
                {
                    "$set": {
                        "status": "BOOKED",
                        "reservedBy": None,
                        "reservedAt": None
                    }
                },
                session=session
            )

            # 📦 Create booking
            db.bookings.insert_one({
                "userId": data["userId"],
                "seatIds": data["seatIds"],
                "amount": data["amount"],
                "status": "CONFIRMED",
                "createdAt": datetime.utcnow()
            }, session=session)

    return {"message": "Booking successful"}


# ================= GET BOOKINGS =================
@router.get("/bookings/{userId}")
def get_bookings(userId: str):

    bookings = list(db.bookings.find({"userId": userId}))

    for b in bookings:
        b["_id"] = str(b["_id"])

    return bookings