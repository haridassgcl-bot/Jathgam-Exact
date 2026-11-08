const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const matches = html.match(/data-i18n="[^"]+"/g) || [];
console.log('Total data-i18n matches:', matches.length);
console.log('Unique matches:', [...new Set(matches)]);
