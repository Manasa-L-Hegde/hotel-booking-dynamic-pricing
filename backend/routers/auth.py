import uuid
import secrets
import hmac
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from backend.config import settings
from backend.database import get_db
from backend.models import User, LoginActivity, OtpChallenge
from backend.schemas import UserRegister, UserLogin, SendOtpRequest, VerifyOtpRequest
from backend.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    normalize_phone,
    hash_otp,
    get_current_user
)
from backend.services.sms_service import send_sms_otp

router = APIRouter(prefix="/api/auth", tags=["Auth"])

def record_activity(
    db: Session,
    request: Request,
    user_id: Optional[str] = None,
    name: str = "",
    email: str = "",
    phone: str = "",
    login_method: str = "EMAIL",
    status_str: str = "SUCCESS",
    session_id: Optional[str] = None
):
    ip_addr = request.client.host if request.client else ""
    user_agent = request.headers.get("user-agent", "")[:500]
    
    activity = LoginActivity(
        user_id=user_id,
        name=name,
        email=email,
        phone=phone,
        login_method=login_method,
        login_time=datetime.now(timezone.utc),
        status=status_str,
        session_id=session_id,
        ip_address=ip_addr,
        user_agent=user_agent
    )
    db.add(activity)
    db.commit()

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if not payload.name or not payload.email or not payload.password or len(payload.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, email, and an 8-character password are required."
        )

    norm_phone = normalize_phone(payload.phone) if payload.phone else None
    if payload.phone and not norm_phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid mobile number. Use +91XXXXXXXXXX."
        )

    # Check if user already exists
    query = db.query(User).filter(
        (User.email == payload.email.lower()) | 
        ((User.phone == norm_phone) if norm_phone else False)
    )
    if query.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already uses this email or mobile number."
        )

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        phone=norm_phone,
        password_hash=hash_password(payload.password),
        role="customer"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "user": user.to_dict()
    }

@router.post("/login")
def login(payload: UserLogin, request: Request, db: Session = Depends(get_db)):
    email_clean = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        record_activity(
            db, request,
            email=email_clean,
            login_method="EMAIL",
            status_str="FAILED"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    session_id = str(uuid.uuid4())
    token = create_access_token({
        "id": user.id,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "sessionId": session_id
    })

    record_activity(
        db, request,
        user_id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone or "",
        login_method="EMAIL",
        status_str="SUCCESS",
        session_id=session_id
    )

    return {
        "success": True,
        "token": token,
        "user": user.to_dict()
    }

@router.post("/send-otp")
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    phone = normalize_phone(payload.phone)
    if not phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid mobile number. Use +91XXXXXXXXXX."
        )

    now = datetime.now(timezone.utc)
    challenge = db.query(OtpChallenge).filter(OtpChallenge.phone == phone).first()

    if challenge and challenge.last_sent_at:
        diff_secs = (now - challenge.last_sent_at.replace(tzinfo=timezone.utc)).total_seconds()
        if diff_secs < 30:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Please wait before requesting another OTP."
            )

    window_expired = (
        not challenge or 
        (now - challenge.request_window_started_at.replace(tzinfo=timezone.utc)).total_seconds() > 3600
    )
    request_count = 1 if window_expired else challenge.requests_in_window + 1
    if request_count > 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP requests. Please try again later."
        )

    otp_code = f"{secrets.randbelow(900000) + 100000}"
    hashed = hash_otp(phone, otp_code)
    expires = now + timedelta(seconds=settings.OTP_EXPIRY_SECONDS)

    if not challenge:
        challenge = OtpChallenge(
            phone=phone,
            otp_hash=hashed,
            expires_at=expires,
            last_sent_at=now,
            request_window_started_at=now,
            requests_in_window=1,
            attempts=0
        )
        db.add(challenge)
    else:
        challenge.otp_hash = hashed
        challenge.expires_at = expires
        challenge.last_sent_at = now
        challenge.requests_in_window = request_count
        challenge.attempts = 0
        challenge.used_at = None
        if window_expired:
            challenge.request_window_started_at = now

    db.commit()

    # Deliver SMS
    send_sms_otp(phone, otp_code)

    return {
        "success": True,
        "message": "OTP prepared in development mock mode; no SMS was delivered." if settings.SMS_PROVIDER == "mock" else "OTP sent successfully.",
        "expiresIn": settings.OTP_EXPIRY_SECONDS
    }

@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpRequest, request: Request, db: Session = Depends(get_db)):
    phone = normalize_phone(payload.phone)
    otp = str(payload.otp or "").strip()

    if not phone or not otp.isdigit() or len(otp) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Enter a valid mobile number and 6-digit OTP."
        )

    challenge = db.query(OtpChallenge).filter(OtpChallenge.phone == phone).first()
    now = datetime.now(timezone.utc)

    if not challenge or challenge.used_at or challenge.expires_at.replace(tzinfo=timezone.utc) <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Request a new one."
        )

    if challenge.attempts >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many OTP attempts. Request a new OTP."
        )

    expected_hash = hash_otp(phone, otp)
    if not hmac.compare_digest(challenge.otp_hash, expected_hash):
        challenge.attempts += 1
        db.commit()
        record_activity(
            db, request,
            phone=phone,
            login_method="MOBILE_OTP",
            status_str="FAILED"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect OTP."
        )

    challenge.used_at = now
    db.commit()

    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        return {
            "success": True,
            "requiresOnboarding": True,
            "message": "Mobile verified. Complete registration to create your account.",
            "phone": phone
        }

    session_id = str(uuid.uuid4())
    token = create_access_token({
        "id": user.id,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
        "sessionId": session_id
    })

    record_activity(
        db, request,
        user_id=user.id,
        name=user.name,
        email=user.email or "",
        phone=phone,
        login_method="MOBILE_OTP",
        status_str="SUCCESS",
        session_id=session_id
    )

    return {
        "success": True,
        "message": "Login successful.",
        "token": token,
        "user": user.to_dict()
    }

@router.post("/logout")
def logout(request: Request, user: Optional[User] = Depends(get_current_user), db: Session = Depends(get_db)):
    auth_header = request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        from backend.services.auth_service import decode_access_token
        payload = decode_access_token(token)
        if payload and "sessionId" in payload:
            session_id = payload["sessionId"]
            db.query(LoginActivity).filter(
                LoginActivity.session_id == session_id,
                LoginActivity.logout_time == None
            ).update({"logout_time": datetime.now(timezone.utc)})
            db.commit()

    return {"success": True}

@router.get("/me")
def get_me(user: Optional[User] = Depends(get_current_user)):
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return {"success": True, "user": user.to_dict()}
