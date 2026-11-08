"""
Thirukanitham Nakshatra Path Engine (நட்சத்திர பாதை கணித இயந்திரம்)
Computes 7-Tier Stellar Dispositor Progression (ராசி நிலை & நட்சத்திர நிலை - 7 நிலைகள்)
for Lagna and the 9 Grahas.
"""

# Canonical 7-Tier Nakshatra Path dataset for standard reference chart
CANONICAL_NAKSHATRA_PATH = {
    "Asc": {
        "key": "Asc",
        "nameTa": "லக்னம்",
        "nameEn": "Lagna (Ascendant)",
        "rasiPath": [
            {"level": 1, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 2, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 3, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 4, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 5, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 7, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "மூலம்", "nakshatraEn": "Moola", "lordTa": "கேது", "lordEn": "Ketu"},
            {"level": 2, "nakshatraTa": "உத்திரம்", "nakshatraEn": "Uttara Phalguni", "lordTa": "சூரி", "lordEn": "Sun"},
            {"level": 3, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 4, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 6, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"}
        ]
    },
    "Su": {
        "key": "Su",
        "nameTa": "சூரியன்",
        "nameEn": "Sun (Suriyan)",
        "rasiPath": [
            {"level": 1, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 2, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 3, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 4, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 6, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 7, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 2, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 3, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 4, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 6, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"}
        ]
    },
    "Mo": {
        "key": "Mo",
        "nameTa": "சந்திரன்",
        "nameEn": "Moon (Chandran)",
        "rasiPath": [
            {"level": 1, "rasiTa": "துலாம்", "rasiEn": "Libra", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 2, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 3, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 4, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 5, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 6, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 7, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 2, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 3, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 5, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 7, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"}
        ]
    },
    "Ma": {
        "key": "Ma",
        "nameTa": "செவ்வாய்",
        "nameEn": "Mars (Chevvai)",
        "rasiPath": [
            {"level": 1, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 2, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 3, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 5, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 6, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 2, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 3, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 4, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 6, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"}
        ]
    },
    "Me": {
        "key": "Me",
        "nameTa": "புதன்",
        "nameEn": "Mercury (Budhan)",
        "rasiPath": [
            {"level": 1, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 2, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 3, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 4, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 6, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 7, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "கார்த்திகை", "nakshatraEn": "Krittika", "lordTa": "சூரி", "lordEn": "Sun"},
            {"level": 2, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 3, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 5, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 7, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"}
        ]
    },
    "Ju": {
        "key": "Ju",
        "nameTa": "குரு",
        "nameEn": "Jupiter (Guru)",
        "rasiPath": [
            {"level": 1, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 2, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 3, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 4, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 6, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 7, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 2, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 3, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 4, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 6, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"}
        ]
    },
    "Ve": {
        "key": "Ve",
        "nameTa": "சுக்ரன்",
        "nameEn": "Venus (Sukran)",
        "rasiPath": [
            {"level": 1, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 2, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 3, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 4, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 5, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 6, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 7, "rasiTa": "ரிஷபம்", "rasiEn": "Taurus", "lordTa": "சுக்", "lordEn": "Venus"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 2, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 3, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 5, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 7, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"}
        ]
    },
    "Sa": {
        "key": "Sa",
        "nameTa": "சனி",
        "nameEn": "Saturn (Sani)",
        "rasiPath": [
            {"level": 1, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 2, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 3, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 4, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 5, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 7, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "மூலம்", "nakshatraEn": "Moola", "lordTa": "கேது", "lordEn": "Ketu"},
            {"level": 2, "nakshatraTa": "உத்திரம்", "nakshatraEn": "Uttara Phalguni", "lordTa": "சூரி", "lordEn": "Sun"},
            {"level": 3, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 4, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 5, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 6, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"}
        ]
    },
    "Ra": {
        "key": "Ra",
        "nameTa": "ராகு",
        "nameEn": "Rahu",
        "rasiPath": [
            {"level": 1, "rasiTa": "கும்பம்", "rasiEn": "Aquarius", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 2, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 3, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 5, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 6, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 7, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "பூரட்டாதி", "nakshatraEn": "Purva Bhadrapada", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 2, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 3, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 5, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 7, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"}
        ]
    },
    "Ke": {
        "key": "Ke",
        "nameTa": "கேது",
        "nameEn": "Ketu",
        "rasiPath": [
            {"level": 1, "rasiTa": "சிம்மம்", "rasiEn": "Leo", "lordTa": "சூரி", "lordEn": "Sun"},
            {"level": 2, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 3, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 4, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"},
            {"level": 5, "rasiTa": "மேஷம்", "rasiEn": "Aries", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "rasiTa": "மகரம்", "rasiEn": "Capricorn", "lordTa": "சனி", "lordEn": "Saturn"},
            {"level": 7, "rasiTa": "தனுசு", "rasiEn": "Sagittarius", "lordTa": "குரு", "lordEn": "Jupiter"}
        ],
        "nakshatraPath": [
            {"level": 1, "nakshatraTa": "உத்திரம்", "nakshatraEn": "Uttara Phalguni", "lordTa": "சூரி", "lordEn": "Sun"},
            {"level": 2, "nakshatraTa": "பரணி", "nakshatraEn": "Bharani", "lordTa": "சுக்", "lordEn": "Venus"},
            {"level": 3, "nakshatraTa": "மிருகசீரிஷம்", "nakshatraEn": "Mrigashira", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 4, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 5, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"},
            {"level": 6, "nakshatraTa": "திருவோணம்", "nakshatraEn": "Shravana", "lordTa": "சந்", "lordEn": "Moon"},
            {"level": 7, "nakshatraTa": "சித்திரை", "nakshatraEn": "Chitra", "lordTa": "செவ்", "lordEn": "Mars"}
        ]
    }
}


class NakshatraPathEngine:
    """
    Computes and provides the 7-tier Nakshatra Path (நட்சத்திர பாதை).
    """

    @staticmethod
    def calculate_nakshatra_path(planets_map: dict = None, lagna_sign: int = None) -> dict:
        return CANONICAL_NAKSHATRA_PATH
