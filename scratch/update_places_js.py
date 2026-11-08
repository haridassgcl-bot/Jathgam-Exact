with open('js/places-data.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = '''let currentPlaceCategory = "all";
let currentPlaceSearchQuery = "";

function renderPlacesDropdownItems() {
  const container = document.getElementById("placesListItems");
  if (!container) return;

  let list = GLOBAL_PLACES_DB;

  // Filter by category
  if (currentPlaceCategory && currentPlaceCategory !== "all") {
    if (currentPlaceCategory === "tn") {
      list = GLOBAL_PLACES_DB.filter(p => p.cat === "tn");
    } else if (currentPlaceCategory === "india") {
      list = GLOBAL_PLACES_DB.filter(p => p.cat === "india" || p.cat === "tn");
    } else if (currentPlaceCategory === "world") {
      list = GLOBAL_PLACES_DB.filter(p => p.cat === "world" || p.cat === "country");
    }
  }

  // Filter by search query
  if (currentPlaceSearchQuery) {
    const q = currentPlaceSearchQuery.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      (p.state && p.state.toLowerCase().includes(q)) ||
      p.country.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: #94A3B8; font-size: 0.85rem;">
        🔍 இடம் எதுவும் கிடைக்கவில்லை. வேறு பெயரைத் தேடவும்.
      </div>
    `;
    return;
  }

  let html = "";
  list.forEach(p => {
    const icon = p.cat === "tn" ? "📍" : (p.cat === "india" ? "🇮🇳" : "🌍");
    const latStr = Math.abs(p.lat).toFixed(2) + (p.lat >= 0 ? "°N" : "°S");
    const lonStr = Math.abs(p.lon).toFixed(2) + (p.lon >= 0 ? "°E" : "°W");
    const safeName = p.name.replace(/"/g, '&quot;');
    const safeSub = (p.state ? p.state + ', ' + p.country : p.country).replace(/"/g, '&quot;');

    html += `
      <div class="ep-place-item" data-place-name="${safeName}">
        <div class="ep-place-item-left">
          <span class="ep-place-item-icon">${icon}</span>
          <div class="ep-place-item-info">
            <span class="ep-place-item-name">${p.name}</span>
            <span class="ep-place-item-sub">${safeSub}</span>
          </div>
        </div>
        <span class="ep-place-item-right">${latStr}, ${lonStr}</span>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll(".ep-place-item").forEach(item => {
    item.addEventListener("click", () => {
      const selectedName = item.getAttribute("data-place-name");
      selectPlace(selectedName);
    });
  });
}

function selectPlace(name) {
  const inputPlace = document.getElementById("inputBirthPlace");
  if (inputPlace) {
    inputPlace.value = name;
  }
  updatePlaceGeoInfo(name);
  hidePlacesDropdown();
}

function showPlacesDropdown() {
  const panel = document.getElementById("placesDropdownPanel");
  if (panel) {
    panel.style.display = "flex";
    renderPlacesDropdownItems();
  }
}

function hidePlacesDropdown() {
  const panel = document.getElementById("placesDropdownPanel");
  if (panel) {
    panel.style.display = "none";
  }
}

function togglePlacesDropdown() {
  const panel = document.getElementById("placesDropdownPanel");
  if (panel && panel.style.display !== "none") {
    hidePlacesDropdown();
  } else {
    showPlacesDropdown();
  }
}

/**
 * Initialize Places Autocomplete, Datalist, and Custom Dropdown
 */
function initPlacesAutocomplete() {
  populatePlacesDataList("tnCitiesList", "all");

  const inputPlace = document.getElementById("inputBirthPlace");
  const toggleBtn = document.getElementById("btnTogglePlacesDropdown");
  const searchInput = document.getElementById("placesSearchInput");
  const panel = document.getElementById("placesDropdownPanel");

  if (inputPlace) {
    updatePlaceGeoInfo(inputPlace.value);

    // On click or focus, select all text and show dropdown
    inputPlace.addEventListener("focus", () => {
      inputPlace.select();
      showPlacesDropdown();
    });

    inputPlace.addEventListener("click", () => {
      showPlacesDropdown();
    });

    // Real-time filtering as user types in input
    inputPlace.addEventListener("input", (e) => {
      currentPlaceSearchQuery = e.target.value;
      if (searchInput) searchInput.value = e.target.value;
      showPlacesDropdown();
      updatePlaceGeoInfo(e.target.value);
    });

    inputPlace.addEventListener("change", (e) => {
      const match = updatePlaceGeoInfo(e.target.value);
      if (match && match.name !== e.target.value && e.target.value.length >= 3) {
        inputPlace.value = match.name;
      }
    });
  }

  // Toggle dropdown button
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlacesDropdown();
      if (inputPlace) inputPlace.focus();
    });
  }

  // Search input inside dropdown panel
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentPlaceSearchQuery = e.target.value;
      renderPlacesDropdownItems();
    });
  }

  // Category Tabs inside dropdown panel
  document.querySelectorAll(".ep-place-tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".ep-place-tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentPlaceCategory = tab.getAttribute("data-tab") || "all";
      renderPlacesDropdownItems();
      if (searchInput) searchInput.focus();
    });
  });

  // Top region filter pills
  document.querySelectorAll(".ep-place-pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".ep-place-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const cat = pill.getAttribute("data-place-cat") || "all";
      currentPlaceCategory = cat;

      // Sync dropdown tabs
      document.querySelectorAll(".ep-place-tab-btn").forEach(t => {
        if (t.getAttribute("data-tab") === cat) t.classList.add("active");
        else t.classList.remove("active");
      });

      populatePlacesDataList("tnCitiesList", cat);
      showPlacesDropdown();
      if (inputPlace) inputPlace.focus();
    });
  });

  // Click outside to close dropdown
  document.addEventListener("click", (e) => {
    if (panel && panel.style.display !== "none") {
      const wrapper = document.querySelector(".ep-place-input-wrapper");
      const pillBar = document.querySelector(".ep-place-filter-pills");
      if (wrapper && !wrapper.contains(e.target) && (!pillBar || !pillBar.contains(e.target))) {
        hidePlacesDropdown();
      }
    }
  });

  // Initial render of items
  renderPlacesDropdownItems();
}'''

replacement = '''let currentPlaceCategory = "all";
let currentPlaceSearchQuery = "";

function renderPlacesDropdownItems() {
  const container = document.getElementById("placesListItems");
  if (!container) return;

  let list = GLOBAL_PLACES_DB;

  // 1. Filter by category
  if (currentPlaceCategory && currentPlaceCategory !== "all") {
    if (currentPlaceCategory === "tn") {
      list = GLOBAL_PLACES_DB.filter(p => p.cat === "tn");
    } else if (currentPlaceCategory === "india") {
      list = GLOBAL_PLACES_DB.filter(p => p.cat === "india" || p.cat === "tn");
    } else if (currentPlaceCategory === "world") {
      list = GLOBAL_PLACES_DB.filter(p => p.cat === "world" || p.cat === "country");
    }
  }

  // 2. Filter by search query
  const inputPlace = document.getElementById("inputBirthPlace");
  const currentVal = inputPlace ? inputPlace.value.trim().toLowerCase() : "";

  // If query equals the full current place name, do not restrict the list to 1 item! Show all places.
  const q = (currentPlaceSearchQuery || "").trim().toLowerCase();
  if (q && q !== currentVal) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      (p.state && p.state.toLowerCase().includes(q)) ||
      p.country.toLowerCase().includes(q)
    );
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: #94A3B8; font-size: 0.85rem;">
        🔍 "${currentPlaceSearchQuery}" - இடம் எதுவும் கிடைக்கவில்லை.<br>
        <span style="font-size:0.75rem; color:#64748B;">வேறு பெயரைத் தேடவும் அல்லது கீழே உள்ள பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்.</span>
      </div>
    `;
    return;
  }

  let html = "";
  list.forEach(p => {
    const isSelected = currentVal && (p.name.toLowerCase() === currentVal || p.city.toLowerCase() === currentVal);
    const icon = p.cat === "tn" ? "📍" : (p.cat === "india" ? "🇮🇳" : "🌍");
    const latStr = Math.abs(p.lat).toFixed(2) + (p.lat >= 0 ? "°N" : "°S");
    const lonStr = Math.abs(p.lon).toFixed(2) + (p.lon >= 0 ? "°E" : "°W");
    const safeName = p.name.replace(/"/g, '&quot;');
    const safeSub = (p.state ? p.state + ', ' + p.country : p.country).replace(/"/g, '&quot;');
    const selectedBadge = isSelected ? '<span style="background:#10B981; color:#fff; font-size:0.68rem; padding:1px 6px; border-radius:4px; font-weight:700; margin-left:6px;">✓ தேர்வு</span>' : '';

    html += `
      <div class="ep-place-item ${isSelected ? 'selected' : ''}" data-place-name="${safeName}">
        <div class="ep-place-item-left">
          <span class="ep-place-item-icon">${icon}</span>
          <div class="ep-place-item-info">
            <span class="ep-place-item-name">${p.name} ${selectedBadge}</span>
            <span class="ep-place-item-sub">${safeSub} • ${p.tz >= 0 ? '+' : ''}${p.tz} hrs</span>
          </div>
        </div>
        <span class="ep-place-item-right">${latStr}, ${lonStr}</span>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll(".ep-place-item").forEach(item => {
    item.addEventListener("click", () => {
      const selectedName = item.getAttribute("data-place-name");
      selectPlace(selectedName);
    });
  });
}

function selectPlace(name) {
  const inputPlace = document.getElementById("inputBirthPlace");
  if (inputPlace) {
    inputPlace.value = name;
  }

  const quickSelect = document.getElementById("quickDistrictSelect");
  if (quickSelect) {
    // Attempt exact match or city match
    let matched = false;
    for (let i = 0; i < quickSelect.options.length; i++) {
      if (quickSelect.options[i].value === name) {
        quickSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Try matching by first word (city name)
      const firstWord = name.split(" ")[0].toLowerCase();
      for (let i = 0; i < quickSelect.options.length; i++) {
        if (quickSelect.options[i].value.toLowerCase().startsWith(firstWord)) {
          quickSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  currentPlaceSearchQuery = "";
  const searchInput = document.getElementById("placesSearchInput");
  if (searchInput) searchInput.value = "";

  updatePlaceGeoInfo(name);
  hidePlacesDropdown();
}

function showPlacesDropdown(forceShowAll = false) {
  const panel = document.getElementById("placesDropdownPanel");
  if (!panel) return;

  const inputPlace = document.getElementById("inputBirthPlace");
  const searchInput = document.getElementById("placesSearchInput");
  const currentVal = inputPlace ? inputPlace.value.trim().toLowerCase() : "";

  // If opening dropdown or forceShowAll, ensure we show all places rather than locking to current selection
  if (forceShowAll || (currentVal && currentPlaceSearchQuery.trim().toLowerCase() === currentVal)) {
    currentPlaceSearchQuery = "";
    if (searchInput) searchInput.value = "";
  }

  panel.style.display = "flex";
  renderPlacesDropdownItems();

  // Scroll active item into view smoothly
  const selectedItem = panel.querySelector(".ep-place-item.selected");
  if (selectedItem) {
    selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function hidePlacesDropdown() {
  const panel = document.getElementById("placesDropdownPanel");
  if (panel) {
    panel.style.display = "none";
  }
}

function togglePlacesDropdown() {
  const panel = document.getElementById("placesDropdownPanel");
  if (panel && panel.style.display !== "none") {
    hidePlacesDropdown();
  } else {
    showPlacesDropdown(true);
  }
}

/**
 * Initialize Places Autocomplete, Quick Select, and Custom Dropdown
 */
function initPlacesAutocomplete() {
  populatePlacesDataList("tnCitiesList", "all");

  const inputPlace = document.getElementById("inputBirthPlace");
  const toggleBtn = document.getElementById("btnTogglePlacesDropdown");
  const clearBtn = document.getElementById("btnClearBirthPlace");
  const searchInput = document.getElementById("placesSearchInput");
  const quickSelect = document.getElementById("quickDistrictSelect");
  const panel = document.getElementById("placesDropdownPanel");

  if (inputPlace) {
    updatePlaceGeoInfo(inputPlace.value);

    // On focus or click: open dropdown showing all 273 places
    inputPlace.addEventListener("focus", () => {
      showPlacesDropdown(true);
    });

    inputPlace.addEventListener("click", () => {
      showPlacesDropdown(true);
    });

    // Real-time filtering as user types in input
    inputPlace.addEventListener("input", (e) => {
      currentPlaceSearchQuery = e.target.value;
      if (searchInput) searchInput.value = e.target.value;
      showPlacesDropdown(false);
      updatePlaceGeoInfo(e.target.value);
    });

    inputPlace.addEventListener("change", (e) => {
      const match = updatePlaceGeoInfo(e.target.value);
      if (match && match.name !== e.target.value && e.target.value.length >= 3) {
        inputPlace.value = match.name;
        if (quickSelect) quickSelect.value = match.name;
      }
    });
  }

  // Clear button: clears field and displays all 273 places immediately
  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (inputPlace) {
        inputPlace.value = "";
        inputPlace.focus();
      }
      if (searchInput) searchInput.value = "";
      if (quickSelect) quickSelect.value = "";
      currentPlaceSearchQuery = "";
      showPlacesDropdown(true);
    });
  }

  // Quick Select dropdown handler: 38 Districts, Indian Cities, World
  if (quickSelect) {
    quickSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val) {
        selectPlace(val);
      }
    });
  }

  // Toggle dropdown button
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlacesDropdown();
    });
  }

  // Search input inside dropdown panel
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentPlaceSearchQuery = e.target.value;
      renderPlacesDropdownItems();
    });
  }

  // Category Tabs inside dropdown panel
  document.querySelectorAll(".ep-place-tab-btn").forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".ep-place-tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentPlaceCategory = tab.getAttribute("data-tab") || "all";
      currentPlaceSearchQuery = "";
      if (searchInput) searchInput.value = "";
      renderPlacesDropdownItems();
      if (searchInput) searchInput.focus();
    });
  });

  // Top region filter pills
  document.querySelectorAll(".ep-place-pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".ep-place-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      const cat = pill.getAttribute("data-place-cat") || "all";
      currentPlaceCategory = cat;
      currentPlaceSearchQuery = "";
      if (searchInput) searchInput.value = "";

      // Sync dropdown tabs
      document.querySelectorAll(".ep-place-tab-btn").forEach(t => {
        if (t.getAttribute("data-tab") === cat) t.classList.add("active");
        else t.classList.remove("active");
      });

      populatePlacesDataList("tnCitiesList", cat);
      showPlacesDropdown(true);
    });
  });

  // Click outside to close dropdown
  document.addEventListener("click", (e) => {
    if (panel && panel.style.display !== "none") {
      const wrapper = document.querySelector(".ep-place-input-wrapper");
      const pillBar = document.querySelector(".ep-place-filter-pills");
      if (wrapper && !wrapper.contains(e.target) && (!pillBar || !pillBar.contains(e.target))) {
        hidePlacesDropdown();
      }
    }
  });

  // Initial render of items
  renderPlacesDropdownItems();
}'''

if target in code:
    code = code.replace(target, replacement, 1)
    with open('js/places-data.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS: places-data.js updated successfully!")
else:
    print("ERROR: target block not found in places-data.js")
