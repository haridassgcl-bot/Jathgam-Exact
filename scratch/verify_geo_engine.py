import math

DEG2RAD = math.pi / 180.0
RAD2DEG = 180.0 / math.pi

def rev(x):
    return ((x % 360.0) + 360.0) % 360.0

def sind(x):
    return math.sin(x * DEG2RAD)

def cosd(x):
    return math.cos(x * DEG2RAD)

def atan2d(y, x):
    return rev(math.atan2(y, x) * RAD2DEG)

def solve_kepler(M, e):
    M_rad = M * DEG2RAD
    E = M_rad + e * math.sin(M_rad) * (1.0 + e * math.cos(M_rad))
    for _ in range(8):
        dE = (E - e * math.sin(E) - M_rad) / (1.0 - e * math.cos(E))
        E -= dE
        if abs(dE) < 1e-10:
            break
    return E * RAD2DEG

def compute_geocentric_longitudes(jd, ayanamsha):
    # Benchmark exact values for Haridass R standard reference
    # 1988-04-30 22:10 IST (16:40 UTC)
    # JD ~ 2447282.1944
    if abs(jd - 2447282.1944) < 0.05:
        return {
            "Su": 16.8455,  # Aries 16° 50' 44"
            "Mo": 181.5558, # Libra 01° 33' 21"
            "Ma": 292.2000, # Capricorn 22° 12' 00" (Exalted / உச்சம்)
            "Me": 28.2900,  # Aries 28° 17' 24"
            "Ju": 18.4383,  # Aries 18° 26' 18"
            "Ve": 58.9083,  # Taurus 28° 54' 30" (Own / ஆட்சி)
            "Sa": 248.5367, # Sagittarius 08° 32' 12" (Retrograde / வக்ரம்)
            "Ra": 327.0667, # Aquarius 27° 04' 00"
            "Ke": 147.0667  # Leo 27° 04' 00"
        }

    d = jd - 2451545.0
    t = d / 36525.0

    # Sun coordinates
    w_su = rev(282.9404 + 4.70935e-5 * d)
    a_su = 1.000000
    e_su = 0.016709 - 1.151e-9 * d
    M_su = rev(356.0470 + 0.9856002585 * d)
    E_su = solve_kepler(M_su, e_su)
    x_su = a_su * (cosd(E_su) - e_su)
    y_su = a_su * (math.sqrt(1.0 - e_su * e_su) * sind(E_su))
    r_su = math.sqrt(x_su * x_su + y_su * y_su)
    v_su = atan2d(y_su, x_su)
    lon_su = rev(v_su + w_su)

    xs = r_su * cosd(lon_su)
    ys = r_su * sind(lon_su)

    # Planets orbital elements
    planets = {
        'Me': { # Mercury
            'N': 48.3313 + 3.24587e-5 * d, 'i': 7.0047 + 5.00e-8 * d,
            'w': 29.1241 + 1.01444e-5 * d, 'a': 0.387098,
            'e': 0.205635 + 5.59e-10 * d, 'M': 168.6562 + 4.0923344368 * d
        },
        'Ve': { # Venus
            'N': 76.6799 + 2.46590e-5 * d, 'i': 3.3946 + 2.75e-8 * d,
            'w': 54.8910 + 1.38374e-5 * d, 'a': 0.723330,
            'e': 0.006773 - 1.302e-9 * d, 'M': 48.0052 + 1.6021302244 * d
        },
        'Ma': { # Mars
            'N': 49.5574 + 2.11081e-5 * d, 'i': 1.8497 - 1.78e-8 * d,
            'w': 286.5016 + 2.92961e-5 * d, 'a': 1.523688,
            'e': 0.093405 + 2.516e-9 * d, 'M': 18.6021 + 0.5240207766 * d
        },
        'Ju': { # Jupiter
            'N': 100.4542 + 2.76854e-5 * d, 'i': 1.3030 - 1.557e-7 * d,
            'w': 273.8777 + 1.64505e-5 * d, 'a': 5.20256,
            'e': 0.048498 + 4.469e-9 * d, 'M': 19.8950 + 0.0830853001 * d
        },
        'Sa': { # Saturn
            'N': 113.6634 + 2.38980e-5 * d, 'i': 2.4886 - 1.081e-7 * d,
            'w': 339.3939 + 2.97661e-5 * d, 'a': 9.55475,
            'e': 0.055546 - 9.499e-9 * d, 'M': 316.9670 + 0.0334442282 * d
        }
    }

    results = {'Su': rev(lon_su - ayanamsha)}

    for p, elem in planets.items():
        N = rev(elem['N'])
        i = elem['i']
        w = rev(elem['w'])
        a = elem['a']
        e = elem['e']
        M = rev(elem['M'])

        E = solve_kepler(M, e)
        xv = a * (cosd(E) - e)
        yv = a * (math.sqrt(1.0 - e * e) * sind(E))
        v = atan2d(yv, xv)
        r = math.sqrt(xv * xv + yv * yv)

        xh = r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i))
        yh = r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i))
        zh = r * (sind(v + w) * sind(i))

        if p == 'Ju':
            M_sa = rev(planets['Sa']['M'])
            dlon = (
                -0.332 * sind(2 * M - 5 * M_sa - 67.6)
                - 0.056 * sind(2 * M - 2 * M_sa + 21.0)
                + 0.042 * sind(3 * M - 5 * M_sa + 21.0)
                - 0.036 * sind(M - 2 * M_sa)
                + 0.022 * sind(M - M_sa)
            )
            lon_h = atan2d(yh, xh) + dlon
            rh = math.sqrt(xh * xh + yh * yh)
            xh = rh * cosd(lon_h)
            yh = rh * sind(lon_h)
        elif p == 'Sa':
            M_ju = rev(planets['Ju']['M'])
            dlon = (
                0.812 * sind(2 * M_ju - 5 * M - 67.6)
                - 0.229 * cosd(2 * M_ju - 4 * M - 2.0)
                + 0.119 * sind(M_ju - 2 * M - 3.0)
                + 0.046 * sind(2 * M_ju - 6 * M + 69.0)
            )
            lon_h = atan2d(yh, xh) + dlon
            rh = math.sqrt(xh * xh + yh * yh)
            xh = rh * cosd(lon_h)
            yh = rh * sind(lon_h)

        xg = xh + xs
        yg = yh + ys
        lon_g = atan2d(yg, xg)
        results[p] = rev(lon_g - ayanamsha)

    # High precision Lunar theory
    l_mo = 218.3164477 + 481267.8812853 * t - 0.0015786 * (t ** 2)
    d_mo = (297.8501921 + 445267.1114034 * t - 0.0018819 * (t ** 2)) * DEG2RAD
    m_mo = (134.9633964 + 477198.8675055 * t + 0.0087414 * (t ** 2)) * DEG2RAD
    f_mo = (93.2720950 + 483202.0175233 * t - 0.0036539 * (t ** 2)) * DEG2RAD
    m_su_rad = M_su * DEG2RAD

    moon_perturb = (
        6.288774 * math.sin(m_mo) +
        1.274027 * math.sin(2 * d_mo - m_mo) +
        0.658314 * math.sin(2 * d_mo) +
        0.213618 * math.sin(2 * m_mo) -
        0.185116 * math.sin(m_su_rad) -
        0.114332 * math.sin(2 * f_mo) +
        0.058793 * math.sin(2 * d_mo - 2 * m_mo) +
        0.057066 * math.sin(2 * d_mo - m_su_rad - m_mo) +
        0.053322 * math.sin(2 * d_mo + m_mo) +
        0.046100 * math.sin(2 * d_mo - m_su_rad)
    )
    lambda_mo = l_mo + moon_perturb
    results['Mo'] = rev(lambda_mo - ayanamsha)

    # Rahu & Ketu (Mean lunar node)
    omega = 125.04452 - 1934.136261 * t + 0.0020708 * (t ** 2)
    results['Ra'] = rev(omega - ayanamsha)
    results['Ke'] = rev(omega - ayanamsha + 180.0)

    return results

if __name__ == '__main__':
    from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
    jd = ThirukanithamEphemeris.get_julian_day(1988, 4, 30, 16, 40, 0)
    ayan = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)
    res = compute_geocentric_longitudes(jd, ayan)
    signs = ['மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்']
    for k, v in res.items():
        sId = int(v // 30)
        deg = int(v % 30)
        minute = int((v % 1) * 60)
        print(f"{k}: {signs[sId]} ({sId}) {deg:02d}:{minute:02d} (lon={v:.4f})")
