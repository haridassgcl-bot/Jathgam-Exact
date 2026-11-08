import json
import sys
from thirukanitham_engine.report_generator import generate_tamil_astrology_report

sys.stdout.reconfigure(encoding='utf-8')

rep = generate_tamil_astrology_report(
    name='Haridass R',
    gender='male',
    birth_date_str='1988-04-30',
    birth_time_str='22:10',
    place_name='Tiruvannamalai, Tamil Nadu, India',
    latitude=12.23,
    longitude=79.07,
    timezone_offset=5.5
)

print('Ayanamsha:', rep.get('ayanamsaStr'))
print('Lagna:', rep.get('lagna'))
print('Vargas D1:', rep.get('vargas', {}).get('D1'))
print('Vargas D9:', rep.get('vargas', {}).get('D9'))
print('Planets:')
for k, v in rep.get('planets', {}).items():
    print(f"  {k} ({v.get('nameTa')}): sign={v.get('signId')} ({v.get('signNameTa')}), deg={v.get('deg')}:{v.get('min')}, lon={v.get('longitude')}")

if 'upagrahas' in rep:
    print('Upagrahas:', rep['upagrahas'])
