import logging
from backend.config import settings

logger = logging.getLogger("smartstay.sms")

def send_sms_otp(phone: str, otp: str):
    """
    Sends an SMS OTP or logs it in mock development mode.
    """
    if settings.SMS_PROVIDER == "mock" or not settings.SMS_PROVIDER:
        if settings.DEV_OTP_LOGGING:
            print(f"\n==========================================")
            print(f" [MOCK SMS] OTP for {phone}: {otp}")
            print(f"==========================================\n")
        logger.info(f"[MOCK SMS] OTP for {phone} generated successfully.")
        return True
    
    # Placeholder for live SMS providers (Twilio, Fast2SMS, AWS SNS, etc.)
    logger.info(f"Live SMS sending configured with provider: {settings.SMS_PROVIDER}")
    return True
