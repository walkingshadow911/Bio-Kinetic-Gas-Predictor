from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# 1. Initialize the App
app = FastAPI(title="Gas Prediction API", version="1.0")

# --- CORS CONFIGURATION ---
# This allows the Next.js frontend to talk to this API from any URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)
# -----------------------------

# 2. Define the Input Data Structure (Schema)
class PredictionRequest(BaseModel):
    temperature: float
    days_stagnant: float
    source_type: str  # Must be "Sewage" or "Rainwater"

# 3. Load Models (Global Variables)
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(current_dir, '../ml_models')

try:
    h2s_model = joblib.load(os.path.join(model_dir, 'h2s_model.pkl'))
    methane_model = joblib.load(os.path.join(model_dir, 'methane_model.pkl'))
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    h2s_model = None
    methane_model = None

# 4. The Prediction Endpoint
@app.post("/predict")
def predict_gas(data: PredictionRequest):
    if not h2s_model or not methane_model:
        raise HTTPException(status_code=500, detail="Models are not loaded.")

    # Prepare input for the model (DataFrame)
    input_df = pd.DataFrame([{
        'Temperature': data.temperature,
        'Days_Stagnant': data.days_stagnant
    }])

    # Logic Router: Pick the right model based on Source Type
    if data.source_type == "Sewage":
        prediction = h2s_model.predict(input_df)[0]
        gas_name = "Hydrogen Sulfide (H2S)"
    elif data.source_type == "Rainwater":
        prediction = methane_model.predict(input_df)[0]
        gas_name = "Methane (CH4)"
    else:
        raise HTTPException(status_code=400, detail="Invalid Source Type. Use 'Sewage' or 'Rainwater'.")

    # 5. Logic Layer: Health Assessment
    # Updated Rule-Based Logic with higher thresholds
    risk_level = "Low"
    health_advice = "No significant risk."
    
    if prediction > 100:
        risk_level = "CRITICAL"
        health_advice = "Evacuate immediately. Toxicity fatal."
    elif prediction > 40:
        risk_level = "High"
        health_advice = "Wear respiratory protection. Irritation likely."
    elif prediction > 20:
        risk_level = "Moderate"
        health_advice = "Ventilation recommended."

    # Return JSON response
    return {
        "predicted_ppm": round(prediction, 2),
        "gas_type": gas_name,
        "risk_level": risk_level,
        "health_advice": health_advice
    }

# Root endpoint to check if server is running
@app.get("/")
def home():
    return {"message": "Gas Prediction API is Running!"}