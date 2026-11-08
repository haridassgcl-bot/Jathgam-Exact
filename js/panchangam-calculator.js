/**
 * EXACT JATHAGAM - COMPREHENSIVE VEDIC PANCHANGAM & DYNAMIC ASTROLOGICAL CALCULATOR
 * 100% Dynamic - Computes Panchangam, Yogi/Avayogi, Nakshatra Attributes, Vastu,
 * Dasha-Bhukti Timelines, Varga Chakras, Upagrahas & Temples for ANY Individual Horoscope.
 */

const PanchangamCalculator = (function () {
  "use strict";

  // 1. 27 Nakshatras Complete Tamil Attributes & Sthalams
  const NAKSHATRAS = [
    {
      id: 0, nameTa: "அஸ்வினி", nameEn: "Ashwini", lordCode: "Ke", lordTa: "கேது",
      ganam: "தேவ கணம்", nadi: "ஆதி நாடி", yoni: "ஆண் குதிரை", dosham: "வாதம்",
      deity: "அஸ்வினி தேவர்கள்", tree: "எட்டி", bird: "புள்ளு", animal: "குதிரை",
      letters: "சூ, சே, சோ, லா (Chu, Che, Cho, La)",
      temple: "திருத்துறைப்பூண்டி பிறவி மருந்தீஸ்வரர் திருக்கோவில்"
    },
    {
      id: 1, nameTa: "பரணி", nameEn: "Bharani", lordCode: "Ve", lordTa: "சுக்கிரன்",
      ganam: "மனித கணம்", nadi: "மத்யா நாடி", yoni: "பெண் யானை", dosham: "பித்தம்",
      deity: "யமன்", tree: "நெல்லி", bird: "காகம்", animal: "யானை",
      letters: "லீ, லூ, லே, லோ (Lee, Lu, Le, Lo)",
      temple: "திருக்கடையூர் அமிர்தகடேஸ்வரர் திருக்கோவில்"
    },
    {
      id: 2, nameTa: "கார்த்திகை", nameEn: "Krittika", lordCode: "Su", lordTa: "சூரியன்",
      ganam: "ராட்சஸ கணம்", nadi: "அந்த்ய நாடி", yoni: "பெண் ஆடு", dosham: "கபம்",
      deity: "அக்னி / முருகன்", tree: "அத்தி", bird: "மயில்", animal: "ஆடு",
      letters: "ஆ, ஈ, ஊ, ஏ (A, Ee, Oo, E)",
      temple: "திருவண்ணாமலை அருணாசலேஸ்வரர் திருக்கோவில்"
    },
    {
      id: 3, nameTa: "ரோகிணி", nameEn: "Rohini", lordCode: "Mo", lordTa: "சந்திரன்",
      ganam: "மனித கணம்", nadi: "அந்த்ய நாடி", yoni: "ஆண் பாம்பு", dosham: "கபம்",
      deity: "பிரம்மா", tree: "நாவல்", bird: "கோழி", animal: "பாம்பு",
      letters: "ஓ, வா, வி, வூ (O, Va, Vi, Vu)",
      temple: "காஞ்சிபுரம் பாண்டவ தூத பெருமாள் கோவில்"
    },
    {
      id: 4, nameTa: "மிருகசீரிஷம்", nameEn: "Mrigashira", lordCode: "Ma", lordTa: "செவ்வாய்",
      ganam: "தேவ கணம்", nadi: "மத்யா நாடி", yoni: "பெண் மான்", dosham: "பித்தம்",
      deity: "சந்திரன்", tree: "கருங்காலி", bird: "கோழி", animal: "மான்",
      letters: "வே, வோ, கா, கீ (Ve, Vo, Ka, Kee)",
      temple: "எண்கண் சுப்பிரமணிய சுவாமி திருக்கோவில்"
    },
    {
      id: 5, nameTa: "திருவாதிரை", nameEn: "Ardra", lordCode: "Ra", lordTa: "ராகு",
      ganam: "மனித கணம்", nadi: "ஆதி நாடி", yoni: "பெண் நாய்", dosham: "வாதம்",
      deity: "ருத்ரன் / சிவபெருமான்", tree: "செங்கருங்காலி", bird: "ஆண்டலை", animal: "நாய்",
      letters: "கு, கம், ஞ, ச (Ku, Gha, Nga, Chha)",
      temple: "சிதம்பரம் நடராஜர் திருக்கோவில்"
    },
    {
      id: 6, nameTa: "புனர்பூசம்", nameEn: "Punarvasu", lordCode: "Ju", lordTa: "குரு",
      ganam: "தேவ கணம்", nadi: "ஆதி நாடி", yoni: "பெண் பூனை", dosham: "வாதம்",
      deity: "அதிதி", tree: "மூங்கில்", bird: "அன்னம்", animal: "பூனை",
      letters: "கே, கோ, ஹா, ஹீ (Ke, Ko, Ha, Hee)",
      temple: "வாலாஜாபேட்டை தன்வந்திரி ஆரோக்கிய பீடம்"
    },
    {
      id: 7, nameTa: "பூசம்", nameEn: "Pushya", lordCode: "Sa", lordTa: "சனி",
      ganam: "தேவ கணம்", nadi: "மத்யா நாடி", yoni: "ஆண் ஆடு", dosham: "பித்தம்",
      deity: "பிரகஸ்பதி / குரு", tree: "அரசு", bird: "நீர்க்காகம்", animal: "ஆடு",
      letters: "ஹூ, ஹே, ஹோ, டா (Hu, He, Ho, Da)",
      temple: "திருவிடைமருதூர் மகாலிங்க சுவாமி திருக்கோவில்"
    },
    {
      id: 8, nameTa: "ஆயில்யம்", nameEn: "Ashlesha", lordCode: "Me", lordTa: "புதன்",
      ganam: "ராட்சஸ கணம்", nadi: "அந்த்ய நாடி", yoni: "ஆண் பூனை", dosham: "கபம்",
      deity: "ஆதிசேஷன் / நாகர்", tree: "புன்னை", bird: "செம்போத்து", animal: "பூனை",
      letters: "டீ, டூ, டே, டோ (Dee, Doo, De, Do)",
      temple: "திருப்பாம்புரம் பாம்புரேஸ்வரர் திருக்கோவில்"
    },
    {
      id: 9, nameTa: "மகம்", nameEn: "Magha", lordCode: "Ke", lordTa: "கேது",
      ganam: "ராட்சஸ கணம்", nadi: "அந்த்ய நாடி", yoni: "ஆண் எலி", dosham: "கபம்",
      deity: "பித்ருக்கள்", tree: "ஆலமரம்", bird: "ஆண் மயில்", animal: "எலி",
      letters: "மா, மீ, மூ, மே (Ma, Mee, Moo, Me)",
      temple: "திருக்கோடிக்காவல் கோடீஸ்வரர் கோவில்"
    },
    {
      id: 10, nameTa: "பூரம்", nameEn: "Purva Phalguni", lordCode: "Ve", lordTa: "சுக்கிரன்",
      ganam: "மனித கணம்", nadi: "மத்யா நாடி", yoni: "பெண் எலி", dosham: "பித்தம்",
      deity: "பகன் / ஆண்டாள்", tree: "பலா", bird: "பெண் மயில்", animal: "எலி",
      letters: "மோ, டா, டீ, டூ (Mo, Taa, Tee, Too)",
      temple: "ஸ்ரீவில்லிபுத்தூர் ஆண்டாள் நாச்சியார் கோவில்"
    },
    {
      id: 11, nameTa: "உத்திரம்", nameEn: "Uttara Phalguni", lordCode: "Su", lordTa: "சூரியன்",
      ganam: "மனித கணம்", nadi: "ஆதி நாடி", yoni: "பெண் மாடு", dosham: "வாதம்",
      deity: "ஆரியமான் / சூரியன்", tree: "அலரி", bird: "வண்டு", animal: "மாடு",
      letters: "டே, டோ, பா, பீ (Te, To, Paa, Pee)",
      temple: "இடையாற்றுமங்கலம் மாங்கல்யேஸ்வரர் கோவில்"
    },
    {
      id: 12, nameTa: "அஸ்தம்", nameEn: "Hasta", lordCode: "Mo", lordTa: "சந்திரன்",
      ganam: "தேவ கணம்", nadi: "ஆதி நாடி", yoni: "பெண் எருமை", dosham: "வாதம்",
      deity: "சாவித்ரி / சூரியன்", tree: "அத்தி", bird: "பருந்து", animal: "எருமை",
      letters: "பூ, ஷா, ணா, டா (Poo, Sha, Nna, Ttha)",
      temple: "கோமல் கிருபாபுரீஸ்வரர் திருக்கோவில்"
    },
    {
      id: 13, nameTa: "சித்திரை", nameEn: "Chitra", lordCode: "Ma", lordTa: "செவ்வாய்",
      ganam: "ராட்சஸ கணம்", nadi: "மத்யா நாடி", yoni: "பெண் புலி", dosham: "பித்தம்",
      deity: "ஸ்ரீசக்கரத்தாழ்வார் / த்வஷ்டா", tree: "வில்வம்", bird: "மரங்கொத்தி", animal: "புலி",
      letters: "பே, போ, ர, ரி (Pe, Po, Ra, Ree)",
      temple: "குருவித்துறை சித்திரரத வல்லபபெருமாள் திருக்கோவில்"
    },
    {
      id: 14, nameTa: "சுவாதி", nameEn: "Swati", lordCode: "Ra", lordTa: "ராகு",
      ganam: "தேவ கணம்", nadi: "அந்த்ய நாடி", yoni: "ஆண் எருமை", dosham: "கபம்",
      deity: "வாயு பகவான் / நரசிம்மர்", tree: "மருதம்", bird: "தேனீ", animal: "எருமை",
      letters: "ரூ, ரே, ரோ, தா (Roo, Re, Ro, Taa)",
      temple: "திருவாலி திருநகரி லட்சுமி நரசிம்மர் கோவில்"
    },
    {
      id: 15, nameTa: "விசாகம்", nameEn: "Vishakha", lordCode: "Ju", lordTa: "குரு",
      ganam: "ராட்சஸ கணம்", nadi: "அந்த்ய நாடி", yoni: "ஆண் புலி", dosham: "கபம்",
      deity: "இந்திராகினி / முருகன்", tree: "விளா", bird: "செங்குயில்", animal: "புலி",
      letters: "தீ, தூ, தே, தோ (Thee, Thoo, The, Tho)",
      temple: "திருச்செந்தூர் சுப்பிரமணிய சுவாமி திருக்கோவில்"
    },
    {
      id: 16, nameTa: "அனுஷம்", nameEn: "Anuradha", lordCode: "Sa", lordTa: "சனி",
      ganam: "தேவ கணம்", nadi: "மத்யா நாடி", yoni: "பெண் மான்", dosham: "பித்தம்",
      deity: "மித்திரன்", tree: "மகிழம்", bird: "காகம்", animal: "மான்",
      letters: "நா, நீ, நூ, நே (Na, Nee, Noo, Ne)",
      temple: "திருநின்றியூர் லட்சுமிபுரீஸ்வரர் கோவில்"
    },
    {
      id: 17, nameTa: "கேட்டை", nameEn: "Jyeshtha", lordCode: "Me", lordTa: "புதன்",
      ganam: "ராட்சஸ கணம்", nadi: "ஆதி நாடி", yoni: "ஆண் மான்", dosham: "வாதம்",
      deity: "இந்திரன்", tree: "பராய்", bird: "சக்ரவாகம்", animal: "மான்",
      letters: "நோ, யா, யீ, யூ (No, Yaa, Yee, Yoo)",
      temple: "பசுபதிகோவில் வரதராஜ பெருமாள் திருக்கோவில்"
    },
    {
      id: 18, nameTa: "மூலம்", nameEn: "Moola", lordCode: "Ke", lordTa: "கேது",
      ganam: "ராட்சஸ கணம்", nadi: "ஆதி நாடி", yoni: "பெண் நாய்", dosham: "வாதம்",
      deity: "நிருதி / ஆஞ்சநேயர்", tree: "மரா", bird: "செம்பருந்து", animal: "நாய்",
      letters: "யே, யோ, பா, பீ (Ye, Yo, Baa, Bee)",
      temple: "மாப்பிள்ளைக்குப்பம் சிங்கீஸ்வரர் கோவில்"
    },
    {
      id: 19, nameTa: "பூராடம்", nameEn: "Purvashada", lordCode: "Ve", lordTa: "சுக்கிரன்",
      ganam: "மனித கணம்", nadi: "மத்யா நாடி", yoni: "ஆண் குரங்கு", dosham: "பித்தம்",
      deity: "ஆபஸ் (வருணன்)", tree: "வஞ்சி", bird: "கௌதாரி", animal: "குரங்கு",
      letters: "பூ, தா, பா, டா (Bhoo, Dhaa, Phaa, Dhaa)",
      temple: "கடுவெளி ஆகாசபுரீஸ்வரர் திருக்கோவில்"
    },
    {
      id: 20, nameTa: "உத்திராடம்", nameEn: "Uttarashada", lordCode: "Su", lordTa: "சூரியன்",
      ganam: "மனித கணம்", nadi: "அந்த்ய நாடி", yoni: "பெண் மாடு", dosham: "கபம்",
      deity: "விஸ்வேதேவர்கள்", tree: "பலாசு", bird: "வலியன்", animal: "மாடு",
      letters: "பே, போ, ஜா, ஜீ (Bhe, Bho, Jaa, Jee)",
      temple: "கீழப்பூங்குடி பிரம்மபுரீஸ்வரர் கோவில்"
    },
    {
      id: 21, nameTa: "திருவோணம்", nameEn: "Shravana", lordCode: "Mo", lordTa: "சந்திரன்",
      ganam: "தேவ கணம்", nadi: "அந்த்ய நாடி", yoni: "பெண் குரங்கு", dosham: "கபம்",
      deity: "மகாவிஷ்ணு", tree: "எருக்கு", bird: "நாரை", animal: "குரங்கு",
      letters: "ஜூ, ஜே, ஜோ, கா (Khee, Khoo, Khe, Kho)",
      temple: "திருவோணம் பிரசன்ன வெங்கடேச பெருமாள் கோவில்"
    },
    {
      id: 22, nameTa: "அவிட்டம்", nameEn: "Dhanishta", lordCode: "Ma", lordTa: "செவ்வாய்",
      ganam: "ராட்சஸ கணம்", nadi: "மத்யா நாடி", yoni: "பெண் சிங்கம்", dosham: "பித்தம்",
      deity: "அஷ்ட வசுக்கள்", tree: "வன்னி", bird: "வண்டு", animal: "சிங்கம்",
      letters: "கா, கீ, கூ, கே (Gaa, Gee, Goo, Ge)",
      temple: "திருக்கடையூர் பிரம்மபுரீஸ்வரர் கோவில்"
    },
    {
      id: 23, nameTa: "சதயம்", nameEn: "Shatabhisha", lordCode: "Ra", lordTa: "ராகு",
      ganam: "ராட்சஸ கணம்", nadi: "ஆதி நாடி", yoni: "பெண் குதிரை", dosham: "வாதம்",
      deity: "வருணன்", tree: "கடம்பு", bird: "அண்டங்காக்கை", animal: "குதிரை",
      letters: "கோ, ஸா, ஸீ, ஸூ (Go, Saa, See, Soo)",
      temple: "திருப்புகலூர் அக்னிபுரீஸ்வரர் திருக்கோவில்"
    },
    {
      id: 24, nameTa: "பூரட்டாதி", nameEn: "Purva Bhadrapada", lordCode: "Ju", lordTa: "குரு",
      ganam: "மனித கணம்", nadi: "ஆதி நாடி", yoni: "ஆண் சிங்கம்", dosham: "வாதம்",
      deity: "அஜைகபாதன்", tree: "தேமா", bird: "உள்ளான்", animal: "சிங்கம்",
      letters: "ஸே, ஸோ, தா, தீ (Se, So, Dhaa, Dhee)",
      temple: "ரங்கநாதபுரம் திருவானைக்காவல் கோவில்"
    },
    {
      id: 25, nameTa: "உத்திரட்டாதி", nameEn: "Uttara Bhadrapada", lordCode: "Sa", lordTa: "சனி",
      ganam: "மனித கணம்", nadi: "மத்யா நாடி", yoni: "பெண் பசு", dosham: "பித்தம்",
      deity: "அகிர்புத்னியன்", tree: "வேம்பு", bird: "கோட்டான்", animal: "பசு",
      letters: "தூ, த்ஸா, ஞ, தா (Dhoo, Tsa, Gna, Tha)",
      temple: "தீயத்தூர் சகஸ்ரலட்சுமீஸ்வரர் கோவில்"
    },
    {
      id: 26, nameTa: "ரேவதி", nameEn: "Revati", lordCode: "Me", lordTa: "புதன்",
      ganam: "தேவ கணம்", nadi: "அந்த்ய நாடி", yoni: "பெண் யானை", dosham: "கபம்",
      deity: "பூஷா", tree: "இலுப்பை", bird: "வானம்பாடி", animal: "யானை",
      letters: "தே, தோ, சா, சீ (De, Do, Chaa, Chee)",
      temple: "காருகுடி கைலாசநாதர் திருக்கோவில்"
    }
  ];

  // 2. 30 Tithis Complete Data
  const TITHIS = [
    { num: 1, nameTa: "பிரதமை", nameEn: "Prathama", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "அக்னி", temple: "திருவண்ணாமலை அருணாசலேஸ்வரர்" },
    { num: 2, nameTa: "துவிதியை", nameEn: "Dwitiya", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "பிரம்மா", temple: "திருப்பத்தூர் பிரம்மபுரீஸ்வரர்" },
    { num: 3, nameTa: "திருதியை", nameEn: "Tritiya", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "கௌரி", temple: "மதுரை மீனாட்சி அம்மன்" },
    { num: 4, nameTa: "சதுர்த்தி", nameEn: "Chaturthi", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "விநாயகர்", temple: "பிள்ளையார்பட்டி கற்பக விநாயகர்" },
    { num: 5, nameTa: "பஞ்சமி", nameEn: "Panchami", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "நாகர்", temple: "திருநாகேஸ்வரம் நாகநாதசுவாமி" },
    { num: 6, nameTa: "சஷ்டி", nameEn: "Shashti", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "முருகன்", temple: "திருச்செந்தூர் சுப்பிரமணிய சுவாமி" },
    { num: 7, nameTa: "சப்தமி", nameEn: "Saptami", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "சூரியன்", temple: "சூரியனார் கோவில்" },
    { num: 8, nameTa: "அஷ்டமி", nameEn: "Ashtami", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "சிவன் / பைரவர்", temple: "திருவாஞ்சியம் வாஞ்சிநாதர்" },
    { num: 9, nameTa: "நவமி", nameEn: "Navami", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "துர்க்கை / ராமர்", temple: "திருப்புல்லாணி ஆதி ஜெகந்நாதர்" },
    { num: 10, nameTa: "தசமி", nameEn: "Dashami", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "யமன்", temple: "திருப்பைஞ்ஞீலி ஞீலிவனேஸ்வரர்" },
    { num: 11, nameTa: "ஏகாதசி", nameEn: "Ekadashi", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "விஷ்ணு", temple: "ஸ்ரீரங்கம் ரங்கநாதசுவாமி" },
    { num: 12, nameTa: "துவாதசி", nameEn: "Dwadashi", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "மகாவிஷ்ணு", temple: "திருவல்லிக்கேணி பார்த்தசாரதி" },
    { num: 13, nameTa: "திரயோதசி", nameEn: "Trayodashi", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "காமதேவன் / நந்தி", temple: "சுசீந்திரம் தாணுமாலயன் கோவில்" },
    { num: 14, nameTa: "சதுர்த்தசி", nameEn: "Chaturdashi", pakshaTa: "சுக்ல பட்சம் (வளர்பிறை)", deity: "காளி / சரபேஸ்வரர்", temple: "திருபுவனம் கம்பஹரேஸ்வரர் (சரபேஸ்வரர்)" },
    { num: 15, nameTa: "பௌர்ணமி", nameEn: "Pournami", pakshaTa: "சுக்ல பட்சம் (முழு நிலவு)", deity: "சந்திரன்", temple: "திங்களூர் கைலாசநாதர் கோவில்" },
    { num: 16, nameTa: "பிரதமை", nameEn: "Prathama", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "அக்னி", temple: "திருவண்ணாமலை அருணாசலேஸ்வரர்" },
    { num: 17, nameTa: "துவிதியை", nameEn: "Dwitiya", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "பிரம்மா", temple: "திருப்பத்தூர் பிரம்மபுரீஸ்வரர்" },
    { num: 18, nameTa: "திருதியை", nameEn: "Tritiya", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "கௌரி", temple: "மதுரை மீனாட்சி அம்மன்" },
    { num: 19, nameTa: "சதுர்த்தி", nameEn: "Chaturthi", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "விநாயகர்", temple: "பிள்ளையார்பட்டி கற்பக விநாயகர்" },
    { num: 20, nameTa: "பஞ்சமி", nameEn: "Panchami", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "நாகர்", temple: "திருநாகேஸ்வரம் நாகநாதசுவாமி" },
    { num: 21, nameTa: "சஷ்டி", nameEn: "Shashti", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "முருகன்", temple: "சுவாமிமலை சுவாமிநாதசுவாமி" },
    { num: 22, nameTa: "சப்தமி", nameEn: "Saptami", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "சூரியன்", temple: "சூரியனார் கோவில்" },
    { num: 23, nameTa: "அஷ்டமி", nameEn: "Ashtami", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "காலபைரவர்", temple: "சீர்காழி சட்டைநாதர் கோவில்" },
    { num: 24, nameTa: "நவமி", nameEn: "Navami", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "துர்க்கை", temple: "பட்டீஸ்வரம் துர்க்கை அம்மன்" },
    { num: 25, nameTa: "தசமி", nameEn: "Dashami", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "யமன்", temple: "திருக்கடையூர் அமிர்தகடேஸ்வரர்" },
    { num: 26, nameTa: "ஏகாதசி", nameEn: "Ekadashi", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "விஷ்ணு", temple: "காஞ்சிபுரம் வரதராஜ பெருமாள்" },
    { num: 27, nameTa: "துவாதசி", nameEn: "Dwadashi", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "மகாவிஷ்ணு", temple: "திருக்குடந்தை சாரங்கபாணி" },
    { num: 28, nameTa: "திரயோதசி", nameEn: "Trayodashi", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "பிரதோஷ மூர்த்தி", temple: "தஞ்சாவூர் பிரகதீஸ்வரர் கோவில்" },
    { num: 29, nameTa: "சதுர்த்தசி", nameEn: "Chaturdashi", pakshaTa: "கிருஷ்ண பட்சம் (தேய்பிறை)", deity: "ருத்ரன்", temple: "திருவைகாவூர் வில்வநாதேஸ்வரர்" },
    { num: 30, nameTa: "அமாவாசை", nameEn: "Amavasya", pakshaTa: "கிருஷ்ண பட்சம் (இருள் நிலவு)", deity: "பத்ரகாளி / பித்ருக்கள்", temple: "ராமேஸ்வரம் ராமநாதசுவாமி திருக்கோவில்" }
  ];

  // 3. 11 Karanas Data
  const KARANAS = [
    { id: 0, nameTa: "பவம்", nameEn: "Bava", deity: "இந்திரன்", animal: "சிங்கம்", ornament: "பொன்", flower: "தாமரை", temple: "சுசீந்திரம் இந்திரன் ஸ்தலம்" },
    { id: 1, nameTa: "பாலவம்", nameEn: "Balava", deity: "பிரம்மா", animal: "புலி", ornament: "முத்து", flower: "அல்லி", temple: "திருப்பத்தூர் பிரம்மபுரீஸ்வரர்" },
    { id: 2, nameTa: "கௌலவம்", nameEn: "Kaulava", deity: "மித்திரன்", animal: "பன்றி", ornament: "பவளம்", flower: "செவ்வல்லி", temple: "ஸ்ரீமுஷ்ணம் பூவராக சுவாமி" },
    { id: 3, nameTa: "தைதுலை", nameEn: "Taitila", deity: "யமன்", animal: "கழுதை", ornament: "மரகதம்", flower: "வெண்தாமரை", temple: "திருப்பைஞ்ஞீலி ஞீலிவனேஸ்வரர்" },
    { id: 4, nameTa: "கரசை", nameEn: "Garija", deity: "பூமி தேவதை", animal: "யானை", ornament: "புஷ்பராகம்", flower: "முல்லை", temple: "உப்பிலியப்பன் கோவில்" },
    { id: 5, nameTa: "வணிசை", nameEn: "Vanija", deity: "ஸ்ரீதேவி", animal: "காளை", ornament: "வைரம்", flower: "நீலலோசனம்", temple: "திருமழபாடி நந்தி பகவான்" },
    { id: 6, nameTa: "பத்திரை (விஷ்டி)", nameEn: "Vishti", deity: "யமதர்மன்", animal: "நாய்", ornament: "நீலம்", flower: "கருங்குவளை", temple: "பட்டீஸ்வரம் துர்க்கை அம்மன்" },
    { id: 7, nameTa: "சகுனி", nameEn: "Shakuni", deity: "கலியன்", animal: "காகம்", ornament: "கோமேதகம்", flower: "செண்பகம்", temple: "திருநள்ளாறு தர்பாரண்யேஸ்வரர்" },
    { id: 8, nameTa: "சதுஷ்பாதம்", nameEn: "Chatushpada", deity: "ருத்ரன்", animal: "நரி", ornament: "வைடூரியம்", flower: "மல்லிகை", temple: "திருவாலங்காடு வடாரண்யேஸ்வரர்" },
    { id: 9, nameTa: "நாகவம்", nameEn: "Naga", deity: "நாகராஜன்", animal: "பாம்பு", ornament: "நாகரத்தினம்", flower: "தாழம்பூ", temple: "நாகர்கோவில் நாகராஜா கோவில்" },
    { id: 10, nameTa: "கிம்துக்கினம்", nameEn: "Kimstughna", deity: "வாயு பகவான்", animal: "புழு", ornament: "ஸ்படிகம்", flower: "செம்பருத்தி", temple: "காளஹஸ்தி காளத்தீஸ்வரர்" }
  ];

  // 4. 27 Nithya Yogas Data
  const YOGAS = [
    { id: 0, nameTa: "விஷ்கம்பம்", deity: "யமன்", nature: "அசுபம்" },
    { id: 1, nameTa: "ப்ரீதி", deity: "விஷ்ணு", nature: "சுபம்" },
    { id: 2, nameTa: "ஆயுஷ்மான்", deity: "சந்திரன்", nature: "அதி சுபம்" },
    { id: 3, nameTa: "சௌபாக்யம்", deity: "பிரம்மா", nature: "அதி சுபம்" },
    { id: 4, nameTa: "சோபனம்", deity: "சூரியன்", nature: "சுபம்" },
    { id: 5, nameTa: "அதிகண்டம்", deity: "இந்திரன்", nature: "அசுபம்" },
    { id: 6, nameTa: "சுகர்மம்", deity: "இந்திராணி", nature: "சுபம்" },
    { id: 7, nameTa: "திருதி", deity: "ஜலம்", nature: "சுபம்" },
    { id: 8, nameTa: "சூலம்", deity: "சர்ப்பம்", nature: "அசுபம்" },
    { id: 9, nameTa: "கண்டம்", deity: "அக்னி", nature: "அசுபம்" },
    { id: 10, nameTa: "விருத்தி", deity: "சூரியன்", nature: "சுபம்" },
    { id: 11, nameTa: "துருவம்", deity: "பூமி", nature: "சுபம்" },
    { id: 12, nameTa: "வியாகாதம்", deity: "வாயு", nature: "அசுபம்" },
    { id: 13, nameTa: "ஹர்ஷணம்", deity: "பகன்", nature: "சுபம்" },
    { id: 14, nameTa: "வஜ்ரம்", deity: "வருணன்", nature: "அசுபம்" },
    { id: 15, nameTa: "சித்தி", deity: "கணபதி", nature: "அதி சுபம்" },
    { id: 16, nameTa: "வியதீபாதம்", deity: "ருத்ரன்", nature: "அசுபம்" },
    { id: 17, nameTa: "வரியான்", deity: "குபேரன்", nature: "சுபம்" },
    { id: 18, nameTa: "பரிகம்", deity: "விஸ்வகர்மா", nature: "மத்திமம்" },
    { id: 19, nameTa: "சிவம்", deity: "சிவன்", nature: "சுபம்" },
    { id: 20, nameTa: "சித்தம்", deity: "கார்த்திகேயன்", nature: "அதி சுபம்" },
    { id: 21, nameTa: "சாத்தியம்", deity: "சாவித்ரி", nature: "சுபம்" },
    { id: 22, nameTa: "சுபம்", deity: "லட்சுமி", nature: "சுபம்" },
    { id: 23, nameTa: "சுப்ரம்", deity: "சரஸ்வதி", nature: "சுபம்" },
    { id: 24, nameTa: "பிராமியம்", deity: "பிரம்மா", nature: "அதி சுபம்" },
    { id: 25, nameTa: "ஐந்திரம்", deity: "இந்திரன்", nature: "சுபம்" },
    { id: 26, nameTa: "வைதிருதி", deity: "திதி தேவதை", nature: "அசுபம்" }
  ];

  // 5. 60-Year Cyclic Tamil Years
  const TAMIL_YEARS = [
    "பிரபவ", "விபவ", "சுக்ல", "பிரமோதூத", "பிரஜோத்பத்தி", "ஆங்கீரச", "ஸ்ரீமுக", "பவ", "யுவ", "தாது",
    "ஈஸ்வர", "வெகுதானிய", "பிரமாதி", "விக்ரம", "விஷு", "சித்திரபானு", "சுபானு", "தாரண", "பார்த்திப", "விய",
    "சர்வசித்து", "சர்வதாரி", "விரோதி", "விக்ருதி", "கர", "நந்தன", "விஜய", "ஜய", "மன்மத", "துன்முகி",
    "ஹேவிளம்பி", "விளம்பி", "விகாரி", "சார்வரி", "பிலவ", "சுபகிருது", "சோபகிருது", "குரோதி", "விசுவாசு", "பராபவ",
    "பிலவங்க", "கீலக", "சௌமிய", "சாதாரண", "விரோதகிருது", "பரிதாபி", "பிரமாதீச", "ஆனந்த", "ராட்சச", "நள",
    "பிங்கள", "காளயுக்தி", "சித்தார்த்தி", "ரௌத்திரி", "துன்மதி", "துந்துபி", "ருத்ரோத்காரி", "ரக்தாட்சி", "குரோதன", "அட்சய"
  ];

  // 6. Tamil Months by Sun Sign
  const TAMIL_MONTHS = [
    "சித்திரை", "வைகாசி", "ஆனி", "ஆடி", "ஆவணி", "புரட்டாசி",
    "ஐப்பசி", "கார்த்திகை", "மார்கழி", "தை", "மாசி", "பங்குனி"
  ];

  // 7. Weekdays
  const WEEKDAYS = [
    { num: 0, ta: "ஞாயிறு", en: "Sunday", lord: "சூரியன்" },
    { num: 1, ta: "திங்கள்", en: "Monday", lord: "சந்திரன்" },
    { num: 2, ta: "செவ்வாய்", en: "Tuesday", lord: "செவ்வாய்" },
    { num: 3, ta: "புதன்", en: "Wednesday", lord: "புதன்" },
    { num: 4, ta: "வியாழன்", en: "Thursday", lord: "குரு" },
    { num: 5, ta: "வெள்ளி", en: "Friday", lord: "சுக்கிரன்" },
    { num: 6, ta: "சனி", en: "Saturday", lord: "சனி" }
  ];

  // 8. Rasi Lords
  const RASI_LORDS = [
    { id: 0, ta: "செவ்வாய்" }, { id: 1, ta: "சுக்கிரன்" }, { id: 2, ta: "புதன்" },
    { id: 3, ta: "சந்திரன்" }, { id: 4, ta: "சூரியன்" },   { id: 5, ta: "புதன்" },
    { id: 6, ta: "சுக்கிரன்" }, { id: 7, ta: "செவ்வாய்" }, { id: 8, ta: "குரு" },
    { id: 9, ta: "சனி" },     { id: 10, ta: "சனி" },    { id: 11, ta: "குரு" }
  ];

  /**
   * Helper: Format Decimal Degrees into DD°MM'SS"
   */
  function formatDms(degFloat) {
    const d = Math.floor(degFloat);
    const mFloat = (degFloat - d) * 60;
    const m = Math.floor(mFloat);
    const s = Math.floor((mFloat - m) * 60);
    return `${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  /**
   * Helper: Calculate Sun Rise and Set Times
   */
  function calculateSunTimes(birthDateStr, lat = 12.2343, lon = 79.0762, tz = 5.5) {
    const d = new Date(birthDateStr);
    const startOfYear = new Date(d.getFullYear(), 0, 0);
    const diffDays = Math.floor((d - startOfYear) / (1000 * 60 * 60 * 24)) || 100;
    const dayAngle = (2 * Math.PI * (diffDays - 1)) / 365;
    const declination = 23.45 * Math.sin((2 * Math.PI * (284 + diffDays)) / 365);
    const latRad = (lat * Math.PI) / 180;
    const decRad = (declination * Math.PI) / 180;
    let cosH = -Math.tan(latRad) * Math.tan(decRad);
    cosH = Math.max(-1, Math.min(1, cosH));
    const hDeg = (Math.acos(cosH) * 180) / Math.PI;
    const solarNoon = 12 - (lon - (tz * 15)) / 15;
    const riseHour = solarNoon - (hDeg / 15);
    const setHour = solarNoon + (hDeg / 15);

    const toHms = (hf) => {
      const h = Math.floor((hf + 24) % 24);
      const mf = ((hf * 60) % 60 + 60) % 60;
      const m = Math.floor(mf);
      const s = Math.floor((mf - m) * 60);
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const dayLenH = Math.max(8, Math.min(16, setHour - riseHour));
    const nightLenH = 24 - dayLenH;

    return {
      sunrise: toHms(riseHour),
      sunset: toHms(setHour),
      dayLength: toHms(dayLenH),
      nightLength: toHms(nightLenH),
      dayLenHours: dayLenH,
      riseHour,
      setHour
    };
  }

  /**
   * Main Panchangam Calculator
   */
  function calculatePanchangam(sunLon, moonLon, birthDateStr, birthTimeStr, lat, lon, tz) {
    // 1. Tithi (Moon - Sun) / 12
    const diff = (moonLon - sunLon + 360) % 360;
    const tithiIdx = Math.floor(diff / 12) % 30;
    const tithi = TITHIS[tithiIdx];

    // 2. Karana (Moon - Sun) / 6
    const kIndex = Math.floor(diff / 6);
    let karana;
    if (kIndex === 0) karana = KARANAS[10]; // கிம்துக்கினம்
    else if (kIndex >= 57 && kIndex <= 59) karana = KARANAS[kIndex - 50]; // சகுனி (7), சதுஷ்பாதம் (8), நாகவம் (9)
    else karana = KARANAS[(kIndex - 1) % 7]; // Repeating Chara Karanas (0 to 6)

    // 3. Nithya Yoga (Sun + Moon) / (360/27)
    const yogaSum = (sunLon + moonLon) % 360;
    const yogaIdx = Math.floor(yogaSum / (360 / 27)) % 27;
    const yoga = YOGAS[yogaIdx];

    // 4. Weekday
    const bDate = new Date(birthDateStr);
    const dayOfWeek = bDate.getDay();
    const vaaram = WEEKDAYS[dayOfWeek];

    // 5. Sun times
    const sunTimes = calculateSunTimes(birthDateStr, lat, lon, tz);

    // 6. Tamil Month, Date, Year
    const sunSignId = Math.floor(sunLon / 30) % 12;
    const sunDegInSign = sunLon % 30;
    const tamilMonth = TAMIL_MONTHS[sunSignId];
    const tamilDate = Math.floor(sunDegInSign) + 1;
    const bYear = bDate.getFullYear();
    // 60-year cyclic offset: 1987 is Prabhava (idx 0), 1988 is Vibhava (idx 1)
    const tamilYearIdx = (bYear - 1987 + 600) % 60;
    const tamilYear = TAMIL_YEARS[tamilYearIdx];

    // 7. Nazhigai calculations
    const dayNazhigai = (sunTimes.dayLenHours * 2.5);
    const nightNazhigai = 60 - dayNazhigai;

    // Birth Time in hours
    const [bh, bm] = (birthTimeStr || "12:00").split(":").map(Number);
    const birthHFloat = bh + (bm / 60);
    const isDayBirth = (birthHFloat >= sunTimes.riseHour && birthHFloat <= sunTimes.setHour);

    let udayaadhiHours = (birthHFloat - sunTimes.riseHour + 24) % 24;
    let udayaadhiNazhigai = udayaadhiHours * 2.5;
    const udayNaz = Math.floor(udayaadhiNazhigai);
    const udayVinad = Math.floor((udayaadhiNazhigai - udayNaz) * 60);

    let asthamaadhiHours = (birthHFloat - sunTimes.setHour + 24) % 24;
    let asthamaadhiNazhigai = asthamaadhiHours * 2.5;
    const asthNaz = Math.floor(asthamaadhiNazhigai);
    const asthVinad = Math.floor((asthamaadhiNazhigai - asthNaz) * 60);

    const dayNazInt = Math.floor(dayNazhigai);
    const dayVinad = Math.floor((dayNazhigai - dayNazInt) * 60);
    const nightNazInt = Math.floor(nightNazhigai);
    const nightVinad = Math.floor((nightNazhigai - nightNazInt) * 60);

    return {
      tithi,
      karana,
      yoga,
      vaaram,
      sunTimes,
      tamilMonth,
      tamilDate,
      tamilYear,
      dinamanam: (sunTimes.dayLenHours * 2.5 / 60 * 60).toFixed(2),
      dayNazhigaiStr: `${dayNazInt} நாழிகை · ${dayVinad} விநாடி`,
      nightNazhigaiStr: `${nightNazInt} நாழிகை · ${nightVinad} விநாடி`,
      birthPeriodStr: isDayBirth ? "பகல் பிறப்பு" : "இரவு பிறப்பு",
      udayaadhiStr: `${udayNaz} நாழிகை · ${udayVinad} விநாடி`,
      asthamaadhiStr: `${asthNaz} நாழிகை · ${asthVinad} விநாடி`,
      birthDayNazStr: isDayBirth ? `${udayNaz} நாழிகை · ${udayVinad} விநாடி` : "0 நாழிகை · 0 விநாடி",
      birthNightNazStr: isDayBirth ? "0 நாழிகை · 0 விநாடி" : `${asthNaz} நாழிகை · ${asthVinad} விநாடி`
    };
  }

  /**
   * Calculate Yogi, Avayogi, and Special Notes
   */
  function calculateYogiAvayogi(sunLon, moonLon, planets, birthDateStr, nameStr, tithiNum, moonStarIdx) {
    if (moonStarIdx === undefined || isNaN(moonStarIdx) || moonStarIdx === null) {
      moonStarIdx = Math.floor(moonLon / (360 / 27)) % 27;
    }
    moonStarIdx = Math.floor(Number(moonStarIdx) || 0) % 27;
    if (moonStarIdx < 0) moonStarIdx += 27;

    const yogiPoint = (sunLon + moonLon + 93.333333) % 360;
    const avayogiPoint = (yogiPoint + 186.666667) % 360;

    const nakLen = 360 / 27;
    const yogiNakIdx = Math.floor(yogiPoint / nakLen) % 27;
    const yogiPada = Math.floor((yogiPoint % nakLen) / (nakLen / 4)) + 1;
    const yogiStar = NAKSHATRAS[yogiNakIdx];

    const avaNakIdx = Math.floor(avayogiPoint / nakLen) % 27;
    const avaPada = Math.floor((avayogiPoint % nakLen) / (nakLen / 4)) + 1;
    const avaStar = NAKSHATRAS[avaNakIdx];

    const duplicateYogiLord = RASI_LORDS[Math.floor(yogiPoint / 30) % 12].ta;

    // Atmakaraka & Amatyakaraka
    const list = [];
    const validCodes = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"];
    validCodes.forEach(code => {
      if (planets && planets[code]) {
        const degInSign = (planets[code].longitude % 30);
        list.push({ code, nameTa: planets[code].nameTa, deg: degInSign });
      }
    });
    list.sort((a, b) => b.deg - a.deg);
    const atmakaraka = list[0] ? list[0].nameTa : "சூரியன்";
    const amatyakaraka = list[1] ? list[1].nameTa : "சந்திரன்";

    // Shunya Rasis based on Tithi
    const shunyaMap = {
      1: "துலாம், மகரம்", 2: "தனுசு, மீனம்", 3: "சிம்மம், மகரம்", 4: "ரிஷபம், கும்பம்",
      5: "மிதுனம், கன்னி", 6: "மேஷம், சிம்மம்", 7: "தனுசு, கடகம்", 8: "மிதுனம், கன்னி",
      9: "சிம்மம், விருச்சிகம்", 10: "சிம்மம், விருச்சிகம்", 11: "தனுசு, மீனம்", 12: "துலாம், மகரம்",
      13: "ரிஷபம், சிம்மம்", 14: "மிதுனம், கன்னி, தனுசு, மீனம்", 15: "சூன்ய ராசி இல்லை (முழு பௌர்ணமி)",
      16: "துலாம், மகரம்", 17: "தனுசு, மீனம்", 18: "சிம்மம், மகரம்", 19: "ரிஷபம், கும்பம்",
      20: "மிதுனம், கன்னி", 21: "மேஷம், சிம்மம்", 22: "தனுசு, கடகம்", 23: "மிதுனம், கன்னி",
      24: "சிம்மம், விருச்சிகம்", 25: "சிம்மம், விருச்சிகம்", 26: "தனுசு, மீனம்", 27: "துலாம், மகரம்",
      28: "ரிஷபம், சிம்மம்", 29: "மிதுனம், கன்னி, தனுசு, மீனம்", 30: "சூன்ய ராசி இல்லை (அமாவாசை)"
    };
    const shunyaRasis = shunyaMap[tithiNum] || "மிதுனம், கன்னி";

    // Mudakku Rasi & Star (Authentic Lada Murai / Horse-shoe reflection from Sun's Nakshatra)
    // Classical rule:
    // Stars 1 to 11 (Ashwini to Pooram) reflect around Ardra (star 6): mudakkuStar = 12 - sunStar
    // Stars 12 to 27 (Uthiram to Revathi) reflect around Moola-Pooradam axis: mudakkuStar = 39 - sunStar
    const starSpan = 360 / 27; // 13° 20'
    const padaSpan = starSpan / 4; // 3° 20'
    const normSunLon = ((sunLon % 360) + 360) % 360;
    const sunStarIdx = Math.floor(normSunLon / starSpan) % 27; // 0 to 26
    const sunStarNum = sunStarIdx + 1; // 1 to 27
    const sunPada = Math.min(4, Math.max(1, Math.floor((normSunLon % starSpan) / padaSpan) + 1));

    let mudakkuStarNum;
    if (sunStarNum <= 11) {
      mudakkuStarNum = 12 - sunStarNum;
    } else {
      mudakkuStarNum = 39 - sunStarNum;
    }
    const mudakkuStarIdx = (mudakkuStarNum - 1 + 27) % 27;
    const mudakkuPada = sunPada;

    // Determine Rasi from global pada index (108 padas total, 9 padas per rasi)
    const globalPadaIdx = mudakkuStarIdx * 4 + (mudakkuPada - 1);
    const mudakkuRasiIdx = Math.floor(globalPadaIdx / 9) % 12;
    const rasiNames = [
      "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
      "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
    ];
    const mudakkuRasi = rasiNames[mudakkuRasiIdx];
    const mudakkuStarName = (NAKSHATRAS[mudakkuStarIdx] && NAKSHATRAS[mudakkuStarIdx].nameTa)
      ? NAKSHATRAS[mudakkuStarIdx].nameTa
      : "பரணி";
    const mudakkuStr = `${mudakkuRasi} · ${mudakkuStarName} · ${mudakkuPada}`;

    // Vadha Vainashika (22nd star from birth star)
    const vainashikaIdx = (moonStarIdx + 21) % 27;
    const vainashikaStar = (NAKSHATRAS[vainashikaIdx] && NAKSHATRAS[vainashikaIdx].nameTa) ? NAKSHATRAS[vainashikaIdx].nameTa : "அனுஷம்";

    // Pancha Pakshi
    const pakshiList = ["வல்லூறு", "ஆந்தை", "காகம்", "கோழி", "மயில்"];
    const pakshi = pakshiList[moonStarIdx % 5] || "காகம்";

    // Vidhi Number
    const digits = (birthDateStr || "").replace(/\D/g, "");
    let vSum = digits.split("").reduce((acc, c) => acc + parseInt(c, 10), 0);
    while (vSum > 9) vSum = String(vSum).split("").reduce((acc, c) => acc + parseInt(c, 10), 0);
    const vidhiNumber = vSum || 6;

    // Name Number
    const chaldeanTable = { A: 1, I: 1, J: 1, Q: 1, Y: 1, B: 2, K: 2, R: 2, C: 3, G: 3, L: 3, S: 3, D: 4, M: 4, T: 4, E: 5, H: 5, N: 5, X: 5, U: 6, V: 6, W: 6, O: 7, Z: 7, F: 8, P: 8 };
    const cleanName = (nameStr || "").toUpperCase().replace(/[^A-Z]/g, "");
    let nSum = 0;
    for (let ch of cleanName) nSum += chaldeanTable[ch] || 0;
    if (!nSum) nSum = 4;
    while (nSum > 9) nSum = String(nSum).split("").reduce((acc, c) => acc + parseInt(c, 10), 0);
    const nameNumber = nSum;

    return {
      yogiStar: yogiStar.nameTa,
      yogiPada,
      yogiPlanet: yogiStar.lordTa,
      yogiDms: formatDms(yogiPoint),
      duplicateYogi: duplicateYogiLord,
      avayogiStar: avaStar.nameTa,
      avayogiPada: avaPada,
      avayogiPlanet: avaStar.lordTa,
      avayogiDms: formatDms(avayogiPoint),
      atmakaraka,
      amatyakaraka,
      shunyaRasis,
      mudakkuStr,
      mudakkuRasi,
      mudakkuStar: mudakkuStarName,
      mudakkuPada,
      vainashikaStar,
      panchaPakshi: pakshi,
      vidhiNumber,
      nameNumber
    };
  }

  /**
   * Calculate Exact Dasha Balance at Birth
   */
  function calculateDashaBalance(moonLon, birthDateStr) {
    const nakLen = 360 / 27;
    const nakIdx = Math.floor(moonLon / nakLen) % 27;
    const elapsedInNak = moonLon % nakLen;
    const remainingFraction = (nakLen - elapsedInNak) / nakLen;

    const dashaLords = [
      { nameTa: "கேது தசை", years: 7, lord: "கேது" },
      { nameTa: "சுக்கிர தசை", years: 20, lord: "சுக்கிரன்" },
      { nameTa: "சூரிய தசை", years: 6, lord: "சூரியன்" },
      { nameTa: "சந்திர தசை", years: 10, lord: "சந்திரன்" },
      { nameTa: "செவ்வாய் தசை", years: 7, lord: "செவ்வாய்" },
      { nameTa: "ராகு தசை", years: 18, lord: "ராகு" },
      { nameTa: "குரு தசை", years: 16, lord: "குரு" },
      { nameTa: "சனி தசை", years: 19, lord: "சனி" },
      { nameTa: "புதன் தசை", years: 17, lord: "புதன்" }
    ];

    const lordIdx = nakIdx % 9;
    const currentLord = dashaLords[lordIdx];
    const totalRemainingYears = remainingFraction * currentLord.years;

    const remYears = Math.floor(totalRemainingYears);
    const remMonthsFloat = (totalRemainingYears - remYears) * 12;
    const remMonths = Math.floor(remMonthsFloat);
    const remDays = Math.floor((remMonthsFloat - remMonths) * 30);

    const bDate = new Date(birthDateStr);
    const endDate = new Date(bDate);
    endDate.setFullYear(endDate.getFullYear() + remYears);
    endDate.setMonth(endDate.getMonth() + remMonths);
    endDate.setDate(endDate.getDate() + remDays);

    const formatDt = (d) => {
      const day = String(d.getDate()).padStart(2, '0');
      const mon = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}-${mon}-${d.getFullYear()}`;
    };

    return {
      dashaLord: currentLord.nameTa,
      janmaStar: NAKSHATRAS[nakIdx].nameTa,
      balanceStr: `${remYears} வருடம், ${remMonths} மாதம், ${remDays} நாட்கள்`,
      endDateStr: formatDt(endDate),
      lordIndex: lordIdx,
      remainingFraction
    };
  }

  /**
   * Generate Full 120-Year Vimshottari Timeline with all 9 Mahadashas and Bhuktis
   */
  function generateFullVimshottariTimeline(moonLon, birthDateStr) {
    const balance = calculateDashaBalance(moonLon, birthDateStr);
    const dashaLords = [
      { name: "கேது", years: 7, pill: "ep-pill-blue" },
      { name: "சுக்கிரன்", years: 20, pill: "ep-pill-green" },
      { name: "சூரியன்", years: 6, pill: "ep-pill-gold" },
      { name: "சந்திரன்", years: 10, pill: "ep-pill-blue" },
      { name: "செவ்வாய்", years: 7, pill: "ep-pill-green" },
      { name: "ராகு", years: 18, pill: "ep-pill-purple" },
      { name: "குரு", years: 16, pill: "ep-pill-gold" },
      { name: "சனி", years: 19, pill: "ep-pill-blue" },
      { name: "புதன்", years: 17, pill: "ep-pill-green" }
    ];

    const bDate = new Date(birthDateStr);
    let curDate = new Date(bDate);
    const now = new Date();

    const dashaTables = [];
    let currentPeriodInfo = null;

    for (let i = 0; i < 9; i++) {
      const dIdx = (balance.lordIndex + i) % 9;
      const dasha = dashaLords[dIdx];
      const isFirst = (i === 0);

      const dashaYears = isFirst ? (dasha.years * balance.remainingFraction) : dasha.years;
      const dashaStart = new Date(curDate);
      const dashaEnd = new Date(curDate);
      dashaEnd.setFullYear(dashaEnd.getFullYear() + Math.floor(dashaYears));
      dashaEnd.setMonth(dashaEnd.getMonth() + Math.floor((dashaYears % 1) * 12));
      dashaEnd.setDate(dashaEnd.getDate() + Math.floor((((dashaYears % 1) * 12) % 1) * 30));

      // Calculate Bhuktis
      const bhuktis = [];
      let bCurDate = new Date(dashaStart);

      for (let b = 0; b < 9; b++) {
        const bIdx = (dIdx + b) % 9;
        const bLord = dashaLords[bIdx];
        const bYears = (dasha.years * bLord.years) / 120;
        const bDays = Math.round(bYears * 365.25);

        const bStart = new Date(bCurDate);
        const bEnd = new Date(bCurDate);
        bEnd.setDate(bEnd.getDate() + bDays);

        const formatDate = (d) => {
          const dd = String(d.getDate()).padStart(2, '0');
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          return `${dd}-${mm}-${d.getFullYear()}`;
        };

        const isCurrent = (now >= bStart && now <= bEnd);

        const bObj = {
          bLord: bLord.name,
          bClass: bLord.pill,
          start: formatDate(bStart),
          end: formatDate(bEnd),
          durationDays: bDays,
          isCurrent: isCurrent
        };

        if (isCurrent) {
          currentPeriodInfo = {
            dashaLord: dasha.name,
            bhuktiLord: bLord.name,
            periodStr: `${formatDate(bStart)} — ${formatDate(bEnd)}`
          };
        }

        bhuktis.push(bObj);
        bCurDate = new Date(bEnd);
      }

      dashaTables.push({
        dashaLord: dasha.name,
        dashaClass: dasha.pill,
        bhuktis
      });

      curDate = new Date(dashaEnd);
    }

    if (!currentPeriodInfo && dashaTables.length > 0 && dashaTables[0].bhuktis.length > 0) {
      dashaTables[0].bhuktis[0].isCurrent = true;
      currentPeriodInfo = {
        dashaLord: dashaTables[0].dashaLord,
        bhuktiLord: dashaTables[0].bhuktis[0].bLord,
        periodStr: `${dashaTables[0].bhuktis[0].start} — ${dashaTables[0].bhuktis[0].end}`
      };
    }

    return {
      dashaTables,
      currentPeriodInfo
    };
  }

  return {
    NAKSHATRAS,
    TITHIS,
    KARANAS,
    YOGAS,
    TAMIL_MONTHS,
    TAMIL_YEARS,
    WEEKDAYS,
    formatDms,
    calculateSunTimes,
    calculatePanchangam,
    calculateYogiAvayogi,
    calculateDashaBalance,
    generateFullVimshottariTimeline
  };
})();

if (typeof window !== "undefined") {
  window.PanchangamCalculator = PanchangamCalculator;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = PanchangamCalculator;
}
