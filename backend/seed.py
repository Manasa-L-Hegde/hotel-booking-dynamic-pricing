import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import logging
from backend.database import engine, SessionLocal, Base
from backend.models import User, Hotel, Room, Booking, LoginActivity
from backend.config import settings
from backend.services.auth_service import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smartstay.seed")

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed Admin User
        admin_email = settings.ADMIN_EMAIL.lower().strip()
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            logger.info(f"Creating default admin user: {admin_email}")
            admin = User(
                name=settings.ADMIN_NAME,
                email=admin_email,
                phone="+919876543210",
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role="admin"
            )
            db.add(admin)
            db.commit()
            logger.info("Admin user created successfully.")
        else:
            logger.info("Admin user already exists.")

        # 2. Seed Initial Hotels and Rooms if none exist
        hotel_count = db.query(Hotel).count()
        if hotel_count == 0:
            logger.info("Seeding initial hotels and rooms...")
            hotels_data = [
                {
                    "id": "grand-orchid",
                    "name": "Grand Orchid Hotel",
                    "city": "Mumbai",
                    "address": "123 Marine Drive, Colaba",
                    "lat": 18.9217,
                    "lng": 72.8332,
                    "rating": 4.7,
                    "amenities": ["Pool", "Spa", "Breakfast", "Wi-Fi", "Restaurant", "Gym"],
                    "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"],
                    "description": "A serene coastal stay with city views, thoughtful service, and spacious rooms.",
                    "rooms": [
                        {"id": "g1", "room_number": "301", "type": "Deluxe", "capacity": 2, "base_price": 4800, "is_available": True, "amenities": ["Wi-Fi", "Minibar", "Ocean-view"]},
                        {"id": "g2", "room_number": "401", "type": "Suite", "capacity": 3, "base_price": 7900, "is_available": True, "amenities": ["Wi-Fi", "Jacuzzi", "King-bed"]}
                    ]
                },
                {
                    "id": "terrace-house",
                    "name": "The Terrace House",
                    "city": "Bengaluru",
                    "address": "Indiranagar 100ft Road",
                    "lat": 12.9716,
                    "lng": 77.5946,
                    "rating": 4.5,
                    "amenities": ["Gym", "Restaurant", "Wi-Fi", "Parking"],
                    "images": ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"],
                    "description": "Contemporary rooms in the heart of Bengaluru, designed for business and leisure.",
                    "rooms": [
                        {"id": "t1", "room_number": "204", "type": "Double", "capacity": 2, "base_price": 3200, "is_available": True, "amenities": ["Wi-Fi", "Desk"]},
                        {"id": "t2", "room_number": "508", "type": "Deluxe", "capacity": 2, "base_price": 4200, "is_available": False, "amenities": ["Balcony", "Minibar"]}
                    ]
                },
                {
                    "id": "saffron-retreat",
                    "name": "Saffron Retreat",
                    "city": "Jaipur",
                    "address": "Amer Road, Near Jal Mahal",
                    "lat": 26.9124,
                    "lng": 75.7873,
                    "rating": 4.8,
                    "amenities": ["Pool", "Parking", "Restaurant", "Breakfast", "Heritage Walk"],
                    "images": ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"],
                    "description": "A warm, heritage-inspired escape close to Jaipur's most celebrated sights.",
                    "rooms": [
                        {"id": "s1", "room_number": "112", "type": "Single", "capacity": 1, "base_price": 2800, "is_available": True, "amenities": ["Wi-Fi", "Courtyard-view"]},
                        {"id": "s2", "room_number": "206", "type": "Suite", "capacity": 4, "base_price": 6800, "is_available": True, "amenities": ["Private Terrace", "Bathtub"]}
                    ]
                }
            ]

            for hdata in hotels_data:
                rooms_list = hdata.pop("rooms")
                hotel = Hotel(**hdata)
                db.add(hotel)
                db.flush()

                for rdata in rooms_list:
                    room = Room(hotel_id=hotel.id, **rdata)
                    db.add(room)

            db.commit()
            logger.info("Hotels and rooms seeded successfully.")

        # 3. Seed Initial Bookings if none exist
        if db.query(Booking).count() == 0:
            logger.info("Seeding initial bookings...")
            bookings_data = [
                {"id": "BK-10482", "customer": "Aarav Sharma", "hotel": "Grand Orchid Hotel", "room": "Deluxe · 301", "dates": "18–21 Sep", "amount": 17280, "payment": "Paid", "status": "Confirmed"},
                {"id": "BK-10481", "customer": "Meera Iyer", "hotel": "The Terrace House", "room": "Double · 204", "dates": "19–20 Sep", "amount": 3840, "payment": "Pending", "status": "Pending"},
                {"id": "BK-10480", "customer": "Kabir Singh", "hotel": "Saffron Retreat", "room": "Suite · 206", "dates": "22–25 Sep", "amount": 24480, "payment": "Paid", "status": "Confirmed"},
                {"id": "BK-10479", "customer": "Nisha Patel", "hotel": "Grand Orchid Hotel", "room": "Suite · 401", "dates": "17–18 Sep", "amount": 9480, "payment": "Refunded", "status": "Cancelled"},
            ]
            for b in bookings_data:
                db.add(Booking(**b))
            db.commit()
            logger.info("Bookings seeded successfully.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
