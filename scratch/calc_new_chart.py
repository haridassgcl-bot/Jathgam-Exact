# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report(
    name='Jathagar',
    gender='male',
    birth_date_str='1988-01-30',
    birth_time_str='01:30',
    place_name='திருவண்ணாமலை',
    latitude=12.2253,
    longitude=79.0747,
    timezone_offset=5.5
)

planets = rep['planets']
lagna = rep['lagna']

print("=== 30-01-1988 01:30 AM TIRUVANNAMALAI ===")
print("Lagna:", lagna['signNameTa'], lagna['displayPosition'])
print("Moon (Rasi):", planets['Mo']['signNameTa'], planets['Mo']['displayPosition'], "Star:", planets['Mo']['nakshatraNameTa'], planets['Mo']['pada'])
print("Tithi:", rep['panchangam']['tithi']['displayTa'])

print("\n=== PLANET DETAILS ===")
for k in ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke']:
    p = planets[k]
    # Calculate house relative to Scorpio Lagna (signId 7)
    house = ((p['signId'] - lagna['signId']) % 12) + 1
    print(f"{p['nameTa']} ({k}): {p['signNameTa']} ({p['signId']}) {p['displayPosition']} | House from Lagna: {house} | Dignity: {p['dignityTa']} | Star: {p['nakshatraNameTa']} ({p['pada']}) | Retro: {p['isRetrograde']}")

print("\n=== ASPECTS (DRISHTI) & COMBOS ===")
print("1. Mars in Lagna (Scorpio) - Own house (Ruchaka Yoga). Aspects 4th (Aquarius - Me, Ve), 7th (Taurus), 8th (Gemini - Moon).")
print("2. Saturn in 2nd (Sagittarius) - Retrograde with Mandi. Aspects 4th (Aquarius - Me, Ve), 8th (Gemini - Moon), 11th (Virgo - Ketu).")
print("3. Jupiter in 5th (Pisces) - Own house at 29°15'. Aspects 9th (Cancer), 11th (Virgo - Ketu), 1st (Scorpio - Lagna & Mars).")
print("4. Venus & Mercury in 4th (Aquarius). Aspected by Mars (4th aspect) and Saturn (3rd aspect)!")
print("5. Moon in 8th (Gemini) - Aspected by Saturn (7th aspect) and Mars (8th aspect)!")

print("\n=== CURRENT DASHA TIMELINE ===")
d = rep['dasha']
print(f"Current Dasha: {d['currentDasha']['nameTa']} ({d['currentDasha']['startDate']} - {d['currentDasha']['endDate']})")
print(f"Current Bhukti: {d['currentBhukti']['nameTa']} ({d['currentBhukti']['startDate']} - {d['currentBhukti']['endDate']})")
