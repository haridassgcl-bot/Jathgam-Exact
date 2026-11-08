const fs = require('fs');
const transCode = fs.readFileSync('js/translations.js', 'utf8');
const placesCode = fs.readFileSync('js/places-data.js', 'utf8');
const astroCode = fs.readFileSync('js/astro-engine.js', 'utf8');
const chartsCode = fs.readFileSync('js/charts-renderer.js', 'utf8');

global.window = global;
global.document = {
  createElement: () => ({ getContext: () => ({}) }),
  getElementById: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};

eval(transCode);
eval(placesCode);
eval(astroCode);
eval(chartsCode);

const customProfile = {
  name: 'Ramesh K',
  birthDate: '1995-08-15',
  birthTime: '14:30',
  place: 'Madurai, Tamil Nadu, India',
  latitude: 9.9252,
  longitude: 78.1198,
  timezoneOffset: 5.5
};

console.log('Calculating horoscope for Ramesh...');
const hData = AstroEngine.calculateHoroscope(customProfile);

console.log('Lagna:', hData.lagna.signId, hData.lagna.signNameTa, hData.lagna.formattedDMS);
console.log('Sun:', hData.planets.Su.signId, hData.planets.Su.signNameTa, hData.planets.Su.formattedDMS);
console.log('Moon:', hData.planets.Mo.signId, hData.planets.Mo.signNameTa, hData.planets.Mo.formattedDMS);
console.log('Mars:', hData.planets.Ma.signId, hData.planets.Ma.signNameTa, hData.planets.Ma.formattedDMS);

// Check dual charts HTML
const dualHtml = ChartsRenderer.renderDualJathagamKattam(hData, customProfile, 'ta');
console.log('Dual HTML includes Ramesh:', dualHtml.includes('Ramesh K'));
console.log('Dual HTML includes Haridass:', dualHtml.includes('Haridass R'));
console.log('Dual HTML includes 1988:', dualHtml.includes('1988'));
console.log('Dual HTML includes 1995:', dualHtml.includes('1995'));

// Check Bhava Bala
console.log('--- Bhava Bala ---');
if (hData.shadbala && hData.shadbala.bhavas) {
  hData.shadbala.bhavas.slice(0, 4).forEach(b => {
    console.log(b.bhavaName, b.lordNameTa);
  });
}
