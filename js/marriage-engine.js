/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - MARRIAGE & RELATIONSHIPS ENGINE
 * Authentic Vedic & Tamil Matrimonial Astrology:
 * - 10 & 12 Porutham Matchmaking Algorithm
 * - Rajju Dosha Critical Evaluation
 * - Chevvai (Manglik) Dosha with Vedic Exceptions
 * - Marriage Timing Predictions
 * - Vivaha Chakra Analysis
 */

const MarriageEngine = (function () {
  // Gana classifications: 0: Deva, 1: Manushya, 2: Rakshasa
  const GANA_MAP = {
    0: 0, 1: 1, 2: 2, 3: 1, 4: 0, 5: 1, 6: 0, 7: 0, 8: 2,
    9: 2, 10: 1, 11: 1, 12: 0, 13: 2, 14: 0, 15: 2, 16: 0, 17: 2,
    18: 2, 19: 1, 20: 1, 21: 0, 22: 2, 23: 2, 24: 1, 25: 1, 26: 0
  };

  // Yoni (Animals): 14 pairs
  const YONI_MAP = [
    "குதிரை (Horse)", "யானை (Elephant)", "ஆடு (Sheep)", "பாம்பு (Serpent)", "பாம்பு (Serpent)",
    "நாய் (Dog)", "பூனை (Cat)", "ஆடு (Goat)", "பூனை (Cat)", "எலி (Rat)",
    "எலி (Rat)", "பசு (Cow)", "எருமை (Buffalo)", "புலி (Tiger)", "எருமை (Buffalo)",
    "புலி (Tiger)", "மான் (Deer)", "மான் (Deer)", "நாய் (Dog)", "குரங்கு (Monkey)",
    "கீரி (Mongoose)", "குரங்கு (Monkey)", "சிங்கம் (Lion)", "குதிரை (Horse)", "சிங்கம் (Lion)",
    "பசு (Cow)", "யானை (Elephant)"
  ];

  // Rajju (5 types): Siro, Kanta, Udara, Ooru, Pada
  const RAJJU_MAP = [
    "பாத ரஜ்ஜு (Pada)", "ஊரு ரஜ்ஜு (Ooru)", "உதர ரஜ்ஜு (Udara)", "கண்ட ரஜ்ஜு (Kanta)", "சிரோ ரஜ்ஜு (Siro)",
    "சிரோ ரஜ்ஜு (Siro)", "கண்ட ரஜ்ஜு (Kanta)", "உதர ரஜ்ஜு (Udara)", "ஊரு ரஜ்ஜு (Ooru)", "பாத ரஜ்ஜு (Pada)",
    "பாத ரஜ்ஜு (Pada)", "ஊரு ரஜ்ஜு (Ooru)", "உதர ரஜ்ஜு (Udara)", "கண்ட ரஜ்ஜு (Kanta)", "சிரோ ரஜ்ஜு (Siro)",
    "சிரோ ரஜ்ஜு (Siro)", "கண்ட ரஜ்ஜு (Kanta)", "உதர ரஜ்ஜு (Udara)", "ஊரு ரஜ்ஜு (Ooru)", "பாத ரஜ்ஜு (Pada)",
    "பாத ரஜ்ஜு (Pada)", "ஊரு ரஜ்ஜு (Ooru)", "உதர ரஜ்ஜு (Udara)", "கண்ட ரஜ்ஜு (Kanta)", "சிரோ ரஜ்ஜு (Siro)",
    "சிரோ ரஜ்ஜு (Siro)", "கண்ட ரஜ்ஜு (Kanta)"
  ];

  // Vedha pairs (Afflicted star relationships)
  const VEDHA_PAIRS = [
    [0, 17], [1, 16], [2, 15], [3, 14], [5, 21], [6, 20], [7, 19], [8, 18],
    [9, 26], [10, 25], [11, 24], [12, 23]
  ];

  /**
   * Calculate 10 & 12 Poruthams for Bride (பெண்) and Groom (ஆண்) Stars
   * @param {number} boyNakIndex (0-26)
   * @param {number} girlNakIndex (0-26)
   * @param {number} boyRasiIndex (0-11)
   * @param {number} girlRasiIndex (0-11)
   */
  function calculatePorutham(boyNakIndex, girlNakIndex, boyRasiIndex, girlRasiIndex) {
    const bNak = (isNaN(boyNakIndex) || boyNakIndex === null || boyNakIndex === undefined) ? 0 : (((parseInt(boyNakIndex, 10) % 27) + 27) % 27);
    const gNak = (isNaN(girlNakIndex) || girlNakIndex === null || girlNakIndex === undefined) ? 0 : (((parseInt(girlNakIndex, 10) % 27) + 27) % 27);
    const bRasi = (isNaN(boyRasiIndex) || boyRasiIndex === null || boyRasiIndex === undefined) ? Math.floor(bNak / 2.25) % 12 : (((parseInt(boyRasiIndex, 10) % 12) + 12) % 12);
    const gRasi = (isNaN(girlRasiIndex) || girlRasiIndex === null || girlRasiIndex === undefined) ? Math.floor(gNak / 2.25) % 12 : (((parseInt(girlRasiIndex, 10) % 12) + 12) % 12);

    const results = [];
    let passedCount = 0;

    // 1. தினப் பொருத்தம் (Dhina Porutham - Longevity & Health)
    // Count from girl's star to boy's star
    const countGirlToBoy = ((bNak - gNak + 27) % 27) + 1;
    const rem = countGirlToBoy % 9;
    const dhinaPassed = [2, 4, 6, 8, 9, 0].includes(rem);
    if (dhinaPassed) passedCount++;
    results.push({
      num: 1,
      ta: "தினப் பொருத்தம் (Dhina)",
      en: "Dhina Porutham",
      status: dhinaPassed,
      descTa: dhinaPassed ? "உத்தமம். தம்பதியரின் ஆரோக்கியம் மற்றும் நீண்ட ஆயுள் மேலோங்கும்." : "பொருத்தம் குறைவு.",
      descEn: dhinaPassed ? "Auspicious. Ensures health, mutual vitality and disease-free longevity." : "Below average score."
    });

    // 2. கணப் பொருத்தம் (Gana Porutham - Mental compatibility)
    const boyGana = GANA_MAP[bNak];
    const girlGana = GANA_MAP[gNak];
    let ganaPassed = false;
    if (boyGana === girlGana) ganaPassed = true;
    else if (girlGana === 0 && boyGana === 1) ganaPassed = true;
    else if (girlGana === 1 && boyGana === 0) ganaPassed = true;
    else if (girlGana !== 2 && boyGana === 2) ganaPassed = true; // Groom Rakshasa with Deva/Manushya tolerated
    if (ganaPassed) passedCount++;
    results.push({
      num: 2,
      ta: "கணப் பொருத்தம் (Gana)",
      en: "Gana Porutham",
      status: ganaPassed,
      descTa: ganaPassed ? "உத்தமம். இருவரின் மனநிலையும் சிந்தனைகளும் ஒத்துப் போகும்." : "மத்திமம். மனப்போக்கில் வேற்றுமை வரலாம்.",
      descEn: ganaPassed ? "Harmonious mental temperament, aligned lifestyle inclinations." : "Variance in temperaments."
    });

    // 3. மாகேந்திரப் பொருத்தம் (Mahendra Porutham - Progeny & Family wealth)
    const mahendraNumbers = [4, 7, 10, 13, 16, 19, 22, 25];
    const mahendraPassed = mahendraNumbers.includes(countGirlToBoy);
    if (mahendraPassed) passedCount++;
    results.push({
      num: 3,
      ta: "மாகேந்திரப் பொருத்தம் (Mahendra)",
      en: "Mahendra Porutham",
      status: mahendraPassed,
      descTa: mahendraPassed ? "உத்தமம். புத்திர பாக்கியம், வம்ச விருத்தி மற்றும் குடும்ப பொருளாதார மேன்மை உண்டாகும்." : "பொருத்தம் இல்லை (ஆனால் மற்றவை ஈடுசெய்யும்).",
      descEn: mahendraPassed ? "Blesses the couple with blessed progeny and lasting family legacy." : "Neutral factor."
    });

    // 4. ஸ்திரீ தீர்க்கப் பொருத்தம் (Stree Dheergha - Longevity & Well-being)
    const streePassed = countGirlToBoy > 13;
    if (streePassed) passedCount++;
    results.push({
      num: 4,
      ta: "ஸ்திரீ தீர்க்கப் பொருத்தம் (Stree Dheergha)",
      en: "Stree Dheergha Porutham",
      status: streePassed,
      descTa: streePassed ? "உத்தமம். பெண் இல்லறத்தில் சர்வ மங்கலங்களையும் பெறுவார்." : "மத்திமம்.",
      descEn: streePassed ? "Bestows all auspicious comforts and longevity to the bride." : "Moderate."
    });

    // 5. யோனிப் பொருத்தம் (Yoni Porutham - Physical attraction)
    const boyYoni = YONI_MAP[bNak] || "குதிரை (Horse)";
    const girlYoni = YONI_MAP[gNak] || "யானை (Elephant)";
    // Simple hostility rule check
    const isEnemyYoni = (boyYoni.includes("பாம்பு") && girlYoni.includes("கீரி")) ||
      (boyYoni.includes("பூனை") && girlYoni.includes("எலி")) ||
      (boyYoni.includes("சிங்கம்") && girlYoni.includes("யானை"));
    const yoniPassed = !isEnemyYoni;
    if (yoniPassed) passedCount++;
    results.push({
      num: 5,
      ta: "யோனிப் பொருத்தம் (Yoni)",
      en: "Yoni Porutham",
      status: yoniPassed,
      descTa: yoniPassed ? `உத்தமம். (${girlYoni} - ${boyYoni}) உடல் மற்றும் தாம்பத்திய இணக்கம் அமையும்.` : "பகை யோனி. தாம்பத்தியத்தில் சலசலப்பு வரலாம்.",
      descEn: yoniPassed ? `Compatible animal archetypes (${girlYoni} & ${boyYoni}).` : "Conflicting archetypes."
    });

    // 6. ராசிப் பொருத்தம் (Rasi Porutham - Happiness & Lineage)
    const countRasi = ((bRasi - gRasi + 12) % 12) + 1;
    // 6th or 8th (Shadashtaka) is forbidden in strict Vedic
    const rasiPassed = ![6, 8, 2, 12].includes(countRasi);
    if (rasiPassed) passedCount++;
    results.push({
      num: 6,
      ta: "ராசிப் பொருத்தம் (Rasi)",
      en: "Rasi Porutham",
      status: rasiPassed,
      descTa: rasiPassed ? "உத்தமம். குடும்ப ஒற்றுமை மற்றும் மகிழ்ச்சி நிலைக்கும்." : "சஷ்டாஷ்டக தோஷம் (6-8 நிலை). பரிகாரம் தேவை.",
      descEn: rasiPassed ? "Mutual peace, emotional bonding and household prosperity." : "Shadashtaka (6-8) disposition."
    });

    // 7. ராசியாதிபதி பொருத்தம் (Rasiyadhipathi - Friendship of lords)
    const rasiLordPassed = [1, 5, 7, 9, 11].includes(countRasi) || rasiPassed;
    if (rasiLordPassed) passedCount++;
    results.push({
      num: 7,
      ta: "ராசியாதிபதி பொருத்தம் (Rasi Lord)",
      en: "Rasiyadhipathi Porutham",
      status: rasiLordPassed,
      descTa: rasiLordPassed ? "உத்தமம். ராசி அதிபதிகள் நட்பு நிலையில் உள்ளனர்." : "மத்திமம்.",
      descEn: rasiLordPassed ? "Friendly planetary rulers fostering life companionship." : "Moderate friendship."
    });

    // 8. வசியப் பொருத்தம் (Vasiya - Mutual devotion)
    const vasiyaPassed = [1, 4, 7, 10].includes(countRasi);
    if (vasiyaPassed) passedCount++;
    results.push({
      num: 8,
      ta: "வசியப் பொருத்தம் (Vasiya)",
      en: "Vasiya Porutham",
      status: vasiyaPassed,
      descTa: vasiyaPassed ? "உத்தமம். தம்பதியரிடையே பிரிக்க முடியாத அன்பு நிலவும்." : "சாதாரண நிலை.",
      descEn: vasiyaPassed ? "Strong magnetic attraction and deep mutual adoration." : "Normal."
    });

    // 9. ரஜ்ஜுப் பொருத்தம் (Rajju Porutham - The Most Critical Bond!)
    const boyRajju = RAJJU_MAP[bNak] || "பாத ரஜ்ஜு (Pada)";
    const girlRajju = RAJJU_MAP[gNak] || "சிரோ ரஜ்ஜு (Siro)";
    // Rajju passes if they are in DIFFERENT Rajjus
    const rajjuPassed = boyRajju !== girlRajju;
    if (rajjuPassed) passedCount++;
    results.push({
      num: 9,
      ta: "ரஜ்ஜுப் பொருத்தம் (Rajju - முக்கியமானது)",
      en: "Rajju Porutham (Vital Life Bond)",
      status: rajjuPassed,
      isCritical: true,
      descTa: rajjuPassed ? `மிக உத்தமம்! (மணமகள்: ${girlRajju}, மணமகன்: ${boyRajju}). மாங்கல்ய பலம் பூரணமாக அமையும்.` : `ரஜ்ஜு தட்டுகிறது! இருவரும் ஒரே ரஜ்ஜுவில் (${girlRajju}) உள்ளனர். சாஸ்திரப்படி முக்கிய தோஷம்.`,
      descEn: rajjuPassed ? `Excellent! Different Rajjus assure long marital life and mangalya balam.` : `Same Rajju (${girlRajju}). Significant Vedic caution.`
    });

    // 10. வேதைப் பொருத்தம் (Vedha - Absence of affliction)
    let isVedha = false;
    for (const pair of VEDHA_PAIRS) {
      if ((pair[0] === bNak && pair[1] === gNak) || (pair[1] === bNak && pair[0] === gNak)) {
        isVedha = true;
        break;
      }
    }
    const vedhaPassed = !isVedha;
    if (vedhaPassed) passedCount++;
    results.push({
      num: 10,
      ta: "வேதைப் பொருத்தம் (Vedha)",
      en: "Vedha Porutham",
      status: vedhaPassed,
      descTa: vedhaPassed ? "உத்தமம். நட்சத்திர வேதை தோஷம் இல்லை." : "வேதை தோஷம் உள்ளது.",
      descEn: vedhaPassed ? "Free of adverse astronomical counter-afflictions." : "Vedha present."
    });

    // 11. நாடிப் பொருத்தம் (Nadi)
    const nadiPassed = (bNak % 3) !== (gNak % 3);
    if (nadiPassed) passedCount++;
    results.push({
      num: 11,
      ta: "நாடிப் பொருத்தம் (Nadi)",
      en: "Nadi Porutham",
      status: nadiPassed,
      descTa: nadiPassed ? "உத்தமம். உடற்கூறு மற்றும் மரபணு பொருத்தம் சிறந்தது." : "ஒரே நாடி.",
      descEn: nadiPassed ? "Biological and genetic harmony." : "Same Nadi."
    });

    // 12. விருட்சப் பொருத்தம் (Vriksha - Sacred Tree)
    const boyTree = (typeof AstroEngine !== "undefined" && AstroEngine.NAKSHATRA_DATA && AstroEngine.NAKSHATRA_DATA[bNak]) ? AstroEngine.NAKSHATRA_DATA[bNak].tree : "மரம்";
    const girlTree = (typeof AstroEngine !== "undefined" && AstroEngine.NAKSHATRA_DATA && AstroEngine.NAKSHATRA_DATA[gNak]) ? AstroEngine.NAKSHATRA_DATA[gNak].tree : "மரம்";
    const vrikshaPassed = boyTree !== girlTree;
    if (vrikshaPassed) passedCount++;
    results.push({
      num: 12,
      ta: "விருட்சப் பொருத்தம் (Vriksha)",
      en: "Vriksha Porutham",
      status: vrikshaPassed,
      descTa: vrikshaPassed ? `உத்தமம். மரம்: ${girlTree} மற்றும் ${boyTree}.` : "ஒரே மரம்.",
      descEn: vrikshaPassed ? `Harmonious sacred trees (${girlTree} & ${boyTree}).` : "Same sacred tree."
    });

    // Final Verdict
    let verdictTa = "";
    let verdictEn = "";
    if (passedCount >= 8 && rajjuPassed) {
      verdictTa = "மிகச் சிறந்த பொருத்தம் (உத்தமம்)! திருமணம் செய்யலாம்.";
      verdictEn = "Excellent Compatibility! Highly Recommended for Marriage.";
    } else if (passedCount >= 6 && rajjuPassed) {
      verdictTa = "நடுத்தர பொருத்தம் (மத்திமம்). பரிகாரங்களுடன் செய்யலாம்.";
      verdictEn = "Moderate Compatibility. Recommended with standard pariharams.";
    } else {
      verdictTa = "பொருத்தம் போதாது. ரஜ்ஜு அல்லது முக்கிய பொருத்தங்கள் குறைவு.";
      verdictEn = "Low Compatibility. Critical factors or Rajju unfulfilled.";
    }

    const bStarObj = (typeof AstroEngine !== "undefined" && AstroEngine.NAKSHATRA_DATA && AstroEngine.NAKSHATRA_DATA[bNak]) ? AstroEngine.NAKSHATRA_DATA[bNak] : { id: bNak, ta: NAKSHATRA_NAMES_TA[bNak] };
    const gStarObj = (typeof AstroEngine !== "undefined" && AstroEngine.NAKSHATRA_DATA && AstroEngine.NAKSHATRA_DATA[gNak]) ? AstroEngine.NAKSHATRA_DATA[gNak] : { id: gNak, ta: NAKSHATRA_NAMES_TA[gNak] };

    return {
      boyStar: bStarObj,
      girlStar: gStarObj,
      passedCount,
      totalCount: 12,
      rajjuPassed,
      results,
      verdictTa,
      verdictEn
    };
  }

  /**
   * Chevvai (Manglik) Dosha Analyzer with Vedic Exceptions
   */
  function analyzeChevvaiDosha(marsSignId, lagnaSignId, moonSignId, venusSignId) {
    const fromLagna = ((marsSignId - lagnaSignId + 12) % 12) + 1;
    const fromMoon = ((marsSignId - moonSignId + 12) % 12) + 1;
    const fromVenus = ((marsSignId - venusSignId + 12) % 12) + 1;

    const doshaHouses = [2, 4, 7, 8, 12];
    const isAfflictedLagna = doshaHouses.includes(fromLagna);
    const isAfflictedMoon = doshaHouses.includes(fromMoon);
    const isAfflictedVenus = doshaHouses.includes(fromVenus);

    // Vedic Exceptions (செவ்வாய் தோஷ நிவர்த்தி விதிகள்)
    let hasException = false;
    let exceptionReasonTa = "";
    let exceptionReasonEn = "";

    // Exception 1: Mars in Aries or Scorpio (Own houses)
    if ([0, 7].includes(marsSignId)) {
      hasException = true;
      exceptionReasonTa = "செவ்வாய் தன் சொந்த வீட்டில் (மேஷம்/விருச்சிகம்) இருப்பதால் தோஷமில்லை.";
      exceptionReasonEn = "Mars is in its own domicile (Aries/Scorpio), cancelling affliction.";
    }
    // Exception 2: Mars in Capricorn (Exalted) or Cancer (Neecham)
    else if (marsSignId === 9) {
      hasException = true;
      exceptionReasonTa = "செவ்வாய் மகரத்தில் உச்சம் பெற்றுள்ளதால் தோஷம் நிவர்த்தியாகிறது.";
      exceptionReasonEn = "Mars is exalted in Capricorn, dissolving malefic traits.";
    }
    // Exception 3: Mars in Leo or Sagittarius (Friendly Sun/Jupiter)
    else if ([4, 8].includes(marsSignId)) {
      hasException = true;
      exceptionReasonTa = "செவ்வாய் மித்ரு வீடுகளில் (சிம்மம்/தனுசு) இருப்பதால் தோஷ வலு குறைகிறது.";
      exceptionReasonEn = "Mars in friendly solar/Jupiterian signs mitigates affliction.";
    }

    const hasDosha = (isAfflictedLagna || isAfflictedMoon) && !hasException;

    return {
      marsSignId,
      houseFromLagna: fromLagna,
      houseFromMoon: fromMoon,
      houseFromVenus: fromVenus,
      hasDosha,
      hasException,
      exceptionReasonTa,
      exceptionReasonEn,
      summaryTa: hasDosha
        ? `செவ்வாய் லக்னத்திற்கு ${fromLagna}-ம் இடத்தில் உள்ளதால் செவ்வாய் தோஷம் உள்ளது. இதே தோஷம் உள்ள ஜாதகத்தை சேர்ப்பது சிறந்தது.`
        : (hasException ? `செவ்வாய் அமைந்திருந்தாலும் சாஸ்திர விலக்கு விதிகளால் தோஷம் நிவர்த்தியாகி விட்டது.` : `செவ்வாய் தோஷம் இல்லை. சுப யோகம் நிலவுகிறது.`),
      summaryEn: hasDosha
        ? `Mars is posited in house ${fromLagna} causing Manglik Dosha. Pair with matching horoscope.`
        : (hasException ? `Mars placement is cancelled by authentic Vedic exemptions.` : `No Chevvai (Manglik) Dosha detected.`)
    };
  }

  const NAKSHATRA_NAMES_TA = [
    "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிஷம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
  ];

  const RASI_NAMES_TA = [
    "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
    "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
  ];

  const RASI_LORDS_TA = [
    "செவ்வாய்", "சுக்கிரன்", "புதன்", "சந்திரன்", "சூரியன்", "புதன்",
    "சுக்கிரன்", "செவ்வாய்", "குரு", "சனி", "சனி", "குரு"
  ];

  /**
   * Classical 9-Direction Vivaha Chakra (விவாக சக்கரம்) Calculation
   * Distributes 27 nakshatras in 9 directions (3 per slot) starting from Sun's nakshatra.
   * Identifies where native's Moon nakshatra and optional target Muhurtha nakshatra fall.
   */
  function calculateVivahaChakra(sunNakIdx, moonNakIdx, targetNakIdx = null) {
    const sunIdx = ((sunNakIdx % 27) + 27) % 27;
    const moonIdx = ((moonNakIdx % 27) + 27) % 27;

    const SLOTS_CONFIG = [
      {
        slotNum: 1,
        dirTa: "மையம்",
        dirEn: "Center (Madhya)",
        deityTa: "சூரியன் / பிரம்மா",
        statusTa: "வேதனை",
        statusEn: "Affliction / Agony",
        isGood: false,
        isExcellent: false,
        descTa: "மையத்தில் சூரியன் முதல் 1-3 நட்சத்திரங்கள் அமைகின்றன. ஆரம்ப வேதனை, கருத்து வேறுபாடு ஏற்படலாம் (முகூர்த்தத்திற்கு தவிர்க்கவும்).",
        descEn: "Initial 3 stars posited in Center. Can bring friction or distress (Avoid for Muhurtha).",
        themeColor: "#DC2626",
        row: 1,
        col: 1
      },
      {
        slotNum: 2,
        dirTa: "கிழக்கு",
        dirEn: "East (Purva)",
        deityTa: "இந்திரன்",
        statusTa: "லட்சுமி கடாட்சம்",
        statusEn: "Lakshmi Kataksham (Wealth)",
        isGood: true,
        isExcellent: false,
        descTa: "இந்திர திசை. தன தான்ய விருத்தி, மங்கல வாழ்வு, லட்சுமி கடாட்சம் அருளும் உத்தம சுப நிலை.",
        descEn: "East direction under Indra. Bestows prosperity, harmony, and lasting auspiciousness.",
        themeColor: "#B45309",
        row: 1,
        col: 2
      },
      {
        slotNum: 3,
        dirTa: "தென்கிழக்கு",
        dirEn: "South-East (Agneya)",
        deityTa: "அக்னி",
        statusTa: "வறுமை, பீடை",
        statusEn: "Poverty & Impediments",
        isGood: false,
        isExcellent: false,
        descTa: "அக்னி கோணம். விரயமும் உஷ்ண/மன அமைதியின்மையும் வரலாம் (முகூர்த்தத்திற்கு தவிர்க்கவும்).",
        descEn: "Agni direction. Indicates obstacles and domestic drain (Avoid for Muhurtha).",
        themeColor: "#9A3412",
        row: 2,
        col: 2
      },
      {
        slotNum: 4,
        dirTa: "தெற்கு",
        dirEn: "South (Dakshina)",
        deityTa: "யமன்",
        statusTa: "இழப்பு, விரயம்",
        statusEn: "Loss & Distress",
        isGood: false,
        isExcellent: false,
        descTa: "யம திசை. பொருளாதார விரயம், ஆரோக்கியக் குறைவு வரலாம் (முகூர்த்தத்திற்கு தவிர்க்கவும்).",
        descEn: "Yama direction. Indicates losses and potential health distress (Avoid for Muhurtha).",
        themeColor: "#C2410C",
        row: 2,
        col: 1
      },
      {
        slotNum: 5,
        dirTa: "தென்மேற்கு",
        dirEn: "South-West (Nairuthi)",
        deityTa: "நிருதி",
        statusTa: "சர்வ சௌபாக்கியம்",
        statusEn: "All Auspiciousness & Progeny",
        isGood: true,
        isExcellent: true,
        descTa: "கன்னி மூலை. புத்திர பாக்கியம், சர்வ சௌபாக்கியம், நீண்ட ஆயுள் தரும் உன்னத நிலை.",
        descEn: "South-West under Nairuthi. Bestows worthy progeny, immense fortune, and enduring marital bliss.",
        themeColor: "#059669",
        row: 2,
        col: 0
      },
      {
        slotNum: 6,
        dirTa: "மேற்கு",
        dirEn: "West (Paschima)",
        deityTa: "வருணன்",
        statusTa: "அசிங்கம், அவமானம்",
        statusEn: "Discord & Disrepute",
        isGood: false,
        isExcellent: false,
        descTa: "வருண திசை. தாம்பத்தியத்தில் சுமுகமின்மை, பந்த முறிவு ஏற்படலாம் (முகூர்த்தத்திற்கு தவிர்க்கவும்).",
        descEn: "West under Varuna. Suggests emotional distance or disputes (Avoid for Muhurtha).",
        themeColor: "#9F1239",
        row: 1,
        col: 0
      },
      {
        slotNum: 7,
        dirTa: "வடமேற்கு",
        dirEn: "North-West (Vayavya)",
        deityTa: "வாயு",
        statusTa: "வளர்ச்சி இல்லை",
        statusEn: "Stagnation & Instability",
        isGood: false,
        isExcellent: false,
        descTa: "வாயு கோணம். அலைச்சல், தொழில்/குடும்ப நிலைத்தன்மையின்மை ஏற்படலாம் (முகூர்த்தத்திற்கு தவிர்க்கவும்).",
        descEn: "North-West under Vayu. Signifies instability and lack of roots (Avoid for Muhurtha).",
        themeColor: "#334155",
        row: 0,
        col: 0
      },
      {
        slotNum: 8,
        dirTa: "வடக்கு",
        dirEn: "North (Uttara)",
        deityTa: "குபேரன்",
        statusTa: "சகல சௌபாக்கியம்",
        statusEn: "Supreme Fortune & Long Life",
        isGood: true,
        isExcellent: true,
        descTa: "குபேர திசை. ஐஸ்வர்யம், தீர்க்க சுமங்கலி யோகம், சுகபோக வாழ்வு அருளும் உத்தம நிலை.",
        descEn: "North under Kubera. Brings wealth, lasting wedlock, and social respect.",
        themeColor: "#0D9488",
        row: 0,
        col: 1
      },
      {
        slotNum: 9,
        dirTa: "வடகிழக்கு",
        dirEn: "North-East (Eshanya)",
        deityTa: "ஈசானியன்",
        statusTa: "சகல சௌபாக்கியம்",
        statusEn: "Spiritual Peace & Prosperity",
        isGood: true,
        isExcellent: false,
        descTa: "ஈசானிய மூலை. ஆன்மீக அமைதி, குடும்ப மேன்மை, வம்ச விருத்தி தரும் சுப நிலை.",
        descEn: "North-East under Ishana. Grants divine harmony, progeny expansion, and auspicious peace.",
        themeColor: "#0D9488",
        row: 0,
        col: 2
      }
    ];

    const slots = SLOTS_CONFIG.map((cfg, i) => {
      const idx1 = (sunIdx + i * 3) % 27;
      const idx2 = (sunIdx + i * 3 + 1) % 27;
      const idx3 = (sunIdx + i * 3 + 2) % 27;

      const stars = [
        { idx: idx1, nameTa: NAKSHATRA_NAMES_TA[idx1] },
        { idx: idx2, nameTa: NAKSHATRA_NAMES_TA[idx2] },
        { idx: idx3, nameTa: NAKSHATRA_NAMES_TA[idx3] }
      ];

      const hasNativeMoon = (moonIdx === idx1 || moonIdx === idx2 || moonIdx === idx3);
      const hasTargetStar = (targetNakIdx !== null && (targetNakIdx === idx1 || targetNakIdx === idx2 || targetNakIdx === idx3));

      return {
        ...cfg,
        stars,
        starNamesTa: stars.map(s => s.nameTa).join(", "),
        hasNativeMoon,
        hasTargetStar
      };
    });

    const nativeCount = ((moonIdx - sunIdx + 27) % 27) + 1;
    const nativeSlotIdx = Math.floor((nativeCount - 1) / 3);
    const nativeSlot = slots[nativeSlotIdx];

    let targetSlot = null;
    let targetCount = null;
    if (targetNakIdx !== null && targetNakIdx !== undefined && targetNakIdx >= 0 && targetNakIdx < 27) {
      targetCount = ((targetNakIdx - sunIdx + 27) % 27) + 1;
      const tSlotIdx = Math.floor((targetCount - 1) / 3);
      targetSlot = slots[tSlotIdx];
    }

    return {
      sunStar: { idx: sunIdx, nameTa: NAKSHATRA_NAMES_TA[sunIdx] },
      moonStar: { idx: moonIdx, nameTa: NAKSHATRA_NAMES_TA[moonIdx] },
      nativeCount,
      nativeSlot,
      targetStar: targetNakIdx !== null && targetNakIdx >= 0 ? { idx: targetNakIdx, nameTa: NAKSHATRA_NAMES_TA[targetNakIdx] } : null,
      targetCount,
      targetSlot,
      slots
    };
  }

  /**
   * Comprehensive Matrimonial Astrological Analysis
   * Analyzes 7th House, Upapada Lagna, Venus, Jupiter, Darakaraka, and Chevvai Dosha.
   */
  function getMatrimonialAnalysis(horoscopeData) {
    if (!horoscopeData) return null;
    const { planets, lagna, karakas, specialLagnas } = horoscopeData;

    const lagnaSign = lagna ? lagna.signId : 8;
    const house7Sign = (lagnaSign + 6) % 12;
    const house7LordName = RASI_LORDS_TA[house7Sign];
    const house7SignName = RASI_NAMES_TA[house7Sign];

    const rasiLordCodes = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"];
    const lordCode = rasiLordCodes[house7Sign];
    const lordPlanet = (planets && planets[lordCode]) ? planets[lordCode] : {};
    const lordHouseFromLagna = lordPlanet.signId !== undefined ? ((lordPlanet.signId - lagnaSign + 12) % 12) + 1 : 7;
    const lordSignName = lordPlanet.signId !== undefined ? RASI_NAMES_TA[lordPlanet.signId] : "—";

    const venus = (planets && planets["Ve"]) ? planets["Ve"] : {};
    const venusHouseFromLagna = venus.signId !== undefined ? ((venus.signId - lagnaSign + 12) % 12) + 1 : 1;
    const venusSignName = venus.signId !== undefined ? RASI_NAMES_TA[venus.signId] : "—";
    const venusDignity = (venus.dignity && typeof venus.dignity === "object" ? venus.dignity.ta : venus.dignity) || "நட்பு";

    const jupiter = (planets && planets["Ju"]) ? planets["Ju"] : {};
    const jupiterHouseFromLagna = jupiter.signId !== undefined ? ((jupiter.signId - lagnaSign + 12) % 12) + 1 : 1;
    const jupiterSignName = jupiter.signId !== undefined ? RASI_NAMES_TA[jupiter.signId] : "—";

    let ulSignName = "—";
    if (typeof AstroEngine !== "undefined" && AstroEngine.calculateArudhaPadas) {
      const arudha = AstroEngine.calculateArudhaPadas(lagnaSign, planets);
      if (arudha && arudha.chakraSummary && arudha.chakraSummary.UL) {
        ulSignName = arudha.chakraSummary.UL;
      }
    }
    if (ulSignName === "—" && specialLagnas && specialLagnas.UL) {
      ulSignName = RASI_NAMES_TA[specialLagnas.UL.signId];
    }

    let darakaraka = { planetNameTa: "சந்திரன்", deg: "—" };
    if (karakas && Array.isArray(karakas)) {
      const dk = karakas.find(k => k.karaka && k.karaka.includes("DK"));
      if (dk) darakaraka = dk;
    }

    const marsSign = (planets && planets["Ma"]) ? planets["Ma"].signId : 0;
    const moonSign = (planets && planets["Mo"]) ? planets["Mo"].signId : 0;
    const chevvaiResult = analyzeChevvaiDosha(marsSign, lagnaSign, moonSign, venus.signId || 0);

    return {
      house7SignName,
      house7LordName,
      lordSignName,
      lordHouseFromLagna,
      venusSignName,
      venusHouseFromLagna,
      venusDignity,
      jupiterSignName,
      jupiterHouseFromLagna,
      ulSignName,
      darakaraka,
      chevvaiResult
    };
  }

  return {
    calculatePorutham,
    analyzeChevvaiDosha,
    calculateVivahaChakra,
    getMatrimonialAnalysis,
    NAKSHATRA_NAMES_TA,
    RASI_NAMES_TA
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = MarriageEngine;
if (typeof window !== "undefined") window.MarriageEngine = MarriageEngine;
