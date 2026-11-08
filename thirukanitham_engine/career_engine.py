# -*- coding: utf-8 -*-
"""
Thirukanitham Career, Job vs Business, Subathuvam/Paavathuvam & Timing Engine
(தொழில், உத்தியோகம் & வியாபார கணிப்பு - சுபத்துவ, பாவத்துவ & தசா விதிகளுடன்)

Vedic Astrological calculations for:
1. 2nd Lord (Dhana) & 10th Lord (Karma) Subathuvam vs Paavathuvam Assessment
2. Job vs Business Determination (10th, 6th, 7th houses, Lagna lord & Budhan strength)
3. Yoga Dasa vs Avayoga Dasa Career Rules (சுபத்துவ யோக தசை vs இரண்டாம் நிலை சுபத்துவ அவயோக தசை)
4. Specific Career Timing:
   - When will one get a job? (வேலை கிடைக்கும் காலம்)
   - When to start business? (தொழில் தொடங்க வேண்டிய காலம் & தொடங்கக் கூடாத காலம்)
5. Industry Sectors & Specific Job Titles mapped to planetary Subathuvam/Paavathuvam
"""

SIGN_NAMES_TA = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"]
SIGN_NAMES_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
SIGN_LORDS = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"]
SIGN_ELEMENTS = ["Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water", "Fire", "Earth", "Air", "Water"]

PLANET_NAMES = {
    "Su": {"ta": "சூரியன்", "en": "Sun", "symbol": "☀️"},
    "Mo": {"ta": "சந்திரன்", "en": "Moon", "symbol": "🌙"},
    "Ma": {"ta": "செவ்வாய்", "en": "Mars", "symbol": "♂️"},
    "Me": {"ta": "புதன்", "en": "Mercury", "symbol": "☿️"},
    "Ju": {"ta": "குரு", "en": "Jupiter", "symbol": "♃"},
    "Ve": {"ta": "சுக்கிரன்", "en": "Venus", "symbol": "♀️"},
    "Sa": {"ta": "சனி", "en": "Saturn", "symbol": "🪐"},
    "Ra": {"ta": "ராகு", "en": "Rahu", "symbol": "☊"},
    "Ke": {"ta": "கேது", "en": "Ketu", "symbol": "☋"}
}

# Subathuva & Paavathuva Field Signatures for all 9 planets
PLANET_FIELD_SIGNATURES = {
    "Su": {
        "planetTa": "சூரியன்",
        "subathuvamTa": "அரசு உயர் நிர்வாகம் (IAS/IPS), அரசு கெஜட்டட் அதிகாரி, மருத்துவம், அரசியல் தலைமை, தங்க வர்த்தகம், சோலார் மின்சாரம், தலைமை இயக்குநர்.",
        "subathuvamEn": "Civil Services, Central Administration, Medicine/Surgeon, Political Leadership, Gold Commerce, Solar Energy, Managing Director.",
        "paavathuvamTa": "விறகு, தீ / உலைக்களப் பணி, பாதுகாப்பு காவலர் (Security), கீழ்நிலை அரசு ஊழியர், செங்கல் சூளை மேற்பார்வை.",
        "paavathuvamEn": "Timber trade, furnace works, security personnel, lower-echelon government staff."
    },
    "Mo": {
        "planetTa": "சந்திரன்",
        "subathuvamTa": "பால் பண்ணை, குடிநீர் சுத்திகரிப்பு, கப்பல் & கடல்சார் துறை (Marine), உணவு & நட்சத்திர விடுதிகள் (Hotels), வெளிநாட்டு வாணிபம், மனநல மருத்துவம், செவிலியர் பணி.",
        "subathuvamEn": "Dairy, Water purification, Maritime/Naval, Luxury Hospitality/Restaurants, Overseas Trade, Psychology, Nursing.",
        "paavathuvamTa": "மதுபானம், மீன் வியாபாரம், இரவு நேர ஓட்டுநர், குளிர்சாதன கிடங்கு, நீர் பாசனம், கூலி உழைப்பு.",
        "paavathuvamEn": "Liquor, fisheries, night transport, cold storage, manual fluid transport."
    },
    "Ma": {
        "planetTa": "செவ்வாய்",
        "subathuvamTa": "சிவில் / மெக்கானிக்கல் என்ஜினியரிங், அறுவை சிகிச்சை மருத்துவர் (Surgeon), காவல் & ராணுவ உயர் அதிகாரி, ரியல் எஸ்டேட் & உள்கட்டமைப்பு, தீயணைப்பு & பாதுகாப்பு மேலாண்மை.",
        "subathuvamEn": "Civil/Mechanical Engineering, Surgery, Police/Defense Leadership, Real Estate Development, Fire & Safety Management.",
        "paavathuvamTa": "வெல்டிங், லேத் பட்டறை, கசாப்புக் கடை, இரும்பு வெட்டுதல், மெக்கானிக், கொத்தனார், சமையல் தீ வேலை.",
        "paavathuvamEn": "Welding, lathe fabrication, butchery, metal cutting, automotive mechanics, masonry."
    },
    "Me": {
        "planetTa": "புதன்",
        "subathuvamTa": "தகவல் தொழில்நுட்பம் (IT/Software), பட்டயக் கணக்காளர் (CA/Auditing), வங்கி, ஜோதிடம், பத்திரிகைத் துறை, கல்லூரி விரிவுரையாளர், வர்த்தக புரோக்கரேஜ் & கமிஷன் ஏஜென்சி.",
        "subathuvamEn": "IT & Software Engineering, Chartered Accountancy, Banking, Astrology, Journalism, Academic Professorship, Commercial Brokerage.",
        "paavathuvamTa": "அச்சுக்கூட கூலி ஆள் (Printing press), கொரியர் & தபால் விநியோகம், போலி ஆவணங்கள், கீழ்நிலை எழுதுவினைஞர்.",
        "paavathuvamEn": "Printing press labor, courier dispatch, stationery clerical, petty brokerage."
    },
    "Ju": {
        "planetTa": "குரு",
        "subathuvamTa": "நீதிபதி, வழக்கறிஞர், நிதி ஆலோசகர், வங்கி மேலாளர், பேராசிரியர், கோவில் அறங்காவலர், வேத/ஆன்மீக வழிகாட்டுதல், நிதி மேலாண்மை நிறுவனம்.",
        "subathuvamEn": "Judiciary/Judge, Legal Counsel, Financial Advisory, Banking Management, University Dean, Temple Trust, Vedic Consulting.",
        "paavathuvamTa": "அதிக வட்டி நிதித் தொழில் (High interest lending), எளிய டியூஷன், கடன் வசூல் முகமை.",
        "paavathuvamEn": "High-interest money lending, basic tuition, debt collection agency."
    },
    "Ve": {
        "planetTa": "சுக்கிரன்",
        "subathuvamTa": "சினிமா & கலைத்துறை, ஆட்டோமொபைல் (வாகனங்கள்), ஃபேஷன் டிசைனிங், அழகு நிலையம் (Beauty), ஜவுளி ஏற்றுமதி, ஆடம்பர பொருட்கள், சொகுசு விடுதிகள்.",
        "subathuvamEn": "Cinema & Entertainment, Automobile Designing, Fashion, Luxury Hospitality, Textile Exports, Cosmetics, High-end Retail.",
        "paavathuvamTa": "தையல் கடை, மதுபான பார் சர்வர், சாதாரண கார் டிரைவர், ஆபாச/கிளாமர் சார்ந்த துறை, அழகு சாதன தெருவோர விற்பனை.",
        "paavathuvamEn": "Tailoring, bar tender/server, commercial driver, low-end cosmetics street sales."
    },
    "Sa": {
        "planetTa": "சனி",
        "subathuvamTa": "ரயில்வே துறை, பெரிய தொழிற்சாலைகள், ஆயில் & எரிவாயு சுத்திகரிப்பு (Oil & Gas), இரும்பு & எஃகு ஆலை, பொதுஜன அமைப்பு, மனிதவள மேலாண்மை (HR), நீதி பரிபாலனம்.",
        "subathuvamEn": "Indian Railways, Heavy Manufacturing, Oil & Gas Refineries, Steel Plants, Mass Transport, Human Resources, Labor Union Leadership.",
        "paavathuvamTa": "துப்புரவுப் பணி, பழைய இரும்பு/ஸ்கிராப் வியாபாரம், சுமை தூக்குதல், காலணி தயாரிப்பு, கட்டிடக் கூலி வேலை.",
        "paavathuvamEn": "Sanitation, scrap metal dealing, manual loading, footwear/leather, heavy construction labor."
    },
    "Ra": {
        "planetTa": "ராகு",
        "subathuvamTa": "செயற்கை நுண்ணறிவு (AI), ஏவியேஷன் (விமானம்), மருந்து தயாரிப்பு (Pharma), எலக்ட்ரானிக்ஸ் & சிப் டிசைனிங், பன்னாட்டு நிறுவனம் (MNC), சினிமா இயக்கம், விண்வெளி ஆராய்ச்சி.",
        "subathuvamEn": "Artificial Intelligence, Aviation/Aeronautics, Pharmaceuticals, Electronics & Chip Design, Multinational Corporates, Film Direction.",
        "paavathuvamTa": "கடத்தல், கள்ளச்சாராயம், நச்சு இரசாயனம், சிறைக்காவலர், சூதாட்டம், டார்க் வெப் ஹேக்கிங்.",
        "paavathuvamEn": "Smuggling, illicit trade, toxic waste processing, prison guarding, gambling."
    },
    "Ke": {
        "planetTa": "கேது",
        "subathuvamTa": "சித்த & ஆயுர்வேத மருத்துவம், மைக்ரோ கோடிங் / அல்காரிதம், உயிரியல் & நோயியல் ஆராய்ச்சி (Pathology), ஆன்மீக ஞானம், யோகா கலை.",
        "subathuvamEn": "Siddha & Ayurvedic Medicine, Micro-Algorithm Coding, Pathology/Bio-Research, Spiritual Leadership, Occult Science.",
        "paavathuvamTa": "தையல் நூல் விநியோகம், மின் வயர் பழுது, துறவற வாழ்க்கை, சிறிய கூலித் தொழில்.",
        "paavathuvamEn": "Thread spinning, wire/electrical repair, ascetic life, petty solitary work."
    }
}

CAREER_SECTORS = [
    {
        "id": "it_software",
        "nameTa": "தகவல் தொழில்நுட்பம் & AI (IT, Software & Artificial Intelligence)",
        "nameEn": "IT, Software Engineering & AI Technology",
        "icon": "💻",
        "primaryPlanets": ["Me", "Ra", "Ke", "Ma"],
        "favorableElements": ["Air", "Fire"],
        "favorableSigns": [2, 10, 5, 0],
        "descriptionTa": "புதனின் பகுப்பாய்வு திறன், ராகுவின் நவீன தொழில்நுட்ப உந்துதல் மற்றும் கேதுவின் அல்காரிதம் கோடிங் அமைப்பு IT, AI மற்றும் மென்பொருள் துறைகளில் உச்சக்கட்ட வெற்றியை உறுதி செய்கிறது.",
        "descriptionEn": "Mercury's analytical logic combined with Rahu's technological innovation and Ketu's algorithmic depth creates stellar prowess in IT and AI.",
        "rolesTa": [
            "Software Architect / Tech Lead (முதுநிலை மென்பொருள் வடிவமைப்பாளர்)",
            "AI & Machine Learning Specialist (செயற்கை நுண்ணறிவு நிபுணர்)",
            "Full-Stack Developer / Cloud Engineer (கிளவுட் மற்றும் மென்பொருள் பொறியாளர்)",
            "Cyber Security Specialist (சைபர் பாதுகாப்பு நிபுணர்)"
        ],
        "rolesEn": [
            "Software Architect & Technical Lead",
            "AI & Machine Learning Specialist",
            "Cloud Solutions & Full-Stack Engineer",
            "Cyber Security & Big Data Analyst"
        ]
    },
    {
        "id": "govt_admin",
        "nameTa": "அரசு வேலை, ரயில்வே & உயர் நிர்வாகம் (Government, Railways & PSU)",
        "nameEn": "Government, Railways, Civil Services & Public Administration",
        "icon": "🏛️",
        "primaryPlanets": ["Su", "Ju", "Ma", "Sa"],
        "favorableElements": ["Fire", "Earth"],
        "favorableSigns": [4, 8, 0, 9],
        "descriptionTa": "சூரியனின் அரசாங்க ஆதிக்கம், சனியின் பொதுத்துறை/ரயில்வே காரகம் மற்றும் செவ்வாயின் அதிகார பலம் மத்திய/மாநில அரசு மற்றும் பொதுத்துறை நிறுவனங்களில் கௌரவத்தை நல்கும்.",
        "descriptionEn": "Sun's sovereign authority, Saturn's public administration/railway karaka, and Mars's executive command yield distinguished civil and public service achievements.",
        "rolesTa": [
            "Civil Services (IAS / IPS / குரூப்-1 உயர் அதிகாரி)",
            "Railway Officer / Engineer (ரயில்வே அதிகாரி / பொறியாளர்)",
            "Public Sector Director / Manager (மத்திய பொதுத்துறை மேலாளர்)",
            "Government Contractor / Vendor (அரசு அங்கீகாரம் பெற்ற ஒப்பந்ததாரர்)"
        ],
        "rolesEn": [
            "Civil Services & High Administrative Cadre",
            "Indian Railways Officer / Technical Engineer",
            "Central Public Sector Undertaking (PSU) Manager",
            "Registered A-Class Government Contractor"
        ]
    },
    {
        "id": "finance_banking",
        "nameTa": "வங்கி, நிதி, கணக்கு & பங்குச்சந்தை (Banking, CA & Wealth Management)",
        "nameEn": "Banking, Financial Markets, CA & Wealth Management",
        "icon": "🏦",
        "primaryPlanets": ["Me", "Ju", "Ve"],
        "favorableElements": ["Earth", "Air"],
        "favorableSigns": [1, 5, 9, 6],
        "descriptionTa": "புதனின் கணக்கியல் துல்லியம், குருவின் தன காரக பலம் மற்றும் சுக்கிரனின் பணப்புழக்க ஆதரவு வங்கி, ஆடிட்டிங் (CA), நிதி முதலீடு மற்றும் பங்குச்சந்தையில் பெரும் செல்வத்தை ஈட்டித் தரும்.",
        "descriptionEn": "Mercury's numerical precision, Jupiter's wealth stewardship, and Venus's liquidity yield immense distinction in Chartered Accountancy and Banking.",
        "rolesTa": [
            "Chartered Accountant (CA) & Auditor (பட்டயக் கணக்காளர்)",
            "Investment Banker & Portfolio Manager (முதலீட்டு வங்கி மேலாளர்)",
            "Equity & Stock Market Trader (பங்குச்சந்தை வர்த்தகர்)"
        ],
        "rolesEn": [
            "Chartered Accountant (CA) & Audit Partner",
            "Investment Banker & Portfolio Asset Manager",
            "Equity Research & Algorithmic Stock Trader"
        ]
    },
    {
        "id": "engineering_realestate",
        "nameTa": "பொறியியல், கட்டுமானம் & ரியல் எஸ்டேட் (Engineering & Real Estate)",
        "nameEn": "Engineering, Civil Infrastructure & Real Estate",
        "icon": "🏗️",
        "primaryPlanets": ["Ma", "Sa", "Su"],
        "favorableElements": ["Earth", "Fire"],
        "favorableSigns": [0, 7, 9, 1],
        "descriptionTa": "செவ்வாயின் பூமி காரக யோகம் மற்றும் சனியின் கட்டுமான ஒழுங்கு சிவில் இன்ஜினியரிங், ரியல் எஸ்டேட், இயந்திரவியல் பணிகளில் மகத்தான லாபத்தை வழங்குகிறது.",
        "descriptionEn": "Mars's land ownership vitality coupled with Saturn's structural discipline commands leadership in Civil Engineering and Real Estate Development.",
        "rolesTa": [
            "Real Estate Builder & Promoter (ரியல் எஸ்டேட் கட்டுமான அதிபர்)",
            "Civil & Structural Engineer (கட்டுமான தலைமைப் பொறியாளர்)",
            "Mechanical / Industrial Project Lead (இயந்திரவியல் திட்டத் தலைவர்)"
        ],
        "rolesEn": [
            "Real Estate Promoter & Infrastructure Builder",
            "Civil Engineering Project Director",
            "Mechanical / Heavy Electrical Engineering Lead"
        ]
    },
    {
        "id": "trade_foreign",
        "nameTa": "வணிகம், வர்த்தகம் & ஏற்றுமதி (Trading, Logistics & Enterprise)",
        "nameEn": "Commercial Trading, Supply Chain, Logistics & Import-Export",
        "icon": "🚢",
        "primaryPlanets": ["Me", "Ve", "Ra", "Sa"],
        "favorableElements": ["Air", "Water"],
        "favorableSigns": [2, 6, 10, 8],
        "descriptionTa": "புதனின் வியாபார சாதுர்யம், சுக்கிரனின் சந்தை மதிப்பு மற்றும் சனியின் விநியோக ஆற்றல் வர்த்தகம், மொத்த விநியோகம் மற்றும் ஏற்றுமதி-இறக்குமதி தொழிலில் சிறக்க வைக்கும்.",
        "descriptionEn": "Mercury's commercial negotiation, Venus's market allure, and Saturn's distribution backbone enable lucrative trading and global logistics.",
        "rolesTa": [
            "Wholesale Trader & Distributor (மொத்த வர்த்தகர் & விநியோகஸ்தர்)",
            "Supply Chain & Logistics Director (தளவாட மற்றும் சப்ளை செயின் மேலாளர்)",
            "Import-Export Merchant (சர்வதேச ஏற்றுமதி-இறக்குமதி அதிபர்)"
        ],
        "rolesEn": [
            "Wholesale Commodity Merchant & Stockist",
            "Global Supply Chain & Logistics Director",
            "Import-Export Trading House Founder"
        ]
    }
]


class CareerCalculator:
    """
    Python Career, Job vs Business, Subathuvam/Paavathuvam and Timing Calculator
    """

    @staticmethod
    def _evaluate_subathuvam(p_code: str, planets_data: dict, lagna_sign_id: int) -> dict:
        """
        Evaluates Subathuvam (சுபத்துவம்), Paavathuvam (பாவத்துவம்) and Sookshma Strength
        according to classical Tamil Vedic astrology principles.
        """
        p_obj = planets_data.get(p_code, {})
        if not isinstance(p_obj, dict):
            return {
                "gradeKey": "grade_2",
                "gradeTa": "நடுத்தர சுபத்துவம் (Moderate Beneficence)",
                "gradeEn": "Moderate Beneficence",
                "score": 50,
                "summaryTa": "சமச்சீரான பலன்கள் தரும் நிலை."
            }

        target_sign = p_obj.get("signId", 0)

        sub_pts = 0
        paava_pts = 0
        sookshma_pts = 0

        # 1. Guru's Aspect/Conjunction (முதல் நிலை சுபத்துவம்)
        ju_sign = planets_data.get("Ju", {}).get("signId", -1)
        if ju_sign != -1:
            diff_ju = (target_sign - ju_sign) % 12
            if diff_ju in [0, 4, 6, 8]:  # Conjunction, 5th, 7th, 9th aspect
                sub_pts += 36

        # 2. Venus Aspect/Conjunction (இரண்டாம் நிலை சுபத்துவம்)
        ve_sign = planets_data.get("Ve", {}).get("signId", -1)
        if ve_sign != -1:
            diff_ve = (target_sign - ve_sign) % 12
            if diff_ve in [0, 6]:  # Conjunction, 7th aspect
                sub_pts += 20

        # 3. Mercury Aspect/Conjunction
        me_sign = planets_data.get("Me", {}).get("signId", -1)
        if me_sign != -1 and p_code != "Me":
            diff_me = (target_sign - me_sign) % 12
            if diff_me in [0, 6]:
                sub_pts += 12

        # 4. Moon Aspect/Conjunction
        mo_sign = planets_data.get("Mo", {}).get("signId", -1)
        if mo_sign != -1 and p_code != "Mo":
            diff_mo = (target_sign - mo_sign) % 12
            if diff_mo in [0, 6]:
                sub_pts += 14

        # 5. Saturn Aspect/Conjunction (பாவத்துவம்)
        sa_sign = planets_data.get("Sa", {}).get("signId", -1)
        if sa_sign != -1 and p_code != "Sa":
            diff_sa = (target_sign - sa_sign) % 12
            if diff_sa in [0, 2, 6, 9]:  # Conjunction, 3rd, 7th, 10th
                paava_pts += 22

        # 6. Mars Aspect/Conjunction (பாவத்துவம்)
        ma_sign = planets_data.get("Ma", {}).get("signId", -1)
        if ma_sign != -1 and p_code != "Ma":
            diff_ma = (target_sign - ma_sign) % 12
            if diff_ma in [0, 3, 6, 7]:  # Conjunction, 4th, 7th, 8th
                paava_pts += 22

        # 7. Rahu / Ketu Conjunction (கிரகண / நிழல் தாக்கம்)
        ra_sign = planets_data.get("Ra", {}).get("signId", -1)
        ke_sign = planets_data.get("Ke", {}).get("signId", -1)
        if target_sign in [ra_sign, ke_sign]:
            paava_pts += 18

        # 8. Sookshma Strength (வக்கிரம், ஆட்சி, உச்சம்)
        if p_obj.get("isRetrograde"):
            sookshma_pts += 16
        if p_obj.get("isExalted"):
            sookshma_pts += 18
        if p_obj.get("isOwnSign"):
            sookshma_pts += 14

        # Final grading
        if sub_pts >= 35:
            grade_key = "grade_1"
            grade_ta = "முதல் நிலை சுபத்துவம் (1st Grade Subathuvam - Guru Blessed)"
            grade_en = "1st Grade Subathuvam (Supreme Beneficence)"
            nature_ta = "கௌரவமான அரசுப் பணி, உயர் நிர்வாகம், வெள்ளை காலர் உத்தியோகம் (White-collar), ஆலோசனை, வங்கி அல்லது நேர்மையான பெரும் தொழில் யோகம்."
            nature_en = "Prestigious civil/corporate administration, white-collar advisory, high-level banking, or high-tier enterprise."
        elif sub_pts >= 18:
            grade_key = "grade_2"
            grade_ta = "இரண்டாம் நிலை சுபத்துவம் (2nd Grade Subathuvam - Venus/Mercury Blessed)"
            grade_en = "2nd Grade Subathuvam (Commercial/Creative Beneficence)"
            nature_ta = "மென்பொருள் (IT), கலை, வடிவமைப்பு, ஆட்டோமொபைல், ஜவுளி, வர்த்தக ஏஜென்சி அல்லது நடுத்தர வணிக யோகம்."
            nature_en = "IT, Software, Arts, Design, Automobile, Commerce, or thriving mid-scale business."
        elif sookshma_pts >= 14 or (paava_pts > sub_pts and sookshma_pts >= 10):
            grade_key = "paavathuvam_sookshma"
            grade_ta = "பாவத்துவம் & சூட்சும வலு (Paavathuvam with Sookshma Strength)"
            grade_en = "Paavathuvam with Sookshma Strength"
            nature_ta = "பொறியியல், கட்டிடம் & ரியல் எஸ்டேட், எந்திரங்கள், இரும்பு, ஆயில், ஒப்பந்தப் பணிகள் (Contracting/Tenders) அல்லது கடின உழைப்பு சார்ந்த தொழில் யோகம்."
            nature_en = "Engineering, Real Estate, Machinery, Infrastructure, Civil contracts, or heavy manufacturing enterprise."
        else:
            grade_key = "paavathuvam_afflicted"
            grade_ta = "கடுமையான பாவத்துவம் (Afflicted / High Friction)"
            grade_en = "Afflicted Paavathuvam (High Risk)"
            nature_ta = "தொழில் ரிஸ்க் எடுக்கக் கூடாது; கடன் மற்றும் விரயம் வர வாய்ப்புள்ளதால், மாத சம்பள நிறுவன வேலையில் (Job) இருப்பதே 100% பாதுகாப்பானது."
            nature_en = "Avoid capital-intensive business; regular salaried employment is strongly advised to prevent debt and loss."

        return {
            "gradeKey": grade_key,
            "gradeTa": grade_ta,
            "gradeEn": grade_en,
            "subathuvaPoints": sub_pts,
            "paavathuvaPoints": paava_pts,
            "sookshmaPoints": sookshma_pts,
            "natureTa": nature_ta,
            "natureEn": nature_en
        }

    @staticmethod
    def calculate(lagna_sign_id: int, planets_data: dict, birth_year: int = 1988, current_dasha: str = "Sa", current_bhukti: str = "Me", education_level: str = "diploma_iti") -> dict:
        house2_sign_id = (lagna_sign_id + 1) % 12
        house6_sign_id = (lagna_sign_id + 5) % 12
        house7_sign_id = (lagna_sign_id + 6) % 12
        house10_sign_id = (lagna_sign_id + 9) % 12
        house11_sign_id = (lagna_sign_id + 10) % 12

        lord2 = SIGN_LORDS[house2_sign_id]
        lord6 = SIGN_LORDS[house6_sign_id]
        lord7 = SIGN_LORDS[house7_sign_id]
        lord10 = SIGN_LORDS[house10_sign_id]
        lord11 = SIGN_LORDS[house11_sign_id]
        lord1 = SIGN_LORDS[lagna_sign_id]

        # Evaluate 10th and 2nd lord Subathuvam / Paavathuvam
        subathuvam_10 = CareerCalculator._evaluate_subathuvam(lord10, planets_data, lagna_sign_id)
        subathuvam_2 = CareerCalculator._evaluate_subathuvam(lord2, planets_data, lagna_sign_id)

        # Count occupants
        occupants_h10 = []
        occupants_h6 = []
        occupants_h7 = []
        occupants_h2 = []

        for p_code, p_obj in planets_data.items():
            if p_code == "Asc" or not isinstance(p_obj, dict):
                continue
            s_id = p_obj.get("signId", 0)
            if s_id == house10_sign_id:
                occupants_h10.append(p_code)
            if s_id == house6_sign_id:
                occupants_h6.append(p_code)
            if s_id == house7_sign_id:
                occupants_h7.append(p_code)
            if s_id == house2_sign_id:
                occupants_h2.append(p_code)

        # Job vs Business scores based on 6th, 7th, 10th, 2nd, Budhan, and Lagna Lord
        job_score = 48 + (len(occupants_h6) * 9) + (10 if ("Sa" in occupants_h10 or "Su" in occupants_h10) else 0)
        if lord6 in ["Sa", "Su", "Ma"]:
            job_score += 8
        if planets_data.get("Sa", {}).get("isExalted") or planets_data.get("Sa", {}).get("isOwnSign"):
            job_score += 8

        biz_score = 45 + (len(occupants_h7) * 10) + (12 if ("Me" in occupants_h10 or "Ve" in occupants_h10 or "Ra" in occupants_h10) else 0)
        if lord7 in ["Me", "Ve", "Ma"]:
            biz_score += 9
        if planets_data.get("Me", {}).get("isExalted") or planets_data.get("Me", {}).get("isOwnSign"):
            biz_score += 12
        if subathuvam_10["gradeKey"] == "grade_1" and (subathuvam_2["subathuvaPoints"] >= 20):
            biz_score += 8  # Strong subathuvam supports enterprise

        job_score = min(96, max(30, int(job_score)))
        biz_score = min(96, max(30, int(biz_score)))

        diff = abs(job_score - biz_score)
        if biz_score > job_score and diff >= 8:
            verdict_key = "business"
            verdict_ta = "🏢 சொந்தத் தொழில் & வியாபாரம் அதி உன்னதம் (High Business Yoga)"
            verdict_en = "🏢 Outstanding Entrepreneurship & Business Potential"
        elif job_score > biz_score and diff >= 8:
            verdict_key = "job"
            verdict_ta = "💼 நிறுவன உத்தியோகம் & அரசு வேலை உகந்தது (Corporate / Government Service)"
            verdict_en = "💼 High Stability in Corporate & Government Service"
        else:
            verdict_key = "hybrid"
            verdict_ta = "🔄 இரட்டை யோகம்: முதலில் உத்தியோகம், பின் சொந்த தொழில் (Dual / Hybrid Career)"
            verdict_en = "🔄 Hybrid Model: Corporate Foundation leading to Lucrative Business"

        # Yoga Dasa vs Avayoga Dasa Analysis for current Dasa
        # Dusthana lords (6, 8, 12)
        house8_sign_id = (lagna_sign_id + 7) % 12
        house12_sign_id = (lagna_sign_id + 11) % 12
        dusthana_lords = [lord6, SIGN_LORDS[house8_sign_id], SIGN_LORDS[house12_sign_id]]

        # Trikona lords (1, 5, 9)
        house5_sign_id = (lagna_sign_id + 4) % 12
        house9_sign_id = (lagna_sign_id + 8) % 12
        trikona_lords = [lord1, SIGN_LORDS[house5_sign_id], SIGN_LORDS[house9_sign_id]]

        is_yoga_dasa = (current_dasha in trikona_lords) or (current_dasha in [lord10, lord7, SIGN_LORDS[(lagna_sign_id + 3) % 12]])
        is_avayoga_dasa = (current_dasha in dusthana_lords) and (current_dasha not in trikona_lords)

        dasa_subathuvam = CareerCalculator._evaluate_subathuvam(current_dasha, planets_data, lagna_sign_id)

        if is_yoga_dasa:
            dasa_nature_ta = "யோக தசை (Yoga Dasa)"
            dasa_nature_en = "Benefic Yoga Dasa"
            if dasa_subathuvam["gradeKey"] in ["grade_1", "grade_2"]:
                dasa_guidance_ta = f"நடக்கும் {PLANET_NAMES.get(current_dasha, {}).get('ta', current_dasha)} தசை ஒரு யோக தசை! முதல்/இரண்டாம் நிலை சுபத்துவம் பெற்றிருப்பதால் சொந்த தொழில் (Business) தொடங்கினால் அசுர வளர்ச்சி தரும்; அல்லது உயர் அரசு அதிகாரி (Top-level Govt / Corporate leadership) யோகத்தை சுலபமாக அளிக்கும்."
                dasa_guidance_en = f"The active {PLANET_NAMES.get(current_dasha, {}).get('en', current_dasha)} Dasa is a highly auspicious Yoga Dasa. Endowed with benefic subathuvam, launching a business yields exponential expansion, or confers executive civil/corporate authority."
                dasa_biz_viability = 92
            else:
                dasa_guidance_ta = f"நடக்கும் {PLANET_NAMES.get(current_dasha, {}).get('ta', current_dasha)} தசை யோக தசையாக இருந்தாலும் சுபத்துவம் குறைவாக உள்ளதால், உழைப்புக்கு ஏற்ற பலன் மட்டுமே கிட்டும்; தொழிலில் பெரிய முதலீடுகளை நிதானமாக அணுகவும்."
                dasa_guidance_en = f"Active {PLANET_NAMES.get(current_dasha, {}).get('en', current_dasha)} Dasa is functional Yoga, but requires steady caution in capital deployments."
                dasa_biz_viability = 76
        elif is_avayoga_dasa:
            dasa_nature_ta = "அவயோக தசை (Avayoga Dasa)"
            dasa_nature_en = "Afflicted Avayoga Dasa"
            if dasa_subathuvam["gradeKey"] in ["grade_1", "grade_2"]:
                dasa_guidance_ta = f"நடக்கும் {PLANET_NAMES.get(current_dasha, {}).get('ta', current_dasha)} தசை அவயோக தசையாகும். அவர் இரண்டாம் நிலை சுபத்துவம் பெற்றுள்ளதால், **கட்டாயம் வேலைக்கு (Job / Service) செல்வதே 100% பாதுகாப்பானது**. அவயோக தசையில் தொழில் தொடங்கினால் கடன், நஷ்டம் வரக்கூடும்; ஆனால் மாத சம்பள வேலைக்கு சென்றால் தசாநாதன் காப்பாற்றி சுமுக வருமானம் தருவார்."
                dasa_guidance_en = f"The running {PLANET_NAMES.get(current_dasha, {}).get('en', current_dasha)} Dasa is an Avayoga Dasa. Because it possesses secondary beneficence, salaried employment (Job) is 100% safest to avoid debt; business investments are strictly discouraged."
                dasa_biz_viability = 45
            else:
                dasa_guidance_ta = f"நடக்கும் {PLANET_NAMES.get(current_dasha, {}).get('ta', current_dasha)} தசை கடுமையான அவயோக அமைப்பாகும். சொந்த தொழில் துவங்கவே கூடாது. வேலையை தக்கவைத்துக்கொண்டு எவ்வித கடன் மற்றும் வம்பு வழக்குகளையும் தவிர்க்க வேண்டும்."
                dasa_guidance_en = f"Active {PLANET_NAMES.get(current_dasha, {}).get('en', current_dasha)} Dasa is severely afflicted. Avoid all new entrepreneurial risks; preserve active employment diligently."
                dasa_biz_viability = 30
        else:
            dasa_nature_ta = "சம தசை (Neutral Dasa)"
            dasa_nature_en = "Neutral Dasa"
            dasa_guidance_ta = f"தற்போது நடக்கும் {PLANET_NAMES.get(current_dasha, {}).get('ta', current_dasha)} தசையில் நிலைத்தன்மை மற்றும் சுய உழைப்புக்குரிய பலன்கள் கிடைக்கும்."
            dasa_guidance_en = f"Active {PLANET_NAMES.get(current_dasha, {}).get('en', current_dasha)} Dasa delivers steady returns through consistent effort."
            dasa_biz_viability = 70

        # Timing predictions
        job_timing_ta = "கோச்சார குரு உங்கள் லக்னத்தையோ, 10-ஆம் வீட்டையோ அல்லது 6-ஆம் வீட்டையோ பார்க்கும் காலத்திலும், 6 அல்லது 10-ஆம் அதிபதிகளின் சுப புக்தியிலும் புதிய வேலை மற்றும் பதவி உயர்வு உறுதியாகக் கிடைக்கும்."
        job_timing_en = "Job appointments and appraisals materialize swiftly when transit Jupiter aspects the 10th or 6th house, or during 6th/10th lord benefic Bhukti."

        business_timing_ta = "லக்ன யோக தசையும், முதல் நிலை சுபத்துவம் பெற்ற புக்தியும் தொடங்கும் காலமே சொந்தத் தொழில் தொடங்குவதற்கான பொற்காலம். அவயோக தசைகளிலோ அல்லது ஏழரை/அஷ்டம சனி காலங்களிலோ தொழில் தொடங்கக் கூடாது."
        business_timing_en = "The dawn of a Yoga Dasa alongside a 1st Grade Subathuva Bhukti is the golden period to launch an enterprise. Never inaugurate ventures during Avayoga Dashas or Sade Sati."

        # Milestones
        milestones = [
            {
                "stage": "1. Career Entry & First Job",
                "stageTa": "1. தொழில் தொடக்கம் & முதல் வேலை",
                "age": "21 - 24",
                "years": f"{birth_year + 21} - {birth_year + 24}",
                "descTa": "முறையான கல்வி மற்றும் பயிற்சியுடன் முதல் பணியில் காலடி எடுத்து வைக்கும் காலம்."
            },
            {
                "stage": "2. Major Promotion & Stabilization",
                "stageTa": "2. தொழில் நிலைப்பாடு & முதல் பெரிய உயர்வு",
                "age": "26 - 30",
                "years": f"{birth_year + 26} - {birth_year + 30}",
                "descTa": "பணியிடத்தில் முக்கிய அங்கீகாரம், ஊதிய உயர்வு, முன்னணி நிறுவனங்களுக்கு மாறுதல்."
            },
            {
                "stage": "3. Breakthrough Zenith / Business Launch",
                "stageTa": "3. மகத்தான தலைமை / சொந்த தொழில் தொடக்கம்",
                "age": "33 - 38",
                "years": f"{birth_year + 33} - {birth_year + 38}",
                "descTa": "தலைமைப் பதவி ஏறுதல் அல்லது தனியாக சொந்த தொழில் தொடங்கி பெரும் சாதனை படைத்தல்."
            },
            {
                "stage": "4. Golden Peak Era & Lasting Wealth",
                "stageTa": "4. பொற்காலம் & நிலைத்த தனலாபம்",
                "age": "40 - 52",
                "years": f"{birth_year + 40} - {birth_year + 52}",
                "descTa": "தொழில் முத்திரை, சமூக அந்தஸ்து மற்றும் உச்சக்கட்ட நிதி நிறைவு காணும் காலம்."
            }
        ]

        # Aspect calculations on 10th house
        aspects_10 = []
        for p_code, p_obj in planets_data.items():
            if p_code == "Asc" or not isinstance(p_obj, dict):
                continue
            s_id = p_obj.get("signId", -1)
            if s_id == -1:
                continue
            diff = (house10_sign_id - s_id + 12) % 12
            if diff == 6:
                aspects_10.append({"code": p_code, "aspect": "7th"})
            if p_code == "Ma" and diff in [3, 7]:
                aspects_10.append({"code": p_code, "aspect": "4th" if diff == 3 else "8th"})
            if p_code == "Ju" and diff in [4, 8]:
                aspects_10.append({"code": p_code, "aspect": "5th" if diff == 4 else "9th"})
            if p_code == "Sa" and diff in [2, 9]:
                aspects_10.append({"code": p_code, "aspect": "3rd" if diff == 2 else "10th"})

        # Amatyakaraka
        deg_list = []
        for code in ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"]:
            p = planets_data.get(code, {})
            if isinstance(p, dict) and "longitude" in p:
                deg_list.append((code, p["longitude"] % 30))
        deg_list.sort(key=lambda x: x[1], reverse=True)
        amk_code = deg_list[1][0] if len(deg_list) > 1 else "Me"

        lord10_obj = planets_data.get(lord10, {})
        lord10_bhava = (((lord10_obj.get("signId", house10_sign_id) - lagna_sign_id + 12) % 12) + 1)
        is_lord10_kendra_trikona = lord10_bhava in [1, 4, 5, 7, 9, 10]

        # Score all sectors with differentiation
        scored_sectors = []
        for sec in CAREER_SECTORS:
            score = 28
            if lord10 in sec["primaryPlanets"]:
                score += 22
                if lord10_obj.get("isExalted") or lord10_obj.get("isOwnSign"):
                    score += 8
                if lord10_bhava == 10:
                    score += 8
                elif is_lord10_kendra_trikona:
                    score += 4

            if subathuvam_10["gradeKey"] == "grade_1":
                if sec["id"] in ["govt_admin", "education_research", "law_judiciary", "finance_banking"]:
                    score += 18
                elif sec["id"] == "medicine_healthcare":
                    score += 10
            elif subathuvam_10["gradeKey"] == "grade_2":
                if sec["id"] in ["it_software", "creative_arts_media", "finance_banking", "trade_foreign"]:
                    score += 18
            elif subathuvam_10["gradeKey"] == "paavathuvam_sookshma":
                if sec["id"] in ["engineering_realestate", "manufacturing_industry"]:
                    score += 22
                if sec["id"] == "govt_admin" and (planets_data.get("Ma", {}).get("isExalted") or planets_data.get("Sa", {}).get("isOwnSign")):
                    score += 14
                if sec["id"] == "trade_foreign":
                    score += 10
            else:
                if sec["id"] in ["govt_admin", "manufacturing_industry"]:
                    score += 8

            for code in occupants_h10:
                if code in sec["primaryPlanets"]:
                    score += 15
                occ_p = planets_data.get(code, {})
                if occ_p.get("isExalted") or occ_p.get("isOwnSign"):
                    score += 6
                if code == "Su" and sec["id"] == "govt_admin":
                    score += 8
                if code == "Ma" and sec["id"] in ["engineering_realestate", "govt_admin"]:
                    score += 8

            for asp in aspects_10:
                a_code = asp["code"]
                if a_code in sec["primaryPlanets"]:
                    if a_code == "Ju":
                        score += 10
                    elif a_code in ["Ve", "Me"]:
                        score += 8
                    elif a_code in ["Ma", "Sa"] and sec["id"] in ["engineering_realestate", "manufacturing_industry", "govt_admin"]:
                        score += 8

            if amk_code in sec["primaryPlanets"]:
                score += 14
                if planets_data.get(amk_code, {}).get("isExalted") or planets_data.get(amk_code, {}).get("isOwnSign"):
                    score += 4

            if SIGN_ELEMENTS[house10_sign_id] in sec.get("favorableElements", []):
                score += 8
            if house10_sign_id in sec.get("favorableSigns", []):
                score += 6
            if lord2 in sec["primaryPlanets"]:
                score += 7

            scored_sectors.append({
                "sector": sec,
                "rawScore": score
            })

        scored_sectors.sort(key=lambda x: x["rawScore"], reverse=True)

        top1_score = min(96, max(88, int(scored_sectors[0]["rawScore"])))
        top2_score = min(top1_score - 6, max(76, int(scored_sectors[1]["rawScore"])))
        top3_score = min(top2_score - 6, max(68, int(scored_sectors[2]["rawScore"])))

        bhava_names_ta = [
            "", "1-ம் இடமான லக்னத்தில்", "2-ம் இடமான தன ஸ்தானத்தில்", "3-ம் இடமான தைரிய ஸ்தானத்தில்",
            "4-ம் இடமான சுக ஸ்தானத்தில்", "5-ம் இடமான பூர்வ புண்ணிய ஸ்தானத்தில்", "6-ம் இடமான உத்தியோக ஸ்தானத்தில்",
            "7-ம் இடமான களத்திர/வணிக ஸ்தானத்தில்", "8-ம் இடமான மறைவு ஸ்தானத்தில்", "9-ம் இடமான பாக்கிய ஸ்தானத்தில்",
            "10-ம் இடமான ஜீவன/கர்ம ஸ்தானத்தில்", "11-ம் இடமான லாப ஸ்தானத்தில்", "12-ம் இடமான அயன/விரய ஸ்தானத்தில்"
        ]

        dignity_str = "சுப நட்பு நிலையில்"
        if lord10_obj.get("isExalted"):
            dignity_str = "உச்ச பலம் பெற்று"
        elif lord10_obj.get("isOwnSign"):
            dignity_str = "ஆட்சி பலம் பெற்று"
        elif lord10_obj.get("isRetrograde"):
            dignity_str = "வக்கிர சூட்சும பலத்துடன்"

        occ_names_ta = [PLANET_NAMES.get(c, {}).get("ta", c) for c in occupants_h10]
        asp_names_ta = [PLANET_NAMES.get(a["code"], {}).get("ta", a["code"]) for a in aspects_10]

        # 4th house Vidya Sthana Deduction
        house4_sign_id = (lagna_sign_id + 3) % 12
        occupants_h4 = [p_code for p_code, p_obj in planets_data.items() if isinstance(p_obj, dict) and p_obj.get("signId") == house4_sign_id]
        is_auto = (education_level == "auto")
        effective_edu = education_level
        if is_auto:
            if "Ke" in occupants_h4:
                effective_edu = "diploma_iti"
            else:
                effective_edu = "degree_ug"

        is_diploma = (effective_edu == "diploma_iti")
        is_ece = (effective_edu == "diploma_ece")
        ranked_sectors = []
        for idx, item in enumerate(scored_sectors[:3]):
            sec_data = dict(item["sector"])
            cal_score = top1_score if idx == 0 else (top2_score if idx == 1 else top3_score)
            sec_data["calculatedScore"] = cal_score

            if is_ece:
                edu_note = " [ஜாதகரின் கல்வித் தகுதி: டிப்ளமோ ECE (Electronics & Communication Engineering)]"
            elif is_auto:
                edu_note = " [4-ஆம் பாவ வித்யா ஸ்தான ஜோதிடக் கணிப்பு: டிப்ளமோ / தொழிற்கல்வி (Ketu in 4th House)]" if is_diploma else " [4-ஆம் பாவ வித்யா ஸ்தானக் கணிப்பு: பட்டப்படிப்பு]"
            elif is_diploma:
                edu_note = " [ஜாதகரின் கல்வித் தகுதி: டிப்ளமோ / ITI / தொழிற்கல்வி]"
            else:
                edu_note = ""

            s1 = f"உங்கள் {SIGN_NAMES_TA[lagna_sign_id]} லக்னத்திற்கு 10-ஆம் வீடான கர்ம ஸ்தானம் {SIGN_NAMES_TA[house10_sign_id]} ராசியாகும். அதன் அதிபதி {PLANET_NAMES.get(lord10, {}).get('ta', lord10)} லக்னத்திற்கு {bhava_names_ta[lord10_bhava]} ({SIGN_NAMES_TA[lord10_obj.get('signId', 0)]}-ல்) {dignity_str} அமைந்துள்ளார்.{edu_note}"
            s2 = ""
            if occ_names_ta:
                s2 += f" 10-ஆம் பாவத்தில் {', '.join(occ_names_ta)} அமர்ந்து இந்நபரின் ஜீவன பலத்தை நேரடியாக வழிநடத்துகிறது."
            if asp_names_ta:
                s2 += f" மேலும் 10-ஆம் வீட்டை {', '.join(asp_names_ta)} சுபப் பார்வையால் நோக்குவது இத்துறைக்கு கூடுதல் அந்தஸ்தை அளிக்கிறது."
            
            s3 = ""
            if is_ece:
                if sec_data.get("id") == "govt_admin":
                    s3 = " புதன் மற்றும் செவ்வாய்/ராகுவின் மின்னணு-தகவல் தொடர்பு இணைவு, இந்திய ரயில்வே சிக்னல் & டெலிகாம் JE (RRB S&T JE), BSNL மேற்பார்வையாளர் மற்றும் விமான நிலைய எலக்ட்ரானிக்ஸ் பதவிகளை முழுமையாக ஆதரிக்கிறது."
                elif sec_data.get("id") == "it_software":
                    s3 = " மின்னணு மற்றும் தகவல் தொடர்பு காரகங்கள் எம்படட் சிஸ்டம்ஸ் (Embedded Systems), ஹார்டுவேர் நெட்வொர்க்கிங், IoT மற்றும் ஃபைபர் ஆப்டிக்ஸ் துறைகளில் சிறந்த முன்னேற்றத்தைத் தரும்."
                else:
                    s3 = " மின்னணுவியல் (Electronics) மற்றும் சென்சார் ஆட்டோமேஷன் சார்ந்த நவீன தொழில் பிரிவுகளில் இந்நபருக்கு நிலையான தொழில்நுட்ப உயர் பதவி அமையும்."
            elif is_diploma and sec_data.get("id") == "govt_admin":
                s3 = " 10-ஆம் அதிபதியின் பலமும் 6-ஆம் பாவ வலிமையும் டிப்ளமோ தகுதிக்கு ஏற்ப, இந்திய ரயில்வே இளநிலைப் பொறியாளர் (RRB JE), ரயில்வே பிரிவு மேற்பார்வையாளர் (Section Supervisor), மின்சார வாரிய (TNEB) அல்லது பொதுப்பணித்துறை (PWD) Junior Engineer போன்ற கௌரவமான அரசு தொழில்நுட்ப பதவிகளை உறுதி செய்கின்றன."
            elif is_diploma and sec_data.get("id") in ["engineering_realestate", "manufacturing_industry"]:
                s3 = " செவ்வாய் மற்றும் சனியின் எந்திரவியல் & பூமி காரக பலம் டிப்ளமோ தகுதிக்கு சைட் இன்ஜினியர் (Site Engineer), கள மேற்பார்வையாளர், ஆலை பராமரிப்பு மேற்பார்வையாளர் (Plant Maintenance Supervisor) மற்றும் அரசு ஒப்பந்தப் பணிகளில் சிறப்பைத் தரும்."
            else:
                s3 = f" 10-ஆம் அதிபதி {subathuvam_10['gradeTa']} பெற்றுள்ளதால் இந்நபருக்கு இத்துறையில் நிலையான கௌரவமும் உயர் அதிகாரமும் கிட்டும்."
            
            s4 = f" தொழில் காரகனான அமத்யகாரகன் {PLANET_NAMES.get(amk_code, {}).get('ta', amk_code)} இந்நபருக்கு இத்துறையில் சமூக அங்கீகாரத்தை நல்குவார்."

            custom_exp_ta = f"{s1}{s2}{s3}{s4}"
            sec_data["customExplanationTa"] = custom_exp_ta
            sec_data["descriptionTa"] = custom_exp_ta

            # Specific roles calibrated to education
            if is_ece:
                if sec_data.get("id") == "govt_admin":
                    sec_data["rolesTa"] = [
                        "Railway Junior Engineer - Signal & Telecommunication (RRB S&T JE) (ரயில்வே சிக்னல் & தொலைத்தொடர்பு JE)",
                        "BSNL / Telecom Technical Supervisor (பி.எஸ்.என்.எல் தொலைத்தொடர்பு மேற்பார்வையாளர்)",
                        "Airport Authority Electronics Technical Executive (AAI) (விமான நிலைய மின்னணு தொழில்நுட்ப அலுவலர்)",
                        "ISRO / DRDO Electronics Technical Assistant (விண்வெளி & பாதுகாப்பு மின்னணு உதவியாளர்)",
                        "Police Wireless / Radio Telecommunication Operator (காவல்துறை வயர்லெஸ் ஆபரேட்டர்)"
                    ]
                elif sec_data.get("id") == "it_software":
                    sec_data["rolesTa"] = [
                        "Hardware & Embedded Systems Technician (வன்பொருள் & எம்படட் சிஸ்டம்ஸ் டெக்னீசியன்)",
                        "Telecom & Fiber Optic Network Engineer (தொலைத்தொடர்பு & ஆப்டிகல் ஃபைபர் நெட்வொர்க் இன்ஜினியர்)",
                        "IoT & Microcontroller Support Specialist (ஐஓடி & மைக்ரோகண்ட்ரோலர் டெக்னீசியன்)",
                        "PCB Layout Designer & Circuit Tester (பிசிபி வடிவமைப்பு & சர்க்யூட் சோதனையாளர்)",
                        "Computer Network & Server Maintenance Executive (நெட்வொர்க் & சர்வர் பராமரிப்பாளர்)"
                    ]
                elif sec_data.get("id") == "manufacturing_industry":
                    sec_data["rolesTa"] = [
                        "Electronics Assembly & SMD Inspection Lead (மின்னணு அசெம்பிளி & எஸ்எம்டி ஆய்வாளர்)",
                        "PLC Automation & Sensor Calibration Tech (பிஎல்சி ஆட்டோமேஷன் & சென்சார் டெக்னீசியன்)",
                        "Automotive ECU & Wire Harness Specialist (வாகன எலக்ட்ரானிக்ஸ் கட்டுப்பாட்டு பிரிவு டெக்னீசியன்)",
                        "Consumer Electronics Service Center Manager (நுகர்வோர் மின்னணு சாதன சேவை மேலாளர்)",
                        "Quality Assurance Engineer - Electronics (மின்னணு சாதன தரக்கட்டுப்பாடு அலுவலர்)"
                    ]
                elif sec_data.get("id") == "engineering_realestate":
                    sec_data["rolesTa"] = [
                        "Building Automation & BMS Systems Supervisor (கட்டிட ஆட்டோமேஷன் & பிஎம்எஸ் மேற்பார்வையாளர்)",
                        "CCTV, Fire Alarm & Security Systems Project Lead (சிசிடிவி & தீயணைப்பு மின்னணு பாதுகாப்பு லீட்)",
                        "Solar Inverter & Power Electronics Site Tech (சோலார் இன்வெர்ட்டர் & பவர் எலக்ட்ரானிக்ஸ் இன்ஜினியர்)",
                        "Electrical & Electronic Substation Junior Inspector (மின் & மின்னணு துணை மின்நிலைய ஆய்வாளர்)",
                        "Telecom Tower & Optical Fiber Laying In-charge (தொலைத்தொடர்பு கோபுரம் & ஆப்டிகல் ஃபைபர் கள இன்சார்ஜ்)"
                    ]
                elif sec_data.get("id") == "finance_banking":
                    sec_data["rolesTa"] = [
                        "Bank ATM Hardware & Network Maintenance Engineer (வங்கி ஏடிஎம் & நெட்வொர்க் தொழில்நுட்ப வல்லுநர்)",
                        "Core Banking Hardware & Server Support Executive (வங்கி சர்வர் & கணினி வன்பொருள் பராமரிப்பாளர்)",
                        "Digital Payment & POS Terminal Field Specialist (டிஜிட்டல் கட்டண பிஓஎஸ் இயந்திர நிபுணர்)",
                        "Financial Electronics Security & CCTV In-charge (வங்கி மின்னணு பாதுகாப்பு & சிசிடிவி மேற்பார்வையாளர்)",
                        "Fintech Hardware Support Specialist (ஃபின்டெக் வன்பொருள் தொழில்நுட்ப அலுவலர்)"
                    ]
            elif is_diploma:
                if sec_data.get("id") == "govt_admin":
                    sec_data["rolesTa"] = [
                        "Indian Railways Junior Engineer (RRB JE) (ரயில்வே இளநிலைப் பொறியாளர் - JE)",
                        "Railway Senior Technician & Section Supervisor (ரயில்வே மூத்த டெக்னீசியன் & பிரிவு மேற்பார்வையாளர்)",
                        "Railway Assistant Loco Pilot (ரயில்வே லோகோ பைலட் / ரயில் ஓட்டுநர்)",
                        "TNEB / TANGEDCO Junior Engineer & Foreman (மின்சார வாரிய இளநிலைப் பொறியாளர் & ஃபோர்மேன்)",
                        "PWD / Highways Technical Assistant (பொதுப்பணித்துறை / நெடுஞ்சாலை தொழில்நுட்ப உதவியாளர்)"
                    ]
                elif sec_data.get("id") == "engineering_realestate":
                    sec_data["rolesTa"] = [
                        "Diploma Civil / Mechanical Engineer (டிப்ளமோ சிவில் / மெக்கானிக்கல் பொறியாளர்)",
                        "Site Supervisor & Field Construction Engineer (கள மேற்பார்வையாளர் & சைட் இன்ஜினியர்)",
                        "CAD / BIM Draftsman & Planning Assistant (சிஏடி வரைவாளர் & திட்டமிடல் உதவியாளர்)",
                        "Quality Control (QC) & Safety Inspector (தரக்கட்டுப்பாடு & பாதுகாப்பு ஆய்வாளர்)",
                        "Govt / Private Technical Contractor (அரசு மற்றும் தனியார் ஒப்பந்ததாரர்)"
                    ]
                elif sec_data.get("id") == "manufacturing_industry":
                    sec_data["rolesTa"] = [
                        "Plant Maintenance Supervisor (தொழிற்சாலை பராமரிப்பு மேற்பார்வையாளர்)",
                        "Production Shift In-charge (உற்பத்தி பிரிவு ஷிப்ட் இன்சார்ஜ்)",
                        "CNC Machine Programmer & Tool Room Lead (சிஎன்சி இயந்திர நிரலாளர் & டூல் லீட்)",
                        "Automobile Workshop Service Manager (வாகன பணிமனை சேவை மேலாளர்)",
                        "Heavy Fabrication & Boiler Operation Supervisor (கனரக ஃபேப்ரிகேஷன் & பாய்லர் மேற்பார்வையாளர்)"
                    ]
                elif sec_data.get("id") == "education_research":
                    sec_data["rolesTa"] = [
                        "Polytechnic / ITI Practical Workshop Instructor (ஐடிஐ / பாலிடெக்னிக் பட்டறை பயிற்றுநர்)",
                        "Technical Skill Development Trainer (தொழில்நுட்ப திறன் மேம்பாட்டு பயிற்சியாளர்)",
                        "CAD & Computer Hardware Institute Instructor (கணினி & சிஏடி பயிற்சி மைய பயிற்றுநர்)",
                        "Vocational Technical Lab Demonstrator (தொழிற்கல்வி செய்முறை உதவியாளர்)",
                        "Heavy Equipment & Automotive Driving Trainer (வாகன ஓட்டுநர் & இயந்திரவியல் பயிற்றுநர்)"
                    ]
                elif sec_data.get("id") == "finance_banking":
                    sec_data["rolesTa"] = [
                        "Junior Accounts Assistant & Tally Specialist (இளநிலை கணக்காளர் & டேலி ஆபரேட்டர்)",
                        "Cooperative Bank Clerk / Cashier (கூட்டுறவு வங்கி எழுத்தர் / காசாளர்)",
                        "Commercial Billing & Inventory Store Keeper (பில்லிங் & ஸ்டோர் இன்சார்ஜ்)",
                        "Microfinance Loan Recovery Field Officer (மைக்ரோபைனான்ஸ் கடன் வசூல் அலுவலர்)",
                        "GST & Tax Filing Documentation Assistant (ஜிஎஸ்டி & வரி தாக்கல் உதவியாளர்)"
                    ]

            ranked_sectors.append(sec_data)

        # Dynamic transit window for native's Lagna
        if lagna_sign_id in [0, 8, 10] or house10_sign_id in [0, 8, 10]:
            dynamic_next_window = "ஜூலை 2027 – ஆகஸ்ட் 2028 (சிம்ம குரு பெயர்ச்சி யோகம்)"
        elif lagna_sign_id in [3, 7, 9, 11] or house10_sign_id in [3, 7, 9, 11]:
            dynamic_next_window = "ஜூன் 2026 – ஜூலை 2027 (கடக உச்ச குரு பெயர்ச்சி யோகம்)"
        else:
            dynamic_next_window = "மே 2025 – ஜூன் 2026 (மிதுன குரு யோக காலம்)"

        # Field signatures for 10th and 2nd lord
        field_signature_10 = PLANET_FIELD_SIGNATURES.get(lord10, {})
        field_signature_2 = PLANET_FIELD_SIGNATURES.get(lord2, {})

        return {
            "house10": {
                "signId": house10_sign_id,
                "signTa": SIGN_NAMES_TA[house10_sign_id],
                "signEn": SIGN_NAMES_EN[house10_sign_id],
                "lord": lord10,
                "lordTa": PLANET_NAMES.get(lord10, {}).get("ta", lord10),
                "occupants": occupants_h10,
                "subathuvam": subathuvam_10,
                "fieldSignatures": field_signature_10
            },
            "house2": {
                "signId": house2_sign_id,
                "signTa": SIGN_NAMES_TA[house2_sign_id],
                "signEn": SIGN_NAMES_EN[house2_sign_id],
                "lord": lord2,
                "lordTa": PLANET_NAMES.get(lord2, {}).get("ta", lord2),
                "occupants": occupants_h2,
                "subathuvam": subathuvam_2,
                "fieldSignatures": field_signature_2
            },
            "jobVsBusiness": {
                "jobScore": job_score,
                "bizScore": biz_score,
                "verdictKey": verdict_key,
                "verdictTa": verdict_ta,
                "verdictEn": verdict_en
            },
            "dasaAnalysis": {
                "dasaLord": current_dasha,
                "dasaLordTa": PLANET_NAMES.get(current_dasha, {}).get("ta", current_dasha),
                "bhuktiLord": current_bhukti,
                "bhuktiLordTa": PLANET_NAMES.get(current_bhukti, {}).get("ta", current_bhukti),
                "dasaNatureTa": dasa_nature_ta,
                "dasaNatureEn": dasa_nature_en,
                "guidanceTa": dasa_guidance_ta,
                "guidanceEn": dasa_guidance_en,
                "businessViability": dasa_biz_viability
            },
            "timingPredictions": {
                "jobTimingTa": job_timing_ta,
                "jobTimingEn": job_timing_en,
                "businessTimingTa": business_timing_ta,
                "businessTimingEn": business_timing_en
            },
            "milestones": milestones,
            "nextFavorableWindow": dynamic_next_window,
            "sectors": ranked_sectors
        }
