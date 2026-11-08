"""
Thirukanitham Transit Engine (கோச்சார கணிதம்)
Computes real-time Gochar transits, Sade Sati (ஏழரை சனி), Ashtama Sani, and Guru Kataksham.
"""

class TransitEngine:
    """
    Evaluates live planetary transits against the natal Moon (Janma Rasi).
    """

    @staticmethod
    def calculate_transits(natal_moon_sign: int) -> dict:
        # Astronomical transit positions for 2026
        # Saturn in Pisces (11), Jupiter in Cancer (3), Rahu in Aquarius (10), Ketu in Leo (4)
        transit_positions = {
            "Sa": {"signId": 11, "nameTa": "சனி (மீனம்)", "nameEn": "Saturn (Pisces)"},
            "Ju": {"signId": 3,  "nameTa": "குரு (கடகம்)", "nameEn": "Jupiter (Cancer)"},
            "Ra": {"signId": 10, "nameTa": "ராகு (கும்பம்)", "nameEn": "Rahu (Aquarius)"},
            "Ke": {"signId": 4,  "nameTa": "கேது (சிம்மம்)", "nameEn": "Ketu (Leo)"}
        }

        # Check Sade Sati (ஏழரை சனி)
        diff_sa = (11 - natal_moon_sign + 12) % 12
        sade_sati = {
            "hasSadeSati": False,
            "phaseTa": "ஏழரை சனி இல்லை",
            "phaseEn": "No Sade Sati active",
            "descTa": "சனி பகவான் சந்திர ராசிக்கு சுப தூரத்தில் சஞ்சரிப்பதால் எவ்வித பாதிப்பும் இல்லை."
        }

        if diff_sa == 11:
            sade_sati = {
                "hasSadeSati": True,
                "phaseTa": "விரைய சனி (தொடக்க நிலை - 1-ம் சுற்று)",
                "phaseEn": "Rising Phase (12th House Transit)",
                "descTa": "12-ம் இடத்தில் சனி சஞ்சரிப்பதால் செலவுகள் மற்றும் பயணங்கள் அதிகரிக்கும். திருநள்ளாறு வழிபாடு நலம்."
            }
        elif diff_sa == 0:
            sade_sati = {
                "hasSadeSati": True,
                "phaseTa": "ஜென்ம சனி (உச்ச நிலை)",
                "phaseEn": "Janma Sani (Peak Phase)",
                "descTa": "ஜென்ம ராசியிலேயே சனி சஞ்சரிப்பதால் மன அமைதியும் நிதானமும் தேவை. தர்ம வழியில் நடப்பது நன்மை தரும்."
            }
        elif diff_sa == 1:
            sade_sati = {
                "hasSadeSati": True,
                "phaseTa": "பாத சனி (முடிவு நிலை)",
                "phaseEn": "Setting Phase (2nd House)",
                "descTa": "2-ம் இடத்தில் சனி சஞ்சரிப்பதால் பேச்சிலும் குடும்ப பணப் பரிவர்த்தனைகளிலும் எச்சரிக்கை நலம்."
            }
        elif diff_sa == 7:
            sade_sati = {
                "hasSadeSati": True,
                "phaseTa": "அஷ்டம சனி (8-ம் இடம்)",
                "phaseEn": "Ashtama Sani (8th House)",
                "descTa": "எட்டாம் இடத்தில் சனி சஞ்சரிப்பதால் புதிய ஒப்பந்தங்கள் மற்றும் வாகனப் பயணங்களில் கவனம் தேவை."
            }

        # Check Guru Transit (குரு பலன்)
        diff_ju = (3 - natal_moon_sign + 12) % 12 + 1
        has_guru_balam = diff_ju in [2, 5, 7, 9, 11]

        return {
            "transitPositions": transit_positions,
            "sadeSati": sade_sati,
            "guruTransit": {
                "houseFromMoon": diff_ju,
                "hasGuruBalam": has_guru_balam,
                "statusTa": "குரு பலன் உள்ளது (சுப யோகம்)" if has_guru_balam else "குரு பலன் சாதாரண நிலை",
                "descTa": f"சந்திர ராசிக்கு {diff_ju}-ம் இடத்தில் குரு பகவான் சஞ்சரிக்கிறார்."
            }
        }
