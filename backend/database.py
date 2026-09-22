import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

logger = logging.getLogger("smartstay.database")

def create_db_engine():
    db_url = settings.DATABASE_URL
    
    # Check if a legacy MongoDB connection string is in .env
    if db_url.startswith("mongodb"):
        logger.warning("MongoDB connection string found in .env. Falling back to local SQLite/PostgreSQL.")
        db_url = "sqlite:///./hotel_booking.db"
    elif db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+psycopg2://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}
    
    try:
        eng = create_engine(db_url, pool_pre_ping=True, connect_args=connect_args)
        # Verify connection
        with eng.connect() as conn:
            pass
        logger.info(f"Database connected successfully using: {db_url.split('@')[-1] if '@' in db_url else db_url}")
        return eng
    except Exception as e:
        logger.warning(f"Failed to connect to primary database ({db_url}): {e}")
        logger.warning("Falling back to local SQLite (hotel_booking.db) so the backend can run immediately.")
        fallback_url = "sqlite:///./hotel_booking.db"
        return create_engine(fallback_url, pool_pre_ping=True, connect_args={"check_same_thread": False})

engine = create_db_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
