const fs = require('fs');

// Load places-data.js content
const placesCode = fs.readFileSync('js/places-data.js', 'utf-8');

// Mock a lightweight DOM environment
class MockElement {
  constructor(id, tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.value = '';
    this.innerHTML = '';
    this.style = {};
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.listeners = {};
    this.options = [];
    this.selectedIndex = 0;
  }

  addEventListener(ev, fn) {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(fn);
  }

  trigger(ev, data = {}) {
    if (this.listeners[ev]) {
      this.listeners[ev].forEach(fn => fn({ target: this, stopPropagation: () => {}, ...data }));
    }
  }

  getAttribute(a) { return this[a] || null; }
  setAttribute(a, v) { this[a] = v; }
  querySelector(sel) { return null; }
  querySelectorAll(sel) { return []; }
  scrollIntoView() {}
  focus() {}
}

const elements = {
  inputBirthPlace: new MockElement('inputBirthPlace', 'input'),
  btnClearBirthPlace: new MockElement('btnClearBirthPlace', 'button'),
  btnTogglePlacesDropdown: new MockElement('btnTogglePlacesDropdown', 'button'),
  placesSearchInput: new MockElement('placesSearchInput', 'input'),
  placesDropdownPanel: new MockElement('placesDropdownPanel', 'div'),
  placesListItems: new MockElement('placesListItems', 'div'),
  quickDistrictSelect: new MockElement('quickDistrictSelect', 'select'),
  inputLat: new MockElement('inputLat', 'input'),
  inputLon: new MockElement('inputLon', 'input'),
  inputTz: new MockElement('inputTz', 'input'),
  geoCoordsText: new MockElement('geoCoordsText', 'span'),
  geoTzBadge: new MockElement('geoTzBadge', 'span'),
  placeGeoBadge: new MockElement('placeGeoBadge', 'div'),
  tnCitiesList: new MockElement('tnCitiesList', 'datalist')
};

// Initialize quickDistrictSelect with sample options
elements.quickDistrictSelect.options = [
  { value: '' },
  { value: 'Ariyalur (அரியலூர்), Tamil Nadu, India' },
  { value: 'Chennai (சென்னை), Tamil Nadu, India' },
  { value: 'Madurai (மதுரை), Tamil Nadu, India' },
  { value: 'Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India' },
  { value: 'Singapore (சிங்கப்பூர்), Singapore' }
];

// Set initial input value
elements.inputBirthPlace.value = 'Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India';

global.document = {
  getElementById: (id) => elements[id] || null,
  querySelector: (sel) => null,
  querySelectorAll: (sel) => [],
  addEventListener: () => {},
  readyState: 'complete'
};

global.window = global;

// Evaluate script
eval(placesCode);

console.log('--- TEST 1: Initial State & Geo Info ---');
console.log('Input value:', elements.inputBirthPlace.value);
console.log('Coordinates:', elements.inputLat.value, elements.inputLon.value, 'TZ:', elements.inputTz.value);
console.log('Badge coords:', elements.geoCoordsText.textContent, 'Badge TZ:', elements.geoTzBadge.textContent);

console.log('\n--- TEST 2: Open Dropdown when Tiruvannamalai is prefilled ---');
// Trigger focus on inputBirthPlace
elements.inputBirthPlace.trigger('focus');
console.log('Dropdown panel display:', elements.placesDropdownPanel.style.display);
// Count how many items were rendered in placesListItems
const renderedItems = (elements.placesListItems.innerHTML.match(/class="ep-place-item/g) || []).length;
console.log('Rendered places count:', renderedItems);
if (renderedItems >= 270) {
  console.log('PASS: All 270+ places are displayed, NOT just Tiruvannamalai!');
} else {
  console.error('FAIL: Only ' + renderedItems + ' places rendered!');
  process.exit(1);
}

console.log('\n--- TEST 3: Select Madurai from Dropdown ---');
selectPlace('Madurai (மதுரை), Tamil Nadu, India');
console.log('Input value after selecting Madurai:', elements.inputBirthPlace.value);
console.log('Coordinates after selecting Madurai:', elements.inputLat.value, elements.inputLon.value);
if (elements.inputLat.value == 9.9252 && elements.inputLon.value == 78.1198) {
  console.log('PASS: Madurai coordinates successfully set (9.9252° N, 78.1198° E)');
} else {
  console.error('FAIL: Madurai coordinates incorrect');
  process.exit(1);
}

console.log('\n--- TEST 4: Select Singapore from Quick Select Dropdown ---');
elements.quickDistrictSelect.value = 'Singapore (சிங்கப்பூர்), Singapore';
elements.quickDistrictSelect.trigger('change');
console.log('Input value after selecting Singapore:', elements.inputBirthPlace.value);
console.log('Coordinates after selecting Singapore:', elements.inputLat.value, elements.inputLon.value, 'TZ:', elements.inputTz.value);
if (elements.inputLat.value == 1.3521 && elements.inputTz.value == 8) {
  console.log('PASS: Singapore coordinates (1.3521° N, 103.8198° E) and Timezone UTC+8:00 successfully set!');
} else {
  console.error('FAIL: Singapore coordinates incorrect');
  process.exit(1);
}

console.log('\n--- TEST 5: Click Clear Button (✕) ---');
elements.btnClearBirthPlace.trigger('click');
console.log('Input value after clear:', elements.inputBirthPlace.value);
const renderedAfterClear = (elements.placesListItems.innerHTML.match(/class="ep-place-item/g) || []).length;
console.log('Rendered places count after clear:', renderedAfterClear);
if (elements.inputBirthPlace.value === '' && renderedAfterClear >= 270) {
  console.log('PASS: Clear button resets input and reveals all 270+ places!');
} else {
  console.error('FAIL: Clear button failed');
  process.exit(1);
}

console.log('\nALL TESTS PASSED WITH 100% SUCCESS!');
