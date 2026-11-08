with open('js/app.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'case "m' in line:
            clean = line.strip().encode('ascii', errors='replace').decode('ascii')
            print(f'{i}: {clean}')
