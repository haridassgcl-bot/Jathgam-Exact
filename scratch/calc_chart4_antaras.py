# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime, timedelta

# Saturn Dasha Saturn Bhukti for Jathagam 4: 2025-04-09 to 2028-04-12
lords = ['Sa', 'Me', 'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju']
names = {'Sa': 'சனி', 'Me': 'புதன்', 'Ke': 'கேது', 'Ve': 'சுக்கிரன்', 'Su': 'சூரியன்', 'Mo': 'சந்திரன்', 'Ma': 'செவ்வாய்', 'Ra': 'ராகு', 'Ju': 'குரு'}
years = {'Sa': 19, 'Me': 17, 'Ke': 7, 'Ve': 20, 'Su': 6, 'Mo': 10, 'Ma': 7, 'Ra': 18, 'Ju': 16}

start = datetime(2025, 4, 9)
cur = start
print("=== ஜாதகம் 4 (சேலம்): சனி தசை சனி புத்தியின் அந்தரங்கள் ===")
for l in lords:
    d_days = (19 * 19 * years[l] / 14400) * 365.2425
    end = cur + timedelta(days=d_days)
    print(names[l] + " அந்தரம்:", cur.strftime("%Y-%m-%d"), "முதல்", end.strftime("%Y-%m-%d"), "வரை")
    cur = end

