import json
import re

with open('js/places-data.js', 'r', encoding='utf-8') as f:
    c = f.read()

m = re.search(r'const GLOBAL_PLACES_DB = (\[.*?\]);', c, re.DOTALL)
places = json.loads(m.group(1))

tn = [p for p in places if p['cat'] == 'tn']
india = [p for p in places if p['cat'] == 'india']
world = [p for p in places if p['cat'] in ('world', 'country')]

def escape_html(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

lines = []
lines.append('<select id="quickDistrictSelect" class="ep-select ep-quick-place-select" aria-label="மாவட்டங்கள் மற்றும் நகரங்கள் பட்டியல்">')
lines.append('  <option value="">✨ பட்டியலிலிருந்து நேரடியாக மாவட்டத்தை / ஊரைத் தேர்ந்தெடுக்கவும் (273 இடங்கள்)...</option>')

lines.append('  <optgroup label="📍 தமிழ்நாடு 38 மாவட்டங்கள் &amp; முக்கிய தலங்கள் (47 இடங்கள்)">')
for p in tn:
    lines.append(f'    <option value="{escape_html(p["name"])}">{escape_html(p["name"])}</option>')
lines.append('  </optgroup>')

lines.append('  <optgroup label="🇮🇳 இந்திய மாநிலத் தலைநகரங்கள் &amp; பெருநகரங்கள் (73 இடங்கள்)">')
for p in india:
    lines.append(f'    <option value="{escape_html(p["name"])}">{escape_html(p["name"])}</option>')
lines.append('  </optgroup>')

lines.append('  <optgroup label="🌍 உலக நாடுகள் &amp; முக்கிய நகரங்கள் (153 இடங்கள்)">')
for p in world:
    lines.append(f'    <option value="{escape_html(p["name"])}">{escape_html(p["name"])}</option>')
lines.append('  </optgroup>')

lines.append('</select>')

output = '\n'.join(lines)
with open('scratch/select_snippet.html', 'w', encoding='utf-8') as f:
    f.write(output)

print(f'Generated snippet successfully: {len(lines)} lines, {len(output)} chars')
