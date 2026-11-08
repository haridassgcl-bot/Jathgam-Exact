const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const gridMatch = html.match(/id="epPillsGrid"[^>]*>([\s\S]*?)<\/div>/i);
if (!gridMatch) {
  console.error("epPillsGrid not found");
  process.exit(1);
}
const btnRegex = /<button[^>]*data-pill="([^"]+)"[^>]*>(.*?)<\/button>/g;
let match;
const pills = [];
while ((match = btnRegex.exec(gridMatch[1])) !== null) {
  pills.push({ id: match[1], label: match[2].trim() });
}
console.log('Total pills:', pills.length);
pills.forEach((p, idx) => console.log(`${idx + 1}. [${p.id}] -> ${p.label}`));

const removedList = [
  'planet_quality', 'deity', 'place_rasi', 'tamil_month',
  'vara_tyajyam', 'tithi_tyajyam', 'nakshatra_tyajyam',
  'lagna_tyajyam', 'nazhigai', 'name_comparison'
];

const stillPresent = pills.filter(p => removedList.includes(p.id));
console.log('\nAny removed pills still present?', stillPresent.length === 0 ? 'NO (All removed successfully!)' : stillPresent);
