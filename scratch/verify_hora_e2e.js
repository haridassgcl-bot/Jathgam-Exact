const http = require('http');
const fs = require('fs');
const vm = require('vm');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let bodyData = '';
      res.on('data', chunk => bodyData += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: bodyData }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runVerification() {
  console.log("==================================================================");
  console.log("   VERIFYING PLANETARY HORA (கிரக ஹோரா - 3-LEVEL HIERARCHY)");
  console.log("==================================================================");

  // 1. Client-Side MuhurthamEngine verification
  console.log("\n[1] Testing MuhurthamEngine.calculateFullHoraHierarchy...");
  const muhurthamCode = fs.readFileSync('./js/muhurtham-engine.js', 'utf8');
  vm.runInThisContext(muhurthamCode);

  const clientRes = MuhurthamEngine.calculateFullHoraHierarchy('10/13/2026', '04:37 PM', 'Chennai');
  console.log("   Client Summary Badge:", clientRes.activePeriod.summaryBadge);
  console.log("   Active Hora:", clientRes.activePeriod.hora.num, clientRes.activePeriod.hora.planetTa);
  console.log("   Active Sub-Hora:", clientRes.activePeriod.subHora.num, clientRes.activePeriod.subHora.planetTa);
  console.log("   Active Sub-sub-Hora:", clientRes.activePeriod.subSubHora.num, clientRes.activePeriod.subSubHora.planetTa);

  const EXPECTED_BADGE = "நடப்பு காலம் 11 புதன் · உப ஹோராக்கள் 6 சூரியன் · உப-உப ஹோராக்கள் 3 புதன்";
  if (clientRes.activePeriod.summaryBadge !== EXPECTED_BADGE) {
    throw new Error(`Client badge mismatch! Got: ${clientRes.activePeriod.summaryBadge}, Expected: ${EXPECTED_BADGE}`);
  }
  if (clientRes.horas.length !== 24) {
    throw new Error(`Expected 24 Horas, got ${clientRes.horas.length}`);
  }
  if (clientRes.horas[10].subHoras.length !== 7) {
    throw new Error(`Expected 7 Sub-Horas, got ${clientRes.horas[10].subHoras.length}`);
  }
  if (clientRes.horas[10].subHoras[5].subSubHoras.length !== 7) {
    throw new Error(`Expected 7 Sub-sub-Horas, got ${clientRes.horas[10].subHoras[5].subSubHoras.length}`);
  }
  console.log("   => Client Engine: 100% PASS");

  // 2. Python Microservice GET verification
  console.log("\n[2] Testing Python API GET /api/hora...");
  const getRes = await httpGet('http://127.0.0.1:8000/api/hora?date=10/13/2026&time=04:37%20PM&place=Chennai');
  console.log("   HTTP Status:", getRes.status);
  const getJson = JSON.parse(getRes.data);
  console.log("   API Summary Badge:", getJson.activePeriod.summaryBadge);
  if (getRes.status !== 200 || getJson.activePeriod.summaryBadge !== EXPECTED_BADGE) {
    throw new Error(`API GET mismatch! Status: ${getRes.status}, Badge: ${getJson.activePeriod.summaryBadge}`);
  }
  console.log("   => API GET Endpoint: 100% PASS");

  // 3. Python Microservice POST verification
  console.log("\n[3] Testing Python API POST /api/hora...");
  const postRes = await httpPost('http://127.0.0.1:8000/api/hora', {
    date: '10/13/2026',
    time: '04:37 PM',
    place: 'Chennai'
  });
  console.log("   HTTP Status:", postRes.status);
  const postJson = JSON.parse(postRes.data);
  console.log("   POST Summary Badge:", postJson.activePeriod.summaryBadge);
  if (postRes.status !== 200 || postJson.activePeriod.summaryBadge !== EXPECTED_BADGE) {
    throw new Error(`API POST mismatch! Status: ${postRes.status}, Badge: ${postJson.activePeriod.summaryBadge}`);
  }
  console.log("   => API POST Endpoint: 100% PASS");

  // 4. HTML Elements Verification
  console.log("\n[4] Checking index.html Section 27 and UI elements...");
  const html = fs.readFileSync('./index.html', 'utf8');
  const requiredIds = [
    'horaMasterSection',
    'horaTabModern',
    'horaTabTamil',
    'horaInputDate',
    'horaInputTime',
    'horaInputPlace',
    'btnHoraCalculate',
    'btnHoraNow',
    'horaLiveStatusBanner',
    'horaActiveSummaryBadge',
    'btnHoraExpandAll',
    'btnHoraCollapseAll',
    'horaHierarchyTree',
    'pillHora'
  ];

  for (const id of requiredIds) {
    if (!html.includes(`id="${id}"`)) {
      throw new Error(`Missing ID in index.html: ${id}`);
    }
  }
  console.log(`   All ${requiredIds.length} required HTML elements present!`);
  console.log("   => index.html UI: 100% PASS");

  // 5. CSS Styles Verification
  console.log("\n[5] Checking css/main.css for Hora styling...");
  const css = fs.readFileSync('./css/main.css', 'utf8');
  const requiredClasses = [
    '.ep-hora-container',
    '.hora-tab-btn',
    '.hora-tree-container',
    '.hora-card',
    '.hora-sub-panel',
    '.hora-subsub-panel',
    '.hora-active-pulse'
  ];

  for (const cls of requiredClasses) {
    if (!css.includes(cls)) {
      throw new Error(`Missing CSS class in main.css: ${cls}`);
    }
  }
  console.log(`   All ${requiredClasses.length} required CSS classes present!`);
  console.log("   => css/main.css: 100% PASS");

  // 6. JS Integration Verification
  console.log("\n[6] Checking js/app.js integration...");
  const appJs = fs.readFileSync('./js/app.js', 'utf8');
  if (!appJs.includes('renderHoraMasterSection()')) {
    throw new Error('renderHoraMasterSection() not called in app.js');
  }
  if (!appJs.includes('function renderHoraMasterSection()')) {
    throw new Error('renderHoraMasterSection() definition missing in app.js');
  }
  if (!appJs.includes('document.getElementById("horaMasterSection")')) {
    throw new Error('horaMasterSection interaction missing in app.js');
  }
  console.log("   => js/app.js integration: 100% PASS");

  console.log("\n==================================================================");
  console.log("   🎉 ALL VERIFICATION TESTS PASSED 100% WITH ZERO ERRORS!       ");
  console.log("==================================================================");
}

runVerification().catch(err => {
  console.error("\n❌ VERIFICATION FAILED:", err.message);
  process.exit(1);
});
