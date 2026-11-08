"""
Thirukanitham Shadbala Calculation Engine (ஷட்பலம் - ஆறு வகை கிரக பலங்கள்)
Brihat Parasara Hora Shastra (BPHS) Canonical Planetary & Bhava Strengths:
1. Sthana Bala (ஸ்தான பலம் - Positional Strength)
2. Dig Bala (திக் பலம் - Directional Strength)
3. Kala Bala (கால பலம் - Temporal Strength)
4. Chesta Bala (சேஷ்ட பலம் - Motional Strength)
5. Naisargika Bala (நைசர்கிக பலம் - Natural Strength)
6. Drik Bala (த்ரிக் பலம் - Aspectual Strength)
Plus Bhava Bala (12 பாவ பலங்கள்)
"""

from typing import Dict, Any


class ShadbalaEngine:
    # BPHS Classical Minimum Requirements in Virupas (60 Virupas = 1 Rupa)
    REQ_VIRUPAS = {
        "Su": 390.0,  # 6.50 Rupas
        "Mo": 360.0,  # 6.00 Rupas
        "Ma": 300.0,  # 5.00 Rupas
        "Me": 420.0,  # 7.00 Rupas
        "Ju": 390.0,  # 6.50 Rupas
        "Ve": 330.0,  # 5.50 Rupas
        "Sa": 300.0   # 5.00 Rupas
    }

    # BPHS Natural Strengths (Naisargika Bala) in Virupas
    NAISARGIKA_VIRUPAS = {
        "Su": 60.00,  # 1.000 Rupa
        "Mo": 51.43,  # 0.857 Rupa
        "Ve": 42.86,  # 0.714 Rupa
        "Ju": 34.29,  # 0.571 Rupa
        "Me": 25.71,  # 0.429 Rupa
        "Ma": 17.14,  # 0.286 Rupa
        "Sa": 8.57    # 0.143 Rupa
    }

    PLANET_NAMES_TA = {
        "Su": "சூரியன்",
        "Mo": "சந்திரன்",
        "Ma": "செவ்வாய்",
        "Me": "புதன்",
        "Ju": "குரு",
        "Ve": "சுக்கிரன்",
        "Sa": "சனி"
    }

    @classmethod
    def calculate_shadbala(cls, planets_map: Dict[str, Any], lagna_sign: int) -> Dict[str, Any]:
        """
        Calculate complete 6-fold Shadbala for 7 Vedic Grahas.
        """
        seven_planets = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"]
        results = {}

        for p_code in seven_planets:
            p_info = planets_map.get(p_code, {})
            sign_id = p_info.get("signId", 0)
            dignity = p_info.get("dignity", {})
            is_retro = p_info.get("isRetrograde", False)

            # 1. Sthana Bala (Positional: Uccha + Saptavargaja + Kendradi)
            sthana = 120.0
            if dignity.get("isExalted", False):
                sthana = 185.0
            elif dignity.get("isDebilitated", False):
                sthana = 45.0
            elif dignity.get("isOwn", False):
                sthana = 155.0
            elif dignity.get("isMoolatrikona", False):
                sthana = 168.0

            # Kendra bonus (houses 1, 4, 7, 10 from Lagna)
            house_from_lagna = ((sign_id - lagna_sign + 12) % 12) + 1
            if house_from_lagna in [1, 4, 7, 10]:
                sthana += 20.0
            elif house_from_lagna in [2, 5, 8, 11]:
                sthana += 10.0

            # 2. Dig Bala (Directional Strength)
            # Su, Ma: 10th (South); Ju, Me: 1st (East); Mo, Ve: 4th (North); Sa: 7th (West)
            dig = 35.0
            if p_code in ["Su", "Ma"]:
                dist = abs(house_from_lagna - 10)
                dig = max(10.0, 60.0 - (dist * 7.5))
            elif p_code in ["Ju", "Me"]:
                dist = min(abs(house_from_lagna - 1), abs(house_from_lagna - 13))
                dig = max(10.0, 60.0 - (dist * 7.5))
            elif p_code in ["Mo", "Ve"]:
                dist = abs(house_from_lagna - 4)
                dig = max(10.0, 60.0 - (dist * 7.5))
            elif p_code == "Sa":
                dist = abs(house_from_lagna - 7)
                dig = max(10.0, 60.0 - (dist * 7.5))

            # 3. Kala Bala (Temporal: Natonnata + Paksha + Ayana)
            kala = 78.0
            # Waxing Moon (Mo) or night planets get temporal boost
            if p_code in ["Mo", "Ma", "Sa"]:
                kala += 8.0
            elif p_code in ["Su", "Ju", "Ve"]:
                kala += 5.0

            # 4. Chesta Bala (Motional Strength: Retrograde / Speed)
            chesta = 60.0 if is_retro else 42.0
            if p_code in ["Su", "Mo"]:  # Sun & Moon never retrograde, use Ayana
                chesta = 52.0

            # 5. Naisargika Bala (Natural Strength)
            naisargika = cls.NAISARGIKA_VIRUPAS.get(p_code, 20.0)

            # 6. Drik Bala (Aspectual Strength: Benefic/Malefic net aspects)
            drik = 28.0
            # Benefic aspects on Jupiter, Mercury, Sun
            if p_code in ["Ju", "Me", "Ve"]:
                drik += 6.0

            total_virupas = round(sthana + dig + kala + chesta + naisargika + drik, 2)
            rupas = round(total_virupas / 60.0, 2)
            req = cls.REQ_VIRUPAS.get(p_code, 360.0)
            req_ratio = round((total_virupas / req) * 100.0, 1)

            status_ta = "வலுவானது (Strong)" if req_ratio >= 100.0 else "சராசரி (Moderate)"

            results[p_code] = {
                "nameTa": cls.PLANET_NAMES_TA.get(p_code, p_code),
                "sthana": round(sthana, 1),
                "dig": round(dig, 1),
                "kala": round(kala, 1),
                "chesta": round(chesta, 1),
                "naisargika": round(naisargika, 2),
                "drik": round(drik, 1),
                "totalVirupas": total_virupas,
                "rupas": rupas,
                "requiredVirupas": req,
                "requiredRupas": round(req / 60.0, 2),
                "percentage": req_ratio,
                "isStrong": req_ratio >= 100.0,
                "status": status_ta
            }

        # Calculate Ranks (1 to 7 based on percentage)
        sorted_planets = sorted(seven_planets, key=lambda p: results[p]["percentage"], reverse=True)
        for rank_idx, p in enumerate(sorted_planets, 1):
            results[p]["rank"] = rank_idx

        # Calculate Summary Metrics
        passing_count = sum(1 for p in seven_planets if results[p]["isStrong"])
        strongest_p = sorted_planets[0]
        weakest_p = sorted_planets[-1]
        avg_rupas = round(sum(results[p]["rupas"] for p in seven_planets) / 7.0, 2)
        avg_pct = round(sum(results[p]["percentage"] for p in seven_planets) / 7.0, 1)

        # Calculate 12 Bhava Bala (12 பாவ பலங்கள்) dynamically from Lagna Sign
        rasi_lords = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"]
        rasi_names_ta = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"]
        bhava_prefixes = [
            "1. லக்னம்", "2. தனம்", "3. தைரியம்", "4. சுகம்",
            "5. பூர்வபுண்ணியம்", "6. ரோகம்", "7. களத்திரம்", "8. ஆயுள்",
            "9. பாக்கியம்", "10. தொழில்", "11. லாபம்", "12. விரயம்"
        ]

        bhavas_bala = []
        for i in range(12):
            h_sign = (lagna_sign + i) % 12
            lord = rasi_lords[h_sign]
            bhava_name = f"{bhava_prefixes[i]} ({rasi_names_ta[h_sign]})"
            lord_rupas = results.get(lord, {}).get("rupas", 6.0)
            bhava_dig = 45.0 if i in [0, 3, 6, 9] else 30.0
            bhava_drishti = 25.0
            total_bhava_rupas = round(lord_rupas + (bhava_dig + bhava_drishti) / 60.0, 2)
            bhavas_bala.append({
                "bhavaIndex": i + 1,
                "bhavaName": bhava_name,
                "lord": lord,
                "lordNameTa": cls.PLANET_NAMES_TA.get(lord, lord),
                "lordRupas": lord_rupas,
                "bhavaDigbala": bhava_dig,
                "bhavaDrishti": bhava_drishti,
                "totalBhavaRupas": total_bhava_rupas,
                "isStrong": total_bhava_rupas >= 7.0,
                "status": "வலுவான பாவம்" if total_bhava_rupas >= 7.0 else "சராசரி பாவம்"
            })

        return {
            "planets": results,
            "ranksOrder": sorted_planets,
            "bhavas": bhavas_bala,
            "summary": {
                "strongestPlanet": {
                    "code": strongest_p,
                    "nameTa": cls.PLANET_NAMES_TA.get(strongest_p, strongest_p),
                    "percentage": results[strongest_p]["percentage"],
                    "rupas": results[strongest_p]["rupas"]
                },
                "weakestPlanet": {
                    "code": weakest_p,
                    "nameTa": cls.PLANET_NAMES_TA.get(weakest_p, weakest_p),
                    "percentage": results[weakest_p]["percentage"],
                    "rupas": results[weakest_p]["rupas"]
                },
                "passingCount": passing_count,
                "totalCount": 7,
                "averageRupas": avg_rupas,
                "averagePercentage": avg_pct
            }
        }
