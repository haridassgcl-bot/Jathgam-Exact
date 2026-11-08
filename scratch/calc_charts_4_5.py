# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

def print_chart_summary(rep, label):
    lagna = rep['lagna']
    planets = rep['planets']
    dasha = rep['dasha']
    print(f"=== {label} ===")
    print(f"Lagna: {lagna['signNameTa']} ({lagna['displayPosition']})")
    print(f"Moon (Rasi): {planets['Mo']['signNameTa']} ({planets['Mo']['displayPosition']}) | Star: {planets['Mo']['nakshatraNameTa']} ({planets['Mo']['pada']})")
    print(f"Current Dasha: {dasha['currentDasha']['nameTa']} ({dasha['currentDasha']['startDate']} to {dasha['currentDasha']['endDate']})")
    print(f"Current Bhukti: {dasha['currentBhukti']['nameTa']} ({dasha['currentBhukti']['startDate']} to {dasha['currentBhukti']['endDate']})")
    print("Planets:")
    for k in ['Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke']:
        p = planets[k]
        h = ((p['signId'] - lagna['signId']) % 12) + 1
        print(f"  {p['nameTa']} ({k}): {p['signNameTa']} | House {h} | Dig: {p['dignityTa']} | Retro: {p['isRetrograde']} | Combust: {p['isCombust']}")
    print("--------------------------------------------------")

c4 = generate_tamil_astrology_report('Jathagar4', 'male', '1988-08-08', '05:25', 'சேலம்', 11.6643, 78.1460, 5.5)
c5 = generate_tamil_astrology_report('Jathagar5', 'male', '1981-10-29', '14:20', 'ஈரோடு', 11.3410, 77.7172, 5.5)

print_chart_summary(c4, "ஜாதகம் 4: 08-08-1988 05:25 AM சேலம்")
print_chart_summary(c5, "ஜாதகம் 5: 29-10-1981 02:20 PM ஈரோடு")

