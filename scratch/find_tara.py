with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'tara' in line.lower():
            clean = line.strip().encode('ascii', errors='replace').decode('ascii')
            print(f'{i}: {clean[:100]}')
