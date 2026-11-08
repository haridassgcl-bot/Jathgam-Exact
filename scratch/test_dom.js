// Test mock DOM with app.js
global.window = global;
global.document = {
  documentElement: { lang: 'ta' },
  body: { classList: { toggle: () => {} } },
  getElementById: (id) => ({
    id,
    textContent: '',
    innerHTML: '',
    value: '',
    addEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => []
  }),
  querySelector: () => null,
  querySelectorAll: () => []
};

console.log("Mock DOM ready");
