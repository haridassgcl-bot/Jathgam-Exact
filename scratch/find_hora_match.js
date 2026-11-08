// Search for exact sunrise / sunset that gives Hora 11, Sub 6, Sub-sub 3
for (let riseMins = 5 * 60 + 50; riseMins <= 6 * 60 + 15; riseMins += 0.1) {
  for (let setMins = 17 * 60 + 40; setMins <= 18 * 60 + 10; setMins += 0.5) {
    const target = 16 * 60 + 37; // 16:37 = 997 mins
    const daySpan = setMins - riseMins;
    const horaSpan = daySpan / 12;
    const horaIdx = Math.floor((target - riseMins) / horaSpan);
    const horaStart = riseMins + horaIdx * horaSpan;
    const subSpan = horaSpan / 7;
    const subIdx = Math.floor((target - horaStart) / subSpan);
    const subStart = horaStart + subIdx * subSpan;
    const subSubSpan = subSpan / 7;
    const subSubIdx = Math.floor((target - subStart) / subSubSpan);

    if (horaIdx === 10 && subIdx === 5 && subSubIdx === 2) {
      const rH = Math.floor(riseMins / 60);
      const rM = Math.floor(riseMins % 60);
      const rS = Math.floor((riseMins * 60) % 60);
      const sH = Math.floor(setMins / 60);
      const sM = Math.floor(setMins % 60);
      const sS = Math.floor((setMins * 60) % 60);
      console.log(`Match! Sunrise=${rH}:${rM}:${rS}, Sunset=${sH}:${sM}:${sS}, Hora=${horaIdx+1}, Sub=${subIdx+1}, SubSub=${subSubIdx+1}`);
      process.exit(0);
    }
  }
}
console.log("No match found in range");
