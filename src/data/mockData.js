export const mockHotels = [
  {
    _id: 'grand-orchid',
    name: 'Grand Orchid Hotel',
    location: { city: 'Mumbai', address: '123 Marine Drive, Colaba' },
    rating: 4.8,
    amenities: ['Pool', 'Spa', 'Breakfast', 'Wi‑Fi', 'Restaurant', 'Gym', 'Sea View'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'],
    description: 'A serene luxury coastal stay with panoramic Arabian Sea views, infinity pool, and fine dining.',
    rooms: [
      { _id: 'm1', roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2800, isAvailable: true },
      { _id: 'm2', roomNumber: '205', type: 'Double', capacity: 2, basePrice: 3800, isAvailable: true },
      { _id: 'g1', roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true },
      { _id: 'g2', roomNumber: '401', type: 'Suite', capacity: 3, basePrice: 7900, isAvailable: true }
    ]
  },
  {
    _id: 'sea-breeze',
    name: 'Sea Breeze Palms Residency',
    location: { city: 'Mumbai', address: 'Juhu Tara Road, Juhu Beach' },
    rating: 4.6,
    amenities: ['Wi‑Fi', 'Breakfast', 'Pool', 'Restaurant', 'Beach Access'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
    description: 'Direct beach access resort in Juhu with lush coconut palms and tranquil sea breezes.',
    rooms: [
      { _id: 'sb1', roomNumber: '102', type: 'Single', capacity: 1, basePrice: 2600, isAvailable: true },
      { _id: 'sb2', roomNumber: '202', type: 'Double', capacity: 2, basePrice: 3500, isAvailable: true },
      { _id: 'sb3', roomNumber: '304', type: 'Deluxe', capacity: 2, basePrice: 4600, isAvailable: true },
      { _id: 'sb4', roomNumber: '405', type: 'Suite', capacity: 4, basePrice: 7200, isAvailable: true }
    ]
  },
  {
    _id: 'imperial-haven',
    name: 'The Imperial Haven',
    location: { city: 'Delhi', address: 'Janpath, Connaught Place' },
    rating: 4.9,
    amenities: ['Pool', 'Spa', 'Fine Dining', 'Wi‑Fi', 'Gym', 'Valet Parking'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'],
    description: 'Colonial heritage elegance meeting modern 5-star luxury in the beating heart of New Delhi.',
    rooms: [
      { _id: 'del1', roomNumber: '101', type: 'Single', capacity: 1, basePrice: 3200, isAvailable: true },
      { _id: 'del2', roomNumber: '204', type: 'Double', capacity: 2, basePrice: 4500, isAvailable: true },
      { _id: 'del3', roomNumber: '308', type: 'Deluxe', capacity: 2, basePrice: 5800, isAvailable: true },
      { _id: 'del4', roomNumber: '501', type: 'Suite', capacity: 3, basePrice: 9500, isAvailable: true }
    ]
  },
  {
    _id: 'heritage-haveli',
    name: 'Heritage Haveli Residency',
    location: { city: 'Delhi', address: 'Chandni Chowk, Old Delhi' },
    rating: 4.5,
    amenities: ['Breakfast', 'Rooftop Cafe', 'Wi‑Fi', 'Cultural Tours'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
    description: 'Restored 19th-century Mughal courtyard haveli offering unforgettable charm and culinary delights.',
    rooms: [
      { _id: 'hh1', roomNumber: '103', type: 'Single', capacity: 1, basePrice: 2200, isAvailable: true },
      { _id: 'hh2', roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3100, isAvailable: true },
      { _id: 'hh3', roomNumber: '302', type: 'Deluxe', capacity: 2, basePrice: 4200, isAvailable: true },
      { _id: 'hh4', roomNumber: '402', type: 'Suite', capacity: 4, basePrice: 6500, isAvailable: true }
    ]
  },
  {
    _id: 'terrace-house',
    name: 'The Terrace House',
    location: { city: 'Bengaluru', address: 'Indiranagar 100ft Road' },
    rating: 4.6,
    amenities: ['Gym', 'Restaurant', 'Wi‑Fi', 'Parking', 'Bar'],
    images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'],
    description: 'Contemporary boutique hotel in vibrant Indiranagar, surrounded by premier cafes and tech hubs.',
    rooms: [
      { _id: 't0', roomNumber: '105', type: 'Single', capacity: 1, basePrice: 2400, isAvailable: true },
      { _id: 't1', roomNumber: '204', type: 'Double', capacity: 2, basePrice: 3200, isAvailable: true },
      { _id: 't2', roomNumber: '508', type: 'Deluxe', capacity: 2, basePrice: 4200, isAvailable: true },
      { _id: 't3', roomNumber: '601', type: 'Suite', capacity: 3, basePrice: 6800, isAvailable: true }
    ]
  },
  {
    _id: 'techpark-suites',
    name: 'TechPark Silicon Suites',
    location: { city: 'Bengaluru', address: 'ITPL Main Road, Whitefield' },
    rating: 4.7,
    amenities: ['High-speed Wi‑Fi', 'Pool', 'Fitness Center', 'Coworking Lounge', 'Breakfast'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'],
    description: 'Sleek, business-ready executive hotel equipped with high-speed fiber internet and ergonomic suites.',
    rooms: [
      { _id: 'tp1', roomNumber: '201', type: 'Single', capacity: 1, basePrice: 2500, isAvailable: true },
      { _id: 'tp2', roomNumber: '305', type: 'Double', capacity: 2, basePrice: 3600, isAvailable: true },
      { _id: 'tp3', roomNumber: '408', type: 'Deluxe', capacity: 2, basePrice: 4900, isAvailable: true },
      { _id: 'tp4', roomNumber: '702', type: 'Suite', capacity: 3, basePrice: 7500, isAvailable: true }
    ]
  },
  {
    _id: 'azure-bay-goa',
    name: 'Azure Bay Beach Resort',
    location: { city: 'Goa', address: 'Calangute - Baga Road, North Goa' },
    rating: 4.8,
    amenities: ['Beachfront', 'Infinity Pool', 'Spa', 'Bar', 'Breakfast', 'Wi‑Fi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'],
    description: 'Sun-kissed tropical paradise steps away from Calangute beach with swim-up bar and sea-facing sundecks.',
    rooms: [
      { _id: 'goa1', roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2900, isAvailable: true },
      { _id: 'goa2', roomNumber: '202', type: 'Double', capacity: 2, basePrice: 4200, isAvailable: true },
      { _id: 'goa3', roomNumber: '304', type: 'Deluxe', capacity: 2, basePrice: 5600, isAvailable: true },
      { _id: 'goa4', roomNumber: '401', type: 'Suite', capacity: 4, basePrice: 8800, isAvailable: true }
    ]
  },
  {
    _id: 'palm-grove-goa',
    name: 'Palm Grove Boutique Villa',
    location: { city: 'Goa', address: 'Anjuna Beach Road, Vagator' },
    rating: 4.7,
    amenities: ['Pool', 'Yoga Deck', 'Wi‑Fi', 'Organic Cafe', 'Scooter Rental'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
    description: 'Bohemian Portuguese-style estate surrounded by lush tropical gardens, peaceful and relaxing.',
    rooms: [
      { _id: 'pg1', roomNumber: '104', type: 'Double', capacity: 2, basePrice: 3800, isAvailable: true },
      { _id: 'pg2', roomNumber: '205', type: 'Deluxe', capacity: 2, basePrice: 4900, isAvailable: true },
      { _id: 'pg3', roomNumber: '301', type: 'Suite', capacity: 3, basePrice: 7400, isAvailable: true }
    ]
  },
  {
    _id: 'saffron-retreat',
    name: 'Saffron Retreat',
    location: { city: 'Jaipur', address: 'Amer Road, Near Jal Mahal' },
    rating: 4.8,
    amenities: ['Pool', 'Parking', 'Restaurant', 'Breakfast', 'Heritage Walk', 'Wi‑Fi'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
    description: 'A warm, heritage-inspired escape close to Jaipur’s most celebrated forts, palaces, and bazaar.',
    rooms: [
      { _id: 's1', roomNumber: '112', type: 'Single', capacity: 1, basePrice: 2800, isAvailable: true },
      { _id: 's2', roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3700, isAvailable: true },
      { _id: 's3', roomNumber: '206', type: 'Suite', capacity: 4, basePrice: 6800, isAvailable: true },
      { _id: 's4', roomNumber: '304', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true }
    ]
  },
  {
    _id: 'royal-rajputana',
    name: 'Royal Rajputana Palace',
    location: { city: 'Jaipur', address: 'Prithviraj Road, C-Scheme' },
    rating: 4.9,
    amenities: ['Palace Gardens', 'Pool', 'Fine Dining', 'Spa', 'Wi‑Fi', 'Cultural Shows'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'],
    description: 'Regal hospitality with hand-painted frescoes, lush royal lawns, and authentic Rajasthani royal feasts.',
    rooms: [
      { _id: 'rr1', roomNumber: '102', type: 'Single', capacity: 1, basePrice: 3400, isAvailable: true },
      { _id: 'rr2', roomNumber: '205', type: 'Double', capacity: 2, basePrice: 4800, isAvailable: true },
      { _id: 'rr3', roomNumber: '310', type: 'Deluxe', capacity: 2, basePrice: 6200, isAvailable: true },
      { _id: 'rr4', roomNumber: '501', type: 'Suite', capacity: 4, basePrice: 11000, isAvailable: true }
    ]
  },
  {
    _id: 'nizam-palace',
    name: 'Nizam Royal Palace Suites',
    location: { city: 'Hyderabad', address: 'Road No 1, Banjara Hills' },
    rating: 4.8,
    amenities: ['Pool', 'Spa', 'Authentic Biryani Dining', 'Wi‑Fi', 'Gym', 'Valet'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'],
    description: 'Opulent stay overlooking Hussain Sagar Lake with Nizami hospitality and world-class luxury.',
    rooms: [
      { _id: 'hyd1', roomNumber: '104', type: 'Single', capacity: 1, basePrice: 2700, isAvailable: true },
      { _id: 'hyd2', roomNumber: '202', type: 'Double', capacity: 2, basePrice: 3900, isAvailable: true },
      { _id: 'hyd3', roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 5200, isAvailable: true },
      { _id: 'hyd4', roomNumber: '601', type: 'Suite', capacity: 3, basePrice: 8500, isAvailable: true }
    ]
  },
  {
    _id: 'coromandel-coast',
    name: 'Coromandel Coast Resort',
    location: { city: 'Chennai', address: 'East Coast Road (ECR), Mahabalipuram Rd' },
    rating: 4.7,
    amenities: ['Sea View', 'Private Beach', 'Infinity Pool', 'Spa', 'Breakfast', 'Wi‑Fi'],
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80'],
    description: 'Coastal sanctuary alongside the Bay of Bengal with gentle surf, swaying palms, and fresh seafood.',
    rooms: [
      { _id: 'che1', roomNumber: '101', type: 'Single', capacity: 1, basePrice: 2500, isAvailable: true },
      { _id: 'che2', roomNumber: '203', type: 'Double', capacity: 2, basePrice: 3600, isAvailable: true },
      { _id: 'che3', roomNumber: '305', type: 'Deluxe', capacity: 2, basePrice: 4900, isAvailable: true },
      { _id: 'che4', roomNumber: '402', type: 'Suite', capacity: 4, basePrice: 7800, isAvailable: true }
    ]
  },
  {
    _id: 'victoria-heritage',
    name: 'Victoria Grand Heritage Hotel',
    location: { city: 'Kolkata', address: 'Park Street, Chowringhee' },
    rating: 4.7,
    amenities: ['Rooftop Lounge', 'Fine Dining', 'Wi‑Fi', 'Heritage Bar', 'Gym'],
    images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80'],
    description: 'Iconic heritage hotel on Park Street featuring vintage British-era architecture and live jazz evenings.',
    rooms: [
      { _id: 'kol1', roomNumber: '103', type: 'Single', capacity: 1, basePrice: 2400, isAvailable: true },
      { _id: 'kol2', roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3400, isAvailable: true },
      { _id: 'kol3', roomNumber: '302', type: 'Deluxe', capacity: 2, basePrice: 4700, isAvailable: true },
      { _id: 'kol4', roomNumber: '501', type: 'Suite', capacity: 3, basePrice: 7400, isAvailable: true }
    ]
  },
  {
    _id: 'backwater-whisper',
    name: 'Backwater Whisper Resort',
    location: { city: 'Kochi', address: 'Vembanad Backwaters, Fort Kochi' },
    rating: 4.9,
    amenities: ['Backwater Cruise', 'Ayurvedic Spa', 'Pool', 'Breakfast', 'Wi‑Fi'],
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
    description: 'Tranquil Ayurvedic wellness sanctuary sitting directly on Kerala’s serene palm-fringed backwaters.',
    rooms: [
      { _id: 'koc1', roomNumber: '104', type: 'Single', capacity: 1, basePrice: 2600, isAvailable: true },
      { _id: 'koc2', roomNumber: '202', type: 'Double', capacity: 2, basePrice: 3900, isAvailable: true },
      { _id: 'koc3', roomNumber: '301', type: 'Deluxe', capacity: 2, basePrice: 5300, isAvailable: true },
      { _id: 'koc4', roomNumber: '405', type: 'Suite', capacity: 4, basePrice: 8900, isAvailable: true }
    ]
  },
  {
    _id: 'snow-peaks-manali',
    name: 'Snow Peaks Alpine Lodge',
    location: { city: 'Manali', address: 'Solang Valley Road, Near Old Manali' },
    rating: 4.8,
    amenities: ['Snow View', 'Fireplace', 'Heated Rooms', 'Wi‑Fi', 'Trekking Desk', 'Cafe'],
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80'],
    description: 'Cozy Himalayan cedar lodge with roaring fireplaces and breathtaking snow-capped mountain vistas.',
    rooms: [
      { _id: 'man1', roomNumber: '102', type: 'Single', capacity: 1, basePrice: 2200, isAvailable: true },
      { _id: 'man2', roomNumber: '201', type: 'Double', capacity: 2, basePrice: 3400, isAvailable: true },
      { _id: 'man3', roomNumber: '303', type: 'Deluxe', capacity: 2, basePrice: 4800, isAvailable: true },
      { _id: 'man4', roomNumber: '401', type: 'Suite', capacity: 4, basePrice: 7900, isAvailable: true }
    ]
  }
];

export const bookingRows = [
  { id: 'BK-10482', customer: 'Aarav Sharma', hotel: 'Grand Orchid Hotel', room: 'Deluxe · 301', dates: '18–21 Sep', amount: 17280, payment: 'Paid', status: 'Confirmed' },
  { id: 'BK-10481', customer: 'Meera Iyer', hotel: 'The Terrace House', room: 'Double · 204', dates: '19–20 Sep', amount: 3840, payment: 'Pending', status: 'Pending' },
  { id: 'BK-10480', customer: 'Kabir Singh', hotel: 'Saffron Retreat', room: 'Suite · 206', dates: '22–25 Sep', amount: 24480, payment: 'Paid', status: 'Confirmed' },
  { id: 'BK-10479', customer: 'Nisha Patel', hotel: 'The Imperial Haven', room: 'Suite · 501', dates: '17–18 Sep', amount: 9500, payment: 'Paid', status: 'Confirmed' },
  { id: 'BK-10478', customer: 'Rohan Mehta', hotel: 'Azure Bay Beach Resort', room: 'Deluxe · 304', dates: '25–28 Sep', amount: 16800, payment: 'Paid', status: 'Confirmed' },
  { id: 'BK-10477', customer: 'Ananya Roy', hotel: 'Snow Peaks Alpine Lodge', room: 'Suite · 401', dates: '1–4 Oct', amount: 23700, payment: 'Paid', status: 'Confirmed' },
];

export const analyticsData = [
  { name: 'Mon', bookings: 18, revenue: 62000, occupancy: 58 },
  { name: 'Tue', bookings: 24, revenue: 78000, occupancy: 63 },
  { name: 'Wed', bookings: 21, revenue: 69000, occupancy: 61 },
  { name: 'Thu', bookings: 31, revenue: 106000, occupancy: 72 },
  { name: 'Fri', bookings: 42, revenue: 148000, occupancy: 84 },
  { name: 'Sat', bookings: 48, revenue: 176000, occupancy: 89 },
  { name: 'Sun', bookings: 36, revenue: 120000, occupancy: 75 },
];

export const pricingRows = [
  { hotel: 'Grand Orchid Hotel', room: 'Deluxe', base: 4800, dynamic: 5760, demand: 'High', occupancy: 85, status: 'Active' },
  { hotel: 'The Imperial Haven', room: 'Suite', base: 9500, dynamic: 11400, demand: 'High', occupancy: 90, status: 'Active' },
  { hotel: 'The Terrace House', room: 'Double', base: 3200, dynamic: 3520, demand: 'Medium', occupancy: 61, status: 'Active' },
  { hotel: 'Azure Bay Beach Resort', room: 'Deluxe', base: 5600, dynamic: 6720, demand: 'High', occupancy: 88, status: 'Active' },
  { hotel: 'Saffron Retreat', room: 'Suite', base: 6800, dynamic: 6120, demand: 'Low', occupancy: 32, status: 'Active' },
  { hotel: 'Backwater Whisper Resort', room: 'Deluxe', base: 5300, dynamic: 6100, demand: 'High', occupancy: 80, status: 'Active' },
  { hotel: 'Snow Peaks Alpine Lodge', room: 'Suite', base: 7900, dynamic: 9200, demand: 'High', occupancy: 82, status: 'Active' },
];
