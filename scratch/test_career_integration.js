// Test full render of career section with subathuvam
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
    currentBhukti: { ta: 'புதன்', en: 'Mercury', lord: 'Me' }
  }
};

const cProfile = CareerEngine.calculateCareerProfile(sampleHoroscope, { lang: 'ta' });
console.log('10th Lord Subathuvam Grade:', cProfile.subathuvam10.gradeTa);
console.log('2nd Lord Subathuvam Grade:', cProfile.subathuvam2.gradeTa);
console.log('Dasa Rule Nature:', cProfile.dasaRule.dasaNatureTa);
console.log('Dasa Guidance:', cProfile.dasaRule.guidanceTa.slice(0, 100));
console.log('Job Timing:', cProfile.timingPredictions.jobTiming.timingTa.slice(0, 80));
console.log('Business Timing:', cProfile.timingPredictions.businessTiming.bestTimeTa.slice(0, 80));
console.log('Integration test successful!');
