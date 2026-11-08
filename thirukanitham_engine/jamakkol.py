"""
Thirukanitham Engine - ஜாமக்கோள் ஆரூடம் (Jamakkol Aaroodam Prasanam)
Classical Tamil Horary & Birth Divination System
Calculates:
1. 8 Jamams (பகல் & இரவு 16 ஜாமங்கள்)
2. உதய லக்னம் (Udhayam)
3. ஆரூடம் (Aaroodam)
4. கவிப்பு (Kavippu - Secret Obstacle Point via Surya Veedhi)
5. மாந்தி (Maandi / Gulikan)
6. 8 வெளிவட்ட ஜாமக் கிரகங்கள் (Outer Jamam Grahas in 8 Non-Fixed Signs)
7. காரிய சித்தி பலன், கவிப்பு தாக்கம் & உடனடி தீர்ப்பு
"""

from typing import Dict, Any, List, Optional
from datetime import datetime


class JamakkolEngine:
    SIGN_NAMES_TA = [
        "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
        "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
    ]
    SIGN_NAMES_EN = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    SIGN_LORDS_TA = [
        "செவ்வாய்", "சுக்கிரன்", "புதன்", "சந்திரன்", "சூரியன்", "புதன்",
        "சுக்கிரன்", "செவ்வாய்", "குரு", "சனி", "சனி", "குரு"
    ]

    JAMAM_GRAHAS = ["Su", "Ma", "Ju", "Me", "Ve", "Sa", "Mo", "Ra"]
    GRAHA_NAMES_TA = {
        "Su": "சூரியன் (கதிர்)",
        "Ma": "செவ்வாய் (சேய்)",
        "Ju": "குரு (பொன்)",
        "Me": "புதன் (மால்)",
        "Ve": "சுக்கிரன் (புகர்)",
        "Sa": "சனி (மந்தன்)",
        "Mo": "சந்திரன் (மதி)",
        "Ra": "பாம்பு (ராகு)",
        "Ke": "கேது",
        "Asc": "உதயம்",
        "Man": "மாந்தி"
    }
    GRAHA_SHORT_TA = {
        "Su": "சூரி", "Ma": "செவ்", "Ju": "குரு", "Me": "புத",
        "Ve": "சுக்", "Sa": "சனி", "Mo": "சந்", "Ra": "பாம்",
        "Ke": "கேது", "Asc": "உத", "Man": "மாந்"
    }

    # 8 Non-Fixed Signs for outer Jamam Grahas (Pisces, Aries, Gemini, Cancer, Virgo, Libra, Sagittarius, Capricorn)
    OUTER_SIGNS = [11, 0, 2, 3, 5, 6, 8, 9]

    # Weekday start index for daytime Jamam sequence (0=Sun, 1=Mon, ..., 6=Sat)
    DAY_START_MAP = {
        0: 0,  # Sunday: Su
        1: 6,  # Monday: Mo
        2: 1,  # Tuesday: Ma
        3: 3,  # Wednesday: Me
        4: 2,  # Thursday: Ju
        5: 4,  # Friday: Ve
        6: 5   # Saturday: Sa
    }

    @classmethod
    def calculate_jamakkol(
        cls,
        date_str: str,
        time_str: str,
        weekday_idx: int,
        sun_sign_id: int,
        lagna_sign_id: int,
        lagna_deg: float = 15.0,
        planets_map: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculate complete Jamakkol Aaroodam for given parameters.
        """
        if planets_map is None:
            planets_map = {}

        # Parse hours and minutes
        try:
            t_parts = [int(p) for p in time_str.split(":")[:2]]
            hours, minutes = t_parts[0], t_parts[1]
        except Exception:
            hours, minutes = 10, 30

        total_mins = hours * 60 + minutes

        # Day or Night
        # Standard: 06:00 to 18:00 (360 to 1080 mins) is Day
        is_day = (360 <= total_mins < 1080)
        if is_day:
            mins_elapsed = total_mins - 360
            jamam_idx = min(8, max(1, mins_elapsed // 90 + 1))
            mins_in_jamam = mins_elapsed % 90
            period_name_ta = "பகல்"
        else:
            mins_elapsed = (total_mins - 1080) if total_mins >= 1080 else (total_mins + 360)
            jamam_idx = min(8, max(1, mins_elapsed // 90 + 1))
            mins_in_jamam = mins_elapsed % 90
            period_name_ta = "இரவு"

        # Surya Veedhi (சூரிய வீதி)
        # Signs: 0: Aries, 1: Taurus, 2: Gemini, 3: Cancer, 4: Leo, 5: Virgo,
        #        6: Libra, 7: Scorpio, 8: Sagittarius, 9: Capricorn, 10: Aquarius, 11: Pisces
        if sun_sign_id in [1, 2, 3, 4]:
            surya_veedhi_sign = 0  # Mesha Veedhi (Aries)
            surya_veedhi_name_ta = "மேஷ வீதி"
            surya_veedhi_name_en = "Mesha Veedhi (Aries)"
        elif sun_sign_id in [5, 6, 11, 0]:
            surya_veedhi_sign = 1  # Rishaba Veedhi (Taurus)
            surya_veedhi_name_ta = "ரிஷப வீதி"
            surya_veedhi_name_en = "Rishaba Veedhi (Taurus)"
        else:
            surya_veedhi_sign = 2  # Mithuna Veedhi (Gemini)
            surya_veedhi_name_ta = "மிதுன வீதி"
            surya_veedhi_name_en = "Mithuna Veedhi (Gemini)"

        # 1. Udhayam (உதயம்)
        udhayam_sign_id = lagna_sign_id % 12
        udhayam_deg_int = int(lagna_deg)
        udhayam_min_int = int(round((lagna_deg - udhayam_deg_int) * 60))
        if udhayam_min_int >= 60:
            udhayam_deg_int += 1
            udhayam_min_int = 0

        # 2. Aaroodam (ஆரூடம்)
        # Progresses from Sun's sign clockwise by Jamam index
        aaroodam_sign_id = (sun_sign_id + jamam_idx - 1) % 12
        aaroodam_deg_float = (mins_in_jamam / 90.0) * 30.0
        aaroodam_deg_int = int(aaroodam_deg_float)
        aaroodam_min_int = int(round((aaroodam_deg_float - aaroodam_deg_int) * 60))
        if aaroodam_min_int >= 60:
            aaroodam_deg_int += 1
            aaroodam_min_int = 0

        # 3. Kavippu (கவிப்பு - Obstacle Point)
        # Distance from Aaroodam to Surya Veedhi (clockwise)
        veedhi_dist = ((surya_veedhi_sign - aaroodam_sign_id + 12) % 12) + 1
        # Count same distance from Udhayam
        kavippu_sign_id = (udhayam_sign_id + veedhi_dist - 1) % 12
        kavippu_deg_int = (29 - aaroodam_deg_int + 30) % 30
        kavippu_min_int = (60 - aaroodam_min_int) % 60
        if kavippu_min_int == 60:
            kavippu_min_int = 0
            kavippu_deg_int = (kavippu_deg_int + 1) % 30

        # 4. Maandi (மாந்தி / குளிகன்)
        if "Man" in planets_map and planets_map["Man"].get("signId") is not None:
            maandi_sign_id = planets_map["Man"]["signId"]
            maandi_deg_int = int(planets_map["Man"].get("deg", 7))
            maandi_min_int = int(planets_map["Man"].get("min", 44))
        else:
            # Standard calculation
            day_nazhigai = [26, 22, 18, 14, 10, 6, 2]
            nazh = day_nazhigai[weekday_idx % 7] if is_day else (day_nazhigai[weekday_idx % 7] + 30) % 60
            maandi_sign_id = (sun_sign_id + int(nazh / 5)) % 12
            maandi_deg_int = 7
            maandi_min_int = 44

        # 5. 8 Jamam Grahas (வெளிவட்ட ஜாமக் கோள்கள்)
        day_start = cls.DAY_START_MAP.get(weekday_idx % 7, 0)
        start_graha_idx = (day_start + 4) % 8 if not is_day else day_start
        curr_jamam_graha_idx = (start_graha_idx + jamam_idx - 1) % 8
        active_jamam_lord_code = cls.JAMAM_GRAHAS[curr_jamam_graha_idx]

        jamam_planets = []
        for i in range(8):
            p_code = cls.JAMAM_GRAHAS[(curr_jamam_graha_idx + i) % 8]
            s_id = cls.OUTER_SIGNS[i]
            jamam_planets.append({
                "code": p_code,
                "nameTa": cls.GRAHA_NAMES_TA.get(p_code, p_code),
                "shortTa": cls.GRAHA_SHORT_TA.get(p_code, p_code),
                "signId": s_id,
                "signNameTa": cls.SIGN_NAMES_TA[s_id],
                "signNameEn": cls.SIGN_NAMES_EN[s_id],
                "deg": aaroodam_deg_int,
                "min": aaroodam_min_int,
                "formatted": f"{aaroodam_deg_int:02d}°{aaroodam_min_int:02d}′"
            })

        # 6. Astrological Predictions & Evaluation (காரிய சித்தி & கவிப்பு தாக்கம்)
        # Bhava distance from Udhayam to Aaroodam
        bhava_dist = ((aaroodam_sign_id - udhayam_sign_id + 12) % 12) + 1
        kavippu_house = ((kavippu_sign_id - udhayam_sign_id + 12) % 12) + 1

        # Udhayam - Aaroodam verdict
        if bhava_dist in [1, 4, 7, 10]:
            success_status = "முழு காரிய சித்தி (100% Supreme Success)"
            success_badge_class = "tb-badge-good"
            success_desc = (
                f"ஆரூடம் உதயத்திற்கு {bhava_dist}-ம் கேந்திர ஸ்தானத்தில் அமைந்திருப்பது 'முழு காரிய சித்தி' தரும் அதியுன்னத அமைப்பு. "
                "நினைத்த காரியம் சுபமாக, மிக விரைவாக வெற்றிகரமாக முடியும்."
            )
        elif bhava_dist in [5, 9]:
            success_status = "தெய்வ அனுக்கிரக வெற்றி (Trikona Auspicious)"
            success_badge_class = "tb-badge-good"
            success_desc = (
                f"ஆரூடம் உதயத்திற்கு {bhava_dist}-ம் திரிகோண ஸ்தானத்தில் அமைந்திருப்பதால், பூர்வ புண்ணிய பலத்தாலும் தெய்வ அருளாலும் "
                "காரியத்தில் எதிர்பாராத லாபமும் வெற்றியும் கைகூடும்."
            )
        elif bhava_dist in [3, 11]:
            success_status = "முயற்சிக்குப் பின் பெரும் வெற்றி (Upachaya Growth)"
            success_badge_class = "tb-badge-good"
            success_desc = (
                f"ஆரூடம் உதயத்திற்கு {bhava_dist}-ம் உபசய ஸ்தானத்தில் அமைந்திருப்பதால், தொடர் முயற்சியாலும் தீவிர உழைப்பாலும் "
                "முழுமையான வெற்றி மற்றும் நிதி ஆதாயம் கிட்டும்."
            )
        elif bhava_dist == 2:
            success_status = "தன லாப காரிய சித்தி (Financial Gain)"
            success_badge_class = "tb-badge-good"
            success_desc = (
                "ஆரூடம் 2-ம் தன ஸ்தானத்தில் அமைந்திருப்பதால், காரியம் வெற்றிகரமாக முடிவதோடு கணிசமான பண வரவும் குடும்பத்தில் மகிழ்ச்சியும் உண்டாகும்."
            )
        else:  # 6, 8, 12
            success_status = "தாமதம் & எச்சரிக்கை தேவை (Hurdles / Caution)"
            success_badge_class = "tb-badge-danger"
            success_desc = (
                f"ஆரூடம் உதயத்திற்கு {bhava_dist}-ம் மறைவு ஸ்தானத்தில் விழுந்திருப்பதால், காரியத்தில் ஆரம்பத் தடைகள், வீண் விரயங்கள் அல்லது "
                "எதிர்ப்புகள் ஏற்படலாம். அவசரப்படாமல் நிதானித்து செயல்பட வேண்டும்."
            )

        # Kavippu Obstacle analysis
        kavippu_planets = []
        for k, p in planets_map.items():
            if p.get("signId") == kavippu_sign_id:
                kavippu_planets.append(cls.GRAHA_SHORT_TA.get(k, k))

        if kavippu_sign_id == udhayam_sign_id:
            kavippu_desc = "கவிப்பு உதயம் மீது விழுவதால் ஜாதகருக்கு நேரடி மன அழுத்தம், உடல் சோர்வு அல்லது குழப்பங்கள் வரலாம்; நிதானம் தேவை."
        elif kavippu_sign_id == aaroodam_sign_id:
            kavippu_desc = "கவிப்பு ஆருடத்தை நேரடியாக மறைப்பதால் காரியத்தில் ஆரம்ப கட்டத்தில் எதிர்பாராத முட்டுக்கட்டைகள் நேரிடலாம்; மாற்று வழியை நாடுவது நன்று."
        else:
            kavippu_desc = (
                f"கவிப்பு உதயத்திற்கு {kavippu_house}-ம் பாவத்தில் ({cls.SIGN_NAMES_TA[kavippu_sign_id]}) விழுகிறது. "
                f"அந்த பாவத்திற்குரிய விஷயங்களில் ரகசியத் தடைகள் அல்லது கவனக் குறைவு ஏற்படாமல் விழிப்புணர்வுடன் இருக்க வேண்டும்."
            )
            if kavippu_planets:
                kavippu_desc += f" மேலும் கவிப்பு உள்ள ராசியில் {', '.join(kavippu_planets)} அமர்ந்துள்ளதால் அவற்றின் காரகத்துவத்தில் கவனம் தேவை."

        # Active Jamam Lord analysis
        jamam_lord_name = cls.GRAHA_NAMES_TA.get(active_jamam_lord_code, active_jamam_lord_code)
        jamam_lord_desc = f"தற்போது நடக்கும் {period_name_ta} {jamam_idx}-வது ஜாமத்தின் அதிபதி {jamam_lord_name} ஆவார். இந்த 90 நிமிடப் பொழுதில் தொடங்கும் காரியங்கள் இந்த கிரகத்தின் ஆதிக்கத்தில் இருக்கும்."

        return {
            "period": period_name_ta,
            "isDay": is_day,
            "jamamIndex": jamam_idx,
            "jamamLordCode": active_jamam_lord_code,
            "jamamLordNameTa": jamam_lord_name,
            "jamamLordDesc": jamam_lord_desc,
            "suryaVeedhi": {
                "signId": surya_veedhi_sign,
                "nameTa": surya_veedhi_name_ta,
                "nameEn": surya_veedhi_name_en
            },
            "udhayam": {
                "signId": udhayam_sign_id,
                "signNameTa": cls.SIGN_NAMES_TA[udhayam_sign_id],
                "signNameEn": cls.SIGN_NAMES_EN[udhayam_sign_id],
                "deg": udhayam_deg_int,
                "min": udhayam_min_int,
                "formatted": f"{udhayam_deg_int:02d}°{udhayam_min_int:02d}′",
                "lordTa": cls.SIGN_LORDS_TA[udhayam_sign_id]
            },
            "aaroodam": {
                "signId": aaroodam_sign_id,
                "signNameTa": cls.SIGN_NAMES_TA[aaroodam_sign_id],
                "signNameEn": cls.SIGN_NAMES_EN[aaroodam_sign_id],
                "deg": aaroodam_deg_int,
                "min": aaroodam_min_int,
                "formatted": f"{aaroodam_deg_int:02d}°{aaroodam_min_int:02d}′",
                "bhavaDist": bhava_dist,
                "lordTa": cls.SIGN_LORDS_TA[aaroodam_sign_id]
            },
            "kavippu": {
                "signId": kavippu_sign_id,
                "signNameTa": cls.SIGN_NAMES_TA[kavippu_sign_id],
                "signNameEn": cls.SIGN_NAMES_EN[kavippu_sign_id],
                "deg": kavippu_deg_int,
                "min": kavippu_min_int,
                "formatted": f"{kavippu_deg_int:02d}°{kavippu_min_int:02d}′",
                "houseFromUdhayam": kavippu_house,
                "affectedPlanets": kavippu_planets,
                "analysisTa": kavippu_desc
            },
            "maandi": {
                "signId": maandi_sign_id,
                "signNameTa": cls.SIGN_NAMES_TA[maandi_sign_id],
                "signNameEn": cls.SIGN_NAMES_EN[maandi_sign_id],
                "deg": maandi_deg_int,
                "min": maandi_min_int,
                "formatted": f"{maandi_deg_int:02d}°{maandi_min_int:02d}′"
            },
            "jamamPlanets": jamam_planets,
            "verdict": {
                "status": success_status,
                "badgeClass": success_badge_class,
                "summary": success_desc,
                "kavippuSummary": kavippu_desc,
                "kavippuAlert": (kavippu_sign_id in [udhayam_sign_id, aaroodam_sign_id])
            }
        }
