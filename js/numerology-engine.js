/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - NUMEROLOGY ENGINE
 * Complete Chaldean & Pythagorean Numerological Calculations:
 * - Birth Number (Mulank / பிறந்த தேதி எண்)
 * - Destiny Number (Bhagyank / விதி எண்)
 * - Name Number (Chaldean & Pythagorean vibration)
 * - Business & Brand Name compatibility
 * - Lucky Colors, Gems, Dates, and Friendly Numbers
 */

const NumerologyEngine = (function () {
  // Chaldean Letter Values
  const CHALDEAN_MAP = {
    A: 1, I: 1, J: 1, Q: 1, Y: 1,
    B: 2, K: 2, R: 2,
    C: 3, G: 3, L: 3, S: 3,
    D: 4, M: 4, T: 4,
    E: 5, H: 5, N: 5, X: 5,
    U: 6, V: 6, W: 6,
    O: 7, Z: 7,
    F: 8, P: 8
  };

  // Pythagorean Letter Values
  const PYTHAGOREAN_MAP = {
    A: 1, J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3, U: 3,
    D: 4, M: 4, V: 4,
    E: 5, N: 5, W: 5,
    F: 6, O: 6, X: 6,
    G: 7, P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    I: 9, R: 9
  };

  // Trait Details for Numbers 1 through 9
  const NUMBER_TRAITS = {
    1: {
      planetTa: "சூரியன்",
      planetEn: "Sun",
      titleTa: "தலைமை & ஆளுமை (The Leader)",
      titleEn: "Leadership & Sovereign Will",
      descTa: "துணிச்சல், புதுமை படைக்கும் ஆற்றல், சுதந்திரமான சிந்தனை மற்றும் தலைமை தாங்கும் ஆற்றல் கொண்டவர்கள்.",
      descEn: "Pioneering spirit, visionary ambition, executive magnetism, and decisive leadership.",
      luckyColorsTa: "தங்கம், மஞ்சள், ஆரஞ்சு",
      luckyColorsEn: "Gold, Yellow, Copper, Orange",
      luckyGemsTa: "மாணிக்கம் (Ruby)",
      luckyGemsEn: "Ruby (Manikkam)",
      friendlyNumbers: [1, 2, 3, 9],
      enemyNumbers: [6, 8]
    },
    2: {
      planetTa: "சந்திரன்",
      planetEn: "Moon",
      titleTa: "அன்பு & அமைதி (The Peacemaker)",
      titleEn: "Diplomacy & Intuition",
      descTa: "மென்மையான குணம், கற்பனை வளம், இசை மற்றும் கலை ஆர்வம், சமாதானப் பிரியர்கள்.",
      descEn: "Gentle empathy, deep creative intuition, artistic appreciation, and peacemaking diplomacy.",
      luckyColorsTa: "வெள்ளை, கிரீம், வெளிர் பச்சை",
      luckyColorsEn: "White, Cream, Pale Green",
      luckyGemsTa: "முத்து (Pearl)",
      luckyGemsEn: "Natural Pearl (Muthu)",
      friendlyNumbers: [1, 2, 4, 7],
      enemyNumbers: [5, 9]
    },
    3: {
      planetTa: "குரு",
      planetEn: "Jupiter",
      titleTa: "ஞானம் & வழிகாட்டுதல் (The Counselor)",
      titleEn: "Wisdom, Expansion & Knowledge",
      descTa: "ஆழ்ந்த அறிவு, நேர்மை, ஆசிரியர் குணம், ஆன்மீக நாட்டம் மற்றும் அனைவரையும் வழிநடத்தும் திறன்.",
      descEn: "Profound wisdom, moral integrity, academic brilliance, and expansive optimism.",
      luckyColorsTa: "மஞ்சள், பொன்னிறம்",
      luckyColorsEn: "Bright Yellow, Golden Amber",
      luckyGemsTa: "மஞ்சள் புஷ்பராகம் (Yellow Sapphire)",
      luckyGemsEn: "Yellow Sapphire (Pushparagam)",
      friendlyNumbers: [1, 2, 3, 5, 9],
      enemyNumbers: [6]
    },
    4: {
      planetTa: "ராகு",
      planetEn: "Rahu",
      titleTa: "புரட்சி & கடின உழைப்பு (The Innovator)",
      titleEn: "Practicality & Breakthroughs",
      descTa: "கட்டமைப்பு திறன், வழக்கத்திற்கு மாறான புதிய சிந்தனைகள், தொழில் நுட்ப ஆற்றல் மற்றும் விடாமுயற்சி.",
      descEn: "Unconventional genius, structural mastery, sudden breakthroughs, and relentless endurance.",
      luckyColorsTa: "நீலம், சாம்பல்",
      luckyColorsEn: "Electric Blue, Steel Grey",
      luckyGemsTa: "கோமேதகம் (Hessonite)",
      luckyGemsEn: "Hessonite Gomedh",
      friendlyNumbers: [1, 2, 7, 8],
      enemyNumbers: [4, 9]
    },
    5: {
      planetTa: "புதன்",
      planetEn: "Mercury",
      titleTa: "வணிகம் & தொடர்பு (The Communicator)",
      titleEn: "Intellect, Agility & Commerce",
      descTa: "சுறுசுறுப்பு, சமயோசித புத்தி, கணக்கு மற்றும் வணிகத்தில் வெற்றி, சிறந்த பேச்சுத்திறன்.",
      descEn: "Versatility, quicksilver intellect, commercial mastery, and brilliant adaptability.",
      luckyColorsTa: "பச்சை, எலுமிச்சை நிறம்",
      luckyColorsEn: "Emerald Green, Light Turquoise",
      luckyGemsTa: "மரகதம் (Emerald)",
      luckyGemsEn: "Emerald (Maragatham)",
      friendlyNumbers: [1, 3, 5, 6],
      enemyNumbers: [2]
    },
    6: {
      planetTa: "சுக்கிரன்",
      planetEn: "Venus",
      titleTa: "கலை & வசீகரம் (The Charmer)",
      titleEn: "Harmony, Luxury & Arts",
      descTa: "அழகுணர்ச்சி, கவர்ச்சி, சொகுசு வாழ்க்கை, குடும்பப் பற்று மற்றும் காந்த வசீகரம்.",
      descEn: "Aesthetic magnetism, artistic genius, luxurious living, and radiant charisma.",
      luckyColorsTa: "வெண்மை, ரோஸ், வெளிர் நீலம்",
      luckyColorsEn: "Diamond White, Rose Pink, Sky Blue",
      luckyGemsTa: "வைரம் (Diamond) / வெண் புஷ்பராகம்",
      luckyGemsEn: "Diamond (Vairam) / White Sapphire",
      friendlyNumbers: [5, 6, 8, 9],
      enemyNumbers: [1, 3]
    },
    7: {
      planetTa: "கேது",
      planetEn: "Ketu",
      titleTa: "ஆன்மீகம் & ஆராய்ச்சி (The Mystic)",
      titleEn: "Mysticism, Research & Philosophy",
      descTa: "ஆழ்ந்த உள்ளுணர்வு, தத்துவ நாட்டம், ரகசியங்களை ஆராயும் திறன் மற்றும் அமைதியான குணம்.",
      descEn: "Esoteric depth, psychic intuition, philosophical insight, and spiritual detachment.",
      luckyColorsTa: "வெள்ளை, வெளிர் மஞ்சள், பச்சை",
      luckyColorsEn: "Pearl White, Light Olive Green",
      luckyGemsTa: "வைடூரியம் (Cat's Eye)",
      luckyGemsEn: "Cat's Eye (Vaidurya)",
      friendlyNumbers: [1, 2, 4, 7],
      enemyNumbers: [9]
    },
    8: {
      planetTa: "சனி",
      planetEn: "Saturn",
      titleTa: "நீதி & ஸ்திரத்தன்மை (The Achiever)",
      titleEn: "Discipline, Justice & Endurance",
      descTa: "பொறுமை, கடும் உழைப்பு, நீதி உணர்வு, ஆரம்ப சவால்களுக்குப் பின் கிட்டும் பிரம்மாண்ட வெற்றி.",
      descEn: "Tenacious discipline, karmic justice, monumental perseverance, and delayed supreme triumph.",
      luckyColorsTa: "அடர் நீலம், கருநீலம்",
      luckyColorsEn: "Navy Blue, Dark Indigo, Black",
      luckyGemsTa: "நீலக்கல் (Blue Sapphire)",
      luckyGemsEn: "Blue Sapphire (Neelam)",
      friendlyNumbers: [4, 5, 6, 8],
      enemyNumbers: [1, 2, 9]
    },
    9: {
      planetTa: "செவ்வாய்",
      planetEn: "Mars",
      titleTa: "வீரம் & ஆற்றல் (The Warrior)",
      titleEn: "Courage, Passion & Vitality",
      descTa: "வீரம், வேகமான செயல்பாடுகள், எதையும் தாங்கும் மன உறுதி, தியாக மனப்பான்மை மற்றும் வீரியம்.",
      descEn: "Fiery courage, warrior energy, humanitarian defense, and unstoppable stamina.",
      luckyColorsTa: "சிவப்பு, மெரூன், பவள நிறம்",
      luckyColorsEn: "Deep Red, Scarlet, Maroon",
      luckyGemsTa: "பவளம் (Red Coral)",
      luckyGemsEn: "Red Coral (Pavalam)",
      friendlyNumbers: [1, 2, 3, 9],
      enemyNumbers: [4, 8]
    }
  };

  /**
   * Sum digits until single digit 1-9
   */
  function reduceToSingleDigit(num) {
    let n = Math.abs(num);
    while (n > 9) {
      n = n.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n === 0 ? 9 : n;
  }

  /**
   * Calculate Birth Number (Mulank) from day of month
   */
  function calculateMulank(day) {
    return reduceToSingleDigit(day);
  }

  /**
   * Calculate Destiny Number (Bhagyank) from full date YYYY-MM-DD
   */
  function calculateBhagyank(birthDateStr) {
    const digits = birthDateStr.replace(/[^0-9]/g, '').split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    return reduceToSingleDigit(sum);
  }

  /**
   * Calculate Name Number for Chaldean and Pythagorean
   */
  function calculateNameNumber(name) {
    const cleaned = name.toUpperCase().replace(/[^A-Z]/g, '');
    let chaldeanTotal = 0;
    let pythagoreanTotal = 0;

    for (const char of cleaned) {
      chaldeanTotal += CHALDEAN_MAP[char] || 0;
      pythagoreanTotal += PYTHAGOREAN_MAP[char] || 0;
    }

    const chaldeanSingle = reduceToSingleDigit(chaldeanTotal);
    const pythagoreanSingle = reduceToSingleDigit(pythagoreanTotal);

    return {
      cleanedName: cleaned,
      chaldeanCompound: chaldeanTotal,
      chaldeanSingle: chaldeanSingle,
      pythagoreanCompound: pythagoreanTotal,
      pythagoreanSingle: pythagoreanSingle,
      chaldeanTraits: NUMBER_TRAITS[chaldeanSingle],
      pythagoreanTraits: NUMBER_TRAITS[pythagoreanSingle]
    };
  }

  /**
   * Complete Numerology Report for Person
   */
  function calculateFullNumerology(name, birthDateStr) {
    const [year, month, day] = birthDateStr.split('-').map(Number);
    const mulank = calculateMulank(day);
    const bhagyank = calculateBhagyank(birthDateStr);
    const nameData = calculateNameNumber(name);

    return {
      mulank,
      mulankTraits: NUMBER_TRAITS[mulank],
      bhagyank,
      bhagyankTraits: NUMBER_TRAITS[bhagyank],
      nameData
    };
  }

  // Complete 2-Digit Planetary Pair Interpretations (Vedic Astrology & Chaldean Pair Numerology)
  const NUMBER_PAIR_INTERPRETATIONS = {
    "11": { yoga: "இரட்டை சிம்ம யோகம்", planets: "சூரியன் + சூரியன்", status: "உத்தமம்", score: 90, meaning: "அதீத தலைமைப் பண்பு, நிர்வாக ஆளுமை, சமூகத்தில் உயர்ந்த பதவி, அரசு அனுகூலம்." },
    "12": { yoga: "சிவசக்தி யோகம்", planets: "சூரியன் + சந்திரன்", status: "உத்தமம்", score: 88, meaning: "தலைமை ஆளுமையுடன் மன அமைதி, குடும்பத்தில் நல்ல புரிதல், பொதுமக்களின் ஆதரவு." },
    "13": { yoga: "சிவகுரு யோகம்", planets: "சூரியன் + குரு", status: "உத்தமம்", score: 95, meaning: "அரசாங்க ஆதரவு, நீதிநெறி வழுவாமை, ஆன்மீக மேன்மை, பெரிய மனிதர்களின் ஆசீர்வாதம்." },
    "14": { yoga: "கிரகண / மாயா யோகம்", planets: "சூரியன் + ராகு", status: "நடுத்தரம்", score: 70, meaning: "திடீர் பிரம்மாண்ட வெற்றி, தொழில்நுட்ப உயர்வு; கண் திருஷ்டி மற்றும் அதிகார மோதல்களில் விழிப்புணர்வு தேவை." },
    "15": { yoga: "புதாதித்ய யோகம்", planets: "சூரியன் + புதன்", status: "உத்தமம்", score: 98, meaning: "பேரறிவு, வியாபாரத்தில் அபார லாபம், சிறந்த எழுத்து & பேச்சுத் திறமை, புகழோங்கிய வாழ்வு." },
    "16": { yoga: "சுக்கிர ஆதித்ய யோகம்", planets: "சூரியன் + சுக்கிரன்", status: "நன்று", score: 80, meaning: "கவர்ச்சி, கலை ஆர்வம், ஆடம்பர பொருட்கள் சேர்க்கை; நிதி நிர்வாகத்தில் சமநிலை தேவை." },
    "17": { yoga: "ஞானாதிக்க யோகம்", planets: "சூரியன் + கேது", status: "நன்று", score: 78, meaning: "ஆன்மீக நாட்டம், ஆராய்ச்சி திறன், தியாக சிந்தனை; அரசு விவகாரங்களில் கவனமாக இருக்கவும்." },
    "18": { yoga: "கர்ம நீதி யோகம்", planets: "சூரியன் + சனி", status: "சவால்", score: 60, meaning: "தந்தை-மகன் பிணக்கு அல்லது ஆரம்ப கால போராட்டங்கள்; கடுமையான உழைப்புக்கு பிறகே நிலைத்த வெற்றி கிட்டும்." },
    "19": { yoga: "அக்னி வீர யோகம்", planets: "சூரியன் + செவ்வாய்", status: "உத்தமம்", score: 92, meaning: "அதீத வீரம், தைரியம், ரியல் எஸ்டேட், பாதுகாப்புத் துறை மற்றும் அதிகாரப் பதவிகளில் முதலிடம்." },
    "10": { yoga: "பூரண சூரிய யோகம்", planets: "சூரியன் + பிரபஞ்சம்", status: "உத்தமம்", score: 90, meaning: "தொடக்க ஆற்றல், புதிய முயற்சிகளில் முதன்மை வெற்றி, பிரபஞ்ச ஆளுமை." },

    "21": { yoga: "சிவசக்தி யோகம்", planets: "சந்திரன் + சூரியன்", status: "உத்தமம்", score: 88, meaning: "அமைதியுடன் கூடிய ஆளுமை, சமுதாயத்தில் நற்பெயர், கலை மற்றும் நிர்வாக வெற்றி." },
    "22": { yoga: "சாந்த சௌந்தர்ய யோகம்", planets: "சந்திரன் + சந்திரன்", status: "நன்று", score: 82, meaning: "அதீத கற்பனை வளம், உணர்ச்சிமயமான மனம், கலை இலக்கியங்களில் சாதனை." },
    "23": { yoga: "கஜகேசரி யோகம்", planets: "சந்திரன் + குரு", status: "உத்தமம்", score: 98, meaning: "மக்களின் பேராதரவு, பேரறிஞர் அமைப்பு, உயர் கல்வி, குடும்பத்தில் மங்களகரமான நிகழ்வுகள்." },
    "24": { yoga: "வெளிநாட்டு யோகம்", planets: "சந்திரன் + ராகு", status: "நடுத்தரம்", score: 72, meaning: "வித்தியாசமான சிந்தனைகள், வெளிநாட்டுத் தொடர்பில் வருமானம்; தியானம் நலம் பயக்கும்." },
    "25": { yoga: "சாரதா யோகம்", planets: "சந்திரன் + புதன்", status: "உத்தமம்", score: 92, meaning: "வியாபார சாதனை, சமயோசித புத்தி, கணக்கு மற்றும் எழுத்துத் துறையில் பெரும் புகழ்." },
    "26": { yoga: "சௌபாக்ய யோகம்", planets: "சந்திரன் + சுக்கிரன்", status: "உத்தமம்", score: 94, meaning: "பேரழகு, மகிழ்ச்சியான இல்லறம், நகைகள், ஆடைகள் மற்றும் வாகன சேர்க்கை." },
    "27": { yoga: "உள்ளுணர்வு யோகம்", planets: "சந்திரன் + கேது", status: "நன்று", score: 80, meaning: "ஆழ்ந்த உள்ளுணர்வு, மருத்துவ அறிவு, ஆன்மீக ஈடுபாடு, முன்கூட்டியே அறியும் திறன்." },
    "28": { yoga: "புனர்பூ எச்சரிக்கை", planets: "சந்திரன் + சனி", status: "சவால்", score: 58, meaning: "மனச்சோர்வு அல்லது காரிய தாமதம்; பொறுமையுடன் உழைத்தால் நீண்ட கால வெற்றி உறுதி." },
    "29": { yoga: "சந்திர மங்கள யோகம்", planets: "சந்திரன் + செவ்வாய்", status: "உத்தமம்", score: 96, meaning: "பூமி, நிலம், வீடு சேர்க்கை, வற்றாத தன வரவு, துணிச்சலான முதலீடுகளில் பெரும் லாபம்." },
    "20": { yoga: "சாந்த நிலவு யோகம்", planets: "சந்திரன் + பிரபஞ்சம்", status: "நன்று", score: 84, meaning: "மன அமைதி, நிம்மதியான வாழ்வு, இரக்க குணம்." },

    "31": { yoga: "சிவகுரு யோகம்", planets: "குரு + சூரியன்", status: "உத்தமம்", score: 95, meaning: "அரச கௌரவம், நீதித்துறை, உயர்கல்வி, அனைவராலும் மதிக்கப்படும் பெருமை." },
    "32": { yoga: "கஜகேசரி யோகம்", planets: "குரு + சந்திரன்", status: "உத்தமம்", score: 98, meaning: "எப்போதும் பண புழக்கம், ஞானம், நற்பெயர், தெய்வத்தின் பரிபூரண அருள்." },
    "33": { yoga: "பிரம்ம ஞான யோகம்", planets: "குரு + குரு", status: "உத்தமம்", score: 94, meaning: "ஞானத்தின் இருப்பிடம், ஆசிரியர், பேராசிரியர், ஆன்மீக குரு, நேர்மை." },
    "34": { yoga: "சண்டாள / விவேக யோகம்", planets: "குரு + ராகு", status: "நடுத்தரம்", score: 74, meaning: "வழக்கத்திற்கு மாறான புதிய கல்வி, வெளிநாட்டுப் பயணம்; பேராசையை தவிர்ப்பது நல்லது." },
    "35": { yoga: "சரஸ்வதி யோகம்", planets: "குரு + புதன்", status: "உத்தமம்", score: 96, meaning: "கல்வி நிறுவனம், ஆடிட்டிங், வங்கித் தொழில், அசாத்திய புத்தி கூர்மை." },
    "36": { yoga: "இருபெரும் குரு யோகம்", planets: "குரு + சுக்கிரன்", status: "நன்று", score: 82, meaning: "அறிவு மற்றும் செல்வம் இரண்டும் கிடைக்கும்; தேவையற்ற ஆடம்பர செலவுகளைக் கட்டுப்படுத்தவும்." },
    "37": { yoga: "கோடீஸ்வர யோகம்", planets: "குரு + கேது", status: "உத்தமம்", score: 96, meaning: "கோவில் திருப்பணி, பாரம்பரிய சொத்துக்கள், ஆன்மீக தன யோகம், ஞானச் செல்வம்." },
    "38": { yoga: "தர்ம கர்மாதிபதி யோகம்", planets: "குரு + சனி", status: "உத்தமம்", score: 90, meaning: "நேர்மையான தொழில், சட்டம், நீதி, நிலைத்த சொத்துக்கள், நம்பகத்தன்மை." },
    "39": { yoga: "வீர குரு யோகம்", planets: "குரு + செவ்வாய்", status: "உத்தமம்", score: 92, meaning: "நீதிக்காக போராடுதல், தலைமை தளபதி குணம், நிர்வாகத் திறன், துணிவு." },
    "30": { yoga: "குரு கடாக்ஷம்", planets: "குரு + பிரபஞ்சம்", status: "உத்தமம்", score: 88, meaning: "முன்னோர்களின் ஆசி, தடைகளை வெல்லும் நற்காலம்." },

    "41": { yoga: "கிரகண ஆளுமை", planets: "ராகு + சூரியன்", status: "நடுத்தரம்", score: 70, meaning: "திடீர் அரசியல் வெற்றி; கண் பார்வை மற்றும் அரசு விவகாரங்களில் நேர்மை தேவை." },
    "42": { yoga: "மனோ மாயா யோகம்", planets: "ராகு + சந்திரன்", status: "நடுத்தரம்", score: 72, meaning: "அயல்நாட்டு வரவு; தேவையற்ற பயங்களை விலக்க குலதெய்வ வழிபாடு நலம்." },
    "43": { yoga: "விஞ்ஞான குரு யோகம்", planets: "ராகு + குரு", status: "நடுத்தரம்", score: 74, meaning: "ரிசர்ச், புதிய டெக்னாலஜி கல்வி, உயர்வு." },
    "44": { yoga: "தீவிர மாயா யோகம்", planets: "ராகு + ராகு", status: "நடுத்தரம்", score: 68, meaning: "இணையதளம், சோஷியல் மீடியா, சாப்ட்வேர் துறைகளில் பாய்ச்சல்; உணர்ச்சிவசப்படாமல் செயல்படவும்." },
    "45": { yoga: "கணினி மேதை யோகம்", planets: "ராகு + புதன்", status: "உத்தமம்", score: 90, meaning: "ஐடி துறை, அல்காரிதம், வர்த்தகம், அதிவேக புத்தி கூர்மை, திடீர் லாபம்." },
    "46": { yoga: "மாயா மோக யோகம்", planets: "ராகு + சுக்கிரன்", status: "நன்று", score: 80, meaning: "சினிமா, மீடியா, விளம்பரம், கவர்ச்சித் தொழில், பெரிய அளவிலான மக்கள் தொடர்பு." },
    "47": { yoga: "சர்ப்ப ஆன்மீக யோகம்", planets: "ராகு + கேது", status: "சவால்", score: 62, meaning: "வாழ்க்கையில் திடீர் திருப்பங்கள்; ரகசியங்களை காப்பதும் ஆன்மீக ஈடுபாடும் யோகம் தரும்." },
    "48": { yoga: "கடும் உழைப்பு யோகம்", planets: "ராகு + சனி", status: "நடுத்தரம்", score: 68, meaning: "தொழிற்சாலை, இயந்திரம், மெதுவான ஆனால் உறுதியான முன்னேற்றம்." },
    "49": { yoga: "அங்காரக ராகு யோகம்", planets: "ராகு + செவ்வாய்", status: "சவால்", score: 64, meaning: "அதிவேகம், துணிச்சல்; அவசர முடிவுகளையும் முன்கோபத்தையும் தவிர்ப்பது பாதுகாப்பு." },
    "40": { yoga: "மர்ம ராகு யோகம்", planets: "ராகு + பிரபஞ்சம்", status: "நன்று", score: 75, meaning: "எதிர்பாராத வாய்ப்புகள், அதிர்ஷ்ட யோகம்." },

    "51": { yoga: "புதாதித்ய யோகம்", planets: "புதன் + சூரியன்", status: "உத்தமம்", score: 98, meaning: "அரசாங்கத் தேர்வுகளில் வெற்றி, புகழ், வணிகத்தில் சிறந்த பெயர், புத்தி கூர்மை." },
    "52": { yoga: "சாரதா யோகம்", planets: "புதன் + சந்திரன்", status: "உத்தமம்", score: 92, meaning: "கவிதை, எழுத்து, கலை, நகைச்சுவை, சிறந்த விற்பனைத் திறன்." },
    "53": { yoga: "சரஸ்வதி யோகம்", planets: "புதன் + குரு", status: "உத்தமம்", score: 96, meaning: "அறிவுக் களஞ்சியம், கல்வித் துறை தலைமை, நிதி ஆலோசனை, நம்பகத்தன்மை." },
    "54": { yoga: "கணினி மேதை யோகம்", planets: "புதன் + ராகு", status: "உத்தமம்", score: 90, meaning: "எலக்ட்ரானிக்ஸ், மென்பொருள், ஷேர் மார்க்கெட், விரைவான வளர்ச்சி." },
    "55": { yoga: "மகா வணிக யோகம்", planets: "புதன் + புதன்", status: "உத்தமம்", score: 95, meaning: "வியாபார சாம்ராஜ்யம், கணக்குத் திறன், தகவல் தொடர்பு, பேச்சாற்றல்." },
    "56": { yoga: "லக்ஷ்மி குபேர யோகம்", planets: "புதன் + சுக்கிரன்", status: "உத்தமம்", score: 100, meaning: "அதிர்ஷ்டத்தின் உச்சம், கோடி தன யோகம், நகை ஆபரணங்கள், ராஜயோக சொகுசு வாழ்வு." },
    "57": { yoga: "ஆராய்ச்சி யோகம்", planets: "புதன் + கேது", status: "நன்று", score: 85, meaning: "புதிர் விடுவித்தல், ஜோதிடம், தத்துவம், துப்பறியும் ஆற்றல், மென்பொருள் ஆய்வு." },
    "58": { yoga: "நீதி வணிக யோகம்", planets: "புதன் + சனி", status: "நன்று", score: 82, meaning: "பொறுமையான வணிகம், சட்டம், கணக்கியல், நீண்ட கால ஒப்பந்தங்கள்." },
    "59": { yoga: "பொறியியல் யோகம்", planets: "புதன் + செவ்வாய்", status: "உத்தமம்", score: 90, meaning: "கட்டிட கலை, ரியல் எஸ்டேட் வணிகம், பொறியியல் நுணுக்கம், சுறுசுறுப்பு." },
    "50": { yoga: "சதுரங்க புத்தி யோகம்", planets: "புதன் + பிரபஞ்சம்", status: "உத்தமம்", score: 88, meaning: "ராஜதந்திர யோசனை, எதிலும் வெற்றி காணும் புத்திக்கூர்மை." },

    "61": { yoga: "சுக்கிர ஆதித்ய யோகம்", planets: "சுக்கிரன் + சூரியன்", status: "நன்று", score: 80, meaning: "செல்வாக்கு, பிரபலம், அழகிய தோற்றம், கலைகளில் பெயர் பெறுதல்." },
    "62": { yoga: "சௌபாக்ய யோகம்", planets: "சுக்கிரன் + சந்திரன்", status: "உத்தமம்", score: 94, meaning: "குடும்ப அமைதி, காதல் திருமணம், இல்லற இன்பம், லட்சுமி அருள்." },
    "63": { yoga: "தேவ-அசுர குரு யோகம்", planets: "சுக்கிரன் + குரு", status: "நன்று", score: 82, meaning: "ஆடம்பரம் மற்றும் அறிவு; பொருளாதார சேமிப்பில் கவனம் தேவை." },
    "64": { yoga: "மாயா மோக யோகம்", planets: "சுக்கிரன் + ராகு", status: "நன்று", score: 80, meaning: "சினிமா, கவர்ச்சி, வெளிநாட்டு பொருட்கள், மாடலிங் துறை வளர்ச்சி." },
    "65": { yoga: "லக்ஷ்மி குபேர யோகம்", planets: "சுக்கிரன் + புதன்", status: "உத்தமம்", score: 100, meaning: "லக்ஷ்மி கடாக்ஷம், வியாபாரத்தில் கொழிக்கும் தன வரவு, ஆடை ஆபரணங்கள், வசதிகள்." },
    "66": { yoga: "மகா லக்ஷ்மி யோகம்", planets: "சுக்கிரன் + சுக்கிரன்", status: "உத்தமம்", score: 98, meaning: "பிரம்மாண்ட சொத்துக்கள், சொகுசு கார்கள், கலைத்துறை உச்சம், காந்த வசீகரம்." },
    "67": { yoga: "முக்தி சுக்கிர யோகம்", planets: "சுக்கிரன் + கேது", status: "நன்று", score: 82, meaning: "ஆன்மீக நாட்டம், பண வரவு உண்டு, உலக சுகங்களை விட உயர்ந்த லட்சியங்கள்." },
    "68": { yoga: "தொழில் சுக்கிர யோகம்", planets: "சுக்கிரன் + சனி", status: "உத்தமம்", score: 88, meaning: "வாகன உற்பத்தி, இரும்பு/எண்ணெய் வணிகம், நிலம் மற்றும் பண்ணை வீடுகள் யோகம்." },
    "69": { yoga: "களத்திர ஆவேச யோகம்", planets: "சுக்கிரன் + செவ்வாய்", status: "நன்று", score: 84, meaning: "கவர்ச்சி, வீரம், உடற்பயிற்சி, காதல்; அவசர கோபங்களை தவிர்ப்பது நல்லது." },
    "60": { yoga: "கலா பூரண யோகம்", planets: "சுக்கிரன் + பிரபஞ்சம்", status: "உத்தமம்", score: 90, meaning: "இசை, ஓவியம், கலைத்துறையில் பூரண வளர்ச்சி." },

    "71": { yoga: "ஞானாதிக்க யோகம்", planets: "கேது + சூரியன்", status: "நன்று", score: 78, meaning: "தத்துவ ஞானம், உலக ஆசைகளில் விலகல், பொதுநல சேவை." },
    "72": { yoga: "உள்ளுணர்வு யோகம்", planets: "கேது + சந்திரன்", status: "நன்று", score: 80, meaning: "ஆழ்மன சக்தி, தியானம், மனோ தைரியம், ஆன்மீக அனுபவங்கள்." },
    "73": { yoga: "கோடீஸ்வர யோகம்", planets: "கேது + குரு", status: "உத்தமம்", score: 96, meaning: "தெய்வ பலம், முக்தி யோகம், கோவில் அறப்பணி, வற்றாத செல்வம்." },
    "74": { yoga: "சர்ப்ப விவேக யோகம்", planets: "கேது + ராகு", status: "சவால்", score: 62, meaning: "மர்மமான அனுபவங்கள்; ஆன்மீக சாதனைகளால் பெரும் நிலையை அடையலாம்." },
    "75": { yoga: "ஆராய்ச்சி யோகம்", planets: "கேது + புதன்", status: "நன்று", score: 85, meaning: "புத்தக வெளியீடு, அமானுஷ்ய ஆய்வு, துல்லிய கணித அறிவு." },
    "76": { yoga: "முக்தி சுக்கிர யோகம்", planets: "கேது + சுக்கிரன்", status: "நன்று", score: 82, meaning: "கலை ஆர்வம், ஆன்மீக அழகு, தான தர்மங்கள் செய்யும் மனம்." },
    "77": { yoga: "ஞான வைராக்கிய யோகம்", planets: "கேது + கேது", status: "நன்று", score: 80, meaning: "துறவு, மெய்ஞ்ஞானம், ஆத்ம ஞான தேடல், மாயையை வெல்லும் பேராற்றல்." },
    "78": { yoga: "தவ யோகம்", planets: "கேது + சனி", status: "நடுத்தரம்", score: 70, meaning: "பழைய விஷயங்கள், தொல்பொருள் ஆராய்ச்சி, கடின தவம்." },
    "79": { yoga: "துணிச்சல் யோகம்", planets: "கேது + செவ்வாய்", status: "நன்று", score: 82, meaning: "எதிரிகளை வீழ்த்துதல், தைரியம், அஞ்சா நெஞ்சம்." },
    "70": { yoga: "மோட்ச யோகம்", planets: "கேது + பிரபஞ்சம்", status: "நன்று", score: 78, meaning: "ஆன்ம அமைதி, பூரண ஞானம்." },

    "81": { yoga: "கர்ம நீதி யோகம்", planets: "சனி + சூரியன்", status: "சவால்", score: 60, meaning: "பொறுமை காக்க வேண்டும்; உழைப்பால் மட்டுமே உலகை வெல்ல முடியும்." },
    "82": { yoga: "புனர்பூ எச்சரிக்கை", planets: "சனி + சந்திரன்", status: "சவால்", score: 58, meaning: "மன உறுதியுடன் செயல்படவும்; காலதாமதம் ஆனாலும் பலன் நிலைக்கும்." },
    "83": { yoga: "தர்ம கர்மாதிபதி யோகம்", planets: "சனி + குரு", status: "உத்தமம்", score: 90, meaning: "சட்ட வல்லுனர், நீதிபதி, தர்ம ஸ்தாபனம், நேர்மையான உழைப்பில் கோடி செல்வம்." },
    "84": { yoga: "கடும் உழைப்பு யோகம்", planets: "சனி + ராகு", status: "நடுத்தரம்", score: 68, meaning: "தொழில்நுட்ப உழைப்பு, எதிர்பாராத லாபங்கள், எதிலும் நிதானம் தேவை." },
    "85": { yoga: "நீதி வணிக யோகம்", planets: "சனி + புதன்", status: "நன்று", score: 82, meaning: "ஆடிட்டர், வர்த்தக ஒப்பந்தங்கள், நம்பகமான சேவை." },
    "86": { yoga: "தொழில் சுக்கிர யோகம்", planets: "சனி + சுக்கிரன்", status: "உத்தமம்", score: 88, meaning: "வாகன லாபம், நிலம் மற்றும் மனை யோகம், நிலைத்த சொத்துக்கள்." },
    "87": { yoga: "தவ யோகம்", planets: "சனி + கேது", status: "நடுத்தரம்", score: 70, meaning: "ஆன்மீகப் பணிகள், எளிமையான வாழ்க்கை, நற்கதி." },
    "88": { yoga: "நீதி அரசர் யோகம்", planets: "சனி + சனி", status: "நன்று", score: 84, meaning: "இரும்பை போன்ற மன உறுதி, தொழிலாளர்கள் ஆதரவு, பெரும் சாம்ராஜ்யம்." },
    "89": { yoga: "யுத்த / விபத்து எச்சரிக்கை", planets: "சனி + செவ்வாய்", status: "சவால்", score: 55, meaning: "வாகனம் ஓட்டுவதில் அமைதி தேவை; கோபத்தை கட்டுப்படுத்தினால் பெரிய சாதனை புரியலாம்." },
    "80": { yoga: "பொறுமை யோகம்", planets: "சனி + பிரபஞ்சம்", status: "நன்று", score: 78, meaning: "காலத்தின் அருமை, நீண்ட ஆயுள், நிலைத்த அமைதி." },

    "91": { yoga: "அக்னி வீர யோகம்", planets: "செவ்வாய் + சூரியன்", status: "உத்தமம்", score: 92, meaning: "மாபெரும் ஆளுமை, தலைமை வீரம், அரசாங்க உயர்பதவிகள், தைரியம்." },
    "92": { yoga: "சந்திர மங்கள யோகம்", planets: "செவ்வாய் + சந்திரன்", status: "உத்தமம்", score: 96, meaning: "சொத்து சேர்க்கை, நிலம், கட்டிடம், விவசாயம் மற்றும் வியாபாரத்தில் தனமழை." },
    "93": { yoga: "வீர குரு யோகம்", planets: "செவ்வாய் + குரு", status: "உத்தமம்", score: 92, meaning: "தர்ம யுத்தம், வெற்றிகள், தலைமைப் பண்பு, தைரியமான முடிவுகள்." },
    "94": { yoga: "அங்காரக ராகு யோகம்", planets: "செவ்வாய் + ராகு", status: "சவால்", score: 64, meaning: "அதிவேக வாகனங்களை கவனமாக இயக்கவும்; எதிலும் நிதானம் பாதுகாப்பு தரும்." },
    "95": { yoga: "பொறியியல் யோகம்", planets: "செவ்வாய் + புதன்", status: "உத்தமம்", score: 90, meaning: "தொழில்நுட்ப வல்லுனர், சிவில்/மெக்கானிக்கல் என்ஜினியரிங், சுறுசுறுப்பு." },
    "96": { yoga: "களத்திர ஆவேச யோகம்", planets: "செவ்வாய் + சுக்கிரன்", status: "நன்று", score: 84, meaning: "காதல், கவர்ச்சி, கலை, விளையாட்டுத் துறைகளில் சிறப்பு." },
    "97": { yoga: "துணிச்சல் யோகம்", planets: "செவ்வாய் + கேது", status: "நன்று", score: 82, meaning: "போராட்டங்களை வெல்லுதல், அறுவை சிகிச்சை/மருத்துவத் துறையில் வெற்றி." },
    "98": { yoga: "யுத்த எச்சரிக்கை யோகம்", planets: "செவ்வாய் + சனி", status: "சவால்", score: 55, meaning: "கடுமையான சவால்களை வெல்லும் வைராக்கியம்; ரத்த அழுத்தம் மற்றும் முன்கோபத்தை தவிர்க்கவும்." },
    "99": { yoga: "அக்னி பராக்கிரம யோகம்", planets: "செவ்வாய் + செவ்வாய்", status: "உத்தமம்", score: 90, meaning: "எரிமலை போன்ற ஆற்றல், தளபதி அதிகாரம், எதற்கும் அஞ்சாத வீரம்." },
    "90": { yoga: "வீர தீர யோகம்", planets: "செவ்வாய் + பிரபஞ்சம்", status: "உத்தமம்", score: 88, meaning: "வெற்றி மட்டுமே குறிக்கோள் கொண்ட தீர செயல்." },

    "00": { yoga: "பிரபஞ்ச சூன்ய யோகம்", planets: "ஆற்றல் + ஆற்றல்", status: "நன்று", score: 75, meaning: "எல்லையற்ற பிரபஞ்ச சாத்தியக்கூறுகள், தியானம், தூய்மையான மனோபலம்." }
  };

  /**
   * Complete Number Pair Evaluation Engine (எண் ஜோடி பொருத்தம்)
   */
  function analyzeNumberPairs(rawInput, method = "default") {
    if (!rawInput) return null;
    const cleanedDigits = String(rawInput).replace(/[^0-9]/g, "");
    if (!cleanedDigits) return null;

    // Sequential Overlapping Pairs (எ.கா. 98, 87, 76...)
    const sequentialPairs = [];
    for (let i = 0; i < cleanedDigits.length - 1; i++) {
      const pairStr = cleanedDigits.substring(i, i + 2);
      const interp = NUMBER_PAIR_INTERPRETATIONS[pairStr] || {
        yoga: "இயற்கை எண் ஜோடி",
        planets: `இலக்கம் ${pairStr[0]} + ${pairStr[1]}`,
        status: "நன்று",
        score: 75,
        meaning: "இயல்பான ஆற்றல் மற்றும் பொதுவான பலன்கள்."
      };
      sequentialPairs.push({
        pair: pairStr,
        pos: i + 1,
        ...interp
      });
    }

    // 2-by-2 Non-Overlapping Chunk Pairs (எ.கா. 98, 76, 54...)
    const chunkPairs = [];
    for (let i = 0; i < cleanedDigits.length; i += 2) {
      const pairStr = cleanedDigits.substring(i, i + 2);
      if (pairStr.length === 2) {
        const interp = NUMBER_PAIR_INTERPRETATIONS[pairStr] || {
          yoga: "இயற்கை எண் ஜோடி",
          planets: `இலக்கம் ${pairStr[0]} + ${pairStr[1]}`,
          status: "நன்று",
          score: 75,
          meaning: "இயல்பான ஆற்றல் மற்றும் பொதுவான பலன்கள்."
        };
        chunkPairs.push({
          pair: pairStr,
          pos: Math.floor(i / 2) + 1,
          ...interp
        });
      } else {
        // Trailing single digit
        const digit = parseInt(pairStr, 10);
        const trait = NUMBER_TRAITS[digit] || NUMBER_TRAITS[9];
        chunkPairs.push({
          pair: pairStr,
          pos: Math.floor(i / 2) + 1,
          yoga: "ஒற்றை இறுதி இலக்கம்",
          planets: trait.planetTa,
          status: "நன்று",
          score: 80,
          meaning: trait.descTa
        });
      }
    }

    // Total Compound Sum
    const sumDigits = cleanedDigits.split("").map(Number).reduce((a, b) => a + b, 0);
    const rootSingle = reduceToSingleDigit(sumDigits);
    const rootTraits = NUMBER_TRAITS[rootSingle] || NUMBER_TRAITS[1];

    // Compute Overall Score
    const totalScore = sequentialPairs.length > 0
      ? Math.round(sequentialPairs.reduce((acc, p) => acc + p.score, 0) / sequentialPairs.length)
      : 80;

    // Verdict Badge & Description
    let verdictTitle = "உன்னதமான அதிர்ஷ்ட எண் (Highly Auspicious)";
    let verdictClass = "is-excellent";
    let suitability = ["வணிகம் & தொழில்", "தனிநபர் செல்வாக்கு", "குடும்ப அமைதி"];

    if (totalScore >= 85) {
      verdictTitle = "ராஜயோக அதிர்ஷ்ட எண் (Supreme Auspicious Vibration)";
      verdictClass = "is-supreme";
      suitability = ["பெரு வணிகம் & முதலீடு", "பொதுமக்கள் தொடர்பு & செல்வாக்கு", "அதிர்ஷ்ட வரவு & புகழ்"];
    } else if (totalScore >= 75) {
      verdictTitle = "நன்மையான சுப யோக எண் (Favorable Energy)";
      verdictClass = "is-good";
      suitability = ["தனிநபர் பயன்பாடு", "நடுத்தர வணிகம்", "தொடர்பு & கல்வி"];
    } else {
      verdictTitle = "சவாலான அமைப்பு — எச்சரிக்கையுடன் பயன்படுத்தவும் (Caution & Balancing Needed)";
      verdictClass = "is-caution";
      suitability = ["கடுமையான உழைப்புத் துறை", "விழிப்புணர்வுடன் கூடிய பயன்பாடு"];
    }

    return {
      rawInput: rawInput,
      cleanedDigits: cleanedDigits,
      method: method,
      length: cleanedDigits.length,
      sequentialPairs: sequentialPairs,
      chunkPairs: chunkPairs,
      compoundSum: sumDigits,
      rootSingle: rootSingle,
      rootTraits: rootTraits,
      totalScore: totalScore,
      verdictTitle: verdictTitle,
      verdictClass: verdictClass,
      suitability: suitability,
      evaluatedAt: new Date().toISOString()
    };
  }

  return {
    calculateFullNumerology,
    calculateNameNumber,
    analyzeNumberPairs,
    NUMBER_PAIR_INTERPRETATIONS,
    NUMBER_TRAITS
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = NumerologyEngine;
}
if (typeof window !== "undefined") {
  window.NumerologyEngine = NumerologyEngine;
}
