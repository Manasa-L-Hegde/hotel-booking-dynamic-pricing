from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Hotel, Room
from backend.schemas import PricePredictionRequest, RoomPricePredictionRequest
from backend.services.pricing_service import predict_dynamic_price

router = APIRouter(prefix="/api/pricing", tags=["Pricing"])

@router.post("/predict")
def predict_price(payload: PricePredictionRequest):
    dynamic_price = predict_dynamic_price(
        base_price=payload.basePrice,
        demand=payload.demand,
        occupancy=payload.occupancy,
        weekend=payload.weekend,
        season=payload.season,
        lead_days=payload.leadDays,
        rating=payload.rating
    )
    return {
        "success": True,
        "basePrice": payload.basePrice,
        "dynamicPrice": dynamic_price
    }

@router.post("/predict-room")
def predict_room_price(payload: RoomPricePredictionRequest, db: Session = Depends(get_db)):
    hotel = db.query(Hotel).filter(Hotel.id == payload.hotelId).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found.")

    target_room = None
    for r in hotel.rooms:
        if r.room_number == payload.roomNumber:
            target_room = r
            break

    if not target_room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found.")

    # Calculate occupancy & demand
    total_rooms = len(hotel.rooms)
    available_rooms = sum(1 for r in hotel.rooms if r.is_available)
    occupied_rooms = total_rooms - available_rooms
    occupancy = (occupied_rooms / total_rooms * 100) if total_rooms > 0 else 0.0
    demand = occupancy

    # Parse check-in date
    try:
        check_in = datetime.fromisoformat(payload.checkInDate.replace("Z", "+00:00"))
    except Exception:
        try:
            check_in = datetime.strptime(payload.checkInDate, "%Y-%m-%d")
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid check-in date.")

    today = datetime.now(timezone.utc)
    if check_in.tzinfo is None:
        check_in = check_in.replace(tzinfo=timezone.utc)

    lead_days = max(0, (check_in.date() - today.date()).days)
    weekend = 1 if check_in.weekday() in (5, 6) else 0

    month = check_in.month
    if month in (4, 5, 6):
        season = 2 # Peak
    elif month in (11, 12, 1):
        season = 1 # Normal
    else:
        season = 0 # Off-season

    dynamic_price = predict_dynamic_price(
        base_price=target_room.base_price,
        demand=demand,
        occupancy=occupancy,
        weekend=weekend,
        season=season,
        lead_days=lead_days,
        rating=hotel.rating
    )

    return {
        "success": True,
        "hotel": hotel.name,
        "room": {
            "roomNumber": target_room.room_number,
            "type": target_room.type
        },
        "pricing": {
            "basePrice": target_room.base_price,
            "dynamicPrice": dynamic_price
        },
        "factors": {
            "demand": round(demand),
            "occupancy": round(occupancy),
            "weekend": weekend,
            "season": season,
            "leadDays": lead_days,
            "rating": hotel.rating
        }
    }

@router.get("")
def get_pricing_overview(db: Session = Depends(get_db)):
    hotels = db.query(Hotel).all()
    pricing_list = []
    
    for h in hotels:
        total = len(h.rooms)
        occupied = sum(1 for r in h.rooms if not r.is_available)
        occ_rate = round((occupied / total * 100) if total > 0 else 50.0)
        demand_label = "High" if occ_rate >= 75 else "Medium" if occ_rate >= 40 else "Low"

        for r in h.rooms:
            dyn = predict_dynamic_price(
                base_price=r.base_price,
                demand=occ_rate,
                occupancy=occ_rate,
                weekend=0,
                season=1,
                lead_days=7,
                rating=h.rating
            )
            pricing_list.append({
                "hotel": h.name,
                "room": f"{r.type} · {r.room_number}",
                "base": r.base_price,
                "dynamic": dyn,
                "demand": demand_label,
                "occupancy": occ_rate,
                "status": "Active" if r.is_available else "Booked"
            })

    return {
        "success": True,
        "pricing": pricing_list
    }
