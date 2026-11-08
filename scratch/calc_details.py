# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report('Jathagar', 'male', '1988-04-30', '22:10', 'திருவண்ணாமலை', 12.2253, 79.0747, 5.5)

d = rep['dasha']
for dasha in d['timeline']:
    if dasha['lord'] in ['Ju', 'Sa']:
        print("=== DASHA:", dasha['nameTa'], dasha['startDate'], "to", dasha['endDate'], "===")
        for bhukti in dasha.get('bhuktis', []):
            print("   Bhukti:", bhukti['nameTa'], bhukti['startDate'], "to", bhukti['endDate'])

from datetime import datetime, timedelta

lords = ['Sa', 'Me', 'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju']
names = {'Sa': 'சனி', 'Me': 'புதன்', 'Ke': 'கேது', 'Ve': 'சுக்கிரன்', 'Su': 'சூரியன்', 'Mo': 'சந்திரன்', 'Ma': 'செவ்வாய்', 'Ra': 'ராகு', 'Ju': 'குரு'}
years = {'Sa': 19, 'Me': 17, 'Ke': 7, 'Ve': 20, 'Su': 6, 'Mo': 10, 'Ma': 7, 'Ra': 18, 'Ju': 16}

start = datetime(2025, 1, 5)
cur = start
print("\n=== சனியில் சனி புத்தியின் அந்தரங்கள் (Antardashas) ===")
for l in lords:
    d_days = (19 * 19 * years[l] / 14400) * 365.2425
    end = cur + timedelta(days=d_days)
    print(names[l] + " அந்தரம்:", cur.strftime("%Y-%m-%d"), "முதல்", end.strftime("%Y-%m-%d"), "வரை")
    cur = end
