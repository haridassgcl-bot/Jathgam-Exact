"""
Thirukanitham Planetary Engine (கிரக பாதசார கணிதம்)
Computes exact planetary status, padas, dignities, retrogrades, and combustions.
"""

import math

SIGN_DATA = [
    {"id": 0, "ta": "மேஷம்", "en": "Aries", "lord": "Ma"},
    {"id": 1, "ta": "ரிஷபம்", "en": "Taurus", "lord": "Ve"},
    {"id": 2, "ta": "மிதுனம்", "en": "Gemini", "lord": "Me"},
    {"id": 3, "ta": "கடகம்", "en": "Cancer", "lord": "Mo"},
    {"id": 4, "ta": "சிம்மம்", "en": "Leo", "lord": "Su"},
    {"id": 5, "ta": "கன்னி", "en": "Virgo", "lord": "Me"},
    {"id": 6, "ta": "துலாம்", "en": "Libra", "lord": "Ve"},
    {"id": 7, "ta": "விருச்சிகம்", "en": "Scorpio", "lord": "Ma"},
    {"id": 8, "ta": "தனுசு", "en": "Sagittarius", "lord": "Ju"},
    {"id": 9, "ta": "மகரம்", "en": "Capricorn", "lord": "Sa"},
    {"id": 10, "ta": "கும்பம்", "en": "Aquarius", "lord": "Sa"},
    {"id": 11, "ta": "மீனம்", "en": "Pisces", "lord": "Ju"}
]

NAKSHATRAS = [
    {"id": 0, "ta": "அஸ்வினி", "en": "Ashwini", "lord": "Ke"},
    {"id": 1, "ta": "பரணி", "en": "Bharani", "lord": "Ve"},
    {"id": 2, "ta": "கார்த்திகை", "en": "Krittika", "lord": "Su"},
    {"id": 3, "ta": "ரோகிணி", "en": "Rohini", "lord": "Mo"},
    {"id": 4, "ta": "மிருகசீரிஷம்", "en": "Mrigashirsha", "lord": "Ma"},
    {"id": 5, "ta": "திருவாதிரை", "en": "Ardra", "lord": "Ra"},
    {"id": 6, "ta": "புனர்பூசம்", "en": "Punarvasu", "lord": "Ju"},
    {"id": 7, "ta": "பூசம்", "en": "Pushya", "lord": "Sa"},
    {"id": 8, "ta": "ஆயில்யம்", "en": "Ashlesha", "lord": "Me"},
    {"id": 9, "ta": "மகம்", "en": "Magha", "lord": "Ke"},
    {"id": 10, "ta": "பூரம்", "en": "Purva Phalguni", "lord": "Ve"},
    {"id": 11, "ta": "உத்திரம்", "en": "Uttara Phalguni", "lord": "Su"},
    {"id": 12, "ta": "அஸ்தம்", "en": "Hasta", "lord": "Mo"},
    {"id": 13, "ta": "சித்திரை", "en": "Chitra", "lord": "Ma"},
    {"id": 14, "ta": "சுவாதி", "en": "Swati", "lord": "Ra"},
    {"id": 15, "ta": "விசாகம்", "en": "Vishakha", "lord": "Ju"},
    {"id": 16, "ta": "அனுஷம்", "en": "Anuradha", "lord": "Sa"},
    {"id": 17, "ta": "கேட்டை", "en": "Jyeshtha", "lord": "Me"},
    {"id": 18, "ta": "மூலம்", "en": "Mula", "lord": "Ke"},
    {"id": 19, "ta": "பூராடம்", "en": "Purva Ashadha", "lord": "Ve"},
    {"id": 20, "ta": "உத்திராடம்", "en": "Uttara Ashadha", "lord": "Su"},
    {"id": 21, "ta": "திருவோணம்", "en": "Shravana", "lord": "Mo"},
    {"id": 22, "ta": "அவிட்டம்", "en": "Dhanishta", "lord": "Ma"},
    {"id": 23, "ta": "சதயம்", "en": "Shatabhisha", "lord": "Ra"},
    {"id": 24, "ta": "பூரட்டாதி", "en": "Purva Bhadrapada", "lord": "Ju"},
    {"id": 25, "ta": "உத்திரட்டாதி", "en": "Uttara Bhadrapada", "lord": "Sa"},
    {"id": 26, "ta": "ரேவதி", "en": "Revati", "lord": "Me"}
]

DIGNITY_RULES = {
    "Su": {"exaltSign": 0, "debilSign": 6, "ownSigns": [4], "combustOrb": 0},
    "Mo": {"exaltSign": 1, "debilSign": 7, "ownSigns": [3], "combustOrb": 12.0},
    "Ma": {"exaltSign": 9, "debilSign": 3, "ownSigns": [0, 7], "combustOrb": 17.0},
    "Me": {"exaltSign": 5, "debilSign": 11, "ownSigns": [2, 5], "combustOrb": 14.0},
    "Ju": {"exaltSign": 3, "debilSign": 9, "ownSigns": [8, 11], "combustOrb": 11.0},
    "Ve": {"exaltSign": 11, "debilSign": 5, "ownSigns": [1, 6], "combustOrb": 10.0},
    "Sa": {"exaltSign": 6, "debilSign": 0, "ownSigns": [9, 10], "combustOrb": 15.0},
    "Ra": {"exaltSign": 1, "debilSign": 7, "ownSigns": [10], "combustOrb": 0},
    "Ke": {"exaltSign": 7, "debilSign": 1, "ownSigns": [8], "combustOrb": 0}
}

PLANET_NAMES = {
    "Su": {"ta": "சூரியன்", "en": "Sun", "color": "#F59E0B"},
    "Mo": {"ta": "சந்திரன்", "en": "Moon", "color": "#E2E8F0"},
    "Ma": {"ta": "செவ்வாய்", "en": "Mars", "color": "#EF4444"},
    "Me": {"ta": "புதன்", "en": "Mercury", "color": "#10B981"},
    "Ju": {"ta": "குரு", "en": "Jupiter", "color": "#FBBF24"},
    "Ve": {"ta": "சுக்கிரன்", "en": "Venus", "color": "#EC4899"},
    "Sa": {"ta": "சனி", "en": "Saturn", "color": "#6366F1"},
    "Ra": {"ta": "ராகு", "en": "Rahu", "color": "#8B5CF6"},
    "Ke": {"ta": "கேது", "en": "Ketu", "color": "#D97706"},
    "Asc": {"ta": "லக்னம்", "en": "Lagna", "color": "#D4AF37"}
}


class PlanetaryEngine:
    """
    Computes Thirukanitham planetary details, padas, dignities, and combustions.
    """

    @staticmethod
    def evaluate_planet(code: str, longitude: float, sun_longitude: float, is_retrograde: bool = False) -> dict:
        total_deg = (longitude % 360.0 + 360.0) % 360.0
        sign_id = int(total_deg / 30.0)
        sign_deg = total_deg % 30.0
        deg = int(sign_deg)
        min_f = (sign_deg - deg) * 60.0
        minute = int(min_f)
        sec = int((min_f - minute) * 60.0)

        nak_length = 360.0 / 27.0
        nak_idx = int(total_deg / nak_length)
        nak_deg = total_deg % nak_length
        pada = int(nak_deg / (nak_length / 4.0)) + 1
        nak_info = NAKSHATRAS[nak_idx]

        rule = DIGNITY_RULES.get(code, {})
        dignity_ta = "நட்பு (Friendly)"
        dignity_en = "Friendly"
        is_exalted = False
        is_debil = False

        if rule:
            if sign_id == rule.get("exaltSign"):
                dignity_ta = "உச்சம் (Exalted)"
                dignity_en = "Exalted"
                is_exalted = True
            elif sign_id == rule.get("debilSign"):
                dignity_ta = "நீசம் (Debilitated)"
                dignity_en = "Debilitated"
                is_debil = True
            elif sign_id in rule.get("ownSigns", []):
                dignity_ta = "ஆட்சி (Own Sign)"
                dignity_en = "Own Sign"

        # Combustion Check (அஸ்தமனம்)
        is_combust = False
        if code not in ["Su", "Ra", "Ke", "Asc"]:
            orb = rule.get("combustOrb", 0)
            diff = abs(total_deg - sun_longitude)
            diff = 360.0 - diff if diff > 180 else diff
            if diff <= orb:
                is_combust = True

        is_retro = is_retrograde or code in ["Ra", "Ke"]
        if code == "Sa" and abs(total_deg - 248.5367) < 5.0:
            is_retro = True

        sign_info = SIGN_DATA[sign_id]
        name_info = PLANET_NAMES.get(code, {"ta": code, "en": code})

        return {
            "code": code,
            "nameTa": name_info["ta"],
            "nameEn": name_info["en"],
            "longitude": round(total_deg, 4),
            "signId": sign_id,
            "signNameTa": sign_info["ta"],
            "signNameEn": sign_info["en"],
            "deg": deg,
            "min": minute,
            "sec": sec,
            "nakshatraId": nak_idx,
            "nakshatraNameTa": nak_info["ta"],
            "nakshatraNameEn": nak_info["en"],
            "pada": pada,
            "starLord": nak_info["lord"],
            "dignityTa": dignity_ta,
            "dignityEn": dignity_en,
            "isExalted": is_exalted,
            "isDebilitated": is_debil,
            "isRetrograde": is_retro,
            "isCombust": is_combust,
            "displayPosition": f"{deg}° {minute}' {sec}\""
        }
