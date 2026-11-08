import sys
sys.path.append('.')
from datetime import datetime, timedelta
from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
from thirukanitham_engine.panchangam import ThirukanithamPanchangam
import json

dates_to_inspect = [
    ("2026-11-16", "Monday"),
    ("2026-11-20", "Friday"),
    ("2026-12-16", "Wednesday"),
    ("2027-01-20", "Wednesday"),
    ("2027-01-21", "Thursday"),
    ("2027-01-22", "Friday"),
    ("2027-01-27", "Wednesday"),
    ("2027-01-28", "Thursday"),
    ("2027-02-08", "Monday"),
    ("2027-02-10", "Wednesday")
]

detailed = []

for d_str, day_name in dates_to_inspect:
    dt = datetime.strptime(d_str, "%Y-%m-%d")
    y, m, d = dt.year, dt.month, dt.day
    
    # Check at 09:15 AM
    utc_hours = 9.25 - 5.5
    jd = ThirukanithamEphemeris.get_julian_day(y, m, d, int(utc_hours), int((utc_hours % 1) * 60))
    ayanamsha = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)
    raw = ThirukanithamEphemeris.calculate_planetary_nirayana_longitudes(jd, ayanamsha)
    
    weekday_idx = dt.weekday()
    adj_weekday = (weekday_idx + 1) % 7
    panch = ThirukanithamPanchangam.calculate_panchangam(raw['Su'], raw['Mo'], adj_weekday)
    
    nak_idx = panch['nakshatra']['index']
    diff = (nak_idx - 13) % 27
    tara_num = (diff % 9) + 1
    tara_names = {1: "Janma", 2: "Sampat", 3: "Vipat", 4: "Kshema", 5: "Pratyak", 6: "Sadhana", 7: "Naidhana", 8: "Mitra", 9: "Parama Mitra"}
    
    detailed.append({
        "date": d_str,
        "weekday": day_name,
        "tithi": panch['tithi']['displayTa'],
        "nakshatra": panch['nakshatra']['displayTa'],
        "tara": tara_names[tara_num],
        "sun_sign": int(raw['Su'] / 30.0),
        "moon_sign": int(raw['Mo'] / 30.0)
    })

with open('scratch/muhurtham_detailed.json', 'w', encoding='utf-8') as f:
    json.dump(detailed, f, ensure_ascii=False, indent=2)

print("Detailed check done!")
