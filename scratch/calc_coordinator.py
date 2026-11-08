# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report(
    name='Coordinator',
    gender='male',
    birth_date_str='1984-04-02',
    birth_time_str='00:15',
    place_name='Chennai',
    latitude=13.0827,
    longitude=80.2707,
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

print('\n=== TIMELINE (2018 - 2028) ===')
for dasha in rep['dasha']['timeline']:
    for b in dasha.get('bhuktis', []):
        if (b['startDate'] >= '2018-01-01' and b['startDate'] <= '2028-01-01') or (b['endDate'] >= '2018-01-01' and b['endDate'] <= '2028-01-01'):
            print(f"{dasha['nameTa']} தசை - {b['nameTa']} புக்தி: {b['startDate']} முதல் {b['endDate']} வரை")
