# -*- coding: utf-8 -*-
import sys
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

d = rep['dasha']
print("=== DASHA-BHUKTI FROM 2018 TO 2030 ===")
for dasha in d['timeline']:
    for b in dasha.get('bhuktis', []):
        if (b['startDate'] >= '2018-01-01' and b['startDate'] <= '2030-01-01') or (b['endDate'] >= '2018-01-01' and b['endDate'] <= '2030-01-01'):
            print(f"{dasha['nameTa']} தசை - {b['nameTa']} புக்தி: {b['startDate']} முதல் {b['endDate']} வரை")
