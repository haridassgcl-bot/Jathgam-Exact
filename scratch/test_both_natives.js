global.window = global;
const translations = require('../js/translations.js');
global.I18N = translations;
const AstroEngine = require('../js/astro-engine.js');
const CareerEngine = require('../js/career-engine.js');

// 1. Person 1: 30-04-1988 (Diploma ECE)
const p1988 = {
  name: 'Haridass R (30-04-1988)',
  gender: 'male',
  educationLevel: 'diploma_ece',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  place: 'Tiruvannamalai, Tamil Nadu',
  latitude: 12.2253,
  longitude: 79.0747,
  timezoneOffset: 5.5
};
const chart1988 = AstroEngine.calculateHoroscope(p1988);
const career1988 = CareerEngine.calculateCareerProfile(chart1988, { lang: 'ta', educationLevel: 'diploma_ece' });

console.log('=== PERSON 1: 30-04-1988 (STUDIED DIPLOMA ECE) ===');
console.log('Lagna:', chart1988.lagna.signNameTa, '10th House:', career1988.house10.signNameTa, 'Lord:', career1988.house10.lordNameTa);
console.log('Education Badge:', career1988.educationBadgeTa);
console.log('Top Sectors for Diploma ECE:');
career1988.topSectors.forEach((sec, i) => {
  console.log('Sector ' + (i+1) + ': ' + sec.nameTa + ' (' + sec.calculatedScore + '%)');
  sec.customRolesTa.slice(0, 3).forEach(r => console.log('   - ' + r.title + (r.isBestMatch ? ' [BEST]' : '')));
});

// 2. Person 2: 30-03-1969 (Education Unknown -> Auto Deduced from 4th House)
const p1969 = {
  name: 'Ranipet Native (30-03-1969)',
  gender: 'male',
  educationLevel: 'auto',
  birthDate: '1969-03-30',
  birthTime: '11:55',
  place: 'Ranipet, Tamil Nadu',
  latitude: 12.9224,
  longitude: 79.3326,
  timezoneOffset: 5.5
};
const chart1969 = AstroEngine.calculateHoroscope(p1969);
const career1969 = CareerEngine.calculateCareerProfile(chart1969, { lang: 'ta', educationLevel: 'auto' });

console.log('\n=== PERSON 2: 30-03-1969 (EDUCATION ASTROLOGICAL DEDUCTION) ===');
console.log('Is Auto Deduced?:', career1969.vidyaPrediction.isAutoDeduced);
console.log('4th House:', career1969.vidyaPrediction.house4SignNameTa, 'Lord:', career1969.vidyaPrediction.house4LordTa);
console.log('Planets in 4th:', career1969.vidyaPrediction.planetsIn4thTa);
console.log('Deduced Qualification:', career1969.vidyaPrediction.deducedTitleTa);
console.log('Astrological Reasoning:', career1969.vidyaPrediction.reasoningTa);
console.log('Top Sectors for Deduced Diploma/ITI:');
career1969.topSectors.forEach((sec, i) => {
  console.log('Sector ' + (i+1) + ': ' + sec.nameTa + ' (' + sec.calculatedScore + '%)');
  sec.customRolesTa.slice(0, 3).forEach(r => console.log('   - ' + r.title + (r.isBestMatch ? ' [BEST]' : '')));
});
