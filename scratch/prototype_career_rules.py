# -*- coding: utf-8 -*-
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Test script to prototype the Subathuvam / Paavathuvam and Yoga Dasa rules
def evaluate_subathuvam(p_code, p_obj, all_planets):
    ju_sign = all_planets.get('Ju', {}).get('signId', -1)
    ve_sign = all_planets.get('Ve', {}).get('signId', -1)
    sa_sign = all_planets.get('Sa', {}).get('signId', -1)
    ma_sign = all_planets.get('Ma', {}).get('signId', -1)
    ra_sign = all_planets.get('Ra', {}).get('signId', -1)
    ke_sign = all_planets.get('Ke', {}).get('signId', -1)
    
    sign_id = p_obj.get('signId', -1)
    
    subathuva_pts = 0
    paavathuva_pts = 0
    sookshma_pts = 0
    
    # Guru aspects: conjunction, 5th (diff=4), 7th (diff=6), 9th (diff=8)
    if ju_sign != -1:
        diff_ju = (sign_id - ju_sign) % 12
        if diff_ju in [0, 4, 6, 8]:
            subathuva_pts += 35 # High first-grade
            
    # Venus aspects: conjunction, 7th (diff=6)
    if ve_sign != -1:
        diff_ve = (sign_id - ve_sign) % 12
        if diff_ve in [0, 6]:
            subathuva_pts += 20 # 2nd grade
            
    # Saturn aspects: conjunction, 3rd (diff=2), 7th (diff=6), 10th (diff=9)
    if sa_sign != -1:
        diff_sa = (sign_id - sa_sign) % 12
        if diff_sa in [0, 2, 6, 9]:
            paavathuva_pts += 22
            
    # Mars aspects: conjunction, 4th (diff=3), 7th (diff=6), 8th (diff=7)
    if ma_sign != -1:
        diff_ma = (sign_id - ma_sign) % 12
        if diff_ma in [0, 3, 6, 7]:
            paavathuva_pts += 22
            
    # Rahu/Ketu conjunction
    if sign_id in [ra_sign, ke_sign]:
        paavathuva_pts += 18
        
    if p_obj.get('isRetrograde'):
        sookshma_pts += 15
    if p_obj.get('isExalted'):
        sookshma_pts += 15
    if p_obj.get('isOwnSign'):
        sookshma_pts += 12
        
    return {
        'subathuva_pts': subathuva_pts,
        'paavathuva_pts': paavathuva_pts,
        'sookshma_pts': sookshma_pts
    }

print("Prototype logic ready")
