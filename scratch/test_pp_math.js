// Test Pancha Pakshi schedule calculations for 2026-10-12 Chennai
const sunriseMin = 5 * 60 + 58; // 5:58 AM = 358 min
const sunsetMin = 17 * 60 + 52; // 5:52 PM = 1072 min
const nextSunriseMin = 24 * 60 + 5 * 60 + 58; // 1798 min

const dayDuration = sunsetMin - sunriseMin; // 714 min
const nightDuration = nextSunriseMin - sunsetMin; // 726 min

console.log("Day Duration:", dayDuration, "mins", "Per Yamam:", dayDuration / 5);
console.log("Night Duration:", nightDuration, "mins", "Per Yamam:", nightDuration / 5);

function formatTime(totalMins) {
  let mins = Math.round(totalMins);
  let h = Math.floor(mins / 60) % 24;
  let m = mins % 60;
  let ampm = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// Weights: அரசு: 2.0/6, ஊண்: 1.25/6, நடை: 1.5/6, துயில்: 0.75/6, சாவு: 0.5/6
const WEIGHTS = {
  "அரசு": 2.0 / 6.0,
  "ஊண்": 1.25 / 6.0,
  "நடை": 1.5 / 6.0,
  "துயில்": 0.75 / 6.0,
  "சாவு": 0.5 / 6.0
};

const CYCLE = ["அரசு", "ஊண்", "நடை", "துயில்", "சாவு"];

function getSubOrder(majorAct) {
  const idx = CYCLE.indexOf(majorAct);
  const res = [];
  for (let i = 0; i < 5; i++) {
    res.push(CYCLE[(idx + i) % 5]);
  }
  return res;
}

// Test Day Yamams
const dayMajorActs = ["நடை", "அரசு", "துயில்", "சாவு", "ஊண்"];
let curMin = sunriseMin;
const dayYamamDuration = dayDuration / 5; // 142.8

console.log("\n--- DAY YAMAMS ---");
for (let y = 0; y < 5; y++) {
  const yStart = curMin;
  const yEnd = curMin + dayYamamDuration;
  const majorAct = dayMajorActs[y];
  console.log(`Yamam ${y+1}: ${formatTime(yStart)} - ${formatTime(yEnd)} | ${majorAct}`);
  
  // Sub-periods
  let subCur = yStart;
  const subOrder = getSubOrder(majorAct);
  for (let s = 0; s < 5; s++) {
    const sAct = subOrder[s];
    const sDur = dayYamamDuration * WEIGHTS[sAct];
    const sStart = subCur;
    const sEnd = subCur + sDur;
    console.log(`   Sub ${s+1}: ${formatTime(sStart)} - ${formatTime(sEnd)} | ${sAct}`);
    
    // Micro-periods for Sub 1
    if (y === 0 && s === 0) {
      let microCur = sStart;
      const microOrder = getSubOrder(sAct);
      for (let m = 0; m < 5; m++) {
        const mAct = microOrder[m];
        const mDur = sDur * WEIGHTS[mAct];
        const mStart = microCur;
        const mEnd = microCur + mDur;
        console.log(`      Micro ${m+1}: ${formatTime(mStart)} - ${formatTime(mEnd)} | ${mAct}`);
        microCur = mEnd;
      }
    }
    subCur = sEnd;
  }
  curMin = yEnd;
}
