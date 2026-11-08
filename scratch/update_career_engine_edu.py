# -*- coding: utf-8 -*-
"""
Helper script to update js/career-engine.js with rolesByEdu and educationLevel support
"""
import re
import sys

js_path = r"c:\Users\dell\Desktop\Web devlopement\Exact Jathagam\js\career-engine.js"
with open(js_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. We replace the CAREER_SECTORS array
old_sectors_start = '  // 10 Major Vedic Career Industry Sectors with Planetary Signatures\n  const CAREER_SECTORS = ['
old_sectors_end = '    }\n  ];\n\n  const BHAVA_NAMES_TA = ['

new_sectors = '''  // Educational Qualification Categories & Labels
  const EDU_LABELS = {
    diploma_iti: {
      ta: "டிப்ளமோ / ITI / தொழிற்கல்வி (Diploma / Polytechnic)",
      en: "Diploma / ITI / Polytechnic / Technical Qualification",
      badgeTa: "🎓 டிப்ளமோ / ITI",
      badgeEn: "Diploma / Technical"
    },
    degree_ug: {
      ta: "பட்டப்படிப்பு (UG Degree - B.E / B.Sc / B.Com / B.A)",
      en: "Undergraduate Degree (UG - B.E / B.Sc / B.Com / B.A)",
      badgeTa: "🎓 பட்டப்படிப்பு (UG)",
      badgeEn: "UG Graduate"
    },
    postgraduate_pg: {
      ta: "முதுகலைப் பட்டம் (PG Degree - ME / MBA / MCA / M.Sc)",
      en: "Postgraduate Degree (PG - ME / MBA / MCA / M.Sc)",
      badgeTa: "🎓 முதுகலை (PG)",
      badgeEn: "Postgraduate"
    },
    school_10_12: {
      ta: "பள்ளி கல்வி / நேரடி களப்பணி (10th / +2 / Practical Experience)",
      en: "School Level / Field Experience (10th / +2 / Practical)",
      badgeTa: "🏫 பள்ளி கல்வி",
      badgeEn: "School / Practical"
    },
    professional: {
      ta: "உயர் தொழில்முறைப் படிப்பு (Doctor / Law / CA / Civil)",
      en: "Professional Degree (Doctor / Law / CA / Civil)",
      badgeTa: "⚖️ தொழில்முறைப் படிப்பு",
      badgeEn: "Professional Degree"
    }
  };

  // 10 Major Vedic Career Industry Sectors with Planetary Signatures & Education-Calibrated Roles
  const CAREER_SECTORS = [
    {
      id: "it_software",
      nameTa: "தகவல் தொழில்நுட்பம் & செயற்கை நுண்ணறிவு (IT & Software)",
      nameEn: "IT, Software Engineering & AI Technology",
      icon: "💻",
      primaryPlanets: ["Me", "Ra", "Ke", "Ma"],
      favorableElements: ["Air", "Fire"],
      favorableSigns: [2, 10, 5, 0], // Gemini, Aquarius, Virgo, Aries
      descriptionTa: "புதனின் பகுப்பாய்வு திறன், ராகுவின் நவீன தொழில்நுட்ப உந்துதல் மற்றும் கேதுவின் ஆழ்ந்த அல்காரிதம் கோடிங் அமைப்பு IT, AI, Cloud Computing மற்றும் மென்பொருள் துறைகளில் உச்சக்கட்ட வெற்றியை உறுதி செய்கிறது.",
      descriptionEn: "Mercury's analytical logic combined with Rahu's technological innovation and Ketu's algorithmic depth creates stellar prowess in IT, Artificial Intelligence, and Software Engineering.",
      rolesTa: [
        "Software Architect / Tech Lead (முதுநிலை மென்பொருள் வடிவமைப்பாளர்)",
        "AI & Machine Learning Specialist (செயற்கை நுண்ணறிவு நிபுணர்)",
        "Full-Stack Developer / Cloud Engineer (கிளவுட் மற்றும் மென்பொருள் பொறியாளர்)",
        "Cyber Security & Data Analyst (சைபர் பாதுகாப்பு மற்றும் தரவு ஆய்வாளர்)",
        "IT Project Manager & Consultant (ஐடி திட்ட மேலாளர் மற்றும் ஆலோசகர்)"
      ],
      rolesEn: [
        "Software Architect & Technical Lead",
        "AI & Machine Learning Specialist",
        "Cloud Solutions & Full-Stack Engineer",
        "Cyber Security & Big Data Analyst",
        "IT Project Manager & Enterprise Consultant"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Hardware & Networking Field Engineer (வன்பொருள் & நெட்வொர்க் சர்வீஸ் இன்ஜினியர்)",
            "Desktop Support & System Administrator (கணினி சிஸ்டம் சப்போர்ட் நிபுணர்)",
            "Telecom Tower & Optical Fiber Technician (தொலைத்தொடர்பு டவர் & ஃபைபர் டெக்னீசியன்)",
            "CCTV & Security Automation Specialist (சிசிடிவி & செக்யூரிட்டி ஆட்டோமேஷன்)",
            "Junior Web Development & IT Support (இணையதள பராமரிப்பு & ஜூனியர் ஐடி சப்போர்ட்)"
          ],
          rolesEn: [
            "Hardware & Network Support Engineer",
            "Desktop Support & Systems Administrator",
            "Telecom Tower & Fiber Optic Cable Technician",
            "CCTV & Building Security Systems Specialist",
            "Junior Web Development & IT Support Specialist"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Full-Stack Software Developer (மென்பொருள் பொறியாளர்)",
            "Cloud & DevOps Engineer (கிளவுட் மற்றும் டெவ்ஆப்ஸ் பொறியாளர்)",
            "Database Administrator & Data Analyst (தரவுத்தள மேலாளர் & தரவு ஆய்வாளர்)",
            "Cyber Security Specialist (சைபர் பாதுகாப்பு நிபுணர்)",
            "UI/UX Software Designer (யூஐ/யூஎக்ஸ் மென்பொருள் வடிவமைப்பாளர்)"
          ],
          rolesEn: [
            "Full-Stack Software Developer",
            "Cloud Solutions & DevOps Engineer",
            "Database Administrator & Data Analyst",
            "Cyber Security Analyst & Penetration Tester",
            "UI/UX & Digital Product Designer"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Software Architect & Tech Lead (முதுநிலை மென்பொருள் வடிவமைப்பாளர்)",
            "AI & Machine Learning Specialist (செயற்கை நுண்ணறிவு நிபுணர்)",
            "IT Project Manager & Enterprise Consultant (ஐடி திட்ட மேலாளர் மற்றும் ஆலோசகர்)",
            "Chief Technology Officer (CTO) (தலைமை தொழில்நுட்ப அதிகாரி)"
          ],
          rolesEn: [
            "Software Architect & Technical Lead",
            "AI & Machine Learning Specialist",
            "IT Project Manager & Enterprise Consultant",
            "Chief Technology Officer (CTO)"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Computer Hardware & Laptop Service Technician (லேப்டாப் & கணினி பழுதுபார்ப்பவர்)",
            "Data Entry Operator & DTP Specialist (டேட்டா என்ட்ரி ஆபரேட்டர்)",
            "Mobile Phone Service Specialist (செல்போன் சர்வீஸ் டெக்னீசியன்)",
            "Common Service Center (CSC) & Internet Cafe Owner (இன்டர்நெட் மையம் & கணினி சேவை)"
          ],
          rolesEn: [
            "Computer Hardware & Laptop Repair Technician",
            "Data Entry Operator & DTP Specialist",
            "Mobile Phone & Tablet Service Technician",
            "Common Service Center (CSC) & Internet Cafe Owner"
          ]
        },
        professional: {
          rolesTa: [
            "AI Research Scientist & Technology Founder (AI ஆராய்ச்சி விஞ்ஞானி & நிறுவன அதிபர்)",
            "Chief Information Officer (CIO) / Global Tech VP (உலகளாவிய தொழில்நுட்ப துணைத் தலைவர்)"
          ],
          rolesEn: [
            "AI Research Scientist & Deep-Tech Venture Founder",
            "Chief Information Officer (CIO) / Global Tech VP"
          ]
        }
      }
    },
    {
      id: "govt_admin",
      nameTa: "அரசு வேலை, உயர் நிர்வாகம் & சிவில் சர்வீசஸ் (Government & Civil Services)",
      nameEn: "Government, Civil Services & Public Administration",
      icon: "🏛️",
      primaryPlanets: ["Su", "Ju", "Ma", "Sa"],
      favorableElements: ["Fire", "Earth"],
      favorableSigns: [4, 8, 0, 9], // Leo, Sagittarius, Aries, Capricorn
      descriptionTa: "சூரியனின் அரசாங்க ஆதிக்கம், குருவின் தர்ம நீதி மற்றும் செவ்வாயின் கட்டளை ஆற்றல் IAS/IPS, அரசுத் தேர்வுகள், பொதுத்துறை நிறுவனங்கள் மற்றும் உயர் அதிகார பதவிகளில் அமர வைக்கிறது.",
      descriptionEn: "The Sun's royal authority, Jupiter's ethical wisdom, and Mars's administrative command bestow remarkable triumphs in Civil Services, Public Sector, and Executive Governance.",
      rolesTa: [
        "IAS / IPS / TNPSC Group 1 Officer (சிவில் சர்வீசஸ் உயர் அதிகாரி)",
        "Public Sector Executive / Director (அரசு பொதுத்துறை நிர்வாக இயக்குநர்)",
        "Revenue, Taxation & Customs Officer (வருவாய் மற்றும் சுங்கத்துறை அதிகாரி)",
        "Government Department Head (அரசுத் துறை தலைமை நிர்வாகி)",
        "Judicial / Law Enforcement Leader (காவல் & நீதித்துறை தலைமைப் பொறுப்பு)"
      ],
      rolesEn: [
        "Civil Services (IAS / IPS / Administrative Officer)",
        "Public Sector Corporation Director",
        "Revenue, Customs & Tax Authority Official",
        "Government Policy & Departmental Head",
        "Law Enforcement & Strategic Administration"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Indian Railways Junior Engineer (RRB JE) (ரயில்வே இளநிலைப் பொறியாளர் - JE)",
            "Railway Senior Technician & Section Supervisor (ரயில்வே மூத்த டெக்னீசியன் & பிரிவு மேற்பார்வையாளர்)",
            "Railway Assistant Loco Pilot (ரயில்வே லோகோ பைலட் / ரயில் ஓட்டுநர்)",
            "TNEB / TANGEDCO Junior Engineer & Foreman (மின்சார வாரிய இளநிலைப் பொறியாளர் & ஃபோர்மேன்)",
            "PWD / Highways Technical Assistant (பொதுப்பணித்துறை / நெடுஞ்சாலை தொழில்நுட்ப உதவியாளர்)",
            "PSU / BHEL / DRDO Junior Technical Officer (மத்திய பொதுத்துறை இளநிலை தொழில்நுட்ப அலுவலர்)"
          ],
          rolesEn: [
            "Indian Railways Junior Engineer (RRB JE)",
            "Railway Senior Technician & Section Supervisor",
            "Railway Assistant Loco Pilot (ALP)",
            "State Electricity Board (TNEB) Junior Engineer & Foreman",
            "Public Works Department (PWD) Technical Assistant",
            "Central PSU / Defense Production Junior Technical Officer"
          ]
        },
        degree_ug: {
          rolesTa: [
            "TNPSC Group 2 / 2A Executive Officer (அரசு நிர்வாக அலுவலர்)",
            "Railway Section Engineer & Station Master (ரயில்வே பிரிவு பொறியாளர் & நிலைய அதிகாரி)",
            "Revenue Inspector & Municipal Officer (வருவாய் ஆய்வாளர் & நகராட்சி அலுவலர்)",
            "Sub-Inspector of Police (காவல் உதவி ஆய்வாளர்)",
            "Public Sector Enterprise Assistant Manager (அரசு பொதுத்துறை உதவி மேலாளர்)"
          ],
          rolesEn: [
            "State Civil Services Executive Officer (Group 2)",
            "Railway Senior Section Engineer & Station Superintendent",
            "Revenue Inspector & Municipal Administration Officer",
            "Police Sub-Inspector & Law Enforcement Officer",
            "Public Sector Enterprise (PSU) Assistant Manager"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "IAS / IPS / TNPSC Group 1 Officer (சிவில் சர்வீசஸ் உயர் அதிகாரி)",
            "Public Sector Executive Director (அரசு பொதுத்துறை நிர்வாக இயக்குநர்)",
            "Revenue, Taxation & Customs Officer (வருவாய் மற்றும் சுங்கத்துறை அதிகாரி)",
            "Government Department Joint Secretary / Director (அரசுத் துறை இணைச் செயலாளர்)",
            "Judicial / Law Enforcement Leader (காவல் & நீதித்துறை தலைமைப் பொறுப்பு)"
          ],
          rolesEn: [
            "Civil Services (IAS / IPS / Group 1 Officer)",
            "Public Sector Corporation Executive Director",
            "Revenue, Customs & Tax Authority Official",
            "Government Policy & Departmental Joint Secretary",
            "Law Enforcement & Strategic Administration Chief"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Railway Group C / D & Commercial Clerk (ரயில்வே வர்த்தக எழுத்தர் & ஆபரேட்டர்)",
            "Village Administrative Assistant & Typist (கிராம நிர்வாக உதவியாளர் / தட்டச்சர்)",
            "Police Constable & Forest Guard (காவலர் & வனக் காவலர்)",
            "Postal Assistant & Mail Handler (தபால் துறை உதவியாளர்)",
            "Municipal Field Staff & Tax Collector (நகராட்சி வரி வசூலிப்பாளர்)"
          ],
          rolesEn: [
            "Railway Group C / D Technical Staff & Clerk",
            "Village Administrative Assistant & Typist",
            "Police Constable & Forest Guard",
            "Postal Department Assistant & Mail Handler",
            "Municipal Field Staff & Revenue Collector"
          ]
        },
        professional: {
          rolesTa: [
            "Civil Services (IAS / IPS / IRS) Top Administrator (மத்திய சிவில் சர்வீசஸ் உயர் அதிகாரி)",
            "District Magistrate & Municipal Commissioner (மாவட்ட ஆட்சியர் & ஆணையர்)",
            "Government Standing Counsel & Law Officer (அரசு தலைமை வழக்கறிஞர்)",
            "Reserve Bank of India (RBI) Grade B Officer (ரிசர்வ் வங்கி உயர் அதிகாரி)"
          ],
          rolesEn: [
            "Civil Services (IAS / IPS / IRS) Commissioner",
            "District Magistrate & Municipal Commissioner",
            "Government Standing Counsel & Law Officer",
            "Reserve Bank of India (RBI) Grade B Officer"
          ]
        }
      }
    },
    {
      id: "finance_banking",
      nameTa: "வங்கி, நிதி, கணக்கு & பங்குச்சந்தை (Banking & Finance)",
      nameEn: "Banking, Financial Markets, CA & Wealth Management",
      icon: "🏦",
      primaryPlanets: ["Me", "Ju", "Ve"],
      favorableElements: ["Earth", "Air"],
      favorableSigns: [1, 5, 9, 6], // Taurus, Virgo, Capricorn, Libra
      descriptionTa: "புதனின் கணக்கியல் துல்லியம், குருவின் தன காரக பலம் மற்றும் சுக்கிரனின் பணப்புழக்க ஆதரவு வங்கி, ஆடிட்டிங் (CA), நிதி முதலீடு மற்றும் பங்குச்சந்தையில் பெரும் செல்வத்தை ஈட்டித் தரும்.",
      descriptionEn: "Mercury's numerical precision, Jupiter's wealth stewardship, and Venus's liquidity yield immense distinction in Chartered Accountancy, Banking, and Capital Markets.",
      rolesTa: [
        "Chartered Accountant (CA) & Auditor (பட்டயக் கணக்காளர் மற்றும் தணிக்கையாளர்)",
        "Investment Banker & Portfolio Manager (முதலீட்டு வங்கி மற்றும் நிதி மேலாளர்)",
        "Bank Branch Manager / Executive (வங்கி மேலாளர் மற்றும் தலைமை அலுவலர்)",
        "Stock Market Trader & Equity Analyst (பங்குச்சந்தை வர்த்தகர் & ஆய்வாளர்)",
        "Corporate Financial Controller (நிறுவன தலைமை நிதி கட்டுப்பாட்டாளர்)"
      ],
      rolesEn: [
        "Chartered Accountant (CA) & Audit Partner",
        "Investment Banker & Portfolio Asset Manager",
        "Bank Senior Executive / Branch Head",
        "Equity Research & Algorithmic Stock Trader",
        "Chief Financial Officer (CFO) & Financial Planner"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Junior Accounts Assistant & Tally Specialist (இளநிலை கணக்காளர் & டேலி ஆபரேட்டர்)",
            "Cooperative Bank Clerk / Cashier (கூட்டுறவு வங்கி எழுத்தர் / காசாளர்)",
            "Commercial Billing & Inventory Store Keeper (பில்லிங் & ஸ்டோர் இன்சார்ஜ்)",
            "Microfinance Loan Recovery Field Officer (மைக்ரோபைனான்ஸ் கடன் வசூல் அலுவலர்)",
            "GST & Tax Filing Documentation Assistant (ஜிஎஸ்டி & வரி தாக்கல் உதவியாளர்)"
          ],
          rolesEn: [
            "Junior Accounts Assistant & Tally Specialist",
            "Cooperative Credit Society Clerk & Cashier",
            "Commercial Billing & Inventory Storekeeper",
            "Microfinance Field Recovery Officer",
            "Tax Filing & Documentation Assistant"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Bank Assistant Manager / PO (வங்கி உதவி மேலாளர்)",
            "Financial Analyst & Investment Advisor (நிதி ஆய்வாளர் & முதலீட்டு ஆலோசகர்)",
            "Senior Accountant & Tax Practitioner (மூத்த கணக்காளர் & வரி ஆலோசகர்)",
            "Stock Broker & Equity Trader (பங்கு வர்த்தகர் & புரோக்கர்)"
          ],
          rolesEn: [
            "Probationary Officer (PO) & Bank Assistant Manager",
            "Financial Analyst & Wealth Advisor",
            "Senior Accountant & Tax Practitioner",
            "Stock Broker & Commodity Trader"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Chartered Accountant (CA) & Audit Partner (பட்டயக் கணக்காளர் மற்றும் தணிக்கையாளர்)",
            "Investment Banker & Portfolio Fund Manager (முதலீட்டு வங்கி & நிதி மேலாளர்)",
            "Bank Branch Manager / Regional Head (வங்கி கிளை மேலாளர் / மண்டல தலைவர்)",
            "Chief Financial Officer (CFO) (தலைமை நிதி அதிகாரி)"
          ],
          rolesEn: [
            "Chartered Accountant (CA) & Audit Partner",
            "Investment Banker & Portfolio Fund Manager",
            "Bank Branch Manager / Regional Executive",
            "Chief Financial Officer (CFO)"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Cashier & Daily Billing Clerk (காசாளர் & பில்லிங் எழுத்தர்)",
            "Money Transfer & Banking Kiosk Agent (பணப் பரிமாற்ற கியோஸ்க் ஏஜென்ட்)",
            "Collection Agent & Chit Fund Assistant (சீட்டு நிதி & வசூல் முகவர்)"
          ],
          rolesEn: [
            "Retail Cashier & Billing Clerk",
            "Banking Correspondent & Money Transfer Kiosk Agent",
            "Chit Fund Collector & Daily Deposit Agent"
          ]
        },
        professional: {
          rolesTa: [
            "Senior CA / Partner at Big-4 Accounting Firm (முன்னணி ஆடிட்டிங் நிறுவன பார்ட்னர்)",
            "Managing Director - Institutional Wealth (நிறுவன நிதி மேலாண்மை நிர்வாக இயக்குநர்)"
          ],
          rolesEn: [
            "Senior Chartered Accountant / Big-4 Partner",
            "Managing Director - Institutional Wealth & Investment Banking"
          ]
        }
      }
    },
    {
      id: "engineering_realestate",
      nameTa: "பொறியியல், கட்டுமானம் & ரியல் எஸ்டேட் (Engineering & Real Estate)",
      nameEn: "Engineering, Civil Infrastructure & Real Estate",
      icon: "🏗️",
      primaryPlanets: ["Ma", "Sa", "Su"],
      favorableElements: ["Earth", "Fire"],
      favorableSigns: [0, 7, 9, 1], // Aries, Scorpio, Capricorn, Taurus
      descriptionTa: "செவ்வாயின் பூமி காரக யோகம் மற்றும் சனியின் கட்டுமான ஒழுங்கு சிவில் இன்ஜினியரிங், ரியல் எஸ்டேட், இயந்திரவியல் மற்றும் கனரக உள்கட்டமைப்பு பணிகளில் மகத்தான லாபத்தை வழங்குகிறது.",
      descriptionEn: "Mars's land ownership vitality coupled with Saturn's structural discipline commands leadership in Civil Engineering, Real Estate Development, and Infrastructure.",
      rolesTa: [
        "Real Estate Builder & Promoter (ரியல் எஸ்டேட் கட்டுமான அதிபர்)",
        "Civil & Structural Engineer (கட்டுமான தலைமைப் பொறியாளர்)",
        "Mechanical / Electrical Project Lead (இயந்திரவியல் / மின் பொறியியல் தலைவர்)",
        "Property Developer & Land Investor (மனை வணிகம் & நில முதலீட்டாளர்)",
        "Mining, Metallurgy & Survey Director (சுரங்கம் மற்றும் நில அளவை அதிகாரி)"
      ],
      rolesEn: [
        "Real Estate Promoter & Infrastructure Builder",
        "Civil Engineering Project Director",
        "Mechanical / Heavy Electrical Engineering Lead",
        "Commercial Land & Property Investor",
        "Industrial Plant Construction Manager"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Diploma Civil / Mechanical Engineer (டிப்ளமோ சிவில் / மெக்கானிக்கல் பொறியாளர்)",
            "Site Supervisor & Field Construction Engineer (கள மேற்பார்வையாளர் & சைட் இன்ஜினியர்)",
            "CAD / BIM Draftsman & Planning Assistant (சிஏடி வரைவாளர் & திட்டமிடல் உதவியாளர்)",
            "Quality Control (QC) & Safety Inspector (தரக்கட்டுப்பாடு & பாதுகாப்பு ஆய்வாளர்)",
            "Govt / Private Technical Contractor (அரசு மற்றும் தனியார் ஒப்பந்ததாரர்)"
          ],
          rolesEn: [
            "Diploma Civil / Mechanical Engineer",
            "Site Supervisor & Construction Field Engineer",
            "CAD / BIM Draftsman & Structural Detailer",
            "Quality Control (QC) & Industrial Safety Inspector",
            "Licensed Building & Infrastructure Sub-Contractor"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Project Engineer & Structural Designer (திட்டப் பொறியாளர் & வடிவமைப்பு நிபுணர்)",
            "Real Estate Project Lead & Valuation Officer (ரியல் எஸ்டேட் திட்ட மேலாளர்)",
            "Mechanical Plant Engineer (மெக்கானிக்கல் ஆலை பொறியாளர்)",
            "Electrical Infrastructure Lead (மின் கட்டமைப்பு பொறியாளர்)",
            "Construction Operations Manager (கட்டுமான செயல்பாட்டு மேலாளர்)"
          ],
          rolesEn: [
            "Project Engineer & Structural Designer",
            "Real Estate Project Lead & Valuation Officer",
            "Mechanical Plant & Project Engineer",
            "Electrical Infrastructure Lead Engineer",
            "Construction Operations Manager"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Chief Engineering Director & Infrastructure Consultant (தலைமை உள்கட்டமைப்பு ஆலோசகர்)",
            "Mega Project Director & Metro Rail Head (மெகா திட்ட இயக்குநர் & மெட்ரோ ரயில் தலைமை)",
            "Structural Consulting Firm Founder (கட்டமைப்பு ஆலோசனை நிறுவன அதிபர்)",
            "Urban Planning & Smart City Director (நகர திட்டமிடல் தலைமை இயக்குநர்)"
          ],
          rolesEn: [
            "Chief Engineering Director & Infrastructure Consultant",
            "Mega Project Director & Metro Rail Authority Head",
            "Structural Engineering Consulting Firm Founder",
            "Urban Planning & Smart City Development Director"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Building Construction Contractor (கட்டிட ஒப்பந்ததாரர் & மேஸ்திரி)",
            "Plumbing, Electrical & Masonry Lead (பிளம்பிங், எலக்ட்ரிக்கல் மேற்பார்வையாளர்)",
            "Heavy Earthmover / JCB / Crane Operator (ஜேசிபி / கிரேன் ஆபரேட்டர்)",
            "Building Material Trader (கட்டுமான பொருட்கள் வியாபாரம்)"
          ],
          rolesEn: [
            "Building Construction Sub-Contractor & Lead Mason",
            "Plumbing, Electrical & Site Work Lead",
            "Heavy Earthmover / JCB / Crane Operator",
            "Building Materials & Hardware Merchant"
          ]
        },
        professional: {
          rolesTa: [
            "Chief Structural Consultant & Urban Architect (தலைமை கட்டமைப்பு ஆலோசகர்)",
            "Mega Infrastructure Promoter & Industrialist (உள்கட்டமைப்பு பெருந்தொழிலதிபர்)"
          ],
          rolesEn: [
            "Chief Structural Consultant & Urban Architect",
            "Mega Infrastructure Developer & Industrialist"
          ]
        }
      }
    },
    {
      id: "medicine_healthcare",
      nameTa: "மருத்துவம், அறுவை சிகிச்சை & மருந்தியல் (Medicine & Healthcare)",
      nameEn: "Medicine, Surgery, Pharmaceuticals & Healthcare",
      icon: "🩺",
      primaryPlanets: ["Su", "Ma", "Ke", "Mo"],
      favorableElements: ["Water", "Fire"],
      favorableSigns: [3, 7, 11, 4], // Cancer, Scorpio, Pisces, Leo
      descriptionTa: "சூரியனின் ஆரோக்கிய ஜீவ ஒளி, செவ்வாயின் கூர்மையான அறுவை சிகிச்சை கைத்திறன் மற்றும் கேதுவின் மருந்தியல் நுண்ணறிவு மருத்துவத்தில் புகழ்பெற்ற வைத்தியராக மாற்றும்.",
      descriptionEn: "The Sun's curative lifeforce, Mars's surgical precision, and Ketu's medicinal acumen manifest celebrated physicians, surgeons, and healthcare pioneers.",
      rolesTa: [
        "Surgeon & Specialist Doctor (அறுவை சிகிச்சை மற்றும் சிறப்பு மருத்துவர்)",
        "Physician / Medical Consultant (பொது மருத்துவர் மற்றும் மருத்துவ ஆலோசகர்)",
        "Hospital Administrator & Clinic Founder (மருத்துவமனை நிறுவனர் மற்றும் மேலாளர்)",
        "Pharmaceutical Research Scientist (மருந்தியல் ஆராய்ச்சி விஞ்ஞானி)",
        "Alternative Healing, Yoga & Siddha Master (சித்தா, ஆயுர்வேதம் மற்றும் இயற்கை மருத்துவம்)"
      ],
      rolesEn: [
        "Surgeon / Specialized Medical Practitioner",
        "Consultant Physician & Diagnostician",
        "Hospital Managing Director & Clinical Lead",
        "Pharmaceutical Scientist & Drug Researcher",
        "Ayurveda, Siddha & Integrative Wellness Pioneer"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Medical Lab Technician (DMLT) (மருத்துவ ஆய்வக தொழில்நுட்ப வல்லுநர்)",
            "Diploma Pharmacist & Medical Store In-charge (டிப்ளமோ மருந்தாளுநர் & மெடிக்கல் ஸ்டோர்)",
            "Biomedical Equipment Maintenance Technician (மருத்துவ உபகரண பராமரிப்பாளர்)",
            "Radiology / X-Ray / ECG Technician (எக்ஸ்-ரே & இசிஜி டெக்னீசியன்)",
            "Operation Theatre & Dialysis Technician (ஆபரேஷன் தியேட்டர் டெக்னீசியன்)"
          ],
          rolesEn: [
            "Medical Laboratory Technician (DMLT)",
            "Registered Diploma Pharmacist & Retail Chemist",
            "Hospital Biomedical Equipment Maintenance Technician",
            "Radiology, X-Ray & ECG Diagnostic Technician",
            "Operation Theatre & Dialysis Technician"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Registered Nurse / Hospital Ward Supervisor (செவிலியர் & வார்டு மேற்பார்வையாளர்)",
            "B.Pharm Quality Control Executive (மருந்து தரக்கட்டுப்பாட்டு அதிகாரி)",
            "Physiotherapist & Rehabilitation Specialist (பிசியோதெரபிஸ்ட்)",
            "Hospital Operations Coordinator (மருத்துவமனை செயல்பாட்டு ஒருங்கிணைப்பாளர்)"
          ],
          rolesEn: [
            "Registered Nursing Officer & Ward Supervisor",
            "Pharmaceutical Quality Assurance Executive",
            "Physiotherapy & Sports Rehab Specialist",
            "Hospital Operations & Patient Care Coordinator"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Specialist Doctor (MD/MS) & Physician (சிறப்பு மருத்துவர்)",
            "Hospital Medical Director & Clinic Founder (மருத்துவமனை மருத்துவ இயக்குநர்)",
            "Pharmaceutical Drug Research Scientist (மருந்தியல் ஆராய்ச்சி விஞ்ஞானி)",
            "Siddha & Ayurveda Integrative Specialist (சித்த & ஆயுர்வேத மருத்துவ நிபுணர்)"
          ],
          rolesEn: [
            "Consultant Physician & Specialist Doctor (MD/MS)",
            "Hospital Medical Director & Clinic Founder",
            "Pharmaceutical Drug Discovery Scientist",
            "Siddha & Ayurvedic Integrative Specialist"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Pharmacy Store Assistant & Chemist Staff (மருந்துக் கடை உதவியாளர்)",
            "Hospital Nursing Attendant & Care Assistant (மருத்துவமனை உதவியாளர்)",
            "Herbal & Traditional Remedy Merchant (மூலிகை மருந்து விற்பனையாளர்)"
          ],
          rolesEn: [
            "Pharmacy Store Assistant & Chemist Staff",
            "Hospital Nursing Attendant & Care Assistant",
            "Herbal & Traditional Remedy Merchant"
          ]
        },
        professional: {
          rolesTa: [
            "Surgeon & Super-Specialist Doctor (அறுவை சிகிச்சை & சூப்பர் ஸ்பெஷலிஸ்ட் மருத்துவர்)",
            "Medical College Dean & Hospital Founder (மருத்துவக் கல்லூரி முதல்வர்)"
          ],
          rolesEn: [
            "Surgeon & Super-Specialist Consultant",
            "Medical College Dean & Healthcare Founder"
          ]
        }
      }
    },
    {
      id: "law_judiciary",
      nameTa: "சட்டம், நீதித்துறை & மக்கள் தொடர்பு (Law, Legal & Judiciary)",
      nameEn: "Law, Judiciary, Corporate Legal & Advocacy",
      icon: "⚖️",
      primaryPlanets: ["Ju", "Sa", "Me"],
      favorableElements: ["Air", "Fire"],
      favorableSigns: [6, 8, 10, 2], // Libra, Sagittarius, Aquarius, Gemini
      descriptionTa: "குருவின் தர்மநெறி, சனியின் சட்ட நேர்மை மற்றும் புதனின் வாக்கு வாதத்திறன் உச்சநீதிமன்ற/உயர்நீதிமன்ற வழக்கறிஞராகவும், நீதிபதியாகவும், கார்ப்பரேட் சட்ட ஆலோசகராகவும் மிளிர வைக்கிறது.",
      descriptionEn: "Jupiter's righteous jurisprudence, Saturn's impartial justice, and Mercury's persuasive advocacy forge distinguished advocates, legal counsels, and magistrates.",
      rolesTa: [
        "Senior Advocate / High Court Counsel (மூத்த வழக்கறிஞர் மற்றும் சட்ட ஆலோசகர்)",
        "Corporate Legal Counsel (நிறுவன தலைமை சட்ட ஆலோசகர்)",
        "Judicial Magistrate / Judge (நீதிபதி மற்றும் நடுவர்)",
        "Arbitrator & Dispute Resolution Head (சர்வதேச வர்த்தக சமரச அதிகாரி)",
        "Labor Law & Human Rights Activist (தொழிலாளர் நல மற்றும் மனித உரிமை சட்ட நிபுணர்)"
      ],
      rolesEn: [
        "Senior High Court / Supreme Court Advocate",
        "Chief Corporate Legal Counsel",
        "Judicial Magistrate & Legal Officer",
        "Commercial Arbitrator & Mediator",
        "Human Rights & Industrial Relations Director"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Police Technical Wing / Wireless Operator (காவல்துறை வயர்லெஸ் & தொழில்நுட்ப பிரிவு)",
            "Sub-Registrar Office Document Writer (சார்பதிவாளர் அலுவலக பத்திர எழுத்தர்)",
            "Court Technical Assistant & Steno-Typist (நீதிமன்ற தொழில்நுட்ப உதவியாளர் & தட்டச்சர்)",
            "Industrial Security Officer & Fire Safety Lead (தொழிலக பாதுகாப்பு & தீயணைப்பு அலுவலர்)",
            "Railway Protection Force (RPF) Technical Personnel (ரயில்வே பாதுகாப்பு படை ஊழியர்)"
          ],
          rolesEn: [
            "Police Department Wireless & Communications Operator",
            "Registered Property Deed Writer & Registration Consultant",
            "Judicial Typist & Court Technical Assistant",
            "Industrial Safety & Fire Protection Supervisor",
            "Railway Protection Force (RPF) Technical Personnel"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Advocate / Legal Practitioner (நீதிமன்ற வழக்கறிஞர்)",
            "Sub-Inspector of Police (காவல் உதவி ஆய்வாளர்)",
            "Labour Welfare & Compliance Officer (தொழிலாளர் நல அதிகாரி)",
            "Legal Drafting & Conveyancing Consultant (சட்ட ஆவண ஆலோசகர்)"
          ],
          rolesEn: [
            "Practicing Advocate & Legal Counsel",
            "Police Sub-Inspector & Investigative Officer",
            "Labor Welfare & Statutory Compliance Officer",
            "Legal Drafting & Conveyancing Consultant"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Senior Advocate / High Court Counsel (மூத்த உயர்நீதிமன்ற வழக்கறிஞர்)",
            "Judicial Magistrate / Judge (நீதிபதி மற்றும் நடுவர்)",
            "Corporate Legal General Counsel (நிறுவன தலைமை சட்ட ஆலோசகர்)",
            "Arbitrator & Commercial Mediator (சர்வதேச வர்த்தக சமரச அதிகாரி)"
          ],
          rolesEn: [
            "Senior High Court / Supreme Court Advocate",
            "Judicial Magistrate & District Judge",
            "Corporate Chief Legal Counsel",
            "Commercial Arbitrator & Dispute Mediator"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Court Process Server & Bailiff Assistant (நீதிமன்ற அழைப்பாணை உதவியாளர்)",
            "Police Constable & Security Guard (காவலர் & பாதுகாப்பு ஊழியர்)",
            "Deed Form Assistant & Typist (பத்திர படிவ உதவியாளர்)"
          ],
          rolesEn: [
            "Court Process Server & Bailiff Assistant",
            "Police Constable & Security Guard",
            "Deed Form Assistant & Typist"
          ]
        },
        professional: {
          rolesTa: [
            "Supreme Court Senior Advocate / Justice (உச்சநீதிமன்ற மூத்த வழக்கறிஞர் / நீதிபதி)",
            "Attorney General / Senior Constitutional Counsel (அரசு தலைமை வழக்கறிஞர்)"
          ],
          rolesEn: [
            "Supreme Court Senior Advocate & Justice",
            "Attorney General / Senior Constitutional Counsel"
          ]
        }
      }
    },
    {
      id: "creative_arts_media",
      nameTa: "கலை, சினிமா, ஊடகம் & வடிவமைப்பு (Creative Arts, Cinema & Media)",
      nameEn: "Creative Arts, Cinema, Media & Luxury Design",
      icon: "🎬",
      primaryPlanets: ["Ve", "Mo", "Me"],
      favorableElements: ["Water", "Air"],
      favorableSigns: [1, 6, 3, 11], // Taurus, Libra, Cancer, Pisces
      descriptionTa: "சுக்கிரனின் அழகு கவர்ச்சி, சந்திரனின் கற்பனை வளம் மற்றும் புதனின் தகவல்தொடர்பு சினிமா, தொலைக்காட்சி, விளம்பரம், ஆர்க்கிடெக்சர் மற்றும் டிஜிட்டல் ஊடகத்தில் மக்கள் ஆதரவையும் புகழையும் ஈட்டித் தரும்.",
      descriptionEn: "Venus's creative glamour, the Moon's imaginative intuition, and Mercury's communicative flair propel luminary success in Cinema, Television, Design, and Digital Media.",
      rolesTa: [
        "Film Director / Producer / Actor (திரைப்பட இயக்குநர், தயாரிப்பாளர், நடிகர்)",
        "Creative Director & Advertising Head (படைப்பாக்க இயக்குநர் & விளம்பரத் தலைவர்)",
        "Architect, Fashion & Interior Designer (ஆர்க்கிடெக்ட், ஆடை மற்றும் உள்துறை வடிவமைப்பாளர்)",
        "Media Journalist & Digital Content Creator (ஊடக பத்திரிகையாளர் & டிஜிட்டல் படைப்பாளி)",
        "Luxury Brand & Event Management Head (ஆடம்பர பிராண்ட் & பிரம்மாண்ட நிகழ்வு மேலாளர்)"
      ],
      rolesEn: [
        "Film Director, Media Producer & Actor",
        "Creative Advertising Director & Brand Strategist",
        "Architect, Fashion & Interior Decor Designer",
        "Broadcast Journalist & Digital Media Host",
        "Luxury Goods & Mega-Event Management Executive"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Diploma Graphic Designer & DTP Specialist (டிடிபி & கிராபிக் டிசைனர்)",
            "Digital Video & Audio Editing Technician (வீடியோ எடிட்டிங் டெக்னீசியன்)",
            "Offset Printing Press Production Supervisor (அச்சக ஆப்-செட் மெஷின் மேற்பார்வையாளர்)",
            "3D Architectural & Interior CAD Draftsman (3D இன்டீரியர் வரைவாளர்)",
            "Stage Sound, Lighting & AV Technician (ஒலி-ஒளி அமைப்பு தொழில்நுட்ப கலைஞர்)"
          ],
          rolesEn: [
            "Diploma Graphic Designer & Desktop Publishing Specialist",
            "Digital Video & Audio Editing Technician",
            "Offset Printing Press Production Supervisor",
            "3D Architectural & Interior CAD Draftsman",
            "Stage Sound, Lighting & AV Technician"
          ]
        },
        degree_ug: {
          rolesTa: [
            "UI/UX & Visual Experience Designer (யூஐ/யூஎக்ஸ் வடிவமைப்பு நிபுணர்)",
            "Broadcast Journalist & Television Reporter (தொலைக்காட்சி ஊடகவியலாளர்)",
            "Advertising Copywriter & Brand Strategist (விளம்பர படைப்பாளி)",
            "Cinematographer & Camera Lead (ஒளிப்பதிவாளர்)"
          ],
          rolesEn: [
            "UI/UX & Digital Experience Designer",
            "Broadcast Journalist & Media Reporter",
            "Advertising Copywriter & Brand Strategist",
            "Director of Photography & Cinematographer"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Film Director & Production House Owner (திரைப்பட இயக்குநர் & தயாரிப்பாளர்)",
            "Creative Advertising Agency Founder (விளம்பர நிறுவன நிறுவனர்)",
            "Chief Media Editor & Digital Publisher (ஊடக தலைமை ஆசிரியர்)",
            "Master Fashion & Architectural Designer (முதுநிலை ஆடை & கட்டட கலைஞர்)"
          ],
          rolesEn: [
            "Film Director, Producer & Studio Founder",
            "Creative Advertising Agency Head",
            "Chief Media Editor & Digital Network Head",
            "Master Fashion & Architectural Designer"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Flex Banner & Signage Board Printer (ஃப்ளெக்ஸ் பேனர் & விளம்பர பலகை தயாரிப்பாளர்)",
            "Sound System & Event DJ Operator (ஒலிபெருக்கி அமைப்பு & டிஜே ஆபரேட்டர்)",
            "Local Photo Studio & Video Cameraman (புகைப்பட ஸ்டுடியோ உரிமையாளர்)"
          ],
          rolesEn: [
            "Flex Banner & Signage Board Printer",
            "Sound System & Event DJ Operator",
            "Local Photo Studio & Video Cameraman"
          ]
        },
        professional: {
          rolesTa: [
            "Acclaimed Film Director & Media Studio Owner (திரைப்பட ஸ்டுடியோ அதிபர்)",
            "Global Brand Marketing Director (உலகளாவிய பிராண்ட் மார்க்கெட்டிங் தலைவர்)"
          ],
          rolesEn: [
            "Acclaimed Film Director & Media Studio Owner",
            "Global Brand Marketing Director"
          ]
        }
      }
    },
    {
      id: "education_research",
      nameTa: "கல்வி, பல்கலைக்கழக பேராசிரியர் & ஆராய்ச்சி (Education & Research)",
      nameEn: "Higher Education, Professorship & Scientific Research",
      icon: "📚",
      primaryPlanets: ["Ju", "Me", "Su"],
      favorableElements: ["Fire", "Water"],
      favorableSigns: [8, 11, 2, 4], // Sagittarius, Pisces, Gemini, Leo
      descriptionTa: "குரு பகவானின் போதனா பலம் மற்றும் புதனின் கல்விப் புலமை பல்கலைக்கழக விரிவுரையாளர், பள்ளி/கல்லூரி நிறுவனர், நூலாசிரியர் மற்றும் ஆராய்ச்சி விஞ்ஞானி நிலைக்கு உயர்த்தும்.",
      descriptionEn: "Jupiter's pedagogical brilliance paired with Mercury's academic depth establishes illustrious tenures as University Professors, Researchers, Authors, and Educational Founders.",
      rolesTa: [
        "University Professor & Research Guide (பல்கலைக்கழக பேராசிரியர் & ஆய்வு வழிகாட்டி)",
        "School / College Founder & Principal (கல்வி நிறுவன நிறுவனர் மற்றும் முதல்வர்)",
        "Scientific Researcher & Author (அறிவியல் ஆய்வாளர் மற்றும் நூலாசிரியர்)",
        "Corporate Trainer & Motivational Speaker (நிறுவன பயிற்சியாளர் & ஊக்கப் பேச்சாளர்)",
        "Educational Consultant & Academic Dean (கல்வி ஆலோசகர் மற்றும் கல்லூரி டீன்)"
      ],
      rolesEn: [
        "University Professor & Research Fellowship Chair",
        "Educational Institution Founder & Dean",
        "Scientific Researcher & Scholarly Author",
        "Corporate Executive Coach & Thought Leader",
        "Curriculum Director & Academic Advisor"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Polytechnic / ITI Practical Workshop Instructor (ஐடிஐ / பாலிடெக்னிக் பட்டறை பயிற்றுநர்)",
            "Technical Skill Development Trainer (தொழில்நுட்ப திறன் மேம்பாட்டு பயிற்சியாளர்)",
            "CAD & Computer Hardware Institute Instructor (கணினி & சிஏடி பயிற்சி மைய பயிற்றுநர்)",
            "Vocational Technical Lab Demonstrator (தொழிற்கல்வி செய்முறை உதவியாளர்)",
            "Heavy Equipment & Automotive Driving Trainer (வாகன ஓட்டுநர் & இயந்திரவியல் பயிற்றுநர்)"
          ],
          rolesEn: [
            "Polytechnic / ITI Practical Workshop Instructor",
            "Technical Skill & Apprenticeship Trainer",
            "CAD & Computer Hardware Institute Instructor",
            "Vocational Technical Lab Demonstrator",
            "Heavy Equipment & Automotive Driving Trainer"
          ]
        },
        degree_ug: {
          rolesTa: [
            "High School Science & Math Teacher (பட்டதாரி ஆசிரியர் - கணிதம்/அறிவியல்)",
            "Coaching Academy Tutor & Academic Coordinator (கல்வி பயிற்சி மைய ஆசிரியர்)",
            "Technical Curriculum Developer (பாடத்திட்ட தயாரிப்பாளர்)",
            "Library & Information Science Officer (நூலக அதிகாரி)"
          ],
          rolesEn: [
            "Graduate Trained Teacher (Maths / Science)",
            "Coaching Academy Tutor & Academic Coordinator",
            "Technical Curriculum Developer",
            "Library & Information Science Officer"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "University Professor & Research Guide (பல்கலைக்கழக பேராசிரியர் & ஆய்வு வழிகாட்டி)",
            "College Principal & Academic Dean (கல்வி நிறுவன நிறுவனர் மற்றும் முதல்வர்)",
            "Scientific Researcher & Author (அறிவியல் ஆய்வாளர் மற்றும் நூலாசிரியர்)",
            "Curriculum Director & Academic Advisor (கல்வி ஆலோசகர் மற்றும் கல்லூரி டீன்)"
          ],
          rolesEn: [
            "University Professor & Research Fellowship Chair",
            "College Principal & Academic Dean",
            "Scientific Researcher & Scholarly Author",
            "Curriculum Director & Academic Advisor"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Primary School Assistant & Daycare Supervisor (தொடக்கப்பள்ளி உதவியாளர்)",
            "Workshop Apprentice Assistant (பட்டறை பயிற்சி உதவியாளர்)",
            "Basic Tuition Center Organizer (எளிய டியூஷன் மைய ஒருங்கிணைப்பாளர்)"
          ],
          rolesEn: [
            "Primary School Assistant & Daycare Supervisor",
            "Workshop Apprentice Assistant",
            "Basic Tuition Center Organizer"
          ]
        },
        professional: {
          rolesTa: [
            "University Vice Chancellor & Academic Founder (பல்கலைக்கழக துணைவேந்தர் & நிறுவனர்)",
            "National Research Institute Director (தேசிய ஆராய்ச்சி நிறுவன இயக்குநர்)"
          ],
          rolesEn: [
            "University Vice Chancellor & Academic Founder",
            "National Research Institute Director"
          ]
        }
      }
    },
    {
      id: "trade_foreign",
      nameTa: "சர்வதேச வர்த்தகம், ஏற்றுமதி-இறக்குமதி & வெளிநாட்டு வேலை (Global Trade & Foreign Employment)",
      nameEn: "International Trade, Logistics, Import-Export & Overseas MNC",
      icon: "✈️",
      primaryPlanets: ["Ra", "Mo", "Me", "Ve"],
      favorableElements: ["Air", "Water"],
      favorableSigns: [10, 6, 2, 8], // Aquarius, Libra, Gemini, Sagittarius
      descriptionTa: "ராகுவின் வெளிநாட்டு யோகம், சந்திரனின் கடல்கடந்த பிரயாண காரகம் மற்றும் புதனின் வியாபார திறமை பன்னாட்டு நிறுவன (MNC) வேலை, ஏற்றுமதி-இறக்குமதி மற்றும் குடியேற்ற யோகத்தை நல்கும்.",
      descriptionEn: "Rahu's cross-border magnetism, Moon's overseas navigation, and Mercury's mercantile intellect facilitate multinational corporate employment and lucrative Import-Export ventures.",
      rolesTa: [
        "Overseas MNC Executive / Expat Leader (பன்னாட்டு நிறுவன வெளிநாட்டு பணி)",
        "Import-Export Business Owner (ஏற்றுமதி-இறக்குமதி நிறுவன உரிமையாளர்)",
        "Supply Chain & International Logistics Head (சர்வதேச விநியோகச் சங்கிலி மேலாளர்)",
        "Aviation, Aerospace & Travel Enterprise (விமானத்துறை & சர்வதேச சுற்றுலா அதிபர்)",
        "Cross-Border E-Commerce & Trade Head (எல்லைகடந்த மின்வணிக வர்த்தகத் தலைவர்)"
      ],
      rolesEn: [
        "Multinational Corporation Expat Senior Executive",
        "Import-Export Merchant & Trading House Owner",
        "Global Supply Chain & Freight Logistics Director",
        "Aviation Operations & Luxury Travel Specialist",
        "Cross-Border Digital Commerce Leader"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Warehouse Logistics & Inventory Dispatch Supervisor (கிடங்கு & சரக்கு போக்குவரத்து மேற்பார்வையாளர்)",
            "Fleet Vehicle Maintenance & Transport In-charge (வாகன பராமரிப்பு & போக்குவரத்து பொறுப்பாளர்)",
            "Cargo Freight & Customs Clearing Technical Assistant (சரக்கு அனுப்புதல் & சுங்க அனுமதி உதவியாளர்)",
            "Overseas / Gulf Petrochemical & Technical Plant Operator (வளைகுடா / வெளிநாட்டு ஆலை தொழில்நுட்ப பணி)",
            "Heavy Equipment & Mobile Crane Operations Lead (கனரக இயந்திரங்கள் & கிரேன் ஆபரேட்டர் மேற்பார்வை)"
          ],
          rolesEn: [
            "Warehouse Logistics & Inventory Dispatch Supervisor",
            "Fleet Vehicle Maintenance & Transport In-charge",
            "Cargo Freight & Customs Clearing Technical Assistant",
            "Overseas / Gulf Petrochemical & Technical Plant Operator",
            "Heavy Equipment & Mobile Crane Operations Lead"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Supply Chain & Logistics Coordinator (விநியோகச் சங்கிலி ஒருங்கிணைப்பாளர்)",
            "Import-Export Documentation Executive (ஏற்றுமதி-இறக்குமதி ஆவண நிர்வாகி)",
            "Overseas Project Engineer (வெளிநாட்டு திட்டப் பொறியாளர்)",
            "Freight Forwarding Operations Manager (சரக்கு போக்குவரத்து மேலாளர்)"
          ],
          rolesEn: [
            "Supply Chain & Logistics Coordinator",
            "Import-Export Documentation Executive",
            "Overseas Project Engineer",
            "Freight Forwarding Operations Manager"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Multinational Corporation Expat Senior Executive (பன்னாட்டு நிறுவன வெளிநாட்டு பணி)",
            "Import-Export Merchant & Trading House Owner (ஏற்றுமதி-இறக்குமதி நிறுவன அதிபர்)",
            "Global Supply Chain & Freight Logistics Director (சர்வதேச விநியோகச் சங்கிலி இயக்குநர்)",
            "International Commercial Trade Head (சர்வதேச வர்த்தக தலைமை அதிகாரி)"
          ],
          rolesEn: [
            "Multinational Corporation Expat Senior Executive",
            "Import-Export Merchant & Trading House Owner",
            "Global Supply Chain & Freight Logistics Director",
            "International Commercial Trade Head"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Heavy Commercial Vehicle / Truck Driver (கனரக வாகன / லாரி ஓட்டுநர்)",
            "Warehouse Cargo Handler & Loading Assistant (கிடங்கு சுமை & சரக்கு உதவியாளர்)",
            "Local Courier & Goods Delivery Agent (உள்ளூர் சரக்கு விநியோக முகமை)"
          ],
          rolesEn: [
            "Heavy Commercial Vehicle / Truck Driver",
            "Warehouse Cargo Handler & Loading Assistant",
            "Local Courier & Goods Delivery Agent"
          ]
        },
        professional: {
          rolesTa: [
            "Global Conglomerate International Trade Director (சர்வதேச வர்த்தக பெருந்தலைவர்)",
            "Transnational Shipping Fleet Owner (சர்வதேச கப்பல் & சரக்கு போக்குவரத்து அதிபர்)"
          ],
          rolesEn: [
            "Global Conglomerate International Trade Director",
            "Transnational Shipping & Freight Conglomerate Owner"
          ]
        }
      }
    },
    {
      id: "manufacturing_industry",
      nameTa: "உற்பத்தி, தொழிற்சாலை & கனரக இயந்திரங்கள் (Manufacturing & Heavy Industry)",
      nameEn: "Manufacturing, Automobiles, Metallurgy & Heavy Industry",
      icon: "⚙️",
      primaryPlanets: ["Sa", "Ma", "Su"],
      favorableElements: ["Earth", "Fire"],
      favorableSigns: [9, 10, 7, 0], // Capricorn, Aquarius, Scorpio, Aries
      descriptionTa: "சனியின் தொழிலாளர் கட்டமைப்பு, செவ்வாயின் இயந்திர எந்திரவியல் மற்றும் சூரியனின் நிர்வாக தலைமை தொழிற்சாலை உற்பத்தி, ஆட்டோமொபைல், எஃகு மற்றும் மின் உற்பத்தி தொழில்களில் பெரும் அதிபராக்கும்.",
      descriptionEn: "Saturn's industrial discipline, Mars's energetic machinery drive, and Sun's managerial vigor cultivate powerhouse leaders in Manufacturing, Automotive, and Heavy Industry.",
      rolesTa: [
        "Industrial Plant Head / Factory Owner (தொழிற்சாலை தலைவர் மற்றும் ஆலை உரிமையாளர்)",
        "Automotive & Mechanical Operations Director (வாகன & இயந்திரவியல் செயல்பாட்டு இயக்குநர்)",
        "Metals, Steel & Fabrication Entrepreneur (எஃகு மற்றும் உலோக உற்பத்தி அதிபர்)",
        "Energy, Oil & Power Sector Engineer (எரிசக்தி, எண்ணெய் & மின் உற்பத்தி பொறியாளர்)",
        "Supply & Quality Operations Executive (உற்பத்தி தரம் மற்றும் விநியோக அதிகாரி)"
      ],
      rolesEn: [
        "Manufacturing Industrialist & Plant Managing Director",
        "Automotive & Robotics Operations Lead",
        "Steel, Metals & Fabrication Industrialist",
        "Oil, Gas & Renewable Energy Engineering Head",
        "Industrial Production & Quality Systems Executive"
      ],
      rolesByEdu: {
        diploma_iti: {
          rolesTa: [
            "Plant Maintenance Supervisor (தொழிற்சாலை பராமரிப்பு மேற்பார்வையாளர்)",
            "Production Shift In-charge (உற்பத்தி பிரிவு ஷிப்ட் இன்சார்ஜ்)",
            "CNC Machine Programmer & Tool Room Lead (சிஎன்சி இயந்திர நிரலாளர் & டூல் லீட்)",
            "Automobile Workshop Service Manager (வாகன பணிமனை சேவை மேலாளர்)",
            "Heavy Fabrication & Boiler Operation Supervisor (கனரக ஃபேப்ரிகேஷன் & பாய்லர் மேற்பார்வையாளர்)"
          ],
          rolesEn: [
            "Plant Maintenance & Machinery Supervisor",
            "Production Operations Shift In-charge",
            "CNC Machine Programmer & Tool Room Lead",
            "Automotive Workshop Service Manager",
            "Heavy Fabrication & Boiler Operation Supervisor"
          ]
        },
        degree_ug: {
          rolesTa: [
            "Manufacturing Operations Engineer (உற்பத்தி செயல்பாட்டு பொறியாளர்)",
            "Automotive Quality Assurance Lead (வாகன தர உத்தரவாத தலைமை)",
            "Plant Safety & Environmental Engineer (ஆலை பாதுகாப்பு & சுற்றுச்சூழல் பொறியாளர்)",
            "Industrial Procurement & Supply Chain Lead (தொழிலக கொள்முதல் மேலாளர்)"
          ],
          rolesEn: [
            "Manufacturing Operations Engineer",
            "Automotive Quality Assurance Lead",
            "Plant Safety & Environmental Engineer",
            "Industrial Procurement & Supply Chain Lead"
          ]
        },
        postgraduate_pg: {
          rolesTa: [
            "Factory Owner & Manufacturing Industrialist (தொழிற்சாலை அதிபர் & தொழிலதிபர்)",
            "Vice President of Operations & Supply Chain (துணைத் தலைவர் - ஆலை செயல்பாடுகள்)",
            "Automotive R&D & Advanced Engineering Director (வாகன ஆராய்ச்சி & மேம்பாட்டு இயக்குநர்)"
          ],
          rolesEn: [
            "Manufacturing Industrialist & Plant Managing Director",
            "Vice President of Operations & Supply Chain",
            "Automotive R&D & Advanced Engineering Director"
          ]
        },
        school_10_12: {
          rolesTa: [
            "Machine Operator & Turner / Fitter (இயந்திர ஆபரேட்டர் & பிட்டர்)",
            "Welding & Fabrication Specialist (வெல்டிங் & பட்டறை தொழிலாளி)",
            "Factory Assembly Line Lead & Storekeeper (அசெம்பிளி லைன் & ஸ்டோர் உதவியாளர்)",
            "Automotive Mechanic & Small Garage Owner (வாகன மெக்கானிக் பணிமனை உரிமையாளர்)"
          ],
          rolesEn: [
            "Machine Operator & Turner / Fitter",
            "Welding & Fabrication Specialist",
            "Factory Assembly Line Lead & Storekeeper",
            "Automotive Mechanic & Small Garage Owner"
          ]
        },
        professional: {
          rolesTa: [
            "Industrial Conglomerate Managing Director (பெருந்தொழில் குழும நிர்வாக இயக்குநர்)",
            "Chief Operating Officer (COO) - Heavy Industry (தலைமை செயல்பாட்டு அதிகாரி)"
          ],
          rolesEn: [
            "Industrial Conglomerate Managing Director",
            "Chief Operating Officer (COO) - Heavy Industry"
          ]
        }
      }
    }
  ];'''

if old_sectors_start not in content:
    print("Could not find old_sectors_start!")
    sys.exit(1)

# Find slice
idx_start = content.index(old_sectors_start)
idx_end = content.index(old_sectors_end) + len('    }\n  ];')

content = content[:idx_start] + new_sectors + content[idx_end:]

# 2. Update generateChartSpecificReasoning and prioritizeSectorRoles
old_func_start = '  function generateChartSpecificReasoning(sec, chartInfo, isTa) {'
new_funcs = '''  function generateChartSpecificReasoning(sec, chartInfo, isTa, eduLevel) {
    const {
      lagnaSign, house10Sign, lord10Code, lord10Obj, lord10Bhava,
      subathuvam10, amkCode, amkPlanet, occupants10, aspects10
    } = chartInfo;

    const lagnaName = isTa ? lagnaSign.ta : lagnaSign.en;
    const h10SignName = isTa ? house10Sign.ta : house10Sign.en;
    const lord10Name = isTa ? (PLANET_NAMES[lord10Code]?.ta || lord10Code) : (PLANET_NAMES[lord10Code]?.en || lord10Code);
    const lord10BhavaName = isTa ? (BHAVA_NAMES_TA[lord10Bhava] || `${lord10Bhava}-ம் பாவத்தில்`) : (BHAVA_NAMES_EN[lord10Bhava] || `House ${lord10Bhava}`);
    const lord10SignName = (lord10Obj && lord10Obj.signId !== undefined) ? (isTa ? SIGN_NAMES[lord10Obj.signId].ta : SIGN_NAMES[lord10Obj.signId].en) : "";
    const lord10Dignity = getDignityText(lord10Obj, isTa);
    const subGradeName = isTa ? subathuvam10.gradeTa : subathuvam10.gradeEn;
    const amkName = isTa ? (PLANET_NAMES[amkCode]?.ta || amkCode) : (PLANET_NAMES[amkCode]?.en || amkCode);
    const amkSignName = (amkPlanet && amkPlanet.signId !== undefined) ? (isTa ? SIGN_NAMES[amkPlanet.signId]?.ta : SIGN_NAMES[amkPlanet.signId]?.en) : "";

    const occNames = occupants10.map(c => isTa ? (PLANET_NAMES[c]?.ta || c) : (PLANET_NAMES[c]?.en || c));
    const aspNames = aspects10.map(a => isTa ? (PLANET_NAMES[a.code]?.ta || a.code) : (PLANET_NAMES[a.code]?.en || a.code));

    const isDiploma = (eduLevel === "diploma_iti");
    const isDegree = (eduLevel === "degree_ug");
    const isSchool = (eduLevel === "school_10_12");

    if (isTa) {
      let eduHeader = "";
      if (isDiploma) {
        eduHeader = " [ஜாதகரின் கல்வித் தகுதி: டிப்ளமோ / ITI / தொழிற்கல்வி]";
      } else if (isDegree) {
        eduHeader = " [ஜாதகரின் கல்வித் தகுதி: பட்டப்படிப்பு (UG Degree)]";
      } else if (isSchool) {
        eduHeader = " [ஜாதகரின் கல்வித் தகுதி: பள்ளி கல்வி / நேரடி களப்பணி]";
      }

      let sentence1 = `உங்கள் ${lagnaName} லக்னத்திற்கு 10-ஆம் வீடான கர்ம ஸ்தானம் ${h10SignName} ராசியாகும். அதன் அதிபதி ${lord10Name} லக்னத்திற்கு ${lord10BhavaName} (${lord10SignName}-ல்) ${lord10Dignity} அமைந்துள்ளார்.${eduHeader}`;
      
      let sentence2 = "";
      if (occNames.length > 0) {
        sentence2 += ` 10-ஆம் பாவத்தில் ${occNames.join(", ")} அமர்ந்து இந்நபரின் ஜீவன பலத்தை நேரடியாக வழிநடத்துகிறது.`;
      }
      if (aspNames.length > 0) {
        sentence2 += ` மேலும் 10-ஆம் வீட்டை ${aspNames.join(", ")} சுபப் பார்வையால் நோக்குவது இத்துறைக்கு கூடுதல் அந்தஸ்தை அளிக்கிறது.`;
      }

      let sectorSpecific = "";
      switch (sec.id) {
        case "it_software":
          if (isDiploma) {
            sectorSpecific = `புதன் மற்றும் ராகுவின் தொழில்நுட்ப காரக பலம் டிப்ளமோ தொழிற்கல்விக்கு ஏற்ப, வன்பொருள் & நெட்வொர்க் சர்வீஸ் இன்ஜினியரிங் (Hardware & Networking), சிஸ்டம் சப்போர்ட், சிசிடிவி/ஆட்டோமேஷன் மற்றும் தொலைத்தொடர்பு டவர் ஆபரேஷன் துறைகளில் சிறந்த வருமானத்தையும் நிரந்தரத்தையும் தரும்.`;
          } else {
            sectorSpecific = `10-ஆம் அதிபதி ${subGradeName} அமைப்பில் நவீன தகவல் தொழில்நுட்ப காரகத்தோடு இணைவதால், மென்பொருள் வடிவமைப்பு (Software Architecture), கிளவுட் என்ஜினியரிங், AI & அல்காரிதம் மற்றும் சைபர் பாதுகாப்பு துறைகளில் தனித்துவ சாதனையும் உயர் வருமானமும் கிட்டும்.`;
          }
          break;
        case "govt_admin":
          if (isDiploma) {
            sectorSpecific = `10-ஆம் அதிபதியின் சுபத்துவ பலமும் 6-ஆம் பாவ வலிமையும் டிப்ளமோ கல்வித் தகுதிக்கு மிகச் சிறந்த அரசு தொழில்நுட்ப வேலை ராஜயோகத்தை நல்குகின்றன. குறிப்பாக இந்திய ரயில்வே இளநிலைப் பொறியாளர் (Railway Junior Engineer - RRB JE), ரயில்வே பிரிவு மேற்பார்வையாளர் (Section Supervisor / Senior Technician), மின்சார வாரிய (TNEB) அல்லது பொதுப்பணித்துறை (PWD) Junior Engineer போன்ற கௌரவமான அரசு தொழில்நுட்ப பதவிகள் மிகச் சரியாகப் பொருந்தும்.`;
          } else {
            sectorSpecific = `10-ஆம் அதிபதி ${subGradeName} பெற்று அரசு மற்றும் அதிகார காரக கிரகங்களோடு இணைவதால், மத்திய/மாநில அரசுத் தேர்வுகள் (TNPSC/UPSC), பொதுத்துறை நிறுவனங்கள் (PSU), இந்திய ரயில்வே மற்றும் உயர் சிவில் சர்வீசஸ் நிர்வாகப் பொறுப்புகளில் கொடிகட்டிப் பறக்கும் ராஜயோகம் அமைந்துள்ளது.`;
          }
          break;
        case "finance_banking":
          if (isDiploma) {
            sectorSpecific = `புதன் மற்றும் குருவின் தன காரக பலம் இளநிலை கணக்காளர் (Junior Accounts), கூட்டுறவு வங்கி எழுத்தர்/காசாளர், கமர்ஷியல் பில்லிங் & ஸ்டோர் இன்சார்ஜ் மற்றும் ஜிஎஸ்டி ஆவண தாக்கல் பணிகளில் நிலையான வருமானத்தை அளிக்கும்.`;
          } else {
            sectorSpecific = `10-ஆம் அதிபதியும் தன ஸ்தானமும் புதன், குரு, சுக்கிரனின் தன காரக பலத்தோடு பொருந்துவதால், வங்கி மேலாண்மை, பட்டயக் கணக்காளர் (CA), பங்கு வர்த்தகம், முதலீட்டு ஆலோசனை மற்றும் கார்ப்பரேட் நிதி மேலாண்மையில் பெரும் தனலாபம் கிட்டும்.`;
          }
          break;
        case "engineering_realestate":
          if (isDiploma) {
            sectorSpecific = `செவ்வாய் மற்றும் சனியின் எந்திரவியல் & பூமி காரக பலம் டிப்ளமோ (DCE / DME / DEEE) தகுதிக்கு உன்னதமான சைட் இன்ஜினியர் (Site Engineer), கள மேற்பார்வையாளர், சிஏடி வரைவாளர் (CAD Draftsman), தரக்கட்டுப்பாடு (QC) மற்றும் தொழில்நுட்ப ஒப்பந்தப் பணிகளில் பெரும் வெற்றியை நல்கும்.`;
          } else {
            sectorSpecific = `செவ்வாய் மற்றும் சனியின் பூமி, உள்கட்டமைப்பு மற்றும் எந்திரவியல் காரக பலம் 10-ஆம் பாவத்தோடு வலிமையாக இணைவதால், சிவில் என்ஜினியரிங், ரியல் எஸ்டேட் கட்டுமானம், நில முதலீடு மற்றும் இயந்திரவியல் திட்டங்களில் அசுர வளர்ச்சி அடைவீர்கள்.`;
          }
          break;
        case "medicine_healthcare":
          if (isDiploma) {
            sectorSpecific = `கேது மற்றும் சூரியனின் மருத்துவ காரகம் டிப்ளமோ ஆய்வக தொழில்நுட்ப வல்லுநர் (DMLT), டிப்ளமோ மருந்தாளுநர் (D.Pharm), மருத்துவ உபகரண பராமரிப்பாளர் மற்றும் எக்ஸ்-ரே / இசிஜி தொழில்நுட்ப பணிகளில் கௌரவமான இடத்தை அளிக்கும்.`;
          } else {
            sectorSpecific = `சூரியன், செவ்வாய் மற்றும் கேதுவின் மருத்துவ/அறுவை சிகிச்சை காரக பலம் 10-ஆம் பாவத்தோடு சுபத்துவ தொடர்பு கொள்வதால், சிறப்பு மருத்துவர் (Surgeon), மருத்துவமனை நிர்வாகம், மருந்து தயாரிப்பு மற்றும் சித்த/ஆயுர்வேத மருத்துவத்தில் சர்வதேச புகழ் பெறும் யோகம் உண்டு.`;
          }
          break;
        case "law_judiciary":
          if (isDiploma) {
            sectorSpecific = `காவல்துறை வயர்லெஸ்/தொழில்நுட்ப பிரிவு, சார்பதிவாளர் அலுவலக பத்திர எழுத்தர், நீதிமன்ற தொழில்நுட்ப உதவியாளர் மற்றும் தொழிலக பாதுகாப்பு & தீயணைப்பு பணிகளில் மிகச் சிறந்த நிலை அமையும்.`;
          } else {
            sectorSpecific = `குருவின் தர்ம நெறியும் சனியின் சட்ட நேர்மையும் 10-ஆம் பாவத்திற்கு உறுதுணையாக இருப்பதால், உயர்நீதிமன்ற வழக்கறிஞர், நடுவர், நீதிபதி மற்றும் கார்ப்பரேட் சட்ட ஆலோசகர் நிலைக்கு உயர்த்தும் யோகமாகும்.`;
          }
          break;
        case "creative_arts_media":
          if (isDiploma) {
            sectorSpecific = `டிடிபி & கிராபிக் டிசைனிங் (DTP), வீடியோ & ஆடியோ எடிட்டிங், ஆப்-செட் பிரிண்டிங் பிரஸ் உற்பத்தி மேற்பார்வை மற்றும் 3D வரைவாளர் பணிகளில் கைதேர்ந்த நிபுணராக மிளிரலாம்.`;
          } else {
            sectorSpecific = `சுக்கிரனின் அழகியல் கவர்ச்சியும் சந்திரனின் கற்பனை வளமும் 10-ஆம் இடத்தோடு இணைவதால், திரைப்படம், ஊடகம், விளம்பரம், ஆர்க்கிடெக்சர் மற்றும் டிஜிட்டல் கிரியேட்டிவ் துறைகளில் மக்கள் செல்வாக்கும் புகழும் சேரும்.`;
          }
          break;
        case "education_research":
          if (isDiploma) {
            sectorSpecific = `குரு மற்றும் புதனின் வித்யா காரகம் தொழிற்கல்வி பின்னணியோடு இணைவதால், பாலிடெக்னிக் / ஐடிஐ பட்டறை பயிற்றுநர் (Polytechnic / ITI Workshop Instructor), தொழிற்கல்வி ஆய்வக செய்முறை உதவியாளர் மற்றும் தொழில்நுட்ப திறன் பயிற்சி மையங்களில் கௌரவமான இடத்தை அளிக்கும்.`;
          } else {
            sectorSpecific = `குரு பகவானின் போதனா பலமும் புதனின் கல்விப் புலமையும் 10-ஆம் அதிபதியின் சுபத்துவத்தோடு இணைவதால், பல்கலைக்கழக பேராசிரியர், கல்வி நிறுவன நிறுவனர், தலைமை ஆலோசகர் மற்றும் அறிவியல் ஆய்வாளராக மிளிரும் வாய்ப்புள்ளது.`;
          }
          break;
        case "trade_foreign":
          if (isDiploma) {
            sectorSpecific = `லாஜிஸ்டிக்ஸ் கிடங்கு மேற்பார்வையாளர் (Warehouse Supervisor), வாகன பராமரிப்பு, வெளிநாட்டு ஆலை தொழில்நுட்ப பணி (Gulf Technical Operations) மற்றும் கனரக இயந்திரங்கள் இயக்குதலில் பெரும் வருமானம் உண்டு.`;
          } else {
            sectorSpecific = `ராகு மற்றும் சந்திரனின் வெளிநாட்டு மற்றும் எல்லைகடந்த வர்த்தக காரகம் 10-ஆம் பாவத்தோடு வலுப்பெறுவதால், பன்னாட்டு நிறுவனம் (MNC), ஏற்றுமதி-இறக்குமதி, ஏவியேஷன் மற்றும் வெளிநாட்டு குடியேற்ற யோகம் அதிர்ஷ்டகரமாக அமையும்.`;
          }
          break;
        case "manufacturing_industry":
          if (isDiploma) {
            sectorSpecific = `சனியின் தொழிலக ஒழுங்கும் செவ்வாயின் இயந்திர எந்திரவியல் பலமும் தொழிற்சாலை பராமரிப்பு மேற்பார்வையாளர் (Plant Maintenance Supervisor), உற்பத்தி பிரிவு ஷிப்ட் இன்சார்ஜ், சிஎன்சி டூல் லீட் போன்ற முன்னணி பொறுப்புகளில் உயர்த்துவதோடு நிரந்தர உயர் வருமானத்தை உறுதி செய்கிறது.`;
          } else {
            sectorSpecific = `சனியின் தொழிலாளர் அமைப்பும் செவ்வாயின் இயந்திர எந்திரவியல் ஆற்றலும் 10-ஆம் அதிபதியோடு இணைவதால், உற்பத்தி தொழிற்சாலைகள், ஆட்டோமொபைல், எஃகு மற்றும் மின் உற்பத்தி நிறுவன அதிபராக உயர்வீர்கள்.`;
          }
          break;
        default:
          sectorSpecific = `10-ஆம் அதிபதியின் தனித்துவ கிரக வலிமை இத்துறையில் நிலையான கௌரவத்தையும் தொழில் வெற்றியையும் நல்கும்.`;
      }

      let sentence4 = ` தொழில் காரகனான அமத்யகாரகன் ${amkName} (${amkSignName}-ல்) இந்நபருக்கு இத்துறையில் நிலையான கௌரவத்தையும் சமூக அங்கீகாரத்தையும் உறுதியாக நல்குவார்.`;

      return `${sentence1}${sentence2} ${sectorSpecific}${sentence4}`;
    } else {
      let eduHeaderEn = isDiploma ? " [Tailored for: Diploma / ITI / Technical Qualification]" : (isDegree ? " [Tailored for: Bachelor's Degree (UG)]" : "");
      let s1 = `For your ${lagnaName} Ascendant, the 10th house (Karma Bhava) falls in ${h10SignName}. Its ruler ${lord10Name} is situated in the ${lord10BhavaName} (${lord10SignName}) in ${lord10Dignity}.${eduHeaderEn}`;
      let s2 = "";
      if (occNames.length > 0) s2 += ` 10th house is directly energized by the presence of ${occNames.join(", ")}.`;
      if (aspNames.length > 0) s2 += ` Furthermore, benefic aspects from ${aspNames.join(", ")} lend high prestige to this vocational sphere.`;
      let s3 = "";
      if (isDiploma && sec.id === "govt_admin") {
        s3 = ` The 10th house dignity and 6th house stability strongly align with prestigious public sector technical posts, particularly Indian Railways Junior Engineer (RRB JE), Railway Section / Technical Supervisor, or State Electricity (TNEB) / PWD Junior Engineer.`;
      } else if (isDiploma && (sec.id === "engineering_realestate" || sec.id === "manufacturing_industry")) {
        s3 = ` Mars and Saturn's mechanical engineering vibrations empower a Diploma holder to command high success in Site Construction Supervision, Plant Maintenance Operations, and Quality Control Inspection.`;
      } else {
        s3 = ` Endowed with ${subGradeName}, this planetary configuration strongly aligns with distinction, executive authority, and sustained financial growth in ${sec.nameEn}.`;
      }
      let s4 = ` Amatyakaraka ${amkName} (in ${amkSignName}) firmly establishes your vocational mastery and enduring reputation here.`;
      return `${s1}${s2} ${s3}${s4}`;
    }
  }

  function prioritizeSectorRoles(sec, chartInfo, isTa, eduLevel = "diploma_iti") {
    let roles = [];
    if (sec.rolesByEdu && sec.rolesByEdu[eduLevel]) {
      roles = isTa ? sec.rolesByEdu[eduLevel].rolesTa : sec.rolesByEdu[eduLevel].rolesEn;
    } else {
      roles = isTa ? sec.rolesTa : sec.rolesEn;
    }
    const { planets } = chartInfo;

    return roles.map((roleTitle, idx) => {
      let isBestMatch = false;
      if (idx === 0) isBestMatch = true;
      else if (idx === 1 && (planets["Su"]?.isExalted || planets["Ma"]?.isExalted || planets["Me"]?.isExalted || planets["Sa"]?.isOwnSign || planets["Ju"]?.isExalted)) {
        isBestMatch = true;
      }
      // For diploma native in Railway/Govt, ensure JE and Section Supervisor stand out
      if (eduLevel === "diploma_iti" && sec.id === "govt_admin" && (idx === 0 || idx === 1)) {
        isBestMatch = true;
      }
      return {
        title: roleTitle,
        isBestMatch
      };
    });
  }'''

# Replace from '  function generateChartSpecificReasoning(sec, chartInfo, isTa) {' to '  function calculateDynamicCareerTiming'
idx_funcs_start = content.index(old_func_start)
idx_funcs_end = content.index('  function calculateDynamicCareerTiming')

content = content[:idx_funcs_start] + new_funcs + '\n\n' + content[idx_funcs_end:]

# 3. Update calculateCareerProfile to accept and use educationLevel
old_top_sectors = '''    const topSectors = sectorScores.slice(0, 3).map(sec => {
      const customExplanationTa = generateChartSpecificReasoning(sec, chartContext, true);
      const customExplanationEn = generateChartSpecificReasoning(sec, chartContext, false);
      const customRolesTa = prioritizeSectorRoles(sec, chartContext, true);
      const customRolesEn = prioritizeSectorRoles(sec, chartContext, false);'''

new_top_sectors = '''    // Extract Education Level (User specified or 4th house Vidya Sthana calibrated)
    const validEduLevels = ["diploma_iti", "degree_ug", "postgraduate_pg", "school_10_12", "professional"];
    let eduLevel = (options && (options.educationLevel || options.education)) || (profile && profile.educationLevel) || "diploma_iti";
    if (eduLevel === "auto" || !validEduLevels.includes(eduLevel)) {
      const house4SignId = (lagnaSignId + 3) % 12;
      const occ4 = [];
      Object.entries(planets).forEach(([c, p]) => {
        if (c !== "Asc" && p && p.signId === house4SignId) occ4.push(c);
      });
      if (occ4.includes("Ke") || occ4.includes("Ma") || occ4.includes("Ra") || occ4.includes("Sa")) {
        eduLevel = "diploma_iti";
      } else if (occ4.includes("Ju") || occ4.includes("Su") || subathuvam10.gradeKey === "grade_1") {
        eduLevel = "degree_ug";
      } else {
        eduLevel = "diploma_iti";
      }
    }
    const currentEduMeta = EDU_LABELS[eduLevel] || EDU_LABELS.diploma_iti;

    const topSectors = sectorScores.slice(0, 3).map(sec => {
      const customExplanationTa = generateChartSpecificReasoning(sec, chartContext, true, eduLevel);
      const customExplanationEn = generateChartSpecificReasoning(sec, chartContext, false, eduLevel);
      const customRolesTa = prioritizeSectorRoles(sec, chartContext, true, eduLevel);
      const customRolesEn = prioritizeSectorRoles(sec, chartContext, false, eduLevel);'''

if old_top_sectors not in content:
    print("Could not find old_top_sectors!")
    sys.exit(1)

content = content.replace(old_top_sectors, new_top_sectors)

# 4. Include educationLevel info in the returned object
old_return = '''      yogas: detectedYogas,'''
new_return = '''      educationLevel: eduLevel,
      educationLabelTa: currentEduMeta.ta,
      educationLabelEn: currentEduMeta.en,
      educationBadgeTa: currentEduMeta.badgeTa,
      educationBadgeEn: currentEduMeta.badgeEn,
      yogas: detectedYogas,'''

if old_return not in content:
    print("Could not find old_return!")
    sys.exit(1)

content = content.replace(old_return, new_return)

with open(js_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Successfully updated js/career-engine.js!")
