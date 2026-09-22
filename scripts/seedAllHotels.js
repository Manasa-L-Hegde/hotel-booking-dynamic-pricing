import 'dotenv/config';
import connectDB from '../config/db.js';
import Hotel from '../models/Hotel.js';

await connectDB();

const expandedHotels = [
  // 1. Mumbai
  {
    name: 'Grand Orchid Hotel',
    location: { city: 'Mumbai', address: '123 Marine Drive, Colaba', coordinates: { lat: 18.9217, lng: 72.8332 } },
    rating: 4.8,
    amenities: ['Pool', 'Spa', 'Breakfast', 'Wi-Fi', 'Restaurant', 'Gym', 'Sea View'],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    ],
    description: 'A serene luxury coastal stay with panoramic Arabian Sea views, infinity pool, and fine dining.',
    rooms: [
      { roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2800, isAvailable: true, amenities: ['Wi-Fi', 'City-view', 'AC'] },
      { roomNumber: '205', type: 'Double', capacity: 2, basePrice: 3800, isAvailable: true, amenities: ['Wi-Fi', 'Balcony', 'AC'] },
      { roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true, amenities: ['Wi-Fi', 'Minibar', 'Ocean-view'] },
      { roomNumber: '401', type: 'Suite', capacity: 3, basePrice: 7900, isAvailable: true, amenities: ['Wi-Fi', 'Jacuzzi', 'King-bed', 'Sea-view'] }
    ]
  },
  {
    name: 'Sea Breeze Palms Residency',
    location: { city: 'Mumbai', address: 'Juhu Tara Road, Juhu Beach', coordinates: { lat: 19.0988, lng: 72.8264 } },
    rating: 4.6,
    amenities: ['Wi-Fi', 'Breakfast', 'Pool', 'Restaurant', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
    description: 'Direct beach access resort in Juhu with lush coconut palms and tranquil sea breezes.',
    rooms: [
      { roomNumber: '102', type: 'Single', capacity: 1, basePrice: 2600, isAvailable: true, amenities: ['Wi-Fi', 'AC'] },
      { roomNumber: '202', type: 'Double', capacity: 2, basePrice: 3500, isAvailable: true, amenities: ['Wi-Fi', 'Balcony', 'AC'] },
      { roomNumber: '304', type: 'Deluxe', capacity: 2, basePrice: 4600, isAvailable: true, amenities: ['Wi-Fi', 'Ocean-view', 'King-bed'] },
      { roomNumber: '405', type: 'Suite', capacity: 4, basePrice: 7200, isAvailable: true, amenities: ['Wi-Fi', 'Jacuzzi', 'Terrace'] }
    ]
  },

  // 2. Delhi
  {
    name: 'The Imperial Haven',
    location: { city: 'Delhi', address: 'Janpath, Connaught Place', coordinates: { lat: 28.6289, lng: 77.2195 } },
    rating: 4.9,
    amenities: ['Pool', 'Spa', 'Fine Dining', 'Wi-Fi', 'Gym', 'Valet Parking'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'],
    description: 'Colonial heritage elegance meeting modern 5-star luxury in the beating heart of New Delhi.',
    rooms: [
      { roomNumber: '101', type: 'Single', capacity: 1, basePrice: 3200, isAvailable: true, amenities: ['Wi-Fi', 'Work Desk', 'AC'] },
      { roomNumber: '204', type: 'Double', capacity: 2, basePrice: 4500, isAvailable: true, amenities: ['Wi-Fi', 'Garden-view', 'AC'] },
      { roomNumber: '308', type: 'Deluxe', capacity: 2, basePrice: 5800, isAvailable: true, amenities: ['Wi-Fi', 'Minibar', 'Marble Bath'] },
      { roomNumber: '501', type: 'Suite', capacity: 3, basePrice: 9500, isAvailable: true, amenities: ['Wi-Fi', 'Private Butler', 'Lounge'] }
    ]
  },
  {
    name: 'Heritage Haveli Residency',
    location: { city: 'Delhi', address: 'Chandni Chowk, Old Delhi', coordinates: { lat: 28.6507, lng: 77.2334 } },
    rating: 4.5,
    amenities: ['Breakfast', 'Rooftop Cafe', 'Wi-Fi', 'Cultural Tours'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
    description: 'Restored 19th-century Mughal courtyard haveli offering unforgettable charm and culinary delights.',
    rooms: [
      { roomNumber: '103', type: 'Single', capacity: 1, basePrice: 2200, isAvailable: true, amenities: ['Wi-Fi', 'Courtyard View'] },
      { roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3100, isAvailable: true, amenities: ['Wi-Fi', 'Carved Wooden Bed'] },
      { roomNumber: '302', type: 'Deluxe', capacity: 2, basePrice: 4200, isAvailable: true, amenities: ['Wi-Fi', 'Balcony', 'AC'] },
      { roomNumber: '402', type: 'Suite', capacity: 4, basePrice: 6500, isAvailable: true, amenities: ['Wi-Fi', 'Private Terrace', 'Heritage Decor'] }
    ]
  },

  // 3. Bengaluru
  {
    name: 'The Terrace House',
    location: { city: 'Bengaluru', address: 'Indiranagar 100ft Road', coordinates: { lat: 12.9716, lng: 77.5946 } },
    rating: 4.6,
    amenities: ['Gym', 'Restaurant', 'Wi-Fi', 'Parking', 'Bar'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
    description: 'Contemporary boutique hotel in vibrant Indiranagar, surrounded by premier cafes and tech hubs.',
    rooms: [
      { roomNumber: '105', type: 'Single', capacity: 1, basePrice: 2400, isAvailable: true, amenities: ['Wi-Fi', 'Work Desk'] },
      { roomNumber: '204', type: 'Double', capacity: 2, basePrice: 3200, isAvailable: true, amenities: ['Wi-Fi', 'Desk', 'Smart TV'] },
      { roomNumber: '508', type: 'Deluxe', capacity: 2, basePrice: 4200, isAvailable: true, amenities: ['Balcony', 'Minibar', 'King Bed'] },
      { roomNumber: '601', type: 'Suite', capacity: 3, basePrice: 6800, isAvailable: true, amenities: ['Living Room', 'Skyline View', 'Bathtub'] }
    ]
  },
  {
    name: 'TechPark Silicon Suites',
    location: { city: 'Bengaluru', address: 'ITPL Main Road, Whitefield', coordinates: { lat: 12.9854, lng: 77.7314 } },
    rating: 4.7,
    amenities: ['High-speed Wi-Fi', 'Pool', 'Fitness Center', 'Coworking Lounge', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'],
    description: 'Sleek, business-ready executive hotel equipped with high-speed fiber internet and ergonomic suites.',
    rooms: [
      { roomNumber: '201', type: 'Single', capacity: 1, basePrice: 2500, isAvailable: true, amenities: ['Ergonomic Chair', 'High-speed Wi-Fi'] },
      { roomNumber: '305', type: 'Double', capacity: 2, basePrice: 3600, isAvailable: true, amenities: ['Wi-Fi', 'Smart TV', 'AC'] },
      { roomNumber: '408', type: 'Deluxe', capacity: 2, basePrice: 4900, isAvailable: true, amenities: ['Coffee Machine', 'City View', 'Bathtub'] },
      { roomNumber: '702', type: 'Suite', capacity: 3, basePrice: 7500, isAvailable: true, amenities: ['Executive Lounge', 'Kitchenette', 'King Bed'] }
    ]
  },

  // 4. Goa
  {
    name: 'Azure Bay Beach Resort',
    location: { city: 'Goa', address: 'Calangute - Baga Road, North Goa', coordinates: { lat: 15.5439, lng: 73.7553 } },
    rating: 4.8,
    amenities: ['Beachfront', 'Infinity Pool', 'Spa', 'Bar', 'Breakfast', 'Wi-Fi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'],
    description: 'Sun-kissed tropical paradise steps away from Calangute beach with swim-up bar and sea-facing sundecks.',
    rooms: [
      { roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2900, isAvailable: true, amenities: ['Wi-Fi', 'Garden View'] },
      { roomNumber: '202', type: 'Double', capacity: 2, basePrice: 4200, isAvailable: true, amenities: ['Wi-Fi', 'Balcony', 'Pool View'] },
      { roomNumber: '304', type: 'Deluxe', capacity: 2, basePrice: 5600, isAvailable: true, amenities: ['Sea-facing Balcony', 'Minibar'] },
      { roomNumber: '401', type: 'Suite', capacity: 4, basePrice: 8800, isAvailable: true, amenities: ['Private Plunge Pool', 'Jacuzzi', 'Ocean View'] }
    ]
  },
  {
    name: 'Palm Grove Boutique Villa',
    location: { city: 'Goa', address: 'Anjuna Beach Road, Vagator', coordinates: { lat: 15.5873, lng: 73.7438 } },
    rating: 4.7,
    amenities: ['Pool', 'Yoga Deck', 'Wi-Fi', 'Organic Cafe', 'Scooter Rental'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
    description: 'Bohemian Portuguese-style estate surrounded by lush tropical gardens, peaceful and relaxing.',
    rooms: [
      { roomNumber: '104', type: 'Double', capacity: 2, basePrice: 3800, isAvailable: true, amenities: ['Wi-Fi', 'Garden Patio', 'Open-air Shower'] },
      { roomNumber: '205', type: 'Deluxe', capacity: 2, basePrice: 4900, isAvailable: true, amenities: ['Canopy Bed', 'Balcony', 'Pool View'] },
      { roomNumber: '301', type: 'Suite', capacity: 3, basePrice: 7400, isAvailable: true, amenities: ['Private Gazebo', 'Bathtub', 'Living Area'] }
    ]
  },

  // 5. Jaipur
  {
    name: 'Saffron Retreat',
    location: { city: 'Jaipur', address: 'Amer Road, Near Jal Mahal', coordinates: { lat: 26.9124, lng: 75.7873 } },
    rating: 4.8,
    amenities: ['Pool', 'Parking', 'Restaurant', 'Breakfast', 'Heritage Walk', 'Wi-Fi'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
    description: 'A warm, heritage-inspired escape close to Jaipur’s most celebrated forts, palaces, and bazaar.',
    rooms: [
      { roomNumber: '112', type: 'Single', capacity: 1, basePrice: 2800, isAvailable: true, amenities: ['Wi-Fi', 'Courtyard-view'] },
      { roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3700, isAvailable: true, amenities: ['Wi-Fi', 'Traditional Decor'] },
      { roomNumber: '206', type: 'Suite', capacity: 4, basePrice: 6800, isAvailable: true, amenities: ['Private Terrace', 'Bathtub', 'Jal Mahal View'] },
      { roomNumber: '304', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true, amenities: ['Wi-Fi', 'Jharokha Balcony'] }
    ]
  },
  {
    name: 'Royal Rajputana Palace',
    location: { city: 'Jaipur', address: 'Prithviraj Road, C-Scheme', coordinates: { lat: 26.9038, lng: 75.8012 } },
    rating: 4.9,
    amenities: ['Palace Gardens', 'Pool', 'Fine Dining', 'Spa', 'Wi-Fi', 'Cultural Shows'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'],
    description: 'Regal hospitality with hand-painted frescoes, lush royal lawns, and authentic Rajasthani royal feasts.',
    rooms: [
      { roomNumber: '102', type: 'Single', capacity: 1, basePrice: 3400, isAvailable: true, amenities: ['Wi-Fi', 'Palace Garden View'] },
      { roomNumber: '205', type: 'Double', capacity: 2, basePrice: 4800, isAvailable: true, amenities: ['Wi-Fi', 'Royal Furnishings', 'AC'] },
      { roomNumber: '310', type: 'Deluxe', capacity: 2, basePrice: 6200, isAvailable: true, amenities: ['Balcony', 'Four-poster Bed', 'Bathtub'] },
      { roomNumber: '501', type: 'Suite', capacity: 4, basePrice: 11000, isAvailable: true, amenities: ['Maharaja Suite', 'Private Butler', 'Courtyard'] }
    ]
  },

  // 6. Hyderabad
  {
    name: 'Nizam Royal Palace Suites',
    location: { city: 'Hyderabad', address: 'Road No 1, Banjara Hills', coordinates: { lat: 17.4156, lng: 78.4354 } },
    rating: 4.8,
    amenities: ['Pool', 'Spa', 'Authentic Biryani Dining', 'Wi-Fi', 'Gym', 'Valet'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'],
    description: 'Opulent stay overlooking Hussain Sagar Lake with Nizami hospitality and world-class luxury.',
    rooms: [
      { roomNumber: '104', type: 'Single', capacity: 1, basePrice: 2700, isAvailable: true, amenities: ['Wi-Fi', 'City View', 'AC'] },
      { roomNumber: '202', type: 'Double', capacity: 2, basePrice: 3900, isAvailable: true, amenities: ['Wi-Fi', 'Balcony', 'Lake View'] },
      { roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 5200, isAvailable: true, amenities: ['Marble Bath', 'Minibar', 'King Bed'] },
      { roomNumber: '601', type: 'Suite', capacity: 3, basePrice: 8500, isAvailable: true, amenities: ['Lake View', 'Jacuzzi', 'Living Room'] }
    ]
  },
  {
    name: 'Cyber Pearl Executive Stay',
    location: { city: 'Hyderabad', address: 'Hitec City, Madhapur', coordinates: { lat: 17.4435, lng: 78.3772 } },
    rating: 4.6,
    amenities: ['High-speed Wi-Fi', 'Gym', 'Breakfast', 'Airport Shuttle', 'Work Desk'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
    description: 'State-of-the-art tech lifestyle hotel near Inorbit Mall and Hyderabad financial district.',
    rooms: [
      { roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2300, isAvailable: true, amenities: ['Wi-Fi', 'Work Desk'] },
      { roomNumber: '205', type: 'Double', capacity: 2, basePrice: 3300, isAvailable: true, amenities: ['Wi-Fi', 'Smart TV', 'AC'] },
      { roomNumber: '308', type: 'Deluxe', capacity: 2, basePrice: 4500, isAvailable: true, amenities: ['City View', 'Ergonomic Workspace'] },
      { roomNumber: '502', type: 'Suite', capacity: 3, basePrice: 6900, isAvailable: true, amenities: ['Executive Lounge Access', 'Bathtub'] }
    ]
  },

  // 7. Chennai
  {
    name: 'Coromandel Coast Resort',
    location: { city: 'Chennai', address: 'East Coast Road (ECR), Mahabalipuram Rd', coordinates: { lat: 12.8398, lng: 80.2435 } },
    rating: 4.7,
    amenities: ['Sea View', 'Private Beach', 'Infinity Pool', 'Spa', 'Breakfast', 'Wi-Fi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'],
    description: 'Coastal sanctuary alongside the Bay of Bengal with gentle surf, swaying palms, and fresh seafood.',
    rooms: [
      { roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2500, isAvailable: true, amenities: ['Wi-Fi', 'Garden View'] },
      { roomNumber: '203', type: 'Double', capacity: 2, basePrice: 3600, isAvailable: true, amenities: ['Wi-Fi', 'Balcony', 'AC'] },
      { roomNumber: '305', type: 'Deluxe', capacity: 2, basePrice: 4900, isAvailable: true, amenities: ['Sea-view', 'Minibar', 'King Bed'] },
      { roomNumber: '402', type: 'Suite', capacity: 4, basePrice: 7800, isAvailable: true, amenities: ['Direct Beach Walk', 'Jacuzzi', 'Terrace'] }
    ]
  },

  // 8. Kolkata
  {
    name: 'Victoria Grand Heritage Hotel',
    location: { city: 'Kolkata', address: 'Park Street, Chowringhee', coordinates: { lat: 22.5535, lng: 88.3512 } },
    rating: 4.7,
    amenities: ['Rooftop Lounge', 'Fine Dining', 'Wi-Fi', 'Heritage Bar', 'Gym'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
    description: 'Iconic heritage hotel on Park Street featuring vintage British-era architecture and live jazz evenings.',
    rooms: [
      { roomNumber: '103', type: 'Single', capacity: 1, basePrice: 2400, isAvailable: true, amenities: ['Wi-Fi', 'Desk', 'AC'] },
      { roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3400, isAvailable: true, amenities: ['Wi-Fi', 'City View', 'AC'] },
      { roomNumber: '302', type: 'Deluxe', capacity: 2, basePrice: 4700, isAvailable: true, amenities: ['Park Street View', 'Minibar'] },
      { roomNumber: '501', type: 'Suite', capacity: 3, basePrice: 7400, isAvailable: true, amenities: ['Victorian Suite', 'Bathtub', 'Study'] }
    ]
  },

  // 9. Kochi / Kerala
  {
    name: 'Backwater Whisper Resort',
    location: { city: 'Kochi', address: 'Vembanad Backwaters, Fort Kochi', coordinates: { lat: 9.9656, lng: 76.2421 } },
    rating: 4.9,
    amenities: ['Backwater Cruise', 'Ayurvedic Spa', 'Pool', 'Breakfast', 'Wi-Fi', 'Traditional Dining'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
    description: 'Tranquil Ayurvedic wellness sanctuary sitting directly on Kerala’s serene palm-fringed backwaters.',
    rooms: [
      { roomNumber: '104', type: 'Single', capacity: 1, basePrice: 2600, isAvailable: true, amenities: ['Wi-Fi', 'Garden View'] },
      { roomNumber: '202', type: 'Double', capacity: 2, basePrice: 3900, isAvailable: true, amenities: ['Water-facing Deck', 'AC'] },
      { roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 5300, isAvailable: true, amenities: ['Private Veranda', 'Backwater View'] },
      { roomNumber: '405', type: 'Suite', capacity: 4, basePrice: 8900, isAvailable: true, amenities: ['Private Houseboat Experience', 'Open-air Bath'] }
    ]
  },

  // 10. Manali
  {
    name: 'Snow Peaks Alpine Lodge',
    location: { city: 'Manali', address: 'Solang Valley Road, Near Old Manali', coordinates: { lat: 32.2432, lng: 77.1892 } },
    rating: 4.8,
    amenities: ['Snow View', 'Fireplace', 'Heated Rooms', 'Wi-Fi', 'Trekking Desk', 'Cafe'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'],
    description: 'Cozy Himalayan cedar lodge with roaring fireplaces and breathtaking snow-capped mountain vistas.',
    rooms: [
      { roomNumber: '102', type: 'Single', capacity: 1, basePrice: 2200, isAvailable: true, amenities: ['Heated Bedding', 'Pine View'] },
      { roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3400, isAvailable: true, amenities: ['Mountain Balcony', 'Wi-Fi', 'Heater'] },
      { roomNumber: '303', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true, amenities: ['Himalayan Panorama View', 'Fireplace'] },
      { roomNumber: '401', type: 'Suite', capacity: 4, basePrice: 7900, isAvailable: true, amenities: ['Attic Duplex Suite', 'Private Balcony', 'Jacuzzi'] }
    ]
  }
];

console.log('Clearing old hotel collection and inserting all new multi-city hotels & stays...');
await Hotel.deleteMany({});
await Hotel.insertMany(expandedHotels);

const count = await Hotel.countDocuments();
const cities = await Hotel.distinct('location.city');
console.log(`✅ Success! Seeded ${count} hotels across ${cities.length} cities:`);
console.log(cities.join(', '));

process.exit(0);
