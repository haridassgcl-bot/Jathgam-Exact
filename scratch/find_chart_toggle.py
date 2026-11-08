with open('index.html', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if 'chart-toggle' in line or 'mainchartcontainer' in line.lower():
            print(f'{i}: {line.strip()}')
