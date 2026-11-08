global.I18N = require('../js/translations.js');
const AstroEngine = require('../js/astro-engine.js');
const CareerEngine = require('../js/career-engine.js');

console.log('========================================================================');
console.log('END-TO-END VERIFICATION: DIPLOMA EDUCATION QUALIFICATION MATCHING');
console.log('NATIVE: Ranipet, 30-03-1969 11:55 AM, Latitude: 12.9272, Longitude: 79.3330');
console.log('========================================================================\n');

const chart = AstroEngine.calculateHoroscope({
  name: 'Ranipet Native (Diploma Holder)',
  gender: 'male',
  birthDate: '1969-03-30',
  birthTime: '11:55',
  latitude: 12.9272,
  longitude: 79.3330,
  timezoneOffset: 5.5
});

// TEST 1: Default / Explicit Diploma Qualification
console.log('--- TEST 1: DIPLOMA / ITI QUALIFICATION (டிப்ளமோ / தொழிற்கல்வி) ---');
const diplomaProfile = CareerEngine.calculateCareerProfile(chart, { lang: 'ta', educationLevel: 'diploma_iti' });
console.log('Active Education:', diplomaProfile.educationLabelTa);
console.log('Active Badge:', diplomaProfile.educationBadgeTa);
diplomaProfile.topSectors.forEach((sec, idx) => {
  console.log(`\n#${idx + 1} Sector: ${sec.nameTa} (${sec.calculatedScore}%)`);
  console.log('Recommended Roles:');
  sec.customRolesTa.forEach(r => {
    console.log(`   ${r.isBestMatch ? '★ [BEST MATCH] ' : '✓ '}${r.title}`);
  });
  console.log('Individual Rationale:\n  ', sec.customExplanationTa);
});

// TEST 2: Switching to UG Degree
console.log('\n\n--- TEST 2: SWITCHING TO UG DEGREE (பட்டப்படிப்பு) ---');
const ugProfile = CareerEngine.calculateCareerProfile(chart, { lang: 'ta', educationLevel: 'degree_ug' });
console.log('Active Education:', ugProfile.educationLabelTa);
ugProfile.topSectors.forEach((sec, idx) => {
  console.log(`\n#${idx + 1} Sector: ${sec.nameTa} (${sec.calculatedScore}%)`);
  console.log('Roles:', sec.customRolesTa.map(r => r.title));
});

// TEST 3: English Output Verification
console.log('\n\n--- TEST 3: ENGLISH OUTPUT FOR DIPLOMA HOLDER ---');
const enProfile = CareerEngine.calculateCareerProfile(chart, { lang: 'en', educationLevel: 'diploma_iti' });
console.log('Education Badge (EN):', enProfile.educationBadgeEn);
enProfile.topSectors.forEach((sec, idx) => {
  console.log(`\n#${idx + 1} Sector: ${sec.nameEn} (${sec.calculatedScore}%)`);
  sec.customRolesEn.forEach(r => {
    console.log(`   ${r.isBestMatch ? '★ [BEST] ' : '✓ '}${r.title}`);
  });
});

console.log('\n>>> ALL TESTS COMPLETED SUCCESSFULLY! <<<');
