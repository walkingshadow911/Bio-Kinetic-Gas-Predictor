import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

# Setup Paths
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, 'hazardous_gas_data.csv')
model_dir = os.path.join(current_dir, '../ml_models')

# Ensure model directory exists
os.makedirs(model_dir, exist_ok=True)

def train_models():
    # 1. Load Data
    if not os.path.exists(csv_path):
        print("❌ Error: CSV file not found. Run generate_data.py first!")
        return
    
    df = pd.read_csv(csv_path)
    print("🧠 Starting Model Training...")

    # --- MODEL 1: SEWAGE (H2S) ---
    print("\n🔹 Training H2S Specialist (Sewage)...")
    sewage_df = df[df['Source_Type'] == 'Sewage']
    X_sewage = sewage_df[['Temperature', 'Days_Stagnant']]
    y_sewage = sewage_df['Gas_PPM']

    model_h2s = RandomForestRegressor(n_estimators=100, random_state=42)
    model_h2s.fit(X_sewage, y_sewage)

    # Save H2S Model
    h2s_path = os.path.join(model_dir, 'h2s_model.pkl')
    joblib.dump(model_h2s, h2s_path)
    print(f"   ✅ Saved H2S model to: {h2s_path}")

    # --- MODEL 2: RAINWATER (Methane) ---
    print("\n🔹 Training Methane Specialist (Rainwater)...")
    rain_df = df[df['Source_Type'] == 'Rainwater']
    X_rain = rain_df[['Temperature', 'Days_Stagnant']]
    y_rain = rain_df['Gas_PPM']

    model_methane = RandomForestRegressor(n_estimators=100, random_state=42)
    model_methane.fit(X_rain, y_rain)

    # Save Methane Model
    methane_path = os.path.join(model_dir, 'methane_model.pkl')
    joblib.dump(model_methane, methane_path)
    print(f"   ✅ Saved Methane model to: {methane_path}")

if __name__ == "__main__":
    train_models()