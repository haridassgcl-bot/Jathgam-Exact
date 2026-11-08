global.AstroEngine = require('../js/astro-engine.js');
global.I18N = require('../js/translations.js');
const ChartsRenderer = require('../js/charts-renderer.js');

const res = AstroEngine.calculateHoroscope({
  name: 'Haridass R',
  gender: 'male',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  latitude: 12.23,
  longitude: 79.07,
  timezoneOffset: 5.5
});

const profile = {
  name: 'Haridass R',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  place: 'Tiruvannamalai, Tamil Nadu, India',
  latitude: 12.23,
  longitude: 79.07,
  timezoneOffset: 5.5
};

const html = ChartsRenderer.renderDualJathagamKattam(res, profile, 'ta');
const rasiBox = html.split('id="rasiKattamBox"')[1].split('id="navamsamKattamBox"')[0];

console.log('--- RASI ARIES (data-sign="0") ---');
let idx = rasiBox.indexOf('data-sign="0"');
console.log(rasiBox.substring(idx, idx + 800));

console.log('\n--- RASI TAURUS (data-sign="1") ---');
idx = rasiBox.indexOf('data-sign="1"');
console.log(rasiBox.substring(idx, idx + 600));

console.log('\n--- RASI CAPRICORN (data-sign="9") ---');
idx = rasiBox.indexOf('data-sign="9"');
console.log(rasiBox.substring(idx, idx + 600));

console.log('\n--- RASI SAGITTARIUS (data-sign="8") ---');
idx = rasiBox.indexOf('data-sign="8"');
console.log(rasiBox.substring(idx, idx + 600));
