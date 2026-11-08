// Search all combinations of Sunrise and Sunset around Chennai typical times (e.g. 05:50 to 06:10, sunset 17:45 to 18:05)
const target = 16 * 60 + 37; // 16:37
const results = [];

for (let rMins = 5 * 60 + 45; rMins <= 6 * 60 + 15; rMins += 0.5) {
  for (let sMins = 17 * 60 + 35; sMins <= 18 * 60 + 15; sMins += 0.5) {
    const daySpan = sMins - rMins;
    const horaSpan = daySpan / 12;
    const horaIdx = Math.floor((target - rMins) / horaSpan);
    if (horaIdx !== 10) continue; // Hora 11 (0-indexed 10)
    
    const horaStart = rMins + horaIdx * horaSpan;
    const subSpan = horaSpan / 7;
    const subIdx = Math.floor((target - horaStart) / subSpan);
    if (subIdx !== 5) continue; // Sub 6 (0-indexed 5)

    const subStart = horaStart + subIdx * subSpan;
    const subSubSpan = subSpan / 7;
    const subSubIdx = Math.floor((target - subStart) / subSubSpan);
    if (subSubIdx === 2) { // SubSub 3 (0-indexed 2)
      results.push({
        sunrise: `${Math.floor(rMins/60)}:${Math.floor(rMins%60).toString().padStart(2, '0')}:${Math.floor((rMins*60)%60).toString().padStart(2, '0')}`,
        sunset: `${Math.floor(sMins/60)}:${Math.floor(sMins%60).toString().padStart(2, '0')}:${Math.floor((sMins*60)%60).toString().padStart(2, '0')}`,
        rMins,
        sMins,
        dayHours: (daySpan / 60).toFixed(2)
      });
    }
  }
}

console.log(`Found ${results.length} matches. Sample matches:`);
results.slice(0, 15).forEach(m => console.log(m));
