const NumerologyEngine = require('../js/numerology-engine.js');
const res = NumerologyEngine.analyzeNumberPairs('9876543210');
console.log('Cleaned:', res.cleanedDigits);
console.log('Pairs Count:', res.sequentialPairs.length);
console.log('Compound Sum:', res.compoundSum, '-> Root Single:', res.rootSingle, res.rootTraits.planetTa);
console.log('Overall Score:', res.totalScore, '%');
console.log('Verdict:', res.verdictTitle);
res.sequentialPairs.forEach(p => {
  console.log(`[${p.pair}] -> ${p.planets} | ${p.yoga} | ${p.status} (${p.score}%) - ${p.meaning}`);
});
