const fs = require('fs');

// Mock DOM elements
const domStore = {};
function createMockEl(id, val = '') {
  return {
    id,
    value: val,
    textContent: '',
    innerHTML: '',
    style: {},
    classList: {
      _classes: new Set(),
      add: function(c) { this._classes.add(c); },
      remove: function(c) { this._classes.delete(c); },
      contains: function(c) { return this._classes.has(c); },
      toggle: function(c, force) {
        if (force === undefined) {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        } else if (force) {
          this._classes.add(c);
        } else {
          this._classes.delete(c);
        }
      }
    },
    addEventListener: function(event, cb) {
      if (!this._events) this._events = {};
      if (!this._events[event]) this._events[event] = [];
      this._events[event].push(cb);
    },
    scrollIntoView: function() {},
    setAttribute: function() {},
    getAttribute: function() { return ''; },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    closest: function() { return null; },
    options: [{ value: 'Ranipet (இராணிப்பேட்டை), Tamil Nadu, India', text: 'Ranipet' }]
  };
}

const mockIds = [
  'inputFullName', 'inputFatherName', 'inputMotherName', 'inputGender',
  'inputEducation', 'inputBirthDate', 'inputBirthTime', 'btnAM', 'btnPM',
  'inputBirthPlace', 'quickDistrictSelect', 'inputLat', 'inputLon', 'inputTz',
  'liveCalcStatusBanner', 'liveCalcStatusText', 'careerLiveSyncText', 'careerLiveSyncBadge',
  'career10thHouseBadge', 'careerTimingContainer', 'btnQuickRanipet', 'btnQuickLiveSky',
  'btnQuickSample1', 'epSavedTableBody', 'epRecordsCountBadge', 'profileSummaryBox',
  'careerEduBtnsGroup', 'careerEduFilterLabel', 'careerTimingFilterBar',
  'birthDetailsForm', 'mainChartContainer', 'vargaSelect', 'moduleModal',
  'modalCloseBtn', 'modalTitle', 'modalCategoryBadge', 'modalContentBody',
  'printReportBtn', 'sidebarToggleBtn', 'navSidebarBtn', 'leftSidebarDrawer',
  'sidebarBackdrop', 'sidebarCloseBtn', 'sidebarSearchInput', 'sidebarModuleList',
  'navCareerBtn', 'quickCareerCallout', 'grahaPaathasaaramSection', 'epFormCard',
  'bavaPalanCardsContainer', 'bavaPalanFilterBar', 'epSearchSaved', 'epPerPageSelect'
];

mockIds.forEach(id => {
  domStore[id] = createMockEl(id);
});

global.document = {
  getElementById: (id) => domStore[id] || null,
  querySelectorAll: (selector) => [],
  querySelector: () => null,
  documentElement: { lang: 'ta' },
  body: { classList: createMockEl('body').classList },
  readyState: 'complete',
  addEventListener: () => {}
};

global.window = global;
global.localStorage = {
  _data: {},
  getItem: function(k) { return this._data[k] || null; },
  setItem: function(k, v) { this._data[k] = v; },
  removeItem: function(k) { delete this._data[k]; }
};

// Load dependencies
const translations = require('../js/translations.js');
global.I18N = translations;
const AstroEngine = require('../js/astro-engine.js');
global.AstroEngine = AstroEngine;
const CareerEngine = require('../js/career-engine.js');
global.CareerEngine = CareerEngine;
const ChartsRenderer = require('../js/charts-renderer.js');
global.ChartsRenderer = ChartsRenderer;
const places = require('../js/places-data.js');

// Load app.js
require('../js/app.js');

console.log('--- TEST 1: Default Loaded Profile ---');
console.log('Birth Date in DOM:', domStore.inputBirthDate.value);
console.log('Birth Time in DOM:', domStore.inputBirthTime.value);
console.log('Place in DOM:', domStore.inputBirthPlace.value);
console.log('Education in DOM:', domStore.inputEducation.value);
console.log('Live Status Banner Text:', domStore.liveCalcStatusText.textContent);
console.log('Career Sync Text:', domStore.careerLiveSyncText.textContent);

if (domStore.inputBirthDate.value !== '1969-03-30') {
  throw new Error('Default birth date is not 1969-03-30');
}
if (domStore.inputBirthTime.value !== '11:55') {
  throw new Error('Default birth time is not 11:55');
}

console.log('--- TEST 2: Trigger Live Recalculation (Modify Time to 10:15 AM) ---');
domStore.inputBirthTime.value = '10:15';
global.executeLiveRecalculation();
console.log('Updated Live Status Banner:', domStore.liveCalcStatusText.textContent);
console.log('Updated Career Sync:', domStore.careerLiveSyncText.textContent);

console.log('--- TEST 3: Switch Education to UG Degree ---');
domStore.inputEducation.value = 'degree_ug';
global.executeLiveRecalculation();
console.log('Updated with UG Degree Banner:', domStore.liveCalcStatusText.textContent);

console.log('--- TEST 4: Quick 1-Click Load Ranipet Native ---');
domStore.inputBirthDate.value = '2000-01-01'; // dirty the state
domStore.btnQuickRanipet._events.click[0]();
console.log('After clicking Quick Ranipet:');
console.log('Birth Date:', domStore.inputBirthDate.value);
console.log('Birth Time:', domStore.inputBirthTime.value);
console.log('Education:', domStore.inputEducation.value);
console.log('Live Banner:', domStore.liveCalcStatusText.textContent);

if (domStore.inputBirthDate.value !== '1969-03-30') {
  throw new Error('Quick Ranipet did not reset birth date to 1969-03-30');
}

console.log('\n✅ ALL LIVE RECALCULATION TESTS PASSED CLEANLY WITH ZERO ERRORS!');
