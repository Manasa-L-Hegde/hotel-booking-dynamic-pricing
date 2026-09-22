from typing import Optional, List, Any
from pydantic import BaseModel, Field

# -----------------------------------------------------------------------------
# Auth Schemas
# -----------------------------------------------------------------------------

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class SendOtpRequest(BaseModel):
    phone: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str

# -----------------------------------------------------------------------------
# Hotel & Room Schemas
# -----------------------------------------------------------------------------

class Coordinates(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None

class Location(BaseModel):
    city: str
    address: str
    coordinates: Optional[Coordinates] = None

class RoomCreate(BaseModel):
    roomNumber: str
    type: str # Single, Double, Suite, Deluxe
    capacity: int = 2
    basePrice: float
    amenities: Optional[List[str]] = []
    images: Optional[List[str]] = []
    isAvailable: bool = True

class RoomUpdate(BaseModel):
    roomNumber: Optional[str] = None
    type: Optional[str] = None
    capacity: Optional[int] = None
    basePrice: Optional[float] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None
    isAvailable: Optional[bool] = None

class HotelCreate(BaseModel):
    name: str
    location: Location
    rating: Optional[float] = 0.0
    description: Optional[str] = ""
    amenities: Optional[List[str]] = []
    images: Optional[List[str]] = []
    rooms: Optional[List[RoomCreate]] = []

class HotelUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[Location] = None
    rating: Optional[float] = None
    description: Optional[str] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None

# -----------------------------------------------------------------------------
# Booking Schemas
# -----------------------------------------------------------------------------

class BookingCreate(BaseModel):
    customer: str
    hotel: str
    hotelId: Optional[str] = None
    room: str
    roomId: Optional[str] = None
    dates: str
    amount: float
    payment: Optional[str] = "Pending"
    status: Optional[str] = "Confirmed"

# -----------------------------------------------------------------------------
# Pricing Schemas
# -----------------------------------------------------------------------------

class PricePredictionRequest(BaseModel):
    basePrice: float
    demand: float
    occupancy: float
    weekend: int
    season: int
    leadDays: int
    rating: float

class RoomPricePredictionRequest(BaseModel):
    hotelId: str
    roomNumber: str
    checkInDate: str
