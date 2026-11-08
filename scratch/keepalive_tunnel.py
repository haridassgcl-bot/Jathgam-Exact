import time
import urllib.request

url = "https://4594fd0406d2db.lhr.life/"
print(f"Keep-alive daemon active for {url}")

while True:
    try:
        urllib.request.urlopen(url, timeout=10)
    except Exception:
        pass
    time.sleep(20)
