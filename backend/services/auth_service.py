import re
import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from backend.config import settings
from backend.database import get_db
from backend.models import User

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_EXPIRY_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except Exception:
        return None

def normalize_phone(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    compact = re.sub(r"[\s()-]", "", str(value))
    if re.match(r"^\+91[6-9]\d{9}$", compact):
        return compact
    if re.match(r"^[6-9]\d{9}$", compact):
        return f"+91{compact}"
    return None

def hash_otp(phone: str, otp: str) -> str:
    key = (settings.OTP_HASH_SECRET or settings.JWT_SECRET).encode("utf-8")
    msg = f"{phone}:{otp}".encode("utf-8")
    return hmac.new(key, msg, hashlib.sha256).hexdigest()

def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "id" not in payload:
        return None
    user = db.query(User).filter(User.id == payload["id"]).first()
    return user

def require_auth(user: Optional[User] = Depends(get_current_user)) -> User:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access denied. No token provided or session expired."
        )
    return user

def require_admin(user: User = Depends(require_auth)) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required."
        )
    return user
