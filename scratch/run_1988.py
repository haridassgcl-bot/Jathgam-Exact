import sys
sys.path.append('.')
from thirukanitham_engine.report_generator import generate_tamil_astrology_report
import json

rep = generate_tamil_astrology_report(
    name='User',
    gender='Male',
    birth_date_str='1988-04-30',
    birth_time_str='22:10:00',
    place_name='Tiruvannamalai',
    latitude=12.2253,
    longitude=79.0747,
    timezone_offset=5.5
)

with open('scratch/chart_1988.json', 'w', encoding='utf-8') as f:
    json.dump(rep, f, ensure_ascii=False, indent=2)

planets = rep['planets']
lagna = rep['lagna']
dasha = rep['dasha']

with open('scratch/readable_1988.txt', 'w', encoding='utf-8') as out:
    out.write("=== 1988-04-30 22:10 TIRUVANNAMALAI ===\n")
    out.write(f"Lagna: {lagna}\n")
    out.write(f"Panchangam: {rep.get('panchangam')}\n\n")

    out.write("=== PLANETS ===\n")
    for code, p in planets.items():
        deg_in_sign = p['longitude'] % 30.0
        deg = int(deg_in_sign)
        minute = int((deg_in_sign - deg) * 60)
        sec = int((((deg_in_sign - deg) * 60) - minute) * 60)
        pos_str = f"{deg}° {minute}' {sec}\""
        out.write(f"{code:4} | {p['nameTa']:8} ({p['nameEn']:7}) | {p['signNameTa']:10} ({p['signId']:2}) | {pos_str:10} | {p.get('nakshatraNameTa')}-{p.get('pada')} ({p.get('starLord')}) | Dig: {p.get('dignityTa')} | Retro: {p.get('isRetrograde')} | Combust: {p.get('isCombust')}\n")

    out.write(f"\nDASHA BALANCE: {dasha.get('initialBalance')}\n")
    out.write(f"Current Dasha: {dasha.get('currentDasha', {}).get('nameTa')} ({dasha.get('currentDasha', {}).get('lord')})\n")
    out.write(f"Current Bhukti: {dasha.get('currentBhukti', {}).get('nameTa')} ({dasha.get('currentBhukti', {}).get('lord')})\n\n")

    out.write("=== DASHAS & BHUKTIS ===\n")
    for item in dasha.get('timeline', []):
        out.write(f"\nDASHA: {item.get('nameTa')} ({item.get('lord')}) : {item.get('startDate')} to {item.get('endDate')} (Years: {item.get('durationYears')})\n")
        for b in item.get('bhuktis', []):
            out.write(f"    Bhukti: {b.get('nameTa'):8} ({b.get('lord'):2}) : {b.get('startDate')} to {b.get('endDate')}\n")

    out.write("\n=== CAREER OUTPUT ===\n")
    out.write(json.dumps(rep.get('career'), ensure_ascii=False, indent=2))

print("Calculation done for 1988-04-30!")
