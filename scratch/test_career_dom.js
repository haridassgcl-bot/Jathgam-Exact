const fs = require('fs');

// Create minimal DOM mock
const elements = {
  careerTimingContainer: { innerHTML: '', style: {} },
  career10thHouseBadge: { textContent: '' },
  careerTimingTitle: { textContent: '' },
  careerTimingBadge: { textContent: '' },
  careerTimingSubTitle: { textContent: '' },
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

// Sample horoscope data matching AstroEngine output
const sampleHoroscope = {
  profile: { name: 'கார்த்திக்', birthDate: '1995-05-15', birthTime: '10:30' },
  lagna: { signId: 3, deg: 15, min: 20, signNameTa: 'கடகம்', signNameEn: 'Cancer' },
  planets: {
    Su: { code: 'Su', signId: 1, longitude: 30.5, speed: 0.98 },
    Mo: { code: 'Mo', signId: 7, longitude: 215.2, speed: 12.5 },
    Ma: { code: 'Ma', signId: 4, longitude: 130.1, speed: 0.6 },
    Me: { code: 'Me', signId: 0, longitude: 15.0, speed: 1.2 },
    Ju: { code: 'Ju', signId: 7, longitude: 220.0, speed: 0.1 },
    Ve: { code: 'Ve', signId: 11, longitude: 340.5, speed: 1.1 },
    Sa: { code: 'Sa', signId: 10, longitude: 310.0, speed: 0.05 },
    Ra: { code: 'Ra', signId: 6, longitude: 190.0, speed: -0.05 },
    Ke: { code: 'Ke', signId: 0, longitude: 10.0, speed: -0.05 }
  },
  dashaData: {
    currentDasha: { ta: 'புதன்', en: 'Mercury' },
    currentBhukti: { ta: 'சனி', en: 'Saturn' }
  }
};

const profileResult = CareerEngine.calculateCareerProfile(sampleHoroscope, { lang: 'ta' });
console.log('Calculation OK:', !!profileResult);
console.log('Verdict:', profileResult.jobVsBusiness.verdictTitleTa);
console.log('Job Score:', profileResult.jobVsBusiness.jobScore);
console.log('Business Score:', profileResult.jobVsBusiness.bizScore);
console.log('Top Sectors:', profileResult.topSectors.map(s => s.nameTa).join(' | '));
console.log('Milestones count:', profileResult.milestones.length);
console.log('Dasha Forecast:', profileResult.currentDashaForecast.forecastTa.slice(0, 80) + '...');
