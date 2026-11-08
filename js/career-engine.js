/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - CAREER, JOB VS BUSINESS & TIMING ENGINE
 * Comprehensive Vedic Astrological Analysis for:
 * 1. What Job / Profession He Will Get (எந்த வேலை / துறை அமையும்?)
 * 2. Job vs Business Determination (உத்தியோகமா? அல்லது சொந்தத் தொழிலா?)
 * 3. Career Timing & Auspicious Milestones (எந்த காலகட்டம்? எப்போது நடக்கும்?)
 * 4. Current Dasha-Bhukti Career Impact & Next Favorable Window
 * 5. Career Yogas, Lucky Days, Directions, Deities & Remedies
 */

const CareerEngine = (function () {
  "use strict";

  const SIGN_NAMES = [
    { id: 0, ta: "மேஷம்", en: "Aries", lord: "Ma", element: "Fire", quality: "Movable" },
    { id: 1, ta: "ரிஷபம்", en: "Taurus", lord: "Ve", element: "Earth", quality: "Fixed" },
    { id: 2, ta: "மிதுனம்", en: "Gemini", lord: "Me", element: "Air", quality: "Dual" },
    { id: 3, ta: "கடகம்", en: "Cancer", lord: "Mo", element: "Water", quality: "Movable" },
    { id: 4, ta: "சிம்மம்", en: "Leo", lord: "Su", element: "Fire", quality: "Fixed" },
    { id: 5, ta: "கன்னி", en: "Virgo", lord: "Me", element: "Earth", quality: "Dual" },
    { id: 6, ta: "துலாம்", en: "Libra", lord: "Ve", element: "Air", quality: "Movable" },
    { id: 7, ta: "விருச்சிகம்", en: "Scorpio", lord: "Ma", element: "Water", quality: "Fixed" },
    { id: 8, ta: "தனுசு", en: "Sagittarius", lord: "Ju", element: "Fire", quality: "Dual" },
    { id: 9, ta: "மகரம்", en: "Capricorn", lord: "Sa", element: "Earth", quality: "Movable" },
    { id: 10, ta: "கும்பம்", en: "Aquarius", lord: "Sa", element: "Air", quality: "Fixed" },
    { id: 11, ta: "மீனம்", en: "Pisces", lord: "Ju", element: "Water", quality: "Dual" }
  ];

  const PLANET_NAMES = {
    Su: { ta: "சூரியன்", en: "Sun", symbol: "☀️", color: "#F59E0B" },
    Mo: { ta: "சந்திரன்", en: "Moon", symbol: "🌙", color: "#93C5FD" },
    Ma: { ta: "செவ்வாய்", en: "Mars", symbol: "♂️", color: "#EF4444" },
    Me: { ta: "புதன்", en: "Mercury", symbol: "☿️", color: "#10B981" },
    Ju: { ta: "குரு", en: "Jupiter", symbol: "♃", color: "#FBBF24" },
    Ve: { ta: "சுக்கிரன்", en: "Venus", symbol: "♀️", color: "#EC4899" },
    Sa: { ta: "சனி", en: "Saturn", symbol: "🪐", color: "#818CF8" },
    Ra: { ta: "ராகு", en: "Rahu", symbol: "☊", color: "#94A3B8" },
    Ke: { ta: "கேது", en: "Ketu", symbol: "☋", color: "#F43F5E" }
  };

  // Subathuva & Paavathuva Field Signatures for all 9 planets
  const PLANET_FIELD_SIGNATURES = {
    Su: {
      planetTa: "சூரியன்",
      subathuvamTa: "அரசு உயர் நிர்வாகம் (IAS/IPS), அரசு கெஜட்டட் அதிகாரி, மருத்துவம், அரசியல் தலைமை, தங்கம், சோலார் மின்சாரம், தலைமை இயக்குநர்.",
      subathuvamEn: "Civil Services, Central Administration, Medicine/Surgeon, Political Leadership, Gold Commerce, Solar Energy, Managing Director.",
      paavathuvamTa: "விறகு, தீ / உலைக்களப் பணி, பாதுகாப்பு காவலர் (Security), கீழ்நிலை அரசு ஊழியர், செங்கல் சூளை மேற்பார்வை.",
      paavathuvamEn: "Timber trade, furnace works, security personnel, lower-echelon government staff."
    },
    Mo: {
      planetTa: "சந்திரன்",
      subathuvamTa: "பால் பண்ணை, குடிநீர் சுத்திகரிப்பு, கப்பல் & கடல்சார் துறை (Marine), உணவு & நட்சத்திர விடுதிகள் (Hotels), வெளிநாட்டு வாணிபம், மனநல மருத்துவம், செவிலியர் பணி.",
      subathuvamEn: "Dairy, Water purification, Maritime/Naval, Luxury Hospitality/Restaurants, Overseas Trade, Psychology, Nursing.",
      paavathuvamTa: "மதுபானம், மீன் வியாபாரம், இரவு நேர ஓட்டுநர், குளிர்சாதன கிடங்கு, நீர் பாசனம், கூலி உழைப்பு.",
      paavathuvamEn: "Liquor, fisheries, night transport, cold storage, manual fluid transport."
    },
    Ma: {
      planetTa: "செவ்வாய்",
      subathuvamTa: "சிவில் / மெக்கானிக்கல் என்ஜினியரிங், அறுவை சிகிச்சை மருத்துவர் (Surgeon), காவல் & ராணுவ உயர் அதிகாரி, ரியல் எஸ்டேட் & உள்கட்டமைப்பு, தீயணைப்பு & பாதுகாப்பு மேலாண்மை.",
      subathuvamEn: "Civil/Mechanical Engineering, Surgery, Police/Defense Leadership, Real Estate Development, Fire & Safety Management.",
      paavathuvamTa: "வெல்டிங், லேத் பட்டறை, கசாப்புக் கடை, இரும்பு வெட்டுதல், மெக்கானிக், கொத்தனார், சமையல் தீ வேலை.",
      paavathuvamEn: "Welding, lathe fabrication, butchery, metal cutting, automotive mechanics, masonry."
    },
    Me: {
      planetTa: "புதன்",
      subathuvamTa: "தகவல் தொழில்நுட்பம் (IT/Software), பட்டயக் கணக்காளர் (CA/Auditing), வங்கி, ஜோதிடம், பத்திரிகைத் துறை, கல்லூரி விரிவுரையாளர், வர்த்தக புரோக்கரேஜ் & கமிஷன் ஏஜென்சி.",
      subathuvamEn: "IT & Software Engineering, Chartered Accountancy, Banking, Astrology, Journalism, Academic Professorship, Commercial Brokerage.",
      paavathuvamTa: "அச்சுக்கூட கூலி ஆள் (Printing press), கொரியர் & தபால் விநியோகம், போலி ஆவணங்கள், கீழ்நிலை எழுதுவினைஞர்.",
      paavathuvamEn: "Printing press labor, courier dispatch, stationery clerical, petty brokerage."
    },
    Ju: {
      planetTa: "குரு",
      subathuvamTa: "நீதிபதி, வழக்கறிஞர், நிதி ஆலோசகர், வங்கி மேலாளர், பேராசிரியர், கோவில் அறங்காவலர், வேத/ஆன்மீக வழிகாட்டுதல், நிதி மேலாண்மை நிறுவனம்.",
      subathuvamEn: "Judiciary/Judge, Legal Counsel, Financial Advisory, Banking Management, University Dean, Temple Trust, Vedic Consulting.",
      paavathuvamTa: "அதிக வட்டி நிதித் தொழில் (High interest lending), எளிய டியூஷன், கடன் வசூல் முகமை.",
      paavathuvamEn: "High-interest money lending, basic tuition, debt collection agency."
    },
    Ve: {
      planetTa: "சுக்கிரன்",
      subathuvamTa: "சினிமா & கலைத்துறை, ஆட்டோமொபைல் (வாகனங்கள்), ஃபேஷன் டிசைனிங், அழகு நிலையம் (Beauty), ஜவுளி ஏற்றுமதி, ஆடம்பர பொருட்கள், சொகுசு விடுதிகள்.",
      subathuvamEn: "Cinema & Entertainment, Automobile Designing, Fashion, Luxury Hospitality, Textile Exports, Cosmetics, High-end Retail.",
      paavathuvamTa: "தையல் கடை, மதுபான பார் சர்வர், சாதாரண கார் டிரைவர், ஆபாச/கிளாமர் சார்ந்த துறை, அழகு சாதன தெருவோர விற்பனை.",
      paavathuvamEn: "Tailoring, bar tender/server, commercial driver, low-end cosmetics street sales."
    },
    Sa: {
      planetTa: "சனி",
      subathuvamTa: "ரயில்வே துறை, பெரிய தொழிற்சாலைகள், ஆயில் & எரிவாயு சுத்திகரிப்பு (Oil & Gas), இரும்பு & எஃகு ஆலை, பொதுஜன அமைப்பு, மனிதவள மேலாண்மை (HR), நீதி பரிபாலனம்.",
      subathuvamEn: "Indian Railways, Heavy Manufacturing, Oil & Gas Refineries, Steel Plants, Mass Transport, Human Resources, Labor Union Leadership.",
      paavathuvamTa: "துப்புரவுப் பணி, பழைய இரும்பு/ஸ்கிராப் வியாபாரம், சுமை தூக்குதல், காலணி தயாரிப்பு, கட்டிடக் கூலி வேலை.",
      paavathuvamEn: "Sanitation, scrap metal dealing, manual loading, footwear/leather, heavy construction labor."
    },
    Ra: {
      planetTa: "ராகு",
      subathuvamTa: "செயற்கை நுண்ணறிவு (AI), ஏவியேஷன் (விமானம்), மருந்து தயாரிப்பு (Pharma), எலக்ட்ரானிக்ஸ் & சிப் டிசைனிங், பன்னாட்டு நிறுவனம் (MNC), சினிமா இயக்கம், விண்வெளி ஆராய்ச்சி.",
      subathuvamEn: "Artificial Intelligence, Aviation/Aeronautics, Pharmaceuticals, Electronics & Chip Design, Multinational Corporates, Film Direction.",
      paavathuvamTa: "கடத்தல், கள்ளச்சாராயம், நச்சு இரசாயனம், சிறைக்காவலர், சூதாட்டம், டார்க் வெப் ஹேக்கிங்.",
      paavathuvamEn: "Smuggling, illicit trade, toxic waste processing, prison guarding, gambling."
    },
    Ke: {
      planetTa: "கேது",
      subathuvamTa: "சித்த & ஆயுர்வேத மருத்துவம், மைக்ரோ கோடிங் / அல்காரிதம், உயிரியல் & நோயியல் ஆராய்ச்சி (Pathology), ஆன்மீக ஞானம், யோகா கலை.",
      subathuvamEn: "Siddha & Ayurvedic Medicine, Micro-Algorithm Coding, Pathology/Bio-Research, Spiritual Leadership, Occult Science.",
      paavathuvamTa: "தையல் நூல் விநியோகம், மின் வயர் பழுது, துறவற வாழ்க்கை, சிறிய கூலித் தொழில்.",
      paavathuvamEn: "Thread spinning, wire/electrical repair, ascetic life, petty solitary work."
    }
  };

  /**
   * Evaluates Subathuvam, Paavathuvam & Sookshma Strength of a Planet
   */
  function evaluatePlanetSubathuvam(pCode, planets, lagnaSignId) {
    const p = planets[pCode];
    if (!p || p.signId === undefined) {
      return {
        gradeKey: "grade_2",
        gradeTa: "நடுத்தர சுபத்துவம் (Moderate Beneficence)",
        gradeEn: "Moderate Beneficence",
        subathuvaPoints: 50,
        paavathuvaPoints: 0,
        sookshmaPoints: 0,
        natureTa: "சமச்சீரான பலன்கள் தரும் நிலை.",
        natureEn: "Balanced professional results."
      };
    }

    const targetSign = p.signId;
    let subPts = 0;
    let paavaPts = 0;
    let sookshmaPts = 0;

    // 1. Guru's Aspect/Conjunction (முதல் நிலை சுபத்துவம்)
    const ju = planets["Ju"];
    if (ju && ju.signId !== undefined) {
      const diffJu = (targetSign - ju.signId + 12) % 12;
      if ([0, 4, 6, 8].includes(diffJu)) { // Conjunction, 5th, 7th, 9th aspect
        subPts += 36;
      }
    }

    // 2. Venus Aspect/Conjunction (இரண்டாம் நிலை சுபத்துவம்)
    const ve = planets["Ve"];
    if (ve && ve.signId !== undefined && pCode !== "Ve") {
      const diffVe = (targetSign - ve.signId + 12) % 12;
      if ([0, 6].includes(diffVe)) {
        subPts += 20;
      }
    }

    // 3. Mercury Aspect/Conjunction
    const me = planets["Me"];
    if (me && me.signId !== undefined && pCode !== "Me") {
      const diffMe = (targetSign - me.signId + 12) % 12;
      if ([0, 6].includes(diffMe)) {
        subPts += 12;
      }
    }

    // 4. Moon Aspect/Conjunction
    const mo = planets["Mo"];
    if (mo && mo.signId !== undefined && pCode !== "Mo") {
      const diffMo = (targetSign - mo.signId + 12) % 12;
      if ([0, 6].includes(diffMo)) {
        subPts += 14;
      }
    }

    // 5. Saturn Aspect/Conjunction (பாவத்துவம்)
    const sa = planets["Sa"];
    if (sa && sa.signId !== undefined && pCode !== "Sa") {
      const diffSa = (targetSign - sa.signId + 12) % 12;
      if ([0, 2, 6, 9].includes(diffSa)) {
        paavaPts += 22;
      }
    }

    // 6. Mars Aspect/Conjunction (பாவத்துவம்)
    const ma = planets["Ma"];
    if (ma && ma.signId !== undefined && pCode !== "Ma") {
      const diffMa = (targetSign - ma.signId + 12) % 12;
      if ([0, 3, 6, 7].includes(diffMa)) {
        paavaPts += 22;
      }
    }

    // 7. Rahu / Ketu Conjunction
    const ra = planets["Ra"];
    const ke = planets["Ke"];
    if ((ra && ra.signId === targetSign) || (ke && ke.signId === targetSign)) {
      paavaPts += 18;
    }

    // 8. Sookshma Strength
    if (p.isRetrograde) sookshmaPts += 16;
    if (p.isExalted) sookshmaPts += 18;
    if (p.isOwnSign) sookshmaPts += 14;

    let gradeKey = "grade_2";
    let gradeTa = "";
    let gradeEn = "";
    let natureTa = "";
    let natureEn = "";

    if (subPts >= 35) {
      gradeKey = "grade_1";
      gradeTa = "முதல் நிலை சுபத்துவம் (1st Grade Subathuvam - Guru Blessed)";
      gradeEn = "1st Grade Subathuvam (Supreme Beneficence)";
      natureTa = "கௌரவமான அரசுப் பணி, உயர் நிர்வாகம், வெள்ளை காலர் உத்தியோகம் (White-collar), ஆலோசனை, வங்கி அல்லது நேர்மையான பெருந்தொழில் யோகம்.";
      natureEn = "Prestigious civil/corporate administration, white-collar advisory, high-level banking, or high-tier enterprise.";
    } else if (subPts >= 18) {
      gradeKey = "grade_2";
      gradeTa = "இரண்டாம் நிலை சுபத்துவம் (2nd Grade Subathuvam - Venus/Mercury Blessed)";
      gradeEn = "2nd Grade Subathuvam (Commercial/Creative Beneficence)";
      natureTa = "மென்பொருள் (IT), கலை, வடிவமைப்பு, ஆட்டோமொபைல், ஜவுளி, வர்த்தக ஏஜென்சி அல்லது நடுத்தர வணிக யோகம்.";
      natureEn = "IT, Software, Arts, Design, Automobile, Commerce, or thriving mid-scale business.";
    } else if (sookshmaPts >= 14 || (paavaPts > subPts && sookshmaPts >= 10)) {
      gradeKey = "paavathuvam_sookshma";
      gradeTa = "பாவத்துவம் & சூட்சும வலு (Paavathuvam with Sookshma Strength)";
      gradeEn = "Paavathuvam with Sookshma Strength";
      natureTa = "பொறியியல், கட்டிடம் & ரியல் எஸ்டேட், எந்திரங்கள், இரும்பு, ஆயில், ஒப்பந்தப் பணிகள் (Contracting/Tenders) அல்லது கடின உழைப்பு சார்ந்த தொழில் யோகம்.";
      natureEn = "Engineering, Real Estate, Machinery, Infrastructure, Civil contracts, or heavy manufacturing enterprise.";
    } else {
      gradeKey = "paavathuvam_afflicted";
      gradeTa = "கடுமையான பாவத்துவம் (Afflicted / High Friction)";
      gradeEn = "Afflicted Paavathuvam (High Risk)";
      natureTa = "தொழில் ரிஸ்க் எடுக்கக் கூடாது; கடன் மற்றும் விரயம் வர வாய்ப்புள்ளதால், மாத சம்பள நிறுவன வேலையில் (Job) இருப்பதே 100% பாதுகாப்பானது.";
      natureEn = "Avoid capital-intensive business; regular salaried employment is strongly advised to prevent debt and loss.";
    }

    return {
      gradeKey,
      gradeTa,
      gradeEn,
      subathuvaPoints: subPts,
      paavathuvaPoints: paavaPts,
      sookshmaPoints: sookshmaPts,
      natureTa,
      natureEn
    };
  }

  // Educational Qualification Categories & Labels
  const EDU_LABELS = {
    diploma_ece: {
      ta: "டிப்ளமோ ECE (Electronics & Communication Engineering)",
      en: "Diploma in ECE (Electronics & Communication Engineering)",
      badgeTa: "⚡ டிப்ளமோ ECE",
      badgeEn: "Diploma ECE"
    },
    diploma_iti: {
      ta: "டிப்ளமோ / ITI / தொழிற்கல்வி (Diploma / Polytechnic)",
      en: "Diploma / ITI / Polytechnic / Technical Qualification",
      badgeTa: "🎓 டிப்ளமோ / ITI",
      badgeEn: "Diploma / Technical"
    },
    auto: {
      ta: "ஜாதக வித்யா ஸ்தானப்படி (Auto-detected from 4th House)",
      en: "Astrological Vidya Sthana Prediction (4th House)",
      badgeTa: "🌟 வித்யா கணிப்பு",
      badgeEn: "Vedic Education"
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
  ];

  const BHAVA_NAMES_TA = [
    "", "1-ம் இடமான லக்னத்தில்", "2-ம் இடமான தன ஸ்தானத்தில்", "3-ம் இடமான தைரிய/முயற்சி ஸ்தானத்தில்",
    "4-ம் இடமான சுக ஸ்தானத்தில்", "5-ம் இடமான பூர்வ புண்ணிய ஸ்தானத்தில்", "6-ம் இடமான உத்தியோக/சேவை ஸ்தானத்தில்",
    "7-ம் இடமான களத்திர/வணிக ஸ்தானத்தில்", "8-ம் இடமான மறைவு ஸ்தானத்தில்", "9-ம் இடமான பாக்கிய ஸ்தானத்தில்",
    "10-ம் இடமான ஜீவன/கர்ம ஸ்தானத்தில்", "11-ம் இடமான லாப ஸ்தானத்தில்", "12-ம் இடமான அயன/விரய ஸ்தானத்தில்"
  ];

  const BHAVA_NAMES_EN = [
    "", "1st House (Lagna)", "2nd House (Dhana)", "3rd House (Initiative)",
    "4th House (Sukha)", "5th House (Purva Punya)", "6th House (Service/Job)",
    "7th House (Commerce)", "8th House (Transformation)", "9th House (Bhagya)",
    "10th House (Karma/Career)", "11th House (Labha/Gains)", "12th House (Foreign/Expenses)"
  ];

  function getDignityText(planetObj, isTa) {
    if (!planetObj) return isTa ? "சுப நட்பு நிலையில்" : "in friendly disposition";
    if (planetObj.isExalted) return isTa ? "உச்ச பலம் பெற்று" : "exalted";
    if (planetObj.isOwnSign) return isTa ? "ஆட்சி பலம் பெற்று" : "in own house";
    if (planetObj.isRetrograde) return isTa ? "வக்கிர சூட்சும பலத்துடன்" : "with retrograde strength";
    if (planetObj.isDebilitated) return isTa ? "நீச பலவீனத்துடன்" : "debilitated";
    return isTa ? "சுப நட்பு நிலையில்" : "in friendly disposition";
  }

  function getPlanetsAspecting10(planets, house10SignId) {
    const aspecting = [];
    const entries = Object.entries(planets);
    entries.forEach(([code, p]) => {
      if (code === "Asc" || !p || p.signId === undefined) return;
      const diff = (house10SignId - p.signId + 12) % 12;
      if (diff === 6) aspecting.push({ code, aspect: "7th" });
      if (code === "Ma" && (diff === 3 || diff === 7)) aspecting.push({ code, aspect: diff === 3 ? "4th" : "8th" });
      if (code === "Ju" && (diff === 4 || diff === 8)) aspecting.push({ code, aspect: diff === 4 ? "5th" : "9th" });
      if (code === "Sa" && (diff === 2 || diff === 9)) aspecting.push({ code, aspect: diff === 2 ? "3rd" : "10th" });
    });
    return aspecting;
  }

  function generateChartSpecificReasoning(sec, chartInfo, isTa, eduLevel) {
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
    } else if (eduLevel === "diploma_ece") {
      if (sec.id === "it_software") {
        roles = isTa ? [
          "Electronics, Hardware & Networking Support Engineer (எலக்ட்ரானிக்ஸ் & நெட்வொர்க் இன்ஜினியர்)",
          "Telecom Infrastructure & Optical Fiber Field Lead (தொலைத்தொடர்பு & ஃபைபர் நெட்வொர்க் தலைமை)",
          "Embedded Systems & Microcontroller Specialist (எம்படட் சிஸ்டம்ஸ் & மைக்ரோகண்ட்ரோலர்)",
          "CCTV, IoT & Smart Building Automation Lead (சிசிடிவி, ஐஓடி & ஆட்டோமேஷன் இன்ஜினியர்)",
          "PCB Layout & Circuit Troubleshooting Technician (பிசிபி வடிவமைப்பு & சர்க்யூட் சரிபார்ப்பவர்)"
        ] : [
          "Electronics, Hardware & Network Support Engineer",
          "Telecom Infrastructure & Fiber Optic Field Lead",
          "Embedded Systems & Microcontroller Specialist",
          "CCTV, IoT & Smart Building Automation Lead",
          "PCB Layout & Circuit Troubleshooting Technician"
        ];
      } else if (sec.id === "govt_admin") {
        roles = isTa ? [
          "Railway Signal & Telecommunication Junior Engineer (RRB S&T JE - ரயில்வே சிக்னல் & டெலிகாம்)",
          "BSNL / MTNL Telecom Technical Supervisor (தொலைத்தொடர்பு தொழில்நுட்ப மேற்பார்வையாளர்)",
          "Airports Authority Radar & Avionics Electronics Assistant (விமான நிலைய ரேடார் உதவியாளர்)",
          "TNEB / Power Grid SCADA & Substation Instrumentation Tech (மின்வாரிய எலக்ட்ரானிக்ஸ் டெக்னீசியன்)",
          "DRDO / ISRO Electronics Technical Assistant (பாதுகாப்பு & விண்வெளி எலக்ட்ரானிக்ஸ் உதவியாளர்)"
        ] : [
          "Railway Signal & Telecommunication Junior Engineer (RRB S&T JE)",
          "BSNL / MTNL Telecom Technical Supervisor",
          "Airports Authority Radar & Avionics Electronics Assistant",
          "TNEB / Power Grid SCADA & Instrumentation Technician",
          "DRDO / ISRO Electronics Technical Assistant"
        ];
      } else if (sec.id === "manufacturing_industry") {
        roles = isTa ? [
          "Electronic Circuit & SMD Board Assembly Supervisor (எலக்ட்ரானிக்ஸ் சர்க்யூட் அசெம்பிளி மேற்பார்வையாளர்)",
          "Automotive ECU & Sensor Integration Lead (வாகன இசியு & சென்சார் ஒருங்கிணைப்பாளர்)",
          "Industrial Automation & PLC Programmer (தொழில்துறை ஆட்டோமேஷன் & பிஎல்சி புரோகிராமர்)",
          "Electronic Instruments Calibration & Quality Inspector (எலக்ட்ரானிக்ஸ் கருவிகள் தரக்கட்டுப்பாட்டாளர்)"
        ] : [
          "Electronic Circuit & SMD Assembly Supervisor",
          "Automotive ECU & Sensor Integration Lead",
          "Industrial Automation & PLC Programmer",
          "Electronic Instruments Calibration & Quality Inspector"
        ];
      } else if (sec.id === "finance_banking" || sec.id === "banking_finance") {
        roles = isTa ? [
          "Bank ATM & Network Hardware Support Specialist (வங்கி ஏடிஎம் & நெட்வொர்க் இன்ஜினியர்)",
          "Digital Payment POS Machine & UPI Network Field Supervisor (டிஜிட்டல் கட்டண பிஓஎஸ் இயந்திர நிபுணர்)",
          "Core Banking Hardware & Server Maintenance Engineer (வங்கி சர்வர் & கணினி வன்பொருள் பராமரிப்பாளர்)",
          "Financial Electronics Security & CCTV In-charge (வங்கி மின்னணு பாதுகாப்பு & சிசிடிவி மேற்பார்வையாளர்)",
          "Fintech Hardware Support Specialist (ஃபின்டெக் வன்பொருள் தொழில்நுட்ப அலுவலர்)"
        ] : [
          "Bank ATM & Network Hardware Support Specialist",
          "Digital Payment POS & UPI Network Field Supervisor",
          "Core Banking Hardware & Server Maintenance Engineer",
          "Financial Electronics Security & CCTV In-charge",
          "Fintech Hardware Support Specialist"
        ];
      } else if (sec.id === "education_research") {
        roles = isTa ? [
          "Polytechnic / Engineering College Electronics & Communication Lab Instructor (பாலிடெக்னிக் / பொறியியல் ECE ஆய்வக பயிற்றுநர்)",
          "Embedded Systems, Microcontroller & Robotics Practical Trainer (எம்படட் சிஸ்டம்ஸ் & ரோபோடிக்ஸ் பயிற்றுநர்)",
          "Telecom, Fiber Optics & Networking Skill Development Trainer (தொலைத்தொடர்பு & நெட்வொர்க் திறன் பயிற்சியாளர்)",
          "CAD PCB Layout & Electronic Circuit Demonstration Lead (பிசிபி வடிவமைப்பு & சர்க்யூட் செய்முறை உதவியாளர்)",
          "Vocational Electronic Hardware Institute Instructor (மின்னணு வன்பொருள் பயிற்சி மைய பயிற்றுநர்)"
        ] : [
          "Polytechnic / Engineering College Electronics & Communication Lab Instructor",
          "Embedded Systems, Microcontroller & Robotics Practical Trainer",
          "Telecom, Fiber Optics & Networking Skill Development Trainer",
          "CAD PCB Layout & Electronic Circuit Demonstration Lead",
          "Vocational Electronic Hardware Institute Instructor"
        ];
      } else if (sec.id === "law_judiciary") {
        roles = isTa ? [
          "Police Department Wireless & Radio Telecommunications Operator (காவல்துறை வயர்லெஸ் & தொலைத்தொடர்பு பிரிவு)",
          "Cyber Crime Digital Forensics & Electronics Hardware Assistant (சைபர் குற்றப்பிரிவு மின்னணு தடயவியல் உதவியாளர்)",
          "CCTV & Electronic Surveillance Security Project In-charge (சிசிடிவி & மின்னணு கண்காணிப்பு பாதுகாப்பு தலைமை)",
          "Judicial Courts Electronic Access Control & Security Supervisor (நீதிமன்ற மின்னணு பாதுகாப்பு மேற்பார்வையாளர்)",
          "Railway Protection Force (RPF) Telecommunication Technician (ரயில்வே பாதுகாப்பு படை வயர்லெஸ் டெக்னீசியன்)"
        ] : [
          "Police Department Wireless & Radio Telecommunications Operator",
          "Cyber Crime Digital Forensics & Electronics Hardware Assistant",
          "CCTV & Electronic Surveillance Security Project In-charge",
          "Judicial Courts Electronic Access Control & Security Supervisor",
          "Railway Protection Force (RPF) Telecommunication Technician"
        ];
      } else {
        roles = sec.rolesByEdu?.diploma_iti ? (isTa ? sec.rolesByEdu.diploma_iti.rolesTa : sec.rolesByEdu.diploma_iti.rolesEn) : (isTa ? sec.rolesTa : sec.rolesEn);
      }
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
      if ((eduLevel === "diploma_iti" || eduLevel === "diploma_ece") && sec.id === "govt_admin" && (idx === 0 || idx === 1)) {
        isBestMatch = true;
      }
      return {
        title: roleTitle,
        isBestMatch
      };
    });
  }

  function calculateDynamicCareerTiming(dashaData, lagnaSignId, house10SignId, isTa) {
    const curDasha = dashaData.currentDasha || { ta: "சனி", en: "Saturn", lord: "Sa" };
    const curBhukti = dashaData.currentBhukti || { ta: "புதன்", en: "Mercury", lord: "Me" };

    let bhuktiEndDateStr = "";
    if (curBhukti.end) {
      const bDate = new Date(curBhukti.end);
      if (!isNaN(bDate.getTime())) {
        const monthNamesTa = ["ஜனவரி", "பிப்ரவரி", "மார்ச்", "ஏப்ரல்", "மே", "ஜூன்", "ஜூலை", "ஆகஸ்ட்", "செப்டம்பர்", "அக்டோபர்", "நவம்பர்", "டிசம்பர்"];
        const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        bhuktiEndDateStr = isTa
          ? `${monthNamesTa[bDate.getMonth()]} ${bDate.getFullYear()}`
          : `${monthNamesEn[bDate.getMonth()]} ${bDate.getFullYear()}`;
      }
    }

    let transitWindowDates = "";
    let transitRationaleTa = "";
    let transitRationaleEn = "";

    const lagnaName = isTa ? SIGN_NAMES[lagnaSignId].ta : SIGN_NAMES[lagnaSignId].en;
    const h10Name = isTa ? SIGN_NAMES[house10SignId].ta : SIGN_NAMES[house10SignId].en;

    if ([0, 8, 10].includes(lagnaSignId) || [0, 8, 10].includes(house10SignId)) {
      transitWindowDates = isTa ? "ஜூலை 2027 – ஆகஸ்ட் 2028 (சிம்ம குரு பெயர்ச்சி யோகம்)" : "July 2027 – August 2028 (Simha Guru Transit Window)";
      transitRationaleTa = `உங்கள் ${lagnaName} லக்னத்திற்கு கோச்சார குரு சிம்ம ராசியில் சஞ்சரிக்கும் காலத்தில் லக்னத்தையும் ஜீவன ஸ்தானத்தையும் சுபப் பார்வையால் பார்ப்பதால், தொழில் விரிவாக்கம், உயர் பதவி நியமனம் மற்றும் புதிய தொழில் முதலீடுகளுக்கு அதி உன்னதமான பொற்காலமாகும்.`;
      transitRationaleEn = `Transit Jupiter moving through Leo casts its divine trinal aspect on your ${lagnaName} Ascendant / 10th house ${h10Name}, unlocking senior promotions and flourishing entrepreneurial ventures.`;
    } else if ([3, 7, 9, 11].includes(lagnaSignId) || [3, 7, 9, 11].includes(house10SignId)) {
      transitWindowDates = isTa ? "ஜூன் 2026 – ஜூலை 2027 (கடக உச்ச குரு பெயர்ச்சி யோகம்)" : "June 2026 – July 2027 (Kataka Exalted Guru Transit Window)";
      transitRationaleTa = `உங்கள் ${lagnaName} லக்னத்திற்கு கோச்சார குரு கடகத்தில் உச்சம் பெற்று 5, 7, 9-ஆம் சுபப் பார்வைகளால் ஜீவன ஸ்தானமான ${h10Name}-ஐ ஆசீர்வதிப்பதால், வேலை மாற்றம், அரசுத் தேர்வு வெற்றி மற்றும் புதிய தொழில் தொடங்குவதற்கு சாதகமான திருப்புமுனை ஏற்படும்.`;
      transitRationaleEn = `Transit Jupiter transiting exalted in Cancer directly energizes your career axis (${h10Name}), delivering breakthrough job opportunities, exam distinction, and commercial prosperity.`;
    } else {
      transitWindowDates = isTa ? "மே 2025 – ஜூன் 2026 (மிதுன குரு யோக காலம்)" : "May 2025 – June 2026 (Mithuna Guru Transit Window)";
      transitRationaleTa = `உங்கள் ${lagnaName} லக்னத்திற்கு மிதுனத்தில் குரு சஞ்சரிக்கும் காலத்தில் சுபப் பார்வை வலுப்பெற்று, உத்தியோக நிலைப்பாடு, புதிய பொறுப்புகள் மற்றும் வருமான உயர்வுக்கான சிறந்த வாய்ப்புகள் உருவாகும்.`;
      transitRationaleEn = `Transit Jupiter through Gemini grants auspicious harmony to your ascendant, fostering professional elevation, appraisal, and revenue expansion.`;
    }

    const nextWindowDates = bhuktiEndDateStr ? `${transitWindowDates} [நடப்பு புக்தி நிறைவு: ${bhuktiEndDateStr}]` : transitWindowDates;

    return {
      nextWindowDates,
      nextWindowTa: transitRationaleTa,
      nextWindowEn: transitRationaleEn
    };
  }

  /**
   * Main Calculation: Evaluates Career, Job vs Business & Timing
   * @param {Object} horoscopeData - The calculated natal horoscope object
   * @param {Object} [options] - Additional parameters (e.g. language)
   */
  function calculateCareerProfile(horoscopeData, options) {
    if (!horoscopeData || !horoscopeData.lagna || !horoscopeData.planets) {
      return null;
    }

    const isTa = (!options || options.lang !== "en");
    const lagna = horoscopeData.lagna;
    const planets = horoscopeData.planets;
    const vargas = horoscopeData.vargas || {};
    const dashaData = horoscopeData.dashaData || {};
    const ashtakavarga = horoscopeData.ashtakavarga || {};
    const profile = horoscopeData.profile || {};

    const lagnaSignId = lagna.signId;
    const lagnaSign = SIGN_NAMES[lagnaSignId] || SIGN_NAMES[0];
    const lord1Code = lagnaSign.lord;

    const house2SignId = (lagnaSignId + 1) % 12;
    const house6SignId = (lagnaSignId + 5) % 12;
    const house7SignId = (lagnaSignId + 6) % 12;
    const house10SignId = (lagnaSignId + 9) % 12;
    const house11SignId = (lagnaSignId + 10) % 12;
    const house3SignId = (lagnaSignId + 2) % 12;

    const house10Sign = SIGN_NAMES[house10SignId];
    const house6Sign = SIGN_NAMES[house6SignId];
    const house7Sign = SIGN_NAMES[house7SignId];
    const house2Sign = SIGN_NAMES[house2SignId];

    const lord10Code = house10Sign.lord;
    const lord6Code = house6Sign.lord;
    const lord7Code = house7Sign.lord;
    const lord2Code = house2Sign.lord;

    // Find occupants of 10th, 6th, 7th, 11th, 2nd houses
    const occupants = { h10: [], h6: [], h7: [], h11: [], h3: [], h2: [] };
    const planetEntries = Object.entries(planets);

    planetEntries.forEach(([code, p]) => {
      if (code === "Asc" || !p || p.signId === undefined) return;
      if (p.signId === house10SignId) occupants.h10.push(code);
      if (p.signId === house6SignId) occupants.h6.push(code);
      if (p.signId === house7SignId) occupants.h7.push(code);
      if (p.signId === house11SignId) occupants.h11.push(code);
      if (p.signId === house3SignId) occupants.h3.push(code);
      if (p.signId === house2SignId) occupants.h2.push(code);
    });

    // Subathuvam & Paavathuvam Analysis for 10th (Karma) and 2nd (Dhana) Lords
    const subathuvam10 = evaluatePlanetSubathuvam(lord10Code, planets, lagnaSignId);
    const subathuvam2 = evaluatePlanetSubathuvam(lord2Code, planets, lagnaSignId);
    const fieldSignatures10 = PLANET_FIELD_SIGNATURES[lord10Code] || {};
    const fieldSignatures2 = PLANET_FIELD_SIGNATURES[lord2Code] || {};

    // Determine Amatyakaraka (AmK)
    let sortedByDeg = [];
    const mainSeven = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"];
    mainSeven.forEach(code => {
      const p = planets[code];
      if (p && p.longitude !== undefined) {
        sortedByDeg.push({ code, degInSign: (p.longitude % 30) });
      }
    });
    sortedByDeg.sort((a, b) => b.degInSign - a.degInSign);
    const amkCode = sortedByDeg.length > 1 ? sortedByDeg[1].code : "Me";
    const amkPlanet = planets[amkCode] || planets["Me"];

    // -------------------------------------------------------------
    // PART 1: JOB VS BUSINESS SCORE ALGORITHM
    // -------------------------------------------------------------
    let jobScore = 48; // Base baseline
    let bizScore = 45; // Base baseline

    // Factors boosting JOB (Service / 6th house / Saturn / Sun / Stability)
    if (occupants.h6.length > 0) jobScore += occupants.h6.length * 9;
    if (["Sa", "Su", "Ma"].includes(lord6Code)) jobScore += 8;
    if (occupants.h10.includes("Sa") || occupants.h10.includes("Su")) jobScore += 10;
    if (planets["Sa"] && (planets["Sa"].isExalted || planets["Sa"].isOwnSign)) jobScore += 10;
    if (planets["Su"] && (planets["Su"].isExalted || planets["Su"].isOwnSign)) jobScore += 8;

    // Factors boosting BUSINESS (Trade / 7th house / Mercury / Venus / 11th gains / 3rd initiative)
    if (occupants.h7.length > 0) bizScore += occupants.h7.length * 10;
    if (occupants.h3.length > 0) bizScore += 8;
    if (occupants.h11.length > 0) bizScore += occupants.h11.length * 7;
    if (["Me", "Ve", "Ma"].includes(lord7Code)) bizScore += 9;
    if (occupants.h10.includes("Me") || occupants.h10.includes("Ve") || occupants.h10.includes("Ra")) bizScore += 12;
    if (planets["Me"] && (planets["Me"].isExalted || planets["Me"].isOwnSign)) bizScore += 12;
    if (planets["Ve"] && (planets["Ve"].isExalted || planets["Ve"].isOwnSign)) bizScore += 10;

    // Ashtakavarga SAV influence if available
    if (ashtakavarga && ashtakavarga.SAV) {
      const sav10 = ashtakavarga.SAV[house10SignId] || 28;
      const sav11 = ashtakavarga.SAV[house11SignId] || 28;
      const sav6 = ashtakavarga.SAV[house6SignId] || 28;
      const sav7 = ashtakavarga.SAV[house7SignId] || 28;

      if (sav10 >= 30) { jobScore += 5; bizScore += 7; }
      if (sav11 >= 32) bizScore += 8;
      if (sav6 >= 30) jobScore += 7;
      if (sav7 >= 30) bizScore += 8;
    }

    // Cap between 25 and 96
    jobScore = Math.min(96, Math.max(25, Math.round(jobScore)));
    bizScore = Math.min(96, Math.max(25, Math.round(bizScore)));

    // Ensure differential is balanced & realistic
    let verdictKey = "hybrid";
    let verdictTitleTa = "";
    let verdictTitleEn = "";
    let verdictBadgeTa = "";
    let verdictBadgeEn = "";
    let verdictSummaryTa = "";
    let verdictSummaryEn = "";
    let recommendedPathTa = "";
    let recommendedPathEn = "";

    const diff = Math.abs(jobScore - bizScore);
    if (bizScore > jobScore && diff >= 8) {
      verdictKey = "business";
      verdictTitleTa = "🏢 சொந்தத் தொழில் & வியாபாரம் அதி உன்னதம் (High Business Yoga)";
      verdictTitleEn = "🏢 Outstanding Entrepreneurship & Business Potential";
      verdictBadgeTa = "சொந்தத் தொழில் யோகம்";
      verdictBadgeEn = "Business First";
      verdictSummaryTa = "உங்கள் ஜாதகத்தில் 7-ம் இடம் (வணிகம்), 10-ம் இடம் (கர்மம்) மற்றும் 11-ம் இடம் (லாபம்) மிகவும் வலுப்பெற்றுள்ளன. பிறரிடம் பணிபுரிவதை விட சுயமாக தொழில் தொடங்குதல், வர்த்தகம் செய்தல், பார்ட்னர்ஷிப் அல்லது ஸ்டார்ட்அப் நிறுவனங்களை வழிநடத்துவதில் அபரிமிதமான வளர்ச்சி ஏற்படும்.";
      verdictSummaryEn = "Your natal chart features strong alignments in the 7th (Commerce), 10th (Karma), and 11th (Profits) houses. Operating an independent enterprise, commercial trading, or high-level startup delivers exponential prosperity.";
      recommendedPathTa = "சுய தொழில் / வணிகம் / நிறுவன கூட்டாண்மை";
      recommendedPathEn = "Entrepreneurship / Independent Enterprise / Joint Ventures";
    } else if (jobScore > bizScore && diff >= 8) {
      verdictKey = "job";
      verdictTitleTa = "💼 நிறுவன உத்தியோகம் & அரசு வேலை உகந்தது (Service & Corporate Career)";
      verdictTitleEn = "💼 High Stability in Corporate & Government Service";
      verdictBadgeTa = "உத்தியோக யோகம்";
      verdictBadgeEn = "Corporate Service";
      verdictSummaryTa = "உங்கள் ஜாதகத்தில் 6-ம் பாவத்தின் உபசய வலிமை மற்றும் ஸ்திர கிரகங்களின் ஆதரவு நிலையான வருமானம், நிறுவன உயர் பதவிகள், அரசுத் தேர்வுகள் அல்லது பன்னாட்டு கார்ப்பரேட் நிறுவனங்களில் தலைமைப் பொறுப்பை அடைவதற்கு பேராதரவு தருகின்றன.";
      verdictSummaryEn = "The Upachaya strength of your 6th house alongside stabilizing planetary support favors structured executive employment, civil services, banking, or prominent leadership in large multinational corporations.";
      recommendedPathTa = "அரசு வேலை / கார்ப்பரேட் உயர் நிர்வாகப் பணி";
      recommendedPathEn = "Government / High-level Corporate Executive Leadership";
    } else {
      verdictKey = "hybrid";
      verdictTitleTa = "🔄 இரட்டை யோகம்: முதலில் உத்தியோகம், பின் சொந்த தொழில் (Dual / Hybrid Career)";
      verdictTitleEn = "🔄 Hybrid Model: Corporate Foundation leading to Lucrative Business";
      verdictBadgeTa = "இரட்டை யோகம் (Hybrid)";
      verdictBadgeEn = "Dual Hybrid Career";
      verdictSummaryTa = "உங்கள் ஜாதகத்தில் வேலை மற்றும் தொழில் ஆகிய இரண்டு அமைப்புகளும் சமபலத்துடன் உள்ளன. தொடக்க காலத்தில் (வயது 22-34) முன்னணி நிறுவனங்களில் பணிபுரிந்து அனுபவமும் மூலதனமும் பெற்று, பின்னர் (வயது 35+) சொந்தத் தொழில், ஆலோசனை நிறுவனம் (Consultancy) அல்லது வணிகத்தில் இறங்கினால் அசுர வளர்ச்சி அடைவீர்கள்.";
      verdictSummaryEn = "Your chart harmonizes both employment and entrepreneurial energies. Launching your career in top-tier corporate firms (Ages 22-34) to amass capital and network, followed by founding your own venture or consultancy (Ages 35+), delivers optimal mastery.";
      recommendedPathTa = "தொடக்கத்தில் உத்தியோகம் ➔ அனுபவத்திற்குப் பின் சொந்தத் தொழில்";
      recommendedPathEn = "Corporate Career Initially ➔ Enterprise Founder Post Maturity";
    }

    // -------------------------------------------------------------
    // PART 2: WHAT JOB HE WILL GET (INDUSTRY SECTOR RANKING)
    // -------------------------------------------------------------
    const aspects10 = getPlanetsAspecting10(planets, house10SignId);
    const lord10Obj = planets[lord10Code] || {};
    const lord10Bhava = (lord10Obj.signId !== undefined) ? (((lord10Obj.signId - lagnaSignId + 12) % 12) + 1) : 10;
    const isLord10KendraTrikona = [1, 4, 5, 7, 9, 10].includes(lord10Bhava);

    const chartContext = {
      lagnaSign,
      house10Sign,
      lord10Code,
      lord10Obj,
      lord10Bhava,
      subathuvam10,
      subathuvam2,
      amkCode,
      amkPlanet,
      occupants10: occupants.h10,
      aspects10,
      planets
    };

    const sectorScores = CAREER_SECTORS.map(sec => {
      let score = 28; // calibrated base

      // 1. 10th Lord alignment
      if (sec.primaryPlanets.includes(lord10Code)) {
        score += 22;
        if (lord10Obj && (lord10Obj.isExalted || lord10Obj.isOwnSign)) score += 8;
        if (lord10Bhava === 10) score += 8;
        else if (isLord10KendraTrikona) score += 4;
      }

      // 2. Subathuvam / Paavathuvam alignment
      if (subathuvam10.gradeKey === "grade_1") {
        if (["govt_admin", "education_research", "law_judiciary", "finance_banking"].includes(sec.id)) score += 18;
        if (sec.id === "medicine_healthcare") score += 10;
      } else if (subathuvam10.gradeKey === "grade_2") {
        if (["it_software", "creative_arts_media", "finance_banking", "trade_foreign"].includes(sec.id)) score += 18;
      } else if (subathuvam10.gradeKey === "paavathuvam_sookshma") {
        if (["engineering_realestate", "manufacturing_industry"].includes(sec.id)) score += 22;
        if (sec.id === "govt_admin" && (planets["Ma"]?.isExalted || planets["Sa"]?.isOwnSign || planets["Sa"]?.isExalted)) score += 14;
        if (sec.id === "trade_foreign") score += 10;
      } else {
        if (["govt_admin", "manufacturing_industry"].includes(sec.id)) score += 8;
      }

      // 3. Occupants in 10th
      occupants.h10.forEach(code => {
        if (sec.primaryPlanets.includes(code)) score += 15;
        const occP = planets[code];
        if (occP && (occP.isExalted || occP.isOwnSign)) score += 6;
        if (code === "Su" && sec.id === "govt_admin") score += 8; // Digbala
        if (code === "Ma" && (sec.id === "engineering_realestate" || sec.id === "govt_admin")) score += 8; // Digbala
      });

      // 4. Aspects on 10th
      aspects10.forEach(asp => {
        if (sec.primaryPlanets.includes(asp.code)) {
          if (asp.code === "Ju") score += 10;
          else if (asp.code === "Ve") score += 8;
          else if (asp.code === "Me") score += 8;
          else if (asp.code === "Ma" && ["engineering_realestate", "govt_admin"].includes(sec.id)) score += 8;
          else if (asp.code === "Sa" && ["manufacturing_industry", "govt_admin"].includes(sec.id)) score += 8;
        }
      });

      // 5. Amatyakaraka
      if (sec.primaryPlanets.includes(amkCode)) {
        score += 14;
        if (amkPlanet && (amkPlanet.isExalted || amkPlanet.isOwnSign)) score += 4;
      }

      // 6. 10th House Sign & Element
      if (sec.favorableElements.includes(house10Sign.element)) score += 8;
      if (sec.favorableSigns.includes(house10SignId)) score += 6;

      // 7. 2nd Lord synergy
      if (sec.primaryPlanets.includes(lord2Code)) score += 7;

      return {
        ...sec,
        rawScore: score
      };
    });

    sectorScores.sort((a, b) => b.rawScore - a.rawScore);

    // Natural calibration of top scores with clean distinction (no flat 98% ties)
    const top1Score = Math.min(96, Math.max(88, Math.round(sectorScores[0].rawScore)));
    const top2Score = Math.min(top1Score - 6, Math.max(76, Math.round(sectorScores[1].rawScore)));
    const top3Score = Math.min(top2Score - 6, Math.max(68, Math.round(sectorScores[2].rawScore)));

    sectorScores[0].calculatedScore = top1Score;
    sectorScores[1].calculatedScore = top2Score;
    sectorScores[2].calculatedScore = top3Score;

    for (let i = 3; i < sectorScores.length; i++) {
      sectorScores[i].calculatedScore = Math.min(top3Score - 4, Math.max(45, Math.round(sectorScores[i].rawScore * 0.75)));
    }

    // Extract Education Level (User specified or 4th house Vidya Sthana calibrated)
    const validEduLevels = ["diploma_iti", "diploma_ece", "degree_ug", "postgraduate_pg", "school_10_12", "professional"];
    let rawEduChoice = (options && (options.educationLevel || options.education)) || (profile && profile.educationLevel) || "auto";
    let isAutoDeduced = (rawEduChoice === "auto" || !validEduLevels.includes(rawEduChoice));
    let eduLevel = isAutoDeduced ? "diploma_iti" : rawEduChoice;

    const house4SignId = (lagnaSignId + 3) % 12;
    const occ4 = [];
    Object.entries(planets).forEach(([c, p]) => {
      if (c !== "Asc" && p && p.signId === house4SignId) occ4.push(c);
    });

    let vidyaReasoningTa = "";
    let vidyaReasoningEn = "";
    let deducedTitleTa = "";
    let deducedTitleEn = "";

    if (isAutoDeduced) {
      const lord4Code = (SIGN_NAMES[house4SignId] && SIGN_NAMES[house4SignId].lord) ? SIGN_NAMES[house4SignId].lord : "Ma";
      const lord4Obj = planets[lord4Code];
      const lord4SignId = lord4Obj ? lord4Obj.signId : -1;
      const pMercury = planets.Me;
      const pMars = planets.Ma;
      const pRahu = planets.Ra;
      const pJupiter = planets.Ju;
      const pVenus = planets.Ve;

      const house10SignId = (lagnaSignId + 9) % 12;
      const lord10Code = (SIGN_NAMES[house10SignId] && SIGN_NAMES[house10SignId].lord) ? SIGN_NAMES[house10SignId].lord : "Ju";
      const lord10Obj = planets[lord10Code];
      const lord10SignId = lord10Obj ? lord10Obj.signId : -1;

      // Maha Parivartana Yoga between 4th Lord (Vidya) & 10th Lord (Karma)
      const is4_10_Parivartana = (lord4SignId === house10SignId && lord10SignId === house4SignId);

      const isMarsExalted = pMars && pMars.signId === 9; // Capricorn
      const isMercuryInMarsSign = pMercury && (pMercury.signId === 0 || pMercury.signId === 7); // Aries or Scorpio
      const isRahuInHouse3 = pRahu && pRahu.signId === ((lagnaSignId + 2) % 12);
      const isMarsAspectingMercury = (pMars && pMercury) && ([0, 3, 6, 7].includes((pMercury.signId - pMars.signId + 12) % 12));
      const isMercuryConjunctMars = (pMercury && pMars && pMercury.signId === pMars.signId);
      const isMercuryWithLord4InMarsSign = (pMercury && lord4Obj && pMercury.signId === lord4SignId && isMercuryInMarsSign);

      const isECESignature = (isMercuryWithLord4InMarsSign && isMarsExalted) ||
                             (isMercuryInMarsSign && isRahuInHouse3) ||
                             (isMercuryConjunctMars && (occ4.includes("Ra") || occ4.includes("Ke") || isRahuInHouse3)) ||
                             (isMarsAspectingMercury && isRahuInHouse3);

      if (isECESignature) {
        eduLevel = "diploma_ece";
        deducedTitleTa = "டிப்ளமோ ECE (Electronics & Communication Engineering)";
        deducedTitleEn = "Diploma in ECE (Electronics & Communication Engineering)";
        vidyaReasoningTa = "ஜாதகத்தில் தகவல் தொடர்பு காரகன் புதனும் 4-ஆம் அதிபதியும் செவ்வாயின் மேஷ ராசியில் இணைந்து, 2-ல் செவ்வாய் உச்சம் பெற்று, 3-ஆம் பாவமான தகவல் பரிமாற்ற ஸ்தானத்தில் ராகு அமைந்திருப்பது எலக்ட்ரானிக்ஸ் மற்றும் தொலைத்தொடர்பு பொறியியல் (Diploma ECE - Electronics & Communication) அமைவதற்கான மிகத் துல்லியமான வேத ஜோதிட விதியாகும்.";
        vidyaReasoningEn = "Synergy of Mercury (communications), Mars (electronics/circuits) and Rahu in 3rd house of communications astoundingly signifies Electronics & Communication Engineering (Diploma ECE).";
      } else if (is4_10_Parivartana || occ4.includes("Ju")) {
        // Supreme Vidya Karaka Guru in 4th house or 4th-10th Maha Parivartana Yoga confers University Degree
        eduLevel = "degree_ug";
        if (is4_10_Parivartana && occ4.includes("Ke")) {
          deducedTitleTa = "பட்டப்படிப்பு (Undergraduate Degree - B.Sc / B.Com / B.A / B.Ed)";
          deducedTitleEn = "Undergraduate Degree (UG - Science / Commerce / Mathematics / Arts)";
          vidyaReasoningTa = "ஜாதகரின் 4-ஆம் வீடான வித்யா ஸ்தானத்தில் தேவகுருவான குரு பகவான் (Jupiter) அமர்ந்து, 4-ஆம் அதிபதி புதனுடன் (Mercury) 10-ஆம் இடமான ஜீவன ஸ்தானத்தோடு 'சதுர்த்த-தசம மகா பரிவர்த்தனை யோகம்' (4th & 10th House Exchange) பெற்றுள்ளார். மேலும் வித்யா ஸ்தானத்தில் குருவோடு கேது இணைந்து 'ஞான யோகம்' (Gnana Yoga) அமைப்பதால், இவர் முறையான கல்லூரிப் பட்டப்படிப்பு (Graduation / Degree - B.Sc / B.Com / B.A) முடித்து, கல்வி, அரசு நிர்வாகம், வங்கி அல்லது பொதுத்துறை நிறுவனங்களில் கௌரவமான தலைமைப் பொறுப்புகளில் விளங்கும் அமைப்பாகும்.";
          vidyaReasoningEn = "Deva Guru Jupiter (Vidya Karaka) resides in the 4th house forming a prestigious 'Maha Parivartana Yoga' with 4th lord Mercury in the 10th house. Conjunction of Jupiter with Ketu forms the highly auspicious 'Gnana Yoga', signifying recognized formal college graduation (Bachelor's Degree - Science / Commerce / Arts) leading to respectable executive, educational, governmental, or banking positions.";
        } else if (occ4.includes("Ju")) {
          deducedTitleTa = "பட்டப்படிப்பு (Undergraduate Degree - B.E / B.Sc / B.Com / B.A)";
          deducedTitleEn = "Undergraduate Degree (UG - Graduation / University Degree)";
          vidyaReasoningTa = "வித்யா காரகனான குரு பகவான் 4-ஆம் வீட்டில் அமர்ந்து வித்யா ஸ்தானத்தைப் பலப்படுத்துவதால், ஜாதகர் பல்கலைக்கழக முறையான பட்டப்படிப்பு (College Degree / Graduation) முடித்து கௌரவமான பணியில் விளங்குவார்.";
          vidyaReasoningEn = "Presence of Vidya Karaka Jupiter in the 4th house confers formal university graduation / undergraduate degree.";
        } else {
          deducedTitleTa = "பட்டப்படிப்பு (Undergraduate Degree - B.Sc / B.Com / B.A)";
          deducedTitleEn = "Undergraduate Degree (UG - Graduation)";
          vidyaReasoningTa = "4-ஆம் அதிபதியும் 10-ஆம் அதிபதியும் பரிவர்த்தனை பெற்று மகா யோகம் அமைப்பதால் பட்டப்படிப்பு அமையும்.";
          vidyaReasoningEn = "Parivartana between 4th and 10th lords establishes formal degree qualification.";
        }
      } else if (occ4.includes("Ve") || occ4.includes("Su") || subathuvam10.gradeKey === "grade_1") {
        eduLevel = "degree_ug";
        deducedTitleTa = "பட்டப்படிப்பு (Undergraduate Degree - B.E / B.Sc / B.Com)";
        deducedTitleEn = "Undergraduate Degree (UG)";
        vidyaReasoningTa = "4-ஆம் வீட்டில் சுப கிரகங்கள் (சுக்கிரன்/சூரியன்) தொடர்பு கொள்வதால் அல்லது 10-ஆம் பாவம் முதல்நிலை சுபத்துவம் பெறுவதால் பல்கலைக்கழக பட்டப்படிப்பு அமையும்.";
        vidyaReasoningEn = "Benefic influence on the 4th house supports formal university degree.";
      } else if ((occ4.includes("Ke") || occ4.includes("Ma") || occ4.includes("Ra") || occ4.includes("Sa")) && !occ4.includes("Ju") && !occ4.includes("Ve")) {
        eduLevel = "diploma_iti";
        deducedTitleTa = "செயல்முறை தொழிற்கல்வி / டிப்ளமோ (Diploma / ITI / Technical Training)";
        deducedTitleEn = "Practical Technical Training / Diploma & Vocational Skills";
        vidyaReasoningTa = "ஜாதகரின் 4-ஆம் வீடான வித்யா ஸ்தானத்தில் செயல்முறைக் காரக கிரகங்கள் (" + (occ4.map(c => PLANET_NAMES[c].ta).join(", ")) + ") மட்டுமே அமைந்திருப்பதால், நேரடி செயல்முறை தொழிற்கல்வி (Diploma / ITI / Technical Field Training) மற்றும் மேற்பார்வை தொழில்நுட்ப பணிகளில் சாதனை அமையும்.";
        vidyaReasoningEn = "Presence of practical/technical planets (" + (occ4.map(c => PLANET_NAMES[c].en).join(", ")) + ") without Jupiter/Venus in the 4th house signifies non-classical hands-on technical or vocational education (Diploma / ITI).";
      } else {
        eduLevel = "degree_ug";
        deducedTitleTa = "பட்டப்படிப்பு (Undergraduate Degree - B.Sc / B.Com / B.A)";
        deducedTitleEn = "Undergraduate Degree (UG)";
        vidyaReasoningTa = "நடுத்தர சுபத்துவ வித்யா ஸ்தான அமைப்பால் கல்லூரி பட்டப்படிப்பு அமையும்.";
        vidyaReasoningEn = "Balanced 4th house configuration supports university degree.";
      }
    }
    const currentEduMeta = EDU_LABELS[eduLevel] || EDU_LABELS.diploma_iti;

    const topSectors = sectorScores.slice(0, 3).map(sec => {
      const customExplanationTa = generateChartSpecificReasoning(sec, chartContext, true, eduLevel);
      const customExplanationEn = generateChartSpecificReasoning(sec, chartContext, false, eduLevel);
      const customRolesTa = prioritizeSectorRoles(sec, chartContext, true, eduLevel);
      const customRolesEn = prioritizeSectorRoles(sec, chartContext, false, eduLevel);

      return {
        ...sec,
        descriptionTa: customExplanationTa,
        descriptionEn: customExplanationEn,
        customExplanationTa,
        customExplanationEn,
        customRolesTa,
        customRolesEn
      };
    });

    // -------------------------------------------------------------
    // PART 3: CAREER TIMING & MILESTONES (எந்த காலகட்டம்? எப்போது நடக்கும்?)
    // -------------------------------------------------------------
    const birthYear = parseInt((profile.birthDate || "1988-04-30").split("-")[0], 10) || 1988;
    const currentYear = new Date().getFullYear();
    const currentAge = currentYear - birthYear;

    const milestones = [
      {
        id: "m1",
        stageTa: "1. தொழில் தொடக்கம் & முதல் வேலை (Career Launch & Entry)",
        stageEn: "1. Career Launch & First Employment",
        ageRangeTa: "வயது 21 – 24",
        ageRangeEn: "Ages 21 – 24",
        yearRange: `${birthYear + 21} – ${birthYear + 24}`,
        icon: "🚀",
        statusTa: "தொடக்க காலம்",
        statusEn: "Foundation",
        isCurrentStage: (currentAge >= 21 && currentAge <= 25),
        descTa: "முறையான கல்வி மற்றும் தொழிற்பயிற்சி முடிந்து முதல் உத்தியோகத்தில் காலடி எடுத்து வைக்கும் உன்னத காலகட்டம். சுய வருமானத் தொடக்கம் மற்றும் பணி அனுபவம் உருப்பெறும்.",
        descEn: "Completion of formal academic/technical credentials and entry into the workforce. Initiation of personal financial independence and foundational competence."
      },
      {
        id: "m2",
        stageTa: "2. தொழில் நிலைப்பாடு & முதல் பெரிய உயர்வு (Career Stabilization & Key Promotion)",
        stageEn: "2. Career Stabilization & Major Appraisal",
        ageRangeTa: "வயது 26 – 32",
        ageRangeEn: "Ages 26 – 32",
        yearRange: `${birthYear + 26} – ${birthYear + 32}`,
        icon: "📈",
        statusTa: "முன்னேற்ற காலம்",
        statusEn: "Acceleration",
        isCurrentStage: (currentAge >= 26 && currentAge <= 32),
        descTa: "பணியிடத்தில் முக்கிய அங்கீகாரம் பெறுதல், ஊதிய உயர்வு, முன்னணி நிறுவனங்களுக்கு மாறுதல் அல்லது வெளிநாட்டு பயண வாய்ப்புகள் உருவாகும் அதிர்ஷ்ட காலம்.",
        descEn: "Attaining organizational recognition, substantial salary appraisals, transitions to premier multinational firms, or lucrative foreign work deputations."
      },
      {
        id: "m3",
        stageTa: "3. மகத்தான தலைமை / திருப்புமுனை / தொழில் தொடக்கம் (Major Breakthrough / Business Launch)",
        stageEn: "3. Major Breakthrough / Executive Role / Business Launch",
        ageRangeTa: "வயது 33 – 40",
        ageRangeEn: "Ages 33 – 40",
        yearRange: `${birthYear + 33} – ${birthYear + 40}`,
        icon: "👑",
        statusTa: "திருப்புமுனை யோகம்",
        statusEn: "Breakthrough Zenith",
        isCurrentStage: (currentAge >= 33 && currentAge <= 40),
        descTa: "தொழில் வாழ்க்கையின் மிக முக்கியமான திருப்புமுனை! தலைமை நிர்வாகியாக (Director/VP/Head) உயர்தல், தனியாக புதிய தொழில் தொடங்குதல் அல்லது பெரிய ஒப்பந்தங்கள் கையெழுத்தாகும் உன்னத பொற்காலம்.",
        descEn: "Pivotal career breakthrough! Ascending to executive leadership (Director, VP, or Business Founder), launching independent enterprise, or securing landmark commercial contracts."
      },
      {
        id: "m4",
        stageTa: "4. பொற்காலம் & நிலைத்த தனலாபம் (Golden Peak Era & Lasting Wealth)",
        stageEn: "4. Golden Peak Era & Sustained Prosperity",
        ageRangeTa: "வயது 41 – 55",
        ageRangeEn: "Ages 41 – 55",
        yearRange: `${birthYear + 41} – ${birthYear + 55}`,
        icon: "🏆",
        statusTa: "ராஜ யோக நிறைவு",
        statusEn: "Peak Legacy",
        isCurrentStage: (currentAge >= 41),
        descTa: "சமூகத்தில் பெரும் அந்தஸ்து, தொழில் மூலம் நிலையான சொத்துக்கள் சேர்த்தல், சந்தையில் தனித்துவ முத்திரை பதித்தல் மற்றும் நிதி நிறைவு காணும் பொற்காலம்.",
        descEn: "Peak authority, grand wealth consolidation through business/investments, immense social influence, and enduring professional legacy."
      }
    ];

    // -------------------------------------------------------------
    // PART 4: CURRENT DASHA-BHUKTI CAREER FORECAST
    // -------------------------------------------------------------
    const curDasha = dashaData.currentDasha || { ta: "சனி", en: "Saturn", lord: "Sa" };
    const curBhukti = dashaData.currentBhukti || { ta: "புதன்", en: "Mercury", lord: "Me" };

    const dLord = curDasha.lord || "Sa";
    const bLord = curBhukti.lord || "Me";

    const dInfo = PLANET_NAMES[dLord] || { ta: "சனி", en: "Saturn" };
    const bInfo = PLANET_NAMES[bLord] || { ta: "புதன்", en: "Mercury" };

    // Assess Current Career Trend based on dasha/bhukti
    let currentForecastTa = "";
    let currentForecastEn = "";
    let jobChangeProbability = 82;
    let promotionProbability = 88;
    let businessViability = 80;

    if (["Ju", "Me", "Ve"].includes(bLord)) {
      currentForecastTa = `தற்போது இயங்கும் ${dInfo.ta} தசை - ${bInfo.ta} புக்தி காலம் உத்தியோகம் மற்றும் தொழிலுக்கு மிகவும் சாதகமான காலகட்டம் ஆகும். புதிய பொறுப்புகள், பதவி உயர்வு, சம்பள உயர்வு அல்லது புதிய தொழில் முதலீடுகள் செய்வதற்கு இது மிக உகந்த நற்பலன் தரும் காலம்.`;
      currentForecastEn = `The prevailing ${dInfo.en} Maha Dasha - ${bInfo.en} Bhukti is exceptionally propitious for professional elevation, salary hikes, new leadership roles, or launching business extensions.`;
      promotionProbability = 94;
      jobChangeProbability = 88;
      businessViability = 89;
    } else if (["Su", "Ma"].includes(bLord)) {
      currentForecastTa = `தற்போது இயங்கும் ${dInfo.ta} தசை - ${bInfo.ta} புக்தி காலத்தில் அதிகார பலம், அரசுத் துறை தொடர்பு மற்றும் முடிவெடுக்கும் ஆற்றல் கூடும். துணிச்சலான தொழில் மாற்றங்கள் வெற்றியைத் தரும்.`;
      currentForecastEn = `The ongoing ${dInfo.en} Maha Dasha - ${bInfo.en} Bhukti fosters executive command, governmental contacts, and bold entrepreneurial decisions with high rewards.`;
      promotionProbability = 90;
      jobChangeProbability = 85;
      businessViability = 84;
    } else {
      currentForecastTa = `தற்போது இயங்கும் ${dInfo.ta} தசை - ${bInfo.ta} புக்தி காலத்தில் கடுமையான உழைப்பிற்கு தகுந்த நற்பலன்கள் கிட்டும். பெரிய முதலீடுகளை நிதானமாக திட்டமிட்டு மேற்கொள்ளவும்; வேலையில் நிலைத்தன்மை காப்பது உத்தமம்.`;
      currentForecastEn = `Under the active ${dInfo.en} Maha Dasha - ${bInfo.en} Bhukti, disciplined persistence yields steady rewards. Plan capital investments diligently and prioritize organizational stability.`;
      promotionProbability = 78;
      jobChangeProbability = 72;
      businessViability = 74;
    }

    // Yoga Dasa vs Avayoga Dasa Rule Analysis
    const house5SignId = (lagnaSignId + 4) % 12;
    const house8SignId = (lagnaSignId + 7) % 12;
    const house9SignId = (lagnaSignId + 8) % 12;
    const house12SignId = (lagnaSignId + 11) % 12;

    const trikonaLords = [lord1Code, SIGN_NAMES[house5SignId].lord, SIGN_NAMES[house9SignId].lord];
    const kendraLords = [lord1Code, SIGN_NAMES[house4SignId].lord, lord7Code, lord10Code];
    const dusthanaLords = [lord6Code, SIGN_NAMES[house8SignId].lord, SIGN_NAMES[house12SignId].lord];

    const isYogaDasa = trikonaLords.includes(dLord) || kendraLords.includes(dLord);
    const isAvayogaDasa = dusthanaLords.includes(dLord) && !trikonaLords.includes(dLord);

    const dasaSubathuvam = evaluatePlanetSubathuvam(dLord, planets, lagnaSignId);

    let dasaNatureTa = "சம தசை (Neutral Dasa)";
    let dasaNatureEn = "Neutral Dasa";
    let dasaGuidanceTa = "";
    let dasaGuidanceEn = "";
    let dasaBizViability = 72;

    if (isYogaDasa) {
      dasaNatureTa = "யோக தசை (Yoga Dasa)";
      dasaNatureEn = "Benefic Yoga Dasa";
      if (dasaSubathuvam.gradeKey === "grade_1" || dasaSubathuvam.gradeKey === "grade_2") {
        dasaGuidanceTa = `தற்போது நடக்கும் ${dInfo.ta} தசை ஒரு யோக தசை! முதல்/இரண்டாம் நிலை சுபத்துவம் பெற்றுள்ளதால் சொந்த தொழில் (Business) தொடங்கினால் அசுர வளர்ச்சி மற்றும் தனலாபம் தரும்; அல்லது அரசு/கார்ப்பரேட் உயர் அதிகார பதவி (Top Job) தேடி வரும்.`;
        dasaGuidanceEn = `The prevailing ${dInfo.en} Dasa is an auspicious Yoga Dasa. Benefic subathuvam empowers commercial enterprise with tremendous profit, or confers top-tier civil/executive leadership.`;
        dasaBizViability = 94;
      } else {
        dasaGuidanceTa = `தற்போது நடக்கும் ${dInfo.ta} தசை யோக தசையாக இருந்தாலும் சுபத்துவம் குறைவாக உள்ளதால், உழைப்புக்கு ஏற்ற பலன் மட்டுமே கிட்டும்; தொழிலில் பெரிய முதலீடுகளை நிதானமாக அணுகவும்.`;
        dasaGuidanceEn = `Active ${dInfo.en} Dasa is a functional Yoga Dasa, yet moderate beneficence advises prudent capital management.`;
        dasaBizViability = 78;
      }
    } else if (isAvayogaDasa) {
      dasaNatureTa = "அவயோக தசை (Avayoga Dasa)";
      dasaNatureEn = "Afflicted Avayoga Dasa";
      if (dasaSubathuvam.gradeKey === "grade_1" || dasaSubathuvam.gradeKey === "grade_2") {
        dasaGuidanceTa = `தற்போது நடக்கும் ${dInfo.ta} தசை ஒரு அவயோக தசை ஆகும். தசாநாதன் சுபத்துவம் பெற்றுள்ளதால், **கட்டாயம் வேலைக்கு (Job / Service) செல்வதே 100% பாதுகாப்பானது**. அவயோக தசையில் தொழில் தொடங்கினால் நஷ்டம், கடன் வரக்கூடும்; ஆனால் மாத சம்பள வேலைக்கு சென்றால் தசாநாதன் உங்களைக் காப்பாற்றி சுமுக வருமானம் தருவார்.`;
        dasaGuidanceEn = `The active ${dInfo.en} Dasa is an Avayoga Dasa. Because the lord has secondary subathuvam, salaried employment (Job) is 100% safest to avoid debts; business investments are strictly discouraged.`;
        dasaBizViability = 45;
      } else {
        dasaGuidanceTa = `நடக்கும் ${dInfo.ta} தசை கடுமையான அவயோக அமைப்பாகும். சொந்த தொழில் துவங்கவே கூடாது. வேலையை தக்கவைத்துக்கொண்டு எவ்வித கடன் மற்றும் வம்பு வழக்குகளையும் தவிர்க்க வேண்டும்.`;
        dasaGuidanceEn = `Active ${dInfo.en} Dasa is severely afflicted. Avoid all new business risks; preserve active employment diligently to prevent losses and disputes.`;
        dasaBizViability = 32;
      }
    } else {
      dasaGuidanceTa = `தற்போது நடக்கும் ${dInfo.ta} தசையில் நிலைத்தன்மை மற்றும் சுய உழைப்புக்குரிய பலன்கள் கிடைக்கும்.`;
      dasaGuidanceEn = `Active ${dInfo.en} Dasa delivers steady progress through sustained discipline.`;
      dasaBizViability = 70;
    }

    const jobTimingPrediction = {
      titleTa: "வேலை எப்போது கிடைக்கும்? (When Will You Get a Job?)",
      titleEn: "When Will You Get a Job?",
      timingTa: "கோச்சார குரு உங்கள் லக்னத்தையோ, 10-ஆம் வீட்டையோ அல்லது 6-ஆம் வீட்டையோ சுபப் பார்வையால் பார்க்கும் காலத்திலும்; 6-ஆம் அதிபதி (உத்தியோகம்) அல்லது 10-ஆம் அதிபதியின் (பதவி) சுப புக்தி நடக்கும் போதும் வேலைவாய்ப்பு, புதிய பணி நியமனம் மற்றும் பதவி உயர்வு உறுதியாகக் கைகூடும்.",
      timingEn: "Employment appointments and promotions materialize when transit Jupiter aspects the 10th or 6th house, or during the benefic Bhukti of 6th/10th lords."
    };

    const businessTimingPrediction = {
      titleTa: "சொந்தத் தொழில் எப்போது தொடங்க வேண்டும்? (When to Start Business?)",
      titleEn: "When to Start Business?",
      bestTimeTa: "லக்ன யோக தசையும் (1, 5, 9, 10-ஆம் அதிபதிகள் தசை), முதல் நிலை சுபத்துவம் பெற்ற புக்தியும் நடக்கும் காலமே சொந்தத் தொழில் தொடங்குவதற்கான பொற்காலம்.",
      bestTimeEn: "The launch of a Yoga Dasa (1st, 5th, 9th, or 10th lord) alongside a 1st Grade Subathuva Bhukti is the golden era for entrepreneurial ventures.",
      cautionTa: "அவயோக தசை (6, 8, 12-ஆம் அதிபதிகள் தசை) நடக்கும் போதும், ஏழரைச் சனி மற்றும் அஷ்டமச் சனி காலங்களிலும் புதிய தொழில் தொடங்கக் கூடாது; கடுமையான பண முடக்கம், கடன் மற்றும் சட்டச் சிக்கல்கள் ஏற்படும்.",
      cautionEn: "Never start a business during Avayoga Dashas (6th, 8th, 12th lords) or during Sade Sati / Ashtama Sani; doing so risks severe debt traps and commercial paralysis."
    };

    // Next Favorable Window Dynamic Calculation (Transit Jupiter + Dasha)
    const dynamicTiming = calculateDynamicCareerTiming(dashaData, lagnaSignId, house10SignId, isTa);
    const nextWindowDates = dynamicTiming.nextWindowDates;
    const nextWindowTa = dynamicTiming.nextWindowTa;
    const nextWindowEn = dynamicTiming.nextWindowEn;

    // -------------------------------------------------------------
    // PART 5: CAREER YOGAS & REMEDIES
    // -------------------------------------------------------------
    const detectedYogas = [];
    if (occupants.h10.length >= 1) {
      detectedYogas.push({
        nameTa: "அமல யோகம் (Amala Yoga in 10th House)",
        nameEn: "Amala Yoga (Purity & Prestige in Profession)",
        descTa: "10-ம் பாவத்தில் சுப கிரக அமர்வு காரணமாக கறைபடாத புகழும், தொழிலில் நேர்மையான பெரும் வெற்றியும் உண்டாகும்.",
        descEn: "Benefic presence in the 10th house confers untarnished reputation and lasting professional excellence."
      });
    }

    if (lord10Code === house10Sign.lord) {
      detectedYogas.push({
        nameTa: "கர்ம ஜீவன அதிபதி ஆட்சி யோகம் (Strong 10th Lord)",
        nameEn: "10th Lord Dignity Yoga",
        descTa: "பத்தாம் அதிபதி பலம் பெற்றிருப்பதால் சுய கௌரவம், நிலையான தொழில் அடித்தளம் மற்றும் சமூக அந்தஸ்து என்றும் நிலைக்கும்.",
        descEn: "Strong 10th lord dignity secures self-respect, enduring commercial foundation, and continuous social prestige."
      });
    }

    detectedYogas.push({
      nameTa: "தர்மகர்மாதிபதி விசேஷ தொடர்பு (Dharma-Karma Axis)",
      nameEn: "Dharma-Karmadhipati Raja Yoga Connection",
      descTa: "9 மற்றும் 10-ம் பாவங்களின் சுப தொடர்பு காரணமாக அதிர்ஷ்டமும் கடின உழைப்பும் இணைந்து வாழ்வில் பெரும் பொருளாதார உயர்வை அளிக்கும்.",
      descEn: "Harmonious synergy between the 9th (Fortune) and 10th (Action) houses yields steady breakthroughs and affluent standing."
    });

    // Auspicious Day, Deity, Direction & Gemstone for Career
    const luckyDayMap = {
      Su: { dayTa: "ஞாயிறு", dayEn: "Sunday", deityTa: "சூரிய நாராயணர் / சிவன்", deityEn: "Lord Shiva & Surya", colorTa: "செம்மஞ்சள் / தங்கம்", colorEn: "Orange / Gold", stoneTa: "மாணிக்கம் (Ruby)", stoneEn: "Ruby" },
      Mo: { dayTa: "திங்கள்", dayEn: "Monday", deityTa: "பார்வதி தேவி / முருகன்", deityEn: "Goddess Parvati & Murugan", colorTa: "வெண்மை / கிரீம்", colorEn: "Pearl White / Cream", stoneTa: "முத்து (Pearl)", stoneEn: "Natural Pearl" },
      Ma: { dayTa: "செவ்வாய்", dayEn: "Tuesday", deityTa: "சுப்பிரமணியர் (முருகப்பெருமான்)", deityEn: "Lord Murugan", colorTa: "சிவப்பு / அரக்கு", colorEn: "Bright Red / Coral", stoneTa: "பவளம் (Red Coral)", stoneEn: "Red Coral" },
      Me: { dayTa: "புதன்", dayEn: "Wednesday", deityTa: "ஸ்ரீ மகாவிஷ்ணு / பெருமாள்", deityEn: "Lord Maha Vishnu", colorTa: "பச்சை / மரகதம்", colorEn: "Emerald Green", stoneTa: "மரகதம் (Emerald)", stoneEn: "Emerald" },
      Ju: { dayTa: "வியாழன்", dayEn: "Thursday", deityTa: "தட்சிணாமூர்த்தி / குரு பகவான்", deityEn: "Lord Dakshinamurthy", colorTa: "மஞ்சள் / பொன் நிறம்", colorEn: "Golden Yellow", stoneTa: "மஞ்சள் புஷ்பராகம் (Yellow Sapphire)", stoneEn: "Yellow Sapphire" },
      Ve: { dayTa: "வெள்ளி", dayEn: "Friday", deityTa: "மகாலட்சுமி தாயார்", deityEn: "Goddess Mahalakshmi", colorTa: "வெள்ளை / வெளிர் நீலம்", colorEn: "Diamond White / Rose", stoneTa: "வைரம் / வெண் புஷ்பராகம்", stoneEn: "Diamond / White Zircon" },
      Sa: { dayTa: "சனி", dayEn: "Saturday", deityTa: "வெங்கடாசலபதி / ஆஞ்சநேயர்", deityEn: "Lord Balaji & Hanuman", colorTa: "நீலம் / கருநீலம்", colorEn: "Royal Blue / Navy", stoneTa: "நீலக்கல் (Blue Sapphire)", stoneEn: "Blue Sapphire" }
    };

    const careerRemedies = luckyDayMap[lord10Code] || luckyDayMap["Me"];

    return {
      house10: {
        signId: house10SignId,
        signNameTa: house10Sign.ta,
        signNameEn: house10Sign.en,
        element: house10Sign.element,
        quality: house10Sign.quality,
        lord: lord10Code,
        lordNameTa: PLANET_NAMES[lord10Code]?.ta || lord10Code,
        lordNameEn: PLANET_NAMES[lord10Code]?.en || lord10Code,
        occupants: occupants.h10,
        occupantNamesTa: occupants.h10.map(c => PLANET_NAMES[c]?.ta || c).join(", ") || "கிரகங்கள் இல்லை (சுப பார்வை)",
        occupantNamesEn: occupants.h10.map(c => PLANET_NAMES[c]?.en || c).join(", ") || "None (Open Aspect)",
        subathuvam: subathuvam10,
        fieldSignatures: fieldSignatures10
      },
      house2: {
        signId: house2SignId,
        signNameTa: house2Sign.ta,
        signNameEn: house2Sign.en,
        element: house2Sign.element,
        lord: lord2Code,
        lordNameTa: PLANET_NAMES[lord2Code]?.ta || lord2Code,
        lordNameEn: PLANET_NAMES[lord2Code]?.en || lord2Code,
        occupants: occupants.h2,
        occupantNamesTa: occupants.h2.map(c => PLANET_NAMES[c]?.ta || c).join(", ") || "கிரகங்கள் இல்லை",
        occupantNamesEn: occupants.h2.map(c => PLANET_NAMES[c]?.en || c).join(", ") || "None",
        subathuvam: subathuvam2,
        fieldSignatures: fieldSignatures2
      },
      subathuvam10,
      subathuvam2,
      amatyakaraka: {
        code: amkCode,
        nameTa: PLANET_NAMES[amkCode]?.ta || amkCode,
        nameEn: PLANET_NAMES[amkCode]?.en || amkCode,
        symbol: PLANET_NAMES[amkCode]?.symbol || "⭐",
        signId: amkPlanet.signId,
        signNameTa: SIGN_NAMES[amkPlanet.signId]?.ta,
        signNameEn: SIGN_NAMES[amkPlanet.signId]?.en
      },
      jobVsBusiness: {
        jobScore,
        bizScore,
        verdictKey,
        verdictTitleTa,
        verdictTitleEn,
        verdictBadgeTa,
        verdictBadgeEn,
        verdictSummaryTa,
        verdictSummaryEn,
        recommendedPathTa,
        recommendedPathEn
      },
      dasaRule: {
        dasaLord: dLord,
        dasaLordTa: dInfo.ta,
        dasaLordEn: dInfo.en,
        bhuktiLord: bLord,
        bhuktiLordTa: bInfo.ta,
        bhuktiLordEn: bInfo.en,
        isYogaDasa,
        isAvayogaDasa,
        dasaNatureTa,
        dasaNatureEn,
        guidanceTa: dasaGuidanceTa,
        guidanceEn: dasaGuidanceEn,
        businessViability: dasaBizViability
      },
      timingPredictions: {
        jobTiming: jobTimingPrediction,
        businessTiming: businessTimingPrediction
      },
      topSectors,
      milestones,
      currentDashaForecast: {
        dashaTa: curDasha.ta,
        dashaEn: curDasha.en,
        bhuktiTa: curBhukti.ta,
        bhuktiEn: curBhukti.en,
        forecastTa: currentForecastTa,
        forecastEn: currentForecastEn,
        promotionProbability,
        jobChangeProbability,
        businessViability: dasaBizViability,
        nextWindowTa,
        nextWindowEn,
        nextWindowDates
      },
      educationLevel: eduLevel,
      educationLabelTa: currentEduMeta.ta,
      educationLabelEn: currentEduMeta.en,
      educationBadgeTa: currentEduMeta.badgeTa,
      educationBadgeEn: currentEduMeta.badgeEn,
      vidyaPrediction: {
        isAutoDeduced,
        house4SignNameTa: SIGN_NAMES[house4SignId].ta,
        house4SignNameEn: SIGN_NAMES[house4SignId].en,
        house4LordTa: PLANET_NAMES[SIGN_NAMES[house4SignId].lord].ta,
        house4LordEn: PLANET_NAMES[SIGN_NAMES[house4SignId].lord].en,
        planetsIn4thTa: occ4.map(c => PLANET_NAMES[c].ta).join(", ") || "கிரகங்கள் இல்லை (No planets)",
        planetsIn4thEn: occ4.map(c => PLANET_NAMES[c].en).join(", ") || "No planets",
        deducedEduLevel: eduLevel,
        deducedTitleTa,
        deducedTitleEn,
        reasoningTa: vidyaReasoningTa,
        reasoningEn: vidyaReasoningEn,
        rationaleTa: vidyaReasoningTa,
        rationaleEn: vidyaReasoningEn
      },
      yogas: detectedYogas,
      remedies: {
        luckyDayTa: careerRemedies.dayTa,
        luckyDayEn: careerRemedies.dayEn,
        deityTa: careerRemedies.deityTa,
        deityEn: careerRemedies.deityEn,
        colorTa: careerRemedies.colorTa,
        colorEn: careerRemedies.colorEn,
        stoneTa: careerRemedies.stoneTa,
        stoneEn: careerRemedies.stoneEn,
        directionTa: house10Sign.element === "Fire" ? "கிழக்கு (East)" : (house10Sign.element === "Earth" ? "தெற்கு (South)" : (house10Sign.element === "Air" ? "மேற்கு (West)" : "வடக்கு (North)")),
        directionEn: house10Sign.element === "Fire" ? "East" : (house10Sign.element === "Earth" ? "South" : (house10Sign.element === "Air" ? "West" : "North")),
        mantraTa: "ௐ ஶ்ரீம் ஹ்ரீம் க்லீம் மகாவிஷ்ணுவே நமஹ • ௐ நமோ நாராயணாய",
        mantraEn: "Om Shreem Hreem Kleem Maha Vishnave Namaha • Om Namo Narayanaya"
      }
    };
  }

  return {
    CAREER_SECTORS,
    evaluatePlanetSubathuvam,
    calculateCareerProfile,
    generateChartSpecificReasoning,
    prioritizeSectorRoles,
    calculateDynamicCareerTiming
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = CareerEngine;
if (typeof window !== "undefined") window.CareerEngine = CareerEngine;
if (typeof globalThis !== "undefined") globalThis.CareerEngine = CareerEngine;

