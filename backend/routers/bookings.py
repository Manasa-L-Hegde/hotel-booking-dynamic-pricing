import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Booking, Room, Hotel
from backend.schemas import BookingCreate

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.get("")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).order_by(Booking.created_at.desc()).all()
    return {
        "success": True,
        "bookings": [b.to_dict() for b in bookings]
    }

@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    booking_id = f"BK-{uuid.uuid4().hex[:5].upper()}"
    booking = Booking(
        id=booking_id,
        customer=payload.customer,
        hotel=payload.hotel,
        hotel_id=payload.hotelId,
        room=payload.room,
        room_id=payload.roomId,
        dates=payload.dates,
        amount=payload.amount,
        payment=payload.payment or "Pending",
        status=payload.status or "Confirmed"
    )
    db.add(booking)

    # If roomId provided, mark room as unavailable
    if payload.roomId:
        room = db.query(Room).filter(Room.id == payload.roomId).first()
        if room:
            room.is_available = False

    db.commit()
    db.refresh(booking)

    return {
        "success": True,
        "booking": booking.to_dict()
    }
