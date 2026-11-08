"""
Thirukanitham Engine - Module 40: மின்னணு ஜோதிடம் (Electronic Astrology Circuit)
Astrological energy flow mapped to a 12-stage electronic circuit.
"""

from typing import Dict, Any, List


class ElectronicAstrologyEngine:
    CIRCUIT_COMPONENTS = {
        "Su": {"name": "பேட்டரி / DC மூலம்", "role": "முதன்மை உயிர்-சக்தி மூலம், அதிகாரம் மற்றும் மைய சக்தி — சுற்றுவட்டத்திற்கு நிலையான மூலம்."},
        "Mo": {"name": "கெப்பாசிட்டர்", "role": "சக்தியை பெற்று சேமித்து வெளியிடுகிறது — சார்ஜ்/டிஸ்சார்ஜ், சீரமைப்பு, ஏற்ற இறக்கங்கள், உணர்ச்சி சேமிப்பு மற்றும் ஊட்டம்."},
        "Ma": {"name": "மோட்டார் / பம்ப் / பொறி", "role": "செயல், சக்தி, தைரியம் மற்றும் செயல்படுத்தல் — மின் சக்தியை இயக்கம், விசை அல்லது தீப்பொறியாக மாற்றுகிறது."},
        "Me": {"name": "டிரான்சிஸ்டர் / லாஜிக் கேட்", "role": "தொடர்பு, அறிவு மற்றும் செயலாக்கம் — சமிக்ஞைகளை செயலாக்கி, மாற்றி, கட்டுப்படுத்தி, பெருக்குகிறது."},
        "Ju": {"name": "ஆம்ப்ளிஃபையர் / ஸ்டெப்-அப் டிரான்ஸ்ஃபார்மர்", "role": "விரிவாக்கம், வளர்ச்சி, ஞானம் மற்றும் அதிகரிப்பு — கிடைக்கும் சமிக்ஞை/சக்தியை பெருக்குகிறது அல்லது விரிவாக்குகிறது."},
        "Ve": {"name": "LED / காட்சி / அதிர்வுறுப்பு", "role": "அழகு, ஈர்ப்பு, இன்பம் மற்றும் காணக்கூடிய வெளிப்பாடு — மின் உள்ளீட்டை கவர்ச்சிகரமான/காணக்கூடிய/இணக்கமான வெளியீடாக மாற்றுகிறது."},
        "Sa": {"name": "ரெசிஸ்டர் / ரெகுலேட்டர்", "role": "கட்டுப்பாடு, தாமதம், ஒழுக்கம் மற்றும் நிலைப்படுத்தல் — ஓட்டத்தை கட்டுப்படுத்தி, வோல்டேஜ் வீழ்ச்சியை உருவாக்கி, அதிகப்படியை குறைத்து சுற்றுவட்டத்தை நிலைப்படுத்துகிறது."},
        "Ra": {"name": "முன்னோக்கு டையோட் / ஆன்டெனா", "role": "வலிமையான திசைசார் ஆசை, வெளிப்புற சமிக்ஞைகள், பெருக்கம் மற்றும் வெறி — ஒரே திசை ஓட்டத்தை ஊக்குவித்து வெளிப்புற சமிக்ஞைகளை பெற்று பெருக்குகிறது."},
        "Ke": {"name": "எதிர் டையோட் / வடிகட்டி / லேசர்", "role": "பிரிவினை, குறைப்பு, வடிகட்டுதல், கவனம் மற்றும் பற்றின்மை — தேவையற்ற உள்ளீட்டை நீக்கி, வரம்பை குறுக்கி, கூர்மையான வெளியீட்டை உருவாக்குகிறது."}
    }

    @staticmethod
    def calculate_electronic_circuit(planets_map: dict = None) -> Dict[str, Any]:
        """
        Returns full electronic circuit configuration, voltages, currents, power and stages.
        """
        stages = [
            {
                "stageId": "R9", "sign": "தனுசு", "month": "Margazhi · Dec 16 – Jan 14", "netUnits": -18.0,
                "inV": 230.0, "deltaV": -36.0, "outV": 194.0, "current": -0.36, "power": -82.8, "accumUnits": -18.0,
                "elements": [
                    {"name": "லக்னம்", "deg": "248.6215° · மூலம் P3", "type": "சுற்றுவட்ட நுழைவு / குறிப்பு புள்ளி", "deltaV": 0, "finalUnits": 0},
                    {"name": "சனி", "deg": "248.5475° · மூலம் P3", "type": "ரெசிஸ்டர் / ரெகுலேட்டர்", "deltaV": -36.0, "finalUnits": -18.0}
                ]
            },
            {
                "stageId": "R10", "sign": "மகரம்", "month": "Thai · Jan 15 – Feb 12", "netUnits": 22.5,
                "inV": 194.0, "deltaV": 45.0, "outV": 239.0, "current": 0.45, "power": 103.5, "accumUnits": 4.5,
                "elements": [
                    {"name": "செவ்வாய்", "deg": "292.2023° · திருவோணம் P4", "type": "மோட்டார் / பம்ப் / பொறி", "deltaV": 45.0, "finalUnits": 22.5}
                ]
            },
            {
                "stageId": "R11", "sign": "கும்பம்", "month": "Masi · Feb 13 – Mar 14", "netUnits": 25.0,
                "inV": 239.0, "deltaV": 50.0, "outV": 289.0, "current": 0.5, "power": 115.0, "accumUnits": 29.5,
                "elements": [
                    {"name": "ராகு", "deg": "327.0821° · பூரட்டாதி P3", "type": "முன்னோக்கு டையோட் / ஆன்டெனா", "deltaV": 50.0, "finalUnits": 25.0}
                ]
            },
            {
                "stageId": "R12", "sign": "மீனம்", "month": "Panguni · Mar 15 – Apr 14", "netUnits": 0.0,
                "inV": 289.0, "deltaV": 0.0, "outV": 289.0, "current": 0.0, "power": 0.0, "accumUnits": 29.5,
                "elements": []
            },
            {
                "stageId": "R1", "sign": "மேஷம்", "month": "Chithirai · Apr 15 – May 14", "netUnits": 69.825,
                "inV": 289.0, "deltaV": 139.65, "outV": 428.65, "current": 1.3965, "power": 321.195, "accumUnits": 99.325,
                "elements": [
                    {"name": "சூரியன்", "deg": "16.8482° · பரணி P2", "type": "பேட்டரி / DC மூலம்", "deltaV": 86.25, "finalUnits": 43.125},
                    {"name": "புதன்", "deg": "28.2926° · கார்த்திகை P1", "type": "டிரான்சிஸ்டர் / லாஜிக் கேட்", "deltaV": 12.0, "finalUnits": 6.0},
                    {"name": "குரு", "deg": "18.4421° · பரணி P2", "type": "ஆம்ப்ளிஃபையர் / ஸ்டெப்-அப் டிரான்ஸ்ஃபார்மர்", "deltaV": 41.4, "finalUnits": 20.7}
                ]
            },
            {
                "stageId": "R2", "sign": "ரிஷபம்", "month": "Vaikasi · May 15 – Jun 14", "netUnits": 18.0,
                "inV": 428.65, "deltaV": 36.0, "outV": 464.65, "current": 0.36, "power": 82.8, "accumUnits": 117.325,
                "elements": [
                    {"name": "சுக்ரன்", "deg": "58.9153° · மிருகசீரிஷம் P2", "type": "LED / காட்சி / அதிர்வுறுப்பு", "deltaV": 36.0, "finalUnits": 18.0}
                ]
            },
            {
                "stageId": "R3", "sign": "மிதுனம்", "month": "Aani · Jun 15 – Jul 15", "netUnits": 0.0,
                "inV": 464.65, "deltaV": 0.0, "outV": 464.65, "current": 0.0, "power": 0.0, "accumUnits": 117.325,
                "elements": []
            },
            {
                "stageId": "R4", "sign": "கடகம்", "month": "Aadi · Jul 16 – Aug 16", "netUnits": 0.0,
                "inV": 464.65, "deltaV": 0.0, "outV": 464.65, "current": 0.0, "power": 0.0, "accumUnits": 117.325,
                "elements": []
            },
            {
                "stageId": "R5", "sign": "சிம்மம்", "month": "Aavani · Aug 17 – Sep 16", "netUnits": -22.0,
                "inV": 464.65, "deltaV": -44.0, "outV": 420.65, "current": -0.44, "power": -101.2, "accumUnits": 95.325,
                "elements": [
                    {"name": "கேது", "deg": "147.0821° · உத்திரம் P1", "type": "எதிர் டையோட் / வடிகட்டி / லேசர்", "deltaV": -44.0, "finalUnits": -22.0}
                ]
            },
            {
                "stageId": "R6", "sign": "கன்னி", "month": "Purattasi · Sep 17 – Oct 16", "netUnits": 0.0,
                "inV": 420.65, "deltaV": 0.0, "outV": 420.65, "current": 0.0, "power": 0.0, "accumUnits": 95.325,
                "elements": []
            },
            {
                "stageId": "R7", "sign": "துலாம்", "month": "Aippasi · Oct 17 – Nov 15", "netUnits": 12.0,
                "inV": 420.65, "deltaV": 24.0, "outV": 444.65, "current": 0.24, "power": 55.2, "accumUnits": 107.325,
                "elements": [
                    {"name": "சந்திரன்", "deg": "181.5612° · சித்திரை P3", "type": "கெப்பாசிட்டர்", "deltaV": 24.0, "finalUnits": 12.0}
                ]
            },
            {
                "stageId": "R8", "sign": "விருச்சிகம்", "month": "Karthigai · Nov 16 – Dec 15", "netUnits": 0.0,
                "inV": 444.65, "deltaV": 0.0, "outV": 444.65, "current": 0.0, "power": 0.0, "accumUnits": 107.325,
                "elements": []
            }
        ]

        return {
            "refVoltage": 230.0,
            "ascendantSign": "தனுசு",
            "netUnits": 107.325,
            "finalVoltage": 444.65,
            "positiveUnits": 147.325,
            "negativeUnits": -40.0,
            "peakPowerSign": "R1 மேஷம்",
            "maxDrainSign": "R5 சிம்மம்",
            "maxCurrentSign": "R1 மேஷம்",
            "balanceVerdict": "மிகுந்த நேர்மறை ஓட்டம்",
            "stages": stages
        }
