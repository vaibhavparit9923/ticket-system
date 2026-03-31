from database import db
from datetime import datetime, timedelta

def release_expired():

    expiry_time = datetime.utcnow() - timedelta(minutes=5)

    result = db.seats.update_many(
        {
            "status": "RESERVED",
            "reservedAt": {"$lt": expiry_time}
        },
        {
            "$set": {
                "status": "AVAILABLE",
                "reservedBy": None,
                "reservedAt": None
            }
        }
    )

    print(f"Expired seats released: {result.modified_count}")