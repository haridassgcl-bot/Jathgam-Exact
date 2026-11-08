import sys
sys.path.append('.')
from datetime import datetime
from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
from thirukanitham_engine.panchangam import ThirukanithamPanchangam

# October 30, 2026 (Friday)
# Friday Sunrise ~ 06:05 AM in Tamil Nadu
# Rahu Kalam: 10:30 AM to 12:00 PM
# Yamagandam: 03:00 PM to 04:30 PM
# Kuligai: 07:30 AM to 09:00 AM

# Horai sequence on Friday starting from 06:00 AM:
# 06:00 - 07:00: Sukra (வெள்ளி)
# 07:00 - 08:00: Budhan (புதன்)
# 08:00 - 09:00: Chandran (சந்திரன்)
# 09:00 - 10:00: Sani (சனி)
# 10:00 - 11:00: Guru (குரு) - (Wait, Rahu kalam begins at 10:30) -> 10:00 to 10:30 Guru Horai is great!
# But what about morning Sukra Horai or Budha Horai?
# 06:15 - 07:00 AM: Sukra Horai (Early morning pooja / launch)
# 09:15 - 10:15 AM: Sani / Guru Horai
# Evening:
# 01:30 - 02:30 PM: Sukra Horai
# 08:00 - 09:00 PM: Guru Horai

print("Calculated horais for 30 Oct 2026!")
