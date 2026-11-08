import json

with open('scratch/chart_output.json', encoding='utf-8') as f:
    d = json.load(f)

with open('scratch/readable_analysis.txt', 'w', encoding='utf-8') as out:
    out.write(f"LAGNA: {d.get('lagna')}\n")
    out.write(f"PANCHANGAM: {d.get('panchangam')}\n\n")

    out.write("PLANETS:\n")
    for k, v in d.get('planets', {}).items():
        out.write(f"{k:4} | {v.get('nameTa'):8} ({v.get('nameEn')}): sign={v.get('signNameTa')} ({v.get('signId')}), deg={v.get('degreeInSign', 0):.2f}, lon={v.get('longitude', 0):.2f}, star={v.get('nakshatraNameTa')} p{v.get('pada')} lord={v.get('nakshatraLord')}, dig={v.get('dignityTa')}, retro={v.get('isRetrograde')}, comb={v.get('isCombust')}\n")

    out.write(f"\nDASHA BALANCE: {d.get('dasha', {}).get('balance')}\n")
    out.write("DASHAS & BUKTIS:\n")
    for item in d.get('dasha', {}).get('dashas', []):
        out.write(f"{item.get('lordTa')} ({item.get('lord')}): {item.get('startDate')} -> {item.get('endDate')}\n")
        for b in item.get('buktis', []):
            out.write(f"   - {b.get('lordTa')} ({b.get('lord')}): {b.get('startDate')} -> {b.get('endDate')}\n")

    out.write("\nCAREER:\n")
    out.write(json.dumps(d.get('career'), ensure_ascii=False, indent=2))
    
    out.write("\nYOGAS:\n")
    out.write(json.dumps(d.get('yogas'), ensure_ascii=False, indent=2))

    out.write("\nSHADBALA:\n")
    out.write(json.dumps(d.get('shadbala'), ensure_ascii=False, indent=2))

    out.write("\nBHAVAS:\n")
    out.write(json.dumps(d.get('bhavas'), ensure_ascii=False, indent=2))

print("Wrote scratch/readable_analysis.txt")
