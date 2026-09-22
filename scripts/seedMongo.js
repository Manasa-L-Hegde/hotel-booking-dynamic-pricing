import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Hotel from '../models/Hotel.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

console.log('Connecting to MongoDB...');
await connectDB();

// 1. Seed / Upsert Admin User
if (ADMIN_NAME && ADMIN_EMAIL && ADMIN_PASSWORD) {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const user = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL.toLowerCase() },
    { $set: { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), passwordHash, role: 'admin' } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`✅ Admin account ready: ${user.email} (${user.name})`);
} else {
  console.log('⚠️ ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD missing in .env. Skipping admin seed.');
}

// 2. Seed Initial Hotels if collection is empty
const hotelCount = await Hotel.countDocuments();
if (hotelCount === 0) {
  console.log('Seeding initial hotels and rooms into MongoDB...');
  const initialHotels = [
    {
      name: 'Grand Orchid Hotel',
      location: { city: 'Mumbai', address: '123 Marine Drive, Colaba', coordinates: { lat: 18.9217, lng: 72.8332 } },
      rating: 4.7,
      amenities: ['Pool', 'Spa', 'Breakfast', 'Wi-Fi', 'Restaurant', 'Gym'],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'],
      rooms: [
        { roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true, amenities: ['Wi-Fi', 'Minibar', 'Ocean-view'] },
        { roomNumber: '401', type: 'Suite', capacity: 3, basePrice: 7900, isAvailable: true, amenities: ['Wi-Fi', 'Jacuzzi', 'King-bed'] }
      ]
    },
    {
      name: 'The Terrace House',
      location: { city: 'Bengaluru', address: 'Indiranagar 100ft Road', coordinates: { lat: 12.9716, lng: 77.5946 } },
      rating: 4.5,
      amenities: ['Gym', 'Restaurant', 'Wi-Fi', 'Parking'],
      images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
      rooms: [
        { roomNumber: '204', type: 'Double', capacity: 2, basePrice: 3200, isAvailable: true, amenities: ['Wi-Fi', 'Desk'] },
        { roomNumber: '508', type: 'Deluxe', capacity: 2, basePrice: 4200, isAvailable: false, amenities: ['Balcony', 'Minibar'] }
      ]
    },
    {
      name: 'Saffron Retreat',
      location: { city: 'Jaipur', address: 'Amer Road, Near Jal Mahal', coordinates: { lat: 26.9124, lng: 75.7873 } },
      rating: 4.8,
      amenities: ['Pool', 'Parking', 'Restaurant', 'Breakfast', 'Heritage Walk'],
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
      rooms: [
        { roomNumber: '112', type: 'Single', capacity: 1, basePrice: 2800, isAvailable: true, amenities: ['Wi-Fi', 'Courtyard-view'] },
        { roomNumber: '206', type: 'Suite', capacity: 4, basePrice: 6800, isAvailable: true, amenities: ['Private Terrace', 'Bathtub'] }
      ]
    }
  ];

  await Hotel.insertMany(initialHotels);
  console.log(`✅ ${initialHotels.length} initial hotels and rooms seeded successfully.`);
} else {
  console.log(`ℹ️ MongoDB already contains ${hotelCount} hotels. No changes made.`);
}

console.log('MongoDB setup and seeding complete!');
process.exit(0);
