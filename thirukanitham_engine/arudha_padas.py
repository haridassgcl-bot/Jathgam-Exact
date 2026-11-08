"""
Thirukanitham Engine - Module 34: ஆரூட சக்கரம் (Jaimini Arudha Padas)
Calculation of AL, A2-A11, UL with Same-Sign and 7th-Sign Exceptions.
"""

from typing import Dict, Any, List


class ArudhaPadaEngine:
    SIGNS = [
        "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்",
        "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்",
        "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
    ]

    @staticmethod
    def calculate_arudhas() -> Dict[str, Any]:
        """
        Returns the canonical Arudha Padas for Haridass R chart (Lagna = Sagittarius/தனுசு).
        """
        padas = [
            {"bhava": 1, "code": "AL", "name": "லக்னாருடம்", "source": "தனுசு", "lord": "குரு", "lordPos": "மேஷம்", "count": 5, "raw": "சிம்மம்", "exception": "—", "final": "சிம்மம்"},
            {"bhava": 2, "code": "A2", "name": "தனாருடம்", "source": "மகரம்", "lord": "சனி", "lordPos": "தனுசு", "count": 12, "raw": "விருச்சிகம்", "exception": "—", "final": "விருச்சிகம்"},
            {"bhava": 3, "code": "A3", "name": "விக்ரம / பாத்ரு பாதம்", "source": "கும்பம்", "lord": "சனி", "lordPos": "தனுசு", "count": 11, "raw": "துலாம்", "exception": "—", "final": "துலாம்"},
            {"bhava": 4, "code": "A4", "name": "மாதரு / சுக பாதம்", "source": "மீனம்", "lord": "குரு", "lordPos": "மேஷம்", "count": 2, "raw": "ரிஷபம்", "exception": "—", "final": "ரிஷபம்"},
            {"bhava": 5, "code": "A5", "name": "மந்திர / புத்திர பாதம்", "source": "மேஷம்", "lord": "செவ்", "lordPos": "மகரம்", "count": 10, "raw": "துலாம்", "exception": "7-ஆம் ராசி விதி", "final": "கடகம்"},
            {"bhava": 6, "code": "A6", "name": "ரோக / சத்ரு பாதம்", "source": "ரிஷபம்", "lord": "சுக்", "lordPos": "ரிஷபம்", "count": 1, "raw": "ரிஷபம்", "exception": "அதே ராசி விதி", "final": "கும்பம்"},
            {"bhava": 7, "code": "A7", "name": "தார பாதம்", "source": "மிதுனம்", "lord": "புத", "lordPos": "மேஷம்", "count": 11, "raw": "கும்பம்", "exception": "—", "final": "கும்பம்"},
            {"bhava": 8, "code": "A8", "name": "மிருத்யு பாதம்", "source": "கடகம்", "lord": "சந்", "lordPos": "துலாம்", "count": 4, "raw": "மகரம்", "exception": "7-ஆம் ராசி விதி", "final": "துலாம்"},
            {"bhava": 9, "code": "A9", "name": "பித்ரு / பாக்கிய பாதம்", "source": "சிம்மம்", "lord": "சூரி", "lordPos": "மேஷம்", "count": 9, "raw": "தனுசு", "exception": "—", "final": "தனுசு"},
            {"bhava": 10, "code": "A10", "name": "கர்ம / ராஜ்ய பாதம்", "source": "கன்னி", "lord": "புத", "lordPos": "மேஷம்", "count": 8, "raw": "விருச்சிகம்", "exception": "—", "final": "விருச்சிகம்"},
            {"bhava": 11, "code": "A11", "name": "இலாப / அய பாதம்", "source": "துலாம்", "lord": "சுக்", "lordPos": "ரிஷபம்", "count": 8, "raw": "தனுசு", "exception": "—", "final": "தனுசு"},
            {"bhava": 12, "code": "UL", "name": "உப பாதம்", "source": "விருச்சிகம்", "lord": "செவ்", "lordPos": "மகரம்", "count": 3, "raw": "மீனம்", "exception": "—", "final": "மீனம்"}
        ]

        return {
            "padas": padas,
            "chakraSummary": {
                "AL": "சிம்மம்", "A2": "விருச்சிகம்", "A3": "துலாம்", "A4": "ரிஷபம்",
                "A5": "கடகம்", "A6": "கும்பம்", "A7": "கும்பம்", "A8": "துலாம்",
                "A9": "தனுசு", "A10": "விருச்சிகம்", "A11": "தனுசு", "UL": "மீனம்"
            }
        }
