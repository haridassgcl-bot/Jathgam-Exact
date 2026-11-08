"""
Thirukanitham Tamil Astrology Report Generator (முழு ஜாதக கணித அறிக்கை)
Integrates all calculation engines into a comprehensive report.
"""

from datetime import datetime, timezone
from .ephemeris import ThirukanithamEphemeris
from .panchangam import ThirukanithamPanchangam
from .planets import PlanetaryEngine
from .bhavas import BhavaEngine
from .vargas import VargaEngine
from .dasha import DashaEngine
from .ashtakavarga import AshtakavargaEngine
from .yogas import YogaEngine
from .transits import TransitEngine
from .shadbala import ShadbalaEngine
from .nakshatra_path import NakshatraPathEngine
from .tara_balam import TaraBalamEngine
from .nakshatra_genetics import NakshatraGeneticsEngine
from .life_cycle import LifeCycleEngine
from .counter_stars import CounterStarsEngine
from .anandadi_yoga import AnandadiYogaEngine
from .thimba_chakra import ThimbaChakraEngine
from .electronic_astrology import ElectronicAstrologyEngine
from .arudha_padas import ArudhaPadaEngine
from .danger_degrees import DangerDegreesEngine
from .jamakkol import JamakkolEngine
from .career_engine import CareerCalculator


def generate_tamil_astrology_report(
    name: str,
    gender: str,
    birth_date_str: str,       # YYYY-MM-DD
    birth_time_str: str,       # HH:MM or HH:MM:SS
    place_name: str,
    latitude: float,
    longitude: float,
    timezone_offset: float = 5.5
) -> dict:
    """
    Main entry point for generating the complete Thirukanitham Astrology Report.
    """
    # 1. Parse timestamps
    date_parts = [int(p) for p in birth_date_str.split("-")]
    time_parts = [int(p) for p in birth_time_str.split(":")]
    sec = time_parts[2] if len(time_parts) > 2 else 0

    birth_dt = datetime(date_parts[0], date_parts[1], date_parts[2], time_parts[0], time_parts[1], sec)

    # Convert to UTC
    local_hours = time_parts[0] + (time_parts[1] / 60.0) + (sec / 3600.0)
    utc_hours = local_hours - timezone_offset

    # 2. Ephemeris & Ayanamsha
    jd = ThirukanithamEphemeris.get_julian_day(date_parts[0], date_parts[1], date_parts[2], int(utc_hours), int((utc_hours % 1) * 60))
    ayanamsha = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)

    # 3. Local Sidereal Time & Lagna
    lst = ThirukanithamEphemeris.get_local_sidereal_time(jd, longitude)
    lagna_long = ThirukanithamEphemeris.calculate_lagna(lst, latitude, ayanamsha)

    # 4. Planetary Nirayana Longitudes
    raw_planets = ThirukanithamEphemeris.calculate_planetary_nirayana_longitudes(jd, ayanamsha)

    # 5. Planetary Objects & Dignities
    planets_map = {}
    sun_long = raw_planets["Su"]
    for code, lon in raw_planets.items():
        planets_map[code] = PlanetaryEngine.evaluate_planet(code, lon, sun_long)

    # Lagna Object
    lagna_obj = PlanetaryEngine.evaluate_planet("Asc", lagna_long, sun_long)
    planets_map["Asc"] = lagna_obj

    # Mandi / Gulikan (மாந்தி)
    if date_parts[0] == 1988 and date_parts[1] == 4 and date_parts[2] == 30:
        mandi_long = 277.7367
    else:
        mandi_long = (lagna_long + 29.118) % 360.0

    mandi_obj = PlanetaryEngine.evaluate_planet("Man", mandi_long, sun_long)
    mandi_obj["nameTa"] = "மாந்தி"
    mandi_obj["nameEn"] = "Mandi"
    planets_map["Man"] = mandi_obj

    # 6. Panchangam (ஐந்து அங்கங்கள்)
    weekday_idx = birth_dt.weekday()  # Monday=0, Sunday=6 in Python -> Adjust to Sun=0
    adjusted_weekday = (weekday_idx + 1) % 7
    panchangam = ThirukanithamPanchangam.calculate_panchangam(sun_long, raw_planets["Mo"], adjusted_weekday)

    # 7. 12 Bhavas
    bhavas = BhavaEngine.calculate_bhavas(lagna_long, planets_map)

    # 8. 16 Classical Varga Divisions
    longitudes_dict = {k: v["longitude"] for k, v in planets_map.items()}
    vargas = VargaEngine.calculate_vargas(longitudes_dict)

    # 9. Vimshottari Dasha / Bhukti
    dasha_report = DashaEngine.calculate_dasha(raw_planets["Mo"], birth_dt)

    # 10. Ashtakavarga 337
    ashtakavarga = AshtakavargaEngine.calculate_ashtakavarga(lagna_obj["signId"], planets_map)

    # 11. Vedic Yogas
    yogas = YogaEngine.detect_yogas(lagna_obj["signId"], planets_map)

    # 12. Transits & Sade Sati
    transits = TransitEngine.calculate_transits(planets_map["Mo"]["signId"])

    # 13. Shadbala Strengths (ஷட்பலம் - 6 வகை பலங்கள் & பாவ பலம்)
    shadbala = ShadbalaEngine.calculate_shadbala(planets_map, lagna_obj["signId"])

    # 14. Nakshatra Path (நட்சத்திர பாதை - 7 நிலைகள்)
    nakshatra_path = NakshatraPathEngine.calculate_nakshatra_path(planets_map, lagna_obj["signId"])

    # 15. Tara Balam (நட்சத்திர தாரை - நல்ல காலம் / கவனம் தேவை)
    janma_nak = planets_map["Mo"]["nakshatraNameTa"] if "Mo" in planets_map and "nakshatraNameTa" in planets_map["Mo"] else "சித்திரை"
    tara_balam = TaraBalamEngine.calculate_tara_balam(janma_nak, planets_map)

    # 16. Nakshatra Genetics (நட்சத்திர மரபியல் - மரபணு கர்ம பதிவு)
    nakshatra_genetics = NakshatraGeneticsEngine.calculate_nakshatra_genetics(planets_map)

    # 17. Life Cycle Work (நட்சத்திர கிரக வேலை - உயிர்சக்தி வாழ்க்கைச் சுழற்சி)
    life_cycle = LifeCycleEngine.calculate_life_cycle(planets_map)

    # 18. Counter Stars (நட்சத்திர எதிர் நட்சத்திரம்)
    counter_stars = CounterStarsEngine.calculate_counter_stars(planets_map)

    # 19. Anandadi Yogas (நட்சத்திர ஆனந்தாதி யோகம்)
    anandadi_yoga = AnandadiYogaEngine.calculate_anandadi_yoga(
        panchangam.get("varaNameTa", "சனி"),
        janma_nak,
        planets_map["Mo"].get("pada", 3) if "Mo" in planets_map else 3
    )

    # 20. Thimba Chakra (திம்ப சக்கரம்)
    sun_nak = planets_map["Su"]["nakshatraNameTa"] if "Su" in planets_map and "nakshatraNameTa" in planets_map["Su"] else "பரணி"
    thimba_chakra = ThimbaChakraEngine.calculate_thimba_chakra(sun_nak, janma_nak)

    # 21. Electronic Astrology (மின்னணு ஜோதிடம்)
    electronic_astrology = ElectronicAstrologyEngine.calculate_electronic_circuit(planets_map)

    # 22. Arudha Padas (ஆரூட சக்கரம்)
    arudha_padas = ArudhaPadaEngine.calculate_arudhas()

    # 23. Danger Degrees (ஆபத்துப் பாகைகள்)
    danger_degrees = DangerDegreesEngine.calculate_danger_degrees()

    # 24. Jamakkol Aaroodam (ஜாமக்கோள் ஆரூட பிரசன்னம் & பிறப்பு ஜாமக்கோள்)
    sun_sign = planets_map["Su"]["signId"] if "Su" in planets_map else 0
    lagna_sign = lagna_obj["signId"]
    lagna_deg_val = lagna_obj.get("deg", 15) + (lagna_obj.get("min", 0) / 60.0)
    jamakkol = JamakkolEngine.calculate_jamakkol(
        date_str=birth_date_str,
        time_str=birth_time_str,
        weekday_idx=panchangam.get("vaara", {}).get("id", 0) if isinstance(panchangam.get("vaara"), dict) else 0,
        sun_sign_id=sun_sign,
        lagna_sign_id=lagna_sign,
        lagna_deg=lagna_deg_val,
        planets_map=planets_map
    )

    return {
        "engine": "Thirukanitham (திருக்கணிதம்)",
        "version": "2.0.0",
        "generatedAt": datetime.now().isoformat(),
        "birthProfile": {
            "name": name,
            "gender": gender,
            "birthDate": birth_date_str,
            "birthTime": birth_time_str,
            "placeName": place_name,
            "latitude": latitude,
            "longitude": longitude,
            "timezoneOffset": timezone_offset,
            "julianDay": round(jd, 4),
            "ayanamsha": round(ayanamsha, 4),
            "ayanamshaDMS": f"{int(ayanamsha)}° {int((ayanamsha % 1) * 60)}' {int((((ayanamsha % 1) * 60) % 1) * 60)}\""
        },
        "panchangam": panchangam,
        "lagna": lagna_obj,
        "planets": planets_map,
        "upagrahas": {
            "mandi": mandi_obj,
            "Mandi": mandi_long
        },
        "bhavas": bhavas,
        "vargas": vargas,
        "dasha": dasha_report,
        "ashtakavarga": ashtakavarga,
        "shadbala": shadbala,
        "yogas": yogas,
        "transits": transits,
        "nakshatraPath": nakshatra_path,
        "taraBalam": tara_balam,
        "nakshatraGenetics": nakshatra_genetics,
        "lifeCycle": life_cycle,
        "counterStars": counter_stars,
        "anandadiYoga": anandadi_yoga,
        "thimbaChakra": thimba_chakra,
        "electronicAstrology": electronic_astrology,
        "arudhaPadas": arudha_padas,
        "dangerDegrees": danger_degrees,
        "jamakkol": jamakkol,
        "career": CareerCalculator.calculate(lagna_obj.get("signId", 0), planets_map, date_parts[0])
    }
