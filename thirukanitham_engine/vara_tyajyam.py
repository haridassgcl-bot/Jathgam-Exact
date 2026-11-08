"""
காலம் மற்றும் பாரம்பரிய கணக்கீடு: வார தியாஜ்யம் (Vara Tyajyam Calculation)
Thirukanitham Engine - Traditional Weekday Visha Ghatika Astrological System

Shastra Principles:
- ஒவ்வொரு கிழமைக்கும் சூரிய உதயத்திலிருந்து நிலையான நாழிகை.
- தியாஜ்யம் 90 நிமிடம் (3.75 நாழிகை).
- ஞாயிறு 32, திங்கள் 42, செவ்வாய் 31, புதன் 42, வியாழன் 31, வெள்ளி 21, சனி 14.
- அந்த நாள் உதயத்தை உள்ளிடவும்; உதயம் இங்கு கணிக்கப்படாது.
- 7 கிழமைகளின் தியாஜ்ய நாழிகைகள் (உதயத்திலிருந்து):
  1. ஞாயிறு (Sunday): 32 நாழிகை (768 நிமிடங்கள் = 12 மணி 48 நிமிடம்)
  2. திங்கள் (Monday): 42 நாழிகை (1008 நிமிடங்கள் = 16 மணி 48 நிமிடம்)
  3. செவ்வாய் (Tuesday): 31 நாழிகை (744 நிமிடங்கள் = 12 மணி 24 நிமிடம்)
  4. புதன் (Wednesday): 42 நாழிகை (1008 நிமிடங்கள் = 16 மணி 48 நிமிடம்)
  5. வியாழன் (Thursday): 31 நாழிகை (744 நிமிடங்கள் = 12 மணி 24 நிமிடம்)
  6. வெள்ளி (Friday): 21 நாழிகை (504 நிமிடங்கள் = 8 மணி 24 நிமிடம்)
  7. சனி (Saturday): 14 நாழிகை (336 நிமிடங்கள் = 5 மணி 36 நிமிடம்)
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class VaraTyajyamCalculator:
    """
    பாரம்பரிய வார தியாஜ்ய கணக்கீட்டு இயந்திரம்
    """

    WEEKDAYS_DATA = [
        {"id": 0, "num": 1, "ta": "ஞாயிறு", "en": "Sunday", "ghatikas": 32, "offsetMinutes": 768, "durationMinutes": 90, "durationNazhigai": 3.75},
        {"id": 1, "num": 2, "ta": "திங்கள்", "en": "Monday", "ghatikas": 42, "offsetMinutes": 1008, "durationMinutes": 90, "durationNazhigai": 3.75},
        {"id": 2, "num": 3, "ta": "செவ்வாய்", "en": "Tuesday", "ghatikas": 31, "offsetMinutes": 744, "durationMinutes": 90, "durationNazhigai": 3.75},
        {"id": 3, "num": 4, "ta": "புதன்", "en": "Wednesday", "ghatikas": 42, "offsetMinutes": 1008, "durationMinutes": 90, "durationNazhigai": 3.75},
        {"id": 4, "num": 5, "ta": "வியாழன்", "en": "Thursday", "ghatikas": 31, "offsetMinutes": 744, "durationMinutes": 90, "durationNazhigai": 3.75},
        {"id": 5, "num": 6, "ta": "வெள்ளி", "en": "Friday", "ghatikas": 21, "offsetMinutes": 504, "durationMinutes": 90, "durationNazhigai": 3.75},
        {"id": 6, "num": 7, "ta": "சனி", "en": "Saturday", "ghatikas": 14, "offsetMinutes": 336, "durationMinutes": 90, "durationNazhigai": 3.75}
    ]

    @classmethod
    def calculate_tyajyam(
        cls,
        weekday_input: Any = None,
        date_str: Optional[str] = None,
        sunrise_time_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        வார தியாஜ்ய கணக்கீட்டை மேற்கொண்டு முடிவுகளை வழங்குகிறது.
        """
        now = datetime.now()
        d_str = date_str or now.strftime("%Y-%m-%d")
        s_time = sunrise_time_str or "06:00"

        weekday_id = 0
        if isinstance(weekday_input, int):
            weekday_id = max(0, min(6, weekday_input))
        elif isinstance(weekday_input, str):
            s_clean = weekday_input.strip().lower()
            for item in cls.WEEKDAYS_DATA:
                if item["ta"].lower() == s_clean or item["en"].lower() == s_clean:
                    weekday_id = item["id"]
                    break
            else:
                try:
                    val = int(weekday_input)
                    if 0 <= val <= 6:
                        weekday_id = val
                    else:
                        dt_parsed = datetime.strptime(d_str, "%Y-%m-%d")
                        weekday_id = (dt_parsed.weekday() + 1) % 7  # 0=Sunday
                except Exception:
                    try:
                        dt_parsed = datetime.strptime(d_str, "%Y-%m-%d")
                        weekday_id = (dt_parsed.weekday() + 1) % 7
                    except Exception:
                        weekday_id = 0
        else:
            try:
                dt_parsed = datetime.strptime(d_str, "%Y-%m-%d")
                weekday_id = (dt_parsed.weekday() + 1) % 7  # Python: Mon=0 -> Sun=0: (0+1)%7=1, Sun: (6+1)%7=0
            except Exception:
                weekday_id = 0

        cfg = cls.WEEKDAYS_DATA[weekday_id]

        s_y, s_m, s_d = [int(p) for p in d_str.split("-")]
        s_h, s_min = [int(p) for p in s_time.split(":")]
        sunrise_dt = datetime(s_y, s_m, s_d, s_h, s_min, 0)

        offset_minutes = cfg["offsetMinutes"]
        duration_minutes = cfg["durationMinutes"]  # 90
        duration_nazhigai = cfg["durationNazhigai"]  # 3.75

        tyajyam_start_date = sunrise_dt + timedelta(minutes=offset_minutes)
        tyajyam_end_date = tyajyam_start_date + timedelta(minutes=duration_minutes)
        next_sunrise_date = sunrise_dt + timedelta(days=1)

        def format_dt(dt_val: datetime) -> Dict[str, str]:
            y = dt_val.year
            mo = f"{dt_val.month:02d}"
            day = f"{dt_val.day:02d}"
            h = dt_val.hour
            m = dt_val.minute
            h12 = 12 if h % 12 == 0 else h % 12
            ampm = "PM" if h >= 12 else "AM"
            h24_str = f"{h:02d}"
            m_str = f"{m:02d}"
            return {
                "dateYmd": f"{y}-{mo}-{day}",
                "dateDisplay": f"{day}-{mo}-{y}",
                "time24": f"{h24_str}:{m_str}",
                "time12": f"{h12:02d}:{m_str} {ampm}",
                "full": f"{day}/{mo}/{y} {h12:02d}:{m_str} {ampm} ({h24_str}:{m_str})",
                "short": f"{day}/{mo} {h12:02d}:{m_str} {ampm}"
            }

        sunrise_fmt = format_dt(sunrise_dt)
        next_sunrise_fmt = format_dt(next_sunrise_date)
        tyajyam_start_fmt = format_dt(tyajyam_start_date)
        tyajyam_end_fmt = format_dt(tyajyam_end_date)

        total_day_minutes = 1440
        p1_pct = round((offset_minutes / total_day_minutes) * 100, 1)
        p2_pct = round((duration_minutes / total_day_minutes) * 100, 1)
        p3_pct = round(100.0 - p1_pct - p2_pct, 1)

        timeline_segments = [
            {
                "type": "auspicious",
                "label": "முன்பகுதி சுப காலம்",
                "labelEn": "Pre-Tyajyam Auspicious",
                "startMin": 0,
                "endMin": offset_minutes,
                "duration": offset_minutes,
                "widthPct": p1_pct,
                "color": "#10B981",
                "startTime": sunrise_fmt["short"],
                "endTime": tyajyam_start_fmt["short"]
            },
            {
                "type": "tyajyam",
                "label": f"வார தியாஜ்யம் ({cfg['ghatikas']} நாழிகையில்)",
                "labelEn": "Vara Tyajyam (90 min / 3.75 Nazhigai)",
                "startMin": offset_minutes,
                "endMin": offset_minutes + duration_minutes,
                "duration": duration_minutes,
                "widthPct": p2_pct,
                "color": "#E11D48",
                "startTime": tyajyam_start_fmt["short"],
                "endTime": tyajyam_end_fmt["short"]
            },
            {
                "type": "auspicious",
                "label": "பின்பகுதி சுப காலம்",
                "labelEn": "Post-Tyajyam Auspicious",
                "startMin": offset_minutes + duration_minutes,
                "endMin": total_day_minutes,
                "duration": total_day_minutes - (offset_minutes + duration_minutes),
                "widthPct": p3_pct,
                "color": "#10B981",
                "startTime": tyajyam_end_fmt["short"],
                "endTime": next_sunrise_fmt["short"]
            }
        ]

        pre_duration_mins = offset_minutes
        post_duration_mins = total_day_minutes - (offset_minutes + duration_minutes)

        auspicious_windows = [
            {
                "title": "முன்பகுதி சுப முகூர்த்தக் காலம்",
                "duration": f"{pre_duration_mins} நிமிடங்கள் ({round(pre_duration_mins / 24, 1)} நாழிகை)",
                "startTime": sunrise_fmt["full"],
                "endTime": tyajyam_start_fmt["full"],
                "status": "சுபம் (Auspicious)",
                "note": "சூரிய உதயம் முதல் வார தியாஜ்ய நச்சு நாழிகை தொடங்கும் வரை சுப காரியங்களைச் செய்யலாம்."
            },
            {
                "title": "வார தியாஜ்ய நச்சுப் பொழுது (விலக்கப்பட வேண்டிய காலம்)",
                "duration": f"{duration_minutes} நிமிடங்கள் ({duration_nazhigai} நாழிகை)",
                "startTime": tyajyam_start_fmt["full"],
                "endTime": tyajyam_end_fmt["full"],
                "status": "அசுபம் / நச்சு நாழிகை (Strictly Inauspicious)",
                "note": "சாஸ்திரப்படி வார தியாஜ்யம் 90 நிமிடங்கள் (3.75 நாழிகை) நச்சுக்காலமாகும். இக்காலத்தில் சுப முகூர்த்தம், விவாகம், புதுமனை புகுதல், பிரயாணம் கூடாது."
            },
            {
                "title": "பின்பகுதி சுப முகூர்த்தக் காலம்",
                "duration": f"{post_duration_mins} நிமிடங்கள் ({round(post_duration_mins / 24, 1)} நாழிகை)",
                "startTime": tyajyam_end_fmt["full"],
                "endTime": next_sunrise_fmt["full"],
                "status": "சுபம் (Auspicious)",
                "note": "வார தியாஜ்யம் முடிவுற்ற பின் மறுநாள் சூரிய உதயம் வரை உள்ள காலம் சுப காரியங்களுக்கு உகந்தது."
            }
        ]

        all_weekdays_table = []
        for item in cls.WEEKDAYS_DATA:
            s_d = sunrise_dt + timedelta(minutes=item["offsetMinutes"])
            e_d = s_d + timedelta(minutes=item["durationMinutes"])
            all_weekdays_table.append({
                "weekdayId": item["id"],
                "num": item["num"],
                "ta": item["ta"],
                "en": item["en"],
                "ghatikas": item["ghatikas"],
                "offsetMinutes": item["offsetMinutes"],
                "durationMinutes": item["durationMinutes"],
                "durationNazhigai": item["durationNazhigai"],
                "offsetHoursMins": f"{item['offsetMinutes'] // 60} மணி {item['offsetMinutes'] % 60} நிமி",
                "isCurrent": item["id"] == cfg["id"],
                "tyajyamStartFmt": format_dt(s_d),
                "tyajyamEndFmt": format_dt(e_d)
            })

        offset_hrs = offset_minutes // 60
        offset_rem_mins = offset_minutes % 60

        return {
            "weekdayId": cfg["id"],
            "weekdayNum": cfg["num"],
            "weekdayTa": cfg["ta"],
            "weekdayEn": cfg["en"],
            "ghatikas": cfg["ghatikas"],
            "offsetMinutes": offset_minutes,
            "offsetFormatted": f"{offset_hrs} மணி {offset_rem_mins} நிமிடம்",
            "durationMinutes": duration_minutes,
            "durationNazhigai": duration_nazhigai,
            "dateInput": d_str,
            "sunriseTime": s_time,
            "sunriseDateTime": sunrise_fmt,
            "nextSunriseDateTime": next_sunrise_fmt,
            "tyajyamStartTime": tyajyam_start_fmt,
            "tyajyamEndTime": tyajyam_end_fmt,
            "timelineSegments": timeline_segments,
            "auspiciousWindows": auspicious_windows,
            "allWeekdaysTable": all_weekdays_table,
            "verdictTa": f"தேர்வு செய்த {cfg['ta']} ({cfg['en']}) கிழமையின் வார தியாஜ்யம் சூரிய உதயத்திலிருந்து {cfg['ghatikas']} நாழிகையில் ({offset_hrs} மணி {offset_rem_mins} நிமிடம்) தொடங்குகிறது. சூரிய உதயம் {sunrise_fmt['time12']} எனில், தியாஜ்ய காலம் {tyajyam_start_fmt['full']} முதல் {tyajyam_end_fmt['full']} வரை (90 நிமிடங்கள் / 3.75 நாழிகை) அமைகிறது. இந்த நச்சு நாழிகையை சுப காரியங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்."
        }
