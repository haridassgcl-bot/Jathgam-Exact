"""
காலம் மற்றும் பாரம்பரிய கணக்கீடு: திதி தியாஜ்யம் (Tithi Tyajyam Calculation)
Thirukanitham Engine - Traditional Tithi Visha Ghatika Astrological System

Shastra Principles:
- திதி தொடக்கம்–முடிவிலிருந்து நாழிகை காலம் கணக்கிடப்படுகிறது.
- நட்சத்திர தியாஜ்யத்தின் அதே நாழிகை-பின்ன இயந்திரம்; திதிப் பின்னங்கள் பழைய அட்டவணை.
- பிரதமை 5/6 முதல் அமாவாசை 7/30 வரை.
- முடிவு நேரம் தொடக்கத்தை விட பிறகு இருக்க வேண்டும்.
- தியாஜ்யம் = திதி காலம் × பின்னம்; நீளம் 4 நாழிகை (96 நிமிடம்).
- 16 திதிகளின் தியாஜ்ய நாழிகைகள் & பின்னங்கள்:
  1. பிரதமை (50 நாழிகை / 5/6)
  2. த்விதியை (40 நாழிகை / 2/3)
  3. த்ருதியை (30 நாழிகை / 1/2)
  4. சதுர்த்தி (20 நாழிகை / 1/3)
  5. பஞ்சமி (24 நாழிகை / 2/5)
  6. ஷஷ்டி (15 நாழிகை / 1/4)
  7. சப்தமி (20 நாழிகை / 1/3)
  8. அஷ்டமி (25 நாழிகை / 5/12)
  9. நவமி (30 நாழிகை / 1/2)
  10. தசமி (24 நாழிகை / 2/5)
  11. ஏகாதசி (12 நாழிகை / 1/5)
  12. துவாதசி (20 நாழிகை / 1/3)
  13. திரயோதசி (15 நாழிகை / 1/4)
  14. சதுர்த்தசி (18 நாழிகை / 3/10)
  15. பௌர்ணமி (10 நாழிகை / 1/6)
  16. அமாவாசை (14 நாழிகை / 7/30)
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class TithiTyajyamCalculator:
    """
    பாரம்பரிய திதி தியாஜ்ய கணக்கீட்டு இயந்திரம்
    """

    TITHIS_DATA = [
        {"id": 0, "num": 1, "ta": "பிரதமை", "en": "Prathama", "ghatikas": 50, "fractionText": "5/6", "numerator": 5, "denominator": 6},
        {"id": 1, "num": 2, "ta": "த்விதியை", "en": "Dvitiya", "ghatikas": 40, "fractionText": "2/3", "numerator": 2, "denominator": 3},
        {"id": 2, "num": 3, "ta": "த்ருதியை", "en": "Tritiya", "ghatikas": 30, "fractionText": "1/2", "numerator": 1, "denominator": 2},
        {"id": 3, "num": 4, "ta": "சதுர்த்தி", "en": "Chaturthi", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 4, "num": 5, "ta": "பஞ்சமி", "en": "Panchami", "ghatikas": 24, "fractionText": "2/5", "numerator": 2, "denominator": 5},
        {"id": 5, "num": 6, "ta": "ஷஷ்டி", "en": "Shashthi", "ghatikas": 15, "fractionText": "1/4", "numerator": 1, "denominator": 4},
        {"id": 6, "num": 7, "ta": "சப்தமி", "en": "Saptami", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 7, "num": 8, "ta": "அஷ்டமி", "en": "Ashtami", "ghatikas": 25, "fractionText": "5/12", "numerator": 5, "denominator": 12},
        {"id": 8, "num": 9, "ta": "நவமி", "en": "Navami", "ghatikas": 30, "fractionText": "1/2", "numerator": 1, "denominator": 2},
        {"id": 9, "num": 10, "ta": "தசமி", "en": "Dashami", "ghatikas": 24, "fractionText": "2/5", "numerator": 2, "denominator": 5},
        {"id": 10, "num": 11, "ta": "ஏகாதசி", "en": "Ekadashi", "ghatikas": 12, "fractionText": "1/5", "numerator": 1, "denominator": 5},
        {"id": 11, "num": 12, "ta": "துவாதசி", "en": "Dvadashi", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 12, "num": 13, "ta": "திரயோதசி", "en": "Trayodashi", "ghatikas": 15, "fractionText": "1/4", "numerator": 1, "denominator": 4},
        {"id": 13, "num": 14, "ta": "சதுர்த்தசி", "en": "Chaturdashi", "ghatikas": 18, "fractionText": "3/10", "numerator": 3, "denominator": 10},
        {"id": 14, "num": 15, "ta": "பௌர்ணமி", "en": "Pournami", "ghatikas": 10, "fractionText": "1/6", "numerator": 1, "denominator": 6},
        {"id": 15, "num": 16, "ta": "அமாவாசை", "en": "Amavasya", "ghatikas": 14, "fractionText": "7/30", "numerator": 7, "denominator": 30}
    ]

    @classmethod
    def calculate_tyajyam(
        cls,
        tithi_input: Any,
        start_date_str: Optional[str] = None,
        start_time_str: Optional[str] = None,
        end_date_str: Optional[str] = None,
        end_time_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        திதி தியாஜ்ய கணக்கீட்டை மேற்கொண்டு முடிவுகளை வழங்குகிறது.
        """
        # Resolve tithi ID (0-15)
        tithi_id = 0
        if isinstance(tithi_input, int):
            tithi_id = max(0, min(15, tithi_input))
        elif isinstance(tithi_input, str):
            s_clean = tithi_input.strip().lower()
            for item in cls.TITHIS_DATA:
                if item["ta"].lower() == s_clean or item["en"].lower() == s_clean:
                    tithi_id = item["id"]
                    break
            else:
                try:
                    val = int(tithi_input)
                    if 0 <= val <= 15:
                        tithi_id = val
                except ValueError:
                    pass

        cfg = cls.TITHIS_DATA[tithi_id]

        now = datetime.now()
        s_date = start_date_str or now.strftime("%Y-%m-%d")
        s_time = start_time_str or "06:00"

        s_y, s_m, s_d = [int(p) for p in s_date.split("-")]
        s_h, s_min = [int(p) for p in s_time.split(":")]
        start_dt = datetime(s_y, s_m, s_d, s_h, s_min, 0)

        end_dt = None
        is_valid = True
        validation_error = ""

        if end_date_str and end_time_str:
            try:
                e_y, e_m, e_d = [int(p) for p in end_date_str.split("-")]
                e_h, e_min = [int(p) for p in end_time_str.split(":")]
                end_dt = datetime(e_y, e_m, e_d, e_h, e_min, 0)
            except Exception:
                end_dt = None

        # முடிவு நேரம் தொடக்கத்தை விட பிறகு இருக்க வேண்டும்
        if not end_dt or end_dt <= start_dt:
            is_valid = False
            validation_error = "முடிவு நேரம் தொடக்கத்தை விட பிறகு இருக்க வேண்டும்."
            end_dt = start_dt + timedelta(hours=24)

        total_seconds = (end_dt - start_dt).total_seconds()
        total_minutes = round(total_seconds / 60)
        total_nazhigai = round(total_minutes / 24, 2)
        total_hours = round(total_minutes / 60, 2)

        # பாரம்பரிய நாழிகை-பின்ன இயந்திரம்: தியாஜ்யம் = காலம் × பின்னம்
        fraction = cfg["ghatikas"] / 60.0
        tyajyam_start_offset_minutes = round(total_minutes * fraction)
        tyajyam_start_date = start_dt + timedelta(minutes=tyajyam_start_offset_minutes)

        # நீளம் 4 நாழிகை (96 நிமிடம்) - விகிதாசாரப்படி: total_minutes * (4 / 60)
        tyajyam_duration_minutes = round(total_minutes * (4.0 / 60.0))
        tyajyam_nazhigai = round(tyajyam_duration_minutes / 24.0, 2)
        tyajyam_end_date = tyajyam_start_date + timedelta(minutes=tyajyam_duration_minutes)

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

        start_fmt = format_dt(start_dt)
        end_fmt = format_dt(end_dt)
        tyajyam_start_fmt = format_dt(tyajyam_start_date)
        tyajyam_end_fmt = format_dt(tyajyam_end_date)

        p1_pct = round((tyajyam_start_offset_minutes / total_minutes) * 100, 1)
        p2_pct = round((tyajyam_duration_minutes / total_minutes) * 100, 1)
        p3_pct = round(100.0 - p1_pct - p2_pct, 1)

        timeline_segments = [
            {
                "type": "auspicious",
                "label": "முன்பகுதி சுப காலம்",
                "labelEn": "Pre-Tyajyam Auspicious",
                "startMin": 0,
                "endMin": tyajyam_start_offset_minutes,
                "duration": tyajyam_start_offset_minutes,
                "widthPct": p1_pct,
                "color": "#10B981",
                "startTime": start_fmt["short"],
                "endTime": tyajyam_start_fmt["short"]
            },
            {
                "type": "tyajyam",
                "label": f"திதி தியாஜ்யம் ({cfg['fractionText']})",
                "labelEn": "Tithi Tyajyam (4 Nazhigai)",
                "startMin": tyajyam_start_offset_minutes,
                "endMin": tyajyam_start_offset_minutes + tyajyam_duration_minutes,
                "duration": tyajyam_duration_minutes,
                "widthPct": p2_pct,
                "color": "#E11D48",
                "startTime": tyajyam_start_fmt["short"],
                "endTime": tyajyam_end_fmt["short"]
            },
            {
                "type": "auspicious",
                "label": "பின்பகுதி சுப காலம்",
                "labelEn": "Post-Tyajyam Auspicious",
                "startMin": tyajyam_start_offset_minutes + tyajyam_duration_minutes,
                "endMin": total_minutes,
                "duration": total_minutes - (tyajyam_start_offset_minutes + tyajyam_duration_minutes),
                "widthPct": p3_pct,
                "color": "#10B981",
                "startTime": tyajyam_end_fmt["short"],
                "endTime": end_fmt["short"]
            }
        ]

        pre_duration_mins = tyajyam_start_offset_minutes
        post_duration_mins = total_minutes - (tyajyam_start_offset_minutes + tyajyam_duration_minutes)

        auspicious_windows = [
            {
                "title": "முன்பகுதி சுப முகூர்த்தக் காலம்",
                "duration": f"{pre_duration_mins} நிமிடங்கள் ({round(pre_duration_mins / 24, 1)} நாழிகை)",
                "startTime": start_fmt["full"],
                "endTime": tyajyam_start_fmt["full"],
                "status": "சுபம் (Auspicious)",
                "note": "திதியின் தொடக்கம் முதல் தியாஜ்ய நச்சு நாழிகை தொடங்கும் வரை சுப காரியங்களைச் செய்யலாம்."
            },
            {
                "title": "திதி தியாஜ்ய நச்சுப் பொழுது (விலக்கப்பட வேண்டிய காலம்)",
                "duration": f"{tyajyam_duration_minutes} நிமிடங்கள் ({tyajyam_nazhigai} நாழிகை)",
                "startTime": tyajyam_start_fmt["full"],
                "endTime": tyajyam_end_fmt["full"],
                "status": "அசுபம் / நச்சு நாழிகை (Strictly Inauspicious)",
                "note": "சாஸ்திரப்படி 4 நாழிகைகள் (96 நிமிடங்கள்) நச்சுக்காலமாகும். இக்காலத்தில் சுப முகூர்த்தம், விவாகம், புதுமனை புகுதல், பிரயாணம் கூடாது."
            },
            {
                "title": "பின்பகுதி சுப முகூர்த்தக் காலம்",
                "duration": f"{post_duration_mins} நிமிடங்கள் ({round(post_duration_mins / 24, 1)} நாழிகை)",
                "startTime": tyajyam_end_fmt["full"],
                "endTime": end_fmt["full"],
                "status": "சுபம் (Auspicious)",
                "note": "திதி தியாஜ்யம் முடிவுற்ற பின் திதியின் இறுதி வரை உள்ள காலம் மங்களகரமானது."
            }
        ]

        all_tithis_table = []
        for item in cls.TITHIS_DATA:
            frac = item["ghatikas"] / 60.0
            start_off = round(total_minutes * frac)
            s_d = start_dt + timedelta(minutes=start_off)
            e_d = s_d + timedelta(minutes=tyajyam_duration_minutes)
            all_tithis_table.append({
                "tithiId": item["id"],
                "num": item["num"],
                "ta": item["ta"],
                "en": item["en"],
                "ghatikas": item["ghatikas"],
                "fractionText": item["fractionText"],
                "startOffsetMinutes": start_off,
                "isCurrent": item["id"] == cfg["id"],
                "tyajyamStartFmt": format_dt(s_d),
                "tyajyamEndFmt": format_dt(e_d)
            })

        return {
            "tithiId": cfg["id"],
            "tithiNum": cfg["num"],
            "tithiTa": cfg["ta"],
            "tithiEn": cfg["en"],
            "ghatikas": cfg["ghatikas"],
            "fractionText": cfg["fractionText"],
            "totalMinutes": total_minutes,
            "totalNazhigai": total_nazhigai,
            "totalHours": total_hours,
            "tyajyamDurationMinutes": tyajyam_duration_minutes,
            "tyajyamNazhigai": tyajyam_nazhigai,
            "tithiStartTime": start_fmt,
            "tithiEndTime": end_fmt,
            "tyajyamStartTime": tyajyam_start_fmt,
            "tyajyamEndTime": tyajyam_end_fmt,
            "timelineSegments": timeline_segments,
            "auspiciousWindows": auspicious_windows,
            "allTithisTable": all_tithis_table,
            "isValid": is_valid,
            "validationError": validation_error,
            "verdictTa": f"தேர்வு செய்த {cfg['ta']} திதியின் மொத்த ஓட்டக் காலம் {total_minutes} நிமிடங்கள் ({total_hours} மணி / {total_nazhigai} நாழிகை). இதன் தியாஜ்ய பின்னம் {cfg['fractionText']} ({cfg['ghatikas']} நாழிகை). அதன்படி தியாஜ்ய காலம் {tyajyam_start_fmt['full']} முதல் {tyajyam_end_fmt['full']} வரை (4 நாழிகை / {tyajyam_duration_minutes} நிமிடங்கள்) அமைகிறது. இந்த நச்சு நாழிகையை சுப காரியங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்."
        }
