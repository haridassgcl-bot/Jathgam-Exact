import urllib.request
import json

req = urllib.request.Request(
    'http://localhost:8000/api/horoscope',
    data=json.dumps({"birthDate": "1988-04-30", "birthTime": "22:10"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
res = urllib.request.urlopen(req)
d = json.loads(res.read())
target_keys = ['lifeCycle', 'counterStars', 'anandadiYoga', 'thimbaChakra', 'electronicAstrology', 'arudhaPadas', 'dangerDegrees']
found = [k for k in target_keys if k in d]
print(f"API Returned {len(found)}/{len(target_keys)} target keys: {found}")
