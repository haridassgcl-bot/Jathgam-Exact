global.I18N = require('../js/translations.js');
const AstroEngine = require('../js/astro-engine.js');

function testChart(name, p) {
  const chart = AstroEngine.calculateHoroscope(p);
  const lagnaSignId = chart.lagna.signId;
  const house4SignId = (lagnaSignId + 3) % 12;
  const planets = chart.planets;

  const occ4 = [];
  Object.entries(planets).forEach(([c, pl]) => {
    if (c !== 'Asc' && pl && pl.signId === house4SignId) occ4.push(c);
  });

  const SIGN_LORDS = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"];
  const lord4Code = SIGN_LORDS[house4SignId];
  const lord4Obj = planets[lord4Code];
  const lord4SignId = lord4Obj ? lord4Obj.signId : -1;
  const pMercury = planets.Me;
  const pMars = planets.Ma;
  const pRahu = planets.Ra;
  const pKetu = planets.Ke;
  const pJupiter = planets.Ju;

  const isMarsExalted = pMars && pMars.signId === 9; // Capricorn
  const isMercuryInMarsSign = pMercury && (pMercury.signId === 0 || pMercury.signId === 7); // Aries or Scorpio
  const isRahuInHouse3 = pRahu && pRahu.signId === ((lagnaSignId + 2) % 12);
  const isMarsAspectingMercury = (pMars && pMercury) && ([0, 3, 6, 7].includes((pMercury.signId - pMars.signId + 12) % 12));
  const isMercuryConjunctMars = (pMercury && pMars && pMercury.signId === pMars.signId);
  const isMercuryWithLord4InMarsSign = (pMercury && lord4Obj && pMercury.signId === lord4SignId && isMercuryInMarsSign);

  const isECESignature = (isMercuryWithLord4InMarsSign && isMarsExalted) ||
                         (isMercuryInMarsSign && isRahuInHouse3) ||
                         (isMercuryConjunctMars && (occ4.includes("Ra") || occ4.includes("Ke") || isRahuInHouse3)) ||
                         (isMarsAspectingMercury && isRahuInHouse3);

  let deducedEdu = 'degree_ug';
  if (isECESignature) {
    deducedEdu = 'diploma_ece';
  } else if (occ4.includes('Ke') || occ4.includes('Ma') || occ4.includes('Sa')) {
    deducedEdu = 'diploma_iti';
  } else if (occ4.includes('Ju') || occ4.includes('Su')) {
    deducedEdu = 'degree_ug';
  }

  console.log(`\n--- ${name} ---`);
  console.log('Lagna:', chart.lagna.signNameTa);
  console.log('4th House:', house4SignId, 'Occupants in 4th:', occ4);
  console.log('Mercury sign:', pMercury.signId, 'Mars sign:', pMars.signId, 'Rahu sign:', pRahu.signId);
  console.log('isECESignature:', isECESignature);
  console.log('Deduced Education:', deducedEdu);
}

testChart('Haridass R (30-04-1988)', {
  birthDate: '1988-04-30',
  birthTime: '22:10',
  latitude: 12.2253,
  longitude: 79.0747,
  timezoneOffset: 5.5
});

testChart('Ranipet Native (30-03-1969)', {
  birthDate: '1969-03-30',
  birthTime: '11:55',
  latitude: 12.9224,
  longitude: 79.3326,
  timezoneOffset: 5.5
});
