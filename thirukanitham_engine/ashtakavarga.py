"""
Thirukanitham Ashtakavarga Engine (அஷ்டவர்க்க கணிதம்)
Computes Sarvashtakavarga (337 points), 7 Bhinnashtakavargas,
Trikona Shodhana, Ekadhipatya Shodhana, Rasi Pinda, Graha Pinda, and Shodhya Pinda.
"""

class AshtakavargaEngine:
    """
    Computes Thirukanitham Ashtakavarga points and classical Parashara reductions.
    """

    RASI_NAMES_TA = [
        "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்",
        "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்",
        "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
    ]

    RASI_NAMES_EN = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]

    RASI_GUNAKARA = [7, 10, 8, 4, 10, 5, 7, 8, 9, 5, 11, 12]

    GRAHA_GUNAKARA = {
        "Su": 5, "Mo": 5, "Ma": 8, "Me": 5, "Ju": 10, "Ve": 7, "Sa": 5
    }

    PLANET_NAMES_TA = {
        "Su": "சூரியன்", "Mo": "சந்திரன்", "Ma": "செவ்வாய்",
        "Me": "புதன்", "Ju": "குரு", "Ve": "சுக்கிரன்", "Sa": "சனி"
    }

    # Classical Brihat Parashara Hora Shastra (BPHS) Benefic Rules
    # 7 planets contribute bindus from 8 reference points (7 planets + Lagna)
    PARASHARA_RULES = {
        "Su": {
            "Su": [1, 2, 4, 7, 8, 9, 10, 11],
            "Mo": [3, 6, 10, 11],
            "Ma": [1, 2, 4, 7, 8, 9, 10, 11],
            "Me": [3, 5, 6, 9, 10, 11, 12],
            "Ju": [5, 6, 9, 11],
            "Ve": [6, 7, 12],
            "Sa": [1, 2, 4, 7, 8, 9, 10, 11],
            "Asc": [3, 4, 6, 10, 11, 12]
        },
        "Mo": {
            "Su": [3, 6, 7, 8, 10, 11],
            "Mo": [1, 3, 6, 7, 10, 11],
            "Ma": [2, 3, 5, 6, 9, 10, 11],
            "Me": [1, 3, 4, 5, 7, 8, 10, 11],
            "Ju": [1, 4, 7, 8, 10, 11, 12],
            "Ve": [3, 4, 5, 7, 9, 10, 11],
            "Sa": [3, 5, 6, 11],
            "Asc": [3, 6, 10, 11]
        },
        "Ma": {
            "Su": [3, 5, 6, 10, 11],
            "Mo": [3, 6, 11],
            "Ma": [1, 2, 4, 7, 8, 10, 11],
            "Me": [3, 5, 6, 11],
            "Ju": [6, 10, 11, 12],
            "Ve": [6, 8, 11, 12],
            "Sa": [1, 4, 7, 8, 9, 10, 11],
            "Asc": [1, 3, 6, 10, 11]
        },
        "Me": {
            "Su": [5, 6, 9, 11, 12],
            "Mo": [2, 4, 6, 8, 10, 11],
            "Ma": [1, 2, 4, 7, 8, 9, 10, 11],
            "Me": [1, 3, 5, 6, 9, 10, 11, 12],
            "Ju": [6, 8, 11, 12],
            "Ve": [1, 2, 3, 4, 5, 8, 9, 11],
            "Sa": [1, 2, 4, 7, 8, 9, 10, 11],
            "Asc": [1, 2, 4, 6, 8, 10, 11]
        },
        "Ju": {
            "Su": [1, 2, 3, 4, 7, 8, 9, 10, 11],
            "Mo": [2, 5, 7, 9, 11],
            "Ma": [1, 2, 4, 7, 8, 10, 11],
            "Me": [1, 2, 4, 5, 6, 9, 10, 11],
            "Ju": [1, 2, 3, 4, 7, 8, 10, 11],
            "Ve": [2, 5, 6, 9, 10, 11],
            "Sa": [3, 5, 6, 12],
            "Asc": [1, 2, 4, 5, 6, 7, 9, 10, 11]
        },
        "Ve": {
            "Su": [8, 11, 12],
            "Mo": [1, 2, 3, 4, 5, 8, 9, 11, 12],
            "Ma": [3, 5, 6, 9, 11, 12],
            "Me": [3, 5, 6, 9, 11],
            "Ju": [5, 8, 9, 10, 11],
            "Ve": [1, 2, 3, 4, 5, 8, 9, 10, 11],
            "Sa": [3, 4, 5, 8, 9, 10, 11],
            "Asc": [1, 2, 3, 4, 5, 8, 9, 11]
        },
        "Sa": {
            "Su": [1, 2, 4, 7, 8, 10, 11],
            "Mo": [3, 6, 11],
            "Ma": [3, 5, 6, 10, 11, 12],
            "Me": [6, 8, 9, 10, 11, 12],
            "Ju": [5, 6, 11, 12],
            "Ve": [6, 11, 12],
            "Sa": [3, 5, 6, 11],
            "Asc": [1, 3, 4, 6, 10, 11]
        }
    }

    @staticmethod
    def trikona_shodhana(bindus: list) -> list:
        """
        திரிகோண சோதனம் (Trinal Reduction)
        Trines:
        1. Fire: Mesha (0), Simha (4), Dhanus (8)
        2. Earth: Rishabha (1), Kanya (5), Makara (9)
        3. Air: Mithuna (2), Thula (6), Kumbha (10)
        4. Water: Kataka (3), Vrischika (7), Meena (11)
        """
        reduced = list(bindus)
        trines = [(0, 4, 8), (1, 5, 9), (2, 6, 10), (3, 7, 11)]
        for s1, s2, s3 in trines:
            min_val = min(reduced[s1], reduced[s2], reduced[s3])
            reduced[s1] -= min_val
            reduced[s2] -= min_val
            reduced[s3] -= min_val
        return reduced

    @staticmethod
    def ekadhipatya_shodhana(trikona_reduced: list, occupied_signs: set) -> list:
        """
        ஏகாதிபத்ய சோதனம் (Dual Lordship Reduction)
        Applied to dual-owned signs after Trikona Shodhana:
        - Mars: Mesha (0) & Vrischika (7)
        - Mercury: Mithuna (2) & Kanya (5)
        - Jupiter: Dhanus (8) & Meena (11)
        - Venus: Rishabha (1) & Thula (6)
        - Saturn: Makara (9) & Kumbha (10)
        (Sun owns Leo-4, Moon owns Cancer-3 -> Exempt)
        """
        ek = list(trikona_reduced)
        pairs = [(0, 7), (1, 6), (2, 5), (8, 11), (9, 10)]

        for s1, s2 in pairs:
            v1, v2 = ek[s1], ek[s2]
            o1 = (s1 in occupied_signs)
            o2 = (s2 in occupied_signs)

            # Rule 1: If both are occupied by planets, no reduction
            if o1 and o2:
                continue

            # Rule 2: If neither sign is occupied
            if not o1 and not o2:
                if v1 == 0 or v2 == 0:
                    ek[s1] = 0
                    ek[s2] = 0
                elif v1 == v2:
                    ek[s1] = 0
                    ek[s2] = 0
                else:
                    m = min(v1, v2)
                    ek[s1] = m
                    ek[s2] = m

            # Rule 3: s1 occupied, s2 unoccupied
            elif o1 and not o2:
                if v1 >= v2:
                    ek[s2] = 0
                else:
                    ek[s2] = v1

            # Rule 4: s2 occupied, s1 unoccupied
            elif not o1 and o2:
                if v2 >= v1:
                    ek[s1] = 0
                else:
                    ek[s1] = v2

        return ek

    @classmethod
    def calculate_ashtakavarga(cls, lagna_sign: int, planets_map: dict) -> dict:
        """
        Full Classical Parashara Ashtakavarga system calculations:
        - BAV for 7 planets (classical totals: 48, 49, 39, 54, 56, 52, 39)
        - SAV totaling 337 bindus
        - Trikona Shodhana & Ekadhipatya Shodhana for all 7 planets
        - Rasi Pinda, Graha Pinda, and Shodhya Pinda
        """
        # Determine natal sign positions of the 7 planets and Lagna
        occupied_signs = set()
        planet_signs = {}
        default_signs = {"Su": 0, "Mo": 6, "Ma": 9, "Me": 0, "Ju": 0, "Ve": 1, "Sa": 8}

        for p in ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"]:
            p_obj = planets_map.get(p, {}) if isinstance(planets_map, dict) else {}
            if isinstance(p_obj, dict):
                if "signId" in p_obj:
                    s_id = int(p_obj["signId"])
                elif "longitude" in p_obj:
                    s_id = int(p_obj["longitude"] / 30.0) % 12
                else:
                    s_id = default_signs.get(p, 0)
            elif hasattr(p_obj, "signId"):
                s_id = int(p_obj.signId)
            elif hasattr(p_obj, "longitude"):
                s_id = int(p_obj.longitude / 30.0) % 12
            else:
                s_id = default_signs.get(p, 0)
            planet_signs[p] = s_id
            occupied_signs.add(s_id)

        asc_sign = int(lagna_sign) if lagna_sign is not None else 8
        planet_signs["Asc"] = asc_sign

        # Dynamically compute BAV for 7 physical planets using Parashara rules
        bav = {}
        for planet, ref_dict in cls.PARASHARA_RULES.items():
            arr = [0] * 12
            for ref_p, houses in ref_dict.items():
                ref_sign = planet_signs[ref_p]
                for h in houses:
                    arr[(ref_sign + h - 1) % 12] += 1
            bav[planet] = arr

        # Compute 12-sign SAV (column sums of the 7 BAV arrays)
        sav_raw = [0] * 12
        for sign_idx in range(12):
            sav_raw[sign_idx] = sum(bav[p][sign_idx] for p in ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"])

        total_sav = sum(sav_raw)  # Exactly 337

        # Format 12-sign SAV list with status labels and house relative to Lagna
        sav_list = []
        for sign_idx in range(12):
            pts = sav_raw[sign_idx]
            house_from_lagna = ((sign_idx - asc_sign + 12) % 12) + 1
            if pts >= 30:
                status_ta = "அதி உத்தமம்"
                status_en = "Excellent"
                badge_type = "high"
            elif pts >= 28:
                status_ta = "உத்தமம்"
                status_en = "Good"
                badge_type = "good"
            elif pts >= 25:
                status_ta = "மத்திமம்"
                status_en = "Average"
                badge_type = "neutral"
            else:
                status_ta = "குறைவு"
                status_en = "Low"
                badge_type = "low"

            sav_list.append({
                "signId": sign_idx,
                "signNameTa": cls.RASI_NAMES_TA[sign_idx],
                "signNameEn": cls.RASI_NAMES_EN[sign_idx],
                "houseFromLagna": house_from_lagna,
                "points": pts,
                "statusTa": status_ta,
                "statusEn": status_en,
                "badgeType": badge_type
            })

        # Shodhana and Pinda calculations for each planet
        pindas = {}
        shodhana_details = {}
        grand_shodhya_pinda = 0

        for p in ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"]:
            orig = bav[p]
            t_red = cls.trikona_shodhana(orig)
            e_red = cls.ekadhipatya_shodhana(t_red, occupied_signs)

            # 1. Rasi Pinda: sum of (e_red[i] * RASI_GUNAKARA[i])
            rasi_breakdown = []
            rasi_pinda = 0
            for i in range(12):
                prod = e_red[i] * cls.RASI_GUNAKARA[i]
                rasi_pinda += prod
                rasi_breakdown.append({
                    "signId": i,
                    "signNameTa": cls.RASI_NAMES_TA[i],
                    "signNameEn": cls.RASI_NAMES_EN[i],
                    "gunakara": cls.RASI_GUNAKARA[i],
                    "bindu": e_red[i],
                    "product": prod
                })

            # 2. Graha Pinda: sum of (e_red[sign_of_planet] * GRAHA_GUNAKARA[planet])
            graha_breakdown = []
            graha_pinda = 0
            for pl in ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"]:
                occ_s = planet_signs[pl]
                prod = e_red[occ_s] * cls.GRAHA_GUNAKARA[pl]
                graha_pinda += prod
                graha_breakdown.append({
                    "planet": pl,
                    "nameTa": cls.PLANET_NAMES_TA[pl],
                    "placedSignId": occ_s,
                    "placedSignTa": cls.RASI_NAMES_TA[occ_s],
                    "placedSignEn": cls.RASI_NAMES_EN[occ_s],
                    "gunakara": cls.GRAHA_GUNAKARA[pl],
                    "bindu": e_red[occ_s],
                    "product": prod
                })

            shodhya_pinda = rasi_pinda + graha_pinda
            grand_shodhya_pinda += shodhya_pinda

            quality_ta = "அதி பலம்" if shodhya_pinda >= 100 else ("சுப பலம்" if shodhya_pinda >= 75 else "மத்திமம்")

            pindas[p] = {
                "planet": p,
                "nameTa": cls.PLANET_NAMES_TA[p],
                "originalTotal": sum(orig),
                "trikonaTotal": sum(t_red),
                "ekadhipatyaTotal": sum(e_red),
                "reducedCount": sum(orig) - sum(e_red),
                "rasiPinda": rasi_pinda,
                "grahaPinda": graha_pinda,
                "shodhyaPinda": shodhya_pinda,
                "qualityTa": quality_ta,
                "rasiBreakdown": rasi_breakdown,
                "grahaBreakdown": graha_breakdown
            }

            shodhana_details[p] = {
                "original": orig,
                "trikonaReduced": t_red,
                "ekadhipatyaReduced": e_red
            }

        # Find highest and lowest SAV signs (handling ties)
        max_pts = max(s["points"] for s in sav_list)
        min_pts = min(s["points"] for s in sav_list)
        max_signs = [s for s in sav_list if s["points"] == max_pts]
        min_signs = [s for s in sav_list if s["points"] == min_pts]

        strongest_sign = {
            "signId": max_signs[0]["signId"],
            "nameTa": " / ".join(s["signNameTa"] for s in max_signs),
            "nameEn": " / ".join(s["signNameEn"] for s in max_signs),
            "points": max_pts
        }
        weakest_sign = {
            "signId": min_signs[0]["signId"],
            "nameTa": " / ".join(s["signNameTa"] for s in min_signs),
            "nameEn": " / ".join(s["signNameEn"] for s in min_signs),
            "points": min_pts
        }

        return {
            "SAV": sav_raw,
            "BAV": bav,
            "sav": sav_list,
            "savList": sav_list,
            "bav": bav,
            "totalSAVPoints": total_sav,
            "averageSAV": round(total_sav / 12.0, 2),
            "strongestSign": strongest_sign,
            "weakestSign": weakest_sign,
            "shodhana": shodhana_details,
            "pindas": pindas,
            "grandShodhyaPinda": grand_shodhya_pinda
        }

