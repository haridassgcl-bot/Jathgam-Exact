# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from datetime import datetime, timedelta

# Calculate Saturn-Saturn Pratyantara Dashas
# Saturn Mahadasha: 19 years
# Saturn Bhukti: 19 * 19 / 120 = 361/120 = 3.00833 years = 3 years 3 days (2025-01-05 to 2028-01-08)
# Pratyantara dashas within Saturn Bhukti:
# Total days = (datetime(2028, 1, 8) - datetime(2025, 1, 5)).days = 1098 days

lords = [
    ('Saturn', 'சனி', 19),
    ('Mercury', 'புதன்', 17),
    ('Ketu', 'கேது', 7),
    ('Venus', 'சுக்கிரன்', 20),
    ('Sun', 'சூரியன்', 6),
    ('Moon', 'சந்திரன்', 10),
    ('Mars', 'செவ்வாய்', 7),
    ('Rahu', 'ராகு', 18),
    ('Jupiter', 'குரு', 16)
]

start = datetime(2025, 1, 5)
total_days = (datetime(2028, 1, 8) - start).days

cur_date = start
print("=== PRATYANTARA DASHAS OF SATURN-SATURN ===")
for name, name_ta, weight in lords:
    days = (weight / 120.0) * total_days
    end_date = cur_date + timedelta(days=days)
    print(f"{name_ta} அந்தரம்: {cur_date.strftime('%Y-%m-%d')} முதல் {end_date.strftime('%Y-%m-%d')} வரை")
    cur_date = end_date
