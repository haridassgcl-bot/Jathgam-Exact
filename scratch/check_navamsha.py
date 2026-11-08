# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')
from thirukanitham_engine import generate_tamil_astrology_report

rep = generate_tamil_astrology_report('Jathagar', 'male', '1988-04-30', '22:10', 'திருவண்ணாமலை', 12.2253, 79.0747, 5.5)

print("Navamsha (D9):")
v = rep['vargas'].get('D9', {})
for p_code, p_data in v.get('planets', {}).items():
    print(p_code, ":", p_data.get('signNameTa', ''), p_data.get('signId', ''))
print("Lagna D9:", v.get('lagna', {}))

