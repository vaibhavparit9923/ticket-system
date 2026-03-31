from pymongo import MongoClient

# 🔥 Direct MongoDB connection (no .env dependency)
client = MongoClient("mongodb://localhost:27017")

# 🔥 Database
db = client["ticket_system"]

# 🔥 Connection test
try:
    client.admin.command("ping")
    print("✅ MongoDB Connected")
except Exception as e:
    print("❌ MongoDB Connection Failed:", e)