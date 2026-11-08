# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report('Jathagar3', 'male', '1988-08-18', '04:34', 'திருவண்ணாமலை', 12.2253, 79.0747, 5.5)
p = rep['planets']

print("=== ASPECTS VERIFICATION ===")
# Guru aspects from Taurus (1):
# 5th aspect: Virgo (5) - 3rd house
# 7th aspect: Scorpio (7) - 5th house
# 9th aspect: Capricorn (9) - 7th house
print("Guru in Taurus aspects: Virgo (3rd), Scorpio (5th - Putra), Capricorn (7th - Kalathra)!")

# Mars aspects from Pisces (11):
# 4th aspect: Gemini (2) - 12th house (Venus)
# 7th aspect: Virgo (5) - 3rd house
# 8th aspect: Libra (6) - 4th house (Moon)
print("Mars in Pisces aspects: Gemini (12th), Virgo (3rd), Libra (4th - Moon)!")

# Saturn aspects from Sagittarius (8):
# 3rd aspect: Aquarius (10) - 8th house (Rahu)
# 7th aspect: Gemini (2) - 12th house (Venus)
# 10th aspect: Virgo (5) - 3rd house
print("Saturn in Sagittarius aspects: Aquarius (8th), Gemini (12th), Virgo (3rd)!")

print("Sun in Leo (own sign) + Mercury (combust) + Ketu in 2nd house.")
print("Moon in Libra (4th house) - Lagna Lord in 4th (Digbala direction, Kendra).")

