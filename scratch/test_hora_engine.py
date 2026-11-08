import sys
import io
from thirukanitham_engine.hora_engine import PlanetaryHoraEngine

# Ensure UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

res = PlanetaryHoraEngine.calculate_full_hora('10/13/2026', '04:37 PM', 'Chennai', 13.0827, 80.2707, 5.5)
print("Summary Badge:", res['activePeriod']['summaryBadge'])
print("Sunrise:", res['sunTimes']['sunrise'], "Sunset:", res['sunTimes']['sunset'])
print("Hora Count:", len(res['horas']))
print("SubHoras in Hora 11:", len(res['horas'][10]['subHoras']))
print("SubSubHoras in Sub 6:", len(res['horas'][10]['subHoras'][5]['subSubHoras']))
print("Active Hora:", res['activePeriod']['hora'])
print("Active SubHora:", res['activePeriod']['subHora'])
print("Active SubSubHora:", res['activePeriod']['subSubHora'])
