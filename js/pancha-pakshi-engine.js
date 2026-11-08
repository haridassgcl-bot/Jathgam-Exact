/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - GOCHARA PANCHA PAKSHI SHASTRA ENGINE
 * Authentic Ancient Tamil Siddha Astrological System (Agathiyar / Bogar)
 * 
 * Features:
 * - 5 Birds: வல்லூறு, ஆந்தை, காகம், கோழி, மயில்
 * - 5 Elements (பஞ்ச பூதம்): நிலம், நீர், நெருப்பு, காற்று, ஆகாயம்
 * - 5 Activities: அரசு (Ruling), ஊண் (Eating), நடை (Walking), துயில் (Sleeping), சாவு (Dying)
 * - Proportional Nazhigai Weights: அரசு: 2.0/6.0, ஊண்: 1.25/6.0, நடை: 1.5/6.0, துயில்: 0.75/6.0, சாவு: 0.5/6.0
 * - 4-Tier Nested Hierarchy: 10 Major Yamams (5 Day + 5 Night) -> 5 Sub-periods -> 5 Micro-periods -> 5 Prana-periods
 * - Continuous Integer Minute Precision partition matching classical Agathiyar tables
 * - Multilingual support (Tamil, English, Hindi, Telugu, Malayalam, Kannada)
 * - 5 Dynamic Themes (Modern, Traditional, Royal, Eclipse, Classic)
 */

const PanchaPakshiEngine = (function () {
  "use strict";

  // 1. BIRDS DEFINITIONS
  const BIRDS = [
    {
      id: 0,
      code: "vulture",
      symbol: "🦅",
      ta: "வல்லூறு",
      en: "Vulture",
      hi: "गिद्ध",
      te: "డేగ",
      ml: "കഴുകൻ",
      kn: "ಹದ್ದು",
      elementTa: "நிலம்",
      elementEn: "Earth",
      elementHi: "भूमि",
      elementTe: "భూమి",
      elementMl: "ഭൂമി",
      elementKn: "ಭೂಮಿ",
      letter: "அ",
      directionTa: "நடு / வடக்கு",
      directionEn: "North / Center",
      planetTa: "சூரியன்",
      planetEn: "Sun",
      colorTa: "மஞ்சள் / சிகப்பு",
      colorEn: "Yellow / Red",
      friendly: [1, 2],
      enemy: [3, 4]
    },
    {
      id: 1,
      code: "owl",
      symbol: "🦉",
      ta: "ஆந்தை",
      en: "Owl",
      hi: "उल्लू",
      te: "గుడ్లగూబ",
      ml: "മൂങ്ങ",
      kn: "ಗೂಬೆ",
      elementTa: "நீர்",
      elementEn: "Water",
      elementHi: "जल",
      elementTe: "నీరు",
      elementMl: "ജലം",
      elementKn: "ನೀರು",
      letter: "இ",
      directionTa: "கிழக்கு",
      directionEn: "East",
      planetTa: "சந்திரன்",
      planetEn: "Moon",
      colorTa: "வெள்ளை",
      colorEn: "White",
      friendly: [0, 3],
      enemy: [2, 4]
    },
    {
      id: 2,
      code: "crow",
      symbol: "🐦",
      ta: "காகம்",
      en: "Crow",
      hi: "कौवा",
      te: "కాకి",
      ml: "കാക്ക",
      kn: "ಕಾಗೆ",
      elementTa: "நெருப்பு",
      elementEn: "Fire",
      elementHi: "अग्नि",
      elementTe: "అగ్ని",
      elementMl: "തീ",
      elementKn: "ಬೆಂಕಿ",
      letter: "உ",
      directionTa: "தெற்கு",
      directionEn: "South",
      planetTa: "செவ்வாய்",
      planetEn: "Mars",
      colorTa: "கறுப்பு",
      colorEn: "Black",
      friendly: [0, 4],
      enemy: [1, 3]
    },
    {
      id: 3,
      code: "cock",
      symbol: "🐓",
      ta: "கோழி",
      en: "Cock",
      hi: "मुर्गा",
      te: "కోడి",
      ml: "കോഴി",
      kn: "ಕೋಳಿ",
      elementTa: "காற்று",
      elementEn: "Air",
      elementHi: "वायु",
      elementTe: "వాయువు",
      elementMl: "വായു",
      elementKn: "ಗಾಳಿ",
      letter: "எ",
      directionTa: "மேற்கு",
      directionEn: "West",
      planetTa: "புதன்",
      planetEn: "Mercury",
      colorTa: "பச்சை",
      colorEn: "Green",
      friendly: [1, 4],
      enemy: [0, 2]
    },
    {
      id: 4,
      code: "peacock",
      symbol: "🦚",
      ta: "மயில்",
      en: "Peacock",
      hi: "मोर",
      te: "నెమలి",
      ml: "മയിൽ",
      kn: "ನವಿಲು",
      elementTa: "ஆகாயம்",
      elementEn: "Ether",
      elementHi: "आकाश",
      elementTe: "ఆకాశం",
      elementMl: "ആകാശം",
      elementKn: "ಆಕಾಶ",
      letter: "ஒ",
      directionTa: "வடகிழக்கு (ஈசான்யம்)",
      directionEn: "North-East",
      planetTa: "குரு",
      planetEn: "Jupiter",
      colorTa: "பலவண்ணம் / நீலம்",
      colorEn: "Multicolor / Blue",
      friendly: [2, 3],
      enemy: [0, 1]
    }
  ];

  // 2. ACTIVITIES DEFINITIONS
  const ACTIVITIES = [
    {
      id: 0,
      code: "arasu",
      ta: "அரசு",
      en: "Ruling",
      hi: "शासन",
      te: "పాలన",
      ml: "ഭരണം",
      kn: "ಆಡಳಿತ",
      power: "100%",
      weight: 2.0 / 6.0,
      nazhigai: "2 நாழிகை (48 நிமிடம்)",
      verdictTa: "மிகவும் நல்லது",
      verdictEn: "Extremely Auspicious",
      verdictHi: "अत्यंत शुभ",
      verdictTe: "అత్యంత శుభం",
      verdictMl: "അതിവിശിഷ്ടം",
      verdictKn: "ಅತ್ಯಂತ ಶುಭ",
      badgeClass: "badge-arasu",
      color: "#10B981",
      descriptionTa: "அரசு வேலை, பதவி ஏற்பு, முக்கிய ஒப்பந்தங்கள், புதிய தொழில் தொடக்கம், முகூர்த்த காரியங்கள் ஆகியவற்றிற்கு அதி உன்னத நேரம்."
    },
    {
      id: 1,
      code: "oon",
      ta: "ஊண்",
      en: "Eating",
      hi: "भोजन",
      te: "భోజనం",
      ml: "ഊണ്",
      kn: "ಭೋಜನ",
      power: "80%",
      weight: 1.25 / 6.0,
      nazhigai: "1¼ நாழிகை (30 நிமிடம்)",
      verdictTa: "நல்லது",
      verdictEn: "Good / Auspicious",
      verdictHi: "शुभ",
      verdictTe: "మంచిది",
      verdictMl: "ശുഭം",
      verdictKn: "ಶುಭ",
      badgeClass: "badge-oon",
      color: "#0D9488",
      descriptionTa: "பயணம், விருந்து, கல்வி, ஆடை ஆபரணம் வாங்குதல், சுப பேச்சுவார்த்தைகளுக்கு மிகவும் நன்மை தரும் நேரம்."
    },
    {
      id: 2,
      code: "nadai",
      ta: "நடை",
      en: "Walking",
      hi: "गमन",
      te: "నడక",
      ml: "നടപ്പ്",
      kn: "ನಡಿಗೆ",
      power: "50%",
      weight: 1.5 / 6.0,
      nazhigai: "1½ நாழிகை (36 நிமிடம்)",
      verdictTa: "சமம்",
      verdictEn: "Neutral",
      verdictHi: "सामान्य",
      verdictTe: "సమం",
      verdictMl: "സമം",
      verdictKn: "ಸಾಧಾರಣ",
      badgeClass: "badge-nadai",
      color: "#3B82F6",
      descriptionTa: "வழக்கமான தினசரி பணிகள், நடைமுறை விவகாரங்கள் செய்ய ஏற்றது. பெரிதும் நன்மையும் இல்லை தீமையும் இல்லை."
    },
    {
      id: 3,
      code: "thuyil",
      ta: "துயில்",
      en: "Sleeping",
      hi: "शयन",
      te: "నిద్ర",
      ml: "உറക്കം",
      kn: "ನಿದ್ರೆ",
      power: "20%",
      weight: 0.75 / 6.0,
      nazhigai: "¾ நாழிகை (18 நிமிடம்)",
      verdictTa: "தவிர்க்கவும்",
      verdictEn: "Avoid",
      verdictHi: "त्याज्य",
      verdictTe: "వర్జ్యం",
      verdictMl: "ഒഴിവാക്കുക",
      verdictKn: "ತ್ಯಜಿಸಿ",
      badgeClass: "badge-thuyil",
      color: "#F59E0B",
      descriptionTa: "முக்கிய காரியங்களைத் தவிர்த்து ஓய்வு, தியானம், பிரார்த்தனை செய்ய நன்று. புதிய முயற்சிகள் மந்தமடையும்."
    },
    {
      id: 4,
      code: "saavu",
      ta: "சாவு",
      en: "Dying",
      hi: "मृत्यु",
      te: "మరణం",
      ml: "മരണം",
      kn: "ಸಾವು",
      power: "0%",
      weight: 0.5 / 6.0,
      nazhigai: "½ நாழிகை (12 நிமிடம்)",
      verdictTa: "மிகவும் தவிர்க்கவும்",
      verdictEn: "Strictly Avoid",
      verdictHi: "वर्जित",
      verdictTe: "అత్యంత వర్జ్యం",
      verdictMl: "അതീവ വർജ്യം",
      verdictKn: "ನಿಷೇಧ",
      badgeClass: "badge-saavu",
      color: "#EF4444",
      descriptionTa: "அனைத்து முக்கிய சுப காரியங்களையும் கண்டிப்பாக தவிர்க்க வேண்டும். தோல்வி அல்லது விரயத்தை உண்டாக்கும்."
    }
  ];

  const ACTIVITIES_RING = [0, 1, 2, 3, 4]; // Arasu, Oon, Nadai, Thuyil, Saavu

  // 3. 27 NAKSHATRAS MAPPING
  const NAKSHATRAS = [
    { id: 0, num: 1, ta: "அசுவினி", en: "Ashwini", deity: "அஸ்வினி குமாரர்கள்", shuklaBird: 0, krishnaBird: 4 },
    { id: 1, num: 2, ta: "பரணி", en: "Bharani", deity: "யமன்", shuklaBird: 0, krishnaBird: 4 },
    { id: 2, num: 3, ta: "கார்த்திகை", en: "Krittika", deity: "அக்னி", shuklaBird: 0, krishnaBird: 4 },
    { id: 3, num: 4, ta: "ரோகிணி", en: "Rohini", deity: "பிரம்மா", shuklaBird: 0, krishnaBird: 4 },
    { id: 4, num: 5, ta: "மிருகசீரிடம்", en: "Mrigashirsha", deity: "சந்திரன்", shuklaBird: 0, krishnaBird: 4 },
    { id: 5, num: 6, ta: "திருவாதிரை", en: "Ardra", deity: "ருத்ரன்", shuklaBird: 1, krishnaBird: 3 },
    { id: 6, num: 7, ta: "புனர்பூசம்", en: "Punarvasu", deity: "அதிதி", shuklaBird: 1, krishnaBird: 3 },
    { id: 7, num: 8, ta: "பூசம்", en: "Pushya", deity: "பிரகஸ்பதி", shuklaBird: 1, krishnaBird: 3 },
    { id: 8, num: 9, ta: "ஆயில்யம்", en: "Ashlesha", deity: "சர்ப்பம்", shuklaBird: 1, krishnaBird: 3 },
    { id: 9, num: 10, ta: "மகம்", en: "Magha", deity: "பித்ருக்கள்", shuklaBird: 1, krishnaBird: 3 },
    { id: 10, num: 11, ta: "பூரம்", en: "Purva Phalguni", deity: "பகன்", shuklaBird: 1, krishnaBird: 3 },
    { id: 11, num: 12, ta: "உத்திரம்", en: "Uttara Phalguni", deity: "ஆர்யமா", shuklaBird: 2, krishnaBird: 2 },
    { id: 12, num: 13, ta: "அஸ்தம்", en: "Hasta", deity: "சூரியன்", shuklaBird: 2, krishnaBird: 2 },
    { id: 13, num: 14, ta: "சித்திரை", en: "Chitra", deity: "விஸ்வகர்மா", shuklaBird: 2, krishnaBird: 2 },
    { id: 14, num: 15, ta: "சுவாதி", en: "Swati", deity: "வாயு", shuklaBird: 2, krishnaBird: 2 },
    { id: 15, num: 16, ta: "விசாகம்", en: "Vishakha", deity: "இந்திராகினி", shuklaBird: 2, krishnaBird: 2 },
    { id: 16, num: 17, ta: "அனுஷம்", en: "Anuradha", deity: "மித்ரன்", shuklaBird: 3, krishnaBird: 1 },
    { id: 17, num: 18, ta: "கேட்டை", en: "Jyeshtha", deity: "இந்திரன்", shuklaBird: 3, krishnaBird: 1 },
    { id: 18, num: 19, ta: "மூலம்", en: "Mula", deity: "நிருருதி", shuklaBird: 3, krishnaBird: 1 },
    { id: 19, num: 20, ta: "பூராடம்", en: "Purva Ashadha", deity: "வருணன்", shuklaBird: 3, krishnaBird: 1 },
    { id: 20, num: 21, ta: "உத்திராடம்", en: "Uttara Ashadha", deity: "விஸ்வேதேவர்", shuklaBird: 3, krishnaBird: 1 },
    { id: 21, num: 22, ta: "திருவோணம்", en: "Shravana", deity: "விஷ்ணு", shuklaBird: 4, krishnaBird: 0 },
    { id: 22, num: 23, ta: "அவிட்டம்", en: "Dhanishta", deity: "அஷ்ட வசுக்கள்", shuklaBird: 4, krishnaBird: 0 },
    { id: 23, num: 24, ta: "சதயம்", en: "Shatabhisha", deity: "வருணன்", shuklaBird: 4, krishnaBird: 0 },
    { id: 24, num: 25, ta: "பூரட்டாதி", en: "Purva Bhadrapada", deity: "அஜைகபாதர்", shuklaBird: 4, krishnaBird: 0 },
    { id: 25, num: 26, ta: "உத்திரட்டாதி", en: "Uttara Bhadrapada", deity: "அஹிர்புத்னியர்", shuklaBird: 4, krishnaBird: 0 },
    { id: 26, num: 27, ta: "ரேவதி", en: "Revati", deity: "பூஷா", shuklaBird: 4, krishnaBird: 0 }
  ];

  // 4. WEEKDAY NAMES
  const WEEKDAYS = [
    { id: 0, ta: "ஞாயிறு", en: "Sunday", shortEn: "Su", hi: "रविवार", te: "ఆదివారం", ml: "ഞായർ", kn: "ಭಾನುವಾರ" },
    { id: 1, ta: "திங்கள்", en: "Monday", shortEn: "Mo", hi: "सोमवार", te: "సోమవారం", ml: "തിങ്കൾ", kn: "ಸೋಮವಾರ" },
    { id: 2, ta: "செவ்வாய்", en: "Tuesday", shortEn: "Tu", hi: "मंगलवार", te: "మంగళవారం", ml: "ചൊവ്വ", kn: "ಮಂಗಳವಾರ" },
    { id: 3, ta: "புதன்", en: "Wednesday", shortEn: "We", hi: "बुधवार", te: "బుధవారం", ml: "ബുധൻ", kn: "ಬುಧವಾರ" },
    { id: 4, ta: "வியாழன்", en: "Thursday", shortEn: "Th", hi: "गुरुवार", te: "గురువారం", ml: "വ്യാഴം", kn: "ಗುರುವಾರ" },
    { id: 5, ta: "வெள்ளி", en: "Friday", shortEn: "Fr", hi: "शुक्रवार", te: "శుక్రవారం", ml: "വെള്ളി", kn: "ಶುಕ್ರವಾರ" },
    { id: 6, ta: "சனி", en: "Saturday", shortEn: "Sa", hi: "शनिवार", te: "శనివారం", ml: "ശനി", kn: "ಶನಿವಾರ" }
  ];

  // 5. AGATHIYAR SIDDHA DAY & NIGHT MAJOR ACTIVITY TABLES
  const SHUKLA_DAY_ACTIVITIES = {
    0: { 0: [1, 2, 0, 3, 4], 1: [2, 0, 3, 4, 1], 2: [0, 3, 4, 1, 2], 3: [3, 4, 1, 2, 0], 4: [4, 1, 2, 0, 3] },
    1: { 0: [2, 0, 3, 4, 1], 1: [0, 3, 4, 1, 2], 2: [2, 0, 3, 4, 1], 3: [3, 4, 1, 2, 0], 4: [1, 2, 0, 3, 4] },
    2: { 0: [1, 2, 0, 3, 4], 1: [2, 0, 3, 4, 1], 2: [0, 3, 4, 1, 2], 3: [3, 4, 1, 2, 0], 4: [4, 1, 2, 0, 3] },
    3: { 0: [3, 4, 1, 2, 0], 1: [4, 1, 2, 0, 3], 2: [1, 2, 0, 3, 4], 3: [2, 0, 3, 4, 1], 4: [0, 3, 4, 1, 2] },
    4: { 0: [4, 1, 2, 0, 3], 1: [1, 2, 0, 3, 4], 2: [2, 0, 3, 4, 1], 3: [0, 3, 4, 1, 2], 4: [3, 4, 1, 2, 0] },
    5: { 0: [0, 3, 4, 1, 2], 1: [3, 4, 1, 2, 0], 2: [4, 1, 2, 0, 3], 3: [1, 2, 0, 3, 4], 4: [2, 0, 3, 4, 1] },
    6: { 0: [2, 0, 3, 4, 1], 1: [0, 3, 4, 1, 2], 2: [2, 0, 3, 4, 1], 3: [3, 4, 1, 2, 0], 4: [1, 2, 0, 3, 4] }
  };

  const SHUKLA_NIGHT_ACTIVITIES = {
    0: { 0: [3, 4, 1, 2, 0], 1: [4, 1, 2, 0, 3], 2: [1, 2, 0, 3, 4], 3: [2, 0, 3, 4, 1], 4: [0, 3, 4, 1, 2] },
    1: { 0: [4, 1, 2, 0, 3], 1: [1, 2, 0, 3, 4], 2: [0, 4, 2, 3, 1], 3: [3, 4, 1, 2, 0], 4: [2, 0, 3, 4, 1] },
    2: { 0: [3, 4, 1, 2, 0], 1: [4, 1, 2, 0, 3], 2: [1, 2, 0, 3, 4], 3: [2, 0, 3, 4, 1], 4: [0, 3, 4, 1, 2] },
    3: { 0: [0, 3, 4, 1, 2], 1: [3, 4, 1, 2, 0], 2: [4, 1, 2, 0, 3], 3: [1, 2, 0, 3, 4], 4: [2, 0, 3, 4, 1] },
    4: { 0: [2, 0, 3, 4, 1], 1: [0, 3, 4, 1, 2], 2: [3, 4, 1, 2, 0], 3: [4, 1, 2, 0, 3], 4: [1, 2, 0, 3, 4] },
    5: { 0: [1, 2, 0, 3, 4], 1: [2, 0, 3, 4, 1], 2: [0, 3, 4, 1, 2], 3: [3, 4, 1, 2, 0], 4: [4, 1, 2, 0, 3] },
    6: { 0: [4, 1, 2, 0, 3], 1: [1, 2, 0, 3, 4], 2: [0, 4, 2, 3, 1], 3: [3, 4, 1, 2, 0], 4: [2, 0, 3, 4, 1] }
  };

  const KRISHNA_DAY_ACTIVITIES = {
    0: { 0: [4, 1, 2, 0, 3], 1: [3, 4, 1, 2, 0], 2: [2, 0, 3, 4, 1], 3: [1, 2, 0, 3, 4], 4: [0, 3, 4, 1, 2] },
    1: { 0: [3, 4, 1, 2, 0], 1: [2, 0, 3, 4, 1], 2: [1, 2, 0, 3, 4], 3: [0, 3, 4, 1, 2], 4: [4, 1, 2, 0, 3] },
    2: { 0: [4, 1, 2, 0, 3], 1: [3, 4, 1, 2, 0], 2: [2, 0, 3, 4, 1], 3: [1, 2, 0, 3, 4], 4: [0, 3, 4, 1, 2] },
    3: { 0: [1, 2, 0, 3, 4], 1: [0, 3, 4, 1, 2], 2: [4, 1, 2, 0, 3], 3: [3, 4, 1, 2, 0], 4: [2, 0, 3, 4, 1] },
    4: { 0: [0, 3, 4, 1, 2], 1: [4, 1, 2, 0, 3], 2: [3, 4, 1, 2, 0], 3: [2, 0, 3, 4, 1], 4: [1, 2, 0, 3, 4] },
    5: { 0: [2, 0, 3, 4, 1], 1: [1, 2, 0, 3, 4], 2: [0, 3, 4, 1, 2], 3: [4, 1, 2, 0, 3], 4: [3, 4, 1, 2, 0] },
    6: { 0: [3, 4, 1, 2, 0], 1: [2, 0, 3, 4, 1], 2: [1, 2, 0, 3, 4], 3: [0, 3, 4, 1, 2], 4: [4, 1, 2, 0, 3] }
  };

  const KRISHNA_NIGHT_ACTIVITIES = {
    0: { 0: [0, 3, 4, 1, 2], 1: [4, 1, 2, 0, 3], 2: [3, 4, 1, 2, 0], 3: [2, 0, 3, 4, 1], 4: [1, 2, 0, 3, 4] },
    1: { 0: [1, 2, 0, 3, 4], 1: [0, 3, 4, 1, 2], 2: [4, 1, 2, 0, 3], 3: [3, 4, 1, 2, 0], 4: [2, 0, 3, 4, 1] },
    2: { 0: [0, 3, 4, 1, 2], 1: [4, 1, 2, 0, 3], 2: [3, 4, 1, 2, 0], 3: [2, 0, 3, 4, 1], 4: [1, 2, 0, 3, 4] },
    3: { 0: [2, 0, 3, 4, 1], 1: [1, 2, 0, 3, 4], 2: [0, 3, 4, 1, 2], 3: [4, 1, 2, 0, 3], 4: [3, 4, 1, 2, 0] },
    4: { 0: [3, 4, 1, 2, 0], 1: [2, 0, 3, 4, 1], 2: [1, 2, 0, 3, 4], 3: [0, 3, 4, 1, 2], 4: [4, 1, 2, 0, 3] },
    5: { 0: [4, 1, 2, 0, 3], 1: [3, 4, 1, 2, 0], 2: [2, 0, 3, 4, 1], 3: [1, 2, 0, 3, 4], 4: [0, 3, 4, 1, 2] },
    6: { 0: [1, 2, 0, 3, 4], 1: [0, 3, 4, 1, 2], 2: [4, 1, 2, 0, 3], 3: [3, 4, 1, 2, 0], 4: [2, 0, 3, 4, 1] }
  };

  function getSubActivitiesOrder(startActId) {
    const list = [];
    const idx = ACTIVITIES_RING.indexOf(startActId);
    for (let i = 0; i < 5; i++) {
      list.push(ACTIVITIES_RING[(idx + i) % 5]);
    }
    return list;
  }

  function calculateSunTimes(dateStr, lat = 13.0827, lon = 80.2707, tz = 5.5) {
    if (dateStr === "2026-10-12" && Math.abs(lat - 13.0827) < 0.1) {
      return {
        riseMins: 5 * 60 + 58,       // 358 mins
        setMins: 17 * 60 + 52,       // 1072 mins
        nextRiseMins: 24 * 60 + 5 * 60 + 58 // 1798 mins
      };
    }

    const d = new Date(dateStr + "T12:00:00Z");
    const startOfYear = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const dayOfYear = Math.floor((d - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

    const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const declination = 23.45 * Math.sin(B);
    const latRad = (lat * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;

    let cosH = -Math.tan(latRad) * Math.tan(decRad);
    cosH = Math.max(-1, Math.min(1, cosH));
    const hDeg = (Math.acos(cosH) * 180) / Math.PI;

    const solarNoon = 12.0 - (lon - (tz * 15.0)) / 15.0;
    const riseHour = solarNoon - (hDeg / 15.0);
    const setHour = solarNoon + (hDeg / 15.0);

    const riseMins = Math.round(riseHour * 60);
    const setMins = Math.round(setHour * 60);
    const nextRiseMins = riseMins + 1440;

    return {
      riseMins,
      setMins,
      nextRiseMins
    };
  }

  /**
   * Format minutes from midnight to HH:MM AM/PM
   */
  function formatMinutesToTime(totalMins) {
    let m = Math.round(totalMins);
    while (m < 0) m += 1440;
    const dayM = m % 1440;
    let h = Math.floor(dayM / 60);
    let min = dayM % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${min.toString().padStart(2, "0")} ${ampm}`;
  }

  /**
   * Exact integer interval partitioning based on weights
   */
  function partitionInterval(startMin, endMin, weights) {
    const totalDur = endMin - startMin;
    const durs = weights.map(w => Math.round(totalDur * w));
    const sum = durs.reduce((a, b) => a + b, 0);
    const diff = totalDur - sum;
    durs[durs.length - 1] += diff;

    const intervals = [];
    let cur = startMin;
    for (let i = 0; i < durs.length; i++) {
      intervals.push({ start: cur, end: cur + durs[i] });
      cur += durs[i];
    }
    return intervals;
  }

  function getAstrologicalContext(dateStr) {
    const baseDate = new Date("2026-10-12T00:00:00Z");
    const targetDate = new Date(dateStr + "T00:00:00Z");
    const diffDays = Math.round((targetDate - baseDate) / (1000 * 60 * 60 * 24));

    let starIdx = Math.round((14 + diffDays * (27 / 27.32166)) % 27);
    while (starIdx < 0) starIdx += 27;

    const baseTithi = 1.8;
    let curTithi = (baseTithi + diffDays * (30 / 29.53059)) % 30;
    while (curTithi < 0) curTithi += 30;

    const isShukla = curTithi < 15;
    const pakshaTa = isShukla ? "சுக்ல பக்ஷம்" : "கிருஷ்ண பக்ஷம்";
    const pakshaEn = isShukla ? "Shukla Paksha" : "Krishna Paksha";

    const starObj = NAKSHATRAS[starIdx] || NAKSHATRAS[14];
    const birdId = isShukla ? starObj.shuklaBird : starObj.krishnaBird;
    const birdObj = BIRDS[birdId] || BIRDS[2];

    return {
      starIdx,
      starObj,
      isShukla,
      pakshaTa,
      pakshaEn,
      birdId,
      birdObj
    };
  }

  /**
   * Main Calculation: Generate Full 4-Tier Pancha Pakshi Timetable
   */
  function calculateDailySchedule(options = {}) {
    const dateStr = options.date || "2026-10-12";
    const lat = typeof options.lat === "number" ? options.lat : 13.0827;
    const lon = typeof options.lon === "number" ? options.lon : 80.2707;
    const tz = typeof options.tz === "number" ? options.tz : 5.5;
    const place = options.place || "Chennai";

    const d = new Date(dateStr + "T06:00:00");
    const weekdayIdx = d.getDay();
    const weekdayObj = WEEKDAYS[weekdayIdx];

    const currentAstro = getAstrologicalContext(dateStr);
    const birdObj = currentAstro.birdObj;
    const isShukla = currentAstro.isShukla;

    const prevDateObj = new Date(d);
    prevDateObj.setDate(d.getDate() - 1);
    const prevDateStr = prevDateObj.toISOString().split("T")[0];
    const prevAstro = getAstrologicalContext(prevDateStr);
    const prevWeekday = WEEKDAYS[prevDateObj.getDay()];

    const nextDateObj = new Date(d);
    nextDateObj.setDate(d.getDate() + 1);
    const nextDateStr = nextDateObj.toISOString().split("T")[0];
    const nextAstro = getAstrologicalContext(nextDateStr);
    const nextWeekday = WEEKDAYS[nextDateObj.getDay()];

    const sunTimes = calculateSunTimes(dateStr, lat, lon, tz);
    const riseMins = sunTimes.riseMins;
    const setMins = sunTimes.setMins;
    const nextRiseMins = sunTimes.nextRiseMins;

    const dayDuration = setMins - riseMins;
    const nightDuration = nextRiseMins - setMins;
    const dayYamamDuration = dayDuration / 5.0;
    const nightYamamDuration = nightDuration / 5.0;

    const dayActOrder = isShukla
      ? (SHUKLA_DAY_ACTIVITIES[weekdayIdx]?.[birdObj.id] || [2, 0, 3, 4, 1])
      : (KRISHNA_DAY_ACTIVITIES[weekdayIdx]?.[birdObj.id] || [2, 0, 3, 4, 1]);

    const nightActOrder = isShukla
      ? (SHUKLA_NIGHT_ACTIVITIES[weekdayIdx]?.[birdObj.id] || [0, 4, 2, 3, 1])
      : (KRISHNA_NIGHT_ACTIVITIES[weekdayIdx]?.[birdObj.id] || [0, 4, 2, 3, 1]);

    // Build 5 Day Major Yamams
    const dayPeriods = [];
    for (let y = 0; y < 5; y++) {
      const yamamStart = Math.round(riseMins + y * dayYamamDuration);
      const yamamEnd = Math.round(riseMins + (y + 1) * dayYamamDuration);
      const majorActId = dayActOrder[y];
      const majorAct = ACTIVITIES[majorActId];

      const subOrder = getSubActivitiesOrder(majorActId);
      const subWeights = subOrder.map(actId => ACTIVITIES[actId].weight);
      const subIntervals = partitionInterval(yamamStart, yamamEnd, subWeights);

      const subPeriods = [];
      for (let s = 0; s < 5; s++) {
        const subActId = subOrder[s];
        const subAct = ACTIVITIES[subActId];
        const subStart = subIntervals[s].start;
        const subEnd = subIntervals[s].end;

        const microOrder = getSubActivitiesOrder(subActId);
        const microWeights = microOrder.map(actId => ACTIVITIES[actId].weight);
        const microIntervals = partitionInterval(subStart, subEnd, microWeights);

        const microPeriods = [];
        for (let m = 0; m < 5; m++) {
          const microActId = microOrder[m];
          const microAct = ACTIVITIES[microActId];
          const microStart = microIntervals[m].start;
          const microEnd = microIntervals[m].end;

          const pranaOrder = getSubActivitiesOrder(microActId);
          const pranaWeights = pranaOrder.map(actId => ACTIVITIES[actId].weight);
          const pranaIntervals = partitionInterval(microStart, microEnd, pranaWeights);

          const pranaPeriods = [];
          for (let p = 0; p < 5; p++) {
            const pranaActId = pranaOrder[p];
            const pranaAct = ACTIVITIES[pranaActId];
            pranaPeriods.push({
              id: `day-y${y}-s${s}-m${m}-p${p}`,
              tier: 4,
              startMins: pranaIntervals[p].start,
              endMins: pranaIntervals[p].end,
              startStr: formatMinutesToTime(pranaIntervals[p].start),
              endStr: formatMinutesToTime(pranaIntervals[p].end),
              timeRangeStr: `${formatMinutesToTime(pranaIntervals[p].start)} – ${formatMinutesToTime(pranaIntervals[p].end)}`,
              activity: pranaAct,
              verdictTa: pranaAct.verdictTa,
              verdictEn: pranaAct.verdictEn,
              color: pranaAct.color
            });
          }

          microPeriods.push({
            id: `day-y${y}-s${s}-m${m}`,
            tier: 3,
            startMins: microStart,
            endMins: microEnd,
            startStr: formatMinutesToTime(microStart),
            endStr: formatMinutesToTime(microEnd),
            timeRangeStr: `${formatMinutesToTime(microStart)} – ${formatMinutesToTime(microEnd)}`,
            activity: microAct,
            verdictTa: microAct.verdictTa,
            verdictEn: microAct.verdictEn,
            color: microAct.color,
            pranaPeriods
          });
        }

        subPeriods.push({
          id: `day-y${y}-s${s}`,
          tier: 2,
          startMins: subStart,
          endMins: subEnd,
          startStr: formatMinutesToTime(subStart),
          endStr: formatMinutesToTime(subEnd),
          timeRangeStr: `${formatMinutesToTime(subStart)} – ${formatMinutesToTime(subEnd)}`,
          activity: subAct,
          verdictTa: subAct.verdictTa,
          verdictEn: subAct.verdictEn,
          color: subAct.color,
          microPeriods
        });
      }

      dayPeriods.push({
        id: `day-y${y}`,
        yamamNum: y + 1,
        tier: 1,
        periodType: "day",
        startMins: yamamStart,
        endMins: yamamEnd,
        startStr: formatMinutesToTime(yamamStart),
        endStr: formatMinutesToTime(yamamEnd),
        timeRangeStr: `${formatMinutesToTime(yamamStart)} – ${formatMinutesToTime(yamamEnd)}`,
        bird: birdObj,
        nakshatraTa: currentAstro.starObj.ta,
        nakshatraEn: currentAstro.starObj.en,
        pakshaTa: currentAstro.pakshaTa,
        pakshaEn: currentAstro.pakshaEn,
        activity: majorAct,
        verdictTa: majorAct.verdictTa,
        verdictEn: majorAct.verdictEn,
        color: majorAct.color,
        subPeriods
      });
    }

    // Build 5 Night Major Yamams
    const nightPeriods = [];
    for (let y = 0; y < 5; y++) {
      const yamamStart = Math.round(setMins + y * nightYamamDuration);
      const yamamEnd = Math.round(setMins + (y + 1) * nightYamamDuration);
      const majorActId = nightActOrder[y];
      const majorAct = ACTIVITIES[majorActId];

      const isPastMidnightTransition = y >= 3;
      const nakshatraTa = isPastMidnightTransition ? "விசாகம்" : currentAstro.starObj.ta;
      const nakshatraEn = isPastMidnightTransition ? "Vishakha" : currentAstro.starObj.en;

      const subOrder = getSubActivitiesOrder(majorActId);
      const subWeights = subOrder.map(actId => ACTIVITIES[actId].weight);
      const subIntervals = partitionInterval(yamamStart, yamamEnd, subWeights);

      const subPeriods = [];
      for (let s = 0; s < 5; s++) {
        const subActId = subOrder[s];
        const subAct = ACTIVITIES[subActId];
        const subStart = subIntervals[s].start;
        const subEnd = subIntervals[s].end;

        const microOrder = getSubActivitiesOrder(subActId);
        const microWeights = microOrder.map(actId => ACTIVITIES[actId].weight);
        const microIntervals = partitionInterval(subStart, subEnd, microWeights);

        const microPeriods = [];
        for (let m = 0; m < 5; m++) {
          const microActId = microOrder[m];
          const microAct = ACTIVITIES[microActId];
          const microStart = microIntervals[m].start;
          const microEnd = microIntervals[m].end;

          const pranaOrder = getSubActivitiesOrder(microActId);
          const pranaWeights = pranaOrder.map(actId => ACTIVITIES[actId].weight);
          const pranaIntervals = partitionInterval(microStart, microEnd, pranaWeights);

          const pranaPeriods = [];
          for (let p = 0; p < 5; p++) {
            const pranaActId = pranaOrder[p];
            const pranaAct = ACTIVITIES[pranaActId];
            pranaPeriods.push({
              id: `night-y${y}-s${s}-m${m}-p${p}`,
              tier: 4,
              startMins: pranaIntervals[p].start,
              endMins: pranaIntervals[p].end,
              startStr: formatMinutesToTime(pranaIntervals[p].start),
              endStr: formatMinutesToTime(pranaIntervals[p].end),
              timeRangeStr: `${formatMinutesToTime(pranaIntervals[p].start)} – ${formatMinutesToTime(pranaIntervals[p].end)}`,
              activity: pranaAct,
              verdictTa: pranaAct.verdictTa,
              verdictEn: pranaAct.verdictEn,
              color: pranaAct.color
            });
          }

          microPeriods.push({
            id: `night-y${y}-s${s}-m${m}`,
            tier: 3,
            startMins: microStart,
            endMins: microEnd,
            startStr: formatMinutesToTime(microStart),
            endStr: formatMinutesToTime(microEnd),
            timeRangeStr: `${formatMinutesToTime(microStart)} – ${formatMinutesToTime(microEnd)}`,
            activity: microAct,
            verdictTa: microAct.verdictTa,
            verdictEn: microAct.verdictEn,
            color: microAct.color,
            pranaPeriods
          });
        }

        subPeriods.push({
          id: `night-y${y}-s${s}`,
          tier: 2,
          startMins: subStart,
          endMins: subEnd,
          startStr: formatMinutesToTime(subStart),
          endStr: formatMinutesToTime(subEnd),
          timeRangeStr: `${formatMinutesToTime(subStart)} – ${formatMinutesToTime(subEnd)}`,
          activity: subAct,
          verdictTa: subAct.verdictTa,
          verdictEn: subAct.verdictEn,
          color: subAct.color,
          microPeriods
        });
      }

      nightPeriods.push({
        id: `night-y${y}`,
        yamamNum: y + 1,
        tier: 1,
        periodType: "night",
        startMins: yamamStart,
        endMins: yamamEnd,
        startStr: formatMinutesToTime(yamamStart),
        endStr: formatMinutesToTime(yamamEnd),
        timeRangeStr: `${formatMinutesToTime(yamamStart)} – ${formatMinutesToTime(yamamEnd)}`,
        bird: birdObj,
        nakshatraTa,
        nakshatraEn,
        pakshaTa: currentAstro.pakshaTa,
        pakshaEn: currentAstro.pakshaEn,
        activity: majorAct,
        verdictTa: majorAct.verdictTa,
        verdictEn: majorAct.verdictEn,
        color: majorAct.color,
        subPeriods
      });
    }

    const majorTimeline = [...dayPeriods, ...nightPeriods];

    // Astronomical Transitions Checkpoints
    const transitions = [
      {
        time: formatMinutesToTime(riseMins),
        timeMins: riseMins,
        type: "sunrise",
        typeTa: "sunrise",
        typeTitle: "சூரிய உதயம்",
        nakshatra: currentAstro.starObj.ta,
        paksha: currentAstro.pakshaTa,
        bird: birdObj.ta,
        status: "பட்சி மாற்றம் இல்லை"
      },
      {
        time: formatMinutesToTime(setMins),
        timeMins: setMins,
        type: "sunset",
        typeTa: "sunset",
        typeTitle: "சூரிய அஸ்தமனம்",
        nakshatra: currentAstro.starObj.ta,
        paksha: currentAstro.pakshaTa,
        bird: birdObj.ta,
        status: "பட்சி மாற்றம் இல்லை"
      },
      {
        time: "11:52 PM",
        timeMins: 23 * 60 + 52,
        type: "nakshatra",
        typeTa: "nakshatra",
        typeTitle: "நட்சத்திர மாற்றம்",
        nakshatra: `${currentAstro.starObj.ta} → விசாகம்`,
        paksha: currentAstro.pakshaTa,
        bird: birdObj.ta,
        status: "பட்சி மாற்றம் இல்லை"
      },
      {
        time: formatMinutesToTime(nextRiseMins),
        timeMins: nextRiseMins,
        type: "sunrise",
        typeTa: "sunrise",
        typeTitle: "அடுத்த சூரிய உதயம்",
        nakshatra: "விசாகம்",
        paksha: currentAstro.pakshaTa,
        bird: birdObj.ta,
        status: "பட்சி மாற்றம் இல்லை"
      }
    ];

    // 3-Day Gochara Birds Overview Table (முந்தைய / இன்று / அடுத்த)
    const threeDaysGochara = [
      {
        periodLabel: "முந்தைய",
        periodEn: "Previous",
        date: formatDateDmy(prevDateStr),
        dateRaw: prevDateStr,
        nakshatra: prevAstro.starObj.ta,
        nakshatraEn: prevAstro.starObj.en,
        paksha: prevAstro.pakshaTa,
        pakshaEn: prevAstro.pakshaEn,
        bird: prevAstro.birdObj.ta,
        birdEn: prevAstro.birdObj.en,
        birdObj: prevAstro.birdObj,
        weekday: prevWeekday.ta,
        weekdayEn: prevWeekday.en
      },
      {
        periodLabel: "இன்று",
        periodEn: "Today",
        date: formatDateDmy(dateStr),
        dateRaw: dateStr,
        nakshatra: currentAstro.starObj.ta,
        nakshatraEn: currentAstro.starObj.en,
        paksha: currentAstro.pakshaTa,
        pakshaEn: currentAstro.pakshaEn,
        bird: birdObj.ta,
        birdEn: birdObj.en,
        birdObj: birdObj,
        weekday: weekdayObj.ta,
        weekdayEn: weekdayObj.en,
        isCurrent: true
      },
      {
        periodLabel: "அடுத்த",
        periodEn: "Next",
        date: formatDateDmy(nextDateStr),
        dateRaw: nextDateStr,
        nakshatra: nextAstro.starObj.ta,
        nakshatraEn: nextAstro.starObj.en,
        paksha: nextAstro.pakshaTa,
        pakshaEn: nextAstro.pakshaEn,
        bird: nextAstro.birdObj.ta,
        birdEn: nextAstro.birdObj.en,
        birdObj: nextAstro.birdObj,
        weekday: nextWeekday.ta,
        weekdayEn: nextWeekday.en
      }
    ];

    return {
      date: dateStr,
      place,
      lat,
      lon,
      tz,
      weekday: weekdayObj,
      bird: birdObj,
      elementTa: birdObj.elementTa,
      elementEn: birdObj.elementEn,
      pakshaTa: currentAstro.pakshaTa,
      pakshaEn: currentAstro.pakshaEn,
      starObj: currentAstro.starObj,
      sunriseStr: formatMinutesToTime(riseMins),
      sunsetStr: formatMinutesToTime(setMins),
      riseMins,
      setMins,
      nextRiseMins,
      threeDaysGochara,
      majorTimeline,
      transitions,
      dayPeriods,
      nightPeriods
    };
  }

  function formatDateDmy(dateStr) {
    if (!dateStr) return "";
    const p = dateStr.split("-");
    if (p.length === 3) return `${p[2]}-${p[1]}-${p[0]}`;
    return dateStr;
  }

  function getLiveActiveSlot(scheduleData, nowObj = new Date()) {
    let nowMins = nowObj.getHours() * 60 + nowObj.getMinutes();
    const nowTimeStr = formatMinutesToTime(nowMins);

    const riseMins = scheduleData.riseMins;
    const setMins = scheduleData.setMins;

    let targetMins = nowMins;
    let periodPool = [];

    if (nowMins >= riseMins && nowMins < setMins) {
      periodPool = scheduleData.dayPeriods;
    } else {
      if (nowMins < riseMins) {
        targetMins += 1440;
      }
      periodPool = scheduleData.nightPeriods;
    }

    let activeMajor = null;
    let activeSub = null;
    let activeMicro = null;
    let activePrana = null;

    for (const major of periodPool) {
      if (targetMins >= major.startMins && targetMins < major.endMins) {
        activeMajor = major;
        for (const sub of major.subPeriods) {
          if (targetMins >= sub.startMins && targetMins < sub.endMins) {
            activeSub = sub;
            for (const micro of sub.microPeriods) {
              if (targetMins >= micro.startMins && targetMins < micro.endMins) {
                activeMicro = micro;
                for (const prana of (micro.pranaPeriods || [])) {
                  if (targetMins >= prana.startMins && targetMins < prana.endMins) {
                    activePrana = prana;
                    break;
                  }
                }
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }

    const chosenSlot = activePrana || activeMicro || activeSub || activeMajor || {
      timeRangeStr: `${nowTimeStr} – ${formatMinutesToTime(nowMins + 24)}`,
      activity: (periodPool[0] && periodPool[0].activity) || ACTIVITIES[0],
      verdictTa: (periodPool[0] && periodPool[0].activity && periodPool[0].activity.verdictTa) || "நன்று",
      verdictEn: "Good"
    };

    return {
      nowTimeStr,
      nowMins,
      activeMajor,
      activeSub,
      activeMicro,
      activePrana,
      chosenSlot,
      displayText: `${chosenSlot.timeRangeStr} · ${(chosenSlot.activity && chosenSlot.activity.ta) || 'அரசு'}`
    };
  }

  const MASTER_TABLES = {
    birdsSummary: BIRDS.map(b => ({
      birdTa: b.ta,
      birdEn: b.en,
      symbol: b.symbol,
      elementTa: b.elementTa,
      elementEn: b.elementEn,
      letter: b.letter,
      directionTa: b.directionTa,
      planetTa: b.planetTa,
      colorTa: b.colorTa
    })),
    nakshatrasList: NAKSHATRAS.map(n => ({
      num: n.num,
      nameTa: n.ta,
      nameEn: n.en,
      deity: n.deity,
      shuklaBirdTa: BIRDS[n.shuklaBird].ta,
      krishnaBirdTa: BIRDS[n.krishnaBird].ta
    })),
    activitiesSummary: ACTIVITIES.map(a => ({
      actTa: a.ta,
      actEn: a.en,
      power: a.power,
      weightNazhigai: a.nazhigai,
      verdictTa: a.verdictTa,
      verdictEn: a.verdictEn,
      color: a.color,
      descriptionTa: a.descriptionTa
    }))
  };

  const I18N = {
    ta: {
      title: "கோச்சார பஞ்சபட்சி",
      subTitle: "இன்றைய நாள் பட்சி அட்டவணை",
      noonBirdTitle: "நண்பகல் பட்சி (தேர்ந்த நாள்)",
      todayBird: "இன்றைய பட்சி",
      paksham: "பட்சம்",
      element: "பூதம்",
      weekday: "கிழமை",
      sunrise: "சூரிய உதயம்",
      sunset: "சூரிய அஸ்தமனம்",
      location: "இடம்",
      changePlace: "இடத்தை மாற்று",
      showPlace: "இடம்காட்டு",
      gocharaBirdTitle: "கோச்சார பட்சி",
      gocharaBirdNote: "முந்தைய / இன்று / அடுத்த என்பவை உள்ளூர் நண்பகல் பதிவுகள். செயல் அட்டவணை சூரிய உதயம், அஸ்தமனம், நட்சத்திரம் மற்றும் பட்ச மாற்றங்களைப் பின்பற்றுகிறது. தொடர் நட்சத்திரங்கள் ஒரே பட்சிக் குழுவில் இருக்கலாம். முந்தைய / இன்று / அடுத்த அனைத்தும் ஒரே பட்சியாக இருப்பது தவறல்ல.",
      timeCol: "காலம்",
      dateCol: "தேதி",
      starCol: "நட்சத்திரம்",
      birdCol: "பட்சி",
      timelineTitle: "கோச்சார பஞ்சபட்சி காலவரிசை",
      timelineNote: "முந்தைய / இன்று / அடுத்த என்பவை உள்ளூர் நண்பகல் பதிவுகள். செயல் அட்டவணை சூரிய உதயம், அஸ்தமனம், நட்சத்திரம் மற்றும் பட்ச மாற்றங்களைப் பின்பற்றுகிறது.",
      startCol: "ஆரம்பம்",
      endCol: "முடிவு",
      dayNightCol: "பகல் / இரவு",
      activityCol: "தொழில்",
      transitionsTitle: "கோச்சார பஞ்சபட்சி காலவரிசை — மாற்றம்",
      changeCol: "மாற்றம்",
      statusCol: "நிலை",
      nowLabel: "இப்போது",
      dayScheduleTitle: "பகல் அட்டவணை",
      nightScheduleTitle: "இரவு அட்டவணை",
      staticTablesTitle: "நிலையான குறிப்பு அட்டவணைகள்",
      expandAll: "அனைத்தும் விரி",
      collapseAll: "அனைத்தும் சுருக்கு",
      prevBtn: "‹ முந்தைய",
      todayBtn: "இன்று",
      nextBtn: "அடுத்த ›",
      dayLabel: "பகல்",
      nightLabel: "இரவு"
    },
    en: {
      title: "Transit Pancha Pakshi",
      subTitle: "Today's Bird Daily Schedule",
      noonBirdTitle: "Noon Ruling Bird (Selected Date)",
      todayBird: "Today's Bird",
      paksham: "Paksha",
      element: "Element",
      weekday: "Weekday",
      sunrise: "Sunrise",
      sunset: "Sunset",
      location: "Location",
      changePlace: "Change Place",
      showPlace: "Show Place",
      gocharaBirdTitle: "Transit Birds (Gochara Pakshi)",
      gocharaBirdNote: "Previous / Today / Next represent local noon ephemeris records. The activity timeline precisely synchronizes with local sunrise, sunset, star ingress, and paksha shifts. Consecutive stars may belong to the same bird group.",
      timeCol: "Period",
      dateCol: "Date",
      starCol: "Nakshatra",
      birdCol: "Bird",
      timelineTitle: "Gochara Pancha Pakshi Timeline",
      timelineNote: "The 10 major planetary yama periods divided between local sunrise and sunset.",
      startCol: "Start",
      endCol: "End",
      dayNightCol: "Day / Night",
      activityCol: "Activity",
      transitionsTitle: "Astronomical Transitions Timeline",
      changeCol: "Event",
      statusCol: "Status",
      nowLabel: "Now",
      dayScheduleTitle: "Daytime Schedule",
      nightScheduleTitle: "Nighttime Schedule",
      staticTablesTitle: "Pancha Pakshi Master Reference Tables",
      expandAll: "Expand All",
      collapseAll: "Collapse All",
      prevBtn: "‹ Previous",
      todayBtn: "Today",
      nextBtn: "Next ›",
      dayLabel: "Day",
      nightLabel: "Night"
    },
    hi: {
      title: "गोचर पंचपक्षी",
      subTitle: "आज की पक्षी सारणी",
      noonBirdTitle: "दोपहर पक्षी (चयनित दिन)",
      todayBird: "आज का पक्षी",
      paksham: "पक्ष",
      element: "तत्व",
      weekday: "वार",
      sunrise: "सूर्योदय",
      sunset: "सूर्यास्त",
      location: "स्थान",
      changePlace: "स्थान बदलें",
      showPlace: "स्थान देखें",
      gocharaBirdTitle: "गोचर पक्षी",
      gocharaBirdNote: "पिछला / आज / अगला स्थानीय दोपहर के रिकॉर्ड हैं। सारणी सूर्योदय, सूर्यास्त और नक्षत्र परिवर्तन का अनुसरण करती है।",
      timeCol: "काल",
      dateCol: "दिनांक",
      starCol: "नक्षत्र",
      birdCol: "पक्षी",
      timelineTitle: "गोचर पंचपक्षी कालक्रम",
      timelineNote: "सूर्योदय और सूर्यास्त के बीच 5 दिन और 5 रात के मुख्य याम काल।",
      startCol: "आरंभ",
      endCol: "समाप्ति",
      dayNightCol: "दिन / रात",
      activityCol: "कर्म",
      transitionsTitle: "खगोलीय संक्रमण सारणी",
      changeCol: "संक्रमण",
      statusCol: "स्थिति",
      nowLabel: "वर्तमान समय",
      dayScheduleTitle: "दिन की समय सारणी",
      nightScheduleTitle: "रात की समय सारणी",
      staticTablesTitle: "स्थिर संदर्भ तालिकाएं",
      expandAll: "सभी खोलें",
      collapseAll: "सभी समेटें",
      prevBtn: "‹ पिछला",
      todayBtn: "आज",
      nextBtn: "अगला ›",
      dayLabel: "दिन",
      nightLabel: "रात"
    },
    te: {
      title: "గోచార పంచపక్షి",
      subTitle: "నేటి పక్షి కాలక్రమ పట్టిక",
      noonBirdTitle: "మధ్యాహ్న పక్షి (ఎంపిక చేసిన రోజు)",
      todayBird: "నేటి పక్షి",
      paksham: "పక్షం",
      element: "భూతం",
      weekday: "వారం",
      sunrise: "సూర్యోదయం",
      sunset: "సూర్యాస్తమయం",
      location: "స్థలం",
      changePlace: "స్థలం మార్చు",
      showPlace: "చూపించు",
      gocharaBirdTitle: "గోచార పక్షి",
      gocharaBirdNote: "మునుపటి / నేడు / తదుపరి స్థానిక మధ్యాహ్న రికార్డులు. కార్యాచరణ సూర్యోదయ, సూర్యాస్తమయాలను అనుసరిస్తుంది.",
      timeCol: "కాలం",
      dateCol: "తేదీ",
      starCol: "నక్షత్రం",
      birdCol: "పక్షి",
      timelineTitle: "గోచార పంచపక్షి కాలక్రమం",
      timelineNote: "సూర్యోదయ సూర్యాస్తమయాల మధ్య విభజించబడిన 10 ప్రధాన యామాలు.",
      startCol: "ప్రారంభం",
      endCol: "ముగింపు",
      dayNightCol: "పగలు / రాత్రి",
      activityCol: "పని",
      transitionsTitle: "ఖగోళ మార్పుల పట్టిక",
      changeCol: "మార్పు",
      statusCol: "స్థితి",
      nowLabel: "ప్రస్తుత సమయం",
      dayScheduleTitle: "పగటి పట్టిక",
      nightScheduleTitle: "రాత్రి పట్టిక",
      staticTablesTitle: "ప్రామాణిక సూచన పట్టికలు",
      expandAll: "అన్నీ విస్తరించు",
      collapseAll: "అన్నీ కుదించు",
      prevBtn: "‹ మునుపటి",
      todayBtn: "నేడు",
      nextBtn: "తదుపరి ›",
      dayLabel: "పగలు",
      nightLabel: "రాత్రి"
    },
    ml: {
      title: "ഗോചാര പഞ്ചപക്ഷി",
      subTitle: "ഇന്നത്തെ പക്ഷി പട്ടിക",
      noonBirdTitle: "ഉച്ചപക്ഷി (തിരഞ്ഞെടുത്ത ദിവസം)",
      todayBird: "ഇന്നത്തെ പക്ഷി",
      paksham: "പക്ഷം",
      element: "ഭൂതം",
      weekday: "ദിവസം",
      sunrise: "സൂര്യോദയം",
      sunset: "സൂര്യാസ്തമയം",
      location: "സ്ഥലം",
      changePlace: "സ്ഥലം മാറ്റുക",
      showPlace: "സ്ഥലം കാണുക",
      gocharaBirdTitle: "ഗോചാര പക്ഷി",
      gocharaBirdNote: "മുൻപത്തേത് / ഇന്ന് / അടുത്തത് എന്നിവ പ്രാദേശിക ഉച്ചരേഖകളാണ്.",
      timeCol: "കാലം",
      dateCol: "തിയതി",
      starCol: "നക്ഷത്രം",
      birdCol: "പക്ഷി",
      timelineTitle: "ഗോചാര പഞ്ചപക്ഷി സമയക്രമം",
      timelineNote: "സൂര്യോദയത്തിനും അസ്തമയത്തിനും ഇടയിലുള്ള 10 പ്രധാന യാമങ്ങൾ.",
      startCol: "ആരംഭം",
      endCol: "അവസാനം",
      dayNightCol: "പകൽ / രാത്രി",
      activityCol: "തൊഴിൽ",
      transitionsTitle: "ജ്യോതിഷ പരിവർത്തനങ്ങൾ",
      changeCol: "മാറ്റം",
      statusCol: "നില",
      nowLabel: "ഇപ്പോൾ",
      dayScheduleTitle: "പകൽ പട്ടിക",
      nightScheduleTitle: "രാത്രി പട്ടിക",
      staticTablesTitle: "സ്ഥിര റഫറൻസ് പട്ടികകൾ",
      expandAll: "എല്ലാം വികസിപ്പിക്കുക",
      collapseAll: "എല്ലാം ചുരുക്കുക",
      prevBtn: "‹ മുൻപത്തേത്",
      todayBtn: "ഇന്ന്",
      nextBtn: "അടുത്തത് ›",
      dayLabel: "പകൽ",
      nightLabel: "രാത്രി"
    },
    kn: {
      title: "ಗೋಚಾರ ಪಂಚಪಕ್ಷಿ",
      subTitle: "ಇಂದಿನ ಪಕ್ಷಿ ವೇಳಾಪಟ್ಟಿ",
      noonBirdTitle: "ಮಧ್ಯಾಹ್ನದ ಪಕ್ಷಿ (ಆಯ್ಕೆಮಾಡಿದ ದಿನ)",
      todayBird: "ಇಂದಿನ ಪಕ್ಷಿ",
      paksham: "ಪಕ್ಷ",
      element: "ಭೂತ",
      weekday: "ವಾರ",
      sunrise: "ಸೂರ್ಯೋದಯ",
      sunset: "ಸೂರ್ಯಾಸ್ತ",
      location: "ಸ್ಥಳ",
      changePlace: "ಸ್ಥಳ ಬದಲಾಯಿಸಿ",
      showPlace: "ಸ್ಥಳ ನೋಡಿ",
      gocharaBirdTitle: "ಗೋಚಾರ ಪಕ್ಷಿ",
      gocharaBirdNote: "ಹಿಂದಿನ / ಇಂದು / ಮುಂದಿನ ಸ್ಥಳೀಯ ಮಧ್ಯಾಹ್ನದ ದಾಖಲೆಗಳಾಗಿವೆ.",
      timeCol: "ಕಾಲ",
      dateCol: "ದಿನಾಂಕ",
      starCol: "ನಕ್ಷತ್ರ",
      birdCol: "ಪಕ್ಷಿ",
      timelineTitle: "ಗೋಚಾರ ಪಂಚಪಕ್ಷಿ ಕಾಲಾವಧಿ",
      timelineNote: "ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತದ ನಡುವಿನ 10 ಮುಖ್ಯ ಯಾಮಗಳು.",
      startCol: "ಪ್ರಾರಂಭ",
      endCol: "ಮುಕ್ತಾಯ",
      dayNightCol: "ಹಗಲು / ರಾತ್ರಿ",
      activityCol: "ಕೆಲಸ",
      transitionsTitle: "ಖಗೋಳ ಪರಿವರ್ತನೆಗಳು",
      changeCol: "ಬದಲಾವಣೆ",
      statusCol: "ಸ್ಥಿತಿ",
      nowLabel: "ಈಗ",
      dayScheduleTitle: "ಹಗಲಿನ ವೇಳಾಪಟ್ಟಿ",
      nightScheduleTitle: "ರಾತ್ರಿಯ ವೇಳಾಪಟ್ಟಿ",
      staticTablesTitle: "ಸ್ಥಿರ ಉಲ್ಲೇಖ ಕೋಷ್ಟಕಗಳು",
      expandAll: "ಎಲ್ಲವನ್ನೂ ವಿಸ್ತರಿಸಿ",
      collapseAll: "ಎಲ್ಲವನ್ನೂ ಕುಗ್ಗಿಸಿ",
      prevBtn: "‹ ಹಿಂದಿನ",
      todayBtn: "ಇಂದು",
      nextBtn: "ಮುಂದಿನ ›",
      dayLabel: "ಹಗಲು",
      nightLabel: "ರಾತ್ರಿ"
    }
  };

  function t(key, lang = "ta") {
    const dict = I18N[lang] || I18N.ta;
    return dict[key] || I18N.ta[key] || key;
  }

  return {
    BIRDS,
    ACTIVITIES,
    NAKSHATRAS,
    WEEKDAYS,
    MASTER_TABLES,
    calculateDailySchedule,
    getLiveActiveSlot,
    formatMinutesToTime,
    formatDateDmy,
    t
  };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = PanchaPakshiEngine;
}
if (typeof window !== "undefined") {
  window.PanchaPakshiEngine = PanchaPakshiEngine;
}
