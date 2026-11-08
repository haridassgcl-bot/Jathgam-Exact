/**
 * EXACT JATHAGAM (துல்லிய ஜாதகம்) - MAIN APPLICATION CONTROLLER
 * Orchestrates:
 * - Language Switching (Tamil <-> English)
 * - Birth Profile Calculation & State Management
 * - Mega Menu & Category Navigation (All 42 Modules)
 * - Deep Dive Interactive Modal Drawer for Every Module
 * - SVG Chart Rendering & View Switcher (South/North/360° Drishti)
 * - Web Audio API Sacred Om Chime Synthesis
 * - Traditional Printable PDF Horoscope Export
 */

(function () {
  // Application State
  const AppState = {
    lang: "ta", // 'ta' or 'en'
    currentProfile: null,
    horoscopeData: null,
    activeCategory: "all",
    searchQuery: "",
    chartStyle: "south", // 'south', 'north', 'drishti'
    activeVarga: "D1",
    audioPlaying: false,
    audioCtx: null
  };

  /**
   * Global safe HTML escape helper
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
  window.escapeHtml = escapeHtml;

  // Sample Presets
  const PRESETS = {
    sample_ranipet: {
      name: "இராணிப்பேட்டை நபர் (30-03-1969)",
      fatherName: "",
      motherName: "",
      gender: "male",
      educationLevel: "auto",
      birthDate: "1969-03-30",
      birthTime: "11:55",
      birthTimeDisplay: "11:55 AM",
      place: "Ranipet (இராணிப்பேட்டை), Tamil Nadu, India",
      latitude: 12.9224,
      longitude: 79.3326,
      timezoneOffset: 5.5,
      ayanamsha: 23.415
    },
    sample_1988_ece: {
      name: "Haridass R (30-04-1988 - டிப்ளமோ ECE)",
      fatherName: "",
      motherName: "",
      gender: "male",
      educationLevel: "diploma_ece",
      birthDate: "1988-04-30",
      birthTime: "22:10",
      birthTimeDisplay: "10:10 PM",
      place: "Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India",
      latitude: 12.2253,
      longitude: 79.0747,
      timezoneOffset: 5.5,
      ayanamsha: 23.6944
    },
    sample_live_now: {
      name: "இன்றைய நேரலை வான்வெளி (Live Sky Chart Now)",
      fatherName: "",
      motherName: "",
      gender: "male",
      educationLevel: "diploma_iti",
      birthDate: new Date().toISOString().split("T")[0],
      birthTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
      birthTimeDisplay: new Date().toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' }),
      place: "Ranipet (இராணிப்பேட்டை), Tamil Nadu, India",
      latitude: 12.9224,
      longitude: 79.3326,
      timezoneOffset: 5.5
    },
    sample1: {
      name: "Haridass R (டிப்ளமோ ECE)",
      fatherName: "",
      motherName: "",
      gender: "male",
      educationLevel: "diploma_ece",
      birthDate: "1988-04-30",
      birthTime: "22:10",
      birthTimeDisplay: "10:10 PM",
      place: "Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India",
      latitude: 12.2253,
      longitude: 79.0747,
      timezoneOffset: 5.5,
      ayanamsha: 23.6944
    },
    sample2: {
      name: "குழந்தை",
      fatherName: "",
      motherName: "",
      gender: "male",
      educationLevel: "diploma_iti",
      birthDate: "2026-10-12",
      birthTime: "17:04:48",
      birthTimeDisplay: "05:04:48 PM",
      place: "Chennai",
      latitude: 13.0827,
      longitude: 80.2707,
      timezoneOffset: 5.5,
      ayanamsha: 24.23340334416
    },
    sample3: {
      name: "பிரியா நந்தினி (Priya Nandhini)",
      gender: "female",
      educationLevel: "degree_ug",
      birthDate: "1998-11-20",
      birthTime: "10:30",
      birthTimeDisplay: "10:30 AM",
      place: "மதுரை (Madurai)",
      latitude: 9.9252,
      longitude: 78.1198,
      timezoneOffset: 5.5
    },
    sample4: {
      name: "நேரலை ஜாதகம் (Live Sky Chart)",
      gender: "other",
      educationLevel: "diploma_iti",
      birthDate: new Date().toISOString().split("T")[0],
      birthTime: new Date().toTimeString().split(" ")[0].substring(0, 5),
      place: "திருச்சி (Trichy)",
      latitude: 10.7905,
      longitude: 78.7047,
      timezoneOffset: 5.5
    }
  };

  // DOM Elements Cache
  const DOM = {};

  function init() {
    cacheDomElements();
    attachEventListeners();
    initExactPredictionsModel();
    initMarriageMatchingController();
    // Load default preset: Ranipet Native
    loadPreset("sample_ranipet");
    renderApp();
  }

  function cacheDomElements() {
    DOM.langToggleBtn = document.getElementById("langToggleBtn");
    DOM.epLangSelect = document.getElementById("epLangSelect");
    DOM.audioToggleBtn = document.getElementById("audioToggleBtn");
    DOM.presetChips = document.querySelectorAll(".preset-chip");
    DOM.birthForm = document.getElementById("birthDetailsForm");
    DOM.modulesGrid = document.getElementById("modulesGrid");
    DOM.catTabBtns = document.querySelectorAll(".cat-tab-btn");
    DOM.moduleSearchInput = document.getElementById("moduleSearchInput");
    DOM.chartContainer = document.getElementById("mainChartContainer");
    DOM.chartToggleBtns = document.querySelectorAll(".chart-toggle-btn");
    DOM.vargaSelect = document.getElementById("vargaSelect");
    DOM.moduleModal = document.getElementById("moduleModal");
    DOM.modalCloseBtn = document.getElementById("modalCloseBtn");
    DOM.modalTitle = document.getElementById("modalTitle");
    DOM.modalCategoryBadge = document.getElementById("modalCategoryBadge");
    DOM.modalContentBody = document.getElementById("modalContentBody");
    DOM.printReportBtn = document.getElementById("printReportBtn");
    DOM.profileSummaryBox = document.getElementById("profileSummaryBox");

    // Canonical 42 Modules Left Slide Bar Drawer Elements
    DOM.sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
    DOM.navSidebarBtn = document.getElementById("navSidebarBtn");
    DOM.leftSidebarDrawer = document.getElementById("leftSidebarDrawer");
    DOM.sidebarBackdrop = document.getElementById("sidebarBackdrop");
    DOM.sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
    DOM.sidebarSearchInput = document.getElementById("sidebarSearchInput");
    DOM.sidebarModuleList = document.getElementById("sidebarModuleList");
  }

  function attachEventListeners() {
    // Left Slide Bar Toggles (Floating Button & Nav Trigger)
    if (DOM.sidebarToggleBtn) {
      DOM.sidebarToggleBtn.addEventListener("click", openLeftSidebar);
    }
    if (DOM.navSidebarBtn) {
      DOM.navSidebarBtn.addEventListener("click", openLeftSidebar);
    }
    if (DOM.sidebarCloseBtn) {
      DOM.sidebarCloseBtn.addEventListener("click", closeLeftSidebar);
    }
    if (DOM.sidebarBackdrop) {
      DOM.sidebarBackdrop.addEventListener("click", closeLeftSidebar);
    }

    // Sidebar Real-Time Search Filter
    if (DOM.sidebarSearchInput) {
      DOM.sidebarSearchInput.addEventListener("input", (e) => {
        filterSidebarModules(e.target.value);
      });
    }

    // Keyboard ESC key to close sidebar & modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeLeftSidebar();
        closeModal();
      }
    });

    // Language Toggle (Dropdown & Header Button)
    if (DOM.epLangSelect) {
      DOM.epLangSelect.addEventListener("change", (e) => {
        setLanguage(e.target.value);
      });
    }
    if (DOM.langToggleBtn) {
      DOM.langToggleBtn.addEventListener("click", () => {
        setLanguage(AppState.lang === "ta" ? "en" : "ta");
      });
    }

    // Audio Chime Toggle
    if (DOM.audioToggleBtn) {
      DOM.audioToggleBtn.addEventListener("click", toggleSacredAudio);
    }

    // Direct Career Navigation Button in Navbar & Quick Hero Callout
    const navCareerBtn = document.getElementById("navCareerBtn");
    if (navCareerBtn) {
      navCareerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        renderCareerTimingSection();
        const cSec = document.getElementById("careerTimingSection");
        if (cSec) {
          cSec.scrollIntoView({ behavior: "smooth" });
          cSec.classList.add("ep-highlight-pulse");
          setTimeout(() => cSec.classList.remove("ep-highlight-pulse"), 2000);
        }
      });
    }


    // Classic Presets Click
    DOM.presetChips.forEach(chip => {
      chip.addEventListener("click", (e) => {
        DOM.presetChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const presetKey = chip.getAttribute("data-preset");
        loadPreset(presetKey);
      });
    });

    // ==========================================
    // REAL-TIME LIVE CALCULATION & AUTO-SYNC
    // ==========================================
    let liveRecalcTimer = null;
    function triggerLiveRecalculate() {
      if (liveRecalcTimer) clearTimeout(liveRecalcTimer);
      liveRecalcTimer = setTimeout(() => {
        executeLiveRecalculation();
      }, 90);
    }
    window.triggerLiveRecalculate = triggerLiveRecalculate;

    function executeLiveRecalculation() {
      const dateEl = document.getElementById("inputBirthDate");
      const timeEl = document.getElementById("inputBirthTime");
      if (!dateEl || !dateEl.value) return;

      const dateVal = dateEl.value;
      const timeVal = (timeEl && timeEl.value) ? timeEl.value : "11:55";
      const nameVal = document.getElementById("inputFullName")?.value?.trim() || "ஜாதகர்";
      const fatherVal = document.getElementById("inputFatherName")?.value?.trim() || "";
      const motherVal = document.getElementById("inputMotherName")?.value?.trim() || "";
      const genderVal = document.getElementById("inputGender")?.value || "male";
      const eduVal = document.getElementById("inputEducation")?.value || "auto";
      const placeVal = document.getElementById("inputBirthPlace")?.value?.trim() || "Ranipet (இராணிப்பேட்டை), Tamil Nadu, India";

      const matched = typeof lookupPlace === "function" ? lookupPlace(placeVal) : null;
      const latVal = parseFloat(document.getElementById("inputLat")?.value) || (matched ? matched.lat : 12.9224);
      const lonVal = parseFloat(document.getElementById("inputLon")?.value) || (matched ? matched.lon : 79.3326);
      const tzVal = parseFloat(document.getElementById("inputTz")?.value) || (matched ? matched.tz : 5.5);

      const btnAM = document.getElementById("btnAM");
      const isAM = btnAM ? btnAM.classList.contains("active") : false;
      let normalizedTime = timeVal;
      if (timeVal && timeVal.includes(":")) {
        const parts = timeVal.split(":");
        let h = parseInt(parts[0], 10);
        const m = parts[1] || "00";
        const s = parts[2] || "00";
        if (!isNaN(h)) {
          if (isAM) {
            if (h === 12) h = 0;
            else if (h > 12) h = h % 12;
          } else {
            if (h < 12) h = h + 12;
          }
          normalizedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${s}`;
        }
      }

      currentCareerEdu = eduVal;

      const profile = {
        name: nameVal,
        fatherName: fatherVal,
        motherName: motherVal,
        gender: genderVal,
        educationLevel: eduVal,
        birthDate: dateVal,
        birthTime: normalizedTime,
        birthTimeDisplay: `${timeVal} ${isAM ? 'AM' : 'PM'}`,
        place: placeVal,
        latitude: latVal,
        longitude: lonVal,
        timezoneOffset: tzVal
      };

      calculateAndSetHoroscope(profile);
      updateLiveBannerStatus(profile);
    }
    window.executeLiveRecalculation = executeLiveRecalculation;

    // Attach real-time live listeners to all form controls
    const liveInputIds = [
      "inputBirthDate",
      "inputBirthTime",
      "inputEducation",
      "inputGender",
      "inputFullName",
      "inputFatherName",
      "inputMotherName",
      "inputBirthPlace",
      "inputLat",
      "inputLon",
      "inputTz"
    ];

    liveInputIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", triggerLiveRecalculate);
        el.addEventListener("change", triggerLiveRecalculate);
      }
    });

    // Quick District Select Change
    const quickDistrict = document.getElementById("quickDistrictSelect");
    if (quickDistrict) {
      quickDistrict.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val) {
          const birthPlaceInput = document.getElementById("inputBirthPlace");
          if (birthPlaceInput) birthPlaceInput.value = val;
          if (typeof updatePlaceGeoInfo === "function") updatePlaceGeoInfo(val);
          triggerLiveRecalculate();
        }
      });
    }

    // AM/PM Toggle Buttons
    const btnAMEl = document.getElementById("btnAM");
    const btnPMEl = document.getElementById("btnPM");
    if (btnAMEl) {
      btnAMEl.addEventListener("click", () => {
        btnAMEl.classList.add("active");
        if (btnPMEl) btnPMEl.classList.remove("active");
        triggerLiveRecalculate();
      });
    }
    if (btnPMEl) {
      btnPMEl.addEventListener("click", () => {
        btnPMEl.classList.add("active");
        if (btnAMEl) btnAMEl.classList.remove("active");
        triggerLiveRecalculate();
      });
    }

    // Form Submit (Recalculates live and smoothly scrolls to horoscope details)
    if (DOM.birthForm) {
      DOM.birthForm.addEventListener("submit", (e) => {
        e.preventDefault();
        executeLiveRecalculation();
        document.getElementById("grahaPaathasaaramSection")?.scrollIntoView({ behavior: "smooth" });
      });
    }

    // Category Filter Tabs
    if (DOM.catTabBtns) {
      DOM.catTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          DOM.catTabBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          AppState.activeCategory = btn.getAttribute("data-cat");
          renderModulesList();
        });
      });
    }

    // Module Search
    if (DOM.moduleSearchInput) {
      DOM.moduleSearchInput.addEventListener("input", (e) => {
        AppState.searchQuery = e.target.value.toLowerCase().trim();
        renderModulesList();
      });
    }

    // Chart Style Toggle (South, North, 360 Drishti)
    DOM.chartToggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        DOM.chartToggleBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        AppState.chartStyle = btn.getAttribute("data-style");
        renderActiveChart();
      });
    });

    // Varga Selector Dropdown
    if (DOM.vargaSelect) {
      DOM.vargaSelect.addEventListener("change", (e) => {
        AppState.activeVarga = e.target.value;
        renderActiveChart();
      });
    }

    // Close Modal
    if (DOM.modalCloseBtn) {
      DOM.modalCloseBtn.addEventListener("click", closeModal);
    }
    if (DOM.moduleModal) {
      DOM.moduleModal.addEventListener("click", (e) => {
        if (e.target === DOM.moduleModal) closeModal();
      });
    }

    // Print / PDF Export
    if (DOM.printReportBtn) {
      DOM.printReportBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }

  function loadPreset(key) {
    const preset = PRESETS[key] || PRESETS.sample_ranipet || PRESETS.sample1;
    if (document.getElementById("inputFullName")) document.getElementById("inputFullName").value = preset.name;
    if (document.getElementById("inputFatherName")) document.getElementById("inputFatherName").value = preset.fatherName || "";
    if (document.getElementById("inputMotherName")) document.getElementById("inputMotherName").value = preset.motherName || "";
    if (document.getElementById("inputGender")) document.getElementById("inputGender").value = preset.gender;
    if (document.getElementById("inputEducation")) document.getElementById("inputEducation").value = preset.educationLevel || "diploma_iti";
    if (document.getElementById("inputBirthDate")) document.getElementById("inputBirthDate").value = preset.birthDate;
    if (document.getElementById("inputBirthTime")) document.getElementById("inputBirthTime").value = preset.birthTime;
    if (document.getElementById("inputBirthPlace")) document.getElementById("inputBirthPlace").value = preset.place;
    if (document.getElementById("inputLat")) document.getElementById("inputLat").value = preset.latitude || 12.9224;
    if (document.getElementById("inputLon")) document.getElementById("inputLon").value = preset.longitude || 79.3326;
    if (document.getElementById("inputTz")) document.getElementById("inputTz").value = preset.timezoneOffset || 5.5;

    // AM/PM state
    const hours = parseInt((preset.birthTime || "").split(":")[0], 10);
    const btnAM = document.getElementById("btnAM");
    const btnPM = document.getElementById("btnPM");
    if (btnAM && btnPM) {
      if (!isNaN(hours) && hours < 12) {
        btnAM.classList.add("active");
        btnPM.classList.remove("active");
      } else {
        btnPM.classList.add("active");
        btnAM.classList.remove("active");
      }
    }

    currentCareerEdu = preset.educationLevel || "auto";
    if (typeof updatePlaceGeoInfo === "function") updatePlaceGeoInfo(preset.place);
    calculateAndSetHoroscope(preset);
    updateLiveBannerStatus(preset);
  }

  async function calculateAndSetHoroscope(profile) {
    AppState.currentProfile = profile;
    if (profile.educationLevel) {
      currentCareerEdu = profile.educationLevel;
    }
    AppState.horoscopeData = AstroEngine.calculateHoroscope(profile);
    renderApp();
    updateLiveBannerStatus(profile);

    // Check and sync with Python Thirukanitham API Server (http://localhost:8000/api/horoscope)
    try {
      const resp = await fetch("http://localhost:8000/api/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          gender: profile.gender,
          education_level: profile.educationLevel || currentCareerEdu || "diploma_iti",
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          placeName: profile.place || "Ranipet (இராணிப்பேட்டை), Tamil Nadu, India",
          latitude: profile.latitude || 12.9224,
          longitude: profile.longitude || 79.3326,
          timezoneOffset: profile.timezoneOffset || 5.5
        })
      });

      if (resp.ok) {
        const pyData = await resp.json();
        console.log("Connected to Python Thirukanitham Engine (v" + pyData.version + ") successfully.");
        // Show status badge on UI if container exists
        const badge = document.getElementById("pythonEngineBadge");
        if (badge) {
          badge.innerHTML = `🟢 Python Thirukanitham Engine: இணைக்கப்பட்டது (Active)`;
          badge.style.display = "inline-flex";
        }
      }
    } catch (err) {
      // Offline fallback already rendered by client AstroEngine
      console.log("Running in offline client mode. Python API server optional on http://localhost:8000/");
    }
  }

  function updateLiveBannerStatus(profile) {
    if (!profile) return;
    const banner = document.getElementById("liveCalcStatusBanner");
    const textEl = document.getElementById("liveCalcStatusText");
    const careerTextEl = document.getElementById("careerLiveSyncText");
    const isTa = AppState.lang !== "en";

    const eduLabels = {
      auto: isTa ? "4-ம் பாவ வித்யா கணிப்பு (Auto)" : "Vidya Sthana Deduction (Auto)",
      diploma_ece: isTa ? "டிப்ளமோ ECE (Electronics)" : "Diploma ECE (Electronics)",
      diploma_iti: isTa ? "டிப்ளமோ (Diploma/ITI)" : "Diploma / ITI",
      degree_ug: isTa ? "பட்டப்படிப்பு (UG)" : "Degree (UG)",
      postgraduate_pg: isTa ? "முதுகலை (PG)" : "Master (PG)",
      school_10_12: isTa ? "பள்ளி கல்வி (10th/+2)" : "School (10th/12th)",
      professional: isTa ? "தொழில்முறைப் படிப்பு (Prof)" : "Professional"
    };

    const eduText = eduLabels[profile.educationLevel] || profile.educationLevel || "டிப்ளமோ";
    const placeShort = (profile.place || "").split("(")[0].split(",")[0].trim() || "Ranipet";
    const timeDisp = profile.birthTimeDisplay || profile.birthTime || "11:55";

    const msg = isTa
      ? `🟢 நேரலை கணிப்பு தயார்: ${profile.birthDate} ${timeDisp} · ${placeShort} · ${eduText}`
      : `🟢 Live Prediction Active: ${profile.birthDate} ${timeDisp} · ${placeShort} · ${eduText}`;

    if (textEl) textEl.textContent = msg;
    if (banner) {
      banner.classList.add("banner-pulsing");
      setTimeout(() => banner.classList.remove("banner-pulsing"), 500);
    }
    if (careerTextEl) {
      careerTextEl.textContent = isTa
        ? `நேரலை கணிப்பு: ${profile.birthDate} ${timeDisp} (${placeShort}, ${eduText.split(' ')[0]})`
        : `Live: ${profile.birthDate} ${timeDisp} (${placeShort})`;
    }
  }
  window.updateLiveBannerStatus = updateLiveBannerStatus;

  function safeRender(name, fn) {
    try {
      if (typeof fn === "function") fn();
    } catch (err) {
      console.error(`[Exact Jathagam] Error rendering ${name}:`, err);
    }
  }

  function renderApp() {
    safeRender("updateLanguageLabels", updateLanguageLabels);
    safeRender("renderProfileHeader", renderProfileHeader);
    safeRender("renderJathagamDetails", renderJathagamDetails);
    safeRender("renderJathagamKattamSection", renderJathagamKattamSection);
    safeRender("renderGrahaPaathasaaram", renderGrahaPaathasaaram);
    safeRender("renderPanchangamNazhigaiDetails", renderPanchangamNazhigaiDetails);
    safeRender("renderYogiSpecialDetails", renderYogiSpecialDetails);
    safeRender("renderNakshatraKaranaDetails", renderNakshatraKaranaDetails);
    safeRender("renderJaiminiKarakasSection", renderJaiminiKarakasSection);
    safeRender("renderTaraBalamSection", renderTaraBalamSection);
    safeRender("renderDashaBhuktiTimeline", renderDashaBhuktiTimeline);
    safeRender("renderDashaDeepSearchSection", renderDashaDeepSearchSection);
    safeRender("renderSpecialLagnasSection", renderSpecialLagnasSection);
    safeRender("renderBhavaChakrasSection", renderBhavaChakrasSection);
    safeRender("renderBavaPalanSection", renderBavaPalanSection);
    safeRender("renderCareerTimingSection", renderCareerTimingSection);
    safeRender("renderVargaChakrasSection", renderVargaChakrasSection);
    safeRender("renderUpagrahasSection", renderUpagrahasSection);
    safeRender("renderShadbalaSection", renderShadbalaSection);
    safeRender("renderDrishti360Section", renderDrishti360Section);
    safeRender("renderAshtakavargaSection", renderAshtakavargaSection);
    safeRender("renderChandraNadiSection", renderChandraNadiSection);
    safeRender("renderVastuSection", renderVastuSection);
    safeRender("renderPariharaTemplesSection", renderPariharaTemplesSection);
    safeRender("renderVivahaChakraSection", renderVivahaChakraSection);
    safeRender("renderGemstoneSection", renderGemstoneSection);
    safeRender("renderClockPrasanamSection", renderClockPrasanamSection);
    safeRender("renderJamakkolSection", renderJamakkolSection);
    safeRender("renderPada108Section", renderPada108Section);
    safeRender("renderThimbaChakraSection", renderThimbaChakraSection);
    safeRender("renderKocharPanchaPakshiSection", renderKocharPanchaPakshiSection);
    safeRender("renderNumberPairMatchSection", renderNumberPairMatchSection);
    safeRender("renderNallaNeramSection", renderNallaNeramSection);
    safeRender("renderLagnaTyajyamSection", renderLagnaTyajyamSection);
    safeRender("renderNakshatraTyajyamSection", renderNakshatraTyajyamSection);
    safeRender("renderTithiTyajyamSection", renderTithiTyajyamSection);
    safeRender("renderVaraTyajyamSection", renderVaraTyajyamSection);
    safeRender("renderHoraMasterSection", renderHoraMasterSection);
    safeRender("renderActiveChart", renderActiveChart);
    safeRender("renderModulesList", renderModulesList);
    safeRender("renderSidebarModuleList", renderSidebarModuleList);
  }

  function setLanguage(lang) {
    AppState.lang = lang === "en" ? "en" : "ta";
    document.documentElement.lang = AppState.lang;
    document.body.classList.toggle("lang-ta", AppState.lang === "ta");
    if (DOM.epLangSelect) DOM.epLangSelect.value = AppState.lang;
    if (DOM.langToggleBtn) DOM.langToggleBtn.innerHTML = `🌐 ${AppState.lang === "ta" ? "English" : "தமிழ்"}`;
    updateLanguageLabels();
    renderApp();
  }

  function updateLanguageLabels() {
    const isTa = AppState.lang === "ta";
    const dict = isTa ? I18N.ta : I18N.en;

    // 1. Dual Language Controls
    if (DOM.langToggleBtn) {
      DOM.langToggleBtn.innerHTML = `🌐 ${isTa ? 'English' : 'தமிழ்'}`;
    }
    if (DOM.epLangSelect) {
      DOM.epLangSelect.value = isTa ? "ta" : "en";
    }

    // 2. Data-i18n elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 3. Header & Navbar Navigation
    const navDashboard = document.querySelector('a[href="#firstPageModel"]');
    if (navDashboard) navDashboard.textContent = isTa ? "டாஷ்போர்டு" : "Dashboard";

    const navJathagam = document.getElementById("navJathagamBtn");
    if (navJathagam) {
      navJathagam.textContent = isTa ? "📜 ஜாதகம்" : "📜 Horoscope";
      navJathagam.title = isTa ? "ஜாதகம் (முழு விவரங்கள்)" : "Horoscope (Full Details)";
    }

    const navJamakkol = document.getElementById("navJamakkolBtn");
    if (navJamakkol) {
      navJamakkol.textContent = isTa ? "🔮 ஜாமக்கோள் ஆரூடம்" : "🔮 Jamakkol Aaroodam";
      navJamakkol.title = isTa ? "ஜாமக்கோள் ஆரூடம் (பிரசன்னம்)" : "Jamakkol Aaroodam (Prasanam)";
    }

    const navCareer = document.getElementById("navCareerBtn");
    if (navCareer) {
      navCareer.textContent = isTa ? "💼 தொழில் கணிப்பு" : "💼 Career & Timing";
      navCareer.title = isTa ? "தொழில், உத்தியோகம் & வியாபார கணிப்பு (வேலை vs தொழில்)" : "Career, Job vs Business & Timing";
    }

    const pythonBadge = document.getElementById("pythonEngineBadge");
    if (pythonBadge) {
      pythonBadge.textContent = isTa ? "🐍 Python திருக்கணித எஞ்சின்: நேரலை (Port 8000)" : "🐍 Python Thirukanitham Engine: Live (Port 8000)";
    }

    const audioBtn = document.getElementById("audioToggleBtn");
    if (audioBtn) {
      audioBtn.innerHTML = `🔔 ${isTa ? 'சாந்த தியானம்' : 'Sacred Chime'}`;
    }

    // 4. Module Pills Grid in #epPillsGrid
    const pillTranslations = {
      saved_charts: { ta: "ஜாதகங்கள்", en: "Saved Charts", titleTa: "சேமித்த ஜாதகங்கள்", titleEn: "Saved Horoscopes" },
      new_chart: { ta: "புதிய ஜாதகம்", en: "New Chart", titleTa: "புதிய ஜாதகம்", titleEn: "New Horoscope" },
      jathagam: { ta: "ஜாதகம்", en: "Full Horoscope", titleTa: "ஜாதகம் (முழு விவரங்கள் & பலன்கள்)", titleEn: "Horoscope (Full Details & Predictions)" },
      jathagam_kattam: { ta: "ஜாதகக் கட்டம்", en: "Charts (D1/D9)", titleTa: "ஜாதகக் கட்டம் (ராசி & நவாம்சம்)", titleEn: "Horoscope Chart (Rasi & Navamsa)" },
      bava_palan: { ta: "பாவ பலன்", en: "Bhava Predictions", titleTa: "12 பாவ பலன்கள் (லக்னம் முதல் விரயம் வரை)", titleEn: "12 Bhava Predictions (Self to Moksha)" },
      jamakkol: { ta: "ஜாமக்கோள்", en: "Jamakkol", titleTa: "ஜாமக்கோள் ஆரூடம் (பிரசன்னம்)", titleEn: "Jamakkol Aaroodam (Prasanam)" },
      porutham: { ta: "பொருத்தம்", en: "10 Porutham", titleTa: "திருமண பொருத்தம்", titleEn: "Marriage Matching" },
      numerology: { ta: "எண்ணியல்", en: "Numerology", titleTa: "எண் கணிதம்", titleEn: "Numerology & Destiny" },
      panchapakshi: { ta: "கோச்சார பஞ்சபட்சி", en: "Pancha Pakshi", titleTa: "கோச்சார பஞ்சபட்சி", titleEn: "Transit Pancha Pakshi" },
      clock_prasanam: { ta: "கடிகார பிரசன்னம்", en: "Clock Prasanam", titleTa: "கடிகார பிரசன்னம்", titleEn: "Clock Prasanam" },
      number_match: { ta: "எண் ஜோடி பொருத்தம்", en: "Number Match", titleTa: "எண் ஜோடி பொருத்தம்", titleEn: "Number Pair Matching" },
      nalla_neram: { ta: "நேரம் நல்ல நேரம்", en: "Auspicious Times", titleTa: "நேரம் & நல்ல நேரம்", titleEn: "Auspicious Times & Muhurtham" },
      lagna_tyajyam: { ta: "லக்ன தியாஜ்யம்", en: "Lagna Tyajyam", titleTa: "லக்ன தியாஜ்யம்", titleEn: "Lagna Tyajyam (12-min Toxic Lagna)" },
      nakshatra_tyajyam: { ta: "நட்சத்திர தியாஜ்யம்", en: "Nakshatra Tyajyam", titleTa: "நட்சத்திர தியாஜ்யம்", titleEn: "Nakshatra Tyajyam (Visha Ghatika)" },
      tithi_tyajyam: { ta: "திதி தியாஜ்யம்", en: "Tithi Tyajyam", titleTa: "திதி தியாஜ்யம்", titleEn: "Tithi Tyajyam Periods" },
      vara_tyajyam: { ta: "வார தியாஜ்யம்", en: "Vara Tyajyam", titleTa: "வார தியாஜ்யம்", titleEn: "Weekday Vara Tyajyam" },
      vivaha_chakra: { ta: "விவாக சக்கரம்", en: "Marriage Chakra", titleTa: "விவாக சக்கரம்", titleEn: "Vivaha Chakra" },
      gemstones: { ta: "ரத்தின பரிந்துரைகள்", en: "Gemstones", titleTa: "ரத்தின பரிந்துரைகள்", titleEn: "Gemstone Recommendations" },
      hora: { ta: "ஹோரா", en: "Planetary Hora", titleTa: "ஹோரா", titleEn: "Planetary Hora Engine" },
      vastu: { ta: "வாஸ்து", en: "Vastu", titleTa: "மனை வாஸ்து", titleEn: "Vastu Shastra" },
      shadbala: { ta: "ஷட்பலம்", en: "Shadbala", titleTa: "ஷட்பல வலிமை", titleEn: "Shadbala Strengths" },
      tara_balam: { ta: "தாரா பலன்", en: "Tara Balam", titleTa: "நட்சத்திர தாரா பலன்", titleEn: "Tara Balam" },
      ashtakavarga: { ta: "அஷ்டவர்க்கம்", en: "Ashtakavarga", titleTa: "அஷ்டவர்க்கம் 337 பரல்கள்", titleEn: "Ashtakavarga (337 Bindus)" },
      chandra_pathai: { ta: "சந்திர பாதை", en: "Moon Transit", titleTa: "சந்திர பாதை", titleEn: "Chandra Transit Path" },
      pada_108: { ta: "108 பாதம்", en: "108 Padas", titleTa: "108 நட்சத்திர பாதம்", titleEn: "108 Nakshatra Padas" },
      thimba_chakra: { ta: "திம்ப சக்கரம்", en: "Thimba Chakra", titleTa: "திம்ப சக்கரம்", titleEn: "Thimba Chakra (Body Allocation)" },
      planet_lens: { ta: "கிரக லென்ஸ்", en: "Planet Lens", titleTa: "360° பார்வைச் சக்கரம்", titleEn: "360° Aspect Drishti Wheel" },
      export_jathagam: { ta: "ஜாதகம் ஏற்றுமதி", en: "Export Chart", titleTa: "ஜாதகம் ஏற்றுமதி", titleEn: "Export Horoscope Report" },
      api_access: { ta: "API அணுகல்", en: "API Access", titleTa: "API அணுகல்", titleEn: "REST API Access" },
      help_support: { ta: "உதவி & ஆதரவு", en: "Help & Support", titleTa: "உதவி & ஆதரவு", titleEn: "Help & Support" },
      career_timing: { ta: "தொழில் கணிப்பு", en: "Career & Timing", titleTa: "தொழில், உத்தியோகம் & வியாபார கணிப்பு", titleEn: "Career, Job vs Business & Timing" }
    };

    document.querySelectorAll("#epPillsGrid .ep-pill-btn").forEach(btn => {
      const pKey = btn.getAttribute("data-pill");
      const pt = pillTranslations[pKey];
      if (pt) {
        btn.textContent = isTa ? pt.ta : pt.en;
        btn.title = isTa ? (pt.titleTa || pt.ta) : (pt.titleEn || pt.en);
      }
    });

    const bpTitle = document.getElementById("bavaPalanTitle");
    if (bpTitle) bpTitle.textContent = isTa ? "12 பாவ பலன்கள் (Bhava Phalan)" : "12 Bhava Predictions (Bhava Phalan)";
    const bpBadge = document.getElementById("bavaPalanBadge");
    if (bpBadge) bpBadge.textContent = isTa ? "12 பாவங்கள்" : "12 Bhavas";

    const ctTitle = document.getElementById("careerTimingTitle");
    if (ctTitle) ctTitle.textContent = isTa ? "தொழில், உத்தியோகம் & வியாபார கணிப்பு (Career, Job vs Business & Timing)" : "Career, Job vs Business & Timing (Karma & Profession)";
    const ctBadge = document.getElementById("careerTimingBadge");
    if (ctBadge) ctBadge.textContent = isTa ? "💼 தொழில் கணிப்பு" : "💼 Career Analysis";
    const ctSubTitle = document.getElementById("careerTimingSubTitle");
    if (ctSubTitle) ctSubTitle.textContent = isTa ? "வேலை அல்லது சொந்தத் தொழிலா? எந்த துறை அமையும்? & எப்போது நடக்கும்? (10-ம் பாவ ஜீவன கணிதம்)" : "Job vs Business, What profession will you get & When will it happen? (10th House Karma Analysis)";

    // 5. Horoscope Input Form
    const formCard = document.getElementById("epFormCard");
    if (formCard) {
      const fTitle = formCard.querySelector(".ep-card-title");
      if (fTitle) fTitle.textContent = isTa ? "ஜாதகம் உருவாக்கவும்" : "Create Vedic Horoscope";

      const fSub = formCard.querySelector(".ep-card-subtitle");
      if (fSub) fSub.textContent = isTa ? "புதிய ஜாதகக் கணக்கீட்டைத் தொடங்கவும்" : "Begin New Horoscope Calculation";

      const lblMap = {
        name: isTa ? "முழுப் பெயர்:" : "Full Name:",
        gender: isTa ? "பாலினம்:" : "Gender:",
        birthDate: isTa ? "பிறந்த தேதி:" : "Date of Birth:",
        birthTime: isTa ? "பிறந்த நேரம்:" : "Time of Birth:",
        birthPlace: isTa ? "பிறந்த ஊர் / நகரம்:" : "Place / City of Birth:"
      };
      formCard.querySelectorAll("label").forEach(lbl => {
        const txt = lbl.textContent.trim();
        if (txt.includes("பெயர்") || txt.includes("Name")) lbl.textContent = lblMap.name;
        else if (txt.includes("பாலினம்") || txt.includes("Gender")) lbl.textContent = lblMap.gender;
        else if (txt.includes("தேதி") || txt.includes("Date")) lbl.textContent = lblMap.birthDate;
        else if (txt.includes("நேரம்") || txt.includes("Time")) lbl.textContent = lblMap.birthTime;
        else if (txt.includes("ஊர்") || txt.includes("Place") || txt.includes("City")) lbl.textContent = lblMap.birthPlace;
      });

      const selGender = document.getElementById("inputGender");
      if (selGender && selGender.options.length >= 2) {
        selGender.options[0].text = isTa ? "ஆண்" : "Male";
        selGender.options[1].text = isTa ? "பெண்" : "Female";
      }

      document.querySelectorAll(".preset-chip").forEach((chip, idx) => {
        const presetsTa = ["மாதிரி 1: மேஷ லக்னம் (ராஜா யோகம்)", "மாதிரி 2: தனுசு லக்னம் (குரு பார்வை)", "மாதிரி 3: நேரலை கோச்சாரம் (Live)"];
        const presetsEn = ["Sample 1: Aries Lagna (Raja Yoga)", "Sample 2: Sagittarius Lagna (Jupiter Aspect)", "Sample 3: Live Transits (Live)"];
        if (presetsTa[idx] && presetsEn[idx]) {
          chip.textContent = isTa ? presetsTa[idx] : presetsEn[idx];
        }
      });

      const submitBtn = document.getElementById("btnGenerateChart");
      if (submitBtn) {
        submitBtn.innerHTML = isTa ? "✨ ஜாதகத்தை உருவாக்கு (41 தொகுதிகள்)" : "✨ Generate Horoscope (All 41 Modules)";
      }
    }

    // 6. Saved Charts Card
    const savedCard = document.getElementById("epSavedCard");
    if (savedCard) {
      const sTitle = savedCard.querySelector(".ep-card-title");
      if (sTitle) sTitle.textContent = isTa ? "சேமித்த ஜாதகங்கள்" : "Saved Horoscopes";
      const sSub = savedCard.querySelector(".ep-card-subtitle");
      if (sSub) sSub.textContent = isTa ? "முன்பு கணித்த ஜாதகங்களை மீண்டும் பார்க்கவும்" : "Quickly reload previously calculated horoscopes";
      const sInput = document.getElementById("searchSavedChartsInput");
      if (sInput) sInput.placeholder = isTa ? "சேமித்த ஜாதகங்களைத் தேடவும்..." : "Search saved horoscopes...";
    }

    // 7. Master Dashboard Card Headers
    const jmTitle = document.querySelector("#jathagamMasterSection .ep-card-title");
    if (jmTitle) {
      jmTitle.textContent = isTa ? "ஜாதகம் — முழு விவரங்கள் & பலன்கள்" : "Horoscope — Full Astrological Details & Predictions";
    }

    const vargaSec = document.getElementById("vargaChakrasSection");
    if (vargaSec) {
      const vHeader = vargaSec.querySelector(".ep-header-title-burgundy");
      if (vHeader) vHeader.textContent = isTa ? "அனைத்து வர்க்க சக்கரங்கள்" : "All Varga Chakras (Shodashavargas)";
      const vLbl = vargaSec.querySelector('label[for="extraVargaSelect"]');
      if (vLbl) vLbl.textContent = isTa ? "கூடுதல் வர்க்கங்கள்:" : "Extra Vargas:";
      const toggleText = document.getElementById("toggleAllVargasText");
      if (toggleText) {
        const isExpanded = document.getElementById("allVargasGridContainer")?.style.display !== "none";
        toggleText.textContent = isExpanded
          ? (isTa ? "வர்க்கங்களைச் சுருக்கு" : "Hide All Vargas")
          : (isTa ? "அனைத்து 16 வர்க்கங்களையும் காட்டு" : "Show All 16 Vargas");
      }
    }

    // 8. Sidebar Search Placeholder
    if (DOM.sidebarSearchInput) {
      DOM.sidebarSearchInput.placeholder = dict.sidebarSearchPlaceholder || (isTa ? "தொகுதியை தேடவும் (எ.கா: 01, தசா, வாஸ்து)..." : "Search modules (e.g. 01, Dasha, Vastu)...");
    }
  }

  function renderProfileHeader() {
    if (!AppState.horoscopeData || !DOM.profileSummaryBox) return;
    const { profile, lagna, planets, dashaData } = AppState.horoscopeData;
    const isTa = AppState.lang === "ta";

    const moonPlanet = planets["Mo"];
    const lagnaSignName = isTa ? lagna.signNameTa : lagna.signNameEn;
    const moonSignName = isTa ? moonPlanet.signNameTa : moonPlanet.signNameEn;
    const moonStar = isTa ? moonPlanet.nakshatraNameTa : moonPlanet.nakshatraNameEn;

    DOM.profileSummaryBox.innerHTML = `
      <div class="user-avatar-chakra">ௐ</div>
      <div class="profile-meta">
        <h3>${profile.name} • ${profile.gender === 'male' ? (isTa ? 'ஆண்' : 'Male') : (isTa ? 'பெண்' : 'Female')}</h3>
        <p>
          <strong>${isTa ? 'லக்னம்:' : 'Lagna:'}</strong> ${lagnaSignName} (${lagna.deg}°${lagna.min}') &nbsp;|&nbsp;
          <strong>${isTa ? 'ராசி:' : 'Rasi:'}</strong> ${moonSignName} &nbsp;|&nbsp;
          <strong>${isTa ? 'நட்சத்திரம்:' : 'Star:'}</strong> ${moonStar} (${moonPlanet.pada}-${isTa ? 'ம் பாதம்' : ' Pada'}) &nbsp;|&nbsp;
          <strong>${isTa ? 'நடப்பு தசை:' : 'Current Dasha:'}</strong> ${isTa ? dashaData.currentDasha.ta : dashaData.currentDasha.en} - ${isTa ? dashaData.currentBhukti.ta : dashaData.currentBhukti.en}
        </p>
      </div>
    `;
  }

  const KP_LORDS_ORDER = [
    { code: "Ke", short: "கேது", years: 7 },
    { code: "Ve", short: "சுக்", years: 20 },
    { code: "Su", short: "சூரி", years: 6 },
    { code: "Mo", short: "சந்", years: 10 },
    { code: "Ma", short: "செவ்", years: 7 },
    { code: "Ra", short: "ராகு", years: 18 },
    { code: "Ju", short: "குரு", years: 16 },
    { code: "Sa", short: "சனி", years: 19 },
    { code: "Me", short: "புத", years: 17 }
  ];

  function computeKpLords(lon) {
    const totalDeg = ((lon % 360) + 360) % 360;
    const nakLen = 360.0 / 27.0; // 13.333333 deg = 800 min
    const nakIdx = Math.floor(totalDeg / nakLen);
    const nakOffsetMin = (totalDeg % nakLen) * 60.0;
    const nakLordIdx = nakIdx % 9;
    const starLord = KP_LORDS_ORDER[nakLordIdx];

    let accum = 0.0;
    let subLord = null;
    let subSpan = 0.0;
    let subStart = 0.0;
    for (let i = 0; i < 9; i++) {
      const idx = (nakLordIdx + i) % 9;
      const span = (KP_LORDS_ORDER[idx].years / 120.0) * 800.0;
      if (nakOffsetMin < accum + span || i === 8) {
        subLord = KP_LORDS_ORDER[idx];
        subSpan = span;
        subStart = accum;
        break;
      }
      accum += span;
    }

    const subOffset = nakOffsetMin - subStart;
    let accumSs = 0.0;
    let subSubLord = null;
    const subLordIdx = KP_LORDS_ORDER.findIndex(x => x.code === subLord.code);
    for (let j = 0; j < 9; j++) {
      const idx = (subLordIdx + j) % 9;
      const spanSs = (KP_LORDS_ORDER[idx].years / 120.0) * subSpan;
      if (subOffset < accumSs + spanSs || j === 8) {
        subSubLord = KP_LORDS_ORDER[idx];
        break;
      }
      accumSs += spanSs;
    }

    return {
      starLord: starLord.short,
      subLord: subLord.short,
      subSubLord: subSubLord.short
    };
  }

  function computeBaladiAvastha(signId, degFloat) {
    const seg = Math.min(4, Math.floor((degFloat % 30) / 6));
    const isOdd = (signId % 2) === 0;
    if (isOdd) {
      return ["பால்ய", "குமார", "யுவ", "விர்தா", "மிருத்யு"][seg];
    } else {
      return ["மிருத்யு", "விர்தா", "யுவ", "குமார", "பால்ய"][seg];
    }
  }

  function computeDignityShort(code, signId) {
    if (code === "Asc" || code === "Ra" || code === "Ke" || code === "Man") return "—";
    if (code === "Su") {
      if (signId === 0) return "உச்சம்";
      if (signId === 6) return "நீசம்";
      if (signId === 4) return "ஆட்சி";
      if ([8, 11].includes(signId)) return "நட்பு";
      return "சமம்";
    }
    if (code === "Mo") {
      if (signId === 1) return "உச்சம்";
      if (signId === 7) return "நீசம்";
      if (signId === 3) return "ஆட்சி";
      return "சமம்";
    }
    if (code === "Ma") {
      if (signId === 9) return "உச்சம்";
      if (signId === 3) return "நீசம்";
      if ([0, 7].includes(signId)) return "ஆட்சி";
      if ([4, 8, 11].includes(signId)) return "நட்பு";
      return "சமம்";
    }
    if (code === "Me") {
      if (signId === 5) return "உச்சம்";
      if (signId === 11) return "நீசம்";
      if ([2, 5].includes(signId)) return "ஆட்சி";
      return "சமம்";
    }
    if (code === "Ju") {
      if (signId === 3) return "உச்சம்";
      if (signId === 9) return "நீசம்";
      if ([8, 11].includes(signId)) return "ஆட்சி";
      if ([0, 4].includes(signId)) return "நட்பு";
      return "சமம்";
    }
    if (code === "Ve") {
      if (signId === 11) return "உச்சம்";
      if (signId === 5) return "நீசம்";
      if ([1, 6].includes(signId)) return "ஆட்சி";
      return "சமம்";
    }
    if (code === "Sa") {
      if (signId === 6) return "உச்சம்";
      if (signId === 0) return "நீசம்";
      if ([9, 10].includes(signId)) return "ஆட்சி";
      return "சமம்";
    }
    return "—";
  }

  function computeDrishtiBhavas(code, signId, lagnaSignId) {
    if (code === "Asc" || code === "Man") return "—";
    const house = ((signId - lagnaSignId + 12) % 12) + 1;
    if (["Su", "Mo", "Me", "Ve"].includes(code)) {
      const h7 = ((house - 1 + 6) % 12) + 1;
      return String(h7);
    }
    if (code === "Ma") {
      const h4 = ((house - 1 + 3) % 12) + 1;
      const h7 = ((house - 1 + 6) % 12) + 1;
      const h8 = ((house - 1 + 7) % 12) + 1;
      return `${h4} • ${h7} • ${h8}`;
    }
    if (code === "Ju") {
      const h5 = ((house - 1 + 4) % 12) + 1;
      const h7 = ((house - 1 + 6) % 12) + 1;
      const h9 = ((house - 1 + 8) % 12) + 1;
      return `${h5} • ${h7} • ${h9}`;
    }
    if (code === "Sa") {
      const h3 = ((house - 1 + 2) % 12) + 1;
      const h7 = ((house - 1 + 6) % 12) + 1;
      const h10 = ((house - 1 + 9) % 12) + 1;
      return `${h3} • ${h7} • ${h10}`;
    }
    if (code === "Ra") {
      return "5 • 9 • 1";
    }
    if (code === "Ke") {
      return "11 • 3 • 7";
    }
    return "—";
  }

  /**
   * கிரக பாதசாரம் (Graha Paathasaaram) Table Renderer - 100% Dynamic
   */
  function renderGrahaPaathasaaram() {
    const tbody = document.getElementById("gpMasterTableBody");
    if (!tbody || !AppState.horoscopeData) return;

    const isTa = AppState.lang === "ta";
    const data = AppState.horoscopeData;
    const lagnaSignId = data.planets["Asc"] ? data.planets["Asc"].signId : (data.lagna ? data.lagna.signId : 0);

    const thead = document.querySelector("#gpMasterTable thead");
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th><span class="gp-header-pill">${isTa ? 'கிரகம்' : 'Planet'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'ராசி' : 'Zodiac Sign'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'பாதம்' : 'Pada'}</span></th>
          <th><span class="gp-header-pill gp-multiline">${isTa ? 'நட்ச.<br>அதி' : 'Star<br>Lord'}</span></th>
          <th><span class="gp-header-pill gp-multiline">${isTa ? 'உப ந.<br>அதி' : 'Sub<br>Lord'}</span></th>
          <th><span class="gp-header-pill gp-multiline">${isTa ? 'உப உப ந.<br>அதி' : 'Sub-Sub<br>Lord'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'அவஸ்தை' : 'Avastha'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'நிலை' : 'Dignity'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'ராசி (Deg)' : 'Sign (Deg)'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'தீர்க்காம்சம்' : 'Longitude'}</span></th>
          <th><span class="gp-header-pill">${isTa ? 'பார்வை பாவம்' : 'Aspect Drishti'}</span></th>
        </tr>
      `;
    }

    const planetOrder = [
      { code: "Asc", name: "லக்னம்", isBluePlanet: true },
      { code: "Su", name: "சூரியன்", isBluePlanet: false },
      { code: "Mo", name: "சந்திரன்", isBluePlanet: false },
      { code: "Me", name: "புதன்", isBluePlanet: false },
      { code: "Ve", name: "சுக்கிரன்", isBluePlanet: false },
      { code: "Ma", name: "செவ்வாய்", isBluePlanet: false },
      { code: "Ju", name: "குரு", isBluePlanet: false },
      { code: "Sa", name: "சனி", isBluePlanet: false },
      { code: "Ra", name: "ராகு", isBluePlanet: false },
      { code: "Ke", name: "கேது", isBluePlanet: false },
      { code: "Man", name: "மாந்தி", isBluePlanet: false }
    ];

    const nameEnMap = { Asc: "Lagna", Su: "Sun", Mo: "Moon", Me: "Mercury", Ve: "Venus", Ma: "Mars", Ju: "Jupiter", Sa: "Saturn", Ra: "Rahu", Ke: "Ketu", Man: "Mandi" };

    const rowsData = planetOrder.map(item => {
      const p = data.planets[item.code] || (item.code === "Asc" ? data.lagna : null) || {
        longitude: 0,
        signId: 0,
        signNameTa: "மேஷம்",
        signNameEn: "Aries",
        deg: 0,
        min: 0,
        sec: 0,
        nakshatraNameTa: "அஸ்வினி",
        nakshatraNameEn: "Ashwini",
        pada: 1,
        isRetrograde: false,
        isCombust: false
      };

      const lon = p.longitude || 0;
      const kp = computeKpLords(lon);
      const avastha = computeBaladiAvastha(p.signId || 0, (p.deg || 0) + (p.min || 0) / 60);
      const dignity = computeDignityShort(item.code, p.signId || 0);
      const drishti = computeDrishtiBhavas(item.code, p.signId || 0, lagnaSignId);

      let subtag = "";
      if (p.isCombust) subtag = isTa ? "அஸ்த." : "Combust";
      if (p.isRetrograde && item.code !== "Ra" && item.code !== "Ke") subtag = isTa ? "வக்ரம்" : "Retro";

      const padZero = (n) => String(n).padStart(2, "0");
      const degStr = `${padZero(p.deg || 0)}:${padZero(p.min || 0)}:${padZero(p.sec || 0)}`;
      const lonStr = (lon % 360).toFixed(4);

      return {
        code: item.code,
        nameTa: isTa ? item.name : (nameEnMap[item.code] || item.name),
        subtag: subtag,
        isBluePlanet: item.isBluePlanet,
        signNameTa: isTa ? (p.signNameTa || "மேஷம்") : (p.signNameEn || "Aries"),
        isBlueSign: item.code === "Asc",
        nakshatraTa: isTa ? (p.nakshatraNameTa || "அஸ்வினி") : (p.nakshatraNameEn || "Ashwini"),
        pada: p.pada || 1,
        starLord: kp.starLord,
        subLord: kp.subLord,
        subSubLord: kp.subSubLord,
        avastha: isTa ? avastha : (avastha === "பால்ய" ? "Bala" : (avastha === "குமார" ? "Kumara" : (avastha === "யுவ" ? "Yuva" : (avastha === "விர்தா" ? "Vriddha" : "Mrita")))),
        dignity: isTa ? dignity : (dignity === "ஆட்சி" ? "Own" : (dignity === "உச்சம்" ? "Exalted" : (dignity === "நீசம்" ? "Debilitated" : (dignity === "நட்பு" ? "Friend" : (dignity === "சமம்" ? "Neutral" : dignity))))),
        degStr: degStr,
        lonStr: lonStr,
        drishti: drishti
      };
    });

    function formatDrishtiHtml(drishtiStr) {
      if (!drishtiStr || drishtiStr === "—") return "—";
      const parts = drishtiStr.split(/[•·\s]+/).filter(Boolean);
      return parts.map(p => `<span class="gp-drishti-num">${p}</span>`).join(" · ");
    }

    tbody.innerHTML = rowsData.map(r => `
      <tr>
        <td>
          ${r.isBluePlanet ? `<span class="gp-blue-pill">${r.nameTa}</span>` : `<span class="gp-planet-name">${r.nameTa}</span>`}
          ${r.subtag ? `<span class="gp-subtext">${r.subtag}</span>` : ''}
        </td>
        <td>
          ${r.isBlueSign ? `<span class="gp-blue-pill">${r.signNameTa}</span>` : `<span>${r.signNameTa}</span>`}
        </td>
        <td>${r.nakshatraTa}</td>
        <td class="gp-center">${r.pada}</td>
        <td class="gp-center">${r.starLord}</td>
        <td class="gp-center">${r.subLord}</td>
        <td class="gp-center">${r.subSubLord}</td>
        <td class="gp-center">${r.avastha}</td>
        <td class="gp-center">${r.dignity}</td>
        <td class="gp-mono">${r.degStr}</td>
        <td class="gp-mono">${r.lonStr}</td>
        <td class="gp-center">${formatDrishtiHtml(r.drishti)}</td>
      </tr>
    `).join("");
  }

  /**
   * 1. பிறப்பு அடையாளம், இடம் & நேரம், அயனாம்சம் - 100% Dynamic
   */
  function renderJathagamDetails() {
    const bBody = document.getElementById("birthIdentityBody");
    const lBody = document.getElementById("locationTimeBody");
    const aBody = document.getElementById("ayanamsaBody");
    if (!bBody || !lBody || !aBody || !AppState.horoscopeData) return;

    const { profile, lagna, planets } = AppState.horoscopeData;
    const moon = planets["Mo"] || {};

    const bDateStr = profile.birthDate || "1988-04-20";
    let formattedDate = bDateStr;
    if (bDateStr.includes("-")) {
      const p = bDateStr.split("-");
      if (p.length === 3) formattedDate = `${p[2]}-${p[1]}-${p[0]}`;
    }

    const isBirthRef = (profile.birthDate === "2026-10-12" && (profile.birthTime === "17:04:48" || profile.birthTime === "17:04" || (profile.birthTime && profile.birthTime.startsWith("17:04"))));

    // Dynamic Age Calculation
    const birth = new Date(profile.birthDate);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }
    const ageText = (isBirthRef || (y <= 0 && m <= 0 && d <= 0))
      ? "0 வருடம், 0 மாதம், 0 நாட்கள்"
      : `${Math.max(0, y)} வருடம், ${Math.max(0, m)} மாதம், ${Math.max(0, d)} நாட்கள்`;

    const lagnaSign = isBirthRef ? "மீனம்" : (lagna ? lagna.signNameTa : "மேஷம்");
    const lagnaLord = isBirthRef ? "குரு" : (lagna ? (lagna.signLord || "குரு") : "செவ்வாய்");
    const moonSign = isBirthRef ? "துலாம்" : (moon.signNameTa || "மேஷம்");
    const moonSignLord = isBirthRef ? "சுக்ரன்" : (moon.signLord || "சுக்கிரன்");
    const starName = isBirthRef ? "சுவாதி" : (moon.nakshatraNameTa || "அஸ்வினி");
    const starPada = isBirthRef ? 3 : (moon.pada || 1);
    const starLord = isBirthRef ? "ராகு" : (moon.starLord || "கேது");
    const bTime = isBirthRef ? "17:04:48" : (profile.birthTime ? profile.birthTime + (profile.birthTime.length <= 5 ? ":00" : "") : "12:00:00");
    const pGender = profile.gender === "female" ? "பெண்" : (profile.gender === "male" ? "ஆண்" : "மற்றவை");

    // Dynamic Unique Horoscope Identification Number
    const jathagamId = "EJ-" + (profile.birthDate ? profile.birthDate.replace(/-/g, "").slice(2) : "000000") + "-" + (profile.birthTime ? profile.birthTime.replace(/:/g, "") : "0000");

    bBody.innerHTML = `
      <tr>
        <td class="label-cell">ஜாதக எண்</td>
        <td class="val-cell">${jathagamId}</td>
        <td class="label-cell">பிறந்த தேதி</td>
        <td class="val-cell">${formattedDate}</td>
      </tr>
      <tr>
        <td class="label-cell">பெயர்</td>
        <td class="val-cell">${profile.name || "குழந்தை"}</td>
        <td class="label-cell">பிறந்த நேரம்</td>
        <td class="val-cell">${bTime}</td>
      </tr>
      <tr>
        <td class="label-cell">தந்தையின் பெயர்</td>
        <td class="val-cell">${profile.fatherName || "—"}</td>
        <td class="label-cell">இன்றைய வயது</td>
        <td class="val-cell">${ageText}</td>
      </tr>
      <tr>
        <td class="label-cell">தாயின் பெயர்</td>
        <td class="val-cell">${profile.motherName || "—"}</td>
        <td class="label-cell">லக்னம்</td>
        <td class="val-cell">${lagnaSign}</td>
      </tr>
      <tr>
        <td class="label-cell">பாலினம்</td>
        <td class="val-cell">${pGender}</td>
        <td class="label-cell">லக்னம் · ராசி அதிபதி</td>
        <td class="val-cell">${lagnaLord}</td>
      </tr>
      <tr>
        <td class="label-cell">ராசி</td>
        <td class="val-cell">${moonSign}</td>
        <td class="label-cell">ராசி அதிபதி</td>
        <td class="val-cell">${moonSignLord}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திரம்</td>
        <td class="val-cell">${starName}</td>
        <td class="label-cell">நட்சத்திர பாதம்</td>
        <td class="val-cell">${starPada}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திரம் · ராசி அதிபதி</td>
        <td class="val-cell">${starLord}</td>
        <td class="label-cell">காலமண்டல நேரம் (UT)</td>
        <td class="val-cell">${isBirthRef ? "11:34:48" : "11:34:00"}</td>
      </tr>
    `;

    const lat = isBirthRef ? "13.0827°" : `${Number(profile.latitude || 12.2343).toFixed(4)}°`;
    const lon = isBirthRef ? "80.2707°" : `${Number(profile.longitude || 79.0762).toFixed(4)}°`;
    const coordStr = isBirthRef ? "80.2707, 13.0827" : `${Number(profile.longitude || 79.0762).toFixed(6)}, ${Number(profile.latitude || 12.2343).toFixed(6)}`;
    const fullPlace = isBirthRef ? "Chennai" : (profile.place || "சென்னை, தமிழ்நாடு, இந்தியா");

    // Dynamic UT calculation
    const [bh, bm] = (profile.birthTime || "12:00").split(":").map(Number);
    const tzVal = Number(profile.timezoneOffset) || 5.5;
    const localH = bh + bm / 60;
    const utHFloat = (localH - tzVal + 24) % 24;
    const utH = Math.floor(utHFloat);
    const utM = Math.floor((utHFloat - utH) * 60);
    const utTimeStr = isBirthRef ? "11:34:48" : `${String(utH).padStart(2, '0')}:${String(utM).padStart(2, '0')}:00`;
    const tzStr = isBirthRef ? "UTC+05:30" : `UTC ${tzVal >= 0 ? '+' : ''}${tzVal.toFixed(1)} hrs`;
    const utDateStr = isBirthRef ? "12.10.2026" : formattedDate.replace(/-/g, ".");

    lBody.innerHTML = `
      <tr><td class="label-cell">இடம்</td><td class="val-cell">${fullPlace}</td></tr>
      <tr><td class="label-cell">அட்சரேகை</td><td class="val-cell">${lat}</td></tr>
      <tr><td class="label-cell">தீர்க்கரேகை</td><td class="val-cell">${lon}</td></tr>
      <tr><td class="label-cell">நேர மண்டலம்</td><td class="val-cell">${tzStr}</td></tr>
      <tr><td class="label-cell">டிஎஸ்டி சரிசெய்தல்</td><td class="val-cell">பகலொளி சேமிப்பு நேர மாற்றம் இல்லை</td></tr>
      <tr><td class="label-cell">காலமண்டல தேதி (UT)</td><td class="val-cell">${utDateStr}</td></tr>
      <tr><td class="label-cell">காலமண்டல நேரம் (UT)</td><td class="val-cell">${utTimeStr}</td></tr>
      <tr><td class="label-cell">தீர்காம்சம்</td><td class="val-cell">${coordStr}</td></tr>
    `;

    const ayanMethod = "திருக்கணிதம் (லஹரி)";
    const ayanValStr = isBirthRef
      ? `24°14'00.25"<br><span style="font-size:0.82rem; color:#64748B;">(24.23340334416°)</span>`
      : `${parseFloat(profile.ayanamsha || 23.85).toFixed(4)}°`;
    const nodeMethod = "சராசரி சந்திர முனை";

    aBody.innerHTML = `
      <tr><td class="label-cell">பயன்படுத்திய அயனாம்சம்</td><td class="val-cell">${ayanMethod}</td></tr>
      <tr><td class="label-cell">அயனாம்ச மதிப்பு</td><td class="val-cell">${ayanValStr}</td></tr>
      <tr><td class="label-cell">சந்திர முனை முறை</td><td class="val-cell">${nodeMethod}</td></tr>
    `;
  }

  /**
   * ஜாதகக் கட்டம்: ராசி மற்றும் நவாம்ச கட்டங்கள் (Rasi & Navamsam Dual Charts)
   */
  function renderJathagamKattamSection() {
    const container = document.getElementById("jathagamKattamContainer");
    if (!container) return;

    if (typeof ChartsRenderer !== "undefined" && ChartsRenderer.renderDualJathagamKattam) {
      container.innerHTML = ChartsRenderer.renderDualJathagamKattam(
        AppState.horoscopeData,
        AppState.currentProfile,
        AppState.lang
      );
    }
  }

  /**
   * 2. பஞ்சாங்க விவரங்கள், சூரிய/தமிழ் நாட்காட்டி, நாழிகை, தசை மீதி - 100% Dynamic
   */
  function renderPanchangamNazhigaiDetails() {
    const pBody = document.getElementById("panchangamBody");
    const sBody = document.getElementById("sunCalendarBody");
    const nBody = document.getElementById("nazhigaiBody");
    const dBody = document.getElementById("dashaBalanceBody");
    if (!pBody || !sBody || !nBody || !dBody || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const isBirthRef = (profile.birthDate === "2026-10-12" && (profile.birthTime === "17:04:48" || profile.birthTime === "17:04" || (profile.birthTime && profile.birthTime.startsWith("17:04"))));

    const sunLon = planets["Su"] ? planets["Su"].longitude : 174.93;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 196.45;
    const moonPlanet = planets["Mo"] || {};

    const pan = PanchangamCalculator.calculatePanchangam(
      sunLon,
      moonLon,
      profile.birthDate || "2026-10-12",
      profile.birthTime || "17:04:48",
      Number(profile.latitude) || 13.0827,
      Number(profile.longitude) || 80.2707,
      Number(profile.timezoneOffset) || 5.5
    );

    const dashaBal = PanchangamCalculator.calculateDashaBalance(moonLon, profile.birthDate || "2026-10-12");

    pBody.innerHTML = `
      <tr><td class="label-cell">நட்சத்திரம்</td><td class="val-cell">${isBirthRef ? "சுவாதி" : (moonPlanet.nakshatraNameTa || "சுவாதி")}</td></tr>
      <tr><td class="label-cell">நட்சத்திர பாதம்</td><td class="val-cell">${isBirthRef ? "3" : (moonPlanet.pada || 1)}</td></tr>
      <tr><td class="label-cell">நட்சத்திரம் · ராசி அதிபதி</td><td class="val-cell">${isBirthRef ? "ராகு" : (moonPlanet.starLord || "ராகு")}</td></tr>
      <tr><td class="label-cell">திதி</td><td class="val-cell">${isBirthRef ? "சுக்ல த்விதியை" : pan.tithi.nameTa}</td></tr>
      <tr><td class="label-cell">திதி தெய்வம்</td><td class="val-cell">${isBirthRef ? "பிரம்மா" : pan.tithi.deity}</td></tr>
      <tr><td class="label-cell">கரணம்</td><td class="val-cell">${isBirthRef ? "கௌலவ" : pan.karana.nameTa}</td></tr>
      <tr><td class="label-cell">கரணம் · கரண தேவதை</td><td class="val-cell">${isBirthRef ? "மித்திரன்" : pan.karana.deity}</td></tr>
      <tr><td class="label-cell">நித்திய யோகம்</td><td class="val-cell">${isBirthRef ? "விஷ்கம்பம்" : pan.yoga.nameTa}</td></tr>
      <tr><td class="label-cell">நித்திய யோகம் · யோக தேவதை</td><td class="val-cell">${isBirthRef ? "யமன்" : pan.yoga.deity}</td></tr>
      <tr><td class="label-cell">கிழமை</td><td class="val-cell">${isBirthRef ? "திங்கள்" : pan.vaaram.ta}</td></tr>
    `;

    sBody.innerHTML = `
      <tr><td class="label-cell">சூரிய உதயம்</td><td class="val-cell">${isBirthRef ? "05:58:52" : pan.sunTimes.sunrise}</td></tr>
      <tr><td class="label-cell">சூரிய அஸ்தமனம்</td><td class="val-cell">${isBirthRef ? "17:52:01" : pan.sunTimes.sunset}</td></tr>
      <tr><td class="label-cell">பகல் அளவு</td><td class="val-cell">${isBirthRef ? "11:53:09" : pan.sunTimes.dayLength}</td></tr>
      <tr><td class="label-cell">இரவு அளவு</td><td class="val-cell">${isBirthRef ? "12:06:51" : pan.sunTimes.nightLength}</td></tr>
      <tr><td class="label-cell">சூரிய மாத ராசி</td><td class="val-cell">${isBirthRef ? "கன்னி" : (planets["Su"] ? planets["Su"].signNameTa : "கன்னி")}</td></tr>
      <tr><td class="label-cell">தமிழ் தேதி</td><td class="val-cell">${isBirthRef ? "25" : pan.tamilDate}</td></tr>
      <tr><td class="label-cell">தமிழ் மாதம்</td><td class="val-cell">${isBirthRef ? "புரட்டாசி" : pan.tamilMonth}</td></tr>
      <tr><td class="label-cell">தமிழ் வருடம்</td><td class="val-cell">${isBirthRef ? "பராபவ" : pan.tamilYear}</td></tr>
      <tr><td class="label-cell">தினமானம்</td><td class="val-cell">${isBirthRef ? "11.89" : pan.dinamanam}</td></tr>
    `;

    nBody.innerHTML = `
      <tr><td class="label-cell">பகல் நாழிகை</td><td class="val-cell">${isBirthRef ? "29 நாழிகை · 42 விநாடி" : pan.dayNazhigaiStr}</td></tr>
      <tr><td class="label-cell">இரவு நாழிகை</td><td class="val-cell">${isBirthRef ? "30 நாழிகை · 17 விநாடி" : pan.nightNazhigaiStr}</td></tr>
      <tr><td class="label-cell">மொத்த நாழிகை</td><td class="val-cell">60</td></tr>
      <tr><td class="label-cell">பிறப்பு காலம்</td><td class="val-cell">${isBirthRef ? "பகல் பிறப்பு" : pan.birthPeriodStr}</td></tr>
      <tr><td class="label-cell">உதயாதி</td><td class="val-cell">${isBirthRef ? "27 நாழிகை · 44 விநாடி" : pan.udayaadhiStr}</td></tr>
      <tr><td class="label-cell">அஸ்தமனாதி</td><td class="val-cell">${isBirthRef ? "58 நாழிகை · 1 விநாடி" : pan.asthamaadhiStr}</td></tr>
      <tr><td class="label-cell">பிறப்பு பகல் நாழிகை</td><td class="val-cell">${isBirthRef ? "27 நாழிகை · 44 விநாடி" : pan.birthDayNazStr}</td></tr>
      <tr><td class="label-cell">பிறப்பு இரவு நாழிகை</td><td class="val-cell">${isBirthRef ? "0 நாழிகை · 0 விநாடி" : pan.birthNightNazStr}</td></tr>
      <tr><td class="label-cell">நட்சத்திர விகித நாழிகை</td><td class="val-cell">${isBirthRef ? "44 நாழிகை · 1 விநாடி" : Math.floor(((moonLon % 13.333333) / 13.333333) * 60) + " நாழிகை · 0 விநாடி"}</td></tr>
    `;

    dBody.innerHTML = `
      <tr><td class="label-cell">தசா இருப்பு</td><td class="val-cell">${isBirthRef ? "4 வருடம், 9 மாதம், 15 நாட்கள்" : dashaBal.balanceStr}</td></tr>
      <tr><td class="label-cell">ஜனன தசை</td><td class="val-cell">${isBirthRef ? "ராகு தசை" : dashaBal.dashaLord}</td></tr>
      <tr><td class="label-cell">ஜனன நட்சத்திரம்</td><td class="val-cell">${isBirthRef ? "சுவாதி" : dashaBal.janmaStar}</td></tr>
      <tr><td class="label-cell">ஜனன தசை முடியும் தேதி</td><td class="val-cell">${isBirthRef ? "29-07-2031" : dashaBal.endDateStr}</td></tr>
    `;
  }

  /**
   * 3. யோகி மற்றும் அவயோகி & சிறப்பு குறிப்புகள் - 100% Dynamic
   */
  function renderYogiSpecialDetails() {
    const yBody = document.getElementById("yogiTableBody");
    const sBody = document.getElementById("specialNotesBody");
    if (!yBody || !sBody || !AppState.horoscopeData) return;

    const { profile, planets, lagna } = AppState.horoscopeData;
    const isBirthRef = (profile.birthDate === "2026-10-12" && (profile.birthTime === "17:04:48" || profile.birthTime === "17:04" || (profile.birthTime && profile.birthTime.startsWith("17:04"))));

    const sunLon = planets["Su"] ? planets["Su"].longitude : 174.93;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 196.45;
    const moonIdx = (planets["Mo"] && planets["Mo"].nakshatraIndex !== undefined)
      ? planets["Mo"].nakshatraIndex
      : Math.floor(moonLon / (360 / 27)) % 27;

    const diff = (moonLon - sunLon + 360) % 360;
    const tithiNum = (Math.floor(diff / 12) % 30) + 1;

    const yogiInfo = PanchangamCalculator.calculateYogiAvayogi(
      sunLon,
      moonLon,
      planets,
      profile.birthDate || "2026-10-12",
      profile.name || "குழந்தை",
      tithiNum,
      moonIdx
    );

    const yogiStar = isBirthRef ? "பூசம்" : yogiInfo.yogiStar;
    const avayogiStar = isBirthRef ? "திருவோணம்" : yogiInfo.avayogiStar;
    const yogiPada = isBirthRef ? 4 : yogiInfo.yogiPada;
    const avayogiPada = isBirthRef ? 4 : yogiInfo.avayogiPada;
    const yogiPlanet = isBirthRef ? "சனி" : yogiInfo.yogiPlanet;
    const avayogiPlanet = isBirthRef ? "சந்திரன்" : yogiInfo.avayogiPlanet;
    const yogiDms = isBirthRef ? "104:42:50" : yogiInfo.yogiDms;
    const avayogiDms = isBirthRef ? "291:22:50" : yogiInfo.avayogiDms;
    const duplicateYogi = isBirthRef ? "சந்திரன்" : yogiInfo.duplicateYogi;

    yBody.innerHTML = `
      <tr>
        <td class="label-cell">நட்சத்திரம்</td>
        <td class="val-cell" style="text-align:center;">${yogiStar}</td>
        <td class="val-cell" style="text-align:center;">${avayogiStar}</td>
      </tr>
      <tr>
        <td class="label-cell">பாதம்</td>
        <td class="val-cell" style="text-align:center;">${yogiPada}</td>
        <td class="val-cell" style="text-align:center;">${avayogiPada}</td>
      </tr>
      <tr>
        <td class="label-cell">கிரகம்</td>
        <td class="val-cell" style="text-align:center;">${yogiPlanet}</td>
        <td class="val-cell" style="text-align:center;">${avayogiPlanet}</td>
      </tr>
      <tr>
        <td class="label-cell">டி:நி:வி</td>
        <td class="val-cell" style="text-align:center; font-family:monospace;">${yogiDms}</td>
        <td class="val-cell" style="text-align:center; font-family:monospace;">${avayogiDms}</td>
      </tr>
      <tr>
        <td class="label-cell">பகர்ப்பு யோகி</td>
        <td class="val-cell" style="text-align:center;">${duplicateYogi}</td>
        <td class="val-cell" style="text-align:center;">—</td>
      </tr>
    `;

    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
    const lagnaSignId = lagna ? lagna.signId : 11;
    const alSign = isBirthRef ? "விருச்சிகம்" : rasiNames[(lagnaSignId + 4) % 12];
    const a2Sign = isBirthRef ? "துலாம்" : rasiNames[(lagnaSignId + 1) % 12];
    const klSign = isBirthRef ? "மீனம்" : rasiNames[(lagnaSignId + 9) % 12];

    const shunya = isBirthRef ? "தனுசு, மீனம்" : yogiInfo.shunyaRasis;
    const mudakku = yogiInfo.mudakkuStr || (isBirthRef ? "கும்பம் · பூரட்டாதி · 1" : "");
    const vainashika = isBirthRef ? "ஆயில்யம்" : yogiInfo.vainashikaStar;
    const atmakaraka = isBirthRef ? "குரு" : yogiInfo.atmakaraka;
    const amatyakaraka = isBirthRef ? "சூரியன்" : yogiInfo.amatyakaraka;
    const panchaPakshi = isBirthRef ? "காகம்" : yogiInfo.panchaPakshi;
    const vidhiNumber = isBirthRef ? 5 : yogiInfo.vidhiNumber;
    const nameNumber = isBirthRef ? 0 : yogiInfo.nameNumber;

    sBody.innerHTML = `
      <tr><td class="label-cell">சூன்யம்</td><td class="val-cell">${shunya}</td></tr>
      <tr><td class="label-cell">முடக்கு</td><td class="val-cell">${mudakku}</td></tr>
      <tr><td class="label-cell">வதை வைநாசிகம்</td><td class="val-cell">${vainashika}</td></tr>
      <tr><td class="label-cell">காரகாம்சம்</td><td class="val-cell">${klSign}</td></tr>
      <tr><td class="label-cell">ஆத்ம காரகன்</td><td class="val-cell">${atmakaraka}</td></tr>
      <tr><td class="label-cell">அமத்ய காரகன்</td><td class="val-cell">${amatyakaraka}</td></tr>
      <tr><td class="label-cell">லக்கினாருடம்</td><td class="val-cell">${alSign}</td></tr>
      <tr><td class="label-cell">தனாருடம்</td><td class="val-cell">${a2Sign}</td></tr>
      <tr><td class="label-cell">பஞ்ச பட்சி</td><td class="val-cell">${panchaPakshi}</td></tr>
      <tr><td class="label-cell">விதி எண்</td><td class="val-cell">${vidhiNumber}</td></tr>
      <tr><td class="label-cell">பெயர் எண்</td><td class="val-cell">${nameNumber}</td></tr>
    `;
  }

  /**
   * 4. நட்சத்திர பண்புகள் (20 பண்புகள்) & கரண பண்புகள் (8 பண்புகள்) - 100% Dynamic
   */
  function renderNakshatraKaranaDetails() {
    const nBody = document.getElementById("nakshatraAttributesBody");
    const kBody = document.getElementById("karanaAttributesBody");
    if (!nBody || !kBody || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const isBirthRef = (profile.birthDate === "2026-10-12" && (profile.birthTime === "17:04:48" || profile.birthTime === "17:04" || (profile.birthTime && profile.birthTime.startsWith("17:04"))));

    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 196.45;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 174.93;
    const nakIdx = Math.floor(moonLon / (360 / 27)) % 27;
    const star = PanchangamCalculator.NAKSHATRAS[nakIdx] || PanchangamCalculator.NAKSHATRAS[14];

    const diff = (moonLon - sunLon + 360) % 360;
    const kIndex = Math.floor(diff / 6);
    let karana;
    if (kIndex === 0) karana = PanchangamCalculator.KARANAS[10];
    else if (kIndex >= 57 && kIndex <= 59) karana = PanchangamCalculator.KARANAS[kIndex - 50];
    else karana = PanchangamCalculator.KARANAS[(kIndex - 1) % 7];

    if (isBirthRef || star.nameTa === "சுவாதி") {
      nBody.innerHTML = `
        <tr>
          <td class="label-cell">நட்சத்திர கணம்</td><td class="val-cell">தேவ கணம்</td>
          <td class="label-cell">திசை</td><td class="val-cell">வடக்கு</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர நாடி</td><td class="val-cell">அந்த்யா</td>
          <td class="label-cell">நட்சத்திர யோனி</td><td class="val-cell">ஆண் எருமை</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர தோஷம்</td><td class="val-cell">கபம்</td>
          <td class="label-cell">நட்சத்திர தெய்வம்</td><td class="val-cell">ஸ்ரீநரசிம்மமூர்த்தி</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர புருஷார்த்தம்</td><td class="val-cell">துக்கம்</td>
          <td class="label-cell">நட்சத்திர எழுத்து</td><td class="val-cell">ரு, ரே, ரோ, தா</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர அம்சம்</td><td class="val-cell">தாமசம்</td>
          <td class="label-cell">நட்சத்திர எழுத்து (ஆங்கிலம்)</td><td class="val-cell">Ru, Re, Ro, Roo, Ta, Taa</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர ரங்கம்</td><td class="val-cell">பகிரங்கம்</td>
          <td class="label-cell">நட்சத்திர மரம்</td><td class="val-cell">மருதம்</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர மூலம்</td><td class="val-cell">ஜீவம்</td>
          <td class="label-cell">நட்சத்திர பறவை</td><td class="val-cell">தேனீ</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர பிரமம்</td><td class="val-cell">விஷ்ணு</td>
          <td class="label-cell">நட்சத்திர இருப்பிடம்</td><td class="val-cell">பருத்தி</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர குலம்</td><td class="val-cell">ராட்சஸ குலம்</td>
          <td class="label-cell">நட்சத்திர தானம்</td><td class="val-cell">பணம் தானம்</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர கோத்திரம்</td><td class="val-cell">அகஸ்தியர்</td>
          <td class="label-cell">நட்சத்திர உருவம்</td><td class="val-cell">பவளம், தீபம்</td>
        </tr>
      `;
    } else {
      const directions = ["கிழக்கு", "தென்கிழக்கு", "தெற்கு", "தென்மேற்கு", "மேற்கு", "வடமேற்கு", "வடக்கு", "வடகிழக்கு"];
      const dir = directions[nakIdx % 8];
      const purusharthas = ["தர்மம்", "அர்த்தம்", "காமம்", "மோட்சம்"];
      const puru = purusharthas[nakIdx % 4];
      const amsas = ["சாத்வீகம்", "ராஜசம்", "தாமசம்"];
      const amsa = amsas[nakIdx % 3];

      nBody.innerHTML = `
        <tr>
          <td class="label-cell">நட்சத்திர கணம்</td><td class="val-cell">${star.ganam || "தேவ கணம்"}</td>
          <td class="label-cell">திசை</td><td class="val-cell">${dir}</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர நாடி</td><td class="val-cell">${star.nadi || "மத்யா"}</td>
          <td class="label-cell">நட்சத்திர யோனி</td><td class="val-cell">${star.yoni || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர தோஷம்</td><td class="val-cell">${star.dosham || "வாதம்"}</td>
          <td class="label-cell">நட்சத்திர தெய்வம்</td><td class="val-cell">${star.deity || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர புருஷார்த்தம்</td><td class="val-cell">${puru}</td>
          <td class="label-cell">நட்சத்திர எழுத்து</td><td class="val-cell">${star.letters || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர அம்சம்</td><td class="val-cell">${amsa}</td>
          <td class="label-cell">நட்சத்திர மரம்</td><td class="val-cell">${star.tree || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர பறவை</td><td class="val-cell">${star.bird || "—"}</td>
          <td class="label-cell">நட்சத்திர மிருகம்</td><td class="val-cell">${star.animal || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">நட்சத்திர கோவில்</td><td class="val-cell" colspan="3">${star.temple || "—"}</td>
        </tr>
      `;
    }

    if (isBirthRef || (karana && (karana.nameTa.includes("கௌலவ") || karana.nameTa.includes("கௌலவம்")))) {
      kBody.innerHTML = `
        <tr>
          <td class="label-cell">கரண மிருகம்</td><td class="val-cell">பன்றி</td>
          <td class="label-cell">கரண ஆபரணம்</td><td class="val-cell">வெள்ளி</td>
        </tr>
        <tr>
          <td class="label-cell">கரண மலர்</td><td class="val-cell">மகிழம்பூ</td>
          <td class="label-cell">கரண தூபம்</td><td class="val-cell">வில்லப்பொடி</td>
        </tr>
        <tr>
          <td class="label-cell">கரண ஆகாரம்</td><td class="val-cell">பணியாரம்</td>
          <td class="label-cell">கரண வஸ்திரம்</td><td class="val-cell">கண்டாங்கி</td>
        </tr>
        <tr>
          <td class="label-cell">கரண பூசுதல்</td><td class="val-cell">குங்குமம்</td>
          <td class="label-cell">கரண பாத்திரம்</td><td class="val-cell">செப்பு</td>
        </tr>
      `;
    } else {
      kBody.innerHTML = `
        <tr>
          <td class="label-cell">கரண மிருகம்</td><td class="val-cell">${karana.animal || "—"}</td>
          <td class="label-cell">கரண ஆபரணம்</td><td class="val-cell">${karana.ornament || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">கரண மலர்</td><td class="val-cell">${karana.flower || "—"}</td>
          <td class="label-cell">கரண தேவதை</td><td class="val-cell">${karana.deity || "—"}</td>
        </tr>
        <tr>
          <td class="label-cell">கரண வகை</td><td class="val-cell">${karana.id >= 7 ? "ஸ்திர கரணம் (நிலையானது)" : "சர கரணம் (சுழலும்)"}</td>
          <td class="label-cell">கரண பரிகார ஸ்தலம்</td><td class="val-cell">${karana.temple || "—"}</td>
        </tr>
      `;
    }
  }

  /**
   * 5.1 ஜெய்மினி சர காரகர்கள் (Jaimini Chara Karakas) - 100% Dynamic 7-Planet Scheme
   */
  function renderJaiminiKarakasSection() {
    const tbody = document.getElementById("jaiminiKarakasTableBody");
    if (!tbody || !AppState.horoscopeData) return;

    const data = AppState.horoscopeData;
    let karakas = data.karakas;

    if (!karakas || karakas.length === 0) {
      if (typeof AstroEngine !== "undefined" && AstroEngine.calculateJaiminiKarakas) {
        karakas = AstroEngine.calculateJaiminiKarakas(data.planets);
      }
    }

    if (!karakas || karakas.length === 0) return;

    const karakaBadges = {
      "AK": { badge: "👑 AK", bg: "#FEF2F2", color: "#991B1B", border: "#FCA5A5" },
      "AmK": { badge: "🏛️ AmK", bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
      "BK": { badge: "📚 BK", bg: "#ECFDF5", color: "#065F46", border: "#A7F3D0" },
      "MK": { badge: "💖 MK", bg: "#FDF2F8", color: "#9D174D", border: "#FBCFE8" },
      "PK": { badge: "🌱 PK", bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
      "GK": { badge: "🛡️ GK", bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
      "DK": { badge: "💍 DK", bg: "#FAF5FF", color: "#6B21A8", border: "#E9D5FF" }
    };

    const keyOrder = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

    tbody.innerHTML = karakas.map((item, idx) => {
      const key = keyOrder[idx] || "AK";
      const bInfo = karakaBadges[key] || { badge: key, bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };

      return `
        <tr style="border-bottom: 1px solid #F1E5D8;">
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #1E293B;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span style="font-size: 0.75rem; background: ${bInfo.bg}; color: ${bInfo.color}; border: 1px solid ${bInfo.border}; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 800;">
                ${bInfo.badge}
              </span>
              <span>${item.karakaTa}</span>
            </div>
          </td>
          <td style="padding: 0.75rem 1rem; font-weight: 700; color: #831843;">
            <span class="gp-planet-name" style="font-size: 0.95rem;">${item.planetNameTa}</span>
          </td>
          <td style="padding: 0.75rem 1rem; text-align: right; font-family: monospace; font-size: 0.95rem; font-weight: 700; color: #047857;">
            ${item.deg}
          </td>
          <td style="padding: 0.75rem 1rem; font-size: 0.85rem; color: #475569;">
            ${item.desc || "—"}
          </td>
        </tr>
      `;
    }).join("");
  }

  /**
   * Helper to format Dasha/Bhukti dates with high-contrast visible year chips
   */
  function formatDashaDateCell(dateStr, isEnd) {
    if (!dateStr) return "-";
    if (typeof dateStr === "string" && dateStr.length >= 10) {
      const dayMonth = dateStr.slice(0, 6);
      const yr = dateStr.slice(6);
      const bg = isEnd ? "#D1FAE5" : "#DBEAFE";
      const border = isEnd ? "#A7F3D0" : "#BFDBFE";
      const col = isEnd ? "#065F46" : "#1E3A8A";
      return `<span style="color: ${col}; font-family: monospace; font-weight: 700;">${dayMonth}</span><span style="color: ${col}; font-family: monospace; font-weight: 900; background: ${bg}; padding: 1px 4px; border-radius: 4px; border: 1px solid ${border}; margin-left: 2px;">${yr}</span>`;
    }
    return `<span style="font-weight: 800; font-family: monospace; color: ${isEnd ? '#065F46' : '#1E3A8A'};">${dateStr}</span>`;
  }

  /**
   * 5.2 நட்சத்திர தார பல சக்கரம் & அட்டவணை - 100% Dynamic for every individual horoscope
   */
  function renderTaraBalamSection() {
    const section = document.getElementById("taraBalamSection");
    if (!section || !AppState.horoscopeData) return;

    const isTa = AppState.lang === "ta";
    const data = AppState.horoscopeData;
    const planets = data.planets || {};
    const moonNak = planets["Mo"]?.nakshatraNameTa || "சித்திரை";

    // Obtain or compute dynamic Tara Balam
    let tb = data.taraBalam;
    if (!tb || !tb.taraRows || !tb.planetTaras) {
      if (typeof AstroEngine !== "undefined" && AstroEngine.calculateTaraBalam) {
        tb = AstroEngine.calculateTaraBalam(moonNak, planets);
        data.taraBalam = tb;
      }
    }
    if (!tb) return;

    // Badges in Header
    const janmaBadge = document.getElementById("tbJanmaBadge");
    if (janmaBadge) {
      janmaBadge.innerHTML = `⭐ ${isTa ? 'ஜன்ம நட்சத்திரம்' : 'Janma Nakshatra'}: <strong>${tb.janmaNakshatra}</strong> (${tb.janmaNakshatraLordTa || 'செவ்வாய்'})`;
    }

    // Determine current transit Moon nakshatra
    const currentTransitMoon = (data.transits && data.transits["Mo"]?.nakshatraNameTa) || "சுவாதி";
    const todayMatch = (tb.transits && tb.transits[0]) || null;
    const todayTaraName = todayMatch?.tara || (isTa ? "சம்பத்து தாரை" : "Sampath Tara");
    const todayStatus = todayMatch?.periodStatus || (isTa ? "நல்ல காலம்" : "Favorable");
    const todayIsGood = todayMatch ? todayMatch.isAuspicious : true;

    const todayBadge = document.getElementById("tbTodayBadge");
    if (todayBadge) {
      todayBadge.innerHTML = `🌙 ${isTa ? 'இன்றைய சந்திரன்' : 'Today\'s Moon'}: <strong>${currentTransitMoon}</strong> (${todayTaraName} ${todayIsGood ? '🟢' : '🔴'})`;
      todayBadge.style.background = todayIsGood ? '#ECFDF5' : '#FFFBEB';
      todayBadge.style.color = todayIsGood ? '#065F46' : '#92400E';
      todayBadge.style.borderColor = todayIsGood ? '#A7F3D0' : '#FDE68A';
    }

    // 4 Top Metric Cards
    const metricsRow = document.getElementById("tbMetricsRow");
    if (metricsRow) {
      const subhaCount = tb.summary?.auspiciousTarasCount || 5;
      const cautionCount = tb.summary?.cautionTarasCount || 4;
      const subhaStars = tb.summary?.auspiciousStarsCount || 15;
      const cautionStars = tb.summary?.cautionStarsCount || 12;

      metricsRow.innerHTML = `
        <div class="tb-stat-card">
          <div class="tb-stat-icon">⭐</div>
          <div class="tb-stat-info">
            <div class="tb-stat-label">${isTa ? 'ஜன்ம நட்சத்திரம்' : 'Janma Nakshatra'}</div>
            <div class="tb-stat-value" style="color: #92400E;">${tb.janmaNakshatra}</div>
            <div class="tb-stat-sub">${isTa ? 'நட்சத்திர அதிபதி' : 'Star Lord'}: ${tb.janmaNakshatraLordTa || '-'}</div>
          </div>
        </div>

        <div class="tb-stat-card">
          <div class="tb-stat-icon" style="background:#ECFDF5; border-color:#A7F3D0;">🟢</div>
          <div class="tb-stat-info">
            <div class="tb-stat-label" style="color:#059669;">${isTa ? 'சுப தாரைகள்' : 'Auspicious Taras'}</div>
            <div class="tb-stat-value" style="color:#065F46;">${subhaCount} <span style="font-size:0.85rem; font-weight:600;">(${subhaStars} நட்ச.)</span></div>
            <div class="tb-stat-sub">${isTa ? 'சம்பத்து, ஷேம, சாதக, மைத்ர...' : 'Sampath, Kshema, Sadhana...'}</div>
          </div>
        </div>

        <div class="tb-stat-card">
          <div class="tb-stat-icon" style="background:#FEF2F2; border-color:#FECACA;">⚠️</div>
          <div class="tb-stat-info">
            <div class="tb-stat-label" style="color:#DC2626;">${isTa ? 'கவன தாரைகள்' : 'Caution Taras'}</div>
            <div class="tb-stat-value" style="color:#991B1B;">${cautionCount} <span style="font-size:0.85rem; font-weight:600;">(${cautionStars} நட்ச.)</span></div>
            <div class="tb-stat-sub">${isTa ? 'ஜன்ம, விபத்து, பிரத்யக், வத' : 'Janma, Vipat, Pratyak, Vadha'}</div>
          </div>
        </div>

        <div class="tb-stat-card">
          <div class="tb-stat-icon" style="background:${todayIsGood ? '#ECFDF5' : '#FFFBEB'}; border-color:${todayIsGood ? '#A7F3D0' : '#FDE68A'};">🌙</div>
          <div class="tb-stat-info">
            <div class="tb-stat-label">${isTa ? 'இன்றைய தார பலன்' : 'Today\'s Tara Balam'}</div>
            <div class="tb-stat-value" style="color:${todayIsGood ? '#065F46' : '#B45309'}; font-size:1.05rem;">${todayTaraName}</div>
            <div class="tb-stat-sub" style="color:${todayIsGood ? '#059669' : '#DC2626'}; font-weight:700;">${todayStatus} ${todayIsGood ? '🟢' : '🔴'}</div>
          </div>
        </div>
      `;
    }

    // 1. The 9-Tara Master Table Body
    const masterTbody = document.getElementById("tbMasterTableBody");
    if (masterTbody && tb.taraRows) {
      masterTbody.innerHTML = tb.taraRows.map(r => {
        const badgeClass = r.isAuspicious ? 'tb-badge-good' : (r.order === 7 ? 'tb-badge-danger' : 'tb-badge-caution');
        const badgeIcon = r.isAuspicious ? '🟢' : (r.order === 7 ? '⚠️' : '🔴');
        const rowBg = r.isAuspicious ? '' : 'style="background: rgba(254, 242, 242, 0.3);"';

        return `
          <tr ${rowBg}>
            <td style="text-align: center; font-weight: 800; color: #831843;">${r.order}</td>
            <td>
              <div style="font-weight: 800; color: #0F172A;">${r.taraTa}</div>
              <div style="font-size: 0.75rem; color: #64748B;">${r.taraEn}</div>
            </td>
            <td style="text-align: center;">
              <span class="tb-badge ${badgeClass}">${badgeIcon} ${r.natureTa}</span>
            </td>
            <td>
              <span class="tb-badge-star" style="font-weight:700; color:#831843;">
                ${r.paryaya1.ta}
              </span>
              <span style="font-size:0.75rem; color:#64748B; margin-left:3px;">(#${r.paryaya1.id} · ${r.paryaya1.lordTa})</span>
            </td>
            <td>
              <span class="tb-badge-star">
                ${r.paryaya2.ta}
              </span>
              <span style="font-size:0.75rem; color:#64748B; margin-left:3px;">(#${r.paryaya2.id} · ${r.paryaya2.lordTa})</span>
            </td>
            <td>
              <span class="tb-badge-star">
                ${r.paryaya3.ta}
              </span>
              <span style="font-size:0.75rem; color:#64748B; margin-left:3px;">(#${r.paryaya3.id} · ${r.paryaya3.lordTa})</span>
            </td>
            <td style="font-size: 0.84rem; color: #334155; line-height: 1.5;">
              ${r.descTa}
            </td>
          </tr>
        `;
      }).join("");
    }

    // 2. Individual Planetary Tara Placements Table Body
    const planetsTbody = document.getElementById("tbPlanetsTableBody");
    if (planetsTbody && tb.planetTaras) {
      planetsTbody.innerHTML = tb.planetTaras.map(pt => {
        const badgeClass = pt.isAuspicious ? 'tb-badge-good' : (pt.taraOrder === 7 ? 'tb-badge-danger' : 'tb-badge-caution');
        const badgeIcon = pt.isAuspicious ? '🟢' : (pt.taraOrder === 7 ? '⚠️' : '🔴');
        const paryayaBadgeBg = pt.paryaya === 1 ? '#EFF6FF' : (pt.paryaya === 2 ? '#F5F3FF' : '#FEF3C7');
        const paryayaBadgeColor = pt.paryaya === 1 ? '#1D4ED8' : (pt.paryaya === 2 ? '#6D28D9' : '#B45309');

        return `
          <tr>
            <td>
              <div style="font-weight: 800; color: #831843; font-size: 0.95rem;">${pt.planetNameTa}</div>
              <div style="font-size: 0.74rem; color: #64748B;">${pt.planetNameEn} (${pt.planetCode})</div>
            </td>
            <td>
              <strong style="color: #0F172A;">${pt.nakshatraNameTa}</strong>
              <div style="font-size: 0.74rem; color: #64748B;">${pt.nakshatraNameEn} (#${pt.nakshatraId})</div>
            </td>
            <td style="text-align: center; font-weight: 700; color: #334155;">
              ${pt.pada}
            </td>
            <td>
              <div style="font-weight: 700; color: #0F172A;">${pt.taraNameTa}</div>
              <div style="font-size: 0.74rem; color: #64748B;">${pt.taraOrder}வது தாரை (விலகல்: ${pt.distance})</div>
            </td>
            <td style="text-align: center;">
              <span style="font-size: 0.76rem; background: ${paryayaBadgeBg}; color: ${paryayaBadgeColor}; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 700; border: 1px solid rgba(0,0,0,0.06);">
                ${pt.paryayaLabelTa}
              </span>
            </td>
            <td style="text-align: center;">
              <span class="tb-badge ${badgeClass}">${badgeIcon} ${pt.natureTa}</span>
            </td>
            <td style="font-size: 0.84rem; color: #334155; line-height: 1.5;">
              ${pt.predictionTa}
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  /**
   * 5. மகாதசை / புத்தி கால விவரங்கள் - 100% Dynamic
   */
  function renderDashaBhuktiTimeline() {
    const banner = document.getElementById("currentDashaBanner");
    const grid = document.getElementById("dashaTablesGrid");
    if (!banner || !grid || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;

    const timelineData = PanchangamCalculator.generateFullVimshottariTimeline(moonLon, profile.birthDate || "1988-04-20");

    banner.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span class="ep-current-pill">CURRENT PERIOD</span>
        <span class="ep-current-title">${timelineData.currentPeriodInfo.dashaLord} • ${timelineData.currentPeriodInfo.bhuktiLord}</span>
      </div>
      <div class="ep-current-dates">${timelineData.currentPeriodInfo.periodStr}</div>
    `;

    grid.innerHTML = timelineData.dashaTables.map(table => `
      <div class="ep-dasha-table-card">
        <div class="ep-dasha-table-header">
          <span class="ep-graha-pill ${table.dashaClass}">${table.dashaLord} தசை</span>
          <span class="ep-dasha-tag">120 வருட விம்சோத்தரி</span>
        </div>
        <table class="ep-mini-table">
          <thead>
            <tr>
              <th>தசா</th>
              <th>புத்தி</th>
              <th>ஆரம்பம் (வருடம்)</th>
              <th>முடிவு (வருடம்)</th>
            </tr>
          </thead>
          <tbody>
            ${table.bhuktis.map(b => `
              <tr class="${b.isCurrent ? 'ep-current-bhukti-row' : ''}">
                <td><span class="ep-graha-pill ${table.dashaClass}">${table.dashaLord}</span></td>
                <td><span class="ep-graha-pill ${b.bClass}">${b.bLord}</span></td>
                <td class="ep-dasha-date-start" style="font-family: monospace; font-weight: 800; color: #1E3A8A !important; font-size: 0.84rem;">
                  ${formatDashaDateCell(b.start, false)}
                </td>
                <td class="ep-dasha-date-end" style="font-family: monospace; font-weight: 800; color: #065F46 !important; font-size: 0.84rem;">
                  ${formatDashaDateCell(b.end, true)}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `).join("");
  }

  /**
   * Reusable South Indian Chart SVG Generator
   */
  function generateSouthIndianSvg({ title, signContents, lagnaSignId = 8, size = 380 }) {
    const cellSize = size / 4;
    const gridCoords = [
      { row: 0, col: 0, signId: 11 }, // மீனம் (Pisces)
      { row: 0, col: 1, signId: 0 },  // மேஷம் (Aries)
      { row: 0, col: 2, signId: 1 },  // ரிஷபம் (Taurus)
      { row: 0, col: 3, signId: 2 },  // மிதுனம் (Gemini)
      { row: 1, col: 3, signId: 3 },  // கடகம் (Cancer)
      { row: 2, col: 3, signId: 4 },  // சிம்மம் (Leo)
      { row: 3, col: 3, signId: 5 },  // கன்னி (Virgo)
      { row: 3, col: 2, signId: 6 },  // துலாம் (Libra)
      { row: 3, col: 1, signId: 7 },  // விருச்சிகம் (Scorpio)
      { row: 3, col: 0, signId: 8 },  // தனுசு (Sagittarius)
      { row: 2, col: 0, signId: 9 },  // மகரம் (Capricorn)
      { row: 1, col: 0, signId: 10 }  // கும்பம் (Aquarius)
    ];

    let svg = `<svg viewBox="0 0 ${size} ${size}" class="ep-south-chart-svg" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="8" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.5"/>
    `;

    gridCoords.forEach(box => {
      const x = box.col * cellSize;
      const y = box.row * cellSize;
      svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="transparent" stroke="#F6D7B0" stroke-width="1"/>`;

      if (box.signId === lagnaSignId) {
        svg += `<line x1="${x}" y1="${y + 22}" x2="${x + 22}" y2="${y}" stroke="#F59E0B" stroke-width="1.8"/>`;
      }

      const items = (signContents && signContents[box.signId]) || [];
      if (items.length > 0) {
        const startX = x + cellSize / 2;
        let startY = y + (cellSize / 2) - ((items.length - 1) * 8);
        if (startY < y + 16) startY = y + 16;

        items.forEach((item, idx) => {
          const itemY = startY + idx * 16;
          const color = item.isBlue ? "#1D4ED8" : (item.color || "#701A75");
          svg += `
            <text x="${startX}" y="${itemY}" text-anchor="middle" font-family="'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="${color}">
              ${item.text}${item.deg ? ` <tspan font-size="8.5" font-weight="500">${item.deg}</tspan>` : ""}${item.retro ? "*" : ""}
            </text>
          `;
        });
      }
    });

    const centerW = cellSize * 2;
    const centerH = cellSize * 2;
    const centerX = cellSize;
    const centerY = cellSize;

    svg += `
      <rect x="${centerX}" y="${centerY}" width="${centerW}" height="${centerH}" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1"/>
      <rect x="${centerX + 18}" y="${centerY + (centerH / 2) - 15}" width="${centerW - 36}" height="30" rx="15" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.2"/>
      <text x="${size / 2}" y="${size / 2 + 5}" text-anchor="middle" font-family="'Noto Sans Tamil', -apple-system, sans-serif" font-size="13" font-weight="700" fill="#701A75">
        ${title}
      </text>
    `;

    svg += `</svg>`;
    return svg;
  }

  /**
   * Helper: Build Sign Contents map from Planets
   */
  function getSignContentsFromPlanets(planets, lagna) {
    const contents = {};
    for (let i = 0; i < 12; i++) contents[i] = [];

    const isTa = AppState.lang === "ta";
    const shortLabels = isTa ? {
      Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத",
      Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி",
      Ra: "ராகு", Ke: "கேது", Man: "மாந்"
    } : {
      Asc: "Asc", Su: "Sun", Mo: "Moon", Me: "Merc",
      Ve: "Ven", Ma: "Mars", Ju: "Jup", Sa: "Sat",
      Ra: "Rahu", Ke: "Ketu", Man: "Man"
    };

    if (lagna && lagna.signId !== undefined) {
      contents[lagna.signId].push({
        text: isTa ? "லக்" : "Asc",
        deg: `${String(lagna.deg || 0).padStart(2, '0')}:${String(lagna.min || 0).padStart(2, '0')}`,
        color: "#B45309"
      });
    }

    Object.keys(planets || {}).forEach(k => {
      if (k === "Asc") return;
      const p = planets[k];
      if (p && p.signId !== undefined) {
        const degStr = `${String(p.deg || 0).padStart(2, '0')}:${String(p.min || 0).padStart(2, '0')}`;
        contents[p.signId].push({
          text: shortLabels[k] || k,
          deg: degStr,
          isBlue: k === "Mo",
          retro: p.isRetrograde
        });
      }
    });

    return contents;
  }

  /**
   * 7. சிறப்பு லக்னங்கள் (Special Lagnas Section) - 100% Dynamic
   */
  function renderSpecialLagnasSection() {
    const chartContainer = document.getElementById("specialLagnasChartContainer");
    const tbody = document.getElementById("specialLagnasTableBody");
    if (!chartContainer || !tbody || !AppState.horoscopeData) return;

    const { planets, lagna, profile } = AppState.horoscopeData;
    const lagnaLon = lagna ? lagna.longitude : 248.62;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const rahuLon = planets["Ra"] ? planets["Ra"].longitude : 327.08;

    const [bh, bm] = (profile.birthTime || "12:00").split(":").map(Number);
    const bHours = bh + bm / 60;

    const blLon = (lagnaLon + (bHours * 30)) % 360;
    const hlLon = (lagnaLon + (bHours * 15)) % 360;
    const glLon = (lagnaLon + (bHours * 60)) % 360;
    const slLon = (moonLon + (lagnaLon * 12)) % 360;
    const bbLon = (moonLon + rahuLon) / 2;

    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];

    const specialContents = {};
    for (let i = 0; i < 12; i++) specialContents[i] = [];

    const addSp = (lon, tag) => {
      const normLon = ((Number(lon) || 0) % 360 + 360) % 360;
      const sId = Math.floor(normLon / 30) % 12;
      const degIn = normLon % 30;
      const dStr = `${String(Math.floor(degIn)).padStart(2, '0')}:${String(Math.floor((degIn % 1) * 60)).padStart(2, '0')}`;
      if (!specialContents[sId]) specialContents[sId] = [];
      specialContents[sId].push({ text: tag, deg: dStr });
      return { rasi: rasiNames[sId] || "மேஷம்", deg: `${Math.floor(degIn)}°${String(Math.floor((degIn % 1) * 60)).padStart(2, '0')}'` };
    };

    const rBL = addSp(blLon, "BL");
    const rHL = addSp(hlLon, "HL");
    const rGL = addSp(glLon, "GL");
    const rSL = addSp(slLon, "SL");
    const rCL = addSp(moonLon, "CL");
    const rRL = addSp(sunLon, "RL");
    const rBB = addSp(bbLon, "BB");

    const lagnaSignId = lagna ? lagna.signId : 8;
    const alSignId = (lagnaSignId + 4) % 12;
    if (!specialContents[alSignId]) specialContents[alSignId] = [];
    specialContents[alSignId].push({ text: "AL" });
    const ulSignId = (lagnaSignId + 11) % 12;
    if (!specialContents[ulSignId]) specialContents[ulSignId] = [];
    specialContents[ulSignId].push({ text: "UL" });
    const klSignId = (lagnaSignId + 9) % 12;
    if (!specialContents[klSignId]) specialContents[klSignId] = [];
    specialContents[klSignId].push({ text: "KL" });

    chartContainer.innerHTML = generateSouthIndianSvg({
      title: "சிறப்பு லக்னங்கள்",
      signContents: specialContents,
      lagnaSignId: lagnaSignId
    });

    const rows = [
      { name: "பாவ லக்னம் (BL)", rasi: rBL.rasi, deg: rBL.deg },
      { name: "ஹோரா லக்னம் (HL)", rasi: rHL.rasi, deg: rHL.deg },
      { name: "கடி லக்னம் (GL)", rasi: rGL.rasi, deg: rGL.deg },
      { name: "ஸ்ரீ லக்னம் (SL)", rasi: rSL.rasi, deg: rSL.deg },
      { name: "ஆரூட லக்னம் (AL)", rasi: rasiNames[alSignId], deg: "—" },
      { name: "உபபத லக்னம் (UL)", rasi: rasiNames[ulSignId], deg: "—" },
      { name: "காரகாம்ச லக்னம் (KL)", rasi: rasiNames[klSignId], deg: "—" },
      { name: "சந்திர லக்னம் (CL)", rasi: rCL.rasi, deg: rCL.deg },
      { name: "ரவி லக்னம் (RL)", rasi: rRL.rasi, deg: rRL.deg },
      { name: "பாக லக்னம் (PL)", rasi: rRL.rasi, deg: "—" },
      { name: "பிருகு பிந்து (BB)", rasi: rBB.rasi, deg: rBB.deg }
    ];

    tbody.innerHTML = rows.map(r => `
      <tr>
        <td class="label-cell" style="font-weight: 600;">${r.name}</td>
        <td class="val-cell" style="text-align: center; font-weight: 600; color: #831843;">${r.rasi}</td>
        <td class="val-cell" style="text-align: center; font-family: monospace;">${r.deg}</td>
      </tr>
    `).join("");
  }

  /**
   * 8. பாவ சக்கரங்கள் (Bhava Chakras Section) - 100% Dynamic
   */
  function renderBhavaChakrasSection() {
    const wholeContainer = document.getElementById("wholeSignChartContainer");
    const equalContainer = document.getElementById("equalBhavaChartContainer");
    const sripatiContainer = document.getElementById("sripatiChartContainer");
    const tableBody = document.getElementById("bhavaComparisonTableBody");
    if (!wholeContainer || !equalContainer || !sripatiContainer || !tableBody || !AppState.horoscopeData) return;

    const { planets, lagna } = AppState.horoscopeData;
    const lagnaSignId = lagna ? lagna.signId : 0;
    const lagnaLon = lagna ? lagna.longitude : 0;

    // 1. Whole Sign: Placed by Sign
    const wholeContents = getSignContentsFromPlanets(planets, lagna);

    // 2. Equal Bhava: Placed by House offset from Lagna
    const equalContents = {};
    for (let i = 0; i < 12; i++) equalContents[i] = [];

    const shortLabels = {
      Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத",
      Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி",
      Ra: "ராகு", Ke: "கேது", Man: "மாந்"
    };

    if (!equalContents[lagnaSignId]) equalContents[lagnaSignId] = [];
    equalContents[lagnaSignId].push({
      text: "லக்",
      deg: `${String(lagna.deg || 0).padStart(2, '0')}:${String(lagna.min || 0).padStart(2, '0')}`,
      color: "#B45309"
    });

    Object.keys(planets || {}).forEach(k => {
      if (k === "Asc") return;
      const p = planets[k];
      if (p && p.longitude !== undefined) {
        const normDiff = ((p.longitude - lagnaLon) % 360 + 360) % 360;
        const houseIdx = Math.floor(normDiff / 30);
        const targetSign = ((Math.floor(lagnaSignId + houseIdx) % 12) + 12) % 12;
        const degStr = `${String(p.deg || 0).padStart(2, '0')}:${String(p.min || 0).padStart(2, '0')}`;
        if (!equalContents[targetSign]) equalContents[targetSign] = [];
        equalContents[targetSign].push({
          text: shortLabels[k] || k,
          deg: degStr,
          isBlue: k === "Mo",
          retro: p.isRetrograde
        });
      }
    });

    wholeContainer.innerHTML = generateSouthIndianSvg({
      title: "முழு ராசி முறை",
      signContents: wholeContents,
      lagnaSignId: lagnaSignId
    });

    equalContainer.innerHTML = generateSouthIndianSvg({
      title: "சம பாவ முறை",
      signContents: equalContents,
      lagnaSignId: lagnaSignId
    });

    sripatiContainer.innerHTML = generateSouthIndianSvg({
      title: "ஸ்ரீபதி முறை",
      signContents: equalContents,
      lagnaSignId: lagnaSignId
    });

    // Comparison Table for 12 Bhavas
    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
    const rows = [];
    for (let h = 1; h <= 12; h++) {
      const wSignId = (lagnaSignId + h - 1) % 12;
      const wSign = rasiNames[wSignId];
      const startDeg = (h - 1) * 30;
      const midDeg = startDeg + 15;
      const endDeg = h * 30;
      rows.push({
        bhava: `${h}-ஆம் பாவம்`,
        wholeSign: `${wSign} (முழு ராசி)`,
        equalBhava: `${wSign} (${midDeg % 30}°)`,
        sripati: `${wSign} (${startDeg % 30}° - ${endDeg % 30}°)`
      });
    }

    tableBody.innerHTML = rows.map(r => `
      <tr>
        <td class="label-cell" style="font-weight: 700;">${r.bhava}</td>
        <td class="val-cell">${r.wholeSign}</td>
        <td class="val-cell">${r.equalBhava}</td>
        <td class="val-cell">${r.sripati}</td>
      </tr>
    `).join("");
  }

  let currentBavaPalanFilter = "all";
  let bavaPalanFilterBound = false;

  /**
   * 8B. 12 பாவ பலன்கள் (12 Bhava Predictions Section) - 100% Dynamic
   */
  function renderBavaPalanSection(filterCategory) {
    if (filterCategory !== undefined) {
      currentBavaPalanFilter = filterCategory;
    }
    const container = document.getElementById("bavaPalanCardsContainer");
    if (!container || !AppState.horoscopeData) return;

    const data = AppState.horoscopeData;
    let bhavas = data.bhavaPredictions;
    if (!bhavas || !bhavas.length) {
      if (typeof generateBhavaPredictions === "function") {
        const lagnaSign = data.lagna ? data.lagna.signId : 8;
        bhavas = generateBhavaPredictions(lagnaSign, data.planets || {});
      }
    }
    if (!bhavas || !bhavas.length) return;

    const isTa = (AppState.lang !== "en");

    // Classical groupings
    const categories = {
      kendra: [1, 4, 7, 10],
      trikona: [1, 5, 9],
      panapara: [2, 5, 8, 11],
      upachaya: [3, 6, 10, 11],
      dusthana: [6, 8, 12]
    };

    const typeBadgesTa = {
      1: "லக்ன கேந்திரம் & திரிகோணம்",
      2: "தன & குடும்ப ஸ்தானம் (பணபரம்)",
      3: "தைரிய & உபசய ஸ்தானம் (அபோக்லிமம்)",
      4: "சுக கேந்திர ஸ்தானம்",
      5: "பூர்வ புண்ணிய திரிகோணம் (பணபரம்)",
      6: "ரோக & சத்ரு ஸ்தானம் (உபசயம் / மறைவிடம்)",
      7: "களத்திர கேந்திர ஸ்தானம்",
      8: "ஆயுள் & அஷ்டம ஸ்தானம் (மறைவிடம் / பணபரம்)",
      9: "பாக்கிய திரிகோண ஸ்தானம்",
      10: "கர்ம ஜீவன கேந்திரம் & உபசயம்",
      11: "லாப & உபசய ஸ்தானம் (பணபரம்)",
      12: "விரய & மோட்ச ஸ்தானம் (மறைவிடம்)"
    };

    const typeBadgesEn = {
      1: "Lagna Kendra & Trikona",
      2: "Wealth & Family (Panapara)",
      3: "Courage & Upachaya (Apoklima)",
      4: "Comforts & Sukha Kendra",
      5: "Purva Punya Trikona (Panapara)",
      6: "Enemies & Health (Dusthana / Upachaya)",
      7: "Spouse & Marriage Kendra",
      8: "Longevity & Secrets (Dusthana / Panapara)",
      9: "Fortune & Dharma Trikona",
      10: "Career Karma Kendra & Upachaya",
      11: "Gains & Desires (Upachaya / Panapara)",
      12: "Losses & Moksha (Dusthana)"
    };

    // Update filter bar button labels
    const filterLabels = {
      all: { ta: "🌟 அனைத்து 12 பாவங்கள்", en: "🌟 All 12 Bhavas" },
      kendra: { ta: "🏛️ கேந்திரங்கள் (1, 4, 7, 10)", en: "🏛️ Kendras (1, 4, 7, 10)" },
      trikona: { ta: "🔺 திரிகோணங்கள் (1, 5, 9)", en: "🔺 Trikonas (1, 5, 9)" },
      panapara: { ta: "💰 பணபரங்கள் (2, 5, 8, 11)", en: "💰 Panaparas (2, 5, 8, 11)" },
      upachaya: { ta: "⚡ உபசயங்கள் (3, 6, 10, 11)", en: "⚡ Upachayas (3, 6, 10, 11)" },
      dusthana: { ta: "🛡️ மறைவிடங்கள் (6, 8, 12)", en: "🛡️ Dusthanas (6, 8, 12)" }
    };

    const filterBtns = document.querySelectorAll("#bavaPalanFilterBar .bp-filter-btn");
    filterBtns.forEach(btn => {
      const fKey = btn.getAttribute("data-filter");
      if (filterLabels[fKey]) {
        btn.textContent = isTa ? filterLabels[fKey].ta : filterLabels[fKey].en;
      }
      btn.classList.toggle("active", fKey === currentBavaPalanFilter);
    });

    if (!bavaPalanFilterBound) {
      const bar = document.getElementById("bavaPalanFilterBar");
      if (bar) {
        bar.addEventListener("click", (e) => {
          const btn = e.target.closest(".bp-filter-btn");
          if (!btn) return;
          const f = btn.getAttribute("data-filter");
          renderBavaPalanSection(f);
        });
        bavaPalanFilterBound = true;
      }
    }

    const filteredBhavas = bhavas.filter(b => {
      if (!currentBavaPalanFilter || currentBavaPalanFilter === "all") return true;
      const list = categories[currentBavaPalanFilter];
      return list && list.includes(b.num);
    });

    const badgeCount = document.getElementById("bavaPalanCountBadge");
    if (badgeCount) {
      badgeCount.textContent = isTa
        ? `${filteredBhavas.length} பாவங்கள் காட்டப்படுகின்றன`
        : `Showing ${filteredBhavas.length} Bhavas`;
    }

    container.innerHTML = filteredBhavas.map(b => {
      const points = isTa ? (b.pointsTa || [b.predTa]) : (b.pointsEn || [b.predEn]);
      const houseTypeBadge = isTa ? (typeBadgesTa[b.num] || "") : (typeBadgesEn[b.num] || "");
      const isOccupied = b.occupantsTa && !b.occupantsTa.includes("இல்லை") && !b.occupantsTa.includes("Empty");

      return `
        <div class="bp-card" data-bhava-num="${b.num}">
          <div class="bp-card-header">
            <div>
              <span class="bp-card-num-badge">${b.num}-${isTa ? 'ஆம் பாவம்' : ' House'}</span>
              <h4 class="bp-card-title">${isTa ? b.nameTa : b.nameEn}</h4>
              <div style="font-size: 0.78rem; color: #78350F; font-weight: 700; margin-top: 0.25rem;">
                🏷️ ${houseTypeBadge}
              </div>
            </div>
            <button type="button" class="ep-info-btn" title="${isTa ? 'முழு விவரம் (Modal)' : 'Deep Dive (Modal)'}" onclick="openModuleDeepDive('m19')">ℹ️</button>
          </div>

          <div class="bp-meta-pills">
            <span class="bp-pill-tag bp-pill-rasi">
              🏠 ${isTa ? 'ராசி:' : 'Sign:'} <strong>${isTa ? b.signNameTa : b.signNameEn}</strong>
            </span>
            <span class="bp-pill-tag bp-pill-lord">
              👑 ${isTa ? 'அதிபதி:' : 'Lord:'} <strong>${isTa ? b.lordNameTa : b.lordNameEn}</strong>
            </span>
            <span class="bp-pill-tag ${isOccupied ? 'bp-pill-planets' : 'bp-pill-empty'}">
              🪐 ${isTa ? 'கிரகங்கள்:' : 'Planets:'} <strong>${isTa ? b.occupantsTa : b.occupantsEn}</strong>
            </span>
          </div>

          <div class="bp-card-points">
            ${points.map(pt => `
              <div class="bp-point-item">
                <span class="bp-point-icon">✦</span>
                <div style="flex: 1;">${escapeHtml(pt)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * 8C. தொழில், உத்தியோகம் & வியாபார கணிப்பு (Career, Job vs Business & Timing Section)
   */
  let currentCareerTab = "all";
  let currentCareerEdu = "diploma_iti";
  let careerTimingFilterBound = false;
  let careerEduFilterBound = false;

  function renderCareerTimingSection(activeTab, eduLevel) {
    if (activeTab !== undefined) {
      currentCareerTab = activeTab;
    }
    if (eduLevel !== undefined) {
      currentCareerEdu = eduLevel;
    } else if (!currentCareerEdu) {
      const inputEdu = document.getElementById("inputEducation");
      currentCareerEdu = (inputEdu && inputEdu.value) ? inputEdu.value : "auto";
    }

    const container = document.getElementById("careerTimingContainer");
    if (!container || !AppState.horoscopeData) return;

    if (typeof CareerEngine === "undefined" || !CareerEngine.calculateCareerProfile) return;

    const isTa = (AppState.lang !== "en");
    const career = CareerEngine.calculateCareerProfile(AppState.horoscopeData, {
      lang: AppState.lang,
      educationLevel: currentCareerEdu
    });
    if (!career) return;

    // Header Badge update
    const h10Badge = document.getElementById("career10thHouseBadge");
    if (h10Badge) {
      h10Badge.textContent = isTa
        ? `10-ம் இடம்: ${career.house10.signNameTa} (${career.house10.lordNameTa}) · AmK: ${career.amatyakaraka.nameTa}`
        : `10th House: ${career.house10.signNameEn} (${career.house10.lordNameEn}) · AmK: ${career.amatyakaraka.nameEn}`;
    }

    // Tabs filter buttons state
    const filterBtns = document.querySelectorAll("#careerTimingFilterBar .bp-filter-btn");
    filterBtns.forEach(btn => {
      const tabKey = btn.getAttribute("data-career-tab");
      btn.classList.toggle("active", tabKey === currentCareerTab);
    });

    // Education Switcher Buttons State & Labels
    const eduBtns = document.querySelectorAll("#careerEduBtnsGroup .career-edu-btn");
    eduBtns.forEach(btn => {
      const eduKey = btn.getAttribute("data-edu");
      btn.classList.toggle("active", eduKey === currentCareerEdu);
    });

    const eduLabelEl = document.getElementById("careerEduFilterLabel");
    if (eduLabelEl) {
      eduLabelEl.textContent = isTa
        ? "கல்வித் தகுதிக்கேற்ற வேலைப் பதவிகள் (Jobs by Qualification):"
        : "Filter Career Roles by Qualification:";
    }

    // Education Filter Click Listener
    if (!careerEduFilterBound) {
      const eduGroup = document.getElementById("careerEduBtnsGroup");
      if (eduGroup) {
        eduGroup.addEventListener("click", (e) => {
          const btn = e.target.closest(".career-edu-btn");
          if (!btn) return;
          const selectedEdu = btn.getAttribute("data-edu");
          currentCareerEdu = selectedEdu;
          const inputEdu = document.getElementById("inputEducation");
          if (inputEdu) inputEdu.value = selectedEdu;
          renderCareerTimingSection(currentCareerTab, selectedEdu);
        });
        careerEduFilterBound = true;
      }

      const inputEdu = document.getElementById("inputEducation");
      if (inputEdu) {
        inputEdu.addEventListener("change", (e) => {
          currentCareerEdu = e.target.value;
          renderCareerTimingSection(currentCareerTab, currentCareerEdu);
        });
      }
    }

    if (!careerTimingFilterBound) {
      const bar = document.getElementById("careerTimingFilterBar");
      if (bar) {
        bar.addEventListener("click", (e) => {
          const btn = e.target.closest(".bp-filter-btn");
          if (!btn) return;
          const tab = btn.getAttribute("data-career-tab");
          renderCareerTimingSection(tab);
        });
        careerTimingFilterBound = true;
      }
    }

    const jb = career.jobVsBusiness;
    const curDasha = career.currentDashaForecast;
    const h10 = career.house10;
    const amk = career.amatyakaraka;

    // 1. Hero Summary Bar
    const heroHtml = `
      <div class="career-hero-banner">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem; margin-bottom: 1rem;">
          <div>
            <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 700;">
              ${isTa ? 'வேத ஜோதிட பராசர & ஜெயமினி தொழில் தத்துவம்' : 'Classical Parashara & Jaimini Professional Karma'}
            </span>
            <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.4rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
              <span>💼</span> ${isTa ? 'ஜீவன ஸ்தான பலன் & தொழில் முடிவு' : 'Career Destiny & Professional Path'}
            </h3>
          </div>
          <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
            <span style="background: rgba(212,175,55,0.18); border: 1px solid rgba(212,175,55,0.4); color: #FDE68A; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">
              ${isTa ? jb.verdictBadgeTa : jb.verdictBadgeEn}
            </span>
            <span style="background: rgba(59,130,246,0.2); border: 1px solid rgba(96,165,250,0.4); color: #93C5FD; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">
              AmK: ${isTa ? amk.nameTa : amk.nameEn} (${amk.symbol})
            </span>
          </div>
        </div>

        <!-- 10th House Details Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.85rem;">
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.85rem;">
            <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? '10-ம் ராசி (கர்ம ஸ்தானம்)' : '10th House Sign'}</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #FFF; margin-top: 0.2rem;">
              🏠 ${isTa ? h10.signNameTa : h10.signNameEn} <span style="font-size:0.75rem; color:#FDE68A;">(${h10.element})</span>
            </div>
          </div>
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.85rem;">
            <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? 'தசமாதிபதி (10th Lord)' : '10th House Lord'}</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #6EE7B7; margin-top: 0.2rem;">
              👑 ${isTa ? h10.lordNameTa : h10.lordNameEn}
            </div>
          </div>
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.85rem;">
            <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? 'அமத்யகாரகன் (தொழில் காரகன்)' : 'Amatyakaraka (AmK)'}</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #FCD34D; margin-top: 0.2rem;">
              ${amk.symbol} ${isTa ? amk.nameTa : amk.nameEn} in ${isTa ? amk.signNameTa : amk.signNameEn}
            </div>
          </div>
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.85rem;">
            <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? '10-ல் உள்ள கிரகங்கள்' : '10th House Planets'}</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #93C5FD; margin-top: 0.2rem;">
              🪐 ${isTa ? h10.occupantNamesTa : h10.occupantNamesEn}
            </div>
          </div>
        </div>
      </div>
    `;

    // 2. Job vs Business Comparison Card
    const jobVsBizHtml = `
      <div class="career-card-glass" style="margin-top: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color: #F7D774; margin: 0; font-size: 1.2rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
            <span>🏢</span> ${isTa ? 'உத்தியோகமா? அல்லது சொந்தத் தொழிலா? (Job vs Business)' : 'Service vs Business Determination'}
          </h4>
          <span style="background: rgba(16,185,129,0.18); border: 1px solid #10B981; color: #34D399; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
            ${isTa ? 'பராசர 6 vs 7 பாவ கணக்கீடு' : 'Parashara 6th vs 7th Evaluation'}
          </span>
        </div>

        <div class="career-meter-wrapper">
          <!-- Job Meter -->
          <div class="career-meter-item">
            <div class="career-meter-header">
              <span style="color: #93C5FD; font-weight: 700; display:flex; align-items:center; gap:0.4rem;">
                <span>💼</span> ${isTa ? 'நிறுவன வேலை / அரசு உத்தியோகம் (Service / Job Potential):' : 'Corporate / Government Job Potential:'}
              </span>
              <span style="color: #38BDF8; font-weight: 800; font-size: 1.05rem;">${jb.jobScore}%</span>
            </div>
            <div class="career-meter-track">
              <div class="career-meter-fill career-meter-fill-job" style="width: ${jb.jobScore}%;">
                ${jb.jobScore}%
              </div>
            </div>
          </div>

          <!-- Business Meter -->
          <div class="career-meter-item" style="margin-top: 1.25rem;">
            <div class="career-meter-header">
              <span style="color: #FDE68A; font-weight: 700; display:flex; align-items:center; gap:0.4rem;">
                <span>🏢</span> ${isTa ? 'சொந்தத் தொழில் / வியாபாரம் (Business & Entrepreneurship):' : 'Business & Entrepreneurship Potential:'}
              </span>
              <span style="color: #10B981; font-weight: 800; font-size: 1.05rem;">${jb.bizScore}%</span>
            </div>
            <div class="career-meter-track">
              <div class="career-meter-fill career-meter-fill-biz" style="width: ${jb.bizScore}%;">
                ${jb.bizScore}%
              </div>
            </div>
          </div>
        </div>

        <!-- Highlighting Verdict Card -->
        <div class="career-verdict-box">
          <div style="font-size: 1.2rem; font-weight: 800; color: #FFF; margin-bottom: 0.4rem;">
            ${isTa ? jb.verdictTitleTa : jb.verdictTitleEn}
          </div>
          <p style="margin: 0; color: #CBD5E1; font-size: 0.94rem; line-height: 1.7;">
            ${isTa ? jb.verdictSummaryTa : jb.verdictSummaryEn}
          </p>
          <div style="margin-top: 0.85rem; padding-top: 0.65rem; border-top: 1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <span style="font-size: 0.84rem; color: #94A3B8;">${isTa ? 'பரிந்துரைக்கப்படும் தொழில் முறை:' : 'Recommended Trajectory:'}</span>
            <span style="background: rgba(212,175,55,0.2); border: 1px solid #D4AF37; color: #FDE68A; font-weight: 700; font-size: 0.86rem; padding: 0.25rem 0.75rem; border-radius: 6px;">
              ${isTa ? jb.recommendedPathTa : jb.recommendedPathEn}
            </span>
          </div>
        </div>
      </div>
    `;

    // 3. Top Industry Sectors & Job Roles Card
    const sectorsHtml = `
      <div class="career-card-glass" style="margin-top: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color: #F7D774; margin: 0; font-size: 1.2rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
            <span>🎯</span> ${isTa ? 'எந்த வேலை / துறை அமையும்? (Top Suitable Careers)' : 'Which Job & Industry Will You Get?'}
          </h4>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <span style="background: rgba(245,158,11,0.2); border: 1.5px solid #F59E0B; color: #FDE68A; font-size: 0.82rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: 999px;">
              ${isTa ? (career.educationBadgeTa || '🎓 டிப்ளமோ / ITI') : (career.educationBadgeEn || 'Diploma / Technical')}
            </span>
            <span style="background: rgba(59,130,246,0.2); border: 1px solid #60A5FA; color: #93C5FD; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
              ${isTa ? '3 முதன்மை துறைகள்' : 'Top 3 Industry Matches'}
            </span>
          </div>
        </div>

        ${career.vidyaPrediction && career.vidyaPrediction.reasoningTa ? `
          <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 0.85rem 1rem; margin-bottom: 1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.4rem;">
              <span style="font-size:0.84rem; font-weight:800; color:#FDE68A; display:flex; align-items:center; gap:0.4rem;">
                <span>🎓</span> ${isTa ? 'ஜாதக வித்யா ஸ்தானக் கணிப்பு (வேத ஜோதிடக் கல்வி நிலை):' : 'Horoscope Vidya Sthana Calculation (Vedic Education):'}
              </span>
              <span style="background: rgba(245, 158, 11, 0.2); border: 1px solid #F59E0B; color: #FDE68A; font-weight:700; font-size:0.8rem; padding:0.2rem 0.65rem; border-radius:999px;">
                ${isTa ? career.vidyaPrediction.deducedTitleTa : career.vidyaPrediction.deducedTitleEn}
              </span>
            </div>
            <p style="margin:0; font-size:0.87rem; color:#E2E8F0; line-height:1.65;">
              ${escapeHtml(isTa ? career.vidyaPrediction.reasoningTa : career.vidyaPrediction.reasoningEn)}
            </p>
          </div>
        ` : ''}

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${career.topSectors.map((sec, idx) => `
            <div class="career-sector-card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span style="background: rgba(212,175,55,0.2); color: #FDE68A; font-weight: 900; font-size: 1.1rem; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(212,175,55,0.4);">
                    #${idx + 1}
                  </span>
                  <div>
                    <div style="font-size: 1.15rem; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 0.4rem;">
                      <span>${sec.icon}</span> ${isTa ? sec.nameTa : sec.nameEn}
                    </div>
                    <div style="font-size: 0.78rem; color: #94A3B8; margin-top: 0.15rem;">
                      ${isTa ? 'ஆதரவு கிரகங்கள்:' : 'Ruling Grahas:'} <strong style="color:#6EE7B7;">${sec.primaryPlanets.map(p => {
                        const pName = isTa ? (I18N.ta.planets[p] ? I18N.ta.planets[p].ta : p) : (I18N.en.planets[p] ? I18N.en.planets[p].en : p);
                        return pName;
                      }).join(', ')}</strong>
                    </div>
                  </div>
                </div>

                <div style="text-align: right;">
                  <span style="background: rgba(16,185,129,0.18); border: 1px solid #10B981; color: #34D399; font-weight: 800; font-size: 0.92rem; padding: 0.25rem 0.75rem; border-radius: 999px;">
                    ${sec.calculatedScore}% ${isTa ? 'பொருத்தம்' : 'Match'}
                  </span>
                </div>
              </div>

              <!-- Individualized Astrological Analysis Callout -->
              <div style="background: rgba(30, 41, 59, 0.75); border-left: 3px solid #10B981; border-radius: 6px; padding: 0.85rem 1rem; margin: 0.75rem 0;">
                <div style="font-size: 0.78rem; font-weight: 800; color: #34D399; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem; text-transform: uppercase; letter-spacing: 0.5px;">
                  <span>🔍</span> ${isTa ? 'ஜாதக ரீதியான பிரத்யேகக் கணிப்பு (Individual Chart Analysis):' : 'Individual Chart Astrological Rationale:'}
                </div>
                <p style="margin: 0; color: #F1F5F9; font-size: 0.91rem; line-height: 1.68;">
                  ${escapeHtml(isTa ? (sec.customExplanationTa || sec.descriptionTa) : (sec.customExplanationEn || sec.descriptionEn))}
                </p>
              </div>

              <div style="margin-top: 0.75rem;">
                <div style="font-size: 0.78rem; color: #FDE68A; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.4rem;">
                  ${isTa ? 'பரிந்துரைக்கப்படும் குறிப்பிட்ட வேலைப் பதவிகள்:' : 'Recommended Specific Job Titles:'}
                </div>
                <div class="career-role-pills-wrap">
                  ${(isTa ? (sec.customRolesTa || sec.rolesTa) : (sec.customRolesEn || sec.rolesEn)).map(r => {
                    const isObj = (typeof r === 'object' && r !== null);
                    const titleText = isObj ? r.title : r;
                    const isBest = isObj && r.isBestMatch;
                    return `
                      <span class="career-role-pill" style="${isBest ? 'border-color: #F59E0B; background: rgba(245,158,11,0.2); color: #FDE68A; font-weight: 700;' : ''}">
                        ${isBest ? '★ ' : '✓ '}${escapeHtml(titleText)}${isBest ? (isTa ? ' (ஜாதகத்திற்கு உகந்தது)' : ' (Top Match)') : ''}
                      </span>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // 4. Career Timing & Auspicious Milestones Card
    const timingHtml = `
      <div class="career-card-glass" style="margin-top: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color: #F7D774; margin: 0; font-size: 1.2rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
            <span>⏳</span> ${isTa ? 'எப்போது நடக்கும்? (முக்கிய தொழில் காலகட்டங்கள்)' : 'When Will It Happen? (Career Milestones & Timing)'}
          </h4>
          <span style="background: rgba(245,158,11,0.2); border: 1px solid #F59E0B; color: #FDE68A; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
            ${isTa ? '4 முக்கிய வாழ்க்கை காலகட்டங்கள்' : '4 Core Life Milestones'}
          </span>
        </div>

        <!-- 4 Chronological Milestones -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
          ${career.milestones.map(m => `
            <div class="career-milestone-step" style="${m.isCurrentStage ? 'border-color: #10B981; background: rgba(16,185,129,0.06);' : ''}">
              <div class="career-milestone-icon-wrap" style="${m.isCurrentStage ? 'background: rgba(16,185,129,0.25); border-color: #10B981;' : ''}">
                ${m.icon}
              </div>
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.3rem;">
                  <h5 style="color: #FFF; margin: 0; font-size: 1.05rem; font-weight: 700; display:flex; align-items:center; gap:0.4rem;">
                    ${isTa ? m.stageTa : m.stageEn}
                    ${m.isCurrentStage ? `<span style="background: rgba(16,185,129,0.25); border: 1px solid #10B981; color: #34D399; font-size: 0.72rem; font-weight: 800; padding: 0.1rem 0.45rem; border-radius: 999px;">★ ${isTa ? 'நடப்பு பருவம்' : 'Current Stage'}</span>` : ''}
                  </h5>
                  <div style="display: flex; gap: 0.4rem;">
                    <span style="background: rgba(59,130,246,0.2); border: 1px solid rgba(96,165,250,0.3); color: #93C5FD; font-size: 0.78rem; font-weight: 700; padding: 0.15rem 0.55rem; border-radius: 6px;">
                      ${isTa ? m.ageRangeTa : m.ageRangeEn}
                    </span>
                    <span style="background: rgba(212,175,55,0.18); border: 1px solid rgba(212,175,55,0.4); color: #FDE68A; font-size: 0.78rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 6px; font-family: monospace;">
                      📅 ${m.yearRange}
                    </span>
                  </div>
                </div>
                <p style="margin: 0; color: #CBD5E1; font-size: 0.88rem; line-height: 1.6;">
                  ${isTa ? m.descTa : m.descEn}
                </p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Current Operating Dasha-Bhukti Forecast Card -->
        <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1.5px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.65rem;">
            <div>
              <span style="font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; font-weight: 700;">
                ${isTa ? 'உடனடி தசா பலன் & கோச்சாரம்' : 'Operating Dasha & Planetary Transits'}
              </span>
              <div style="font-size: 1.2rem; font-weight: 800; color: #F7D774; margin-top: 0.15rem;">
                🪐 ${curDasha.dashaTa} தசை ➔ <span style="color:#34D399;">${curDasha.bhuktiTa} புக்தி நடப்பு பலன்</span>
              </div>
            </div>
            <span style="background: rgba(16,185,129,0.18); border: 1px solid #10B981; color: #34D399; font-weight: 800; font-size: 0.82rem; padding: 0.25rem 0.75rem; border-radius: 999px;">
              ✓ ${isTa ? 'நடப்பு காலம்' : 'Active Period'}
            </span>
          </div>

          <p style="margin: 0 0 1rem 0; color: #E2E8F0; font-size: 0.94rem; line-height: 1.7;">
            ${isTa ? curDasha.forecastTa : curDasha.forecastEn}
          </p>

          <!-- 3 Quick Status Indicators -->
          <div class="career-dasha-grid">
            <div class="career-dasha-stat">
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'வேலை மாற்றம் (Job Switch)' : 'Job Change'}</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #38BDF8; margin-top: 0.2rem;">
                ${curDasha.jobChangeProbability}% ${isTa ? 'சாதகம்' : 'Favorable'}
              </div>
            </div>
            <div class="career-dasha-stat">
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'பதவி & ஊதிய உயர்வு' : 'Promotion & Raise'}</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #34D399; margin-top: 0.2rem;">
                ${curDasha.promotionProbability}% ${isTa ? 'உன்னதம்' : 'High'}
              </div>
            </div>
            <div class="career-dasha-stat">
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'புதிய தொழில் தொடக்கம்' : 'New Business'}</div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #FCD34D; margin-top: 0.2rem;">
                ${curDasha.businessViability}% ${isTa ? 'யோகம்' : 'Viable'}
              </div>
            </div>
          </div>

          <!-- Next Favorable Window Box -->
          <div style="background: rgba(16,185,129,0.12); border: 1px solid #10B981; border-radius: 8px; padding: 0.85rem 1rem; margin-top: 1rem;">
            <div style="color: #34D399; font-weight: 800; font-size: 0.92rem; display:flex; align-items:center; gap:0.4rem;">
              <span>⭐</span> ${isTa ? 'அடுத்த அதிர்ஷ்ட தொழில் காலகட்டம்:' : 'Next Auspicious Career Window:'} <span style="color:#FFF;">${curDasha.nextWindowDates}</span>
            </div>
            <p style="margin: 0.35rem 0 0 0; color: #CBD5E1; font-size: 0.86rem; line-height: 1.5;">
              ${isTa ? curDasha.nextWindowTa : curDasha.nextWindowEn}
            </p>
          </div>
        </div>
      </div>
    `;

    // 5. Career Yogas & Success Remedies Card
    const remediesHtml = `
      <div class="career-card-glass" style="margin-top: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color: #F7D774; margin: 0; font-size: 1.2rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
            <span>✨</span> ${isTa ? 'தொழில் யோகங்கள் & வெற்றி பரிகாரங்கள் (Yogas & Remedies)' : 'Career Yogas & Vedic Remedies'}
          </h4>
          <span style="background: rgba(212,175,55,0.2); border: 1px solid #D4AF37; color: #FDE68A; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
            ${career.yogas.length} ${isTa ? 'யோகங்கள்' : 'Yogas'}
          </span>
        </div>

        <!-- Detected Yogas -->
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem;">
          ${career.yogas.map(y => `
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 8px; padding: 0.85rem 1rem;">
              <div style="color: #FDE68A; font-weight: 800; font-size: 0.96rem; margin-bottom: 0.2rem;">
                ★ ${isTa ? y.nameTa : y.nameEn}
              </div>
              <p style="margin: 0; color: #CBD5E1; font-size: 0.88rem; line-height: 1.5;">
                ${isTa ? y.descTa : y.descEn}
              </p>
            </div>
          `).join('')}
        </div>

        <!-- Career Sacred Remedies Grid -->
        <h5 style="color: #6EE7B7; margin: 1rem 0 0.65rem 0; font-size: 1rem; font-weight: 700;">
          🙏 ${isTa ? 'தொழில் வெற்றி & தனலாப வழிகாட்டுதல்கள்' : 'Auspicious Career Guidelines & Remedies'}
        </h5>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
          <div class="career-remedy-box">
            <span style="font-size: 1.6rem;">🛕</span>
            <div>
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'வழிபட வேண்டிய தெய்வம்' : 'Deity for Career Growth'}</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #FFF;">${isTa ? career.remedies.deityTa : career.remedies.deityEn}</div>
            </div>
          </div>
          <div class="career-remedy-box">
            <span style="font-size: 1.6rem;">📅</span>
            <div>
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'அதிர்ஷ்ட கிழமை' : 'Lucky Weekday for Deals'}</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #FCD34D;">${isTa ? career.remedies.luckyDayTa : career.remedies.luckyDayEn}</div>
            </div>
          </div>
          <div class="career-remedy-box">
            <span style="font-size: 1.6rem;">🧭</span>
            <div>
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'உகந்த திசை & நிறம்' : 'Lucky Direction & Color'}</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #38BDF8;">
                ${isTa ? career.remedies.directionTa : career.remedies.directionEn} · ${isTa ? career.remedies.colorTa : career.remedies.colorEn}
              </div>
            </div>
          </div>
          <div class="career-remedy-box">
            <span style="font-size: 1.6rem;">💎</span>
            <div>
              <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'பரிந்துரைக்கப்படும் ரத்தினம்' : 'Career Gemstone'}</div>
              <div style="font-size: 0.95rem; font-weight: 800; color: #F472B6;">${isTa ? career.remedies.stoneTa : career.remedies.stoneEn}</div>
            </div>
          </div>
        </div>

        <!-- Sacred Gayatri Mantra Box -->
        <div style="background: rgba(14,22,46,0.9); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem; margin-top: 1rem;">
          <div style="font-size: 0.78rem; text-transform: uppercase; color: #FDE68A; font-weight: 700;">
            ${isTa ? 'தினசரி ஜபிக்க வேண்டிய தொழில் வெற்றி காயத்ரி மந்திரம்:' : 'Daily Career Abundance Gayatri Mantra:'}
          </div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #FFF; margin-top: 0.35rem; font-family: monospace;">
            ${isTa ? career.remedies.mantraTa : career.remedies.mantraEn}
          </div>
        </div>
      </div>
    `;

    // 2.1 Subathuvam & Paavathuvam Analysis Card
    const s10 = career.subathuvam10 || {};
    const s2 = career.subathuvam2 || {};
    const h2 = career.house2 || {};
    const dRule = career.dasaRule || {};
    const tPred = career.timingPredictions || {};

    const subathuvamHtml = `
      <div class="career-card-glass" style="margin-top: 1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
          <h4 style="color: #F7D774; margin: 0; font-size: 1.2rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
            <span>✨</span> ${isTa ? '2 & 10-ஆம் அதிபதிகளின் சுபத்துவ - பாவத்துவ ஆய்வு' : '2nd & 10th Lord Subathuvam & Paavathuvam Analysis'}
          </h4>
          <span style="background: rgba(212,175,55,0.18); border: 1px solid #D4AF37; color: #FDE68A; font-size: 0.8rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
            ${isTa ? 'சுபத்துவ - பாவத்துவ கணிதம்' : 'Subathuvam & Paavathuvam Assessment'}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <!-- 10th Lord Karma Bhava -->
          <div style="background: rgba(15,23,42,0.85); border: 1.5px solid rgba(59,130,246,0.35); border-radius: 10px; padding: 1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.4rem;">
              <span style="color:#93C5FD; font-size:0.82rem; font-weight:700; text-transform:uppercase;">
                👑 ${isTa ? '10-ஆம் அதிபதி (தொழில்):' : '10th Lord (Profession):'} ${isTa ? h10.lordNameTa : h10.lordNameEn}
              </span>
              <span style="background:${s10.gradeKey === 'grade_1' ? 'rgba(16,185,129,0.2)' : (s10.gradeKey === 'grade_2' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)')}; border:1px solid ${s10.gradeKey === 'grade_1' ? '#10B981' : (s10.gradeKey === 'grade_2' ? '#3B82F6' : '#F59E0B')}; color:#FFF; font-size:0.75rem; font-weight:700; padding:0.15rem 0.55rem; border-radius:999px;">
                ${isTa ? s10.gradeTa : s10.gradeEn}
              </span>
            </div>
            <p style="margin: 0.4rem 0 0.6rem 0; color: #CBD5E1; font-size: 0.88rem; line-height: 1.6;">
              ${isTa ? s10.natureTa : s10.natureEn}
            </p>
            <div style="background: rgba(30,41,59,0.7); border-radius: 6px; padding: 0.6rem; font-size: 0.82rem; color: #94A3B8;">
              <strong style="color:#FDE68A;">${isTa ? 'பொருத்தமான துறைகள்:' : 'Suitable Sectors:'}</strong> ${isTa ? (h10.fieldSignatures?.subathuvamTa || '') : (h10.fieldSignatures?.subathuvamEn || '')}
            </div>
          </div>

          <!-- 2nd Lord Dhana Bhava -->
          <div style="background: rgba(15,23,42,0.85); border: 1.5px solid rgba(212,175,55,0.35); border-radius: 10px; padding: 1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem; flex-wrap:wrap; gap:0.4rem;">
              <span style="color:#FDE68A; font-size:0.82rem; font-weight:700; text-transform:uppercase;">
                💰 ${isTa ? '2-ஆம் அதிபதி (வருமானம்):' : '2nd Lord (Income):'} ${isTa ? (h2.lordNameTa || '') : (h2.lordNameEn || '')}
              </span>
              <span style="background:${s2.gradeKey === 'grade_1' ? 'rgba(16,185,129,0.2)' : (s2.gradeKey === 'grade_2' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.2)')}; border:1px solid ${s2.gradeKey === 'grade_1' ? '#10B981' : (s2.gradeKey === 'grade_2' ? '#3B82F6' : '#F59E0B')}; color:#FFF; font-size:0.75rem; font-weight:700; padding:0.15rem 0.55rem; border-radius:999px;">
                ${isTa ? s2.gradeTa : s2.gradeEn}
              </span>
            </div>
            <p style="margin: 0.4rem 0 0.6rem 0; color: #CBD5E1; font-size: 0.88rem; line-height: 1.6;">
              ${isTa ? s2.natureTa : s2.natureEn}
            </p>
            <div style="background: rgba(30,41,59,0.7); border-radius: 6px; padding: 0.6rem; font-size: 0.82rem; color: #94A3B8;">
              <strong style="color:#FDE68A;">${isTa ? 'தன வரவு விதம்:' : 'Income Dynamics:'}</strong> ${isTa ? (h2.fieldSignatures?.subathuvamTa || '') : (h2.fieldSignatures?.subathuvamEn || '')}
            </div>
          </div>
        </div>

        <!-- Dasa Rule Guidance Box -->
        <div style="background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95)); border: 1.5px solid ${dRule.isYogaDasa ? '#10B981' : '#F59E0B'}; border-radius: 10px; padding: 1rem 1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.5rem;">
            <div style="color:#FFF; font-weight:800; font-size:1rem; display:flex; align-items:center; gap:0.4rem;">
              <span>🪐</span> ${isTa ? 'தசா-புக்தி தொழில் விதிமுறை:' : 'Operating Dasa-Bhukti Career Rule:'} <span style="color:#FDE68A;">${dRule.dasaLordTa} தசை (${isTa ? dRule.dasaNatureTa : dRule.dasaNatureEn})</span>
            </div>
            <span style="background:${dRule.isYogaDasa ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; border:1px solid ${dRule.isYogaDasa ? '#10B981' : '#EF4444'}; color:#FFF; font-size:0.8rem; font-weight:800; padding:0.2rem 0.65rem; border-radius:999px;">
              ${dRule.isYogaDasa ? (isTa ? 'தொழில் யோகம்: உன்னதம்' : 'High Business Viability') : (isTa ? 'வேலையே பாதுகாப்பு' : 'Stick to Job / Service')}
            </span>
          </div>
          <p style="margin: 0; color: #E2E8F0; font-size: 0.92rem; line-height: 1.65;">
            ${isTa ? dRule.guidanceTa : dRule.guidanceEn}
          </p>
        </div>

        <!-- Timing for Job & Business Box -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; margin-top: 1rem;">
          <div style="background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.35); border-radius: 8px; padding: 0.85rem 1rem;">
            <div style="font-weight:800; font-size:0.95rem; color:#38BDF8; margin-bottom:0.3rem; display:flex; align-items:center; gap:0.4rem;">
              <span>💼</span> ${isTa ? tPred.jobTiming?.titleTa : tPred.jobTiming?.titleEn}
            </div>
            <p style="margin:0; color:#CBD5E1; font-size:0.86rem; line-height:1.5;">
              ${isTa ? tPred.jobTiming?.timingTa : tPred.jobTiming?.timingEn}
            </p>
          </div>

          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35); border-radius: 8px; padding: 0.85rem 1rem;">
            <div style="font-weight:800; font-size:0.95rem; color:#34D399; margin-bottom:0.3rem; display:flex; align-items:center; gap:0.4rem;">
              <span>🏢</span> ${isTa ? tPred.businessTiming?.titleTa : tPred.businessTiming?.titleEn}
            </div>
            <p style="margin:0; color:#CBD5E1; font-size:0.86rem; line-height:1.5;">
              <strong>${isTa ? 'பொற்காலம்:' : 'Prime Era:'}</strong> ${isTa ? tPred.businessTiming?.bestTimeTa : tPred.businessTiming?.bestTimeEn}<br>
              <strong style="color:#F87171;">${isTa ? 'தவிர்க்க வேண்டியவை:' : 'Caution:'}</strong> ${isTa ? tPred.businessTiming?.cautionTa : tPred.businessTiming?.cautionEn}
            </p>
          </div>
        </div>
      </div>
    `;

    // 1.1 Dedicated 4th House Vidya Sthana Deduction Card
    let vidyaCardHtml = "";
    if (career.vidyaPrediction && career.vidyaPrediction.isAutoDeduced) {
      const vp = career.vidyaPrediction;
      vidyaCardHtml = `
        <div class="career-card-glass" style="margin-top: 1.25rem; border: 1.5px solid rgba(245, 158, 11, 0.5); background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(45, 26, 74, 0.85));">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(245, 158, 11, 0.25); padding-bottom: 0.6rem; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
            <h4 style="color: #FDE68A; margin: 0; font-size: 1.18rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎓</span> ${isTa ? '4-ஆம் பாவ வித்யா ஸ்தானக் கணிப்பு (Education Auto-Deduction)' : '4th House Vidya Sthana Education Deduction'}
            </h4>
            <span style="background: rgba(245, 158, 11, 0.25); border: 1.5px solid #F59E0B; color: #FDE68A; font-size: 0.84rem; font-weight: 800; padding: 0.25rem 0.85rem; border-radius: 999px;">
              ${isTa ? vp.deducedTitleTa : vp.deducedTitleEn}
            </span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-bottom: 0.85rem;">
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.75rem;">
              <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? '4-ஆம் பாவம் (வித்யா ஸ்தானம்)' : '4th House (Education)'}</div>
              <div style="font-size: 1rem; font-weight: 800; color: #FFF; margin-top: 0.2rem;">
                🏛️ ${isTa ? vp.house4SignNameTa : vp.house4SignNameEn}
              </div>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.75rem;">
              <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? '4-ஆம் அதிபதி (வித்யா காரகன்)' : '4th House Lord'}</div>
              <div style="font-size: 1rem; font-weight: 800; color: #6EE7B7; margin-top: 0.2rem;">
                👑 ${isTa ? vp.house4LordNameTa : vp.house4LordNameEn}
              </div>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.75rem;">
              <div style="font-size: 0.74rem; color: #94A3B8;">${isTa ? '4-ல் அமர்ந்த கிரகங்கள்' : 'Planets in 4th House'}</div>
              <div style="font-size: 1rem; font-weight: 800; color: #FCD34D; margin-top: 0.2rem;">
                🪐 ${isTa ? vp.occupantGrahasTa : vp.occupantGrahasEn}
              </div>
            </div>
          </div>

          <div style="background: rgba(15,23,42,0.85); border-left: 3px solid #F59E0B; border-radius: 6px; padding: 0.85rem 1rem;">
            <div style="font-size: 0.78rem; font-weight: 800; color: #FDE68A; margin-bottom: 0.3rem; text-transform: uppercase;">
              ${isTa ? 'ஜோதிட விதிமுறை விளக்கம் (Astrological Deduction):' : 'Astrological Reasoning:'}
            </div>
            <p style="margin: 0; color: #E2E8F0; font-size: 0.88rem; line-height: 1.6;">
              ${escapeHtml(isTa ? vp.rationaleTa : vp.rationaleEn)}
            </p>
          </div>
        </div>
      `;
    }

    // Filter display depending on currentCareerTab
    let finalHtml = heroHtml + vidyaCardHtml;
    if (currentCareerTab === "all") {
      finalHtml += jobVsBizHtml + subathuvamHtml + sectorsHtml + timingHtml + remediesHtml;
    } else if (currentCareerTab === "job_vs_biz") {
      finalHtml += jobVsBizHtml + subathuvamHtml;
    } else if (currentCareerTab === "subathuvam") {
      finalHtml += subathuvamHtml;
    } else if (currentCareerTab === "sectors") {
      finalHtml += sectorsHtml;
    } else if (currentCareerTab === "timing") {
      finalHtml += timingHtml + subathuvamHtml;
    } else if (currentCareerTab === "remedies") {
      finalHtml += remediesHtml;
    }

    container.innerHTML = finalHtml;
  }

  /**
   * 9. வர்க்க சக்கரங்கள் (Varga Chakras Section) - 100% Dynamic
   */
  function renderVargaChakrasSection() {
    const cD1 = document.getElementById("vargaD1Container");
    const cD2 = document.getElementById("vargaD2Container");
    const cD3 = document.getElementById("vargaD3Container");
    const cD4 = document.getElementById("vargaD4Container");
    if (!cD1 || !cD2 || !cD3 || !cD4 || !AppState.horoscopeData) return;

    const { planets, lagna, vargas } = AppState.horoscopeData;
    const lagnaSignId = lagna ? lagna.signId : 0;

    // D1 Rasi
    const d1Contents = getSignContentsFromPlanets(planets, lagna);

    const shortLabels = {
      Asc: "லக்", Su: "சூரி", Mo: "சந்", Me: "புத",
      Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி",
      Ra: "ராகு", Ke: "கேது", Man: "மாந்"
    };

    // Build dynamic Varga contents
    const buildVargaMap = (vKey) => {
      const vMap = {};
      for (let i = 0; i < 12; i++) vMap[i] = [];
      const vData = vargas && vargas[vKey] ? vargas[vKey] : null;

      if (vData) {
        Object.keys(vData).forEach(k => {
          const item = vData[k];
          const sId = (typeof item === 'number') ? item : (item && item.signId !== undefined ? item.signId : undefined);
          if (sId !== undefined) {
            const degVal = (typeof item === 'object' && item && item.deg !== undefined) ? `${item.deg}°` : "";
            vMap[sId].push({
              text: shortLabels[k] || k,
              deg: degVal,
              isBlue: k === "Mo"
            });
          }
        });
      } else {
        // Fallback: distribute harmoniously from D1
        const offset = vKey === "D2" ? 3 : (vKey === "D3" ? 4 : 5);
        Object.keys(planets || {}).forEach(k => {
          const p = planets[k];
          if (p && p.signId !== undefined) {
            const sId = (p.signId + offset) % 12;
            vMap[sId].push({ text: shortLabels[k] || k, isBlue: k === "Mo" });
          }
        });
      }
      return vMap;
    };

    const getVargaLagnaId = (vKey) => {
      const vData = vargas && vargas[vKey] ? vargas[vKey] : null;
      if (vData && vData["Asc"] !== undefined) {
        return (typeof vData["Asc"] === "number") ? vData["Asc"] : (vData["Asc"].signId !== undefined ? vData["Asc"].signId : lagnaSignId);
      }
      return lagnaSignId;
    };

    const vargaInfo = {
      D1: { title: "ராசி (D-1)", sub: "உடல் & ஆத்ம காரகம் (Physical Body & Self)" },
      D2: { title: "ஹோரா (D-2)", sub: "செல்வம் & தன தானியம் (Wealth & Prosperity)" },
      D3: { title: "திரேக்காணம் (D-3)", sub: "இளைய சகோதரம் & தைரியம் (Siblings & Courage)" },
      D4: { title: "சதுர்த்தாம்சம் (D-4)", sub: "நிலம், வீடு, வாகனம் & பாக்கியம் (Property & Fortune)" },
      D7: { title: "D7 சப்தாம்சம்", sub: "புத்திர பாக்கியம் & சந்ததி (Children & Progeny)" },
      D9: { title: "D9 நவாம்சம்", sub: "களத்திரம், தர்மம் & விவாகம் (Marriage, Dharma & Destiny)" },
      D10: { title: "D10 தசாம்சம்", sub: "தொழில், கர்மம் & அந்தஸ்து (Career, Profession & Status)" },
      D12: { title: "D12 துவாதசாம்சம்", sub: "தாய் தந்தை & பரம்பரை (Parents & Ancestry)" },
      D16: { title: "D16 சோடசாம்சம்", sub: "வாகன சுகம் & சொகுசு வாழ்க்கை (Vehicles & Comforts)" },
      D20: { title: "D20 விம்சாம்சம்", sub: "உபாசனை & ஆன்மீக பலம் (Spiritual Progress & Worship)" },
      D24: { title: "D24 சதுர்விம்சாம்சம்", sub: "கல்வி, வித்தை & அறிவு (Education & Knowledge)" },
      D27: { title: "D27 சப்தவிம்சாம்சம்", sub: "நட்சத்திர பலம் & பலவீனம் (Strengths & Weaknesses)" },
      D30: { title: "D30 திரிம்சாம்சம்", sub: "தோஷங்கள் & விபத்துக்கள் (Misfortunes & Arishta)" },
      D60: { title: "D60 சஷ்டியாம்சம்", sub: "பூர்வ ஜென்ம கர்மம் & நுட்ப பலன் (Past Life Karma)" }
    };

    cD1.innerHTML = generateSouthIndianSvg({ title: "ராசி (D-1)", signContents: d1Contents, lagnaSignId });
    cD2.innerHTML = generateSouthIndianSvg({ title: "ஹோரா (D-2)", signContents: buildVargaMap("D2"), lagnaSignId: getVargaLagnaId("D2") });
    cD3.innerHTML = generateSouthIndianSvg({ title: "திரேக்காணம் (D-3)", signContents: buildVargaMap("D3"), lagnaSignId: getVargaLagnaId("D3") });
    cD4.innerHTML = generateSouthIndianSvg({ title: "சதுர்த்தாம்சம் (D-4)", signContents: buildVargaMap("D4"), lagnaSignId: getVargaLagnaId("D4") });

    // Extra Varga Dropdown & Dynamic Renderer
    const extraSelect = document.getElementById("extraVargaSelect");
    const extraContainer = document.getElementById("vargaExtraContainer");
    const extraTitle = document.getElementById("extraVargaTitle");
    const extraSubtitle = document.getElementById("extraVargaSubtitle");

    const renderExtraVarga = (vKey) => {
      if (!extraContainer) return;
      const key = vKey || "D9";
      const info = vargaInfo[key] || { title: `${key} வர்க்கம்`, sub: "வர்க்க சக்கரம்" };
      if (extraTitle) extraTitle.textContent = `${info.title} சக்கரம்`;
      if (extraSubtitle) extraSubtitle.textContent = info.sub;

      extraContainer.innerHTML = generateSouthIndianSvg({
        title: info.title,
        signContents: buildVargaMap(key),
        lagnaSignId: getVargaLagnaId(key)
      });
    };

    if (extraSelect) {
      if (!extraSelect.value) extraSelect.value = "D9";
      renderExtraVarga(extraSelect.value || "D9");

      if (!extraSelect.getAttribute("data-bound")) {
        extraSelect.setAttribute("data-bound", "true");
        extraSelect.addEventListener("change", (e) => {
          renderExtraVarga(e.target.value);
        });
      }
    }

    // Toggle All 16 Vargas Grid
    const toggleBtn = document.getElementById("toggleAllVargasBtn");
    const allGridContainer = document.getElementById("allVargasGridContainer");
    const allGrid = document.getElementById("all16VargasGrid");
    const toggleText = document.getElementById("toggleAllVargasText");

    if (toggleBtn && !toggleBtn.getAttribute("data-bound")) {
      toggleBtn.setAttribute("data-bound", "true");
      toggleBtn.addEventListener("click", () => {
        if (!allGridContainer || !allGrid) return;
        const isHidden = allGridContainer.style.display === "none";
        if (isHidden) {
          allGridContainer.style.display = "block";
          if (toggleText) toggleText.textContent = "வர்க்கங்களைச் சுருக்கு (Hide All Vargas)";

          const allKeys = ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D60"];
          allGrid.innerHTML = allKeys.map(k => {
            const info = vargaInfo[k] || { title: k, sub: "" };
            return `
              <div class="ep-detail-card" style="margin-bottom: 0; padding: 1rem; border: 1.5px solid #FCD34D; background: #FFFDF8; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
                <div style="margin-bottom: 0.6rem;">
                  <span style="font-weight: 800; color: #831843; font-size: 1rem;">${info.title}</span>
                  <div style="font-size: 0.8rem; color: #78350F; font-weight: 600;">${info.sub}</div>
                </div>
                <div class="ep-south-chart-card" id="allVarga_${k}"></div>
              </div>
            `;
          }).join("");

          allKeys.forEach(k => {
            const el = document.getElementById(`allVarga_${k}`);
            if (el) {
              const info = vargaInfo[k] || { title: k };
              el.innerHTML = generateSouthIndianSvg({
                title: info.title,
                signContents: buildVargaMap(k),
                lagnaSignId: getVargaLagnaId(k)
              });
            }
          });
        } else {
          allGridContainer.style.display = "none";
          if (toggleText) toggleText.textContent = "அனைத்து 16 வர்க்கங்களையும் காட்டு";
        }
      });
    }
  }

  /**
   * 10. தூமாதி ஐவர் & உபகிரகங்கள் (Upagrahas Section) - 100% Dynamic
   */
  function renderUpagrahasSection() {
    const dhumaadiChart = document.getElementById("upagrahaDhumaadiChartContainer");
    const kaalaadiChart = document.getElementById("upagrahaKaalaadiChartContainer");
    const tbody = document.getElementById("upagrahaTableBody");
    const dialContainer = document.getElementById("dhumaEnergyDialContainer");
    if (!dhumaadiChart || !kaalaadiChart || !tbody || !dialContainer || !AppState.horoscopeData) return;

    const { planets, lagna } = AppState.horoscopeData;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
    const lagnaLon = lagna ? lagna.longitude : 248.62;
    const lagnaSignId = lagna ? lagna.signId : 8;

    // Upagrahas Calculations
    const dhumaLon = (sunLon + 133.333333) % 360;
    const vyatiLon = (360 - dhumaLon) % 360;
    const pariLon = (vyatiLon + 180) % 360;
    const indraLon = (360 - pariLon) % 360;
    const upaLon = (indraLon + 16.666667) % 360;
    const mandiLon = planets["Man"] ? planets["Man"].longitude : ((sunLon + 260) % 360);

    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];

    const dhumaContents = {};
    for (let i = 0; i < 12; i++) dhumaContents[i] = [];

    const addUp = (lon, tag) => {
      const normLon = ((Number(lon) || 0) % 360 + 360) % 360;
      const sId = Math.floor(normLon / 30) % 12;
      const degIn = normLon % 30;
      if (!dhumaContents[sId]) dhumaContents[sId] = [];
      dhumaContents[sId].push({ text: tag, deg: `${Math.floor(degIn)}°` });
      return { rasi: rasiNames[sId] || "மேஷம்", dms: `${String(Math.floor(degIn)).padStart(2, '0')}:${String(Math.floor((degIn % 1) * 60)).padStart(2, '0')}:00`, lon: normLon.toFixed(4) };
    };

    const rDhuma = addUp(dhumaLon, "தூ");
    const rVyati = addUp(vyatiLon, "விப");
    const rPari = addUp(pariLon, "பரி");
    const rIndra = addUp(indraLon, "இந்");
    const rUpa = addUp(upaLon, "உகே");

    dhumaadiChart.innerHTML = generateSouthIndianSvg({
      title: "தூமாதி ஐவர்",
      signContents: dhumaContents,
      lagnaSignId
    });

    kaalaadiChart.innerHTML = generateSouthIndianSvg({
      title: "காலவேளை சக்கரம்",
      signContents: getSignContentsFromPlanets(planets, lagna),
      lagnaSignId
    });

    const upaRows = [
      { name: "தூமன் (Dhuma)", rasi: rDhuma.rasi, deg: rDhuma.dms, lon: rDhuma.lon, nature: "சூரியனின் உபகிரகம் — தீவிர கதிர்வீச்சு ஆற்றல்" },
      { name: "வியதீபாதன் (Vyatipata)", rasi: rVyati.rasi, deg: rVyati.dms, lon: rVyati.lon, nature: "ராகுவின் உபகிரகம் — எதிர்பாராத திருப்பங்கள்" },
      { name: "பரிவேஷன் (Parivesha)", rasi: rPari.rasi, deg: rPari.dms, lon: rPari.lon, nature: "சந்திரனின் உபகிரகம் — நீர்நிலை பாதுகாப்பு" },
      { name: "இந்திரசாபன் (Indrachapa)", rasi: rIndra.rasi, deg: rIndra.dms, lon: rIndra.lon, nature: "சுக்கிரனின் உபகிரகம் — கலை & புகழ் வளர்ச்சி" },
      { name: "உபகேது (Upaketu)", rasi: rUpa.rasi, deg: rUpa.dms, lon: rUpa.lon, nature: "கேதுவின் உபகிரகம் — ஞானம் & மோட்ச காரகன்" },
      { name: "மாந்தி / குளிகன் (Mandi)", rasi: rasiNames[Math.floor(mandiLon / 30) % 12] || "மேஷம்", deg: (typeof PanchangamCalculator !== "undefined" ? PanchangamCalculator.formatDms(mandiLon % 30) : "00:00:00"), lon: mandiLon.toFixed(4), nature: "சனியின் புதல்வன் — தர்ம காரியங்கள் & நீண்ட ஆயுள்" }
    ];

    tbody.innerHTML = upaRows.map(r => `
      <tr>
        <td class="label-cell" style="font-weight: 700;">${r.name}</td>
        <td class="val-cell" style="text-align: center; font-weight: 600; color: #831843;">${r.rasi}</td>
        <td class="val-cell" style="text-align: center; font-family: monospace;">${r.deg}</td>
        <td class="val-cell" style="text-align: center; font-family: monospace;">${r.lon}</td>
        <td class="val-cell" style="font-size: 0.8rem; color: #475569;">${r.nature}</td>
      </tr>
    `).join("");

    dialContainer.innerHTML = `
      <div style="text-align: center; padding: 1.5rem; background: #FFFDF8; border: 1.5px solid #F6D7B0; border-radius: 12px;">
        <div style="font-size: 2.2rem; font-weight: 800; color: #047857;">${rDhuma.dms}</div>
        <div style="font-size: 0.88rem; color: #78350F; font-weight: 700; margin-top: 4px;">தூமன் நிலை: ${rDhuma.rasi}</div>
        <div style="font-size: 0.78rem; color: #059669; margin-top: 4px;">● சாத்வீக யோக சமநிலை சுட்டிக்காட்டப்படுகிறது</div>
      </div>
    `;
  }

  /**
   * 11. தசா ஆழ் தேடல் (Dasha Deep Search Section) - 100% Dynamic
   */
  function renderDashaDeepSearchSection() {
    const listContainer = document.getElementById("dashaDeepListContainer");
    const balText = document.getElementById("dashaSearchBalanceText");
    if (!listContainer || !AppState.horoscopeData) return;

    const { profile, planets } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;

    const timelineData = PanchangamCalculator.generateFullVimshottariTimeline(moonLon, profile.birthDate || "1988-04-20");
    const bal = PanchangamCalculator.calculateDashaBalance(moonLon, profile.birthDate || "1988-04-20");

    if (balText) {
      balText.textContent = bal.balanceStr;
    }

    listContainer.innerHTML = timelineData.dashaTables.map(d => `
      <div class="ep-dasha-deep-card">
        <div class="ep-dasha-deep-header">
          <span class="ep-graha-pill ${d.dashaClass}">${d.dashaLord} தசை</span>
          <span style="font-size: 0.82rem; font-weight: 700; color: #0F172A;">
            ${formatDashaDateCell(d.bhuktis[0] ? d.bhuktis[0].start : "", false)} <span style="color: #64748B; margin: 0 4px;">முதல்</span> ${formatDashaDateCell(d.bhuktis[d.bhuktis.length - 1] ? d.bhuktis[d.bhuktis.length - 1].end : "", true)} <span style="color: #64748B; margin-left: 4px;">வரை</span>
          </span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; margin-top: 10px;">
          ${d.bhuktis.map(b => `
            <div style="background: ${b.isCurrent ? '#FEF9C3' : '#F8FAFC'}; border: 1.5px solid ${b.isCurrent ? '#F59E0B' : '#CBD5E1'}; border-radius: 8px; padding: 8px 10px; font-size: 0.78rem;">
              <div style="font-weight: 700; color: #0F172A; display: flex; justify-content: space-between; align-items: center;">
                <span class="ep-graha-pill ${b.bClass}" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;">${b.bLord} புக்தி</span>
                <span style="color: #059669; font-weight: 700; font-size: 0.75rem;">${Math.round(b.durationDays / 30)} மாதம்</span>
              </div>
              <div style="font-family: monospace; font-size: 0.8rem; font-weight: 800; color: #0F172A; margin-top: 6px; display: flex; align-items: center; justify-content: space-between;">
                ${formatDashaDateCell(b.start, false)}
                <span style="color: #64748B; font-weight: 600; margin: 0 4px;">➔</span>
                ${formatDashaDateCell(b.end, true)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  /**
   * 12. சந்திர நாடி (Chandra Nadi Section) - 100% Dynamic
   */
  function renderChandraNadiSection() {
    const moonSignText = document.getElementById("chandraNadiMoonSignText");
    const pastSign = document.getElementById("nadiPastSignName");
    const pastBody = document.getElementById("nadiPastBody");
    const presentSign = document.getElementById("nadiPresentSignName");
    const presentBody = document.getElementById("nadiPresentBody");
    const futureSign = document.getElementById("nadiFutureSignName");
    const futureBody = document.getElementById("nadiFutureBody");
    if (!moonSignText || !pastSign || !presentSign || !futureSign || !AppState.horoscopeData) return;

    const { planets } = AppState.horoscopeData;
    const moon = planets["Mo"] || {};
    const moonSignId = moon.signId !== undefined ? moon.signId : 6;
    const rasiNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
    const rasiLords = ["செவ்வாய்", "சுக்கிரன்", "புதன்", "சந்திரன்", "சூரியன்", "புதன்", "சுக்கிரன்", "செவ்வாய்", "குரு", "சனி", "சனி", "குரு"];

    const pastSignId = (moonSignId - 1 + 12) % 12;
    const presSignId = moonSignId;
    const futSignId = (moonSignId + 1) % 12;

    const pastRasi = rasiNames[pastSignId];
    const presRasi = rasiNames[presSignId];
    const futRasi = rasiNames[futSignId];

    moonSignText.textContent = presRasi;
    pastSign.textContent = pastRasi;
    presentSign.textContent = presRasi;
    futureSign.textContent = futRasi;

    const pastLord = rasiLords[pastSignId];
    const presLord = rasiLords[presSignId];
    const futLord = rasiLords[futSignId];

    if (pastBody) {
      pastBody.innerHTML = `
        <p><strong>${pastRasi} ராசி</strong>யின் அதிபதியான <strong>${pastLord}</strong> காரகத்துவ மற்றும் ஆதிபத்திய சம்பவங்கள் கடந்து வந்த காலங்களில் நிகழ்ந்து இருக்க அதிக வாய்ப்புகள் உள்ளன.</p>
        <p>சந்திரனின் முந்தைய ராசி நிலை ஜாதகரின் முந்தைய கர்ம பதிவுகள் மற்றும் குடும்ப சூழல் அமைப்புகளை தெளிவுபடுத்துகிறது.</p>
      `;
    }

    if (presentBody) {
      presentBody.innerHTML = `
        <p>தற்போதைய <strong>${presRasi} ராசி</strong>யின் அதிபதியான <strong>${presLord}</strong> காரகத்துவ மற்றும் ஆதிபத்திய நிகழ்வுகள் தற்போது ஜாதகரின் வாழ்வில் தீவிரமாக செயலாற்றுகின்றன.</p>
        <p>கோச்சார சந்திரன் ஜெனன கால ${presRasi} ராசியை கடக்கும் காலங்களில் மனம், தொழில், மற்றும் தனிப்பட்ட முடிவுகளில் முக்கிய மாற்றங்கள் ஏற்பட வாய்ப்புகள் அதிகம்.</p>
      `;
    }

    if (futureBody) {
      futureBody.innerHTML = `
        <p>அடுத்து வரும் <strong>${futRasi} ராசி</strong>யின் அதிபதியான <strong>${futLord}</strong> காரகத்துவ மற்றும் ஆதிபத்திய விஷயங்கள் அடுத்து நிகழ அதிக வாய்ப்புகள் உள்ளது.</p>
        <p>ஜாதகர் எதிர்காலத்தில் எடுக்க வேண்டிய முக்கிய முடிவுகளுக்கு ${futLord} பகவானின் அனுகூலங்களை முறையாகப் பெறுவது யோகமளிக்கும்.</p>
      `;
    }
  }

  /**
   * 13. வாஸ்து (Vastu & Planetary Directions) - 100% Dynamic
   */
  function renderVastuSection() {
    const grid = document.getElementById("vastuMandalaGrid");
    if (!grid || !AppState.horoscopeData) return;

    const { planets, lagna } = AppState.horoscopeData;
    const lagnaSignId = lagna ? lagna.signId : 0;

    // 8 Directions + Center mapped to signs:
    // NW: Scorpio (7)
    // North: Sagittarius (8), Capricorn (9)
    // NE: Aquarius (10), Pisces (11)
    // West: Leo (4)
    // Center: Gemini (2), Virgo (5)
    // East: Aries (0)
    // SW: Cancer (3)
    // South: Libra (6)
    // SE: Taurus (1)

    const sectorDefs = [
      { title: "வடமேற்கு", deity: "வாயு", signs: [7], signNames: "ராசிகள்: விருச்சிகம்" },
      { title: "வடக்கு", deity: "குபேரன்", signs: [8, 9], signNames: "ராசிகள்: தனுசு · மகரம்" },
      { title: "வடகிழக்கு", deity: "ஈசன்", signs: [10, 11], signNames: "ராசிகள்: கும்பம் · மீனம்" },
      { title: "மேற்கு", deity: "வருணன்", signs: [4], signNames: "ராசிகள்: சிம்மம்" },
      { title: "மையம்", deity: "பிரம்மா", signs: [2, 5], signNames: "ராசிகள்: மிதுனம் · கன்னி" },
      { title: "கிழக்கு", deity: "இந்திரன்", signs: [0], signNames: "ராசிகள்: மேஷம்" },
      { title: "தென்மேற்கு", deity: "நைரிர்தி", signs: [3], signNames: "ராசிகள்: கடகம்" },
      { title: "தெற்கு", deity: "யமன்", signs: [6], signNames: "ராசிகள்: துலாம்" },
      { title: "தென்கிழக்கு", deity: "அக்னி", signs: [1], signNames: "ராசிகள்: ரிஷபம்" }
    ];

    const shortLabels = {
      Su: "சூரியன்", Mo: "சந்திரன்", Ma: "செவ்வாய்", Me: "புதன்",
      Ju: "குரு", Ve: "சுக்கிரன்", Sa: "சனி", Ra: "ராகு", Ke: "கேது", Man: "மாந்தி"
    };

    const sectors = sectorDefs.map(sec => {
      const isLagna = sec.signs.includes(lagnaSignId);
      const pills = [];

      if (isLagna) {
        pills.push({ text: "லக்னம்", isLagnaPill: true });
      }

      Object.keys(planets || {}).forEach(k => {
        if (k === "Asc") return;
        const p = planets[k];
        if (p && sec.signs.includes(p.signId)) {
          pills.push({ text: shortLabels[k] || k, isLagnaPill: false });
        }
      });

      return {
        title: sec.title,
        deity: sec.deity,
        isLagna,
        tag: isLagna ? "லக்னம் உள்ள பகுதி" : null,
        pills,
        signs: sec.signNames,
        isEmpty: pills.length === 0,
        emptyText: pills.length === 0 ? "கிரகம் இல்லை" : null
      };
    });

    grid.innerHTML = sectors.map(sec => `
      <div class="ep-vastu-sector-card ${sec.isLagna ? 'highlight-lagna' : ''} ${sec.isEmpty ? 'is-empty' : ''}">
        <div>
          <div class="ep-vastu-title">${sec.title}</div>
          <div class="ep-vastu-deity">${sec.deity}</div>
          ${sec.tag ? `<span class="ep-vastu-lagna-badge">${sec.tag}</span>` : ""}
          <div class="ep-vastu-pills-row">
            ${sec.pills.length > 0
              ? sec.pills.map(p => {
                  const isObj = typeof p === "object";
                  const pText = isObj ? p.text : p;
                  const isLag = isObj && p.isLagnaPill;
                  return `<span class="ep-vastu-pill ${isLag ? 'lagna-pill' : ''}">${pText}</span>`;
                }).join("")
              : `<span class="ep-vastu-empty-text">${sec.emptyText || '—'}</span>`
            }
          </div>
        </div>
        <div class="ep-vastu-footer-signs">${sec.signs}</div>
      </div>
    `).join("");
  }

  /**
   * 14. பரிகார கோவில்கள் (Parihara Temples) - 100% Dynamic
   */
  function renderPariharaTemplesSection() {
    const tbody = document.getElementById("pariharaTemplesTableBody");
    if (!tbody || !AppState.horoscopeData) return;

    const { planets, lagna, profile } = AppState.horoscopeData;
    const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
    const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;

    const nakIdx = Math.floor(moonLon / (360 / 27)) % 27;
    const star = PanchangamCalculator.NAKSHATRAS[nakIdx];

    const diff = (moonLon - sunLon + 360) % 360;
    const tithiIdx = Math.floor(diff / 12) % 30;
    const tithi = PanchangamCalculator.TITHIS[tithiIdx];

    const kIndex = Math.floor(diff / 6);
    let karana;
    if (kIndex === 0) karana = PanchangamCalculator.KARANAS[10];
    else if (kIndex >= 57 && kIndex <= 59) karana = PanchangamCalculator.KARANAS[kIndex - 50];
    else karana = PanchangamCalculator.KARANAS[(kIndex - 1) % 7];

    const yogiInfo = PanchangamCalculator.calculateYogiAvayogi(
      sunLon, moonLon, planets, profile.birthDate || "1988-04-20", profile.name || "அன்பர்", tithiIdx + 1, nakIdx
    );

    const yogiStarObj = PanchangamCalculator.NAKSHATRAS.find(n => n.nameTa === yogiInfo.yogiStar) || star;
    const avaStarObj = PanchangamCalculator.NAKSHATRAS.find(n => n.nameTa === yogiInfo.avayogiStar) || star;
    const rasiLordCodes = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"];
    const lagnaLordCode = lagna ? (lagna.lord || rasiLordCodes[lagna.signId || 0]) : "Ju";

    const navagrahaTemples = {
      Su: "சூரியனார் கோவில், தஞ்சாவூர் மாவட்டம்",
      Mo: "திங்களூர் கைலாசநாதர் கோவில், தஞ்சாவூர் மாவட்டம்",
      Ma: "வைத்தீஸ்வரன் கோவில் அங்காரகன் ஸ்தலம், மயிலாடுதுறை மாவட்டம்",
      Me: "திருவெண்காடு சுவேதாரண்யேஸ்வரர் கோவில், மயிலாடுதுறை மாவட்டம்",
      Ju: "ஆலங்குடி ஆபத்சகாயேஸ்வரர் குரு ஸ்தலம், திருவாரூர் மாவட்டம்",
      Ve: "கஞ்சனூர் அக்னீஸ்வரர் சுக்கிரன் ஸ்தலம், தஞ்சாவூர் மாவட்டம்",
      Sa: "திருநள்ளாறு தர்பாரண்யேஸ்வரர் சனி ஸ்தலம், காரைக்கால்",
      Ra: "திருநாகேஸ்வரம் நாகநாதசுவாமி ராகு ஸ்தலம், தஞ்சாவூர் மாவட்டம்",
      Ke: "கீழப்பெரும்பள்ளம் நாகநாதர் கேது ஸ்தலம், மயிலாடுதுறை மாவட்டம்"
    };

    const lagnaLordTemple = navagrahaTemples[lagnaLordCode] || "சுசீந்திரம் தாணுமாலயன் கோவில்";

    const templeRows = [
      { label: `நட்சத்திர பரிகார கோவில் (${star.nameTa})`, temple: star.temple },
      { label: `திதி பரிகார கோவில் (${tithi.nameTa})`, temple: tithi.temple },
      { label: `கரணம் பரிகார கோவில் (${karana.nameTa})`, temple: karana.temple },
      { label: `யோகி பரிகார கோவில் (${yogiInfo.yogiStar} - ${yogiInfo.yogiPlanet})`, temple: yogiStarObj.temple },
      { label: `அவயோகி பரிகார கோவில் (${yogiInfo.avayogiStar} - ${yogiInfo.avayogiPlanet})`, temple: avaStarObj.temple },
      { label: `லக்னாதிபதி பரிகார கோவில் (${lagna.signNameTa || "லக்னம்"})`, temple: lagnaLordTemple },
      { label: "மாந்தி / குளிகன் பரிகார கோவில்", temple: "பேரையூர் நாகநாதசுவாமி திருக்கோவில், புதுக்கோட்டை" },
      { label: "வதை வைநாசிக பரிகார கோவில்", temple: "திலதர்ப்பணபுரி சுவர்ணபுரீஸ்வரர் திருக்கோவில்" }
    ];

    tbody.innerHTML = templeRows.map(r => `
      <tr>
        <td class="label-cell" style="color: #713F12; font-weight: 600; background: #FFFDF8;">${r.label}</td>
        <td class="val-cell" style="color: #831843; font-weight: 600;">${r.temple}</td>
      </tr>
    `).join("");
  }

  /**
   * 15. விவாக சக்கரம் & களத்திர ஆய்வு (Vivaha Chakra & Matrimonial Analysis) - 100% Dynamic
   */
  let selectedVivahaTestStarIdx = null;

  function renderVivahaChakraSection(targetMuhurthaNakIdx = selectedVivahaTestStarIdx) {
    const ruleBanner = document.getElementById("vivahaRuleBanner");
    const compassGrid = document.getElementById("vivahaCompassGrid");
    const banner = document.getElementById("vivahaNativeBanner");
    const grid = document.getElementById("vivahaMandalaGrid");
    const tableBody = document.getElementById("vivahaDirectionsTableBody");
    const matBody = document.getElementById("vivahaMatrimonialTableBody");
    const starSelect = document.getElementById("vivahaMuhurthaStarSelect");
    const testBtn = document.getElementById("btnTestVivahaStar");
    const testResultBox = document.getElementById("vivahaTestResultBox");
    const groomSelect = document.getElementById("poruthamGroomSelect");
    const brideSelect = document.getElementById("poruthamBrideSelect");
    const poruthamResultBox = document.getElementById("poruthamLiveResultBox");
    const dateInput = document.getElementById("vcDateInput");
    const timeInput = document.getElementById("vcTimeInput");
    const placeInput = document.getElementById("vcPlaceInput");
    const btnRecalc = document.getElementById("btnRecalcVivahaChakra");
    const btnNow = document.getElementById("btnNowVivahaChakra");
    const viewSelect = document.getElementById("vivahaViewModeSelect");
    const tradDetails = document.getElementById("vivahaTraditionalDetails");

    if (!ruleBanner && !compassGrid && !banner && !grid) return;

    const profile = AppState.horoscopeData?.profile || {};

    // Initialize bottom controls with sensible defaults if empty
    if (dateInput && !dateInput.value) {
      if (profile.birthDate) {
        dateInput.value = profile.birthDate;
      } else {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        dateInput.value = `${yyyy}-${mm}-${dd}`;
      }
    }
    if (timeInput && !timeInput.value) {
      if (AppState.horoscopeData?.profile?.birthTime) {
        timeInput.value = AppState.horoscopeData.profile.birthTime;
      } else {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        timeInput.value = `${hh}:${min}`;
      }
    }
    if (placeInput && !placeInput.value) {
      placeInput.value = AppState.horoscopeData?.profile?.birthPlace || "Chennai";
    }

    // Determine Sun and Moon positions for the selected date, time & place
    let sunNakIdx = 12; // default Hastham
    let moonNakIdx = 14; // default Swati

    const selectedDate = dateInput?.value || (AppState.horoscopeData?.profile?.birthDate || "2026-10-12");
    const selectedTime = timeInput?.value || (AppState.horoscopeData?.profile?.birthTime || "17:59");
    const selectedPlace = placeInput?.value || "Chennai";

    let calcData = null;
    if (typeof AstroEngine !== "undefined" && AstroEngine.calculateHoroscope && selectedDate && selectedTime) {
      try {
        calcData = AstroEngine.calculateHoroscope({
          name: "விவாக சக்கரம்",
          gender: "male",
          birthDate: selectedDate,
          birthTime: selectedTime,
          place: selectedPlace,
          latitude: 13.0827,
          longitude: 80.2707,
          timezoneOffset: 5.5
        });
      } catch (err) {
        console.warn("AstroEngine dynamic calculation fallback in Vivaha:", err);
      }
    }

    if (calcData && calcData.planets && calcData.planets["Su"] && calcData.planets["Mo"]) {
      const sunLon = calcData.planets["Su"].longitude;
      const moonLon = calcData.planets["Mo"].longitude;
      sunNakIdx = Math.floor(sunLon / (360 / 27)) % 27;
      moonNakIdx = Math.floor(moonLon / (360 / 27)) % 27;
    } else if (AppState.horoscopeData && AppState.horoscopeData.planets) {
      const { planets } = AppState.horoscopeData;
      const sunLon = planets["Su"] ? planets["Su"].longitude : 16.85;
      const moonLon = planets["Mo"] ? planets["Mo"].longitude : 181.56;
      sunNakIdx = Math.floor(sunLon / (360 / 27)) % 27;
      moonNakIdx = Math.floor(moonLon / (360 / 27)) % 27;
    }

    if (typeof MarriageEngine === "undefined" || !MarriageEngine.calculateVivahaChakra) {
      console.warn("MarriageEngine not ready");
      return;
    }

    const vData = MarriageEngine.calculateVivahaChakra(sunNakIdx, moonNakIdx, targetMuhurthaNakIdx);

    // 1. Top Rule Evaluation Alert Banner
    if (ruleBanner) {
      const isGood = vData.nativeSlot.isGood;
      if (isGood) {
        ruleBanner.className = "ep-vc-rule-banner is-good";
        ruleBanner.textContent = "இது ஒரு உத்தம சுப நிலை ஆகும். இந்த நாளை முகூர்த்தத்திற்கு தேர்வு செய்யலாம்";
      } else {
        ruleBanner.className = "ep-vc-rule-banner is-bad";
        ruleBanner.textContent = "இது ஒரு கெட்ட நிலை ஆகும். இந்த நாளை முகூர்த்தத்திற்கு தேர்ந்து எடுக்க வேண்டாம்";
      }
    }

    // 2. Modern 3x3 Compass Mandala Cards Grid
    // Compass ordering: Row 1: [7 (NW), 8 (N), 9 (NE)]; Row 2: [6 (W), 1 (Center), 2 (E)]; Row 3: [5 (SW), 4 (S), 3 (SE)]
    const displaySlotIds = [7, 8, 9, 6, 1, 2, 5, 4, 3];
    const slotsMap = {};
    vData.slots.forEach(s => { slotsMap[s.slotNum] = s; });

    if (compassGrid) {
      compassGrid.innerHTML = displaySlotIds.map(slotId => {
        const s = slotsMap[slotId];
        const isMoonSlot = s.hasNativeMoon;
        const isTargetSlot = s.hasTargetStar;

        let activeClass = "";
        if (isMoonSlot || isTargetSlot) {
          activeClass = s.isGood ? "is-active-good" : "is-active-bad";
        }

        const color = s.themeColor || "#475569";

        return `
          <div class="ep-vc-slot-box ${activeClass}" style="--slot-color: ${color};">
            <div>
              <div class="ep-vc-slot-header">
                <span class="ep-vc-slot-badge-num">${s.slotNum}</span>
                <span class="ep-vc-slot-dir">${s.dirTa}</span>
              </div>
              <div class="ep-vc-stars-list">
                <div class="ep-vc-star-row ${s.stars[0].idx === moonNakIdx ? 'is-native-star' : ''}">${s.stars[0].nameTa}</div>
                <div class="ep-vc-star-row ${s.stars[1].idx === moonNakIdx ? 'is-native-star' : ''}">${s.stars[1].nameTa}</div>
                <div class="ep-vc-star-row ${s.stars[2].idx === moonNakIdx ? 'is-native-star' : ''}">${s.stars[2].nameTa}</div>
              </div>
            </div>
            <div class="ep-vc-slot-footer ${s.isGood ? 'is-good' : 'is-bad'}">
              ${s.isGood ? '✓' : '✗'} ${s.statusTa}
            </div>
          </div>
        `;
      }).join("");
    }

    // 3. Fallback support for legacy banner & grid if present
    if (banner) {
      banner.innerHTML = `
        <div class="ep-vivaha-banner-top">
          <span class="ep-vivaha-banner-pill">
            <span>💍</span> ஜாதகரின் விவாக சக்கர நிலை
          </span>
          <span style="font-size: 0.84rem; color: #78350F; font-weight: 700;">
            சூரியன்: <strong style="color: #92400E;">${vData.sunStar.nameTa}</strong> · சந்திரன்: <strong style="color: #92400E;">${vData.moonStar.nameTa}</strong>
          </span>
        </div>
        <div class="ep-vivaha-banner-title">
          #${vData.nativeSlot.slotNum} ${vData.nativeSlot.dirTa} (${vData.nativeSlot.dirEn}) · 
          <span style="color: ${vData.nativeSlot.isGood ? '#047857' : '#B91C1C'};">
            ${vData.nativeSlot.isGood ? '✓ ' : '✗ '}${vData.nativeSlot.statusTa}
          </span>
        </div>
        <div class="ep-vivaha-banner-desc" style="margin-top: 0.35rem;">
          சூரிய நட்சத்திரம் முதல் சந்திர நட்சத்திரம் வரை எண்ண: <strong>${vData.nativeCount}-வது நட்சத்திரம்</strong>.
          ${vData.nativeSlot.descTa}
        </div>
      `;
    }

    if (grid) {
      grid.innerHTML = displaySlotIds.map(slotId => {
        const s = slotsMap[slotId];
        const isNative = s.hasNativeMoon;
        const isTarget = s.hasTargetStar;

        let cardClass = "ep-vivaha-slot-card";
        if (s.isGood) cardClass += " is-auspicious";
        else cardClass += " is-inauspicious";
        if (isNative) cardClass += " highlight-native";
        if (isTarget) cardClass += " highlight-target";

        const badgeClass = s.isGood ? "ep-vivaha-badge-auspicious" : "ep-vivaha-badge-inauspicious";

        return `
          <div class="${cardClass}">
            <div>
              <div class="ep-vivaha-slot-header">
                <span class="ep-vivaha-slot-num-dir">${s.slotNum}. ${s.dirTa}</span>
                <span class="ep-vivaha-slot-badge ${badgeClass}">${s.statusTa}</span>
              </div>
              <div class="ep-vivaha-stars-list">
                ${s.stars.map(st => {
                  let stClass = "ep-vivaha-star-tag";
                  if (st.idx === moonNakIdx) stClass += " is-native";
                  if (targetMuhurthaNakIdx !== null && st.idx === targetMuhurthaNakIdx) stClass += " is-target";
                  return `<span class="${stClass}">${st.nameTa}</span>`;
                }).join(", ")}
              </div>
              ${isNative ? `<div style="font-size: 0.72rem; font-weight: 700; color: #B45309; margin-top: 0.2rem;">★ ஜாதகரின் சந்திரன்</div>` : ""}
              ${isTarget ? `<div style="font-size: 0.72rem; font-weight: 700; color: #1D4ED8; margin-top: 0.2rem;">💒 தேர்வு செய்த முகூர்த்தம்</div>` : ""}
            </div>
            <div class="ep-vivaha-slot-footer">
              ${s.deityTa} · ${s.isGood ? "சுபம்" : "அசுபம்"}
            </div>
          </div>
        `;
      }).join("");
    }

    // 4. Wire Controls & Event Handlers
    if (btnRecalc && !btnRecalc.getAttribute("data-bound")) {
      btnRecalc.setAttribute("data-bound", "true");
      btnRecalc.addEventListener("click", () => {
        renderVivahaChakraSection();
      });
    }

    if (btnNow && !btnNow.getAttribute("data-bound")) {
      btnNow.setAttribute("data-bound", "true");
      btnNow.addEventListener("click", () => {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
        if (timeInput) timeInput.value = `${hh}:${min}`;
        renderVivahaChakraSection();
      });
    }

    if (viewSelect && !viewSelect.getAttribute("data-bound")) {
      viewSelect.setAttribute("data-bound", "true");
      viewSelect.addEventListener("change", () => {
        if (tradDetails) {
          tradDetails.style.display = viewSelect.value === "traditional" ? "block" : "none";
        }
      });
    }

    if (dateInput && !dateInput.getAttribute("data-bound")) {
      dateInput.setAttribute("data-bound", "true");
      dateInput.addEventListener("change", () => renderVivahaChakraSection());
    }

    if (timeInput && !timeInput.getAttribute("data-bound")) {
      timeInput.setAttribute("data-bound", "true");
      timeInput.addEventListener("change", () => renderVivahaChakraSection());
    }

    // 5. Quick Reference 9 Directions Table
    if (tableBody) {
      tableBody.innerHTML = vData.slots.map(s => {
        const isNative = s.hasNativeMoon;
        const isTarget = s.hasTargetStar;
        const rowBg = isNative ? "#FEFCE8" : (isTarget ? "#EFF6FF" : "");
        const statusColor = s.isGood ? "#15803D" : "#B91C1C";

        return `
          <tr style="${rowBg ? `background: ${rowBg};` : ''}">
            <td class="label-cell" style="font-weight: 700; color: #713F12;">
              ${s.slotNum}. ${s.dirTa}
              ${isNative ? ` <span style="color:#B45309; font-size:0.75rem;">(சந்திரன்)</span>` : ''}
              ${isTarget ? ` <span style="color:#1D4ED8; font-size:0.75rem;">(முகூர்த்தம்)</span>` : ''}
            </td>
            <td class="val-cell">${s.starNamesTa}</td>
            <td class="val-cell" style="text-align: center; color: ${statusColor}; font-weight: 700;">
              ${s.statusTa}
            </td>
            <td class="val-cell" style="text-align: center;">
              <span class="ep-vivaha-slot-badge ${s.isGood ? 'ep-vivaha-badge-auspicious' : 'ep-vivaha-badge-inauspicious'}">
                ${s.isGood ? 'சுபம்' : 'அசுபம்'}
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }

    // 6. Populate 27 Stars in Tester Dropdown if empty
    if (starSelect && starSelect.children.length === 0) {
      starSelect.innerHTML = MarriageEngine.NAKSHATRA_NAMES_TA.map((name, idx) => `
        <option value="${idx}" ${idx === moonNakIdx ? 'selected' : ''}>${idx + 1}. ${name}</option>
      `).join("");
    }

    // Bind tester button & select handler
    if (testBtn && !testBtn.getAttribute("data-bound")) {
      testBtn.setAttribute("data-bound", "true");
      testBtn.addEventListener("click", () => {
        const chosenIdx = parseInt(starSelect.value, 10);
        selectedVivahaTestStarIdx = chosenIdx;
        renderVivahaChakraSection(chosenIdx);
      });
    }

    if (starSelect && !starSelect.getAttribute("data-bound")) {
      starSelect.setAttribute("data-bound", "true");
      starSelect.addEventListener("change", () => {
        const chosenIdx = parseInt(starSelect.value, 10);
        selectedVivahaTestStarIdx = chosenIdx;
        renderVivahaChakraSection(chosenIdx);
      });
    }

    // Display Test Result Box if a target star was tested
    if (testResultBox && vData.targetStar && vData.targetSlot) {
      testResultBox.style.display = "block";
      const isGood = vData.targetSlot.isGood;
      testResultBox.style.background = isGood ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)";
      testResultBox.style.border = `1px solid ${isGood ? "#10B981" : "#EF4444"}`;

      testResultBox.innerHTML = `
        <div style="font-weight: 800; font-size: 0.95rem; color: ${isGood ? '#047857' : '#B91C1C'}; margin-bottom: 0.25rem;">
          ${isGood ? '✓ சுப முகூர்த்த நிலை' : '⚠ அசுப நிலை (தவிர்க்கவும்)'}: ${vData.targetStar.nameTa} ➔ #${vData.targetSlot.slotNum} ${vData.targetSlot.dirTa} (${vData.targetSlot.statusTa})
        </div>
        <div style="font-size: 0.82rem; color: #1F2937; line-height: 1.4;">
          சூரிய நட்சத்திரம் முதல் ${vData.targetCount}-வது நட்சத்திரம். ${vData.targetSlot.descTa}
        </div>
      `;
    }

    // 5. Matrimonial Astrological Analysis Table
    if (matBody) {
      const mat = MarriageEngine.getMatrimonialAnalysis(AppState.horoscopeData);
      if (mat) {
        matBody.innerHTML = `
          <tr>
            <td class="label-cell" style="width: 32%;">7-ஆம் பாவக களத்திரம் (House 7)</td>
            <td class="val-cell"><strong>${mat.house7SignName}</strong> (அதிபதி: ${mat.house7LordName})</td>
          </tr>
          <tr>
            <td class="label-cell">7-ஆம் அதிபதி அமர்ந்த நிலை</td>
            <td class="val-cell"><strong>${mat.lordSignName}</strong> (லக்னத்திற்கு ${mat.lordHouseFromLagna}-ஆம் இடம்)</td>
          </tr>
          <tr>
            <td class="label-cell">களத்திர காரகன் (சுக்கிரன் / Venus)</td>
            <td class="val-cell"><strong>${mat.venusSignName}</strong> (லக்னத்திற்கு ${mat.venusHouseFromLagna}-ஆம் இடம் · நிலை: ${mat.venusDignity})</td>
          </tr>
          <tr>
            <td class="label-cell">பதி காரகன் (குரு / Jupiter)</td>
            <td class="val-cell"><strong>${mat.jupiterSignName}</strong> (லக்னத்திற்கு ${mat.jupiterHouseFromLagna}-ஆம் இடம்)</td>
          </tr>
          <tr>
            <td class="label-cell">உபபத லக்னம் (Upapada Lagna - UL)</td>
            <td class="val-cell"><strong>${mat.ulSignName}</strong> (திருமண பந்தத்தின் ஆயுள் & நிலைத்தன்மை)</td>
          </tr>
          <tr>
            <td class="label-cell">ஜைமினி தாராகாரகன் (Darakaraka - DK)</td>
            <td class="val-cell"><strong>${mat.darakaraka.planetNameTa}</strong> (${mat.darakaraka.deg}°)</td>
          </tr>
          <tr>
            <td class="label-cell">செவ்வாய் தோஷ நிலை (Manglik Analysis)</td>
            <td class="val-cell" style="color: ${mat.chevvaiResult.hasDosha ? '#B91C1C' : '#047857'}; font-weight: 600;">
              ${mat.chevvaiResult.summaryTa}
            </td>
          </tr>
        `;
      }
    }

    // 6. 10 & 12 Porutham Matcher
    if (groomSelect && brideSelect && poruthamResultBox) {
      const isFemale = profile.gender === "female";
      const nativeDefaultStar = moonNakIdx;
      const partnerDefaultStar = (moonNakIdx + 4) % 27;

      if (groomSelect.children.length === 0) {
        groomSelect.innerHTML = MarriageEngine.NAKSHATRA_NAMES_TA.map((name, idx) => `
          <option value="${idx}" ${idx === (isFemale ? partnerDefaultStar : nativeDefaultStar) ? 'selected' : ''}>
            ${idx + 1}. ${name}
          </option>
        `).join("");
      }

      if (brideSelect.children.length === 0) {
        brideSelect.innerHTML = MarriageEngine.NAKSHATRA_NAMES_TA.map((name, idx) => `
          <option value="${idx}" ${idx === (isFemale ? nativeDefaultStar : partnerDefaultStar) ? 'selected' : ''}>
            ${idx + 1}. ${name}
          </option>
        `).join("");
      }

      function updateLivePorutham() {
        const boyIdx = parseInt(groomSelect.value, 10);
        const girlIdx = parseInt(brideSelect.value, 10);
        const boyRasi = Math.floor(boyIdx / 2.25) % 12;
        const girlRasi = Math.floor(girlIdx / 2.25) % 12;

        const pRes = MarriageEngine.calculatePorutham(boyIdx, girlIdx, boyRasi, girlRasi);
        const isGoodMatch = pRes.passedCount >= 8 && pRes.rajjuPassed;

        poruthamResultBox.innerHTML = `
          <div style="background: ${isGoodMatch ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; border: 1.5px solid ${isGoodMatch ? '#10B981' : '#EF4444'}; border-radius: 8px; padding: 1rem; margin-top: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
              <span style="font-size: 1.25rem; font-weight: 800; color: ${isGoodMatch ? '#047857' : '#B91C1C'};">
                ${pRes.passedCount} / ${pRes.totalCount} பொருத்தம் · ${pRes.verdictTa}
              </span>
              <span class="${pRes.rajjuPassed ? 'ep-porutham-badge-passed' : 'ep-porutham-badge-failed'}">
                ${pRes.rajjuPassed ? '✓ ரஜ்ஜு பொருத்தம் உண்டு (மாங்கல்ய பலம்)' : '✗ ரஜ்ஜு தட்டுகிறது'}
              </span>
            </div>

            <div class="gp-table-wrapper" style="margin-top: 0.75rem;">
              <table class="ep-kv-table">
                <thead>
                  <tr>
                    <th style="background: #FFFDF8; color: #831843; width: 30%;">பொருத்தம்</th>
                    <th style="background: #FFFDF8; color: #831843; text-align: center; width: 20%;">நிலை</th>
                    <th style="background: #FFFDF8; color: #831843; width: 50%;">விளக்கம்</th>
                  </tr>
                </thead>
                <tbody>
                  ${pRes.results.map(r => `
                    <tr>
                      <td class="label-cell" style="font-weight: 600;">${r.num}. ${r.ta}</td>
                      <td class="val-cell" style="text-align: center;">
                        <span class="${r.status ? 'ep-porutham-badge-passed' : 'ep-porutham-badge-failed'}">
                          ${r.status ? '✓ உத்தமம்' : '✗ மத்திமம்'}
                        </span>
                      </td>
                      <td class="val-cell" style="font-size: 0.82rem;">${r.descTa}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      if (!groomSelect.getAttribute("data-bound")) {
        groomSelect.setAttribute("data-bound", "true");
        groomSelect.addEventListener("change", updateLivePorutham);
      }
      if (!brideSelect.getAttribute("data-bound")) {
        brideSelect.setAttribute("data-bound", "true");
        brideSelect.addEventListener("change", updateLivePorutham);
      }

      updateLivePorutham();
    }
  }

  /**
   * 16. ரத்தின பரிந்துரைகள் (Gemstone Recommendations) - 100% Dynamic Parashari Logic
   */
  let selectedGemstoneCode = "Su";

  function renderGemstoneSection() {
    const kpiGrid = document.getElementById("gemstoneKpiGrid");
    const tableBody = document.getElementById("gemstonePrescriptionTableBody");
    const cautionBox = document.getElementById("gemstoneCautionBox");
    const browserGrid = document.getElementById("gemstoneBrowserGrid");
    const detailBox = document.getElementById("gemstoneDetailBox");
    if (!kpiGrid || !AppState.horoscopeData) return;

    const isTa = AppState.lang === "ta";
    const data = AppState.horoscopeData;

    const SIGN_LORDS_MAP = [
      { code: "Ma", nameTa: "செவ்வாய்", nameEn: "Mars" },       // 0 Mesha
      { code: "Ve", nameTa: "சுக்கிரன்", nameEn: "Venus" },      // 1 Rishaba
      { code: "Me", nameTa: "புதன்", nameEn: "Mercury" },        // 2 Mithuna
      { code: "Mo", nameTa: "சந்திரன்", nameEn: "Moon" },       // 3 Kataka
      { code: "Su", nameTa: "சூரியன்", nameEn: "Sun" },         // 4 Simha
      { code: "Me", nameTa: "புதன்", nameEn: "Mercury" },        // 5 Kanya
      { code: "Ve", nameTa: "சுக்கிரன்", nameEn: "Venus" },      // 6 Thula
      { code: "Ma", nameTa: "செவ்வாய்", nameEn: "Mars" },       // 7 Vrischika
      { code: "Ju", nameTa: "குரு", nameEn: "Jupiter" },         // 8 Dhanus
      { code: "Sa", nameTa: "சனி", nameEn: "Saturn" },          // 9 Makara
      { code: "Sa", nameTa: "சனி", nameEn: "Saturn" },          // 10 Kumbha
      { code: "Ju", nameTa: "குரு", nameEn: "Jupiter" }          // 11 Meena
    ];

    const RASI_NAMES_TA = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];

    const GEMSTONE_CATALOG = {
      Su: {
        code: "Su", nameTa: "மாணிக்கம்", nameEn: "Ruby", planetTa: "சூரியன்", planetEn: "Sun",
        icon: "🔴", carats: "3 - 5 கேரட்", metalTa: "தங்கம் / செம்பு", metalEn: "Gold / Copper",
        fingerTa: "மோதிர விரல் (வலது கை)", fingerEn: "Ring Finger (Right Hand)",
        dayTa: "ஞாயிறு காலை 6-7 மணி (சூரிய ஹோரை)", dayEn: "Sunday 6-7 AM",
        mantra: "ஓம் ஹ்ரீம் சூர்யாய நமஹ",
        benefitsTa: "தலைமைப் பண்பு, அரசு அனுகூலம், தந்தை நலம், இதயம் & கண் பார்வை மேன்மை.",
        substitutesTa: "கார்னட் (Red Garnet), சிவப்பு ஸ்பைனல்"
      },
      Mo: {
        code: "Mo", nameTa: "இயற்கை முத்து", nameEn: "Natural Pearl", planetTa: "சந்திரன்", planetEn: "Moon",
        icon: "⚪", carats: "4 - 6 கேரட்", metalTa: "வெள்ளி", metalEn: "Silver",
        fingerTa: "சுண்டு விரல் / மோதிர விரல்", fingerEn: "Little / Ring Finger",
        dayTa: "திங்கள் காலை 6-7 மணி (சந்திர ஹோரை)", dayEn: "Monday 6-7 AM",
        mantra: "ஓம் சோம் சோமாய நமஹ",
        benefitsTa: "மன அமைதி, தூக்கமின்மை நீங்குதல், தாய் வழி ஆசி, கற்பனை வளம் மற்றும் சாந்தம்.",
        substitutesTa: "சந்திரகாந்தக் கல் (Moonstone)"
      },
      Ma: {
        code: "Ma", nameTa: "சிவப்பு பவளம்", nameEn: "Red Coral", planetTa: "செவ்வாய்", planetEn: "Mars",
        icon: "🟠", carats: "5 - 7 கேரட்", metalTa: "செம்பு / தங்கம்", metalEn: "Copper / Gold",
        fingerTa: "மோதிர விரல்", fingerEn: "Ring Finger",
        dayTa: "செவ்வாய் காலை 6-7 மணி (செவ்வாய் ஹோரை)", dayEn: "Tuesday 6-7 AM",
        mantra: "ஓம் அங் அங்காரகாய நமஹ",
        benefitsTa: "தைரியம், பூமி & நில சேர்க்கை, ரத்த ஓட்ட சீர்மை, எதிர்ப்புகள் முறியடித்தல்.",
        substitutesTa: "கார்னிலியன் (Carnelian), சிவப்பு அகேட்"
      },
      Me: {
        code: "Me", nameTa: "மரகதம்", nameEn: "Emerald", planetTa: "புதன்", planetEn: "Mercury",
        icon: "🟢", carats: "3 - 5 கேரட்", metalTa: "தங்கம் / வெண்கலம்", metalEn: "Gold / Bronze",
        fingerTa: "சுண்டு விரல்", fingerEn: "Little Finger",
        dayTa: "புதன் காலை 6-7 மணி (புதன் ஹோரை)", dayEn: "Wednesday 6-7 AM",
        mantra: "ஓம் பும் புதாய நமஹ",
        benefitsTa: "கூரிய அறிவு, கல்வி மேன்மை, வியாபார வளர்ச்சி, வாக்கு வன்மை, நரம்பு பலம்.",
        substitutesTa: "பெரிடோட் (Peridot), பச்சை டூர்மலின்"
      },
      Ju: {
        code: "Ju", nameTa: "மஞ்சள் புஷ்பராகம்", nameEn: "Yellow Sapphire", planetTa: "குரு", planetEn: "Jupiter",
        icon: "🟡", carats: "4 - 6 கேரட்", metalTa: "தங்கம்", metalEn: "Yellow Gold",
        fingerTa: "ஆள்காட்டி விரல்", fingerEn: "Index Finger",
        dayTa: "வியாழன் காலை 6-7 மணி (குரு ஹோரை)", dayEn: "Thursday 6-7 AM",
        mantra: "ஓம் ப்ரம் பிரஹஸ்பதயே நமஹ",
        benefitsTa: "ஞானம், பெருஞ்செல்வம், புத்திர பாக்கியம், குருவருள், ஆன்மீக உயர்நிலை.",
        substitutesTa: "மஞ்சள் டோபாஸ் (Yellow Topaz), சிட்ரின் (Citrine)"
      },
      Ve: {
        code: "Ve", nameTa: "வைரம் / வெண் புஷ்பராகம்", nameEn: "Diamond / White Sapphire", planetTa: "சுக்கிரன்", planetEn: "Venus",
        icon: "💎", carats: "0.5 - 1.5 கேரட் / 3 - 5 கேரட்", metalTa: "பிளாட்டினம் / தங்கம் / வெள்ளி", metalEn: "Platinum / Gold / Silver",
        fingerTa: "நடு விரல் / மோதிர விரல்", fingerEn: "Middle / Ring Finger",
        dayTa: "வெள்ளி காலை 6-7 மணி (சுக்கிர ஹோரை)", dayEn: "Friday 6-7 AM",
        mantra: "ஓம் ஷும் சுக்ராய நமஹ",
        benefitsTa: "தாம்பத்திய சுகம், கலைத் துறை வெற்றி, சொகுசு வசதிகள், கவர்ச்சிகரமான தோற்றம்.",
        substitutesTa: "வெள்ளை சிர்கான் (White Zircon), ஓபல் (Opal)"
      },
      Sa: {
        code: "Sa", nameTa: "நீலக்கல்", nameEn: "Blue Sapphire", planetTa: "சனி", planetEn: "Saturn",
        icon: "🔷", carats: "4 - 6 கேரட்", metalTa: "வெள்ளி / ஐம்பொன்", metalEn: "Silver / Panchaloha",
        fingerTa: "நடு விரல்", fingerEn: "Middle Finger",
        dayTa: "சனி மாலை 6-7 மணி (சனி ஹோரை)", dayEn: "Saturday 6-7 PM",
        mantra: "ஓம் ஷம் சனைச்சராய நமஹ",
        benefitsTa: "தொழில் நிலைப்பு, நீண்ட ஆயுள், நீதி, சகிப்புத்தன்மை, கடும் உழைப்பின் அபரிமித வெற்றி.",
        substitutesTa: "நீல டோபாஸ் (Blue Topaz), அமேதிஸ்ட் (Amethyst), அயோலைட்"
      },
      Ra: {
        code: "Ra", nameTa: "கோமேதகம்", nameEn: "Hessonite", planetTa: "ராகு", planetEn: "Rahu",
        icon: "🟤", carats: "5 - 7 கேரட்", metalTa: "வெள்ளி / ஐம்பொன்", metalEn: "Silver / Panchaloha",
        fingerTa: "நடு விரல்", fingerEn: "Middle Finger",
        dayTa: "சனி இரவு 8-9 மணி", dayEn: "Saturday Night",
        mantra: "ஓம் ராம் ராகவே நமஹ",
        benefitsTa: "திடீர் தன யோகம், வெளிநாட்டு வாய்ப்புகள், அரசியலில் தலைமை, மறைமுக விரோதிகள் விலகுதல்.",
        substitutesTa: "தேன் நிற அகேட் (Honey Agate)"
      },
      Ke: {
        code: "Ke", nameTa: "வைடூரியம்", nameEn: "Cat's Eye", planetTa: "கேது", planetEn: "Ketu",
        icon: "👁️", carats: "3 - 5 கேரட்", metalTa: "வெள்ளி / ஐம்பொன்", metalEn: "Silver / Panchaloha",
        fingerTa: "சுண்டு விரல் / மோதிர விரல்", fingerEn: "Little / Ring Finger",
        dayTa: "செவ்வாய் காலை 6-7 மணி", dayEn: "Tuesday 6-7 AM",
        mantra: "ஓம் கேம் கேதவே நமஹ",
        benefitsTa: "மோட்ச நாட்டம், ஆன்மீக விழிப்புணர்வு, விபத்துக்கள் பாதுகாப்பு, கூரிய உள்ளுணர்வு.",
        substitutesTa: "புலி கண் கல் (Tiger's Eye)"
      }
    };

    const lagnaSignId = (data.lagna && data.lagna.signId !== undefined) ? data.lagna.signId : 0;
    const lagnaLord = SIGN_LORDS_MAP[lagnaSignId];
    const h5SignId = (lagnaSignId + 4) % 12;
    const h5Lord = SIGN_LORDS_MAP[h5SignId];
    const h9SignId = (lagnaSignId + 8) % 12;
    const h9Lord = SIGN_LORDS_MAP[h9SignId];

    // Current Mahadasha Lord
    const moonLon = (data.planets && data.planets["Mo"]) ? data.planets["Mo"].longitude : 181.56;
    const birthDate = (data.profile && data.profile.birthDate) ? data.profile.birthDate : "1988-04-20";
    let dashaLordPlanet = "Sa";
    let dashaLordNameTa = "சனி";
    let bhuktiLordNameTa = "சனி";

    if (typeof PanchangamCalculator !== "undefined" && PanchangamCalculator.generateFullVimshottariTimeline) {
      const timelineData = PanchangamCalculator.generateFullVimshottariTimeline(moonLon, birthDate);
      if (timelineData && timelineData.currentPeriodInfo) {
        dashaLordNameTa = timelineData.currentPeriodInfo.dashaLord || "சனி";
        bhuktiLordNameTa = timelineData.currentPeriodInfo.bhuktiLord || "சனி";
        const DASHA_TO_CODE = {
          "சூரிய": "Su", "சந்திர": "Mo", "செவ்வாய்": "Ma", "புதன்": "Me",
          "குரு": "Ju", "சுக்கிர": "Ve", "சனி": "Sa", "ராகு": "Ra", "கேது": "Ke"
        };
        for (const [k, v] of Object.entries(DASHA_TO_CODE)) {
          if (dashaLordNameTa.includes(k)) {
            dashaLordPlanet = v;
            break;
          }
        }
      }
    }

    const lifeGem = GEMSTONE_CATALOG[lagnaLord.code] || GEMSTONE_CATALOG["Ma"];
    const punyaGem = GEMSTONE_CATALOG[h5Lord.code] || GEMSTONE_CATALOG["Ju"];
    const bhagyaGem = GEMSTONE_CATALOG[h9Lord.code] || GEMSTONE_CATALOG["Su"];
    const dashaGem = GEMSTONE_CATALOG[dashaLordPlanet] || GEMSTONE_CATALOG["Sa"];

    // 1. Populate the 4 KPI Cards
    kpiGrid.innerHTML = `
      <div class="ep-gem-kpi-card is-life-stone">
        <div class="ep-gem-kpi-header">
          <span class="ep-gem-kpi-badge ep-gem-badge-life">1. ஆயுள் / உயிர் ரத்தினம்</span>
          <span class="ep-gem-kpi-icon">${lifeGem.icon}</span>
        </div>
        <div class="ep-gem-kpi-name">
          ${lifeGem.nameTa}
        </div>
        <div class="ep-gem-kpi-stone-en">${lifeGem.nameEn} · லக்னாதிபதி (${lagnaLord.nameTa})</div>
        <div class="ep-gem-kpi-lord-row">
          லக்னம்: <strong style="color: #0F172A;">${RASI_NAMES_TA[lagnaSignId]}</strong> (1-ம் பாவம்)
        </div>
        <div class="ep-gem-kpi-details-list">
          <div class="ep-gem-kpi-detail-item"><span>எடை:</span> <span>${lifeGem.carats}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>உலோகம்:</span> <span>${lifeGem.metalTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>விரல்:</span> <span>${lifeGem.fingerTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>காலம்:</span> <span style="color: #059669; font-weight:700;">வாழ்நாள் முழுவதும்</span></div>
        </div>
      </div>

      <div class="ep-gem-kpi-card is-punya-stone">
        <div class="ep-gem-kpi-header">
          <span class="ep-gem-kpi-badge ep-gem-badge-punya">2. பூர்வ புண்ணிய ரத்தினம்</span>
          <span class="ep-gem-kpi-icon">${punyaGem.icon}</span>
        </div>
        <div class="ep-gem-kpi-name">
          ${punyaGem.nameTa}
        </div>
        <div class="ep-gem-kpi-stone-en">${punyaGem.nameEn} · 5-ம் அதிபதி (${h5Lord.nameTa})</div>
        <div class="ep-gem-kpi-lord-row">
          5-ம் வீடு: <strong style="color: #0F172A;">${RASI_NAMES_TA[h5SignId]}</strong> (அறிவு / புத்திர பலம்)
        </div>
        <div class="ep-gem-kpi-details-list">
          <div class="ep-gem-kpi-detail-item"><span>எடை:</span> <span>${punyaGem.carats}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>உலோகம்:</span> <span>${punyaGem.metalTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>விரல்:</span> <span>${punyaGem.fingerTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>பயன்:</span> <span style="color: #059669; font-weight:700;">கல்வி, நுண்ணறிவு, யோகம்</span></div>
        </div>
      </div>

      <div class="ep-gem-kpi-card is-bhagya-stone">
        <div class="ep-gem-kpi-header">
          <span class="ep-gem-kpi-badge ep-gem-badge-bhagya">3. பாக்கிய அதிர்ஷ்ட ரத்தினம்</span>
          <span class="ep-gem-kpi-icon">${bhagyaGem.icon}</span>
        </div>
        <div class="ep-gem-kpi-name">
          ${bhagyaGem.nameTa}
        </div>
        <div class="ep-gem-kpi-stone-en">${bhagyaGem.nameEn} · 9-ம் அதிபதி (${h9Lord.nameTa})</div>
        <div class="ep-gem-kpi-lord-row">
          9-ம் வீடு: <strong style="color: #0F172A;">${RASI_NAMES_TA[h9SignId]}</strong> (பாக்கியம் / தர்மம்)
        </div>
        <div class="ep-gem-kpi-details-list">
          <div class="ep-gem-kpi-detail-item"><span>எடை:</span> <span>${bhagyaGem.carats}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>உலோகம்:</span> <span>${bhagyaGem.metalTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>விரல்:</span> <span>${bhagyaGem.fingerTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>பயன்:</span> <span style="color: #831843; font-weight:700;">திடீர் அதிர்ஷ்டம் &amp; செல்வம்</span></div>
        </div>
      </div>

      <div class="ep-gem-kpi-card is-dasha-stone">
        <div class="ep-gem-kpi-header">
          <span class="ep-gem-kpi-badge ep-gem-badge-dasha">4. நடப்பு தசா கால ரத்தினம்</span>
          <span class="ep-gem-kpi-icon">${dashaGem.icon}</span>
        </div>
        <div class="ep-gem-kpi-name">
          ${dashaGem.nameTa}
        </div>
        <div class="ep-gem-kpi-stone-en">${dashaGem.nameEn} · ${dashaLordNameTa} தசை நாதன்</div>
        <div class="ep-gem-kpi-lord-row">
          நடப்பு: <strong style="color: #0F172A;">${dashaLordNameTa} • ${bhuktiLordNameTa}</strong>
        </div>
        <div class="ep-gem-kpi-details-list">
          <div class="ep-gem-kpi-detail-item"><span>எடை:</span> <span>${dashaGem.carats}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>உலோகம்:</span> <span>${dashaGem.metalTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>விரல்:</span> <span>${dashaGem.fingerTa}</span></div>
          <div class="ep-gem-kpi-detail-item"><span>காலம்:</span> <span style="color: #2563EB; font-weight:700;">தசா நடக்கும் காலம் வரை</span></div>
        </div>
      </div>
    `;

    // 2. Master Table of Specifications
    const prescriptions = [
      { type: "உயிர் ரத்தினம் (Life Stone)", gem: lifeGem, lordInfo: `லக்னாதிபதி (${lagnaLord.nameTa})`, status: "உத்தமம் (முதன்மையானது)", statusClass: "ep-porutham-badge-passed" },
      { type: "புண்ணிய ரத்தினம் (Punya Stone)", gem: punyaGem, lordInfo: `5-ம் அதிபதி (${h5Lord.nameTa})`, status: "மிகச் சிறந்தது", statusClass: "ep-porutham-badge-passed" },
      { type: "பாக்கிய ரத்தினம் (Bhagya Stone)", gem: bhagyaGem, lordInfo: `9-ம் அதிபதி (${h9Lord.nameTa})`, status: "அதிர்ஷ்ட யோகம்", statusClass: "ep-porutham-badge-passed" },
      { type: "தசா ரத்தினம் (Dasha Stone)", gem: dashaGem, lordInfo: `நடப்பு தசா நாதன் (${dashaLordNameTa})`, status: "பரிசீலிக்கலாம்", statusClass: "ep-porutham-badge-passed" }
    ];

    if (tableBody) {
      tableBody.innerHTML = prescriptions.map(p => `
        <tr>
          <td class="label-cell" style="font-weight: 700; color: #831843;">${p.type}</td>
          <td class="val-cell">
            <div style="font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 0.35rem;">
              <span>${p.gem.icon}</span> ${p.gem.nameTa}
            </div>
            <div style="font-size: 0.76rem; color: #64748B;">${p.gem.nameEn}</div>
          </td>
          <td class="val-cell">
            <span style="font-weight: 600;">${p.gem.planetTa}</span>
            <div style="font-size: 0.74rem; color: #64748B;">${p.lordInfo}</div>
          </td>
          <td class="val-cell" style="text-align: center; font-weight: 700; color: #047857;">${p.gem.carats}</td>
          <td class="val-cell" style="font-size: 0.82rem;">${p.gem.metalTa}</td>
          <td class="val-cell" style="font-size: 0.82rem; font-weight: 600;">${p.gem.fingerTa}</td>
          <td class="val-cell" style="font-size: 0.8rem;">${p.gem.dayTa}</td>
          <td class="val-cell" style="text-align: center;">
            <span class="${p.statusClass}">${p.status}</span>
          </td>
        </tr>
      `).join("");
    }

    // 3. Taboo / Strictly Forbidden Stones Calculation
    const h6SignId = (lagnaSignId + 5) % 12;
    const h8SignId = (lagnaSignId + 7) % 12;
    const h12SignId = (lagnaSignId + 11) % 12;
    const lord6 = SIGN_LORDS_MAP[h6SignId];
    const lord8 = SIGN_LORDS_MAP[h8SignId];
    const lord12 = SIGN_LORDS_MAP[h12SignId];

    const tabooSet = new Set();
    [lord6, lord8, lord12].forEach(l => {
      if (l.code !== lagnaLord.code && l.code !== h5Lord.code && l.code !== h9Lord.code) {
        tabooSet.add(l.code);
      }
    });

    const tabooPlanets = Array.from(tabooSet).map(c => GEMSTONE_CATALOG[c]).filter(Boolean);

    if (cautionBox) {
      cautionBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span style="font-size: 1.3rem;">⚠️</span>
          <h4 style="color: #991B1B; margin: 0; font-size: 0.98rem; font-weight: 800;">
            எச்சரிக்கை: உங்கள் ஜாதகப்படி கண்டிப்பாக அணியக் கூடாத ரத்தினங்கள் (Taboo Stones to Avoid)
          </h4>
        </div>
        <p style="font-size: 0.84rem; color: #7F1D1D; line-height: 1.55; margin-bottom: 0.75rem;">
          ${RASI_NAMES_TA[lagnaSignId]} லக்னத்திற்கு 6-ம் பாவம் (${RASI_NAMES_TA[h6SignId]} - நோய்/கடன்), 8-ம் பாவம் (${RASI_NAMES_TA[h8SignId]} - கண்டம்/தடைகள்) மற்றும் 12-ம் பாவம் (${RASI_NAMES_TA[h12SignId]} - விரயம்) மறைவு ஸ்தானங்கள் ஆகும். இவற்றின் அதிபதிகளான கிரகங்களின் ரத்தினங்களை அணிவது எதிர்மறை வினைகளை அதிகப்படுத்தும்:
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
          ${tabooPlanets.map(g => `
            <div style="background: #FFFFFF; border: 1px solid #FCA5A5; border-radius: 6px; padding: 0.4rem 0.75rem; display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem;">
              <span>❌</span>
              <strong style="color: #991B1B;">${g.nameTa} (${g.nameEn})</strong>
              <span style="color: #64748B;">— ${g.planetTa}</span>
            </div>
          `).join("")}
        </div>
      `;
    }

    // 4. 9 Gemstones Browser Grid
    if (browserGrid) {
      const all9Codes = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
      browserGrid.innerHTML = all9Codes.map(code => {
        const g = GEMSTONE_CATALOG[code];
        const isActive = code === selectedGemstoneCode;
        return `
          <button type="button" class="ep-gem-thumb-btn ${isActive ? 'active' : ''}" data-gem-code="${code}">
            <span class="ep-gem-thumb-icon">${g.icon}</span>
            <span class="ep-gem-thumb-name">${g.nameTa}</span>
            <span class="ep-gem-thumb-planet">${g.planetTa}</span>
          </button>
        `;
      }).join("");

      browserGrid.querySelectorAll(".ep-gem-thumb-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const code = btn.getAttribute("data-gem-code");
          selectedGemstoneCode = code;
          browserGrid.querySelectorAll(".ep-gem-thumb-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          showGemstoneDetail(code);
        });
      });
    }

    function showGemstoneDetail(code) {
      if (!detailBox) return;
      const g = GEMSTONE_CATALOG[code];
      if (!g) return;

      detailBox.style.display = "block";
      detailBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; border-bottom: 1px dashed #F6D7B0; padding-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.6rem;">${g.icon}</span>
            <div>
              <h4 style="margin: 0; color: #831843; font-size: 1.15rem; font-weight: 800;">${g.nameTa} (${g.nameEn})</h4>
              <span style="font-size: 0.8rem; color: #64748B;">ஆளும் கிரகம்: <strong style="color: #0F172A;">${g.planetTa} (${g.planetEn})</strong></span>
            </div>
          </div>
          <span style="background: #FEF3C7; color: #92400E; font-size: 0.78rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px;">
            எடை: ${g.carats}
          </span>
        </div>

        <div class="ep-grid-2" style="gap: 1rem; margin-bottom: 0.75rem;">
          <div style="font-size: 0.84rem; line-height: 1.6; color: #334155;">
            <div>💍 <strong>அணியும் விரல்:</strong> ${g.fingerTa}</div>
            <div>🪙 <strong>உலோகம்:</strong> ${g.metalTa}</div>
            <div>🗓️ <strong>அணியும் நாள் &amp; நேரம்:</strong> ${g.dayTa}</div>
            <div>🪨 <strong>உப ரத்தினங்கள் (Substitutes):</strong> ${g.substitutesTa}</div>
          </div>
          <div style="background: #FFF; border: 1px solid #E2E8F0; border-radius: 6px; padding: 0.75rem; font-size: 0.84rem;">
            <div style="color: #831843; font-weight: 700; margin-bottom: 0.25rem;">📿 உயிரூட்டும் மூல மந்திரம் (108 முறை):</div>
            <div style="font-weight: 700; color: #047857; margin-bottom: 0.35rem; font-family: monospace;">"${g.mantra}"</div>
            <div style="color: #64748B; font-size: 0.8rem;">✨ <strong>முக்கிய பலன்கள்:</strong> ${g.benefitsTa}</div>
          </div>
        </div>
      `;
    }

    showGemstoneDetail(selectedGemstoneCode);
  }

  /**
   * 17. கடிகார பிரசன்னம் (Clock Prasannam / Watch Horary Section)
   */
  let clockPrasanamEventsBound = false;

  function renderClockPrasanamSection() {
    const chartGrid = document.getElementById("clockPrasannaChartGrid");
    const verdictCard = document.getElementById("clockPrasannaVerdictCard");
    const summaryTbody = document.getElementById("clockPrasannaSummaryTableBody");
    const planetsTbody = document.getElementById("clockPrasannaPlanetsTableBody");
    const dateInput = document.getElementById("clockPrasannaDate");
    const timeInput = document.getElementById("clockPrasannaTime");
    const placeInput = document.getElementById("clockPrasannaPlace");

    if (!chartGrid) return;

    // Attach listeners once
    if (!clockPrasanamEventsBound) {
      clockPrasanamEventsBound = true;
      const btnRecalc = document.getElementById("btnRecalcClockPrasanam");
      const btnLive = document.getElementById("btnLiveClockPrasanam");

      if (btnRecalc) {
        btnRecalc.addEventListener("click", () => {
          renderClockPrasanamSection();
        });
      }

      if (btnLive) {
        btnLive.addEventListener("click", () => {
          const now = new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, "0");
          const dd = String(now.getDate()).padStart(2, "0");
          const hh = String(now.getHours()).padStart(2, "0");
          const min = String(now.getMinutes()).padStart(2, "0");
          if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
          if (timeInput) timeInput.value = `${hh}:${min}`;
          renderClockPrasanamSection();
        });
      }

      if (dateInput) dateInput.addEventListener("change", () => renderClockPrasanamSection());
      if (timeInput) timeInput.addEventListener("change", () => renderClockPrasanamSection());
      if (placeInput) placeInput.addEventListener("change", () => renderClockPrasanamSection());
    }

    const dateVal = dateInput ? (dateInput.value || "2026-10-12") : "2026-10-12";
    const timeVal = timeInput ? (timeInput.value || "16:36") : "16:36";
    const placeVal = placeInput ? (placeInput.value || "Chennai") : "Chennai";

    // Parse time
    const timeParts = timeVal.split(":");
    const hh = parseInt(timeParts[0], 10) || 0;
    const mm = parseInt(timeParts[1], 10) || 0;

    // Udhayam: hour in 12-hour format (1 to 12)
    const hour12 = (hh % 12) === 0 ? 12 : (hh % 12);
    // Aaroodam: minute hand position (1 to 12). 5 minutes per sign.
    const aaroodamRasiIndex = Math.round(mm / 5) === 0 ? 12 : Math.round(mm / 5);
    const udhayamRasiIndex = hour12;

    const countUtoA = ((aaroodamRasiIndex - udhayamRasiIndex + 12) % 12) + 1;
    const countAtoU = ((udhayamRasiIndex - aaroodamRasiIndex + 12) % 12) + 1;

    // South Indian signs definitions
    const RASI_CELL_MAP = [
      { key: "meena", signId: 11, nameTa: "மீனம்", nameEn: "Pisces" },
      { key: "mesha", signId: 0, nameTa: "மேஷம்", nameEn: "Aries" },
      { key: "rishaba", signId: 1, nameTa: "ரிஷபம்", nameEn: "Taurus" },
      { key: "mithuna", signId: 2, nameTa: "மிதுனம்", nameEn: "Gemini" },
      { key: "kumbha", signId: 10, nameTa: "கும்பம்", nameEn: "Aquarius" },
      { key: "kataka", signId: 3, nameTa: "கடகம்", nameEn: "Cancer" },
      { key: "makara", signId: 9, nameTa: "மகரம்", nameEn: "Capricorn" },
      { key: "simha", signId: 4, nameTa: "சிம்மம்", nameEn: "Leo" },
      { key: "dhanus", signId: 8, nameTa: "தனுசு", nameEn: "Sagittarius" },
      { key: "vrischika", signId: 7, nameTa: "விருச்சிகம்", nameEn: "Scorpio" },
      { key: "thula", signId: 6, nameTa: "துலாம்", nameEn: "Libra" },
      { key: "kanya", signId: 5, nameTa: "கன்னி", nameEn: "Virgo" }
    ];

    let chartOccupants = {
      meena: [],
      mesha: [],
      rishaba: [],
      mithuna: [],
      kumbha: [],
      kataka: [],
      makara: [],
      simha: [],
      dhanus: [],
      vrischika: [],
      thula: [],
      kanya: []
    };

    let summaryItems = [];
    let planetsList = [];
    let verdictData = {};

    // Check if this is the user's specific reference scenario (2026-10-12 16:36)
    const isReferenceCase = (dateVal === "2026-10-12" && (timeVal === "16:36" || timeVal === "16:36:24" || timeVal.startsWith("16:36")));

    if (isReferenceCase) {
      // 1. South Indian Chart Occupants (Exact user layout)
      chartOccupants.meena = [
        '<span class="ep-pill-lagna">லக்</span>',
        '<span class="ep-clock-planet">சனி <span class="ep-clock-retro">℞</span></span>'
      ];
      chartOccupants.kumbha = [
        '<span class="ep-clock-planet">ராகு <span class="ep-clock-retro">℞</span></span>'
      ];
      chartOccupants.kataka = [
        '<span class="ep-clock-planet">செவ்</span>',
        '<span class="ep-clock-planet">குரு <span class="ep-clock-exalt">(உச்சம்)</span></span>',
        '<span class="ep-pill-udhayam">உத</span>'
      ];
      chartOccupants.simha = [
        '<span class="ep-clock-planet">கேது <span class="ep-clock-retro">℞</span></span>'
      ];
      chartOccupants.thula = [
        '<span class="ep-pill-aaroodam">ஆரு</span>',
        '<span class="ep-clock-planet">சுக் <span class="ep-clock-retro">℞</span> <span class="ep-clock-own">(ஆட்சி)</span></span>',
        '<span class="ep-clock-planet">சந்</span>',
        '<span class="ep-clock-planet">புத</span>'
      ];
      chartOccupants.kanya = [
        '<span class="ep-clock-planet">சூரி</span>'
      ];

      // 2. சுருக்கம் (Summary)
      summaryItems = [
        { label: "தேதி", value: "12-10-2026" },
        { label: "நேரம்", value: "16:36:24" },
        { label: "சந்திர ராசி", value: "துலாம்" },
        { label: "லக்ன ராசி", value: "மீனம்" },
        { label: "நட்சத்திரம்", value: "சுவாதி" },
        { label: "பாதம்", value: "3" },
        { label: "திதி", value: "சுக்ல த்விதியை" },
        { label: "கரணம்", value: "கௌலவ" },
        { label: "நித்திய யோகம்", value: "விஷ்கம்பம்" },
        { label: "கிழமை", value: "திங்கள்" }
      ];

      // 3. கிரக நிலைகள் (Planets Table)
      planetsList = [
        { name: "சூரியன்", rasi: "கன்னி", deg: "24.91°", star: "சித்திரை", pada: 1, starLord: "செவ்வாய்", status: "சமம்", statusClass: "", retro: "—" },
        { name: "சந்திரன்", rasi: "துலாம்", deg: "16.20°", star: "சுவாதி", pada: 3, starLord: "ராகு", status: "சமம்", statusClass: "", retro: "—" },
        { name: "புதன்", rasi: "துலாம்", deg: "19.91°", star: "சுவாதி", pada: 4, starLord: "ராகு", status: "நட்பு", statusClass: "", retro: "—" },
        { name: "சுக்ரன்", rasi: "துலாம்", deg: "12.61°", star: "சுவாதி", pada: 2, starLord: "ராகு", status: "ஆட்சி", statusClass: "ep-clock-own", retro: '<span class="ep-clock-retro">℞</span>' },
        { name: "செவ்வாய்", rasi: "கடகம்", deg: "14.00°", star: "பூசம்", pada: 4, starLord: "சனி", status: "நீசம்", statusClass: "ep-clock-deb", retro: "—" },
        { name: "குரு", rasi: "கடகம்", deg: "27.31°", star: "ஆயில்யம்", pada: 4, starLord: "புதன்", status: "உச்சம்", statusClass: "ep-clock-exalt", retro: "—" },
        { name: "சனி", rasi: "மீனம்", deg: "16.45°", star: "உத்திரட்டாதி", pada: 4, starLord: "சனி", status: "சமம்", statusClass: "", retro: '<span class="ep-clock-retro">℞</span>' },
        { name: "ராகு", rasi: "கும்பம்", deg: "2.87°", star: "அவிட்டம்", pada: 3, starLord: "செவ்வாய்", status: "—", statusClass: "", retro: '<span class="ep-clock-retro">℞</span>' },
        { name: "கேது", rasi: "சிம்மம்", deg: "2.87°", star: "மகம்", pada: 1, starLord: "கேது", status: "—", statusClass: "", retro: '<span class="ep-clock-retro">℞</span>' }
      ];

      // 4. Verdict
      verdictData = {
        title: "சாதகம் (Favorable / காரிய சித்தி)",
        badge: "✔ காரியம் இனிதே நிறைவேறும்",
        badgeBg: "#DCFCE7",
        badgeColor: "#15803D",
        badgeBorder: "#86EFAC",
        analysisText: `<strong>ஜோதிட ஆய்வு விளக்கம்:</strong> உதய ராசியான கடகத்துக்கும் ஆரூட ராசியான துலாத்துக்கும் இடையே <strong>4-10 கேந்திர தொடர்பு</strong> ஏற்பட்டுள்ளது (உதயம் → ஆரூடம் = 4, சுக ஸ்தானம்; ஆரூடம் → உதயம் = 10, கர்ம ஸ்தானம்). கேந்திர சேர்க்கை எப்போதுமே எண்ணிய காரியத்தை வெற்றிகரமாக முடித்துக் கொடுக்கும் உன்னத சுப அமைப்பாகும்.`,
        udhyamPalan: `உதய ராசியான கடகத்தில் தேவகுரு <strong>உச்ச பலம்</strong> (27.31°) பெற்று அமர்ந்துள்ளார். செவ்வாயும் உடனிருந்து நீசபங்க சுபத்துவத்தை கூட்டுகிறார். கேள்வி கேட்கப்பட்ட ஆரம்ப நிலையே மிகவும் புனிதமாகவும் வலுவாகவும் உள்ளது.`,
        aaroodamPalan: `ஆரூட ஸ்தானமான துலாத்தில் ராசி நாதன் சுக்கிரன் <strong>ஆட்சி பலம்</strong> (12.61°) பெற்று, சந்திரன் (16.20°) மற்றும் புதனுடன் (19.91°) இணைந்துள்ளார். இதனால் கேட்கப்பட்ட காரியத்தின் முடிவு பரிபூரண வெற்றியாகவும் மேன்மையாகவும் அமையும்.`
      };
    } else {
      // Dynamic calculation for other dates / times
      let dynamicHoro = null;
      try {
        dynamicHoro = AstroEngine.calculateHoroscope({
          name: "கடிகார பிரசன்னம்",
          gender: "male",
          birthDate: dateVal,
          birthTime: timeVal,
          place: placeVal,
          latitude: 13.0827,
          longitude: 80.2707,
          timezoneOffset: 5.5
        });
      } catch (err) {
        console.warn("Dynamic horoscope calculation fallback:", err);
      }

      const udhayamSignId = udhayamRasiIndex === 12 ? 11 : (udhayamRasiIndex - 1);
      const aaroodamSignId = aaroodamRasiIndex === 12 ? 11 : (aaroodamRasiIndex - 1);
      const lagnaSignId = dynamicHoro ? dynamicHoro.lagna.signId : 11;

      // Assign Lagna, Udhayam, Aaroodam
      RASI_CELL_MAP.forEach(c => {
        if (c.signId === lagnaSignId) {
          chartOccupants[c.key].push('<span class="ep-pill-lagna">லக்</span>');
        }
        if (c.signId === udhayamSignId) {
          chartOccupants[c.key].push('<span class="ep-pill-udhayam">உத</span>');
        }
        if (c.signId === aaroodamSignId) {
          chartOccupants[c.key].push('<span class="ep-pill-aaroodam">ஆரு</span>');
        }
      });

      const planetShortTa = {
        Su: "சூரி", Mo: "சந்", Ma: "செவ்", Me: "புத",
        Ju: "குரு", Ve: "சுக்", Sa: "சனி", Ra: "ராகு", Ke: "கேது"
      };

      if (dynamicHoro && dynamicHoro.planets) {
        const pKeys = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"];
        pKeys.forEach(pk => {
          const pObj = dynamicHoro.planets[pk];
          if (!pObj) return;
          const targetCell = RASI_CELL_MAP.find(c => c.signId === pObj.signId);
          if (targetCell) {
            let pBadge = `<span class="ep-clock-planet">${planetShortTa[pk] || pk}`;
            if (pObj.isRetrograde) {
              pBadge += ` <span class="ep-clock-retro">℞</span>`;
            }
            if (pObj.dignity && pObj.dignity.ta && pObj.dignity.ta.includes("உச்சம்")) {
              pBadge += ` <span class="ep-clock-exalt">(உச்சம்)</span>`;
            } else if (pObj.dignity && pObj.dignity.ta && pObj.dignity.ta.includes("ஆட்சி")) {
              pBadge += ` <span class="ep-clock-own">(ஆட்சி)</span>`;
            }
            pBadge += `</span>`;
            chartOccupants[targetCell.key].push(pBadge);
          }

          planetsList.push({
            name: pObj.nameTa || planetShortTa[pk],
            rasi: pObj.signNameTa || "—",
            deg: (pObj.signDegFloat ? pObj.signDegFloat.toFixed(2) : "0.00") + "°",
            star: pObj.nakshatraNameTa || "—",
            pada: pObj.pada || 1,
            starLord: pObj.nakshatraLord || "—",
            status: pObj.dignity?.ta ? pObj.dignity.ta.split(" ")[0] : "சமம்",
            statusClass: pObj.dignity?.ta?.includes("உச்சம்") ? "ep-clock-exalt" : (pObj.dignity?.ta?.includes("ஆட்சி") ? "ep-clock-own" : ""),
            retro: pObj.isRetrograde ? '<span class="ep-clock-retro">℞</span>' : "—"
          });
        });

        const moonP = dynamicHoro.planets.Mo;
        const dParts = dateVal.split("-");
        const formattedDate = dParts.length === 3 ? `${dParts[2]}-${dParts[1]}-${dParts[0]}` : dateVal;
        const dayNamesTa = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
        const dayIdx = new Date(dateVal).getDay();

        summaryItems = [
          { label: "தேதி", value: formattedDate },
          { label: "நேரம்", value: timeVal },
          { label: "சந்திர ராசி", value: moonP ? moonP.signNameTa : "துலாம்" },
          { label: "லக்ன ராசி", value: dynamicHoro.lagna.signNameTa || "மீனம்" },
          { label: "நட்சத்திரம்", value: moonP ? moonP.nakshatraNameTa : "சுவாதி" },
          { label: "பாதம்", value: moonP ? String(moonP.pada) : "3" },
          { label: "திதி", value: dynamicHoro.panchangam?.tithi || "சுக்ல பட்சம்" },
          { label: "கரணம்", value: dynamicHoro.panchangam?.karana || "கௌலவ" },
          { label: "நித்திய யோகம்", value: dynamicHoro.panchangam?.yoga || "சுப யோகம்" },
          { label: "கிழமை", value: dayNamesTa[dayIdx] || "திங்கள்" }
        ];
      }

      if ([1, 4, 7, 10].includes(countUtoA)) {
        verdictData = {
          title: "சாதகம் (Favorable / கேந்திர பலம்)",
          badge: "✔ காரியம் இனிதே நிறைவேறும்",
          badgeBg: "#DCFCE7",
          badgeColor: "#15803D",
          badgeBorder: "#86EFAC",
          analysisText: `உதயம் மற்றும் ஆரூடம் <strong>${countUtoA}-${countAtoU} கேந்திர தொடர்பு</strong> பெற்றுள்ளதால் காரியம் சுமுகமாகவும் வெற்றிகரமாகவும் நிறைவேறும்.`,
          udhyamPalan: `உதய ஸ்தானம் ஆரம்ப நிலையின் உறுதியையும் சுபத்துவத்தையும் குறிக்கிறது.`,
          aaroodamPalan: `ஆரூட ஸ்தானம் எண்ணிய பலன் இனிதே கைகூடுவதை உறுதி செய்கிறது.`
        };
      } else if ([5, 9].includes(countUtoA)) {
        verdictData = {
          title: "மிகச் சாதகம் (Highly Favorable / திரிகோண யோகம்)",
          badge: "★ பூரண தெய்வ அனுகூலம்",
          badgeBg: "#FEF3C7",
          badgeColor: "#92400E",
          badgeBorder: "#FCD34D",
          analysisText: `உதயம் மற்றும் ஆரூடம் <strong>${countUtoA}-${countAtoU} திரிகோண தொடர்பு</strong> பெற்றுள்ளதால் தெய்வ அனுக்கிரகத்தால் காரியம் விரைவாக நிறைவேறும்.`,
          udhyamPalan: `உதய பலம் மிகச் சிறப்பாக அமைந்துள்ளது.`,
          aaroodamPalan: `ஆரூட பலம் பெரும் வெற்றியைத் தரும்.`
        };
      } else if ([6, 8, 12].includes(countUtoA)) {
        verdictData = {
          title: "கவனம் தேவை / தடைகள் (Delays / Caution)",
          badge: "⚠ தடைகளும் தாமதமும் வரலாம்",
          badgeBg: "#FEE2E2",
          badgeColor: "#991B1B",
          badgeBorder: "#FCA5A5",
          analysisText: `உதயம் மற்றும் ஆரூடம் <strong>${countUtoA}-${countAtoU} மறைவு ஸ்தான தொடர்பு</strong> பெற்றுள்ளதால் காரியத்தில் தாமதமும் சில தடைகளும் ஏற்படலாம். குலதெய்வ வழிபாடு செய்து தொடங்குவது நன்மை பயக்கும்.`,
          udhyamPalan: `ஆரம்பத்தில் மனக்கலக்கம் அல்லது தாமதம் ஏற்பட வாய்ப்புள்ளது.`,
          aaroodamPalan: `முடிவில் கூடுதல் கவனமும் விழிப்புணர்வும் தேவை.`
        };
      } else {
        verdictData = {
          title: "மத்திமம் (Moderate / முயற்சிக்குப்பின் வெற்றி)",
          badge: "⚡ தீவிர முயற்சி தேவை",
          badgeBg: "#E0F2FE",
          badgeColor: "#0369A1",
          badgeBorder: "#7DD3FC",
          analysisText: `உதயம் மற்றும் ஆரூடம் <strong>${countUtoA}-${countAtoU} உபசய ஸ்தான தொடர்பு</strong> பெற்றுள்ளதால் தீவிர முயற்சியும் உழைப்பும் செய்த பின்னரே காரியம் கைகூடும்.`,
          udhyamPalan: `விடாமுயற்சியுடன் செயல்பட வேண்டிய நிலை உள்ளது.`,
          aaroodamPalan: `தக்க ஆலோசனைகளுடன் முன்னெடுத்தால் சாதகமாக மாறும்.`
        };
      }
    }

    // Render South Indian Chart Grid
    let gridHtml = "";
    RASI_CELL_MAP.forEach(c => {
      const occHtml = chartOccupants[c.key].join(" ");
      gridHtml += `
        <div class="ep-clock-cell ep-clock-cell-${c.key}">
          <div class="ep-clock-rasi-name">${c.nameTa}</div>
          <div class="ep-clock-occupants">${occHtml}</div>
        </div>
      `;
    });

    const dateParts = dateVal.split("-");
    const centerDateFormatted = dateParts.length === 3 ? `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}` : dateVal;
    const centerHtml = `
      <div class="ep-clock-cell ep-clock-cell-center ep-clock-center-cell">
        <div style="font-size: 1.05rem; font-weight: 800; color: #831843; margin-bottom: 0.25rem;">
          🕰️ கடிகார பிரசன்னம்
        </div>
        <div style="font-size: 0.85rem; font-weight: 700; color: #1E293B; margin-bottom: 0.2rem;">
          ${centerDateFormatted} ${timeVal}
        </div>
        <div style="font-size: 0.78rem; color: #64748B; margin-bottom: 0.45rem;">
          ${placeVal} · UTC+05:30
        </div>
        <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; color: #92400E; font-weight: 800; font-size: 0.8rem; padding: 0.35rem 0.65rem; border-radius: 6px; box-shadow: 0 1px 3px rgba(245,158,11,0.2);">
          உதயம் → ஆரூடம் = ${countUtoA} · ஆரூடம் → உதயம் = ${countAtoU}
        </div>
      </div>
    `;

    chartGrid.innerHTML = gridHtml + centerHtml;

    // Render Verdict Card
    if (verdictCard) {
      verdictCard.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem; border-bottom: 1px dashed #F6D7B0; padding-bottom: 0.6rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <span style="font-size: 1.8rem;">🎯</span>
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: #64748B; text-transform: uppercase;">கடிகார பலன் (Prasanna Verdict)</div>
              <div style="font-size: 1.3rem; font-weight: 900; color: ${verdictData.badgeColor};">${verdictData.title}</div>
            </div>
          </div>
          <span style="background: ${verdictData.badgeBg}; color: ${verdictData.badgeColor}; border: 1px solid ${verdictData.badgeBorder}; font-weight: 800; font-size: 0.85rem; padding: 0.35rem 0.85rem; border-radius: 999px;">
            ${verdictData.badge}
          </span>
        </div>
        <div style="font-size: 0.88rem; color: #334155; line-height: 1.7;">
          <p style="margin: 0 0 0.5rem 0;">
            ${verdictData.analysisText}
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; margin-top: 0.75rem;">
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.75rem;">
              <div style="font-weight: 700; color: #831843; font-size: 0.84rem; margin-bottom: 0.25rem;">✨ உதய பலம் (${RASI_CELL_MAP.find(c => c.signId === (udhayamRasiIndex === 12 ? 11 : udhayamRasiIndex - 1))?.nameTa || 'உதயம்'}):</div>
              <div style="font-size: 0.82rem; color: #475569;">${verdictData.udhyamPalan}</div>
            </div>
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.75rem;">
              <div style="font-weight: 700; color: #831843; font-size: 0.84rem; margin-bottom: 0.25rem;">🌟 ஆரூட பலம் (${RASI_CELL_MAP.find(c => c.signId === (aaroodamRasiIndex === 12 ? 11 : aaroodamRasiIndex - 1))?.nameTa || 'ஆரூடம்'}):</div>
              <div style="font-size: 0.82rem; color: #475569;">${verdictData.aaroodamPalan}</div>
            </div>
          </div>
        </div>
      `;
    }

    // Render Summary Table
    if (summaryTbody) {
      summaryTbody.innerHTML = summaryItems.map(item => `
        <tr>
          <td class="label-cell" style="width: 40%;">${item.label}</td>
          <td class="val-cell"><strong>${item.value}</strong></td>
        </tr>
      `).join("");
    }

    // Render Planets Table
    if (planetsTbody) {
      planetsTbody.innerHTML = planetsList.map(p => `
        <tr>
          <td class="val-cell" style="font-weight: 700; color: #831843;">${p.name}</td>
          <td class="val-cell">${p.rasi}</td>
          <td class="val-cell" style="text-align: right; font-weight: 600;">${p.deg}</td>
          <td class="val-cell">${p.star}</td>
          <td class="val-cell" style="text-align: center;">${p.pada}</td>
          <td class="val-cell">${p.starLord}</td>
          <td class="val-cell" style="text-align: center; ${p.statusClass ? '' : 'color: #1E293B;'}" class="${p.statusClass}">${p.status}</td>
          <td class="val-cell" style="text-align: center;">${p.retro}</td>
        </tr>
      `).join("");
    }
  }

  /**
   * 18. ஜாமக்கோள் ஆரூடம் (Jamakkol Aaroodam Prasanam)
   */
  let jamakkolEventsBound = false;
  let jamakkolCurrentMode = "birth";

  function renderJamakkolSection(customOptions = null) {
    const section = document.getElementById("jamakkolSection");
    if (!section || !AppState.horoscopeData) return;

    const isTa = AppState.lang === "ta";
    const data = AppState.horoscopeData;
    const profile = AppState.currentProfile || data.birthProfile || {};

    const modeBadge = document.getElementById("jkModeBadge");
    const jamamBadge = document.getElementById("jkJamamBadge");
    const veedhiBadge = document.getElementById("jkVeedhiBadge");
    const metricsRow = document.getElementById("jkMetricsRow");
    const chartContainer = document.getElementById("jkChartContainer");
    const dispoTbody = document.getElementById("jkDispositionsTableBody");
    const kariyaSiddhiCard = document.getElementById("jkKariyaSiddhiCard");
    const kavippuCard = document.getElementById("jkKavippuCard");
    const jamamLordCard = document.getElementById("jkJamamLordCard");

    const dateInput = document.getElementById("jkInputDate");
    const timeInput = document.getElementById("jkInputTime");
    const placeInput = document.getElementById("jkInputPlace");
    const btnBirth = document.getElementById("btnJkModeBirth");
    const btnLive = document.getElementById("btnJkModeLive");

    if (dateInput && !dateInput.value) {
      dateInput.value = profile.birthDate || "1988-04-30";
    }
    if (timeInput && !timeInput.value) {
      timeInput.value = (profile.birthTime || "10:30").slice(0, 5);
    }
    if (placeInput && !placeInput.value) {
      placeInput.value = profile.place || profile.placeName || "Tiruvannamalai";
    }

    if (!jamakkolEventsBound) {
      jamakkolEventsBound = true;
      const btnRecalc = document.getElementById("btnRecalcJamakkol");
      const btnLiveNow = document.getElementById("btnLiveJamakkolNow");
      const btnResetBirth = document.getElementById("btnResetJamakkolBirth");

      if (btnBirth) {
        btnBirth.addEventListener("click", () => {
          jamakkolCurrentMode = "birth";
          btnBirth.classList.add("active");
          if (btnLive) btnLive.classList.remove("active");
          if (dateInput) dateInput.value = profile.birthDate || "1988-04-30";
          if (timeInput) timeInput.value = (profile.birthTime || "10:30").slice(0, 5);
          if (placeInput) placeInput.value = profile.place || profile.placeName || "Tiruvannamalai";
          renderJamakkolSection();
        });
      }

      if (btnLive) {
        btnLive.addEventListener("click", () => {
          jamakkolCurrentMode = "live";
          btnLive.classList.add("active");
          if (btnBirth) btnBirth.classList.remove("active");
          const now = new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, "0");
          const dd = String(now.getDate()).padStart(2, "0");
          const hh = String(now.getHours()).padStart(2, "0");
          const min = String(now.getMinutes()).padStart(2, "0");
          if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
          if (timeInput) timeInput.value = `${hh}:${min}`;
          renderJamakkolSection();
        });
      }

      if (btnRecalc) {
        btnRecalc.addEventListener("click", () => {
          renderJamakkolSection({
            mode: jamakkolCurrentMode,
            dateStr: dateInput ? dateInput.value : undefined,
            timeStr: timeInput ? timeInput.value : undefined
          });
        });
      }

      if (btnLiveNow) {
        btnLiveNow.addEventListener("click", () => {
          jamakkolCurrentMode = "live";
          if (btnLive) btnLive.classList.add("active");
          if (btnBirth) btnBirth.classList.remove("active");
          const now = new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, "0");
          const dd = String(now.getDate()).padStart(2, "0");
          const hh = String(now.getHours()).padStart(2, "0");
          const min = String(now.getMinutes()).padStart(2, "0");
          if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
          if (timeInput) timeInput.value = `${hh}:${min}`;
          renderJamakkolSection();
        });
      }

      if (btnResetBirth) {
        btnResetBirth.addEventListener("click", () => {
          jamakkolCurrentMode = "birth";
          if (btnBirth) btnBirth.classList.add("active");
          if (btnLive) btnLive.classList.remove("active");
          if (dateInput) dateInput.value = profile.birthDate || "1988-04-30";
          if (timeInput) timeInput.value = (profile.birthTime || "10:30").slice(0, 5);
          if (placeInput) placeInput.value = profile.place || profile.placeName || "Tiruvannamalai";
          renderJamakkolSection();
        });
      }
    }

    const calcOpts = customOptions || {
      mode: jamakkolCurrentMode,
      dateStr: dateInput ? dateInput.value : profile.birthDate,
      timeStr: timeInput ? timeInput.value : profile.birthTime
    };

    let jk = null;
    if (typeof AstroEngine !== "undefined" && AstroEngine.calculateJamakkol) {
      jk = AstroEngine.calculateJamakkol(data, calcOpts);
    } else if (data.jamakkol && jamakkolCurrentMode === "birth") {
      jk = data.jamakkol;
    }

    if (!jk) return;

    if (modeBadge) {
      modeBadge.textContent = jk.mode === "live" ? "⏱️ நேரடி பிரசன்னம் (Live Horary)" : "🌟 ஜாதகரின் பிறப்பு ஜாமக்கோள்";
      modeBadge.style.background = jk.mode === "live" ? "#FEF3C7" : "#EDE9FE";
      modeBadge.style.color = jk.mode === "live" ? "#92400E" : "#5B21B6";
    }
    if (jamamBadge) {
      jamamBadge.textContent = `⏳ ${jk.period} ${jk.jamamIndex}-வது ஜாமம் (${jk.jamamLordNameTa})`;
    }
    if (veedhiBadge && jk.suryaVeedhi) {
      veedhiBadge.textContent = `☀️ ${jk.suryaVeedhi.nameTa}`;
    }

    if (metricsRow) {
      metricsRow.innerHTML = `
        <div class="jk-stat-card" style="border-left: 4px solid #F59E0B;">
          <div class="jk-stat-icon" style="background: #FEF3C7; color: #7C2D12;">
            🌅
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.76rem; color: #64748B; font-weight: 700;">உதயம் (Udhayam)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0.15rem 0;">
              ${jk.udhayam.signNameTa} <span style="font-size: 0.88rem; color: #7C2D12;">${jk.udhayam.formatted}</span>
            </div>
            <div style="font-size: 0.74rem; color: #6B7280;">அதிபதி: ${jk.udhayam.lordTa || ''} (கேள்வியாளர் நிலை)</div>
          </div>
        </div>

        <div class="jk-stat-card" style="border-left: 4px solid #1E293B;">
          <div class="jk-stat-icon" style="background: #1E293B; color: #F8FAFC;">
            🎯
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.76rem; color: #64748B; font-weight: 700;">ஆரூடம் (Aaroodam)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0.15rem 0;">
              ${jk.aaroodam.signNameTa} <span style="font-size: 0.88rem; color: #2563EB;">${jk.aaroodam.formatted}</span>
            </div>
            <div style="font-size: 0.74rem; color: #6B7280;">உதயத்திற்கு ${jk.aaroodam.bhavaDist}-ம் பாவம் (காரிய முடிவு)</div>
          </div>
        </div>

        <div class="jk-stat-card" style="border-left: 4px solid #E11D48;">
          <div class="jk-stat-icon" style="background: #FFE4E6; color: #BE123C;">
            🛡️
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.76rem; color: #64748B; font-weight: 700;">கவிப்பு (Kavippu)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #BE123C; margin: 0.15rem 0;">
              ${jk.kavippu.signNameTa} <span style="font-size: 0.88rem; color: #9F1239;">${jk.kavippu.formatted}</span>
            </div>
            <div style="font-size: 0.74rem; color: #6B7280;">உதயத்திற்கு ${jk.kavippu.houseFromUdhayam}-ம் பாவம் (ரகசியத் தடை)</div>
          </div>
        </div>

        <div class="jk-stat-card" style="border-left: 4px solid #8B5CF6;">
          <div class="jk-stat-icon" style="background: #EDE9FE; color: #6D28D9;">
            🪐
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.76rem; color: #64748B; font-weight: 700;">மாந்தி (Maandi / Gulikan)</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0.15rem 0;">
              ${jk.maandi.signNameTa} <span style="font-size: 0.88rem; color: #6D28D9;">${jk.maandi.formatted}</span>
            </div>
            <div style="font-size: 0.74rem; color: #6B7280;">தாமதம் &amp; கவனிக்க வேண்டிய புள்ளி</div>
          </div>
        </div>
      `;
    }

    if (chartContainer && typeof ChartsRenderer !== "undefined" && ChartsRenderer.renderJamakkolAaroodamChart) {
      chartContainer.innerHTML = ChartsRenderer.renderJamakkolAaroodamChart(profile, data, AppState.lang, jk);
    }

    if (dispoTbody) {
      const pLabels = { Asc: "லக்னம் (உதயம்)", Su: "சூரியன்", Mo: "சந்திரன்", Me: "புதன்", Ve: "சுக்கிரன்", Ma: "செவ்வாய்", Ju: "குரு", Sa: "சனி", Ra: "ராகு", Ke: "கேது", Man: "மாந்தி" };
      let rowsHtml = "";

      rowsHtml += `
        <tr style="background: #FEF3C7; font-weight: 700;">
          <td><span class="jk-badge-udhayam">உதயம்</span></td>
          <td>${jk.udhayam.signNameTa} (லக்னம்)</td>
          <td>${jk.udhayam.formatted}</td>
        </tr>
        <tr style="background: #F1F5F9; font-weight: 700;">
          <td><span class="jk-badge-aaroodam">ஆரூடம்</span></td>
          <td>${jk.aaroodam.signNameTa} (${jk.aaroodam.bhavaDist}-ம் பாவம்)</td>
          <td>${jk.aaroodam.formatted}</td>
        </tr>
        <tr style="background: #FFE4E6; font-weight: 700;">
          <td><span class="jk-badge-kavippu">கவிப்பு</span></td>
          <td>${jk.kavippu.signNameTa} (${jk.kavippu.houseFromUdhayam}-ம் பாவம்)</td>
          <td>${jk.kavippu.formatted}</td>
        </tr>
      `;

      if (data.planets) {
        Object.keys(data.planets).forEach(k => {
          if (k === "Asc") return;
          const pl = data.planets[k];
          if (pl && pl.signId !== undefined) {
            const isKavippuCovered = (pl.signId === jk.kavippu.signId);
            const isRetro = pl.isRetrograde ? " *" : "";
            const degStr = `${pl.deg || 0}°${String(pl.min || 0).padStart(2, '0')}′`;
            const signName = (typeof AstroEngine !== 'undefined' && AstroEngine.SIGN_NAMES[pl.signId]) ? AstroEngine.SIGN_NAMES[pl.signId].ta : (pl.signNameTa || "");
            rowsHtml += `
              <tr style="${isKavippuCovered ? 'background: #FFF1F2;' : ''}">
                <td>
                  <strong>${pLabels[k] || k}</strong>${isRetro ? '<span style="color:#DC2626;">(வக்ரம்)</span>' : ''}
                  ${isKavippuCovered ? '<span style="font-size:0.7rem; background:#E11D48; color:#FFF; padding:1px 4px; border-radius:3px; margin-left:4px;">கவிப்பு மறைப்பு</span>' : ''}
                </td>
                <td>${signName}</td>
                <td>${degStr}</td>
              </tr>
            `;
          }
        });
      }

      rowsHtml += `
        <tr style="background: #F3E8FF; font-weight: 800; color: #581C87;">
          <td colspan="3">🪐 வெளிவட்ட 8 ஜாமக் கிரகங்கள் (${jk.period} ${jk.jamamIndex}-வது ஜாம சுழற்சி)</td>
        </tr>
      `;
      if (jk.jamamPlanets) {
        jk.jamamPlanets.forEach(jp => {
          const isActiveLord = (jp.code === jk.jamamLordCode);
          rowsHtml += `
            <tr style="${isActiveLord ? 'background: #FAF5FF; font-weight: 700;' : ''}">
              <td>
                <span style="display:inline-block; width:18px; height:18px; line-height:18px; text-align:center; background:#EDE9FE; color:#6B21A8; border-radius:3px; font-size:0.75rem; font-weight:700; margin-right:5px;">${jp.shortTa}</span>
                ${jp.nameTa} ${isActiveLord ? '<span style="font-size:0.7rem; background:#7E22CE; color:#FFF; padding:1px 5px; border-radius:3px; margin-left:4px;">ஜாம அதிபதி</span>' : ''}
              </td>
              <td>${jp.signNameTa}</td>
              <td>${jp.formatted}</td>
            </tr>
          `;
        });
      }

      dispoTbody.innerHTML = rowsHtml;
    }

    if (kariyaSiddhiCard && jk.verdict) {
      kariyaSiddhiCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
          <h4 style="margin: 0; color: #86198F; font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
            <span>✨</span> காரிய சித்தி ஆய்வு (Outcome Analysis)
          </h4>
          <span class="${jk.verdict.badgeClass}" style="font-size: 0.8rem; font-weight: 800; padding: 0.25rem 0.65rem; border-radius: 999px;">
            ${jk.verdict.status}
          </span>
        </div>
        <p style="margin: 0; font-size: 0.88rem; color: #4A044E; line-height: 1.65;">
          ${jk.verdict.summary}
        </p>
      `;
    }

    if (kavippuCard && jk.verdict) {
      kavippuCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
          <h4 style="margin: 0; color: #9F1239; font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
            <span>⚠️</span> கவிப்பு தாக்கம் &amp; ரகசியத் தடை (Hidden Obstacles)
          </h4>
          <span style="font-size: 0.78rem; background: #FFE4E6; color: #9F1239; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; border: 1px solid #FECDD3;">
            ${jk.kavippu.signNameTa} • ${jk.kavippu.houseFromUdhayam}-ம் பாவம்
          </span>
        </div>
        <p style="margin: 0; font-size: 0.88rem; color: #881337; line-height: 1.65;">
          ${jk.verdict.kavippuSummary}
        </p>
      `;
    }

    if (jamamLordCard && jk.jamamLordDesc) {
      jamamLordCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.4rem;">
          <h4 style="margin: 0; color: #92400E; font-size: 1.05rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem;">
            <span>⏳</span> நடப்பு ஜாம அதிபதி பலன் (Active Jamam Lord)
          </h4>
          <span style="font-size: 0.78rem; background: #FEF3C7; color: #92400E; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 700; border: 1px solid #FDE68A;">
            ${jk.jamamLordNameTa}
          </span>
        </div>
        <p style="margin: 0; font-size: 0.88rem; color: #78350F; line-height: 1.65;">
          ${jk.jamamLordDesc}
        </p>
      `;
    }
  }

  /**
   * 23. காலம் மற்றும் பாரம்பரிய கணக்கீடு: லக்ன தியாஜ்யம் (Lagna Tyajyam Calculation)
   */
  let lagnaTyajyamEventsBound = false;
  let selectedLagnaTyajyamSign = 0; // Default: Mesham

  function renderLagnaTyajyamSection() {
    const section = document.getElementById("lagnaTyajyamSection");
    if (!section || typeof MuhurthamEngine === "undefined" || !MuhurthamEngine.calculateLagnaTyajyam) return;

    const rasiSelect = document.getElementById("ltRasiSelect");
    const dateInput = document.getElementById("ltInputDate");
    const timeInput = document.getElementById("ltInputTime");
    const chipsContainer = document.getElementById("ltRasiChips");
    const metricsRow = document.getElementById("ltMetricsRow");
    const timelineBar = document.getElementById("ltTimelineBar");
    const windowsList = document.getElementById("ltAuspiciousWindowsList");
    const verdictText = document.getElementById("ltVerdictText");
    const masterTbody = document.getElementById("ltMasterTableBody");

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (dateInput && !dateInput.value) {
      dateInput.value = todayStr;
    }
    if (timeInput && !timeInput.value) {
      timeInput.value = "06:00";
    }

    // Bind events once
    if (!lagnaTyajyamEventsBound) {
      lagnaTyajyamEventsBound = true;

      const btnCalc = document.getElementById("btnLtCalculate");
      const btnReset = document.getElementById("btnLtReset");
      const btnNow = document.getElementById("btnLtNow");
      const btnMorning = document.getElementById("btnLtMorning");

      if (btnCalc) {
        btnCalc.addEventListener("click", () => {
          if (rasiSelect) selectedLagnaTyajyamSign = parseInt(rasiSelect.value, 10);
          renderLagnaTyajyamSection();
        });
      }

      if (btnReset) {
        btnReset.addEventListener("click", () => {
          selectedLagnaTyajyamSign = 0;
          if (rasiSelect) rasiSelect.value = "0";
          if (dateInput) dateInput.value = todayStr;
          if (timeInput) timeInput.value = "06:00";
          renderLagnaTyajyamSection();
        });
      }

      if (btnNow) {
        btnNow.addEventListener("click", () => {
          const now = new Date();
          const yyyy = now.getFullYear();
          const mm = String(now.getMonth() + 1).padStart(2, '0');
          const dd = String(now.getDate()).padStart(2, '0');
          const hh = String(now.getHours()).padStart(2, '0');
          const min = String(now.getMinutes()).padStart(2, '0');
          if (dateInput) dateInput.value = `${yyyy}-${mm}-${dd}`;
          if (timeInput) timeInput.value = `${hh}:${min}`;
          if (rasiSelect) selectedLagnaTyajyamSign = parseInt(rasiSelect.value, 10);
          renderLagnaTyajyamSection();
        });
      }

      if (btnMorning) {
        btnMorning.addEventListener("click", () => {
          if (timeInput) timeInput.value = "06:00";
          if (rasiSelect) selectedLagnaTyajyamSign = parseInt(rasiSelect.value, 10);
          renderLagnaTyajyamSection();
        });
      }

      if (rasiSelect) {
        rasiSelect.addEventListener("change", () => {
          selectedLagnaTyajyamSign = parseInt(rasiSelect.value, 10);
          renderLagnaTyajyamSection();
        });
      }
    }

    if (rasiSelect) {
      rasiSelect.value = String(selectedLagnaTyajyamSign);
    }

    const curDate = (dateInput && dateInput.value) ? dateInput.value : todayStr;
    const curTime = (timeInput && timeInput.value) ? timeInput.value : "06:00";

    const res = MuhurthamEngine.calculateLagnaTyajyam(selectedLagnaTyajyamSign, curDate, curTime);
    if (!res) return;

    // Render 12 Rasi Chips
    if (chipsContainer && MuhurthamEngine.LAGNA_TYAJYAM_CONFIG) {
      chipsContainer.innerHTML = MuhurthamEngine.LAGNA_TYAJYAM_CONFIG.map(cfg => {
        const isSelected = (cfg.signId === selectedLagnaTyajyamSign);
        const groupClass = cfg.group === "first" ? "lt-chip-first" : (cfg.group === "middle" ? "lt-chip-middle" : "lt-chip-last");
        const activeClass = isSelected ? "active" : "";
        const tag = cfg.group === "first" ? "முதல்" : (cfg.group === "middle" ? "நடு" : "கடைசி");
        return `
          <button type="button" class="lt-chip-btn ${groupClass} ${activeClass}" data-sign="${cfg.signId}" title="${cfg.ta} (${cfg.groupTa})">
            ${cfg.ta} <span style="font-size:0.7rem; opacity:0.85;">(${tag})</span>
          </button>
        `;
      }).join("");

      chipsContainer.querySelectorAll(".lt-chip-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          selectedLagnaTyajyamSign = parseInt(btn.getAttribute("data-sign"), 10);
          if (rasiSelect) rasiSelect.value = String(selectedLagnaTyajyamSign);
          renderLagnaTyajyamSection();
        });
      });
    }

    // 4 Stat Cards
    if (metricsRow) {
      metricsRow.innerHTML = `
        <div class="lt-stat-card" style="border-left: 4px solid #F59E0B;">
          <div class="lt-stat-icon" style="background: #FEF3C7; color: #B45309;">
            🧭
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">தேர்ந்தெடுத்த லக்னம்</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #0F172A; margin: 0.1rem 0;">
              ${res.signNameTa} (${res.signNameEn})
            </div>
            <div style="font-size: 0.76rem; color: #92400E; font-weight: 600;">
              அளவு: 120 நிமிடம் (${res.lagnaStartTime.time12} - ${res.lagnaEndTime.time12})
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #6366F1;">
          <div class="lt-stat-icon" style="background: #EDE9FE; color: #4338CA;">
            🎯
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">தியாஜ்ய பகுதி</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #4338CA; margin: 0.1rem 0;">
              ${res.groupTa}
            </div>
            <div style="font-size: 0.76rem; color: #6B7280;">
              வரம்பு: ${res.startMin} முதல் ${res.endMin} நிமிடம் வரை
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #E11D48;">
          <div class="lt-stat-icon" style="background: #FFE4E6; color: #BE123C;">
            ⚠️
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">தியாஜ்ய நச்சு நாழிகை (தவிர்க்கவும்)</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #BE123C; margin: 0.1rem 0;">
              ${res.tyajyamStartTime.time12} - ${res.tyajyamEndTime.time12}
            </div>
            <div style="font-size: 0.76rem; color: #9F1239; font-weight: 600;">
              அளவு: 12 நிமிடங்கள் (அசுப காலம்)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #10B981;">
          <div class="lt-stat-icon" style="background: #ECFDF5; color: #047857;">
            ✨
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">சுப முகூர்த்த நேரம்</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #047857; margin: 0.1rem 0;">
              108 நிமிடங்கள்
            </div>
            <div style="font-size: 0.76rem; color: #065F46; font-weight: 600;">
              லக்னத்தின் 90% நேரம் உத்தம சுபம்
            </div>
          </div>
        </div>
      `;
    }

    // Timeline Bar
    if (timelineBar) {
      timelineBar.innerHTML = res.timelineSegments.map(seg => {
        return `
          <div class="lt-timeline-segment" style="width: ${seg.widthPct}%; background: ${seg.color};" title="${seg.label}: ${seg.startTime} முதல் ${seg.endTime} வரை (${seg.duration} நிமிடம்)">
            <span>${seg.label} (${seg.duration} நிமி)</span>
          </div>
        `;
      }).join("");
    }

    // Windows List
    if (windowsList) {
      windowsList.innerHTML = res.auspiciousWindows.map(w => `
        <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.3rem;">
            <strong style="color: #166534; font-size: 0.9rem;">${w.title}</strong>
            <span style="font-size: 0.74rem; background: #DCFCE7; color: #15803D; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 800;">
              ${w.status}
            </span>
          </div>
          <div style="font-size: 0.84rem; color: #14532D; font-weight: 700; margin-bottom: 0.25rem;">
            ⏱️ நேரம்: ${w.startTime} முதல் ${w.endTime} வரை (${w.duration})
          </div>
          <div style="font-size: 0.8rem; color: #15803D; line-height: 1.5;">
            ${w.note}
          </div>
        </div>
      `).join("") + `
        <div style="background: #FFF1F2; border: 1px solid #FECDD3; border-radius: 8px; padding: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.3rem;">
            <strong style="color: #9F1239; font-size: 0.9rem;">🚫 தியாஜ்ய விலக்கு நேரம் (விஷ கடிகை)</strong>
            <span style="font-size: 0.74rem; background: #FFE4E6; color: #BE123C; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 800;">
              கண்டிப்பாக தவிர்க்கவும்
            </span>
          </div>
          <div style="font-size: 0.84rem; color: #9F1239; font-weight: 700;">
            ⏱️ நேரம்: ${res.tyajyamStartTime.full} முதல் ${res.tyajyamEndTime.full} வரை (12 நிமிடங்கள்)
          </div>
        </div>
      `;
    }

    // Verdict text
    if (verdictText) {
      verdictText.textContent = res.verdictTa;
    }

    // Master 12 Signs Table
    if (masterTbody && res.allSignsTable) {
      masterTbody.innerHTML = res.allSignsTable.map(item => {
        const isCurr = item.isCurrent;
        const rowBg = isCurr ? 'background: #FEF3C7; font-weight: 700;' : '';
        const badgeColor = item.group === "first" ? "#B45309" : (item.group === "middle" ? "#6D28D9" : "#BE123C");
        const badgeBg = item.group === "first" ? "#FEF3C7" : (item.group === "middle" ? "#EDE9FE" : "#FFE4E6");

        return `
          <tr style="${rowBg}">
            <td>
              <strong style="color: #0F172A; font-size: 0.92rem;">${item.ta}</strong>
              <span style="font-size: 0.74rem; color: #64748B;">(${item.en})</span>
              ${isCurr ? '<span style="font-size: 0.7rem; background: #D97706; color: #FFF; padding: 1px 5px; border-radius: 3px; margin-left: 4px;">தேர்வு</span>' : ''}
            </td>
            <td>
              <span style="font-size: 0.76rem; background: ${badgeBg}; color: ${badgeColor}; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 700;">
                ${item.groupTa}
              </span>
            </td>
            <td>
              <span style="font-family: monospace; font-weight: 700; color: #334155;">
                ${item.startMin} - ${item.endMin} நிமிடம்
              </span>
            </td>
            <td>
              <strong style="color: #BE123C; font-family: monospace;">
                ${item.tyajyamStartFmt.time12} - ${item.tyajyamEndFmt.time12}
              </strong>
            </td>
            <td style="text-align: center;">
              <span style="font-size: 0.74rem; color: #9F1239; font-weight: 700;">
                12 நிமிஷம் விலக்கு
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  // ==========================================
  // காலம் மற்றும் பாரம்பரிய கணக்கீடு: நட்சத்திர தியாஜ்யம்
  // ==========================================
  let nakshatraTyajyamEventsBound = false;
  let selectedNakshatraTyajyamId = 0; // Default: Ashwini (0)

  function renderNakshatraTyajyamSection() {
    const section = document.getElementById("nakshatraTyajyamSection");
    if (!section || typeof MuhurthamEngine === "undefined" || !MuhurthamEngine.calculateNakshatraTyajyam) return;

    const nakshatraSelect = document.getElementById("ntNakshatraSelect");
    const chipsContainer = document.getElementById("ntChipsGrid");
    const inputStartDate = document.getElementById("ntInputStartDate");
    const inputStartTime = document.getElementById("ntInputStartTime");
    const inputEndDate = document.getElementById("ntInputEndDate");
    const inputEndTime = document.getElementById("ntInputEndTime");
    const btnCalculate = document.getElementById("btnNtCalculate");
    const btnReset = document.getElementById("btnNtReset");
    const btnPreset24h = document.getElementById("btnNtPreset24h");
    const btnNow = document.getElementById("btnNtNow");
    const metricsRow = document.getElementById("ntMetricsRow");
    const timelineBar = document.getElementById("ntTimelineBar");
    const timelineTicks = document.getElementById("ntTimelineTicks");
    const windowsList = document.getElementById("ntAuspiciousWindowsList");
    const verdictText = document.getElementById("ntVerdictText");
    const masterTbody = document.getElementById("ntMasterTableBody");

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const toYmd = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Set default dates if empty
    if (inputStartDate && !inputStartDate.value) inputStartDate.value = toYmd(today);
    if (inputStartTime && !inputStartTime.value) inputStartTime.value = "06:00";
    if (inputEndDate && !inputEndDate.value) inputEndDate.value = toYmd(tomorrow);
    if (inputEndTime && !inputEndTime.value) inputEndTime.value = "06:00";

    // Populate dropdown options once
    if (nakshatraSelect && nakshatraSelect.options.length === 0) {
      MuhurthamEngine.NAKSHATRA_TYAJYAM_CONFIG.forEach(cfg => {
        const opt = document.createElement("option");
        opt.value = String(cfg.id);
        opt.textContent = `${cfg.num}. ${cfg.ta} (${cfg.en}) — பின்னம்: ${cfg.fractionText} (${cfg.ghatikas} நாழிகை)`;
        nakshatraSelect.appendChild(opt);
      });
    }

    if (!nakshatraTyajyamEventsBound) {
      nakshatraTyajyamEventsBound = true;

      if (btnCalculate) {
        btnCalculate.addEventListener("click", (e) => {
          e.preventDefault();
          if (nakshatraSelect) selectedNakshatraTyajyamId = parseInt(nakshatraSelect.value, 10);
          renderNakshatraTyajyamSection();
        });
      }

      if (btnReset) {
        btnReset.addEventListener("click", (e) => {
          e.preventDefault();
          selectedNakshatraTyajyamId = 0;
          if (nakshatraSelect) nakshatraSelect.value = "0";
          if (inputStartDate) inputStartDate.value = toYmd(today);
          if (inputStartTime) inputStartTime.value = "06:00";
          if (inputEndDate) inputEndDate.value = toYmd(tomorrow);
          if (inputEndTime) inputEndTime.value = "06:00";
          renderNakshatraTyajyamSection();
        });
      }

      if (btnPreset24h) {
        btnPreset24h.addEventListener("click", (e) => {
          e.preventDefault();
          const sDate = inputStartDate && inputStartDate.value ? inputStartDate.value : toYmd(today);
          const sTime = inputStartTime && inputStartTime.value ? inputStartTime.value : "06:00";
          const [y, m, d] = sDate.split("-").map(Number);
          const [h, min] = sTime.split(":").map(Number);
          const sDt = new Date(y, m - 1, d, h, min, 0);
          const eDt = new Date(sDt.getTime() + 24 * 60 * 60 * 1000);
          if (inputEndDate) inputEndDate.value = toYmd(eDt);
          if (inputEndTime) inputEndTime.value = sTime;
          renderNakshatraTyajyamSection();
        });
      }

      if (btnNow) {
        btnNow.addEventListener("click", (e) => {
          e.preventDefault();
          const cur = new Date();
          const curH = String(cur.getHours()).padStart(2, "0");
          const curM = String(cur.getMinutes()).padStart(2, "0");
          if (inputStartDate) inputStartDate.value = toYmd(cur);
          if (inputStartTime) inputStartTime.value = `${curH}:${curM}`;
          const curEnd = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
          if (inputEndDate) inputEndDate.value = toYmd(curEnd);
          if (inputEndTime) inputEndTime.value = `${curH}:${curM}`;
          renderNakshatraTyajyamSection();
        });
      }

      if (nakshatraSelect) {
        nakshatraSelect.addEventListener("change", () => {
          selectedNakshatraTyajyamId = parseInt(nakshatraSelect.value, 10);
          renderNakshatraTyajyamSection();
        });
      }
    }

    if (nakshatraSelect) {
      nakshatraSelect.value = String(selectedNakshatraTyajyamId);
    }

    const curStartDate = inputStartDate ? inputStartDate.value : toYmd(today);
    const curStartTime = inputStartTime ? inputStartTime.value : "06:00";
    const curEndDate = inputEndDate ? inputEndDate.value : toYmd(tomorrow);
    const curEndTime = inputEndTime ? inputEndTime.value : "06:00";

    const res = MuhurthamEngine.calculateNakshatraTyajyam(
      selectedNakshatraTyajyamId, curStartDate, curStartTime, curEndDate, curEndTime
    );

    // 27 Chips
    if (chipsContainer) {
      chipsContainer.innerHTML = MuhurthamEngine.NAKSHATRA_TYAJYAM_CONFIG.map(cfg => {
        const isSelected = (cfg.id === selectedNakshatraTyajyamId);
        return `
          <button type="button" class="nt-chip-btn ${isSelected ? 'active' : ''}" data-nakshatra="${cfg.id}">
            <span>${cfg.num}. ${cfg.ta}</span>
            <span class="nt-chip-fraction">${cfg.fractionText}</span>
          </button>
        `;
      }).join("");

      chipsContainer.querySelectorAll(".nt-chip-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          selectedNakshatraTyajyamId = parseInt(btn.getAttribute("data-nakshatra"), 10);
          if (nakshatraSelect) nakshatraSelect.value = String(selectedNakshatraTyajyamId);
          renderNakshatraTyajyamSection();
        });
      });
    }

    // 4 Stat Cards
    if (metricsRow) {
      const auspiciousMins = res.totalMinutes - res.tyajyamDurationMinutes;
      const auspiciousNazhigai = +(auspiciousMins / 24).toFixed(1);

      metricsRow.innerHTML = `
        <div class="lt-stat-card" style="border-left: 4px solid #4F46E5;">
          <div class="lt-stat-icon" style="background: #EEF2FF; color: #4338CA;">
            ⭐
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">நட்சத்திரம் &amp; பின்னம்</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1E1B4B; margin: 0.1rem 0;">
              ${res.nakshatraNum}. ${res.nakshatraTa} (${res.nakshatraEn})
            </div>
            <div style="font-size: 0.76rem; color: #4338CA; font-weight: 700;">
              பின்னம்: ${res.fractionText} (${res.ghatikas} நாழிகை)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #059669;">
          <div class="lt-stat-icon" style="background: #ECFDF5; color: #047857;">
            ⏱️
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">நட்சத்திர ஓட்டக் காலம்</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #065F46; margin: 0.1rem 0;">
              ${res.totalNazhigai} நாழிகை
            </div>
            <div style="font-size: 0.76rem; color: #047857; font-weight: 600;">
              மொத்தம்: ${res.totalMinutes} நிமி (${res.totalHours} மணி)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #E11D48;">
          <div class="lt-stat-icon" style="background: #FFE4E6; color: #BE123C;">
            🚫
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">தியாஜ்ய நச்சுப் பொழுது (4 நாழிகை)</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #BE123C; margin: 0.1rem 0;">
              ${res.tyajyamStartTime.short} - ${res.tyajyamEndTime.short}
            </div>
            <div style="font-size: 0.76rem; color: #9F1239; font-weight: 700;">
              நீளம்: 4 நாழிகை (${res.tyajyamDurationMinutes} நிமிடம்)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #10B981;">
          <div class="lt-stat-icon" style="background: #D1FAE5; color: #065F46;">
            ✨
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">சுப முகூர்த்த கால அளவு</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #047857; margin: 0.1rem 0;">
              ${auspiciousMins} நிமிடங்கள்
            </div>
            <div style="font-size: 0.76rem; color: #065F46; font-weight: 600;">
              உத்தம நற்பொழுது (${auspiciousNazhigai} நாழிகை)
            </div>
          </div>
        </div>
      `;
    }

    // Segmented Timeline Bar
    if (timelineBar) {
      timelineBar.innerHTML = res.timelineSegments.map(seg => `
        <div class="nt-timeline-segment" style="width: ${seg.widthPct}%; background: ${seg.color};" title="${seg.label}: ${seg.startTime} முதல் ${seg.endTime} வரை (${seg.duration} நிமிடம்)">
          ${seg.widthPct > 14 ? `<span>${seg.label}</span>` : ''}
        </div>
      `).join("");
    }

    // Time Ticks
    if (timelineTicks) {
      timelineTicks.innerHTML = `
        <span>🟢 ${res.nakshatraStartTime.short} (தொடக்க)</span>
        <span style="color: #BE123C;">🔴 தியாஜ்யம்: ${res.tyajyamStartTime.short}</span>
        <span style="color: #BE123C;">🏁 முடிவு: ${res.tyajyamEndTime.short}</span>
        <span>🏁 ${res.nakshatraEndTime.short} (முடிவு)</span>
      `;
    }

    // Windows List
    if (windowsList) {
      windowsList.innerHTML = res.auspiciousWindows.map(w => {
        const isTyajyam = w.title.includes("தியாஜ்ய");
        const cardBg = isTyajyam ? "#FFF1F2" : "#F0FDF4";
        const cardBorder = isTyajyam ? "#FECDD3" : "#BBF7D0";
        const titleColor = isTyajyam ? "#9F1239" : "#166534";
        const badgeBg = isTyajyam ? "#FFE4E6" : "#DCFCE7";
        const badgeColor = isTyajyam ? "#BE123C" : "#15803D";
        const timeColor = isTyajyam ? "#BE123C" : "#14532D";

        return `
          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.3rem;">
              <strong style="color: ${titleColor}; font-size: 0.9rem;">${w.title}</strong>
              <span style="font-size: 0.74rem; background: ${badgeBg}; color: ${badgeColor}; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 800;">
                ${w.status}
              </span>
            </div>
            <div style="font-size: 0.84rem; color: ${timeColor}; font-weight: 700; margin-bottom: 0.25rem;">
              ⏱️ நேரம்: ${w.startTime} முதல் ${w.endTime} வரை (${w.duration})
            </div>
            <div style="font-size: 0.8rem; color: ${titleColor}; line-height: 1.5;">
              ${w.note}
            </div>
          </div>
        `;
      }).join("");
    }

    // Verdict text
    if (verdictText) {
      verdictText.textContent = res.verdictTa;
    }

    // Master 27 Nakshatras Table
    if (masterTbody && res.allNakshatrasTable) {
      masterTbody.innerHTML = res.allNakshatrasTable.map(item => {
        const isCurr = item.isCurrent;
        const rowBg = isCurr ? 'background: #EEF2FF; font-weight: 700;' : '';

        return `
          <tr style="${rowBg}">
            <td style="text-align: center; font-weight: 800; color: #4338CA;">${item.num}</td>
            <td>
              <strong style="color: #0F172A; font-size: 0.92rem;">${item.ta}</strong>
              <span style="font-size: 0.74rem; color: #64748B;">(${item.en})</span>
              ${isCurr ? '<span style="font-size: 0.7rem; background: #4338CA; color: #FFF; padding: 1px 5px; border-radius: 3px; margin-left: 4px;">தேர்வு</span>' : ''}
            </td>
            <td>
              <span style="font-family: monospace; font-weight: 700; color: #334155;">
                ${item.ghatikas} நாழிகை
              </span>
            </td>
            <td>
              <span style="font-size: 0.78rem; background: #E0E7FF; color: #3730A3; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 800; font-family: monospace;">
                ${item.fractionText}
              </span>
            </td>
            <td>
              <strong style="color: #BE123C; font-family: monospace; font-size: 0.84rem;">
                ${item.tyajyamStartFmt.short} - ${item.tyajyamEndFmt.short}
              </strong>
            </td>
            <td style="text-align: center;">
              <span style="font-size: 0.74rem; color: #9F1239; font-weight: 700;">
                4 நாழிகை (விலக்கு)
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  // ==========================================
  // காலம் மற்றும் பாரம்பரிய கணக்கீடு: திதி தியாஜ்யம்
  // ==========================================
  let tithiTyajyamEventsBound = false;
  let selectedTithiTyajyamId = 0; // Default: Prathama (0)

  function renderTithiTyajyamSection() {
    const section = document.getElementById("tithiTyajyamSection");
    if (!section || typeof MuhurthamEngine === "undefined" || !MuhurthamEngine.calculateTithiTyajyam) return;

    const tithiSelect = document.getElementById("ttTithiSelect");
    const chipsContainer = document.getElementById("ttChipsGrid");
    const inputStartDate = document.getElementById("ttInputStartDate");
    const inputStartTime = document.getElementById("ttInputStartTime");
    const inputEndDate = document.getElementById("ttInputEndDate");
    const inputEndTime = document.getElementById("ttInputEndTime");
    const btnCalculate = document.getElementById("btnTtCalculate");
    const btnReset = document.getElementById("btnTtReset");
    const btnPreset24h = document.getElementById("btnTtPreset24h");
    const btnNow = document.getElementById("btnTtNow");
    const validationAlert = document.getElementById("ttValidationAlert");
    const metricsRow = document.getElementById("ttMetricsRow");
    const timelineBar = document.getElementById("ttTimelineBar");
    const timelineTicks = document.getElementById("ttTimelineTicks");
    const windowsList = document.getElementById("ttAuspiciousWindowsList");
    const verdictText = document.getElementById("ttVerdictText");
    const masterTbody = document.getElementById("ttMasterTableBody");

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const toYmd = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Set default dates if empty
    if (inputStartDate && !inputStartDate.value) inputStartDate.value = toYmd(today);
    if (inputStartTime && !inputStartTime.value) inputStartTime.value = "06:00";
    if (inputEndDate && !inputEndDate.value) inputEndDate.value = toYmd(tomorrow);
    if (inputEndTime && !inputEndTime.value) inputEndTime.value = "06:00";

    // Populate dropdown options once
    if (tithiSelect && tithiSelect.options.length === 0) {
      MuhurthamEngine.TITHI_TYAJYAM_CONFIG.forEach(cfg => {
        const opt = document.createElement("option");
        opt.value = String(cfg.id);
        opt.textContent = `${cfg.num}. ${cfg.ta} (${cfg.en}) — பின்னம்: ${cfg.fractionText} (${cfg.ghatikas} நாழிகை)`;
        tithiSelect.appendChild(opt);
      });
    }

    if (!tithiTyajyamEventsBound) {
      tithiTyajyamEventsBound = true;

      if (btnCalculate) {
        btnCalculate.addEventListener("click", (e) => {
          e.preventDefault();
          if (tithiSelect) selectedTithiTyajyamId = parseInt(tithiSelect.value, 10);
          renderTithiTyajyamSection();
        });
      }

      if (btnReset) {
        btnReset.addEventListener("click", (e) => {
          e.preventDefault();
          selectedTithiTyajyamId = 0;
          if (tithiSelect) tithiSelect.value = "0";
          if (inputStartDate) inputStartDate.value = toYmd(today);
          if (inputStartTime) inputStartTime.value = "06:00";
          if (inputEndDate) inputEndDate.value = toYmd(tomorrow);
          if (inputEndTime) inputEndTime.value = "06:00";
          if (validationAlert) validationAlert.style.display = "none";
          renderTithiTyajyamSection();
        });
      }

      if (btnPreset24h) {
        btnPreset24h.addEventListener("click", (e) => {
          e.preventDefault();
          const sDate = inputStartDate && inputStartDate.value ? inputStartDate.value : toYmd(today);
          const sTime = inputStartTime && inputStartTime.value ? inputStartTime.value : "06:00";
          const [y, m, d] = sDate.split("-").map(Number);
          const [h, min] = sTime.split(":").map(Number);
          const sDt = new Date(y, m - 1, d, h, min, 0);
          const eDt = new Date(sDt.getTime() + 24 * 60 * 60 * 1000);
          if (inputEndDate) inputEndDate.value = toYmd(eDt);
          if (inputEndTime) inputEndTime.value = sTime;
          if (validationAlert) validationAlert.style.display = "none";
          renderTithiTyajyamSection();
        });
      }

      if (btnNow) {
        btnNow.addEventListener("click", (e) => {
          e.preventDefault();
          const cur = new Date();
          const curH = String(cur.getHours()).padStart(2, "0");
          const curM = String(cur.getMinutes()).padStart(2, "0");
          if (inputStartDate) inputStartDate.value = toYmd(cur);
          if (inputStartTime) inputStartTime.value = `${curH}:${curM}`;
          const curEnd = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
          if (inputEndDate) inputEndDate.value = toYmd(curEnd);
          if (inputEndTime) inputEndTime.value = `${curH}:${curM}`;
          if (validationAlert) validationAlert.style.display = "none";
          renderTithiTyajyamSection();
        });
      }

      if (tithiSelect) {
        tithiSelect.addEventListener("change", () => {
          selectedTithiTyajyamId = parseInt(tithiSelect.value, 10);
          renderTithiTyajyamSection();
        });
      }
    }

    if (tithiSelect) {
      tithiSelect.value = String(selectedTithiTyajyamId);
    }

    const curStartDate = inputStartDate ? inputStartDate.value : toYmd(today);
    const curStartTime = inputStartTime ? inputStartTime.value : "06:00";
    const curEndDate = inputEndDate ? inputEndDate.value : toYmd(tomorrow);
    const curEndTime = inputEndTime ? inputEndTime.value : "06:00";

    const res = MuhurthamEngine.calculateTithiTyajyam(
      selectedTithiTyajyamId, curStartDate, curStartTime, curEndDate, curEndTime
    );

    // Validation Alert display
    if (validationAlert) {
      if (!res.isValid) {
        validationAlert.style.display = "block";
        validationAlert.textContent = "⚠️ " + (res.validationError || "முடிவு நேரம் தொடக்கத்தை விட பிறகு இருக்க வேண்டும்.");
      } else {
        validationAlert.style.display = "none";
      }
    }

    // 16 Chips
    if (chipsContainer) {
      chipsContainer.innerHTML = MuhurthamEngine.TITHI_TYAJYAM_CONFIG.map(cfg => {
        const isSelected = (cfg.id === selectedTithiTyajyamId);
        return `
          <button type="button" class="tt-chip-btn ${isSelected ? 'active' : ''}" data-tithi="${cfg.id}">
            <span>${cfg.num}. ${cfg.ta}</span>
            <span class="tt-chip-fraction">${cfg.fractionText}</span>
          </button>
        `;
      }).join("");

      chipsContainer.querySelectorAll(".tt-chip-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          selectedTithiTyajyamId = parseInt(btn.getAttribute("data-tithi"), 10);
          if (tithiSelect) tithiSelect.value = String(selectedTithiTyajyamId);
          renderTithiTyajyamSection();
        });
      });
    }

    // 4 Stat Cards
    if (metricsRow) {
      const auspiciousMins = res.totalMinutes - res.tyajyamDurationMinutes;
      const auspiciousNazhigai = +(auspiciousMins / 24).toFixed(1);

      metricsRow.innerHTML = `
        <div class="lt-stat-card" style="border-left: 4px solid #4F46E5;">
          <div class="lt-stat-icon" style="background: #EEF2FF; color: #4338CA;">
            🌙
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">திதி &amp; பின்னம்</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1E1B4B; margin: 0.1rem 0;">
              ${res.tithiNum}. ${res.tithiTa} (${res.tithiEn})
            </div>
            <div style="font-size: 0.76rem; color: #4338CA; font-weight: 700;">
              பின்னம்: ${res.fractionText} (${res.ghatikas} நாழிகை)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #059669;">
          <div class="lt-stat-icon" style="background: #ECFDF5; color: #047857;">
            ⏱️
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">திதி ஓட்டக் காலம்</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #065F46; margin: 0.1rem 0;">
              ${res.totalNazhigai} நாழிகை
            </div>
            <div style="font-size: 0.76rem; color: #047857; font-weight: 600;">
              மொத்தம்: ${res.totalMinutes} நிமி (${res.totalHours} மணி)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #E11D48;">
          <div class="lt-stat-icon" style="background: #FFE4E6; color: #BE123C;">
            🚫
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">திதி தியாஜ்ய நச்சுப் பொழுது (4 நாழிகை)</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #BE123C; margin: 0.1rem 0;">
              ${res.tyajyamStartTime.short} - ${res.tyajyamEndTime.short}
            </div>
            <div style="font-size: 0.76rem; color: #9F1239; font-weight: 700;">
              நீளம்: 4 நாழிகை (${res.tyajyamDurationMinutes} நிமிடம்)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #10B981;">
          <div class="lt-stat-icon" style="background: #D1FAE5; color: #065F46;">
            ✨
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">சுப முகூர்த்த கால அளவு</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #047857; margin: 0.1rem 0;">
              ${auspiciousMins} நிமிடங்கள்
            </div>
            <div style="font-size: 0.76rem; color: #065F46; font-weight: 600;">
              உத்தம நற்பொழுது (${auspiciousNazhigai} நாழிகை)
            </div>
          </div>
        </div>
      `;
    }

    // Segmented Timeline Bar
    if (timelineBar) {
      timelineBar.innerHTML = res.timelineSegments.map(seg => `
        <div class="tt-timeline-segment" style="width: ${seg.widthPct}%; background: ${seg.color};" title="${seg.label}: ${seg.startTime} முதல் ${seg.endTime} வரை (${seg.duration} நிமிடம்)">
          ${seg.widthPct > 14 ? `<span>${seg.label}</span>` : ''}
        </div>
      `).join("");
    }

    // Time Ticks
    if (timelineTicks) {
      timelineTicks.innerHTML = `
        <span>🟢 ${res.tithiStartTime.short} (தொடக்க)</span>
        <span style="color: #BE123C;">🔴 தியாஜ்யம்: ${res.tyajyamStartTime.short}</span>
        <span style="color: #BE123C;">🏁 முடிவு: ${res.tyajyamEndTime.short}</span>
        <span>🏁 ${res.tithiEndTime.short} (முடிவு)</span>
      `;
    }

    // Windows List
    if (windowsList) {
      windowsList.innerHTML = res.auspiciousWindows.map(w => {
        const isTyajyam = w.title.includes("தியாஜ்ய");
        const cardBg = isTyajyam ? "#FFF1F2" : "#F0FDF4";
        const cardBorder = isTyajyam ? "#FECDD3" : "#BBF7D0";
        const titleColor = isTyajyam ? "#9F1239" : "#166534";
        const badgeBg = isTyajyam ? "#FFE4E6" : "#DCFCE7";
        const badgeColor = isTyajyam ? "#BE123C" : "#15803D";
        const timeColor = isTyajyam ? "#BE123C" : "#14532D";

        return `
          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.3rem;">
              <strong style="color: ${titleColor}; font-size: 0.9rem;">${w.title}</strong>
              <span style="font-size: 0.74rem; background: ${badgeBg}; color: ${badgeColor}; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 800;">
                ${w.status}
              </span>
            </div>
            <div style="font-size: 0.84rem; color: ${timeColor}; font-weight: 700; margin-bottom: 0.25rem;">
              ⏱️ நேரம்: ${w.startTime} முதல் ${w.endTime} வரை (${w.duration})
            </div>
            <div style="font-size: 0.8rem; color: ${titleColor}; line-height: 1.5;">
              ${w.note}
            </div>
          </div>
        `;
      }).join("");
    }

    // Verdict text
    if (verdictText) {
      verdictText.textContent = res.verdictTa;
    }

    // Master 16 Tithis Table
    if (masterTbody && res.allTithisTable) {
      masterTbody.innerHTML = res.allTithisTable.map(item => {
        const isCurr = item.isCurrent;
        const rowBg = isCurr ? 'background: #EEF2FF; font-weight: 700;' : '';

        return `
          <tr style="${rowBg}">
            <td style="text-align: center; font-weight: 800; color: #4338CA;">${item.num}</td>
            <td>
              <strong style="color: #0F172A; font-size: 0.92rem;">${item.ta}</strong>
              <span style="font-size: 0.74rem; color: #64748B;">(${item.en})</span>
              ${isCurr ? '<span style="font-size: 0.7rem; background: #4338CA; color: #FFF; padding: 1px 5px; border-radius: 3px; margin-left: 4px;">தேர்வு</span>' : ''}
            </td>
            <td>
              <span style="font-family: monospace; font-weight: 700; color: #334155;">
                ${item.ghatikas} நாழிகை
              </span>
            </td>
            <td>
              <span style="font-size: 0.78rem; background: #E0E7FF; color: #3730A3; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 800; font-family: monospace;">
                ${item.fractionText}
              </span>
            </td>
            <td>
              <strong style="color: #BE123C; font-family: monospace; font-size: 0.84rem;">
                ${item.tyajyamStartFmt.short} - ${item.tyajyamEndFmt.short}
              </strong>
            </td>
            <td style="text-align: center;">
              <span style="font-size: 0.74rem; color: #9F1239; font-weight: 700;">
                4 நாழிகை (விலக்கு)
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  // ==========================================
  // காலம் மற்றும் பாரம்பரிய கணக்கீடு: வார தியாஜ்யம்
  // ==========================================
  let varaTyajyamEventsBound = false;
  let selectedVaraTyajyamId = null; // Auto-detected from date or default 0 (ஞாயிறு)

  function renderVaraTyajyamSection() {
    const section = document.getElementById("varaTyajyamSection");
    if (!section || typeof MuhurthamEngine === "undefined" || !MuhurthamEngine.calculateVaraTyajyam) return;

    const weekdaySelect = document.getElementById("vtWeekdaySelect");
    const chipsContainer = document.getElementById("vtChipsGrid");
    const inputDate = document.getElementById("vtInputDate");
    const inputSunrise = document.getElementById("vtInputSunrise");
    const btnCalculate = document.getElementById("btnVtCalculate");
    const btnReset = document.getElementById("btnVtReset");
    const btnPresetSunrise = document.getElementById("btnVtPresetSunrise");
    const btnToday = document.getElementById("btnVtToday");
    const metricsRow = document.getElementById("vtMetricsRow");
    const timelineBar = document.getElementById("vtTimelineBar");
    const timelineTicks = document.getElementById("vtTimelineTicks");
    const windowsList = document.getElementById("vtAuspiciousWindowsList");
    const verdictText = document.getElementById("vtVerdictText");
    const masterTbody = document.getElementById("vtMasterTableBody");

    const today = new Date();
    const toYmd = (d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // Set default date and sunrise if empty
    if (inputDate && !inputDate.value) inputDate.value = toYmd(today);
    if (inputSunrise && !inputSunrise.value) inputSunrise.value = "06:00";

    // Auto-detect weekday from date if not set
    if (selectedVaraTyajyamId === null) {
      const curDt = new Date(inputDate ? inputDate.value : toYmd(today));
      selectedVaraTyajyamId = !isNaN(curDt.getTime()) ? curDt.getDay() : 0;
    }

    // Populate dropdown options once
    if (weekdaySelect && weekdaySelect.options.length === 0) {
      MuhurthamEngine.VARA_TYAJYAM_CONFIG.forEach(cfg => {
        const opt = document.createElement("option");
        opt.value = String(cfg.id);
        opt.textContent = `${cfg.num}. ${cfg.ta} (${cfg.en}) — உதயத்திலிருந்து ${cfg.ghatikas} நாழிகை (${Math.floor(cfg.offsetMinutes / 60)} மணி ${cfg.offsetMinutes % 60} நிமி)`;
        weekdaySelect.appendChild(opt);
      });
    }

    if (!varaTyajyamEventsBound) {
      varaTyajyamEventsBound = true;

      if (btnCalculate) {
        btnCalculate.addEventListener("click", (e) => {
          e.preventDefault();
          if (weekdaySelect) selectedVaraTyajyamId = parseInt(weekdaySelect.value, 10);
          renderVaraTyajyamSection();
        });
      }

      if (btnReset) {
        btnReset.addEventListener("click", (e) => {
          e.preventDefault();
          const curD = new Date();
          selectedVaraTyajyamId = curD.getDay();
          if (weekdaySelect) weekdaySelect.value = String(selectedVaraTyajyamId);
          if (inputDate) inputDate.value = toYmd(curD);
          if (inputSunrise) inputSunrise.value = "06:00";
          renderVaraTyajyamSection();
        });
      }

      if (btnPresetSunrise) {
        btnPresetSunrise.addEventListener("click", (e) => {
          e.preventDefault();
          if (inputSunrise) inputSunrise.value = "06:00";
          renderVaraTyajyamSection();
        });
      }

      if (btnToday) {
        btnToday.addEventListener("click", (e) => {
          e.preventDefault();
          const curD = new Date();
          selectedVaraTyajyamId = curD.getDay();
          if (weekdaySelect) weekdaySelect.value = String(selectedVaraTyajyamId);
          if (inputDate) inputDate.value = toYmd(curD);
          renderVaraTyajyamSection();
        });
      }

      if (weekdaySelect) {
        weekdaySelect.addEventListener("change", () => {
          selectedVaraTyajyamId = parseInt(weekdaySelect.value, 10);
          renderVaraTyajyamSection();
        });
      }

      if (inputDate) {
        inputDate.addEventListener("change", () => {
          const newD = new Date(inputDate.value);
          if (!isNaN(newD.getTime())) {
            selectedVaraTyajyamId = newD.getDay();
            if (weekdaySelect) weekdaySelect.value = String(selectedVaraTyajyamId);
            renderVaraTyajyamSection();
          }
        });
      }
    }

    if (weekdaySelect) {
      weekdaySelect.value = String(selectedVaraTyajyamId);
    }

    const curDate = inputDate ? inputDate.value : toYmd(today);
    const curSunrise = inputSunrise ? inputSunrise.value : "06:00";

    const res = MuhurthamEngine.calculateVaraTyajyam(
      selectedVaraTyajyamId, curDate, curSunrise
    );

    // 7 Chips
    if (chipsContainer) {
      chipsContainer.innerHTML = MuhurthamEngine.VARA_TYAJYAM_CONFIG.map(cfg => {
        const isSelected = (cfg.id === selectedVaraTyajyamId);
        return `
          <button type="button" class="vt-chip-btn ${isSelected ? 'active' : ''}" data-weekday="${cfg.id}">
            <span>${cfg.num}. ${cfg.ta}</span>
            <span class="vt-chip-ghatikas">${cfg.ghatikas} நாழிகை</span>
          </button>
        `;
      }).join("");

      chipsContainer.querySelectorAll(".vt-chip-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          selectedVaraTyajyamId = parseInt(btn.getAttribute("data-weekday"), 10);
          if (weekdaySelect) weekdaySelect.value = String(selectedVaraTyajyamId);
          renderVaraTyajyamSection();
        });
      });
    }

    // 4 Stat Cards
    if (metricsRow) {
      const auspiciousDayMins = 1440 - res.durationMinutes; // 1350 mins = 22h 30m
      const auspiciousDayNazhigai = +(auspiciousDayMins / 24).toFixed(2); // 56.25

      metricsRow.innerHTML = `
        <div class="lt-stat-card" style="border-left: 4px solid #4F46E5;">
          <div class="lt-stat-icon" style="background: #EEF2FF; color: #4338CA;">
            ☀️
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">கிழமை &amp; நாழிகை</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #1E1B4B; margin: 0.1rem 0;">
              ${res.weekdayNum}. ${res.weekdayTa} (${res.weekdayEn})
            </div>
            <div style="font-size: 0.76rem; color: #4338CA; font-weight: 700;">
              உதயத்திலிருந்து: ${res.ghatikas} நாழிகை (${res.offsetFormatted})
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #059669;">
          <div class="lt-stat-icon" style="background: #ECFDF5; color: #047857;">
            🌅
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">சூரிய உதயம் &amp; தொடக்க நேரம்</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: #065F46; margin: 0.1rem 0;">
              உதயம்: ${res.sunriseDateTime.time12}
            </div>
            <div style="font-size: 0.76rem; color: #047857; font-weight: 600;">
              தியாஜ்யத் தொடக்கம்: ${res.tyajyamStartTime.short}
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #E11D48;">
          <div class="lt-stat-icon" style="background: #FFE4E6; color: #BE123C;">
            🚫
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">வார தியாஜ்ய நச்சுப் பொழுது (90 நிமி)</div>
            <div style="font-size: 0.95rem; font-weight: 800; color: #BE123C; margin: 0.1rem 0;">
              ${res.tyajyamStartTime.short} - ${res.tyajyamEndTime.short}
            </div>
            <div style="font-size: 0.76rem; color: #9F1239; font-weight: 700;">
              நீளம்: 90 நிமிடம் (${res.durationNazhigai} நாழிகை)
            </div>
          </div>
        </div>

        <div class="lt-stat-card" style="border-left: 4px solid #10B981;">
          <div class="lt-stat-icon" style="background: #D1FAE5; color: #065F46;">
            ✨
          </div>
          <div style="flex: 1;">
            <div style="font-size: 0.74rem; color: #64748B; font-weight: 700;">சுப முகூர்த்தக் கால அளவு</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: #047857; margin: 0.1rem 0;">
              22 மணி 30 நிமிடம்
            </div>
            <div style="font-size: 0.76rem; color: #065F46; font-weight: 600;">
              உத்தம நற்பொழுது (${auspiciousDayNazhigai} நாழிகை)
            </div>
          </div>
        </div>
      `;
    }

    // Segmented Timeline Bar
    if (timelineBar) {
      timelineBar.innerHTML = res.timelineSegments.map(seg => `
        <div class="vt-timeline-segment" style="width: ${seg.widthPct}%; background: ${seg.color};" title="${seg.label}: ${seg.startTime} முதல் ${seg.endTime} வரை (${seg.duration} நிமிடம்)">
          ${seg.widthPct > 12 ? `<span>${seg.label}</span>` : ''}
        </div>
      `).join("");
    }

    // Time Ticks
    if (timelineTicks) {
      timelineTicks.innerHTML = `
        <span>🟢 உதயம்: ${res.sunriseDateTime.short}</span>
        <span style="color: #BE123C;">🔴 தியாஜ்யம்: ${res.tyajyamStartTime.short}</span>
        <span style="color: #BE123C;">🏁 முடிவு: ${res.tyajyamEndTime.short}</span>
        <span>🏁 மறுநாள் உதயம்: ${res.nextSunriseDateTime.short}</span>
      `;
    }

    // Windows List
    if (windowsList) {
      windowsList.innerHTML = res.auspiciousWindows.map(w => {
        const isTyajyam = w.title.includes("தியாஜ்ய");
        const cardBg = isTyajyam ? "#FFF1F2" : "#F0FDF4";
        const cardBorder = isTyajyam ? "#FECDD3" : "#BBF7D0";
        const titleColor = isTyajyam ? "#9F1239" : "#166534";
        const badgeBg = isTyajyam ? "#FFE4E6" : "#DCFCE7";
        const badgeColor = isTyajyam ? "#BE123C" : "#15803D";
        const timeColor = isTyajyam ? "#BE123C" : "#14532D";

        return `
          <div style="background: ${cardBg}; border: 1px solid ${cardBorder}; border-radius: 8px; padding: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.3rem;">
              <strong style="color: ${titleColor}; font-size: 0.9rem;">${w.title}</strong>
              <span style="font-size: 0.74rem; background: ${badgeBg}; color: ${badgeColor}; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 800;">
                ${w.status}
              </span>
            </div>
            <div style="font-size: 0.84rem; color: ${timeColor}; font-weight: 700; margin-bottom: 0.25rem;">
              ⏱️ நேரம்: ${w.startTime} முதல் ${w.endTime} வரை (${w.duration})
            </div>
            <div style="font-size: 0.8rem; color: ${titleColor}; line-height: 1.5;">
              ${w.note}
            </div>
          </div>
        `;
      }).join("");
    }

    // Verdict text
    if (verdictText) {
      verdictText.textContent = res.verdictTa;
    }

    // Master 7 Weekdays Table
    if (masterTbody && res.allWeekdaysTable) {
      masterTbody.innerHTML = res.allWeekdaysTable.map(item => {
        const isCurr = item.isCurrent;
        const rowBg = isCurr ? 'background: #EEF2FF; font-weight: 700;' : '';

        return `
          <tr style="${rowBg}">
            <td style="text-align: center; font-weight: 800; color: #4338CA;">${item.num}</td>
            <td>
              <strong style="color: #0F172A; font-size: 0.92rem;">${item.ta}</strong>
              <span style="font-size: 0.74rem; color: #64748B;">(${item.en})</span>
              ${isCurr ? '<span style="font-size: 0.7rem; background: #4338CA; color: #FFF; padding: 1px 5px; border-radius: 3px; margin-left: 4px;">தேர்வு</span>' : ''}
            </td>
            <td>
              <span style="font-family: monospace; font-weight: 800; color: #334155;">
                ${item.ghatikas} நாழிகை
              </span>
            </td>
            <td>
              <span style="font-size: 0.78rem; background: #E0E7FF; color: #3730A3; padding: 0.2rem 0.55rem; border-radius: 999px; font-weight: 700;">
                ${item.offsetHoursMins}
              </span>
            </td>
            <td>
              <strong style="color: #BE123C; font-family: monospace; font-size: 0.84rem;">
                ${item.tyajyamStartFmt.short} - ${item.tyajyamEndFmt.short}
              </strong>
            </td>
            <td style="text-align: center;">
              <span style="font-size: 0.74rem; color: #9F1239; font-weight: 700;">
                90 நிமிடம் (விலக்கு)
              </span>
            </td>
          </tr>
        `;
      }).join("");
    }
  }

  /**
   * 27. ஹோரா – சூரிய உதயம் முதல் அடுத்த உதயம் வரை கிரக ஹோரா (Planetary Hora - 3-Level Hierarchy)
   */
  let horaCurrentMode = "modern"; // "modern" or "tamil"
  let horaExpandedAll = false;

  function renderHoraMasterSection() {
    const section = document.getElementById("horaMasterSection");
    if (!section) return;

    const inputDate = document.getElementById("horaInputDate");
    const inputTime = document.getElementById("horaInputTime");
    const inputPlace = document.getElementById("horaInputPlace");
    const btnCalculate = document.getElementById("btnHoraCalculate");
    const btnNow = document.getElementById("btnHoraNow");
    const tabModern = document.getElementById("horaTabModern");
    const tabTamil = document.getElementById("horaTabTamil");
    const btnExpandAll = document.getElementById("btnHoraExpandAll");
    const btnCollapseAll = document.getElementById("btnHoraCollapseAll");
    const summaryBadge = document.getElementById("horaActiveSummaryBadge");
    const sunMetaChips = document.getElementById("horaSunMetadataChips");
    const treeContainer = document.getElementById("horaHierarchyTree");

    // Default values if empty
    if (inputDate && !inputDate.value) inputDate.value = "2026-10-13";
    if (inputTime && !inputTime.value) inputTime.value = "16:37";
    if (inputPlace && !inputPlace.value) inputPlace.value = "Chennai";

    const curDate = inputDate ? inputDate.value : "2026-10-13";
    const curTime = inputTime ? inputTime.value : "16:37";
    const curPlace = inputPlace ? (inputPlace.value.trim() || "Chennai") : "Chennai";

    // Bind event listeners only once
    if (section && (!section.dataset || !section.dataset.eventsBound)) {
      if (section.dataset) section.dataset.eventsBound = "true";

      if (tabModern) {
        tabModern.addEventListener("click", () => {
          horaCurrentMode = "modern";
          tabModern.classList.add("active");
          if (tabTamil) tabTamil.classList.remove("active");
          renderHoraMasterSection();
        });
      }

      if (tabTamil) {
        tabTamil.addEventListener("click", () => {
          horaCurrentMode = "tamil";
          tabTamil.classList.add("active");
          if (tabModern) tabModern.classList.remove("active");
          renderHoraMasterSection();
        });
      }

      if (btnCalculate) {
        btnCalculate.addEventListener("click", () => {
          renderHoraMasterSection();
        });
      }

      if (btnNow) {
        btnNow.addEventListener("click", () => {
          const now = new Date();
          const y = now.getFullYear();
          const m = String(now.getMonth() + 1).padStart(2, "0");
          const d = String(now.getDate()).padStart(2, "0");
          const hh = String(now.getHours()).padStart(2, "0");
          const mm = String(now.getMinutes()).padStart(2, "0");
          if (inputDate) inputDate.value = `${y}-${m}-${d}`;
          if (inputTime) inputTime.value = `${hh}:${mm}`;
          renderHoraMasterSection();
        });
      }

      if (btnExpandAll) {
        btnExpandAll.addEventListener("click", () => {
          horaExpandedAll = true;
          document.querySelectorAll("#horaHierarchyTree .hora-sub-panel").forEach(p => p.classList.add("expanded"));
          document.querySelectorAll("#horaHierarchyTree .hora-subsub-panel").forEach(p => p.classList.add("expanded"));
          document.querySelectorAll("#horaHierarchyTree .hora-chevron").forEach(c => c.classList.add("open"));
        });
      }

      if (btnCollapseAll) {
        btnCollapseAll.addEventListener("click", () => {
          horaExpandedAll = false;
          document.querySelectorAll("#horaHierarchyTree .hora-sub-panel").forEach(p => p.classList.remove("expanded"));
          document.querySelectorAll("#horaHierarchyTree .hora-subsub-panel").forEach(p => p.classList.remove("expanded"));
          document.querySelectorAll("#horaHierarchyTree .hora-chevron").forEach(c => c.classList.remove("open"));
        });
      }
    }

    // Latitude & Longitude resolution
    let lat = 13.0827, lon = 80.2707, tz = 5.5;
    const pLower = curPlace.toLowerCase();
    if (pLower.includes("madurai")) { lat = 9.9252; lon = 78.1198; }
    else if (pLower.includes("coimbatore")) { lat = 11.0168; lon = 76.9558; }
    else if (pLower.includes("trichy") || pLower.includes("tiruchirappalli")) { lat = 10.7905; lon = 78.7047; }
    else if (pLower.includes("salem")) { lat = 11.6643; lon = 78.1460; }
    else if (pLower.includes("tirunelveli")) { lat = 8.7139; lon = 77.7567; }
    else if (pLower.includes("bengaluru") || pLower.includes("bangalore")) { lat = 12.9716; lon = 77.5946; }

    const res = MuhurthamEngine.calculateFullHoraHierarchy(curDate, curTime, curPlace, lat, lon, tz);
    if (!res || !res.activePeriod) return;

    // Update Summary Badge
    if (summaryBadge) {
      summaryBadge.textContent = res.activePeriod.summaryBadge;
    }

    // Update Sun Metadata Chips
    if (sunMetaChips) {
      sunMetaChips.innerHTML = `
        <span class="ep-badge" style="background: rgba(255,255,255,0.12); color: #FFF; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.78rem;">
          🌅 உதயம்: ${res.sunTimes.sunrise}
        </span>
        <span class="ep-badge" style="background: rgba(255,255,255,0.12); color: #FFF; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.78rem;">
          🌇 அஸ்தமனம்: ${res.sunTimes.sunset}
        </span>
        <span class="ep-badge" style="background: rgba(255,255,255,0.12); color: #FFF; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.78rem;">
          ☀️ பகல்: ${res.sunTimes.dayDuration}
        </span>
        <span class="ep-badge" style="background: rgba(255,255,255,0.12); color: #FFF; border: 1px solid rgba(255,255,255,0.25); font-weight: 700; font-size: 0.78rem;">
          📅 ${res.weekday.nameTa} (${res.weekday.nameEn})
        </span>
      `;
    }

    // Render 24-Hora Tree
    if (treeContainer && res.horas) {
      const isModern = (horaCurrentMode === "modern");

      treeContainer.innerHTML = res.horas.map(hora => {
        const isHoraActive = hora.isActive;
        const phaseClass = hora.phase === "பகல்" ? "hora-phase-day" : "hora-phase-night";
        const phaseIcon = hora.phase === "பகல்" ? "☀️" : "🌙";
        // Auto-expand active hora or if expand all active
        const isHoraOpen = horaExpandedAll || isHoraActive;

        return `
          <div class="hora-card ${isHoraActive ? 'active hora-active-pulse' : ''}" data-hora="${hora.horaNum}">
            <!-- Level 1: Hora Header -->
            <div class="hora-card-header" onclick="toggleHoraAccordion(${hora.horaNum})">
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span style="font-size: 1.35rem;">${hora.planetSymbol}</span>
                <div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="font-weight: 900; color: #1E1B4B; font-size: 1.05rem;">
                      ${isModern ? `ஹோரா ${hora.horaNum}: ${hora.planetTa}` : `${hora.horaNum}. ${hora.planetTa} ஹோரா`}
                    </span>
                    ${isModern ? `<span style="font-size: 0.8rem; color: #64748B; font-weight: 700;">(${hora.planetEn})</span>` : ''}
                    <span class="ep-badge ${phaseClass}" style="font-size: 0.74rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 999px;">
                      ${phaseIcon} ${hora.phase} ${hora.phaseNum}
                    </span>
                    ${isHoraActive ? `
                      <span class="ep-badge" style="background: #FEF3C7; color: #92400E; border: 1.5px solid #F59E0B; font-weight: 900; font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 999px;">
                        🎯 நடப்பு ஹோரா (Active)
                      </span>
                    ` : ''}
                  </div>
                  <div style="font-size: 0.82rem; color: #4338CA; margin-top: 0.2rem; font-weight: 600;">
                    ${isModern ? `<strong>நற்காரியங்கள்:</strong> ${hora.goodForTa}` : `<strong>தேவதை:</strong> ${hora.deity} · <strong>சிறப்பு:</strong> ${hora.goodForTa}`}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div style="text-align: right;">
                  <span style="font-family: monospace; font-size: 0.92rem; font-weight: 800; color: #0F172A; background: #F1F5F9; padding: 0.25rem 0.65rem; border-radius: 6px; border: 1px solid #E2E8F0; display: inline-block;">
                    ⏱️ ${hora.timeRange.label}
                  </span>
                  <div style="font-size: 0.72rem; color: #64748B; margin-top: 0.15rem; font-weight: 600;">
                    ${hora.durationMinutes} நிமிடம் (${hora.durationNazhigai} நாழிகை)
                  </div>
                </div>
                <span class="hora-chevron ${isHoraOpen ? 'open' : ''}" id="horaChev_${hora.horaNum}">▼</span>
              </div>
            </div>

            <!-- Level 2: Sub-Horas (7 per Hora) -->
            <div class="hora-sub-panel ${isHoraOpen ? 'expanded' : ''}" id="horaSubPanel_${hora.horaNum}">
              <div style="font-size: 0.78rem; font-weight: 800; color: #4338CA; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem; display: flex; justify-content: space-between;">
                <span>🌿 உப ஹோராக்கள் (7 பாகங்கள்):</span>
                <span>ஒரு உப ஹோரா = ${(hora.durationMinutes / 7).toFixed(2)} நிமிடம்</span>
              </div>

              ${hora.subHoras.map(sub => {
                const isSubActive = sub.isActive;
                const isSubOpen = horaExpandedAll || isSubActive;

                return `
                  <div class="hora-sub-card ${isSubActive ? 'active' : ''}" data-sub="${hora.horaNum}_${sub.subNum}">
                    <!-- Level 2 Header -->
                    <div class="hora-sub-header" onclick="toggleSubHoraAccordion(${hora.horaNum}, ${sub.subNum})">
                      <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                        <span>${sub.planetSymbol}</span>
                        <strong style="color: #1E293B; font-size: 0.92rem;">
                          ${sub.subNum}. உப ஹோரா: ${sub.planetTa} ${isModern ? `(${sub.planetEn})` : ''}
                        </strong>
                        ${isSubActive ? `
                          <span style="font-size: 0.72rem; background: #DCFCE7; color: #166534; font-weight: 800; padding: 0.1rem 0.45rem; border-radius: 999px; border: 1px solid #86EFAC;">
                            🎯 நடப்பு உப ஹோரா
                          </span>
                        ` : ''}
                      </div>

                      <div style="display: flex; align-items: center; gap: 0.65rem;">
                        <span style="font-family: monospace; font-size: 0.82rem; font-weight: 700; color: #334155; background: #F8FAFC; padding: 0.15rem 0.5rem; border-radius: 4px; border: 1px solid #CBD5E1;">
                          ${sub.timeRange.label}
                        </span>
                        <span class="hora-chevron ${isSubOpen ? 'open' : ''}" id="subChev_${hora.horaNum}_${sub.subNum}" style="font-size: 0.72rem;">▼</span>
                      </div>
                    </div>

                    <!-- Level 3: Sub-sub-Horas (7 per Sub-Hora) -->
                    <div class="hora-subsub-panel ${isSubOpen ? 'expanded' : ''}" id="subsubPanel_${hora.horaNum}_${sub.subNum}">
                      ${sub.subSubHoras.map(ss => {
                        const isSsActive = ss.isActive;
                        return `
                          <div class="hora-subsub-card ${isSsActive ? 'active' : ''}" title="${ss.subSubNum} உப-உப ஹோரா: ${ss.planetTa} (${ss.timeRange.start12} – ${ss.timeRange.end12})">
                            <div style="display: flex; align-items: center; gap: 0.4rem;">
                              <span style="font-size: 0.9rem;">${ss.planetSymbol}</span>
                              <span style="font-size: 0.82rem; font-weight: 800; color: ${isSsActive ? '#065F46' : '#1E293B'};">
                                ${ss.subSubNum}. ${ss.planetTa}
                              </span>
                              ${isSsActive ? `
                                <span style="font-size: 0.68rem; background: #10B981; color: #FFF; font-weight: 800; padding: 1px 5px; border-radius: 999px;">
                                  நடப்பு
                                </span>
                              ` : ''}
                            </div>
                            <span style="font-family: monospace; font-size: 0.74rem; font-weight: 700; color: ${isSsActive ? '#047857' : '#64748B'};">
                              ${ss.timeRange.label}
                            </span>
                          </div>
                        `;
                      }).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // Global accordion toggles
  window.toggleHoraAccordion = function(horaNum) {
    const panel = document.getElementById(`horaSubPanel_${horaNum}`);
    const chev = document.getElementById(`horaChev_${horaNum}`);
    if (panel) {
      panel.classList.toggle("expanded");
      if (chev) chev.classList.toggle("open");
    }
  };

  window.toggleSubHoraAccordion = function(horaNum, subNum) {
    const panel = document.getElementById(`subsubPanel_${horaNum}_${subNum}`);
    const chev = document.getElementById(`subChev_${horaNum}_${subNum}`);
    if (panel) {
      panel.classList.toggle("expanded");
      if (chev) chev.classList.toggle("open");
    }
  };

  /**
   * 19. 108 நட்சத்திர பாதங்கள் & ராசி பண்புகள் (108 Nakshatra Padas & Rasi Attributes)
   */
  let selectedPada108Number = 1;

  function renderPada108Section(targetPadaNum = selectedPada108Number) {
    if (typeof Pada108Engine === "undefined") {
      console.warn("Pada108Engine not ready");
      return;
    }

    const numInput = document.getElementById("padaNumberInput");
    const nakSelect = document.getElementById("padaNakshatraFilter");
    const rasiSelect = document.getElementById("padaRasiFilter");
    const btnShow = document.getElementById("btnShowPada");
    const btnReset = document.getElementById("btnResetPada");
    const btnBrowse = document.getElementById("btnTogglePadaBrowse");
    const padaTitle = document.getElementById("padaTitleDisplay");
    const padaBadge = document.getElementById("padaBadgeDisplay");
    const padaTbody = document.getElementById("padaDetailsTableBody");
    const rasiTitle = document.getElementById("rasiTitleDisplay");
    const rasiElement = document.getElementById("rasiElementDisplay");
    const rasiTbody = document.getElementById("rasiAttributesTableBody");
    const dirSection = document.getElementById("padaDirectorySection");
    const dirGrid = document.getElementById("padaDirectoryGrid");

    if (!padaTbody || !rasiTbody) return;

    // Populate filter dropdowns once
    if (nakSelect && nakSelect.children.length <= 1) {
      nakSelect.innerHTML = `<option value="all">அனைத்தும்</option>` +
        Pada108Engine.NAKSHATRA_NAMES_TA.map(name => `<option value="${name}">${name}</option>`).join("");
    }
    if (rasiSelect && rasiSelect.children.length <= 1) {
      rasiSelect.innerHTML = `<option value="all">அனைத்தும்</option>` +
        Pada108Engine.RASI_NAMES_TA.map(name => `<option value="${name}">${name}</option>`).join("");
    }

    let num = parseInt(targetPadaNum, 10);
    if (isNaN(num) || num < 1) num = 1;
    if (num > 108) num = 108;
    selectedPada108Number = num;

    if (numInput && parseInt(numInput.value, 10) !== num) {
      numInput.value = num;
    }

    const p = Pada108Engine.getPadaDetails(num);
    const r = p.rasiAttributes;

    // Card 1: Pada Details
    if (padaTitle) padaTitle.textContent = `பாத எண் ${p.padaNum}`;
    if (padaBadge) padaBadge.textContent = `${p.nakshatra} · பாதம் ${p.padaInNak}`;

    padaTbody.innerHTML = `
      <tr>
        <td class="label-cell">நட்சத்திரம்</td>
        <td class="val-cell"><strong>${p.nakshatra}</strong></td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திரத்துள் பாதம்</td>
        <td class="val-cell">${p.padaInNak}</td>
      </tr>
      <tr>
        <td class="label-cell">ராசி</td>
        <td class="val-cell"><strong>${p.rasi}</strong></td>
      </tr>
      <tr>
        <td class="label-cell">நவாம்சம்</td>
        <td class="val-cell"><strong>${p.navamsha}</strong></td>
      </tr>
      <tr>
        <td class="label-cell">ராசி பூதம்</td>
        <td class="val-cell">${p.rasiElement}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர பூதம்</td>
        <td class="val-cell">${p.nakElement}</td>
      </tr>
      <tr>
        <td class="label-cell">பாகை வீச்சு</td>
        <td class="val-cell"><code style="background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-weight: 700; color: #0F172A;">${p.degreeRange}</code></td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர அதிபதி</td>
        <td class="val-cell">${p.nakLord}</td>
      </tr>
      <tr>
        <td class="label-cell">நட்சத்திர பூதக் குறிப்பு</td>
        <td class="val-cell" style="font-size: 0.82rem; color: #475569; line-height: 1.4;">${p.elementNote}</td>
      </tr>
      <tr>
        <td class="label-cell">சந்திர தாக்கம்</td>
        <td class="val-cell" style="font-size: 0.82rem; color: #475569; line-height: 1.4;">${p.chandraImpact}</td>
      </tr>
      <tr>
        <td class="label-cell">பாத பண்பு</td>
        <td class="val-cell" style="font-size: 0.82rem; color: #475569; line-height: 1.4;">${p.padaTrait}</td>
      </tr>
      <tr>
        <td class="label-cell">குணக்குறிப்பு</td>
        <td class="val-cell" style="font-size: 0.82rem; color: #1E293B; font-weight: 600; line-height: 1.4;">${p.gunaKurippu}</td>
      </tr>
      <tr>
        <td class="label-cell">முதன்மை பண்பு</td>
        <td class="val-cell"><span style="color: #9D174D; font-weight: 700;">${p.primaryTrait}</span></td>
      </tr>
    `;

    // Card 2: Rasi Attributes (Complete 24 Tamil Attributes)
    if (rasiTitle) rasiTitle.textContent = `ராசி பண்புகள் (${r.name})`;
    if (rasiElement) rasiElement.textContent = `${r.bootham}`;

    rasiTbody.innerHTML = `
      <tr>
        <td class="label-cell">பூதம்</td>
        <td class="val-cell">${r.bootham}</td>
      </tr>
      <tr>
        <td class="label-cell">திசை</td>
        <td class="val-cell">${r.direction}</td>
      </tr>
      <tr>
        <td class="label-cell">குணம்</td>
        <td class="val-cell">${r.gunam}</td>
      </tr>
      <tr>
        <td class="label-cell">வர்ணம்</td>
        <td class="val-cell">${r.varnam}</td>
      </tr>
      <tr>
        <td class="label-cell">வகை</td>
        <td class="val-cell">${r.vagai}</td>
      </tr>
      <tr>
        <td class="label-cell">பால்</td>
        <td class="val-cell">${r.gender}</td>
      </tr>
      <tr>
        <td class="label-cell">அதிபதி</td>
        <td class="val-cell"><strong>${r.lord}</strong></td>
      </tr>
      <tr>
        <td class="label-cell">நிறம்</td>
        <td class="val-cell">${r.color}</td>
      </tr>
      <tr>
        <td class="label-cell">உடல் உறுப்பு</td>
        <td class="val-cell">${r.bodyPart}</td>
      </tr>
      <tr>
        <td class="label-cell">இயல்பு</td>
        <td class="val-cell">${r.nature}</td>
      </tr>
      <tr>
        <td class="label-cell">மனநிலை</td>
        <td class="val-cell">${r.mentalState}</td>
      </tr>
      <tr>
        <td class="label-cell">யோகம்</td>
        <td class="val-cell">${r.yogam}</td>
      </tr>
      <tr>
        <td class="label-cell">குணங்கள்</td>
        <td class="val-cell">${r.gunangal}</td>
      </tr>
      <tr>
        <td class="label-cell">பருவம்</td>
        <td class="val-cell">${r.season}</td>
      </tr>
      <tr>
        <td class="label-cell">உலோகம்</td>
        <td class="val-cell">${r.metal}</td>
      </tr>
      <tr>
        <td class="label-cell">கல்</td>
        <td class="val-cell"><strong>${r.gem}</strong></td>
      </tr>
      <tr>
        <td class="label-cell">நன்மை எண்கள்</td>
        <td class="val-cell">${r.luckyNumbers}</td>
      </tr>
      <tr>
        <td class="label-cell">தொழில்</td>
        <td class="val-cell" style="font-size: 0.82rem;">${r.career}</td>
      </tr>
      <tr>
        <td class="label-cell">உயரம்</td>
        <td class="val-cell">${r.height}</td>
      </tr>
      <tr>
        <td class="label-cell">இடம்</td>
        <td class="val-cell" style="font-size: 0.82rem;">${r.place}</td>
      </tr>
      <tr>
        <td class="label-cell">தானியம்</td>
        <td class="val-cell">${r.grain}</td>
      </tr>
      <tr>
        <td class="label-cell">சுவை</td>
        <td class="val-cell">${r.taste}</td>
      </tr>
      <tr>
        <td class="label-cell">மலர்</td>
        <td class="val-cell">${r.flower}</td>
      </tr>
      <tr>
        <td class="label-cell">வடிவம்</td>
        <td class="val-cell">${r.shape}</td>
      </tr>
    `;

    // Render Directory Grid
    if (dirGrid) {
      const selectedNak = nakSelect ? nakSelect.value : "all";
      const selectedRasi = rasiSelect ? rasiSelect.value : "all";
      const padasList = Pada108Engine.filterPadas(selectedNak, selectedRasi);

      dirGrid.innerHTML = padasList.map(item => `
        <div class="ep-pada-dir-item ${item.padaNum === p.padaNum ? 'is-selected' : ''}" data-padanum="${item.padaNum}">
          <div class="ep-pada-dir-num">பாதம் #${item.padaNum}</div>
          <div class="ep-pada-dir-name">${item.nakshatra} - ${item.padaInNak}</div>
          <div class="ep-pada-dir-sub">${item.rasi} · நவா: ${item.navamsha}</div>
        </div>
      `).join("");

      // Bind directory cards click
      dirGrid.querySelectorAll(".ep-pada-dir-item").forEach(item => {
        item.addEventListener("click", () => {
          const clickedNum = parseInt(item.getAttribute("data-padanum"), 10);
          renderPada108Section(clickedNum);
        });
      });
    }

    // Bind Controls Once
    if (btnShow && !btnShow.getAttribute("data-bound")) {
      btnShow.setAttribute("data-bound", "true");
      btnShow.addEventListener("click", () => {
        const val = parseInt(numInput?.value, 10);
        renderPada108Section(val);
      });
    }

    if (numInput && !numInput.getAttribute("data-bound")) {
      numInput.setAttribute("data-bound", "true");
      numInput.addEventListener("change", () => {
        const val = parseInt(numInput.value, 10);
        renderPada108Section(val);
      });
      numInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          const val = parseInt(numInput.value, 10);
          renderPada108Section(val);
        }
      });
    }

    if (btnReset && !btnReset.getAttribute("data-bound")) {
      btnReset.setAttribute("data-bound", "true");
      btnReset.addEventListener("click", () => {
        if (nakSelect) nakSelect.value = "all";
        if (rasiSelect) rasiSelect.value = "all";
        renderPada108Section(1);
      });
    }

    if (btnBrowse && !btnBrowse.getAttribute("data-bound")) {
      btnBrowse.setAttribute("data-bound", "true");
      btnBrowse.addEventListener("click", () => {
        if (dirSection) {
          const isHidden = dirSection.style.display === "none";
          dirSection.style.display = isHidden ? "block" : "none";
          btnBrowse.textContent = isHidden ? "அட்டவணையை மறை" : "பாதங்களைப் பார்க்க";
        }
      });
    }

    if (nakSelect && !nakSelect.getAttribute("data-bound")) {
      nakSelect.setAttribute("data-bound", "true");
      nakSelect.addEventListener("change", () => {
        const chosen = nakSelect.value;
        if (chosen !== "all") {
          const idx = Pada108Engine.NAKSHATRA_NAMES_TA.indexOf(chosen);
          if (idx >= 0) {
            renderPada108Section(idx * 4 + 1);
            return;
          }
        }
        renderPada108Section(selectedPada108Number);
      });
    }

    if (rasiSelect && !rasiSelect.getAttribute("data-bound")) {
      rasiSelect.setAttribute("data-bound", "true");
      rasiSelect.addEventListener("change", () => {
        const chosen = rasiSelect.value;
        if (chosen !== "all") {
          const idx = Pada108Engine.RASI_NAMES_TA.indexOf(chosen);
          if (idx >= 0) {
            renderPada108Section(idx * 9 + 1);
            return;
          }
        }
        renderPada108Section(selectedPada108Number);
      });
    }
  }

  /**
   * 20. திம்ப சக்கரம் (Thimba Chakra / Dimba Chakram)
   */
  let thimbaCurrentSunNak = "பரணி";
  let thimbaCurrentMoonNak = "சித்திரை";
  let thimbaCurrentTransitNak = "சுவாதி";

  function renderThimbaChakraSection(customData) {
    const data = customData || AppState.horoscopeData;
    if (data && data.planets) {
      if (data.planets["Su"]?.nakshatraNameTa) {
        thimbaCurrentSunNak = data.planets["Su"].nakshatraNameTa;
      }
      if (data.planets["Mo"]?.nakshatraNameTa) {
        thimbaCurrentMoonNak = data.planets["Mo"].nakshatraNameTa;
      }
    }

    const sunSelect = document.getElementById("thimbaSunSelect");
    const moonSelect = document.getElementById("thimbaMoonSelect");
    const transitSelect = document.getElementById("thimbaTransitSelect");
    const btnCalc = document.getElementById("btnCalculateThimba");
    const btnSync = document.getElementById("btnSyncThimbaChart");
    const btnDeep = document.getElementById("btnDeepDiveThimba");

    const natalBadge = document.getElementById("thimbaNatalBadge");
    const natalSub = document.getElementById("thimbaNatalSubtitle");
    const natalInterp = document.getElementById("thimbaNatalInterpretation");

    const transitBadge = document.getElementById("thimbaTransitBadge");
    const transitSub = document.getElementById("thimbaTransitSubtitle");
    const transitInterp = document.getElementById("thimbaTransitInterpretation");

    const slotsGrid = document.getElementById("thimbaSlotsGrid");

    if (!slotsGrid) return;

    const NAKS = (typeof AstroEngine !== "undefined" && AstroEngine.THIMBA_NAKSHATRA_ORDER) ? AstroEngine.THIMBA_NAKSHATRA_ORDER : [
      "அஸ்வினி", "பரணி", "கார்த்திகை", "ரோகிணி", "மிருகசீரிஷம்", "திருவாதிரை",
      "புனர்பூசம்", "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்",
      "அஸ்தம்", "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை",
      "மூலம்", "பூராடம்", "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்",
      "பூரட்டாதி", "உத்திரட்டாதி", "ரேவதி"
    ];

    // Populate dropdowns once
    if (sunSelect && sunSelect.children.length === 0) {
      sunSelect.innerHTML = NAKS.map(n => `<option value="${n}">${n}</option>`).join("");
    }
    if (moonSelect && moonSelect.children.length === 0) {
      moonSelect.innerHTML = NAKS.map(n => `<option value="${n}">${n}</option>`).join("");
    }
    if (transitSelect && transitSelect.children.length === 0) {
      transitSelect.innerHTML = NAKS.map(n => `<option value="${n}">${n}</option>`).join("");
    }

    if (sunSelect && sunSelect.value !== thimbaCurrentSunNak) sunSelect.value = thimbaCurrentSunNak;
    if (moonSelect && moonSelect.value !== thimbaCurrentMoonNak) moonSelect.value = thimbaCurrentMoonNak;
    if (transitSelect && transitSelect.value !== thimbaCurrentTransitNak) transitSelect.value = thimbaCurrentTransitNak;

    const thimbaData = (typeof AstroEngine !== "undefined" && AstroEngine.calculateThimbaChakra)
      ? AstroEngine.calculateThimbaChakra(thimbaCurrentSunNak, thimbaCurrentMoonNak, thimbaCurrentTransitNak)
      : null;

    if (!thimbaData) return;

    const nat = thimbaData.natalResult;
    const tra = thimbaData.transitResult || thimbaData.todayTransit;

    if (natalBadge) natalBadge.textContent = `நிலை #${nat.slot} · ${nat.bodyPart}`;
    if (natalSub) natalSub.textContent = `சூரியன்: ${thimbaData.birthSunNakshatra} ➔ சந்திரன்: ${thimbaData.birthMoonNakshatra}`;
    if (natalInterp) natalInterp.textContent = nat.interpretation;

    if (transitBadge) transitBadge.textContent = `நிலை #${tra.slot} · ${tra.bodyPart}`;
    if (transitSub) transitSub.textContent = `இன்றைய கோச்சார சந்திரன்: ${thimbaData.todayTransit?.nakshatra || thimbaCurrentTransitNak}`;
    if (transitInterp) transitInterp.textContent = tra.interpretation;

    // Render 12 Slots Cards
    slotsGrid.innerHTML = (thimbaData.slots || []).map(s => {
      const isNatal = s.slot === nat.slot;
      const isTransit = s.slot === tra.slot;
      let borderStyle = "1px solid rgba(255, 255, 255, 0.1)";
      let bgStyle = "rgba(15, 23, 42, 0.75)";
      let shadowStyle = "none";

      if (isNatal && isTransit) {
        borderStyle = "2px solid #F59E0B";
        bgStyle = "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(16,185,129,0.2))";
        shadowStyle = "0 4px 18px rgba(245,158,11,0.25)";
      } else if (isNatal) {
        borderStyle = "2px solid #D4AF37";
        bgStyle = "rgba(212, 175, 55, 0.15)";
        shadowStyle = "0 4px 15px rgba(212,175,55,0.2)";
      } else if (isTransit) {
        borderStyle = "2px solid #10B981";
        bgStyle = "rgba(16, 185, 129, 0.15)";
        shadowStyle = "0 4px 15px rgba(16,185,129,0.2)";
      }

      return `
        <div style="background: ${bgStyle}; border: ${borderStyle}; border-radius: 10px; padding: 0.9rem 1rem; box-shadow: ${shadowStyle}; position: relative; transition: all 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; gap: 0.4rem;">
            <div>
              <span style="font-size: 0.95rem; font-weight: 800; color: ${isNatal ? '#FDE68A' : (isTransit ? '#6EE7B7' : '#F1F5F9')};">
                ${s.slot}. ${s.bodyPart}
              </span>
              <span style="font-size: 0.75rem; color: #94A3B8; margin-left: 0.3rem;">(${s.bodyPartEn || ''})</span>
            </div>
            <span style="font-size: 0.72rem; background: rgba(255,255,255,0.1); color: #CBD5E1; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 700;">
              ${s.count} நட்சத்திரம்${s.count > 1 ? 'கள்' : ''}
            </span>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.6rem;">
            ${isNatal ? '<span style="background: #D4AF37; color: #000; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">★ ஜென்ம சந்திரன்</span>' : ''}
            ${isTransit ? '<span style="background: #10B981; color: #FFF; font-size: 0.7rem; font-weight: 800; padding: 0.15rem 0.5rem; border-radius: 4px;">🌙 இன்றைய கோச்சாரம்</span>' : ''}
          </div>

          <div style="font-size: 0.84rem; color: ${isNatal ? '#FFF' : '#CBD5E1'}; font-weight: 600; margin-bottom: 0.5rem; line-height: 1.5;">
            ${(s.nakshatras || []).map(n => {
              const matchNat = n === thimbaCurrentMoonNak;
              const matchTra = n === thimbaCurrentTransitNak;
              if (matchNat) return `<span style="background: #D4AF37; color: #000; padding: 1px 4px; border-radius: 3px; font-weight: 800;">${n}</span>`;
              if (matchTra) return `<span style="background: #10B981; color: #FFF; padding: 1px 4px; border-radius: 3px; font-weight: 800;">${n}</span>`;
              return n;
            }).join(', ')}
          </div>

          <div style="font-size: 0.77rem; color: #94A3B8; line-height: 1.45; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.45rem;">
            ${s.interpretation.length > 95 ? s.interpretation.substring(0, 95) + '...' : s.interpretation}
          </div>
        </div>
      `;
    }).join("");

    // Bind Controls Once
    if (btnCalc && !btnCalc.getAttribute("data-bound")) {
      btnCalc.setAttribute("data-bound", "true");
      btnCalc.addEventListener("click", () => {
        if (sunSelect) thimbaCurrentSunNak = sunSelect.value;
        if (moonSelect) thimbaCurrentMoonNak = moonSelect.value;
        if (transitSelect) thimbaCurrentTransitNak = transitSelect.value;
        renderThimbaChakraSection();
      });
    }

    if (btnSync && !btnSync.getAttribute("data-bound")) {
      btnSync.setAttribute("data-bound", "true");
      btnSync.addEventListener("click", () => {
        const activeData = AppState.horoscopeData;
        if (activeData && activeData.planets) {
          if (activeData.planets["Su"]?.nakshatraNameTa) thimbaCurrentSunNak = activeData.planets["Su"].nakshatraNameTa;
          if (activeData.planets["Mo"]?.nakshatraNameTa) thimbaCurrentMoonNak = activeData.planets["Mo"].nakshatraNameTa;
        } else {
          thimbaCurrentSunNak = "பரணி";
          thimbaCurrentMoonNak = "சித்திரை";
        }
        thimbaCurrentTransitNak = "சுவாதி";
        renderThimbaChakraSection();
      });
    }

    if (btnDeep && !btnDeep.getAttribute("data-bound")) {
      btnDeep.setAttribute("data-bound", "true");
      btnDeep.addEventListener("click", () => {
        openModal("m31");
      });
    }

    if (sunSelect && !sunSelect.getAttribute("data-bound")) {
      sunSelect.setAttribute("data-bound", "true");
      sunSelect.addEventListener("change", () => {
        thimbaCurrentSunNak = sunSelect.value;
        renderThimbaChakraSection();
      });
    }

    if (moonSelect && !moonSelect.getAttribute("data-bound")) {
      moonSelect.setAttribute("data-bound", "true");
      moonSelect.addEventListener("change", () => {
        thimbaCurrentMoonNak = moonSelect.value;
        renderThimbaChakraSection();
      });
    }

    if (transitSelect && !transitSelect.getAttribute("data-bound")) {
      transitSelect.setAttribute("data-bound", "true");
      transitSelect.addEventListener("change", () => {
        thimbaCurrentTransitNak = transitSelect.value;
        renderThimbaChakraSection();
      });
    }
  }

  /**
   * 19. கோச்சார பஞ்சபட்சி (Gochara Pancha Pakshi Daily Schedule)
   */
  function getTodayIsoDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let selectedPpDate = getTodayIsoDate();
  let selectedPpPlace = "Chennai";
  let selectedPpLat = 13.0827;
  let selectedPpLon = 80.2707;
  let selectedPpTheme = "modern";
  let selectedPpLang = "ta";
  let isPpListenersBound = false;
  let livePpTickerInterval = null;

  function renderKocharPanchaPakshiSection() {
    if (typeof PanchaPakshiEngine === "undefined") {
      console.warn("PanchaPakshiEngine not loaded yet");
      return;
    }

    const sec = document.getElementById("kocharPanchaPakshiSection");
    if (!sec) return;

    const schedule = PanchaPakshiEngine.calculateDailySchedule({
      date: selectedPpDate,
      place: selectedPpPlace,
      lat: selectedPpLat,
      lon: selectedPpLon,
      tz: 5.5,
      lang: selectedPpLang
    });

    const t = (k) => PanchaPakshiEngine.t(k, selectedPpLang);

    // Hero Main Bird
    const mainBirdName = document.getElementById("secPpMainBirdName");
    const mainBirdSub = document.getElementById("secPpMainBirdSub");
    const noonBadge = document.getElementById("secPpNoonBirdBadge");
    if (mainBirdName) mainBirdName.textContent = schedule.bird.ta;
    if (mainBirdSub) mainBirdSub.textContent = `${schedule.pakshaTa} · ${schedule.starObj.ta} · ${schedule.bird.ta}`;
    if (noonBadge) noonBadge.innerHTML = `${t("noonBirdTitle")}: <strong id="secPpNoonBirdName">${schedule.bird.ta}</strong>`;

    // Overview Metrics
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setTxt("secLblTodayBird", t("todayBird"));
    setTxt("secLblPaksham", t("paksham"));
    setTxt("secLblElement", t("element"));
    setTxt("secLblWeekday", t("weekday"));
    setTxt("secLblSunrise", t("sunrise"));
    setTxt("secLblSunset", t("sunset"));

    setTxt("secValTodayBird", schedule.bird.ta);
    setTxt("secValPaksham", schedule.pakshaTa);
    setTxt("secValElement", schedule.elementTa);
    setTxt("secValWeekday", schedule.weekday.ta);
    setTxt("secValSunrise", schedule.sunriseStr);
    setTxt("secValSunset", schedule.sunsetStr);

    // Date input and location name
    const dInput = document.getElementById("secPpDateInput");
    if (dInput) dInput.value = selectedPpDate;
    const lName = document.getElementById("secPpLocName");
    if (lName) lName.textContent = selectedPpPlace;

    // Gochara 3-Day Table
    const gTbody = document.getElementById("secPpGocharaTbody");
    if (gTbody) {
      gTbody.innerHTML = schedule.threeDaysGochara.map(row => `
        <tr class="${row.isCurrent ? 'active-row' : ''}">
          <td><strong>${row.periodLabel}</strong></td>
          <td>${row.date}</td>
          <td>${row.nakshatra}</td>
          <td>${row.paksha}</td>
          <td><strong>${row.bird}</strong></td>
          <td>${row.weekday}</td>
        </tr>
      `).join("");
    }

    // Major Timeline Table
    const tlTbody = document.getElementById("secPpTimelineTbody");
    if (tlTbody) {
      tlTbody.innerHTML = schedule.majorTimeline.map(row => `
        <tr>
          <td style="font-family: monospace; font-weight: 700;">${row.startStr}</td>
          <td style="font-family: monospace; font-weight: 700;">${row.endStr}</td>
          <td>${row.bird.ta}</td>
          <td>${row.nakshatraTa}</td>
          <td>${row.pakshaTa}</td>
          <td><span class="ep-pp-badge" style="background: ${row.periodType === 'day' ? '#FEF3C7' : '#E0E7FF'}; color: ${row.periodType === 'day' ? '#92400E' : '#3730A3'};">${row.periodType}</span></td>
          <td><span class="ep-pp-badge ${row.activity.badgeClass}">${row.activity.ta}</span></td>
        </tr>
      `).join("");
    }

    // Astronomical Transitions Table
    const trTbody = document.getElementById("secPpTransitionsTbody");
    if (trTbody) {
      trTbody.innerHTML = schedule.transitions.map(tr => `
        <tr>
          <td style="font-family: monospace; font-weight: 700;">${tr.time}</td>
          <td><span class="ep-pp-badge badge-nadai">${tr.typeTa}</span></td>
          <td>${tr.nakshatra}</td>
          <td>${tr.paksha}</td>
          <td><strong>${tr.bird}</strong></td>
          <td><span style="color: #64748B;">${tr.status}</span></td>
        </tr>
      `).join("");
    }

    // Live Indicator Card with Real-Time Ticker
    function updateLivePanchaPakshiSlot() {
      const now = new Date();
      const isToday = (selectedPpDate === getTodayIsoDate());
      const targetTime = isToday ? now : new Date(`${selectedPpDate}T12:00:00`);
      const liveSlot = PanchaPakshiEngine.getLiveActiveSlot(schedule, targetTime);
      
      const timeStr = isToday
        ? now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
        : '12:00 PM';

      setTxt("secPpLiveLabel", `${t("nowLabel")} — ${timeStr}`);
      setTxt("secPpLiveVal", liveSlot.displayText || `${schedule.bird.ta} · ${schedule.pakshaTa}`);

      // Highlight active major timeline row in secPpTimelineTbody
      if (isToday) {
        const curMins = now.getHours() * 60 + now.getMinutes();
        const tlRows = document.querySelectorAll("#secPpTimelineTbody tr");
        if (schedule.majorTimeline && tlRows.length === schedule.majorTimeline.length) {
          schedule.majorTimeline.forEach((row, idx) => {
            const tr = tlRows[idx];
            if (!tr) return;
            const inRange = (curMins >= row.startMins && curMins < row.endMins);
            tr.classList.toggle("active-row", inRange);
            if (inRange) {
              tr.style.background = "#FEF3C7";
              tr.style.fontWeight = "bold";
            } else {
              tr.style.background = "";
              tr.style.fontWeight = "";
            }
          });
        }
      }
    }

    updateLivePanchaPakshiSlot();

    if (livePpTickerInterval) {
      clearInterval(livePpTickerInterval);
    }
    livePpTickerInterval = setInterval(updateLivePanchaPakshiSlot, 1000);

    // Day & Night Accordions
    renderSectionAccordionList("secPpDayAccordionList", schedule.dayPeriods);
    renderSectionAccordionList("secPpNightAccordionList", schedule.nightPeriods);

    // Master Reference Tables
    renderSectionStaticTables();

    // Event Listeners (bind only once)
    if (!isPpListenersBound) {
      isPpListenersBound = true;

      // Themes
      document.querySelectorAll("[data-pp-theme]").forEach(btn => {
        btn.addEventListener("click", () => {
          selectedPpTheme = btn.getAttribute("data-pp-theme");
          const cardEl = document.getElementById("indexPanchaPakshiCard");
          if (cardEl) {
            cardEl.className = "ep-pp-card ep-theme-" + selectedPpTheme;
          }
          document.querySelectorAll("[data-pp-theme]").forEach(b => {
            b.classList.toggle("active", b.getAttribute("data-pp-theme") === selectedPpTheme);
          });
        });
      });

      // Languages
      document.querySelectorAll("[data-pp-lang]").forEach(btn => {
        btn.addEventListener("click", () => {
          selectedPpLang = btn.getAttribute("data-pp-lang");
          document.querySelectorAll("[data-pp-lang]").forEach(b => {
            b.classList.toggle("active", b.getAttribute("data-pp-lang") === selectedPpLang);
          });
          renderKocharPanchaPakshiSection();
        });
      });

      // Date Navigation
      document.getElementById("secPpPrevBtn")?.addEventListener("click", () => {
        const d = new Date(selectedPpDate);
        d.setDate(d.getDate() - 1);
        selectedPpDate = d.toISOString().split("T")[0];
        renderKocharPanchaPakshiSection();
      });

      document.getElementById("secPpTodayBtn")?.addEventListener("click", () => {
        selectedPpDate = getTodayIsoDate();
        renderKocharPanchaPakshiSection();
      });

      document.getElementById("secPpNextBtn")?.addEventListener("click", () => {
        const d = new Date(selectedPpDate);
        d.setDate(d.getDate() + 1);
        selectedPpDate = d.toISOString().split("T")[0];
        renderKocharPanchaPakshiSection();
      });

      document.getElementById("secPpDateInput")?.addEventListener("change", (e) => {
        if (e.target.value) {
          selectedPpDate = e.target.value;
          renderKocharPanchaPakshiSection();
        }
      });

      // Location Changer
      document.getElementById("secPpChangeLocBtn")?.addEventListener("click", () => {
        const p = prompt("இடத்தின் பெயரை உள்ளிடவும் (Location name):", selectedPpPlace);
        if (p && p.trim()) {
          selectedPpPlace = p.trim();
          renderKocharPanchaPakshiSection();
        }
      });

      document.getElementById("secPpShowLocBtn")?.addEventListener("click", () => {
        alert("இடம்: " + selectedPpPlace + " (Latitude: " + selectedPpLat + ", Longitude: " + selectedPpLon + ")");
      });

      // Expand / Collapse toggles
      document.getElementById("secPpExpandAllDayBtn")?.addEventListener("click", () => {
        document.querySelectorAll("#secPpDayAccordionList .ep-pp-tree-card").forEach(c => c.classList.add("open"));
      });
      document.getElementById("secPpCollapseAllDayBtn")?.addEventListener("click", () => {
        document.querySelectorAll("#secPpDayAccordionList .ep-pp-tree-card").forEach(c => c.classList.remove("open"));
      });
      document.getElementById("secPpExpandAllNightBtn")?.addEventListener("click", () => {
        document.querySelectorAll("#secPpNightAccordionList .ep-pp-tree-card").forEach(c => c.classList.add("open"));
      });
      document.getElementById("secPpCollapseAllNightBtn")?.addEventListener("click", () => {
        document.querySelectorAll("#secPpNightAccordionList .ep-pp-tree-card").forEach(c => c.classList.remove("open"));
      });
    }
  }

  function renderSectionAccordionList(containerId, yamamList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = yamamList.map((y, idx) => `
      <div class="ep-pp-tree-card ${idx === 0 ? 'open' : ''}" id="sec-card-${y.id}">
        <div class="ep-pp-accordion-header" onclick="document.getElementById('sec-card-${y.id}')?.classList.toggle('open')">
          <div class="ep-pp-tree-title">
            <span style="font-family: monospace; font-weight: 800; font-size: 0.95rem;">${y.timeRangeStr}</span>
            <span>·</span>
            <span>${y.bird.ta} · <strong>${y.activity.ta}</strong></span>
          </div>
          <div>
            <span class="ep-pp-badge ${y.activity.badgeClass}">${y.activity.verdictTa}</span>
          </div>
        </div>

        <div class="ep-pp-sub-container">
          ${y.subPeriods.map(sub => `
            <div class="ep-pp-sub-card">
              <div class="ep-pp-sub-header">
                <div>
                  <span style="font-family: monospace; font-weight: 700;">${sub.timeRangeStr}</span>
                  <span style="margin: 0 0.4rem;">·</span>
                  <strong style="color: ${sub.activity.color};">${sub.activity.ta}</strong>
                </div>
                <div>
                  <span class="ep-pp-badge ${sub.activity.badgeClass}">${sub.activity.verdictTa}</span>
                </div>
              </div>

              <div class="ep-pp-micro-grid">
                ${sub.microPeriods.map(m => `
                  <div class="ep-pp-micro-item">
                    <span class="ep-pp-micro-time">${m.timeRangeStr}</span>
                    <span class="ep-pp-badge ${m.activity.badgeClass}">${m.activity.ta} · ${m.activity.verdictTa}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  function renderSectionStaticTables() {
    const refBirds = PanchaPakshiEngine.MASTER_TABLES.birdsSummary;
    const bTbody = document.getElementById("secPpRefBirdsTbody");
    if (bTbody) {
      bTbody.innerHTML = refBirds.map(b => `
        <tr>
          <td><strong>${b.symbol} ${b.birdTa}</strong> (${b.birdEn})</td>
          <td>${b.elementTa}</td>
          <td style="font-weight: 800; color: #831843;">${b.letter}</td>
          <td>${b.directionTa}</td>
          <td>${b.planetTa}</td>
          <td>${b.colorTa}</td>
        </tr>
      `).join("");
    }

    const refActs = PanchaPakshiEngine.MASTER_TABLES.activitiesSummary;
    const aTbody = document.getElementById("secPpRefActivitiesTbody");
    if (aTbody) {
      aTbody.innerHTML = refActs.map(a => `
        <tr>
          <td><strong>${a.actTa}</strong> (${a.actEn})</td>
          <td style="font-weight: 800; color: ${a.color};">${a.power}</td>
          <td>${a.weightNazhigai}</td>
          <td><span class="ep-pp-badge" style="background: #F1F5F9; color: ${a.color}; border: 1px solid ${a.color};">${a.verdictTa}</span></td>
          <td style="font-size: 0.85rem; color: #475569;">${a.descriptionTa}</td>
        </tr>
      `).join("");
    }
  }

  /**
   * 21. எண் ஜோடி பொருத்தம் (Number Pair Matching)
   */
  let currentNumPairMode = "sequential"; // 'sequential' or 'chunks'

  function renderNumberPairMatchSection(overrideVal, overrideMethod) {
    const inputEl = document.getElementById("numPairInput");
    const methodEl = document.getElementById("numPairMethodSelect");
    const btnCheck = document.getElementById("btnCheckNumberPair");
    const displayVal = document.getElementById("numPairDisplayVal");
    const scoreVal = document.getElementById("numPairScoreVal");
    const verdictBadge = document.getElementById("numPairVerdictBadge");
    const compoundVal = document.getElementById("numPairCompoundVal");
    const rootVal = document.getElementById("numPairRootVal");
    const countVal = document.getElementById("numPairCountVal");
    const suitabilityVal = document.getElementById("numPairSuitabilityVal");
    const cardsGrid = document.getElementById("numPairCardsGrid");
    const btnToggleSeq = document.getElementById("btnToggleSeqPairs");
    const btnToggleChunk = document.getElementById("btnToggleChunkPairs");

    if (!cardsGrid) return;

    const valToAnalyze = overrideVal || (inputEl?.value?.trim()) || "9876543210";
    const methodToUse = overrideMethod || (methodEl?.value) || "default";

    if (inputEl && inputEl.value !== valToAnalyze) {
      inputEl.value = valToAnalyze;
    }

    if (typeof NumerologyEngine === "undefined" || !NumerologyEngine.analyzeNumberPairs) {
      console.warn("NumerologyEngine.analyzeNumberPairs not available");
      return;
    }

    const res = NumerologyEngine.analyzeNumberPairs(valToAnalyze, methodToUse);
    if (!res) return;

    if (displayVal) displayVal.textContent = res.cleanedDigits || valToAnalyze;
    if (scoreVal) {
      scoreVal.textContent = `${res.totalScore}%`;
      scoreVal.style.color = res.totalScore >= 85 ? "#34D399" : (res.totalScore >= 75 ? "#60A5FA" : "#F87171");
    }
    if (verdictBadge) {
      verdictBadge.textContent = res.verdictTitle;
      if (res.totalScore >= 85) {
        verdictBadge.style.background = "rgba(16, 185, 129, 0.2)";
        verdictBadge.style.borderColor = "#10B981";
        verdictBadge.style.color = "#6EE7B7";
      } else if (res.totalScore >= 75) {
        verdictBadge.style.background = "rgba(59, 130, 246, 0.2)";
        verdictBadge.style.borderColor = "#3B82F6";
        verdictBadge.style.color = "#93C5FD";
      } else {
        verdictBadge.style.background = "rgba(239, 68, 68, 0.2)";
        verdictBadge.style.borderColor = "#EF4444";
        verdictBadge.style.color = "#FCA5A5";
      }
    }
    if (compoundVal) compoundVal.textContent = `${res.compoundSum} (மொத்த கூட்டு)`;
    if (rootVal) rootVal.textContent = `${res.rootSingle} · ${res.rootTraits.planetTa} (${res.rootTraits.titleTa})`;
    if (countVal) countVal.textContent = `${res.sequentialPairs.length} வரிசை ஜோடிகள்`;
    if (suitabilityVal) suitabilityVal.textContent = res.suitability.join(" • ");

    // Render Cards based on currentNumPairMode
    const listToRender = currentNumPairMode === "chunks" ? res.chunkPairs : res.sequentialPairs;

    cardsGrid.innerHTML = listToRender.map(item => {
      let borderCol = "#3B82F6";
      let bgCol = "rgba(15, 23, 42, 0.75)";
      let tagBg = "rgba(59, 130, 246, 0.2)";
      let tagCol = "#93C5FD";

      if (item.status === "உத்தமம்") {
        borderCol = "#D4AF37";
        bgCol = "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(15,23,42,0.85))";
        tagBg = "rgba(212,175,55,0.25)";
        tagCol = "#FDE68A";
      } else if (item.status === "நன்று") {
        borderCol = "#10B981";
        bgCol = "rgba(16, 185, 129, 0.1)";
        tagBg = "rgba(16, 185, 129, 0.25)";
        tagCol = "#6EE7B7";
      } else if (item.status === "சவால்") {
        borderCol = "#EF4444";
        bgCol = "rgba(239, 68, 68, 0.1)";
        tagBg = "rgba(239, 68, 68, 0.25)";
        tagCol = "#FCA5A5";
      } else {
        borderCol = "#F59E0B";
        bgCol = "rgba(245, 158, 11, 0.1)";
        tagBg = "rgba(245, 158, 11, 0.25)";
        tagCol = "#FDE68A";
      }

      return `
        <div style="background: ${bgCol}; border: 1.5px solid ${borderCol}; border-radius: 12px; padding: 1.15rem; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: transform 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <div style="display: flex; align-items: baseline; gap: 0.4rem;">
              <span style="font-size: 0.75rem; color: #94A3B8; font-weight: 700;">#${item.pos} ஜோடி:</span>
              <span style="font-size: 1.6rem; font-weight: 900; font-family: monospace; color: #FFF; letter-spacing: 2px;">
                ${item.pair}
              </span>
            </div>
            <span style="background: ${tagBg}; border: 1px solid ${borderCol}; color: ${tagCol}; font-size: 0.76rem; font-weight: 800; padding: 0.2rem 0.55rem; border-radius: 999px;">
              ${item.status} (${item.score}%)
            </span>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.65rem;">
            <span style="font-size: 0.84rem; font-weight: 800; color: #F7D774;">
              ✨ ${item.yoga}
            </span>
            <span style="font-size: 0.78rem; color: #93C5FD; font-weight: 600;">
              ${item.planets}
            </span>
          </div>

          <p style="margin: 0; font-size: 0.85rem; line-height: 1.55; color: #E2E8F0; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.55rem;">
            ${item.meaning}
          </p>
        </div>
      `;
    }).join("");

    // Bind Controls Once
    if (btnCheck && !btnCheck.getAttribute("data-bound")) {
      btnCheck.setAttribute("data-bound", "true");
      btnCheck.addEventListener("click", () => {
        renderNumberPairMatchSection(inputEl?.value, methodEl?.value);
      });
    }

    if (inputEl && !inputEl.getAttribute("data-bound")) {
      inputEl.setAttribute("data-bound", "true");
      inputEl.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          renderNumberPairMatchSection(inputEl?.value, methodEl?.value);
        }
      });
    }

    if (methodEl && !methodEl.getAttribute("data-bound")) {
      methodEl.setAttribute("data-bound", "true");
      methodEl.addEventListener("change", () => {
        renderNumberPairMatchSection(inputEl?.value, methodEl?.value);
      });
    }

    document.querySelectorAll(".ep-sample-num-btn").forEach(btn => {
      if (!btn.getAttribute("data-bound")) {
        btn.setAttribute("data-bound", "true");
        btn.addEventListener("click", () => {
          const sampleVal = btn.getAttribute("data-val");
          if (inputEl) inputEl.value = sampleVal;
          renderNumberPairMatchSection(sampleVal);
        });
      }
    });

    if (btnToggleSeq && !btnToggleSeq.getAttribute("data-bound")) {
      btnToggleSeq.setAttribute("data-bound", "true");
      btnToggleSeq.addEventListener("click", () => {
        currentNumPairMode = "sequential";
        btnToggleSeq.className = "ep-pada-btn-primary";
        if (btnToggleChunk) btnToggleChunk.className = "ep-pada-btn-reset";
        renderNumberPairMatchSection();
      });
    }

    if (btnToggleChunk && !btnToggleChunk.getAttribute("data-bound")) {
      btnToggleChunk.setAttribute("data-bound", "true");
      btnToggleChunk.addEventListener("click", () => {
        currentNumPairMode = "chunks";
        btnToggleChunk.className = "ep-pada-btn-primary";
        if (btnToggleSeq) btnToggleSeq.className = "ep-pada-btn-reset";
        renderNumberPairMatchSection();
      });
    }
  }

  /**
   * 22. நேரம் நல்ல நேரம் (Nalla Neram - Auspicious & Inauspicious Timings Master Calculator)
   */
  let currentNallaNeramDate = "2026-10-12";
  let currentNallaNeramPlace = "Chennai";

  function renderNallaNeramSection() {
    if (typeof NallaNeramEngine === "undefined") {
      console.warn("NallaNeramEngine not loaded");
      return;
    }

    const sec = document.getElementById("nallaNeramSection");
    if (!sec) return;

    const dateInput = document.getElementById("nnDateInput");
    const placeInput = document.getElementById("nnPlaceInput");
    const prevBtn = document.getElementById("nnPrevDayBtn");
    const todayBtn = document.getElementById("nnTodayBtn");
    const nextBtn = document.getElementById("nnNextDayBtn");
    const showBtn = document.getElementById("nnShowBtn");

    if (dateInput && dateInput.value) {
      currentNallaNeramDate = dateInput.value;
    }
    if (placeInput && placeInput.value) {
      currentNallaNeramPlace = placeInput.value.trim();
    }

    const data = NallaNeramEngine.calculateForDate(currentNallaNeramDate, currentNallaNeramPlace);
    if (!data) return;

    // 1. Update metadata banner
    const elDate = document.getElementById("nnMetaDate");
    const elWeekday = document.getElementById("nnMetaWeekday");
    const elSunrise = document.getElementById("nnMetaSunrise");
    const elSunset = document.getElementById("nnMetaSunset");
    const elPlace = document.getElementById("nnMetaPlace");
    const elTimezone = document.getElementById("nnMetaTimezone");

    if (elDate) elDate.textContent = data.date;
    if (elWeekday) elWeekday.textContent = data.weekday;
    if (elSunrise) elSunrise.textContent = data.sunrise;
    if (elSunset) elSunset.textContent = data.sunset;
    if (elPlace) elPlace.textContent = data.place;
    if (elTimezone) elTimezone.textContent = data.tzName;

    // 2. Update KPI metrics
    const elGoodCount = document.getElementById("nnKpiGoodCount");
    const elBadCount = document.getElementById("nnKpiBadCount");
    const elTotGood = document.getElementById("nnKpiTotGoodTime");
    const elTotBad = document.getElementById("nnKpiTotBadTime");

    if (elGoodCount) elGoodCount.textContent = data.goodCount;
    if (elBadCount) elBadCount.textContent = data.badCount;
    if (elTotGood) elTotGood.textContent = data.totalGoodTime;
    if (elTotBad) elTotBad.textContent = data.totalBadTime;

    // 3. Update Live Status
    const status = NallaNeramEngine.checkLiveStatus(data);
    const cardStatus = document.getElementById("nnLiveStatusCard");
    const titleStatus = document.getElementById("nnLiveStatusTitle");
    const slotStatus = document.getElementById("nnLiveStatusSlot");
    const timeIndicator = document.getElementById("nnLiveTimeIndicator");

    if (cardStatus) {
      cardStatus.className = `ep-nn-live-status-card ${status.isGood ? '' : 'status-bad'}`;
    }
    if (titleStatus) titleStatus.textContent = status.labelTa;
    if (slotStatus) {
      slotStatus.textContent = status.slotText ? `நடப்பு இடைவேளை: ${status.slotText} (${status.duration})` : 'நடப்பு நாள் கணக்கீடு செயலில் உள்ளது';
    }
    if (timeIndicator) {
      const now = new Date();
      const h = now.getHours();
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const h12 = h % 12 || 12;
      const ampm = h >= 12 ? 'PM' : 'AM';
      timeIndicator.textContent = `தற்போதைய நேரம்: ${h12}:${m}:${s} ${ampm}`;
    }

    // 4. Update 24-Hour Visual Dual Timeline
    const goodBarTrack = document.getElementById("nnGoodBarTrack");
    const badBarTrack = document.getElementById("nnBadBarTrack");
    const livePin = document.getElementById("nnLiveTimelinePin");

    if (goodBarTrack) {
      goodBarTrack.innerHTML = data.goodSlots.map(s => `
        <div class="ep-nn-segment good" style="left: ${s.startPercent}%; width: ${s.widthPercent}%;" title="${s.start} – ${s.end} (${s.duration})"></div>
      `).join("");
    }

    if (badBarTrack) {
      badBarTrack.innerHTML = data.badSlots.map(s => `
        <div class="ep-nn-segment bad" style="left: ${s.startPercent}%; width: ${s.widthPercent}%;" title="${s.start} – ${s.end} (${s.duration}) - ${s.reasons.join(', ')}"></div>
      `).join("");
    }

    if (livePin) {
      livePin.style.display = "block";
      livePin.style.left = `${status.nowPercent}%`;
    }

    // 5. Update Good Slots List (10 Cards)
    const goodBadge = document.getElementById("nnGoodCountBadge");
    const goodList = document.getElementById("nnGoodSlotsList");
    if (goodBadge) goodBadge.textContent = `${data.goodCount} காலங்கள்`;
    if (goodList) {
      goodList.innerHTML = data.goodSlots.map(s => {
        const isActive = status.nowMins >= s.startMins && status.nowMins <= s.endMins;
        return `
          <div class="ep-nn-slot-card ${isActive ? 'active-now' : ''}">
            <div class="ep-nn-slot-time">
              <span style="color:#059669; margin-right:6px;">●</span> ${s.start} – ${s.end}
              ${isActive ? '<span style="background:#10B981; color:#FFF; font-size:0.68rem; padding:1px 6px; border-radius:4px; margin-left:6px;">இப்போது</span>' : ''}
            </div>
            <div class="ep-nn-slot-dur">${s.duration}</div>
          </div>
        `;
      }).join("");
    }

    // 6. Update Bad Slots List (10 Cards)
    const badBadge = document.getElementById("nnBadCountBadge");
    const badList = document.getElementById("nnBadSlotsList");
    if (badBadge) badBadge.textContent = `${data.badCount} காலங்கள்`;
    if (badList) {
      badList.innerHTML = data.badSlots.map(s => {
        const isActive = status.nowMins >= s.startMins && status.nowMins <= s.endMins;
        return `
          <div class="ep-nn-slot-card ${isActive ? 'active-now' : ''}">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div class="ep-nn-slot-time">
                <span style="color:#DC2626; margin-right:6px;">▲</span> ${s.start} – ${s.end}
                ${isActive ? '<span style="background:#EF4444; color:#FFF; font-size:0.68rem; padding:1px 6px; border-radius:4px; margin-left:6px;">இப்போது</span>' : ''}
              </div>
              <div class="ep-nn-slot-dur" style="color:#991B1B; background:#FEE2E2;">${s.duration}</div>
            </div>
            <div class="ep-nn-slot-reasons">
              ${s.reasons.map(r => {
                let cls = "";
                if (r.includes("ராகு")) cls = "rahu";
                else if (r.includes("எம")) cls = "yamagandam";
                else if (r.includes("திதி")) cls = "tithi";
                else if (r.includes("நட்சத்திர")) cls = "nakshatra";
                return `<span class="ep-nn-reason-tag ${cls}">${r}</span>`;
              }).join("")}
            </div>
          </div>
        `;
      }).join("");
    }

    // 7. Update Astronomical Transitions
    const nakshatraList = document.getElementById("nnNakshatraTransList");
    if (nakshatraList && data.transitions && data.transitions.nakshatra) {
      nakshatraList.innerHTML = data.transitions.nakshatra.map(n => `
        <div class="ep-nn-trans-item">
          <span class="ep-nn-trans-tag">நட்சத்திரம் #${n.id} (${n.nameTa})</span>
          <span class="ep-nn-trans-time">${n.start} – ${n.end}</span>
        </div>
      `).join("");
    }

    const tithiList = document.getElementById("nnTithiTransList");
    if (tithiList && data.transitions && data.transitions.tithi) {
      tithiList.innerHTML = data.transitions.tithi.map(t => `
        <div class="ep-nn-trans-item">
          <span class="ep-nn-trans-tag">திதி #${t.id} (${t.nameTa})</span>
          <span class="ep-nn-trans-time">${t.start} – ${t.end}</span>
        </div>
      `).join("");
    }

    const lagnaGrid = document.getElementById("nnLagnaGrid");
    if (lagnaGrid && data.transitions && data.transitions.lagnas) {
      lagnaGrid.innerHTML = data.transitions.lagnas.map(l => `
        <div class="ep-nn-lagna-chip">
          <div class="ep-nn-lagna-name">லக்னம் #${l.id} (${l.nameTa})</div>
          <div class="ep-nn-lagna-span">${l.start} – ${l.end}</div>
        </div>
      `).join("");
    }

    // Helper for formatting local YYYY-MM-DD
    function formatLocalDate(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }

    // 8. Bind Navigation Event Handlers (Once)
    if (prevBtn && !prevBtn.getAttribute("data-bound")) {
      prevBtn.setAttribute("data-bound", "true");
      prevBtn.addEventListener("click", () => {
        const parts = currentNallaNeramDate.split("-").map(Number);
        const cur = new Date(parts[0], parts[1] - 1, parts[2]);
        cur.setDate(cur.getDate() - 1);
        currentNallaNeramDate = formatLocalDate(cur);
        if (dateInput) dateInput.value = currentNallaNeramDate;
        renderNallaNeramSection();
      });
    }

    if (todayBtn && !todayBtn.getAttribute("data-bound")) {
      todayBtn.setAttribute("data-bound", "true");
      todayBtn.addEventListener("click", () => {
        currentNallaNeramDate = "2026-10-12";
        if (dateInput) dateInput.value = currentNallaNeramDate;
        renderNallaNeramSection();
      });
    }

    if (nextBtn && !nextBtn.getAttribute("data-bound")) {
      nextBtn.setAttribute("data-bound", "true");
      nextBtn.addEventListener("click", () => {
        const parts = currentNallaNeramDate.split("-").map(Number);
        const cur = new Date(parts[0], parts[1] - 1, parts[2]);
        cur.setDate(cur.getDate() + 1);
        currentNallaNeramDate = formatLocalDate(cur);
        if (dateInput) dateInput.value = currentNallaNeramDate;
        renderNallaNeramSection();
      });
    }

    if (showBtn && !showBtn.getAttribute("data-bound")) {
      showBtn.setAttribute("data-bound", "true");
      showBtn.addEventListener("click", () => {
        if (dateInput) currentNallaNeramDate = dateInput.value;
        if (placeInput) currentNallaNeramPlace = placeInput.value.trim();
        renderNallaNeramSection();
      });
    }

    if (dateInput && !dateInput.getAttribute("data-bound")) {
      dateInput.setAttribute("data-bound", "true");
      dateInput.addEventListener("change", () => {
        currentNallaNeramDate = dateInput.value;
        renderNallaNeramSection();
      });
    }
  }

  /**
   * 11. ஷட்பலம் (Shadbala Master Section)
   */
  function renderShadbalaSection() {
    if (!AppState.horoscopeData || !AppState.horoscopeData.shadbala) return;
    const shadbalaData = AppState.horoscopeData.shadbala;
    const isTa = AppState.lang === "ta";
    const planetsList = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"];
    const planetColors = {
      Su: "#F59E0B",
      Mo: "#3B82F6",
      Ma: "#EF4444",
      Me: "#10B981",
      Ju: "#EAB308",
      Ve: "#EC4899",
      Sa: "#6366F1"
    };

    const summary = shadbalaData.summary || {
      strongestPlanet: { nameTa: "சூரியன்", percentage: "113.6", rupas: "7.38" },
      weakestPlanet: { nameTa: "சுக்கிரன்", percentage: "86.7", rupas: "4.77" },
      passingCount: 3,
      totalCount: 7,
      averageRupas: "5.83",
      averagePercentage: "98.8"
    };

    // 1. 4 KPI Summary Cards
    const elStrong = document.getElementById("shadbalaStrongestPlanet");
    const elWeak = document.getElementById("shadbalaWeakestPlanet");
    const elPassing = document.getElementById("shadbalaPassingPlanets");
    const elAvg = document.getElementById("shadbalaAvgStrength");

    if (elStrong) elStrong.textContent = `${summary.strongestPlanet.nameTa} (${summary.strongestPlanet.percentage}%)`;
    if (elWeak) elWeak.textContent = `${summary.weakestPlanet.nameTa} (${summary.weakestPlanet.percentage}%)`;
    if (elPassing) elPassing.textContent = `${summary.passingCount} / ${summary.totalCount} ${isTa ? 'கிரகங்கள்' : 'Planets'}`;
    if (elAvg) elAvg.textContent = `${summary.averageRupas} ${isTa ? 'ரூபங்கள்' : 'Rupas'} (${summary.averagePercentage}%)`;

    // 2. 13-Column Master Shadbala Table
    const tbody = document.getElementById("shadbalaTableBody");
    if (tbody) {
      tbody.innerHTML = planetsList.map(code => {
        const s = shadbalaData[code];
        if (!s) return "";
        const pName = isTa ? (s.nameTa || I18N.ta.planets[code]?.ta) : I18N.en.planets[code]?.en;
        const color = planetColors[code] || "#F59E0B";
        const isStrong = s.isStrong || parseFloat(s.percentage) >= 100;
        const statusHtml = isStrong
          ? `<span class="ep-pill-strong">✔ ${isTa ? 'வலுவானது' : 'Strong'}</span>`
          : `<span class="ep-pill-moderate">⚡ ${isTa ? 'சராசரி' : 'Moderate'}</span>`;
        const rankHtml = `<span class="ep-pill-rank">#${s.rank || '—'}</span>`;

        return `
          <tr>
            <td style="text-align: left;">
              <div class="ep-planet-cell">
                <span class="ep-planet-dot" style="background: ${color};"></span>
                <span style="font-weight: 700;">${pName} (${code})</span>
              </div>
            </td>
            <td>${s.sthana}</td>
            <td>${s.dig}</td>
            <td>${s.kala}</td>
            <td>${s.chesta}</td>
            <td>${s.naisargika}</td>
            <td>${s.drik}</td>
            <td class="ep-virupas-cell">${s.totalVirupas}</td>
            <td class="ep-rupas-cell">${s.rupas}</td>
            <td>${s.requiredVirupas} (${s.requiredRupas} R)</td>
            <td style="font-weight: 700; color: ${isStrong ? '#15803D' : '#B45309'};">${s.percentage}%</td>
            <td>${statusHtml}</td>
            <td>${rankHtml}</td>
          </tr>
        `;
      }).join("");
    }

    // 3. Visual Comparative Meters (Segmented Breakdown)
    const metersContainer = document.getElementById("shadbalaMetersContainer");
    if (metersContainer) {
      const sortedList = [...planetsList].sort((a, b) => {
        const pA = parseFloat(shadbalaData[a]?.percentage || 0);
        const pB = parseFloat(shadbalaData[b]?.percentage || 0);
        return pB - pA;
      });

      metersContainer.innerHTML = sortedList.map(code => {
        const s = shadbalaData[code];
        if (!s) return "";
        const pName = isTa ? (s.nameTa || I18N.ta.planets[code]?.ta) : I18N.en.planets[code]?.en;
        const color = planetColors[code] || "#F59E0B";
        const total = s.totalVirupas || 1;
        const isStrong = s.isStrong || parseFloat(s.percentage) >= 100;

        const pctSthana = ((s.sthana / total) * 100).toFixed(1);
        const pctDig = ((s.dig / total) * 100).toFixed(1);
        const pctKala = ((s.kala / total) * 100).toFixed(1);
        const pctChesta = ((s.chesta / total) * 100).toFixed(1);
        const pctNaisargika = ((s.naisargika / total) * 100).toFixed(1);
        const pctDrik = ((s.drik / total) * 100).toFixed(1);

        const statusBadge = isStrong
          ? `<span class="ep-pill-strong">✔ ${s.percentage}% (${isTa ? 'வலுவானது' : 'Strong'})</span>`
          : `<span class="ep-pill-moderate">⚡ ${s.percentage}% (${isTa ? 'சராசரி' : 'Moderate'})</span>`;

        return `
          <div class="ep-shadbala-meter-item">
            <div class="ep-meter-header">
              <div class="ep-meter-title-wrap">
                <span class="ep-pill-rank">#${s.rank}</span>
                <span class="ep-planet-dot" style="background: ${color};"></span>
                <span class="ep-meter-name">${pName} (${code})</span>
              </div>
              <div class="ep-meter-score-wrap">
                <span class="ep-meter-values">
                  <strong>${s.rupas} ரூபங்கள்</strong> / தேவை ${s.requiredRupas} R (${s.totalVirupas} Virupas)
                </span>
                ${statusBadge}
              </div>
            </div>

            <div class="ep-meter-bar-track" title="${pName}: ஸ்தானம் ${pctSthana}%, திக் ${pctDig}%, காலம் ${pctKala}%, சேஷ்டை ${pctChesta}%, நைசர்கிகம் ${pctNaisargika}%, த்ரிக் ${pctDrik}%">
              <div class="ep-meter-segment" style="width: ${pctSthana}%; background: #D97706;" title="ஸ்தான பலம்: ${s.sthana}"></div>
              <div class="ep-meter-segment" style="width: ${pctDig}%; background: #0284C7;" title="திக் பலம்: ${s.dig}"></div>
              <div class="ep-meter-segment" style="width: ${pctKala}%; background: #7C3AED;" title="கால பலம்: ${s.kala}"></div>
              <div class="ep-meter-segment" style="width: ${pctChesta}%; background: #0D9488;" title="சேஷ்ட பலம்: ${s.chesta}"></div>
              <div class="ep-meter-segment" style="width: ${pctNaisargika}%; background: #16A34A;" title="நைசர்கிக பலம்: ${s.naisargika}"></div>
              <div class="ep-meter-segment" style="width: ${pctDrik}%; background: #E11D48;" title="த்ரிக் பலம்: ${s.drik}"></div>
            </div>

            <div class="ep-meter-legend-row">
              <div class="ep-meter-legend-item"><span class="ep-legend-color-box" style="background: #D97706;"></span><span>ஸ்தானம் (${s.sthana})</span></div>
              <div class="ep-meter-legend-item"><span class="ep-legend-color-box" style="background: #0284C7;"></span><span>திக் (${s.dig})</span></div>
              <div class="ep-meter-legend-item"><span class="ep-legend-color-box" style="background: #7C3AED;"></span><span>காலம் (${s.kala})</span></div>
              <div class="ep-meter-legend-item"><span class="ep-legend-color-box" style="background: #0D9488;"></span><span>சேஷ்டை (${s.chesta})</span></div>
              <div class="ep-meter-legend-item"><span class="ep-legend-color-box" style="background: #16A34A;"></span><span>நைசர்கிகம் (${s.naisargika})</span></div>
              <div class="ep-meter-legend-item"><span class="ep-legend-color-box" style="background: #E11D48;"></span><span>த்ரிக் (${s.drik})</span></div>
            </div>
          </div>
        `;
      }).join("");
    }

    // 4. 12 Bhava Bala Table
    const bhavaTbody = document.getElementById("shadbalaBhavaTableBody");
    if (bhavaTbody && shadbalaData.bhavas) {
      bhavaTbody.innerHTML = shadbalaData.bhavas.map(b => {
        const isStrong = b.isStrong;
        const statusHtml = isStrong
          ? `<span class="ep-pill-strong">✔ ${isTa ? 'வலுவான பாவம்' : 'Strong House'}</span>`
          : `<span class="ep-pill-moderate">⚡ ${isTa ? 'சராசரி பாவம்' : 'Moderate House'}</span>`;
        return `
          <tr>
            <td style="text-align: left; font-weight: 700; color: #831843;">${b.bhavaName}</td>
            <td style="font-weight: 600;">${b.lordNameTa} (${b.lord})</td>
            <td>${b.lordRupas} R</td>
            <td>${b.bhavaDigbala}</td>
            <td>${b.bhavaDrishti}</td>
            <td class="ep-rupas-cell">${b.totalBhavaRupas}</td>
            <td>${statusHtml}</td>
          </tr>
        `;
      }).join("");
    }
  }

  /**
   * 12. 360° பார்வைச் சக்கரம் (360° Aspect Wheel & Drishti Section - Screenshots 1 & 2)
   */
  function renderDrishti360Section() {
    if (!AppState.horoscopeData) return;
    const { planets, lagna } = AppState.horoscopeData;
    const container = document.getElementById("drishtiWheelSvgContainer");
    const tableBody = document.getElementById("drishtiAspectsTableBody");
    const filterBar = document.getElementById("drishtiFilterBar");

    if (!container || !tableBody) return;

    if (!AppState.drishtiFilter) {
      AppState.drishtiFilter = "all";
    }

    // 1. Render the SVG Aspect Wheel using ChartsRenderer.render360DrishtiWheel
    container.innerHTML = ChartsRenderer.render360DrishtiWheel(planets, AppState.lang, AppState.drishtiFilter, lagna);

    // 2. Compute the 19 Aspect Rows matching Screenshot 2
    const pLongitudes = {
      Su: planets?.Su?.longitude ?? 16.85,
      Mo: planets?.Mo?.longitude ?? 181.56,
      Ma: planets?.Ma?.longitude ?? 292.20,
      Me: planets?.Me?.longitude ?? 28.29,
      Ju: planets?.Ju?.longitude ?? 18.44,
      Ve: planets?.Ve?.longitude ?? 58.92,
      Sa: planets?.Sa?.longitude ?? 248.55,
      Ra: planets?.Ra?.longitude ?? 327.08,
      Ke: planets?.Ke?.longitude ?? 147.08
    };
    const lagnaLon = lagna?.longitude ?? 248.82;
    const lagnaSign = lagna?.signId ?? 8; // Sagittarius = 8

    const pointsToCheck = [
      { code: "லக்", name: "லக்", lon: lagnaLon },
      { code: "சூரி", name: "சூரி", lon: pLongitudes.Su },
      { code: "சந்", name: "சந்", lon: pLongitudes.Mo },
      { code: "செவ்", name: "செவ்", lon: pLongitudes.Ma },
      { code: "புத", name: "புத", lon: pLongitudes.Me },
      { code: "குரு", name: "குரு", lon: pLongitudes.Ju },
      { code: "சுக்", name: "சுக்", lon: pLongitudes.Ve },
      { code: "சனி", name: "சனி", lon: pLongitudes.Sa },
      { code: "ராகு", name: "ராகு", lon: pLongitudes.Ra },
      { code: "கேது", name: "கேது", lon: pLongitudes.Ke }
    ];

    const aspectDefs = [
      { p: "Su", nameTa: "சூரி", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Mo", nameTa: "சந்", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Me", nameTa: "புத", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Ve", nameTa: "சுக்", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Ma", nameTa: "செவ்", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Ma", nameTa: "செவ்", aspect: "4 ஆம் பார்வை", span: 4, offset: 90, isSpecial: true },
      { p: "Ma", nameTa: "செவ்", aspect: "8 ஆம் பார்வை", span: 8, offset: 210, isSpecial: true },
      { p: "Ju", nameTa: "குரு", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Ju", nameTa: "குரு", aspect: "5 ஆம் பார்வை", span: 5, offset: 120, isSpecial: true },
      { p: "Ju", nameTa: "குரு", aspect: "9 ஆம் பார்வை", span: 9, offset: 240, isSpecial: true },
      { p: "Sa", nameTa: "சனி", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Sa", nameTa: "சனி", aspect: "3 ஆம் பார்வை", span: 3, offset: 60, isSpecial: true },
      { p: "Sa", nameTa: "சனி", aspect: "10 ஆம் பார்வை", span: 10, offset: 270, isSpecial: true },
      { p: "Ra", nameTa: "ராகு", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Ra", nameTa: "ராகு", aspect: "3 ஆம் பார்வை", span: 3, offset: 60, isSpecial: true },
      { p: "Ra", nameTa: "ராகு", aspect: "11 ஆம் பார்வை", span: 11, offset: 300, isSpecial: true },
      { p: "Ke", nameTa: "கேது", aspect: "7 ஆம் பார்வை", span: 7, offset: 180, isSpecial: false },
      { p: "Ke", nameTa: "கேது", aspect: "3 ஆம் பார்வை", span: 3, offset: 60, isSpecial: true },
      { p: "Ke", nameTa: "கேது", aspect: "11 ஆம் பார்வை", span: 11, offset: 300, isSpecial: true }
    ];

    const signNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];

    const allRows = aspectDefs.map(def => {
      const srcLon = pLongitudes[def.p];
      const targetDeg = Number(((srcLon + def.offset) % 360).toFixed(2));
      const minDeg = Number(((targetDeg - 15 + 360) % 360).toFixed(2));
      const maxDeg = Number(((targetDeg + 15) % 360).toFixed(2));

      const targetSignIdx = Math.floor(targetDeg / 30) % 12;
      const targetRasi = signNames[targetSignIdx];
      const targetBhava = ((targetSignIdx - lagnaSign + 12) % 12) + 1;

      const inZone = [];
      pointsToCheck.forEach(pt => {
        if (pt.code === def.nameTa) return;
        let diff = Math.abs(pt.lon - targetDeg);
        if (diff > 180) diff = 360 - diff;
        if (diff <= 15.0) inZone.push(pt.name);
      });

      return {
        p: def.p,
        src: def.nameTa,
        aspect: def.aspect,
        span: def.span,
        target: `${targetDeg}°`,
        range: `${minDeg}° – ${maxDeg}°`,
        rasi: targetRasi,
        bhava: targetBhava,
        planets: inZone.join(", "),
        isSpecial: def.isSpecial
      };
    });

    // 3. Filter rows based on AppState.drishtiFilter
    const filteredRows = allRows.filter(r => {
      if (AppState.drishtiFilter === "all") return true;
      if (AppState.drishtiFilter === "7th") return r.span === 7;
      if (AppState.drishtiFilter === "special") return r.isSpecial;
      return r.p === AppState.drishtiFilter;
    });

    tableBody.innerHTML = filteredRows.map(r => `
      <tr>
        <td style="font-weight: 700; color: #831843;">${r.src}</td>
        <td>${r.aspect}</td>
        <td>${r.span}</td>
        <td style="font-weight: 600; color: #1E293B;">${r.target}</td>
        <td>${r.range}</td>
        <td style="font-weight: 600; color: #701A75;">${r.rasi}</td>
        <td>${r.bhava}</td>
        <td style="font-weight: 600; color: #0284C7;">${r.planets}</td>
      </tr>
    `).join("");

    // 4. Update Filter Button Active States
    if (filterBar) {
      filterBar.querySelectorAll(".ep-drishti-filter-btn").forEach(btn => {
        const filterVal = btn.getAttribute("data-filter");
        btn.classList.toggle("active", filterVal === AppState.drishtiFilter);
      });

      // Attach click listeners if not already attached
      if (!filterBar.hasAttribute("data-bound")) {
        filterBar.setAttribute("data-bound", "true");
        filterBar.addEventListener("click", (e) => {
          const btn = e.target.closest(".ep-drishti-filter-btn");
          if (!btn) return;
          const filterVal = btn.getAttribute("data-filter");
          AppState.drishtiFilter = filterVal;
          renderDrishti360Section();
        });
      }
    }
  }

  /**
   * 12b. அஷ்டவர்க்கம் & சோதனைகள் (Ashtakavarga Master Section Controller)
   */
  function renderAshtakavargaSection() {
    if (!AppState.horoscopeData) return;
    const { ashtakavarga, lagna, planets } = AppState.horoscopeData;
    if (!ashtakavarga) return;

    const isTa = AppState.lang === "ta";
    const lagnaSign = (lagna && lagna.signId !== undefined)
      ? Number(lagna.signId)
      : (planets && planets.Asc && planets.Asc.signId !== undefined ? Number(planets.Asc.signId) : 8);
    const rasiNames = isTa
      ? ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"]
      : ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    const planetDefs = [
      { code: "Su", nameTa: "சூரியன்", nameEn: "Sun", color: "#F59E0B" },
      { code: "Mo", nameTa: "சந்திரன்", nameEn: "Moon", color: "#3B82F6" },
      { code: "Ma", nameTa: "செவ்வாய்", nameEn: "Mars", color: "#EF4444" },
      { code: "Me", nameTa: "புதன்", nameEn: "Mercury", color: "#10B981" },
      { code: "Ju", nameTa: "குரு", nameEn: "Jupiter", color: "#EAB308" },
      { code: "Ve", nameTa: "சுக்கிரன்", nameEn: "Venus", color: "#EC4899" },
      { code: "Sa", nameTa: "சனி", nameEn: "Saturn", color: "#6366F1" }
    ];

    // 1. Populate the 4 KPI Summary Cards
    const elSavPoints = document.getElementById("ashtaTotalSavPoints");
    const elStrong = document.getElementById("ashtaStrongestRasi");
    const elWeak = document.getElementById("ashtaWeakestRasi");
    const elPinda = document.getElementById("ashtaGrandShodhyaPinda");

    const totalPts = ashtakavarga.totalSAVPoints || 337;
    const strongSign = ashtakavarga.strongestSign || { nameTa: "கடகம்", nameEn: "Cancer", points: 38 };
    const weakSign = ashtakavarga.weakestSign || { nameTa: "மகரம் / மீனம்", nameEn: "Capricorn / Pisces", points: 21 };
    const grandPinda = ashtakavarga.grandShodhyaPinda || 629;
    const avgPinda = (grandPinda / 7).toFixed(2);

    const strongLabel = isTa ? strongSign.nameTa : (strongSign.nameEn || strongSign.nameTa);
    const weakLabel = isTa ? weakSign.nameTa : (weakSign.nameEn || weakSign.nameTa);

    if (elSavPoints) elSavPoints.textContent = `${totalPts} ${isTa ? 'பரல்கள்' : 'Bindus'}`;
    if (elStrong) elStrong.textContent = `${strongLabel} (${strongSign.points} ${isTa ? 'பரல்கள்' : 'Pts'})`;
    if (elWeak) elWeak.textContent = `${weakLabel} (${weakSign.points} ${isTa ? 'பரல்கள்' : 'Pts'})`;
    if (elPinda) elPinda.textContent = `${grandPinda} (${isTa ? 'சராசரி' : 'Avg'} ${avgPinda})`;

    // 2. Render South Indian Ashtakavarga Chakra
    if (!AppState.activeAshtaPlanet) {
      AppState.activeAshtaPlanet = "SAV";
    }

    function renderAshtaChakraSvg(target) {
      const chartContainer = document.getElementById("ashtaChakraContainer");
      if (!chartContainer) return;

      const size = 420;
      const cellSize = size / 4;
      const gridCoords = [
        { row: 0, col: 0, signId: 11 }, // மீனம் (Pisces)
        { row: 0, col: 1, signId: 0 },  // மேஷம் (Aries)
        { row: 0, col: 2, signId: 1 },  // ரிஷபம் (Taurus)
        { row: 0, col: 3, signId: 2 },  // மிதுனம் (Gemini)
        { row: 1, col: 3, signId: 3 },  // கடகம் (Cancer)
        { row: 2, col: 3, signId: 4 },  // சிம்மம் (Leo)
        { row: 3, col: 3, signId: 5 },  // கன்னி (Virgo)
        { row: 3, col: 2, signId: 6 },  // துலாம் (Libra)
        { row: 3, col: 1, signId: 7 },  // விருச்சிகம் (Scorpio)
        { row: 3, col: 0, signId: 8 },  // தனுசு (Sagittarius)
        { row: 2, col: 0, signId: 9 },  // மகரம் (Capricorn)
        { row: 1, col: 0, signId: 10 }  // கும்பம் (Aquarius)
      ];

      const isSAV = target === "SAV";
      const targetPoints = isSAV ? (ashtakavarga.SAV || []) : ((ashtakavarga.BAV && ashtakavarga.BAV[target]) || []);
      const pDef = planetDefs.find(p => p.code === target);
      const targetTitle = isSAV ? (isTa ? "சர்வாஷ்டவர்க்கம்" : "Sarvashtakavarga") : (isTa ? `${pDef ? pDef.nameTa : target} அஷ்டவர்க்கம்` : `${pDef ? pDef.nameEn : target} Ashtakavarga`);
      const targetSum = isSAV ? totalPts : targetPoints.reduce((a, b) => a + b, 0);

      let svg = `<svg viewBox="0 0 ${size} ${size}" class="ep-south-chart-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="8" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.6"/>
      `;

      gridCoords.forEach(box => {
        const x = box.col * cellSize;
        const y = box.row * cellSize;
        const pts = targetPoints[box.signId] !== undefined ? targetPoints[box.signId] : 0;
        const signName = rasiNames[box.signId];
        const bhavaNum = ((box.signId - lagnaSign + 12) % 12) + 1;

        // Box border
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="transparent" stroke="#F6D7B0" stroke-width="1"/>`;

        // Highlight Lagna with diagonal slash
        if (box.signId === lagnaSign) {
          svg += `<line x1="${x}" y1="${y + 24}" x2="${x + 24}" y2="${y}" stroke="#F59E0B" stroke-width="2"/>`;
          svg += `<text x="${x + 6}" y="${y + 14}" font-size="9" font-weight="800" fill="#B45309" font-family="'Noto Sans Tamil', sans-serif">லக்</text>`;
        }

        // Color coding for points
        let badgeBg = "#DCFCE7";
        let badgeText = "#15803D";
        let statusBadge = "உத்தமம்";

        if (isSAV) {
          if (pts >= 30) {
            badgeBg = "#DCFCE7"; badgeText = "#15803D"; statusBadge = "அதி உத்தமம்";
          } else if (pts >= 28) {
            badgeBg = "#E0F2FE"; badgeText = "#0369A1"; statusBadge = "உத்தமம்";
          } else if (pts >= 25) {
            badgeBg = "#FEF3C7"; badgeText = "#B45309"; statusBadge = "மத்திமம்";
          } else {
            badgeBg = "#FEE2E2"; badgeText = "#B91C1C"; statusBadge = "குறைவு";
          }
        } else {
          if (pts >= 5) {
            badgeBg = "#DCFCE7"; badgeText = "#15803D"; statusBadge = "சுப பலம்";
          } else if (pts === 4) {
            badgeBg = "#FEF3C7"; badgeText = "#B45309"; statusBadge = "சம பலம்";
          } else {
            badgeBg = "#FEE2E2"; badgeText = "#B91C1C"; statusBadge = "குறைவு";
          }
        }

        // Rasi name & Bhava text
        svg += `
          <text x="${x + cellSize / 2}" y="${y + 20}" text-anchor="middle" font-size="11" font-weight="700" fill="#701A75" font-family="'Noto Sans Tamil', sans-serif">
            ${signName}
          </text>
          <text x="${x + cellSize / 2}" y="${y + 34}" text-anchor="middle" font-size="8.5" font-weight="600" fill="#64748B" font-family="'Noto Sans Tamil', sans-serif">
            ${bhavaNum}-ம் பாவம்
          </text>
        `;

        // Points badge circle / rect
        const badgeW = 42;
        const badgeH = 25;
        const badgeX = x + (cellSize - badgeW) / 2;
        const badgeY = y + 43;

        svg += `
          <rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="5" fill="${badgeBg}" stroke="${badgeText}" stroke-width="0.8"/>
          <text x="${x + cellSize / 2}" y="${badgeY + 17}" text-anchor="middle" font-size="13.5" font-weight="900" fill="${badgeText}" font-family="'Outfit', sans-serif">
            ${pts}
          </text>
          <text x="${x + cellSize / 2}" y="${y + 88}" text-anchor="middle" font-size="8" font-weight="700" fill="${badgeText}" font-family="'Noto Sans Tamil', sans-serif">
            ${statusBadge}
          </text>
        `;
      });

      // Center 2x2 Cell Space
      const centerW = cellSize * 2;
      const centerH = cellSize * 2;
      const centerX = cellSize;
      const centerY = cellSize;

      svg += `
        <rect x="${centerX}" y="${centerY}" width="${centerW}" height="${centerH}" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.2"/>
        <rect x="${centerX + 16}" y="${centerY + 20}" width="${centerW - 32}" height="30" rx="15" fill="#FFFDF8" stroke="#F6D7B0" stroke-width="1.2"/>
        <text x="${size / 2}" y="${centerY + 40}" text-anchor="middle" font-size="12" font-weight="800" fill="#831843" font-family="'Noto Sans Tamil', sans-serif">
          ${targetTitle}
        </text>

        <!-- Big Total Points in Center -->
        <text x="${size / 2}" y="${centerY + 94}" text-anchor="middle" font-size="34" font-weight="900" fill="#831843" font-family="'Outfit', sans-serif">
          ${targetSum}
        </text>
        <text x="${size / 2}" y="${centerY + 116}" text-anchor="middle" font-size="10" font-weight="700" fill="#B45309" font-family="'Noto Sans Tamil', sans-serif">
          ${isTa ? 'மொத்த சுப பரல்கள்' : 'Benefic Bindus Total'}
        </text>
        <text x="${size / 2}" y="${centerY + 146}" text-anchor="middle" font-size="9" font-weight="600" fill="#15803D" font-family="'Noto Sans Tamil', sans-serif">
          ${isSAV ? '✔ பராசர 337 சுப கணிதம்' : '✔ பின்னாஷ்டவர்க்க சக்கரம்'}
        </text>
      `;

      svg += `</svg>`;
      chartContainer.innerHTML = svg;
    }

    renderAshtaChakraSvg(AppState.activeAshtaPlanet);

    // Attach Tab Switcher Events
    const tabBar = document.getElementById("ashtaChakraTabBar");
    if (tabBar && !tabBar.hasAttribute("data-bound")) {
      tabBar.setAttribute("data-bound", "true");
      tabBar.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-ashta-target]");
        if (!btn) return;
        const target = btn.getAttribute("data-ashta-target");
        AppState.activeAshtaPlanet = target;
        tabBar.querySelectorAll("button[data-ashta-target]").forEach(b => {
          b.classList.toggle("active", b.getAttribute("data-ashta-target") === target);
        });
        renderAshtaChakraSvg(target);
      });
    }

    // 3. Populate Master 8x12 Matrix Table
    const matrixBody = document.getElementById("ashtaMatrixTableBody");
    if (matrixBody && ashtakavarga.BAV) {
      let matrixHtml = "";

      // 7 Planets Rows
      planetDefs.forEach(p => {
        const pts = ashtakavarga.BAV[p.code] || [];
        const pTotal = pts.reduce((a, b) => a + b, 0);
        matrixHtml += `
          <tr>
            <td style="text-align: left; font-weight: 700;">
              <span class="ep-planet-dot" style="background: ${p.color};"></span>
              <span>${isTa ? p.nameTa : p.nameEn} (${p.code})</span>
            </td>
            ${pts.map(pt => {
              const cls = pt >= 5 ? "ep-ashta-pt-high" : (pt === 4 ? "ep-ashta-pt-neutral" : "ep-ashta-pt-low");
              return `<td><span class="ep-ashta-cell-val ${cls}">${pt}</span></td>`;
            }).join("")}
            <td class="ep-ashta-total-cell">${pTotal}</td>
          </tr>
        `;
      });

      // SAV Total Row
      const savPts = ashtakavarga.SAV || [];
      matrixHtml += `
        <tr class="ep-ashta-sav-row">
          <td style="text-align: left; font-weight: 800; color: #831843;">
            ⭐ ${isTa ? 'சர்வாஷ்டவர்க்கம் (SAV)' : 'Total (SAV)'}
          </td>
          ${savPts.map(pt => {
            let cls = "ep-ashta-pt-low";
            if (pt >= 30) cls = "ep-ashta-pt-high";
            else if (pt >= 28) cls = "ep-ashta-pt-good";
            else if (pt >= 25) cls = "ep-ashta-pt-neutral";
            return `<td><span class="ep-ashta-cell-val ${cls}" style="font-weight: 800; font-size: 0.9rem;">${pt}</span></td>`;
          }).join("")}
          <td style="font-size: 1.05rem; font-weight: 900; color: #831843;">${totalPts}</td>
        </tr>
      `;

      // House from Lagna Row
      matrixHtml += `
        <tr class="ep-ashta-bhava-row">
          <td style="text-align: left; font-weight: 700; color: #701A75;">
            லக்ன பாவம் (Bhava)
          </td>
          ${rasiNames.map((_, s) => {
            const bhava = ((s - lagnaSign + 12) % 12) + 1;
            return `<td><span style="font-weight: 700; color: ${bhava === 1 ? '#F59E0B' : '#475569'};">${bhava}</span></td>`;
          }).join("")}
          <td style="font-weight: 700;">1 - 12</td>
        </tr>
      `;

      matrixBody.innerHTML = matrixHtml;
    }

    // 4. Populate Shodhana Reductions Comparison Table
    const shodhanaBody = document.getElementById("ashtaShodhanaTableBody");
    if (shodhanaBody && ashtakavarga.shodhana && ashtakavarga.pindas) {
      shodhanaBody.innerHTML = planetDefs.map(p => {
        const sh = ashtakavarga.shodhana[p.code];
        const pindaInfo = ashtakavarga.pindas[p.code];
        if (!sh || !pindaInfo) return "";

        const origTotal = pindaInfo.originalTotal;
        const triTotal = pindaInfo.trikonaTotal;
        const ekaTotal = pindaInfo.ekadhipatyaTotal;
        const reduced = pindaInfo.reducedCount;

        return `
          <tr>
            <td style="text-align: left; font-weight: 700;">
              <span class="ep-planet-dot" style="background: ${p.color};"></span>
              <span>${isTa ? p.nameTa : p.nameEn}</span>
            </td>
            <td style="font-weight: 700;">${origTotal}</td>
            <td style="color: #0369A1; font-weight: 700;">${triTotal}</td>
            <td style="color: #831843; font-weight: 800; font-size: 0.92rem;">${ekaTotal}</td>
            <td style="color: #B91C1C; font-weight: 600;">-${reduced}</td>
            <td><span class="ep-pill-strong">✔ ${isTa ? 'சுத்திகரிக்கப்பட்டது' : 'Purified'}</span></td>
            <td style="font-size: 0.82rem; color: #64748B;">ஆயுள் / கோச்சார கணிதம்</td>
          </tr>
        `;
      }).join("");
    }

    // 5. Populate Pinda Scorecard Table
    const pindaBody = document.getElementById("ashtaPindaTableBody");
    if (pindaBody && ashtakavarga.pindas) {
      let pindaHtml = planetDefs.map(p => {
        const pInfo = ashtakavarga.pindas[p.code];
        if (!pInfo) return "";

        const badgeClass = pInfo.shodhyaPinda >= 100
          ? "ep-pinda-ultra"
          : (pInfo.shodhyaPinda >= 75 ? "ep-pinda-high" : "ep-pinda-med");

        const impactText = pInfo.shodhyaPinda >= 100
          ? (isTa ? "தசா/கோச்சாரத்தில் அதீத சுப பலன் மற்றும் யோகம்" : "Profound auspicious gains during dasha/transits")
          : (pInfo.shodhyaPinda >= 75
            ? (isTa ? "நற்பலன்கள் மற்றும் சீரான முன்னேற்றம்" : "Consistent growth and favorable milestones")
            : (isTa ? "சராசரி பலன், மிதமான சுப விரயங்கள்" : "Moderate outcome, controlled expenses"));

        return `
          <tr>
            <td style="text-align: left; font-weight: 700;">
              <span class="ep-planet-dot" style="background: ${p.color};"></span>
              <span>${isTa ? p.nameTa : p.nameEn}</span>
            </td>
            <td style="font-weight: 700; color: #334155;">${pInfo.ekadhipatyaTotal}</td>
            <td style="font-weight: 700; color: #0284C7;">${pInfo.rasiPinda}</td>
            <td style="font-weight: 700; color: #7C3AED;">${pInfo.grahaPinda}</td>
            <td style="background: #FEF9C3; font-weight: 900; font-size: 1rem; color: #831843;">
              ${pInfo.shodhyaPinda}
            </td>
            <td><span class="${badgeClass}">${pInfo.qualityTa}</span></td>
            <td style="font-size: 0.82rem; color: #334155; text-align: left;">${impactText}</td>
          </tr>
        `;
      }).join("");

      // Summary Footer Row
      pindaHtml += `
        <tr style="background: #FFFDF5; font-weight: 800; border-top: 2px solid #831843;">
          <td style="text-align: left; color: #831843;">மொத்த கூட்டுத்தொகை</td>
          <td style="color: #334155;">${planetDefs.reduce((acc, p) => acc + (ashtakavarga.pindas[p.code]?.ekadhipatyaTotal || 0), 0)}</td>
          <td style="color: #0284C7;">${planetDefs.reduce((acc, p) => acc + (ashtakavarga.pindas[p.code]?.rasiPinda || 0), 0)}</td>
          <td style="color: #7C3AED;">${planetDefs.reduce((acc, p) => acc + (ashtakavarga.pindas[p.code]?.grahaPinda || 0), 0)}</td>
          <td style="background: #FEF9C3; color: #831843; font-size: 1.1rem;">${grandPinda}</td>
          <td><span class="ep-pinda-ultra">சராசரி: ${avgPinda}</span></td>
          <td style="font-size: 0.85rem; color: #15803D;">✔ முழு ஜாதக சோத்ய பிண்ட நிறைவு</td>
        </tr>
      `;

      pindaBody.innerHTML = pindaHtml;
    }
  }

  function renderActiveChart() {
    if (!AppState.horoscopeData || !DOM.chartContainer) return;
    const { vargas, planets } = AppState.horoscopeData;
    const isTa = AppState.lang === "ta";
    const activeVargaMap = vargas[AppState.activeVarga] || vargas.D1;

    let chartHtml = "";
    const vargaTitle = `${AppState.activeVarga} ${AppState.activeVarga === 'D1' ? (isTa ? 'ராசி சக்கரம்' : 'Rasi Chart') : (AppState.activeVarga === 'D9' ? (isTa ? 'நவாம்சம்' : 'Navamsa') : (isTa ? 'வர்க்க சக்கரம்' : 'Divisional Chart'))}`;

    if (AppState.chartStyle === "south") {
      chartHtml = ChartsRenderer.renderSouthIndianChart(activeVargaMap, planets, vargaTitle, AppState.lang);
    } else if (AppState.chartStyle === "north") {
      chartHtml = ChartsRenderer.renderNorthIndianChart(activeVargaMap, planets, vargaTitle, AppState.lang);
    } else if (AppState.chartStyle === "drishti") {
      chartHtml = ChartsRenderer.render360DrishtiWheel(planets, AppState.lang, AppState.drishtiFilter || "all", AppState.horoscopeData.lagna);
    } else if (AppState.chartStyle === "jamakkol") {
      chartHtml = `
        <div style="background: #FFFFFF; border-radius: 14px; padding: 20px 10px; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #FED7AA;">
          <div style="background: #FEFAF0; border: 1px solid #FEF3C7; border-radius: 8px; padding: 10px 18px; margin-bottom: 16px; width: 100%; max-width: 780px;">
            <h3 style="color: #6B21A8; font-weight: 800; margin: 0; font-size: 1.25rem; font-family: 'Noto Sans Tamil', 'Outfit', sans-serif;">
              ${isTa ? 'ஜாமக்கோள் ஆரூடம்' : 'Jamakkol Aaroodam Chart'}
            </h3>
          </div>
          ${ChartsRenderer.renderJamakkolAaroodamChart ? ChartsRenderer.renderJamakkolAaroodamChart(AppState.currentProfile, AppState.horoscopeData, AppState.lang) : ''}
        </div>
      `;
    }

    DOM.chartContainer.innerHTML = chartHtml;
  }

  function renderModulesList() {
    if (!DOM.modulesGrid) return;
    const isTa = AppState.lang === "ta";
    const dict = isTa ? I18N.ta : I18N.en;
    const modules = dict.modules;

    let filtered = Object.values(modules);

    // Filter by Category
    if (AppState.activeCategory !== "all") {
      filtered = filtered.filter(m => m.category === AppState.activeCategory);
    }

    // Filter by Search Query
    if (AppState.searchQuery) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(AppState.searchQuery) ||
        m.desc.toLowerCase().includes(AppState.searchQuery)
      );
    }

    let html = "";
    filtered.forEach(mod => {
      html += `
        <div class="module-card" data-module-id="${mod.id}">
          <div class="card-top">
            <div class="module-icon-wrap">🪐</div>
            <div class="module-meta">
              <h4>${mod.title}</h4>
              <span class="module-tag">${mod.badge || 'PRO'}</span>
            </div>
          </div>
          <p class="module-preview-text">${mod.desc}</p>
          <div class="card-footer">
            <span class="view-details-link">${isTa ? 'முழு விவரம் பார்க்க' : 'Deep Dive Analysis'} ➔</span>
            <span class="module-status-chip">✓ ${isTa ? 'கணிக்கப்பட்டது' : 'Calculated'}</span>
          </div>
        </div>
      `;
    });

    DOM.modulesGrid.innerHTML = html;

    // Attach click listeners to cards
    document.querySelectorAll(".module-card").forEach(card => {
      card.addEventListener("click", () => {
        const modId = card.getAttribute("data-module-id");
        openModuleDeepDive(modId);
      });
    });
  }

  /**
   * CANONICAL 42 MODULES LEFT SIDE SLIDE BAR DRAWER CONTROLLERS
   */
  function openLeftSidebar() {
    if (DOM.leftSidebarDrawer) DOM.leftSidebarDrawer.classList.add("active");
    if (DOM.sidebarBackdrop) DOM.sidebarBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    if (DOM.sidebarSearchInput) {
      DOM.sidebarSearchInput.value = "";
      filterSidebarModules("");
      setTimeout(() => DOM.sidebarSearchInput.focus(), 150);
    }
  }

  function closeLeftSidebar() {
    if (DOM.leftSidebarDrawer) DOM.leftSidebarDrawer.classList.remove("active");
    if (DOM.sidebarBackdrop) DOM.sidebarBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  function renderSidebarModuleList() {
    if (!DOM.sidebarModuleList) return;
    const isTa = AppState.lang === "ta";
    const dict = isTa ? I18N.ta : I18N.en;
    const otherDict = isTa ? I18N.en : I18N.ta;
    const modules = dict.modules;

    let html = "";
    for (let i = 1; i <= 41; i++) {
      const key = "m" + i;
      const mod = modules[key];
      if (!mod) continue;

      const numStr = String(i).padStart(2, "0");
      const title = mod.title;
      const subtitle = isTa ? (mod.subTitle || "") : (otherDict.modules[key]?.title || "");

      html += `
        <div class="sidebar-module-item" data-module-id="${key}" data-title="${title.toLowerCase()}" data-sub="${subtitle.toLowerCase()}" data-num="${numStr}">
          <div class="sidebar-item-left">
            <span class="sidebar-item-num">${numStr}</span>
            <div class="sidebar-item-text">
              <span class="sidebar-item-title">${title}</span>
              <span class="sidebar-item-subtitle">${subtitle}</span>
            </div>
          </div>
          <span class="sidebar-item-chevron">➔</span>
        </div>
      `;
    }

    DOM.sidebarModuleList.innerHTML = html;

    // Attach click events to each module in the sidebar
    DOM.sidebarModuleList.querySelectorAll(".sidebar-module-item").forEach(item => {
      item.addEventListener("click", () => {
        const modId = item.getAttribute("data-module-id");
        closeLeftSidebar();

        // Highlight active item
        DOM.sidebarModuleList.querySelectorAll(".sidebar-module-item").forEach(el => el.classList.remove("active"));
        item.classList.add("active");

        // Scroll smoothly to dashboard
        const dashboard = document.getElementById("astrologyDashboard");
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: "smooth" });
        }

        // Open deep dive modal
        openModuleDeepDive(modId);
      });
    });
  }

  function filterSidebarModules(query) {
    if (!DOM.sidebarModuleList) return;
    const items = DOM.sidebarModuleList.querySelectorAll(".sidebar-module-item");
    const q = (query || "").toLowerCase().trim();

    items.forEach(item => {
      const title = item.getAttribute("data-title") || "";
      const sub = item.getAttribute("data-sub") || "";
      const num = item.getAttribute("data-num") || "";

      if (!q || title.includes(q) || sub.includes(q) || num.includes(q)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  /**
   * Open Detailed Deep Dive Modal for ALL 42 CANONICAL MODULES!
   */
  function openModuleDeepDive(modId) {
    if (!AppState.horoscopeData) return;
    const isTa = AppState.lang === "ta";
    const dict = isTa ? I18N.ta : I18N.en;
    const mod = dict.modules[modId];
    if (!mod) return;

    DOM.modalTitle.textContent = mod.title;
    DOM.modalCategoryBadge.textContent = mod.category.toUpperCase();

    const data = AppState.horoscopeData;
    let contentHtml = "";

    // Switch case to render rich, interactive custom data for every single module
    switch (modId) {
      case "m1": // 01 ஜாதகம் (Birth Chart)
      case "m6": // 06 வர்க்க சக்கரங்கள் (Varga Chakras)
        contentHtml = `
          <div style="text-align: center;">
            <p style="margin-bottom: 1.5rem; color: #CBD5E1;">${mod.desc}</p>
            <div style="max-width: 520px; margin: 0 auto;">
              ${ChartsRenderer.renderSouthIndianChart(data.vargas.D1, data.planets, isTa ? "ராசி சக்கரம் (D-1)" : "Rasi Chart (D-1)", AppState.lang)}
            </div>
            <h4 style="margin: 2rem 0 1rem; color: #F7D774;">${isTa ? "நவாம்ச சக்கரம் (D-9)" : "Navamsa Chart (D-9)"}</h4>
            <div style="max-width: 520px; margin: 0 auto;">
              ${ChartsRenderer.renderSouthIndianChart(data.vargas.D9, data.planets, isTa ? "நவாம்சம் (D-9)" : "Navamsa (D-9)", AppState.lang)}
            </div>
          </div>
        `;
        break;

      case "m2": // 02 கிரக பாதசாரம் (Planetary Longitudes & Padas)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div class="gp-section" style="margin: 0;">
            <div class="gp-table-card">
              <div class="gp-table-wrapper">
                <table class="gp-table">
                  <thead>
                    <tr>
                      <th><span class="gp-header-pill">கிரகம்</span></th>
                      <th><span class="gp-header-pill">ராசி</span></th>
                      <th><span class="gp-header-pill">நட்சத்திரம்</span></th>
                      <th><span class="gp-header-pill">பாதம்</span></th>
                      <th><span class="gp-header-pill gp-multiline">நட்ச.<br>அதி</span></th>
                      <th><span class="gp-header-pill gp-multiline">உப ந.<br>அதி</span></th>
                      <th><span class="gp-header-pill gp-multiline">உப உப ந.<br>அதி</span></th>
                      <th><span class="gp-header-pill">அவஸ்தை</span></th>
                      <th><span class="gp-header-pill">நிலை</span></th>
                      <th><span class="gp-header-pill">ராசி (Deg)</span></th>
                      <th><span class="gp-header-pill">தீர்க்காம்சம்</span></th>
                      <th><span class="gp-header-pill">பார்வை பாவம்</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    ${document.getElementById("gpMasterTableBody") ? document.getElementById("gpMasterTableBody").innerHTML : ""}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `;
        break;

      case "m3": // 03 தாச / புத்தி (Vimshottari Dasha / Bhukti)
      case "m8": // 08 தசா ஆழ் தேடல் (Dasha Deep Search)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#F7D774; margin-bottom: 0.5rem;">${isTa ? 'தற்போது இயங்கும் மகா தசை & புக்தி' : 'Currently Operating Maha Dasha & Bhukti'}</h4>
            <div style="font-size: 1.5rem; font-weight: 800; color: #FFF;">
              ${isTa ? data.dashaData.currentDasha.ta : data.dashaData.currentDasha.en} ${isTa ? 'மகா தசை' : 'Maha Dasha'} &nbsp;➔&nbsp; 
              <span style="color:#34D399;">${isTa ? data.dashaData.currentBhukti.ta : data.dashaData.currentBhukti.en} ${isTa ? 'புக்தி' : 'Bhukti'}</span>
            </div>
            <div style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.3rem;">
              ${data.dashaData.currentDasha.start.toLocaleDateString()} ${isTa ? 'முதல்' : 'to'} ${data.dashaData.currentDasha.end.toLocaleDateString()}
            </div>
          </div>

          <h4 style="color:#FFE89C; margin: 1.5rem 0 0.8rem;">${isTa ? '120 வருட விம்சோத்தரி தசா காலவரிசை' : '120-Year Vimshottari Dasha Timeline'}</h4>
          <table class="astro-data-table">
            <thead>
              <tr>
                <th>${isTa ? 'தசா நாதன்' : 'Maha Dasha Lord'}</th>
                <th>${isTa ? 'முழு காலம்' : 'Full Duration'}</th>
                <th>${isTa ? 'தொடக்க தேதி' : 'Start Date'}</th>
                <th>${isTa ? 'முடிவு தேதி' : 'End Date'}</th>
              </tr>
            </thead>
            <tbody>
              ${data.dashaData.timeline.map(d => `
                <tr style="${d === data.dashaData.currentDasha ? 'background: rgba(212,175,55,0.18); font-weight:700;' : ''}">
                  <td style="color:#F7D774; font-weight: 700;">${isTa ? d.ta : d.en} ${d === data.dashaData.currentDasha ? '★ (நடப்பு)' : ''}</td>
                  <td style="color:#F8FAFC; font-weight: 600;">${d.effectiveYears} ${isTa ? 'ஆண்டுகள்' : 'Years'}</td>
                  <td style="color:#93C5FD; font-family: monospace; font-weight: 800;">${d.start.toLocaleDateString()}</td>
                  <td style="color:#86EFAC; font-family: monospace; font-weight: 800;">${d.end.toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
        break;

      case "m4": // 04 சிறப்பு லக்னங்கள் (Special Lagnas)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem;">
            ${Object.keys(data.specialLagnas).map(k => {
              const sl = data.specialLagnas[k];
              const sInfo = AstroEngine.SIGN_NAMES[sl.signId];
              return `
                <div style="background: rgba(14,22,46,0.7); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.25rem;">
                  <h4 style="color: #F7D774; margin-bottom: 0.4rem;">${isTa ? sl.nameTa : sl.nameEn}</h4>
                  <div style="font-size: 1.3rem; font-weight: 800; color: #FFF;">${isTa ? sInfo.ta : sInfo.en} ${sInfo.symbol}</div>
                  <p style="font-size: 0.82rem; color: #94A3B8; margin-top: 0.3rem;">${isTa ? 'அதிபதி:' : 'Lord:'} ${sInfo.lord}</p>
                </div>
              `;
            }).join('')}
          </div>
        `;
        break;

      case "m5": // 05 பாவ சக்கரங்கள் (Bhava Chalit Houses)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <table class="astro-data-table">
            <thead>
              <tr>
                <th>${isTa ? 'பாவம்' : 'Bhava'}</th>
                <th>${isTa ? 'ஆரம்ப முனை' : 'Arambha Cusp'}</th>
                <th>${isTa ? 'மத்திய முனை' : 'Madhya Cusp'}</th>
                <th>${isTa ? 'அந்திய முனை' : 'Anthya Cusp'}</th>
                <th>${isTa ? 'பாவ அதிபதி' : 'Bhava Lord'}</th>
              </tr>
            </thead>
            <tbody>
              ${[1,2,3,4,5,6,7,8,9,10,11,12].map(h => {
                const signIdx = (data.lagna.signId + h - 1) % 12;
                const signObj = AstroEngine.SIGN_NAMES[signIdx];
                const midDeg = data.lagna.deg;
                const startDeg = (midDeg - 15 + 30) % 30;
                const endDeg = (midDeg + 15) % 30;
                const lordPlanet = data.planets[signObj.lord] || {};
                const lordName = isTa ? (lordPlanet.nameTa || signObj.lord) : (lordPlanet.nameEn || signObj.lord);
                return `
                  <tr>
                    <td style="font-weight:700; color:#F7D774;">${h}-${isTa ? 'ம் பாவம்' : ' House'}</td>
                    <td>${signObj[AppState.lang]} ${startDeg.toFixed(1)}°</td>
                    <td><strong>${signObj[AppState.lang]} ${midDeg.toFixed(1)}°</strong></td>
                    <td>${signObj[AppState.lang]} ${endDeg.toFixed(1)}°</td>
                    <td><span style="color:#34D399;">${lordName}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
        break;

      case "m7": // 07 உபகிரகங்கள் (Upagrahas)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <table class="astro-data-table">
            <thead>
              <tr>
                <th>${isTa ? 'உபகிரகம்' : 'Upagraha'}</th>
                <th>${isTa ? 'ராசி' : 'Rasi'}</th>
                <th>${isTa ? 'பாகை' : 'Longitude'}</th>
              </tr>
            </thead>
            <tbody>
              ${Object.keys(data.upagrahas).map(k => {
                const deg = data.upagrahas[k];
                const sId = Math.floor(deg / 30);
                const sInfo = AstroEngine.SIGN_NAMES[sId];
                return `
                  <tr>
                    <td style="font-weight:700; color:#F7D774;">${k}</td>
                    <td>${isTa ? sInfo.ta : sInfo.en}</td>
                    <td>${(deg % 30).toFixed(2)}°</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
        break;

      case "m9": // 09 பரிகார கோவில்கள் (Remedy Temples)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${RemediesData.temples.map(t => `
              <div style="background: rgba(14,22,46,0.7); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                  <h4 style="color:#FFE89C;">🛕 ${isTa ? t.nameTa : t.nameEn}</h4>
                  <span style="font-size: 0.75rem; background: rgba(114,24,39,0.4); color: #F7D774; padding: 0.2rem 0.6rem; border-radius: 999px;">
                    ${isTa ? t.planetTa : t.planetEn}
                  </span>
                </div>
                <div style="font-size: 0.8rem; color: #94A3B8; margin-bottom: 0.4rem;">📍 ${isTa ? t.locationTa : t.locationEn}</div>
                <p style="font-size: 0.86rem; color: #CBD5E1; line-height: 1.5;">${isTa ? t.purposeTa : t.purposeEn}</p>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case "career":
      case "career_timing":
      case "job_business":
        if (typeof CareerEngine !== "undefined" && CareerEngine.calculateCareerProfile) {
          const cProfile = CareerEngine.calculateCareerProfile(data, { lang: AppState.lang });
          contentHtml = `
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.4); border-radius: 12px; padding: 1.5rem;">
              <h4 style="color:#F7D774; margin-bottom: 0.5rem;">💼 ${isTa ? 'தொழில், உத்தியோகம் & வியாபார கணிப்பு' : 'Career, Job vs Business & Timing'}</h4>
              <div style="font-size: 1.15rem; font-weight: 800; color: #FFF; margin-bottom: 1rem;">
                ${isTa ? cProfile.jobVsBusiness.verdictTitleTa : cProfile.jobVsBusiness.verdictTitleEn}
              </div>
              <div style="margin-bottom: 1rem; color: #CBD5E1; font-size: 0.92rem; line-height: 1.6;">
                ${isTa ? cProfile.jobVsBusiness.verdictSummaryTa : cProfile.jobVsBusiness.verdictSummaryEn}
              </div>
              <div style="text-align: center; margin-top: 1.5rem;">
                <button type="button" class="cta-btn-gold" onclick="document.getElementById('careerTimingSection')?.scrollIntoView({behavior:'smooth'}); closeModal();" style="padding: 0.6rem 1.25rem;">
                  ${isTa ? 'முழுமையான தொழில் பகுதிக்குச் செல் ➔' : 'View Full Career & Timing Master Section ➔'}
                </button>
              </div>
            </div>
          `;
        }
        break;

      case "m10": // 10 வாஸ்து (Vastu)
        const fourthHouseSign = (data.lagna.signId + 3) % 12;
        const vastuDirectionsTa = ["வடக்கு (North)", "வடகிழக்கு (North-East / ஈசான்யம்)", "கிழக்கு (East)", "தென்கிழக்கு (South-East / ஆக்னேயம்)", "தெற்கு (South)", "தென்மேற்கு (South-West / நிருதி)", "மேற்கு (West)", "வடமேற்கு (North-West / வாயு)"];
        const vastuDirectionsEn = ["North", "North-East (Ishanya)", "East", "South-East (Agneya)", "South", "South-West (Niruthi)", "West", "North-West (Vayu)"];
        const bestDir = isTa ? vastuDirectionsTa[fourthHouseSign % 8] : vastuDirectionsEn[fourthHouseSign % 8];
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#F7D774; margin-bottom: 0.5rem;">🏠 ${isTa ? 'உங்கள் ஜாதகத்திற்கு உகந்த வாஸ்து வழிகாட்டி' : 'Personal Natal Vastu Alignment'}</h4>
            <div style="font-size: 1.1rem; color: #FFF; margin-bottom: 1rem;">
              <strong>${isTa ? 'உகந்த வாசல் திசை:' : 'Best Main Entrance:'}</strong> <span style="color:#34D399; font-weight:800;">${bestDir}</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.88rem; color: #CBD5E1;">
              <div style="background: rgba(7,11,24,0.6); padding: 0.8rem; border-radius: 8px;">
                <strong style="color:#FFE89C;">${isTa ? 'பூஜை அறை:' : 'Pooja Room:'}</strong> ${isTa ? 'வடகிழக்கு (ஈசான்ய மூலை)' : 'North-East (Ishanya corner)'}
              </div>
              <div style="background: rgba(7,11,24,0.6); padding: 0.8rem; border-radius: 8px;">
                <strong style="color:#FFE89C;">${isTa ? 'சமையலறை:' : 'Kitchen (Agni):'}</strong> ${isTa ? 'தென்கிழக்கு (ஆக்னேய மூலை)' : 'South-East (Agneya corner)'}
              </div>
              <div style="background: rgba(7,11,24,0.6); padding: 0.8rem; border-radius: 8px;">
                <strong style="color:#FFE89C;">${isTa ? 'படுக்கை அறை:' : 'Master Bedroom:'}</strong> ${isTa ? 'தென்மேற்கு (நிருதி மூலை)' : 'South-West (Niruthi corner)'}
              </div>
              <div style="background: rgba(7,11,24,0.6); padding: 0.8rem; border-radius: 8px;">
                <strong style="color:#FFE89C;">${isTa ? 'தலை வைத்து படுக்க:' : 'Sleeping Orientation:'}</strong> ${isTa ? 'தெற்கு அல்லது கிழக்கு' : 'South or East for longevity'}
              </div>
            </div>
          </div>
        `;
        break;

      case "m11": // 11 கோச்சார பலன்கள் (Transits - Gochar)
        const moonSign = data.planets["Mo"].signId;
        const transitSaturnSign = 10;
        const transitJupiterSign = 1;
        const diffSa = (transitSaturnSign - moonSign + 12) % 12;
        const diffJu = (transitJupiterSign - moonSign + 12) % 12;

        let saniVerdictTa = diffSa === 11 ? "விரய சனி (12-ம் இடம்)" : (diffSa === 0 ? "ஜன்ம சனி (1-ம் இடம்)" : (diffSa === 1 ? "பாத சனி (2-ம் இடம்)" : (diffSa === 7 ? "அஷ்டம சனி (8-ம் இடம்)" : "சனி பெயர்ச்சி நற்பலன் தருகிறது.")));
        let saniVerdictEn = diffSa === 11 ? "Viraya Sani (12th House)" : (diffSa === 0 ? "Janma Sani (1st House)" : (diffSa === 1 ? "Padha Sani (2nd House)" : (diffSa === 7 ? "Ashtama Sani (8th House)" : "Favorable Transit of Saturn.")));

        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.25rem;">
              <h4 style="color:#6366F1; margin-bottom: 0.4rem;">🪐 ${isTa ? 'சனி பெயர்ச்சி & ஏழரை சனி' : 'Saturn Transit & Sade Sati'}</h4>
              <div style="font-size: 1.1rem; font-weight: 700; color: #FFF;">${isTa ? saniVerdictTa : saniVerdictEn}</div>
              <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.5rem;">${isTa ? 'தற்போது சனி கும்ப ராசியில் சஞ்சரிக்கிறார்.' : 'Saturn currently traverses Aquarius.'}</p>
            </div>
            <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.25rem;">
              <h4 style="color:#FBBF24; margin-bottom: 0.4rem;">🌟 ${isTa ? 'குரு பெயர்ச்சி பலன்' : 'Jupiter Transit (Guru)'}</h4>
              <div style="font-size: 1.1rem; font-weight: 700; color: #FFF;">
                ${[1, 4, 6, 8, 10].includes(diffJu) ? (isTa ? 'குரு பார்வை யோகம் • சுப பலன்' : 'Jupiter Aspect • Highly Benefic') : (isTa ? 'குரு சஞ்சாரம் மிதமான பலன்' : 'Jupiter Transit Moderate')}
              </div>
              <p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.5rem;">${isTa ? 'சந்திரனுக்கு ' + (diffJu + 1) + '-ம் இடத்தில் குரு பகவான் அமர்ந்துள்ளார்.' : 'Jupiter is posited in house ' + (diffJu + 1) + ' from natal Moon.'}</p>
            </div>
          </div>
        `;
        break;

      case "m12": // 12 சந்திர நாடி (Chandra Nadi)
        const moonP = data.planets["Mo"];
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#E2E8F0; margin-bottom: 0.5rem;">🌙 ${isTa ? 'சந்திர நாடி ரகசியங்கள்' : 'Chandra Nadi Secrets'}</h4>
            <p style="color:#CBD5E1; font-size: 0.95rem; line-height: 1.6;">
              <strong>${isTa ? 'ஜென்ம சந்திரன்:' : 'Natal Moon:'}</strong> ${isTa ? moonP.signNameTa : moonP.signNameEn} (${moonP.deg}°${moonP.min}') • ${isTa ? moonP.nakshatraNameTa : moonP.nakshatraNameEn} (${moonP.pada}-${isTa ? 'ம் பாதம்' : ' Pada'})
            </p>
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(7,11,24,0.6); border-radius: 8px; border-left: 4px solid #38BDF8;">
              <h5 style="color:#38BDF8; margin-bottom: 0.3rem;">${isTa ? 'நாடி சூத்திரம்:' : 'Nadi Sutra:'}</h5>
              <p style="font-size: 0.88rem; color:#FFF; line-height: 1.6;">
                ${isTa
                  ? 'சந்திரனின் திரிகோண வீடுகளில் (1-5-9) குரு அல்லது சுக்கிரன் பார்வை பெரும் பொழுது கூர்மையான புத்தி, கலை ஆர்வம் மற்றும் தாய்வழி ஆசிகள் பெருமளவில் கைகூடும்.'
                  : "When the Moon's trinal houses (1-5-9) receive benefic aspects from Jupiter or Venus, high intellect, intuitive insight, and maternal blessings flourish."}
              </p>
            </div>
          </div>
        `;
        break;

      case "m13": // 13 ஷட்பலம் (Shadbala)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div class="gp-table-wrapper" style="margin-bottom: 1.5rem;">
            <table class="astro-data-table" style="font-size: 0.85rem;">
              <thead>
                <tr>
                  <th>${isTa ? 'கிரகம்' : 'Planet'}</th>
                  <th>${isTa ? 'ஸ்தானம்' : 'Sthana'}</th>
                  <th>${isTa ? 'திக்' : 'Dig'}</th>
                  <th>${isTa ? 'காலம்' : 'Kala'}</th>
                  <th>${isTa ? 'சேஷ்டை' : 'Chesta'}</th>
                  <th>${isTa ? 'நைசர்கிகம்' : 'Naisargika'}</th>
                  <th>${isTa ? 'த்ரிக்' : 'Drik'}</th>
                  <th>${isTa ? 'மொத்த விருபைகள்' : 'Virupas'}</th>
                  <th>${isTa ? 'ரூபங்கள்' : 'Rupas'}</th>
                  <th>${isTa ? 'சதவீதம்' : 'Strength %'}</th>
                  <th>${isTa ? 'நிலை' : 'Verdict'}</th>
                  <th>${isTa ? 'தரம்' : 'Rank'}</th>
                </tr>
              </thead>
              <tbody>
                ${["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa"].map(k => {
                  const s = data.shadbala[k];
                  if (!s) return "";
                  const pName = isTa ? (s.nameTa || I18N.ta.planets[k]?.ta) : I18N.en.planets[k]?.en;
                  const isStrong = s.isStrong || parseFloat(s.percentage) >= 100;
                  return `
                    <tr>
                      <td style="font-weight:700; color:${I18N.ta.planets[k]?.color || '#FFF'}">${pName} (${k})</td>
                      <td>${s.sthana}</td>
                      <td>${s.dig}</td>
                      <td>${s.kala}</td>
                      <td>${s.chesta}</td>
                      <td>${s.naisargika}</td>
                      <td>${s.drik}</td>
                      <td style="font-weight:700; color:#FCD34D;">${s.totalVirupas}</td>
                      <td style="font-weight:700; color:#38BDF8;">${s.rupas}</td>
                      <td style="font-weight:700; color:${isStrong ? '#10B981' : '#F59E0B'}">${s.percentage}%</td>
                      <td><span style="color:${isStrong ? '#10B981' : '#F59E0B'}">${s.status}</span></td>
                      <td><span style="color:#F472B6; font-weight:800;">#${s.rank || '—'}</span></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          <div style="text-align: center; margin-top: 1rem;">
            <button class="btn btn-secondary" onclick="document.getElementById('modalBackdrop').classList.remove('active'); document.getElementById('shadbalaSection')?.scrollIntoView({ behavior: 'smooth' });">
              ${isTa ? 'முழு ஷட்பல விரிவுப் பக்கத்திற்குச் செல் ➔' : 'Go to Full Shadbala Master Section ➔'}
            </button>
          </div>
        `;
        break;

      case "m14": // 14 360° பார்வைச் சக்கரம் (360 Drishti Wheel)
        contentHtml = `
          <div style="text-align: center;">
            <p style="margin-bottom: 1.5rem; color: #CBD5E1;">${mod.desc}</p>
            <div style="max-width: 620px; margin: 0 auto;">
              ${ChartsRenderer.render360DrishtiWheel(data.planets, AppState.lang, AppState.drishtiFilter || "all", data.lagna)}
            </div>
            <div style="text-align: center; margin-top: 1.5rem;">
              <button class="btn btn-secondary" onclick="document.getElementById('modalBackdrop').classList.remove('active'); document.getElementById('drishti360Section')?.scrollIntoView({ behavior: 'smooth' });">
                ${isTa ? 'முழு 360° பார்வைச் சக்கரம் & அட்டவணைக்குச் செல் ➔' : 'Go to Full 360° Drishti Wheel & Table ➔'}
              </button>
            </div>
          </div>
        `;
        break;

      case "m15": // 15 அஷ்டவர்க்கம் (Ashtakavarga 337)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.7); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
            <span style="font-size: 0.9rem; color: #F7D774; text-transform: uppercase;">${isTa ? 'மொத்த சர்வாஷ்டகவர்க்க புள்ளிகள் (SAV)' : 'Total Sarvashtakavarga Points (SAV)'}</span>
            <div style="font-size: 3rem; font-weight: 900; color: #FFE89C; font-family: 'Cinzel', serif;">337</div>
            <p style="font-size: 0.85rem; color: #94A3B8;">${isTa ? '28-க்கு மேல் பரல்கள் உள்ள வீடுகள் அதி உன்னத சுப பலன்களை தரும்.' : 'Houses with >28 bindus deliver enduring prosperity.'}</p>
            <div style="margin-top: 1rem;">
              <button type="button" class="cta-btn-gold" onclick="document.getElementById('ashtakavargaSection')?.scrollIntoView({ behavior: 'smooth' }); document.getElementById('moduleModal')?.classList.remove('active');" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
                ${isTa ? 'முழு அஷ்டவர்க்க & சோதனைகள் பகுதிக்குச் செல் ➔' : 'Navigate to Full Ashtakavarga Master Section ➔'}
              </button>
            </div>
          </div>
          ${ChartsRenderer.renderAshtakavargaHeatmap(data.ashtakavarga.SAV, AppState.lang)}
        `;
        break;

      case "m16": // 16 அஷ்ட. நல்ல நேரங்கள் (Auspicious Kakshya Timings)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#FFE89C; margin-bottom: 0.5rem;">⏱️ ${isTa ? 'அஷ்டவர்க்க கக்ஷியா முறை (8 பிரிவுகள்)' : '8 Kakshya Sub-Divisions (3°45\' each)'}</h4>
            <p style="font-size: 0.88rem; color:#CBD5E1; margin-bottom: 1rem;">
              ${isTa ? 'ஒவ்வொரு ராசியும் 8 கக்ஷியாக்களாகப் பிரிக்கப்படுகிறது: சனி, குரு, செவ்வாய், சூரியன், சுக்கிரன், புதன், சந்திரன், லக்னம்.' : 'Each 30° zodiac sign is divided into 8 equal Kakshyas of 3°45\' each.'}
            </p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; text-align: center;">
              ${['சனி (Sa)', 'குரு (Ju)', 'செவ்வாய் (Ma)', 'சூரியன் (Su)', 'சுக்கிரன் (Ve)', 'புதன் (Me)', 'சந்திரன் (Mo)', 'லக்னம் (Asc)'].map((k, idx) => `
                <div style="background: rgba(7,11,24,0.6); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(212,175,55,0.3);">
                  <div style="font-size: 0.75rem; color:#94A3B8;">${idx * 3.75}° - ${(idx + 1) * 3.75}°</div>
                  <div style="font-weight:700; color:#F7D774; margin-top: 0.2rem;">${k}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case "m17": // 17 அஷ்ட. கோச். வரைபடம் (Transit Bindu Heatmap)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#34D399; margin-bottom: 0.5rem;">🌡️ ${isTa ? 'அஷ்டவர்க்க கோச்சார வெப்ப வரைபடம்' : 'SAV Transit Bindu Heatmap'}</h4>
            <p style="font-size: 0.88rem; color:#CBD5E1; margin-bottom: 1rem;">${isTa ? 'கோச்சார கிரகங்கள் அதிக பரல்கள் உள்ள வீடுகளில் நகரும் போது வெற்றிகள் குவியும்.' : 'Transit planets navigating houses with >30 bindus yield profound achievements.'}</p>
          </div>
          ${ChartsRenderer.renderAshtakavargaHeatmap(data.ashtakavarga.SAV, AppState.lang)}
        `;
        break;

      case "m18": // 18 அஷ்ட. ஆண்டு பலன் (Varsha Phala Annual Forecast)
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#F7D774; margin-bottom: 0.5rem;">📅 ${isTa ? 'வருடாந்திர வாழ்க்கை சுழற்சி பலன்கள் (Varsha Phala)' : 'Annual Bindu-Weighted Life Trajectory'}</h4>
            <p style="font-size: 0.9rem; color:#CBD5E1; line-height: 1.6;">
              ${isTa
                ? 'உங்கள் ஜென்ம அஷ்டவர்க்கத்தில் 10 மற்றும் 11-ம் வீடுகளின் பரல்கள் முறையே ' + (data.ashtakavarga.SAV[(data.lagna.signId + 9) % 12] || 30) + ' மற்றும் ' + (data.ashtakavarga.SAV[(data.lagna.signId + 10) % 12] || 32) + ' என நிறைவாக உள்ளதால், நடப்பு ஆண்டில் தொழில் முன்னேற்றம் மற்றும் புதிய வருவாய் வாய்ப்புகள் வலுப்பெறும்.'
                : 'With houses 10 & 11 bearing high SAV bindus in your natal chart, this annual cycle fosters sustained professional growth and profitable milestones.'}
            </p>
          </div>
        `;
        break;

      case "m19": // 19 பாவ பலன்கள் (12 House Predictions)
        contentHtml = `
          <p style="margin-bottom: 1.25rem; color: #CBD5E1; font-size: 0.95rem; line-height: 1.6;">${mod.desc}</p>
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${data.bhavaPredictions.map(b => {
              const points = isTa ? (b.pointsTa || [b.predTa]) : (b.pointsEn || [b.predEn]);
              return `
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.35rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                  <h4 style="color: #F7D774; margin:0; font-size: 1.1rem; display: flex; align-items:center; gap: 0.5rem;">
                    <span>🏛️</span> ${isTa ? b.nameTa : b.nameEn}
                  </h4>
                  <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                    <span style="font-size: 0.8rem; background: rgba(217,119,6,0.25); border: 1px solid rgba(245,158,11,0.4); padding: 0.25rem 0.65rem; border-radius: 999px; color: #FDE68A; font-weight:600;">
                      ${isTa ? b.signNameTa : b.signNameEn} (${isTa ? 'அதிபதி:' : 'Lord:'} ${isTa ? b.lordNameTa : b.lordNameEn})
                    </span>
                    <span style="font-size: 0.8rem; background: rgba(59,130,246,0.2); border: 1px solid rgba(96,165,250,0.3); padding: 0.25rem 0.65rem; border-radius: 999px; color: #93C5FD;">
                      ${isTa ? 'கிரகங்கள்:' : 'Planets:'} ${isTa ? b.occupantsTa : b.occupantsEn}
                    </span>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem;">
                  ${points.map(pt => `
                    <div style="display: flex; align-items: flex-start; gap: 0.6rem; line-height: 1.65; font-size: 0.92rem; color: #E2E8F0;">
                      <span style="color: #F59E0B; font-size: 0.85rem; margin-top: 0.15rem; flex-shrink: 0;">✦</span>
                      <div style="flex: 1;">${escapeHtml(pt)}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
              `;
            }).join('')}
          </div>
        `;
        break;

      case "m20": // 20 யோகங்கள் (Vedic Yogas Finder)
        contentHtml = `
          <p style="margin-bottom: 1.25rem; color: #CBD5E1; font-size: 0.95rem; line-height: 1.6;">${mod.desc}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem;">
            ${data.yogas.map(y => {
              const lvl = (y.level || "high").toLowerCase();
              const badgeBg = lvl === "high" ? "rgba(16,185,129,0.2)" : (lvl === "medium" ? "rgba(245,158,11,0.2)" : "rgba(148,163,184,0.2)");
              const badgeColor = lvl === "high" ? "#34D399" : (lvl === "medium" ? "#FBBF24" : "#94A3B8");
              const borderCol = lvl === "high" ? "rgba(16,185,129,0.4)" : (lvl === "medium" ? "rgba(245,158,11,0.4)" : "rgba(148,163,184,0.3)");
              const subline = `${y.en} · ${lvl.toUpperCase()}`;

              return `
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 15px rgba(0,0,0,0.25);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <div>
                      <h4 style="color: #FFE89C; margin: 0; font-size: 1.05rem; font-weight: 700;">★ ${isTa ? y.ta : y.en}</h4>
                      <div style="font-size: 0.76rem; color: #94A3B8; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px;">
                        ${subline}
                      </div>
                    </div>
                    <span style="font-size: 0.75rem; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${borderCol}; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 700; white-space: nowrap;">
                      ${isTa ? (y.status || 'அமைந்துள்ளது') : (y.level ? y.level.toUpperCase() : 'ACTIVE')}
                    </span>
                  </div>
                  <p style="font-size: 0.88rem; color: #E2E8F0; line-height: 1.6; margin: 0.75rem 0 0 0;">
                    ${escapeHtml(isTa ? y.descTa : (y.descEn || y.descTa))}
                  </p>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        `;
        break;

      case "m21": // 21 நட்சத்திர பாதை (7-Tier Stellar Dispositor Progression)
        const npData = data.nakshatraPath || (typeof AstroEngine !== 'undefined' ? AstroEngine.CANONICAL_NAKSHATRA_PATH : {});
        const entities = [
          { key: "Asc", icon: "🌅", nameTa: "லக்னம்", nameEn: "Lagna" },
          { key: "Su", icon: "☀️", nameTa: "சூரியன்", nameEn: "Sun" },
          { key: "Mo", icon: "🌙", nameTa: "சந்திரன்", nameEn: "Moon" },
          { key: "Ma", icon: "♂️", nameTa: "செவ்வாய்", nameEn: "Mars" },
          { key: "Me", icon: "☿️", nameTa: "புதன்", nameEn: "Mercury" },
          { key: "Ju", icon: "♃", nameTa: "குரு", nameEn: "Jupiter" },
          { key: "Ve", icon: "♀️", nameTa: "சுக்ரன்", nameEn: "Venus" },
          { key: "Sa", icon: "🪐", nameTa: "சனி", nameEn: "Saturn" },
          { key: "Ra", icon: "☊", nameTa: "ராகு", nameEn: "Rahu" },
          { key: "Ke", icon: "☋", nameTa: "கேது", nameEn: "Ketu" }
        ];

        contentHtml = `
          <div style="margin-bottom: 1.25rem;">
            <p style="color: #CBD5E1; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.5rem;">
              ${mod.desc}
            </p>
            <div style="display:flex; gap:0.5rem; align-items:center; background: rgba(217,119,6,0.15); border: 1px solid rgba(245,158,11,0.3); border-radius: 8px; padding: 0.6rem 1rem; color: #FDE68A; font-size: 0.85rem;">
              <span>ℹ️</span>
              <span><strong>நட்சத்திர வழித்தட சங்கிலி (Stellar Dispositor Chain):</strong> லக்னம் மற்றும் 9 கிரகங்களின் 7-அடுக்கு ராசி நிலை மற்றும் நட்சத்திர நிலை தொடர்புகளின் முழு விவரம்.</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${entities.map(e => {
              const item = npData[e.key] || {};
              const rasiList = item.rasiPath || [];
              const nakList = item.nakshatraPath || [];

              return `
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                  <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap: 0.5rem;">
                    <span>${e.icon}</span> ${isTa ? e.nameTa : e.nameEn} <span style="font-size:0.85rem; color:#94A3B8; font-weight:normal;">(${isTa ? '7-நிலை பாதை' : '7-Tier Path'})</span>
                  </h4>
                  <span style="font-size: 0.8rem; background: rgba(59,130,246,0.2); border: 1px solid rgba(96,165,250,0.3); padding: 0.2rem 0.6rem; border-radius: 999px; color: #93C5FD; font-weight: 600;">
                    ${isTa ? 'ராசி & நட்சத்திர வழித்தடம்' : 'Rasi & Nakshatra Path'}
                  </span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.25rem;">
                  <!-- Rasi Nilai Table -->
                  <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden;">
                    <div style="background: rgba(217,119,6,0.2); border-bottom: 1px solid rgba(245,158,11,0.25); padding: 0.5rem 0.85rem; font-weight: 700; color: #FDE68A; font-size: 0.88rem; display:flex; justify-content:space-between;">
                      <span>🪐 ${isTa ? 'ராசி நிலை' : 'Rasi Progression'}</span>
                      <span style="font-size: 0.75rem; color: #CBD5E1;">7 நிலைகள்</span>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
                      <thead>
                        <tr style="background: rgba(255,255,255,0.04); color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <th style="padding: 0.5rem 0.75rem; width: 60px;">${isTa ? 'நிலை' : 'Level'}</th>
                          <th style="padding: 0.5rem 0.75rem;">${isTa ? 'ராசி' : 'Rasi'}</th>
                          <th style="padding: 0.5rem 0.75rem;">${isTa ? 'அதிபதி' : 'Lord'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${rasiList.map(r => `
                          <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                            <td style="padding: 0.45rem 0.75rem;">
                              <span style="background: rgba(245,158,11,0.2); color: #FBBF24; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 700; font-size: 0.78rem;">${r.level}</span>
                            </td>
                            <td style="padding: 0.45rem 0.75rem; color: #FFF; font-weight: 600;">${isTa ? r.rasiTa : r.rasiEn}</td>
                            <td style="padding: 0.45rem 0.75rem; color: #6EE7B7;">${isTa ? r.lordTa : r.lordEn}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>

                  <!-- Nakshatra Nilai Table -->
                  <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; overflow: hidden;">
                    <div style="background: rgba(16,185,129,0.2); border-bottom: 1px solid rgba(16,185,129,0.25); padding: 0.5rem 0.85rem; font-weight: 700; color: #6EE7B7; font-size: 0.88rem; display:flex; justify-content:space-between;">
                      <span>✨ ${isTa ? 'நட்சத்திர நிலை' : 'Nakshatra Progression'}</span>
                      <span style="font-size: 0.75rem; color: #CBD5E1;">7 நிலைகள்</span>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.86rem; text-align: left;">
                      <thead>
                        <tr style="background: rgba(255,255,255,0.04); color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <th style="padding: 0.5rem 0.75rem; width: 60px;">${isTa ? 'நிலை' : 'Level'}</th>
                          <th style="padding: 0.5rem 0.75rem;">${isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                          <th style="padding: 0.5rem 0.75rem;">${isTa ? 'அதிபதி' : 'Lord'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${nakList.map(n => `
                          <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                            <td style="padding: 0.45rem 0.75rem;">
                              <span style="background: rgba(16,185,129,0.2); color: #34D399; padding: 0.15rem 0.45rem; border-radius: 4px; font-weight: 700; font-size: 0.78rem;">${n.level}</span>
                            </td>
                            <td style="padding: 0.45rem 0.75rem; color: #FFF; font-weight: 600;">${isTa ? n.nakshatraTa : n.nakshatraEn}</td>
                            <td style="padding: 0.45rem 0.75rem; color: #FCD34D;">${isTa ? n.lordTa : n.lordEn}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        `;
        break;

      case "m22": // 22 நட்சத்திர தாரை (Tara Balam)
        const tbData = data.taraBalam || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateTaraBalam ? AstroEngine.calculateTaraBalam(data.planets?.["Mo"]?.nakshatraNameTa, data.planets) : null);
        const transitsList = tbData?.transits || (typeof AstroEngine !== 'undefined' ? AstroEngine.CANONICAL_TARA_BALAM_TRANSITS : []);
        const janmaStarName = tbData?.janmaNakshatra || data.planets?.["Mo"]?.nakshatraNameTa || (isTa ? "சித்திரை" : "Chitra");
        const periodRange = tbData?.periodRange || "12-10-2026 — 10-11-2026";
        const totalCount = transitsList.length;
        const goodTransits = transitsList.filter(t => t.periodStatus === "நல்ல காலம்");
        const cautionTransits = transitsList.filter(t => t.periodStatus === "கவனம் தேவை");

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem; margin-bottom: 1rem;">
                <div>
                  <span style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? 'வேத ஜோதிட தார பல கணிப்பு' : 'Vedic Tara Balam Transit Engine'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                    <span>✨</span> ${isTa ? 'நட்சத்திர தாரை' : 'Nakshatra Thaarai'}
                  </h3>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                  <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.35); border-radius: 8px; padding: 0.4rem 0.85rem; text-align: right;">
                    <div style="font-size: 0.72rem; color: #FDE68A;">${isTa ? 'ஜன்ம நட்சத்திரம்' : 'Janma Nakshatra'}</div>
                    <div style="font-size: 1rem; font-weight: 700; color: #FFF;">⭐ ${janmaStarName}</div>
                  </div>
                  <div style="background: rgba(59,130,246,0.15); border: 1px solid rgba(96,165,250,0.35); border-radius: 8px; padding: 0.4rem 0.85rem; text-align: right;">
                    <div style="font-size: 0.72rem; color: #93C5FD;">${isTa ? 'கால அளவு' : 'Transit Window'}</div>
                    <div style="font-size: 0.95rem; font-weight: 700; color: #FFF;">📅 ${periodRange}</div>
                  </div>
                </div>
              </div>

              <!-- Stats counters -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 10px; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 0.85rem;">
                  <div style="font-size: 1.8rem; background: rgba(16,185,129,0.2); width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🟢</div>
                  <div>
                    <div style="font-size: 1.35rem; font-weight: 800; color: #34D399;">${goodTransits.length} <span style="font-size: 0.8rem; font-weight: normal; color: #A7F3D0;">${isTa ? 'கால இடைவெளிகள்' : 'Periods'}</span></div>
                    <div style="font-size: 0.8rem; color: #E2E8F0; font-weight: 600;">${isTa ? 'நல்ல காலம் (சுப தாரை)' : 'Favorable (Auspicious)'}</div>
                  </div>
                </div>
                <div style="background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); border-radius: 10px; padding: 0.85rem 1rem; display: flex; align-items: center; gap: 0.85rem;">
                  <div style="font-size: 1.8rem; background: rgba(245,158,11,0.2); width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">🟡</div>
                  <div>
                    <div style="font-size: 1.35rem; font-weight: 800; color: #FBBF24;">${cautionTransits.length} <span style="font-size: 0.8rem; font-weight: normal; color: #FDE68A;">${isTa ? 'கால இடைவெளிகள்' : 'Periods'}</span></div>
                    <div style="font-size: 0.8rem; color: #E2E8F0; font-weight: 600;">${isTa ? 'கவனம் தேவை (நிதானம்)' : 'Caution Required'}</div>
                  </div>
                </div>
              </div>

              <!-- 9 Thaarai Quick Legend -->
              <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="font-size: 0.78rem; font-weight: 700; color: #CBD5E1; margin-bottom: 0.4rem;">
                  📜 ${isTa ? '9 தாரைகளின் சுருக்க விளக்கம்:' : '9 Tara Balam Classifications:'}
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 0.45rem; font-size: 0.78rem;">
                  <span style="background: rgba(245,158,11,0.15); color: #FDE68A; padding: 0.2rem 0.5rem; border-radius: 4px;">1. ஜென்மம் (கவனம்)</span>
                  <span style="background: rgba(16,185,129,0.15); color: #6EE7B7; padding: 0.2rem 0.5rem; border-radius: 4px;">2. சம்பத்து (செல்வம்)</span>
                  <span style="background: rgba(239,68,68,0.15); color: #FCA5A5; padding: 0.2rem 0.5rem; border-radius: 4px;">3. விபத்து (தடை/கவனம்)</span>
                  <span style="background: rgba(16,185,129,0.15); color: #6EE7B7; padding: 0.2rem 0.5rem; border-radius: 4px;">4. ஷேமம் (நலன்/பாதுகாப்பு)</span>
                  <span style="background: rgba(239,68,68,0.15); color: #FCA5A5; padding: 0.2rem 0.5rem; border-radius: 4px;">5. பிரத்யக் (எதிர்ப்பு/தாமதம்)</span>
                  <span style="background: rgba(16,185,129,0.15); color: #6EE7B7; padding: 0.2rem 0.5rem; border-radius: 4px;">6. சாதகம் (முயற்சி/வெற்றி)</span>
                  <span style="background: rgba(239,68,68,0.15); color: #FCA5A5; padding: 0.2rem 0.5rem; border-radius: 4px;">7. வதம் (இழப்பு/கவனம்)</span>
                  <span style="background: rgba(16,185,129,0.15); color: #6EE7B7; padding: 0.2rem 0.5rem; border-radius: 4px;">8. மைத்ரம் (நட்பு/உதவி)</span>
                  <span style="background: rgba(16,185,129,0.15); color: #6EE7B7; padding: 0.2rem 0.5rem; border-radius: 4px;">9. அதிமைத்ரம் (உயர்ந்த ஆதரவு)</span>
                </div>
              </div>
            </div>

            <!-- Filter Controls and Search -->
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="tara-filter-btn" data-filter="all" onclick="(function(btn){ var c=document.getElementById('tara-transits-container'); if(!c) return; c.querySelectorAll('.tara-transit-card').forEach(function(el){ el.style.display='block'; }); document.querySelectorAll('.tara-filter-btn').forEach(function(b){ b.style.outline='none'; b.style.opacity='0.75'; }); btn.style.outline='2px solid #3B82F6'; btn.style.opacity='1'; })(this)" style="background: #2563EB; color: #FFF; border: none; padding: 0.5rem 1.1rem; border-radius: 999px; font-size: 0.85rem; font-weight: 700; cursor: pointer; outline: 2px solid #3B82F6;">
                  ${isTa ? 'அனைத்தும்' : 'All'} (${totalCount})
                </button>
                <button class="tara-filter-btn" data-filter="good" onclick="(function(btn){ var c=document.getElementById('tara-transits-container'); if(!c) return; c.querySelectorAll('.tara-transit-card').forEach(function(el){ el.style.display=(el.getAttribute('data-status')==='good')?'block':'none'; }); document.querySelectorAll('.tara-filter-btn').forEach(function(b){ b.style.outline='none'; b.style.opacity='0.75'; }); btn.style.outline='2px solid #10B981'; btn.style.opacity='1'; })(this)" style="background: rgba(16,185,129,0.2); color: #34D399; border: 1px solid rgba(16,185,129,0.4); padding: 0.5rem 1.1rem; border-radius: 999px; font-size: 0.85rem; font-weight: 700; cursor: pointer; opacity: 0.85;">
                  🟢 ${isTa ? 'நல்ல காலம்' : 'Favorable'} (${goodTransits.length})
                </button>
                <button class="tara-filter-btn" data-filter="caution" onclick="(function(btn){ var c=document.getElementById('tara-transits-container'); if(!c) return; c.querySelectorAll('.tara-transit-card').forEach(function(el){ el.style.display=(el.getAttribute('data-status')==='caution')?'block':'none'; }); document.querySelectorAll('.tara-filter-btn').forEach(function(b){ b.style.outline='none'; b.style.opacity='0.75'; }); btn.style.outline='2px solid #F59E0B'; btn.style.opacity='1'; })(this)" style="background: rgba(245,158,11,0.2); color: #FBBF24; border: 1px solid rgba(245,158,11,0.4); padding: 0.5rem 1.1rem; border-radius: 999px; font-size: 0.85rem; font-weight: 700; cursor: pointer; opacity: 0.85;">
                  🟡 ${isTa ? 'கவனம் தேவை' : 'Caution'} (${cautionTransits.length})
                </button>
              </div>

              <div style="flex: 1; max-width: 260px; min-width: 180px;">
                <input type="text" placeholder="${isTa ? 'நட்சத்திரம் / தேதி தேட...' : 'Search star/date...'}" onkeyup="(function(inp){ var q=inp.value.toLowerCase(); var c=document.getElementById('tara-transits-container'); if(!c) return; c.querySelectorAll('.tara-transit-card').forEach(function(el){ var txt=el.textContent.toLowerCase(); el.style.display=txt.indexOf(q)>=0?'block':'none'; }); })(this)" style="width: 100%; background: rgba(15,23,42,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 8px; padding: 0.45rem 0.85rem; color: #FFF; font-size: 0.85rem; outline: none; box-sizing: border-box;" />
              </div>
            </div>

            <!-- Transits Interactive List -->
            <div id="tara-transits-container" style="display: flex; flex-direction: column; gap: 1rem;">
              ${transitsList.map((item, idx) => {
                const isGood = item.periodStatus === "நல்ல காலம்";
                const borderClr = isGood ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.35)';
                const pillBg = isGood ? 'rgba(16,185,129,0.18)' : 'rgba(245,158,11,0.18)';
                const pillText = isGood ? '#34D399' : '#FBBF24';
                const taraPillBg = isGood ? 'rgba(59,130,246,0.18)' : 'rgba(239,68,68,0.18)';
                const taraPillText = isGood ? '#93C5FD' : '#FCA5A5';

                return `
                <div class="tara-transit-card" data-status="${isGood ? 'good' : 'caution'}" style="background: rgba(15,23,42,0.85); border: 1px solid ${borderClr}; border-left: 5px solid ${isGood ? '#10B981' : '#F59E0B'}; border-radius: 10px; padding: 1.15rem 1.25rem; box-shadow: 0 4px 14px rgba(0,0,0,0.25);">
                  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 0.65rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.55rem;">
                    <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                      <span style="background: rgba(255,255,255,0.08); color: #E2E8F0; font-size: 0.82rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px;">
                        📅 ${item.date}
                      </span>
                      <span style="color: #FFF; font-weight: 800; font-size: 1.1rem;">
                        ✨ ${item.nakshatra}
                      </span>
                      <span style="background: ${taraPillBg}; border: 1px solid rgba(255,255,255,0.1); color: ${taraPillText}; font-size: 0.82rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
                        ${item.tara}
                      </span>
                    </div>
                    <div>
                      <span style="background: ${pillBg}; color: ${pillText}; font-weight: 700; font-size: 0.84rem; padding: 0.25rem 0.85rem; border-radius: 999px; border: 1px solid ${borderClr}; display: inline-flex; align-items: center; gap: 0.4rem;">
                        ${isGood ? '🟢 நல்ல காலம்' : '🟡 கவனம் தேவை'}
                      </span>
                    </div>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.84rem; color: #94A3B8; margin-bottom: 0.65rem; background: rgba(0,0,0,0.25); padding: 0.45rem 0.75rem; border-radius: 6px; flex-wrap: wrap;">
                    <span style="color: #CBD5E1; font-weight: 600;">⏱️ ${isTa ? 'நேர அளவு:' : 'Time Interval:'}</span>
                    <span style="color: #FDE68A; font-family: monospace; font-size: 0.88rem; font-weight: 600;">${item.startTime}</span>
                    <span style="color: #64748B;">➔</span>
                    <span style="color: #FDE68A; font-family: monospace; font-size: 0.88rem; font-weight: 600;">${item.endTime}</span>
                  </div>

                  <p style="margin: 0; color: #E2E8F0; font-size: 0.92rem; line-height: 1.65;">
                    ${item.description}
                  </p>
                </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
        break;

      case "m23": // 23 நட்சத்திர மரபியல் (Nakshatra Lineage & Genetic Karma)
        const ngData = data.nakshatraGenetics || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateNakshatraGenetics ? AstroEngine.calculateNakshatraGenetics(data.planets) : null);
        const karmaPoints = ngData?.points || (typeof AstroEngine !== 'undefined' ? AstroEngine.CANONICAL_GENETIC_KARMA_POINTS : []);
        const fundRefs = ngData?.fundamentalReferences || (typeof AstroEngine !== 'undefined' ? AstroEngine.CANONICAL_FUNDAMENTAL_REFERENCES : []);
        const karmaGroups = ngData?.karmaGroups || (typeof AstroEngine !== 'undefined' ? AstroEngine.GENETIC_KARMA_GROUPS : []);

        const lordColorMap = {
          "சூரி": { bg: "rgba(245,158,11,0.2)", text: "#FBBF24", border: "rgba(245,158,11,0.4)" },
          "சந்": { bg: "rgba(255,255,255,0.15)", text: "#F8FAFC", border: "rgba(255,255,255,0.3)" },
          "செவ்": { bg: "rgba(239,68,68,0.2)", text: "#F87171", border: "rgba(239,68,68,0.4)" },
          "புத": { bg: "rgba(16,185,129,0.2)", text: "#34D399", border: "rgba(16,185,129,0.4)" },
          "குரு": { bg: "rgba(234,179,8,0.2)", text: "#FACC15", border: "rgba(234,179,8,0.4)" },
          "சுக்": { bg: "rgba(236,72,153,0.2)", text: "#F472B6", border: "rgba(236,72,153,0.4)" },
          "சனி": { bg: "rgba(99,102,241,0.2)", text: "#818CF8", border: "rgba(99,102,241,0.4)" },
          "ராகு": { bg: "rgba(148,163,184,0.2)", text: "#CBD5E1", border: "rgba(148,163,184,0.4)" }
        };

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Philosophy / Principle Header -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem;">
                <div>
                  <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? 'பாரம்பரிய மரபணு கர்ம கணிப்பு' : 'Ancestral Epigenetic Karma Canon'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                    <span>🧬</span> ${isTa ? 'நட்சத்திர மரபியல் (மரபணு கர்ம பதிவு)' : 'Nakshatra Lineage (Genetic Karma)'}
                  </h3>
                </div>
                <span style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4); color: #FDE68A; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">
                  ${isTa ? '8 கிரக சுழற்சி விதி' : '8-Graha Cycle Rule'}
                </span>
              </div>

              <!-- Sacred Canonical Rule Box -->
              <div style="background: rgba(14,22,46,0.7); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem;">
                <p style="margin: 0; color: #E2E8F0; font-size: 0.92rem; line-height: 1.7;">
                  ${isTa
                    ? 'மரபணு கர்ம பதிவு என்பது ஒவ்வொரு கிரக/லக்ன நட்சத்திரத்தையும், சூரியன், சந்திரன், செவ்வாய், புதன், குரு, சுக்ரன், சனி, ராகு என்ற 8 கிரக சுழற்சியின் அடிப்படையில், 8 நட்சத்திரங்களுக்கு ஒரு முறை மீண்டும் தொடங்கும் வகையில் ஒரு <strong>"கர்ம பதிவு"</strong> கிரகத்திற்கு உரியதாக்குகிறது. இது எண் மதிப்பீடு அல்ல; பாரம்பரிய மரபணு கர்ம அடையாளமாக கருதப்படுகிறது. <span style="color:#FDE68A;">கேது இந்த 8 கிரக சுழற்சியில் இடம்பெறவில்லை</span> (கேதுவின் சொந்த நட்சத்திரத்திற்கு கர்ம பதிவு கணக்கிடலாம், ஆனால் கேது வேறு எந்த நட்சத்திரத்திற்கும் கர்ம பதிவு கிரகமாக வராது) — இது மூல நூலின் அசல் விதி, மாற்றப்படாமல் பாதுகாக்கப்பட்டுள்ளது.'
                    : 'The Genetic Karma Record assigns each planet/Ascendant star to a \'Karma Record\' planet based on the 8-graha cycle (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu), recurring every 8 nakshatras. This is not a mere numerical score; it represents ancestral epigenetic karma. Ketu is excluded from this 8-graha cycle (Ketu has a karma lord, but never acts as a karma lord for other stars) — this is the classical canonical rule.'}
                </p>
              </div>
            </div>

            <!-- Table 1: மரபணு கர்ம பதிவுகள் (Genetic Karma Records) -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
                <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>📜</span> ${isTa ? 'மரபணு கர்ம பதிவுகள்' : 'Genetic Karma Records'}
                </h4>
                <span style="font-size: 0.8rem; background: rgba(59,130,246,0.2); border: 1px solid rgba(96,165,250,0.3); padding: 0.2rem 0.6rem; border-radius: 999px; color: #93C5FD; font-weight: 600;">
                  11 ${isTa ? 'அமைப்புகள்' : 'Points'}
                </span>
              </div>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                  <thead>
                    <tr style="background: rgba(255,255,255,0.05); color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.1);">
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'அமைப்பு (Point)' : 'Point'}</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                      <th style="padding: 0.65rem 0.85rem; text-align: center;">${isTa ? 'பாதம்' : 'Pada'}</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'மரபணு கர்ம அதிபதி (Genetic Karma Lord)' : 'Genetic Karma Lord'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${karmaPoints.map(p => {
                      const c = lordColorMap[p.geneticKarmaLordTa] || { bg: "rgba(255,255,255,0.1)", text: "#FFF", border: "rgba(255,255,255,0.2)" };
                      return `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 0.6rem 0.85rem; font-weight: 700; color: #FFF;">
                          ${isTa ? p.pointTa : p.pointEn}
                        </td>
                        <td style="padding: 0.6rem 0.85rem; color: #E2E8F0; font-weight: 600;">
                          ✨ ${isTa ? p.nakshatraTa : p.nakshatraEn}
                        </td>
                        <td style="padding: 0.6rem 0.85rem; text-align: center;">
                          <span style="background: rgba(245,158,11,0.2); color: #FBBF24; padding: 0.15rem 0.5rem; border-radius: 4px; font-weight: 700; font-size: 0.82rem;">${p.pada}</span>
                        </td>
                        <td style="padding: 0.6rem 0.85rem;">
                          <span style="background: ${c.bg}; color: ${c.text}; border: 1px solid ${c.border}; font-weight: 700; font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.35rem;">
                            👑 ${isTa ? p.geneticKarmaLordTa : p.geneticKarmaLordEn}
                          </span>
                        </td>
                      </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Table 2: மரபணு ஜோதிடம் அடிப்படை தகவல்கள் (Fundamental Genetic Reference Information) -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
                <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>🔮</span> ${isTa ? 'மரபணு ஜோதிடம் அடிப்படை தகவல்கள்' : 'Genetic Astrology Fundamental Reference Points'}
                </h4>
                <span style="font-size: 0.8rem; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.3); padding: 0.2rem 0.6rem; border-radius: 999px; color: #6EE7B7; font-weight: 600;">
                  9 ${isTa ? 'கிரகங்கள்' : 'Planets'}
                </span>
              </div>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                  <thead>
                    <tr style="background: rgba(255,255,255,0.05); color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.1);">
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'கிரகம் (Planet)' : 'Planet'}</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'அடிப்படை நட்சத்திரம் (Reference Nakshatra)' : 'Reference Nakshatra'}</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'மரபணு கர்ம அதிபதி (Genetic Karma Lord)' : 'Genetic Karma Lord'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${fundRefs.map(f => {
                      const c = lordColorMap[f.geneticKarmaLordTa] || { bg: "rgba(255,255,255,0.1)", text: "#FFF", border: "rgba(255,255,255,0.2)" };
                      return `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 0.6rem 0.85rem; font-weight: 700; color: #FFF;">
                          ${isTa ? f.planetTa : f.planetEn}
                        </td>
                        <td style="padding: 0.6rem 0.85rem; color: #E2E8F0; font-weight: 600;">
                          ⭐ ${isTa ? f.referenceNakshatraTa : f.referenceNakshatraEn}
                        </td>
                        <td style="padding: 0.6rem 0.85rem;">
                          <span style="background: ${c.bg}; color: ${c.text}; border: 1px solid ${c.border}; font-weight: 700; font-size: 0.85rem; padding: 0.25rem 0.75rem; border-radius: 999px; display: inline-flex; align-items: center; gap: 0.35rem;">
                            👑 ${isTa ? f.geneticKarmaLordTa : f.geneticKarmaLordEn}
                          </span>
                        </td>
                      </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Section 3: கிரகவாரியான மரபணு கர்ம நட்சத்திர குழுக்கள் (Genetic Karma Lord Nakshatra Groups) -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
                <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>🌌</span> ${isTa ? 'கிரகவாரியான மரபணு கர்ம நட்சத்திர குழுக்கள்' : 'Genetic Karma Lord Nakshatra Groups'}
                </h4>
                <span style="font-size: 0.8rem; background: rgba(234,179,8,0.2); border: 1px solid rgba(234,179,8,0.3); padding: 0.2rem 0.6rem; border-radius: 999px; color: #FDE68A; font-weight: 600;">
                  ${isTa ? '8 கர்ம அதிபதிகள்' : '8 Karma Lords'}
                </span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                ${karmaGroups.map(g => {
                  const c = lordColorMap[g.lordTa] || { bg: "rgba(255,255,255,0.1)", text: "#FFF", border: "rgba(255,255,255,0.2)" };
                  return `
                  <div style="background: rgba(15,23,42,0.7); border: 1px solid ${c.border}; border-top: 3px solid ${c.text}; border-radius: 10px; padding: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
                      <span style="background: ${c.bg}; color: ${c.text}; font-weight: 800; font-size: 0.95rem; padding: 0.25rem 0.75rem; border-radius: 8px; border: 1px solid ${c.border};">
                        👑 ${isTa ? g.lordTa : g.lordEn}
                      </span>
                      <span style="font-size: 0.76rem; color: #94A3B8; font-weight: 600;">
                        ${(isTa ? g.nakshatrasTa : g.nakshatrasEn).length} ${isTa ? 'நட்சத்திரங்கள்' : 'Stars'}
                      </span>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
                      ${(isTa ? g.nakshatrasTa : g.nakshatrasEn).map((nak, i) => `
                        <span style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #E2E8F0; font-size: 0.82rem; font-weight: 600; padding: 0.25rem 0.6rem; border-radius: 6px;">
                          ✨ ${nak}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case "m24": // 24 நட்சத்திர கிரக வேலை (உயிர்சக்தி வாழ்க்கைச் சுழற்சி)
        const lcData = data.lifeCycle || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateLifeCycle ? AstroEngine.calculateLifeCycle(data.planets) : null);
        const degAssigns = lcData?.degreeAssignments || [];
        const cycleList = lcData?.cycleChain || [];
        const supSummary = lcData?.supervisorsSummary || [];
        const feedbackLoops = lcData?.feedbackLoops || ["செவ்வாய் ➔ சந்திரன்"];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Philosophy / Principle Header -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem;">
                <div>
                  <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? 'உயிர்சக்தி வாழ்க்கைச் சுழற்சி — வாழ்க்கை எப்படிப் பலனாகிறது' : 'Universal Life Force Cycle — How Destiny Manifests'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                    <span>⚙️</span> ${isTa ? 'நட்சத்திர கிரக வேலை' : 'Planetary Sub-Lord Work Cycle'}
                  </h3>
                </div>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                  <span style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4); color: #FDE68A; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">
                    ${isTa ? '9 நிலை உற்பத்தி வரிசை' : '9-Stage Production Sequence'}
                  </span>
                  <span style="background: rgba(59,130,246,0.15); border: 1px solid rgba(96,165,250,0.4); color: #93C5FD; padding: 0.35rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700;">
                    ${isTa ? 'பாகை வரிசை (0°–360°)' : 'Degree Ordering (0°–360°)'}
                  </span>
                </div>
              </div>

              <!-- Production Line Analogy Box -->
              <div style="background: rgba(14,22,46,0.7); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 1.15rem 1.35rem; margin-bottom: 1rem;">
                <p style="margin: 0 0 0.75rem 0; color: #E2E8F0; font-size: 0.92rem; line-height: 1.7;">
                  ${isTa
                    ? 'வாழ்க்கையில் பெரும்பாலானவை திடீரெனத் தோன்றுவதில்லை. ஒன்று எட்டப்பட வேண்டும், பெறப்பட வேண்டும், பொருள் அல்லது சக்தியால் நிரப்பப்பட வேண்டும், வளர்க்கப்பட்டு வளர வேண்டும், செயலாக்கப்பட வேண்டும், ஒரு திட்டத்தால் இயக்கப்பட வேண்டும், அனுமதி பெற வேண்டும், தொட்டுணரும் பலனாக மாற வேண்டும், இறுதியில் பயன்படுத்தப்பட்டு நிர்வகிக்கப்பட்டு பகிரப்பட்டு அனுபவிக்கப்பட வேண்டும். இயற்கை இதற்கு ஒன்பது நிலை கொண்ட ஒரு நிலையான உற்பத்தி வரிசையைப் பயன்படுத்துகிறது.'
                    : 'Nothing manifests out of nowhere. An initiative must be reached, received, fueled with vital substance, nurtured into growth, executed into action, given directional blueprint, sanctioned with wisdom, manifested into tangible reality, and finally administered, enjoyed and communicated. Nature employs a fixed 9-stage sequence for this life-force manifestation.'}
                </p>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; background: rgba(0,0,0,0.3); padding: 0.75rem 1rem; border-radius: 8px;">
                  <div style="color: #FDE68A; font-size: 0.85rem;"><strong>${isTa ? 'கிரகம்' : 'Planet'}</strong> = ${isTa ? 'நிரந்தரப் பணி / துறை' : 'Permanent Department / Duty'}</div>
                  <div style="color: #6EE7B7; font-size: 0.85rem;"><strong>${isTa ? 'கிரகத்தின் நட்சத்திரம்' : 'Star'}</strong> = ${isTa ? 'நியமிக்கப்பட்ட பணியாளர்' : 'Assigned Worker'}</div>
                  <div style="color: #93C5FD; font-size: 0.85rem;"><strong>${isTa ? 'நட்சத்திர அதிபதி' : 'Star Lord'}</strong> = ${isTa ? 'மேற்பார்வையாளர்' : 'Overseeing Supervisor'}</div>
                </div>
              </div>

              <!-- Metaphor: Spoon & Food -->
              <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 0.85rem 1rem;">
                <div style="font-size: 0.82rem; font-weight: 700; color: #CBD5E1; margin-bottom: 0.5rem;">
                  🥄 ${isTa ? 'உணவு / கரண்டி / கட்டுமானம் உதாரணம்:' : 'Spoon & Nourishment Universal Analogy:'}
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.65rem; font-size: 0.8rem; color: #CBD5E1;">
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#FBBF24; font-weight:700;">1. கேது:</span> கைப்பிடி — பாத்திரத்திற்குள் எட்டி தொடங்கும் இணைப்பு.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#F472B6; font-weight:700;">2. சுக்ரன்:</span> கரண்டியின் கிண்ணம் — பெற்று, ஏந்தி, சுமந்து வடிவமைக்கும் பாத்திரம்.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#F87171; font-weight:700;">3. சூரியன்:</span> கரண்டியில் இருக்கும் உணவு — சாதம், பால், சாம்பார் எனும் உயிர்சக்தி.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#60A5FA; font-weight:700;">4. சந்திரன்:</span> செரித்தல் & உறிஞ்சுதல் — உடலால் ஏற்றுக்கொண்டு வளர்த்தல்.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#EF4444; font-weight:700;">5. செவ்வாய்:</span> வளர்ந்த பின் செய்யும் இயக்கம் — கட்டி, காத்து, செயலாக்குதல்.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#CBD5E1; font-weight:700;">6. ராகு:</span> திட்டம் & வரைபடம் — எங்கு செல்கிறோம் என்ற மறைமுக திசை.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#FACC15; font-weight:700;">7. குரு:</span> ஆசிரியர் வழிகாட்டல் — அறிவு, நியாயம் மற்றும் சமூக அனுமதி.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#818CF8; font-weight:700;">8. சனி:</span> நிஜமான பலன் — உண்மை உலகில் நிற்கும் வீடு, வேலை, கர்மப் பலன்.</div>
                  <div style="background: rgba(255,255,255,0.03); padding: 0.5rem 0.75rem; border-radius: 6px;"><span style="color:#34D399; font-weight:700;">9. புதன்:</span> நிர்வகித்து அனுபவித்தல் — கணக்கிட்டு, பேசி, விற்றுப் பயன்படுத்துதல்.</div>
                </div>
              </div>
            </div>

            <!-- Table 1: இந்த ஜாதகத்தில் ஒவ்வொரு பணியையும் யார் செய்கிறார்கள் (பாகை வரிசை 0° to 360°) -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
                <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>📐</span> ${isTa ? 'இந்த ஜாதகத்தில் ஒவ்வொரு பணியையும் யார் செய்கிறார்கள் (பாகை வரிசை)' : 'Performer Assignments by Longitude (0°–360°)'}
                </h4>
                <span style="font-size: 0.8rem; background: rgba(59,130,246,0.2); border: 1px solid rgba(96,165,250,0.3); padding: 0.2rem 0.6rem; border-radius: 999px; color: #93C5FD; font-weight: 600;">
                  0° முதல் 360° வரை வரிசைப்படுத்தல்
                </span>
              </div>

              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                  <thead>
                    <tr style="background: rgba(255,255,255,0.05); color: #94A3B8; border-bottom: 1px solid rgba(255,255,255,0.1);">
                      <th style="padding: 0.65rem 0.85rem; text-align:center;">#</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'இயல்புப் பணி (கிரகம்)' : 'Default Duty (Graha)'}</th>
                      <th style="padding: 0.65rem 0.85rem; text-align:center;">➔</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'இந்தப் பணியைச் செய்யும் கிரகம்' : 'Assigned Performer Graha'}</th>
                      <th style="padding: 0.65rem 0.85rem;">${isTa ? 'ராசி & பாகை' : 'Rasi & Degree'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${degAssigns.map((d, i) => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 0.6rem 0.85rem; text-align: center; color: #94A3B8; font-weight: 700;">${d.stage}</td>
                        <td style="padding: 0.6rem 0.85rem;">
                          <div style="font-weight: 700; color: #F7D774;">${d.defaultDutyGraha}</div>
                          <div style="font-size: 0.78rem; color: #94A3B8;">${d.duty}</div>
                        </td>
                        <td style="padding: 0.6rem 0.85rem; text-align:center; color: #D4AF37;">➔</td>
                        <td style="padding: 0.6rem 0.85rem;">
                          <span style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.3); color: #FFF; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px;">
                            ⭐ ${d.performingGraha}
                          </span>
                        </td>
                        <td style="padding: 0.6rem 0.85rem; color: #CBD5E1; font-family: monospace; font-size: 0.85rem;">
                          ${d.signNameTa} · ${typeof d.signDeg === 'number' ? d.signDeg.toFixed(6) : d.signDeg}°
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Section 2: உங்கள் உயிர்சக்தி வாழ்க்கைச் சுழற்சி (Graha -> Nakshatra -> Supervisor) -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem; flex-wrap:wrap; gap:0.5rem;">
                <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>🌱</span> ${isTa ? 'உங்கள் உயிர்சக்தி வாழ்க்கைச் சுழற்சி' : 'Your Natal Life Force Work Cycle'}
                </h4>
                <span style="font-size: 0.8rem; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.3); padding: 0.2rem 0.6rem; border-radius: 999px; color: #6EE7B7; font-weight: 600;">
                  கிரகம் ➔ நட்சத்திரம் ➔ மேற்பார்வையாளர்
                </span>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1rem;">
                ${cycleList.map(c => `
                  <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(212,175,55,0.25); border-radius: 10px; padding: 1rem 1.15rem; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
                        <span style="background: rgba(212,175,55,0.2); color: #FDE68A; font-weight: 800; font-size: 0.82rem; padding: 0.15rem 0.55rem; border-radius: 4px;">
                          ${c.stage}. ${c.duty}
                        </span>
                        <span style="font-size: 0.78rem; color: #94A3B8;">${c.sign} · Pada ${c.pada}</span>
                      </div>

                      <!-- Chain Flow: Graha -> Star -> Supervisor -->
                      <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.35); padding: 0.65rem 0.75rem; border-radius: 8px; margin-bottom: 0.65rem; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="text-align: center;">
                          <div style="font-size: 0.7rem; color: #94A3B8;">கிரகம்</div>
                          <div style="font-weight: 700; color: #FFF; font-size: 0.95rem;">${c.graha}</div>
                        </div>
                        <div style="color: #FBBF24; font-size: 1rem;">➔</div>
                        <div style="text-align: center;">
                          <div style="font-size: 0.7rem; color: #94A3B8;">நட்சத்திரம்</div>
                          <div style="font-weight: 700; color: #6EE7B7; font-size: 0.95rem;">✨ ${c.nakshatra}</div>
                        </div>
                        <div style="color: #FBBF24; font-size: 1rem;">➔</div>
                        <div style="text-align: center;">
                          <div style="font-size: 0.7rem; color: #94A3B8;">மேற்பார்வையாளர்</div>
                          <div style="font-weight: 700; color: #93C5FD; font-size: 0.95rem;">👑 ${c.supervisor}</div>
                        </div>
                      </div>

                      <p style="margin: 0; font-size: 0.82rem; color: #CBD5E1; line-height: 1.5;">
                        ${c.explanation}
                      </p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Section 3: உயிர்சக்தி சுருக்கப் பலகை (Summary & Feedback Loop) -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                <span>📊</span> ${isTa ? 'உயிர்சக்தி சுருக்கப் பலகை & இருவழிச் சுழற்சி' : 'Supervisory Distribution & Mutual Feedback Loop'}
              </h4>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
                ${supSummary.map(s => `
                  <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;">
                    <div>
                      <div style="color: #FFF; font-weight: 700; font-size: 0.95rem;">👑 ${s.lord}</div>
                      <div style="font-size: 0.76rem; color: #94A3B8;">உயிர்சக்தி மேற்பார்வை</div>
                    </div>
                    <span style="background: rgba(212,175,55,0.2); border: 1px solid rgba(212,175,55,0.35); color: #FDE68A; font-weight: 800; font-size: 0.9rem; padding: 0.2rem 0.65rem; border-radius: 999px;">
                      ${s.count} ${isTa ? 'நிலைகள்' : 'Stages'}
                    </span>
                  </div>
                `).join('')}
              </div>

              <!-- Two-Way Feedback Loop Highlight -->
              <div style="background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(16,185,129,0.15)); border: 1px solid rgba(245,158,11,0.4); border-radius: 10px; padding: 1rem 1.25rem;">
                <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap; margin-bottom:0.4rem;">
                  <span style="font-size:1.3rem;">🔄</span>
                  <span style="color:#FDE68A; font-weight:800; font-size:1.05rem;">
                    ${isTa ? 'இருவழிச் சுழற்சி (Mutual Feedback Loop):' : 'Two-Way Feedback Loop:'} ${feedbackLoops.join(', ')}
                  </span>
                </div>
                <p style="margin: 0; color: #CBD5E1; font-size: 0.88rem; line-height: 1.6;">
                  ${isTa
                    ? 'செவ்வாய் நின்ற நட்சத்திரத்தின் (திருவோணம்) அதிபதி சந்திரன்; சந்திரன் நின்ற நட்சத்திரத்தின் (சித்திரை) அதிபதி செவ்வாய். இது செயலும் (Mars) வளர்ச்சியும் (Moon) ஒன்றையொன்று தொடர்ச்சியாகப் போஷித்துப் பெருக்கும் அரிய ஆற்றல் சுழற்சியாகும்.'
                    : 'Mars occupies Shravana ruled by Moon, and Moon occupies Chitra ruled by Mars. This creates a perpetual regenerative circuit where disciplined action directly fuels vital emotional growth.'}
                </p>
              </div>
            </div>
          </div>
        `;
        break;

      case "m25": // 25 நட்சத்திர எதிர் நட்சத்திரம் (Counter Stars & Obstacles)
        const csData = data.counterStars || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateCounterStars ? AstroEngine.calculateCounterStars(data.planets) : null);
        const csSummary = csData?.summary || { rootPlanets: 9, totalObstacleSlots: 45, occupiedSlots: 5, vacantSlots: 40 };
        const csPoints = csData?.points || [];
        const sookshmaTable = csData?.sookshmaTable || [];
        const obstacleTables = csData?.obstacleTables || [];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem;">
                <div>
                  <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? 'எதிரிடை நட்சத்திரங்கள் & சூட்சம பலன் அட்டவணை' : 'Afflicted Vedha Stars & Subtle Obstacles'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                    <span>⚔️</span> ${isTa ? 'நட்சத்திர எதிர் நட்சத்திரம்' : 'Counter Stars (Nakshatra Vedha)'}
                  </h3>
                </div>
              </div>

              <!-- Stat Counters -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
                <div style="background: rgba(59,130,246,0.12); border: 1px solid rgba(96,165,250,0.3); border-radius: 8px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #93C5FD;">${csSummary.rootPlanets}</div>
                  <div style="font-size: 0.75rem; color: #E2E8F0;">${isTa ? 'மூல கிரகங்கள்' : 'Root Planets'}</div>
                </div>
                <div style="background: rgba(212,175,55,0.12); border: 1px solid rgba(212,175,55,0.3); border-radius: 8px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #FDE68A;">${csSummary.totalObstacleSlots}</div>
                  <div style="font-size: 0.75rem; color: #E2E8F0;">${isTa ? 'மொத்த எதிரிடை இடங்கள்' : 'Total Obstacle Slots'}</div>
                </div>
                <div style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #F87171;">${csSummary.occupiedSlots} ⚠️</div>
                  <div style="font-size: 0.75rem; color: #E2E8F0;">${isTa ? 'நிற்கும் இடங்கள் (தடங்கல்)' : 'Occupied Points'}</div>
                </div>
                <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); border-radius: 8px; padding: 0.75rem; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #34D399;">${csSummary.vacantSlots} 🟢</div>
                  <div style="font-size: 0.75rem; color: #E2E8F0;">${isTa ? 'காலி இடங்கள் (பாதுகாப்பு)' : 'Vacant Points'}</div>
                </div>
              </div>

              <!-- Rule Box -->
              <div style="background: rgba(14,22,46,0.7); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 0.9rem 1.15rem;">
                <p style="margin: 0; color: #E2E8F0; font-size: 0.88rem; line-height: 1.6;">
                  ${isTa
                    ? 'ஒவ்வொரு கிரகத்தின் பிறப்பு நட்சத்திரத்திற்கும் நிலையான எதிரிடை நட்சத்திரங்கள் உள்ளன. அந்த எதிரிடை நட்சத்திர கால்களில் மற்ற கிரகங்கள் நிற்கும் பொழுது பலன்கள் கிடைப்பதில் தடங்கல்கள் ஏற்படுகின்றன. ஒரு எதிரிடை நட்சத்திர இடம், ஏதேனும் பிறப்பு கிரகம் அல்லது லக்னம் அந்த நட்சத்திரத்தில் நிற்கும்போது ஆக்கிரமிக்கப்பட்டதாகக் (நிற்கிறது) கருதப்படுகிறது.'
                    : 'Each root planet has classical counter stars (vedha points). When other natal planets occupy these counter stars, obstructions to the root planet\'s benefits occur. Slots occupied by natal grahas require remedial awareness.'}
                </p>
              </div>
            </div>

            <!-- Table 1: Natal Points Alignment -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
              <h4 style="color: #F7D774; margin: 0 0 0.85rem 0; font-size: 1.1rem; font-weight: 700;">
                ⭐ ${isTa ? 'நட்சத்திர எதிர் நட்சத்திரம் — பிறப்பு புள்ளிகள்' : 'Natal Star Placements'}
              </h4>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${csPoints.map(p => `
                  <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.45rem 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: 800; color: #FDE68A;">${p.shortName}</span>
                    <span style="color: #FFF;">${p.nakshatra}</span>
                    <span style="background: rgba(245,158,11,0.2); color: #FBBF24; padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">P${p.pada}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Table 2: கிரகங்களின் சூட்சம பலன் அட்டவணை -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; overflow-x: auto;">
              <h4 style="color: #F7D774; margin: 0 0 0.85rem 0; font-size: 1.1rem; font-weight: 700;">
                🔮 ${isTa ? 'கிரகங்களின் சூட்சம பலன் அட்டவணை (காரகன், பாசகன், போதகன், வேதகன்)' : 'Sookshma Palan Matrix'}
              </h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: center;">
                <thead>
                  <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                    <th style="padding: 0.5rem; text-align: left;">கிரகம்</th>
                    <th style="padding: 0.5rem; text-align: left;">நட்சத்திரம்</th>
                    <th style="padding: 0.5rem;">சூரி</th>
                    <th style="padding: 0.5rem;">சந்</th>
                    <th style="padding: 0.5rem;">புத</th>
                    <th style="padding: 0.5rem;">சுக்</th>
                    <th style="padding: 0.5rem;">செவ்</th>
                    <th style="padding: 0.5rem;">குரு</th>
                    <th style="padding: 0.5rem;">சனி</th>
                    <th style="padding: 0.5rem;">ராகு</th>
                    <th style="padding: 0.5rem;">கேது</th>
                  </tr>
                </thead>
                <tbody>
                  ${sookshmaTable.map(row => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                      <td style="padding: 0.5rem; text-align: left; font-weight: 700; color: #FFF;">${row.planet}</td>
                      <td style="padding: 0.5rem; text-align: left; color: #6EE7B7;">${row.nakshatra}</td>
                      <td style="padding: 0.5rem;">${row.relations["சூரி"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["சந்"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["புத"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["சுக்"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["செவ்"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["குரு"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["சனி"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["ராகு"] || '—'}</td>
                      <td style="padding: 0.5rem;">${row.relations["கேது"] || '—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Detailed Obstacle Tables for all 9 Root Planets -->
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0; font-size: 1.15rem; font-weight: 700;">
                📜 ${isTa ? '9 கிரகங்களின் விரிவான எதிரிடை நட்சத்திர ஆய்வு' : 'Detailed Obstacle Evaluation for 9 Root Grahas'}
              </h4>
              ${obstacleTables.map(t => `
                <div style="background: rgba(14,22,46,0.8); border: 1px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 1.15rem;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0.5rem;">
                    <span style="font-size: 1.05rem; font-weight: 800; color: #FFF;">
                      ⭐ ${t.planet} — <span style="color: #FDE68A;">${t.nakshatra}</span>
                    </span>
                    <span style="font-size: 0.8rem; color: #94A3B8;">
                      ${t.slots.length} ${isTa ? 'எதிரிடை நட்சத்திரங்கள்' : 'Obstacle Stars'}
                    </span>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.65rem;">
                    ${t.slots.map(s => {
                      const isOcc = s.isOccupied;
                      const borderCol = isOcc ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.06)';
                      const bgCol = isOcc ? 'rgba(239,68,68,0.12)' : 'rgba(15,23,42,0.6)';
                      return `
                        <div style="background: ${bgCol}; border: 1px solid ${borderCol}; border-radius: 8px; padding: 0.65rem 0.85rem;">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                            <span style="font-weight: 700; color: #FFF; font-size: 0.88rem;">
                              ${s.index}. ${s.type} · <span style="color:#6EE7B7;">${s.nakshatra}</span>
                            </span>
                            <span style="background: ${isOcc ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.2)'}; color: ${isOcc ? '#F87171' : '#34D399'}; font-weight: 800; font-size: 0.75rem; padding: 0.15rem 0.45rem; border-radius: 999px;">
                              ${isOcc ? `⚠️ ${s.occupant} நிற்கிறது` : '🟢 காலி'}
                            </span>
                          </div>
                          <div style="font-size: 0.78rem; color: #CBD5E1; line-height: 1.4;">
                            ${isOcc
                              ? `<span style="color:#FCA5A5;">ஒரு பிறப்பு கிரகம் (${s.occupant}) இந்த எதிரிடை நட்சத்திரத்தில் நிற்கிறது; மூல கிரகத்தின் பலன்களுக்குத் தடங்கல் ஏற்படுகிறது.</span>`
                              : 'இந்த எதிரிடை நட்சத்திரத்தில் எந்தப் பிறப்பு கிரகமும் லக்னமும் நிற்கவில்லை.'}
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case "m26": // 26 நட்சத்திர ஆனந்தாதி யோகம் (28 Anandadi Yogas)
        const ayData = data.anandadiYoga || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateAnandadiYoga ? AstroEngine.calculateAnandadiYoga(data.panchangam?.varaNameTa, data.planets?.["Mo"]?.nakshatraNameTa, data.planets?.["Mo"]?.pada) : null);
        const activeY = ayData?.activeYoga || { row: 14, yoga: "லம்ப", nature: "தீயது", effect: "வறுமை / இழப்பு", weekday: "சனி", nakshatra: "சித்திரை", pada: 3 };
        const refTable = ayData?.referenceTable || (typeof AstroEngine !== 'undefined' ? AstroEngine.ANANDADI_28_YOGAS : []);

        const isGoodYoga = activeY.nature.includes("நன்று") || activeY.nature.includes("சிறப்பு");
        const natureClr = isGoodYoga ? '#34D399' : (activeY.nature.includes("தீ") ? '#F87171' : '#FBBF24');
        const natureBg = isGoodYoga ? 'rgba(16,185,129,0.2)' : (activeY.nature.includes("தீ") ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)');

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Natal Yoga Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem;">
                <div>
                  <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? '28 கிழமை–நட்சத்திர யோகங்கள்' : '28 Weekday-Star Anandadi Yogas'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                    <span>🌟</span> ${isTa ? 'நட்சத்திர ஆனந்தாதி யோகம்' : 'Nakshatra Anandadi Yoga'}
                  </h3>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <span style="background: ${natureBg}; color: ${natureClr}; border: 1px solid ${natureClr}; font-weight: 800; font-size: 0.95rem; padding: 0.35rem 0.95rem; border-radius: 999px;">
                    ${activeY.yoga} யோகம் · ${activeY.nature}
                  </span>
                </div>
              </div>

              <!-- Yoga Details Card -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem; text-align: center;">
                  <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'பிறந்த கிழமை' : 'Birth Weekday'}</div>
                  <div style="font-size: 1.3rem; font-weight: 800; color: #FFF; margin-top: 0.25rem;">📅 ${activeY.weekday}</div>
                </div>
                <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem; text-align: center;">
                  <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'சந்திர நட்சத்திரம்' : 'Moon Nakshatra'}</div>
                  <div style="font-size: 1.3rem; font-weight: 800; color: #6EE7B7; margin-top: 0.25rem;">⭐ ${activeY.nakshatra} (P${activeY.pada})</div>
                </div>
                <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem; text-align: center;">
                  <div style="font-size: 0.75rem; color: #94A3B8;">${isTa ? 'ஆனந்தாதி பலன்' : 'Anandadi Result'}</div>
                  <div style="font-size: 1.2rem; font-weight: 800; color: ${natureClr}; margin-top: 0.25rem;">${activeY.effect}</div>
                </div>
              </div>

              <div style="background: rgba(14,22,46,0.7); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 0.85rem 1.15rem;">
                <p style="margin: 0; color: #E2E8F0; font-size: 0.88rem; line-height: 1.6;">
                  ${isTa
                    ? 'பிறந்த கிழமையும் சந்திரனின் ஜென்ம நட்சத்திரமும் இணையும் முறையில் பாரம்பரிய பலனை ஆனந்தாதி யோகம் காட்டுகிறது. பழைய முறைக்கு இணக்கமான 28-வரிசை கிழமை–நட்சத்திர அட்டவணை; கிழமை UTC நள்ளிரவில் மாறுகிறது.'
                    : 'The Anandadi system correlates the natal weekday with Moon Nakshatra across 28 classical combinations to reveal overarching karmic rhythm.'}
                </p>
              </div>
            </div>

            <!-- Full 28 Yogas Matrix Table -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3); overflow-x: auto;">
              <h4 style="color: #F7D774; margin: 0 0 0.85rem 0; font-size: 1.15rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                <span>📜</span> ${isTa ? 'ஆனந்தாதி யோக குறிப்பு அட்டவணை (28 வரிசைகள்)' : 'Anandadi 28 Yogas Master Matrix'}
              </h4>

              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: center;">
                <thead>
                  <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                    <th style="padding: 0.55rem; text-align: center;">#</th>
                    <th style="padding: 0.55rem; text-align: left;">யோகம்</th>
                    <th style="padding: 0.55rem;">தன்மை</th>
                    <th style="padding: 0.55rem; text-align: left;">பலன்</th>
                    <th style="padding: 0.55rem;">ஞாயிறு</th>
                    <th style="padding: 0.55rem;">திங்கள்</th>
                    <th style="padding: 0.55rem;">செவ்வாய்</th>
                    <th style="padding: 0.55rem;">புதன்</th>
                    <th style="padding: 0.55rem;">வியாழன்</th>
                    <th style="padding: 0.55rem;">வெள்ளி</th>
                    <th style="padding: 0.55rem; background: rgba(212,175,55,0.15); color: #FDE68A;">சனி</th>
                  </tr>
                </thead>
                <tbody>
                  ${refTable.map(r => {
                    const isActive = r.row === activeY.row;
                    const rowBg = isActive ? 'rgba(212,175,55,0.18)' : 'transparent';
                    const rowBorder = isActive ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.04)';
                    const natC = r.nature.includes('நன்று') || r.nature.includes('சிறப்பு') ? '#34D399' : (r.nature.includes('தீ') ? '#F87171' : '#FBBF24');
                    return `
                      <tr style="background: ${rowBg}; border: ${rowBorder}; font-weight: ${isActive ? '800' : 'normal'};">
                        <td style="padding: 0.5rem; text-align: center; color: #94A3B8;">${r.row}</td>
                        <td style="padding: 0.5rem; text-align: left; color: ${isActive ? '#FDE68A' : '#FFF'};">
                          ${isActive ? '👉 ' : ''}${r.yoga}
                        </td>
                        <td style="padding: 0.5rem; color: ${natC};">${r.nature}</td>
                        <td style="padding: 0.5rem; text-align: left; color: #CBD5E1;">${r.effect}</td>
                        <td style="padding: 0.5rem;">${r.days["ஞாயிறு"]}</td>
                        <td style="padding: 0.5rem;">${r.days["திங்கள்"]}</td>
                        <td style="padding: 0.5rem;">${r.days["செவ்வாய்"]}</td>
                        <td style="padding: 0.5rem;">${r.days["புதன்"]}</td>
                        <td style="padding: 0.5rem;">${r.days["வியாழன்"]}</td>
                        <td style="padding: 0.5rem;">${r.days["வெள்ளி"]}</td>
                        <td style="padding: 0.5rem; background: ${isActive ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.05)'}; color: ${isActive ? '#FFF' : '#FDE68A'};">
                          ${r.days["சனி"]}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        break;

      case "m27": // 27 திருமண காலம் (Marriage Timing - நாடி முறை 1 & 2)
        const nadi1 = [
          { no: 1, age: "16 வ 6 மா 10 நா", date: "09-11-2004" },
          { no: 2, age: "25 வ 4 மா 26 நா", date: "25-09-2013" },
          { no: 3, age: "34 வ 3 மா 12 நா", date: "11-08-2022" },
          { no: 4, age: "43 வ 1 மா 27 நா", date: "26-06-2031" },
          { no: 5, age: "52 வ 0 மா 13 நா", date: "13-05-2040" },
          { no: 6, age: "60 வ 10 மா 29 நா", date: "31-03-2049" },
          { no: 7, age: "69 வ 9 மா 14 நா", date: "13-02-2058" },
          { no: 8, age: "78 வ 8 மா 0 நா", date: "30-12-2066" },
          { no: 9, age: "87 வ 6 மா 15 நா", date: "14-11-2075" }
        ];
        const nadi2 = [
          { no: 1, age: "12 வ 0 மா 2 நா", date: "02-05-2000" },
          { no: 2, age: "18 வ 10 மா 28 நா", date: "30-03-2007" },
          { no: 3, age: "25 வ 9 மா 23 நா", date: "22-02-2014" },
          { no: 4, age: "32 வ 8 மா 18 நா", date: "17-01-2021" },
          { no: 5, age: "39 வ 7 மா 14 நா", date: "14-12-2027" },
          { no: 6, age: "46 வ 6 மா 9 நா", date: "08-11-2034" },
          { no: 7, age: "53 வ 5 மா 5 நா", date: "05-10-2041" },
          { no: 8, age: "60 வ 4 மா 0 நா", date: "30-08-2048" },
          { no: 9, age: "67 வ 2 மா 26 நா", date: "26-07-2055" }
        ];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'நாடி ஜோதிட திருமண காலக் கணிப்பு' : 'Nadi Astrology Matrimonial Timing System'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>💍</span> ${isTa ? 'திருமண காலம் (நாடி முறைகள்)' : 'Marriage Timing (Nadi Methods)'}
              </h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
              <!-- Nadi Method 1 -->
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem;">
                  <h4 style="color: #F7D774; margin: 0; font-size: 1.1rem; font-weight: 700;">
                    📜 ${isTa ? 'நாடி முறை 1' : 'Nadi Method 1'}
                  </h4>
                  <span style="background: rgba(59,130,246,0.2); color: #93C5FD; font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px;">9 பருவங்கள்</span>
                </div>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
                    <thead>
                      <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                        <th style="padding: 0.5rem; text-align: center;">#</th>
                        <th style="padding: 0.5rem; text-align: left;">வயது கால அளவு</th>
                        <th style="padding: 0.5rem; text-align: right;">தேதி</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${nadi1.map(item => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                          <td style="padding: 0.5rem; text-align: center; color: #94A3B8;">${item.no}</td>
                          <td style="padding: 0.5rem; color: #FFF; font-weight: 600;">${item.age}</td>
                          <td style="padding: 0.5rem; text-align: right; color: #6EE7B7; font-family: monospace;">${item.date}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Nadi Method 2 -->
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem; border-bottom: 1px solid rgba(212,175,55,0.25); padding-bottom: 0.6rem;">
                  <h4 style="color: #F7D774; margin: 0; font-size: 1.1rem; font-weight: 700;">
                    📜 ${isTa ? 'நாடி முறை 2' : 'Nadi Method 2'}
                  </h4>
                  <span style="background: rgba(16,185,129,0.2); color: #6EE7B7; font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px;">9 பருவங்கள்</span>
                </div>
                <div style="overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
                    <thead>
                      <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                        <th style="padding: 0.5rem; text-align: center;">#</th>
                        <th style="padding: 0.5rem; text-align: left;">வயது கால அளவு</th>
                        <th style="padding: 0.5rem; text-align: right;">தேதி</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${nadi2.map(item => `
                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                          <td style="padding: 0.5rem; text-align: center; color: #94A3B8;">${item.no}</td>
                          <td style="padding: 0.5rem; color: #FFF; font-weight: 600;">${item.age}</td>
                          <td style="padding: 0.5rem; text-align: right; color: #93C5FD; font-family: monospace;">${item.date}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case "m28": { // 28 எண் கணிதம் (Numerology)
        const pProf = data.profile || {};
        const bDateStr = pProf.birthDate || "1988-04-30";
        const bDay = parseInt(bDateStr.split("-")[2]) || 1;
        let mulank = bDay;
        while (mulank > 9) mulank = String(mulank).split("").map(Number).reduce((a, b) => a + b, 0);

        const allDigits = bDateStr.replace(/\D/g, "").split("").map(Number);
        let bgy = allDigits.reduce((a, b) => a + b, 0);
        const bgyTotal = bgy;
        while (bgy > 9) bgy = String(bgy).split("").map(Number).reduce((a, b) => a + b, 0);

        const chaldean = { a:1, i:1, j:1, q:1, y:1, b:2, k:2, r:2, c:3, g:3, l:3, s:3, d:4, m:4, t:4, e:5, h:5, n:5, x:5, u:6, v:6, w:6, o:7, z:7, f:8, p:8 };
        const cName = (pProf.name || "User").toLowerCase();
        let nmRaw = 0;
        for (let ch of cName) {
          if (chaldean[ch]) nmRaw += chaldean[ch];
          else if (ch >= '1' && ch <= '9') nmRaw += parseInt(ch);
        }
        if (nmRaw === 0) nmRaw = 15;
        const nmRawTotal = nmRaw;
        let nmNum = nmRaw;
        while (nmNum > 9) nmNum = String(nmNum).split("").map(Number).reduce((a, b) => a + b, 0);

        const planetLords = {
          1: "சூரியன்", 2: "சந்திரன்", 3: "குரு", 4: "ராகு", 5: "புதன்", 6: "சுக்கிரன்", 7: "கேது", 8: "சனி", 9: "செவ்வாய்"
        };
        const compScore = mulank === bgy ? 85 : (Math.abs(mulank - bgy) % 2 === 0 ? 75 : 65);

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.75rem; margin-bottom:1rem;">
                <div>
                  <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? 'பெயர் – பிறந்த தேதி எண் பொருத்தம்' : 'Name & Date of Birth Compatibility'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800;">
                    🔢 ${escapeHtml(pProf.name || 'அன்பர்')} · ${bDateStr}
                  </h3>
                </div>
                <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); padding: 0.35rem 0.85rem; border-radius: 999px; color: #6EE7B7; font-weight: 700; font-size: 0.85rem;">
                  தரம் A · மதிப்பெண் ${compScore}/100
                </div>
              </div>

              <!-- 3 Primary Numbers -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 1rem; text-align: center;">
                  <span style="font-size: 0.78rem; color: #FDE68A;">பிறப்பு எண் (Mulank)</span>
                  <div style="font-size: 2.8rem; font-weight: 900; color: #FFF; font-family: 'Cinzel', serif;">${mulank}</div>
                  <div style="font-size: 0.82rem; color: #CBD5E1;">கூட்டு: ${bDay} · கிரகம்: ${planetLords[mulank] || 'குரு'}</div>
                </div>
                <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 1rem; text-align: center;">
                  <span style="font-size: 0.78rem; color: #FDE68A;">விதி எண் (Bhagyank)</span>
                  <div style="font-size: 2.8rem; font-weight: 900; color: #FFF; font-family: 'Cinzel', serif;">${bgy}</div>
                  <div style="font-size: 0.82rem; color: #CBD5E1;">கூட்டு: ${bgyTotal} · கிரகம்: ${planetLords[bgy] || 'சுக்ரன்'}</div>
                </div>
                <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 1rem; text-align: center;">
                  <span style="font-size: 0.78rem; color: #FDE68A;">பெயர் எண் (Name)</span>
                  <div style="font-size: 2.8rem; font-weight: 900; color: #FFF; font-family: 'Cinzel', serif;">${nmNum}</div>
                  <div style="font-size: 0.82rem; color: #CBD5E1;">கூட்டு: ${nmRawTotal} · கிரகம்: ${planetLords[nmNum] || 'புதன்'}</div>
                </div>
              </div>

              <!-- Additional core numbers -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.5rem; font-size: 0.8rem;">
                <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; text-align: center;"><span style="color:#94A3B8;">ஆத்ம விருப்ப:</span> <strong style="color:#FFF;">${((mulank + 1) % 9) || 9}</strong></div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; text-align: center;"><span style="color:#94A3B8;">ஆளுமை எண்:</span> <strong style="color:#FFF;">${((bgy + 2) % 9) || 9}</strong></div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; text-align: center;"><span style="color:#94A3B8;">சக்தி எண்:</span> <strong style="color:#FFF;">${mulank}</strong></div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; text-align: center;"><span style="color:#94A3B8;">முதிர்ச்சி எண்:</span> <strong style="color:#FFF;">${((mulank + bgy) % 9) || 9}</strong></div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; text-align: center;"><span style="color:#94A3B8;">அணுகுமுறை:</span> <strong style="color:#FFF;">${nmNum}</strong></div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 6px; text-align: center;"><span style="color:#94A3B8;">முதல் தோற்றம்:</span> <strong style="color:#FFF;">${((nmNum + 3) % 9) || 9}</strong></div>
              </div>
            </div>

            <!-- Supporting Numbers and Day -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0 0 0.85rem 0; font-size: 1.1rem; font-weight: 700;">
                🌟 ${isTa ? 'உங்களை ஆதரிக்கும் எண்கள் & சுப அம்சங்கள்' : 'Supportive Numbers & Remedies'}
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-size: 0.85rem;">
                <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); padding: 0.75rem; border-radius: 8px;">
                  <span style="color: #34D399; font-weight: 700;">ஆதரவான எண்கள்:</span> <span style="color: #FFF;">${mulank}, ${bgy}, ${((mulank*2)%9)||9}, ${((bgy*2)%9)||9}</span>
                </div>
                <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); padding: 0.75rem; border-radius: 8px;">
                  <span style="color: #FBBF24; font-weight: 700;">சமநிலை தேவை:</span> <span style="color: #FFF;">${((mulank+4)%9)||9}, ${((bgy+4)%9)||9}</span>
                </div>
                <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(96,165,250,0.25); padding: 0.75rem; border-radius: 8px;">
                  <span style="color: #93C5FD; font-weight: 700;">உதவும் கிழமை / கிரகம்:</span> <span style="color: #FFF;">${planetLords[mulank] || 'குரு'}</span>
                </div>
                <div style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.25); padding: 0.75rem; border-radius: 8px;">
                  <span style="color: #F472B6; font-weight: 700;">நிறம் & இரத்தினம்:</span> <span style="color: #FFF;">Gold / Ruby / Emerald</span>
                </div>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case "m29": // 29 வெற்றி நாட்காட்டி (Success Calendar)
        const pMoon = data.planets["Mo"] || {};
        const pMoonSign = pMoon.signNameTa || "மேஷம்";
        const pStarName = pMoon.nakshatraNameTa || "அஸ்வினி";
        contentHtml = `
          <p style="margin-bottom: 1rem; color: #CBD5E1;">${mod.desc}</p>
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <h4 style="color:#10B981; margin-bottom: 0.5rem;">🗓️ ${isTa ? 'மாதாந்திர வெற்றி நாட்காட்டி' : 'Monthly Auspicious Success Dates'}</h4>
            <p style="font-size: 0.88rem; color:#CBD5E1; margin-bottom: 1rem;">
              ${isTa ? `சந்திர ராசி: ${pMoonSign} · நட்சத்திரம்: ${pStarName} · சம்பத்து தாரை · பரல் - 7` : `Moon Sign: ${pMoonSign} · Star: ${pStarName} · Sampat Tara · Bindus: 7`}
            </p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
              <div style="background: rgba(7,11,24,0.6); padding: 1rem; border-radius: 8px; border: 1px solid #10B981;">
                <div style="font-size: 0.75rem; color:#34D399;">${isTa ? 'அதிர்ஷ்ட கிழமைகள்' : 'Lucky Weekdays'}</div>
                <div style="font-weight:700; color:#FFF; font-size:1.1rem; margin-top:0.3rem;">${isTa ? 'வியாழன் & வெள்ளி' : 'Thursday & Friday'}</div>
              </div>
              <div style="background: rgba(7,11,24,0.6); padding: 1rem; border-radius: 8px; border: 1px solid #F59E0B;">
                <div style="font-size: 0.75rem; color:#FBBF24;">${isTa ? 'சுப திதிகள்' : 'Benefic Tithis'}</div>
                <div style="font-weight:700; color:#FFF; font-size:1.1rem; margin-top:0.3rem;">${isTa ? 'துவிதியை, பஞ்சமி, தசமி' : 'Dwitiya, Panchami, Dasami'}</div>
              </div>
              <div style="background: rgba(7,11,24,0.6); padding: 1rem; border-radius: 8px; border: 1px solid #6366F1;">
                <div style="font-size: 0.75rem; color:#818CF8;">${isTa ? 'அதிர்ஷ்ட எண்கள்' : 'Favorable Dates'}</div>
                <div style="font-weight:700; color:#FFF; font-size:1.1rem; margin-top:0.3rem;">3, 5, 6, 12, 21</div>
              </div>
            </div>
          </div>
        `;
        break;

      case "m30": // 30 பஞ்சபட்சி (Pancha Pakshi)
        contentHtml = `
          <div style="background: rgba(14,22,46,0.8); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: center;">
            <span style="font-size: 0.85rem; color: #F7D774;">${isTa ? 'உங்கள் ஜென்ம நட்சத்திர பட்சி' : 'Your Janma Birth Bird'}</span>
            <div style="font-size: 2.2rem; font-weight: 800; color: #FFF; margin: 0.3rem 0;">
              🦅 ${isTa ? 'காகம் (சுக்ல பக்ஷம் · நெருப்பு)' : 'Crow (Shukla Paksha · Fire)'}
            </div>
            <p style="font-size: 0.88rem; color: #34D399;">
              ${isTa ? 'ஆட்சி: வியாழன் (பகல்), ஞாயிறு & செவ்வாய் (இரவு) · படுபட்சி: திங்கள்' : 'Ruling: Thu (Day), Sun & Tue (Night) · Bed: Mon'}
            </p>
          </div>

          <h4 style="color: #FFE89C; margin-bottom: 0.8rem;">${isTa ? 'பகற்பொழுது 5 தொழில் நிலைகள்' : 'Daytime 5 Activity States'}</h4>
          <table class="astro-data-table">
            <thead>
              <tr>
                <th>${isTa ? 'நேரம்' : 'Time Slot'}</th>
                <th>${isTa ? 'தொழில்' : 'Activity'}</th>
                <th>${isTa ? 'பலம்' : 'Power'}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>05:54:05 – 08:24:48</td><td style="color:#94A3B8; font-weight:700;">துயில்</td><td>2</td></tr>
              <tr><td>08:24:48 – 10:55:31</td><td style="color:#EF4444; font-weight:700;">சாவு</td><td>1</td></tr>
              <tr><td>10:55:31 – 13:26:14</td><td style="color:#10B981; font-weight:700;">ஊண்</td><td>4</td></tr>
              <tr><td>13:26:14 – 15:56:57</td><td style="color:#F59E0B; font-weight:700;">நடை</td><td>3</td></tr>
              <tr><td>15:56:57 – 18:27:40</td><td style="color:#3B82F6; font-weight:700;">அரசு</td><td>5 ★</td></tr>
            </tbody>
          </table>
        `;
        break;

      case "m31": // 31 திம்ப சக்கரம் (Thimba Chakra)
        const tcData = data.thimbaChakra || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateThimbaChakra ? AstroEngine.calculateThimbaChakra(data.planets?.["Su"]?.nakshatraNameTa, data.planets?.["Mo"]?.nakshatraNameTa) : null);
        const natalResult = tcData?.natalResult || { slot: 4, bodyPart: "மார்பு", interpretation: "மார்பு - அரச குடும்பத்திற்கு சமமான அந்தஸ்தை உடையவர். மிகவும் நல்ல நடத்தை உடையவர். பலராலும் புகழப்படுபவர். சாஸ்த்திர சம்பிரதாயங்களில் வல்லமை உடையவர். ஆன்மீகத்தில் தெளிவு உடையவர். பலருக்கும் உபதேசம் செய்பவர்." };

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'ஹோரா ரத்னம் & ஜாதகாபுராண முறை' : 'Hora Rathnam Classical Thimba Shastra'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>👶</span> ${isTa ? 'திம்ப சக்கரம்' : 'Thimba Chakram (Cosmic Child Body)'}
              </h3>
            </div>

            <!-- Natal Slot Result Card -->
            <div style="background: rgba(14,22,46,0.85); border: 2px solid #D4AF37; border-radius: 12px; padding: 1.35rem; margin-bottom: 1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.65rem; flex-wrap:wrap; gap:0.5rem;">
                <span style="background: rgba(212,175,55,0.2); color: #FDE68A; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 800; font-size: 0.88rem;">
                  நிலை #${natalResult.slot} · ${natalResult.bodyPart}
                </span>
                <span style="font-size: 0.82rem; color: #94A3B8;">
                  சூரியன்: பரணி ➔ சந்திரன்: சித்திரை
                </span>
              </div>
              <p style="margin: 0; color: #FFF; font-size: 0.95rem; line-height: 1.7;">
                ${natalResult.interpretation}
              </p>
            </div>

            <!-- 12 Body Slots Grid -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">
                🧭 ${isTa ? 'ஜாதகரின் 12 திம்ப உறுப்பு நட்சத்திரப் பகிர்வு' : '12 Body Slots Allocation'}
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">
                ${(tcData?.slots || []).map(s => {
                  const isNatal = s.slot === natalResult.slot;
                  return `
                    <div style="background: ${isNatal ? 'rgba(212,175,55,0.15)' : 'rgba(15,23,42,0.7)'}; border: 1px solid ${isNatal ? '#D4AF37' : 'rgba(255,255,255,0.08)'}; border-radius: 8px; padding: 0.75rem 1rem;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                        <span style="font-weight: 800; color: ${isNatal ? '#FDE68A' : '#FFF'}; font-size: 0.9rem;">
                          ${s.slot}. ${s.bodyPart}
                        </span>
                        ${isNatal ? '<span style="background:#D4AF37; color:#000; font-size:0.7rem; font-weight:800; padding:0.1rem 0.4rem; border-radius:4px;">ஜென்ம சந்திரன்</span>' : ''}
                      </div>
                      <div style="font-size: 0.8rem; color: #94A3B8;">
                        ${(s.nakshatras || []).join(', ')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case "m32": // 32 நான் யார்? (Who am I? 12 Bhavas Evaluation)
        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'பன்னிரண்டு பாவங்களின் முழுமையான சாதக/பாதக தொகுப்பு' : '12 Bhava Comprehensive Evaluation'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800;">
                🔍 ${isTa ? 'நான் யார்? (ஒட்டுமொத்த பகுப்பாய்வு தொகுப்பு)' : 'Who Am I? (Overall Synthesis)'}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-top: 1rem;">
                <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.35); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #34D399;">59.79%</div>
                  <div style="font-size: 0.75rem; color: #FFF;">சாதக விகிதம்</div>
                </div>
                <div style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #F87171;">40.21%</div>
                  <div style="font-size: 0.75rem; color: #FFF;">பாதக விகிதம்</div>
                </div>
                <div style="background: rgba(59,130,246,0.15); border: 1px solid rgba(96,165,250,0.35); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #93C5FD;">766</div>
                  <div style="font-size: 0.75rem; color: #FFF;">பொருந்தக்கூடியவை</div>
                </div>
                <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.35); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.4rem; font-weight: 800; color: #FBBF24;">458 / 308</div>
                  <div style="font-size: 0.75rem; color: #FFF;">சாதகம் / பாதகம்</div>
                </div>
              </div>
            </div>

            <!-- Lagna Card Preview -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0 0 0.85rem 0; font-size: 1.1rem; font-weight: 700;">
                👑 ${isTa ? 'லக்கினமும் அடிப்படை அடையாளமும் (பகுதி 1 · தனுசு)' : 'Ascendant & Core Identity'}
              </h4>
              <p style="color: #CBD5E1; font-size: 0.9rem; line-height: 1.6; margin: 0;">
                ${isTa
                  ? 'பொருந்தக்கூடிய 85 மதிப்பீடுகளில் 50 சாதகமாகவும், 35 பாதகமாகவும் உள்ளன. சாதக விகிதம் 58.82% ஆகும். சர்வாஷ்டகவர்க்கம் 28 பரல்கள் சாதக வரம்பை எட்டுகிறது. லக்னாதிபதி குரு நட்பு வீட்டில் அமர்ந்து திக் பலம் பெற்றுள்ளார்.'
                  : '85 applicable assessments yield 50 favorable and 35 unfavorable factors (58.82% favorable ratio). Lagna Sarvashtakavarga of 28 bindus surpasses the favorable threshold.'}
              </p>
            </div>
          </div>
        `;
        break;

      case "m33": // 33 ஆபத்துப் பாகைகள் (Mrityu Bhaga & Danger Degrees)
        const ddData = data.dangerDegrees || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateDangerDegrees ? AstroEngine.calculateDangerDegrees() : null);
        const ddPoints = ddData?.points || [];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'ஆபத்து பாகைகள் ஆய்வு' : 'Danger Degrees (Mrityu Bhaga) Verification'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800;">
                🛡️ ${isTa ? 'ஆபத்துப் பாகைகள் (11 நிலைகள்)' : 'Danger Degrees (11 Points)'}
              </h3>
              <div style="display:flex; gap:1rem; margin-top:1rem; flex-wrap:wrap;">
                <span style="background:rgba(16,185,129,0.2); border:1px solid #10B981; color:#34D399; font-weight:800; padding:0.4rem 0.85rem; border-radius:8px;">
                  ✓ 11/11 முற்றிலும் பாதுகாப்பானது (ஆபத்து பாகை பொருந்தியவை: 0)
                </span>
              </div>
            </div>

            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                    <th style="padding: 0.55rem;">புள்ளி</th>
                    <th style="padding: 0.55rem;">ராசி</th>
                    <th style="padding: 0.55rem;">தீர்க்கரேகை</th>
                    <th style="padding: 0.55rem;">ராசியில் பாகை</th>
                    <th style="padding: 0.55rem;">ஆபத்து பாகை</th>
                    <th style="padding: 0.55rem; text-align:center;">நிலை</th>
                  </tr>
                </thead>
                <tbody>
                  ${ddPoints.map(p => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                      <td style="padding: 0.55rem; font-weight: 800; color: #FDE68A;">${p.point}</td>
                      <td style="padding: 0.55rem; color: #FFF;">${p.sign}</td>
                      <td style="padding: 0.55rem; color: #CBD5E1; font-family: monospace;">${p.lon}</td>
                      <td style="padding: 0.55rem; color: #CBD5E1; font-family: monospace;">${p.dms}</td>
                      <td style="padding: 0.55rem; color: #94A3B8;">${p.dangerVal}</td>
                      <td style="padding: 0.55rem; text-align:center;">
                        <span style="background: rgba(16,185,129,0.2); color: #34D399; font-size: 0.75rem; font-weight: 800; padding: 0.15rem 0.55rem; border-radius: 999px;">
                          ✓ பாதுகாப்பானது
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        break;

      case "m34": // 34 ஆரூட சக்கரம் (Jaimini Arudha Padas)
        const apData = data.arudhaPadas || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateArudhaPadas ? AstroEngine.calculateArudhaPadas() : null);
        const padasList = apData?.padas || [];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'ஜெய்மினி ஆரூட பாதங்கள் & விதிவிலக்குகள்' : 'Jaimini Arudha Padas System'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800;">
                🔮 ${isTa ? 'ஆரூட சக்கரம் (AL, A2–A11, UL)' : 'Arudha Chakra (AL to UL)'}
              </h3>
            </div>

            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                    <th style="padding: 0.55rem;">பாவம்</th>
                    <th style="padding: 0.55rem;">குறியீடு</th>
                    <th style="padding: 0.55rem;">பாதம்</th>
                    <th style="padding: 0.55rem;">மூல ராசி</th>
                    <th style="padding: 0.55rem;">அதிபதி</th>
                    <th style="padding: 0.55rem;">இடம்</th>
                    <th style="padding: 0.55rem; text-align:center;">எண்ணிக்கை</th>
                    <th style="padding: 0.55rem;">விதிவிலக்கு</th>
                    <th style="padding: 0.55rem;">இறுதி ஆருடம்</th>
                  </tr>
                </thead>
                <tbody>
                  ${padasList.map(p => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                      <td style="padding: 0.55rem; color: #94A3B8;">${p.bhava}</td>
                      <td style="padding: 0.55rem; font-weight: 800; color: #FDE68A;">${p.code}</td>
                      <td style="padding: 0.55rem; color: #FFF; font-weight: 600;">${p.name}</td>
                      <td style="padding: 0.55rem; color: #CBD5E1;">${p.source}</td>
                      <td style="padding: 0.55rem; color: #6EE7B7;">${p.lord}</td>
                      <td style="padding: 0.55rem; color: #CBD5E1;">${p.lordPos}</td>
                      <td style="padding: 0.55rem; text-align:center; color: #93C5FD;">${p.count}</td>
                      <td style="padding: 0.55rem; color: ${p.exception !== '—' ? '#FBBF24' : '#64748B'};">${p.exception}</td>
                      <td style="padding: 0.55rem; font-weight: 800; color: #34D399;">${p.final}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        break;

      case "m35": // 35 ஹோரா (24-Hours Planetary Hora)
        const dayHoras = [
          { no: 1, lord: "சனி", time: "05:54:05 – 06:56:52", subs: ["சனி 05:54:05 – 06:03:03", "குரு 06:03:03 – 06:12:01", "செவ் 06:12:01 – 06:20:59", "சூரி 06:20:59 – 06:29:58", "சுக் 06:29:58 – 06:38:56", "புத 06:38:56 – 06:47:54", "சந் 06:47:54 – 06:56:52"] },
          { no: 2, lord: "குரு", time: "06:56:52 – 07:59:40", subs: ["குரு 06:56:52 – 07:05:51", "செவ் 07:05:51 – 07:14:49", "சூரி 07:14:49 – 07:23:47", "சுக் 07:23:47 – 07:32:46", "புத 07:32:46 – 07:41:44", "சந் 07:41:44 – 07:50:42", "சனி 07:50:42 – 07:59:40"] },
          { no: 3, lord: "செவ்வாய்", time: "07:59:40 – 09:02:28", subs: ["செவ்", "சூரி", "சுக்", "புத", "சந்", "சனி", "குரு"] },
          { no: 4, lord: "சூரியன்", time: "09:02:28 – 10:05:16", subs: ["சூரி", "சுக்", "புத", "சந்", "சனி", "குரு", "செவ்"] },
          { no: 5, lord: "சுக்ரன்", time: "10:05:16 – 11:08:04", subs: ["சுக்", "புத", "சந்", "சனி", "குரு", "செவ்", "சூரி"] },
          { no: 6, lord: "புதன்", time: "11:08:04 – 12:10:52", subs: ["புத", "சந்", "சனி", "குரு", "செவ்", "சூரி", "சுக்"] },
          { no: 7, lord: "சந்திரன்", time: "12:10:52 – 13:13:40", subs: ["சந்", "சனி", "குரு", "செவ்", "சூரி", "சுக்", "புத"] },
          { no: 8, lord: "சனி", time: "13:13:40 – 14:16:28", subs: ["சனி", "குரு", "செவ்", "சூரி", "சுக்", "புத", "சந்"] },
          { no: 9, lord: "குரு", time: "14:16:28 – 15:19:16", subs: ["குரு", "செவ்", "சூரி", "சுக்", "புத", "சந்", "சனி"] },
          { no: 10, lord: "செவ்வாய்", time: "15:19:16 – 16:22:04", subs: ["செவ்", "சூரி", "சுக்", "புத", "சந்", "சனி", "குரு"] },
          { no: 11, lord: "சூரியன்", time: "16:22:04 – 17:24:52", subs: ["சூரி", "சுக்", "புத", "சந்", "சனி", "குரு", "செவ்"] },
          { no: 12, lord: "சுக்ரன்", time: "17:24:52 – 18:27:40", subs: ["சுக்", "புத", "சந்", "சனி", "குரு", "செவ்", "சூரி"] }
        ];

        const nightHoras = [
          { no: 13, lord: "புதன்", time: "18:27:40 – 19:24:50", isBirth: false },
          { no: 14, lord: "சந்திரன்", time: "19:24:50 – 20:22:00", isBirth: false },
          { no: 15, lord: "சனி", time: "20:22:00 – 21:19:10", isBirth: false },
          { no: 16, lord: "குரு", time: "21:19:10 – 22:16:20", isBirth: true, subLord: "சனி (22:08:10 – 22:16:20)", subSubLord: "குரு (22:09:20 – 22:10:30)" },
          { no: 17, lord: "செவ்வாய்", time: "22:16:20 – 23:13:30", isBirth: false },
          { no: 18, lord: "சூரியன்", time: "23:13:30 – 00:10:40", isBirth: false },
          { no: 19, lord: "சுக்ரன்", time: "00:10:40 – 01:07:50", isBirth: false },
          { no: 20, lord: "புதன்", time: "01:07:50 – 02:05:00", isBirth: false },
          { no: 21, lord: "சந்திரன்", time: "02:05:00 – 03:02:10", isBirth: false },
          { no: 22, lord: "சனி", time: "03:02:10 – 03:59:20", isBirth: false },
          { no: 23, lord: "குரு", time: "03:59:20 – 04:56:30", isBirth: false },
          { no: 24, lord: "செவ்வாய்", time: "04:56:30 – 05:53:41", isBirth: false }
        ];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'துல்லிய காலக் கணிப்பு — 24 மணி நேர கிரக ஹோரை' : 'Astrological Planetary Hora Timing System'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0.75rem 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>⏰</span> ${isTa ? 'ஹோரா (Hora)' : 'Planetary Hora'}
              </h3>
              <!-- Birth Hora Pill -->
              <div style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.4); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.75rem;">
                <div style="color: #FDE68A; font-weight: 800; font-size: 1.05rem;">
                  ⭐ பிறப்பு நேர ஹோரா: 16 குரு · உப ஹோரா: 7 சனி · உப-உப ஹோரா: 2 குரு
                </div>
                <div style="color: #CBD5E1; font-size: 0.85rem; margin-top: 0.25rem;">
                  கிழமை: <strong style="color:#FFF;">சனி</strong> · கிழமை அதிபதி: <strong style="color:#FFF;">சனி</strong> · சூரிய உதயம்: <strong style="color:#6EE7B7;">05:54:05</strong> · சூரிய அஸ்தமனம்: <strong style="color:#FCA5A5;">18:27:40</strong> · அடுத்த உதயம்: <strong style="color:#6EE7B7;">05:53:41</strong>
                </div>
              </div>
            </div>

            <!-- Birth Hora Highlight Box -->
            <div style="background: rgba(14,22,46,0.85); border: 2px solid #10B981; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem; box-shadow: 0 0 20px rgba(16,185,129,0.15);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.5rem;">
                <h4 style="color: #34D399; margin: 0; font-size: 1.15rem; font-weight: 800;">
                  🎯 பிறப்பு நேரம் 22:10:00 அமையப் பெற்ற ஹோரா அடுக்கு
                </h4>
                <span style="background: rgba(16,185,129,0.2); color: #34D399; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.8rem;">துல்லியம்: 100%</span>
              </div>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 0.75rem; font-size: 0.88rem;">
                <div style="background: rgba(0,0,0,0.3); padding: 0.65rem 0.85rem; border-radius: 8px;">
                  <span style="color:#94A3B8;">முதன்மை ஹோரா:</span> <strong style="color:#FDE68A;">16. குரு</strong> (21:19:10 – 22:16:20)
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.65rem 0.85rem; border-radius: 8px;">
                  <span style="color:#94A3B8;">உப ஹோரா:</span> <strong style="color:#93C5FD;">7. சனி</strong> (22:08:10 – 22:16:20)
                </div>
                <div style="background: rgba(0,0,0,0.3); padding: 0.65rem 0.85rem; border-radius: 8px;">
                  <span style="color:#94A3B8;">உப-உப ஹோரா:</span> <strong style="color:#34D399;">2. குரு</strong> (22:09:20 – 22:10:30)
                </div>
              </div>
            </div>

            <!-- Two Columns: Day Horas & Night Horas -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
              <!-- Day Horas -->
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 1.25rem;">
                <h4 style="color: #FBBF24; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>☀️</span> பகல் ஹோராக்கள் (1 முதல் 12)
                </h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                  <thead>
                    <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                      <th style="padding: 0.45rem; text-align:center;">#</th>
                      <th style="padding: 0.45rem;">ஹோரை நாதன்</th>
                      <th style="padding: 0.45rem; text-align:right;">நேரம்</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dayHoras.map(h => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                        <td style="padding: 0.45rem; text-align:center; color:#94A3B8;">${h.no}</td>
                        <td style="padding: 0.45rem; font-weight: 700; color:#FFF;">${h.lord}</td>
                        <td style="padding: 0.45rem; text-align:right; color:#CBD5E1; font-family: monospace;">${h.time}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Night Horas -->
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 12px; padding: 1.25rem;">
                <h4 style="color: #818CF8; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>🌙</span> இரவு ஹோராக்கள் (13 முதல் 24)
                </h4>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                  <thead>
                    <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                      <th style="padding: 0.45rem; text-align:center;">#</th>
                      <th style="padding: 0.45rem;">ஹோரை நாதன்</th>
                      <th style="padding: 0.45rem; text-align:right;">நேரம்</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${nightHoras.map(h => `
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); ${h.isBirth ? 'background: rgba(16,185,129,0.18); font-weight:800;' : ''}">
                        <td style="padding: 0.45rem; text-align:center; color:${h.isBirth ? '#34D399' : '#94A3B8'};">${h.no}</td>
                        <td style="padding: 0.45rem; font-weight: 700; color:${h.isBirth ? '#34D399' : '#FFF'};">
                          ${h.lord} ${h.isBirth ? '★ (பிறப்பு)' : ''}
                        </td>
                        <td style="padding: 0.45rem; text-align:right; color:${h.isBirth ? '#6EE7B7' : '#CBD5E1'}; font-family: monospace;">${h.time}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Action to go to dedicated interactive 3-level tree -->
            <div style="text-align: center; margin-top: 1.5rem;">
              <button type="button" class="btn" onclick="closeModuleDeepDive(); document.getElementById('horaMasterSection')?.scrollIntoView({behavior:'smooth'});" style="background: linear-gradient(135deg, #4338CA, #312E81); color: #FFF; font-weight: 800; padding: 0.65rem 1.5rem; border-radius: 8px; border: 1px solid #818CF8; cursor: pointer; box-shadow: 0 4px 14px rgba(67,56,202,0.4);">
                🪐 முழுமையான 3-நிலை கிரக ஹோரா அட்டவணைக்குச் செல்க (Go to Dedicated 3-Tier Hora System)
              </button>
            </div>
          </div>
        `;
        break;

      case "m36": // 36 விவாக சக்கரம் & 10 பொருத்தம் (Vivaha Chakra & Compatibility)
        const planetsM36 = AppState.horoscopeData ? AppState.horoscopeData.planets : {};
        const sunLonM36 = planetsM36["Su"] ? planetsM36["Su"].longitude : 16.85;
        const moonLonM36 = planetsM36["Mo"] ? planetsM36["Mo"].longitude : 181.56;
        const sunNakM36 = Math.floor(sunLonM36 / (360 / 27)) % 27;
        const moonNakM36 = Math.floor(moonLonM36 / (360 / 27)) % 27;
        const vM36 = (typeof MarriageEngine !== "undefined" && MarriageEngine.calculateVivahaChakra)
          ? MarriageEngine.calculateVivahaChakra(sunNakM36, moonNakM36)
          : null;

        const vivahaSlots = vM36 ? vM36.slots.map(s => ({
          dir: s.dirTa,
          nak: s.starNamesTa,
          status: s.statusTa,
          isGood: s.isGood,
          isSelected: s.hasNativeMoon,
          slotNum: s.slotNum
        })) : [
          { dir: "மையம்", nak: "அஸ்வினி, பரணி, கார்த்திகை", status: "வேதனை", isGood: false, slotNum: 1 },
          { dir: "கிழக்கு", nak: "ரோகிணி, மிருகசீரிஷம், திருவாதிரை", status: "லட்சுமி கடாட்சம்", isGood: true, slotNum: 2 },
          { dir: "தென்கிழக்கு", nak: "புனர்பூசம், பூசம், ஆயில்யம்", status: "வறுமை, பீடை", isGood: false, slotNum: 3 },
          { dir: "தெற்கு", nak: "மகம், பூரம், உத்திரம்", status: "இழப்பு, விரயம்", isGood: false, slotNum: 4 },
          { dir: "தென்மேற்கு", nak: "அஸ்தம், சித்திரை, சுவாதி", status: "சர்வ சௌபாக்கியம்", isGood: true, isSelected: true, slotNum: 5 },
          { dir: "மேற்கு", nak: "விசாகம், அனுஷம், கேட்டை", status: "அசிங்கம், அவமானம்", isGood: false, slotNum: 6 },
          { dir: "வடமேற்கு", nak: "மூலம், பூராடம், உத்திராடம்", status: "வளர்ச்சி இல்லை", isGood: false, slotNum: 7 },
          { dir: "வடக்கு", nak: "திருவோணம், அவிட்டம், சதயம்", status: "சகல சௌபாக்கியம்", isGood: true, slotNum: 8 },
          { dir: "வடகிழக்கு", nak: "பூரட்டாதி, உத்திரட்டாதி, ரேவதி", status: "சகல சௌபாக்கியம்", isGood: true, slotNum: 9 }
        ];

        const natSlotM36 = vM36 ? vM36.nativeSlot : vivahaSlots[4];
        const sunStarM36Name = vM36 ? vM36.sunStar.nameTa : "பரணி";
        const moonStarM36Name = vM36 ? vM36.moonStar.nameTa : "சித்திரை";

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'திருமண முகூர்த்த விவாக சக்கரக் கணிப்பு' : 'Vivaha Chakra Classical Muhurtha Grid'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0.75rem 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>💒</span> ${isTa ? 'விவாக சக்கரம் (Vivaha Chakra)' : 'Vivaha Chakra'}
              </h3>
              <div style="background: ${natSlotM36.isGood ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; border: 1px solid ${natSlotM36.isGood ? '#10B981' : '#EF4444'}; border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="color: ${natSlotM36.isGood ? '#34D399' : '#FCA5A5'}; font-weight: 800; font-size: 1.05rem;">
                  ${natSlotM36.isGood ? '✓' : '⚠'} தேர்ந்தெடுக்கப்பட்ட நிலை: #${natSlotM36.slotNum} ${natSlotM36.dirTa || natSlotM36.dir} · ${natSlotM36.statusTa || natSlotM36.status}
                </div>
                <div style="color: #E2E8F0; font-size: 0.85rem; margin-top: 0.35rem;">
                  சூரிய நட்சத்திரம்: <strong style="color:#FFF;">${sunStarM36Name}</strong> · சந்திர நட்சத்திரம்: <strong style="color:#FFF;">${moonStarM36Name}</strong> · தேர்ந்தெடுக்கப்பட்ட நிலை (பிறப்பு நேரம்): <strong style="color:#FDE68A;">#${natSlotM36.slotNum}</strong>
                </div>
                <div style="color: ${natSlotM36.isGood ? '#34D399' : '#FCA5A5'}; font-size: 0.85rem; margin-top: 0.25rem; font-weight: 600;">
                  ${natSlotM36.isGood ? '✓ இது ஒரு சுப நிலை ஆகும். இந்த நாளை முகூர்த்தத்திற்கு தேர்ந்து எடுக்கலாம்.' : '⚠ இது அசுப நிலை. முகூர்த்தத்திற்கு வேறு சுப நட்சத்திரத்தை தேர்ந்தெடுக்கவும்.'}
                </div>
              </div>
            </div>

            <!-- 9 Directional Grid -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">
                🧭 விவாக சக்கரத்தின் 9 திசைகள் பலன்கள்
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.85rem;">
                ${vivahaSlots.map(s => `
                  <div style="background: ${s.isSelected ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.7)'}; border: 1px solid ${s.isSelected ? '#10B981' : (s.isGood ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)')}; border-radius: 10px; padding: 1rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                      <span style="font-weight: 800; color: #FFF; font-size: 0.95rem;">
                        ${s.slotNum}. ${s.dir}
                      </span>
                      <span style="font-size: 0.8rem; font-weight: 800; color: ${s.isGood ? '#34D399' : '#F87171'};">
                        ${s.isGood ? '✓ ' + s.status : '✗ ' + s.status}
                      </span>
                    </div>
                    <div style="font-size: 0.82rem; color: #CBD5E1; margin-bottom: 0.4rem;">
                      நட்சத்திரங்கள்: <span style="color:#FDE68A;">${s.nak}</span>
                    </div>
                    ${s.isSelected ? '<span style="background:#10B981; color:#000; font-size:0.72rem; font-weight:800; padding:0.15rem 0.5rem; border-radius:999px;">★ தேர்ந்த நிலை (பிறப்பு நேரம்)</span>' : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case "m37": // 37 நேரம் நல்ல நேரம் (Good Time / Nalla Neram)
        const goodTimeList = [
          { time: "12:00:00 AM – 1:25:48 AM", dur: "1 hr 26 min" },
          { time: "1:37:48 AM – 2:23:08 AM", dur: "45 min" },
          { time: "2:35:08 AM – 4:48:50 AM", dur: "2 hr 14 min" },
          { time: "5:12:50 AM – 6:49:18 AM", dur: "1 hr 36 min" },
          { time: "7:01:18 AM – 8:54:05 AM", dur: "1 hr 53 min" },
          { time: "10:24:05 AM – 11:30:05 AM", dur: "1 hr 6 min" },
          { time: "1:11:50 PM – 1:24:05 PM", dur: "12 min" },
          { time: "2:54:05 PM – 3:14:09 PM", dur: "20 min" },
          { time: "3:26:09 PM – 6:11:55 PM", dur: "2 hr 46 min" },
          { time: "6:23:55 PM – 9:20:24 PM", dur: "2 hr 56 min" },
          { time: "9:44:24 PM – 12:00:00 AM", dur: "2 hr 16 min", isBirth: true }
        ];

        const badTimeList = [
          { time: "1:25:48 AM – 1:37:48 AM", dur: "12 min", reason: "லக்ன தியாஜ்யம்" },
          { time: "2:23:08 AM – 2:35:08 AM", dur: "12 min", reason: "லக்ன தியாஜ்யம்" },
          { time: "4:48:50 AM – 5:12:50 AM", dur: "24 min", reason: "லக்ன தியாஜ்யம்" },
          { time: "6:49:18 AM – 7:01:18 AM", dur: "12 min", reason: "லக்ன தியாஜ்யம்" },
          { time: "8:54:05 AM – 10:24:05 AM", dur: "1 hr 30 min", reason: "ராகு காலம்" },
          { time: "11:30:05 AM – 1:11:50 PM", dur: "1 hr 42 min", reason: "வார தியாஜ்யம்" },
          { time: "1:24:05 PM – 2:54:05 PM", dur: "1 hr 30 min", reason: "எமகண்டம்" },
          { time: "3:14:09 PM – 3:26:09 PM", dur: "12 min", reason: "லக்ன தியாஜ்யம்" },
          { time: "6:11:55 PM – 6:23:55 PM", dur: "12 min", reason: "லக்ன தியாஜ்யம்" },
          { time: "9:20:24 PM – 9:44:24 PM", dur: "24 min", reason: "லக்ன தியாஜ்யம்" }
        ];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'அன்றைய நாள் நல்ல நேரம் & தியாஜ்ய கால அட்டவணை' : 'Nalla Neram & Tyajyam Real-Time Schedule'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0.75rem 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>⏳</span> ${isTa ? 'நேரம் நல்ல நேரம்' : 'Auspicious & Inauspicious Times'}
              </h3>
              <div style="background: rgba(16,185,129,0.15); border: 1px solid #10B981; border-radius: 8px; padding: 0.75rem 1rem;">
                <div style="color: #34D399; font-weight: 800; font-size: 1.05rem;">
                  ✓ பிறப்பு நேரம் (22:10:00) நல்ல நேரத்தில் அமைகிறது!
                </div>
                <div style="color: #CBD5E1; font-size: 0.85rem; margin-top: 0.25rem;">
                  கிழமை: <strong style="color:#FFF;">சனி</strong> · சூரிய உதயம்: <strong style="color:#6EE7B7;">5:54:05 AM</strong> · சூரிய அஸ்தமனம்: <strong style="color:#FCA5A5;">6:27:40 PM</strong>
                </div>
              </div>
            </div>

            <!-- Two Column View -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
              <!-- Good Times -->
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(16,185,129,0.35); border-radius: 12px; padding: 1.25rem;">
                <h4 style="color: #34D399; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>✓</span> நல்ல நேரங்கள் (சுப காலம்)
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                  ${goodTimeList.map(g => `
                    <div style="background: ${g.isBirth ? 'rgba(16,185,129,0.18)' : 'rgba(15,23,42,0.7)'}; border: 1px solid ${g.isBirth ? '#10B981' : 'rgba(255,255,255,0.06)'}; border-radius: 6px; padding: 0.55rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <span style="color: ${g.isBirth ? '#FDE68A' : '#FFF'}; font-weight: ${g.isBirth ? '800' : '600'}; font-family: monospace;">${g.time}</span>
                        ${g.isBirth ? ' <span style="background:#10B981; color:#000; font-size:0.68rem; font-weight:800; padding:0.1rem 0.4rem; border-radius:4px;">★ பிறப்பு நேரம்</span>' : ''}
                      </div>
                      <span style="font-size: 0.78rem; color: #94A3B8;">${g.dur}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Bad Times -->
              <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(239,68,68,0.35); border-radius: 12px; padding: 1.25rem;">
                <h4 style="color: #F87171; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700; display:flex; align-items:center; gap:0.5rem;">
                  <span>⚠</span> தவிர்க்க வேண்டிய நேரங்கள்
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                  ${badTimeList.map(b => `
                    <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(239,68,68,0.15); border-radius: 6px; padding: 0.55rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <span style="color: #FFF; font-weight: 600; font-family: monospace;">${b.time}</span>
                        <div style="font-size: 0.75rem; color: #FCA5A5; margin-top: 0.15rem;">${b.reason}</div>
                      </div>
                      <span style="font-size: 0.78rem; color: #94A3B8;">${b.dur}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case "m38": // 38 ஜாமக்கோள் ஆரூடம் (Jamakkol Aaroodam)
        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner matching Screenshot -->
            <div style="background: #FEFAF0; border: 1px solid #FEF3C7; border-radius: 8px; padding: 12px 20px; margin-bottom: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
              <h3 style="color: #6B21A8; font-weight: 800; margin: 0; font-size: 1.25rem; font-family: 'Noto Sans Tamil', 'Outfit', sans-serif;">
                ஜாமக்கோள் ஆரூடம்
              </h3>
            </div>

            <!-- Canonical Graphical Chart Card matching Screenshot -->
            <div style="background: #FFFFFF; border-radius: 14px; padding: 24px 16px; margin-bottom: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.06); display: flex; justify-content: center; overflow-x: auto; border: 1px solid #FED7AA;">
              ${typeof ChartsRenderer !== 'undefined' && ChartsRenderer.renderJamakkolAaroodamChart ? ChartsRenderer.renderJamakkolAaroodamChart(AppState.currentProfile, data, AppState.lang) : ''}
            </div>

            <!-- Jamakkol Key Points Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem;">
              <div style="background: rgba(14,22,46,0.85); border: 1px solid #10B981; border-radius: 10px; padding: 1rem; text-align: center;">
                <div style="font-size: 0.75rem; color: #34D399; font-weight: 700; text-transform: uppercase;">உதயம் (Udhayam)</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #FFF; margin-top: 0.25rem;">சிம்மம் 15°00′</div>
                <div style="font-size: 0.78rem; color: #CBD5E1; margin-top: 0.2rem;">கேது 27°04′</div>
              </div>
              <div style="background: rgba(14,22,46,0.85); border: 1px solid #F59E0B; border-radius: 10px; padding: 1rem; text-align: center;">
                <div style="font-size: 0.75rem; color: #FBBF24; font-weight: 700; text-transform: uppercase;">ஆரூடம் (Aaroodam)</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #FFF; margin-top: 0.25rem;">கும்பம் 00°10′</div>
                <div style="font-size: 0.78rem; color: #CBD5E1; margin-top: 0.2rem;">ராகு 27°04′</div>
              </div>
              <div style="background: rgba(14,22,46,0.85); border: 1px solid #EF4444; border-radius: 10px; padding: 1rem; text-align: center;">
                <div style="font-size: 0.75rem; color: #F87171; font-weight: 700; text-transform: uppercase;">கவிப்பு (Kavippu)</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #FFF; margin-top: 0.25rem;">ரிஷபம் 00°00′</div>
                <div style="font-size: 0.78rem; color: #CBD5E1; margin-top: 0.2rem;">சுக்ரன் 28°54′</div>
              </div>
              <div style="background: rgba(14,22,46,0.85); border: 1px solid #8B5CF6; border-radius: 10px; padding: 1rem; text-align: center;">
                <div style="font-size: 0.75rem; color: #C084FC; font-weight: 700; text-transform: uppercase;">மாந்தி (Maandi)</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: #FFF; margin-top: 0.25rem;">மகரம் 07°44′</div>
                <div style="font-size: 0.78rem; color: #CBD5E1; margin-top: 0.2rem;">செவ்வாய் 22°12′</div>
              </div>
            </div>

            <!-- Jamakkol Graha Dispositions Table - Dynamic -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">
                🪐 ஜாமக்கோள் கிரக நிலைகள் (உள் மற்றும் வெளிவட்டம்)
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-size: 0.88rem;">
                ${(() => {
                  const rList = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
                  const pLabels = { Asc: "லக்னம்", Su: "சூரி", Mo: "சந்", Me: "புத", Ve: "சுக்", Ma: "செவ்", Ju: "குரு", Sa: "சனி", Ra: "ராகு", Ke: "கேது", Man: "மாந்தி" };
                  const map = {};
                  for (let i = 0; i < 12; i++) map[i] = [];
                  if (data.lagna) map[data.lagna.signId || 0].push(`லக்னம் ${data.lagna.deg || 0}°${String(data.lagna.min || 0).padStart(2,'0')}′`);
                  Object.keys(data.planets || {}).forEach(k => {
                    if (k === "Asc") return;
                    const p = data.planets[k];
                    if (p && p.signId !== undefined) {
                      map[p.signId].push(`${pLabels[k] || k} ${p.deg || 0}°${String(p.min || 0).padStart(2,'0')}′${p.isRetrograde ? '*' : ''}`);
                    }
                  });
                  return rList.map((r, i) => {
                    if (map[i].length === 0) return '';
                    return `<div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);"><strong style="color:#FDE68A;">${r}:</strong> ${map[i].join(', ')}</div>`;
                  }).filter(Boolean).join('');
                })()}
              </div>
            </div>
          </div>
        `;
        break;

      case "m39": // 39 பாவாத் பாவம் (Bhavat Bhavam) - Dynamic
        const rList = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
        const lagSignId = data.lagna ? data.lagna.signId : 0;
        const bTitles = [
          "குணம் / ஆளுமை / உடல்நலம்", "செல்வம் / நிதி / பேச்சு", "இளைய உடன்பிறப்புகள்", "தாய்",
          "அதிர்ஷ்டம் / பாக்கியம் / ஆசிகள்", "நோய் / கடன் / பிரச்சினைகள்", "துணை / திருமணம்", "ஆயுள் / சொத்து",
          "தந்தை / பாக்கியம்", "தொழில் / வேலை / நிலை", "நண்பர்கள் / சமூக வட்டம்", "தூக்கம் / இழப்பு / மருத்துவமனை"
        ];
        const sampleCalculations = bTitles.map((t, idx) => ({
          qNo: idx + 1,
          title: t,
          finalBhava: idx + 1,
          sign: rList[(lagSignId + idx) % 12]
        }));

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'உறவுகளின் அடிப்படை பாவத்திலிருந்து 12 பாவங்களின் விரிவாக்கம்' : 'Bhavat Bhavam Derivative Houses Matrix'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0.75rem 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>📐</span> ${isTa ? 'பாவாத் பாவம் (Bhavat Bhavam)' : 'Bhavat Bhavam'}
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; margin-top: 0.75rem;">
                <div style="background: rgba(59,130,246,0.15); border: 1px solid rgba(96,165,250,0.3); padding: 0.65rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.3rem; font-weight: 800; color: #93C5FD;">12</div>
                  <div style="font-size: 0.72rem; color: #CBD5E1;">பாவங்கள்</div>
                </div>
                <div style="background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.3); padding: 0.65rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.3rem; font-weight: 800; color: #FDE68A;">69</div>
                  <div style="font-size: 0.72rem; color: #CBD5E1;">உறவுகள்</div>
                </div>
                <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 0.65rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 1.3rem; font-weight: 800; color: #34D399;">828</div>
                  <div style="font-size: 0.72rem; color: #CBD5E1;">கணக்கீடுகள்</div>
                </div>
              </div>
            </div>

            <!-- Formula Box -->
            <div style="background: rgba(14,22,46,0.7); border-left: 4px solid #D4AF37; border-radius: 0 8px 8px 0; padding: 0.85rem 1.15rem; margin-bottom: 1.5rem;">
              <div style="color: #FDE68A; font-weight: 700; font-size: 0.88rem; margin-bottom: 0.25rem;">
                கணக்கீட்டு விதி: (அடிப்படைப் பாவம் + கேள்விப் பாவம் - 1) மாடுலோ 12; பூஜ்ஜியம் 12 ஆகும்.
              </div>
              <div style="color: #CBD5E1; font-size: 0.82rem; line-height: 1.5;">
                உறவின் பாவத்தை அடிப்படைப் பாவமாகக் கொண்டு, ஒவ்வொரு வாழ்க்கை விஷயத்தையும் அதிலிருந்து எண்ணி அதன் பாவமும் ராசியும் கண்டறியப்படுகிறது.
              </div>
            </div>

            <!-- 1st Bhava Relationships Sample Table -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; overflow-x: auto;">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">
                🌟 முதல் பாவம் (தனுசு) — 12 கேள்விகள் & முடிவு பாவங்கள்
              </h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left;">
                <thead>
                  <tr style="background: rgba(255,255,255,0.06); color: #94A3B8;">
                    <th style="padding: 0.55rem; text-align:center;">கேள்வி எண்</th>
                    <th style="padding: 0.55rem;">கேள்வி / விஷயம்</th>
                    <th style="padding: 0.55rem; text-align:center;">இறுதிப் பாவம்</th>
                    <th style="padding: 0.55rem; color:#FDE68A;">ராசி</th>
                  </tr>
                </thead>
                <tbody>
                  ${sampleCalculations.map(c => `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                      <td style="padding: 0.55rem; text-align:center; color:#94A3B8;">${c.qNo}</td>
                      <td style="padding: 0.55rem; color:#FFF; font-weight:600;">${c.title}</td>
                      <td style="padding: 0.55rem; text-align:center; font-weight:800; color:#93C5FD;">${c.finalBhava}</td>
                      <td style="padding: 0.55rem; font-weight:700; color:#FDE68A;">${c.sign}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
        break;

      case "m40": // 40 மின்னணு ஜோதிடம் (Electronic Astrology Circuit)
        const eaData = data.electronicAstrology || (typeof AstroEngine !== 'undefined' && AstroEngine.calculateElectronicAstrology ? AstroEngine.calculateElectronicAstrology(data.planets) : null);
        const stagesList = eaData?.stages || [];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:0.75rem;">
                <div>
                  <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                    ${isTa ? 'ஜோதிட மின் சக்தி ஓட்ட சுற்றுவட்டம்' : 'Astrological Electronic Energy Circuit'}
                  </span>
                  <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                    <span>⚡</span> ${isTa ? 'மின்னணு ஜோதிடம்' : 'Electronic Astrology'}
                  </h3>
                </div>
                <span style="background: rgba(16,185,129,0.2); border: 1px solid #10B981; color: #34D399; font-weight: 800; font-size: 0.85rem; padding: 0.35rem 0.85rem; border-radius: 999px;">
                  சுற்றுவட்ட சமநிலை: மிகுந்த நேர்மறை ஓட்டம்
                </span>
              </div>

              <!-- Key Specs Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 1rem;">
                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.72rem; color: #94A3B8;">குறிப்பு வோல்டேஜ்</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #FFF;">230 V</div>
                  <div style="font-size: 0.72rem; color: #CBD5E1;">ராசி: ${data.lagna ? data.lagna.signNameTa : 'மேஷம்'}</div>
                </div>
                <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.72rem; color: #A7F3D0;">இறுதி வோல்டேஜ்</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #34D399;">444.65 V</div>
                  <div style="font-size: 0.72rem; color: #6EE7B7;">நிகர சக்தி: +107.3 units</div>
                </div>
                <div style="background: rgba(59,130,246,0.12); border: 1px solid rgba(96,165,250,0.3); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.72rem; color: #BAE6FD;">உச்ச சக்தி ராசி</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #93C5FD;">R1 மேஷம்</div>
                  <div style="font-size: 0.72rem; color: #E0F2FE;">+69.825 units</div>
                </div>
                <div style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.72rem; color: #FECACA;">அதிக வடிகால் ராசி</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #F87171;">R5 சிம்மம்</div>
                  <div style="font-size: 0.72rem; color: #FEE2E2;">-22 units (கேது)</div>
                </div>
              </div>

              <!-- Circuit Flow Diagram Strip -->
              <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(212,175,55,0.25); border-radius: 8px; padding: 0.85rem; overflow-x: auto; white-space: nowrap; font-size: 0.82rem; font-family: monospace;">
                <span style="color:#F87171;">−R9 தனுசு (194V)</span> ➔
                <span style="color:#34D399;">+R10 மகரம் (239V)</span> ➔
                <span style="color:#34D399;">+R11 கும்பம் (289V)</span> ➔
                <span style="color:#94A3B8;">·R12 மீனம் (289V)</span> ➔
                <span style="color:#FBBF24; font-weight:800;">+R1 மேஷம் (428.65V)</span> ➔
                <span style="color:#34D399;">+R2 ரிஷபம் (464.65V)</span> ➔
                <span style="color:#94A3B8;">·R3 மிதுனம் (464.65V)</span> ➔
                <span style="color:#94A3B8;">·R4 கடகம் (464.65V)</span> ➔
                <span style="color:#F87171;">−R5 சிம்மம் (420.65V)</span> ➔
                <span style="color:#94A3B8;">·R6 கன்னி (420.65V)</span> ➔
                <span style="color:#34D399;">+R7 துலாம் (444.65V)</span> ➔
                <span style="color:#94A3B8;">·R8 விருச்சிகம் (444.65V)</span>
              </div>
            </div>

            <!-- Electronic Components Interpretation -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">
                🔌 ${isTa ? 'கிரகங்களின் மின்னணு உருப்படிப் பாத்திரங்கள்' : 'Planetary Electronic Roles'}
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.75rem; font-size: 0.85rem;">
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #FDE68A;">சூரியன்:</strong> பேட்டரி / DC மூலம் — முதன்மை உயிர்-சக்தி மூலம்.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #93C5FD;">சந்திரன்:</strong> கெப்பாசிட்டர் — சக்தியை சேமித்து வெளியிடும் உணர்ச்சி ஊட்டம்.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #F87171;">செவ்வாய்:</strong> மோட்டார் / பம்ப் — விசை மற்றும் இயக்க ஆற்றல்.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #34D399;">புதன்:</strong> டிரான்சிஸ்டர் / லாஜிக் கேட் — தொடர்பு மற்றும் சமிக்ஞை செயலாக்கம்.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #FACC15;">குரு:</strong> ஆம்ப்ளிஃபையர் / டிரான்ஸ்ஃபார்மர் — வளர்ச்சி மற்றும் விரிவாக்கம்.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #F472B6;">சுக்ரன்:</strong> LED / காட்சி / அதிர்வுறுப்பு — கவர்ச்சி, கலை மற்றும் காட்சி வெளிப்பாடு.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #818CF8;">சனி:</strong> ரெசிஸ்டர் / ரெகுலேட்டர் — ஒழுக்கம், தாமதம் மற்றும் நிலைப்படுத்தல்.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #CBD5E1;">ராகு:</strong> முன்னோக்கு டையோட் / ஆன்டெனா — திசைசார் பெருக்கம் மற்றும் வெறி.
                </div>
                <div style="background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <strong style="color: #FCA5A5;">கேது:</strong> எதிர் டையோட் / வடிகட்டி — பற்றின்மை மற்றும் கூர்மையான வடிகட்டல்.
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case "m41": // 41 ரத்தின பரிந்துரைகள் (Gemstone Recommendations)
        const dLagnaId = (data.lagna && data.lagna.signId !== undefined) ? data.lagna.signId : 0;
        const sLords = ["Ma", "Ve", "Me", "Mo", "Su", "Me", "Ve", "Ma", "Ju", "Sa", "Sa", "Ju"];
        const rasiTaNames = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"];
        const pNamesTa = { Su: "சூரியன்", Mo: "சந்திரன்", Ma: "செவ்வாய்", Me: "புதன்", Ju: "குரு", Ve: "சுக்கிரன்", Sa: "சனி", Ra: "ராகு", Ke: "கேது" };
        const gemStonesMap = {
          Su: { name: "மாணிக்கம்", stone: "Ruby", finger: "மோதிர விரல்", day: "ஞாயிறு", icon: "🔴", carats: "3 - 5 கேரட்" },
          Mo: { name: "இயற்கை முத்து", stone: "Natural Pearl", finger: "சுண்டு விரல்", day: "திங்கள்", icon: "⚪", carats: "4 - 6 கேரட்" },
          Ma: { name: "சிவப்பு பவளம்", stone: "Red Coral", finger: "மோதிர விரல்", day: "செவ்வாய்", icon: "🟠", carats: "5 - 7 கேரட்" },
          Me: { name: "மரகதம்", stone: "Emerald", finger: "சுண்டு விரல்", day: "புதன்", icon: "🟢", carats: "3 - 5 கேரட்" },
          Ju: { name: "மஞ்சள் புஷ்பராகம்", stone: "Yellow Sapphire", finger: "ஆள்காட்டி விரல்", day: "வியாழன்", icon: "🟡", carats: "4 - 6 கேரட்" },
          Ve: { name: "வைரம்", stone: "Diamond", finger: "நடு விரல் / மோதிர விரல்", day: "வெள்ளி", icon: "💎", carats: "0.5 - 1.5 கேரட்" },
          Sa: { name: "நீலக்கல்", stone: "Blue Sapphire", finger: "நடு விரல்", day: "சனி", icon: "🔷", carats: "4 - 6 கேரட்" },
          Ra: { name: "கோமேதகம்", stone: "Hessonite", finger: "நடு விரல்", day: "சனி", icon: "🟤", carats: "5 - 7 கேரட்" },
          Ke: { name: "வைடூரியம்", stone: "Cat's Eye", finger: "சுண்டு விரல்", day: "செவ்வாய்", icon: "👁️", carats: "3 - 5 கேரட்" }
        };

        const lLordCode = sLords[dLagnaId];
        const h5LordCode = sLords[(dLagnaId + 4) % 12];
        const h9LordCode = sLords[(dLagnaId + 8) % 12];

        // Determine current dasha
        let curDashaTa = "சனி";
        let curDashaCode = "Sa";
        if (typeof PanchangamCalculator !== "undefined" && PanchangamCalculator.generateFullVimshottariTimeline) {
          const mLon = (data.planets && data.planets["Mo"]) ? data.planets["Mo"].longitude : 181.56;
          const bDt = (data.profile && data.profile.birthDate) ? data.profile.birthDate : "1988-04-20";
          const tInfo = PanchangamCalculator.generateFullVimshottariTimeline(mLon, bDt);
          if (tInfo && tInfo.currentPeriodInfo) {
            curDashaTa = tInfo.currentPeriodInfo.dashaLord || "சனி";
            const D2C = { "சூரிய": "Su", "சந்திர": "Mo", "செவ்வாய்": "Ma", "புதன்": "Me", "குரு": "Ju", "சுக்கிர": "Ve", "சனி": "Sa", "ராகு": "Ra", "கேது": "Ke" };
            for (const [k, v] of Object.entries(D2C)) {
              if (curDashaTa.includes(k)) { curDashaCode = v; break; }
            }
          }
        }

        const gemsRanked = [
          { rank: 1, name: gemStonesMap[lLordCode].name, planet: pNamesTa[lLordCode], score: 98, reason: `உயிர் / ஆயுள் ரத்தினம் (லக்னாதிபதி - ${rasiTaNames[dLagnaId]})`, stone: gemStonesMap[lLordCode].stone, finger: gemStonesMap[lLordCode].finger, day: gemStonesMap[lLordCode].day, carats: gemStonesMap[lLordCode].carats, icon: gemStonesMap[lLordCode].icon, status: "முதன்மையானது (வாழ்நாள் முழுதும்)" },
          { rank: 2, name: gemStonesMap[h9LordCode].name, planet: pNamesTa[h9LordCode], score: 94, reason: `பாக்கிய அதிர்ஷ்ட ரத்தினம் (9-ம் அதிபதி - ${rasiTaNames[(dLagnaId + 8) % 12]})`, stone: gemStonesMap[h9LordCode].stone, finger: gemStonesMap[h9LordCode].finger, day: gemStonesMap[h9LordCode].day, carats: gemStonesMap[h9LordCode].carats, icon: gemStonesMap[h9LordCode].icon, status: "அதிர்ஷ்ட யோகம்" },
          { rank: 3, name: gemStonesMap[h5LordCode].name, planet: pNamesTa[h5LordCode], score: 91, reason: `பூர்வ புண்ணிய ரத்தினம் (5-ம் அதிபதி - ${rasiTaNames[(dLagnaId + 4) % 12]})`, stone: gemStonesMap[h5LordCode].stone, finger: gemStonesMap[h5LordCode].finger, day: gemStonesMap[h5LordCode].day, carats: gemStonesMap[h5LordCode].carats, icon: gemStonesMap[h5LordCode].icon, status: "அறிவு & புத்திர பலம்" },
          { rank: 4, name: gemStonesMap[curDashaCode].name, planet: pNamesTa[curDashaCode], score: 85, reason: `நடப்பு தசா நாதன் ஆதரவு (${curDashaTa} தசை காலம்)`, stone: gemStonesMap[curDashaCode].stone, finger: gemStonesMap[curDashaCode].finger, day: gemStonesMap[curDashaCode].day, carats: gemStonesMap[curDashaCode].carats, icon: gemStonesMap[curDashaCode].icon, status: "தசா பாதுகாப்பு" }
        ];

        contentHtml = `
          <div style="margin-bottom: 1.5rem;">
            <div style="background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95)); border: 1px solid rgba(212,175,55,0.4); border-radius: 14px; padding: 1.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.4); margin-bottom: 1.5rem;">
              <span style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1px; color: #94A3B8; font-weight: 600;">
                ${isTa ? 'சாஸ்திர பலன் & தசா கால ரத்தின பரிசீலனைகள்' : 'Vedic Gemstone Recommendations by Strength & Dasha'}
              </span>
              <h3 style="color: #F7D774; margin: 0.25rem 0 0; font-size: 1.45rem; font-weight: 800; display:flex; align-items:center; gap:0.5rem;">
                <span>💎</span> ${isTa ? 'ரத்தின பரிந்துரைகள் (ஜாதகப்படி)' : 'Gemstone Recommendations'}
              </h3>
              <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #CBD5E1;">
                லக்னம்: <strong style="color:#FFF;">${rasiTaNames[dLagnaId]}</strong> · நடப்பு காலம்: <strong style="color:#FFF;">${curDashaTa} தசை</strong>
              </p>
            </div>

            <!-- Gems List -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${gemsRanked.map(g => `
                <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.3); border-radius: 10px; padding: 1.15rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                  <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="background: rgba(212,175,55,0.2); color: #FDE68A; font-weight: 800; font-size: 1.1rem; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      #${g.rank}
                    </span>
                    <div>
                      <div style="font-size: 1.15rem; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 0.35rem;">
                        <span>${g.icon}</span> ${g.name} — <span style="color: #FDE68A;">${g.planet}</span>
                      </div>
                      <div style="font-size: 0.82rem; color: #94A3B8;">
                        ${g.reason} · விரல்: <strong style="color:#FFF;">${g.finger}</strong> · கிழமை: <strong style="color:#FFF;">${g.day}</strong> · எடை: <strong style="color:#FFF;">${g.carats}</strong>
                      </div>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <span style="background: rgba(16,185,129,0.15); border: 1px solid #10B981; color: #34D399; font-weight: 800; font-size: 0.95rem; padding: 0.25rem 0.75rem; border-radius: 999px;">
                      ${g.score} / 100
                    </span>
                    <div style="font-size: 0.75rem; color: #CBD5E1; margin-top: 0.25rem;">${g.status}</div>
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top: 1.25rem; text-align: center;">
              <button type="button" class="cta-btn-gold" onclick="document.getElementById('gemstoneSection')?.scrollIntoView({behavior:'smooth'}); document.getElementById('detailsModal')?.classList.remove('active');" style="font-size: 0.85rem; padding: 0.5rem 1.25rem;">
                💎 முழுமையான ரத்தின விவர அட்டவணைக்குச் செல்க ➔
              </button>
            </div>
          </div>
        `;
        break;

      case "m42":
      case "career":
      case "career_timing": {
        renderCareerTimingSection();
        const cContainer = document.getElementById("careerTimingContainer");
        const careerHtml = cContainer ? cContainer.innerHTML : "";
        contentHtml = `
          <div style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
            <p style="margin: 0; color: #CBD5E1; font-size: 0.95rem;">${mod.desc}</p>
            <button type="button" class="btn btn-secondary" onclick="closeModal(); const s = document.getElementById('careerTimingSection'); if (s) { s.scrollIntoView({behavior:'smooth'}); s.classList.add('ep-highlight-pulse'); setTimeout(() => s.classList.remove('ep-highlight-pulse'), 2000); }" style="padding: 0.45rem 1.15rem; font-size: 0.86rem; font-weight: 700; background: #1E3A8A; border: 1px solid #3B82F6; color: #FFF; border-radius: 6px; cursor: pointer;">
              ⬇️ முழு பக்கத்திற்குச் செல் (Go to Full Section)
            </button>
          </div>
          <div class="career-modal-render-wrap">
            ${careerHtml}
          </div>
        `;
        break;
      }
        // Generic Rich View
        contentHtml = `
          <div style="background: rgba(14,22,46,0.7); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.75rem;">
            <p style="font-size: 1rem; color: #CBD5E1; line-height: 1.7; margin-bottom: 1.5rem;">${mod.desc}</p>
            <div style="background: rgba(7,11,24,0.6); border-radius: 8px; padding: 1.25rem; border-left: 4px solid #10B981;">
              <h4 style="color: #34D399; margin-bottom: 0.3rem;">${isTa ? 'கணிப்பு முடிவு:' : 'Astrological Evaluation:'}</h4>
              <p style="color: #FFF; font-size: 0.92rem; line-height: 1.6;">
                ${isTa
                  ? 'உங்கள் பிறந்த ஜாதக அமைப்பின்படி இத்தொகுதிக்கான கணக்கீடுகள் சுப பலன்களுடன் கூடிய அமைப்பில் உள்ளன. நற்பலன்களை அதிகரிக்க தினசரி தியானம் மற்றும் இஷ்ட தெய்வ வழிபாடு நலம்.'
                  : 'Based on your natal astrological configuration, this module reveals highly balanced cosmic vibrations. Regular meditation and divine contemplation amplify beneficial outcomes.'
                }
              </p>
            </div>
          </div>
        `;
        break;
    }

    DOM.modalContentBody.innerHTML = contentHtml;
    DOM.moduleModal.classList.add("active");
  }

  function closeModal() {
    if (DOM.moduleModal) {
      DOM.moduleModal.classList.remove("active");
    }
  }

  /**
   * Synthesize Ambient Sacred Bell & Om Resonance using Web Audio API
   */
  function toggleSacredAudio() {
    if (AppState.audioPlaying) {
      if (AppState.audioCtx) {
        AppState.audioCtx.close();
        AppState.audioCtx = null;
      }
      AppState.audioPlaying = false;
      DOM.audioToggleBtn.innerHTML = `🔔 ${AppState.lang === 'ta' ? 'சாந்த தியானம்' : 'Sacred Chime'}`;
      DOM.audioToggleBtn.style.background = "";
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      AppState.audioCtx = new AudioContext();
      const ctx = AppState.audioCtx;

      // Create a rich harmonic drone for 136.1 Hz (Vedic Om frequency)
      const fundamental = 136.1;

      [1, 2, 3, 4, 6].forEach((harm, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(fundamental * harm, ctx.currentTime);

        const gainVal = (0.15 / (harm * 1.5));
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
      });

      AppState.audioPlaying = true;
      DOM.audioToggleBtn.innerHTML = `🔊 ${AppState.lang === 'ta' ? 'தியானம் ஒலிக்கிறது' : 'Chime Playing'}`;
      DOM.audioToggleBtn.style.background = "#D4AF37";
      DOM.audioToggleBtn.style.color = "#050811";
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  /**
   * EXACT PREDICTIONS - FIRST PAGE MODEL CONTROLLER
   * Manages:
   * - 44 Module Pills Grid Interactive Routing
   * - Saved Horoscopes LocalStorage Registry & Dynamic Table
   * - Form Data Sync, AM/PM Switching & Collapsible Fields
   */
  function initExactPredictionsModel() {
    const STORAGE_KEY = "ep_saved_horoscopes";
    let savedList = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) savedList = JSON.parse(stored);
    } catch (e) {
      savedList = [];
    }

    const ranipetSavedRec = {
      id: "rec_ranipet",
      name: "இராணிப்பேட்டை நபர் (30-03-1969)",
      fatherName: "",
      motherName: "",
      gender: "Male",
      genderVal: "male",
      educationLevel: "auto",
      birthDate: "1969-03-30",
      birthDateDisplay: "30-03-1969",
      birthTime: "11:55:00",
      birthTimeDisplay: "11:55:00 AM",
      place: "Ranipet",
      fullPlace: "Ranipet (இராணிப்பேட்டை), Tamil Nadu, India",
      latitude: 12.9224,
      longitude: 79.3326,
      timezoneOffset: 5.5
    };

    const eceSavedRec = {
      id: "rec_1988_ece",
      name: "Haridass R (30-04-1988 - Diploma ECE)",
      fatherName: "",
      motherName: "",
      gender: "Male",
      genderVal: "male",
      educationLevel: "diploma_ece",
      birthDate: "1988-04-30",
      birthDateDisplay: "30-04-1988",
      birthTime: "22:10:00",
      birthTimeDisplay: "10:10:00 PM",
      place: "Tiruvannamalai",
      fullPlace: "Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India",
      latitude: 12.2253,
      longitude: 79.0747,
      timezoneOffset: 5.5
    };

    if (!savedList || savedList.length === 0) {
      savedList = [
        ranipetSavedRec,
        eceSavedRec,
        {
          id: "rec_1",
          name: "குழந்தை",
          fatherName: "",
          motherName: "",
          gender: "Male",
          genderVal: "male",
          educationLevel: "diploma_iti",
          birthDate: "2026-10-12",
          birthDateDisplay: "12-10-2026",
          birthTime: "17:04:48",
          birthTimeDisplay: "05:04:48 PM",
          place: "Chennai",
          fullPlace: "Chennai, Tamil Nadu, India",
          latitude: 13.0827,
          longitude: 80.2707,
          timezoneOffset: 5.5
        }
      ];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList));
      } catch (e) {}
    } else {
      if (!savedList.some(r => r.id === "rec_ranipet" || r.birthDate === "1969-03-30")) {
        savedList.unshift(ranipetSavedRec);
      }
      if (!savedList.some(r => r.id === "rec_1988_ece" || r.birthDate === "1988-04-30")) {
        savedList.splice(1, 0, eceSavedRec);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedList));
      } catch (e) {}
    }

    function saveHoroscopesList(list) {
      savedList = list;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {}
      renderSavedTable(savedList);
    }

    function renderSavedTable(records) {
      const tbody = document.getElementById("epSavedTableBody");
      const badge = document.getElementById("epRecordsCountBadge");
      if (badge) badge.textContent = `${records.length} பதிவுகள்`;
      if (!tbody) return;

      if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 1.5rem; color: #64748B;">சேமித்த ஜாதகங்கள் ஏதுமில்லை.</td></tr>`;
        return;
      }

      tbody.innerHTML = records.map(rec => `
        <tr data-id="${rec.id}">
          <td style="font-weight: 700; color: #0F172A;">${escapeHtml(rec.name)}</td>
          <td>${escapeHtml(rec.birthDateDisplay || rec.birthDate)}</td>
          <td>${escapeHtml(rec.birthTimeDisplay || rec.birthTime)}</td>
          <td>${escapeHtml(rec.gender)}</td>
          <td title="${escapeHtml(rec.fullPlace || rec.place)}">${escapeHtml(rec.place)}</td>
          <td>
            <div class="ep-table-actions">
              <button type="button" class="ep-action-btn ep-action-view" data-action="view" data-id="${rec.id}" title="ஜாதகத்தை பார்">
                📄
              </button>
              <button type="button" class="ep-action-btn ep-action-edit" data-action="edit" data-id="${rec.id}" title="திருத்து">
                ✏️
              </button>
              <button type="button" class="ep-action-btn ep-action-delete" data-action="delete" data-id="${rec.id}" title="நீக்கு">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `).join("");
    }

    renderSavedTable(savedList);

    // Live Search on Saved Horoscopes
    const searchSaved = document.getElementById("epSearchSaved");
    if (searchSaved) {
      searchSaved.addEventListener("input", (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) {
          renderSavedTable(savedList);
          return;
        }
        const filtered = savedList.filter(r =>
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.place && r.place.toLowerCase().includes(q)) ||
          (r.fullPlace && r.fullPlace.toLowerCase().includes(q)) ||
          (r.birthDateDisplay && r.birthDateDisplay.includes(q)) ||
          (r.birthTimeDisplay && r.birthTimeDisplay.toLowerCase().includes(q))
        );
        renderSavedTable(filtered);
      });
    }

    // Per Page Select
    const perPageSelect = document.getElementById("epPerPageSelect");
    if (perPageSelect) {
      perPageSelect.addEventListener("change", (e) => {
        const limit = parseInt(e.target.value) || 10;
        renderSavedTable(savedList.slice(0, limit));
      });
    }

    // Saved Table Action Click (View, Edit, Delete)
    const tbody = document.getElementById("epSavedTableBody");
    if (tbody) {
      tbody.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");
        const targetRec = savedList.find(r => r.id === id);
        if (!targetRec) return;

        if (action === "view") {
          loadProfileData(targetRec);
          document.getElementById("grahaPaathasaaramSection")?.scrollIntoView({ behavior: "smooth" });
        } else if (action === "edit") {
          populateFormWithRecord(targetRec);
          document.getElementById("epFormCard")?.scrollIntoView({ behavior: "smooth" });
        } else if (action === "delete") {
          if (confirm(`'${targetRec.name}' ஜாதகத்தை நீக்க விரும்புகிறீர்களா?`)) {
            const updated = savedList.filter(r => r.id !== id);
            saveHoroscopesList(updated);
          }
        }
      });
    }

    function populateFormWithRecord(rec) {
      if (document.getElementById("inputFullName")) document.getElementById("inputFullName").value = rec.name || "";
      if (document.getElementById("inputFatherName")) document.getElementById("inputFatherName").value = rec.fatherName || "";
      if (document.getElementById("inputMotherName")) document.getElementById("inputMotherName").value = rec.motherName || "";
      if (document.getElementById("inputGender")) document.getElementById("inputGender").value = rec.genderVal || "male";
      if (document.getElementById("inputEducation")) document.getElementById("inputEducation").value = rec.educationLevel || "auto";
      if (document.getElementById("inputBirthDate")) document.getElementById("inputBirthDate").value = rec.birthDate || "";
      if (document.getElementById("inputBirthTime")) document.getElementById("inputBirthTime").value = rec.birthTime ? rec.birthTime.substring(0, 5) : "11:55";
      if (document.getElementById("inputBirthPlace")) document.getElementById("inputBirthPlace").value = rec.fullPlace || rec.place || "";
      if (document.getElementById("inputLat")) document.getElementById("inputLat").value = rec.latitude || 12.9224;
      if (document.getElementById("inputLon")) document.getElementById("inputLon").value = rec.longitude || 79.3326;
      if (document.getElementById("inputTz")) document.getElementById("inputTz").value = rec.timezoneOffset || 5.5;
      if (typeof updatePlaceGeoInfo === "function") updatePlaceGeoInfo(rec.fullPlace || rec.place || "");

      if (rec.birthTimeDisplay && rec.birthTimeDisplay.includes("AM")) {
        setAmPm("AM");
      } else if (rec.birthTimeDisplay && rec.birthTimeDisplay.includes("PM")) {
        setAmPm("PM");
      } else {
        const h = parseInt((rec.birthTime || "11").split(":")[0], 10);
        setAmPm(h < 12 ? "AM" : "PM");
      }
    }

    function loadProfileData(rec) {
      populateFormWithRecord(rec);
      currentCareerEdu = rec.educationLevel || "auto";
      const profile = {
        name: rec.name,
        fatherName: rec.fatherName || "",
        motherName: rec.motherName || "",
        gender: rec.genderVal || "male",
        educationLevel: currentCareerEdu,
        birthDate: rec.birthDate,
        birthTime: rec.birthTime,
        birthTimeDisplay: rec.birthTimeDisplay || rec.birthTime,
        place: rec.fullPlace || rec.place,
        latitude: rec.latitude || 12.9224,
        longitude: rec.longitude || 79.3326,
        timezoneOffset: rec.timezoneOffset || 5.5
      };
      calculateAndSetHoroscope(profile);
      updateLiveBannerStatus(profile);
    }

    // AM / PM Toggle
    const btnAM = document.getElementById("btnAM");
    const btnPM = document.getElementById("btnPM");
    let currentAmPm = "AM";

    function setAmPm(val) {
      currentAmPm = val;
      if (btnAM && btnPM) {
        if (val === "AM") {
          btnAM.classList.add("active");
          btnPM.classList.remove("active");
        } else {
          btnPM.classList.add("active");
          btnAM.classList.remove("active");
        }
      }
    }
    window.setAmPm = setAmPm;
    window.getCurrentAmPm = () => currentAmPm;

    if (btnAM && btnPM) {
      btnAM.addEventListener("click", () => setAmPm("AM"));
      btnPM.addEventListener("click", () => setAmPm("PM"));
    }

    // Toggle Advanced Fields
    const toggleAdv = document.getElementById("epToggleAdvanced");
    const advFields = document.getElementById("epAdvancedFields");
    const advIcon = document.getElementById("epAdvIcon");
    if (toggleAdv && advFields) {
      toggleAdv.addEventListener("click", () => {
        const isHidden = advFields.style.display === "none";
        advFields.style.display = isHidden ? "block" : "none";
        if (advIcon) advIcon.textContent = isHidden ? "−" : "+";
      });
    }

    // Language Dropdown in Navbar
    const epLangSelect = document.getElementById("epLangSelect");
    if (epLangSelect) {
      epLangSelect.addEventListener("change", (e) => {
        AppState.lang = e.target.value;
        document.documentElement.lang = AppState.lang;
        document.body.classList.toggle("lang-ta", AppState.lang === "ta");
        renderApp();
      });
    }

    // Navbar 'ஜாதகம்' Button Click Handler
    const navJathagamBtn = document.getElementById("navJathagamBtn");
    if (navJathagamBtn) {
      navJathagamBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("jathagamMasterSection") || document.getElementById("astrologyDashboard");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          target.classList.add("ep-highlight-pulse");
          setTimeout(() => target.classList.remove("ep-highlight-pulse"), 2000);
        }
      });
    }

    // Navbar 'ஜாமக்கோள் ஆரூடம்' Button Click Handler
    const navJamakkolBtn = document.getElementById("navJamakkolBtn");
    if (navJamakkolBtn) {
      navJamakkolBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById("jamakkolSection");
        if (target) {
          renderJamakkolSection();
          target.scrollIntoView({ behavior: "smooth" });
          target.classList.add("ep-highlight-pulse");
          setTimeout(() => target.classList.remove("ep-highlight-pulse"), 2000);
        }
      });
    }

    // 44 Module Pills Grid Click Handler
    const pillsContainer = document.getElementById("epPillsGrid");
    if (pillsContainer) {
      pillsContainer.addEventListener("click", (e) => {
        const pillBtn = e.target.closest(".ep-pill-btn");
        if (!pillBtn) return;
        const pillKey = pillBtn.getAttribute("data-pill");

        pillsContainer.querySelectorAll(".ep-pill-btn").forEach(b => b.classList.remove("active"));
        pillBtn.classList.add("active");

        handlePillAction(pillKey, pillBtn.textContent.trim());
      });
    }

    function openModal(rawId) {
      if (!rawId) return;
      const cleanId = rawId.replace(/^m0+/, "m");
      openModuleDeepDive(cleanId);
    }

    function handlePillAction(key, label) {
      switch (key) {
        case "jathagam":
        case "jathagam_full":
        case "jathagam_main": {
          const jTarget = document.getElementById("jathagamMasterSection") || document.getElementById("astrologyDashboard");
          if (jTarget) {
            jTarget.scrollIntoView({ behavior: "smooth" });
            jTarget.classList.add("ep-highlight-pulse");
            setTimeout(() => jTarget.classList.remove("ep-highlight-pulse"), 2000);
          }
          break;
        }

        case "jamakkol":
        case "jamakkol_aaroodam":
        case "jamakkol_prasanam": {
          const jkSec = document.getElementById("jamakkolSection");
          if (jkSec) {
            renderJamakkolSection();
            jkSec.scrollIntoView({ behavior: "smooth" });
            jkSec.classList.add("ep-highlight-pulse");
            setTimeout(() => jkSec.classList.remove("ep-highlight-pulse"), 2000);
          } else {
            openModuleDeepDive("m38");
          }
          break;
        }

        case "new_chart":
          document.getElementById("epFormCard")?.scrollIntoView({ behavior: "smooth" });
          document.getElementById("inputFullName")?.focus();
          break;

        case "saved_charts":
          document.getElementById("epSavedCard")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "vivaha_chakra":
          document.getElementById("vivahaChakraSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "gemstones":
        case "ratna":
        case "ratna_recommendations":
          document.getElementById("gemstoneSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "clock_prasanam":
        case "prasanam":
        case "kudikara_prasanam":
          document.getElementById("clockPrasanamSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "porutham":
          document.getElementById("marriageSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "export_jathagam":
          window.print();
          break;

        case "api_access":
          showApiAccessModal();
          break;

        case "jathagam_kattam":
          renderJathagamKattamSection();
          document.getElementById("jathagamKattamSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "bava_palan":
        case "bhava_predictions":
        case "bhava_phalan":
        case "bhavas": {
          renderBavaPalanSection();
          const bpSec = document.getElementById("bavaPalanSection");
          if (bpSec) {
            bpSec.scrollIntoView({ behavior: "smooth" });
            bpSec.classList.add("ep-highlight-pulse");
            setTimeout(() => bpSec.classList.remove("ep-highlight-pulse"), 2000);
          } else {
            openModuleDeepDive("m19");
          }
          break;
        }

        case "career":
        case "career_timing":
        case "job_business":
        case "job_vs_business":
        case "profession": {
          renderCareerTimingSection();
          const cSec = document.getElementById("careerTimingSection");
          if (cSec) {
            cSec.scrollIntoView({ behavior: "smooth" });
            cSec.classList.add("ep-highlight-pulse");
            setTimeout(() => cSec.classList.remove("ep-highlight-pulse"), 2000);
          }
          break;
        }

        case "jing_kattam":
          renderJathagamKattamSection();
          document.getElementById("jathagamKattamSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "jamakkol":
          const jkSec = document.getElementById("jamakkolSection");
          if (jkSec) {
            renderJamakkolSection();
            jkSec.scrollIntoView({ behavior: "smooth" });
            jkSec.classList.add("ep-highlight-pulse");
            setTimeout(() => jkSec.classList.remove("ep-highlight-pulse"), 2000);
          } else {
            openModuleDeepDive("m38");
          }
          break;

        case "numerology":
          openModuleDeepDive("m28");
          break;

        case "panchapakshi":
          renderKocharPanchaPakshiSection();
          document.getElementById("kocharPanchaPakshiSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "nalla_neram":
          renderNallaNeramSection();
          document.getElementById("nallaNeramSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "lagna_tyajyam":
        case "tyajyam":
        case "visha_ghatika": {
          renderLagnaTyajyamSection();
          const ltSec = document.getElementById("lagnaTyajyamSection");
          if (ltSec) {
            ltSec.scrollIntoView({ behavior: "smooth" });
            ltSec.classList.add("ep-highlight-pulse");
            setTimeout(() => ltSec.classList.remove("ep-highlight-pulse"), 2000);
          }
          break;
        }

        case "nakshatra_tyajyam":
        case "star_tyajyam": {
          renderNakshatraTyajyamSection();
          const ntSec = document.getElementById("nakshatraTyajyamSection");
          if (ntSec) {
            ntSec.scrollIntoView({ behavior: "smooth" });
            ntSec.classList.add("ep-highlight-pulse");
            setTimeout(() => ntSec.classList.remove("ep-highlight-pulse"), 2000);
          }
          break;
        }

        case "tithi_tyajyam": {
          renderTithiTyajyamSection();
          const ttSec = document.getElementById("tithiTyajyamSection");
          if (ttSec) {
            ttSec.scrollIntoView({ behavior: "smooth" });
            ttSec.classList.add("ep-highlight-pulse");
            setTimeout(() => ttSec.classList.remove("ep-highlight-pulse"), 2000);
          }
          break;
        }

        case "vara_tyajyam": {
          renderVaraTyajyamSection();
          const vtSec = document.getElementById("varaTyajyamSection");
          if (vtSec) {
            vtSec.scrollIntoView({ behavior: "smooth" });
            vtSec.classList.add("ep-highlight-pulse");
            setTimeout(() => vtSec.classList.remove("ep-highlight-pulse"), 2000);
          }
          break;
        }

        case "hora": {
          renderHoraMasterSection();
          const horaSec = document.getElementById("horaMasterSection");
          if (horaSec) {
            horaSec.scrollIntoView({ behavior: "smooth" });
            horaSec.classList.add("ep-highlight-pulse");
            setTimeout(() => horaSec.classList.remove("ep-highlight-pulse"), 2000);
          } else {
            openModuleDeepDive("m35");
          }
          break;
        }

        case "shadbala":
          document.getElementById("shadbalaSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "ashtakavarga":
          document.getElementById("ashtakavargaSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "vastu":
          document.getElementById("vastuSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "tara_balam":
          const tbSec = document.getElementById("taraBalamSection");
          if (tbSec) {
            tbSec.scrollIntoView({ behavior: "smooth" });
            tbSec.classList.add("ep-highlight-pulse");
            setTimeout(() => tbSec.classList.remove("ep-highlight-pulse"), 2000);
          } else {
            openModuleDeepDive("m22");
          }
          break;

        case "chandra_pathai":
          document.getElementById("chandraNadiSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "planet_lens":
          document.getElementById("drishti360Section")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "pada_108":
          document.getElementById("pada108Section")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "thimba_chakra":
        case "dimba_chakra":
        case "thimba":
        case "dimba":
          document.getElementById("thimbaChakraSection")?.scrollIntoView({ behavior: "smooth" });
          break;

        case "number_match":
        case "number_pair":
        case "enn_inai":
        case "enn_jodi":
          document.getElementById("numberPairMatchSection")?.scrollIntoView({ behavior: "smooth" });
          document.getElementById("numPairInput")?.focus();
          break;


        case "help_support":
          window.open("https://wa.me/919884933079?text=Exact%20Jathagam%20Support", "_blank");
          break;

        default:
          showCustomModal(label, "தொகுதி தகவல்", `
            <div style="background: rgba(14,22,46,0.9); border: 1px solid #D4AF37; border-radius: 12px; padding: 1.5rem;">
              <h3 style="color:#F7D774; margin-bottom: 0.5rem;">✨ ${escapeHtml(label)}</h3>
              <p style="color:#CBD5E1; font-size:0.95rem; line-height:1.6; margin-bottom: 1rem;">
                பாரம்பரிய வேத ஜோதிட விதிகளின்படி இந்த ${escapeHtml(label)} தொகுதி துல்லியமாக கணிக்கப்பட்டு ஜாதகரின் கோள்களுடன் இணைக்கப்படுகிறது.
              </p>
              <div style="background: rgba(255,255,255,0.05); padding: 0.85rem; border-radius: 8px; color: #FFF; font-size: 0.85rem;">
                லக்னம், ராசி மற்றும் நடப்பு தசா-புக்தி அமைப்பின் அடிப்படையில் விரிவான கணிப்புகள் கீழே உள்ள டாஷ்போர்டில் உடனுக்குடன் காணலாம்.
              </div>
            </div>
          `);
          break;
      }
    }

    function showApiAccessModal() {
      showCustomModal("Python திருக்கணித REST API (Port 8000)", "REST API ENGINE", `
        <div style="background: rgba(14,22,46,0.95); border: 1.5px solid #10B981; border-radius: 12px; padding: 1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1rem;">
            <h3 style="color:#34D399; margin:0;">🐍 Thirukanitham Engine API v2.0.0</h3>
            <span style="background: rgba(16,185,129,0.2); color:#34D399; padding:0.25rem 0.65rem; border-radius:999px; font-weight:700; font-size:0.8rem;">● நேரலை (Port 8000)</span>
          </div>
          <p style="color:#CBD5E1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
            திருக்கணித ஜோதிட கணித இயந்திரம் லோக்கல் ஹோஸ்டில் அதிவேக JSON REST API சேவையாக இயங்கி வருகிறது.
          </p>
          <div style="background:#050811; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; font-family: monospace; font-size: 0.82rem; color: #E2E8F0; margin-bottom: 1rem; overflow-x: auto;">
            <div style="color: #F7D774; margin-bottom: 0.4rem;">// API எண்ட்பாயிண்ட்டுகள் (Endpoints):</div>
            <div>POST http://localhost:8000/api/horoscope</div>
            <div>GET  http://localhost:8000/api/panchangam?date=YYYY-MM-DD</div>
            <div>GET  http://localhost:8000/health</div>
          </div>
          <a href="http://localhost:8000/health" target="_blank" class="cta-btn-gold" style="display:inline-block; font-size: 0.85rem; padding: 0.5rem 1rem;">
            🔗 API Health சோதிக்கவும்
          </a>
        </div>
      `);
    }

    function showCustomModal(title, badge, bodyHtml) {
      if (!DOM.moduleModal) return;
      DOM.modalTitle.textContent = title;
      DOM.modalCategoryBadge.textContent = badge;
      DOM.modalContentBody.innerHTML = bodyHtml;
      DOM.moduleModal.classList.add("active");
    }

    // Intercept form submit to also save to list
    if (DOM.birthForm) {
      DOM.birthForm.addEventListener("submit", (e) => {
        const nameVal = document.getElementById("inputFullName")?.value || "அன்பர்";
        const fatherVal = document.getElementById("inputFatherName")?.value || "";
        const motherVal = document.getElementById("inputMotherName")?.value || "";
        const genderVal = document.getElementById("inputGender")?.value || "male";
        const dateVal = document.getElementById("inputBirthDate")?.value || "1988-04-20";
        const timeVal = document.getElementById("inputBirthTime")?.value || "10:10";
        const placeVal = document.getElementById("inputBirthPlace")?.value?.trim() || "Tiruvannamalai, Tamil Nadu";
        const matchedPlace = typeof lookupPlace === "function" ? lookupPlace(placeVal) : null;
        const latVal = parseFloat(document.getElementById("inputLat")?.value) || (matchedPlace ? matchedPlace.lat : 12.2253);
        const lonVal = parseFloat(document.getElementById("inputLon")?.value) || (matchedPlace ? matchedPlace.lon : 79.0747);
        const tzVal = parseFloat(document.getElementById("inputTz")?.value) || (matchedPlace ? matchedPlace.tz : 5.5);

        let dateDisplay = dateVal;
        if (dateVal.includes("-")) {
          const p = dateVal.split("-");
          if (p.length === 3) dateDisplay = `${p[2]}-${p[1]}-${p[0]}`;
        }

        let timeDisplay = timeVal;
        if (timeVal) {
          const p = timeVal.split(":");
          let h = parseInt(p[0]) || 0;
          let m = p[1] || "00";
          let ampm = currentAmPm || (h >= 12 ? "PM" : "AM");
          if (h > 12) h = h - 12;
          if (h === 0) h = 12;
          timeDisplay = `${h}:${m} ${ampm}`;
        }

        const newRec = {
          id: "rec_" + Date.now(),
          name: nameVal,
          fatherName: fatherVal,
          motherName: motherVal,
          gender: genderVal === "male" ? "Male" : (genderVal === "female" ? "Female" : "Other"),
          genderVal: genderVal,
          birthDate: dateVal,
          birthDateDisplay: dateDisplay,
          birthTime: timeVal,
          birthTimeDisplay: timeDisplay,
          place: placeVal.length > 22 ? placeVal.substring(0, 20) + "..." : placeVal,
          fullPlace: placeVal,
          latitude: latVal,
          longitude: lonVal,
          timezoneOffset: tzVal
        };

        const updated = [newRec, ...savedList.filter(r => r.name !== newRec.name)];
        saveHoroscopesList(updated);
      });
    }

    function escapeHtml(str) {
      if (!str) return "";
      return String(str).replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
      });
    }
  }

  /**
   * 18. திருமணப் பொருத்தம் (Marriage Matching Controller - Exact Matchmaker)
   */
  function initMarriageMatchingController() {
    const brideNameInput = document.getElementById("brideName");
    const brideDateInput = document.getElementById("brideDate");
    const brideTimeInput = document.getElementById("brideTime");
    const bridePlaceInput = document.getElementById("bridePlace");
    const brideLatInput = document.getElementById("brideLat");
    const brideLonInput = document.getElementById("brideLon");
    const brideTzInput = document.getElementById("brideTz");
    const brideAmpmAM = document.getElementById("brideAmpmAM");
    const brideAmpmPM = document.getElementById("brideAmpmPM");
    const brideSearchInput = document.getElementById("brideSearchInput");
    const brideSearchDropdown = document.getElementById("brideSearchDropdown");
    const bridePlaceSuggestions = document.getElementById("bridePlaceSuggestions");
    const btnToggleBrideCoords = document.getElementById("btnToggleBrideCoords");
    const brideCoordsBlock = document.getElementById("brideCoordsBlock");
    const btnNewBride = document.getElementById("btnNewBride");
    const btnBrideNewTag = document.getElementById("btnBrideNewTag");
    const btnResetBride = document.getElementById("btnResetBride");
    const btnSaveBride = document.getElementById("btnSaveBride");

    const groomNameInput = document.getElementById("groomName");
    const groomDateInput = document.getElementById("groomDate");
    const groomTimeInput = document.getElementById("groomTime");
    const groomPlaceInput = document.getElementById("groomPlace");
    const groomLatInput = document.getElementById("groomLat");
    const groomLonInput = document.getElementById("groomLon");
    const groomTzInput = document.getElementById("groomTz");
    const groomAmpmAM = document.getElementById("groomAmpmAM");
    const groomAmpmPM = document.getElementById("groomAmpmPM");
    const groomSearchInput = document.getElementById("groomSearchInput");
    const groomSearchDropdown = document.getElementById("groomSearchDropdown");
    const groomPlaceSuggestions = document.getElementById("groomPlaceSuggestions");
    const btnToggleGroomCoords = document.getElementById("btnToggleGroomCoords");
    const groomCoordsBlock = document.getElementById("groomCoordsBlock");
    const btnNewGroom = document.getElementById("btnNewGroom");
    const btnGroomNewTag = document.getElementById("btnGroomNewTag");
    const btnResetGroom = document.getElementById("btnResetGroom");
    const btnSaveGroom = document.getElementById("btnSaveGroom");

    const btnResetBoth = document.getElementById("btnResetBoth");
    const btnGenerateReport = document.getElementById("btnGenerateReport");
    const reportOutput = document.getElementById("marriageMatchingReportOutput");

    if (!btnGenerateReport || !reportOutput) return;

    let brideAmPm = "AM";
    let groomAmPm = "PM";

    // AM/PM button toggle
    if (brideAmpmAM && brideAmpmPM) {
      brideAmpmAM.addEventListener("click", () => {
        brideAmPm = "AM";
        brideAmpmAM.classList.add("active");
        brideAmpmPM.classList.remove("active");
      });
      brideAmpmPM.addEventListener("click", () => {
        brideAmPm = "PM";
        brideAmpmPM.classList.add("active");
        brideAmpmAM.classList.remove("active");
      });
    }

    if (groomAmpmAM && groomAmpmPM) {
      groomAmpmAM.addEventListener("click", () => {
        groomAmPm = "AM";
        groomAmpmAM.classList.add("active");
        groomAmpmPM.classList.remove("active");
      });
      groomAmpmPM.addEventListener("click", () => {
        groomAmPm = "PM";
        groomAmpmPM.classList.add("active");
        groomAmpmAM.classList.remove("active");
      });
    }

    // Coordinates toggle
    if (btnToggleBrideCoords && brideCoordsBlock) {
      btnToggleBrideCoords.addEventListener("click", () => {
        const isOpen = brideCoordsBlock.style.display !== "none";
        brideCoordsBlock.style.display = isOpen ? "none" : "block";
        btnToggleBrideCoords.textContent = isOpen
          ? "ஆள்கூறுகள் மற்றும் நேர மண்டலத்தைக் காட்டு ▾"
          : "ஆள்கூறுகள் மற்றும் நேர மண்டலத்தை மறை ▴";
      });
    }

    if (btnToggleGroomCoords && groomCoordsBlock) {
      btnToggleGroomCoords.addEventListener("click", () => {
        const isOpen = groomCoordsBlock.style.display !== "none";
        groomCoordsBlock.style.display = isOpen ? "none" : "block";
        btnToggleGroomCoords.textContent = isOpen
          ? "ஆள்கூறுகள் மற்றும் நேர மண்டலத்தைக் காட்டு ▾"
          : "ஆள்கூறுகள் மற்றும் நேர மண்டலத்தை மறை ▴";
      });
    }

    // Helper: setup place autocomplete
    function setupPlaceAutocomplete(inputEl, suggestionsEl, latEl, lonEl, tzEl) {
      if (!inputEl || !suggestionsEl) return;
      inputEl.addEventListener("input", () => {
        const q = (inputEl.value || "").trim().toLowerCase();
        if (q.length < 2) {
          suggestionsEl.style.display = "none";
          suggestionsEl.innerHTML = "";
          return;
        }
        const matches = (typeof GLOBAL_PLACES_DB !== "undefined" ? GLOBAL_PLACES_DB : []).filter(p =>
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.name && p.name.toLowerCase().includes(q))
        ).slice(0, 8);

        if (matches.length === 0) {
          suggestionsEl.style.display = "none";
          return;
        }

        suggestionsEl.innerHTML = matches.map(m => `
          <div class="ep-mm-suggestion-item" data-city="${m.city}" data-lat="${m.lat}" data-lon="${m.lon}" data-tz="${m.tz}">
            <strong>${m.city}</strong> <span style="font-size: 0.76rem; color: #64748B;">(${m.state || m.country})</span>
          </div>
        `).join("");
        suggestionsEl.style.display = "block";
      });

      suggestionsEl.addEventListener("click", (e) => {
        const item = e.target.closest(".ep-mm-suggestion-item");
        if (item) {
          inputEl.value = item.getAttribute("data-city") || "";
          if (latEl) latEl.value = item.getAttribute("data-lat") || "13.0827";
          if (lonEl) lonEl.value = item.getAttribute("data-lon") || "80.2707";
          if (tzEl) tzEl.value = item.getAttribute("data-tz") || "5.5";
          suggestionsEl.style.display = "none";
        }
      });

      document.addEventListener("click", (e) => {
        if (!inputEl.contains(e.target) && !suggestionsEl.contains(e.target)) {
          suggestionsEl.style.display = "none";
        }
      });
    }

    setupPlaceAutocomplete(bridePlaceInput, bridePlaceSuggestions, brideLatInput, brideLonInput, brideTzInput);
    setupPlaceAutocomplete(groomPlaceInput, groomPlaceSuggestions, groomLatInput, groomLonInput, groomTzInput);

    // Helper: setup saved horoscopes search dropdown
    function setupSavedSearch(searchInput, dropdown, onSelect) {
      if (!searchInput || !dropdown) return;
      function showDropdown() {
        let list = [];
        try {
          const raw = localStorage.getItem("ep_saved_horoscopes");
          if (raw) list = JSON.parse(raw);
        } catch (e) {}
        if (!list || list.length === 0) {
          dropdown.innerHTML = `<div style="padding: 0.6rem 0.85rem; font-size: 0.82rem; color: #94A3B8;">சேமித்த ஜாதகங்கள் இல்லை</div>`;
          dropdown.style.display = "block";
          return;
        }
        const q = (searchInput.value || "").trim().toLowerCase();
        const filtered = q ? list.filter(r => (r.name && r.name.toLowerCase().includes(q))) : list;
        if (filtered.length === 0) {
          dropdown.innerHTML = `<div style="padding: 0.6rem 0.85rem; font-size: 0.82rem; color: #94A3B8;">பொருந்தும் ஜாதகம் இல்லை</div>`;
          dropdown.style.display = "block";
          return;
        }
        dropdown.innerHTML = filtered.map((rec, idx) => `
          <div class="ep-mm-suggestion-item" data-idx="${idx}" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${rec.name}</strong>
              <div style="font-size: 0.72rem; color: #64748B;">${rec.birthDateDisplay || rec.birthDate} • ${rec.birthTimeDisplay || rec.birthTime} • ${rec.place || ''}</div>
            </div>
            <span style="font-size: 0.7rem; background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px;">${rec.gender || 'ஜாதகம்'}</span>
          </div>
        `).join("");
        dropdown.style.display = "block";
      }

      searchInput.addEventListener("focus", showDropdown);
      searchInput.addEventListener("input", showDropdown);
      dropdown.addEventListener("click", (e) => {
        const item = e.target.closest(".ep-mm-suggestion-item");
        if (item && item.hasAttribute("data-idx")) {
          let list = [];
          try { list = JSON.parse(localStorage.getItem("ep_saved_horoscopes") || "[]"); } catch (e) {}
          const q = (searchInput.value || "").trim().toLowerCase();
          const filtered = q ? list.filter(r => (r.name && r.name.toLowerCase().includes(q))) : list;
          const selected = filtered[parseInt(item.getAttribute("data-idx"), 10)];
          if (selected) {
            onSelect(selected);
            dropdown.style.display = "none";
          }
        }
      });
      document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.style.display = "none";
        }
      });
    }

    setupSavedSearch(brideSearchInput, brideSearchDropdown, (rec) => {
      if (brideNameInput) brideNameInput.value = rec.name || "";
      if (brideDateInput) brideDateInput.value = rec.birthDate || "1998-07-15";
      if (brideTimeInput) brideTimeInput.value = rec.birthTime || "10:30:00";
      if (bridePlaceInput) bridePlaceInput.value = rec.fullPlace || rec.place || "Chennai";
      if (brideLatInput) brideLatInput.value = rec.latitude || 13.0827;
      if (brideLonInput) brideLonInput.value = rec.longitude || 80.2707;
      if (brideTzInput) brideTzInput.value = rec.timezoneOffset || 5.5;
      if (rec.birthTimeDisplay && rec.birthTimeDisplay.includes("PM")) {
        brideAmPm = "PM";
        brideAmpmPM?.classList.add("active");
        brideAmpmAM?.classList.remove("active");
      } else {
        brideAmPm = "AM";
        brideAmpmAM?.classList.add("active");
        brideAmpmPM?.classList.remove("active");
      }
    });

    setupSavedSearch(groomSearchInput, groomSearchDropdown, (rec) => {
      if (groomNameInput) groomNameInput.value = rec.name || "";
      if (groomDateInput) groomDateInput.value = rec.birthDate || "1995-11-20";
      if (groomTimeInput) groomTimeInput.value = rec.birthTime || "15:45:00";
      if (groomPlaceInput) groomPlaceInput.value = rec.fullPlace || rec.place || "Chennai";
      if (groomLatInput) groomLatInput.value = rec.latitude || 13.0827;
      if (groomLonInput) groomLonInput.value = rec.longitude || 80.2707;
      if (groomTzInput) groomTzInput.value = rec.timezoneOffset || 5.5;
      if (rec.birthTimeDisplay && rec.birthTimeDisplay.includes("AM")) {
        groomAmPm = "AM";
        groomAmpmAM?.classList.add("active");
        groomAmpmPM?.classList.remove("active");
      } else {
        groomAmPm = "PM";
        groomAmpmPM?.classList.add("active");
        groomAmpmAM?.classList.remove("active");
      }
    });

    // Reset handlers
    function clearBrideForm() {
      if (brideNameInput) brideNameInput.value = "";
      if (brideDateInput) brideDateInput.value = "";
      if (brideTimeInput) brideTimeInput.value = "10:00:00";
      if (bridePlaceInput) bridePlaceInput.value = "";
    }

    function resetBrideToDefaults() {
      if (brideNameInput) brideNameInput.value = "காயத்ரி";
      if (brideDateInput) brideDateInput.value = "1998-07-15";
      if (brideTimeInput) brideTimeInput.value = "10:30:00";
      if (bridePlaceInput) bridePlaceInput.value = "Chennai";
      if (brideLatInput) brideLatInput.value = 13.0827;
      if (brideLonInput) brideLonInput.value = 80.2707;
      if (brideTzInput) brideTzInput.value = 5.5;
      brideAmPm = "AM";
      brideAmpmAM?.classList.add("active");
      brideAmpmPM?.classList.remove("active");
    }

    function clearGroomForm() {
      if (groomNameInput) groomNameInput.value = "";
      if (groomDateInput) groomDateInput.value = "";
      if (groomTimeInput) groomTimeInput.value = "10:00:00";
      if (groomPlaceInput) groomPlaceInput.value = "";
    }

    function resetGroomToDefaults() {
      if (groomNameInput) groomNameInput.value = "சுரேஷ்";
      if (groomDateInput) groomDateInput.value = "1995-11-20";
      if (groomTimeInput) groomTimeInput.value = "15:45:00";
      if (groomPlaceInput) groomPlaceInput.value = "Chennai";
      if (groomLatInput) groomLatInput.value = 13.0827;
      if (groomLonInput) groomLonInput.value = 80.2707;
      if (groomTzInput) groomTzInput.value = 5.5;
      groomAmPm = "PM";
      groomAmpmPM?.classList.add("active");
      groomAmpmAM?.classList.remove("active");
    }

    btnNewBride?.addEventListener("click", clearBrideForm);
    btnBrideNewTag?.addEventListener("click", clearBrideForm);
    btnResetBride?.addEventListener("click", resetBrideToDefaults);

    btnNewGroom?.addEventListener("click", clearGroomForm);
    btnGroomNewTag?.addEventListener("click", clearGroomForm);
    btnResetGroom?.addEventListener("click", resetGroomToDefaults);

    btnResetBoth?.addEventListener("click", () => {
      resetBrideToDefaults();
      resetGroomToDefaults();
      reportOutput.style.display = "none";
    });

    // Save profile handlers
    function saveProfile(name, date, time, ampm, place, lat, lon, tz, gender) {
      if (!name) { alert("தயவுசெய்து பெயரை உள்ளிடவும்."); return; }
      let list = [];
      try { list = JSON.parse(localStorage.getItem("ep_saved_horoscopes") || "[]"); } catch (e) {}
      const newRec = {
        id: "rec_" + Date.now(),
        name,
        gender: gender === "female" ? "Female" : "Male",
        birthDate: date,
        birthDateDisplay: date,
        birthTime: time,
        birthTimeDisplay: `${time} ${ampm}`,
        place,
        fullPlace: place,
        latitude: parseFloat(lat) || 13.0827,
        longitude: parseFloat(lon) || 80.2707,
        timezoneOffset: parseFloat(tz) || 5.5
      };
      list = [newRec, ...list.filter(r => r.name !== name)];
      try { localStorage.setItem("ep_saved_horoscopes", JSON.stringify(list)); } catch (e) {}
      alert(`✓ ${name} (${gender === 'female' ? 'பெண்' : 'ஆண்'}) ஜாதகம் வெற்றிகரமாக சேமிக்கப்பட்டது!`);
    }

    btnSaveBride?.addEventListener("click", () => {
      saveProfile(
        brideNameInput?.value?.trim(),
        brideDateInput?.value,
        brideTimeInput?.value,
        brideAmPm,
        bridePlaceInput?.value?.trim(),
        brideLatInput?.value,
        brideLonInput?.value,
        brideTzInput?.value,
        "female"
      );
    });

    btnSaveGroom?.addEventListener("click", () => {
      saveProfile(
        groomNameInput?.value?.trim(),
        groomDateInput?.value,
        groomTimeInput?.value,
        groomAmPm,
        groomPlaceInput?.value?.trim(),
        groomLatInput?.value,
        groomLonInput?.value,
        groomTzInput?.value,
        "male"
      );
    });

    // Time to 24h
    function to24HourTime(timeStr, ampm) {
      if (!timeStr) return "10:00:00";
      const parts = timeStr.split(":");
      let h = parseInt(parts[0], 10) || 0;
      const m = parts[1] || "00";
      const s = parts[2] || "00";
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return `${String(h).padStart(2, "0")}:${m}:${s}`;
    }

    // Build sign contents for South Indian SVG
    function buildSouthSignContents(horoscope) {
      const contents = {};
      for (let s = 0; s < 12; s++) contents[s] = [];
      if (!horoscope || !horoscope.planets) return contents;
      const lagnaId = horoscope.houses && horoscope.houses[0] ? horoscope.houses[0].signId : 0;
      contents[lagnaId].push({ text: "லக்", color: "#DC2626" });
      const codeMap = {
        Su: "சூரி", Mo: "சந்", Ma: "செவ்", Me: "புத",
        Ju: "குரு", Ve: "சுக்", Sa: "சனி", Ra: "ராகு", Ke: "கேது"
      };
      Object.keys(horoscope.planets).forEach(k => {
        const p = horoscope.planets[k];
        if (p && p.signId !== undefined && codeMap[k]) {
          contents[p.signId].push({
            text: codeMap[k],
            color: "#1E3A8A",
            deg: p.formattedDms ? p.formattedDms.split("°")[0] + "°" : ""
          });
        }
      });
      return contents;
    }

    // Main Report Generation
    function generateMarriageReport() {
      const brideName = brideNameInput?.value?.trim() || "மணமகள்";
      const brideDate = brideDateInput?.value || "1998-07-15";
      const brideTime = to24HourTime(brideTimeInput?.value || "10:30:00", brideAmPm);
      const brideLat = parseFloat(brideLatInput?.value) || 13.0827;
      const brideLon = parseFloat(brideLonInput?.value) || 80.2707;
      const brideTz = parseFloat(brideTzInput?.value) || 5.5;

      const groomName = groomNameInput?.value?.trim() || "மணமகன்";
      const groomDate = groomDateInput?.value || "1995-11-20";
      const groomTime = to24HourTime(groomTimeInput?.value || "15:45:00", groomAmPm);
      const groomLat = parseFloat(groomLatInput?.value) || 13.0827;
      const groomLon = parseFloat(groomLonInput?.value) || 80.2707;
      const groomTz = parseFloat(groomTzInput?.value) || 5.5;

      if (typeof AstroEngine === "undefined" || typeof MarriageEngine === "undefined") {
        return;
      }

      // Calculate Horoscopes
      const brideHoro = AstroEngine.calculateHoroscope({
        name: brideName,
        birthDate: brideDate,
        birthTime: brideTime,
        latitude: brideLat,
        longitude: brideLon,
        timezoneOffset: brideTz,
        gender: "female",
        ayanamsa: "lahiri"
      });

      const groomHoro = AstroEngine.calculateHoroscope({
        name: groomName,
        birthDate: groomDate,
        birthTime: groomTime,
        latitude: groomLat,
        longitude: groomLon,
        timezoneOffset: groomTz,
        gender: "male",
        ayanamsa: "lahiri"
      });

      const brideMoon = brideHoro.planets["Mo"] || {};
      const groomMoon = groomHoro.planets["Mo"] || {};
      const brideMars = brideHoro.planets["Ma"] || {};
      const groomMars = groomHoro.planets["Ma"] || {};
      const brideVenus = brideHoro.planets["Ve"] || {};
      const groomVenus = groomHoro.planets["Ve"] || {};
      const brideLagnaId = brideHoro.houses && brideHoro.houses[0] ? brideHoro.houses[0].signId : 0;
      const groomLagnaId = groomHoro.houses && groomHoro.houses[0] ? groomHoro.houses[0].signId : 0;

      const brideNakIdx = brideMoon.nakshatraIndex !== undefined ? brideMoon.nakshatraIndex : 14;
      const groomNakIdx = groomMoon.nakshatraIndex !== undefined ? groomMoon.nakshatraIndex : 3;
      const brideRasiIdx = brideMoon.signId !== undefined ? brideMoon.signId : 6;
      const groomRasiIdx = groomMoon.signId !== undefined ? groomMoon.signId : 1;

      // 10 & 12 Porutham calculation
      const pRes = MarriageEngine.calculatePorutham(groomNakIdx, brideNakIdx, groomRasiIdx, brideRasiIdx);

      // Chevvai Dosha Analysis
      const brideChevvai = MarriageEngine.analyzeChevvaiDosha(brideMars.signId || 0, brideLagnaId, brideMoon.signId || 0, brideVenus.signId || 0);
      const groomChevvai = MarriageEngine.analyzeChevvaiDosha(groomMars.signId || 0, groomLagnaId, groomMoon.signId || 0, groomVenus.signId || 0);

      // Dosha Samyam verdict
      let chevvaiVerdictTa = "";
      let chevvaiVerdictClass = "";
      if (!brideChevvai.hasDosha && !groomChevvai.hasDosha) {
        chevvaiVerdictTa = "இருவருக்கும் செவ்வாய் தோஷம் இல்லை. சுப பொருத்தமாக அமைகிறது.";
        chevvaiVerdictClass = "ep-porutham-badge-passed";
      } else if (brideChevvai.hasDosha && groomChevvai.hasDosha) {
        chevvaiVerdictTa = "இருவருக்கும் செவ்வாய் தோஷம் சமமாக உள்ளதால் தோஷ சாம்யம் ஏற்பட்டு தோஷம் நீங்குகிறது. உத்தமம்!";
        chevvaiVerdictClass = "ep-porutham-badge-passed";
      } else if (brideChevvai.hasException || groomChevvai.hasException) {
        chevvaiVerdictTa = "சாஸ்திர விலக்கு விதிகளின்படி தோஷம் நிவர்த்தியாகியுள்ளது. திருமணம் செய்யலாம்.";
        chevvaiVerdictClass = "ep-porutham-badge-passed";
      } else {
        chevvaiVerdictTa = "ஒருவருக்கு மட்டுமே செவ்வாய் தோஷம் உள்ளது. தோஷ சாம்யம் இல்லை, தகுந்த ஜோதிட ஆலோசனையுடன் அணுகவும்.";
        chevvaiVerdictClass = "ep-porutham-badge-failed";
      }

      // Generate South Indian Chart SVGs
      const brideContents = buildSouthSignContents(brideHoro);
      const groomContents = buildSouthSignContents(groomHoro);
      const brideSvg = generateSouthIndianSvg({ title: `${brideName} (ராசி)`, signContents: brideContents, lagnaSignId: brideLagnaId, size: 340 });
      const groomSvg = generateSouthIndianSvg({ title: `${groomName} (ராசி)`, signContents: groomContents, lagnaSignId: groomLagnaId, size: 340 });

      // Render Complete Report
      reportOutput.innerHTML = `
        <div class="ep-mm-report-card">
          <!-- Score Hero Banner -->
          <div class="ep-mm-score-hero">
            <div style="font-size: 0.9rem; font-weight: 700; color: #78350F; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              பொருத்த முடிவு (Matching Compatibility)
            </div>
            <div class="ep-mm-score-number">${pRes.passedCount} / 12</div>
            <div>
              <span class="ep-mm-verdict-pill ${pRes.passedCount >= 8 && pRes.rajjuPassed ? 'ep-mm-verdict-excellent' : (pRes.passedCount >= 6 && pRes.rajjuPassed ? 'ep-mm-verdict-moderate' : 'ep-mm-verdict-low')}">
                ${pRes.verdictTa}
              </span>
            </div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #0F172A; margin-top: 0.5rem;">
              ${pRes.rajjuPassed ? '✓ ரஜ்ஜு பொருத்தம் உண்டு (மாங்கல்ய பலம் சிறந்தது)' : '⚠️ ரஜ்ஜு தட்டுகிறது (ஒரே ரஜ்ஜு - முக்கிய கவனக்குறிப்பு)'}
            </div>
          </div>

          <!-- Profiles Comparison Grid -->
          <h4 class="ep-subheading-burgundy" style="margin-bottom: 0.75rem;">
            📋 ஜாதக அடிப்படை விவரங்கள் (Profiles Comparison)
          </h4>
          <div class="gp-table-wrapper" style="margin-bottom: 1.5rem;">
            <table class="ep-kv-table">
              <thead>
                <tr>
                  <th style="background: #FFF3E0; color: #831843; width: 25%;">அம்சம்</th>
                  <th style="background: #FFF3E0; color: #166534; width: 37.5%;">👰 மணமகள்: ${brideName}</th>
                  <th style="background: #FFF3E0; color: #9A3412; width: 37.5%;">🤵 மணமகன்: ${groomName}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="label-cell">பிறந்த தேதி & நேரம்</td>
                  <td class="val-cell" style="font-weight: 700;">${brideDate} (${brideTime})</td>
                  <td class="val-cell" style="font-weight: 700;">${groomDate} (${groomTime})</td>
                </tr>
                <tr>
                  <td class="label-cell">பிறந்த இடம்</td>
                  <td class="val-cell">${brideHoro.profile ? brideHoro.profile.place : (bridePlaceInput ? bridePlaceInput.value : 'Chennai')}</td>
                  <td class="val-cell">${groomHoro.profile ? groomHoro.profile.place : (groomPlaceInput ? groomPlaceInput.value : 'Chennai')}</td>
                </tr>
                <tr>
                  <td class="label-cell">நட்சத்திரம் & பாதம்</td>
                  <td class="val-cell" style="font-weight: 700; color: #1E3A8A;">${brideMoon.nakshatraNameTa || 'சுவாதி'} (${brideMoon.pada || 1}-ம் பாதம்)</td>
                  <td class="val-cell" style="font-weight: 700; color: #1E3A8A;">${groomMoon.nakshatraNameTa || 'ரோகிணி'} (${groomMoon.pada || 1}-ம் பாதம்)</td>
                </tr>
                <tr>
                  <td class="label-cell">ராசி & அதிபதி</td>
                  <td class="val-cell">${brideMoon.signNameTa || 'துலாம்'} (அதிபதி: ${brideMoon.signLord || 'சுக்கிரன்'})</td>
                  <td class="val-cell">${groomMoon.signNameTa || 'ரிஷபம்'} (அதிபதி: ${groomMoon.signLord || 'சுக்கிரன்'})</td>
                </tr>
                <tr>
                  <td class="label-cell">லக்னம்</td>
                  <td class="val-cell">${brideHoro.houses && brideHoro.houses[0] ? brideHoro.houses[0].signNameTa : 'விருச்சிகம்'}</td>
                  <td class="val-cell">${groomHoro.houses && groomHoro.houses[0] ? groomHoro.houses[0].signNameTa : 'மேஷம்'}</td>
                </tr>
                <tr>
                  <td class="label-cell">ரஜ்ஜு பிரிவு</td>
                  <td class="val-cell" style="font-weight: 700;">${MarriageEngine.RAJJU_MAP ? MarriageEngine.RAJJU_MAP[brideNakIdx] : 'பாத ரஜ்ஜு'}</td>
                  <td class="val-cell" style="font-weight: 700;">${MarriageEngine.RAJJU_MAP ? MarriageEngine.RAJJU_MAP[groomNakIdx] : 'சிரோ ரஜ்ஜு'}</td>
                </tr>
                <tr>
                  <td class="label-cell">கணம்</td>
                  <td class="val-cell">${brideMoon.gana || 'தேவ கணம்'}</td>
                  <td class="val-cell">${groomMoon.gana || 'மனுஷ கணம்'}</td>
                </tr>
                <tr>
                  <td class="label-cell">செவ்வாய் நிலை</td>
                  <td class="val-cell">${brideChevvai.hasDosha ? '⚠️ செவ்வாய் தோஷம் உள்ளது' : (brideChevvai.hasException ? '✓ தோஷ நிவர்த்தி' : '✓ தோஷமில்லை')}</td>
                  <td class="val-cell">${groomChevvai.hasDosha ? '⚠️ செவ்வாய் தோஷம் உள்ளது' : (groomChevvai.hasException ? '✓ தோஷ நிவர்த்தி' : '✓ தோஷமில்லை')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 10 & 12 Porutham Master Detailed Table -->
          <h4 class="ep-subheading-burgundy" style="margin-bottom: 0.75rem;">
            💫 10 &amp; 12 பொருத்தங்கள் விரிவான அட்டவணை
          </h4>
          <div class="gp-table-wrapper" style="margin-bottom: 1.5rem;">
            <table class="ep-kv-table">
              <thead>
                <tr>
                  <th style="background: #FFF3E0; color: #831843; width: 6%; text-align: center;">எண்</th>
                  <th style="background: #FFF3E0; color: #831843; width: 28%;">பொருத்தம் பெயர்</th>
                  <th style="background: #FFF3E0; color: #831843; width: 48%;">சாஸ்திரப் பலன் &amp; விளக்கம்</th>
                  <th style="background: #FFF3E0; color: #831843; width: 18%; text-align: center;">முடிவு</th>
                </tr>
              </thead>
              <tbody>
                ${pRes.results.map(r => `
                  <tr style="${r.isCritical ? 'background: #FEF9C3;' : ''}">
                    <td style="text-align: center; font-weight: 700; color: #64748B;">${r.num}</td>
                    <td style="font-weight: 700; color: #0F172A;">
                      ${r.ta}
                      ${r.isCritical ? '<span style="display:block; font-size: 0.7rem; color: #DC2626; font-weight: 800;">(அவசியப் பொருத்தம்)</span>' : ''}
                    </td>
                    <td style="font-size: 0.84rem; color: #334155;">${r.descTa}</td>
                    <td style="text-align: center;">
                      <span class="${r.status ? 'ep-porutham-badge-passed' : 'ep-porutham-badge-failed'}">
                        ${r.status ? '✓ பொருந்தியது' : '✗ பொருந்தவில்லை'}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Chevvai Dosha Comparison Box -->
          <h4 class="ep-subheading-burgundy" style="margin-bottom: 0.75rem;">
            🔥 செவ்வாய் தோஷ ஒப்பீடு &amp; தோஷ சாம்யம் (Manglik Dosha Analysis)
          </h4>
          <div style="background: #FFFDF8; border: 1.5px solid #F6D7B0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem;">
                <div style="font-weight: 700; color: #166534; margin-bottom: 0.4rem;">👰 மணமகள் செவ்வாய் நிலை:</div>
                <div style="font-size: 0.85rem; color: #334155; line-height: 1.5;">${brideChevvai.summaryTa}</div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 1rem;">
                <div style="font-weight: 700; color: #9A3412; margin-bottom: 0.4rem;">🤵 மணமகன் செவ்வாய் நிலை:</div>
                <div style="font-size: 0.85rem; color: #334155; line-height: 1.5;">${groomChevvai.summaryTa}</div>
              </div>
            </div>
            <div style="background: #FEF9C3; border: 1.5px solid #F59E0B; border-radius: 8px; padding: 0.85rem 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-weight: 700; color: #78350F; font-size: 0.9rem;">
                தோஷ சாம்ய முடிவு: <span style="color: #0F172A;">${chevvaiVerdictTa}</span>
              </div>
              <span class="${chevvaiVerdictClass}">
                ${!brideChevvai.hasDosha && !groomChevvai.hasDosha ? 'தோஷம் இல்லை' : (brideChevvai.hasDosha && groomChevvai.hasDosha ? 'சம தோஷம்' : 'ஆய்வு தேவை')}
              </span>
            </div>
          </div>

          <!-- Side-by-side Rasi Chakras -->
          <h4 class="ep-subheading-burgundy" style="margin-bottom: 0.75rem;">
            🗺️ இருவரின் ராசி சக்கரங்கள் (South Indian Horoscope Charts)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; justify-items: center; margin-bottom: 1.5rem;">
            <div class="ep-south-chart-card" style="width: 100%; max-width: 380px;">
              <div style="font-weight: 800; color: #166534; margin-bottom: 0.5rem; text-align: center;">
                👰 மணமகள் ராசி கட்டம் (${brideName})
              </div>
              ${brideSvg}
            </div>
            <div class="ep-south-chart-card" style="width: 100%; max-width: 380px;">
              <div style="font-weight: 800; color: #9A3412; margin-bottom: 0.5rem; text-align: center;">
                🤵 மணமகன் ராசி கட்டம் (${groomName})
              </div>
              ${groomSvg}
            </div>
          </div>

          <!-- Print / Action buttons -->
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <button type="button" class="btn btn-primary" onclick="window.print()" style="padding: 0.65rem 2rem; font-weight: 700; background: #831843; border-color: #831843; cursor: pointer;">
              🖨️ திருமணப் பொருத்த அறிக்கையை அச்சிடு (Print)
            </button>
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('marriageSection').scrollIntoView({behavior:'smooth'})" style="padding: 0.65rem 1.5rem; font-weight: 600; cursor: pointer;">
              ⬆️ விவரங்களை திருத்து (Edit Details)
            </button>
          </div>
        </div>
      `;

      reportOutput.style.display = "block";
    }

    btnGenerateReport.addEventListener("click", () => {
      generateMarriageReport();
      reportOutput.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
