import os
from pathlib import Path
from dotenv import load_dotenv

# Load root .env file if it exists
root_env = Path(__file__).resolve().parent.parent / '.env'
if root_env.exists():
    load_dotenv(dotenv_path=root_env)
else:
    load_dotenv()

class Settings:
    PROJECT_NAME: str = "SmartStay Hotel Booking & Dynamic Pricing API"
    VERSION: str = "2.0.0"
    
    # Database configuration
    # Default to PostgreSQL, with graceful fallback to SQLite for local zero-config dev
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hotel_booking")
    
    # Auth & Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "smartstay-secure-jwt-secret-key-production-2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_DAYS: int = 1
    OTP_HASH_SECRET: str = os.getenv("OTP_HASH_SECRET", "smartstay-secure-otp-hash-secret-2026")
    OTP_EXPIRY_SECONDS: int = int(os.getenv("OTP_EXPIRY_SECONDS", "60"))
    ACTIVE_SESSION_TIMEOUT_MINUTES: int = int(os.getenv("ACTIVE_SESSION_TIMEOUT_MINUTES", "30"))
    
    # SMS Configuration
    SMS_PROVIDER: str = os.getenv("SMS_PROVIDER", "mock")
    DEV_OTP_LOGGING: bool = os.getenv("DEV_OTP_LOGGING", "true").lower() in ("true", "1", "yes")
    
    # Default Admin Seed
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Manasa Hegde (Admin)")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "manasalshegde@gmail.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Hegde123@")

settings = Settings()
