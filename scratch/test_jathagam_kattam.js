const fs = require('fs');

// Load charts-renderer.js
const chartsCode = fs.readFileSync('js/charts-renderer.js', 'utf8');

// Mock browser globals
global.AstroEngine = {
  SIGN_NAMES: [
    { ta: "மேஷம்", en: "Aries" },
    { ta: "ரிஷபம்", en: "Taurus" },
    { ta: "மிதுனம்", en: "Gemini" },
    { ta: "கடகம்", en: "Cancer" },
    { ta: "சிம்மம்", en: "Leo" },
    { ta: "கன்னி", en: "Virgo" },
    { ta: "துலாம்", en: "Libra" },
    { ta: "விருச்சிகம்", en: "Scorpio" },
    { ta: "தனுசு", en: "Sagittarius" },
    { ta: "மகரம்", en: "Capricorn" },
    { ta: "கும்பம்", en: "Aquarius" },
    { ta: "மீனம்", en: "Pisces" }
  ]
};

global.I18N = {
  ta: {
    planets: {
      Su: { code: "சூரி" },
      Mo: { code: "சந்", color: "#2563EB" },
      Ma: { code: "செவ்" },
      Me: { code: "புத" },
      Ju: { code: "குரு" },
      Ve: { code: "சுக்" },
      Sa: { code: "சனி" },
      Ra: { code: "ராகு" },
      Ke: { code: "கேது" },
      Asc: { code: "லக்" },
      Man: { code: "மாந்" }
    }
  },
  en: {
    planets: {}
  }
};

const ChartsRenderer = require('../js/charts-renderer.js');

console.log("ChartsRenderer loaded:", typeof ChartsRenderer);
console.log("renderExactAttachedChart exists:", typeof ChartsRenderer.renderExactAttachedChart);

// Test standard Haridass R data
const vargaMapRasi = {
  Su: 0, Ju: 0, Me: 0,
  Ve: 1,
  Ra: 10,
  Man: 9, Ma: 9,
  Ke: 4,
  Asc: 8, Sa: 8,
  Mo: 6
};

const planetsFull = {
  Su: { code: "Su", deg: 16, min: 50, longitude: 16.833 },
  Ju: { code: "Ju", deg: 18, min: 26, longitude: 18.433 },
  Me: { code: "Me", deg: 28, min: 17, longitude: 28.283 },
  Ve: { code: "Ve", deg: 28, min: 54, longitude: 58.900 },
  Ra: { code: "Ra", deg: 27, min: 4, longitude: 327.067 },
  Man: { code: "Man", deg: 7, min: 44, longitude: 277.733 },
  Ma: { code: "Ma", deg: 22, min: 12, longitude: 292.200 },
  Ke: { code: "Ke", deg: 27, min: 4, longitude: 147.067 },
  Asc: { code: "Asc", deg: 8, min: 37, longitude: 248.617 },
  Sa: { code: "Sa", deg: 8, min: 32, isRetrograde: true, longitude: 248.533 },
  Mo: { code: "Mo", deg: 1, min: 33, longitude: 181.550 }
};

const profile = {
  name: "Haridass R",
  birthDateFormatted: "30-04-1988",
  birthTime: "22:10:00",
  place: "Tiruvannamalai, Tamil Nadu, India",
  coordinates: "12.23°N · 79.08°E · UTC+05:30",
  ayanamshaDMS: "23°41'39.93\""
};

const rasiSvg = ChartsRenderer.renderExactAttachedChart(vargaMapRasi, planetsFull, false, profile, "ta");
console.log("Rasi SVG length:", rasiSvg.length);
console.log("Rasi SVG contains Haridass R:", rasiSvg.includes("Haridass R"));
console.log("Rasi SVG contains ராசி:", rasiSvg.includes("ராசி"));
console.log("Rasi SVG contains லக் 08:37:", rasiSvg.includes("08:37"));
console.log("Rasi SVG contains மாந் 07:44:", rasiSvg.includes("07:44"));

// Test Navamsam
const vargaMapNav = {
  Man: 0,
  Ra: 2, Sa: 2, Asc: 2,
  Ma: 3,
  Ke: 8, Me: 8,
  Mo: 6,
  Ju: 5, Su: 5, Ve: 5
};

const navSvg = ChartsRenderer.renderExactAttachedChart(vargaMapNav, planetsFull, true, profile, "ta");
console.log("Navamsam SVG length:", navSvg.length);
console.log("Navamsam SVG contains நவாம்சம்:", navSvg.includes("நவாம்சம்"));
console.log("Navamsam SVG contains மாந்:", navSvg.includes("மாந்"));
console.log("Navamsam SVG contains 19:49 (Mars in Cancer):", navSvg.includes("19:49"));

// Test dual kattam html
const mockHData = {
  vargas: { D1: vargaMapRasi, D9: vargaMapNav },
  planets: planetsFull,
  ayanamsaStr: "23°41'39.93\""
};
const dualHtml = ChartsRenderer.renderDualJathagamKattam(mockHData, profile, "ta");
console.log("Dual HTML length:", dualHtml.length);
console.log("Dual HTML contains rasiKattamBox:", dualHtml.includes("rasiKattamBox"));
console.log("Dual HTML contains navamsamKattamBox:", dualHtml.includes("navamsamKattamBox"));
