"""
Thirukanitham Dasha Engine (விம்சோத்தரி தசா-புக்தி கணிதம்)
Computes exact 120-year Vimshottari Maha Dasha, Bhukti, and Anthara timeline.
"""

from datetime import datetime, timedelta

DASHA_YEARS = [
    {"lord": "Ke", "years": 7,  "ta": "கேது", "en": "Ketu"},
    {"lord": "Ve", "years": 20, "ta": "சுக்கிரன்", "en": "Venus"},
    {"lord": "Su", "years": 6,  "ta": "சூரியன்", "en": "Sun"},
    {"lord": "Mo", "years": 10, "ta": "சந்திரன்", "en": "Moon"},
    {"lord": "Ma", "years": 7,  "ta": "செவ்வாய்", "en": "Mars"},
    {"lord": "Ra", "years": 18, "ta": "ராகு", "en": "Rahu"},
    {"lord": "Ju", "years": 16, "ta": "குரு", "en": "Jupiter"},
    {"lord": "Sa", "years": 19, "ta": "சனி", "en": "Saturn"},
    {"lord": "Me", "years": 17, "ta": "புதன்", "en": "Mercury"}
]

NAKSHATRA_LORDS = [
    "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
    "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
    "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"
]


class DashaEngine:
    """
    Computes Thirukanitham Vimshottari 120-year timeline.
    """

    @staticmethod
    def calculate_dasha(moon_longitude: float, birth_dt: datetime) -> dict:
        nak_length = 360.0 / 27.0
        nak_idx = int(moon_longitude / nak_length)
        elapsed_deg = moon_longitude % nak_length
        balance_ratio = (nak_length - elapsed_deg) / nak_length

        start_lord = NAKSHATRA_LORDS[nak_idx]
        start_idx = next(i for i, d in enumerate(DASHA_YEARS) if d["lord"] == start_lord)

        timeline = []
        curr_start = birth_dt
        initial_balance_desc = ""

        for i in range(9):
            cycle_idx = (start_idx + i) % 9
            d_info = DASHA_YEARS[cycle_idx]
            duration_years = float(d_info["years"])

            if i == 0:
                duration_years = duration_years * balance_ratio
                rem_y = int(duration_years)
                rem_m = int((duration_years - rem_y) * 12.0)
                rem_d = int((((duration_years - rem_y) * 12.0) - rem_m) * 30.0)
                initial_balance_desc = f"{d_info['ta']} தசை இருப்பு: {rem_y} வருடம், {rem_m} மாதம், {rem_d} நாள்"

            days_duration = duration_years * 365.2425
            curr_end = curr_start + timedelta(days=days_duration)

            # Generate 9 Bhuktis within this Dasha
            bhuktis = []
            b_start = curr_start
            for j in range(9):
                b_cycle_idx = (cycle_idx + j) % 9
                b_info = DASHA_YEARS[b_cycle_idx]
                b_years = (d_info["years"] * b_info["years"]) / 120.0
                b_days = b_years * 365.2425
                b_end = b_start + timedelta(days=b_days)

                bhuktis.append({
                    "lord": b_info["lord"],
                    "nameTa": b_info["ta"],
                    "nameEn": b_info["en"],
                    "startDate": b_start.strftime("%Y-%m-%d"),
                    "endDate": b_end.strftime("%Y-%m-%d")
                })
                b_start = b_end

            timeline.append({
                "lord": d_info["lord"],
                "nameTa": d_info["ta"],
                "nameEn": d_info["en"],
                "durationYears": round(duration_years, 2),
                "startDate": curr_start.strftime("%Y-%m-%d"),
                "endDate": curr_end.strftime("%Y-%m-%d"),
                "bhuktis": bhuktis
            })

            curr_start = curr_end

        # Identify current running Dasha & Bhukti
        now_dt = datetime.now()
        current_dasha = None
        current_bhukti = None

        for d in timeline:
            d_start = datetime.strptime(d["startDate"], "%Y-%m-%d")
            d_end = datetime.strptime(d["endDate"], "%Y-%m-%d")
            if d_start <= now_dt <= d_end:
                current_dasha = d
                for b in d["bhuktis"]:
                    b_start = datetime.strptime(b["startDate"], "%Y-%m-%d")
                    b_end = datetime.strptime(b["endDate"], "%Y-%m-%d")
                    if b_start <= now_dt <= b_end:
                        current_bhukti = b
                        break
                break

        return {
            "initialBalance": initial_balance_desc,
            "timeline": timeline,
            "currentDasha": current_dasha or timeline[0],
            "currentBhukti": current_bhukti or timeline[0]["bhuktis"][0]
        }
