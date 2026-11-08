const fs = require('fs');
const transCode = fs.readFileSync('js/translations.js', 'utf8');
const astroCode = fs.readFileSync('js/astro-engine.js', 'utf8');
const chartsCode = fs.readFileSync('js/charts-renderer.js', 'utf8');

global.window = global;
global.document = {
  createElement: () => ({ getContext: () => ({}) }),
  getElementById: () => null
};

eval(transCode);
eval(astroCode);
eval(chartsCode);

const profile = {
  name: 'Haridass R',
  birthDate: '1988-04-30',
  birthTime: '22:10',
  place: 'Tiruvannamalai, Tamil Nadu, India',
  latitude: 12.2253,
  longitude: 79.0747,
  timezoneOffset: 5.5
};

const hData = AstroEngine.calculateHoroscope(profile);
console.log('Lagna:', hData.lagna.signId, hData.lagna.formattedDMS);
console.log('Sun:', hData.planets.Su.signId, hData.planets.Su.formattedDMS);
console.log('Moon:', hData.planets.Mo.signId, hData.planets.Mo.formattedDMS);
console.log('Mars:', hData.planets.Ma.signId, hData.planets.Ma.formattedDMS);
console.log('Jupiter:', hData.planets.Ju.signId, hData.planets.Ju.formattedDMS);
console.log('Venus:', hData.planets.Ve.signId, hData.planets.Ve.formattedDMS);
console.log('Saturn:', hData.planets.Sa.signId, hData.planets.Sa.formattedDMS, 'Retro:', hData.planets.Sa.isRetrograde);
console.log('Rahu:', hData.planets.Ra.signId, hData.planets.Ra.formattedDMS);
console.log('Ketu:', hData.planets.Ke.signId, hData.planets.Ke.formattedDMS);
console.log('Mandi:', hData.planets.Man);

const dualHtml = ChartsRenderer.renderDualJathagamKattam(hData, profile, 'ta');
console.log('HTML Length:', dualHtml.length);
console.log('Has D-1 table header:', dualHtml.includes('1. ராசி கட்டம் (D-1 Rasi Chart) கிரக நிலைகள்'));
console.log('Has D-9 table header:', dualHtml.includes('2. நவாம்ச கட்டம் (D-9 Navamsa Chart) நவாம்ச கிரக நிலைகள்'));
console.log('Has Aries conjunction:', dualHtml.includes('சூரியன், குரு, புதன் சேர்க்கை'));
console.log('Has Venus own sign:', dualHtml.includes('சுக்கிரன் சொந்த வீட்டில் (ஆட்சி)'));
console.log('Has Saturn retro note:', dualHtml.includes('லக்னம் (மூலம் 3) மற்றும் சனி (வக்ரம்*)'));
console.log('Has Mars exalted note:', dualHtml.includes('செவ்வாய் திருவோணத்தில் (உச்சம்), மாந்தி'));
console.log('Has Moon vargottama:', dualHtml.includes('ராசியிலும் துலாம், நவாம்சத்திலும் துலாம் = வர்கோத்தமம்'));
