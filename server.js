import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import hotelRoutes from './routes/hotelRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// Connect to MongoDB
await connectDB();

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/hotels', hotelRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health-check
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'Hotel Booking API is running.' })
);

// 404 fallback (API only — the Vite dev server handles the frontend separately)
app.use('/api/*', (_req, res) =>
  res.status(404).json({ success: false, message: 'API route not found.' })
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
