const fs = require('fs');

const elements = {
  careerTimingContainer: { innerHTML: '', style: {} },
  career10thHouseBadge: { textContent: '' },
  careerTimingFilterBar: { addEventListener: () => {} }
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

// Extract renderCareerTimingSection definition and run it
const sampleHoroscope = {
  profile: { name: 'ஆனந்த்', birthDate: '1988-04-30', birthTime: '22:10' },
  lagna: { signId: 8, signNameTa: 'தனுசு', signNameEn: 'Sagittarius' },
  planets: {
    Su: { signId: 0, longitude: 16.8, isExalted: true },
    Mo: { signId: 6, longitude: 1.5 },
    Ma: { signId: 9, longitude: 22.2, isExalted: true },
    Me: { signId: 0, longitude: 28.2 },
    Ju: { signId: 0, longitude: 18.4 },
    Ve: { signId: 1, longitude: 28.9, isOwnSign: true },
    Sa: { signId: 8, longitude: 8.5, isRetrograde: true },
    Ra: { signId: 10, longitude: 27.0, isOwnSign: true },
    Ke: { signId: 4, longitude: 27.0 }
  },
  dashaData: {
    currentDasha: { ta: 'சனி', en: 'Saturn', lord: 'Sa' },
    currentBhukti: { ta: 'புதன்', en: 'Mercury', lord: 'Me', end: '2027-01-15' }
  }
};

global.AppState = {
  horoscopeData: sampleHoroscope,
  lang: 'ta'
};

const c = CareerEngine.calculateCareerProfile(sampleHoroscope, { lang: 'ta' });
console.log('Top Sector 1:');
console.log('Name:', c.topSectors[0].nameTa);
console.log('Score:', c.topSectors[0].calculatedScore + '%');
console.log('Custom Explanation:', c.topSectors[0].customExplanationTa);
console.log('Top Roles:');
c.topSectors[0].customRolesTa.forEach(r => {
  console.log(`- ${r.title} [isBestMatch: ${r.isBestMatch}]`);
});

console.log('\nTop Sector 2:');
console.log('Name:', c.topSectors[1].nameTa);
console.log('Score:', c.topSectors[1].calculatedScore + '%');
console.log('Custom Explanation:', c.topSectors[1].customExplanationTa);

console.log('\nTop Sector 3:');
console.log('Name:', c.topSectors[2].nameTa);
console.log('Score:', c.topSectors[2].calculatedScore + '%');
console.log('Custom Explanation:', c.topSectors[2].customExplanationTa);

console.log('\nTiming Next Window:');
console.log('Dates:', c.currentDashaForecast.nextWindowDates);
console.log('Rationale:', c.currentDashaForecast.nextWindowTa);
