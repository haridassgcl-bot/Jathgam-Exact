"""
காலம் மற்றும் பாரம்பரிய கணக்கீடு: நட்சத்திர தியாஜ்யம் (Nakshatra Tyajyam Calculation)
Thirukanitham Engine - Traditional Nakshatra Visha Ghatika Astrological System

Shastra Principles:
- நட்சத்திர தொடக்கம்–முடிவிலிருந்து நாழிகை காலம் கணக்கிடப்படுகிறது.
- தியாஜ்யம் = காலம் × பின்னம்; நீளம் 4 நாழிகை (96 நிமிடம்).
- பின்னங்கள் பழைய பாரம்பரிய அட்டவணை (அசுவினி 5/6, பரணி 2/5, ...).
- நட்சத்திர ஓட்டக் காலத்தை உள்ளிடவும்; சந்திர ரேகை இங்கு கணிக்கப்படாது.
- 27 நட்சத்திரங்களின் தியாஜ்ய நாழிகைகள் (60-ல்):
  1. அசுவினி (50 நாழிகை / 5/6)
  2. பரணி (24 நாழிகை / 2/5)
  3. கிருத்திகை (30 நாழிகை / 1/2)
  4. ரோகிணி (40 நாழிகை / 2/3)
  5. மிருகசீரிடம் (14 நாழிகை / 7/30)
  6. திருவாதிரை (11 நாழிகை / 11/60)
  7. புனர்பூசம் (30 நாழிகை / 1/2)
  8. பூசம் (20 நாழிகை / 1/3)
  9. ஆயில்யம் (32 நாழிகை / 8/15)
  10. மகம் (30 நாழிகை / 1/2)
  11. பூரம் (20 நாழிகை / 1/3)
  12. உத்திரம் (18 நாழிகை / 3/10)
  13. அஸ்தம் (22 நாழிகை / 11/30)
  14. சித்திரை (20 நாழிகை / 1/3)
  15. சுவாதி (14 நாழிகை / 7/30)
  16. விசாகம் (14 நாழிகை / 7/30)
  17. அனுஷம் (10 நாழிகை / 1/6)
  18. கேட்டை (14 நாழிகை / 7/30)
  19. மூலம் (20 நாழிகை / 1/3)
  20. பூராடம் (24 நாழிகை / 2/5)
  21. உத்திராடம் (20 நாழிகை / 1/3)
  22. திருவோணம் (10 நாழிகை / 1/6)
  23. அவிட்டம் (10 நாழிகை / 1/6)
  24. சதயம் (18 நாழிகை / 3/10)
  25. பூரட்டாதி (16 நாழிகை / 4/15)
  26. உத்திரட்டாதி (24 நாழிகை / 2/5)
  27. ரேவதி (30 நாழிகை / 1/2)
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class NakshatraTyajyamCalculator:
    """
    பாரம்பரிய நட்சத்திர தியாஜ்ய கணக்கீட்டு இயந்திரம்
    """

    NAKSHATRAS_DATA = [
        {"id": 0, "num": 1, "ta": "அசுவினி", "en": "Ashwini", "ghatikas": 50, "fractionText": "5/6", "numerator": 5, "denominator": 6},
        {"id": 1, "num": 2, "ta": "பரணி", "en": "Bharani", "ghatikas": 24, "fractionText": "2/5", "numerator": 2, "denominator": 5},
        {"id": 2, "num": 3, "ta": "கிருத்திகை", "en": "Krittika", "ghatikas": 30, "fractionText": "1/2", "numerator": 1, "denominator": 2},
        {"id": 3, "num": 4, "ta": "ரோகிணி", "en": "Rohini", "ghatikas": 40, "fractionText": "2/3", "numerator": 2, "denominator": 3},
        {"id": 4, "num": 5, "ta": "மிருகசீரிடம்", "en": "Mrigashira", "ghatikas": 14, "fractionText": "7/30", "numerator": 7, "denominator": 30},
        {"id": 5, "num": 6, "ta": "திருவாதிரை", "en": "Ardra", "ghatikas": 11, "fractionText": "11/60", "numerator": 11, "denominator": 60},
        {"id": 6, "num": 7, "ta": "புனர்பூசம்", "en": "Punarvasu", "ghatikas": 30, "fractionText": "1/2", "numerator": 1, "denominator": 2},
        {"id": 7, "num": 8, "ta": "பூசம்", "en": "Pushya", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 8, "num": 9, "ta": "ஆயில்யம்", "en": "Ashlesha", "ghatikas": 32, "fractionText": "8/15", "numerator": 8, "denominator": 15},
        {"id": 9, "num": 10, "ta": "மகம்", "en": "Magha", "ghatikas": 30, "fractionText": "1/2", "numerator": 1, "denominator": 2},
        {"id": 10, "num": 11, "ta": "பூரம்", "en": "Purva Phalguni", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 11, "num": 12, "ta": "உத்திரம்", "en": "Uttara Phalguni", "ghatikas": 18, "fractionText": "3/10", "numerator": 3, "denominator": 10},
        {"id": 12, "num": 13, "ta": "அஸ்தம்", "en": "Hasta", "ghatikas": 22, "fractionText": "11/30", "numerator": 11, "denominator": 30},
        {"id": 13, "num": 14, "ta": "சித்திரை", "en": "Chitra", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 14, "num": 15, "ta": "சுவாதி", "en": "Swati", "ghatikas": 14, "fractionText": "7/30", "numerator": 7, "denominator": 30},
        {"id": 15, "num": 16, "ta": "விசாகம்", "en": "Vishakha", "ghatikas": 14, "fractionText": "7/30", "numerator": 7, "denominator": 30},
        {"id": 16, "num": 17, "ta": "அனுஷம்", "en": "Anuradha", "ghatikas": 10, "fractionText": "1/6", "numerator": 1, "denominator": 6},
        {"id": 17, "num": 18, "ta": "கேட்டை", "en": "Jyeshtha", "ghatikas": 14, "fractionText": "7/30", "numerator": 7, "denominator": 30},
        {"id": 18, "num": 19, "ta": "மூலம்", "en": "Mula", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 19, "num": 20, "ta": "பூராடம்", "en": "Purva Ashadha", "ghatikas": 24, "fractionText": "2/5", "numerator": 2, "denominator": 5},
        {"id": 20, "num": 21, "ta": "உத்திராடம்", "en": "Uttara Ashadha", "ghatikas": 20, "fractionText": "1/3", "numerator": 1, "denominator": 3},
        {"id": 21, "num": 22, "ta": "திருவோணம்", "en": "Shravana", "ghatikas": 10, "fractionText": "1/6", "numerator": 1, "denominator": 6},
        {"id": 22, "num": 23, "ta": "அவிட்டம்", "en": "Dhanishta", "ghatikas": 10, "fractionText": "1/6", "numerator": 1, "denominator": 6},
        {"id": 23, "num": 24, "ta": "சதயம்", "en": "Shatabhisha", "ghatikas": 18, "fractionText": "3/10", "numerator": 3, "denominator": 10},
        {"id": 24, "num": 25, "ta": "பூரட்டாதி", "en": "Purva Bhadrapada", "ghatikas": 16, "fractionText": "4/15", "numerator": 4, "denominator": 15},
        {"id": 25, "num": 26, "ta": "உத்திரட்டாதி", "en": "Uttara Bhadrapada", "ghatikas": 24, "fractionText": "2/5", "numerator": 2, "denominator": 5},
        {"id": 26, "num": 27, "ta": "ரேவதி", "en": "Revati", "ghatikas": 30, "fractionText": "1/2", "numerator": 1, "denominator": 2}
    ]

    @classmethod
    def calculate_tyajyam(
        cls,
        nakshatra_input: Any,
        start_date_str: Optional[str] = None,
        start_time_str: Optional[str] = None,
        end_date_str: Optional[str] = None,
        end_time_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        நட்சத்திர தியாஜ்ய கணக்கீட்டை மேற்கொண்டு முடிவுகளை வழங்குகிறது.
        """
        # Resolve nakshatra ID (0-26)
        nakshatra_id = 0
        if isinstance(nakshatra_input, int):
            nakshatra_id = max(0, min(26, nakshatra_input))
        elif isinstance(nakshatra_input, str):
            s_clean = nakshatra_input.strip().lower()
            for item in cls.NAKSHATRAS_DATA:
                if item["ta"].lower() == s_clean or item["en"].lower() == s_clean:
                    nakshatra_id = item["id"]
                    break
            else:
                try:
                    val = int(nakshatra_input)
                    if 0 <= val <= 26:
                        nakshatra_id = val
                except ValueError:
                    pass

        cfg = cls.NAKSHATRAS_DATA[nakshatra_id]

        now = datetime.now()
        s_date = start_date_str or now.strftime("%Y-%m-%d")
        s_time = start_time_str or "06:00"

        s_y, s_m, s_d = [int(p) for p in s_date.split("-")]
        s_h, s_min = [int(p) for p in s_time.split(":")]
        start_dt = datetime(s_y, s_m, s_d, s_h, s_min, 0)

        end_dt = None
        if end_date_str and end_time_str:
            try:
                e_y, e_m, e_d = [int(p) for p in end_date_str.split("-")]
                e_h, e_min = [int(p) for p in end_time_str.split(":")]
                end_dt = datetime(e_y, e_m, e_d, e_h, e_min, 0)
            except Exception:
                end_dt = None

        if not end_dt or end_dt <= start_dt:
            end_dt = start_dt + timedelta(hours=24)

        total_minutes = int(round((end_dt - start_dt).total_seconds() / 60))
        total_nazhigai = round(total_minutes / 24, 2)
        total_hours = round(total_minutes / 60, 2)

        # பாரம்பரிய சூத்திரம்: தியாஜ்யம் = காலம் × பின்னம்
        fraction = cfg["ghatikas"] / 60.0
        start_offset_minutes = int(round(total_minutes * fraction))
        tyajyam_start_dt = start_dt + timedelta(minutes=start_offset_minutes)

        # நீளம் 4 நாழிகை (96 நிமிடம்) - விகிதாசாரப்படி: total_minutes * (4 / 60)
        tyajyam_duration_minutes = int(round(total_minutes * (4.0 / 60.0)))
        tyajyam_nazhigai = round(tyajyam_duration_minutes / 24, 2)
        tyajyam_end_dt = tyajyam_start_dt + timedelta(minutes=tyajyam_duration_minutes)

        def fmt_dt(d: datetime) -> Dict[str, str]:
            h = d.hour
            m = d.minute
            h12 = 12 if h % 12 == 0 else h % 12
            ampm = "PM" if h >= 12 else "AM"
            h24_str = f"{h:02d}"
            m_str = f"{m:02d}"
            h12_str = f"{h12:02d}"
            d_str = f"{d.day:02d}/{d.month:02d}/{d.year}"
            return {
                "dateYmd": d.strftime("%Y-%m-%d"),
                "dateDisplay": f"{d.day:02d}-{d.month:02d}-{d.year}",
                "time24": f"{h24_str}:{m_str}",
                "time12": f"{h12_str}:{m_str} {ampm}",
                "full": f"{d_str} {h12_str}:{m_str} {ampm} ({h24_str}:{m_str})",
                "short": f"{d.day:02d}/{d.month:02d} {h12_str}:{m_str} {ampm}"
            }

        start_fmt = fmt_dt(start_dt)
        end_fmt = fmt_dt(end_dt)
        tyajyam_start_fmt = fmt_dt(tyajyam_start_dt)
        tyajyam_end_fmt = fmt_dt(tyajyam_end_dt)

        p1_pct = round((start_offset_minutes / total_minutes) * 100, 1)
        p2_pct = round((tyajyam_duration_minutes / total_minutes) * 100, 1)
        p3_pct = round(100.0 - p1_pct - p2_pct, 1)

        timeline_segments = [
            {
                "type": "auspicious",
                "label": "முன்பகுதி சுப காலம்",
                "labelEn": "Pre-Tyajyam Auspicious",
                "startMin": 0,
                "endMin": start_offset_minutes,
                "duration": start_offset_minutes,
                "widthPct": p1_pct,
                "color": "#10B981",
                "startTime": start_fmt["short"],
                "endTime": tyajyam_start_fmt["short"]
            },
            {
                "type": "tyajyam",
                "label": f"நட்சத்திர தியாஜ்யம் ({cfg['fractionText']})",
                "labelEn": "Nakshatra Tyajyam (4 Nazhigai)",
                "startMin": start_offset_minutes,
                "endMin": start_offset_minutes + tyajyam_duration_minutes,
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
                "startMin": start_offset_minutes + tyajyam_duration_minutes,
                "endMin": total_minutes,
                "duration": total_minutes - (start_offset_minutes + tyajyam_duration_minutes),
                "widthPct": p3_pct,
                "color": "#10B981",
                "startTime": tyajyam_end_fmt["short"],
                "endTime": end_fmt["short"]
            }
        ]

        pre_duration_mins = start_offset_minutes
        post_duration_mins = total_minutes - (start_offset_minutes + tyajyam_duration_minutes)

        auspicious_windows = [
            {
                "title": "முன்பகுதி சுப முகூர்த்தக் காலம்",
                "duration": f"{pre_duration_mins} நிமிடங்கள் ({round(pre_duration_mins / 24, 1)} நாழிகை)",
                "startTime": start_fmt["full"],
                "endTime": tyajyam_start_fmt["full"],
                "status": "சுபம் (Auspicious)",
                "note": "நட்சத்திரத்தின் தொடக்கம் முதல் தியாஜ்ய நச்சு நாழிகை தொடங்கும் வரை சுப காரியங்களைச் செய்யலாம்."
            },
            {
                "title": "தியாஜ்ய நச்சுப் பொழுது (விலக்கப்பட வேண்டிய காலம்)",
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
                "note": "தியாஜ்யம் முடிவுற்ற பின் நட்சத்திரத்தின் இறுதி வரை உள்ள காலம் மங்களகரமானது."
            }
        ]

        all_nakshatras_table = []
        for item in cls.NAKSHATRAS_DATA:
            frac = item["ghatikas"] / 60.0
            s_off = int(round(total_minutes * frac))
            s_d_item = start_dt + timedelta(minutes=s_off)
            e_d_item = s_d_item + timedelta(minutes=tyajyam_duration_minutes)
            all_nakshatras_table.append({
                "nakshatraId": item["id"],
                "num": item["num"],
                "ta": item["ta"],
                "en": item["en"],
                "ghatikas": item["ghatikas"],
                "fractionText": item["fractionText"],
                "startOffsetMinutes": s_off,
                "isCurrent": item["id"] == cfg["id"],
                "tyajyamStartFmt": fmt_dt(s_d_item),
                "tyajyamEndFmt": fmt_dt(e_d_item)
            })

        verdict_ta = (
            f"தேர்வு செய்த {cfg['ta']} நட்சத்திரத்தின் மொத்த ஓட்டக் காலம் {total_minutes} நிமிடங்கள் "
            f"({total_hours} மணி / {total_nazhigai} நாழிகை). இதன் தியாஜ்ய பின்னம் {cfg['fractionText']} "
            f"({cfg['ghatikas']} நாழிகை). அதன்படி தியாஜ்ய காலம் {tyajyam_start_fmt['full']} முதல் "
            f"{tyajyam_end_fmt['full']} வரை (4 நாழிகை / {tyajyam_duration_minutes} நிமிடங்கள்) அமைகிறது. "
            f"இந்த நச்சு நாழிகையை சுப காரியங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்."
        )

        return {
            "nakshatraId": cfg["id"],
            "nakshatraNum": cfg["num"],
            "nakshatraTa": cfg["ta"],
            "nakshatraEn": cfg["en"],
            "ghatikas": cfg["ghatikas"],
            "fractionText": cfg["fractionText"],
            "totalMinutes": total_minutes,
            "totalNazhigai": total_nazhigai,
            "totalHours": total_hours,
            "tyajyamDurationMinutes": tyajyam_duration_minutes,
            "tyajyamNazhigai": tyajyam_nazhigai,
            "nakshatraStartTime": start_fmt,
            "nakshatraEndTime": end_fmt,
            "tyajyamStartTime": tyajyam_start_fmt,
            "tyajyamEndTime": tyajyam_end_fmt,
            "timelineSegments": timeline_segments,
            "auspiciousWindows": auspicious_windows,
            "allNakshatrasTable": all_nakshatras_table,
            "verdictTa": verdict_ta
        }
