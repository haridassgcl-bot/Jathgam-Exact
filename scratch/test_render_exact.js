const fs = require('fs');

// Create mock DOM
const elements = {};
function createMockElement(id) {
  const attrs = {};
  const listeners = {};
  return {
    id,
    value: '',
    options: [],
    children: [],
    innerHTML: '',
    textContent: '',
    style: {},
    classList: { toggle: () => {}, add: () => {}, remove: () => {} },
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: (evt, cb) => {
      if (!listeners[evt]) listeners[evt] = [];
      listeners[evt].push(cb);
    },
    click: () => {
      if (listeners['click']) listeners['click'].forEach(cb => cb({ target: { closest: () => null } }));
    },
    scrollIntoView: () => {},
    hasAttribute: (a) => a in attrs,
    setAttribute: (a, v) => { attrs[a] = v; },
    getAttribute: (a) => attrs[a] || null,
    closest: () => null,
    appendChild: () => {}
  };
}

let domLoadedCallback = null;
const mockDoc = {
  getElementById: (id) => {
    if (!elements[id]) elements[id] = createMockElement(id);
    return elements[id];
  },
  querySelectorAll: () => [],
  documentElement: { lang: 'ta' },
  body: { classList: { toggle: () => {} } },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') domLoadedCallback = cb;
  }
};

// Global context
const ctx = {
  window: {},
  document: mockDoc,
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  navigator: {},
  console: console
};
ctx.window = ctx;

const trCode = fs.readFileSync('js/translations.js', 'utf8');
const placesCode = fs.readFileSync('js/places-data.js', 'utf8');
const astroCode = fs.readFileSync('js/astro-engine.js', 'utf8');
const marCode = fs.readFileSync('js/marriage-engine.js', 'utf8');
const muhCode = fs.readFileSync('js/muhurtham-engine.js', 'utf8');
const numCode = fs.readFileSync('js/numerology-engine.js', 'utf8');
const remCode = fs.readFileSync('js/remedies-data.js', 'utf8');
const chartsCode = fs.readFileSync('js/charts-renderer.js', 'utf8');
const panCode = fs.readFileSync('js/panchangam-calculator.js', 'utf8');
const pada108Code = fs.readFileSync('js/pada-108-engine.js', 'utf8');
const ppCode = fs.readFileSync('js/pancha-pakshi-engine.js', 'utf8');
const nnCode = fs.readFileSync('js/nalla-neram-engine.js', 'utf8');
const appCode = fs.readFileSync('js/app.js', 'utf8');

const fullScript = `
${trCode}
${placesCode}
${astroCode}
${marCode}
${muhCode}
${numCode}
${remCode}
${chartsCode}
${panCode}
${pada108Code}
${ppCode}
${nnCode}
${appCode}
`;

try {
  const fn = new Function('window', 'document', 'localStorage', fullScript);
  fn(ctx, mockDoc, ctx.localStorage);
  if (domLoadedCallback) domLoadedCallback();
  console.log('Script initialized and DOMContentLoaded fired successfully!');

  const cleanText = (html) => (String(html ?? '')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  console.log('\n================ ALL 12 SECTIONS VERIFICATION ================');
  console.log('\n[1] பிறப்பு அடையாளம் (Birth Identity):');
  console.log(cleanText(elements['birthIdentityBody']?.innerHTML));

  console.log('\n[1.1] ஜாதகக் கட்டம் (Jathagam Kattam):');
  const kattamHtml = elements['jathagamKattamContainer']?.innerHTML || '';
  console.log('Jathagam Kattam Container rendered length:', kattamHtml.length);
  console.log('Contains rasiKattamBox:', kattamHtml.includes('rasiKattamBox'));
  console.log('Contains navamsamKattamBox:', kattamHtml.includes('navamsamKattamBox'));

  console.log('\n[2] இடம் & நேரம் (Location & Time):');
  console.log(cleanText(elements['locationTimeBody']?.innerHTML));

  console.log('\n[3] அயனாம்சம் & வானியல் (Ayanamsa):');
  console.log(cleanText(elements['ayanamsaBody']?.innerHTML));

  console.log('\n[4] பஞ்சாங்க விவரங்கள் (Panchangam):');
  console.log(cleanText(elements['panchangamBody']?.innerHTML));

  console.log('\n[5] சூரிய & தமிழ் நாட்காட்டி (Sun Calendar):');
  console.log(cleanText(elements['sunCalendarBody']?.innerHTML));

  console.log('\n[6] நாழிகை விவரங்கள் (Nazhigai):');
  console.log(cleanText(elements['nazhigaiBody']?.innerHTML));

  console.log('\n[7] தசை மீதி (Dasha Balance):');
  console.log(cleanText(elements['dashaBalanceBody']?.innerHTML));

  console.log('\n[8] யோகி மற்றும் அவயோகி (Yogi / Avayogi):');
  console.log(cleanText(elements['yogiTableBody']?.innerHTML));

  console.log('\n[9] சிறப்பு குறிப்புகள் (Special Notes):');
  console.log(cleanText(elements['specialNotesBody']?.innerHTML));

  console.log('\n[10] நட்சத்திர பண்புகள் (20 Nakshatra Attributes):');
  console.log(cleanText(elements['nakshatraAttributesBody']?.innerHTML));

  console.log('\n[11] கரண பண்புகள் (8 Karana Attributes):');
  console.log(cleanText(elements['karanaAttributesBody']?.innerHTML));

  console.log('\n[12] ஜெய்மினி சர காரகர்கள் (Jaimini Chara Karakas):');
  console.log(cleanText(elements['jaiminiKarakasTableBody']?.innerHTML));

  console.log('\n[13] நடப்பு தசை பேனர் (Current Dasha Banner):');
  console.log(elements['currentDashaBanner']?.innerHTML);

  console.log('\n[14] விம்சோத்தரி தசா-புக்தி அட்டவணை முதல் கார்டு (First Dasha Table Card):');
  console.log(elements['dashaTablesGrid']?.innerHTML?.slice(0, 1500));

  console.log('\n[16] திருமணப் பொருத்தம் அறிக்கை (Marriage Matching Generated Output):');
  elements['brideName'].value = 'காயத்ரி';
  elements['brideDate'].value = '1998-07-15';
  elements['brideTime'].value = '10:30:00';
  elements['bridePlace'].value = 'Chennai';
  elements['brideLat'].value = 13.0827;
  elements['brideLon'].value = 80.2707;
  elements['brideTz'].value = 5.5;

  elements['groomName'].value = 'சுரேஷ்';
  elements['groomDate'].value = '1995-11-20';
  elements['groomTime'].value = '15:45:00';
  elements['groomPlace'].value = 'Chennai';
  elements['groomLat'].value = 13.0827;
  elements['groomLon'].value = 80.2707;
  elements['groomTz'].value = 5.5;

  elements['btnGenerateReport']?.click();
  console.log(cleanText(elements['marriageMatchingReportOutput']?.innerHTML?.slice(0, 1200)));

  console.log('\n[17] விவாக சக்கரம் (Vivaha Chakra Rule & 3x3 Grid):');
  console.log('Rule Banner Class:', elements['vivahaRuleBanner']?.className);
  console.log('Rule Banner Text:', cleanText(elements['vivahaRuleBanner']?.textContent || elements['vivahaRuleBanner']?.innerHTML));

  console.log('\n[18] 108 நட்சத்திர பாதங்கள் & ராசி பண்புகள் (108 Padas & Rasi Attributes):');
  console.log('Pada Details Table Text:');
  console.log(cleanText(elements['padaDetailsTableBody']?.innerHTML));
  console.log('Rasi Attributes Table Text:');
  console.log(cleanText(elements['rasiAttributesTableBody']?.innerHTML));

  console.log('\n[19] கோச்சார பஞ்சபட்சி (Gochara Pancha Pakshi Daily Schedule):');
  console.log('Main Bird:', cleanText(elements['secPpMainBirdName']?.textContent));
  console.log('Hero Subtitle:', cleanText(elements['secPpMainBirdSub']?.textContent));
  console.log('Noon Bird Badge:', cleanText(elements['secPpNoonBirdBadge']?.textContent));
  console.log('Today Bird Metric:', cleanText(elements['secValTodayBird']?.textContent));
  console.log('Paksham Metric:', cleanText(elements['secValPaksham']?.textContent));
  console.log('Element Metric:', cleanText(elements['secValElement']?.textContent));
  console.log('Weekday Metric:', cleanText(elements['secValWeekday']?.textContent));
  console.log('Sunrise Metric:', cleanText(elements['secValSunrise']?.textContent));
  console.log('Sunset Metric:', cleanText(elements['secValSunset']?.textContent));
  console.log('Live Active Slot:', cleanText(elements['secPpLiveVal']?.textContent));
  console.log('Gochara 3-Day Table Rows Count:', cleanText(elements['secPpGocharaTbody']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Major Timeline Table Rows Count:', cleanText(elements['secPpTimelineTbody']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Transitions Table Rows Count:', cleanText(elements['secPpTransitionsTbody']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Day Accordions Count:', cleanText(elements['secPpDayAccordionList']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Night Accordions Count:', cleanText(elements['secPpNightAccordionList']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');

  console.log('\n[20] திம்ப சக்கரம் (Thimba Chakra / Dimba Chakram):');
  console.log('Natal Dimba Badge:', cleanText(elements['thimbaNatalBadge']?.textContent));
  console.log('Natal Subtitle:', cleanText(elements['thimbaNatalSubtitle']?.textContent));
  console.log('Transit Dimba Badge:', cleanText(elements['thimbaTransitBadge']?.textContent));
  console.log('Transit Subtitle:', cleanText(elements['thimbaTransitSubtitle']?.textContent));
  console.log('Thimba 12 Slots Grid:', cleanText(elements['thimbaSlotsGrid']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');

  console.log('\n[21] எண் ஜோடி பொருத்தம் (Number Pair Matching):');
  console.log('Analyzed Number:', cleanText(elements['numPairDisplayVal']?.textContent));
  console.log('Score:', cleanText(elements['numPairScoreVal']?.textContent));
  console.log('Verdict:', cleanText(elements['numPairVerdictBadge']?.textContent));
  console.log('Compound Sum:', cleanText(elements['numPairCompoundVal']?.textContent));
  console.log('Root Digit:', cleanText(elements['numPairRootVal']?.textContent));
  console.log('Pairs Count Display:', cleanText(elements['numPairCountVal']?.textContent));
  console.log('Suitability:', cleanText(elements['numPairSuitabilityVal']?.textContent));
  console.log('Pairs Cards Grid Rendered:', cleanText(elements['numPairCardsGrid']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');

  console.log('\n[22] நேரம் நல்ல நேரம் (Nalla Neram & Tyajyam Real-Time Schedule):');
  console.log('Date:', cleanText(elements['nnMetaDate']?.textContent));
  console.log('Weekday:', cleanText(elements['nnMetaWeekday']?.textContent));
  console.log('Sunrise:', cleanText(elements['nnMetaSunrise']?.textContent));
  console.log('Sunset:', cleanText(elements['nnMetaSunset']?.textContent));
  console.log('Place:', cleanText(elements['nnMetaPlace']?.textContent));
  console.log('Timezone:', cleanText(elements['nnMetaTimezone']?.textContent));
  console.log('Good Slots Count:', cleanText(elements['nnKpiGoodCount']?.textContent));
  console.log('Bad Slots Count:', cleanText(elements['nnKpiBadCount']?.textContent));
  console.log('Total Good Time:', cleanText(elements['nnKpiTotGoodTime']?.textContent));
  console.log('Total Bad Time:', cleanText(elements['nnKpiTotBadTime']?.textContent));
  console.log('Live Status:', cleanText(elements['nnLiveStatusTitle']?.textContent));
  console.log('Good Timeline Track:', (elements['nnGoodBarTrack']?.innerHTML || '').length > 0 ? 'Rendered' : 'Empty');
  console.log('Bad Timeline Track:', (elements['nnBadBarTrack']?.innerHTML || '').length > 0 ? 'Rendered' : 'Empty');
  console.log('Good Slots List Rendered:', cleanText(elements['nnGoodSlotsList']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Bad Slots List Rendered:', cleanText(elements['nnBadSlotsList']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Nakshatra Transitions:', cleanText(elements['nnNakshatraTransList']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('Tithi Transitions:', cleanText(elements['nnTithiTransList']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');
  console.log('12 Lagnas Transitions Grid:', cleanText(elements['nnLagnaGrid']?.innerHTML).length > 0 ? 'Rendered' : 'Empty');

  console.log('\n[22.1] Nalla Neram Day Navigation Interactivity:');
  elements['nnPrevDayBtn']?.click();
  console.log('After Prev Day click -> Date:', cleanText(elements['nnMetaDate']?.textContent));
  elements['nnNextDayBtn']?.click();
  elements['nnNextDayBtn']?.click();
  console.log('After 2x Next Day click -> Date:', cleanText(elements['nnMetaDate']?.textContent));
  elements['nnTodayBtn']?.click();
  console.log('After Today click -> Date:', cleanText(elements['nnMetaDate']?.textContent));
  console.log('===============================================================');

} catch (err) {
  console.error('Error running test script:', err);
}

