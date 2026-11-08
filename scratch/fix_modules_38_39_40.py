# -*- coding: utf-8 -*-
import sys

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace m38 hardcoded block
old_m38_target = '''            <!-- Jamakkol Graha Dispositions Table -->
            <div style="background: rgba(14,22,46,0.85); border: 1px solid rgba(212,175,55,0.35); border-radius: 12px; padding: 1.25rem;">
              <h4 style="color: #F7D774; margin: 0 0 1rem 0; font-size: 1.1rem; font-weight: 700;">
                🪐 ஜாமக்கோள் கிரக நிலைகள் (உள் மற்றும் வெளிவட்டம்)
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-size: 0.88rem;">
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">மேஷம்:</strong> சூரி 16°51′, குரு 18°27′, புத 28°18′
                </div>
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">ரிஷபம்:</strong> சுக் 28°55′, கவிப்பு 00°00′
                </div>
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">சிம்மம்:</strong> உதயம் 15°00′, கேது 27°04′
                </div>
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">துலாம்:</strong> சந்திரன் 01°34′
                </div>
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">தனுசு:</strong> சனி* 08°33′, லக்னம் 08°37′
                </div>
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">மகரம்:</strong> மாந்தி 07°44′, செவ்வாய் 22°12′
                </div>
                <div style="background: rgba(15,23,42,0.7); padding: 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                  <strong style="color:#FDE68A;">கும்பம்:</strong> ஆரூடம் 00°10′, பாம்பு (ராகு) 27°05′
                </div>
              </div>
            </div>'''

new_m38_replacement = '''            <!-- Jamakkol Graha Dispositions Table - Dynamic -->
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
            </div>'''

if old_m38_target in text:
    text = text.replace(old_m38_target, new_m38_replacement)
    print("SUCCESS: m38 updated to dynamic!")
else:
    print("WARNING: m38 target not matched")

# Replace m39 sampleCalculations
old_m39_target = '''      case "m39": // 39 பாவாத் பாவம் (Bhavat Bhavam)
        const sampleCalculations = [
          { qNo: 1, title: "குணம் / ஆளுமை / உடல்நலம்", finalBhava: 1, sign: "தனுசு" },
          { qNo: 2, title: "செல்வம் / நிதி / பேச்சு", finalBhava: 2, sign: "மகரம்" },
          { qNo: 3, title: "இளைய உடன்பிறப்புகள்", finalBhava: 3, sign: "கும்பம்" },
          { qNo: 4, title: "தாய்", finalBhava: 4, sign: "மீனம்" },
          { qNo: 5, title: "அதிர்ஷ்டம் / பாக்கியம் / ஆசிகள்", finalBhava: 5, sign: "மேஷம்" },
          { qNo: 6, title: "நோய் / கடன் / பிரச்சினைகள்", finalBhava: 6, sign: "ரிஷபம்" },
          { qNo: 7, title: "துணை / திருமணம்", finalBhava: 7, sign: "மிதுனம்" },
          { qNo: 8, title: "ஆயுள் / சொத்து", finalBhava: 8, sign: "கடகம்" },
          { qNo: 9, title: "தந்தை / பாக்கியம்", finalBhava: 9, sign: "சிம்மம்" },
          { qNo: 10, title: "தொழில் / வேலை / நிலை", finalBhava: 10, sign: "கன்னி" },
          { qNo: 11, title: "நண்பர்கள் / சமூக வட்டம்", finalBhava: 11, sign: "துலாம்" },
          { qNo: 12, title: "தூக்கம் / இழப்பு / மருத்துவமனை", finalBhava: 12, sign: "விருச்சிகம்" }
        ];'''

new_m39_replacement = '''      case "m39": { // 39 பாவாத் பாவம் (Bhavat Bhavam) - Dynamic
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
        }));'''

if old_m39_target in text:
    text = text.replace(old_m39_target, new_m39_replacement)
    print("SUCCESS: m39 updated to dynamic!")
else:
    print("WARNING: m39 target not matched")

# Replace m40 circuit strip
old_m40_target = '''                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.72rem; color: #94A3B8;">குறிப்பு வோல்டேஜ்</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #FFF;">230 V</div>
                  <div style="font-size: 0.72rem; color: #CBD5E1;">ராசி: தனுசு</div>
                </div>'''

new_m40_replacement = '''                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem; border-radius: 8px; text-align: center;">
                  <div style="font-size: 0.72rem; color: #94A3B8;">குறிப்பு வோல்டேஜ்</div>
                  <div style="font-size: 1.35rem; font-weight: 800; color: #FFF;">230 V</div>
                  <div style="font-size: 0.72rem; color: #CBD5E1;">ராசி: ${data.lagna ? data.lagna.signNameTa : 'மேஷம்'}</div>
                </div>'''

if old_m40_target in text:
    text = text.replace(old_m40_target, new_m40_replacement)
    print("SUCCESS: m40 voltage label updated to dynamic!")
else:
    print("WARNING: m40 target not matched")

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Done writing js/app.js!")
