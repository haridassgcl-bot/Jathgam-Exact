// Client-side JS implementation test
const CHALDEAN_HORA_PLANETS = [
  { id: 0, code: "Su", ta: "சூரியன்", en: "Sun", symbol: "☀️", deity: "சிவபெருமான்", goodForTa: "அரசு பணி, நிர்வாகம், தலைமை ஏற்பு, பிதுர் காரியம்", goodForEn: "Government affairs, leadership, administration" },
  { id: 1, code: "Ve", ta: "சுக்கிரன்", en: "Venus", symbol: "🌸", deity: "ஸ்ரீ மகாலட்சுமி", goodForTa: "திருமணம், கலை, புதிய ஆடை, வாகனம் வாங்குதல்", goodForEn: "Marriage, arts, luxury purchases, vehicles" },
  { id: 2, code: "Me", ta: "புதன்", en: "Mercury", symbol: "📚", deity: "ஸ்ரீ மகாவிஷ்ணு", goodForTa: "கல்வி, கணக்கு, வர்த்தகம், எழுத்து, ஒப்பந்தம்", goodForEn: "Education, accounting, commerce, contracts" },
  { id: 3, code: "Mo", ta: "சந்திரன்", en: "Moon", symbol: "🌙", deity: "பார்வதி தேவி", goodForTa: "பிரயாணம், நீர் சார்ந்த தொழில், கலை, தானம்", goodForEn: "Travel, creative arts, water business" },
  { id: 4, code: "Sa", ta: "சனி", en: "Saturn", symbol: "🪐", deity: "ஸ்ரீ சனீஸ்வரர்", goodForTa: "இரும்பு, எண்ணெய், பழைய விவகாரங்கள், பூமி சாஸ்திரம்", goodForEn: "Machinery, real estate, labor, storage" },
  { id: 5, code: "Ju", ta: "குரு", en: "Jupiter", symbol: "✨", deity: "தட்சிணாமூர்த்தி / பிரம்மா", goodForTa: "சுப காரியம், குரு தரிசனம், புத்திர பாக்கியம், தங்கம்", goodForEn: "Auspicious rites, gold purchase, spirituality" },
  { id: 6, code: "Ma", ta: "செவ்வாய்", en: "Mars", symbol: "⚔️", deity: "முருகப்பெருமான்", goodForTa: "பூமி, நிலம், இயந்திர விவகாரம், தைரிய காரியம்", goodForEn: "Land matters, machinery, courageous ventures" }
];

const WEEKDAY_START_INDEX = [0, 3, 6, 2, 5, 1, 4];
const WEEKDAY_NAMES_TA = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
const WEEKDAY_NAMES_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function calculateSolarTimes(dt, lat = 13.0827, lon = 80.2707, tz = 5.5) {
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
  const nextRiseMins = calculateSolarTimesSimple(nextDay, lat, lon, tz);
  const nextSunriseDt = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate(), 0, 0, 0);
  nextSunriseDt.setMilliseconds(Math.round(nextRiseMins * 60 * 1000));

  return { sunriseDt, sunsetDt, nextSunriseDt };
}

function calculateSolarTimesSimple(dt, lat, lon, tz) {
  const startOfYear = new Date(dt.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((dt - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const gamma = (2.0 * Math.PI / 365.0) * (dayOfYear - 1);
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2.0 * gamma) - 0.040849 * Math.sin(2.0 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2.0 * gamma) + 0.000907 * Math.sin(2.0 * gamma);
  const latRad = lat * Math.PI / 180.0;
  const zenithRad = 90.833 * Math.PI / 180.0;
  let cosH = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
  cosH = Math.max(-1.0, Math.min(1.0, cosH));
  const haHours = Math.acos(cosH) * (180.0 / Math.PI) / 15.0;
  return 720.0 - 4.0 * lon - eqtime + tz * 60.0 - haHours * 60.0;
}

const solar = calculateSolarTimes(new Date("2026-10-13T12:00:00"));
console.log("JS Sunrise:", solar.sunriseDt.toLocaleTimeString(), "Sunset:", solar.sunsetDt.toLocaleTimeString());
