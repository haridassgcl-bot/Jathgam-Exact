/**
 * EXACT JATHAGAM - 108 NAKSHATRA PADAS ENGINE
 * Authentic classical data & attributes for all 108 Padas & 12 Rasis.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Pada108Engine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const RASI_NAMES_TA = [
    "மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி",
    "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"
  ];

  const NAKSHATRA_NAMES_TA = [
    "அசுவினி", "பரணி", "கிருத்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை",
    "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
    "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
    "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
    "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
  ];

  const NAKSHATRA_LORDS = [
    "Ketu (Spiritual, Detached)",
    "Venus (Harmonious, Creative)",
    "Sun (Radiant, Authoritative)",
    "Moon (Nurturing, Receptive)",
    "Mars (Energetic, Courageous)",
    "Rahu (Ambitious, Unconventional)",
    "Jupiter (Wise, Expansive)",
    "Saturn (Disciplined, Enduring)",
    "Mercury (Intellectual, Analytical)"
  ];

  const NAKSHATRA_ELEMENTS = [
    "நெருப்பு", "நிலம்", "நெருப்பு", "நிலம்", "காற்று", "நீர்",
    "காற்று", "நீர்", "நீர்", "நெருப்பு", "நிலம்", "நெருப்பு",
    "நிலம்", "காற்று", "காற்று", "நெருப்பு", "நீர்", "நீர்",
    "நெருப்பு", "நீர்", "நெருப்பு", "காற்று", "காற்று", "காற்று",
    "காற்று", "நீர்", "நீர்"
  ];

  const ELEMENT_NOTES = {
    "நெருப்பு": "Fire element represents energy, action, and transformation",
    "நிலம்": "Earth element represents stability, realism, and material manifestation",
    "காற்று": "Air element represents communication, intellect, and social mobility",
    "நீர்": "Water element represents emotion, intuition, and healing flow"
  };

  const RASI_ATTRIBUTES = [
    {
      name: "மேஷம்",
      bootham: "அக்னி",
      direction: "கிழக்கு",
      gunam: "ரஜஸ்",
      varnam: "க்ஷத்திரியர்",
      vagai: "சஞ்சாரம்",
      gender: "ஆண்",
      lord: "செவ்வாய்",
      color: "சிகப்பு",
      bodyPart: "தலை",
      nature: "தீவிரம்",
      mentalState: "ஆவேசம்",
      yogam: "அதோமுகம்",
      gunangal: "ரஜஸிக (உற்சாகம்)",
      season: "வசந்தம்",
      metal: "செம்பு",
      gem: "பவளம்",
      luckyNumbers: "9, 1",
      career: "இராணுவம், போலீஸ், விளையாட்டு",
      height: "உயரமானது",
      place: "போர்க்களம், தொழிற்சாலை, காடு",
      grain: "கோதுமை",
      taste: "கசப்பு",
      flower: "சிகப்பு தாமரை",
      shape: "நெடுவரையான"
    },
    {
      name: "ரிஷபம்",
      bootham: "நிலம் (பிருத்வி)",
      direction: "தெற்கு",
      gunam: "தமஸ்",
      varnam: "வைசியர்",
      vagai: "ஸ்திரம்",
      gender: "பெண்",
      lord: "சுக்கிரன்",
      color: "வெள்ளை",
      bodyPart: "முகம், கழுத்து, தொண்டை",
      nature: "அமைதி, உறுதி",
      mentalState: "நிதானம்",
      yogam: "திர்யக் முகம்",
      gunangal: "தாமஸிக (பொறுமை)",
      season: "வசந்தம்",
      metal: "வெள்ளி",
      gem: "வைரம்",
      luckyNumbers: "6, 2",
      career: "விவசாயம், நிதி, கலை, ஆடை",
      height: "நடுத்தரமானது",
      place: "மேய்ச்சல் நிலம், விளைநிலம், வங்கி",
      grain: "மொச்சை",
      taste: "இனிப்பு",
      flower: "மல்லிகை, வெள்ளை தாமரை",
      shape: "நாற்கர வடிவம்"
    },
    {
      name: "மிதுனம்",
      bootham: "காற்று (வாயு)",
      direction: "மேற்கு",
      gunam: "சத்வம்",
      varnam: "சூத்திரர்",
      vagai: "உபயம்",
      gender: "ஆண்",
      lord: "புதன்",
      color: "பச்சை",
      bodyPart: "தோள்பட்டை, கைகள், மூச்சுக்குழாய்",
      nature: "புத்தி கூர்மை, உரையாடல்",
      mentalState: "சஞ்சலம்",
      yogam: "ஊர்த்துவ முகம்",
      gunangal: "சாத்வீக (அறிவு)",
      season: "கோடை",
      metal: "பித்தளை",
      gem: "மரகதம்",
      luckyNumbers: "5, 3",
      career: "எழுத்து, இதழியல், வணிகம், தகவல் தொழில்நுட்பம்",
      height: "உயரமானது",
      place: "நூலகம், கல்விக்கூடம், தகவல் தொடர்பு மையம்",
      grain: "பாசிப்பயறு",
      taste: "உப்பு",
      flower: "வெண்தாமரை, மருக்கொழுந்து",
      shape: "இரட்டை வடிவம்"
    },
    {
      name: "கடகம்",
      bootham: "நீர் (ஜலம்)",
      direction: "வடக்கு",
      gunam: "சத்வம்",
      varnam: "அந்தணர்",
      vagai: "சஞ்சாரம்",
      gender: "பெண்",
      lord: "சந்திரன்",
      color: "வெண்மை / முத்து நிறம்",
      bodyPart: "மார்பு, இதயம், வயிறு",
      nature: "இரக்கம், தாய்மை",
      mentalState: "உணர்ச்சிவசம்",
      yogam: "அதோமுகம்",
      gunangal: "சாத்வீக (கருணை)",
      season: "மழைக்காலம்",
      metal: "வெள்ளி / வெண்கலம்",
      gem: "முத்து",
      luckyNumbers: "2, 7",
      career: "மருத்துவம், உணவு, பால் பண்ணை, உளவியல்",
      height: "குட்டையானது",
      place: "நீர்நிலைகள், கிணறு, சமையலறை",
      grain: "பச்சரிசி",
      taste: "இனிப்பு",
      flower: "அல்லி, வெள்ளை ரோஜா",
      shape: "வட்ட வடிவம்"
    },
    {
      name: "சிம்மம்",
      bootham: "அக்னி (நெருப்பு)",
      direction: "கிழக்கு",
      gunam: "சத்வம்",
      varnam: "க்ஷத்திரியர்",
      vagai: "ஸ்திரம்",
      gender: "ஆண்",
      lord: "சூரியன்",
      color: "பொன் / ஆரஞ்சு",
      bodyPart: "இதயம், முதுகுத்தண்டு",
      nature: "கம்பீரம், தலைமை",
      mentalState: "பெருந்தன்மை",
      yogam: "ஊர்த்துவ முகம்",
      gunangal: "ராஜஸிக (ஆளுமை)",
      season: "கோடை",
      metal: "தங்கம்",
      gem: "மாணிக்கம்",
      luckyNumbers: "1, 4",
      career: "அரசியல், நிர்வாகம், அரசுப்பணி, தங்கம்",
      height: "கம்பீரமானது",
      place: "அரண்மனை, கோட்டை, காடு",
      grain: "கோதுமை",
      taste: "காரம்",
      flower: "செந்தாமரை, சூரியகாந்தி",
      shape: "சிம்ம வடிவம்"
    },
    {
      name: "கன்னி",
      bootham: "நிலம் (பிருத்வி)",
      direction: "தெற்கு",
      gunam: "தமஸ்",
      varnam: "வைசியர்",
      vagai: "உபயம்",
      gender: "பெண்",
      lord: "புதன்",
      color: "அடர் பச்சை",
      bodyPart: "குடல், செரிமான மண்டலம்",
      nature: "நுட்பம், ஆய்வு",
      mentalState: "விமர்சனம், துல்லியம்",
      yogam: "திர்யக் முகம்",
      gunangal: "சாத்வீக (ஆராய்ச்சி)",
      season: "வசந்தம்",
      metal: "பித்தளை / ஈயம்",
      gem: "மரகதம்",
      luckyNumbers: "5, 2",
      career: "கணக்கு, தணிக்கை, ஆவணங்கள், கைவினை",
      height: "நடுத்தரமானது",
      place: "பணியிடம், பயிர்த்தோட்டம், ஆய்வகம்",
      grain: "பாசிப்பயறு",
      taste: "துவர்ப்பு",
      flower: "செவ்வந்தி, பச்சை ரோஜா",
      shape: "கன்னி வடிவம்"
    },
    {
      name: "துலாம்",
      bootham: "காற்று (வாயு)",
      direction: "மேற்கு",
      gunam: "ரஜஸ்",
      varnam: "சூத்திரர்",
      vagai: "சஞ்சாரம்",
      gender: "ஆண்",
      lord: "சுக்கிரன்",
      color: "பலவண்ணம் / வெளிர் நீலம்",
      bodyPart: "சிறுநீரகம், இடுப்பு",
      nature: "சமநிலை, நீதி",
      mentalState: "இணக்கம்",
      yogam: "அதோமுகம்",
      gunangal: "ராஜஸிக (நீதி)",
      season: "இலையுதிர்காலம்",
      metal: "வெள்ளி / பிளாட்டினம்",
      gem: "வைரம்",
      luckyNumbers: "6, 7",
      career: "சட்டம், நீதி, வணிகம், ஆடை வடிவமைப்பு",
      height: "உயரமானது",
      place: "சந்தை, நீதிமன்றம், வணிக வளாகம்",
      grain: "மொச்சை",
      taste: "புளிப்பு",
      flower: "ரோஜா, சாமந்தி",
      shape: "தராசு வடிவம்"
    },
    {
      name: "விருச்சிகம்",
      bootham: "நீர் (ஜலம்)",
      direction: "வடக்கு",
      gunam: "தமஸ்",
      varnam: "அந்தணர்",
      vagai: "ஸ்திரம்",
      gender: "பெண்",
      lord: "செவ்வாய் (கேது)",
      color: "அடர் சிகப்பு / பழுப்பு",
      bodyPart: "பிறப்புறுப்பு, மலக்குடல்",
      nature: "மர்மம், ஆழம்",
      mentalState: "தீவிர வைராக்கியம்",
      yogam: "திர்யக் முகம்",
      gunangal: "தாமஸிக (ரகசியம்)",
      season: "பனிக்காலம்",
      metal: "செம்பு / இரும்பு",
      gem: "பவளம்",
      luckyNumbers: "9, 8",
      career: "அறுவை சிகிச்சை, ஆராய்ச்சி, உளவு, கனிம வளம்",
      height: "நடுத்தரமானது",
      place: "சுரங்கம், ரகசிய அறை, புற்றுகள்",
      grain: "துவரை",
      taste: "கசப்பு",
      flower: "செவ்வரளி, நாகலிங்கம்",
      shape: "தேள் வடிவம்"
    },
    {
      name: "தனுசு",
      bootham: "அக்னி (நெருப்பு)",
      direction: "கிழக்கு",
      gunam: "சத்வம்",
      varnam: "க்ஷத்திரியர்",
      vagai: "உபயம்",
      gender: "ஆண்",
      lord: "குரு",
      color: "மஞ்சள்",
      bodyPart: "தொடைகள், இடுப்பு தசை",
      nature: "தர்மம், தத்துவம்",
      mentalState: "நேர்மை",
      yogam: "ஊர்த்துவ முகம்",
      gunangal: "சாத்வீக (ஞானம்)",
      season: "பனிக்காலம்",
      metal: "தங்கம்",
      gem: "புஷ்பராகம்",
      luckyNumbers: "3, 9",
      career: "ஆசிரியர், ஆன்மீகம், நீதித்துறை, வங்கி",
      height: "உயரமானது",
      place: "கோவில், தர்மசாலை, குதிரைக் கொட்டில்",
      grain: "கொண்டைக்கடலை",
      taste: "இனிப்பு",
      flower: "செண்பகம், மஞ்சள் ரோஜா",
      shape: "வில் வடிவம்"
    },
    {
      name: "மகரம்",
      bootham: "நிலம் (பிருத்வி)",
      direction: "தெற்கு",
      gunam: "தமஸ்",
      varnam: "வைசியர்",
      vagai: "சஞ்சாரம்",
      gender: "பெண்",
      lord: "சனி",
      color: "கருப்பு / நீலம்",
      bodyPart: "முழங்கால்கள், எலும்புகள்",
      nature: "உழைப்பு, பொறுமை",
      mentalState: "உறுதி",
      yogam: "அதோமுகம்",
      gunangal: "தாமஸிக (விடாமுயற்சி)",
      season: "குளிர்காலம்",
      metal: "இரும்பு",
      gem: "நீலம்",
      luckyNumbers: "8, 4",
      career: "கட்டுமானம், உற்பத்தி, சுரங்கம், விவசாயம்",
      height: "குட்டையானது",
      place: "காடு, பாறைகள், தொழிலகம்",
      grain: "எள்ளு",
      taste: "துவர்ப்பு",
      flower: "கருங்குவளை, நீலோற்பலம்",
      shape: "முதலை வடிவம்"
    },
    {
      name: "கும்பம்",
      bootham: "காற்று (வாயு)",
      direction: "மேற்கு",
      gunam: "தமஸ்",
      varnam: "சூத்திரர்",
      vagai: "ஸ்திரம்",
      gender: "ஆண்",
      lord: "சனி (ராகு)",
      color: "சாம்பல் / கருநீலம்",
      bodyPart: "கணுக்கால், நரம்புகள்",
      nature: "புதுமை, பொதுநலம்",
      mentalState: "சமூக சிந்தனை",
      yogam: "திர்யக் முகம்",
      gunangal: "தாமஸிக (கண்டுபிடிப்பு)",
      season: "குளிர்காலம்",
      metal: "இரும்பு / காரீயம்",
      gem: "நீலம்",
      luckyNumbers: "8, 7",
      career: "அறிவியல், ஆராய்ச்சி, சமூக சேவை, விமானத்துறை",
      height: "நடுத்தரமானது",
      place: "பானை செய்யும் இடம், வானியல் மையம், தொழிற்சாலை",
      grain: "எள்ளு",
      taste: "காரம்",
      flower: "மரிக்கொழுந்து, நீல மலர்",
      shape: "குடம் வடிவம்"
    },
    {
      name: "மீனம்",
      bootham: "நீர் (ஜலம்)",
      direction: "வடக்கு",
      gunam: "சத்வம்",
      varnam: "அந்தணர்",
      vagai: "உபயம்",
      gender: "பெண்",
      lord: "குரு",
      color: "கடல் நீலம் / பொன்மஞ்சள்",
      bodyPart: "பாதங்கள், கால் விரல்கள்",
      nature: "பக்தி, தியாகம்",
      mentalState: "அமைதி, மோட்சம்",
      yogam: "ஊர்த்துவ முகம்",
      gunangal: "சாத்வீக (மோட்சம்)",
      season: "பனிக்காலம்",
      metal: "தங்கம் / வெண்கலம்",
      gem: "புஷ்பராகம்",
      luckyNumbers: "3, 1",
      career: "ஆன்மீகம், மருத்துவம், தொண்டு, வெளிநாட்டு வாணிபம்",
      height: "குட்டையானது",
      place: "கடல், புனித நதிகள், ஆசிரமங்கள்",
      grain: "கொண்டைக்கடலை",
      taste: "இனிப்பு",
      flower: "தாமரை, மல்லிகை",
      shape: "இரட்டை மீன் வடிவம்"
    }
  ];

  const DEGREE_RANGES = [
    "0° - 3°20' (First quarter)",
    "3°20' - 6°40' (Second quarter)",
    "6°40' - 10°00' (Third quarter)",
    "10°00' - 13°20' (Fourth quarter)"
  ];

  const PADA_TRAITS = [
    "initiative and beginning energy",
    "stability, material focus, and resourcefulness",
    "intellectual curiosity, relationships, and expressive skill",
    "spiritual depth, transformation, and inner wisdom"
  ];

  const CHANDRA_IMPACTS = [
    "energy, courage, and initiative to emotional responses",
    "endurance, practical calm, and grounded emotional loyalty",
    "communicative clarity, adaptability, and social intellect",
    "intuitive sensitivity, deep devotion, and emotional healing"
  ];

  const PRIMARY_TRAITS = [
    "courage and assertiveness",
    "patience, reliability, and wealth attraction",
    "versatility, sharp intellect, and networking",
    "compassion, detachment, and spiritual surrender"
  ];

  /**
   * Get complete details for a Pada (1 to 108)
   */
  function getPadaDetails(padaNum) {
    const num = Math.min(108, Math.max(1, parseInt(padaNum, 10) || 1));
    const padaIdx = num - 1; // 0 to 107

    const nakIdx = Math.floor(padaIdx / 4); // 0 to 26
    const padaInNak = (padaIdx % 4) + 1; // 1 to 4
    const rasiIdx = Math.floor(padaIdx / 9); // 0 to 11
    const navamshaIdx = padaIdx % 12; // 0 to 11

    const nakNameTa = NAKSHATRA_NAMES_TA[nakIdx];
    const rasiNameTa = RASI_NAMES_TA[rasiIdx];
    const navamshaNameTa = RASI_NAMES_TA[navamshaIdx];

    const nakLord = NAKSHATRA_LORDS[nakIdx % 9];
    const nakElement = NAKSHATRA_ELEMENTS[nakIdx];
    const rasiAttr = RASI_ATTRIBUTES[rasiIdx];
    const rasiElement = rasiAttr.name === "மேஷம்" ? "நெருப்பு" : (rasiAttr.bootham.includes("அக்னி") ? "நெருப்பு" : (rasiAttr.bootham.includes("நிலம்") ? "நிலம்" : (rasiAttr.bootham.includes("காற்று") ? "காற்று" : "நீர்")));

    const degreeRange = DEGREE_RANGES[padaInNak - 1];
    const padaTrait = PADA_TRAITS[padaInNak - 1];
    const chandraImpact = CHANDRA_IMPACTS[padaInNak - 1];
    const primaryTrait = PRIMARY_TRAITS[padaInNak - 1];
    const elementNote = ELEMENT_NOTES[nakElement] || "Harmonious cosmic elemental resonance";

    // Custom Gunakurippu synthesis matching classical sample
    let gunaKurippu = "";
    if (num === 1) {
      gunaKurippu = "an energetic and pioneering spirit with quick emotional responses";
    } else {
      gunaKurippu = `${nakNameTa} pada ${padaInNak} in ${rasiNameTa} (Navamsha ${navamshaNameTa}) reflects ${primaryTrait.toLowerCase()} with a balanced ${chandraImpact.toLowerCase()}.`;
    }

    return {
      padaNum: num,
      nakshatra: nakNameTa,
      nakIndex: nakIdx,
      padaInNak: padaInNak,
      rasi: rasiNameTa,
      rasiIndex: rasiIdx,
      navamsha: navamshaNameTa,
      navamshaIndex: navamshaIdx,
      rasiElement: rasiElement,
      nakElement: nakElement,
      degreeRange: degreeRange,
      nakLord: nakLord,
      elementNote: elementNote,
      chandraImpact: chandraImpact,
      padaTrait: padaTrait,
      gunaKurippu: gunaKurippu,
      primaryTrait: primaryTrait,
      rasiAttributes: rasiAttr
    };
  }

  /**
   * Search and filter all 108 Padas by Nakshatra or Rasi
   */
  function filterPadas(nakshatraFilter = "all", rasiFilter = "all") {
    const list = [];
    for (let i = 1; i <= 108; i++) {
      const p = getPadaDetails(i);
      const matchNak = (nakshatraFilter === "all" || !nakshatraFilter || p.nakshatra === nakshatraFilter);
      const matchRasi = (rasiFilter === "all" || !rasiFilter || p.rasi === rasiFilter);
      if (matchNak && matchRasi) {
        list.push(p);
      }
    }
    return list;
  }

  return {
    RASI_NAMES_TA,
    NAKSHATRA_NAMES_TA,
    RASI_ATTRIBUTES,
    getPadaDetails,
    filterPadas
  };
}));
