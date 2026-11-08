const fs = require('fs');

let domLoadedCallback = null;
const elements = {};
function createElement(tag, id = '') {
  return {
    tagName: tag.toUpperCase(),
    id: id,
    children: [],
    attributes: {},
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    setAttribute: function(k, v) { this.attributes[k] = v; },
    getAttribute: function(k) { return this.attributes[k] || null; },
    hasAttribute: function(k) { return k in this.attributes; },
    addEventListener: () => {},
    innerHTML: '',
    textContent: '',
    value: '',
    options: [],
    querySelector: () => null,
    querySelectorAll: () => [],
    closest: () => null,
    appendChild: function(c) { this.children.push(c); }
  };
}

const html = fs.readFileSync('index.html', 'utf8');
const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
idMatches.forEach(id => {
  elements[id] = createElement('div', id);
});

global.window = global;
global.document = {
  readyState: 'complete',
  documentElement: createElement('html'),
  body: createElement('body'),
  getElementById: (id) => {
    if (!elements[id]) elements[id] = createElement('div', id);
    return elements[id];
  },
  querySelector: (sel) => null,
  querySelectorAll: (sel) => [],
  createElement: (tag) => createElement(tag),
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') domLoadedCallback = cb;
  }
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.navigator = { userAgent: 'node' };

const scripts = [
  'js/translations.js',
  'js/places-data.js',
  'js/astro-engine.js',
  'js/marriage-engine.js',
  'js/muhurtham-engine.js',
  'js/numerology-engine.js',
  'js/remedies-data.js',
  'js/charts-renderer.js',
  'js/panchangam-calculator.js',
  'js/pada-108-engine.js',
  'js/pancha-pakshi-engine.js',
  'js/nalla-neram-engine.js'
];

scripts.forEach(s => eval(fs.readFileSync(s, 'utf8')));

let errors = [];
console.error = function(...args) {
  errors.push(args.join(' '));
};

eval(fs.readFileSync('js/app.js', 'utf8'));

if (domLoadedCallback) {
  console.log('Triggering DOMContentLoaded callback...');
  domLoadedCallback();
}

console.log('Errors caught:', errors.length);
if (errors.length > 0) {
  console.log('Errors:', errors);
}

const chakraSvg = elements['ashtaChakraContainer']?.innerHTML || '';
const matrixBody = elements['ashtaMatrixTableBody']?.innerHTML || '';
const shodhanaBody = elements['ashtaShodhanaTableBody']?.innerHTML || '';
const pindaBody = elements['ashtaPindaTableBody']?.innerHTML || '';
const bavaCards = elements['bavaPalanCardsContainer']?.innerHTML || '';

console.log('chakraSvg length:', chakraSvg.length);
console.log('matrixBody length:', matrixBody.length);
console.log('shodhanaBody length:', shodhanaBody.length);
console.log('pindaBody length:', pindaBody.length);
console.log('bavaCards length:', bavaCards.length);

console.log('Does matrix contain 39?:', matrixBody.includes('39'));
console.log('Does matrix contain 337?:', matrixBody.includes('337'));

// Print sample matrix snippet
if (matrixBody.length > 0) {
  console.log('Matrix preview:\n', matrixBody.slice(0, 400));
}
