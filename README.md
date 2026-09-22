# SmartStay — Hotel Booking & Dynamic Pricing

A responsive React frontend for a hotel-booking system. It provides customer discovery and booking screens plus a protected administration workspace for hotels, rooms, bookings, pricing, users, and analytics.

## Run locally

```bash
npm run dev
```

The project folder contains an ampersand, so the npm scripts deliberately invoke Vite through Node. This keeps the commands working on Windows.

## Main routes

| Area | Routes |
| --- | --- |
| Customer | `/`, `/hotels`, `/hotels/:id`, `/booking`, `/booking/confirmation`, `/dashboard` |
| Authentication | `/login`, `/register` |
| Admin | `/admin`, `/admin/hotels`, `/admin/rooms`, `/admin/bookings`, `/admin/pricing`, `/admin/users`, `/admin/analytics`, `/admin/settings` |

For the demonstration login, tick **Sign in as administrator** to access the protected admin workspace.

## API integration

All frontend requests are centralized in `src/services/api.js` and use Axios. Set the backend endpoint with:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

The service is already prepared for hotel, booking, pricing, and analytics endpoints. When an endpoint is unavailable during frontend development, realistic display-only mock data from `src/data/mockData.js` is used as a fallback. Dynamic prices are never calculated by the React interface; the pricing screen is structured to display API values supplied by the pricing service.

## Backend & Database (FastAPI + PostgreSQL / SQLite)

The backend has been migrated to **Python (FastAPI)** with **SQLAlchemy ORM** supporting **PostgreSQL** (and Supabase) as well as zero-config local SQLite fallback, plus direct in-memory dynamic pricing ML inference (`ml/pricing_model.pkl`).

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Database & Environment

Copy `.env.example` to `.env` and set your PostgreSQL / Supabase connection:

```bash
# Local PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hotel_booking

# Or Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

*(Note: If no PostgreSQL instance is running locally, the backend automatically defaults to local SQLite `hotel_booking.db` so you can test immediately without setup).*

### 3. Seed Database & Start Applications

```bash
# Seed initial administrator, hotels, rooms, and bookings
npm run seed:admin

# Start the FastAPI backend server (http://localhost:5000)
npm run server

# In another terminal, start the React frontend (http://localhost:5173)
npm run dev
```

Interactive OpenAPI Swagger documentation for testing all backend routes is available at:
```
http://localhost:5000/docs
```

## Stack

- **Frontend**: React + Vite + React Router + Tailwind CSS + Recharts + Lucide React
- **Backend**: Python 3 (FastAPI + Uvicorn)
- **Database**: PostgreSQL (or Supabase / SQLite) via SQLAlchemy 2.0 ORM
- **Machine Learning**: Scikit-Learn Random Forest (`pricing_model.pkl`) with in-memory inference
- **Authentication**: JWT Bearer tokens + bcrypt password hashing + HMAC OTP verification

