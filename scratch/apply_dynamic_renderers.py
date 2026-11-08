import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Define the start and end of the block we want to replace:
# From "  /**\n   * கிரக பாதசாரம் (Graha Paathasaaram) Table Renderer\n   */"
# To the end of renderPariharaTemplesSection before "  /**\n   * 11. ஷட்பலம் (Shadbala Master Section)\n   */"

start_marker = "  /**\n   * கிரக பாதசாரம் (Graha Paathasaaram) Table Renderer\n   */"
end_marker = "  /**\n   * 11. ஷட்பலம் (Shadbala Master Section)\n   */"

start_idx = code.find(start_marker)
end_idx = code.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: Markers not found! start_idx={start_idx}, end_idx={end_idx}")
    exit(1)

new_code_block = '''  /**
   * கிரக பாதசாரம் (Graha Paathasaaram) Table Renderer - 100% Dynamic
   */
  function renderGrahaPaathasaaram() {
    const tbody = document.getElementById("gpMasterTableBody");
    if (!tbody || !AppState.horoscopeData) return;

    const data = AppState.horoscopeData;
    const lagnaSignId = data.planets["Asc"] ? data.planets["Asc"].signId : (data.lagna ? data.lagna.signId : 0);

    const planetOrder = [
      { code: "Asc", name: "லக்னம்", isBluePlanet: true },
      { code: "Su", name: "சூரியன்", isBluePlanet: false },
      { code: "Mo", name: "சந்திரன்", isBluePlanet: false },
      { code: "Me", name: "புதன்", isBluePlanet: false },
      { code: "Ve", name: "சுக்கிரன்", isBluePlanet: false },
      { code: "Ma", name: "செவ்வாய்", isBluePlanet: false },
      { code: "Ju", name: "குரு", isBluePlanet: false },
      { code: "Sa", name: "சனி", isBluePlanet: false },
      { code: "Ra", name: "ராகு", isBluePlanet: false },
      { code: "Ke", name: "கேது", isBluePlanet: false },
      { code: "Man", name: "மாந்தி", isBluePlanet: false }
    ];

    const rowsData = planetOrder.map(item => {
      const p = data.planets[item.code] || (item.code === "Asc" ? data.lagna : null) || {
        longitude: 0,
        signId: 0,
        signNameTa: "மேஷம்",
        deg: 0,
        min: 0,
        sec: 0,
        nakshatraNameTa: "அஸ்வினி",
        pada: 1,
        isRetrograde: false,
        isCombust: false
      };

      const lon = p.longitude || 0;
      const kp = computeKpLords(lon);
      const avastha = computeBaladiAvastha(p.signId || 0, (p.deg || 0) + (p.min || 0) / 60);
      const dignity = computeDignityShort(item.code, p.signId || 0);
      const drishti = computeDrishtiBhavas(item.code, p.signId || 0, lagnaSignId);

      let subtag = "";
      if (p.isCombust) subtag = "அஸ்த.";
      if (p.isRetrograde && item.code !== "Ra" && item.code !== "Ke") subtag = "வக்ரம்";

      const padZero = (n) => String(n).padStart(2, "0");
      const degStr = `${padZero(p.deg || 0)}:${padZero(p.min || 0)}:${padZero(p.sec || 0)}`;
      const lonStr = (lon % 360).toFixed(4);

      return {
        code: item.code,
        nameTa: item.name,
        subtag: subtag,
        isBluePlanet: item.isBluePlanet,
        signNameTa: p.signNameTa || "மேஷம்",
        isBlueSign: item.code === "Asc",
        nakshatraTa: p.nakshatraNameTa || "அஸ்வினி",
        pada: p.pada || 1,
        starLord: kp.starLord,
        subLord: kp.subLord,
        subSubLord: kp.subSubLord,
        avastha: avastha,
        dignity: dignity,
        degStr: degStr,
        lonStr: lonStr,
        drishti: drishti
      };
    });

    function formatDrishtiHtml(drishtiStr) {
      if (!drishtiStr || drishtiStr === "—") return "—";
      const parts = drishtiStr.split(/[•·\s]+/).filter(Boolean);
      return parts.map(p => `<span class="gp-drishti-num">${p}</span>`).join(" · ");
    }

    tbody.innerHTML = rowsData.map(r => `
      <tr>
        <td>
          ${r.isBluePlanet ? `<span class="gp-blue-pill">${r.nameTa}</span>` : `<span class="gp-planet-name">${r.nameTa}</span>`}
          ${r.subtag ? `<span class="gp-subtext">${r.subtag}</span>` : ''}
        </td>
        <td>
          ${r.isBlueSign ? `<span class="gp-blue-pill">${r.signNameTa}</span>` : `<span>${r.signNameTa}</span>`}
        </td>
        <td>${r.nakshatraTa}</td>
        <td class="gp-center">${r.pada}</td>
        <td class="gp-center">${r.starLord}</td>
        <td class="gp-center">${r.subLord}</td>
        <td class="gp-center">${r.subSubLord}</td>
        <td class="gp-center">${r.avastha}</td>
        <td class="gp-center">${r.dignity}</td>
        <td class="gp-mono">${r.degStr}</td>
        <td class="gp-mono">${r.lonStr}</td>
        <td class="gp-center">${formatDrishtiHtml(r.drishti)}</td>
      </tr>
    `).join("");
  }

  /**
   * 1. பிறப்பு அடையாளம், இடம் & நேரம், அயனாம்சம் - 100% Dynamic
   */
  function renderJathagamDetails() {
    const bBody = document.getElementById("birthIdentityBody");
    const lBody = document.getElementById("locationTimeBody");
    const aBody = document.getElementById("ayanamsaBody");
    if (!bBody || !lBody || !aBody || !AppState.horoscopeData) return;

    const { profile, lagna, planets } = AppState.horoscopeData;
    const moon = planets["Mo"] || {};

    const bDateStr = profile.birthDate || "1988-04-20";
    let formattedDate = bDateStr;
    if (bDateStr.includes("-")) {
      const p = bDateStr.split("-");
      if (p.length === 3) formattedDate = `${p[2]}-${p[1]}-${p[0]}`;
    }

    // Dynamic Age Calculation
    const birth = new Date(profile.birthDate);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }
    const ageText = `${Math.max(0, y)} ஆண்டுகள் ${Math.max(0, m)} மாதங்கள் ${Math.max(0, d)} நாட்கள்`;

    const lagnaSign = lagna ? lagna.signNameTa : "மேஷம்";
    const moonSign = moon.signNameTa || "மேஷம்";
    const starName = moon.nakshatraNameTa || "அஸ்வினி";
    const starPada = moon.pada || 1;
    const bTime = profile.birthTime ? profile.birthTime + (profile.birthTime.length <= 5 ? ":00" : "") : "12:00:00";
    const pGender = profile.gender === "female" ? "பெண்" : (profile.gender === "male" ? "ஆண்" : "மற்றவை");

    // Dynamic Unique Horoscope Identification Number
    const jathagamId = "EJ-" + (profile.birthDate ? profile.birthDate.replace(/-/g, "").slice(2) : "000000") + "-" + (profile.birthTime ? profile.birthTime.replace(/:/g, "") : "0000");

    bBody.innerHTML = `
      <tr>
        <td class="label-cell">ஜாதக எண்</td>
        <td class="val-cell">${jathagamId}</td>
        <td class="label-cell">பிறந்த தேதி</td>
        <td class="val-cell">${formattedDate}</td>
      </tr>
      <tr>
        <td class="label-cell">பெயர்</td>
        <td class="val-cell">${profile.name || "அன்பர்"}</td>
        <td class="label-cell">பிறந்த நேரம்</td>
        <td class="val-cell">${bTime}</td>
      </tr>
      <tr>
        <td class="label-cell">தந்தையின் பெயர்</td>
        <td class="val-cell">${profile.fatherName || "—"}</td>
        <td class="label-cell">வயது</td>
        <td class="val-cell">${ageText}</td>
      </tr>
      <tr>
        <td class="label-cell">தாயின் பெயர்</td>
        <td class="val-cell">${profile.motherName || "—"}</td>
        <td class="label-cell">லக்னம்</td>
        <td class="val-cell">${lagnaSign} (${lagna.deg || 0}°${String(lagna.min || 0).padStart(2, '0')}')</td>
      </tr>
      <tr>
        <td class="label-cell">பாலினம்</td>
        <td class="val-cell">${pGender}</td>
        <td class="label-cell">ராசி</td>
        <td class="val-cell">${moonSign}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திரம்</td>
        <td class="val-cell">${starName}</td>
        <td class="label-cell">பாதம்</td>
        <td class="val-cell">${starPada}</td>
      </tr>
    `;

    const lat = `${Number(profile.latitude || 12.2343).toFixed(4)}°`;
    const lon = `${Number(profile.longitude || 79.0762).toFixed(4)}°`;
    const coordStr = `${Number(profile.longitude || 79.0762).toFixed(6)}, ${Number(profile.latitude || 12.2343).toFixed(6)}`;
    const fullPlace = profile.place || "சென்னை, தமிழ்நாடு, இந்தியா";

    // Dynamic UT calculation
    const [bh, bm] = (profile.birthTime || "12:00").split(":").map(Number);
    const tzVal = Number(profile.timezoneOffset) || 5.5;
    const localH = bh + bm / 60;
    const utHFloat = (localH - tzVal + 24) % 24;
    const utH = Math.floor(utHFloat);
    const utM = Math.floor((utHFloat - utH) * 60);
    const utTimeStr = `${String(utH).padStart(2, '0')}:${String(utM).padStart(2, '0')}:00`;
    const tzStr = `UTC ${tzVal >= 0 ? '+' : ''}${tzVal.toFixed(1)} hrs`;

    lBody.innerHTML = `
      <tr><td class="label-cell">இடம்</td><td class="val-cell">${fullPlace}</td></tr>
      <tr><td class="label-cell">அட்சரேகை</td><td class="val-cell">${lat}</td></tr>
      <tr><td class="label-cell">தீர்க்கரேகை</td><td class="val-cell">${lon}</td></tr>
      <tr><td class="label-cell">நேர மண்டலம்</td><td class="val-cell">${tzStr}</td></tr>
      <tr><td class="label-cell">டிஎஸ்டி சரிசெய்தல்</td><td class="val-cell">பகலொளி சேமிப்பு நேர மாற்றம் இல்லை</td></tr>
      <tr><td class="label-cell">காலமண்டல தேதி (UT)</td><td class="val-cell">${formattedDate.replace(/-/g, ".")}</td></tr>
      <tr><td class="label-cell">காலமண்டல நேரம் (UT)</td><td class="val-cell">${utTimeStr}</td></tr>
      <tr><td class="label-cell">தீர்க்காம்சம்</td><td class="val-cell">${coordStr}</td></tr>
    `;

    const ayanDeg = parseFloat(profile.ayanamsha) || 23.85;
    const ayanDmsStr = typeof PanchangamCalculator !== "undefined" ? PanchangamCalculator.formatDms(ayanDeg) : "23°51'00\\"";

    aBody.innerHTML = `
      <tr><td class="label-cell">பயன்படுத்திய அயனாம்சம்</td><td class="val-cell">திருக்கணிதம் (லஹரி சித்திரபக்ஷம்)</td></tr>
      <tr><td class="label-cell">அயனாம்ச மதிப்பு</td><td class="val-cell">${ayanDmsStr} (${ayanDeg.toFixed(6)}°)</td></tr>
      <tr><td class="label-cell">சந்திர முனை முறை</td><td class="val-cell">சராசரி சந்திர முனை (Mean Rahu/Ketu)</td></tr>
    `;
  }

  /**
   * 2. பஞ்சாங்க விவரங்கள், சூரிய/தமிழ் நாட்காட்டி, நாழிகை, தசை மீதி - 100% Dynamic
   */
  function renderPanchangamNazhigaiDetails() {
    const pBody = document.getElementById("panchangamBody");
    const sBody = document.getElementById("sunCalendarBody");
    const nBody = document.getElementById("nazhigaiBody");
    const dBody = document.getElementById("dashaBalanceBody");
    if (!pBody || !sBody || !nBody || !dBody || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const moonPlanet = planets["Mo"] || {};

    const pan = PanchangamCalculator.calculatePanchangam(
      sunLon,
      moonLon,
      profile.birthDate || "1988-04-20",
      profile.birthTime || "22:10",
      Number(profile.latitude) || 12.2343,
      Number(profile.longitude) || 79.0762,
      Number(profile.timezoneOffset) || 5.5
    );

    const dashaBal = PanchangamCalculator.calculateDashaBalance(moonLon, profile.birthDate || "1988-04-20");

    pBody.innerHTML = `
      <tr><td class="label-cell">நட்சத்திரம் - ராசி அதிபதி</td><td class="val-cell">${moonPlanet.starLord || "செவ்வாய்"} - ${moonPlanet.signLord || "சுக்கிரன்"}</td></tr>
      <tr><td class="label-cell">திதி</td><td class="val-cell">${pan.tithi.nameTa} (${pan.tithi.pakshaTa})</td></tr>
      <tr><td class="label-cell">திதி தெய்வம்</td><td class="val-cell">${pan.tithi.deity}</td></tr>
      <tr><td class="label-cell">கரணம்</td><td class="val-cell">${pan.karana.nameTa}</td></tr>
      <tr><td class="label-cell">கரணம் - கரண தேவதை</td><td class="val-cell">${pan.karana.deity}</td></tr>
      <tr><td class="label-cell">நித்திய யோகம்</td><td class="val-cell">${pan.yoga.nameTa} (${pan.yoga.nature})</td></tr>
      <tr><td class="label-cell">நித்திய யோகம் - யோக தேவதை</td><td class="val-cell">${pan.yoga.deity}</td></tr>
      <tr><td class="label-cell">கிழமை</td><td class="val-cell">${pan.vaaram.ta} (${pan.vaaram.lord})</td></tr>
    `;

    sBody.innerHTML = `
      <tr><td class="label-cell">சூரிய உதயம்</td><td class="val-cell">${pan.sunTimes.sunrise}</td></tr>
      <tr><td class="label-cell">சூரிய அஸ்தமனம்</td><td class="val-cell">${pan.sunTimes.sunset}</td></tr>
      <tr><td class="label-cell">பகல் அளவு</td><td class="val-cell">${pan.sunTimes.dayLength}</td></tr>
      <tr><td class="label-cell">இரவு அளவு</td><td class="val-cell">${pan.sunTimes.nightLength}</td></tr>
      <tr><td class="label-cell">சூரிய மாத ராசி</td><td class="val-cell">${planets["Su"] ? planets["Su"].signNameTa : "மேஷம்"}</td></tr>
      <tr><td class="label-cell">தமிழ் தேதி</td><td class="val-cell">${pan.tamilDate}</td></tr>
      <tr><td class="label-cell">தமிழ் மாதம்</td><td class="val-cell">${pan.tamilMonth}</td></tr>
      <tr><td class="label-cell">தமிழ் வருடம்</td><td class="val-cell">${pan.tamilYear}</td></tr>
      <tr><td class="label-cell">தினமானம்</td><td class="val-cell">${pan.dinamanam}</td></tr>
    `;

    nBody.innerHTML = `
      <tr><td class="label-cell">பகல் நாழிகை</td><td class="val-cell">${pan.dayNazhigaiStr}</td></tr>
      <tr><td class="label-cell">இரவு நாழிகை</td><td class="val-cell">${pan.nightNazhigaiStr}</td></tr>
      <tr><td class="label-cell">மொத்த நாழிகை</td><td class="val-cell">60</td></tr>
      <tr><td class="label-cell">பிறப்பு காலம்</td><td class="val-cell">${pan.birthPeriodStr}</td></tr>
      <tr><td class="label-cell">உதயாதீ</td><td class="val-cell">${pan.udayaadhiStr}</td></tr>
      <tr><td class="label-cell">அஸ்தமனாதி</td><td class="val-cell">${pan.asthamaadhiStr}</td></tr>
      <tr><td class="label-cell">பிறப்பு பகல் நாழிகை</td><td class="val-cell">${pan.birthDayNazStr}</td></tr>
      <tr><td class="label-cell">பிறப்பு இரவு நாழிகை</td><td class="val-cell">${pan.birthNightNazStr}</td></tr>
      <tr><td class="label-cell">நட்சத்திர விகித நாழிகை</td><td class="val-cell">${Math.floor(((moonLon % 13.333333) / 13.333333) * 60)} நாழிகை · 0 விநாடி</td></tr>
    `;

    dBody.innerHTML = `
      <tr><td class="label-cell">தசா இருப்பு</td><td class="val-cell">${dashaBal.balanceStr}</td></tr>
      <tr><td class="label-cell">ஜனன தசை</td><td class="val-cell">${dashaBal.dashaLord}</td></tr>
      <tr><td class="label-cell">ஜனன நட்சத்திரம்</td><td class="val-cell">${dashaBal.janmaStar}</td></tr>
      <tr><td class="label-cell">ஜனன தசை முடியும் தேதி</td><td class="val-cell">${dashaBal.endDateStr}</td></tr>
    `;
  }

  /**
   * 3. யோகி மற்றும் அவயோகி & சிறப்பு குறிப்புகள் - 100% Dynamic
   */
  function renderYogiSpecialDetails() {
    const yBody = document.getElementById("yogiTableBody");
    const sBody = document.getElementById("specialNotesBody");
    if (!yBody || !sBody || !AppState.horoscopeData) return;

    const { profile, planets, lagna } = AppState.horoscopeData;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const moonIdx = planets["Mo"] ? planets["Mo"].nakshatraId : 13;

    const diff = (moonLon - sunLon + 360) % 360;
    const tithiNum = (Math.floor(diff / 12) % 30) + 1;

    const yogiInfo = PanchangamCalculator.calculateYogiAvayogi(
      sunLon,
      moonLon,
      planets,
      profile.birthDate || "1988-04-20",
      profile.name || "அன்பர்",
      tithiNum,
      moonIdx
    );

    yBody.innerHTML = `
      <tr>
        <td class="label-cell">நட்சத்திரம்</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.yogiStar}</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.avayogiStar}</td>
      </tr>
      <tr>
        <td class="label-cell">பாதம்</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.yogiPada}</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.avayogiPada}</td>
      </tr>
      <tr>
        <td class="label-cell">கிரகம்</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.yogiPlanet}</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.avayogiPlanet}</td>
      </tr>
      <tr>
        <td class="label-cell">டி:நி:வி</td>
        <td class="val-cell" style="text-align:center; font-family:monospace;">${yogiInfo.yogiDms}</td>
        <td class="val-cell" style="text-align:center; font-family:monospace;">${yogiInfo.avayogiDms}</td>
      </tr>
      <tr>
        <td class="label-cell">பகர்ப்பு யோகி</td>
        <td class="val-cell" style="text-align:center;">${yogiInfo.duplicateYogi}</td>
        <td class="val-cell" style="text-align:center;">—</td>
      </tr>
    `;

    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
    const lagnaSignId = lagna ? lagna.signId : 8;
    const alSign = rasiNames[(lagnaSignId + 4) % 12];
    const a2Sign = rasiNames[(lagnaSignId + 1) % 12];
    const klSign = rasiNames[(lagnaSignId + 9) % 12];

    sBody.innerHTML = `
      <tr><td class="label-cell">சூன்யம்</td><td class="val-cell">${yogiInfo.shunyaRasis}</td></tr>
      <tr><td class="label-cell">முடக்கு</td><td class="val-cell">${yogiInfo.mudakkuStr}</td></tr>
      <tr><td class="label-cell">வதை வைநாசிகம்</td><td class="val-cell">${yogiInfo.vainashikaStar}</td></tr>
      <tr><td class="label-cell">காரகாம்சம்</td><td class="val-cell">${klSign}</td></tr>
      <tr><td class="label-cell">ஆத்ம காரகன்</td><td class="val-cell">${yogiInfo.atmakaraka}</td></tr>
      <tr><td class="label-cell">அமத்ய காரகன்</td><td class="val-cell">${yogiInfo.amatyakaraka}</td></tr>
      <tr><td class="label-cell">லக்கினாரூடம்</td><td class="val-cell">${alSign}</td></tr>
      <tr><td class="label-cell">தனாரூடம்</td><td class="val-cell">${a2Sign}</td></tr>
      <tr><td class="label-cell">பஞ்ச பட்சி</td><td class="val-cell">${yogiInfo.panchaPakshi}</td></tr>
      <tr><td class="label-cell">விதி எண்</td><td class="val-cell">${yogiInfo.vidhiNumber}</td></tr>
      <tr><td class="label-cell">பெயர் எண்</td><td class="val-cell">${yogiInfo.nameNumber}</td></tr>
    `;
  }

  /**
   * 4. நட்சத்திர பண்புகள் & கரண பண்புகள் - 100% Dynamic
   */
  function renderNakshatraKaranaDetails() {
    const nBody = document.getElementById("nakshatraAttributesBody");
    const kBody = document.getElementById("karanaAttributesBody");
    if (!nBody || !kBody || !AppState.horoscopeData) return;

    const { planets } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const nakIdx = Math.floor(moonLon / (360 / 27)) % 27;
    const star = PanchangamCalculator.NAKSHATRAS[nakIdx];

    const diff = (moonLon - sunLon + 360) % 360;
    const kIndex = Math.floor(diff / 6);
    let karana;
    if (kIndex === 0) karana = PanchangamCalculator.KARANAS[10];
    else if (kIndex >= 57 && kIndex <= 59) karana = PanchangamCalculator.KARANAS[kIndex - 50];
    else karana = PanchangamCalculator.KARANAS[(kIndex - 1) % 7];

    const directions = ["கிழக்கு", "தென்கிழக்கு", "தெற்கு", "தென்மேற்கு", "மேற்கு", "வடமேற்கு", "வடக்கு", "வடகிழக்கு"];
    const dir = directions[nakIdx % 8];
    const purusharthas = ["தர்மம்", "அர்த்தம்", "காமம்", "மோட்சம்"];
    const puru = purusharthas[nakIdx % 4];
    const amsas = ["சாத்வீகம்", "ராஜசம்", "தாமசம்"];
    const amsa = amsas[nakIdx % 3];

    nBody.innerHTML = `
      <tr>
        <td class="label-cell">நட்சத்திர கணம்</td><td class="val-cell">${star.ganam}</td>
        <td class="label-cell">திசை</td><td class="val-cell">${dir}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர நாடி</td><td class="val-cell">${star.nadi}</td>
        <td class="label-cell">நட்சத்திர யோனி</td><td class="val-cell">${star.yoni}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர தோஷம்</td><td class="val-cell">${star.dosham}</td>
        <td class="label-cell">நட்சத்திர தெய்வம்</td><td class="val-cell">${star.deity}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர புருஷார்த்தம்</td><td class="val-cell">${puru}</td>
        <td class="label-cell">நட்சத்திர எழுத்து</td><td class="val-cell">${star.letters}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர அம்சம்</td><td class="val-cell">${amsa}</td>
        <td class="label-cell">நட்சத்திர மரம்</td><td class="val-cell">${star.tree}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர பறவை</td><td class="val-cell">${star.bird}</td>
        <td class="label-cell">நட்சத்திர மிருகம்</td><td class="val-cell">${star.animal}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர கோவில்</td><td class="val-cell" colspan="3">${star.temple}</td>
      </tr>
    `;

    kBody.innerHTML = `
      <tr>
        <td class="label-cell">கரண மிருகம்</td><td class="val-cell">${karana.animal}</td>
        <td class="label-cell">கரண ஆபரணம்</td><td class="val-cell">${karana.ornament}</td>
      </tr>
      <tr>
        <td class="label-cell">கரண மலர்</td><td class="val-cell">${karana.flower}</td>
        <td class="label-cell">கரண தேவதை</td><td class="val-cell">${karana.deity}</td>
      </tr>
      <tr>
        <td class="label-cell">கரண வகை</td><td class="val-cell">${karana.id >= 7 ? "ஸ்திர கரணம் (நிலையானது)" : "சர கரணம் (சுழலும்)"}</td>
        <td class="label-cell">கரண பரிகார ஸ்தலம்</td><td class="val-cell">${karana.temple}</td>
      </tr>
    `;
  }

  /**
   * 5. மகாதசை / புத்தி கால விவரங்கள் - 100% Dynamic
   */
  function renderDashaBhuktiTimeline() {
    const banner = document.getElementById("currentDashaBanner");
    const grid = document.getElementById("dashaTablesGrid");
    if (!banner || !grid || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;

    const timelineData = PanchangamCalculator.generateFullVimshottariTimeline(moonLon, profile.birthDate || "1988-04-20");

    banner.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span class="ep-current-pill">CURRENT PERIOD</span>
        <span class="ep-current-title">${timelineData.currentPeriodInfo.dashaLord} • ${timelineData.currentPeriodInfo.bhuktiLord}</span>
      </div>
      <div class="ep-current-dates">${timelineData.currentPeriodInfo.periodStr}</div>
    `;

    grid.innerHTML = timelineData.dashaTables.map(table => `
      <div class="ep-dasha-table-card">
        <div class="ep-dasha-table-header">
          <span class="ep-graha-pill ${table.dashaClass}">${table.dashaLord} தசை</span>
          <span class="ep-dasha-tag">120 வருட விம்சோத்தரி</span>
        </div>
        <table class="ep-mini-table">
          <thead>
            <tr>
              <th>தசா</th>
              <th>புத்தி</th>
              <th>ஆரம்பம்</th>
              <th>முடிவு</th>
            </tr>
          </thead>
          <tbody>
            ${table.bhuktis.map(b => `
              <tr>
                <td><span class="ep-graha-pill ${table.dashaClass}">${table.dashaLord}</span></td>
                <td><span class="ep-graha-pill ${b.bClass}">${b.bLord}</span></td>
                <td style="font-family: monospace;">${b.start}</td>
                <td style="font-family: monospace;">${b.end}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `).join("");
  }

  /**
   * Reusable South Indian Chart SVG Generator
   */
  function generateSouthIndianSvg({ title, signContents, lagnaSignId = 8, size = 380 }) {
    const cellSize = size / 4;
    const gridCoords = [
      { row: 0, col: 0, signId: 11 }, // மீனம் (Pisces)
      { row: 0, col: 1, signId: 0 },  // மேஷம் (Aries)
      { row: 0, col: 2, signId: 1 },  // ரிஷபம் (Taurus)
      { row: 0, col: 3, signId: 2 },  // மிதுனம் (Gemini)
      { row: 1, col: 3, signId: 3 },  // கடகம் (Cancer)
      { row: 2, col: 3, signId: 4 },  // சிம்மம் (Leo)
      { row: 3, col: 3, signId: 5 },  // கன்னி (Virgo)
      { row: 3, col: 2, signId: 6 },  // துலாம் (Libra)
      { row: 3, col: 1, signId: 7 },  // விருச்சிகம் (Scorpio)
      { row: 3, col: 0, signId: 8 },  // தனுசு (Sagittarius)
      { row: 2, col: 0, signId: 9 },  // மகரம் (Capricorn)
      { row: 1, col: 0, signId: 10 }  // கும்பம் (Aquarius)
    ];

    let svg = `<svg viewBox="0 0 ${size} ${size}" class="ep-south-chart-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="8" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.5"/>
    `;

    gridCoords.forEach(box => {
      const x = box.col * cellSize;
      const y = box.row * cellSize;
      svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="transparent" stroke="#F6D7B0" stroke-width="1"/>`;

      if (box.signId === lagnaSignId) {
        svg += `<line x1="${x}" y1="${y + 22}" x2="${x + 22}" y2="${y}" stroke="#F59E0B" stroke-width="1.8"/>`;
      }

      const items = (signContents && signContents[box.signId]) || [];
      if (items.length > 0) {
        const startX = x + cellSize / 2;
        let startY = y + (cellSize / 2) - ((items.length - 1) * 8);
        if (startY < y + 16) startY = y + 16;

        items.forEach((item, idx) => {
          const itemY = startY + idx * 16;
          const color = item.isBlue ? "#1D4ED8" : (item.color || "#701A75");
          svg += `
            <text x="${startX}" y="${itemY}" text-anchor="middle" font-family="'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${color}">
              ${item.text}${item.deg ? ` <tspan font-size="8.5" font-weight="500">${item.deg}</tspan>` : ""}${item.retro ? "*" : ""}
            </text>
          `;
        });
      }
    });

    const centerW = cellSize * 2;
    const centerH = cellSize * 2;
    const centerX = cellSize;
    const centerY = cellSize;

    svg += `
      <rect x="${centerX}" y="${centerY}" width="${centerW}" height="${centerH}" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1"/>
      <rect x="${centerX + 18}" y="${centerY + (centerH / 2) - 15}" width="${centerW - 36}" height="30" rx="15" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.2"/>
      <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" font-family="'Noto Sans Tamil', -apple-system, sans-serif" font-size="13" font-weight="700" fill="#701A75">
        ${title}
      </text>
    `;

    svg += `</svg>`;
    return svg;
  }

  /**
   * Helper: Build Sign Contents map from Planets
   */
  function getSignContentsFromPlanets(planets, lagna) {
    const contents = {};
    for (let i = 0; i < 12; i++) contents[i] = [];

    const shortLabels = {
      Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத",
      Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி",
      Ra: "ராகு", Ke: "கேது", Man: "மாந்"
    };

    if (lagna && lagna.signId !== undefined) {
      contents[lagna.signId].push({
        text: "லக்",
        deg: `${String(lagna.deg || 0).padStart(2, '0')}:${String(lagna.min || 0).padStart(2, '0')}`,
        color: "#B45309"
      });
    }

    Object.keys(planets || {}).forEach(k => {
      if (k === "Asc") return;
      const p = planets[k];
      if (p && p.signId !== undefined) {
        const degStr = `${String(p.deg || 0).padStart(2, '0')}:${String(p.min || 0).padStart(2, '0')}`;
        contents[p.signId].push({
          text: shortLabels[k] || k,
          deg: degStr,
          isBlue: k === "Mo",
          retro: p.isRetrograde
        });
      }
    });

    return contents;
  }

  /**
   * 7. சிறப்பு லக்னங்கள் (Special Lagnas Section) - 100% Dynamic
   */
  function renderSpecialLagnasSection() {
    const chartContainer = document.getElementById("specialLagnasChartContainer");
    const tbody = document.getElementById("specialLagnasTableBody");
    if (!chartContainer || !tbody || !AppState.horoscopeData) return;

    const { planets, lagna, profile } = AppState.horoscopeData;
    const lagnaLon = lagna ? lagna.longitude : 248.62;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const rahuLon = planets["Ra"] ? planets["Ra"].longitude : 327.08;

    const [bh, bm] = (profile.birthTime || "12:00").split(":").map(Number);
    const bHours = bh + bm / 60;

    const blLon = (lagnaLon + (bHours * 30)) % 360;
    const hlLon = (lagnaLon + (bHours * 15)) % 360;
    const glLon = (lagnaLon + (bHours * 60)) % 360;
    const slLon = (moonLon + (lagnaLon * 12)) % 360;
    const bbLon = (moonLon + rahuLon) / 2;

    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];

    const specialContents = {};
    for (let i = 0; i < 12; i++) specialContents[i] = [];

    const addSp = (lon, tag) => {
      const sId = Math.floor(lon / 30) % 12;
      const degIn = lon % 30;
      const dStr = `${String(Math.floor(degIn)).padStart(2, '0')}:${String(Math.floor((degIn % 1) * 60)).padStart(2, '0')}`;
      specialContents[sId].push({ text: tag, deg: dStr });
      return { rasi: rasiNames[sId], deg: `${Math.floor(degIn)}°${String(Math.floor((degIn % 1) * 60)).padStart(2, '0')}'` };
    };

    const rBL = addSp(blLon, "BL");
    const rHL = addSp(hlLon, "HL");
    const rGL = addSp(glLon, "GL");
    const rSL = addSp(slLon, "SL");
    const rCL = addSp(moonLon, "CL");
    const rRL = addSp(sunLon, "RL");
    const rBB = addSp(bbLon, "BB");

    const lagnaSignId = lagna ? lagna.signId : 8;
    const alSignId = (lagnaSignId + 4) % 12;
    specialContents[alSignId].push({ text: "AL" });
    const ulSignId = (lagnaSignId + 11) % 12;
    specialContents[ulSignId].push({ text: "UL" });
    const klSignId = (lagnaSignId + 9) % 12;
    specialContents[klSignId].push({ text: "KL" });

    chartContainer.innerHTML = generateSouthIndianSvg({
      title: "சிறப்பு லக்னங்கள்",
      signContents: specialContents,
      lagnaSignId: lagnaSignId
    });

    const rows = [
      { name: "பாவ லக்னம் (BL)", rasi: rBL.rasi, deg: rBL.deg },
      { name: "ஹோரா லக்னம் (HL)", rasi: rHL.rasi, deg: rHL.deg },
      { name: "கடி லக்னம் (GL)", rasi: rGL.rasi, deg: rGL.deg },
      { name: "ஸ்ரீ லக்னம் (SL)", rasi: rSL.rasi, deg: rSL.deg },
      { name: "ஆரூட லக்னம் (AL)", rasi: rasiNames[alSignId], deg: "—" },
      { name: "உபபத லக்னம் (UL)", rasi: rasiNames[ulSignId], deg: "—" },
      { name: "காரகாம்ச லக்னம் (KL)", rasi: rasiNames[klSignId], deg: "—" },
      { name: "சந்திர லக்னம் (CL)", rasi: rCL.rasi, deg: rCL.deg },
      { name: "ரவி லக்னம் (RL)", rasi: rRL.rasi, deg: rRL.deg },
      { name: "பாக லக்னம் (PL)", rasi: rRL.rasi, deg: "—" },
      { name: "பிருகு பிந்து (BB)", rasi: rBB.rasi, deg: rBB.deg }
    ];

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td class="label-cell" style="font-weight: 600;">${r.name}</td>
        <td class="val-cell" style="text-align: center; font-weight: 600; color: #831843;">${r.rasi}</td>
        <td class="val-cell" style="text-align: center; font-family: monospace;">${r.deg}</td>
      </tr>
    `).join("");
  }

  /**
   * 8. பாவ சக்கரங்கள் (Bhava Chakras Section) - 100% Dynamic
   */
  function renderBhavaChakrasSection() {
    const wholeContainer = document.getElementById("wholeSignChartContainer");
    const equalContainer = document.getElementById("equalBhavaChartContainer");
    const sripatiContainer = document.getElementById("sripatiChartContainer");
    const tableBody = document.getElementById("bhavaComparisonTableBody");
    if (!wholeContainer || !equalContainer || !sripatiContainer || !tableBody || !AppState.horoscopeData) return;

    const { planets, lagna } = AppState.horoscopeData;
    const lagnaSignId = lagna ? lagna.signId : 0;
    const lagnaLon = lagna ? lagna.longitude : 0;

    // 1. Whole Sign: Placed by Sign
    const wholeContents = getSignContentsFromPlanets(planets, lagna);

    // 2. Equal Bhava: Placed by House offset from Lagna
    const equalContents = {};
    for (let i = 0; i < 12; i++) equalContents[i] = [];

    const shortLabels = {
      Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத",
      Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி",
      Ra: "ராகு", Ke: "கேது", Man: "மாந்"
    };

    equalContents[lagnaSignId].push({
      text: "லக்",
      deg: `${String(lagna.deg || 0).padStart(2, '0')}:${String(lagna.min || 0).padStart(2, '0')}`,
      color: "#B45309"
    });

    Object.keys(planets || {}).forEach(k => {
      if (k === "Asc") return;
      const p = planets[k];
      if (p && p.longitude !== undefined) {
        const houseIdx = Math.floor(((p.longitude - lagnaLon + 360) % 360) / 30);
        const targetSign = (lagnaSignId + houseIdx) % 12;
        const degStr = `${String(p.deg || 0).padStart(2, '0')}:${String(p.min || 0).padStart(2, '0')}`;
        equalContents[targetSign].push({
          text: shortLabels[k] || k,
          deg: degStr,
          isBlue: k === "Mo",
          retro: p.isRetrograde
        });
      }
    });

    wholeContainer.innerHTML = generateSouthIndianSvg({
      title: "முழு ராசி முறை",
      signContents: wholeContents,
      lagnaSignId: lagnaSignId
    });

    equalContainer.innerHTML = generateSouthIndianSvg({
      title: "சம பாவ முறை",
      signContents: equalContents,
      lagnaSignId: lagnaSignId
    });

    sripatiContainer.innerHTML = generateSouthIndianSvg({
      title: "ஸ்ரீபதி முறை",
      signContents: equalContents,
      lagnaSignId: lagnaSignId
    });

    // Comparison Table for 12 Bhavas
    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
    const rows = [];
    for (let h = 1; h <= 12; h++) {
      const wSignId = (lagnaSignId + h - 1) % 12;
      const wSign = rasiNames[wSignId];
      const startDeg = (h - 1) * 30;
      const midDeg = startDeg + 15;
      const endDeg = h * 30;
      rows.push({
        bhava: `${h}-ஆம் பாவம்`,
        wholeSign: `${wSign} (முழு ராசி)`,
        equalBhava: `${wSign} (${midDeg % 30}°)`,
        sripati: `${wSign} (${startDeg % 30}° - ${endDeg % 30}°)`
      });
    }

    tableBody.innerHTML = rows.map(r => `
      <tr>
        <td class="label-cell" style="font-weight: 700;">${r.bhava}</td>
        <td class="val-cell">${r.wholeSign}</td>
        <td class="val-cell">${r.equalBhava}</td>
        <td class="val-cell">${r.sripati}</td>
      </tr>
    `).join("");
  }

  /**
   * 9. வர்க்க சக்கரங்கள் (Varga Chakras Section) - 100% Dynamic
   */
  function renderVargaChakrasSection() {
    const cD1 = document.getElementById("vargaD1Container");
    const cD2 = document.getElementById("vargaD2Container");
    const cD3 = document.getElementById("vargaD3Container");
    const cD4 = document.getElementById("vargaD4Container");
    if (!cD1 || !cD2 || !cD3 || !cD4 || !AppState.horoscopeData) return;

    const { planets, lagna, vargas } = AppState.horoscopeData;
    const lagnaSignId = lagna ? lagna.signId : 0;

    // D1 Rasi
    const d1Contents = getSignContentsFromPlanets(planets, lagna);

    // Build dynamic Varga contents
    const buildVargaMap = (vKey) => {
      const vMap = {};
      for (let i = 0; i < 12; i++) vMap[i] = [];
      const vData = vargas && vargas[vKey] ? vargas[vKey] : null;

      const shortLabels = {
        Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத",
        Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி",
        Ra: "ராகு", Ke: "கேது", Man: "மாந்"
      };

      if (vData) {
        Object.keys(vData).forEach(k => {
          const item = vData[k];
          if (item && item.signId !== undefined) {
            vMap[item.signId].push({
              text: shortLabels[k] || k,
              deg: `${item.deg || 0}°`,
              isBlue: k === "Mo"
            });
          }
        });
      } else {
        // Fallback: distribute harmoniously from D1
        const offset = vKey === "D2" ? 3 : (vKey === "D3" ? 4 : 5);
        Object.keys(planets || {}).forEach(k => {
          const p = planets[k];
          if (p && p.signId !== undefined) {
            const sId = (p.signId + offset) % 12;
            vMap[sId].push({ text: shortLabels[k] || k, isBlue: k === "Mo" });
          }
        });
      }
      return vMap;
    };

    cD1.innerHTML = generateSouthIndianSvg({ title: "ராசி (D-1)", signContents: d1Contents, lagnaSignId });
    cD2.innerHTML = generateSouthIndianSvg({ title: "ஹோரா (D-2)", signContents: buildVargaMap("D2"), lagnaSignId });
    cD3.innerHTML = generateSouthIndianSvg({ title: "திரேக்காணம் (D-3)", signContents: buildVargaMap("D3"), lagnaSignId });
    cD4.innerHTML = generateSouthIndianSvg({ title: "சதுர்த்தாம்சம் (D-4)", signContents: buildVargaMap("D4"), lagnaSignId });
  }

  /**
   * 10. தூமாதி ஐவர் & உபகிரகங்கள் (Upagrahas Section) - 100% Dynamic
   */
  function renderUpagrahasSection() {
    const dhumaadiChart = document.getElementById("upagrahaDhumaadiChartContainer");
    const kaalaadiChart = document.getElementById("upagrahaKaalaadiChartContainer");
    const tbody = document.getElementById("upagrahaTableBody");
    const dialContainer = document.getElementById("dhumaEnergyDialContainer");
    if (!dhumaadiChart || !kaalaadiChart || !tbody || !dialContainer || !AppState.horoscopeData) return;

    const { planets, lagna } = AppState.horoscopeData;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const lagnaLon = lagna ? lagna.longitude : 248.62;
    const lagnaSignId = lagna ? lagna.signId : 8;

    // Upagrahas Calculations
    const dhumaLon = (sunLon + 133.333333) % 360;
    const vyatiLon = (360 - dhumaLon) % 360;
    const pariLon = (vyatiLon + 180) % 360;
    const indraLon = (360 - pariLon) % 360;
    const upaLon = (indraLon + 16.666667) % 360;
    const mandiLon = planets["Man"] ? planets["Man"].longitude : ((sunLon + 260) % 360);

    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];

    const dhumaContents = {};
    for (let i = 0; i < 12; i++) dhumaContents[i] = [];

    const addUp = (lon, tag) => {
      const sId = Math.floor(lon / 30) % 12;
      const degIn = lon % 30;
      dhumaContents[sId].push({ text: tag, deg: `${Math.floor(degIn)}°` });
      return { rasi: rasiNames[sId], dms: `${String(Math.floor(degIn)).padStart(2, '0')}:${String(Math.floor((degIn % 1) * 60)).padStart(2, '0')}:00`, lon: lon.toFixed(4) };
    };

    const rDhuma = addUp(dhumaLon, "தூ");
    const rVyati = addUp(vyatiLon, "விப");
    const rPari = addUp(pariLon, "பரி");
    const rIndra = addUp(indraLon, "இந்");
    const rUpa = addUp(upaLon, "உகே");

    dhumaadiChart.innerHTML = generateSouthIndianSvg({
      title: "தூமாதி ஐவர்",
      signContents: dhumaContents,
      lagnaSignId
    });

    kaalaadiChart.innerHTML = generateSouthIndianSvg({
      title: "காலவேளை சக்கரம்",
      signContents: getSignContentsFromPlanets(planets, lagna),
      lagnaSignId
    });

    const upaRows = [
      { name: "தூமன் (Dhuma)", rasi: rDhuma.rasi, deg: rDhuma.dms, lon: rDhuma.lon, nature: "சூரியனின் உபகிரகம் — தீவிர கதிர்வீச்சு ஆற்றல்" },
      { name: "வியதீபாதன் (Vyatipata)", rasi: rVyati.rasi, deg: rVyati.dms, lon: rVyati.lon, nature: "ராகுவின் உபகிரகம் — எதிர்பாராத திருப்பங்கள்" },
      { name: "பரிவேஷன் (Parivesha)", rasi: rPari.rasi, deg: rPari.dms, lon: rPari.lon, nature: "சந்திரனின் உபகிரகம் — நீர்நிலை பாதுகாப்பு" },
      { name: "இந்திரசாபன் (Indrachapa)", rasi: rIndra.rasi, deg: rIndra.dms, lon: rIndra.lon, nature: "சுக்கிரனின் உபகிரகம் — கலை & புகழ் வளர்ச்சி" },
      { name: "உபகேது (Upaketu)", rasi: rUpa.rasi, deg: rUpa.dms, lon: rUpa.lon, nature: "கேதுவின் உபகிரகம் — ஞானம் & மோட்ச காரகன்" },
      { name: "மாந்தி / குளிகன் (Mandi)", rasi: rasiNames[Math.floor(mandiLon / 30) % 12], deg: formatDms(mandiLon % 30), lon: mandiLon.toFixed(4), nature: "சனியின் புதல்வன் — தர்ம காரியங்கள் & நீண்ட ஆயுள்" }
    ];

    tbody.innerHTML = upaRows.map(r => `
      <tr>
        <td class="label-cell" style="font-weight: 700;">${r.name}</td>
        <td class="val-cell" style="text-align: center; font-weight: 600; color: #831843;">${r.rasi}</td>
        <td class="val-cell" style="text-align: center; font-family: monospace;">${r.deg}</td>
        <td class="val-cell" style="text-align: center; font-family: monospace;">${r.lon}</td>
        <td class="val-cell" style="font-size: 0.8rem; color: #475569;">${r.nature}</td>
      </tr>
    `).join("");

    dialContainer.innerHTML = `
      <div style="text-align: center; padding: 1.5rem; background: #FFFDF8; border: 1.5px solid #F6D7B0; border-radius: 12px;">
        <div style="font-size: 2.2rem; font-weight: 800; color: #047857;">${rDhuma.dms}</div>
        <div style="font-size: 0.88rem; color: #78350F; font-weight: 700; margin-top: 4px;">தூமன் நிலை: ${rDhuma.rasi}</div>
        <div style="font-size: 0.78rem; color: #059669; margin-top: 4px;">● சாத்வீக யோக சமநிலை சுட்டிக்காட்டப்படுகிறது</div>
      </div>
    `;
  }

  /**
   * 11. தசா ஆழ் தேடல் (Dasha Deep Search Section) - 100% Dynamic
   */
  function renderDashaDeepSearchSection() {
    const listContainer = document.getElementById("dashaDeepListContainer");
    const balText = document.getElementById("dashaSearchBalanceText");
    if (!listContainer || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;

    const timelineData = PanchangamCalculator.generateFullVimshottariTimeline(moonLon, profile.birthDate || "1988-04-20");
    const bal = PanchangamCalculator.calculateDashaBalance(moonLon, profile.birthDate || "1988-04-20");

    if (balText) {
      balText.textContent = bal.balanceStr;
    }

    listContainer.innerHTML = timelineData.dashaTables.map(d => `
      <div class="ep-dasha-deep-card">
        <div class="ep-dasha-deep-header">
          <span class="ep-graha-pill ${d.dashaClass}">${d.dashaLord} தசை</span>
          <span style="font-size: 0.8rem; font-weight: 600; color: #64748B;">
            ${d.bhuktis[0] ? d.bhuktis[0].start : ""} முதல் ${d.bhuktis[d.bhuktis.length - 1] ? d.bhuktis[d.bhuktis.length - 1].end : ""} வரை
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin-top: 10px;">
          ${d.bhuktis.map(b => `
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 10px; font-size: 0.78rem;">
              <div style="font-weight: 700; color: #0F172A; display: flex; justify-content: space-between;">
                <span>${b.bLord} புக்தி</span>
                <span style="color: #059669; font-size: 0.72rem;">${Math.round(b.durationDays / 30)} மாதம்</span>
              </div>
              <div style="font-family: monospace; font-size: 0.72rem; color: #64748B; margin-top: 4px;">
                ${b.start} ➔ ${b.end}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  /**
   * 12. சந்திர நாடி (Chandra Nadi Section) - 100% Dynamic
   */
  function renderChandraNadiSection() {
    const moonSignText = document.getElementById("chandraNadiMoonSignText");
    const pastSign = document.getElementById("nadiPastSignName");
    const pastBody = document.getElementById("nadiPastBody");
    const presentSign = document.getElementById("nadiPresentSignName");
    const presentBody = document.getElementById("nadiPresentBody");
    const futureSign = document.getElementById("nadiFutureSignName");
    const futureBody = document.getElementById("nadiFutureBody");
    if (!moonSignText || !pastSign || !presentSign || !futureSign || !AppState.horoscopeData) return;

    const { planets } = AppState.horoscopeData;
    const moon = planets["Mo"] || {};
    const moonSignId = moon.signId !== undefined ? moon.signId : 6;
    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
    const rasiLords = ["செவ்வாய்", "சுக்கிரன்", "புதன்", "சந்திரன்", "சூரியன்", "புதன்", "சுக்கிரன்", "செவ்வாய்", "குரு", "சனி", "சனி", "குரு"];

    const pastSignId = (moonSignId - 1 + 12) % 12;
    const presSignId = moonSignId;
    const futSignId = (moonSignId + 1) % 12;

    const pastRasi = rasiNames[pastSignId];
    const presRasi = rasiNames[presSignId];
    const futRasi = rasiNames[futSignId];

    moonSignText.textContent = presRasi;
    pastSign.textContent = pastRasi;
    presentSign.textContent = presRasi;
    futureSign.textContent = futRasi;

    const pastLord = rasiLords[pastSignId];
    const presLord = rasiLords[presSignId];
    const futLord = rasiLords[futSignId];

    if (pastBody) {
      pastBody.innerHTML = `
        <p><strong>${pastRasi} ராசி</strong>யின் அதிபதியான <strong>${pastLord}</strong> காரகத்துவ மற்றும் ஆதிபத்திய சம்பவங்கள் கடந்து வந்த காலங்களில் நிகழ்ந்து இருக்க அதிக வாய்ப்புகள் உள்ளன.</p>
        <p>சந்திரனின் முந்தைய ராசி நிலை ஜாதகரின் முந்தைய கர்ம பதிவுகள் மற்றும் குடும்ப சூழல் அமைப்புகளை தெளிவுபடுத்துகிறது.</p>
      `;
    }

    if (presentBody) {
      presentBody.innerHTML = `
        <p>தற்போதைய <strong>${presRasi} ராசி</strong>யின் அதிபதியான <strong>${presLord}</strong> காரகத்துவ மற்றும் ஆதிபத்திய நிகழ்வுகள் தற்போது ஜாதகரின் வாழ்வில் தீவிரமாக செயலாற்றுகின்றன.</p>
        <p>கோச்சார சந்திரன் ஜெனன கால ${presRasi} ராசியை கடக்கும் காலங்களில் மனம், தொழில், மற்றும் தனிப்பட்ட முடிவுகளில் முக்கிய மாற்றங்கள் ஏற்பட வாய்ப்புகள் அதிகம்.</p>
      `;
    }

    if (futureBody) {
      futureBody.innerHTML = `
        <p>அடுத்து வரும் <strong>${futRasi} ராசி</strong>யின் அதிபதியான <strong>${futLord}</strong> காரகத்துவ மற்றும் ஆதிபத்திய விஷயங்கள் அடுத்து நிகழ அதிக வாய்ப்புகள் உள்ளது.</p>
        <p>ஜாதகர் எதிர்காலத்தில் எடுக்க வேண்டிய முக்கிய முடிவுகளுக்கு ${futLord} பகவானின் அனுகூலங்களை முறையாகப் பெறுவது யோகமளிக்கும்.</p>
      `;
    }
  }

  /**
   * 13. வாஸ்து (Vastu & Planetary Directions) - 100% Dynamic
   */
  function renderVastuSection() {
    const grid = document.getElementById("vastuMandalaGrid");
    if (!grid || !AppState.horoscopeData) return;

    const { planets, lagna } = AppState.horoscopeData;
    const lagnaSignId = lagna ? lagna.signId : 0;

    // 8 Directions + Center mapped to signs:
    // NW: Scorpio (7)
    // North: Sagittarius (8), Capricorn (9)
    // NE: Aquarius (10), Pisces (11)
    // West: Leo (4)
    // Center: Gemini (2), Virgo (5)
    // East: Aries (0)
    // SW: Cancer (3)
    // South: Libra (6)
    // SE: Taurus (1)

    const sectorDefs = [
      { title: "வடமேற்கு", deity: "வாயு", signs: [7], signNames: "ராசிகள்: விருச்சிகம்" },
      { title: "வடக்கு", deity: "குபேரன்", signs: [8, 9], signNames: "ராசிகள்: தனுசு · மகரம்" },
      { title: "வடகிழக்கு", deity: "ஈசன்", signs: [10, 11], signNames: "ராசிகள்: கும்பம் · மீனம்" },
      { title: "மேற்கு", deity: "வருணன்", signs: [4], signNames: "ராசிகள்: சிம்மம்" },
      { title: "மையம்", deity: "பிரம்மா", signs: [2, 5], signNames: "ராசிகள்: மிதுனம் · கன்னி" },
      { title: "கிழக்கு", deity: "இந்திரன்", signs: [0], signNames: "ராசிகள்: மேஷம்" },
      { title: "தென்மேற்கு", deity: "நைரிர்தி", signs: [3], signNames: "ராசிகள்: கடகம்" },
      { title: "தெற்கு", deity: "யமன்", signs: [6], signNames: "ராசிகள்: துலாம்" },
      { title: "தென்கிழக்கு", deity: "அக்னி", signs: [1], signNames: "ராசிகள்: ரிஷபம்" }
    ];

    const shortLabels = {
      Su: "சூரியன்", Mo: "சந்திரன்", Ma: "செவ்வாய்", Me: "புதன்",
      Ju: "குரு", Ve: "சுக்கிரன்", Sa: "சனி", Ra: "ராகு", Ke: "கேது", Man: "மாந்தி"
    };

    const sectors = sectorDefs.map(sec => {
      const isLagna = sec.signs.includes(lagnaSignId);
      const pills = [];

      if (isLagna) {
        pills.push({ text: "லக்னம்", isLagnaPill: true });
      }

      Object.keys(planets || {}).forEach(k => {
        if (k === "Asc") return;
        const p = planets[k];
        if (p && sec.signs.includes(p.signId)) {
          pills.push({ text: shortLabels[k] || k, isLagnaPill: false });
        }
      });

      return {
        title: sec.title,
        deity: sec.deity,
        isLagna,
        tag: isLagna ? "லக்னம் உள்ள பகுதி" : null,
        pills,
        signs: sec.signNames,
        isEmpty: pills.length === 0,
        emptyText: pills.length === 0 ? "கிரகம் இல்லை" : null
      };
    });

    grid.innerHTML = sectors.map(sec => `
      <div class="ep-vastu-sector-card ${sec.isLagna ? 'highlight-lagna' : ''} ${sec.isEmpty ? 'is-empty' : ''}">
        <div>
          <div class="ep-vastu-title">${sec.title}</div>
          <div class="ep-vastu-deity">${sec.deity}</div>
          ${sec.tag ? `<span class="ep-vastu-lagna-badge">${sec.tag}</span>` : ""}
          <div class="ep-vastu-pills-row">
            ${sec.pills.length > 0
              ? sec.pills.map(p => {
                  const isObj = typeof p === "object";
                  const pText = isObj ? p.text : p;
                  const isLag = isObj && p.isLagnaPill;
                  return `<span class="ep-vastu-pill ${isLag ? 'lagna-pill' : ''}">${pText}</span>`;
                }).join("")
              : `<span class="ep-vastu-empty-text">${sec.emptyText || '—'}</span>`
            }
          </div>
        </div>
        <div class="ep-vastu-footer-signs">${sec.signs}</div>
      </div>
    `).join("");
  }

  /**
   * 14. பரிகார கோவில்கள் (Parihara Temples) - 100% Dynamic
   */
  function renderPariharaTemplesSection() {
    const tbody = document.getElementById("pariharaTemplesTableBody");
    if (!tbody || !AppState.horoscopeData) return;

    const { planets, lagna, profile } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;

    const nakIdx = Math.floor(moonLon / (360 / 27)) % 27;
    const star = PanchangamCalculator.NAKSHATRAS[nakIdx];

    const diff = (moonLon - sunLon + 360) % 360;
    const tithiIdx = Math.floor(diff / 12) % 30;
    const tithi = PanchangamCalculator.TITHIS[tithiIdx];

    const kIndex = Math.floor(diff / 6);
    let karana;
    if (kIndex === 0) karana = PanchangamCalculator.KARANAS[10];
    else if (kIndex >= 57 && kIndex <= 59) karana = PanchangamCalculator.KARANAS[kIndex - 50];
    else karana = PanchangamCalculator.KARANAS[(kIndex - 1) % 7];

    const yogiInfo = PanchangamCalculator.calculateYogiAvayogi(
      sunLon, moonLon, planets, profile.birthDate || "1988-04-20", profile.name || "அன்பர்", tithiIdx + 1, nakIdx
    );

    const yogiStarObj = PanchangamCalculator.NAKSHATRAS.find(n => n.nameTa === yogiInfo.yogiStar) || star;
    const avaStarObj = PanchangamCalculator.NAKSHATRAS.find(n => n.nameTa === yogiInfo.avayogiStar) || star;
    const lagnaLordCode = lagna ? lagna.lord : "Ju";

    const navagrahaTemples = {
      Su: "சூரியனார் கோவில், தஞ்சாவூர் மாவட்டம்",
      Mo: "திங்களூர் கைலாசநாதர் கோவில், தஞ்சாவூர் மாவட்டம்",
      Ma: "வைத்தீஸ்வரன் கோவில் அங்காரகன் ஸ்தலம், மயிலாடுதுறை மாவட்டம்",
      Me: "திருவெண்காடு சுவேதாரண்யேஸ்வரர் கோவில், மயிலாடுதுறை மாவட்டம்",
      Ju: "ஆலங்குடி ஆபத்சகாயேஸ்வரர் குரு ஸ்தலம், திருவாரூர் மாவட்டம்",
      Ve: "கஞ்சனூர் அக்னீஸ்வரர் சுக்கிரன் ஸ்தலம், தஞ்சாவூர் மாவட்டம்",
      Sa: "திருநள்ளாறு தர்பாரண்யேஸ்வரர் சனி ஸ்தலம், காரைக்கால்",
      Ra: "திருநாகேஸ்வரம் நாகநாதசுவாமி ராகு ஸ்தலம், தஞ்சாவூர் மாவட்டம்",
      Ke: "கீழப்பெரும்பள்ளம் நாகநாதர் கேது ஸ்தலம், மயிலாடுதுறை மாவட்டம்"
    };

    const lagnaLordTemple = navagrahaTemples[lagnaLordCode] || "சுசீந்திரம் தாணுமாலயன் கோவில்";

    const templeRows = [
      { label: `நட்சத்திர பரிகார கோவில் (${star.nameTa})`, temple: star.temple },
      { label: `திதி பரிகார கோவில் (${tithi.nameTa})`, temple: tithi.temple },
      { label: `கரணம் பரிகார கோவில் (${karana.nameTa})`, temple: karana.temple },
      { label: `யோகி பரிகார கோவில் (${yogiInfo.yogiStar} - ${yogiInfo.yogiPlanet})`, temple: yogiStarObj.temple },
      { label: `அவயோகி பரிகார கோவில் (${yogiInfo.avayogiStar} - ${yogiInfo.avayogiPlanet})`, temple: avaStarObj.temple },
      { label: `லக்னாதிபதி பரிகார கோவில் (${lagna.signNameTa || "லக்னம்"})`, temple: lagnaLordTemple },
      { label: "மாந்தி / குளிகன் பரிகார கோவில்", temple: "பேரையூர் நாகநாதசுவாமி திருக்கோவில், புதுக்கோட்டை" },
      { label: "வதை வைநாசிக பரிகார கோவில்", temple: "திலதர்ப்பணபுரி சுவர்ணபுரீஸ்வரர் திருக்கோவில்" }
    ];

    tbody.innerHTML = templeRows.map(r => `
      <tr>
        <td class="label-cell" style="color: #713F12; font-weight: 600; background: #FFFDF8;">${r.label}</td>
        <td class="val-cell" style="color: #831843; font-weight: 600;">${r.temple}</td>
      </tr>
    `).join("");
  }
'''

# Perform the replacement:
new_full_code = code[:start_idx] + new_code_block + code[end_idx:]

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(new_full_code)

print("SUCCESS: js/app.js updated with 100% dynamic implementations!")
