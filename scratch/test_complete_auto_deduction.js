global.I18N = require('../js/translations.js');
const AstroEngine = require('../js/astro-engine.js');
const CareerEngine = require('../js/career-engine.js');
const fs = require('fs');

console.log('=== TEST 1: Form HTML Check ===');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const hasInputEducation = indexHtml.includes('id="inputEducation"');
console.log('Has inputEducation in form:', hasInputEducation);
if (hasInputEducation) {
  throw new Error('inputEducation was not removed from index.html');
}
console.log('✅ inputEducation successfully removed from index.html form!');

console.log('\n=== TEST 2: 30-04-1988 (Pure Astrological Auto-Deduction with NO manual input) ===');
const p1988 = {
  name: 'Haridass R',
  gender: 'male',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  latitude: 12.2253,
  longitude: 79.0747,
  timezoneOffset: 5.5
  // Note: NO educationLevel provided! Must be auto-deduced by the engine!
};
const chart1988 = AstroEngine.calculateHoroscope(p1988);
const career1988 = CareerEngine.calculateCareerProfile(chart1988, { lang: 'ta', educationLevel: 'auto' });

console.log('Deduced Education:', career1988.educationLevel);
console.log('Education Badge:', career1988.educationBadgeTa);
console.log('Vidya Deduction Title:', career1988.vidyaPrediction?.deducedTitleTa);
console.log('Vidya Astrological Reasoning:', career1988.vidyaPrediction?.rationaleTa);

if (career1988.educationLevel !== 'diploma_ece') {
  throw new Error('Expected diploma_ece for 30-04-1988, got: ' + career1988.educationLevel);
}
console.log('✅ 30-04-1988 accurately deduced as Diploma ECE!');

console.log('\n=== TEST 3: 30-03-1969 (Pure Astrological Auto-Deduction with NO manual input) ===');
const p1969 = {
  name: 'Ranipet Native',
  gender: 'male',
  birthDate: '1969-03-30',
  birthTime: '11:55',
  latitude: 12.9224,
  longitude: 79.3326,
  timezoneOffset: 5.5
  // Note: NO educationLevel provided! Must be auto-deduced by the engine!
};
const chart1969 = AstroEngine.calculateHoroscope(p1969);
const career1969 = CareerEngine.calculateCareerProfile(chart1969, { lang: 'ta', educationLevel: 'auto' });

console.log('Deduced Education:', career1969.educationLevel);
console.log('Education Badge:', career1969.educationBadgeTa);
console.log('Vidya Deduction Title:', career1969.vidyaPrediction?.deducedTitleTa);
console.log('Vidya Astrological Reasoning:', career1969.vidyaPrediction?.rationaleTa);

if (career1969.educationLevel !== 'degree_ug') {
  throw new Error('Expected degree_ug for 30-03-1969, got: ' + career1969.educationLevel);
}
console.log('✅ 30-03-1969 accurately deduced as Graduation / Degree (UG) via Guru in 4th & 4-10 Maha Parivartana Yoga!');

console.log('\n🎉 ALL TESTS PASSED WITH 100% SUCCESS!');
