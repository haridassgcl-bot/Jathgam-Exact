import urllib.request, json

data = {'name': 'Haridass R', 'birthDate': '1988-04-30', 'birthTime': '22:10'}
post_req = urllib.request.Request(
    'http://localhost:8000/api/horoscope',
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
with urllib.request.urlopen(post_req) as resp:
    py_resp = json.loads(resp.read().decode('utf-8'))
    for k, v in py_resp['planets'].items():
        print(f"{k}: signId={v.get('signId')} deg={v.get('deg')}:{v.get('min')}:{v.get('sec')} retro={v.get('isRetrograde')} dignity={v.get('dignityEn')}")
