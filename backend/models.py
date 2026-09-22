import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(30), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(20), default="customer", nullable=False) # 'customer' or 'admin'
    phone_verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "_id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "phoneVerifiedAt": self.phone_verified_at.isoformat() if self.phone_verified_at else None,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }

class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    address = Column(String(255), nullable=False)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    rating = Column(Float, default=0.0, index=True)
    description = Column(Text, nullable=True)
    amenities = Column(JSON, default=list) # list of string tags
    images = Column(JSON, default=list)    # list of image URLs
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    rooms = relationship("Room", back_populates="hotel", cascade="all, delete-orphan", lazy="joined")

    def to_dict(self):
        return {
            "id": self.id,
            "_id": self.id,
            "name": self.name,
            "location": {
                "city": self.city,
                "address": self.address,
                "coordinates": {
                    "lat": self.lat,
                    "lng": self.lng
                }
            },
            "rating": self.rating,
            "description": self.description or "",
            "amenities": self.amenities or [],
            "images": self.images or [],
            "rooms": [r.to_dict() for r in (self.rooms or [])],
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }

class Room(Base):
    __tablename__ = "rooms"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    hotel_id = Column(String(64), ForeignKey("hotels.id", ondelete="CASCADE"), nullable=False, index=True)
    room_number = Column(String(50), nullable=False)
    type = Column(String(50), nullable=False) # Single, Double, Suite, Deluxe
    capacity = Column(Integer, default=2)
    base_price = Column(Float, nullable=False)
    amenities = Column(JSON, default=list)
    images = Column(JSON, default=list)
    is_available = Column(Boolean, default=True)

    hotel = relationship("Hotel", back_populates="rooms")

    def to_dict(self):
        return {
            "id": self.id,
            "_id": self.id,
            "hotelId": self.hotel_id,
            "roomNumber": self.room_number,
            "type": self.type,
            "capacity": self.capacity,
            "basePrice": self.base_price,
            "amenities": self.amenities or [],
            "images": self.images or [],
            "isAvailable": self.is_available,
        }

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    customer = Column(String(100), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    hotel = Column(String(255), nullable=False)
    hotel_id = Column(String(64), nullable=True)
    room = Column(String(100), nullable=False)
    dates = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    payment = Column(String(50), default="Pending") # Paid, Pending, Refunded
    status = Column(String(50), default="Confirmed") # Confirmed, Pending, Cancelled
    created_at = Column(DateTime, default=utc_now)

    def to_dict(self):
        return {
            "id": self.id,
            "_id": self.id,
            "customer": self.customer,
            "hotel": self.hotel,
            "room": self.room,
            "dates": self.dates,
            "amount": self.amount,
            "payment": self.payment,
            "status": self.status,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class LoginActivity(Base):
    __tablename__ = "login_activities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=True, index=True)
    name = Column(String(100), default="")
    email = Column(String(255), default="")
    phone = Column(String(30), default="")
    login_method = Column(String(20), nullable=False, index=True) # 'EMAIL', 'MOBILE_OTP'
    login_time = Column(DateTime, default=utc_now, index=True)
    logout_time = Column(DateTime, nullable=True)
    status = Column(String(20), nullable=False, index=True) # 'SUCCESS', 'FAILED'
    session_id = Column(String(64), index=True, nullable=True)
    ip_address = Column(String(100), default="")
    user_agent = Column(String(500), default="")

    def to_dict(self):
        return {
            "id": self.id,
            "_id": str(self.id),
            "userId": self.user_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "loginMethod": self.login_method,
            "loginTime": self.login_time.isoformat() if self.login_time else None,
            "logoutTime": self.logout_time.isoformat() if self.logout_time else None,
            "status": self.status,
            "sessionId": self.session_id,
            "ipAddress": self.ip_address,
            "userAgent": self.user_agent,
        }

class OtpChallenge(Base):
    __tablename__ = "otp_challenges"

    phone = Column(String(30), primary_key=True, index=True)
    otp_hash = Column(String(128), nullable=False)
    expires_at = Column(DateTime, nullable=False, index=True)
    last_sent_at = Column(DateTime, nullable=False)
    requests_in_window = Column(Integer, default=1)
    request_window_started_at = Column(DateTime, nullable=False)
    attempts = Column(Integer, default=0)
    used_at = Column(DateTime, nullable=True)
