global.I18N = require('../js/translations.js');
const AstroEngine = require('../js/astro-engine.js');

const dob = '1969-03-30';
const tob = '11:55';
const lat = 12.9272; // Ranipet
const lon = 79.3330;
const tz = 5.5;

const chart = AstroEngine.calculateHoroscope({
  name: 'Ranipet Native',
  gender: 'male',
  birthDate: dob,
  birthTime: tob,
  latitude: lat,
  longitude: lon,
  timezoneOffset: tz
});

console.log('--- RANIPET NATIVE (30-03-1969 11:55 AM) ---');
console.log('Lagna:', chart.lagna.signNameTa, `(${chart.lagna.signNameEn})`, 'SignId:', chart.lagna.signId);
console.log('10th House SignId:', (chart.lagna.signId + 9) % 12);
console.log('4th House SignId (Vidya Sthana):', (chart.lagna.signId + 3) % 12);
console.log('Planets:');
Object.entries(chart.planets).forEach(([code, p]) => {
  if (code !== 'Asc') {
    console.log(`  ${code}: Sign ${p.signId} (${p.signNameTa || p.signNameEn}), Long: ${p.longitude.toFixed(2)}, Exalted: ${!!p.isExalted}, OwnSign: ${!!p.isOwnSign}, Retro: ${!!p.isRetrograde}`);
  }
});

const CareerEngine = require('../js/career-engine.js');
const cProfile = CareerEngine.calculateCareerProfile(chart, { lang: 'ta' });
console.log('\nCareer Verdict:', cProfile.jobVsBusiness.verdictTitleTa);
console.log('Top Sectors:');
cProfile.topSectors.forEach((s, idx) => {
  console.log(`#${idx+1}: ${s.nameTa} (${s.calculatedScore}%)`);
  console.log('Roles:', s.customRolesTa.map(r => r.title + (r.isBestMatch ? ' [BEST]' : '')));
  console.log('Explanation:', s.customExplanationTa);
});
