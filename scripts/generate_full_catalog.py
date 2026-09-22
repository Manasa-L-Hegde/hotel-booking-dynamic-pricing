import json
from pathlib import Path

regions = {
    'Goa': [
        ('azure-bay-goa', 'Azure Bay Beach Resort', 'Calangute - Baga Road, North Goa', 4.8, ['Beachfront', 'Infinity Pool', 'Spa', 'Bar', 'Breakfast', 'Wi-Fi'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Sun-kissed tropical paradise steps away from Calangute beach with swim-up bar and sea-facing sundecks.'),
        ('palm-grove-goa', 'Palm Grove Boutique Villa', 'Anjuna Beach Road, Vagator', 4.7, ['Pool', 'Yoga Deck', 'Wi-Fi', 'Organic Cafe', 'Scooter Rental'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Bohemian Portuguese-style estate surrounded by lush tropical gardens, peaceful and relaxing.'),
        ('taj-aguada-goa', 'Fort Aguada Heritage Resort', 'Sinquerim Beach, Candolim', 4.9, ['Private Beach', 'Heritage Ramparts', 'Fine Dining', 'Spa', 'Pool'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Historic cliffside luxury resort overlooking the 16th-century Portuguese fortress and Arabian Sea.'),
        ('morjim-sunset-goa', 'Morjim Sunset Beach Club & Spa', 'Turtle Beach, Morjim', 4.7, ['Beachfront', 'Sunset Lounge', 'Pool', 'Wi-Fi', 'Cocktail Bar'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Chic beachfront retreat on pristine Morjim turtle beach featuring private daybeds and ocean views.'),
        ('palolem-palms-goa', 'Palolem Palms Eco-Lodge', 'Palolem Beach, Canacona, South Goa', 4.8, ['Eco-Friendly', 'Kayaking', 'Yoga Shala', 'Sea View', 'Breakfast'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Serene South Goa eco-haven nestled between swaying palms and gentle curving crescent bay.'),
        ('fontainhas-manor-goa', 'Fontainhas Latin Quarter Manor', 'Altinho, Panaji', 4.6, ['Heritage Architecture', 'Courtyard Cafe', 'Art Gallery', 'Wi-Fi'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Restored 18th-century Portuguese townhouse with terracotta tiles, vintage azulejos, and verandas.'),
        ('vagator-cliffs-goa', 'Vagator Sea Cliff Haven', 'Ozran Beach Road, Small Vagator', 4.8, ['Cliffside Deck', 'Infinity Pool', 'Sunset Bar', 'Wi-Fi', 'Spa'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Dramatic cliff-top suites with panoramic Arabian Sea views and private beach path access.'),
        ('candolim-sands-goa', 'Candolim Golden Sands Suites', 'Fort Aguada Road, Candolim', 4.6, ['Pool', 'Restaurant', 'Gym', 'Wi-Fi', 'Airport Shuttle'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Modern luxury suites within walking distance to Candolim vibrant markets, cafes, and watersports.'),
        ('benaulim-breeze-goa', 'Benaulim Coastal Hideaway', 'Benaulim Beach Road, South Goa', 4.7, ['Peaceful Gardens', 'Bicycle Rental', 'Pool', 'Breakfast', 'Wi-Fi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Quiet coastal hideout on white sands, ideal for families and travelers seeking peaceful rejuvenation.'),
        ('chapora-lagoon-goa', 'Chapora River Lagoon Retreat', 'Siolim Road, Chapora Backwaters', 4.8, ['River View', 'Private Plunge Pools', 'Kayaking', 'Fine Dining'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Exclusive lagoon-side sanctuary with wooden decks, private plunge pools, and mangrove boat tours.')
    ],
    'Mumbai': [
        ('grand-orchid-mum', 'Grand Orchid Hotel', '123 Marine Drive, Colaba', 4.8, ['Pool', 'Spa', 'Breakfast', 'Wi-Fi', 'Restaurant', 'Gym', 'Sea View'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'A serene luxury coastal stay with panoramic Arabian Sea views, infinity pool, and fine dining.'),
        ('sea-breeze-mum', 'Sea Breeze Palms Residency', 'Juhu Tara Road, Juhu Beach', 4.6, ['Wi-Fi', 'Breakfast', 'Pool', 'Restaurant', 'Beach Access'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Direct beach access resort in Juhu with lush coconut palms and tranquil sea breezes.'),
        ('bandra-skyline-mum', 'Bandra Skyline Boutique Hotel', 'Perry Cross Road, Bandra West', 4.7, ['Rooftop Cafe', 'Art Decor', 'Wi-Fi', 'Boutique Gym', 'Cocktails'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Trendy boutique hotel in Bandra fashionable suburb with artisanal cafes and designer suites.'),
        ('colaba-heritage-mum', 'The Colaba Royal Pavilion', 'Apollo Bunder, Near Gateway of India', 4.9, ['Gateway View', 'Butler Service', 'High Tea', 'Spa', 'Fine Dining'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Legendary harbor-facing 5-star landmark steeped in colonial elegance and world-class service.'),
        ('bkc-grand-mum', 'BKC Grand Metropolitan', 'G Block, Bandra Kurla Complex', 4.8, ['Helipad', 'Executive Lounge', 'Infinity Pool', 'Fast Fiber Wi-Fi'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Architectural marvel in Mumbai financial district built for global business leaders and executives.'),
        ('powai-lakefront-mum', 'Powai Lakefront Resort & Spa', 'Hiranandani Gardens, Powai', 4.7, ['Lake View', 'Lush Gardens', 'Luxury Spa', 'Tennis Court', 'Pool'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Sprawling lakeside resort nestled against green hills with grand neoclassical architecture.'),
        ('worli-seaface-mum', 'Worli Seaface Grand Suites', 'Khan Abdul Gaffar Khan Marg, Worli', 4.8, ['Sea Link View', 'Sunset Bar', 'Gym', 'Valet Parking', 'Pool'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Front-row views of the iconic Bandra-Worli Sea Link and Arabian Sea skyline.'),
        ('nariman-horizon-mum', 'Nariman Point Horizon Hotel', 'Madame Cama Road, Nariman Point', 4.7, ['Business Center', 'Harbor View', 'Fine Dining', 'Valet', 'Wi-Fi'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Prestigious South Mumbai business address overlooking the shimmering Queen Necklace.'),
        ('versova-tides-mum', 'Versova Bohemian Tides Hotel', 'Yari Road, Versova Village', 4.5, ['Rooftop Deck', 'Art Studios', 'Organic Cafe', 'Wi-Fi', 'Pet-Friendly'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Eclectic artists haven near Versova beach with colorful murals and relaxed ocean atmosphere.'),
        ('juhu-sands-mum', 'Juhu Luxury Ocean Villa', 'Gandhigram Road, Juhu', 4.9, ['Private Beach Access', 'Personal Chef', 'Jacuzzi', 'Ocean Terrace'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Ultra-exclusive private beachfront villa offering bespoke luxury and celebrity-grade privacy.')
    ],
    'Bengaluru': [
        ('terrace-house-blr', 'The Terrace House', 'Indiranagar 100ft Road', 4.6, ['Gym', 'Restaurant', 'Wi-Fi', 'Parking', 'Bar'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Contemporary boutique hotel in vibrant Indiranagar, surrounded by premier cafes and tech hubs.'),
        ('techpark-suites-blr', 'TechPark Silicon Suites', 'ITPL Main Road, Whitefield', 4.7, ['High-speed Wi-Fi', 'Pool', 'Fitness Center', 'Coworking Lounge', 'Breakfast'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Sleek, business-ready executive hotel equipped with high-speed fiber internet and ergonomic suites.'),
        ('mg-heritage-blr', 'MG Road Heritage Club & Suites', 'MG Road, Central Business District', 4.8, ['Colonial Lawns', 'Billiards Lounge', 'Fine Dining', 'Pool', 'Wi-Fi'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Centuries-old heritage hotel boasting verdant gardens and timeless aristocratic hospitality.'),
        ('koramangala-loft-blr', 'Koramangala Urban Loft Hotel', '80 Feet Road, 4th Block Koramangala', 4.6, ['Craft Beer Bar', 'Co-working Pods', 'Wi-Fi', 'Rooftop Cafe'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Vibrant startup-friendly hub with industrial loft aesthetics, specialty coffee, and networking lounges.'),
        ('lavelle-manor-blr', 'Lavelle Royal Manor', 'Lavelle Road, Richmond Town', 4.9, ['Butler Service', 'Luxury Spa', 'Wine Cellar', 'Valet', 'Pool'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Refined boutique luxury nestled on tree-lined Lavelle Road minutes from UB City luxury mall.'),
        ('nandi-hills-blr', 'Nandi Foothills Serenity Resort', 'Nandi Hills Valley Road', 4.8, ['Mountain Views', 'Infinity Pool', 'Trekking Tours', 'Organic Farm', 'Spa'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Picturesque countryside getaway at the base of Nandi Hills with cool mountain breezes.'),
        ('cubbon-park-blr', 'Cubbon Park View Executive', 'Kasturba Road, Near Cubbon Park', 4.7, ['Park View', 'Jogging Track', 'Fitness Center', 'Wi-Fi', 'Breakfast'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Green urban oasis overlooking 300 acres of lush botanical canopy in Central Bengaluru.'),
        ('electronic-city-blr', 'Electronic City Business Hub Hotel', 'Hosur Road, Phase 1 Electronic City', 4.5, ['Express Check-in', 'Smart Meeting Rooms', 'Gym', 'Wi-Fi', 'Dine-In'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Modern streamlined hotel purpose-built for IT professionals and corporate delegations.'),
        ('sadashivanagar-blr', 'Sadashivanagar Garden Palace', 'Bellary Road, Sadashivanagar', 4.8, ['Royal Architecture', 'Spa', 'Gourmet Dining', 'Pool', 'Courtyard'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Regal manor in Bengaluru most prestigious neighborhood surrounded by sprawling canopies.'),
        ('hebbal-lake-blr', 'Hebbal Lakefront Luxury Hotel', 'Outer Ring Road, Hebbal Flyover', 4.7, ['Lakefront Walkway', 'Rooftop Lounge', 'Pool', 'Wi-Fi', 'Valet'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Glass-facade modern high-rise offering birdwatching vistas and easy airport highway connectivity.')
    ],
    'Delhi': [
        ('imperial-haven-del', 'The Imperial Haven', 'Janpath, Connaught Place', 4.9, ['Pool', 'Spa', 'Fine Dining', 'Wi-Fi', 'Gym', 'Valet Parking'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Colonial heritage elegance meeting modern 5-star luxury in the beating heart of New Delhi.'),
        ('heritage-haveli-del', 'Heritage Haveli Residency', 'Chandni Chowk, Old Delhi', 4.5, ['Breakfast', 'Rooftop Cafe', 'Wi-Fi', 'Cultural Tours'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Restored 19th-century Mughal courtyard haveli offering unforgettable charm and culinary delights.'),
        ('chanakyapuri-del', 'Chanakyapuri Diplomatic Suites', 'Shantipath, Chanakyapuri', 4.8, ['Diplomatic Security', 'Tennis Court', 'Pool', 'Luxury Spa', 'Wi-Fi'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Prestigious diplomatic enclave hotel surrounded by embassies, lush boulevards, and elite security.'),
        ('aerocity-transit-del', 'Aerocity Grand Transit Hotel', 'Asset 5B, Hospitality District, IGI Airport', 4.7, ['Airport Shuttle', 'Soundproof Rooms', '24h Buffet', 'Spa', 'Pool'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'World-class transit sanctuary minutes from Terminal 3 with 24/7 dining and soundproof comfort.'),
        ('lodhi-greens-del', 'Lodhi Greens Boutique Residence', 'Lodhi Road, Near Lodhi Gardens', 4.9, ['Garden View', 'Plunge Pools', 'Art Collection', 'Fine Dining', 'Spa'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Ultra-chic urban resort where every room features a private balcony plunge pool overlooking ancient tombs.'),
        ('cybercity-palace-del', 'CyberCity Executive Tower', 'DLF Phase 2, Gurgaon, NCR', 4.7, ['Metro Direct', 'Executive Club', 'Gym', 'Infinity Pool', 'Wi-Fi'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'State-of-the-art skyscraper hotel in Gurgaon Millennium City tech corridor with sky-bridge access.'),
        ('sundar-nursery-del', 'Sundar Heritage Garden Resort', 'Near Humayun Tomb, Nizamuddin', 4.8, ['Mughal Gardens', 'Heritage Walks', 'Outdoor Dining', 'Pool', 'Wi-Fi'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Breathtaking property bordering UNESCO World Heritage monuments and water channels.'),
        ('hauz-khas-del', 'Hauz Khas Lakeview Studio Hotel', 'Hauz Khas Village Road', 4.6, ['Lake View', 'Rooftop Lounge', 'Wi-Fi', 'Boutique Decor'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Bohemian lifestyle retreat overlooking the medieval 13th-century reservoir and deer park.'),
        ('noida-expressway-del', 'Noida Skyline Grand Oasis', 'Sector 62, Noida, NCR', 4.5, ['Convention Center', 'Pool', 'Gym', 'Multi-Cuisine', 'Wi-Fi'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Expansive business hotel catering to enterprise conferences and modern travelers in Eastern NCR.'),
        ('mehrauli-qutub-del', 'Qutub View Boutique Retreat', 'One Style Mile, Mehrauli', 4.8, ['Qutub Minar View', 'Courtyard Bistro', 'Cocktail Terrace', 'Spa'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Designer stay with rooftop views of the majestic 12th-century victory minaret illuminated at night.')
    ],
    'Jaipur': [
        ('saffron-retreat-raj', 'Saffron Retreat', 'Amer Road, Near Jal Mahal, Jaipur', 4.8, ['Pool', 'Parking', 'Restaurant', 'Breakfast', 'Heritage Walk', 'Wi-Fi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'A warm, heritage-inspired escape close to Jaipur celebrated sights, Amer Fort and Jal Mahal.'),
        ('royal-rajputana-raj', 'Royal Rajputana Palace', 'Prithviraj Road, C-Scheme, Jaipur', 4.9, ['Palace Gardens', 'Pool', 'Fine Dining', 'Spa', 'Wi-Fi', 'Cultural Shows'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Regal hospitality with hand-painted frescoes, lush royal lawns, and authentic Rajasthani royal feasts.'),
        ('lake-pichola-raj', 'Lake Pichola Palace & Spa', 'City Palace Complex, Udaipur', 4.9, ['Lake Pichola View', 'Boat Arrival', 'Royal Butler', 'Spa', 'Pool'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Floating marble wonder in the middle of Lake Pichola with peerless sunset dining and palace vistas.'),
        ('haveli-fatehsagar-raj', 'Fateh Sagar Lakeside Haveli', 'Rani Road, Fateh Sagar, Udaipur', 4.8, ['Lakeside Terrace', 'Pool', 'Folk Music', 'Rooftop Dining', 'Wi-Fi'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Graceful Mewari stone haveli offering sunset vistas across Fateh Sagar lake and Aravalli hills.'),
        ('samode-hills-raj', 'Samode Hills Royal Heritage Haveli', 'Samode Village, Outskirts of Jaipur', 4.8, ['Hillside Pool', 'Camel Safaris', 'Mirror Mosaic Halls', 'Spa'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Fairytale fortress palace famed for its spectacular Sheesh Mahal mirror mosaics and courtyard gardens.'),
        ('jodhpur-sun-raj', 'Blue City Sun Palace', 'Circuit House Road, Jodhpur', 4.8, ['Mehrangarh Fort View', 'Pool', 'Rajasthani Dining', 'Wi-Fi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Grand golden sandstone palace perched high with direct views of the impregnable Mehrangarh Fort.'),
        ('jaisalmer-dunes-raj', 'Jaisalmer Golden Dunes Camp', 'Sam Sand Dunes, Thar Desert, Jaisalmer', 4.9, ['Desert Glamping', 'Folk Dance', 'Camel Safari', 'Stargazing', 'Buffet'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Luxury Swiss desert tents under star-studded Thar desert skies with bonfires and folk melodies.'),
        ('pushkar-oasis-raj', 'Pushkar Sacred Lake Resort', 'Brahma Temple Road, Pushkar', 4.7, ['Lake Ghats Access', 'Ayurveda', 'Swimming Pool', 'Vegetarian Dining'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Spiritual tranquil sanctuary in the holy town of Pushkar with rose gardens and mountain backdrop.'),
        ('neemrana-fort-raj', 'Rajput Fort & Palace Retreat', 'Delhi-Jaipur Highway, Neemrana', 4.8, ['Hanging Gardens', 'Zipline', 'Vintage Cars', 'Stepwell Walks', 'Pool'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', '15th-century stepped fortress climbing tier-by-tier up the hillside with medieval turrets and pools.'),
        ('chhatrasagar-camp-raj', 'Chhatra Sagar Royal Safari Camp', 'Chhatra Sagar Dam, Nimaj, Pali', 4.9, ['Waterfront Tents', 'Birdwatching', 'Farm-to-Table', 'Sunset Boat'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Exclusive bespoke luxury tented camp pitched directly atop an ancient masonry dam over a lake.')
    ],
    'Kerala': [
        ('backwater-whisper-ker', 'Backwater Whisper Resort', 'Vembanad Backwaters, Fort Kochi', 4.9, ['Backwater Cruise', 'Ayurvedic Spa', 'Pool', 'Breakfast', 'Wi-Fi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Tranquil Ayurvedic wellness sanctuary sitting directly on Kerala serene palm-fringed backwaters.'),
        ('fort-kochi-heritage-ker', 'Fort Kochi Colonial Dutch Villa', 'Tower Road, Fort Kochi', 4.7, ['Chinese Fishing Nets View', 'Art Cafe', 'Pool', 'Wi-Fi', 'Bicycle Tours'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Centuries-old Dutch and Portuguese coastal residence walking distance to art galleries and cafes.'),
        ('munnar-mist-ker', 'Munnar Tea Garden Mist Resort', 'Chithirapuram, Munnar Hills', 4.8, ['Tea Garden Views', 'Campfire', 'Trekking', 'Ayurveda', 'Organic Dining'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'High-altitude hill sanctuary wrapped in rolling emerald tea plantations and misty pine forests.'),
        ('alleppey-houseboat-ker', 'Alleppey Royal Houseboat Stays', 'Finishing Point Road, Alleppey', 4.9, ['Private Houseboat', 'Dedicated Chef', 'Cruising', 'Kerala Sadhya'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Traditional teakwood kettuvallam houseboats gliding along canals with private captain and chef.'),
        ('kovalam-cliffs-ker', 'Kovalam Cliff Ocean Sanctuary', 'Lighthouse Beach Road, Kovalam', 4.8, ['Cliffside Pool', 'Ayurvedic Massages', 'Beach Access', 'Sunset Bar'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Panoramic lighthouse cliff views with world-renowned authentic panchakarma healing therapies.'),
        ('wayanad-rainforest-ker', 'Wayanad Rainforest Eco-Lodge', 'Lakkidi Viewpoint Road, Wayanad', 4.7, ['Treehouse Stays', 'Natural Springs', 'Birdwatching', 'Plantation Walk'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Thick tropical jungle canopy retreat with luxury treehouses and organic spice plantation tours.'),
        ('kumarakom-bird-ker', 'Kumarakom Sanctuary Lake Resort', 'Kavanattinkara, Kumarakom', 4.9, ['Lakefront Villas', 'Ayurvedic Center', 'Infinity Pool', 'Sunset Cruises'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Award-winning eco-luxury resort along Vembanad Lake adjacent to the famous bird sanctuary.'),
        ('varkala-helipad-ker', 'Varkala Red Cliff Bohemian Resort', 'North Cliff Helipad Road, Varkala', 4.6, ['Red Cliff Views', 'Surf School', 'Yoga Deck', 'Cafe', 'Wi-Fi'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Vibrant boho resort situated on striking geological red laterite cliffs overlooking crashing surf.'),
        ('thekkady-spice-ker', 'Thekkady Wild Spice Estate', 'Kumily Road, Periyar Tiger Reserve', 4.7, ['Wildlife Safaris', 'Spice Gardens', 'Tribal Dance', 'Pool', 'Wi-Fi'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Fragrant cardamom and pepper estate on the threshold of the famed Periyar National Park.'),
        ('marari-beach-ker', 'Marari Fisherman Beach Villa', 'Mararikulam North, Alappuzha', 4.8, ['Private Beach', 'Butterfly Garden', 'Seafood Grill', 'Hammocks', 'Pool'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'Quiet fishing hamlet retreat with thatched roof cottages, private beach hammocks, and coconut groves.')
    ],
    'Manali': [
        ('snow-peaks-manali', 'Snow Peaks Alpine Lodge', 'Solang Valley Road, Near Old Manali', 4.8, ['Snow View', 'Fireplace', 'Heated Rooms', 'Wi-Fi', 'Trekking Desk', 'Cafe'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'Cozy Himalayan cedar lodge with roaring fireplaces and breathtaking snow-capped mountain vistas.'),
        ('old-manali-wood-man', 'Old Manali Cedar Pine Chalet', 'Club House Road, Old Manali', 4.7, ['River Sound', 'Apple Orchards', 'Wooden Lofts', 'Bakery', 'Wi-Fi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Rustic wooden Swiss chalets hidden amongst whispering Deodar pines and fragrant apple orchards.'),
        ('shimla-mall-him', 'Shimla British Colonial Grand Hotel', 'The Mall Road, Shimla', 4.9, ['Heritage Atrium', 'Toy Train View', 'Tea Room', 'Heated Pool', 'Spa'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'The crown jewel of summer capital Shimla, offering Victorian elegance and panoramic valley views.'),
        ('kasauli-pines-him', 'Kasauli Pine Ridge Retreat', 'Upper Mall Road, Kasauli', 4.6, ['Sunset Point', 'Fire Pit', 'Bird Watching', 'Library', 'Wi-Fi'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Intimate colonial hill retreat perched along quiet pine ridges with views stretching to Punjab plains.'),
        ('dharamshala-zen-him', 'Dharamshala Mountain Zen Lodge', 'Temple Road, McLeod Ganj', 4.8, ['Dhauladhar Views', 'Meditation Hall', 'Tibetan Cafe', 'Wi-Fi', 'Yoga'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', 'Spiritual mountain sanctuary under the towering jagged granite crags of the Dhauladhar range.'),
        ('spiti-highland-him', 'Spiti Valley Stargazer Camp', 'Near Key Monastery, Kaza, Spiti', 4.8, ['Dark Sky Stargazing', 'Telescopes', 'Heated Tents', 'Monastery Tours'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', 'High-altitude moonscape desert retreat famous for crystalline night skies and milky way viewing.'),
        ('rohtang-gateway-him', 'Rohtang Gateway Alpine Hotel', 'Leh-Manali Highway, Palchan', 4.7, ['Glacier Views', 'Ski Rental', 'Hot Springs', 'Heated Rooms', 'Dine-In'], 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80', 'The gateway to Rohtang Pass and Atal Tunnel, offering ski access, hot water springs, and snow views.'),
        ('mashobra-forest-him', 'Mashobra Forest Sanctuary Lodge', 'Gables Road, Mashobra', 4.8, ['Oak Forest Trails', 'Fireplace', 'Heated Spa', 'Valley Views', 'Wi-Fi'], 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', 'Secluded woodland haven deep inside dense cedar forests, far from any urban clamor.'),
        ('naggar-castle-him', 'Naggar Heritage Art Castle', 'Naggar Village, Kullu Valley', 4.7, ['Kathkuni Architecture', 'Art Museum', 'River Beas Views', 'Local Cuisine'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', 'Historic 500-year-old stone-and-timber castle once home to Kullu kings, overlooking the Beas valley.'),
        ('jibt-river-him', 'Jibhi River Trout Wooden Cabin', 'Tirthan Valley Road, Jibhi', 4.8, ['Riverfront Decks', 'Fly Fishing', 'Waterfall Walks', 'Bonfire Pit'], 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', 'Enchanting riverside wooden treehouse cabins right beside a gushing alpine river.')
    ]
}

def generate_rooms(hotel_id, base_price_mult=1.0):
    prices = [int(2200 * base_price_mult), int(3400 * base_price_mult), int(4800 * base_price_mult), int(7900 * base_price_mult)]
    return [
        {'id': f'{hotel_id}-s1', 'room_number': '101', 'type': 'Single', 'capacity': 1, 'base_price': prices[0], 'is_available': True, 'amenities': ['Wi-Fi', 'Garden View', 'Air Conditioning']},
        {'id': f'{hotel_id}-d1', 'room_number': '204', 'type': 'Double', 'capacity': 2, 'base_price': prices[1], 'is_available': True, 'amenities': ['Wi-Fi', 'King Bed', 'Balcony']},
        {'id': f'{hotel_id}-dx1', 'room_number': '308', 'type': 'Deluxe', 'capacity': 2, 'base_price': prices[2], 'is_available': True, 'amenities': ['Panoramic View', 'Mini Bar', 'Bathtub']},
        {'id': f'{hotel_id}-su1', 'room_number': '501', 'type': 'Suite', 'capacity': 4, 'base_price': prices[3], 'is_available': True, 'amenities': ['Private Jacuzzi', 'Living Lounge', 'Butler Service']}
    ]

all_hotels = []
index = 0
for city, hlist in regions.items():
    for h in hlist:
        hid, name, addr, rating, amens, img, desc = h
        mult = 1.0 + ((index % 5) * 0.15)
        rooms = generate_rooms(hid, mult)
        all_hotels.append({
            'id': hid,
            'name': name,
            'city': city,
            'address': addr,
            'rating': rating,
            'amenities': amens,
            'images': [img],
            'description': desc,
            'rooms': rooms
        })
        index += 1

seed_py_content = f'''import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import logging
from backend.database import engine, SessionLocal, Base
from backend.models import User, Hotel, Room, Booking, LoginActivity
from backend.config import settings
from backend.services.auth_service import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("smartstay.seed")

ALL_HOTELS_DATA = {repr(all_hotels)}

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Seed or update Admin User
        admin_email = settings.ADMIN_EMAIL.lower().strip()
        existing_admin = db.query(User).filter((User.email == admin_email) | (User.phone == "+919876543210")).first()
        if not existing_admin:
            logger.info(f"Creating default admin user: {{admin_email}}")
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
            existing_admin.email = admin_email
            existing_admin.role = "admin"
            existing_admin.password_hash = hash_password(settings.ADMIN_PASSWORD)
            db.commit()
            logger.info(f"Admin user {{admin_email}} role ensured as 'admin'.")

        # 2. Seed or Upsert Hotels and Rooms
        logger.info(f"Seeding / updating {{len(ALL_HOTELS_DATA)}} luxury hotels and rooms across India...")
        for hdata in ALL_HOTELS_DATA:
            hotel_id = hdata["id"]
            rooms_list = hdata.get("rooms", [])
            hotel_fields = {{k: v for k, v in hdata.items() if k != "rooms"}}

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
        logger.info(f"All {{len(ALL_HOTELS_DATA)}} hotels and rooms seeded successfully.")

        # 3. Seed Initial Bookings if none exist
        if db.query(Booking).count() == 0:
            logger.info("Seeding initial bookings...")
            bookings_data = [
                {{"id": "BK-10482", "customer": "Aarav Sharma", "hotel": "Grand Orchid Hotel", "room": "Deluxe · 301", "dates": "18–21 Sep", "amount": 17280, "payment": "Paid", "status": "Confirmed"}},
                {{"id": "BK-10481", "customer": "Meera Iyer", "hotel": "The Terrace House", "room": "Double · 204", "dates": "19–20 Sep", "amount": 3840, "payment": "Pending", "status": "Pending"}},
                {{"id": "BK-10480", "customer": "Kabir Singh", "hotel": "Saffron Retreat", "room": "Suite · 206", "dates": "22–25 Sep", "amount": 24480, "payment": "Paid", "status": "Confirmed"}},
                {{"id": "BK-10479", "customer": "Nisha Patel", "hotel": "The Imperial Haven", "room": "Suite · 501", "dates": "17–18 Sep", "amount": 9500, "payment": "Paid", "status": "Confirmed"}},
                {{"id": "BK-10478", "customer": "Rohan Mehta", "hotel": "Azure Bay Beach Resort", "room": "Deluxe · 304", "dates": "25–28 Sep", "amount": 16800, "payment": "Paid", "status": "Confirmed"}},
                {{"id": "BK-10477", "customer": "Ananya Roy", "hotel": "Snow Peaks Alpine Lodge", "room": "Suite · 401", "dates": "1–4 Oct", "amount": 23700, "payment": "Paid", "status": "Confirmed"}},
            ]
            for b in bookings_data:
                db.add(Booking(**b))
            db.commit()
            logger.info("Bookings seeded successfully.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
'''

Path('backend/seed.py').write_text(seed_py_content, encoding='utf-8')
print('backend/seed.py written.')

# Generate mockData.js
mock_hotels_js = []
for h in all_hotels:
    js_rooms = []
    for r in h['rooms']:
        js_rooms.append({
            '_id': r['id'],
            'roomNumber': r['room_number'],
            'type': r['type'],
            'capacity': r['capacity'],
            'basePrice': r['base_price'],
            'isAvailable': r['is_available']
        })
    mock_hotels_js.append({
        '_id': h['id'],
        'name': h['name'],
        'location': {'city': h['city'], 'address': h['address']},
        'rating': h['rating'],
        'amenities': h['amenities'],
        'images': h['images'],
        'description': h['description'],
        'rooms': js_rooms
    })

mock_data_content = f'''export const mockHotels = {json.dumps(mock_hotels_js, indent=2)};

export const bookingRows = [
  {{ id: 'BK-10482', customer: 'Aarav Sharma', hotel: 'Grand Orchid Hotel', room: 'Deluxe · 301', dates: '18–21 Sep', amount: 17280, payment: 'Paid', status: 'Confirmed' }},
  {{ id: 'BK-10481', customer: 'Meera Iyer', hotel: 'The Terrace House', room: 'Double · 204', dates: '19–20 Sep', amount: 3840, payment: 'Pending', status: 'Pending' }},
  {{ id: 'BK-10480', customer: 'Kabir Singh', hotel: 'Saffron Retreat', room: 'Suite · 206', dates: '22–25 Sep', amount: 24480, payment: 'Paid', status: 'Confirmed' }},
  {{ id: 'BK-10479', customer: 'Nisha Patel', hotel: 'The Imperial Haven', room: 'Suite · 501', dates: '17–18 Sep', amount: 9500, payment: 'Paid', status: 'Confirmed' }},
  {{ id: 'BK-10478', customer: 'Rohan Mehta', hotel: 'Azure Bay Beach Resort', room: 'Deluxe · 304', dates: '25–28 Sep', amount: 16800, payment: 'Paid', status: 'Confirmed' }},
  {{ id: 'BK-10477', customer: 'Ananya Roy', hotel: 'Snow Peaks Alpine Lodge', room: 'Suite · 401', dates: '1–4 Oct', amount: 23700, payment: 'Paid', status: 'Confirmed' }},
];

export const analyticsData = [
  {{ name: 'Mon', bookings: 28, revenue: 92000, occupancy: 68 }},
  {{ name: 'Tue', bookings: 34, revenue: 118000, occupancy: 73 }},
  {{ name: 'Wed', bookings: 31, revenue: 109000, occupancy: 71 }},
  {{ name: 'Thu', bookings: 45, revenue: 156000, occupancy: 82 }},
  {{ name: 'Fri', bookings: 62, revenue: 218000, occupancy: 94 }},
  {{ name: 'Sat', bookings: 78, revenue: 276000, occupancy: 98 }},
  {{ name: 'Sun', bookings: 56, revenue: 190000, occupancy: 85 }},
];

export const pricingRows = [
  {{ hotel: 'Grand Orchid Hotel', room: 'Deluxe', base: 4800, dynamic: 5760, demand: 'High', occupancy: 85, status: 'Active' }},
  {{ hotel: 'The Imperial Haven', room: 'Suite', base: 9500, dynamic: 11400, demand: 'High', occupancy: 90, status: 'Active' }},
  {{ hotel: 'The Terrace House', room: 'Double', base: 3200, dynamic: 3520, demand: 'Medium', occupancy: 61, status: 'Active' }},
  {{ hotel: 'Azure Bay Beach Resort', room: 'Deluxe', base: 5600, dynamic: 6720, demand: 'Surge', occupancy: 95, status: 'Active' }},
  {{ hotel: 'Snow Peaks Alpine Lodge', room: 'Suite', base: 7900, dynamic: 9480, demand: 'Peak', occupancy: 92, status: 'Active' }},
  {{ hotel: 'Backwater Whisper Resort', room: 'Suite', base: 8900, dynamic: 10680, demand: 'High', occupancy: 88, status: 'Active' }},
];
'''

Path('src/data/mockData.js').write_text(mock_data_content, encoding='utf-8')
print('src/data/mockData.js written.')
print(f'Total {len(all_hotels)} hotels generated!')
