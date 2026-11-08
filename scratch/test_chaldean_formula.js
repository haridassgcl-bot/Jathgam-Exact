const CHALDEAN_PLANETS = [
  { code: "Su", ta: "சூரியன்", en: "Sun", symbol: "☀️", goodFor: "அரசு பணி, நிர்வாகம், தலைமை ஏற்பு, பிதுர் காரியம்" },
  { code: "Ve", ta: "சுக்கிரன்", en: "Venus", symbol: "🌸", goodFor: "திருமணம், கலை, ஆடை, ஆபரணம், வாகனம் வாங்குதல்" },
  { code: "Me", ta: "புதன்", en: "Mercury", symbol: "📚", goodFor: "கல்வி, கணக்கு, வர்த்தகம், எழுத்து, ஒப்பந்தம்" },
  { code: "Mo", ta: "சந்திரன்", en: "Moon", symbol: "🌙", goodFor: "பிரயாணம், நீர் சார்ந்த தொழில், கலை, ஆடை வாங்குதல்" },
  { code: "Sa", ta: "சனி", en: "Saturn", symbol: "🪐", goodFor: "இரும்பு, இயந்திரம், பழைய விவகாரங்கள், பூமி சாஸ்திரம்" },
  { code: "Ju", ta: "குரு", en: "Jupiter", symbol: "✨", goodFor: "சுப காரியம், குரு தரிசனம், புத்திர பாக்கியம், தங்கம்" },
  { code: "Ma", ta: "செவ்வாய்", en: "Mars", symbol: "⚔️", goodFor: "பூமி, நிலம், இயந்திர விவகாரம், வழக்கு, தைரிய காரியம்" }
];

const WEEKDAY_START_INDEX = [0, 3, 6, 2, 5, 1, 4]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

function getHoraLordIndex(weekday, h) {
  const startIdx = WEEKDAY_START_INDEX[weekday];
  return (startIdx + h) % 7;
}

function getSubHoraLordIndex(horaLordIdx, s) {
  return (horaLordIdx + s) % 7;
}

function getSubSubHoraLordIndex(subLordIdx, ss) {
  return (subLordIdx + ss) % 7;
}

// For Tuesday (2):
const h11 = getHoraLordIndex(2, 10); // 11th hora (0-indexed 10)
console.log("Hora 11 Lord:", CHALDEAN_PLANETS[h11].ta); // Should be புதன்

const s6 = getSubHoraLordIndex(h11, 5); // 6th sub-hora (0-indexed 5)
console.log("Sub 6 Lord:", CHALDEAN_PLANETS[s6].ta); // Should be சூரியன்

const ss3 = getSubSubHoraLordIndex(s6, 2); // 3rd sub-sub-hora (0-indexed 2)
console.log("SubSub 3 Lord:", CHALDEAN_PLANETS[ss3].ta); // Should be புதன்
