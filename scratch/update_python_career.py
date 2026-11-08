# -*- coding: utf-8 -*-
import sys

# 1. Update api_server.py
api_server_path = r"c:\Users\dell\Desktop\Web devlopement\Exact Jathagam\thirukanitham_engine\api_server.py"
with open(api_server_path, "r", encoding="utf-8") as f:
    api_src = f.read()

old_call = '                res = CareerCalculator.calculate(lagna_sign_id, planets_data, birth_year, cur_dasha, cur_bhukti)'
new_call = '''                education_level = data.get("educationLevel", data.get("education_level", "diploma_iti"))
                res = CareerCalculator.calculate(lagna_sign_id, planets_data, birth_year, cur_dasha, cur_bhukti, education_level)'''

if old_call in api_src:
    api_src = api_src.replace(old_call, new_call)
    with open(api_server_path, "w", encoding="utf-8") as f:
        f.write(api_src)
    print("Updated api_server.py")
else:
    print("old_call not found in api_server.py")

# 2. Update career_engine.py
py_ce_path = r"c:\Users\dell\Desktop\Web devlopement\Exact Jathagam\thirukanitham_engine\career_engine.py"
with open(py_ce_path, "r", encoding="utf-8") as f:
    ce_src = f.read()

# Update signature
old_sig = 'def calculate(lagna_sign_id: int, planets_data: dict, birth_year: int = 1988, current_dasha: str = "Sa", current_bhukti: str = "Me") -> dict:'
new_sig = 'def calculate(lagna_sign_id: int, planets_data: dict, birth_year: int = 1988, current_dasha: str = "Sa", current_bhukti: str = "Me", education_level: str = "diploma_iti") -> dict:'

if old_sig in ce_src:
    ce_src = ce_src.replace(old_sig, new_sig)
    print("Updated calculate signature in career_engine.py")

# Update roles and explanation generation in loop
old_loop_code = '''        ranked_sectors = []
        for idx, item in enumerate(scored_sectors[:3]):
            sec_data = dict(item["sector"])
            cal_score = top1_score if idx == 0 else (top2_score if idx == 1 else top3_score)
            sec_data["calculatedScore"] = cal_score

            s1 = f"உங்கள் {SIGN_NAMES_TA[lagna_sign_id]} லக்னத்திற்கு 10-ஆம் வீடான கர்ம ஸ்தானம் {SIGN_NAMES_TA[house10_sign_id]} ராசியாகும். அதன் அதிபதி {PLANET_NAMES.get(lord10, {}).get('ta', lord10)} லக்னத்திற்கு {bhava_names_ta[lord10_bhava]} ({SIGN_NAMES_TA[lord10_obj.get('signId', 0)]}-ல்) {dignity_str} அமைந்துள்ளார்."
            s2 = ""
            if occ_names_ta:
                s2 += f" 10-ஆம் பாவத்தில் {', '.join(occ_names_ta)} அமர்ந்து இந்நபரின் ஜீவன பலத்தை நேரடியாக வழிநடத்துகிறது."
            if asp_names_ta:
                s2 += f" மேலும் 10-ஆம் வீட்டை {', '.join(asp_names_ta)} சுபப் பார்வையால் நோக்குவது இத்துறைக்கு கூடுதல் அந்தஸ்தை அளிக்கிறது."
            s3 = f" 10-ஆம் அதிபதி {subathuvam_10['gradeTa']} பெற்றுள்ளதால் இந்நபருக்கு இத்துறையில் நிலையான கௌரவமும் உயர் அதிகாரமும் கிட்டும்."
            s4 = f" தொழில் காரகனான அமத்யகாரகன் {PLANET_NAMES.get(amk_code, {}).get('ta', amk_code)} இந்நபருக்கு இத்துறையில் சமூக அங்கீகாரத்தை நல்குவார்."

            custom_exp_ta = f"{s1}{s2}{s3}{s4}"
            sec_data["customExplanationTa"] = custom_exp_ta
            sec_data["descriptionTa"] = custom_exp_ta
            ranked_sectors.append(sec_data)'''

new_loop_code = '''        is_diploma = (education_level == "diploma_iti")
        ranked_sectors = []
        for idx, item in enumerate(scored_sectors[:3]):
            sec_data = dict(item["sector"])
            cal_score = top1_score if idx == 0 else (top2_score if idx == 1 else top3_score)
            sec_data["calculatedScore"] = cal_score

            edu_note = " [ஜாதகரின் கல்வித் தகுதி: டிப்ளமோ / ITI / தொழிற்கல்வி]" if is_diploma else ""
            s1 = f"உங்கள் {SIGN_NAMES_TA[lagna_sign_id]} லக்னத்திற்கு 10-ஆம் வீடான கர்ம ஸ்தானம் {SIGN_NAMES_TA[house10_sign_id]} ராசியாகும். அதன் அதிபதி {PLANET_NAMES.get(lord10, {}).get('ta', lord10)} லக்னத்திற்கு {bhava_names_ta[lord10_bhava]} ({SIGN_NAMES_TA[lord10_obj.get('signId', 0)]}-ல்) {dignity_str} அமைந்துள்ளார்.{edu_note}"
            s2 = ""
            if occ_names_ta:
                s2 += f" 10-ஆம் பாவத்தில் {', '.join(occ_names_ta)} அமர்ந்து இந்நபரின் ஜீவன பலத்தை நேரடியாக வழிநடத்துகிறது."
            if asp_names_ta:
                s2 += f" மேலும் 10-ஆம் வீட்டை {', '.join(asp_names_ta)} சுபப் பார்வையால் நோக்குவது இத்துறைக்கு கூடுதல் அந்தஸ்தை அளிக்கிறது."
            
            s3 = ""
            if is_diploma and sec_data.get("id") == "govt_admin":
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
            if is_diploma:
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

            ranked_sectors.append(sec_data)'''

if old_loop_code in ce_src:
    ce_src = ce_src.replace(old_loop_code, new_loop_code)
    print("Updated loop in career_engine.py")
else:
    print("old_loop_code not found in career_engine.py")

with open(py_ce_path, "w", encoding="utf-8") as f:
    f.write(ce_src)
print("Updated thirukanitham_engine/career_engine.py")
