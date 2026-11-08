import sys
sys.path.append('.')
from datetime import datetime, timedelta
from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
from thirukanitham_engine.panchangam import ThirukanithamPanchangam
from thirukanitham_engine.tara_balam import TaraBalamEngine
import json

# Chitra is Janma Nakshatra for Haridass R
# Tara Balam mapping from Chitra (index 13)
# Good Taras: Sampat (2), Kshema (4), Sadhana (6), Mitra (8), Parama Mitra (9)

good_taras = [2, 4, 6, 8, 9]

# Let's search from 2026-11-01 to 2027-02-15
start_date = datetime(2026, 11, 1)
results = []

for day_offset in range(100):
    cur_date = start_date + timedelta(days=day_offset)
    y, m, d = cur_date.year, cur_date.month, cur_date.day
    
    # 09:30 AM local time for Tiruvannamalai (Lon 79.0747, Lat 12.2253)
    utc_hours = 9.5 - 5.5  # 4:00 AM UTC
    jd = ThirukanithamEphemeris.get_julian_day(y, m, d, int(utc_hours), int((utc_hours % 1) * 60))
    ayanamsha = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)
    raw = ThirukanithamEphemeris.calculate_planetary_nirayana_longitudes(jd, ayanamsha)
    
    sun_long = raw['Su']
    moon_long = raw['Mo']
    weekday_idx = cur_date.weekday()
    adj_weekday = (weekday_idx + 1) % 7 # 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    
    panch = ThirukanithamPanchangam.calculate_panchangam(sun_long, moon_long, adj_weekday)
    
    moon_sign = int(moon_long / 30.0) # 0=Mesham ... 6=Thulam, 7=Vrichigam, 1=Rishabham
    # Chandrashtama for Thulam (sign 6) is Rishabham (sign 1)
    if moon_sign == 1:
        continue # Avoid Chandrashtama
        
    nak_idx = panch['nakshatra']['index'] # 0 to 26
    # Chitra is 13
    diff = (nak_idx - 13) % 27
    tara_num = (diff % 9) + 1 # 1 to 9
    
    # Check if Tara is good
    if tara_num not in [2, 4, 6, 8, 9]:
        continue
        
    tithi_num = panch['tithi']['number']
    paksha = panch['tithi']['pakshaEn']
    # Avoid Riktha tithis (4, 9, 14), Amavasya (30/15 Krishna), Ashtami (8)
    if tithi_num in [4, 8, 9, 14]:
        continue
    if paksha == 'Krishna Paksha' and tithi_num > 10:
        continue # Avoid deep waning moon
        
    # Weekdays: Wednesday (Wed=3), Thursday (Thu=4), Friday (Fri=5), Monday (Mon=1)
    if weekday_idx not in [0, 2, 3, 4]: # 0=Mon, 2=Wed, 3=Thu, 4=Fri
        continue
        
    # Tara names
    tara_names = {1: "Janma", 2: "Sampat", 3: "Vipat", 4: "Kshema", 5: "Pratyak", 6: "Sadhana", 7: "Naidhana", 8: "Mitra", 9: "Parama Mitra"}
    weekdays_en = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    results.append({
        "date": cur_date.strftime("%Y-%m-%d"),
        "weekday": weekdays_en[weekday_idx],
        "tithi": panch['tithi']['displayTa'],
        "nakshatra": panch['nakshatra']['displayTa'],
        "tara": tara_names[tara_num],
        "yoga": panch['yoga']['nameTa'],
        "moon_sign": moon_sign
    })

with open('scratch/muhurtham_dates.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Found {len(results)} auspicious dates!")
