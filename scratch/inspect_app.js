const fs = require('fs');
const txt = fs.readFileSync('./js/app.js', 'utf8');
const lines = txt.split('\n');
console.log('Total lines in app.js:', lines.length);

lines.forEach((line, i) => {
  if (line.includes('case "hora"') || line.includes('case "vara_tyajyam"') || line.includes('handlePillAction')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
});
