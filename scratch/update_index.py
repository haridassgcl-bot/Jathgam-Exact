with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('scratch/select_snippet.html', 'r', encoding='utf-8') as f:
    select_snippet = f.read()

old_block = '''                <div class="ep-place-input-wrapper">
                  <div class="ep-place-input-group">
                    <input type="text" id="inputBirthPlace" class="ep-input" list="tnCitiesList" placeholder="ஊர் அல்லது நகரம் (எ.கா: மதுரை, Chennai, Singapore, London...)" value="Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India" required autocomplete="off">
                    <button type="button" id="btnTogglePlacesDropdown" class="ep-place-dropdown-toggle" title="அனைத்து இடங்களையும் பார்க்க (273 இடங்கள்)">▾</button>
                  </div>

                  <!-- Custom Searchable Dropdown Popup (273 Places) -->
                  <div id="placesDropdownPanel" class="ep-places-dropdown-panel" style="display: none;">
                    <div class="ep-places-dropdown-header">
                      <div class="ep-place-tabs-row">
                        <button type="button" class="ep-place-tab-btn active" data-tab="all">🌟 அனைத்தும் (273)</button>
                        <button type="button" class="ep-place-tab-btn" data-tab="tn">📍 தமிழ்நாடு (38+)</button>
                        <button type="button" class="ep-place-tab-btn" data-tab="india">🇮🇳 இந்தியா</button>
                        <button type="button" class="ep-place-tab-btn" data-tab="world">🌍 உலகம்</button>
                      </div>
                      <div class="ep-places-search-wrap">
                        <span>🔍</span>
                        <input type="text" id="placesSearchInput" placeholder="ஊர் / மாவட்டம் / நாடு தேடவும் (தமிழ் / English)..." autocomplete="off">
                      </div>
                    </div>
                    <div id="placesListItems" class="ep-places-list-container">
                      <!-- Populated dynamically -->
                    </div>
                  </div>
                </div>
                <datalist id="tnCitiesList">
                  <!-- Populated dynamically with all 273 places -->
                </datalist>'''

new_block = f'''                <div class="ep-place-input-wrapper">
                  <div class="ep-place-input-group">
                    <input type="text" id="inputBirthPlace" class="ep-input" placeholder="ஊர் அல்லது நகரம் தேடவும் (எ.கா: மதுரை, Chennai, Singapore, London...)" value="Tiruvannamalai (திருவண்ணாமலை), Tamil Nadu, India" required autocomplete="off">
                    <button type="button" id="btnClearBirthPlace" class="ep-place-clear-btn" title="அழித்து புதிதாகத் தேடவும்">✕</button>
                    <button type="button" id="btnTogglePlacesDropdown" class="ep-place-dropdown-toggle" title="அனைத்து இடங்களையும் பார்க்க (273 இடங்கள்)">▾</button>
                  </div>

                  <!-- Custom Searchable Dropdown Popup (273 Places) -->
                  <div id="placesDropdownPanel" class="ep-places-dropdown-panel" style="display: none;">
                    <div class="ep-places-dropdown-header">
                      <div class="ep-place-tabs-row">
                        <button type="button" class="ep-place-tab-btn active" data-tab="all">🌟 அனைத்தும் (273)</button>
                        <button type="button" class="ep-place-tab-btn" data-tab="tn">📍 தமிழ்நாடு (38+)</button>
                        <button type="button" class="ep-place-tab-btn" data-tab="india">🇮🇳 இந்தியா</button>
                        <button type="button" class="ep-place-tab-btn" data-tab="world">🌍 உலகம்</button>
                      </div>
                      <div class="ep-places-search-wrap">
                        <span>🔍</span>
                        <input type="text" id="placesSearchInput" placeholder="ஊர் / மாவட்டம் / நாடு தேடவும் (தமிழ் / English)..." autocomplete="off">
                      </div>
                    </div>
                    <div id="placesListItems" class="ep-places-list-container">
                      <!-- Populated dynamically -->
                    </div>
                  </div>
                </div>

                <!-- Direct Dropdown: 38 Districts & Global Cities -->
                <div style="margin-top: 6px;">
{select_snippet}
                </div>'''

if old_block in html:
    html = html.replace(old_block, new_block, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("SUCCESS: index.html updated successfully!")
else:
    print("ERROR: old_block not found in index.html!")
