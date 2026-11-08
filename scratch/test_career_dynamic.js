const CareerEngine = require('../js/career-engine.js');

const chart1_Dhanusu = {
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
    currentDasha: {
      ta: 'சனி', en: 'Saturn', lord: 'Sa',
      bhuktis: [
        { lord: 'Me', ta: 'புதன்', en: 'Mercury', start: new Date('2024-05-01'), end: new Date('2027-01-15') },
        { lord: 'Ke', ta: 'கேது', en: 'Ketu', start: new Date('2027-01-15'), end: new Date('2028-02-20') }
      ]
    },
    currentBhukti: {
      ta: 'புதன்', en: 'Mercury', lord: 'Me',
      start: new Date('2024-05-01'), end: new Date('2027-01-15')
    }
  }
};

const chart2_Mesha = {
  profile: { name: 'கார்த்திக்', birthDate: '1995-08-15', birthTime: '09:30' },
  lagna: { signId: 0, signNameTa: 'மேஷம்', signNameEn: 'Aries' },
  planets: {
    Su: { signId: 4, longitude: 28.0, isOwnSign: true },
    Mo: { signId: 11, longitude: 12.0 },
    Ma: { signId: 9, longitude: 14.0, isExalted: true },
    Me: { signId: 5, longitude: 10.0, isExalted: true },
    Ju: { signId: 7, longitude: 15.0 },
    Ve: { signId: 3, longitude: 20.0 },
    Sa: { signId: 10, longitude: 26.0, isOwnSign: true },
    Ra: { signId: 6, longitude: 5.0 },
    Ke: { signId: 0, longitude: 5.0 }
  },
  dashaData: {
    currentDasha: {
      ta: 'புதன்', en: 'Mercury', lord: 'Me',
      bhuktis: [
        { lord: 'Ve', ta: 'சுக்கிரன்', en: 'Venus', start: new Date('2025-02-01'), end: new Date('2027-12-10') }
      ]
    },
    currentBhukti: {
      ta: 'சுக்கிரன்', en: 'Venus', lord: 'Ve',
      start: new Date('2025-02-01'), end: new Date('2027-12-10')
    }
  }
};

console.log('Testing Career Engine on Chart 1 (Dhanusu Lagna)...');
const res1 = CareerEngine.calculateCareerProfile(chart1_Dhanusu, { lang: 'ta' });
console.log('Top Sectors Chart 1:');
res1.topSectors.forEach((s, i) => {
  console.log(`#${i+1}: ${s.nameTa} (${s.calculatedScore}%)`);
  console.log(`Explanation: ${s.descriptionTa.slice(0, 160)}...`);
});

console.log('\nTesting Career Engine on Chart 2 (Mesha Lagna)...');
const res2 = CareerEngine.calculateCareerProfile(chart2_Mesha, { lang: 'ta' });
console.log('Top Sectors Chart 2:');
res2.topSectors.forEach((s, i) => {
  console.log(`#${i+1}: ${s.nameTa} (${s.calculatedScore}%)`);
  console.log(`Explanation: ${s.descriptionTa.slice(0, 160)}...`);
});
