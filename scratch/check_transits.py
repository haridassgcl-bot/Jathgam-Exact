# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
from datetime import datetime, timezone

e = ThirukanithamEphemeris()
dates = [
    datetime(2023, 6, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2024, 1, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2024, 5, 15, 12, 0, tzinfo=timezone.utc),
    datetime(2024, 11, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2025, 1, 5, 12, 0, tzinfo=timezone.utc),
    datetime(2025, 4, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2025, 6, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2025, 10, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2026, 1, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2026, 6, 1, 12, 0, tzinfo=timezone.utc),
    datetime(2026, 10, 28, 12, 0, tzinfo=timezone.utc),
]
signs = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்']

for dt in dates:
    jd = e.get_julian_day(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)
    ay = e.get_lahiri_ayanamsha(jd)
    p = e.calculate_planetary_nirayana_longitudes(jd, ay)
    ju = signs[int(p['Ju'] // 30)] + f" ({p['Ju']%30:.1f}°)"
    sa = signs[int(p['Sa'] // 30)] + f" ({p['Sa']%30:.1f}°)"
    ra = signs[int(p['Ra'] // 30)] + f" ({p['Ra']%30:.1f}°)"
    print(dt.strftime("%Y-%m-%d") + ": குரு=" + ju + ", சனி=" + sa + ", ராகு=" + ra)
