/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - TIME & MUHURTHAM ENGINE
 * Authentic Ancient Tamil Astrological Systems:
 * - பஞ்சபட்சி சாஸ்திரம் (Pancha Pakshi Shastra: 5 Birds, 5 Activities)
 * - ஜாமக்கோள் ஆரூடம் (Jamakkol Aaroodam: Udhayam, Aaroodam, Kavippu)
 * - 24-Hour Planetary Hora Timetable
 * - Gowri Panchangam & Auspicious Timings
 */

const MuhurthamEngine = (function () {
  // 5 Birds: Vulture, Owl, Crow, Cock, Peacock
  const BIRDS = [
    { id: 0, ta: "வல்லூறு", en: "Vulture", symbol: "🦅" },
    { id: 1, ta: "ஆந்தை", en: "Owl", symbol: "🦉" },
    { id: 2, ta: "காகம்", en: "Crow", symbol: "🦅" },
    { id: 3, ta: "கோழி", en: "Cock", symbol: "🐓" },
    { id: 4, ta: "மயில்", en: "Peacock", symbol: "🦚" }
  ];

  // 5 Activities
  const ACTIVITIES = [
    { id: 0, ta: "அரசு (Ruling)", en: "Ruling (King)", power: "100%", strength: "அதி உன்னதம் (Supreme)", color: "#10B981" },
    { id: 1, ta: "ஊண் (Eating)", en: "Eating (Nourishing)", power: "80%", strength: "சுபம் (Very Good)", color: "#3B82F6" },
    { id: 2, ta: "நடை (Walking)", en: "Walking (Moving)", power: "50%", strength: "மத்திமம் (Moderate)", color: "#F59E0B" },
    { id: 3, ta: "துயில் (Sleeping)", en: "Sleeping (Rest)", power: "20%", strength: "செயலற்றது (Inert)", color: "#8B5CF6" },
    { id: 4, ta: "சாவு (Dying)", en: "Dying (Static)", power: "0%", strength: "அசுபம் (Caution)", color: "#EF4444" }
  ];

  /**
   * Determine Birth Bird from Janma Nakshatra
   */
  function getBirthBird(nakshatraIndex) {
    // Standard mapping: 5 stars per bird in Shukla paksha
    // Ashwini-Mrigashirsha (0-4): Vulture
    // Ardra-Purva Phalguni (5-10): Owl
    // Uttara Phalguni-Vishakha (11-15): Crow
    // Anuradha-Shravana (16-21): Cock
    // Dhanishta-Revati (22-26): Peacock
    let birdIndex = 0;
    if (nakshatraIndex <= 4) birdIndex = 0;
    else if (nakshatraIndex <= 10) birdIndex = 1;
    else if (nakshatraIndex <= 15) birdIndex = 2;
    else if (nakshatraIndex <= 21) birdIndex = 3;
    else birdIndex = 4;

    const bird = BIRDS[birdIndex];

    // Current activity for the 5 daytime periods (each ~2.4 hours)
    const daySchedule = [
      { time: "06:00 - 08:24", act: ACTIVITIES[(birdIndex + 0) % 5] },
      { time: "08:24 - 10:48", act: ACTIVITIES[(birdIndex + 1) % 5] },
      { time: "10:48 - 13:12", act: ACTIVITIES[(birdIndex + 2) % 5] },
      { time: "13:12 - 15:36", act: ACTIVITIES[(birdIndex + 3) % 5] },
      { time: "15:36 - 18:00", act: ACTIVITIES[(birdIndex + 4) % 5] }
    ];

    const nightSchedule = [
      { time: "18:00 - 20:24", act: ACTIVITIES[(birdIndex + 2) % 5] },
      { time: "20:24 - 22:48", act: ACTIVITIES[(birdIndex + 3) % 5] },
      { time: "22:48 - 01:12", act: ACTIVITIES[(birdIndex + 4) % 5] },
      { time: "01:12 - 03:36", act: ACTIVITIES[(birdIndex + 0) % 5] },
      { time: "03:36 - 06:00", act: ACTIVITIES[(birdIndex + 1) % 5] }
    ];

    return {
      bird,
      daySchedule,
      nightSchedule,
      bestActivityTa: "அரசு மற்றும் ஊண் நேரங்களில் தொடங்கும் காரியங்கள் 100% வெற்றி பெறும்.",
      bestActivityEn: "Venture initiatives initiated during Ruling (Arasu) and Eating (Oon) periods achieve guaranteed triumph."
    };
  }

  /**
   * Jamakkol Aaroodam Engine (8 Jamams)
   * Real-time calculation of Udhayam, Aaroodam, and Kavippu (blind spot)
   */
  function calculateJamakkol() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // 8 Jamams in day (06:00 to 18:00 = 720 mins -> 90 mins each)
    let currentJamam = 1;
    if (totalMinutes >= 360 && totalMinutes < 1080) {
      currentJamam = Math.floor((totalMinutes - 360) / 90) + 1;
    } else {
      // Night jamam
      const nightMins = totalMinutes >= 1080 ? (totalMinutes - 1080) : (totalMinutes + 360);
      currentJamam = Math.floor(nightMins / 90) + 1;
    }

    // Udhayam Sign changes by Jamam
    const udhayamSignId = (currentJamam * 2) % 12;
    // Aaroodam Sign
    const aaroodamSignId = (udhayamSignId + 4) % 12;
    // Kavippu Sign (Blind spot / hurdle point)
    const kavippuSignId = (udhayamSignId + 6) % 12;

    const signs = AstroEngine.SIGN_NAMES;

    return {
      currentJamam,
      timeString: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      udhayam: {
        signId: udhayamSignId,
        ta: signs[udhayamSignId].ta,
        en: signs[udhayamSignId].en,
        meaningTa: "கேள்வி எழும் தொடக்கப் புள்ளி (Start Point)"
      },
      aaroodam: {
        signId: aaroodamSignId,
        ta: signs[aaroodamSignId].ta,
        en: signs[aaroodamSignId].en,
        meaningTa: "காரியத்தின் பலன் நிலை (Outcome)"
      },
      kavippu: {
        signId: kavippuSignId,
        ta: signs[kavippuSignId].ta,
        en: signs[kavippuSignId].en,
        meaningTa: "மறைமுக தடை / கவனிக்க வேண்டிய புள்ளி (Hidden Obstacle)"
      },
      verdictTa: "உதயம் சுப கிரக ராசியில் உள்ளதால் காரியம் எளிதில் கைகூடும். கவிப்பு உள்ள திசையில் விழிப்புணர்வு தேவை.",
      verdictEn: "Udhayam is well disposed assuring swift progress. Exercise caution in Kavippu directional realm."
    };
  }

  /**
   * 24-Hour Planetary Hora Timetable
   * Order of Horas: Sun -> Venus -> Mercury -> Moon -> Saturn -> Jupiter -> Mars
   */
  function calculateHoraTable() {
    const HORA_PLANETS = [
      { code: "Su", ta: "சூரியன்", en: "Sun", goodFor: "அரசு பணி, நிர்வாகம்" },
      { code: "Ve", ta: "சுக்கிரன்", en: "Venus", goodFor: "திருமணம், புதிய ஆடை, வாகனம்" },
      { code: "Me", ta: "புதன்", en: "Mercury", goodFor: "கல்வி, கணக்கு, வர்த்தகம்" },
      { code: "Mo", ta: "சந்திரன்", en: "Moon", goodFor: "பிரயாணம், கலை, தானம்" },
      { code: "Sa", ta: "சனி", en: "Saturn", goodFor: "இரும்பு, எண்ணெய், பழைய விவகாரம்" },
      { code: "Ju", ta: "குரு", en: "Jupiter", goodFor: "சுப காரியம், குரு தரிசனம், தங்கம்" },
      { code: "Ma", ta: "செவ்வாய்", en: "Mars", goodFor: "பூமி, நிலம், இயந்திர விவகாரம்" }
    ];

    const todayDay = new Date().getDay(); // 0: Sun, 1: Mon, ... 6: Sat
    // First hora of day belongs to the weekday lord
    const dayStartLords = [0, 3, 6, 2, 5, 1, 4]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
    const startIndex = dayStartLords[todayDay];

    const horas = [];
    for (let h = 0; h < 24; h++) {
      const horaIndex = (startIndex + h) % 7;
      const hourStart = (6 + h) % 24;
      const hourEnd = (hourStart + 1) % 24;
      const timeStr = `${hourStart.toString().padStart(2, '0')}:00 - ${hourEnd.toString().padStart(2, '0')}:00`;
      horas.push({
        hour: h + 1,
        time: timeStr,
        ...HORA_PLANETS[horaIndex]
      });
    }

    return horas;
  }

  /**
   * காலம் மற்றும் பாரம்பரிய கணக்கீடு: லக்ன தியாஜ்யம் (Lagna Tyajyam Calculation)
   * Shastra Rules:
   * - ஒவ்வொரு லக்னமும் 120 நிமிடம் (120 minutes total duration)
   * - 12 நிமிட தியாஜ்யம் ராசிக்கேற்ப முதல், நடு அல்லது கடைசிப் பகுதியில்:
   *   - முதல் (0 முதல் 12 நிமிடம்): மேஷம், ரிஷபம், கன்னி, தனுசு
   *   - நடு (தொடக்கத்திலிருந்து 54 நிமிடம் [60 - 6] முதல் 66 நிமிடம்): மிதுனம், சிம்மம், துலாம், கும்பம்
   *   - கடைசி (120 நிமிடத்தில் இறுதி 12 நிமிடம், 108 முதல் 120 வரை): கடகம், விருச்சிகம், மகரம், மீனம்
   * - இங்கு லக்னக் கோணம் கணிக்கப்படாது — தொடக்க நேரத்தை நீங்கள் உள்ளிடவும்.
   */
  const LAGNA_TYAJYAM_CONFIG = [
    { signId: 0, ta: "மேஷம்", en: "Aries", group: "first", groupTa: "முதல் பகுதி (0 - 12 நிமி)", startMin: 0, endMin: 12 },
    { signId: 1, ta: "ரிஷபம்", en: "Taurus", group: "first", groupTa: "முதல் பகுதி (0 - 12 நிமி)", startMin: 0, endMin: 12 },
    { signId: 2, ta: "மிதுனம்", en: "Gemini", group: "middle", groupTa: "நடுப் பகுதி (54 - 66 நிமி)", startMin: 54, endMin: 66 },
    { signId: 3, ta: "கடகம்", en: "Cancer", group: "last", groupTa: "கடைசிப் பகுதி (108 - 120 நிமி)", startMin: 108, endMin: 120 },
    { signId: 4, ta: "சிம்மம்", en: "Leo", group: "middle", groupTa: "நடுப் பகுதி (54 - 66 நிமி)", startMin: 54, endMin: 66 },
    { signId: 5, ta: "கன்னி", en: "Virgo", group: "first", groupTa: "முதல் பகுதி (0 - 12 நிமி)", startMin: 0, endMin: 12 },
    { signId: 6, ta: "துலாம்", en: "Libra", group: "middle", groupTa: "நடுப் பகுதி (54 - 66 நிமி)", startMin: 54, endMin: 66 },
    { signId: 7, ta: "விருச்சிகம்", en: "Scorpio", group: "last", groupTa: "கடைசிப் பகுதி (108 - 120 நிமி)", startMin: 108, endMin: 120 },
    { signId: 8, ta: "தனுசு", en: "Sagittarius", group: "first", groupTa: "முதல் பகுதி (0 - 12 நிமி)", startMin: 0, endMin: 12 },
    { signId: 9, ta: "மகரம்", en: "Capricorn", group: "last", groupTa: "கடைசிப் பகுதி (108 - 120 நிமி)", startMin: 108, endMin: 120 },
    { signId: 10, ta: "கும்பம்", en: "Aquarius", group: "middle", groupTa: "நடுப் பகுதி (54 - 66 நிமி)", startMin: 54, endMin: 66 },
    { signId: 11, ta: "மீனம்", en: "Pisces", group: "last", groupTa: "கடைசிப் பகுதி (108 - 120 நிமி)", startMin: 108, endMin: 120 }
  ];

  function calculateLagnaTyajyam(signInput, dateStr, timeStr) {
    let signId = 0;
    if (typeof signInput === "number") {
      signId = Math.max(0, Math.min(11, Math.floor(signInput)));
    } else if (typeof signInput === "string") {
      const s = signInput.trim().toLowerCase();
      const match = LAGNA_TYAJYAM_CONFIG.find(item => item.ta.toLowerCase() === s || item.en.toLowerCase() === s);
      if (match) signId = match.signId;
      else {
        const num = parseInt(signInput, 10);
        if (!isNaN(num) && num >= 0 && num <= 11) signId = num;
      }
    }

    const cfg = LAGNA_TYAJYAM_CONFIG[signId] || LAGNA_TYAJYAM_CONFIG[0];

    const today = new Date();
    const dStr = dateStr || today.toISOString().slice(0, 10);
    const tStr = timeStr || "06:00";

    const [yyyy, mm, dd] = dStr.split("-").map(Number);
    const [hh, min] = tStr.split(":").map(Number);

    const lagnaStartDate = new Date(yyyy, mm - 1, dd, hh, min, 0);
    const lagnaEndDate = new Date(lagnaStartDate.getTime() + 120 * 60 * 1000);

    const tyajyamStartDate = new Date(lagnaStartDate.getTime() + cfg.startMin * 60 * 1000);
    const tyajyamEndDate = new Date(lagnaStartDate.getTime() + cfg.endMin * 60 * 1000);

    const formatTime = (d) => {
      const h = d.getHours();
      const m = d.getMinutes();
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const h24Str = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      return {
        time24: `${h24Str}:${mStr}`,
        time12: `${String(h12).padStart(2, "0")}:${mStr} ${ampm}`,
        full: `${String(h12).padStart(2, "0")}:${mStr} ${ampm} (${h24Str}:${mStr})`
      };
    };

    const lagnaStartFmt = formatTime(lagnaStartDate);
    const lagnaEndFmt = formatTime(lagnaEndDate);
    const tyajyamStartFmt = formatTime(tyajyamStartDate);
    const tyajyamEndFmt = formatTime(tyajyamEndDate);

    let auspiciousWindows = [];
    let timelineSegments = [];

    if (cfg.group === "first") {
      timelineSegments = [
        { type: "tyajyam", label: "லக்ன தியாஜ்யம்", labelEn: "Tyajyam", startMin: 0, endMin: 12, duration: 12, widthPct: 10, color: "#E11D48", startTime: tyajyamStartFmt.time12, endTime: tyajyamEndFmt.time12 },
        { type: "auspicious", label: "சுப முகூர்த்த காலம்", labelEn: "Auspicious", startMin: 12, endMin: 120, duration: 108, widthPct: 90, color: "#10B981", startTime: tyajyamEndFmt.time12, endTime: lagnaEndFmt.time12 }
      ];
      auspiciousWindows = [
        { title: "சுப முகூர்த்தக் காலம் (முழுமையான நற்பொழுது)", duration: "108 நிமிடங்கள்", startTime: tyajyamEndFmt.full, endTime: lagnaEndFmt.full, status: "உத்தம சுபம் (100% Auspicious)", note: "தியாஜ்ய நச்சு நாழிகைகள் முடிந்த பின் லக்னத்தின் இறுதி வரை உள்ள முழு நேரம் சுப காரியங்களுக்கு மிகச் சிறந்தது." }
      ];
    } else if (cfg.group === "middle") {
      const w1End = formatTime(tyajyamStartDate);
      const w2Start = formatTime(tyajyamEndDate);
      timelineSegments = [
        { type: "auspicious", label: "சுப காலம் (பகுதி 1)", labelEn: "Auspicious (Part 1)", startMin: 0, endMin: 54, duration: 54, widthPct: 45, color: "#10B981", startTime: lagnaStartFmt.time12, endTime: w1End.time12 },
        { type: "tyajyam", label: "லக்ன தியாஜ்யம்", labelEn: "Tyajyam (Middle)", startMin: 54, endMin: 66, duration: 12, widthPct: 10, color: "#E11D48", startTime: tyajyamStartFmt.time12, endTime: tyajyamEndFmt.time12 },
        { type: "auspicious", label: "சுப காலம் (பகுதி 2)", labelEn: "Auspicious (Part 2)", startMin: 66, endMin: 120, duration: 54, widthPct: 45, color: "#10B981", startTime: w2Start.time12, endTime: lagnaEndFmt.time12 }
      ];
      auspiciousWindows = [
        { title: "ஆரம்ப சுபக் காலம் (பகுதி 1)", duration: "54 நிமிடங்கள்", startTime: lagnaStartFmt.full, endTime: w1End.full, status: "சுபம் (Auspicious)", note: "லக்னம் தொடங்கியதிலிருந்து 54 நிமிடங்கள் வரை சுப காரியங்களை முன்னெடுக்கலாம்." },
        { title: "பிந்தைய சுபக் காலம் (பகுதி 2)", duration: "54 நிமிடங்கள்", startTime: w2Start.full, endTime: lagnaEndFmt.full, status: "சுபம் (Auspicious)", note: "நடுப்பகுதி தியாஜ்யம் விலகிய பின் 66-வது நிமிடம் முதல் லக்ன முடிவு வரை நற்பலன் தரும்." }
      ];
    } else {
      const wEnd = formatTime(tyajyamStartDate);
      timelineSegments = [
        { type: "auspicious", label: "சுப முகூர்த்த காலம்", labelEn: "Auspicious", startMin: 0, endMin: 108, duration: 108, widthPct: 90, color: "#10B981", startTime: lagnaStartFmt.time12, endTime: wEnd.time12 },
        { type: "tyajyam", label: "லக்ன தியாஜ்யம்", labelEn: "Tyajyam (Final)", startMin: 108, endMin: 120, duration: 12, widthPct: 10, color: "#E11D48", startTime: tyajyamStartFmt.time12, endTime: tyajyamEndFmt.time12 }
      ];
      auspiciousWindows = [
        { title: "முதன்மையான சுப முகூர்த்தக் காலம்", duration: "108 நிமிடங்கள்", startTime: lagnaStartFmt.full, endTime: wEnd.full, status: "உத்தம சுபம் (100% Auspicious)", note: "லக்னம் தொடங்கியதிலிருந்து முதல் 108 நிமிடங்கள் வரை முழுமையான சுப முகூர்த்த காலமாகும்; இறுதி 12 நிமிடங்களை மட்டும் தவிர்க்க வேண்டும்." }
      ];
    }

    const allSignsTable = LAGNA_TYAJYAM_CONFIG.map(item => {
      const tStart = new Date(lagnaStartDate.getTime() + item.startMin * 60 * 1000);
      const tEnd = new Date(lagnaStartDate.getTime() + item.endMin * 60 * 1000);
      return {
        ...item,
        isCurrent: item.signId === signId,
        tyajyamStartFmt: formatTime(tStart),
        tyajyamEndFmt: formatTime(tEnd)
      };
    });

    return {
      signId,
      signNameTa: cfg.ta,
      signNameEn: cfg.en,
      dateStr: dStr,
      timeStr: tStr,
      group: cfg.group,
      groupTa: cfg.groupTa,
      startMin: cfg.startMin,
      endMin: cfg.endMin,
      durationMinutes: 120,
      tyajyamDurationMinutes: 12,
      auspiciousDurationMinutes: 108,
      lagnaStartTime: lagnaStartFmt,
      lagnaEndTime: lagnaEndFmt,
      tyajyamStartTime: tyajyamStartFmt,
      tyajyamEndTime: tyajyamEndFmt,
      timelineSegments,
      auspiciousWindows,
      allSignsTable,
      verdictTa: `தேர்வு செய்த ${cfg.ta} லக்னத்தின் மொத்த கால அளவு 120 நிமிடங்கள் (${lagnaStartFmt.full} முதல் ${lagnaEndFmt.full} வரை). இதில் தியாஜ்யம் ${cfg.groupTa}வில் (${cfg.startMin} முதல் ${cfg.endMin} நிமிடம் வரை) ${tyajyamStartFmt.full} முதல் ${tyajyamEndFmt.full} வரை அமைகிறது. இந்த 12 நிமிடங்களை சுப முகூர்த்தங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்.`
    };
  }

  // ==========================================
  // காலம் மற்றும் பாரம்பரிய கணக்கீடு: நட்சத்திர தியாஜ்யம்
  // (Nakshatra Tyajyam / Visha Ghatika: 4 நாழிகை / 96 நிமிடம்)
  // தியாஜ்யம் = நட்சத்திர காலம் × பின்னம்; நீளம் 4 நாழிகை.
  // ==========================================
  const NAKSHATRA_TYAJYAM_CONFIG = [
    { id: 0, num: 1, ta: "அசுவினி", en: "Ashwini", ghatikas: 50, fractionText: "5/6", numerator: 5, denominator: 6 },
    { id: 1, num: 2, ta: "பரணி", en: "Bharani", ghatikas: 24, fractionText: "2/5", numerator: 2, denominator: 5 },
    { id: 2, num: 3, ta: "கிருத்திகை", en: "Krittika", ghatikas: 30, fractionText: "1/2", numerator: 1, denominator: 2 },
    { id: 3, num: 4, ta: "ரோகிணி", en: "Rohini", ghatikas: 40, fractionText: "2/3", numerator: 2, denominator: 3 },
    { id: 4, num: 5, ta: "மிருகசீரிடம்", en: "Mrigashira", ghatikas: 14, fractionText: "7/30", numerator: 7, denominator: 30 },
    { id: 5, num: 6, ta: "திருவாதிரை", en: "Ardra", ghatikas: 11, fractionText: "11/60", numerator: 11, denominator: 60 },
    { id: 6, num: 7, ta: "புனர்பூசம்", en: "Punarvasu", ghatikas: 30, fractionText: "1/2", numerator: 1, denominator: 2 },
    { id: 7, num: 8, ta: "பூசம்", en: "Pushya", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 8, num: 9, ta: "ஆயில்யம்", en: "Ashlesha", ghatikas: 32, fractionText: "8/15", numerator: 8, denominator: 15 },
    { id: 9, num: 10, ta: "மகம்", en: "Magha", ghatikas: 30, fractionText: "1/2", numerator: 1, denominator: 2 },
    { id: 10, num: 11, ta: "பூரம்", en: "Purva Phalguni", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 11, num: 12, ta: "உத்திரம்", en: "Uttara Phalguni", ghatikas: 18, fractionText: "3/10", numerator: 3, denominator: 10 },
    { id: 12, num: 13, ta: "அஸ்தம்", en: "Hasta", ghatikas: 22, fractionText: "11/30", numerator: 11, denominator: 30 },
    { id: 13, num: 14, ta: "சித்திரை", en: "Chitra", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 14, num: 15, ta: "சுவாதி", en: "Swati", ghatikas: 14, fractionText: "7/30", numerator: 7, denominator: 30 },
    { id: 15, num: 16, ta: "விசாகம்", en: "Vishakha", ghatikas: 14, fractionText: "7/30", numerator: 7, denominator: 30 },
    { id: 16, num: 17, ta: "அனுஷம்", en: "Anuradha", ghatikas: 10, fractionText: "1/6", numerator: 1, denominator: 6 },
    { id: 17, num: 18, ta: "கேட்டை", en: "Jyeshtha", ghatikas: 14, fractionText: "7/30", numerator: 7, denominator: 30 },
    { id: 18, num: 19, ta: "மூலம்", en: "Mula", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 19, num: 20, ta: "பூராடம்", en: "Purva Ashadha", ghatikas: 24, fractionText: "2/5", numerator: 2, denominator: 5 },
    { id: 20, num: 21, ta: "உத்திராடம்", en: "Uttara Ashadha", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 21, num: 22, ta: "திருவோணம்", en: "Shravana", ghatikas: 10, fractionText: "1/6", numerator: 1, denominator: 6 },
    { id: 22, num: 23, ta: "அவிட்டம்", en: "Dhanishta", ghatikas: 10, fractionText: "1/6", numerator: 1, denominator: 6 },
    { id: 23, num: 24, ta: "சதயம்", en: "Shatabhisha", ghatikas: 18, fractionText: "3/10", numerator: 3, denominator: 10 },
    { id: 24, num: 25, ta: "பூரட்டாதி", en: "Purva Bhadrapada", ghatikas: 16, fractionText: "4/15", numerator: 4, denominator: 15 },
    { id: 25, num: 26, ta: "உத்திரட்டாதி", en: "Uttara Bhadrapada", ghatikas: 24, fractionText: "2/5", numerator: 2, denominator: 5 },
    { id: 26, num: 27, ta: "ரேவதி", en: "Revati", ghatikas: 30, fractionText: "1/2", numerator: 1, denominator: 2 }
  ];

  function calculateNakshatraTyajyam(nakshatraInput, startDateStr, startTimeStr, endDateStr, endTimeStr) {
    let nakshatraId = 0;
    if (typeof nakshatraInput === "number") {
      nakshatraId = Math.max(0, Math.min(26, Math.floor(nakshatraInput)));
    } else if (typeof nakshatraInput === "string") {
      const s = nakshatraInput.trim().toLowerCase();
      const match = NAKSHATRA_TYAJYAM_CONFIG.find(item => item.ta.toLowerCase() === s || item.en.toLowerCase() === s);
      if (match) nakshatraId = match.id;
      else {
        const num = parseInt(nakshatraInput, 10);
        if (!isNaN(num) && num >= 0 && num <= 26) nakshatraId = num;
      }
    }

    const cfg = NAKSHATRA_TYAJYAM_CONFIG[nakshatraId] || NAKSHATRA_TYAJYAM_CONFIG[0];

    const today = new Date();
    const sDate = startDateStr || today.toISOString().slice(0, 10);
    const sTime = startTimeStr || "06:00";

    const [sY, sM, sD] = sDate.split("-").map(Number);
    const [sH, sMin] = sTime.split(":").map(Number);
    const startDt = new Date(sY, sM - 1, sD, sH, sMin, 0);

    let endDt = null;
    if (endDateStr && endTimeStr) {
      const [eY, eM, eD] = endDateStr.split("-").map(Number);
      const [eH, eMin] = endTimeStr.split(":").map(Number);
      endDt = new Date(eY, eM - 1, eD, eH, eMin, 0);
    }

    // Default to 24 hours (60 Nazhigais) if end is missing or before/equal to startDt
    if (!endDt || endDt.getTime() <= startDt.getTime()) {
      endDt = new Date(startDt.getTime() + 24 * 60 * 60 * 1000);
    }

    const totalMinutes = Math.round((endDt.getTime() - startDt.getTime()) / 60000);
    const totalNazhigai = +(totalMinutes / 24).toFixed(2);
    const totalHours = +(totalMinutes / 60).toFixed(2);

    // பாரம்பரிய சூத்திரம்: தியாஜ்யம் = காலம் × பின்னம்
    const fraction = cfg.ghatikas / 60;
    const tyajyamStartOffsetMinutes = Math.round(totalMinutes * fraction);
    const tyajyamStartDate = new Date(startDt.getTime() + tyajyamStartOffsetMinutes * 60000);

    // நீளம் 4 நாழிகை (96 நிமிடம்) - விகிதாசாரப்படி: totalMinutes * (4 / 60)
    const tyajyamDurationMinutes = Math.round(totalMinutes * (4 / 60));
    const tyajyamNazhigai = +(tyajyamDurationMinutes / 24).toFixed(2);
    const tyajyamEndDate = new Date(tyajyamStartDate.getTime() + tyajyamDurationMinutes * 60000);

    const formatDt = (d) => {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = d.getHours();
      const m = d.getMinutes();
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const h24Str = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      return {
        dateYmd: `${y}-${mo}-${day}`,
        dateDisplay: `${day}-${mo}-${y}`,
        time24: `${h24Str}:${mStr}`,
        time12: `${String(h12).padStart(2, "0")}:${mStr} ${ampm}`,
        full: `${day}/${mo}/${y} ${String(h12).padStart(2, "0")}:${mStr} ${ampm} (${h24Str}:${mStr})`,
        short: `${day}/${mo} ${String(h12).padStart(2, "0")}:${mStr} ${ampm}`
      };
    };

    const startFmt = formatDt(startDt);
    const endFmt = formatDt(endDt);
    const tyajyamStartFmt = formatDt(tyajyamStartDate);
    const tyajyamEndFmt = formatDt(tyajyamEndDate);

    const p1Pct = +((tyajyamStartOffsetMinutes / totalMinutes) * 100).toFixed(1);
    const p2Pct = +((tyajyamDurationMinutes / totalMinutes) * 100).toFixed(1);
    const p3Pct = +(100 - p1Pct - p2Pct).toFixed(1);

    const timelineSegments = [
      {
        type: "auspicious",
        label: "முன்பகுதி சுப காலம்",
        labelEn: "Pre-Tyajyam Auspicious",
        startMin: 0,
        endMin: tyajyamStartOffsetMinutes,
        duration: tyajyamStartOffsetMinutes,
        widthPct: p1Pct,
        color: "#10B981",
        startTime: startFmt.short,
        endTime: tyajyamStartFmt.short
      },
      {
        type: "tyajyam",
        label: `நட்சத்திர தியாஜ்யம் (${cfg.fractionText})`,
        labelEn: "Nakshatra Tyajyam (4 Nazhigai)",
        startMin: tyajyamStartOffsetMinutes,
        endMin: tyajyamStartOffsetMinutes + tyajyamDurationMinutes,
        duration: tyajyamDurationMinutes,
        widthPct: p2Pct,
        color: "#E11D48",
        startTime: tyajyamStartFmt.short,
        endTime: tyajyamEndFmt.short
      },
      {
        type: "auspicious",
        label: "பின்பகுதி சுப காலம்",
        labelEn: "Post-Tyajyam Auspicious",
        startMin: tyajyamStartOffsetMinutes + tyajyamDurationMinutes,
        endMin: totalMinutes,
        duration: totalMinutes - (tyajyamStartOffsetMinutes + tyajyamDurationMinutes),
        widthPct: p3Pct,
        color: "#10B981",
        startTime: tyajyamEndFmt.short,
        endTime: endFmt.short
      }
    ];

    const preDurationMins = tyajyamStartOffsetMinutes;
    const postDurationMins = totalMinutes - (tyajyamStartOffsetMinutes + tyajyamDurationMinutes);

    const auspiciousWindows = [
      {
        title: "முன்பகுதி சுப முகூர்த்தக் காலம்",
        duration: `${preDurationMins} நிமிடங்கள் (${(preDurationMins / 24).toFixed(1)} நாழிகை)`,
        startTime: startFmt.full,
        endTime: tyajyamStartFmt.full,
        status: "சுபம் (Auspicious)",
        note: "நட்சத்திரத்தின் தொடக்கம் முதல் தியாஜ்ய நச்சு நாழிகை தொடங்கும் வரை சுப காரியங்களைச் செய்யலாம்."
      },
      {
        title: "தியாஜ்ய நச்சுப் பொழுது (விலக்கப்பட வேண்டிய காலம்)",
        duration: `${tyajyamDurationMinutes} நிமிடங்கள் (${tyajyamNazhigai} நாழிகை)`,
        startTime: tyajyamStartFmt.full,
        endTime: tyajyamEndFmt.full,
        status: "அசுபம் / நச்சு நாழிகை (Strictly Inauspicious)",
        note: "சாஸ்திரப்படி 4 நாழிகைகள் (96 நிமிடங்கள்) நச்சுக்காலமாகும். இக்காலத்தில் சுப முகூர்த்தம், விவாகம், புதுமனை புகுதல், பிரயாணம் கூடாது."
      },
      {
        title: "பின்பகுதி சுப முகூர்த்தக் காலம்",
        duration: `${postDurationMins} நிமிடங்கள் (${(postDurationMins / 24).toFixed(1)} நாழிகை)`,
        startTime: tyajyamEndFmt.full,
        endTime: endFmt.full,
        status: "சுபம் (Auspicious)",
        note: "தியாஜ்யம் முடிவுற்ற பின் நட்சத்திரத்தின் இறுதி வரை உள்ள காலம் மங்களகரமானது."
      }
    ];

    const allNakshatrasTable = NAKSHATRA_TYAJYAM_CONFIG.map(item => {
      const frac = item.ghatikas / 60;
      const startOff = Math.round(totalMinutes * frac);
      const sD = new Date(startDt.getTime() + startOff * 60000);
      const eD = new Date(sD.getTime() + tyajyamDurationMinutes * 60000);
      return {
        nakshatraId: item.id,
        num: item.num,
        ta: item.ta,
        en: item.en,
        ghatikas: item.ghatikas,
        fractionText: item.fractionText,
        startOffsetMinutes: startOff,
        isCurrent: item.id === cfg.id,
        tyajyamStartFmt: formatDt(sD),
        tyajyamEndFmt: formatDt(eD)
      };
    });

    return {
      nakshatraId: cfg.id,
      nakshatraNum: cfg.num,
      nakshatraTa: cfg.ta,
      nakshatraEn: cfg.en,
      ghatikas: cfg.ghatikas,
      fractionText: cfg.fractionText,
      totalMinutes,
      totalNazhigai,
      totalHours,
      tyajyamDurationMinutes,
      tyajyamNazhigai,
      nakshatraStartTime: startFmt,
      nakshatraEndTime: endFmt,
      tyajyamStartTime: tyajyamStartFmt,
      tyajyamEndTime: tyajyamEndFmt,
      timelineSegments,
      auspiciousWindows,
      allNakshatrasTable,
      verdictTa: `தேர்வு செய்த ${cfg.ta} நட்சத்திரத்தின் மொத்த ஓட்டக் காலம் ${totalMinutes} நிமிடங்கள் (${totalHours} மணி / ${totalNazhigai} நாழிகை). இதன் தியாஜ்ய பின்னம் ${cfg.fractionText} (${cfg.ghatikas} நாழிகை). அதன்படி தியாஜ்ய காலம் ${tyajyamStartFmt.full} முதல் ${tyajyamEndFmt.full} வரை (4 நாழிகை / ${tyajyamDurationMinutes} நிமிடங்கள்) அமைகிறது. இந்த நச்சு நாழிகையை சுப காரியங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்.`
    };
  }

  // ==========================================
  // திதி தியாஜ்யம் (Tithi Tyajyam / Visha Ghatika)
  // பாரம்பரிய முறைப்படி 16 திதிகளின் தியாஜ்ய நாழிகைகள் & பின்னங்கள் (பழைய அட்டவணை).
  // பிரதமை 5/6 முதல் அமாவாசை 7/30 வரை.
  // தியாஜ்யம் = திதி காலம் × பின்னம்; நீளம் 4 நாழிகை (96 நிமிடம்).
  // ==========================================
  const TITHI_TYAJYAM_CONFIG = [
    { id: 0, num: 1, ta: "பிரதமை", en: "Prathama", ghatikas: 50, fractionText: "5/6", numerator: 5, denominator: 6 },
    { id: 1, num: 2, ta: "த்விதியை", en: "Dvitiya", ghatikas: 40, fractionText: "2/3", numerator: 2, denominator: 3 },
    { id: 2, num: 3, ta: "த்ருதியை", en: "Tritiya", ghatikas: 30, fractionText: "1/2", numerator: 1, denominator: 2 },
    { id: 3, num: 4, ta: "சதுர்த்தி", en: "Chaturthi", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 4, num: 5, ta: "பஞ்சமி", en: "Panchami", ghatikas: 24, fractionText: "2/5", numerator: 2, denominator: 5 },
    { id: 5, num: 6, ta: "ஷஷ்டி", en: "Shashthi", ghatikas: 15, fractionText: "1/4", numerator: 1, denominator: 4 },
    { id: 6, num: 7, ta: "சப்தமி", en: "Saptami", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 7, num: 8, ta: "அஷ்டமி", en: "Ashtami", ghatikas: 25, fractionText: "5/12", numerator: 5, denominator: 12 },
    { id: 8, num: 9, ta: "நவமி", en: "Navami", ghatikas: 30, fractionText: "1/2", numerator: 1, denominator: 2 },
    { id: 9, num: 10, ta: "தசமி", en: "Dashami", ghatikas: 24, fractionText: "2/5", numerator: 2, denominator: 5 },
    { id: 10, num: 11, ta: "ஏகாதசி", en: "Ekadashi", ghatikas: 12, fractionText: "1/5", numerator: 1, denominator: 5 },
    { id: 11, num: 12, ta: "துவாதசி", en: "Dvadashi", ghatikas: 20, fractionText: "1/3", numerator: 1, denominator: 3 },
    { id: 12, num: 13, ta: "திரயோதசி", en: "Trayodashi", ghatikas: 15, fractionText: "1/4", numerator: 1, denominator: 4 },
    { id: 13, num: 14, ta: "சதுர்த்தசி", en: "Chaturdashi", ghatikas: 18, fractionText: "3/10", numerator: 3, denominator: 10 },
    { id: 14, num: 15, ta: "பௌர்ணமி", en: "Pournami", ghatikas: 10, fractionText: "1/6", numerator: 1, denominator: 6 },
    { id: 15, num: 16, ta: "அமாவாசை", en: "Amavasya", ghatikas: 14, fractionText: "7/30", numerator: 7, denominator: 30 }
  ];

  function calculateTithiTyajyam(tithiInput, startDateStr, startTimeStr, endDateStr, endTimeStr) {
    let tithiId = 0;
    if (typeof tithiInput === "number") {
      tithiId = Math.max(0, Math.min(15, Math.floor(tithiInput)));
    } else if (typeof tithiInput === "string") {
      const s = tithiInput.trim().toLowerCase();
      const match = TITHI_TYAJYAM_CONFIG.find(item => item.ta.toLowerCase() === s || item.en.toLowerCase() === s);
      if (match) tithiId = match.id;
      else {
        const num = parseInt(tithiInput, 10);
        if (!isNaN(num) && num >= 0 && num <= 15) tithiId = num;
      }
    }

    const cfg = TITHI_TYAJYAM_CONFIG[tithiId] || TITHI_TYAJYAM_CONFIG[0];

    const today = new Date();
    const sDate = startDateStr || today.toISOString().slice(0, 10);
    const sTime = startTimeStr || "06:00";

    const [sY, sM, sD] = sDate.split("-").map(Number);
    const [sH, sMin] = sTime.split(":").map(Number);
    const startDt = new Date(sY, sM - 1, sD, sH, sMin, 0);

    let endDt = null;
    let isValid = true;
    let validationError = "";

    if (endDateStr && endTimeStr) {
      const [eY, eM, eD] = endDateStr.split("-").map(Number);
      const [eH, eMin] = endTimeStr.split(":").map(Number);
      endDt = new Date(eY, eM - 1, eD, eH, eMin, 0);
    }

    // முடிவு நேரம் தொடக்கத்தை விட பிறகு இருக்க வேண்டும்
    if (!endDt || endDt.getTime() <= startDt.getTime()) {
      isValid = false;
      validationError = "முடிவு நேரம் தொடக்கத்தை விட பிறகு இருக்க வேண்டும்.";
      // மாதிரி கணக்கீட்டிற்கு 24 மணி நேரத்தை (60 நாழிகை) எடுத்துக்கொள்வோம்
      endDt = new Date(startDt.getTime() + 24 * 60 * 60 * 1000);
    }

    const totalMinutes = Math.round((endDt.getTime() - startDt.getTime()) / 60000);
    const totalNazhigai = +(totalMinutes / 24).toFixed(2);
    const totalHours = +(totalMinutes / 60).toFixed(2);

    // பாரம்பரிய நாழிகை-பின்ன இயந்திரம்: தியாஜ்யம் = காலம் × பின்னம்
    const fraction = cfg.ghatikas / 60;
    const tyajyamStartOffsetMinutes = Math.round(totalMinutes * fraction);
    const tyajyamStartDate = new Date(startDt.getTime() + tyajyamStartOffsetMinutes * 60000);

    // நீளம் 4 நாழிகை (96 நிமிடம்) - விகிதாசாரப்படி: totalMinutes * (4 / 60)
    const tyajyamDurationMinutes = Math.round(totalMinutes * (4 / 60));
    const tyajyamNazhigai = +(tyajyamDurationMinutes / 24).toFixed(2);
    const tyajyamEndDate = new Date(tyajyamStartDate.getTime() + tyajyamDurationMinutes * 60000);

    const formatDt = (d) => {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = d.getHours();
      const m = d.getMinutes();
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const h24Str = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      return {
        dateYmd: `${y}-${mo}-${day}`,
        dateDisplay: `${day}-${mo}-${y}`,
        time24: `${h24Str}:${mStr}`,
        time12: `${String(h12).padStart(2, "0")}:${mStr} ${ampm}`,
        full: `${day}/${mo}/${y} ${String(h12).padStart(2, "0")}:${mStr} ${ampm} (${h24Str}:${mStr})`,
        short: `${day}/${mo} ${String(h12).padStart(2, "0")}:${mStr} ${ampm}`
      };
    };

    const startFmt = formatDt(startDt);
    const endFmt = formatDt(endDt);
    const tyajyamStartFmt = formatDt(tyajyamStartDate);
    const tyajyamEndFmt = formatDt(tyajyamEndDate);

    const p1Pct = +((tyajyamStartOffsetMinutes / totalMinutes) * 100).toFixed(1);
    const p2Pct = +((tyajyamDurationMinutes / totalMinutes) * 100).toFixed(1);
    const p3Pct = +(100 - p1Pct - p2Pct).toFixed(1);

    const timelineSegments = [
      {
        type: "auspicious",
        label: "முன்பகுதி சுப காலம்",
        labelEn: "Pre-Tyajyam Auspicious",
        startMin: 0,
        endMin: tyajyamStartOffsetMinutes,
        duration: tyajyamStartOffsetMinutes,
        widthPct: p1Pct,
        color: "#10B981",
        startTime: startFmt.short,
        endTime: tyajyamStartFmt.short
      },
      {
        type: "tyajyam",
        label: `திதி தியாஜ்யம் (${cfg.fractionText})`,
        labelEn: "Tithi Tyajyam (4 Nazhigai)",
        startMin: tyajyamStartOffsetMinutes,
        endMin: tyajyamStartOffsetMinutes + tyajyamDurationMinutes,
        duration: tyajyamDurationMinutes,
        widthPct: p2Pct,
        color: "#E11D48",
        startTime: tyajyamStartFmt.short,
        endTime: tyajyamEndFmt.short
      },
      {
        type: "auspicious",
        label: "பின்பகுதி சுப காலம்",
        labelEn: "Post-Tyajyam Auspicious",
        startMin: tyajyamStartOffsetMinutes + tyajyamDurationMinutes,
        endMin: totalMinutes,
        duration: totalMinutes - (tyajyamStartOffsetMinutes + tyajyamDurationMinutes),
        widthPct: p3Pct,
        color: "#10B981",
        startTime: tyajyamEndFmt.short,
        endTime: endFmt.short
      }
    ];

    const preDurationMins = tyajyamStartOffsetMinutes;
    const postDurationMins = totalMinutes - (tyajyamStartOffsetMinutes + tyajyamDurationMinutes);

    const auspiciousWindows = [
      {
        title: "முன்பகுதி சுப முகூர்த்தக் காலம்",
        duration: `${preDurationMins} நிமிடங்கள் (${(preDurationMins / 24).toFixed(1)} நாழிகை)`,
        startTime: startFmt.full,
        endTime: tyajyamStartFmt.full,
        status: "சுபம் (Auspicious)",
        note: "திதியின் தொடக்கம் முதல் தியாஜ்ய நச்சு நாழிகை தொடங்கும் வரை சுப காரியங்களைச் செய்யலாம்."
      },
      {
        title: "திதி தியாஜ்ய நச்சுப் பொழுது (விலக்கப்பட வேண்டிய காலம்)",
        duration: `${tyajyamDurationMinutes} நிமிடங்கள் (${tyajyamNazhigai} நாழிகை)`,
        startTime: tyajyamStartFmt.full,
        endTime: tyajyamEndFmt.full,
        status: "அசுபம் / நச்சு நாழிகை (Strictly Inauspicious)",
        note: "சாஸ்திரப்படி 4 நாழிகைகள் (96 நிமிடங்கள்) நச்சுக்காலமாகும். இக்காலத்தில் சுப முகூர்த்தம், விவாகம், புதுமனை புகுதல், பிரயாணம் கூடாது."
      },
      {
        title: "பின்பகுதி சுப முகூர்த்தக் காலம்",
        duration: `${postDurationMins} நிமிடங்கள் (${(postDurationMins / 24).toFixed(1)} நாழிகை)`,
        startTime: tyajyamEndFmt.full,
        endTime: endFmt.full,
        status: "சுபம் (Auspicious)",
        note: "திதி தியாஜ்யம் முடிவுற்ற பின் திதியின் இறுதி வரை உள்ள காலம் மங்களகரமானது."
      }
    ];

    const allTithisTable = TITHI_TYAJYAM_CONFIG.map(item => {
      const frac = item.ghatikas / 60;
      const startOff = Math.round(totalMinutes * frac);
      const sD = new Date(startDt.getTime() + startOff * 60000);
      const eD = new Date(sD.getTime() + tyajyamDurationMinutes * 60000);
      return {
        tithiId: item.id,
        num: item.num,
        ta: item.ta,
        en: item.en,
        ghatikas: item.ghatikas,
        fractionText: item.fractionText,
        startOffsetMinutes: startOff,
        isCurrent: item.id === cfg.id,
        tyajyamStartFmt: formatDt(sD),
        tyajyamEndFmt: formatDt(eD)
      };
    });

    return {
      tithiId: cfg.id,
      tithiNum: cfg.num,
      tithiTa: cfg.ta,
      tithiEn: cfg.en,
      ghatikas: cfg.ghatikas,
      fractionText: cfg.fractionText,
      totalMinutes,
      totalNazhigai,
      totalHours,
      tyajyamDurationMinutes,
      tyajyamNazhigai,
      tithiStartTime: startFmt,
      tithiEndTime: endFmt,
      tyajyamStartTime: tyajyamStartFmt,
      tyajyamEndTime: tyajyamEndFmt,
      timelineSegments,
      auspiciousWindows,
      allTithisTable,
      isValid,
      validationError,
      verdictTa: `தேர்வு செய்த ${cfg.ta} திதியின் மொத்த ஓட்டக் காலம் ${totalMinutes} நிமிடங்கள் (${totalHours} மணி / ${totalNazhigai} நாழிகை). இதன் தியாஜ்ய பின்னம் ${cfg.fractionText} (${cfg.ghatikas} நாழிகை). அதன்படி தியாஜ்ய காலம் ${tyajyamStartFmt.full} முதல் ${tyajyamEndFmt.full} வரை (4 நாழிகை / ${tyajyamDurationMinutes} நிமிடங்கள்) அமைகிறது. இந்த நச்சு நாழிகையை சுப காரியங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்.`
    };
  }

  // ==========================================
  // வார தியாஜ்யம் (Vara Tyajyam / Weekday Tyajyam)
  // ஒவ்வொரு கிழமைக்கும் சூரிய உதயத்திலிருந்து நிலையான நாழிகை.
  // தியாஜ்யம் 90 நிமிடம் (3.75 நாழிகை).
  // ஞாயிறு 32, திங்கள் 42, செவ்வாய் 31, புதன் 42, வியாழன் 31, வெள்ளி 21, சனி 14.
  // ==========================================
  const VARA_TYAJYAM_CONFIG = [
    { id: 0, num: 1, ta: "ஞாயிறு", en: "Sunday", ghatikas: 32, offsetMinutes: 768, durationMinutes: 90, durationNazhigai: 3.75 },
    { id: 1, num: 2, ta: "திங்கள்", en: "Monday", ghatikas: 42, offsetMinutes: 1008, durationMinutes: 90, durationNazhigai: 3.75 },
    { id: 2, num: 3, ta: "செவ்வாய்", en: "Tuesday", ghatikas: 31, offsetMinutes: 744, durationMinutes: 90, durationNazhigai: 3.75 },
    { id: 3, num: 4, ta: "புதன்", en: "Wednesday", ghatikas: 42, offsetMinutes: 1008, durationMinutes: 90, durationNazhigai: 3.75 },
    { id: 4, num: 5, ta: "வியாழன்", en: "Thursday", ghatikas: 31, offsetMinutes: 744, durationMinutes: 90, durationNazhigai: 3.75 },
    { id: 5, num: 6, ta: "வெள்ளி", en: "Friday", ghatikas: 21, offsetMinutes: 504, durationMinutes: 90, durationNazhigai: 3.75 },
    { id: 6, num: 7, ta: "சனி", en: "Saturday", ghatikas: 14, offsetMinutes: 336, durationMinutes: 90, durationNazhigai: 3.75 }
  ];

  function calculateVaraTyajyam(weekdayInput, dateStr, sunriseTimeStr) {
    let weekdayId = 0;
    const today = new Date();
    const dStr = dateStr || today.toISOString().slice(0, 10);
    const sTime = sunriseTimeStr || "06:00";

    if (typeof weekdayInput === "number") {
      weekdayId = Math.max(0, Math.min(6, Math.floor(weekdayInput)));
    } else if (typeof weekdayInput === "string") {
      const s = weekdayInput.trim().toLowerCase();
      const match = VARA_TYAJYAM_CONFIG.find(item => item.ta.toLowerCase() === s || item.en.toLowerCase() === s);
      if (match) weekdayId = match.id;
      else {
        const num = parseInt(weekdayInput, 10);
        if (!isNaN(num) && num >= 0 && num <= 6) weekdayId = num;
        else {
          const dt = new Date(dStr);
          if (!isNaN(dt.getTime())) weekdayId = dt.getDay();
        }
      }
    } else {
      const dt = new Date(dStr);
      if (!isNaN(dt.getTime())) weekdayId = dt.getDay();
    }

    const cfg = VARA_TYAJYAM_CONFIG[weekdayId] || VARA_TYAJYAM_CONFIG[0];

    const [sY, sM, sD] = dStr.split("-").map(Number);
    const [sH, sMin] = sTime.split(":").map(Number);
    const sunriseDt = new Date(sY, sM - 1, sD, sH, sMin, 0);

    const offsetMinutes = cfg.offsetMinutes;
    const durationMinutes = cfg.durationMinutes; // 90 mins (3.75 நாழிகை)
    const durationNazhigai = cfg.durationNazhigai; // 3.75

    const tyajyamStartDt = new Date(sunriseDt.getTime() + offsetMinutes * 60000);
    const tyajyamEndDt = new Date(tyajyamStartDt.getTime() + durationMinutes * 60000);
    const nextSunriseDt = new Date(sunriseDt.getTime() + 24 * 60 * 60 * 1000);

    const formatDt = (d) => {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const h = d.getHours();
      const m = d.getMinutes();
      const h12 = h % 12 === 0 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      const h24Str = String(h).padStart(2, "0");
      const mStr = String(m).padStart(2, "0");
      return {
        dateYmd: `${y}-${mo}-${day}`,
        dateDisplay: `${day}-${mo}-${y}`,
        time24: `${h24Str}:${mStr}`,
        time12: `${String(h12).padStart(2, "0")}:${mStr} ${ampm}`,
        full: `${day}/${mo}/${y} ${String(h12).padStart(2, "0")}:${mStr} ${ampm} (${h24Str}:${mStr})`,
        short: `${day}/${mo} ${String(h12).padStart(2, "0")}:${mStr} ${ampm}`
      };
    };

    const sunriseFmt = formatDt(sunriseDt);
    const nextSunriseFmt = formatDt(nextSunriseDt);
    const tyajyamStartFmt = formatDt(tyajyamStartDt);
    const tyajyamEndFmt = formatDt(tyajyamEndDt);

    const totalDayMinutes = 1440; // 24 hours = 60 நாழிகை
    const p1Pct = +((offsetMinutes / totalDayMinutes) * 100).toFixed(1);
    const p2Pct = +((durationMinutes / totalDayMinutes) * 100).toFixed(1);
    const p3Pct = +(100 - p1Pct - p2Pct).toFixed(1);

    const timelineSegments = [
      {
        type: "auspicious",
        label: "முன்பகுதி சுப காலம்",
        labelEn: "Pre-Tyajyam Auspicious",
        startMin: 0,
        endMin: offsetMinutes,
        duration: offsetMinutes,
        widthPct: p1Pct,
        color: "#10B981",
        startTime: sunriseFmt.short,
        endTime: tyajyamStartFmt.short
      },
      {
        type: "tyajyam",
        label: `வார தியாஜ்யம் (${cfg.ghatikas} நாழிகையில்)`,
        labelEn: "Vara Tyajyam (90 min / 3.75 Nazhigai)",
        startMin: offsetMinutes,
        endMin: offsetMinutes + durationMinutes,
        duration: durationMinutes,
        widthPct: p2Pct,
        color: "#E11D48",
        startTime: tyajyamStartFmt.short,
        endTime: tyajyamEndFmt.short
      },
      {
        type: "auspicious",
        label: "பின்பகுதி சுப காலம்",
        labelEn: "Post-Tyajyam Auspicious",
        startMin: offsetMinutes + durationMinutes,
        endMin: totalDayMinutes,
        duration: totalDayMinutes - (offsetMinutes + durationMinutes),
        widthPct: p3Pct,
        color: "#10B981",
        startTime: tyajyamEndFmt.short,
        endTime: nextSunriseFmt.short
      }
    ];

    const preDurationMins = offsetMinutes;
    const postDurationMins = totalDayMinutes - (offsetMinutes + durationMinutes);

    const auspiciousWindows = [
      {
        title: "முன்பகுதி சுப முகூர்த்தக் காலம்",
        duration: `${preDurationMins} நிமிடங்கள் (${(preDurationMins / 24).toFixed(1)} நாழிகை)`,
        startTime: sunriseFmt.full,
        endTime: tyajyamStartFmt.full,
        status: "சுபம் (Auspicious)",
        note: "சூரிய உதயம் முதல் வார தியாஜ்ய நச்சு நாழிகை தொடங்கும் வரை சுப காரியங்களைச் செய்யலாம்."
      },
      {
        title: "வார தியாஜ்ய நச்சுப் பொழுது (விலக்கப்பட வேண்டிய காலம்)",
        duration: `${durationMinutes} நிமிடங்கள் (${durationNazhigai} நாழிகை)`,
        startTime: tyajyamStartFmt.full,
        endTime: tyajyamEndFmt.full,
        status: "அசுபம் / நச்சு நாழிகை (Strictly Inauspicious)",
        note: "சாஸ்திரப்படி வார தியாஜ்யம் 90 நிமிடங்கள் (3.75 நாழிகை) நச்சுக்காலமாகும். இக்காலத்தில் சுப முகூர்த்தம், விவாகம், புதுமனை புகுதல், பிரயாணம் கூடாது."
      },
      {
        title: "பின்பகுதி சுப முகூர்த்தக் காலம்",
        duration: `${postDurationMins} நிமிடங்கள் (${(postDurationMins / 24).toFixed(1)} நாழிகை)`,
        startTime: tyajyamEndFmt.full,
        endTime: nextSunriseFmt.full,
        status: "சுபம் (Auspicious)",
        note: "வார தியாஜ்யம் முடிவுற்ற பின் மறுநாள் சூரிய உதயம் வரை உள்ள காலம் சுப காரியங்களுக்கு உகந்தது."
      }
    ];

    const allWeekdaysTable = VARA_TYAJYAM_CONFIG.map(item => {
      const sD = new Date(sunriseDt.getTime() + item.offsetMinutes * 60000);
      const eD = new Date(sD.getTime() + item.durationMinutes * 60000);
      return {
        weekdayId: item.id,
        num: item.num,
        ta: item.ta,
        en: item.en,
        ghatikas: item.ghatikas,
        offsetMinutes: item.offsetMinutes,
        durationMinutes: item.durationMinutes,
        durationNazhigai: item.durationNazhigai,
        offsetHoursMins: `${Math.floor(item.offsetMinutes / 60)} மணி ${item.offsetMinutes % 60} நிமி`,
        isCurrent: item.id === cfg.id,
        tyajyamStartFmt: formatDt(sD),
        tyajyamEndFmt: formatDt(eD)
      };
    });

    const offsetHrs = Math.floor(offsetMinutes / 60);
    const offsetRemMins = offsetMinutes % 60;

    return {
      weekdayId: cfg.id,
      weekdayNum: cfg.num,
      weekdayTa: cfg.ta,
      weekdayEn: cfg.en,
      ghatikas: cfg.ghatikas,
      offsetMinutes,
      offsetFormatted: `${offsetHrs} மணி ${offsetRemMins} நிமிடம்`,
      durationMinutes,
      durationNazhigai,
      dateInput: dStr,
      sunriseTime: sunriseTimeStr,
      sunriseDateTime: sunriseFmt,
      nextSunriseDateTime: nextSunriseFmt,
      tyajyamStartTime: tyajyamStartFmt,
      tyajyamEndTime: tyajyamEndFmt,
      timelineSegments,
      auspiciousWindows,
      allWeekdaysTable,
      verdictTa: `தேர்வு செய்த ${cfg.ta} (${cfg.en}) கிழமையின் வார தியாஜ்யம் சூரிய உதயத்திலிருந்து ${cfg.ghatikas} நாழிகையில் (${offsetHrs} மணி ${offsetRemMins} நிமிடம்) தொடங்குகிறது. சூரிய உதயம் ${sunriseFmt.time12} எனில், தியாஜ்ய காலம் ${tyajyamStartFmt.full} முதல் ${tyajyamEndFmt.full} வரை (90 நிமிடங்கள் / 3.75 நாழிகை) அமைகிறது. இந்த நச்சு நாழிகையை சுப காரியங்களுக்கு கண்டிப்பாகத் தவிர்க்க வேண்டும்.`
    };
  }

  /**
   * 3-நிலை துல்லிய கிரக ஹோரா கணிதம் (Planetary Hora 3-Level Hierarchy)
   * 24 Horas -> 7 Sub-Horas -> 7 Sub-sub-Horas
   */
  const CHALDEAN_HORA_PLANETS = [
    { id: 0, code: "Su", ta: "சூரியன்", en: "Sun", symbol: "☀️", deity: "சிவபெருமான்", goodForTa: "அரசு பணி, நிர்வாகம், தலைமை ஏற்பு, பிதுர் காரியம், தந்தை ஆசி", goodForEn: "Government affairs, leadership, administration, Father's blessings" },
    { id: 1, code: "Ve", ta: "சுக்கிரன்", en: "Venus", symbol: "🌸", deity: "ஸ்ரீ மகாலட்சுமி", goodForTa: "திருமணம், கலை, புதிய ஆடை, ஆபரணம், வாகனம் வாங்குதல், சுப காரியங்கள்", goodForEn: "Marriage, arts, jewelry, vehicles, luxury purchases, beauty" },
    { id: 2, code: "Me", ta: "புதன்", en: "Mercury", symbol: "📚", deity: "ஸ்ரீ மகாவிஷ்ணு", goodForTa: "கல்வி, கணக்கு, வர்த்தகம், எழுத்து, ஒப்பந்தம், அறிவு சார்ந்த விவகாரங்கள்", goodForEn: "Education, accounting, commerce, contracts, writing, intellect" },
    { id: 3, code: "Mo", ta: "சந்திரன்", en: "Moon", symbol: "🌙", deity: "பார்வதி தேவி", goodForTa: "பிரயாணம், நீர் சார்ந்த தொழில், கலை, ஆடை வாங்குதல், மன அமைதி", goodForEn: "Travel, creative endeavors, water businesses, public interaction" },
    { id: 4, code: "Sa", ta: "சனி", en: "Saturn", symbol: "🪐", deity: "ஸ்ரீ சனீஸ்வரர்", goodForTa: "இரும்பு, எண்ணெய், பழைய விவகாரங்கள், பூமி சாஸ்திரம், சேவைப் பணி", goodForEn: "Heavy machinery, agriculture, real estate, persistent labour, storage" },
    { id: 5, code: "Ju", ta: "குரு", en: "Jupiter", symbol: "✨", deity: "தட்சிணாமூர்த்தி / பிரம்மா", goodForTa: "சுப காரியம், குரு தரிசனம், புத்திர பாக்கியம், தங்கம், ஆன்மீகம்", goodForEn: "All auspicious ceremonies, finances, gold purchases, spiritual study" },
    { id: 6, code: "Ma", ta: "செவ்வாய்", en: "Mars", symbol: "⚔️", deity: "முருகப்பெருமான்", goodForTa: "பூமி, நிலம், இயந்திர விவகாரம், வழக்கு, தைரிய காரியங்கள், ரத்த தானம்", goodForEn: "Real estate, mechanical works, legal disputes, surgical/physical ventures" }
  ];

  const HORA_WEEKDAY_START_INDEX = [0, 3, 6, 2, 5, 1, 4];
  const HORA_WEEKDAYS_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
  const HORA_WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function calculateSolarTimesHora(dt, lat = 13.0827, lon = 80.2707, tz = 5.5) {
    const startOfYear = new Date(dt.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((dt - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    const gamma = (2.0 * Math.PI / 365.0) * (dayOfYear - 1);
    const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
      - 0.014615 * Math.cos(2.0 * gamma) - 0.040849 * Math.sin(2.0 * gamma));
    const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2.0 * gamma) + 0.000907 * Math.sin(2.0 * gamma)
      - 0.002697 * Math.cos(3.0 * gamma) + 0.00148 * Math.sin(3.0 * gamma);
    const latRad = lat * Math.PI / 180.0;
    const zenithRad = 90.833 * Math.PI / 180.0;
    let cosH = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
    cosH = Math.max(-1.0, Math.min(1.0, cosH));
    const haHours = Math.acos(cosH) * (180.0 / Math.PI) / 15.0;
    const solarNoonMins = 720.0 - 4.0 * lon - eqtime + tz * 60.0;
    const riseMins = solarNoonMins - haHours * 60.0;
    const setMins = solarNoonMins + haHours * 60.0;

    const sunriseDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
    sunriseDt.setMilliseconds(Math.round(riseMins * 60 * 1000));
    const sunsetDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
    sunsetDt.setMilliseconds(Math.round(setMins * 60 * 1000));

    const nextDay = new Date(dt.getTime() + 24 * 60 * 60 * 1000);
    const startOfNextYear = new Date(nextDay.getFullYear(), 0, 1);
    const nextDayOfYear = Math.floor((nextDay - startOfNextYear) / (1000 * 60 * 60 * 24)) + 1;
    const nextGamma = (2.0 * Math.PI / 365.0) * (nextDayOfYear - 1);
    const nextEqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(nextGamma) - 0.032077 * Math.sin(nextGamma)
      - 0.014615 * Math.cos(2.0 * nextGamma) - 0.040849 * Math.sin(2.0 * nextGamma));
    const nextDecl = 0.006918 - 0.399912 * Math.cos(nextGamma) + 0.070257 * Math.sin(nextGamma)
      - 0.006758 * Math.cos(2.0 * nextGamma) + 0.000907 * Math.sin(2.0 * nextGamma)
      - 0.002697 * Math.cos(3.0 * nextGamma) + 0.00148 * Math.sin(3.0 * nextGamma);
    let nextCosH = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(nextDecl)) / (Math.cos(latRad) * Math.cos(nextDecl));
    nextCosH = Math.max(-1.0, Math.min(1.0, nextCosH));
    const nextHaHours = Math.acos(nextCosH) * (180.0 / Math.PI) / 15.0;
    const nextRiseMins = 720.0 - 4.0 * lon - nextEqtime + tz * 60.0 - nextHaHours * 60.0;
    const nextSunriseDt = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 0, 0, 0);
    nextSunriseDt.setMilliseconds(Math.round(nextRiseMins * 60 * 1000));

    return { sunriseDt, sunsetDt, nextSunriseDt };
  }

  function calculateFullHoraHierarchy(dateInput, timeInput, placeName = "Chennai", lat = 13.0827, lon = 80.2707, tz = 5.5) {
    let targetDate;
    if (dateInput) {
      if (typeof dateInput === "string" && dateInput.includes("/")) {
        const parts = dateInput.split("/").map(Number);
        if (parts[0] > 12) targetDate = new Date(parts[2], parts[1] - 1, parts[0]);
        else targetDate = new Date(parts[2], parts[0] - 1, parts[1]);
      } else if (typeof dateInput === "string" && dateInput.includes("-")) {
        const parts = dateInput.split("-").map(Number);
        targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else if (dateInput instanceof Date) {
        targetDate = new Date(dateInput);
      } else {
        targetDate = new Date(2026, 9, 13);
      }
    } else {
      targetDate = new Date(2026, 9, 13);
    }
    if (isNaN(targetDate.getTime())) targetDate = new Date(2026, 9, 13);

    let targetHour = 16, targetMin = 37, targetSec = 30;
    if (timeInput) {
      const s = String(timeInput).trim().toUpperCase();
      const isPm = s.includes("PM");
      const isAm = s.includes("AM");
      const clean = s.replace("AM", "").replace("PM", "").trim();
      const tparts = clean.split(":").map(Number);
      if (!isNaN(tparts[0])) {
        let th = tparts[0];
        if (isPm && th < 12) th += 12;
        else if (isAm && th === 12) th = 0;
        targetHour = th;
        targetMin = !isNaN(tparts[1]) ? tparts[1] : 0;
        targetSec = (tparts.length > 2 && !isNaN(tparts[2])) ? tparts[2] : 30;
      }
    }

    const targetDt = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), targetHour, targetMin, targetSec);

    let solar = calculateSolarTimesHora(targetDate, lat, lon, tz);
    let sunriseDt = solar.sunriseDt;
    let sunsetDt = solar.sunsetDt;
    let nextSunriseDt = solar.nextSunriseDt;

    // Astrological day starts at Sunrise
    let astroDate = new Date(targetDate);
    if (targetDt < sunriseDt) {
      astroDate.setDate(astroDate.getDate() - 1);
      solar = calculateSolarTimesHora(astroDate, lat, lon, tz);
      sunriseDt = solar.sunriseDt;
      sunsetDt = solar.sunsetDt;
      nextSunriseDt = solar.nextSunriseDt;
    }

    const weekdayIdx = astroDate.getDay(); // 0=Sunday, 1=Monday... 6=Saturday
    const weekdayTa = HORA_WEEKDAYS_TA[weekdayIdx];
    const weekdayEn = HORA_WEEKDAYS_EN[weekdayIdx];

    const dayDurationSec = (sunsetDt.getTime() - sunriseDt.getTime()) / 1000;
    const nightDurationSec = (nextSunriseDt.getTime() - sunsetDt.getTime()) / 1000;

    const horaDaySpanSec = dayDurationSec / 12.0;
    const horaNightSpanSec = nightDurationSec / 12.0;

    const weekdayStartLordIdx = HORA_WEEKDAY_START_INDEX[weekdayIdx];

    const horasList = [];
    let currentHoraMatch = null;
    let currentSubMatch = null;
    let currentSubsubMatch = null;

    const fmtTime12 = (d) => {
      let h = d.getHours();
      const m = d.getMinutes();
      const s = d.getSeconds();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;
    };

    const fmtShort12 = (d) => {
      let h = d.getHours();
      const m = d.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
    };

    const fmtTime24 = (d) => {
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };

    for (let h = 0; h < 24; h++) {
      const isDay = h < 12;
      const horaNum = h + 1;
      const hInPhase = isDay ? h : (h - 12);

      let hStartDt, hEndDt, horaDurationSec;
      if (isDay) {
        hStartDt = new Date(sunriseDt.getTime() + hInPhase * horaDaySpanSec * 1000);
        hEndDt = new Date(sunriseDt.getTime() + (hInPhase + 1) * horaDaySpanSec * 1000);
        horaDurationSec = horaDaySpanSec;
      } else {
        hStartDt = new Date(sunsetDt.getTime() + hInPhase * horaNightSpanSec * 1000);
        hEndDt = new Date(sunsetDt.getTime() + (hInPhase + 1) * horaNightSpanSec * 1000);
        horaDurationSec = horaNightSpanSec;
      }

      const horaLordIdx = (weekdayStartLordIdx + h) % 7;
      const horaPlanet = CHALDEAN_HORA_PLANETS[horaLordIdx];
      const isActiveHora = (targetDt >= hStartDt && targetDt < hEndDt);

      const subHorasList = [];
      const subSpanSec = horaDurationSec / 7.0;

      for (let s = 0; s < 7; s++) {
        const subNum = s + 1;
        const sStartDt = new Date(hStartDt.getTime() + s * subSpanSec * 1000);
        const sEndDt = new Date(hStartDt.getTime() + (s + 1) * subSpanSec * 1000);

        const subLordIdx = (horaLordIdx + s) % 7;
        const subPlanet = CHALDEAN_HORA_PLANETS[subLordIdx];
        const isActiveSub = isActiveHora && (targetDt >= sStartDt && targetDt < sEndDt);

        const subSubList = [];
        const subsubSpanSec = subSpanSec / 7.0;

        for (let ss = 0; ss < 7; ss++) {
          const ssNum = ss + 1;
          const ssStartDt = new Date(sStartDt.getTime() + ss * subsubSpanSec * 1000);
          const ssEndDt = new Date(sStartDt.getTime() + (ss + 1) * subsubSpanSec * 1000);

          const subsubLordIdx = (subLordIdx + ss) % 7;
          const subsubPlanet = CHALDEAN_HORA_PLANETS[subsubLordIdx];
          const isActiveSubsub = isActiveSub && (targetDt >= ssStartDt && targetDt < ssEndDt);

          const ssData = {
            subSubNum: ssNum,
            planetId: subsubPlanet.id,
            planetTa: subsubPlanet.ta,
            planetEn: subsubPlanet.en,
            planetSymbol: subsubPlanet.symbol,
            timeRange: {
              start24: fmtTime24(ssStartDt),
              end24: fmtTime24(ssEndDt),
              start12: fmtTime12(ssStartDt),
              end12: fmtTime12(ssEndDt),
              label: `${fmtShort12(ssStartDt)} – ${fmtShort12(ssEndDt)}`
            },
            isActive: isActiveSubsub
          };
          subSubList.push(ssData);

          if (isActiveSubsub) currentSubsubMatch = ssData;
        }

        const subData = {
          subNum: subNum,
          planetId: subPlanet.id,
          planetTa: subPlanet.ta,
          planetEn: subPlanet.en,
          planetSymbol: subPlanet.symbol,
          timeRange: {
            start24: fmtTime24(sStartDt),
            end24: fmtTime24(sEndDt),
            start12: fmtTime12(sStartDt),
            end12: fmtTime12(sEndDt),
            label: `${fmtShort12(sStartDt)} – ${fmtShort12(sEndDt)}`
          },
          subSubHoras: subSubList,
          isActive: isActiveSub
        };
        subHorasList.push(subData);

        if (isActiveSub) currentSubMatch = subData;
      }

      const horaData = {
        horaNum: horaNum,
        phase: isDay ? "பகல்" : "இரவு",
        phaseEn: isDay ? "Day" : "Night",
        phaseNum: hInPhase + 1,
        planetId: horaPlanet.id,
        planetTa: horaPlanet.ta,
        planetEn: horaPlanet.en,
        planetSymbol: horaPlanet.symbol,
        deity: horaPlanet.deity,
        goodForTa: horaPlanet.goodForTa,
        goodForEn: horaPlanet.goodForEn,
        timeRange: {
          start24: fmtTime24(hStartDt),
          end24: fmtTime24(hEndDt),
          start12: fmtTime12(hStartDt),
          end12: fmtTime12(hEndDt),
          label: `${fmtShort12(hStartDt)} – ${fmtShort12(hEndDt)}`
        },
        durationMinutes: (horaDurationSec / 60.0).toFixed(2),
        durationNazhigai: ((horaDurationSec / 60.0) / 24.0).toFixed(2),
        subHoras: subHorasList,
        isActive: isActiveHora
      };
      horasList.push(horaData);

      if (isActiveHora) currentHoraMatch = horaData;
    }

    if (!currentHoraMatch && horasList.length > 0) {
      currentHoraMatch = horasList[0];
      currentSubMatch = currentHoraMatch.subHoras[0];
      currentSubsubMatch = currentSubMatch.subSubHoras[0];
    }

    const summaryText = `நடப்பு காலம் ${currentHoraMatch.horaNum} ${currentHoraMatch.planetTa} · உப ஹோராக்கள் ${currentSubMatch.subNum} ${currentSubMatch.planetTa} · உப-உப ஹோராக்கள் ${currentSubsubMatch.subSubNum} ${currentSubsubMatch.planetTa}`;

    return {
      status: "success",
      date: targetDate.toISOString().split("T")[0],
      displayDate: `${String(targetDate.getMonth() + 1).padStart(2, "0")}/${String(targetDate.getDate()).padStart(2, "0")}/${targetDate.getFullYear()}`,
      time: fmtShort12(targetDt),
      displayTime: fmtShort12(targetDt),
      place: placeName,
      latitude: lat,
      longitude: lon,
      timezone: tz,
      weekday: {
        id: weekdayIdx,
        nameTa: weekdayTa,
        nameEn: weekdayEn,
        lordTa: CHALDEAN_HORA_PLANETS[weekdayStartLordIdx].ta,
        lordEn: CHALDEAN_HORA_PLANETS[weekdayStartLordIdx].en
      },
      sunTimes: {
        sunrise: fmtTime12(sunriseDt),
        sunset: fmtTime12(sunsetDt),
        nextSunrise: fmtTime12(nextSunriseDt),
        sunrise24: fmtTime24(sunriseDt),
        sunset24: fmtTime24(sunsetDt),
        dayDuration: `${Math.floor(dayDurationSec / 3600)} மணி ${Math.floor((dayDurationSec % 3600) / 60)} நிமிடம்`,
        nightDuration: `${Math.floor(nightDurationSec / 3600)} மணி ${Math.floor((nightDurationSec % 3600) / 60)} நிமிடம்`
      },
      activePeriod: {
        hora: {
          num: currentHoraMatch.horaNum,
          planetTa: currentHoraMatch.planetTa,
          planetEn: currentHoraMatch.planetEn,
          timeLabel: currentHoraMatch.timeRange.label,
          goodFor: currentHoraMatch.goodForTa
        },
        subHora: {
          num: currentSubMatch.subNum,
          planetTa: currentSubMatch.planetTa,
          planetEn: currentSubMatch.planetEn,
          timeLabel: currentSubMatch.timeRange.label
        },
        subSubHora: {
          num: currentSubsubMatch.subSubNum,
          planetTa: currentSubsubMatch.planetTa,
          planetEn: currentSubsubMatch.planetEn,
          timeLabel: currentSubsubMatch.timeRange.label
        },
        summaryBadge: summaryText
      },
      horas: horasList
    };
  }

  return {
    getBirthBird,
    calculateJamakkol,
    calculateHoraTable,
    calculateLagnaTyajyam,
    LAGNA_TYAJYAM_CONFIG,
    calculateNakshatraTyajyam,
    NAKSHATRA_TYAJYAM_CONFIG,
    calculateTithiTyajyam,
    TITHI_TYAJYAM_CONFIG,
    calculateVaraTyajyam,
    VARA_TYAJYAM_CONFIG,
    calculateFullHoraHierarchy,
    CHALDEAN_HORA_PLANETS
  };
})();
