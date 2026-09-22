import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.database import engine, Base
from backend.seed import seed_database
from backend.routers import auth, hotels, bookings, pricing, analytics, admin

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("smartstay")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed initial data
    logger.info("Initializing database schemas...")
    Base.metadata.create_all(bind=engine)
    logger.info("Running initial seed check...")
    try:
        seed_database()
    except Exception as e:
        logger.error(f"Seeding error: {e}")
    yield
    # Shutdown
    logger.info("FastAPI backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI + Relational (PostgreSQL/SQLite) Backend with in-memory ML Dynamic Pricing",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(hotels.router)
app.include_router(bookings.router)
app.include_router(pricing.router)
app.include_router(analytics.router)
app.include_router(admin.router)

# Health check
@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "message": "Hotel Booking API is running.",
        "backend": "FastAPI (Python)",
        "database": engine.name
    }

# API 404 Fallback
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def api_404_fallback(path: str):
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": f"API route '/api/{path}' not found."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=5000, reload=True)
