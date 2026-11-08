// scratch/test_browser_init.js
const fs = require('fs');

// Create full DOM mock
const elements = {};
function getEl(id) {
  if (!elements[id]) {
    elements[id] = {
      id: id,
      value: id === 'inputBirthDate' ? '1988-04-30' : (id === 'inputBirthTime' ? '22:10' : (id === 'inputFullName' ? 'Haridass R' : '')),
      innerHTML: '',
      textContent: '',
      style: {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
      },
      hasAttribute: () => false,
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      addEventListener: () => {},
      querySelectorAll: () => [],
      scrollIntoView: () => {}
    };
  }
  return elements[id];
}

const domListeners = [];
global.window = global;
global.document = {
  getElementById: (id) => getEl(id),
  querySelectorAll: (selector) => [],
  querySelector: (selector) => getEl('mock'),
  addEventListener: (evt, fn) => {
    if (evt === 'DOMContentLoaded') domListeners.push(fn);
  }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

// Load scripts in order as loaded in index.html
global.I18N = require('../js/translations.js');
require('../js/places-data.js');
global.PanchangamCalculator = require('../js/panchangam-calculator.js');
global.AstroEngine = require('../js/astro-engine.js');
global.ChartsRenderer = require('../js/charts-renderer.js');

console.log("Loading app.js...");
try {
  // Read and eval app.js
  const appCode = fs.readFileSync('./js/app.js', 'utf-8');
  eval(appCode);
  console.log("app.js evaluated without throwing directly!");
  console.log("Triggering DOMContentLoaded (" + domListeners.length + " listeners)...");
  domListeners.forEach(fn => fn());
} catch (err) {
  console.error("FATAL ERROR evaluating app.js:", err);
}

// Now let's check elements innerHTML
console.log("\nChecking rendered innerHTML of target tables:");
console.log("yogiTableBody:", getEl("yogiTableBody").innerHTML.length > 0 ? "POPULATED (" + getEl("yogiTableBody").innerHTML.length + " bytes)" : "EMPTY!");
console.log("specialNotesBody:", getEl("specialNotesBody").innerHTML.length > 0 ? "POPULATED (" + getEl("specialNotesBody").innerHTML.length + " bytes)" : "EMPTY!");
console.log("nakshatraAttributesBody:", getEl("nakshatraAttributesBody").innerHTML.length > 0 ? "POPULATED (" + getEl("nakshatraAttributesBody").innerHTML.length + " bytes)" : "EMPTY!");
console.log("karanaAttributesBody:", getEl("karanaAttributesBody").innerHTML.length > 0 ? "POPULATED (" + getEl("karanaAttributesBody").innerHTML.length + " bytes)" : "EMPTY!");
console.log("currentDashaBanner:", getEl("currentDashaBanner").innerHTML.length > 0 ? "POPULATED (" + getEl("currentDashaBanner").innerHTML.length + " bytes)" : "EMPTY!");
console.log("dashaTablesGrid:", getEl("dashaTablesGrid").innerHTML.length > 0 ? "POPULATED (" + getEl("dashaTablesGrid").innerHTML.length + " bytes)" : "EMPTY!");
