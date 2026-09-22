import os
import logging
from pathlib import Path
import pandas as pd
import joblib

logger = logging.getLogger("smartstay.pricing")

MODEL_PATH = Path(__file__).resolve().parent.parent.parent / "ml" / "pricing_model.pkl"
_model = None

def get_pricing_model():
    global _model
    if _model is not None:
        return _model
    
    if MODEL_PATH.exists():
        try:
            logger.info(f"Loading dynamic pricing ML model from {MODEL_PATH}...")
            _model = joblib.load(MODEL_PATH)
            logger.info("Dynamic pricing ML model loaded successfully into memory.")
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")
            _model = None
    else:
        logger.warning(f"ML model file not found at {MODEL_PATH}.")
    return _model

def predict_dynamic_price(
    base_price: float,
    demand: float,
    occupancy: float,
    weekend: int,
    season: int,
    lead_days: int,
    rating: float
) -> float:
    """
    Predicts the dynamic room price given market parameters using the preloaded Random Forest model.
    Falls back to mathematical heuristic if model is not loaded.
    """
    model = get_pricing_model()
    if model is not None:
        input_df = pd.DataFrame([{
            "basePrice": float(base_price),
            "demand": float(demand),
            "occupancy": float(occupancy),
            "weekend": int(weekend),
            "season": int(season),
            "leadDays": int(lead_days),
            "rating": float(rating)
        }])
        pred = model.predict(input_df)[0]
        return round(float(pred), 2)
    
    # Heuristic fallback if model pkl is missing
    multiplier = 1.0 + (demand / 200.0) + (0.1 if weekend else 0.0) + (0.15 if season == 2 else 0.05 if season == 1 else 0.0)
    return round(float(base_price * multiplier), 2)
