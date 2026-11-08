# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

c4 = generate_tamil_astrology_report('Jathagar4', 'male', '1988-08-08', '05:25', 'சேலம்', 11.6643, 78.1460, 5.5)
c5 = generate_tamil_astrology_report('Jathagar5', 'male', '1981-10-29', '14:20', 'ஈரோடு', 11.3410, 77.7172, 5.5)

print("=== JATHAGAM 4 (08-08-1988 SALEM) DASHA/BHUKTI ===")
d4 = c4['dasha']
for d in d4['timeline']:
    if d['lord'] == 'Sa':
        print(f"Dasha: {d['nameTa']} ({d['startDate']} to {d['endDate']})")
        for b in d.get('bhuktis', []):
            print(f"   Bhukti: {b['nameTa']} ({b['startDate']} to {b['endDate']})")

print("\n=== JATHAGAM 5 (29-10-1981 ERODE) DASHA/BHUKTI ===")
d5 = c5['dasha']
for d in d5['timeline']:
    if d['lord'] in ['Ke', 'Ve']:
        print(f"Dasha: {d['nameTa']} ({d['startDate']} to {d['endDate']})")
        for b in d.get('bhuktis', []):
            print(f"   Bhukti: {b['nameTa']} ({b['startDate']} to {b['endDate']})")

