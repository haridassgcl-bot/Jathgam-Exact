# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report
import json

rep = generate_tamil_astrology_report(
    name='Jathagar3',
    gender='male',
    birth_date_str='1988-08-18',
    birth_time_str='04:34',
    place_name='திருவண்ணாமலை',
    latitude=12.2253,
    longitude=79.0747,
    timezone_offset=5.5
)

lagna = rep['lagna']
planets = rep['planets']
panchangam = rep['panchangam']
dasha = rep['dasha']

print("=== 18-08-1988 04:34 AM TIRUVANNAMALAI ===")
print("Lagna:", lagna['signNameTa'], lagna['displayPosition'])
print("Moon (Rasi):", planets['Mo']['signNameTa'], planets['Mo']['displayPosition'], "Star:", planets['Mo']['nakshatraNameTa'], planets['Mo']['pada'])
print("Tithi:", panchangam['tithi']['displayTa'])

print("\n=== PLANET DETAILS (D1) ===")
for k in ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke']:
    p = planets[k]
    house = ((p['signId'] - lagna['signId']) % 12) + 1
    print(f"{p['nameTa']} ({k}): {p['signNameTa']} ({p['signId']}) {p['displayPosition']} (long: {p['longitude']:.2f}°) | House: {house} | Star: {p['nakshatraNameTa']} ({p['pada']}) | Dig: {p['dignityTa']} | Retro: {p['isRetrograde']} | Combust: {p['isCombust']}")

print("\n=== NAVAMSHA (D9) ===")
d9 = rep['vargas']['D9']
sign_names = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"]
for k, v in d9.items():
    print(f"D9 {k}: {sign_names[v]} ({v})")

print("\n=== DASHA TIMELINE ===")
print("Balance at birth:", dasha['initialBalance'])
print("Current Dasha:", dasha['currentDasha']['nameTa'], f"({dasha['currentDasha']['startDate']} to {dasha['currentDasha']['endDate']})")
print("Current Bhukti:", dasha['currentBhukti']['nameTa'], f"({dasha['currentBhukti']['startDate']} to {dasha['currentBhukti']['endDate']})")

print("\n=== FULL DASHA BREAKDOWN ===")
for d in dasha['timeline']:
    print(f"Dasha: {d['nameTa']} ({d['startDate']} to {d['endDate']})")
    for b in d.get('bhuktis', []):
        print(f"   Bhukti: {b['nameTa']} ({b['startDate']} to {b['endDate']})")

print("\n=== YOGAS ===")
for y in rep['yogas']:
    print(f"- {y['nameTa']}")

