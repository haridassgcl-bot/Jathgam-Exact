const AstroEngine = require('../js/astro-engine.js');
const res = AstroEngine.calculateThimbaChakra("பரணி", "சித்திரை", "சுவாதி");
console.log("Natal Body Part:", res.natalResult.bodyPart, "Slot:", res.natalResult.slot);
console.log("Transit Body Part:", res.transitResult.bodyPart, "Slot:", res.transitResult.slot);
console.log("Slots:", res.slots.length);
console.log("Slot 1 stars:", res.slots[0].groupNakshatras);
console.log("Slot 4 stars:", res.slots[3].groupNakshatras);
console.log("Slot 5 stars:", res.slots[4].groupNakshatras);
