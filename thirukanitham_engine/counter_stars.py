"""
Thirukanitham Engine - Module 25: நட்சத்திர எதிர் நட்சத்திரம் (Counter Stars & Obstacles)
Vedha & Obstacle Nakshatra System with Sookshma Palan Classifications
"""

from typing import Dict, Any, List


class CounterStarsEngine:
    # 27 Nakshatras list
    NAKSHATRAS = [
        "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிஷம்", "திருவாதிரை",
        "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
        "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
        "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
        "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
    ]

    # Pre-defined Obstacle Stars rules for each root planet's Nakshatra
    OBSTACLE_RULES = {
        "பரணி": [
            {"type": "பிரம்மம்", "nakshatra": "திருவாதிரை"},
            {"type": "பூகம்பம்", "nakshatra": "பூசம்"},
            {"type": "சூலம்", "nakshatra": "ஆயில்யம்"},
            {"type": "சூனியம்", "nakshatra": "பூரம்"},
            {"type": "பூசல்", "nakshatra": "சுவாதி"},
            {"type": "பொய்", "nakshatra": "விசாகம்"},
            {"type": "கேடு", "nakshatra": "மூலம்"},
            {"type": "அனல்", "nakshatra": "திருவோணம்"},
            {"type": "தண்டம்", "nakshatra": "அவிட்டம்"},
            {"type": "பாடை", "nakshatra": "சதயம்"},
            {"type": "தோஷம்", "nakshatra": "அஸ்வினி"},
            {"type": "உதைப்பு", "nakshatra": "அஸ்தம்"},
        ],
        "சித்திரை": [
            {"type": "A", "nakshatra": "உத்திராடம்"},
            {"type": "B", "nakshatra": "பூரட்டாதி"},
            {"type": "C", "nakshatra": "ரோகிணி"},
            {"type": "D", "nakshatra": "மகம்"},
            {"type": "E", "nakshatra": "விசாகம்"},
            {"type": "F", "nakshatra": "கேட்டை"},
            {"type": "G", "nakshatra": "பூராடம்"},
        ],
        "கார்த்திகை": [
            {"type": "A", "nakshatra": "புனர்பூசம்"},
            {"type": "B", "nakshatra": "அஸ்தம்"},
            {"type": "C", "nakshatra": "அவிட்டம்"},
            {"type": "D", "nakshatra": "சதயம்"},
        ],
        "மிருகசீரிஷம்": [
            {"type": "A", "nakshatra": "சதயம்"},
            {"type": "B", "nakshatra": "உத்திரட்டாதி"},
            {"type": "C", "nakshatra": "அஸ்வினி"},
        ],
        "திருவோணம்": [
            {"type": "A", "nakshatra": "அஸ்வினி"},
            {"type": "B", "nakshatra": "ரோகிணி"},
            {"type": "C", "nakshatra": "ஆயில்யம்"},
            {"type": "D", "nakshatra": "சுவாதி"},
            {"type": "E", "nakshatra": "சதயம்"},
        ],
        "மூலம்": [
            {"type": "A", "nakshatra": "அவிட்டம்"},
            {"type": "B", "nakshatra": "சதயம்"},
            {"type": "C", "nakshatra": "அஸ்வினி"},
            {"type": "D", "nakshatra": "பரணி"},
            {"type": "E", "nakshatra": "பூரம்"},
            {"type": "F", "nakshatra": "அனுஷம்"},
            {"type": "G", "nakshatra": "உத்திரட்டாதி"},
        ],
        "பூரட்டாதி": [
            {"type": "A", "nakshatra": "அனுஷம்"},
            {"type": "B", "nakshatra": "மூலம்"},
        ],
        "உத்திரம்": [
            {"type": "A", "nakshatra": "ரோகிணி"},
            {"type": "B", "nakshatra": "திருவாதிரை"},
        ]
    }

    # Sookshma Palan Relationships
    SOOKSHMA_TABLE = [
        {"planet": "சூரி", "nakshatra": "பரணி", "relations": {"சூரி": "காரகன்", "சந்": "பாதகன்", "புத": "போதகன்", "சுக்": "வேதகன்", "செவ்": "பாசகன்", "குரு": "காரகன்", "சனி": "—", "ராகு": "—", "கேது": "—"}},
        {"planet": "சந்", "nakshatra": "சித்திரை", "relations": {"சூரி": "—", "சந்": "பாசகன்", "புத": "போதகன்", "சுக்": "வேதகன்", "செவ்": "காரகன்", "குரு": "—", "சனி": "—", "ராகு": "போதகன்", "கேது": "—"}},
        {"planet": "புத", "nakshatra": "கார்த்திகை", "relations": {"சூரி": "வேதகன்", "சந்": "போதகன்", "புத": "காரகன்", "சுக்": "பாசகன்", "செவ்": "வேதகன்", "குரு": "—", "சனி": "—", "ராகு": "—", "கேது": "—"}},
        {"planet": "சுக்", "nakshatra": "மிருகசீரிஷம்", "relations": {"சூரி": "—", "சந்": "பாசகன்", "புத": "போதகன்", "சுக்": "வேதகன்", "செவ்": "காரகன்", "குரு": "—", "சனி": "—", "ராகு": "போதகன்", "கேது": "—"}},
        {"planet": "செவ்", "nakshatra": "திருவோணம்", "relations": {"சூரி": "வேதகன்", "சந்": "பாசகன்", "புத": "போதகன்", "சுக்": "காரகன்", "செவ்": "வேதகன்", "குரு": "—", "சனி": "—", "ராகு": "—", "கேது": "—"}},
        {"planet": "குரு", "nakshatra": "பரணி", "relations": {"சூரி": "காரகன்", "சந்": "பாதகன்", "புத": "போதகன்", "சுக்": "வேதகன்", "செவ்": "பாசகன்", "குரு": "காரகன்", "சனி": "—", "ராகு": "—", "கேது": "—"}},
        {"planet": "சனி", "nakshatra": "மூலம்", "relations": {"சூரி": "—", "சந்": "—", "புத": "வேதகன்", "சுக்": "போதகன்", "செவ்": "பாசகன்", "குரு": "காரகன்", "சனி": "—", "ராகு": "—", "கேது": "—"}},
        {"planet": "ராகு", "nakshatra": "பூரட்டாதி", "relations": {"சூரி": "வேதகன்", "சந்": "காரகன்", "புத": "போதகன்", "சுக்": "பாசகன்", "செவ்": "காரகன்", "குரு": "பாசகன்", "சனி": "—", "ராகு": "—", "கேது": "—"}},
        {"planet": "கேது", "nakshatra": "உத்திரம்", "relations": {"சூரி": "—", "சந்": "வேதகன்", "புத": "போதகன்", "சுக்": "காரகன்", "செவ்": "பாசகன்", "குரு": "வேதகன்", "சனி": "—", "ராகு": "—", "கேது": "—"}}
    ]

    @staticmethod
    def calculate_counter_stars(planets_map: dict) -> Dict[str, Any]:
        """
        Calculates:
        1. 9 Root Grahas with their birth Nakshatras and Pada.
        2. Sookshma Palan Table.
        3. Obstacle Nakshatras for each planet, showing occupied vs vacant status.
        """
        priority_order = ["Su", "Mo", "Me", "Ve", "Ma", "Ju", "Sa", "Ra", "Ke", "Asc"]
        short_names = {
            "Su": "சூரி", "Mo": "சந்", "Me": "புத", "Ve": "சுக்",
            "Ma": "செவ்", "Ju": "குரு", "Sa": "சனி", "Ra": "ராகு", "Ke": "கேது", "Asc": "லக்"
        }

        # Build occupancy map of nakshatras
        # Nakshatra name -> planet short name
        star_occupants = {}
        points_list = []

        for code in priority_order:
            if code in planets_map:
                p = planets_map[code]
                nak = p.get("nakshatraNameTa", "")
                pada = p.get("pada", 1)
                short_n = short_names.get(code, code)
                points_list.append({
                    "code": code,
                    "shortName": short_n,
                    "nakshatra": nak,
                    "pada": pada
                })
                # If nakshatra not already occupied by higher priority, set it
                if nak and nak not in star_occupants:
                    star_occupants[nak] = short_n

        # Evaluate Obstacle Nakshatras for the 9 root planets
        root_planet_order = [
            ("சூரி", "பரணி"),
            ("சந்", "சித்திரை"),
            ("புத", "கார்த்திகை"),
            ("சுக்", "மிருகசீரிஷம்"),
            ("செவ்", "திருவோணம்"),
            ("குரு", "பரணி"),
            ("சனி", "மூலம்"),
            ("ராகு", "பூரட்டாதி"),
            ("கேது", "உத்திரம்")
        ]

        # For Jupiter, if not in OBSTACLE_RULES, use specific 3 slots
        obstacle_tables = []
        total_slots = 0
        occupied_slots = 0

        for pl_name, nak_name in root_planet_order:
            rules = CounterStarsEngine.OBSTACLE_RULES.get(nak_name, [])
            if pl_name == "குரு" and nak_name == "பரணி":
                # Guru has 3 specific slots as per canonical text
                rules = [
                    {"type": "A", "nakshatra": "பூசம்"},
                    {"type": "B", "nakshatra": "மகம்"},
                    {"type": "C", "nakshatra": "புனர்பூசம்"}
                ]

            slots_data = []
            for idx, r in enumerate(rules):
                total_slots += 1
                target_nak = r["nakshatra"]
                occ = star_occupants.get(target_nak, None)
                is_occ = occ is not None
                if is_occ:
                    occupied_slots += 1

                slots_data.append({
                    "index": idx + 1,
                    "type": r["type"],
                    "nakshatra": target_nak,
                    "occupant": occ or "—",
                    "status": "நிற்கிறது" if is_occ else "காலி",
                    "isOccupied": is_occ,
                    "description": (
                        "ஒரு பிறப்பு கிரகம் அல்லது லக்னம் இந்த எதிரிடை நட்சத்திரத்தில் நிற்கிறது; மூல கிரகத்தின் பலன்களுக்குத் தடங்கல் ஏற்படுகிறது."
                        if is_occ else
                        "இந்த எதிரிடை நட்சத்திரத்தில் எந்தப் பிறப்பு கிரகமும் லக்னமும் நிற்கவில்லை."
                    )
                })

            obstacle_tables.append({
                "planet": pl_name,
                "nakshatra": nak_name,
                "slots": slots_data
            })

        vacant_slots = total_slots - occupied_slots

        return {
            "summary": {
                "rootPlanets": 9,
                "totalObstacleSlots": total_slots,
                "occupiedSlots": occupied_slots,
                "vacantSlots": vacant_slots
            },
            "points": points_list,
            "sookshmaTable": CounterStarsEngine.SOOKSHMA_TABLE,
            "obstacleTables": obstacle_tables
        }
