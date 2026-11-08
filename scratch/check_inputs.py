with open('index.html', 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        if any(k in line for k in ['id="input', 'birthDetailsForm', 'quickDistrict', 'btnAM', 'btnPM', 'btnEdu']):
            print(f'{idx+1}: {line.strip()[:100]}')
