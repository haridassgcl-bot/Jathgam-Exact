const fs = require('fs');
const AstroEngine = require('../js/astro-engine.js');

const profile = {
  name: "Haridass R",
  birthDate: "1988-04-30",
  birthTime: "22:10",
  place: "Tiruvannamalai, Tamil Nadu, India",
  latitude: 12.2343,
  longitude: 79.0762
};

const horoscopeData = {
  lagna: { signId: 8, deg: 8, min: 37, signNameTa: "தனுசு" },
  planets: {
    Su: { signId: 0, deg: 16, min: 51, isRetrograde: false },
    Mo: { signId: 6, deg: 1, min: 44, isRetrograde: false },
    Ma: { signId: 9, deg: 22, min: 12, isRetrograde: false },
    Me: { signId: 0, deg: 28, min: 18, isRetrograde: false },
    Ju: { signId: 0, deg: 18, min: 27, isRetrograde: false },
    Ve: { signId: 1, deg: 28, min: 55, isRetrograde: false },
    Sa: { signId: 8, deg: 8, min: 33, isRetrograde: true },
    Ra: { signId: 10, deg: 27, min: 4, isRetrograde: true },
    Ke: { signId: 4, deg: 27, min: 4, isRetrograde: true },
    Man: { signId: 9, deg: 7, min: 44, isRetrograde: false }
  }
};

const jk = AstroEngine.calculateJamakkol(horoscopeData, { mode: 'birth' });

function renderJamakkolSvg(profile, data, jk) {
  const OUTER_SLOT_COORDS = [
    { x: 165.5, y: 12, signId: 11 },
    { x: 290.5, y: 12, signId: 0 },
    { x: 540.5, y: 12, signId: 2 },
    { x: 642,   y: 235.5, signId: 3 },
    { x: 540.5, y: 584, signId: 5 },
    { x: 415.5, y: 584, signId: 6 },
    { x: 165.5, y: 584, signId: 8 },
    { x: 64,    y: 360.5, signId: 9 }
  ];

  let outerBadgesSvg = "";
  if (jk && jk.jamamPlanets && jk.jamamPlanets.length >= 8) {
    jk.jamamPlanets.forEach((jp, idx) => {
      const slot = OUTER_SLOT_COORDS[idx];
      const isMoon = jp.code === "Mo";
      const txtColor = isMoon ? "#2563EB" : "#6B21A8";
      const strokeColor = isMoon ? "#3B82F6" : "#7E22CE";
      outerBadgesSvg += `
      <g transform="translate(${slot.x}, ${slot.y})">
        <rect width="54" height="44" rx="4" fill="#FFFFFF" stroke="${strokeColor}" stroke-width="1.2" />
        <text x="27" y="19" text-anchor="middle" font-size="13" font-weight="${isMoon ? '800' : '700'}" fill="${txtColor}">${jp.shortTa || jp.code}</text>
        <text x="27" y="34" text-anchor="middle" font-size="10.5" font-weight="600" fill="${txtColor}">${jp.formatted || (jp.deg + '°' + jp.min + '′')}</text>
      </g>`;
    });
  }

  const SIGN_CELL_COORDS = {
    11: { x: 130, y: 70 },
    0:  { x: 255, y: 70 },
    1:  { x: 380, y: 70 },
    2:  { x: 505, y: 70 },
    3:  { x: 505, y: 195 },
    4:  { x: 505, y: 320 },
    5:  { x: 505, y: 445 },
    6:  { x: 380, y: 445 },
    7:  { x: 255, y: 445 },
    8:  { x: 130, y: 445 },
    9:  { x: 130, y: 320 },
    10: { x: 130, y: 195 }
  };

  const signContents = {};
  for (let i = 0; i < 12; i++) signContents[i] = [];

  const pLabels = { Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத", Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி", Ra: "ராகு", Ke: "கேது", Man: "மாந்" };

  if (data.planets) {
    Object.keys(data.planets).forEach(k => {
      if (k === "Asc") return;
      const pl = data.planets[k];
      if (pl && pl.signId !== undefined) {
        const isRetro = pl.isRetrograde ? "*" : "";
        const lbl = pLabels[k] || k;
        const degStr = `${pl.deg || 0}°${String(pl.min || 0).padStart(2, '0')}′`;
        const isMo = k === "Mo";
        signContents[pl.signId].push({
          text: `${lbl} ${degStr}${isRetro}`,
          color: isMo ? "#2563EB" : "#6B21A8",
          isBold: isMo
        });
      }
    });
  }

  if (data.lagna && data.lagna.signId !== undefined) {
    const degStr = `${data.lagna.deg || 0}°${String(data.lagna.min || 0).padStart(2, '0')}′`;
    signContents[data.lagna.signId].unshift({
      text: `லக் ${degStr}`,
      color: "#C2410C",
      isBold: true
    });
  }

  const udhayamSign = jk.udhayam.signId;
  const aaroodamSign = jk.aaroodam.signId;
  const kavippuSign = jk.kavippu.signId;

  let innerCellsSvg = "";
  for (let sId = 0; sId < 12; sId++) {
    const coord = SIGN_CELL_COORDS[sId];
    if (!coord) continue;

    let cellInner = "";
    if (data.lagna && data.lagna.signId === sId) {
      cellInner += `<line x1="${coord.x}" y1="${coord.y + 23}" x2="${coord.x + 23}" y2="${coord.y}" stroke="#F97316" stroke-width="2.5" />`;
    }

    let badgeY = coord.y + 10;
    if (udhayamSign === sId) {
      cellInner += `
      <rect x="${coord.x + 10}" y="${badgeY}" width="46" height="34" rx="4" fill="#FEF3C7" stroke="#F59E0B" stroke-width="1" />
      <text x="${coord.x + 33}" y="${badgeY + 15}" text-anchor="middle" font-size="11" font-weight="800" fill="#7C2D12">உத</text>
      <text x="${coord.x + 33}" y="${badgeY + 28}" text-anchor="middle" font-size="9" font-weight="700" fill="#7C2D12">${jk.udhayam.formatted}</text>`;
    }
    if (aaroodamSign === sId) {
      const bX = (udhayamSign === sId) ? coord.x + 64 : coord.x + 10;
      cellInner += `
      <rect x="${bX}" y="${badgeY}" width="46" height="34" rx="4" fill="#1E293B" />
      <text x="${bX + 23}" y="${badgeY + 15}" text-anchor="middle" font-size="11" font-weight="800" fill="#FFFFFF">ஆரூ</text>
      <text x="${bX + 23}" y="${badgeY + 28}" text-anchor="middle" font-size="9" font-weight="700" fill="#FFFFFF">${jk.aaroodam.formatted}</text>`;
    }
    if (kavippuSign === sId) {
      const bX = (udhayamSign === sId || aaroodamSign === sId) ? coord.x + 64 : coord.x + 10;
      cellInner += `
      <rect x="${bX}" y="${badgeY}" width="46" height="34" rx="4" fill="#E11D48" />
      <text x="${bX + 23}" y="${badgeY + 15}" text-anchor="middle" font-size="11" font-weight="800" fill="#FFFFFF">கவி</text>
      <text x="${bX + 23}" y="${badgeY + 28}" text-anchor="middle" font-size="9" font-weight="700" fill="#FFFFFF">${jk.kavippu.formatted}</text>`;
    }

    const items = signContents[sId] || [];
    const hasBadges = (udhayamSign === sId || aaroodamSign === sId || kavippuSign === sId);
    const startTextY = hasBadges ? (coord.y + 58) : (coord.y + 35);

    items.forEach((item, itIdx) => {
      if (itIdx >= 4) return;
      const itemY = startTextY + (itIdx * 20);
      const itemX = coord.x + 62.5;
      cellInner += `<text x="${itemX}" y="${itemY}" text-anchor="middle" font-size="11.5" font-weight="${item.isBold ? '700' : '600'}" fill="${item.color}">${item.text}</text>`;
    });

    innerCellsSvg += cellInner;
  }

  return `<svg viewBox="0 0 780 640">${outerBadgesSvg}${innerCellsSvg}</svg>`;
}

const svgOut = renderJamakkolSvg(profile, horoscopeData, jk);
console.log("SVG rendered length:", svgOut.length);
console.log("Contains udhayam badge:", svgOut.includes("உத"));
console.log("Contains aaroodam badge:", svgOut.includes("ஆரூ"));
console.log("Contains kavippu badge:", svgOut.includes("கவி"));
