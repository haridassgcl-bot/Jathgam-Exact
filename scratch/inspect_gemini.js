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
const navStart = html.indexOf('id="navamsamKattamBox"');
const idx = html.indexOf('data-sign="2"', navStart);
console.log(html.substring(idx, idx + 1200));
