from fastapi import FastAPI
from dotenv import load_dotenv
import os
import threading
import time
from routes import admin



# 🔥 Load environment variables
load_dotenv()

# 🔥 Import routes
from routes import auth, wallet, event, booking

# 🔥 Expiry job
from utils.expiry import release_expired

# 🔥 App init
app = FastAPI(
    title="Ticket Booking System",
    swagger_ui_parameters={"persistAuthorization": True}
)

# ================= CORS FIX (VERY IMPORTANT) =================
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= ROUTES =================
app.include_router(auth.router)
app.include_router(wallet.router)
app.include_router(event.router)
app.include_router(booking.router)
app.include_router(admin.router)
# ================= BACKGROUND EXPIRY =================
def run_expiry():
    while True:
        release_expired()
        time.sleep(60)  # every 1 min

@app.on_event("startup")
def start_background_jobs():
    thread = threading.Thread(target=run_expiry)
    thread.daemon = True
    thread.start()

# ================= HEALTH CHECK =================
@app.get("/")
def home():
    return {"message": "Server Running 🚀"}