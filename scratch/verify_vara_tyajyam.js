const http = require('http');
const fs = require('fs');
const assert = require('assert');

async function main() {
  console.log("=== 1. VERIFYING VARA TYAJYAM HTML ON PORT 8080 ===");
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

  checkContains('varaTyajyamSection', html);
  checkContains('pillVaraTyajyam', html);
  checkContains('vtWeekdaySelect', html);
  checkContains('vtChipsGrid', html);
  checkContains('vtInputDate', html);
  checkContains('vtInputSunrise', html);
  checkContains('btnVtCalculate', html);
  checkContains('btnVtReset', html);
  checkContains('btnVtPresetSunrise', html);
  checkContains('btnVtToday', html);
  checkContains('vtMetricsRow', html);
  checkContains('vtTimelineBar', html);
  checkContains('vtTimelineTicks', html);
  checkContains('vtAuspiciousWindowsList', html);
  checkContains('vtVerdictText', html);
  checkContains('vtMasterTableBody', html);

  console.log("\n=== 2. VERIFYING CLIENT JS MUHURTHAM ENGINE 7 WEEKDAYS VARA TYAJYAM ===");
  let engineCode = fs.readFileSync('js/muhurtham-engine.js', 'utf8');
  eval(engineCode.replace('const MuhurthamEngine', 'global.MuhurthamEngine'));

  const expectedGhatikas = [32, 42, 31, 42, 31, 21, 14];
  const expectedTa = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
  const expectedEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const expectedOffsetMinutes = [768, 1008, 744, 1008, 744, 504, 336];

  for (let i = 0; i < 7; i++) {
    const res = global.MuhurthamEngine.calculateVaraTyajyam(i, '2026-10-18', '06:00');
    assert.strictEqual(res.weekdayTa, expectedTa[i], `Mismatch in weekday name for index ${i}`);
    assert.strictEqual(res.weekdayEn, expectedEn[i]);
    assert.strictEqual(res.ghatikas, expectedGhatikas[i], `Mismatch in ghatikas for index ${i}`);
    assert.strictEqual(res.offsetMinutes, expectedOffsetMinutes[i]);
    assert.strictEqual(res.durationMinutes, 90, `Vara Tyajyam duration must be 90 minutes (3.75 nazhigai)`);
    assert.strictEqual(res.durationNazhigai, 3.75);
    assert.strictEqual(res.timelineSegments.length, 3);
    assert.strictEqual(res.auspiciousWindows.length, 3);
    assert.strictEqual(res.allWeekdaysTable.length, 7);

    console.log(`✓ Day #${i + 1} (${res.weekdayTa} / ${res.weekdayEn}): Ghatikas=${res.ghatikas} (${res.offsetFormatted} from Sunrise) Tyajyam: ${res.tyajyamStartTime.full} to ${res.tyajyamEndTime.full} (90 min / 3.75 Nazhigai)`);
  }

  console.log("\n=== 3. VERIFYING PYTHON API /api/vara_tyajyam ===");
  const pyRes0 = await fetch('http://localhost:8000/api/vara_tyajyam?weekday=0&sunrise=06:00').then(r => r.json());
  assert.strictEqual(pyRes0.weekdayTa, "ஞாயிறு");
  assert.strictEqual(pyRes0.ghatikas, 32);
  assert.strictEqual(pyRes0.durationMinutes, 90);
  assert.strictEqual(pyRes0.durationNazhigai, 3.75);
  console.log("✓ Python API GET Sunday (32 Nazhigai):", pyRes0.tyajyamStartTime.full, "to", pyRes0.tyajyamEndTime.full);

  const pyRes5 = await fetch('http://localhost:8000/api/vara_tyajyam?weekday=5&sunrise=06:00').then(r => r.json());
  assert.strictEqual(pyRes5.weekdayTa, "வெள்ளி");
  assert.strictEqual(pyRes5.ghatikas, 21);
  assert.strictEqual(pyRes5.durationMinutes, 90);
  console.log("✓ Python API GET Friday (21 Nazhigai):", pyRes5.tyajyamStartTime.full, "to", pyRes5.tyajyamEndTime.full);

  // Test Python POST
  const pyPostRes = await fetch('http://localhost:8000/api/vara_tyajyam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weekday: 6, date: '2026-10-17', sunrise: '06:00' })
  }).then(r => r.json());
  assert.strictEqual(pyPostRes.weekdayTa, "சனி");
  assert.strictEqual(pyPostRes.ghatikas, 14);
  assert.strictEqual(pyPostRes.durationMinutes, 90);
  console.log("✓ Python API POST Saturday (14 Nazhigai):", pyPostRes.tyajyamStartTime.full, "to", pyPostRes.tyajyamEndTime.full);

  console.log("\n>>> ALL 7 WEEKDAYS VARA TYAJYAM VERIFICATIONS PASSED 100%! <<<");
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
