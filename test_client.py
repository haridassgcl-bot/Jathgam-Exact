import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

req_data = {
    "name": "ஆனந்தகுமார்",
    "gender": "male",
    "birthDate": "1995-04-14",
    "birthTime": "06:15",
    "placeName": "சென்னை (Chennai)",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezoneOffset": 5.5
}

data_bytes = json.dumps(req_data).encode("utf-8")
req = urllib.request.Request(
    "http://localhost:8000/api/horoscope",
    data=data_bytes,
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print("API Status:", resp.status)
        print("Engine:", res.get("engine"))
        print("Lagna:", res.get("lagna", {}).get("signNameTa"))
        print("Panchangam Tithi:", res.get("panchangam", {}).get("tithi", {}).get("displayTa"))
        print("Planets Count:", len(res.get("planets", {})))
        print("Bhavas Count:", len(res.get("bhavas", [])))
        print("Vargas D9 Asc:", res.get("vargas", {}).get("D9", {}).get("Asc"))
        print("Dasha Active:", res.get("dasha", {}).get("currentDasha", {}).get("nameTa"))
        print("SUCCESS: Python Thirukanitham REST API is responding perfectly!")
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code, e.read().decode("utf-8"))
except Exception as e:
    print("Error:", e)
