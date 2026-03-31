from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

security = HTTPBearer()
SECRET = "secret123"

def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials

        payload = jwt.decode(token, SECRET, algorithms=["HS256"])

        if payload.get("role") != "ADMIN":
            raise Exception()

        return payload

    except:
        raise HTTPException(status_code=403, detail="Admin only")