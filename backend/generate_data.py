import pandas as pd
import numpy as np
import random
import os

# Ensure we are saving in the right place
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, 'hazardous_gas_data.csv')

def generate_synthetic_data(num_samples=5000):
    print(f"🧪 Generating {num_samples} samples of synthetic water data...")
    data = []

    for _ in range(num_samples):
        # 1. Simulate Environmental Inputs
        temperature = round(random.uniform(10, 45), 1)  # 10°C to 45°C
        days = round(random.uniform(1, 30), 1)          # 1 to 30 days
        source_type = random.choice(['Sewage', 'Rainwater'])
        
        # 2. Apply Chemical Logic (Arrhenius Equation)
        k_base = 0.1
        temp_factor = 1.07 ** (temperature - 20)
        decay_rate = k_base * temp_factor

        # 3. Apply Source Logic (Organic Load - L0)
        if source_type == 'Sewage':
            L0 = random.uniform(300, 500)  # High Protein Load -> H2S
        else:
            L0 = random.uniform(50, 150)   # Low Cellulose Load -> Methane

        # 4. Calculate Gas PPM (First-Order Kinetics)
        gas_production = L0 * (1 - np.exp(-decay_rate * days))
        
        # 5. Add Realistic Sensor Noise
        noise = random.uniform(-0.05, 0.05) * gas_production
        final_ppm = round(gas_production + noise, 2)
        final_ppm = max(0, final_ppm)

        data.append([temperature, days, source_type, final_ppm])

    # Save to CSV
    df = pd.DataFrame(data, columns=['Temperature', 'Days_Stagnant', 'Source_Type', 'Gas_PPM'])
    df.to_csv(csv_path, index=False)
    print(f"✅ Success! Dataset saved at: {csv_path}")

if __name__ == "__main__":
    generate_synthetic_data()