import urllib.request

url = 'https://sponsor-theoretical-small-novelty.trycloudflare.com'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

checks = [
    ('navCareerBtn', 'id="navCareerBtn"'),
    ('quickCareerCallout', 'id="quickCareerCallout"'),
    ('pillCareerTiming', 'id="pillCareerTiming"'),
    ('careerTimingSection', 'id="careerTimingSection"'),
    ('careerTimingContainer', 'id="careerTimingContainer"'),
    ('career-engine.js', 'career-engine.js'),
    ('20261020_career_v2', '20261020_career_v2')
]

print("=== Exact Jathagam Live Verification ===")
for name, text in checks:
    status = "OK" if text in html else "FAIL"
    print(f"[{status}] {name}")
