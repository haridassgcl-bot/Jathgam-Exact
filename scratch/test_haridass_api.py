import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

req_data = {
    'name': 'Haridass R',
    'gender': 'male',
    'birthDate': '1988-04-30',
    'birthTime': '22:10',
    'placeName': 'Tiruvannamalai, Tamil Nadu, India',
    'latitude': 12.23,
    'longitude': 79.07,
    'timezoneOffset': 5.5
}

req = urllib.request.Request(
    'http://localhost:8000/api/horoscope',
    data=json.dumps(req_data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print('Lagna:', res['lagna']['signNameTa'], f"{res['lagna']['deg']}:{res['lagna']['min']}")
    print('Vargas D1:', res['vargas']['D1'])
    print('Vargas D9:', res['vargas']['D9'])
    for k, v in res['planets'].items():
        print(f"  {k}: {v['signNameTa']} ({v['signId']}) {v['deg']}:{v['min']} (Retro={v.get('isRetrograde')})")
