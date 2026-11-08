# -*- coding: utf-8 -*-
from datetime import datetime
import math

def calculate_jamakkol_test(date_str, time_str, weekday_idx, sun_sign_id, lagna_sign_id):
    # Parse time
    h, m = map(int, time_str.split(':'))
    total_mins = h * 60 + m
    
    # Day / Night
    is_day = (360 <= total_mins < 1080)
    if is_day:
        mins_elapsed = total_mins - 360
        jamam_idx = min(8, mins_elapsed // 90 + 1)
        mins_in_jamam = mins_elapsed % 90
    else:
        mins_elapsed = (total_mins - 1080) if total_mins >= 1080 else (total_mins + 360)
        jamam_idx = min(8, mins_elapsed // 90 + 1)
        mins_in_jamam = mins_elapsed % 90
        
    # Surya Veedhi
    # Sun sign: 0: Chithirai, 1: Vaikasi, 2: Aani, 3: Aadi, 4: Aavani, 5: Purattasi, 6: Aippasi, 7: Karthigai, 8: Margazhi, 9: Thai, 10: Masi, 11: Panguni
    if sun_sign_id in [1, 2, 3, 4]:
        surya_veedhi_sign = 0 # Mesha Veedhi
        veedhi_name = "மேஷ வீதி"
    elif sun_sign_id in [5, 6, 11, 0]:
        surya_veedhi_sign = 1 # Rishaba Veedhi
        veedhi_name = "ரிஷப வீதி"
    else:
        surya_veedhi_sign = 2 # Mithuna Veedhi
        veedhi_name = "மிதுன வீதி"
        
    # Udhayam (Natal Lagna)
    udhayam_sign = lagna_sign_id
    
    # Aaroodam
    aaroodam_sign = (sun_sign_id + jamam_idx - 1) % 12
    aaroodam_deg = int((mins_in_jamam / 90.0) * 30.0)
    aaroodam_min = int(((mins_in_jamam / 90.0) * 30.0 % 1) * 60.0)
    
    # Kavippu
    veedhi_dist = ((surya_veedhi_sign - aaroodam_sign + 12) % 12) + 1
    kavippu_sign = (udhayam_sign + veedhi_dist - 1) % 12
    kavippu_deg = (30 - aaroodam_deg - 1 + 30) % 30
    kavippu_min = (60 - aaroodam_min) % 60
    
    # Jamam Grahas
    JAMAM_GRAHAS = ["Su", "Ma", "Ju", "Me", "Ve", "Sa", "Mo", "Ra"]
    DAY_LORDS_START = {
        0: 0, # Sunday: Su
        1: 6, # Monday: Mo
        2: 1, # Tuesday: Ma
        3: 3, # Wednesday: Me
        4: 2, # Thursday: Ju
        5: 4, # Friday: Ve
        6: 5  # Saturday: Sa
    }
    
    day_start = DAY_LORDS_START.get(weekday_idx, 0)
    if not is_day:
        start_graha_idx = (day_start + 4) % 8
    else:
        start_graha_idx = day_start
        
    curr_jamam_graha_idx = (start_graha_idx + jamam_idx - 1) % 8
    
    outer_signs = [11, 0, 2, 3, 5, 6, 8, 9]
    jamam_planets = []
    for i in range(8):
        p_idx = (curr_jamam_graha_idx + i) % 8
        s_id = outer_signs[i]
        jamam_planets.append({
            "graha": JAMAM_GRAHAS[p_idx],
            "signId": s_id,
            "deg": aaroodam_deg,
            "min": aaroodam_min
        })
        
    return {
        "is_day": is_day,
        "jamam_idx": jamam_idx,
        "mins_in_jamam": mins_in_jamam,
        "veedhi_name": veedhi_name,
        "surya_veedhi_sign": surya_veedhi_sign,
        "udhayam_sign": udhayam_sign,
        "aaroodam_sign": aaroodam_sign,
        "aaroodam_deg": f"{aaroodam_deg}°{aaroodam_min:02d}′",
        "kavippu_sign": kavippu_sign,
        "kavippu_deg": f"{kavippu_deg}°{kavippu_min:02d}′",
        "curr_jamam_lord": JAMAM_GRAHAS[curr_jamam_graha_idx],
        "jamam_planets": jamam_planets
    }

res = calculate_jamakkol_test("1988-04-30", "22:10", 6, 0, 8)
print("Result for 1988-04-30 22:10 Saturday (Lagna Sag, Sun Aries):")
for k, v in res.items():
    if k != "jamam_planets":
        val_str = str(v).encode('ascii', errors='replace').decode('ascii')
        print(f"  {k}: {val_str}")
print(f"  Jamam Planets count: {len(res['jamam_planets'])}")
for jp in res["jamam_planets"]:
    print(f"    Graha {jp['graha']} -> Sign {jp['signId']} @ {jp['deg']}deg {jp['min']}min")
