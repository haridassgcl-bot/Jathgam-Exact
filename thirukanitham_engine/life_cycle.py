"""
Thirukanitham Engine - Module 24: நட்சத்திர கிரக வேலை (உயிர்சக்தி வாழ்க்கைச் சுழற்சி)
Life Force Work Cycle - Sub-Lord & Karmic Duty Distribution
"""

from typing import Dict, Any, List


class LifeCycleEngine:
    # 9 Universal Stages of Life Force Production
    UNIVERSAL_STAGES = [
        {
            "stage": 1,
            "defaultGraha": "கேது",
            "defaultGrahaEn": "Ketu",
            "duty": "எட்டுதல் / தொடக்கப் பிடிப்பு",
            "dutyEn": "Reach / Initial Grasp",
            "metaphor": "பரிமாறும் கரண்டியின் நீண்ட கைப்பிடி. அது பாத்திரத்திற்குள் எட்டி இணைப்பைத் தருகிறது. தனியாக உணவைப் பிடிக்க முடியாது. கேது = எட்டுதல் / இணைப்பு / தொடக்கம்.",
            "metaphorEn": "Long handle of a serving spoon giving initial reach and contact."
        },
        {
            "stage": 2,
            "defaultGraha": "சுக்ரன்",
            "defaultGrahaEn": "Venus",
            "duty": "பெறுதல் / ஏந்துதல் / வடிவமைத்தல்",
            "dutyEn": "Receive / Hold / Shape",
            "metaphor": "கரண்டியின் வடிவமான கிண்ணம் — பெற்று, ஏந்தி, சுமந்து, வடிவமைத்து ஊற்றும் உள்ளங்கை. சாம்பாருக்கு ஆழமான கரண்டி, சட்னிக்கு சிறிய கரண்டி, சாதத்திற்கு அகலமான கரண்டி.",
            "metaphorEn": "The bowl of the spoon that receives, holds, shapes and pours the substance."
        },
        {
            "stage": 3,
            "defaultGraha": "சூரியன்",
            "defaultGrahaEn": "Sun",
            "duty": "சக்தி / மூலப்பொருள்",
            "dutyEn": "Energy / Raw Substance",
            "metaphor": "கரண்டியில் இருக்கும் உணவே சூரியன்: சாதம், பால், சாம்பார், காய்கறி, நெய் அல்லது மருந்து. வடிவம் மாறலாம்; அது உயிர் தரும் மூலப்பொருள்.",
            "metaphorEn": "The vital food/fuel inside the spoon: rice, milk, ghee, medicine or vital nutrient."
        },
        {
            "stage": 4,
            "defaultGraha": "சந்திரன்",
            "defaultGrahaEn": "Moon",
            "duty": "வளர்த்தல் / வளர்ச்சி",
            "dutyEn": "Nourish / Assimilate / Grow",
            "metaphor": "உணவை உடல் ஏற்றுக்கொள்கிறது. சந்திரன் ஏற்று, செரித்து, உறிஞ்சி, காத்து, சேர்த்து வளர்ச்சியாக்குகிறது — குழந்தைக்கு உணவு கொடுத்தால் அது வளர்வது போல.",
            "metaphorEn": "Digestion, assimilation, nourishing and nurturing vital bodily growth."
        },
        {
            "stage": 5,
            "defaultGraha": "செவ்வாய்",
            "defaultGrahaEn": "Mars",
            "duty": "செயல் / நிறைவேற்றம்",
            "dutyEn": "Action / Execution / Power",
            "metaphor": "வளர்ந்த பிறகு செயல்புரியும் ஆளாகிறார். செவ்வாய் நடந்து, வேலை செய்து, கட்டி, காத்து, இயக்குகிறார். சந்திரன் சக்தியை வளர்க்கிறது; செவ்வாய் அதைச் செயலாக்குகிறது.",
            "metaphorEn": "Transformation of accumulated vitality into concrete action, labor, and movement."
        },
        {
            "stage": 6,
            "defaultGraha": "ராகு",
            "defaultGrahaEn": "Rahu",
            "duty": "திட்டம் / ஆசை / வரைபடம்",
            "dutyEn": "Vision / Desire / Blueprint",
            "metaphor": "வலிமையான ஒருவர் மட்டும் போதாது. ராகு என்ன வேண்டும், எங்கு செல்கிறோம், என்ன எதிர்காலப் பலனை நினைக்கிறோம் என்று கேட்கிறது. செவ்வாய் தெரியும் செயல்; ராகு தெரியாத திசை.",
            "metaphorEn": "Future vision, directional ambition, hidden desire and architectural blueprint."
        },
        {
            "stage": 7,
            "defaultGraha": "குரு",
            "defaultGrahaEn": "Jupiter",
            "duty": "அறிவு / அனுமதி / அங்கீகாரம்",
            "dutyEn": "Wisdom / Approval / Sanction",
            "metaphor": "திட்டத்திற்கு ஆசிரியர் வழிகாட்டல், நிபுணர் உறுதி, பெற்றோர் ஆதரவு, நிறுவன அனுமதி அல்லது அறிவு தேவைப்படலாம். குருவின் பணி வழிகாட்டல், அறிவு, அனுமதி — வெறும் அதிர்ஷ்டம் அல்ல.",
            "metaphorEn": "Guidance, sanction, ethical validation, institutional approval and higher wisdom."
        },
        {
            "stage": 8,
            "defaultGraha": "சனி",
            "defaultGrahaEn": "Saturn",
            "duty": "நிஜமான பலன்",
            "dutyEn": "Tangible Reality / Manifest Fruit",
            "metaphor": "இறுதியில் உண்மை உலகில் ஒன்று நிற்கிறது: வேலை, வீடு, முடிந்த திட்டம், நிலம், இயந்திரம் அல்லது நீண்ட பொறுப்பு. சனி காலத்தால் சோதிக்கப்பட்ட கர்மப் பலன்.",
            "metaphorEn": "Time-tested manifestation in physical reality: career, property, structure, legacy."
        },
        {
            "stage": 9,
            "defaultGraha": "புதன்",
            "defaultGrahaEn": "Mercury",
            "duty": "நிர்வகித்தல் / தொடர்பு / அனுபவம்",
            "dutyEn": "Management / Network / Enjoyment",
            "metaphor": "பலன் தோன்றியதும் புதன் புரிந்து, கணக்கிட்டு, பதிவு செய்து, பேசி, விற்று, நிர்வகித்துப் பயன்படுத்துகிறார். சனி பலனைத் தருகிறார்; புதன் அதைப் பயன்படுத்தத் தக்கதாக்குகிறார்.",
            "metaphorEn": "Accounting, communicating, trading, enjoying, distributing and maintaining the result."
        }
    ]

    @staticmethod
    def calculate_life_cycle(planets_map: dict) -> Dict[str, Any]:
        """
        Calculates:
        1. Planetary Degree Ordering (0° to 360°) to assign who performs which default duty.
        2. Life Cycle Chain (Graha -> Nakshatra -> Nakshatra Lord / Supervisor).
        3. Supervisory counts & mutual feedback loop.
        """
        # 9 primary physical grahas in Vedic order
        planet_codes = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"]
        graha_ta_names = {
            "Su": "சூரியன்", "Mo": "சந்திரன்", "Ma": "செவ்வாய்", "Me": "புதன்",
            "Ju": "குரு", "Ve": "சுக்ரன்", "Sa": "சனி", "Ra": "ராகு", "Ke": "கேது"
        }
        graha_en_names = {
            "Su": "Sun", "Mo": "Moon", "Ma": "Mars", "Me": "Mercury",
            "Ju": "Jupiter", "Ve": "Venus", "Sa": "Saturn", "Ra": "Rahu", "Ke": "Ketu"
        }

        # Collect 9 planets with absolute longitudes
        planet_list = []
        for code in planet_codes:
            if code in planets_map:
                p = planets_map[code]
                planet_list.append({
                    "code": code,
                    "nameTa": graha_ta_names.get(code, p.get("nameTa", "")),
                    "nameEn": graha_en_names.get(code, p.get("nameEn", "")),
                    "longitude": float(p.get("longitude", 0.0)),
                    "signNameTa": p.get("signNameTa", ""),
                    "signNameEn": p.get("signNameEn", ""),
                    "signDeg": float(p.get("signDeg", p.get("degree", 0.0))),
                    "nakshatraNameTa": p.get("nakshatraNameTa", ""),
                    "nakshatraNameEn": p.get("nakshatraNameEn", ""),
                    "nakshatraLordTa": p.get("nakshatraLordTa", ""),
                    "nakshatraLordEn": p.get("nakshatraLordEn", ""),
                    "pada": p.get("pada", 1)
                })

        # Sort by longitude ascending 0° to 360°
        sorted_by_deg = sorted(planet_list, key=lambda x: x["longitude"])

        # Map to 9 universal duties
        degree_duty_assignments = []
        for idx, stage in enumerate(LifeCycleEngine.UNIVERSAL_STAGES):
            performer = sorted_by_deg[idx] if idx < len(sorted_by_deg) else sorted_by_deg[0]
            degree_duty_assignments.append({
                "stage": stage["stage"],
                "defaultDutyGraha": stage["defaultGraha"],
                "defaultDutyGrahaEn": stage["defaultGrahaEn"],
                "performingGraha": performer["nameTa"],
                "performingGrahaEn": performer["nameEn"],
                "duty": stage["duty"],
                "dutyEn": stage["dutyEn"],
                "signNameTa": performer["signNameTa"],
                "signNameEn": performer["signNameEn"],
                "longitude": performer["longitude"],
                "signDeg": performer["signDeg"]
            })

        # Life Force Flow Network (Universal Duty Graha -> Nakshatra -> Supervisor)
        # Sequence of 9 natural duties: Ke, Ve, Su, Mo, Ma, Ra, Ju, Sa, Me
        canonical_cycle_order = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"]
        cycle_chain = []
        supervisor_counts = {}

        for idx, code in enumerate(canonical_cycle_order):
            p = next((item for item in planet_list if item["code"] == code), None)
            stage_def = LifeCycleEngine.UNIVERSAL_STAGES[idx]
            if p:
                sup_ta = p["nakshatraLordTa"]
                sup_en = p["nakshatraLordEn"]
                supervisor_counts[sup_ta] = supervisor_counts.get(sup_ta, 0) + 1

                cycle_chain.append({
                    "stage": idx + 1,
                    "duty": stage_def["duty"],
                    "dutyEn": stage_def["dutyEn"],
                    "graha": p["nameTa"],
                    "grahaEn": p["nameEn"],
                    "nakshatra": p["nakshatraNameTa"],
                    "nakshatraEn": p["nakshatraNameEn"],
                    "supervisor": sup_ta,
                    "supervisorEn": sup_en,
                    "sign": p["signNameTa"],
                    "signEn": p["signNameEn"],
                    "pada": p["pada"],
                    "metaphor": stage_def["metaphor"],
                    "metaphorEn": stage_def["metaphorEn"],
                    "explanation": f"உலகளாவிய உயிர்சக்தி சுழற்சியில் {stage_def['duty']} என்ற பணி {p['nameTa']}க்குரியது. உங்கள் ஜாதகத்தில் {p['nameTa']} {p['nakshatraNameTa']}வில் நிற்கிறது. எனவே {stage_def['duty']} பணியை {p['nakshatraNameTa']} செய்கிறது. {p['nakshatraNameTa']}வின் அதிபதியான {sup_ta} அந்தப் பணி எந்தச் சூழலில் இயங்குகிறது என்பதை மேற்பார்வை செய்கிறார்."
                })

        # Check self-performed duties (where graha == supervisor)
        self_performed_count = sum(1 for item in cycle_chain if item["graha"] == item["supervisor"])

        # Two-way mutual cycle detection (e.g. Mars star lord is Moon, Moon star lord is Mars)
        feedback_loops = []
        for i in range(len(cycle_chain)):
            for j in range(i + 1, len(cycle_chain)):
                g1, s1 = cycle_chain[i]["graha"], cycle_chain[i]["supervisor"]
                g2, s2 = cycle_chain[j]["graha"], cycle_chain[j]["supervisor"]
                if g1 == s2 and g2 == s1:
                    feedback_loops.append(f"{g1} ➔ {g2}")

        return {
            "degreeAssignments": degree_duty_assignments,
            "cycleChain": cycle_chain,
            "supervisorsSummary": sorted(
                [{"lord": k, "count": v} for k, v in supervisor_counts.items()],
                key=lambda x: x["count"],
                reverse=True
            ),
            "selfPerformedCount": self_performed_count,
            "feedbackLoops": feedback_loops
        }
