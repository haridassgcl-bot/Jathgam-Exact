const fs = require('fs');

const elements = {
  careerTimingContainer: { innerHTML: '', style: {} },
  career10thHouseBadge: { textContent: '' },
  careerTimingFilterBar: { addEventListener: () => {} },
  careerEduBtnsGroup: { addEventListener: () => {} },
  careerEduFilterLabel: { textContent: '' }
};

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelectorAll: (selector) => []
};
global.window = global;

const CareerEngine = require('../js/career-engine.js');
const translations = require('../js/translations.js');
global.CareerEngine = CareerEngine;
global.I18N = translations;
global.escapeHtml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const appJsContent = fs.readFileSync('js/app.js', 'utf-8');

// We can test if CareerEngine automatically evaluates vidyaPrediction:
const p1988 = {
  name: 'Haridass R',
  gender: 'male',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  latitude: 12.2253,
  longitude: 79.0747,
  timezoneOffset: 5.5
};
const AstroEngine = require('../js/astro-engine.js');
const chart1988 = AstroEngine.calculateHoroscope(p1988);
const career1988 = CareerEngine.calculateCareerProfile(chart1988, { lang: 'ta', educationLevel: 'auto' });

console.log('--- 1988 Vidya Prediction ---');
console.log('Deduced Level:', career1988.educationLevel);
console.log('Vidya Title:', career1988.vidyaPrediction.deducedTitleTa);
console.log('Reasoning:', career1988.vidyaPrediction.reasoningTa);

const p1969 = {
  name: 'Ranipet Native',
  gender: 'male',
  birthDate: '1969-03-30',
  birthTime: '11:55',
  latitude: 12.9224,
  longitude: 79.3326,
  timezoneOffset: 5.5
};
const chart1969 = AstroEngine.calculateHoroscope(p1969);
const career1969 = CareerEngine.calculateCareerProfile(chart1969, { lang: 'ta', educationLevel: 'auto' });

console.log('\n--- 1969 Vidya Prediction ---');
console.log('Deduced Level:', career1969.educationLevel);
console.log('Vidya Title:', career1969.vidyaPrediction.deducedTitleTa);
console.log('Reasoning:', career1969.vidyaPrediction.reasoningTa);
