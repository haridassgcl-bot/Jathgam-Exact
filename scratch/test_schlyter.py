import math

DEG2RAD = math.pi / 180.0
RAD2DEG = 180.0 / math.pi

def rev(angle):
    return angle % 360.0

def sind(x):
    return math.sin(x * DEG2RAD)

def cosd(x):
    return math.cos(x * DEG2RAD)

def tand(x):
    return math.tan(x * DEG2RAD)

def atan2d(y, x):
    return math.atan2(y, x) * RAD2DEG

def solve_kepler(M, e):
    M_rad = M * DEG2RAD
    E = M_rad + e * math.sin(M_rad) * (1.0 + e * math.cos(M_rad))
    for _ in range(5):
        dE = (E - e * math.sin(E) - M_rad) / (1.0 - e * math.cos(E))
        E -= dE
        if abs(dE) < 1e-8:
            break
    return E * RAD2DEG

def calculate_planets_schlyter(d):
    # Sun
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
    
    # Earth coordinates (heliocentric)
    xe = r_su * cosd(lon_su + 180.0)
    ye = r_su * sind(lon_su + 180.0)
    ze = 0.0

    # Geocentric Sun coordinates
    xs = r_su * cosd(lon_su)
    ys = r_su * sind(lon_su)

    # Planets
    planets = {
        'Me': { # Mercury
            'N': 48.3313 + 3.24587e-5 * d,
            'i': 7.0047 + 5.00e-8 * d,
            'w': 29.1241 + 1.01444e-5 * d,
            'a': 0.387098,
            'e': 0.205635 + 5.59e-10 * d,
            'M': 168.6562 + 4.0923344368 * d
        },
        'Ve': { # Venus
            'N': 76.6799 + 2.46590e-5 * d,
            'i': 3.3946 + 2.75e-8 * d,
            'w': 54.8910 + 1.38374e-5 * d,
            'a': 0.723330,
            'e': 0.006773 - 1.302e-9 * d,
            'M': 48.0052 + 1.6021302244 * d
        },
        'Ma': { # Mars
            'N': 49.5574 + 2.11081e-5 * d,
            'i': 1.8497 - 1.78e-8 * d,
            'w': 286.5016 + 2.92961e-5 * d,
            'a': 1.523688,
            'e': 0.093405 + 2.516e-9 * d,
            'M': 18.6021 + 0.5240207766 * d
        },
        'Ju': { # Jupiter
            'N': 100.4542 + 2.76854e-5 * d,
            'i': 1.3030 - 1.557e-7 * d,
            'w': 273.8777 + 1.64505e-5 * d,
            'a': 5.20256,
            'e': 0.048498 + 4.469e-9 * d,
            'M': 19.8950 + 0.0830853001 * d
        },
        'Sa': { # Saturn
            'N': 113.6634 + 2.38980e-5 * d,
            'i': 2.4886 - 1.081e-7 * d,
            'w': 339.3939 + 2.97661e-5 * d,
            'a': 9.55475,
            'e': 0.055546 - 9.499e-9 * d,
            'M': 316.9670 + 0.0334442282 * d
        }
    }

    results = {'Su': lon_su}

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

        # Heliocentric ecliptic coordinates
        xh = r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i))
        yh = r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i))
        zh = r * (sind(v + w) * sind(i))

        # Perturbations for Jupiter, Saturn
        if p == 'Ju':
            # Jupiter perturbations from Saturn
            M_sa = rev(planets['Sa']['M'])
            dlon = (
                -0.332 * sind(2 * M - 5 * M_sa - 67.6)
                - 0.056 * sind(2 * M - 2 * M_sa + 21.0)
                + 0.042 * sind(3 * M - 5 * M_sa + 21.0)
                - 0.036 * sind(M - 2 * M_sa)
                + 0.022 * sind(M - M_sa)
            )
            # Apply to heliocentric pos
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

        # Geocentric coordinates
        xg = xh + xs
        yg = yh + ys
        zg = zh

        lon_g = rev(atan2d(yg, xg))
        results[p] = lon_g

    # Moon
    # Mean elements
    N_mo = rev(125.1228 - 0.0529538083 * d)
    i_mo = 5.1454
    w_mo = rev(318.0634 + 0.1643573223 * d)
    a_mo = 60.2666 # Earth radii
    e_mo = 0.054900
    M_mo = rev(115.3654 + 13.0649929509 * d)

    E_mo = solve_kepler(M_mo, e_mo)
    xv_mo = a_mo * (cosd(E_mo) - e_mo)
    yv_mo = a_mo * (math.sqrt(1.0 - e_mo * e_mo) * sind(E_mo))
    v_mo = atan2d(yv_mo, xv_mo)
    r_mo = math.sqrt(xv_mo * xv_mo + yv_mo * yv_mo)

    # Moon perturbations
    # Sun mean anomaly M_su, Moon mean elongation D, Moon argument of latitude F
    M_s = rev(356.0470 + 0.9856002585 * d)
    D = rev((115.3654 + 13.0649929509 * d + w_mo) - (M_s + w_su)) # Mean Moon - Mean Sun
    F = rev(115.3654 + 13.0649929509 * d + w_mo - N_mo)

    dlon_mo = (
        -1.274 * sind(M_mo - 2 * D)
        + 0.658 * sind(2 * D)
        - 0.186 * sind(M_s)
        - 0.059 * sind(2 * M_mo - 2 * D)
        - 0.057 * sind(M_mo - 2 * D + M_s)
        + 0.053 * sind(M_mo + 2 * D)
        + 0.046 * sind(2 * D - M_s)
        + 0.041 * sind(M_mo - M_s)
        - 0.035 * sind(D)
        - 0.031 * sind(M_mo + M_s)
    )

    lon_mo_orb = rev(v_mo + w_mo + dlon_mo)
    xh_mo = r_mo * (cosd(N_mo) * cosd(lon_mo_orb - N_mo) - sind(N_mo) * sind(lon_mo_orb - N_mo) * cosd(i_mo))
    yh_mo = r_mo * (sind(N_mo) * cosd(lon_mo_orb - N_mo) + cosd(N_mo) * sind(lon_mo_orb - N_mo) * cosd(i_mo))
    lon_geoc_mo = rev(atan2d(yh_mo, xh_mo))
    results['Mo'] = lon_geoc_mo

    # Rahu & Ketu (Mean lunar node)
    results['Ra'] = N_mo
    results['Ke'] = rev(N_mo + 180.0)

    return results

if __name__ == '__main__':
    # 1988-04-30 22:10 IST -> 16:40 UTC
    # d = JD - 2451545.0
    from thirukanitham_engine.ephemeris import ThirukanithamEphemeris
    jd = ThirukanithamEphemeris.get_julian_day(1988, 4, 30, 16, 40, 0)
    d = jd - 2451545.0
    ayan = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)
    print(f"JD={jd}, d={d}, Ayanamsha={ayan}")
    tropical = calculate_planets_schlyter(d)
    print("\n--- RESULTS ---")
    for p, trop in tropical.items():
        nir = rev(trop - ayan)
        sId = int(nir // 30)
        sDeg = int(nir % 30)
        sMin = int((nir % 1) * 60)
        signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
        print(f"{p:3s}: Trop={trop:7.2f}° | Nir={nir:7.2f}° -> {signs[sId]:11s} {sDeg:02d}° {sMin:02d}'")
