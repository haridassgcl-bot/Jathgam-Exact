import json

with open('scratch/chart_output.json', encoding='utf-8') as f:
    d = json.load(f)

planets = d['planets']
lagna = d['lagna']

with open('scratch/inspect_out.txt', 'w', encoding='utf-8') as out:
    out.write("=== DETAILED PLANETARY POSITIONS ===\n")
    for code, p in planets.items():
        deg_in_sign = p['longitude'] % 30.0
        deg = int(deg_in_sign)
        minute = int((deg_in_sign - deg) * 60)
        sec = int((((deg_in_sign - deg) * 60) - minute) * 60)
        pos_str = f"{deg}° {minute}' {sec}\""
        out.write(f"{code:4} | {p['nameTa']:8} | {p['signNameTa']:10} ({p['signId']:2}) | {pos_str:10} | {p.get('nakshatraNameTa')}-{p.get('pada')} ({p.get('starLord')}) | Dig: {p.get('dignityTa')} | Retro: {p.get('isRetrograde')} | Combust: {p.get('isCombust')}\n")

    out.write("\n=== NAVAMSHA (D9) POSITIONS ===\n")
    vargas = d.get('vargas', {})
    d9 = vargas.get('D9', {})
    sign_names = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"]
    for code, s_id in d9.items():
        s_name = sign_names[s_id] if 0 <= s_id < 12 else str(s_id)
        out.write(f"{code:4} in D9: {s_name} ({s_id})\n")

    out.write("\n=== BHAVA HOUSES FROM LAGNA (Dhanusu) ===\n")
    for h in range(1, 13):
        s_id = (8 + h - 1) % 12
        s_name = sign_names[s_id]
        occ = [f"{k} ({planets[k]['nameTa']})" for k, v in planets.items() if v['signId'] == s_id and k != 'Asc']
        out.write(f"Bhava {h:2} ({s_name:10}): {', '.join(occ) if occ else 'Empty'}\n")

print("Written successfully!")
