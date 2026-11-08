# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report('Jathagar', 'male', '1988-04-30', '22:10', 'திருவண்ணாமலை', 12.2253, 79.0747, 5.5)

d = rep['dasha']
for dasha in d['timeline']:
    if dasha['lord'] == 'Sa':
        print("Sani Dasa Bhuktis:")
        for b in dasha.get('bhuktis', []):
            print(f"  Bhukti: {b['nameTa']} ({b['startDate']} to {b['endDate']})")

