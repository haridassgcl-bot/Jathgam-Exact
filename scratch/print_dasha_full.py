import json
from datetime import datetime

with open('scratch/chart_output.json', encoding='utf-8') as f:
    d = json.load(f)

dasha = d.get('dasha', {})

with open('scratch/dasha_full.txt', 'w', encoding='utf-8') as out:
    out.write(f"Balance: {dasha.get('initialBalance')}\n")
    out.write(f"Current Dasha: {dasha.get('currentDasha', {}).get('nameTa')} ({dasha.get('currentDasha', {}).get('lord')})\n")
    out.write(f"Current Bhukti: {dasha.get('currentBhukti', {}).get('nameTa')} ({dasha.get('currentBhukti', {}).get('lord')})\n\n")

    out.write("=== ALL DASHAS & BHUKTIS ===\n")
    for item in dasha.get('timeline', []):
        out.write(f"\nDASHA: {item.get('nameTa')} ({item.get('lord')}) : {item.get('startDate')} to {item.get('endDate')} (Years: {item.get('durationYears')})\n")
        for b in item.get('bhuktis', []):
            out.write(f"    Bhukti: {b.get('nameTa'):8} ({b.get('lord'):2}) : {b.get('startDate')} to {b.get('endDate')}\n")

print("Wrote scratch/dasha_full.txt")
