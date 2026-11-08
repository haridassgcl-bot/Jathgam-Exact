// test_dynamic_calculations.js
const fs = require('fs');
const path = require('path');

// Mock browser globals
global.window = global;
global.document = {
  getElementById: (id) => ({
    value: '',
    innerHTML: '',
    textContent: '',
    classList: { add: () => {}, remove: () => {} },
    style: {},
    appendChild: () => {},
    addEventListener: () => {},
    querySelectorAll: () => []
  }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};

// Load scripts
global.I18N = require('../js/translations.js');
require('../js/places-data.js');
global.PanchangamCalculator = require('../js/panchangam-calculator.js');
global.AstroEngine = require('../js/astro-engine.js');

console.log("=== TESTING PANCHANGAM CALCULATOR & ASTRO ENGINE ===");

const profiles = [
  {
    name: "Haridass R",
    birthDate: "1988-04-30",
    birthTime: "22:10",
    place: "Tiruvannamalai, Tamil Nadu",
    latitude: 12.2253,
    longitude: 79.0747,
    timezoneOffset: 5.5
  },
  {
    name: "Priya Nandhini",
    birthDate: "1998-11-20",
    birthTime: "10:30",
    place: "Madurai, Tamil Nadu",
    latitude: 9.9252,
    longitude: 78.1198,
    timezoneOffset: 5.5
  },
  {
    name: "Karthik Subramanian",
    birthDate: "2005-08-15",
    birthTime: "06:15",
    place: "Chennai, Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    timezoneOffset: 5.5
  }
];

profiles.forEach((p, idx) => {
  console.log(`\n--------------------------------------------`);
  console.log(`PROFILE ${idx + 1}: ${p.name} (${p.birthDate} ${p.birthTime} at ${p.place})`);
  console.log(`--------------------------------------------`);

  const chart = AstroEngine.calculateHoroscope(p);
  const moon = chart.planets["Mo"];
  const sun = chart.planets["Su"];
  const lagna = chart.planets["Asc"];

  console.log(`Lagna: ${lagna.signNameTa} (${lagna.deg}°${lagna.min}') [Lon: ${lagna.longitude.toFixed(2)}°]`);
  console.log(`Moon: ${moon.signNameTa} - ${moon.nakshatraNameTa} pada ${moon.pada} [Lon: ${moon.longitude.toFixed(2)}°]`);
  console.log(`Sun: ${sun.signNameTa} [Lon: ${sun.longitude.toFixed(2)}°]`);

  // Panchangam
  const pan = PanchangamCalculator.calculatePanchangam(
    sun.longitude, moon.longitude, p.birthDate, p.birthTime, p.latitude, p.longitude, p.timezoneOffset
  );
  console.log(`Tithi: ${pan.tithi.nameTa} (${pan.tithi.pakshaTa}) - Deity: ${pan.tithi.deity}`);
  console.log(`Karana: ${pan.karana.nameTa} - Deity: ${pan.karana.deity}`);
  console.log(`Yoga: ${pan.yoga.nameTa} (${pan.yoga.nature})`);
  console.log(`Vaaram: ${pan.vaaram.ta} (${pan.vaaram.lord})`);
  console.log(`Sun times: Sunrise: ${pan.sunTimes.sunrise}, Sunset: ${pan.sunTimes.sunset}, Day: ${pan.sunTimes.dayLength}, Night: ${pan.sunTimes.nightLength}`);
  console.log(`Nazhigai: Day: ${pan.dayNazhigaiStr}, Night: ${pan.nightNazhigaiStr}, Udayaadhi: ${pan.udayaadhiStr}`);
  console.log(`Tamil calendar: ${pan.tamilYear} வருடம், ${pan.tamilMonth} மாதம், தேதி ${pan.tamilDate}`);

  // Dasha balance
  const bal = PanchangamCalculator.calculateDashaBalance(moon.longitude, p.birthDate);
  console.log(`Dasha Balance: ${bal.dashaLord} தசை ${bal.balanceStr} (Ends: ${bal.endDateStr})`);

  // Yogi / Avayogi
  const diff = (moon.longitude - sun.longitude + 360) % 360;
  const tithiNum = (Math.floor(diff / 12) % 30) + 1;
  const moonIdx = Math.floor(moon.longitude / (360 / 27)) % 27;
  const yogi = PanchangamCalculator.calculateYogiAvayogi(
    sun.longitude, moon.longitude, chart.planets, p.birthDate, p.name, tithiNum, moonIdx
  );
  console.log(`Yogi: ${yogi.yogiStar} (${yogi.yogiPlanet}) | Avayogi: ${yogi.avayogiStar} (${yogi.avayogiPlanet}) | Dup Yogi: ${yogi.duplicateYogi}`);
  console.log(`Atmakaraka: ${yogi.atmakaraka} | Amatyakaraka: ${yogi.amatyakaraka}`);
  console.log(`Shunya Rasis: ${yogi.shunyaRasis} | Mudakku: ${yogi.mudakkuStr}`);
  console.log(`Star Temple: ${PanchangamCalculator.NAKSHATRAS[moonIdx].temple}`);
  console.log(`Tithi Temple: ${pan.tithi.temple}`);

  // Timeline check
  const tl = PanchangamCalculator.generateFullVimshottariTimeline(moon.longitude, p.birthDate);
  console.log(`Current Period Today: ${tl.currentPeriodInfo.dashaLord} • ${tl.currentPeriodInfo.bhuktiLord} (${tl.currentPeriodInfo.periodStr})`);
  console.log(`Total Dasha Cycles: ${tl.dashaTables.length} tables generated`);
});

console.log("\n>>> ALL CALCULATIONS EXECUTED DYNAMICALLY WITH ZERO ERRORS! <<<");
