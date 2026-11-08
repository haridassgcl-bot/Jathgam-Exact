const fs = require('fs');
const transCode = fs.readFileSync('js/translations.js', 'utf8');
const astroCode = fs.readFileSync('js/astro-engine.js', 'utf8');

global.window = global;
global.document = {
  createElement: () => ({ getContext: () => ({}) }),
  getElementById: () => null
};

eval(transCode);
eval(astroCode);

const profile = {
  name: 'Haridass R',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  place: 'Tiruvannamalai, Tamil Nadu, India',
  latitude: 12.2253,
  longitude: 79.0747,
  timezoneOffset: 5.5
};

const hData = AstroEngine.calculateHoroscope(profile);

const planetOrder = [
  { code: "Asc", name: "லக்னம்" },
  { code: "Su", name: "சூரியன்" },
  { code: "Mo", name: "சந்திரன்" },
  { code: "Me", name: "புதன்" },
  { code: "Ve", name: "சுக்கிரன்" },
  { code: "Ma", name: "செவ்வாய்" },
  { code: "Ju", name: "குரு" },
  { code: "Sa", name: "சனி" },
  { code: "Ra", name: "ராகு" },
  { code: "Ke", name: "கேது" },
  { code: "Man", name: "மாந்தி" }
];

console.log("--- GRAHA PAATHASAARAM ---");
planetOrder.forEach(it => {
  const p = hData.planets[it.code] || (it.code === 'Asc' ? hData.lagna : null);
  if (!p) {
    console.log(it.name, "MISSING!");
    return;
  }
  console.log(it.name, p.signNameTa, `${p.deg}:${p.min}:${p.sec}`, p.nakshatraNameTa, p.pada, p.isRetrograde ? "வக்ரம்" : "");
});
