const fs = require('fs');
const code = fs.readFileSync('js/app.js', 'utf8');

const matches = code.match(/AppState\.lang/g) || [];
console.log('AppState.lang occurrences:', matches.length);

const renderFns = code.match(/function render[A-Za-z0-9_]+/g) || [];
console.log('Total render functions:', renderFns.length);
console.log('Sample render functions:', renderFns.slice(0, 25));
