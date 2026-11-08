import json

with open('scratch/chart_1988.json', encoding='utf-8') as f:
    d = json.load(f)

planets = d['planets']
vargas = d['vargas']

with open('scratch/inspect_1988_out.txt', 'w', encoding='utf-8') as out:
    out.write("=== 1988 PLANETS DETAILED ===\n")
    for code, p in planets.items():
        deg_in_sign = p['longitude'] % 30.0
        out.write(f"{code:4} | {p['nameTa']:8} | {p['signNameTa']:10} ({p['signId']:2}) | {deg_in_sign:6.2f}° | {p.get('nakshatraNameTa')}-{p.get('pada')} ({p.get('starLord')}) | Dig: {p.get('dignityTa')} | Retro: {p.get('isRetrograde')} | Combust: {p.get('isCombust')}\n")

    out.write("\n=== BHAVAS (From Dhanusu Lagna) ===\n")
    sign_names = ["மேஷம்", "ரிஷபம்", "மிதுனம்", "கடகம்", "சிம்மம்", "கன்னி", "துலாம்", "விருச்சிகம்", "தனுசு", "மகரம்", "கும்பம்", "மீனம்"]
    for h in range(1, 13):
        s_id = (8 + h - 1) % 12
        s_name = sign_names[s_id]
        occ = [f"{k} ({planets[k]['nameTa']})" for k, v in planets.items() if v['signId'] == s_id and k != 'Asc']
        out.write(f"Bhava {h:2} ({s_name:10}): {', '.join(occ) if occ else 'Empty'}\n")

    out.write("\n=== D9 NAVAMSHA ===\n")
    for code, s_id in vargas.get('D9', {}).items():
        out.write(f"{code:4} in D9: {sign_names[s_id]} ({s_id})\n")

print("Wrote inspect_1988_out.txt")
