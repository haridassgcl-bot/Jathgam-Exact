/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - SACRED REMEDIES & TEMPLES DIRECTORY
 * Comprehensive Repository of Tamil Nadu Parihara Sthalams, Gemstones & Mantras:
 * - Navagraha Temples of Tamil Nadu
 * - Marriage, Pitru & Sarpa Dosha Temples
 * - 9 Gemstones (Ratna) Guide
 * - Navagraha Seed & Gayatri Mantras
 * - 27 Nakshatra Sacred Trees & Deities
 */

const RemediesData = {
  // Sacred Temples of Tamil Nadu
  temples: [
    {
      id: "suriyanar",
      nameTa: "சூரியனார் கோவில் (Suriyanar Koil)",
      nameEn: "Suriyanar Temple",
      planetTa: "சூரியன் (Sun)",
      planetEn: "Sun",
      locationTa: "ஆடுதுறை அருகில், தஞ்சாவூர் மாவட்டம்",
      locationEn: "Near Aduthurai, Thanjavur District",
      deityTa: "சூரிய நாராயண சுவாமி",
      deityEn: "Surya Narayana Swamy",
      purposeTa: "அரசு வேலை வாய்ப்பு, தந்தை நலன், பித்ரு தோஷ நிவர்த்தி, கண் பார்வை மேன்மை.",
      purposeEn: "Government career triumphs, paternal blessings, solar vitality, optical clarity."
    },
    {
      id: "thingalur",
      nameTa: "திங்களூர் கைலாசநாதர் கோவில் (Thingalur)",
      nameEn: "Thingalur Kailasanathar Temple",
      planetTa: "சந்திரன் (Moon)",
      planetEn: "Moon",
      locationTa: "திருவையாறு அருகில், தஞ்சாவூர் மாவட்டம்",
      locationEn: "Near Thiruvaiyaru, Thanjavur District",
      deityTa: "கைலாசநாதர் & சந்திர பகவான்",
      deityEn: "Kailasanathar & Lord Chandran",
      purposeTa: "மன அமைதி, மன அழுத்தம் நீங்குதல், தாய் வழி நலம், சந்திர தோஷ நிவர்த்தி.",
      purposeEn: "Mental peace, alleviation of anxiety/depression, maternal longevity, psychosomatic healing."
    },
    {
      id: "vaitheeswaran",
      nameTa: "வைத்தீஸ்வரன் கோவில் (Vaitheeswaran Koil)",
      nameEn: "Vaitheeswaran Temple",
      planetTa: "செவ்வாய் (Mars)",
      planetEn: "Mars / Angarakan",
      locationTa: "சீர்காழி அருகில், மயிலாடுதுறை மாவட்டம்",
      locationEn: "Near Sirkazhi, Mayiladuthurai District",
      deityTa: "வைத்தியநாத சுவாமி & அங்காரகன்",
      deityEn: "Vaidyanatha Swamy & Lord Angarakan",
      purposeTa: "செவ்வாய் தோஷம், திருமண தடை நீங்குதல், நில விவகாரங்கள், ரத்த நோய்கள் குணமாகுதல்.",
      purposeEn: "Chevvai (Manglik) dosha mitigation, resolution of real-estate disputes, swift marriage."
    },
    {
      id: "thiruvenkadu",
      nameTa: "திருவெண்காடு சுவேதாரண்யேஸ்வரர் கோவில்",
      nameEn: "Thiruvenkadu Temple",
      planetTa: "புதன் (Mercury)",
      planetEn: "Mercury / Budhan",
      locationTa: "சீர்காழி அருகில், மயிலாடுதுறை மாவட்டம்",
      locationEn: "Near Sirkazhi, Mayiladuthurai District",
      deityTa: "சுவேதாரண்யேஸ்வரர் & புதன் பகவான்",
      deityEn: "Swetharanyeswarar & Lord Budhan",
      purposeTa: "கல்வி ஞானம், வணிக வளர்ச்சி, நரம்பு கோளாறுகள் நீங்குதல், பேச்சுத்திறன்.",
      purposeEn: "Supreme academic eloquence, commercial ventures, neurological healing, business contracts."
    },
    {
      id: "alangudi",
      nameTa: "ஆலங்குடி ஆபத்சகாயேஸ்வரர் கோவில் (Alangudi)",
      nameEn: "Alangudi Temple",
      planetTa: "குரு (Jupiter)",
      planetEn: "Jupiter / Guru",
      locationTa: "வலங்கைமான் அருகில், திருவாரூர் மாவட்டம்",
      locationEn: "Near Valangaiman, Tiruvarur District",
      deityTa: "ஆபத்சகாயேஸ்வரர் & தட்சிணாமூர்த்தி (குரு)",
      deityEn: "Apatsahayeswarar & Lord Dakshinamurthy",
      purposeTa: "குரு பார்வை பெறுதல், புத்திர பாக்கியம், கல்வி, உயர்பதவி மற்றும் ஞானம்.",
      purposeEn: "Guru Kataksham, conception of auspicious children, moral stature, executive wisdom."
    },
    {
      id: "kanjanur",
      nameTa: "கஞ்சனூர் அக்னீஸ்வரர் கோவில் (Kanjanur)",
      nameEn: "Kanjanur Temple",
      planetTa: "சுக்கிரன் (Venus)",
      planetEn: "Venus / Sukran",
      locationTa: "கும்பகோணம் அருகில், தஞ்சாவூர் மாவட்டம்",
      locationEn: "Near Kumbakonam, Thanjavur District",
      deityTa: "அக்னீஸ்வரர் & சுக்கிர பகவான்",
      deityEn: "Agneeswarar & Lord Sukran",
      purposeTa: "தாம்பத்திய சுகம், கலைத்துறையில் வெற்றி, வசதியான வீடு-வாகனம், சுக்கிர தோஷ நிவர்த்தி.",
      purposeEn: "Marital ecstasy, artistic breakthroughs, acquisition of luxury vehicles, Venusian harmony."
    },
    {
      id: "thirunallar",
      nameTa: "திருநள்ளாறு தர்பாரண்யேஸ்வரர் கோவில்",
      nameEn: "Thirunallar Saniswaran Temple",
      planetTa: "சனி (Saturn)",
      planetEn: "Saturn / Sani",
      locationTa: "காரைக்கால் மாவட்டம், புதுச்சேரி",
      locationEn: "Karaikal District, Puducherry",
      deityTa: "தர்பாரண்யேஸ்வரர் & சனீஸ்வர பகவான்",
      deityEn: "Dharbaranyeswarar & Lord Saniswaran",
      purposeTa: "ஏழரை சனி, அஷ்டம சனி தோஷ நிவர்த்தி, நள தீர்த்த நீராடல், தொழில் தடைகள் நீங்குதல்.",
      purposeEn: "Relief from Sade Sati & Ashtama Sani, purification through Nala Theertham, career rebirth."
    },
    {
      id: "thirunageswaram",
      nameTa: "திருநாகேஸ்வரம் நாகநாதசுவாமி கோவில்",
      nameEn: "Thirunageswaram Temple",
      planetTa: "ராகு (Rahu)",
      planetEn: "Rahu Bhagavan",
      locationTa: "கும்பகோணம் அருகில், தஞ்சாவூர் மாவட்டம்",
      locationEn: "Near Kumbakonam, Thanjavur District",
      deityTa: "நாகநாதசுவாமி & ராகு பகவான் (பால் அபிஷேகம் நீல நிறமாகும் அதிசயம்)",
      deityEn: "Naganathaswamy & Lord Rahu (Milk turns cyan marvel)",
      purposeTa: "ராகு தோஷம், காலசர்ப்ப தோஷம், விஷ பயம் நீங்குதல், வெளிநாட்டு யோகம்.",
      purposeEn: "Kala Sarpa dosha dissolution, protection against toxins, foreign relocation breakthroughs."
    },
    {
      id: "keezhperumpallam",
      nameTa: "கீழ்ப்பெரும்பள்ளம் நாகநாதர் கோவில்",
      nameEn: "Keezhperumpallam Temple",
      planetTa: "கேது (Ketu)",
      planetEn: "Ketu Bhagavan",
      locationTa: "பூம்புகார் அருகில், மயிலாடுதுறை மாவட்டம்",
      locationEn: "Near Poompuhar, Mayiladuthurai District",
      deityTa: "நாகநாதர் & கேது பகவான்",
      deityEn: "Naganathar & Lord Ketu",
      purposeTa: "கேது தோஷ நிவர்த்தி, ஆன்மீக விழிப்புணர்வு, பித்ரு கடன் தீருதல், ஞானம்.",
      purposeEn: "Ketu affliction release, esoteric spiritual awakening, karmic redemption, liberation."
    },
    {
      id: "thirumanancheri",
      nameTa: "திருமணஞ்சேரி உத்வாகநாத சுவாமி கோவில்",
      nameEn: "Thirumanancheri Temple",
      planetTa: "திருமண வரம் (Marriage)",
      planetEn: "Marriage Blessed Union",
      locationTa: "குத்தாலம் அருகில், மயிலாடுதுறை மாவட்டம்",
      locationEn: "Near Kuthalam, Mayiladuthurai District",
      deityTa: "கல்யாண சுந்தரேஸ்வரர் & கோகிலாம்பாள்",
      deityEn: "Kalyanasundareswarar & Kokilambal",
      purposeTa: "திருமண தடை நீக்குதல், மாலை மாற்றி பிரார்த்தனை செய்தல், தாம்பத்திய ஒற்றுமை.",
      purposeEn: "Dissolves protracted matrimonial delays, famous sacred garland exchange ritual."
    },
    {
      id: "rameswaram",
      nameTa: "ராமேஸ்வரம் ராமநாதசுவாமி கோவில்",
      nameEn: "Rameswaram Temple",
      planetTa: "பித்ரு தோஷம் & சிவலிங்க தீர்த்தங்கள்",
      planetEn: "Pitru & Karmic Cleansing",
      locationTa: "ராமேஸ்வரம் தீவு, ராமநாதபுரம் மாவட்டம்",
      locationEn: "Rameswaram Island, Ramanathapuram District",
      deityTa: "ராமநாதசுவாமி (அக்னி தீர்த்தம் & 22 புண்ணிய தீர்த்தங்கள்)",
      deityEn: "Lord Ramanathaswamy (22 Sacred Theerthams)",
      purposeTa: "பித்ரு தோஷ நிவர்த்தி, தில ஹோமம், முன்னோர்களின் சாபம் நீங்குதல், பாவ விமோசனம்.",
      purposeEn: "Ancestral Pitru Dosha release, Thila Homam, divine absolvement from transgenerational karma."
    }
  ],

  // 9 Navagraha Gemstones Guide
  gemstones: [
    {
      code: "Su",
      nameTa: "மாணிக்கம் (Ruby)",
      nameEn: "Ruby (Manikkam)",
      planetTa: "சூரியன் (Sun)",
      planetEn: "Sun",
      carats: "3 - 5 கேரட்",
      metalTa: "தங்கம் அல்லது செம்பு",
      metalEn: "Gold or Copper",
      fingerTa: "மோதிர விரல் (வலது கை)",
      fingerEn: "Ring Finger (Right Hand)",
      dayTa: "ஞாயிற்றுக்கிழமை காலை 6-7 மணி",
      dayEn: "Sunday morning 6:00 - 7:00 AM",
      mantra: "ஓம் ஹ்ரீம் சூர்யாய நமஹ (Om Hreem Suryaya Namaha)"
    },
    {
      code: "Mo",
      nameTa: "முத்து (Natural Pearl)",
      nameEn: "Natural Pearl (Muthu)",
      planetTa: "சந்திரன் (Moon)",
      planetEn: "Moon",
      carats: "4 - 6 கேரட்",
      metalTa: "வெள்ளி",
      metalEn: "Pure Silver",
      fingerTa: "சுண்டு விரல் அல்லது மோதிர விரல்",
      fingerEn: "Little Finger or Ring Finger",
      dayTa: "திங்கட்கிழமை காலை 6-7 மணி",
      dayEn: "Monday morning 6:00 - 7:00 AM",
      mantra: "ஓம் சோம் சோமாய நமஹ (Om Som Somaya Namaha)"
    },
    {
      code: "Ma",
      nameTa: "பவளம் (Red Coral)",
      nameEn: "Red Coral (Moonga / Pavalam)",
      planetTa: "செவ்வாய் (Mars)",
      planetEn: "Mars",
      carats: "5 - 7 கேரட்",
      metalTa: "செம்பு அல்லது தங்கம்",
      metalEn: "Copper or Gold",
      fingerTa: "மோதிர விரல்",
      fingerEn: "Ring Finger",
      dayTa: "செவ்வாய்க்கிழமை காலை 6-7 மணி",
      dayEn: "Tuesday morning 6:00 - 7:00 AM",
      mantra: "ஓம் அங் அங்காரகாய நமஹ (Om Ang Angarakaya Namaha)"
    },
    {
      code: "Me",
      nameTa: "மரகதம் (Emerald)",
      nameEn: "Emerald (Panna / Maragatham)",
      planetTa: "புதன் (Mercury)",
      planetEn: "Mercury",
      carats: "3 - 5 கேரட்",
      metalTa: "தங்கம் அல்லது வெண்கலம்",
      metalEn: "Gold or Bronze",
      fingerTa: "சுண்டு விரல்",
      fingerEn: "Little Finger",
      dayTa: "புதன்கிழமை காலை 6-7 மணி",
      dayEn: "Wednesday morning 6:00 - 7:00 AM",
      mantra: "ஓம் பும் புதாய நமஹ (Om Bum Budhaya Namaha)"
    },
    {
      code: "Ju",
      nameTa: "மஞ்சள் புஷ்பராகம் (Yellow Sapphire)",
      nameEn: "Yellow Sapphire (Pushparagam)",
      planetTa: "குரு (Jupiter)",
      planetEn: "Jupiter",
      carats: "4 - 6 கேரட்",
      metalTa: "தங்கம்",
      metalEn: "Yellow Gold",
      fingerTa: "ஆள்காட்டி விரல்",
      fingerEn: "Index Finger",
      dayTa: "வியாழக்கிழமை காலை 6-7 மணி",
      dayEn: "Thursday morning 6:00 - 7:00 AM",
      mantra: "ஓம் ப்ரம் பிரஹஸ்பதயே நமஹ (Om Gram Greem Grom Sah Gurave Namaha)"
    },
    {
      code: "Ve",
      nameTa: "வைரம் (Diamond) / வெண் புஷ்பராகம்",
      nameEn: "Diamond (Vairam) / White Sapphire",
      planetTa: "சுக்கிரன் (Venus)",
      planetEn: "Venus",
      carats: "0.5 - 1.5 கேரட் (வைரம்)",
      metalTa: "பிளாட்டினம் அல்லது தங்கம்/வெள்ளி",
      metalEn: "Platinum, White Gold or Silver",
      fingerTa: "நடு விரல் அல்லது மோதிர விரல்",
      fingerEn: "Middle Finger or Ring Finger",
      dayTa: "வெள்ளிக்கிழமை காலை 6-7 மணி",
      dayEn: "Friday morning 6:00 - 7:00 AM",
      mantra: "ஓம் ஷும் சுக்ராய நமஹ (Om Shum Shukraya Namaha)"
    },
    {
      code: "Sa",
      nameTa: "நீலக்கல் (Blue Sapphire)",
      nameEn: "Blue Sapphire (Neelam)",
      planetTa: "சனி (Saturn)",
      planetEn: "Saturn",
      carats: "4 - 6 கேரட்",
      metalTa: "வெள்ளி அல்லது ஐம்பொன்",
      metalEn: "Silver or Panchaloha",
      fingerTa: "நடு விரல்",
      fingerEn: "Middle Finger",
      dayTa: "சனிக்கிழமை மாலை 6-7 மணி",
      dayEn: "Saturday evening 6:00 - 7:00 PM",
      mantra: "ஓம் ஷம் சனைச்சராய நமஹ (Om Sham Shanaye Namaha)"
    },
    {
      code: "Ra",
      nameTa: "கோமேதகம் (Hessonite)",
      nameEn: "Hessonite (Gomedh)",
      planetTa: "ராகு (Rahu)",
      planetEn: "Rahu",
      carats: "5 - 7 கேரட்",
      metalTa: "வெள்ளி அல்லது ஐம்பொன்",
      metalEn: "Silver or Panchaloha",
      fingerTa: "நடு விரல்",
      fingerEn: "Middle Finger",
      dayTa: "சனிக்கிழமை இரவு 8-9 மணி",
      dayEn: "Saturday night 8:00 - 9:00 PM",
      mantra: "ஓம் ராம் ராகவே நமஹ (Om Ram Rahave Namaha)"
    },
    {
      code: "Ke",
      nameTa: "வைடூரியம் (Cat's Eye)",
      nameEn: "Cat's Eye (Vaidurya)",
      planetTa: "கேது (Ketu)",
      planetEn: "Ketu",
      carats: "3 - 5 கேரட்",
      metalTa: "வெள்ளி அல்லது ஐம்பொன்",
      metalEn: "Silver or Panchaloha",
      fingerTa: "சுண்டு விரல் அல்லது மோதிர விரல்",
      fingerEn: "Little Finger or Ring Finger",
      dayTa: "செவ்வாய்க்கிழமை காலை 6-7 மணி",
      dayEn: "Tuesday morning 6:00 - 7:00 AM",
      mantra: "ஓம் கேம் கேதவே நமஹ (Om Kem Ketave Namaha)"
    }
  ],

  // Navagraha Mantras & Danam
  mantras: {
    Su: {
      moola: "ஓம் ஹ்ராம் ஹ்ரீம் ஹ்ரௌம் ஸஹ சூர்யாய நமஹ",
      gayatri: "ஓம் அஸ்வத்வஜாய வித்மஹே பாசஹஸ்தாய தீமஹி தன்னோ சூர்ய ப்ரசோதயாத்",
      danamTa: "கோதுமை, சிவப்பு துணி, மாணிக்கம், தாமிர பாத்திரம், வெல்லம்",
      danamEn: "Wheat, red cloth, ruby, copper vessels, jaggery"
    },
    Mo: {
      moola: "ஓம் ச்ராம் ச்ரீம் ச்ரௌம் ஸஹ சந்திராய நமஹ",
      gayatri: "ஓம் பத்மத்வஜாய வித்மஹே ஹேமரூபாய தீமஹி தன்னோ சோம ப்ரசோதயாத்",
      danamTa: "பச்சரிசி, வெள்ளை துணி, முத்து, சங்கு, பால், தயிர்",
      danamEn: "Raw rice, white cloth, pearl, conch shell, milk, curd"
    },
    Ma: {
      moola: "ஓம் க்ராம் க்ரீம் க்ரௌம் ஸஹ பௌமாய நமஹ",
      gayatri: "ஓம் வீரத்வஜாய வித்மஹே விக்னஹஸ்தாய தீமஹி தன்னோ பௌம ப்ரசோதயாத்",
      danamTa: "துவரம் பருப்பு, சிவப்பு வஸ்திரம், பவளம், வெல்லம்",
      danamEn: "Toor dal, red garments, red coral, copper"
    },
    Me: {
      moola: "ஓம் ப்ராம் ப்ரீம் ப்ரௌம் ஸஹ புதாய நமஹ",
      gayatri: "ஓம் கஜத்வஜாய வித்மஹே சுகஹஸ்தாய தீமஹி தன்னோ புத ப்ரசோதயாத்",
      danamTa: "பாசிப் பயறு, பச்சை வஸ்திரம், மரகதம், வெண்கலம்",
      danamEn: "Green gram, green cloth, emerald, bronze"
    },
    Ju: {
      moola: "ஓம் க்ராம் க்ரீம் க்ரௌம் ஸஹ குரவே நமஹ",
      gayatri: "ஓம் வ்ருஷபத்வஜாய வித்மஹே க்ருணிஹஸ்தாய தீமஹி தன்னோ குரு ப்ரசோதயாத்",
      danamTa: "கொண்டைக்கடலை, மஞ்சள் வஸ்திரம், புஷ்பராகம், தங்கம்",
      danamEn: "Chickpeas, yellow cloth, yellow sapphire, gold, turmeric"
    },
    Ve: {
      moola: "ஓம் த்ராம் த்ரீம் த்ரௌம் ஸஹ சுக்ராய நமஹ",
      gayatri: "ஓம் அஸ்வத்வஜாய வித்மஹே தனுர்ஹஸ்தாய தீமஹி தன்னோ சுக்ர ப்ரசோதயாத்",
      danamTa: "மொச்சை, வெண் வஸ்திரம், வைரம், வெள்ளி, நெய்",
      danamEn: "Mochai (white beans), white silk, diamond, silver, ghee"
    },
    Sa: {
      moola: "ஓம் ப்ராம் ப்ரீம் ப்ரௌம் ஸஹ சனைச்சராய நமஹ",
      gayatri: "ஓம் காகத்வஜாய வித்மஹே கட்கஹஸ்தாய தீமஹி தன்னோ மந்த ப்ரசோதயாத்",
      danamTa: "எள்ளு, கருப்பு வஸ்திரம், நல்லெண்ணெய், இரும்பு, நீலக்கல்",
      danamEn: "Sesame seeds, black cloth, gingelly oil, iron, blue sapphire"
    },
    Ra: {
      moola: "ஓம் ப்ராம் ப்ரீம் ப்ரௌம் ஸஹ ராகவே நமஹ",
      gayatri: "ஓம் நாகத்வஜாய வித்மஹே பத்மஹஸ்தாய தீமஹி தன்னோ ராகு ப்ரசோதயாத்",
      danamTa: "உளுந்து, நீல/கரும் வஸ்திரம், கோமேதகம், ஆட்டுக்கடா",
      danamEn: "Black gram (Urad dal), dark cloth, hessonite, mustard"
    },
    Ke: {
      moola: "ஓம் ச்ராம் ச்ரீம் ச்ரௌம் ஸஹ கேதவே நமஹ",
      gayatri: "ஓம் அஸ்வத்வஜாய வித்மஹே சூலஹஸ்தாய தீமஹி தன்னோ கேது ப்ரசோதயாத்",
      danamTa: "கொள்ளு, பலவண்ண வஸ்திரம், வைடூரியம், கம்பளி",
      danamEn: "Horse gram (Kollu), multi-color blanket, cat's eye"
    }
  }
};
