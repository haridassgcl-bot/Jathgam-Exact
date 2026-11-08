const fs = require('fs');

let transCode = fs.readFileSync('js/translations.js', 'utf8');
transCode = transCode.replace('const I18N =', 'global.I18N =');
eval(transCode);

let astroCode = fs.readFileSync('js/astro-engine.js', 'utf8');
astroCode = astroCode.replace('const AstroEngine =', 'global.AstroEngine =');
eval(astroCode);

console.log("AstroEngine loaded:", typeof global.AstroEngine);

const birthData = {
  birthDate: "1988-04-30",
  birthTime: "22:10",
  latitude: 12.2343,
  longitude: 79.0762,
  timezoneOffset: 5.5,
  gender: "male",
  name: "Haridass R"
};

const result = global.AstroEngine.calculateHoroscope(birthData);
console.log("Horoscope calculated!");
console.log("Total SAV Points:", result.ashtakavarga.totalSAVPoints);
console.log("Grand Shodhya Pinda:", result.ashtakavarga.grandShodhyaPinda);
console.log("Strongest Sign:", JSON.stringify(result.ashtakavarga.strongestSign));
console.log("Weakest Sign:", JSON.stringify(result.ashtakavarga.weakestSign));
console.log("SAV Array:", result.ashtakavarga.SAV);
console.log("Planets Pindas Summary:");
for (const p in result.ashtakavarga.pindas) {
  const pi = result.ashtakavarga.pindas[p];
  console.log(`  ${p}: Orig=${pi.originalTotal}, Trikona=${pi.trikonaTotal}, Ekadhipatya=${pi.ekadhipatyaTotal}, RasiPinda=${pi.rasiPinda}, GrahaPinda=${pi.grahaPinda}, ShodhyaPinda=${pi.shodhyaPinda}, Quality=${pi.qualityTa}`);
}
