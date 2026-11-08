import sys
sys.path.append('.')
from thirukanitham_engine.report_generator import generate_tamil_astrology_report
import json

rep = generate_tamil_astrology_report(
    name='User',
    gender='Male',
    birth_date_str='1998-04-30',
    birth_time_str='22:10:00',
    place_name='Tiruvannamalai',
    latitude=12.2253,
    longitude=79.0747,
    timezone_offset=5.5
)

with open('scratch/chart_output.json', 'w', encoding='utf-8') as f:
    json.dump(rep, f, ensure_ascii=False, indent=2)

print('Saved scratch/chart_output.json successfully!')
