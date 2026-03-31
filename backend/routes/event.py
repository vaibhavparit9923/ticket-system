from fastapi import APIRouter, HTTPException, Depends
from database import db
from bson import ObjectId
from datetime import datetime, timedelta
from utils.auth import get_current_admin

router = APIRouter()

# ================= CREATE EVENT (ADMIN ONLY) =================
@router.post("/admin/create-event")
def create_event(event: dict, admin=Depends(get_current_admin)):

    result = db.events.insert_one(event)

    return {
        "message": "Event created",
        "eventId": str(result.inserted_id)
    }


# ================= CREATE SEATS (ADMIN ONLY) =================
@router.post("/admin/create-seats")
def create_seats(data: dict, admin=Depends(get_current_admin)):

    event = db.events.find_one({"_id": ObjectId(data["eventId"])})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    seats = []

    for i in range(1, data["totalSeats"] + 1):
        seats.append({
            "eventId": data["eventId"],
            "seatNumber": i,
            "status": "AVAILABLE",
            "reservedBy": None,
            "reservedAt": None
        })

    db.seats.insert_many(seats)

    return {"message": "Seats created"}


# ================= VIEW EVENTS =================
@router.get("/events")
def get_events():
    events = list(db.events.find())

    for e in events:
        e["_id"] = str(e["_id"])

    return events


# ================= VIEW SEATS (WITH EXPIRY) =================
@router.get("/seats/{eventId}")
def get_seats(eventId: str):

    seats = list(db.seats.find({"eventId": eventId}))

    updated = []

    for s in seats:

        # ⏳ expiry logic (MANDATORY)
        if s["status"] == "RESERVED" and s.get("reservedAt"):
            if datetime.utcnow() - s["reservedAt"] > timedelta(minutes=5):

                db.seats.update_one(
                    {"_id": s["_id"]},
                    {
                        "$set": {
                            "status": "AVAILABLE",
                            "reservedBy": None,
                            "reservedAt": None
                        }
                    }
                )

                s["status"] = "AVAILABLE"

        s["_id"] = str(s["_id"])
        updated.append(s)

    return updated