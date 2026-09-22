import mongoose from 'mongoose';

// =============================================================================
// Room sub-document schema (embedded inside Hotel.rooms[])
// =============================================================================
// INTEGRATION NOTES:
//   • basePrice  — read and overridden by the pricing / ML teammate.
//                   Keep the field name exactly as "basePrice".
//   • isAvailable — flipped by the booking teammate's service.
//                   Keep it a plain Boolean on this subdocument (no separate collection).
// =============================================================================

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Room type is required'],
    enum: {
      values: ['Single', 'Double', 'Suite', 'Deluxe'],
      message: '{VALUE} is not a valid room type. Choose from: Single, Double, Suite, Deluxe',
    },
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative'],
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

// =============================================================================
// Hotel schema
// =============================================================================

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    rooms: [roomSchema],
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
hotelSchema.index({ 'location.city': 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ 'rooms.basePrice': 1 });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
