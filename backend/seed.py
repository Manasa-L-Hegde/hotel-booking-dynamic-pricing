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

ALL_HOTELS_DATA = [
    {
        "id": "grand-orchid",
        "name": "Grand Orchid Hotel",
        "city": "Mumbai",
        "address": "123 Marine Drive, Colaba",
        "lat": 18.9217,
        "lng": 72.8332,
        "rating": 4.8,
        "amenities": ["Pool", "Spa", "Breakfast", "Wi-Fi", "Restaurant", "Gym", "Sea View"],
        "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"],
        "description": "A serene luxury coastal stay with panoramic Arabian Sea views, infinity pool, and fine dining.",
        "rooms": [
            {"id": "m1", "room_number": "101", "type": "Single", "capacity": 1, "base_price": 2800, "is_available": True, "amenities": ["Wi-Fi", "City View"]},
            {"id": "m2", "room_number": "205", "type": "Double", "capacity": 2, "base_price": 3800, "is_available": True, "amenities": ["Wi-Fi", "Balcony"]},
            {"id": "g1", "room_number": "301", "type": "Deluxe", "capacity": 2, "base_price": 4800, "is_available": True, "amenities": ["Wi-Fi", "Minibar", "Ocean-view"]},
            {"id": "g2", "room_number": "401", "type": "Suite", "capacity": 3, "base_price": 7900, "is_available": True, "amenities": ["Wi-Fi", "Jacuzzi", "King-bed"]}
        ]
    },
    {
        "id": "sea-breeze",
        "name": "Sea Breeze Palms Residency",
        "city": "Mumbai",
        "address": "Juhu Tara Road, Juhu Beach",
        "lat": 19.0988,
        "lng": 72.8264,
        "rating": 4.6,
        "amenities": ["Wi-Fi", "Breakfast", "Pool", "Restaurant", "Beach Access"],
        "images": ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"],
        "description": "Direct beach access resort in Juhu with lush coconut palms and tranquil sea breezes.",
        "rooms": [
            {"id": "sb1", "room_number": "102", "type": "Single", "capacity": 1, "base_price": 2600, "is_available": True, "amenities": ["Wi-Fi", "Air Conditioning"]},
            {"id": "sb2", "room_number": "202", "type": "Double", "capacity": 2, "base_price": 3500, "is_available": True, "amenities": ["Wi-Fi", "Pool View"]},
            {"id": "sb3", "room_number": "304", "type": "Deluxe", "capacity": 2, "base_price": 4600, "is_available": True, "amenities": ["Sea View", "Balcony"]},
            {"id": "sb4", "room_number": "405", "type": "Suite", "capacity": 4, "base_price": 7200, "is_available": True, "amenities": ["Private Lounge", "Jacuzzi"]}
        ]
    },
    {
        "id": "imperial-haven",
        "name": "The Imperial Haven",
        "city": "Delhi",
        "address": "Janpath, Connaught Place",
        "lat": 28.6289,
        "lng": 77.2185,
        "rating": 4.9,
        "amenities": ["Pool", "Spa", "Fine Dining", "Wi-Fi", "Gym", "Valet Parking"],
        "images": ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"],
        "description": "Colonial heritage elegance meeting modern 5-star luxury in the beating heart of New Delhi.",
        "rooms": [
            {"id": "del1", "room_number": "101", "type": "Single", "capacity": 1, "base_price": 3200, "is_available": True, "amenities": ["Wi-Fi", "Desk"]},
            {"id": "del2", "room_number": "204", "type": "Double", "capacity": 2, "base_price": 4500, "is_available": True, "amenities": ["Wi-Fi", "Courtyard View"]},
            {"id": "del3", "room_number": "308", "type": "Deluxe", "capacity": 2, "base_price": 5800, "is_available": True, "amenities": ["Mini Bar", "Marble Bath"]},
            {"id": "del4", "room_number": "501", "type": "Suite", "capacity": 3, "base_price": 9500, "is_available": True, "amenities": ["Butler Service", "Living Room"]}
        ]
    },
    {
        "id": "heritage-haveli",
        "name": "Heritage Haveli Residency",
        "city": "Delhi",
        "address": "Chandni Chowk, Old Delhi",
        "lat": 28.6507,
        "lng": 77.2334,
        "rating": 4.5,
        "amenities": ["Breakfast", "Rooftop Cafe", "Wi-Fi", "Cultural Tours"],
        "images": ["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80"],
        "description": "Restored 19th-century Mughal courtyard haveli offering unforgettable charm and culinary delights.",
        "rooms": [
            {"id": "hh1", "room_number": "103", "type": "Single", "capacity": 1, "base_price": 2200, "is_available": True, "amenities": ["Wi-Fi", "Classic Decor"]},
            {"id": "hh2", "room_number": "201", "type": "Double", "capacity": 2, "base_price": 3100, "is_available": True, "amenities": ["Courtyard View"]},
            {"id": "hh3", "room_number": "302", "type": "Deluxe", "capacity": 2, "base_price": 4200, "is_available": True, "amenities": ["Balcony", "Antique Bed"]},
            {"id": "hh4", "room_number": "402", "type": "Suite", "capacity": 4, "base_price": 6500, "is_available": True, "amenities": ["Rooftop Access", "Suite"]}
        ]
    },
    {
        "id": "terrace-house",
        "name": "The Terrace House",
        "city": "Bengaluru",
        "address": "Indiranagar 100ft Road",
        "lat": 12.9716,
        "lng": 77.5946,
        "rating": 4.6,
        "amenities": ["Gym", "Restaurant", "Wi-Fi", "Parking", "Bar"],
        "images": ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"],
        "description": "Contemporary boutique hotel in vibrant Indiranagar, surrounded by premier cafes and tech hubs.",
        "rooms": [
            {"id": "t0", "room_number": "105", "type": "Single", "capacity": 1, "base_price": 2400, "is_available": True, "amenities": ["Wi-Fi", "Smart TV"]},
            {"id": "t1", "room_number": "204", "type": "Double", "capacity": 2, "base_price": 3200, "is_available": True, "amenities": ["Wi-Fi", "Desk"]},
            {"id": "t2", "room_number": "508", "type": "Deluxe", "capacity": 2, "base_price": 4200, "is_available": True, "amenities": ["Balcony", "Minibar"]},
            {"id": "t3", "room_number": "601", "type": "Suite", "capacity": 3, "base_price": 6800, "is_available": True, "amenities": ["Terrace", "Espresso Bar"]}
        ]
    },
    {
        "id": "techpark-suites",
        "name": "TechPark Silicon Suites",
        "city": "Bengaluru",
        "address": "ITPL Main Road, Whitefield",
        "lat": 12.9698,
        "lng": 77.7499,
        "rating": 4.7,
        "amenities": ["High-speed Wi-Fi", "Pool", "Fitness Center", "Coworking Lounge", "Breakfast"],
        "images": ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"],
        "description": "Sleek, business-ready executive hotel equipped with high-speed fiber internet and ergonomic suites.",
        "rooms": [
            {"id": "tp1", "room_number": "201", "type": "Single", "capacity": 1, "base_price": 2500, "is_available": True, "amenities": ["Ergonomic Chair", "Gigabit Wi-Fi"]},
            {"id": "tp2", "room_number": "305", "type": "Double", "capacity": 2, "base_price": 3600, "is_available": True, "amenities": ["King Bed", "Smart Desk"]},
            {"id": "tp3", "room_number": "408", "type": "Deluxe", "capacity": 2, "base_price": 4900, "is_available": True, "amenities": ["Lounge Access", "City View"]},
            {"id": "tp4", "room_number": "702", "type": "Suite", "capacity": 3, "base_price": 7500, "is_available": True, "amenities": ["Meeting Room", "Terrace"]}
        ]
    },
    {
        "id": "azure-bay-goa",
        "name": "Azure Bay Beach Resort",
        "city": "Goa",
        "address": "Calangute - Baga Road, North Goa",
        "lat": 15.5439,
        "lng": 73.7553,
        "rating": 4.8,
        "amenities": ["Beachfront", "Infinity Pool", "Spa", "Bar", "Breakfast", "Wi-Fi"],
        "images": ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"],
        "description": "Sun-kissed tropical paradise steps away from Calangute beach with swim-up bar and sea-facing sundecks.",
        "rooms": [
            {"id": "goa1", "room_number": "101", "type": "Single", "capacity": 1, "base_price": 2900, "is_available": True, "amenities": ["Garden View", "Patio"]},
            {"id": "goa2", "room_number": "202", "type": "Double", "capacity": 2, "base_price": 4200, "is_available": True, "amenities": ["Poolside", "Wi-Fi"]},
            {"id": "goa3", "room_number": "304", "type": "Deluxe", "capacity": 2, "base_price": 5600, "is_available": True, "amenities": ["Ocean View", "Balcony"]},
            {"id": "goa4", "room_number": "401", "type": "Suite", "capacity": 4, "base_price": 8800, "is_available": True, "amenities": ["Private Plunge Pool", "Bathtub"]}
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
        "amenities": ["Pool", "Parking", "Restaurant", "Breakfast", "Heritage Walk", "Wi-Fi"],
        "images": ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"],
        "description": "A warm, heritage-inspired escape close to Jaipur's most celebrated sights.",
        "rooms": [
            {"id": "s1", "room_number": "112", "type": "Single", "capacity": 1, "base_price": 2800, "is_available": True, "amenities": ["Wi-Fi", "Courtyard-view"]},
            {"id": "s2", "room_number": "201", "type": "Double", "capacity": 2, "base_price": 3700, "is_available": True, "amenities": ["Garden View"]},
            {"id": "s3", "room_number": "206", "type": "Suite", "capacity": 4, "base_price": 6800, "is_available": True, "amenities": ["Private Terrace", "Bathtub"]},
            {"id": "s4", "room_number": "304", "type": "Deluxe", "capacity": 2, "base_price": 4800, "is_available": True, "amenities": ["Heritage Balcony"]}
        ]
    },
    {
        "id": "royal-rajputana",
        "name": "Royal Rajputana Palace",
        "city": "Jaipur",
        "address": "Prithviraj Road, C-Scheme",
        "lat": 26.9038,
        "lng": 75.7997,
        "rating": 4.9,
        "amenities": ["Palace Gardens", "Pool", "Fine Dining", "Spa", "Wi-Fi", "Cultural Shows"],
        "images": ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"],
        "description": "Regal hospitality with hand-painted frescoes, lush royal lawns, and authentic Rajasthani royal feasts.",
        "rooms": [
            {"id": "rr1", "room_number": "102", "type": "Single", "capacity": 1, "base_price": 3400, "is_available": True, "amenities": ["Royal Canopy Bed"]},
            {"id": "rr2", "room_number": "205", "type": "Double", "capacity": 2, "base_price": 4800, "is_available": True, "amenities": ["Fountain View"]},
            {"id": "rr3", "room_number": "310", "type": "Deluxe", "capacity": 2, "base_price": 6200, "is_available": True, "amenities": ["Jharokha Balcony"]},
            {"id": "rr4", "room_number": "501", "type": "Suite", "capacity": 4, "base_price": 11000, "is_available": True, "amenities": ["Maharaja Suite", "Jacuzzi"]}
        ]
    },
    {
        "id": "backwater-whisper",
        "name": "Backwater Whisper Resort",
        "city": "Kochi",
        "address": "Vembanad Backwaters, Fort Kochi",
        "lat": 9.9312,
        "lng": 76.2673,
        "rating": 4.9,
        "amenities": ["Backwater Cruise", "Ayurvedic Spa", "Pool", "Breakfast", "Wi-Fi"],
        "images": ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80"],
        "description": "Tranquil Ayurvedic wellness sanctuary sitting directly on Kerala's serene palm-fringed backwaters.",
        "rooms": [
            {"id": "koc1", "room_number": "104", "type": "Single", "capacity": 1, "base_price": 2600, "is_available": True, "amenities": ["Ayurvedic Herb Garden"]},
            {"id": "koc2", "room_number": "202", "type": "Double", "capacity": 2, "base_price": 3900, "is_available": True, "amenities": ["Waterfront View"]},
            {"id": "koc3", "room_number": "301", "type": "Deluxe", "capacity": 2, "base_price": 5300, "is_available": True, "amenities": ["Private Deck"]},
            {"id": "koc4", "room_number": "405", "type": "Suite", "capacity": 4, "base_price": 8900, "is_available": True, "amenities": ["Houseboat Suite", "Sunset View"]}
        ]
    },
    {
        "id": "snow-peaks-manali",
        "name": "Snow Peaks Alpine Lodge",
        "city": "Manali",
        "address": "Solang Valley Road, Near Old Manali",
        "lat": 32.2396,
        "lng": 77.1887,
        "rating": 4.8,
        "amenities": ["Snow View", "Fireplace", "Heated Rooms", "Wi-Fi", "Trekking Desk", "Cafe"],
        "images": ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"],
        "description": "Cozy Himalayan cedar lodge with roaring fireplaces and breathtaking snow-capped mountain vistas.",
        "rooms": [
            {"id": "man1", "room_number": "102", "type": "Single", "capacity": 1, "base_price": 2200, "is_available": True, "amenities": ["Mountain View", "Heated Floor"]},
            {"id": "man2", "room_number": "201", "type": "Double", "capacity": 2, "base_price": 3400, "is_available": True, "amenities": ["Balcony", "Fireplace"]},
            {"id": "man3", "room_number": "303", "type": "Deluxe", "capacity": 2, "base_price": 4800, "is_available": True, "amenities": ["Snow Peak View", "Cedar Wood"]},
            {"id": "man4", "room_number": "401", "type": "Suite", "capacity": 4, "base_price": 7900, "is_available": True, "amenities": ["Attic Suite", "Panoramic Balcony"]}
        ]
    }
]

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed or update Admin User
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
            existing_admin.role = "admin"
            existing_admin.password_hash = hash_password(settings.ADMIN_PASSWORD)
            db.commit()
            logger.info(f"Admin user {admin_email} role ensured as 'admin'.")

        # 2. Seed or Upsert Hotels and Rooms
        logger.info(f"Seeding / updating {len(ALL_HOTELS_DATA)} luxury hotels and rooms...")
        for hdata in ALL_HOTELS_DATA:
            hotel_id = hdata["id"]
            rooms_list = hdata.get("rooms", [])
            hotel_fields = {k: v for k, v in hdata.items() if k != "rooms"}

            existing_hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
            if not existing_hotel:
                hotel = Hotel(**hotel_fields)
                db.add(hotel)
                db.flush()
            else:
                for k, v in hotel_fields.items():
                    setattr(existing_hotel, k, v)
                db.flush()

            for rdata in rooms_list:
                room_id = rdata["id"]
                existing_room = db.query(Room).filter(Room.id == room_id).first()
                if not existing_room:
                    room = Room(hotel_id=hotel_id, **rdata)
                    db.add(room)
                else:
                    for rk, rv in rdata.items():
                        setattr(existing_room, rk, rv)
        
        db.commit()
        logger.info("All hotels and rooms seeded successfully.")

        # 3. Seed Initial Bookings if none exist
        if db.query(Booking).count() == 0:
            logger.info("Seeding initial bookings...")
            bookings_data = [
                {"id": "BK-10482", "customer": "Aarav Sharma", "hotel": "Grand Orchid Hotel", "room": "Deluxe · 301", "dates": "18–21 Sep", "amount": 17280, "payment": "Paid", "status": "Confirmed"},
                {"id": "BK-10481", "customer": "Meera Iyer", "hotel": "The Terrace House", "room": "Double · 204", "dates": "19–20 Sep", "amount": 3840, "payment": "Pending", "status": "Pending"},
                {"id": "BK-10480", "customer": "Kabir Singh", "hotel": "Saffron Retreat", "room": "Suite · 206", "dates": "22–25 Sep", "amount": 24480, "payment": "Paid", "status": "Confirmed"},
                {"id": "BK-10479", "customer": "Nisha Patel", "hotel": "The Imperial Haven", "room": "Suite · 501", "dates": "17–18 Sep", "amount": 9500, "payment": "Paid", "status": "Confirmed"},
                {"id": "BK-10478", "customer": "Rohan Mehta", "hotel": "Azure Bay Beach Resort", "room": "Deluxe · 304", "dates": "25–28 Sep", "amount": 16800, "payment": "Paid", "status": "Confirmed"},
                {"id": "BK-10477", "customer": "Ananya Roy", "hotel": "Snow Peaks Alpine Lodge", "room": "Suite · 401", "dates": "1–4 Oct", "amount": 23700, "payment": "Paid", "status": "Confirmed"},
            ]
            for b in bookings_data:
                db.add(Booking(**b))
            db.commit()
            logger.info("Bookings seeded successfully.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
