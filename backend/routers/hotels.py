import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Hotel, Room
from backend.schemas import HotelCreate, HotelUpdate, RoomCreate, RoomUpdate
from backend.services.auth_service import require_admin

router = APIRouter(prefix="/api/hotels", tags=["Hotels"])

@router.post("", status_code=status.HTTP_201_CREATED)
def create_hotel(
    payload: HotelCreate,
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    if not payload.name or not payload.location or not payload.location.city or not payload.location.address:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="name, location.city, and location.address are required."
        )

    coords = payload.location.coordinates
    hotel_id = str(uuid.uuid4())
    hotel = Hotel(
        id=hotel_id,
        name=payload.name.strip(),
        city=payload.location.city.strip(),
        address=payload.location.address.strip(),
        lat=coords.lat if coords else None,
        lng=coords.lng if coords else None,
        rating=payload.rating or 0.0,
        description=payload.description or "",
        amenities=payload.amenities or [],
        images=payload.images or []
    )
    db.add(hotel)
    db.flush()

    if payload.rooms:
        for r in payload.rooms:
            room = Room(
                id=str(uuid.uuid4()),
                hotel_id=hotel.id,
                room_number=r.roomNumber,
                type=r.type,
                capacity=r.capacity,
                base_price=r.basePrice,
                amenities=r.amenities or [],
                images=r.images or [],
                is_available=r.isAvailable
            )
            db.add(room)

    db.commit()
    db.refresh(hotel)
    return {"success": True, "hotel": hotel.to_dict()}

@router.get("")
def get_hotels(
    city: Optional[str] = None,
    minPrice: Optional[float] = None,
    maxPrice: Optional[float] = None,
    rating: Optional[float] = None,
    amenities: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Hotel)

    if city:
        query = query.filter(Hotel.city.ilike(f"%{city.strip()}%"))

    if rating is not None:
        query = query.filter(Hotel.rating >= rating)

    hotels = query.all()
    filtered_hotels = []

    amenity_list = [a.strip().lower() for a in amenities.split(",")] if amenities else []

    for h in hotels:
        # Amenity filtering (must match all)
        if amenity_list:
            hotel_amenities = [str(a).lower() for a in (h.amenities or [])]
            if not all(a in hotel_amenities for a in amenity_list):
                continue

        # Price filtering against rooms
        if minPrice is not None or maxPrice is not None:
            rooms = h.rooms or []
            matches_price = False
            for r in rooms:
                price_ok = True
                if minPrice is not None and r.base_price < minPrice:
                    price_ok = False
                if maxPrice is not None and r.base_price > maxPrice:
                    price_ok = False
                if price_ok:
                    matches_price = True
                    break
            if not matches_price:
                continue

        filtered_hotels.append(h.to_dict())

    return {
        "success": True,
        "count": len(filtered_hotels),
        "hotels": filtered_hotels
    }

@router.get("/{hotel_id}")
def get_hotel_by_id(hotel_id: str, db: Session = Depends(get_db)):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found.")
    return {"success": True, "hotel": hotel.to_dict()}

@router.put("/{hotel_id}")
def update_hotel(
    hotel_id: str,
    payload: HotelUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found.")

    if payload.name is not None:
        hotel.name = payload.name.strip()
    if payload.location is not None:
        hotel.city = payload.location.city.strip()
        hotel.address = payload.location.address.strip()
        if payload.location.coordinates:
            hotel.lat = payload.location.coordinates.lat
            hotel.lng = payload.location.coordinates.lng
    if payload.rating is not None:
        hotel.rating = payload.rating
    if payload.description is not None:
        hotel.description = payload.description
    if payload.amenities is not None:
        hotel.amenities = payload.amenities
    if payload.images is not None:
        hotel.images = payload.images

    db.commit()
    db.refresh(hotel)
    return {"success": True, "hotel": hotel.to_dict()}

@router.delete("/{hotel_id}")
def delete_hotel(
    hotel_id: str,
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found.")
    db.delete(hotel)
    db.commit()
    return {"success": True, "message": "Hotel deleted successfully."}

# -----------------------------------------------------------------------------
# Rooms Sub-routes
# -----------------------------------------------------------------------------

VALID_ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe"]

@router.post("/{hotel_id}/rooms", status_code=status.HTTP_201_CREATED)
def add_room(
    hotel_id: str,
    payload: RoomCreate,
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    if not hotel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hotel not found.")

    if payload.type not in VALID_ROOM_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Invalid room type "{payload.type}". Choose from: Single, Double, Suite, Deluxe'
        )

    room = Room(
        id=str(uuid.uuid4()),
        hotel_id=hotel_id,
        room_number=payload.roomNumber,
        type=payload.type,
        capacity=payload.capacity,
        base_price=payload.basePrice,
        amenities=payload.amenities or [],
        images=payload.images or [],
        is_available=payload.isAvailable
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return {"success": True, "room": room.to_dict()}

@router.put("/{hotel_id}/rooms/{room_id}")
def update_room(
    hotel_id: str,
    room_id: str,
    payload: RoomUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    room = db.query(Room).filter(Room.id == room_id, Room.hotel_id == hotel_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found.")

    if payload.type is not None:
        if payload.type not in VALID_ROOM_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Invalid room type "{payload.type}". Choose from: Single, Double, Suite, Deluxe'
            )
        room.type = payload.type

    if payload.roomNumber is not None:
        room.room_number = payload.roomNumber
    if payload.capacity is not None:
        room.capacity = payload.capacity
    if payload.basePrice is not None:
        room.base_price = payload.basePrice
    if payload.amenities is not None:
        room.amenities = payload.amenities
    if payload.images is not None:
        room.images = payload.images
    if payload.isAvailable is not None:
        room.is_available = payload.isAvailable

    db.commit()
    db.refresh(room)
    return {"success": True, "room": room.to_dict()}

@router.get("/{hotel_id}/rooms/{room_id}/availability")
def check_room_availability(hotel_id: str, room_id: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.id == room_id, Room.hotel_id == hotel_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found.")

    return {
        "success": True,
        "hotelId": hotel_id,
        "roomId": room.id,
        "roomNumber": room.room_number,
        "type": room.type,
        "isAvailable": room.is_available
    }

@router.delete("/{hotel_id}/rooms/{room_id}")
def delete_room(
    hotel_id: str,
    room_id: str,
    db: Session = Depends(get_db),
    _admin = Depends(require_admin)
):
    room = db.query(Room).filter(Room.id == room_id, Room.hotel_id == hotel_id).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found.")
    db.delete(room)
    db.commit()
    return {"success": True, "message": "Room deleted successfully."}
