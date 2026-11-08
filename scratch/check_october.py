import sys
sys.path.append('.')
from datetime import datetime
from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
from thirukanitham_engine.panchangam import ThirukanithamPanchangam
import json

dates = [
    ("2026-10-27", "Tuesday"),
    ("2026-10-28", "Wednesday"),
    ("2026-10-29", "Thursday"),
    ("2026-10-30", "Friday"),
    ("2026-10-31", "Saturday")
]

# Chitra nakshatra (index 13) for Haridass R
# Thulam rasi (index 6)
tara_names = {1: "Janma", 2: "Sampat", 3: "Vipat", 4: "Kshema", 5: "Pratyak", 6: "Sadhana", 7: "Naidhana", 8: "Mitra", 9: "Parama Mitra"}
sign_names = ["Mesham", "Rishabham", "Midhunam", "Kadagam", "Simham", "Kanni", "Thulam", "Vrichigam", "Dhanusu", "Makaram", "Kumbham", "Meenam"]

results = []

for d_str, day_name in dates:
    dt = datetime.strptime(d_str, "%Y-%m-%d")
    y, m, d = dt.year, dt.month, dt.day
    
    # Check morning 09:30 AM
    utc_hours = 9.5 - 5.5
    jd = ThirukanithamEphemeris.get_julian_day(y, m, d, int(utc_hours), int((utc_hours % 1) * 60))
    ayanamsha = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)
    raw = ThirukanithamEphemeris.calculate_planetary_nirayana_longitudes(jd, ayanamsha)
    
    weekday_idx = dt.weekday()
    adj_weekday = (weekday_idx + 1) % 7
    panch = ThirukanithamPanchangam.calculate_panchangam(raw['Su'], raw['Mo'], adj_weekday)
    
    nak_idx = panch['nakshatra']['index']
    diff = (nak_idx - 13) % 27
    tara_num = (diff % 9) + 1
    
    moon_sign_idx = int(raw['Mo'] / 30.0)
    
    results.append({
        "date": d_str,
        "weekday": day_name,
        "tithi": panch['tithi']['displayTa'],
        "tithi_num": panch['tithi']['number'],
        "paksha": panch['tithi']['pakshaEn'],
        "nakshatra": panch['nakshatra']['displayTa'],
        "nak_index": nak_idx,
        "tara": tara_names[tara_num],
        "tara_num": tara_num,
        "moon_sign": sign_names[moon_sign_idx],
        "is_chandrashtama": (moon_sign_idx == 1), # Rishabham is Chandrashtama for Thulam
        "yoga": panch['yoga']['nameTa']
    })

with open('scratch/october_dates.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("October analysis written!")
