const http = require('http');
const fs = require('fs');
const assert = require('assert');

async function main() {
  console.log("=== 1. VERIFYING TITHI TYAJYAM HTML ON PORT 8080 ===");
  const html = await new Promise((resolve, reject) => {
    http.get('http://localhost:8080/index.html', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log("Index HTML Status:", res.statusCode);
        resolve(data);
      });
    }).on('error', reject);
  });

  const checkContains = (id, str) => {
    const ok = str.includes(id);
    console.log(`✓ ${id} present:`, ok);
    assert(ok, `Missing ${id} in index.html`);
  };

  checkContains('tithiTyajyamSection', html);
  checkContains('pillTithiTyajyam', html);
  checkContains('ttTithiSelect', html);
  checkContains('ttChipsGrid', html);
  checkContains('ttInputStartDate', html);
  checkContains('ttInputStartTime', html);
  checkContains('ttInputEndDate', html);
  checkContains('ttInputEndTime', html);
  checkContains('btnTtCalculate', html);
  checkContains('btnTtReset', html);
  checkContains('btnTtPreset24h', html);
  checkContains('btnTtNow', html);
  checkContains('ttValidationAlert', html);
  checkContains('ttMetricsRow', html);
  checkContains('ttTimelineBar', html);
  checkContains('ttTimelineTicks', html);
  checkContains('ttAuspiciousWindowsList', html);
  checkContains('ttVerdictText', html);
  checkContains('ttMasterTableBody', html);

  console.log("\n=== 2. VERIFYING CLIENT JS MUHURTHAM ENGINE 16 TITHIS TYAJYAM ===");
  let engineCode = fs.readFileSync('js/muhurtham-engine.js', 'utf8');
  eval(engineCode.replace('const MuhurthamEngine', 'global.MuhurthamEngine'));

  const expectedGhatikas = [
    50, 40, 30, 20, 24, 15, 20, 25, 30, 24, 12, 20, 15, 18, 10, 14
  ];
  const expectedFractions = [
    "5/6", "2/3", "1/2", "1/3", "2/5", "1/4", "1/3", "5/12", "1/2", "2/5", "1/5", "1/3", "1/4", "3/10", "1/6", "7/30"
  ];
  const expectedTithisTa = [
    "பிரதமை", "த்விதியை", "த்ருதியை", "சதுர்த்தி", "பஞ்சமி", "ஷஷ்டி", "சப்தமி", "அஷ்டமி",
    "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி", "பௌர்ணமி", "அமாவாசை"
  ];

  for (let i = 0; i < 16; i++) {
    const res = global.MuhurthamEngine.calculateTithiTyajyam(i, '2026-10-13', '06:00', '2026-10-14', '06:00');
    assert.strictEqual(res.tithiTa, expectedTithisTa[i], `Mismatch in Tithi Tamil name for tithi ${i}`);
    assert.strictEqual(res.ghatikas, expectedGhatikas[i], `Mismatch in ghatikas for tithi ${i}`);
    assert.strictEqual(res.fractionText, expectedFractions[i], `Mismatch in fraction for tithi ${i}`);
    assert.strictEqual(res.tyajyamDurationMinutes, 96, `Tyajyam duration should be 96 mins (4 nazhigai) for 24h span`);
    assert.strictEqual(res.timelineSegments.length, 3, `Must have 3 timeline segments`);
    assert.strictEqual(res.auspiciousWindows.length, 3, `Must have 3 auspicious windows`);
    assert.strictEqual(res.allTithisTable.length, 16, `Must compare all 16 tithis in table`);
    assert.strictEqual(res.isValid, true, `Should be valid when end > start`);

    console.log(`✓ Tithi #${i + 1} (${res.tithiTa}): Ghatikas=${res.ghatikas}/60 Fraction=${res.fractionText} Tyajyam: ${res.tyajyamStartTime.full} to ${res.tyajyamEndTime.full} (96 min / 4 Nazhigai)`);
  }

  // Test validation when end <= start
  const invalidRes = global.MuhurthamEngine.calculateTithiTyajyam(0, '2026-10-14', '06:00', '2026-10-13', '06:00');
  assert.strictEqual(invalidRes.isValid, false, `Must fail validation when end <= start`);
  assert(invalidRes.validationError.includes("முடிவு நேரம்"), "Must have Tamil error message");
  console.log("✓ Validation check for End <= Start:", invalidRes.validationError);

  console.log("\n=== 3. VERIFYING PYTHON API /api/tithi_tyajyam ===");
  const pyRes0 = await fetch('http://localhost:8000/api/tithi_tyajyam?tithi=0&startTime=06:00').then(r => r.json());
  assert.strictEqual(pyRes0.tithiTa, "பிரதமை");
  assert.strictEqual(pyRes0.fractionText, "5/6");
  assert.strictEqual(pyRes0.ghatikas, 50);
  assert.strictEqual(pyRes0.tyajyamDurationMinutes, 96);
  console.log("✓ Python API GET Prathama (5/6):", pyRes0.tyajyamStartTime.full, "to", pyRes0.tyajyamEndTime.full);

  const pyRes15 = await fetch('http://localhost:8000/api/tithi_tyajyam?tithi=15&startTime=06:00').then(r => r.json());
  assert.strictEqual(pyRes15.tithiTa, "அமாவாசை");
  assert.strictEqual(pyRes15.fractionText, "7/30");
  assert.strictEqual(pyRes15.ghatikas, 14);
  assert.strictEqual(pyRes15.tyajyamDurationMinutes, 96);
  console.log("✓ Python API GET Amavasya (7/30):", pyRes15.tyajyamStartTime.full, "to", pyRes15.tyajyamEndTime.full);

  // Test Python POST
  const pyPostRes = await fetch('http://localhost:8000/api/tithi_tyajyam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tithi: 14, startDate: '2026-10-13', startTime: '06:00', endDate: '2026-10-14', endTime: '06:00' })
  }).then(r => r.json());
  assert.strictEqual(pyPostRes.tithiTa, "பௌர்ணமி");
  assert.strictEqual(pyPostRes.fractionText, "1/6");
  assert.strictEqual(pyPostRes.ghatikas, 10);
  console.log("✓ Python API POST Pournami (1/6):", pyPostRes.tyajyamStartTime.full, "to", pyPostRes.tyajyamEndTime.full);

  console.log("\n>>> ALL 16 TITHIS TYAJYAM VERIFICATIONS PASSED 100%! <<<");
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
