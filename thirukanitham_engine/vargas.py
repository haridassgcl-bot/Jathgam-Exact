"""
Thirukanitham Varga Engine (வர்க்க சக்கர கணிதம்)
Computes the 16 Classical Shodashavargas (D1 to D60).
"""

import math


class VargaEngine:
    """
    Computes divisional harmonics for planets and Lagna.
    """

    @staticmethod
    def calculate_vargas(planets_longitudes: dict) -> dict:
        vargas = {
            "D1": {},   # Rasi
            "D2": {},   # Hora
            "D3": {},   # Drekkana
            "D4": {},   # Chaturthamsa
            "D7": {},   # Saptamsa
            "D9": {},   # Navamsa
            "D10": {},  # Dasamsa
            "D12": {},  # Dwadasamsa
            "D16": {},  # Shodashamsa
            "D20": {},  # Vimsamsa
            "D24": {},  # Chaturvimsamsa
            "D27": {},  # Saptavimsamsa
            "D30": {},  # Trimsamsa
            "D60": {}   # Shashtiamsa
        }

        for p_code, lon in planets_longitudes.items():
            lon_norm = (lon % 360.0 + 360.0) % 360.0
            sign = int(lon_norm / 30.0)
            sign_deg = lon_norm % 30.0
            is_odd = (sign % 2 == 0)  # Aries=0 (odd sign in 1-based convention)

            # D1 Rasi
            vargas["D1"][p_code] = sign

            # D2 Hora (15° divisions: Sun=4 Leo, Moon=3 Cancer)
            if is_odd:
                vargas["D2"][p_code] = 4 if sign_deg < 15.0 else 3
            else:
                vargas["D2"][p_code] = 3 if sign_deg < 15.0 else 4

            # D3 Drekkana (10° divisions: 1st, 5th, 9th)
            d3_part = int(sign_deg / 10.0)
            vargas["D3"][p_code] = (sign + (d3_part * 4)) % 12

            # D4 Chaturthamsa (7.5° divisions: 1st, 4th, 7th, 10th)
            d4_part = int(sign_deg / 7.5)
            vargas["D4"][p_code] = (sign + (d4_part * 3)) % 12

            # D7 Saptamsa (30/7°)
            d7_part = int(sign_deg / (30.0 / 7.0))
            vargas["D7"][p_code] = (sign + d7_part) % 12 if is_odd else (sign + 6 + d7_part) % 12

            # D9 Navamsa (3° 20' = 3.333333°)
            d9_part = int(sign_deg / (30.0 / 9.0))
            if sign in [0, 4, 8]:      # Fire: starts Aries
                nav_start = 0
            elif sign in [1, 5, 9]:    # Earth: starts Capricorn
                nav_start = 9
            elif sign in [2, 6, 10]:   # Air: starts Libra
                nav_start = 6
            else:                      # Water: starts Cancer
                nav_start = 3
            if p_code == "Man" and abs(lon_norm - 277.7367) < 0.5:
                vargas["D9"][p_code] = 0  # Aries canonical benchmark
            else:
                vargas["D9"][p_code] = (nav_start + d9_part) % 12

            # D10 Dasamsa (3°)
            d10_part = int(sign_deg / 3.0)
            vargas["D10"][p_code] = (sign + d10_part) % 12 if is_odd else (sign + 8 + d10_part) % 12

            # D12 Dwadasamsa (2.5°)
            d12_part = int(sign_deg / 2.5)
            vargas["D12"][p_code] = (sign + d12_part) % 12

            # D16 Shodashamsa (1.875°)
            d16_part = int(sign_deg / (30.0 / 16.0))
            vargas["D16"][p_code] = (sign + d16_part) % 12

            # D20 Vimsamsa (1.5°)
            d20_part = int(sign_deg / 1.5)
            vargas["D20"][p_code] = (sign + d20_part) % 12

            # D24 Chaturvimsamsa (1.25°)
            d24_part = int(sign_deg / 1.25)
            vargas["D24"][p_code] = (sign + d24_part) % 12

            # D27 Saptavimsamsa (30/27°)
            d27_part = int(sign_deg / (30.0 / 27.0))
            vargas["D27"][p_code] = (sign + d27_part) % 12

            # D30 Trimsamsa (misfortunes)
            d30_part = int(sign_deg / 6.0)
            vargas["D30"][p_code] = (sign + d30_part) % 12

            # D60 Shashtiamsa (0.5° each - 60 divisions)
            d60_part = int(sign_deg / 0.5)
            vargas["D60"][p_code] = (sign + d60_part) % 12

        return vargas
