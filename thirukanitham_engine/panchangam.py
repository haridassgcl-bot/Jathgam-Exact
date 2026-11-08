"""
Thirukanitham Panchangam Engine (திருக்கணித பஞ்சாங்கம்)
Calculates the 5 limbs of the day according to Thirukanitham Drik-Ganitha rules:
1. திதி (Tithi - 30 Tithis across Shukla & Krishna Pakshas)
2. கரணம் (Karanam - 11 Karanas across 60 half-tithis)
3. யோகம் (Nithya Yoga - 27 Yogas based on Sun + Moon sum)
4. நட்சத்திரம் & பாதம் (Nakshatra & Pada based on Moon longitude)
5. வாரம் (Vaaram - Weekday based on Solar Sunrise)
+ ராகு காலம், எமகண்டம், குளிகை காலங்கள்.
"""

# 30 Tithis
TITHI_NAMES = [
    {"num": 1, "ta": "பிரதமை", "en": "Prathama", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 2, "ta": "துவிதியை", "en": "Dwitiya", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 3, "ta": "திருதியை", "en": "Tritiya", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 4, "ta": "சதுர்த்தி", "en": "Chaturthi", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 5, "ta": "பஞ்சமி", "en": "Panchami", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 6, "ta": "சஷ்டி", "en": "Shashti", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 7, "ta": "சப்தமி", "en": "Saptami", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 8, "ta": "அஷ்டமி", "en": "Ashtami", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 9, "ta": "நவமி", "en": "Navami", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 10, "ta": "தசமி", "en": "Dashami", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 11, "ta": "ஏகாதசி", "en": "Ekadashi", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 12, "ta": "துவாதசி", "en": "Dwadashi", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 13, "ta": "திரயோதசி", "en": "Trayodashi", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 14, "ta": "சதுர்த்தசி", "en": "Chaturdashi", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 15, "ta": "பௌர்ணமி (முழு நிலவு)", "en": "Pournami (Full Moon)", "pakshaTa": "சுக்ல பட்சம் (வளர்பிறை)", "pakshaEn": "Shukla Paksha"},
    {"num": 16, "ta": "பிரதமை", "en": "Prathama", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 17, "ta": "துவிதியை", "en": "Dwitiya", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 18, "ta": "திருதியை", "en": "Tritiya", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 19, "ta": "சதுர்த்தி", "en": "Chaturthi", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 20, "ta": "பஞ்சமி", "en": "Panchami", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 21, "ta": "சஷ்டி", "en": "Shashti", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 22, "ta": "சப்தமி", "en": "Saptami", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 23, "ta": "அஷ்டமி", "en": "Ashtami", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 24, "ta": "நவமி", "en": "Navami", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 25, "ta": "தசமி", "en": "Dashami", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 26, "ta": "ஏகாதசி", "en": "Ekadashi", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 27, "ta": "துவாதசி", "en": "Dwadashi", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 28, "ta": "திரயோதசி", "en": "Trayodashi", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 29, "ta": "சதுர்த்தசி", "en": "Chaturdashi", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"},
    {"num": 30, "ta": "அமாவாசை (இருள் நிலவு)", "en": "Amavasya (New Moon)", "pakshaTa": "கிருஷ்ண பட்சம் (தேய்பிறை)", "pakshaEn": "Krishna Paksha"}
]

# 27 Nithya Yogas
NITHYA_YOGAS = [
    {"id": 1, "ta": "விஷ்டம்பம்", "en": "Vishkambha", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 2, "ta": "ப்ரீதி", "en": "Priti", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 3, "ta": "ஆயுஷ்மான்", "en": "Ayushman", "natureTa": "அதி சுபம்", "natureEn": "Very Auspicious"},
    {"id": 4, "ta": "சௌபாக்யம்", "en": "Saubhagya", "natureTa": "அதி சுபம்", "natureEn": "Very Auspicious"},
    {"id": 5, "ta": "சோபனம்", "en": "Shobhana", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 6, "ta": "அதிகண்டம்", "en": "Atiganda", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 7, "ta": "சுகர்மம்", "en": "Sukarma", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 8, "ta": "திருதி", "en": "Dhriti", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 9, "ta": "சூலம்", "en": "Shoola", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 10, "ta": "கண்டம்", "en": "Ganda", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 11, "ta": "விருத்தி", "en": "Vriddhi", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 12, "ta": "துருவம்", "en": "Dhruva", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 13, "ta": "வியாகாதம்", "en": "Vyaghata", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 14, "ta": "ஹர்ஷணம்", "en": "Harshana", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 15, "ta": "வஜ்ரம்", "en": "Vajra", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 16, "ta": "சித்தி", "en": "Siddhi", "natureTa": "அதி சுபம்", "natureEn": "Very Auspicious"},
    {"id": 17, "ta": "வியதீபாதம்", "en": "Vyatipata", "natureTa": "அசுபம்", "natureEn": "Inauspicious"},
    {"id": 18, "ta": "வரியான்", "en": "Variyan", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 19, "ta": "பரிகம்", "en": "Parigha", "natureTa": "மத்திமம்", "natureEn": "Moderate"},
    {"id": 20, "ta": "சிவம்", "en": "Shiva", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 21, "ta": "சித்தம்", "en": "Siddha", "natureTa": "அதி சுபம்", "natureEn": "Very Auspicious"},
    {"id": 22, "ta": "சாத்தியம்", "en": "Sadhya", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 23, "ta": "சுபம்", "en": "Shubha", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 24, "ta": "சுப்ரம்", "en": "Shukla", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 25, "ta": "பிரம்மம்", "en": "Brahma", "natureTa": "அதி சுபம்", "natureEn": "Very Auspicious"},
    {"id": 26, "ta": "இந்திரம்", "en": "Indra", "natureTa": "சுபம்", "natureEn": "Auspicious"},
    {"id": 27, "ta": "வைதிருதி", "en": "Vaidhriti", "natureTa": "அசுபம்", "natureEn": "Inauspicious"}
]

# 11 Karanas (4 Fixed / Sthira + 7 Repeating / Chara)
CHARA_KARANAS = [
    {"id": 1, "ta": "பவம்", "en": "Bava", "type": "Chara"},
    {"id": 2, "ta": "பாலவம்", "en": "Balava", "type": "Chara"},
    {"id": 3, "ta": "கௌலவம்", "en": "Kaulava", "type": "Chara"},
    {"id": 4, "ta": "தைதுலை", "en": "Taitila", "type": "Chara"},
    {"id": 5, "ta": "கரசை", "en": "Garija", "type": "Chara"},
    {"id": 6, "ta": "வனசை", "en": "Vanija", "type": "Chara"},
    {"id": 7, "ta": "பத்திரை (விஷ்டி)", "en": "Vishti (Bhadra)", "type": "Chara"}
]

STHIRA_KARANAS = {
    57: {"id": 8, "ta": "சகுனி", "en": "Shakuni", "type": "Sthira"},
    58: {"id": 9, "ta": "சதுஷ்பாதம்", "en": "Chatushpada", "type": "Sthira"},
    59: {"id": 10, "ta": "நாகவம்", "en": "Naga", "type": "Sthira"},
    0:  {"id": 11, "ta": "கிம்ஸ்துக்னம்", "en": "Kimstughna", "type": "Sthira"}
}

# 7 Weekdays (வாரம்)
VAARAM_LIST = [
    {"num": 0, "ta": "ஞாயிறு", "en": "Sunday", "lord": "சூரியன் (Sun)"},
    {"num": 1, "ta": "திங்கள்", "en": "Monday", "lord": "சந்திரன் (Moon)"},
    {"num": 2, "ta": "செவ்வாய்", "en": "Tuesday", "lord": "செவ்வாய் (Mars)"},
    {"num": 3, "ta": "புதன்", "en": "Wednesday", "lord": "புதன் (Mercury)"},
    {"num": 4, "ta": "வியாழன்", "en": "Thursday", "lord": "குரு (Jupiter)"},
    {"num": 5, "ta": "வெள்ளி", "en": "Friday", "lord": "சுக்கிரன் (Venus)"},
    {"num": 6, "ta": "சனி", "en": "Saturday", "lord": "சனி (Saturn)"}
]

# 27 Nakshatras
NAKSHATRA_NAMES = [
    "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிஷம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
]


class ThirukanithamPanchangam:
    """
    Computes Thirukanitham Panchangam Elements based on Sun and Moon Longitudes.
    """

    @staticmethod
    def calculate_panchangam(sun_long: float, moon_long: float, weekday_idx: int) -> dict:
        """
        Calculate complete Thirukanitham Panchangam:
        Tithi, Karanam, Nithya Yoga, Nakshatra, Pada, Vaaram.
        """
        # 1. Tithi (திதி): (Moon - Sun) / 12°
        diff = (moon_long - sun_long + 360.0) % 360.0
        tithi_idx = int(diff / 12.0)
        tithi_data = TITHI_NAMES[tithi_idx]
        tithi_elapsed_pct = round(((diff % 12.0) / 12.0) * 100.0, 2)

        # 2. Karanam (கரணம்): (Moon - Sun) / 6°
        k_index = int(diff / 6.0)  # 0 to 59
        if k_index in STHIRA_KARANAS:
            karanam_data = STHIRA_KARANAS[k_index]
        else:
            # Shifted by 1 for repeating chara karanas
            chara_idx = (k_index - 1) % 7
            karanam_data = CHARA_KARANAS[chara_idx]
        karanam_elapsed_pct = round(((diff % 6.0) / 6.0) * 100.0, 2)

        # 3. Nithya Yoga (யோகம்): (Sun + Moon) / (13° 20')
        yoga_sum = (sun_long + moon_long) % 360.0
        yoga_idx = int(yoga_sum / (360.0 / 27.0))
        yoga_data = NITHYA_YOGAS[yoga_idx % 27]
        yoga_elapsed_pct = round(((yoga_sum % (360.0 / 27.0)) / (360.0 / 27.0)) * 100.0, 2)

        # 4. Nakshatra & Pada (நட்சத்திரம் & பாதம்): Moon / 13° 20'
        nak_length = 360.0 / 27.0  # 13.333333°
        nak_idx = int(moon_long / nak_length)
        nak_name_ta = NAKSHATRA_NAMES[nak_idx]
        nak_elapsed_deg = moon_long % nak_length
        pada = int(nak_elapsed_deg / (nak_length / 4.0)) + 1
        nak_elapsed_pct = round((nak_elapsed_deg / nak_length) * 100.0, 2)

        # 5. Vaaram (வாரம்): Weekday
        vaaram_data = VAARAM_LIST[weekday_idx % 7]

        # Inauspicious Timings of Weekday (Rahu Kalam, Yamagandam, Kuligai)
        timings_map = {
            0: {"rahu": "16:30 - 18:00", "yama": "12:00 - 13:30", "kuli": "15:00 - 16:30"},
            1: {"rahu": "07:30 - 09:00", "yama": "10:30 - 12:00", "kuli": "13:30 - 15:00"},
            2: {"rahu": "15:00 - 16:30", "yama": "09:00 - 10:30", "kuli": "12:00 - 13:30"},
            3: {"rahu": "12:00 - 13:30", "yama": "07:30 - 09:00", "kuli": "10:30 - 12:00"},
            4: {"rahu": "13:30 - 15:00", "yama": "06:00 - 07:30", "kuli": "09:00 - 10:30"},
            5: {"rahu": "10:30 - 12:00", "yama": "15:00 - 16:30", "kuli": "07:30 - 09:00"},
            6: {"rahu": "09:00 - 10:30", "yama": "13:30 - 15:00", "kuli": "06:00 - 07:30"},
        }
        day_timings = timings_map[weekday_idx % 7]

        return {
            "tithi": {
                "nameTa": tithi_data["ta"],
                "nameEn": tithi_data["en"],
                "pakshaTa": tithi_data["pakshaTa"],
                "pakshaEn": tithi_data["pakshaEn"],
                "number": tithi_data["num"],
                "elapsedPercent": tithi_elapsed_pct,
                "displayTa": f"{tithi_data['pakshaTa']} - {tithi_data['ta']}"
            },
            "karanam": {
                "nameTa": karanam_data["ta"],
                "nameEn": karanam_data["en"],
                "type": karanam_data["type"],
                "elapsedPercent": karanam_elapsed_pct
            },
            "yoga": {
                "nameTa": yoga_data["ta"],
                "nameEn": yoga_data["en"],
                "natureTa": yoga_data["natureTa"],
                "natureEn": yoga_data["natureEn"],
                "elapsedPercent": yoga_elapsed_pct
            },
            "nakshatra": {
                "nameTa": nak_name_ta,
                "index": nak_idx,
                "pada": pada,
                "elapsedPercent": nak_elapsed_pct,
                "displayTa": f"{nak_name_ta} - {pada}ம் பாதம்"
            },
            "vaaram": {
                "nameTa": vaaram_data["ta"],
                "nameEn": vaaram_data["en"],
                "lord": vaaram_data["lord"]
            },
            "inauspiciousTimings": {
                "rahuKalam": day_timings["rahu"],
                "yamagandam": day_timings["yama"],
                "kuligai": day_timings["kuli"]
            }
        }
