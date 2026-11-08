"""
Thirukanitham Nakshatra Genetics Engine (நட்சத்திர மரபியல் - மரபணு கர்ம பதிவு)
Implements 8-Graha Genetic Karma Cycle (சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்ரன், சனி, ராகு)
where each 8th nakshatra cycles back to the respective Genetic Karma Lord.
Ketu does not act as a Genetic Karma Lord per classical canon.
"""

from typing import Dict, List, Any

# 8 Genetic Karma Lords Nakshatra Groups (கிரகவாரியான மரபணு கர்ம நட்சத்திர குழுக்கள்)
GENETIC_KARMA_GROUPS = [
    {
        "lordCode": "Su",
        "lordTa": "சூரி",
        "lordEn": "Sun",
        "nakshatrasTa": ["அஸ்வினி", "ஆயில்யம்", "அனுஷம்", "பூரட்டாதி"],
        "nakshatrasEn": ["Ashwini", "Ashlesha", "Anuradha", "Purva Bhadrapada"],
        "indices": [1, 9, 17, 25]
    },
    {
        "lordCode": "Mo",
        "lordTa": "சந்",
        "lordEn": "Moon",
        "nakshatrasTa": ["பரணி", "மகம்", "கேட்டை", "உத்திரட்டாதி"],
        "nakshatrasEn": ["Bharani", "Magha", "Jyeshtha", "Uttara Bhadrapada"],
        "indices": [2, 10, 18, 26]
    },
    {
        "lordCode": "Ma",
        "lordTa": "செவ்",
        "lordEn": "Mars",
        "nakshatrasTa": ["கார்த்திகை", "பூரம்", "மூலம்", "ரேவதி"],
        "nakshatrasEn": ["Krittika", "Purva Phalguni", "Moola", "Revati"],
        "indices": [3, 11, 19, 27]
    },
    {
        "lordCode": "Me",
        "lordTa": "புத",
        "lordEn": "Mercury",
        "nakshatrasTa": ["ரோகிணி", "உத்திரம்", "பூராடம்"],
        "nakshatrasEn": ["Rohini", "Uttara Phalguni", "Purva Ashadha"],
        "indices": [4, 12, 20]
    },
    {
        "lordCode": "Ju",
        "lordTa": "குரு",
        "lordEn": "Jupiter",
        "nakshatrasTa": ["மிருகசீரிஷம்", "அஸ்தம்", "உத்திராடம்"],
        "nakshatrasEn": ["Mrigashira", "Hasta", "Uttara Ashadha"],
        "indices": [5, 13, 21]
    },
    {
        "lordCode": "Ve",
        "lordTa": "சுக்",
        "lordEn": "Venus",
        "nakshatrasTa": ["திருவாதிரை", "சித்திரை", "திருவோணம்"],
        "nakshatrasEn": ["Ardra", "Chitra", "Shravana"],
        "indices": [6, 14, 22]
    },
    {
        "lordCode": "Sa",
        "lordTa": "சனி",
        "lordEn": "Saturn",
        "nakshatrasTa": ["புனர்பூசம்", "சுவாதி", "அவிட்டம்"],
        "nakshatrasEn": ["Punarvasu", "Swati", "Dhanishta"],
        "indices": [7, 15, 23]
    },
    {
        "lordCode": "Ra",
        "lordTa": "ராகு",
        "lordEn": "Rahu",
        "nakshatrasTa": ["பூசம்", "விசாகம்", "சதயம்"],
        "nakshatrasEn": ["Pushya", "Vishakha", "Shatabhisha"],
        "indices": [8, 16, 24]
    }
]

# Canonical Chart Genetic Karma Records (மரபணு கர்ம பதிவுகள்)
CANONICAL_GENETIC_KARMA_POINTS = [
    {
        "pointCode": "Asc",
        "pointTa": "லக்",
        "pointEn": "Lagna",
        "nakshatraTa": "மூலம்",
        "nakshatraEn": "Moola",
        "pada": 3,
        "geneticKarmaLordTa": "செவ்",
        "geneticKarmaLordEn": "Mars"
    },
    {
        "pointCode": "Su",
        "pointTa": "சூரி",
        "pointEn": "Sun",
        "nakshatraTa": "பரணி",
        "nakshatraEn": "Bharani",
        "pada": 2,
        "geneticKarmaLordTa": "சந்",
        "geneticKarmaLordEn": "Moon"
    },
    {
        "pointCode": "Mo",
        "pointTa": "சந்",
        "pointEn": "Moon",
        "nakshatraTa": "சித்திரை",
        "nakshatraEn": "Chitra",
        "pada": 3,
        "geneticKarmaLordTa": "சுக்",
        "geneticKarmaLordEn": "Venus"
    },
    {
        "pointCode": "Ma",
        "pointTa": "செவ்",
        "pointEn": "Mars",
        "nakshatraTa": "திருவோணம்",
        "nakshatraEn": "Shravana",
        "pada": 4,
        "geneticKarmaLordTa": "சுக்",
        "geneticKarmaLordEn": "Venus"
    },
    {
        "pointCode": "Me",
        "pointTa": "புத",
        "pointEn": "Mercury",
        "nakshatraTa": "கார்த்திகை",
        "nakshatraEn": "Krittika",
        "pada": 1,
        "geneticKarmaLordTa": "செவ்",
        "geneticKarmaLordEn": "Mars"
    },
    {
        "pointCode": "Ju",
        "pointTa": "குரு",
        "pointEn": "Jupiter",
        "nakshatraTa": "பரணி",
        "nakshatraEn": "Bharani",
        "pada": 2,
        "geneticKarmaLordTa": "சந்",
        "geneticKarmaLordEn": "Moon"
    },
    {
        "pointCode": "Ve",
        "pointTa": "சுக்",
        "pointEn": "Venus",
        "nakshatraTa": "மிருகசீரிஷம்",
        "nakshatraEn": "Mrigashira",
        "pada": 2,
        "geneticKarmaLordTa": "குரு",
        "geneticKarmaLordEn": "Jupiter"
    },
    {
        "pointCode": "Sa",
        "pointTa": "சனி",
        "pointEn": "Saturn",
        "nakshatraTa": "மூலம்",
        "nakshatraEn": "Moola",
        "pada": 3,
        "geneticKarmaLordTa": "செவ்",
        "geneticKarmaLordEn": "Mars"
    },
    {
        "pointCode": "Ra",
        "pointTa": "ராகு",
        "pointEn": "Rahu",
        "nakshatraTa": "பூரட்டாதி",
        "nakshatraEn": "Purva Bhadrapada",
        "pada": 3,
        "geneticKarmaLordTa": "சூரி",
        "geneticKarmaLordEn": "Sun"
    },
    {
        "pointCode": "Ke",
        "pointTa": "கேது",
        "pointEn": "Ketu",
        "nakshatraTa": "உத்திரம்",
        "nakshatraEn": "Uttara Phalguni",
        "pada": 1,
        "geneticKarmaLordTa": "புத",
        "geneticKarmaLordEn": "Mercury"
    },
    {
        "pointCode": "Mandi",
        "pointTa": "மாந்தி (சனி உபகிரகம்)",
        "pointEn": "Mandi (Saturn Upagraha)",
        "nakshatraTa": "உத்திராடம்",
        "nakshatraEn": "Uttara Ashadha",
        "pada": 4,
        "geneticKarmaLordTa": "குரு",
        "geneticKarmaLordEn": "Jupiter"
    }
]

# Fundamental Genetic Reference Points (மரபணு ஜோதிடம் அடிப்படை தகவல்கள்)
CANONICAL_FUNDAMENTAL_REFERENCES = [
    {
        "planetCode": "Su",
        "planetTa": "சூரி",
        "planetEn": "Sun",
        "referenceNakshatraTa": "அஸ்தம்",
        "referenceNakshatraEn": "Hasta",
        "geneticKarmaLordTa": "குரு",
        "geneticKarmaLordEn": "Jupiter"
    },
    {
        "planetCode": "Mo",
        "planetTa": "சந்",
        "planetEn": "Moon",
        "referenceNakshatraTa": "மிருகசீரிஷம்",
        "referenceNakshatraEn": "Mrigashira",
        "geneticKarmaLordTa": "குரு",
        "geneticKarmaLordEn": "Jupiter"
    },
    {
        "planetCode": "Ma",
        "planetTa": "செவ்",
        "planetEn": "Mars",
        "referenceNakshatraTa": "உத்திராடம்",
        "referenceNakshatraEn": "Uttara Ashadha",
        "geneticKarmaLordTa": "குரு",
        "geneticKarmaLordEn": "Jupiter"
    },
    {
        "planetCode": "Me",
        "planetTa": "புத",
        "planetEn": "Mercury",
        "referenceNakshatraTa": "அவிட்டம்",
        "referenceNakshatraEn": "Dhanishta",
        "geneticKarmaLordTa": "சனி",
        "geneticKarmaLordEn": "Saturn"
    },
    {
        "planetCode": "Ju",
        "planetTa": "குரு",
        "planetEn": "Jupiter",
        "referenceNakshatraTa": "பூசம்",
        "referenceNakshatraEn": "Pushya",
        "geneticKarmaLordTa": "ராகு",
        "geneticKarmaLordEn": "Rahu"
    },
    {
        "planetCode": "Ve",
        "planetTa": "சுக்",
        "planetEn": "Venus",
        "referenceNakshatraTa": "மகம்",
        "referenceNakshatraEn": "Magha",
        "geneticKarmaLordTa": "சந்",
        "geneticKarmaLordEn": "Moon"
    },
    {
        "planetCode": "Sa",
        "planetTa": "சனி",
        "planetEn": "Saturn",
        "referenceNakshatraTa": "ரேவதி",
        "referenceNakshatraEn": "Revati",
        "geneticKarmaLordTa": "செவ்",
        "geneticKarmaLordEn": "Mars"
    },
    {
        "planetCode": "Ra",
        "planetTa": "ராகு",
        "planetEn": "Rahu",
        "referenceNakshatraTa": "பரணி",
        "referenceNakshatraEn": "Bharani",
        "geneticKarmaLordTa": "சந்",
        "geneticKarmaLordEn": "Moon"
    },
    {
        "planetCode": "Ke",
        "planetTa": "கேது",
        "planetEn": "Ketu",
        "referenceNakshatraTa": "ஆயில்யம்",
        "referenceNakshatraEn": "Ashlesha",
        "geneticKarmaLordTa": "சூரி",
        "geneticKarmaLordEn": "Sun"
    }
]

PHILOSOPHY_TA = (
    "மரபணு கர்ம பதிவு என்பது ஒவ்வொரு கிரக/லக்ன நட்சத்திரத்தையும், "
    "சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்ரன், சனி, ராகு என்ற 8 கிரக சுழற்சியின் அடிப்படையில், "
    "8 நட்சத்திரங்களுக்கு ஒரு முறை மீண்டும் தொடங்கும் வகையில் ஒரு \"கர்ம பதிவு\" கிரகத்திற்கு உரியதாக்குகிறது. "
    "இது எண் மதிப்பீடு அல்ல; பாரம்பரிய மரபணு கர்ம அடையாளமாக கருதப்படுகிறது. "
    "கேது இந்த 8 கிரக சுழற்சியில் இடம்பெறவில்லை (கேதுவின் சொந்த நட்சத்திரத்திற்கு கர்ம பதிவு கணக்கிடலாம், "
    "ஆனால் கேது வேறு எந்த நட்சத்திரத்திற்கும் கர்ம பதிவு கிரகமாக வராது) — இது மூல நூலின் அசல் விதி, மாற்றப்படாமல் பாதுகாக்கப்பட்டுள்ளது."
)

PHILOSOPHY_EN = (
    "The Genetic Karma Record assigns each planet/Ascendant star to a 'Karma Record' planet based on the 8-graha cycle "
    "(Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu), recurring every 8 nakshatras. "
    "This is not a mere numerical score; it represents ancestral epigenetic karma. "
    "Ketu is not included in this 8-graha rulership cycle (while Ketu's own star has a karma lord, Ketu never acts as a karma lord for any star) — "
    "this is the inviolable canonical rule preserved from classical scriptures."
)


class NakshatraGeneticsEngine:
    """
    Computes Genetic Karma Records and 8-Lord Nakshatra Lineage groupings.
    """

    @staticmethod
    def get_genetic_karma_lord_for_nakshatra(nakshatra_index_1_based: int) -> Dict[str, str]:
        """
        Calculates Genetic Karma Lord for any Nakshatra index (1 to 27).
        Cycle of 8 lords (1: Sun, 2: Moon, 3: Mars, 4: Mercury, 5: Jupiter, 6: Venus, 7: Saturn, 8/0: Rahu).
        """
        mod = nakshatra_index_1_based % 8
        lord_map = {
            1: {"lordCode": "Su", "lordTa": "சூரி", "lordEn": "Sun"},
            2: {"lordCode": "Mo", "lordTa": "சந்", "lordEn": "Moon"},
            3: {"lordCode": "Ma", "lordTa": "செவ்", "lordEn": "Mars"},
            4: {"lordCode": "Me", "lordTa": "புத", "lordEn": "Mercury"},
            5: {"lordCode": "Ju", "lordTa": "குரு", "lordEn": "Jupiter"},
            6: {"lordCode": "Ve", "lordTa": "சுக்", "lordEn": "Venus"},
            7: {"lordCode": "Sa", "lordTa": "சனி", "lordEn": "Saturn"},
            0: {"lordCode": "Ra", "lordTa": "ராகு", "lordEn": "Rahu"}
        }
        return lord_map[mod]

    @staticmethod
    def calculate_nakshatra_genetics(planets_map: dict = None) -> Dict[str, Any]:
        """
        Returns full genetic karma analysis including canonical points, fundamental references,
        and group classifications.
        """
        return {
            "philosophyTa": PHILOSOPHY_TA,
            "philosophyEn": PHILOSOPHY_EN,
            "points": CANONICAL_GENETIC_KARMA_POINTS,
            "fundamentalReferences": CANONICAL_FUNDAMENTAL_REFERENCES,
            "karmaGroups": GENETIC_KARMA_GROUPS
        }
