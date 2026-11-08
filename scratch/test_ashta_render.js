const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const ids = [
  'ashtaTotalSavPoints',
  'ashtaStrongestRasi',
  'ashtaWeakestRasi',
  'ashtaGrandShodhyaPinda',
  'ashtaChakraTabBar',
  'ashtaChakraContainer',
  'ashtaMatrixTableBody',
  'ashtaShodhanaTableBody'
];

ids.forEach(id => {
  console.log(id, html.includes('id="' + id + '"'));
});
