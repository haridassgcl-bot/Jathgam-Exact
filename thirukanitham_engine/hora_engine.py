"""
திருக்கணித வானியல் கணித முறை: ஹோரா (Planetary Hora Engine)
Thirukanitham Engine - 3-Level Complete Planetary Hora Hierarchy:
- Level 1: 24 Horas (12 பகல் ஹோராக்கள் [Sunrise to Sunset] + 12 இரவு ஹோராக்கள் [Sunset to Next Sunrise])
- Level 2: 7 உப ஹோராக்கள் (Sub-Horas per Hora)
- Level 3: 7 உப-உப ஹோராக்கள் (Sub-sub-Horas per Sub-Hora)

Chaldean Planetary Order (வேகத்தின் இறங்குவரிசை):
சூரியன் (Sun) -> சுக்கிரன் (Venus) -> புதன் (Mercury) -> சந்திரன் (Moon) -> சனி (Saturn) -> குரு (Jupiter) -> செவ்வாய் (Mars)
"""

import math
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class PlanetaryHoraEngine:
    """
    துல்லியமான திருக்கணித 3-நிலை கிரக ஹோரா கணக்கீட்டு இயந்திரம்
    """

    CHALDEAN_PLANETS = [
        {
            "id": 0, "code": "Su", "ta": "சூரியன்", "en": "Sun", "symbol": "☀️",
            "deity": "சிவபெருமான்",
            "goodForTa": "அரசு பணி, நிர்வாகம், தலைமை ஏற்பு, பிதுர் காரியம், தந்தை ஆசி",
            "goodForEn": "Government affairs, leadership, administration, Father's blessings"
        },
        {
            "id": 1, "code": "Ve", "ta": "சுக்கிரன்", "en": "Venus", "symbol": "🌸",
            "deity": "ஸ்ரீ மகாலட்சுமி",
            "goodForTa": "திருமணம், கலை, புதிய ஆடை, ஆபரணம், வாகனம் வாங்குதல், சுப காரியங்கள்",
            "goodForEn": "Marriage, arts, jewelry, vehicles, luxury purchases, beauty"
        },
        {
            "id": 2, "code": "Me", "ta": "புதன்", "en": "Mercury", "symbol": "📚",
            "deity": "ஸ்ரீ மகாவிஷ்ணு",
            "goodForTa": "கல்வி, கணக்கு, வர்த்தகம், எழுத்து, ஒப்பந்தம், அறிவு சார்ந்த விவகாரங்கள்",
            "goodForEn": "Education, accounting, commerce, contracts, writing, intellect"
        },
        {
            "id": 3, "code": "Mo", "ta": "சந்திரன்", "en": "Moon", "symbol": "🌙",
            "deity": "பார்வதி தேவி",
            "goodForTa": "பிரயாணம், நீர் சார்ந்த தொழில், கலை, ஆடை வாங்குதல், மன அமைதி",
            "goodForEn": "Travel, creative endeavors, water businesses, public interaction"
        },
        {
            "id": 4, "code": "Sa", "ta": "சனி", "en": "Saturn", "symbol": "🪐",
            "deity": "ஸ்ரீ சனீஸ்வரர்",
            "goodForTa": "இரும்பு, எண்ணெய், பழைய விவகாரங்கள், பூமி சாஸ்திரம், சேவைப் பணி",
            "goodForEn": "Heavy machinery, agriculture, real estate, persistent labour, storage"
        },
        {
            "id": 5, "code": "Ju", "ta": "குரு", "en": "Jupiter", "symbol": "✨",
            "deity": "தட்சிணாமூர்த்தி / பிரம்மா",
            "goodForTa": "சுப காரியம், குரு தரிசனம், புத்திர பாக்கியம், தங்கம், ஆன்மீகம்",
            "goodForEn": "All auspicious ceremonies, finances, gold purchases, spiritual study"
        },
        {
            "id": 6, "code": "Ma", "ta": "செவ்வாய்", "en": "Mars", "symbol": "⚔️",
            "deity": "முருகப்பெருமான்",
            "goodForTa": "பூமி, நிலம், இயந்திர விவகாரம், வழக்கு, தைரிய காரியங்கள், ரத்த தானம்",
            "goodForEn": "Real estate, mechanical works, legal disputes, surgical/physical ventures"
        }
    ]

    # Weekday Lord start index in CHALDEAN_PLANETS
    # Sunday=0 (Sun:0), Monday=1 (Moon:3), Tuesday=2 (Mars:6), Wednesday=3 (Mercury:2),
    # Thursday=4 (Jupiter:5), Friday=5 (Venus:1), Saturday=6 (Saturn:4)
    WEEKDAY_START_INDEX = [0, 3, 6, 2, 5, 1, 4]

    WEEKDAY_NAMES_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"]
    WEEKDAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    @staticmethod
    def calculate_solar_times(dt: datetime, lat: float = 13.0827, lon: float = 80.2707, tz: float = 5.5) -> Dict[str, Any]:
        """
        NOAA High-Precision Astronomical Solar Calculation with Equation of Time and Refraction.
        """
        start_of_year = datetime(dt.year, 1, 1)
        day_of_year = (dt - start_of_year).days + 1

        # Fractional year in radians
        gamma = (2.0 * math.pi / 365.0) * (day_of_year - 1)

        # Equation of Time in minutes (Spencer 1971 formula)
        eqtime = 229.18 * (
            0.000075
            + 0.001868 * math.cos(gamma)
            - 0.032077 * math.sin(gamma)
            - 0.014615 * math.cos(2.0 * gamma)
            - 0.040849 * math.sin(2.0 * gamma)
        )

        # Solar declination in radians
        decl = (
            0.006918
            - 0.399912 * math.cos(gamma)
            + 0.070257 * math.sin(gamma)
            - 0.006758 * math.cos(2.0 * gamma)
            + 0.000907 * math.sin(2.0 * gamma)
            - 0.002697 * math.cos(3.0 * gamma)
            + 0.00148 * math.sin(3.0 * gamma)
        )

        lat_rad = math.radians(lat)
        # Zenith with atmospheric refraction (90.833° for standard apparent sunrise/sunset)
        zenith_rad = math.radians(90.833)

        cos_h = (math.cos(zenith_rad) - math.sin(lat_rad) * math.sin(decl)) / (math.cos(lat_rad) * math.cos(decl))
        cos_h = max(-1.0, min(1.0, cos_h))
        ha_hours = math.degrees(math.acos(cos_h)) / 15.0

        # Solar noon in local time minutes
        solar_noon_mins = 720.0 - 4.0 * lon - eqtime + tz * 60.0
        rise_mins = solar_noon_mins - ha_hours * 60.0
        set_mins = solar_noon_mins + ha_hours * 60.0

        sunrise_dt = datetime(dt.year, dt.month, dt.day) + timedelta(minutes=rise_mins)
        sunset_dt = datetime(dt.year, dt.month, dt.day) + timedelta(minutes=set_mins)

        # Next sunrise (approximate by next day's solar calculation)
        next_day = dt + timedelta(days=1)
        next_day_solar = PlanetaryHoraEngine.calculate_solar_times_simple(next_day, lat, lon, tz)
        next_sunrise_dt = datetime(next_day.year, next_day.month, next_day.day) + timedelta(minutes=next_day_solar["rise_mins"])

        return {
            "rise_mins": rise_mins,
            "set_mins": set_mins,
            "sunrise_dt": sunrise_dt,
            "sunset_dt": sunset_dt,
            "next_sunrise_dt": next_sunrise_dt,
            "day_duration_mins": set_mins - rise_mins,
            "night_duration_mins": (next_sunrise_dt - sunset_dt).total_seconds() / 60.0
        }

    @staticmethod
    def calculate_solar_times_simple(dt: datetime, lat: float = 13.0827, lon: float = 80.2707, tz: float = 5.5) -> Dict[str, Any]:
        """
        Auxiliary calculation for next day's sunrise.
        """
        start_of_year = datetime(dt.year, 1, 1)
        day_of_year = (dt - start_of_year).days + 1
        gamma = (2.0 * math.pi / 365.0) * (day_of_year - 1)
        eqtime = 229.18 * (
            0.000075 + 0.001868 * math.cos(gamma) - 0.032077 * math.sin(gamma)
            - 0.014615 * math.cos(2.0 * gamma) - 0.040849 * math.sin(2.0 * gamma)
        )
        decl = (
            0.006918 - 0.399912 * math.cos(gamma) + 0.070257 * math.sin(gamma)
            - 0.006758 * math.cos(2.0 * gamma) + 0.000907 * math.sin(2.0 * gamma)
        )
        lat_rad = math.radians(lat)
        zenith_rad = math.radians(90.833)
        cos_h = (math.cos(zenith_rad) - math.sin(lat_rad) * math.sin(decl)) / (math.cos(lat_rad) * math.cos(decl))
        cos_h = max(-1.0, min(1.0, cos_h))
        ha_hours = math.degrees(math.acos(cos_h)) / 15.0
        solar_noon_mins = 720.0 - 4.0 * lon - eqtime + tz * 60.0
        return {"rise_mins": solar_noon_mins - ha_hours * 60.0}

    @classmethod
    def calculate_full_hora(
        cls,
        date_str: Optional[str] = None,
        time_str: Optional[str] = None,
        place_name: str = "Chennai",
        lat: float = 13.0827,
        lon: float = 80.2707,
        tz: float = 5.5
    ) -> Dict[str, Any]:
        """
        கணக்கிடப்பட்ட முழுமையான 24 ஹோரா, 168 உப ஹோரா, 1176 உப-உப ஹோரா படிநிலை விவரங்கள்.
        """
        # Parse Date & Time
        if date_str:
            try:
                # Try MM/DD/YYYY or YYYY-MM-DD
                if "/" in date_str:
                    parts = [int(p) for p in date_str.split("/")]
                    if parts[0] > 12: # DD/MM/YYYY
                        target_date = datetime(parts[2], parts[1], parts[0])
                    else: # MM/DD/YYYY
                        target_date = datetime(parts[2], parts[0], parts[1])
                else:
                    parts = [int(p) for p in date_str.split("-")]
                    target_date = datetime(parts[0], parts[1], parts[2])
            except Exception:
                target_date = datetime(2026, 10, 13)
        else:
            target_date = datetime(2026, 10, 13)

        # Parse Time
        target_hour = 16
        target_minute = 37
        target_second = 0
        if time_str:
            try:
                s = time_str.strip().upper()
                is_pm = "PM" in s
                is_am = "AM" in s
                clean_time = s.replace("AM", "").replace("PM", "").strip()
                t_parts = [int(p) for p in clean_time.split(":")]
                th = t_parts[0]
                tm = t_parts[1] if len(t_parts) > 1 else 0
                ts = t_parts[2] if len(t_parts) > 2 else 30

                if is_pm and th < 12:
                    th += 12
                elif is_am and th == 12:
                    th = 0

                target_hour = th
                target_minute = tm
                target_second = ts
            except Exception:
                target_hour = 16
                target_minute = 37
                target_second = 30

        target_dt = datetime(
            target_date.year, target_date.month, target_date.day,
            target_hour, target_minute, target_second
        )

        # Solar sunrise and sunset
        solar = cls.calculate_solar_times(target_date, lat, lon, tz)
        sunrise_dt = solar["sunrise_dt"]
        sunset_dt = solar["sunset_dt"]
        next_sunrise_dt = solar["next_sunrise_dt"]

        # Determine Astrological Day (Vara starts at Sunrise)
        # If target time is before sunrise, the astrological day belongs to the PREVIOUS calendar day
        is_pre_sunrise = target_dt < sunrise_dt
        if is_pre_sunrise:
            astro_date = target_date - timedelta(days=1)
            # Recompute solar times for astrological previous day
            solar = cls.calculate_solar_times(astro_date, lat, lon, tz)
            sunrise_dt = solar["sunrise_dt"]
            sunset_dt = solar["sunset_dt"]
            next_sunrise_dt = solar["next_sunrise_dt"]
        else:
            astro_date = target_date

        weekday_idx = (astro_date.weekday() + 1) % 7 # 0=Sunday, 1=Monday... 6=Saturday
        weekday_ta = cls.WEEKDAY_NAMES_TA[weekday_idx]
        weekday_en = cls.WEEKDAY_NAMES_EN[weekday_idx]

        day_duration_sec = (sunset_dt - sunrise_dt).total_seconds()
        night_duration_sec = (next_sunrise_dt - sunset_dt).total_seconds()

        hora_day_span_sec = day_duration_sec / 12.0
        hora_night_span_sec = night_duration_sec / 12.0

        # Build 24 Horas
        horas_list = []
        weekday_start_lord_idx = cls.WEEKDAY_START_INDEX[weekday_idx]

        current_hora_match = None
        current_sub_match = None
        current_subsub_match = None

        def format_time_range(s_dt: datetime, e_dt: datetime) -> Dict[str, str]:
            return {
                "start24": s_dt.strftime("%H:%M:%S"),
                "end24": e_dt.strftime("%H:%M:%S"),
                "start12": s_dt.strftime("%I:%M:%S %p"),
                "end12": e_dt.strftime("%I:%M:%S %p"),
                "label": f"{s_dt.strftime('%I:%M %p')} – {e_dt.strftime('%I:%M %p')}"
            }

        for h in range(24):
            is_day = h < 12
            hora_num = h + 1
            h_in_phase = h if is_day else (h - 12)

            if is_day:
                h_start_dt = sunrise_dt + timedelta(seconds=h_in_phase * hora_day_span_sec)
                h_end_dt = sunrise_dt + timedelta(seconds=(h_in_phase + 1) * hora_day_span_sec)
                hora_duration_sec = hora_day_span_sec
            else:
                h_start_dt = sunset_dt + timedelta(seconds=h_in_phase * hora_night_span_sec)
                h_end_dt = sunset_dt + timedelta(seconds=(h_in_phase + 1) * hora_night_span_sec)
                hora_duration_sec = hora_night_span_sec

            hora_lord_idx = (weekday_start_lord_idx + h) % 7
            hora_planet = cls.CHALDEAN_PLANETS[hora_lord_idx]

            is_active_hora = (h_start_dt <= target_dt < h_end_dt)

            # Sub-Horas (7 per Hora)
            sub_horas_list = []
            sub_span_sec = hora_duration_sec / 7.0

            for s in range(7):
                sub_num = s + 1
                s_start_dt = h_start_dt + timedelta(seconds=s * sub_span_sec)
                s_end_dt = h_start_dt + timedelta(seconds=(s + 1) * sub_span_sec)

                sub_lord_idx = (hora_lord_idx + s) % 7
                sub_planet = cls.CHALDEAN_PLANETS[sub_lord_idx]

                is_active_sub = is_active_hora and (s_start_dt <= target_dt < s_end_dt)

                # Sub-sub-Horas (7 per Sub-Hora)
                sub_sub_list = []
                subsub_span_sec = sub_span_sec / 7.0

                for ss in range(7):
                    ss_num = ss + 1
                    ss_start_dt = s_start_dt + timedelta(seconds=ss * subsub_span_sec)
                    ss_end_dt = s_start_dt + timedelta(seconds=(ss + 1) * subsub_span_sec)

                    subsub_lord_idx = (sub_lord_idx + ss) % 7
                    subsub_planet = cls.CHALDEAN_PLANETS[subsub_lord_idx]

                    is_active_subsub = is_active_sub and (ss_start_dt <= target_dt < ss_end_dt)

                    ss_data = {
                        "subSubNum": ss_num,
                        "planetId": subsub_planet["id"],
                        "planetTa": subsub_planet["ta"],
                        "planetEn": subsub_planet["en"],
                        "planetSymbol": subsub_planet["symbol"],
                        "timeRange": format_time_range(ss_start_dt, ss_end_dt),
                        "isActive": is_active_subsub
                    }
                    sub_sub_list.append(ss_data)

                    if is_active_subsub:
                        current_subsub_match = ss_data

                sub_data = {
                    "subNum": sub_num,
                    "planetId": sub_planet["id"],
                    "planetTa": sub_planet["ta"],
                    "planetEn": sub_planet["en"],
                    "planetSymbol": sub_planet["symbol"],
                    "timeRange": format_time_range(s_start_dt, s_end_dt),
                    "subSubHoras": sub_sub_list,
                    "isActive": is_active_sub
                }
                sub_horas_list.append(sub_data)

                if is_active_sub:
                    current_sub_match = sub_data

            hora_data = {
                "horaNum": hora_num,
                "phase": "பகல்" if is_day else "இரவு",
                "phaseEn": "Day" if is_day else "Night",
                "phaseNum": h_in_phase + 1,
                "planetId": hora_planet["id"],
                "planetTa": hora_planet["ta"],
                "planetEn": hora_planet["en"],
                "planetSymbol": hora_planet["symbol"],
                "deity": hora_planet["deity"],
                "goodForTa": hora_planet["goodForTa"],
                "goodForEn": hora_planet["goodForEn"],
                "timeRange": format_time_range(h_start_dt, h_end_dt),
                "durationMinutes": round(hora_duration_sec / 60.0, 2),
                "durationNazhigai": round((hora_duration_sec / 60.0) / 24.0, 2),
                "subHoras": sub_horas_list,
                "isActive": is_active_hora
            }
            horas_list.append(hora_data)

            if is_active_hora:
                current_hora_match = hora_data

        # Fallback if target time exact boundary edge
        if not current_hora_match and horas_list:
            current_hora_match = horas_list[0]
            current_sub_match = current_hora_match["subHoras"][0]
            current_subsub_match = current_sub_match["subSubHoras"][0]

        summary_text = (
            f"நடப்பு காலம் {current_hora_match['horaNum']} {current_hora_match['planetTa']} · "
            f"உப ஹோராக்கள் {current_sub_match['subNum']} {current_sub_match['planetTa']} · "
            f"உப-உப ஹோராக்கள் {current_subsub_match['subSubNum']} {current_subsub_match['planetTa']}"
        )

        return {
            "status": "success",
            "date": target_date.strftime("%Y-%m-%d"),
            "displayDate": target_date.strftime("%m/%d/%Y"),
            "time": target_time_str if (target_time_str := time_str) else target_dt.strftime("%I:%M %p"),
            "displayTime": target_dt.strftime("%I:%M %p"),
            "place": place_name,
            "latitude": lat,
            "longitude": lon,
            "timezone": tz,
            "weekday": {
                "id": weekday_idx,
                "nameTa": weekday_ta,
                "nameEn": weekday_en,
                "lordTa": cls.CHALDEAN_PLANETS[weekday_start_lord_idx]["ta"],
                "lordEn": cls.CHALDEAN_PLANETS[weekday_start_lord_idx]["en"]
            },
            "sunTimes": {
                "sunrise": sunrise_dt.strftime("%I:%M:%S %p"),
                "sunset": sunset_dt.strftime("%I:%M:%S %p"),
                "nextSunrise": next_sunrise_dt.strftime("%I:%M:%S %p"),
                "sunrise24": sunrise_dt.strftime("%H:%M:%S"),
                "sunset24": sunset_dt.strftime("%H:%M:%S"),
                "dayDuration": f"{int(day_duration_sec // 3600)} மணி {int((day_duration_sec % 3600) // 60)} நிமிடம்",
                "nightDuration": f"{int(night_duration_sec // 3600)} மணி {int((night_duration_sec % 3600) // 60)} நிமிடம்"
            },
            "activePeriod": {
                "hora": {
                    "num": current_hora_match["horaNum"],
                    "planetTa": current_hora_match["planetTa"],
                    "planetEn": current_hora_match["planetEn"],
                    "timeLabel": current_hora_match["timeRange"]["label"],
                    "goodFor": current_hora_match["goodForTa"]
                },
                "subHora": {
                    "num": current_sub_match["subNum"],
                    "planetTa": current_sub_match["planetTa"],
                    "planetEn": current_sub_match["planetEn"],
                    "timeLabel": current_sub_match["timeRange"]["label"]
                },
                "subSubHora": {
                    "num": current_subsub_match["subSubNum"],
                    "planetTa": current_subsub_match["planetTa"],
                    "planetEn": current_subsub_match["planetEn"],
                    "timeLabel": current_subsub_match["timeRange"]["label"]
                },
                "summaryBadge": summary_text
            },
            "horas": horas_list
        }
