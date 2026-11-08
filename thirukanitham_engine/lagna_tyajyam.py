"""
காலம் மற்றும் பாரம்பரிய கணக்கீடு: லக்ன தியாஜ்யம் (Lagna Tyajyam Calculation)
Thirukanitham Engine - Traditional Muhurtha Astrological System

Shastra Principles:
- ஒவ்வொரு லக்னமும் 120 நிமிடம் (5 நாழிகைகள் / 2 மணி நேரம்)
- 12 நிமிட தியாஜ்யம் (விஷ கடிகை / நச்சு நாழிகை) ராசிக்கேற்ப முதல், நடு அல்லது கடைசிப் பகுதியில்:
  1. முதல் பகுதி (ஆதி தியாஜ்யம், 0 முதல் 12 நிமிடம்):
     மேஷம், ரிஷபம், கன்னி, தனுசு
  2. நடுப் பகுதி (மத்திய தியாஜ்யம், 54 முதல் 66 நிமிடம் [60 − 6]):
     மிதுனம், சிம்மம், துலாம், கும்பம்
  3. கடைசிப் பகுதி (அந்திய தியாஜ்யம், 108 முதல் 120 நிமிடம் [120 − 12]):
     கடகம், விருச்சிகம், மகரம், மீனம்
- இங்கு லக்னக் கோணம் கணிக்கப்படாது — லக்னம் தொடங்கும் நேரத்தை நேரடியாக உள்ளிட்டு கணக்கிடப்படுகிறது.
"""

from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional


class LagnaTyajyamCalculator:
    """
    லக்ன தியாஜ்ய கணக்கீட்டு இயந்திரம்
    """

    SIGNS_DATA = [
        {"signId": 0, "ta": "மேஷம்", "en": "Aries", "group": "first", "groupTa": "முதல் பகுதி (0 - 12 நிமி)", "startMin": 0, "endMin": 12},
        {"signId": 1, "ta": "ரிஷபம்", "en": "Taurus", "group": "first", "groupTa": "முதல் பகுதி (0 - 12 நிமி)", "startMin": 0, "endMin": 12},
        {"signId": 2, "ta": "மிதுனம்", "en": "Gemini", "group": "middle", "groupTa": "நடுப் பகுதி (54 - 66 நிமி)", "startMin": 54, "endMin": 66},
        {"signId": 3, "ta": "கடகம்", "en": "Cancer", "group": "last", "groupTa": "கடைசிப் பகுதி (108 - 120 நிமி)", "startMin": 108, "endMin": 120},
        {"signId": 4, "ta": "சிம்மம்", "en": "Leo", "group": "middle", "groupTa": "நடுப் பகுதி (54 - 66 நிமி)", "startMin": 54, "endMin": 66},
        {"signId": 5, "ta": "கன்னி", "en": "Virgo", "group": "first", "groupTa": "முதல் பகுதி (0 - 12 நிமி)", "startMin": 0, "endMin": 12},
        {"signId": 6, "ta": "துலாம்", "en": "Libra", "group": "middle", "groupTa": "நடுப் பகுதி (54 - 66 நிமி)", "startMin": 54, "endMin": 66},
        {"signId": 7, "ta": "விருச்சிகம்", "en": "Scorpio", "group": "last", "groupTa": "கடைசிப் பகுதி (108 - 120 நிமி)", "startMin": 108, "endMin": 120},
        {"signId": 8, "ta": "தனுசு", "en": "Sagittarius", "group": "first", "groupTa": "முதல் பகுதி (0 - 12 நிமி)", "startMin": 0, "endMin": 12},
        {"signId": 9, "ta": "மகரம்", "en": "Capricorn", "group": "last", "groupTa": "கடைசிப் பகுதி (108 - 120 நிமி)", "startMin": 108, "endMin": 120},
        {"signId": 10, "ta": "கும்பம்", "en": "Aquarius", "group": "middle", "groupTa": "நடுப் பகுதி (54 - 66 நிமி)", "startMin": 54, "endMin": 66},
        {"signId": 11, "ta": "மீனம்", "en": "Pisces", "group": "last", "groupTa": "கடைசிப் பகுதி (108 - 120 நிமி)", "startMin": 108, "endMin": 120},
    ]

    @classmethod
    def calculate_tyajyam(
        cls,
        sign_input: Any,
        date_str: Optional[str] = None,
        time_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        லக்ன தியாஜ்ய கணக்கீட்டை மேற்கொண்டு முடிவுகளை வழங்குகிறது.
        """
        # Resolve sign ID (0-11)
        sign_id = 0
        if isinstance(sign_input, int):
            sign_id = max(0, min(11, sign_input))
        elif isinstance(sign_input, str):
            s_clean = sign_input.strip().lower()
            for item in cls.SIGNS_DATA:
                if item["ta"].lower() == s_clean or item["en"].lower() == s_clean:
                    sign_id = item["signId"]
                    break
            else:
                try:
                    sign_id = int(sign_input)
                    sign_id = max(0, min(11, sign_id))
                except ValueError:
                    sign_id = 0

        cfg = cls.SIGNS_DATA[sign_id]

        now = datetime.now()
        d_str = date_str or now.strftime("%Y-%m-%d")
        t_str = time_str or "06:00"

        try:
            start_dt = datetime.strptime(f"{d_str} {t_str}", "%Y-%m-%d %H:%M")
        except ValueError:
            start_dt = datetime(now.year, now.month, now.day, 6, 0)

        end_dt = start_dt + timedelta(minutes=120)
        tyajyam_start_dt = start_dt + timedelta(minutes=cfg["startMin"])
        tyajyam_end_dt = start_dt + timedelta(minutes=cfg["endMin"])

        def fmt_time(dt: datetime) -> Dict[str, str]:
            time24 = dt.strftime("%H:%M")
            time12 = dt.strftime("%I:%M %p")
            full = f"{time12} ({time24})"
            return {"time24": time24, "time12": time12, "full": full}

        lagna_start_fmt = fmt_time(start_dt)
        lagna_end_fmt = fmt_time(end_dt)
        tyajyam_start_fmt = fmt_time(tyajyam_start_dt)
        tyajyam_end_fmt = fmt_time(tyajyam_end_dt)

        # Build segments & auspicious windows
        if cfg["group"] == "first":
            timeline_segments = [
                {
                    "type": "tyajyam",
                    "label": "லக்ன தியாஜ்யம்",
                    "startMin": 0,
                    "endMin": 12,
                    "duration": 12,
                    "widthPct": 10,
                    "color": "#E11D48",
                    "startTime": tyajyam_start_fmt["time12"],
                    "endTime": tyajyam_end_fmt["time12"]
                },
                {
                    "type": "auspicious",
                    "label": "சுப முகூர்த்த காலம்",
                    "startMin": 12,
                    "endMin": 120,
                    "duration": 108,
                    "widthPct": 90,
                    "color": "#10B981",
                    "startTime": tyajyam_end_fmt["time12"],
                    "endTime": lagna_end_fmt["time12"]
                }
            ]
            auspicious_windows = [
                {
                    "title": "சுப முகூர்த்தக் காலம் (முழுமையான நற்பொழுது)",
                    "duration": "108 நிமிடங்கள்",
                    "startTime": tyajyam_end_fmt["full"],
                    "endTime": lagna_end_fmt["full"],
                    "status": "உத்தம சுபம் (100% Auspicious)",
                    "note": "தியாஜ்ய நச்சு நாழிகைகள் முடிந்த பின் லக்னத்தின் இறுதி வரை உள்ள முழு நேரம் சுப காரியங்களுக்கு மிகச் சிறந்தது."
                }
            ]
        elif cfg["group"] == "middle":
            w1_end = fmt_time(tyajyam_start_dt)
            w2_start = fmt_time(tyajyam_end_dt)
            timeline_segments = [
                {
                    "type": "auspicious",
                    "label": "சுப காலம் (பகுதி 1)",
                    "startMin": 0,
                    "endMin": 54,
                    "duration": 54,
                    "widthPct": 45,
                    "color": "#10B981",
                    "startTime": lagna_start_fmt["time12"],
                    "endTime": w1_end["time12"]
                },
                {
                    "type": "tyajyam",
                    "label": "லக்ன தியாஜ்யம்",
                    "startMin": 54,
                    "endMin": 66,
                    "duration": 12,
                    "widthPct": 10,
                    "color": "#E11D48",
                    "startTime": tyajyam_start_fmt["time12"],
                    "endTime": tyajyam_end_fmt["time12"]
                },
                {
                    "type": "auspicious",
                    "label": "சுப காலம் (பகுதி 2)",
                    "startMin": 66,
                    "endMin": 120,
                    "duration": 54,
                    "widthPct": 45,
                    "color": "#10B981",
                    "startTime": w2_start["time12"],
                    "endTime": lagna_end_fmt["time12"]
                }
            ]
            auspicious_windows = [
                {
                    "title": "ஆரம்ப சுபக் காலம் (பகுதி 1)",
                    "duration": "54 நிமிடங்கள்",
                    "startTime": lagna_start_fmt["full"],
                    "endTime": w1_end["full"],
                    "status": "சுபம் (Auspicious)",
                    "note": "லக்னம் தொடங்கியதிலிருந்து 54 நிமிடங்கள் வரை சுப காரியங்களை முன்னெடுக்கலாம்."
                },
                {
                    "title": "பிந்தைய சுபக் காலம் (பகுதி 2)",
                    "duration": "54 நிமிடங்கள்",
                    "startTime": w2_start["full"],
                    "endTime": lagna_end_fmt["full"],
                    "status": "சுபம் (Auspicious)",
                    "note": "நடுப்பகுதி தியாஜ்யம் விலகிய பின் 66-வது நிமிடம் முதல் லக்ன முடிவு வரை நற்பலன் தரும்."
                }
            ]
        else:
            w_end = fmt_time(tyajyam_start_dt)
            timeline_segments = [
                {
                    "type": "auspicious",
                    "label": "சுப முகூர்த்த காலம்",
                    "startMin": 0,
                    "endMin": 108,
                    "duration": 108,
                    "widthPct": 90,
                    "color": "#10B981",
                    "startTime": lagna_start_fmt["time12"],
                    "endTime": w_end["time12"]
                },
                {
                    "type": "tyajyam",
                    "label": "லக்ன தியாஜ்யம்",
                    "startMin": 108,
                    "endMin": 120,
                    "duration": 12,
                    "widthPct": 10,
                    "color": "#E11D48",
                    "startTime": tyajyam_start_fmt["time12"],
                    "endTime": tyajyam_end_fmt["time12"]
                }
            ]
            auspicious_windows = [
                {
                    "title": "முதன்மையான சுப முகூர்த்தக் காலம்",
                    "duration": "108 நிமிடங்கள்",
                    "startTime": lagna_start_fmt["full"],
                    "endTime": w_end["full"],
                    "status": "உத்தம சுபம் (100% Auspicious)",
                    "note": "லக்னம் தொடங்கியதிலிருந்து முதல் 108 நிமிடங்கள் வரை முழுமையான சுப முகூர்த்த காலமாகும்; இறுதி 12 நிமிடங்களை மட்டும் தவிர்க்க வேண்டும்."
                }
            ]

        all_signs_table = []
        for item in cls.SIGNS_DATA:
            t_s = start_dt + timedelta(minutes=item["startMin"])
            t_e = start_dt + timedelta(minutes=item["endMin"])
            all_signs_table.append({
                **item,
                "isCurrent": (item["signId"] == sign_id),
                "tyajyamStartFmt": fmt_time(t_s),
                "tyajyamEndFmt": fmt_time(t_e)
            })

        verdict_ta = (
            f"தேர்வு செய்த {cfg['ta']} லக்னத்தின் மொத்த கால அளவு 120 நிமிடங்கள் "
            f"({lagna_start_fmt['full']} முதல் {lagna_end_fmt['full']} வரை). "
            f"இதில் தியாஜ்யம் {cfg['groupTa']}வில் ({cfg['startMin']} முதல் {cfg['endMin']} நிமிடம் வரை) "
            f"{tyajyam_start_fmt['full']} முதல் {tyajyam_end_fmt['full']} வரை அமைகிறது. "
            "இந்த 12 நிமிடங்களை சுப முகூர்த்தங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்."
        )

        return {
            "signId": sign_id,
            "signNameTa": cfg["ta"],
            "signNameEn": cfg["en"],
            "dateStr": d_str,
            "timeStr": t_str,
            "group": cfg["group"],
            "groupTa": cfg["groupTa"],
            "startMin": cfg["startMin"],
            "endMin": cfg["endMin"],
            "durationMinutes": 120,
            "tyajyamDurationMinutes": 12,
            "auspiciousDurationMinutes": 108,
            "lagnaStartTime": lagna_start_fmt,
            "lagnaEndTime": lagna_end_fmt,
            "tyajyamStartTime": tyajyam_start_fmt,
            "tyajyamEndTime": tyajyam_end_fmt,
            "timelineSegments": timeline_segments,
            "auspiciousWindows": auspicious_windows,
            "allSignsTable": all_signs_table,
            "verdictTa": verdict_ta
        }
