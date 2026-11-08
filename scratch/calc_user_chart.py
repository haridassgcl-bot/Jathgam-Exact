# -*- coding: utf-8 -*-
import sys, json
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report(
    name='User',
    gender='male',
    birth_date_str='1988-04-30',
    birth_time_str='22:10',
    place_name='Vandavasi',
    latitude=12.5028,
    longitude=79.6025,
    timezone_offset=5.5
)

print('=== BASIC DETAILS ===')
print('Lagna:', rep['lagna']['signNameTa'], rep['lagna']['displayPosition'])
print('Rasi:', rep['planets']['Mo']['signNameTa'])
print('Nakshatra:', rep['planets']['Mo']['nakshatraNameTa'], rep['planets']['Mo']['pada'])

print('\n=== PLANETARY POSITIONS ===')
for k, v in rep['planets'].items():
    retro = " (வக்கிரம்)" if v.get('isRetrograde') else ""
    combust = " (அஸ்தமனம்)" if v.get('isCombust') else ""
    print(f"{v['nameTa']} ({k}): {v['signNameTa']} {v['displayPosition']} | {v['nakshatraNameTa']} ({v['pada']} பாதம்) | {v['dignityTa']}{retro}{combust}")

print('\n=== DASHA DETAILS ===')
print('Balance at birth:', rep['dasha']['initialBalance'])
print('Current Dasha:', rep['dasha']['currentDasha']['nameTa'], rep['dasha']['currentDasha']['startDate'], 'to', rep['dasha']['currentDasha']['endDate'])
print('Current Bhukti:', rep['dasha']['currentBhukti']['nameTa'], rep['dasha']['currentBhukti']['startDate'], 'to', rep['dasha']['currentBhukti']['endDate'])

print('\n=== CURRENT DASHA BHUKTIS ===')
cur_d = rep['dasha']['currentDasha']
for b in cur_d.get('bhuktis', []):
    print(f"  {b['nameTa']} : {b['startDate']} to {b['endDate']}")

print('\n=== UPCOMING DASHAS ===')
for d in rep['dasha']['timeline']:
    if d['startDate'] >= cur_d['endDate']:
        print(f"\nNEXT DASHA: {d['nameTa']} ({d['startDate']} to {d['endDate']})")
        for b in d.get('bhuktis', []):
            print(f"  {b['nameTa']} : {b['startDate']} to {b['endDate']}")

print('\n=== YOGAS ===')
for y in rep['yogas']:
    print(f"★ {y['nameTa']} - {y.get('descriptionTa', '')}")
