"""
Thirukanitham REST API Server (FastAPI / Standard HTTP Microservice)
Provides high-speed JSON endpoints for the web frontend and external consumers:
- GET  /health
- POST /api/horoscope
- GET  /api/panchangam
"""

import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from .report_generator import generate_tamil_astrology_report
from .panchangam import ThirukanithamPanchangam
from .ephemeris import ThirukanithamEphemeris
from .lagna_tyajyam import LagnaTyajyamCalculator
from .nakshatra_tyajyam import NakshatraTyajyamCalculator
from .tithi_tyajyam import TithiTyajyamCalculator
from .vara_tyajyam import VaraTyajyamCalculator
from .hora_engine import PlanetaryHoraEngine
from .career_engine import CareerCalculator
from datetime import datetime


class ThirukanithamAPIHandler(BaseHTTPRequestHandler):
    """
    HTTP Request Handler for Thirukanitham calculations.
    """

    def _set_cors_headers(self, status: int = 200, content_type: str = "application/json; charset=utf-8"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/health" or path == "/":
            self._set_cors_headers(200)
            payload = {
                "status": "healthy",
                "engine": "Thirukanitham (திருக்கணித ஜோதிட கணித இயந்திரம்)",
                "version": "2.0.0",
                "features": [
                    "சூரியன், சந்திரன் உள்ளிட்ட 9 கிரகங்கள்",
                    "லக்னம், ராசி, நட்சத்திரம், பாதம்",
                    "திதி (30), கரணம் (11), யோகம் (27), வாரம்",
                    "விம்சோத்தரி 120 வருட தசா-புக்தி",
                    "16 வர்க்கங்கள் (D1 - D60)",
                    "12 பாவங்கள்",
                    "அஷ்டவர்க்கம் 337 பரல்கள்",
                    "25+ யோகங்கள் & கோச்சாரம்"
                ]
            }
            self.wfile.write(json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        elif path == "/api/panchangam":
            params = urllib.parse.parse_qs(parsed.query)
            date_str = params.get("date", [datetime.now().strftime("%Y-%m-%d")])[0]
            time_str = params.get("time", ["06:00"])[0]

            parts = [int(p) for p in date_str.split("-")]
            t_parts = [int(p) for p in time_str.split(":")]
            dt = datetime(parts[0], parts[1], parts[2], t_parts[0], t_parts[1])

            jd = ThirukanithamEphemeris.get_julian_day(parts[0], parts[1], parts[2], t_parts[0], t_parts[1])
            ayanamsha = ThirukanithamEphemeris.get_lahiri_ayanamsha(jd)
            planets = ThirukanithamEphemeris.calculate_planetary_nirayana_longitudes(jd, ayanamsha)

            weekday_idx = (dt.weekday() + 1) % 7
            panchangam = ThirukanithamPanchangam.calculate_panchangam(planets["Su"], planets["Mo"], weekday_idx)

            self._set_cors_headers(200)
            self.wfile.write(json.dumps(panchangam, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        elif path == "/api/lagna_tyajyam":
            params = urllib.parse.parse_qs(parsed.query)
            sign = params.get("sign", ["0"])[0]
            date_str = params.get("date", [datetime.now().strftime("%Y-%m-%d")])[0]
            time_str = params.get("time", ["06:00"])[0]

            res = LagnaTyajyamCalculator.calculate_tyajyam(sign, date_str, time_str)
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(res, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        elif path == "/api/nakshatra_tyajyam":
            params = urllib.parse.parse_qs(parsed.query)
            nakshatra = params.get("nakshatra", ["0"])[0]
            start_date_str = params.get("startDate", [datetime.now().strftime("%Y-%m-%d")])[0]
            start_time_str = params.get("startTime", ["06:00"])[0]
            end_date_str = params.get("endDate", [None])[0]
            end_time_str = params.get("endTime", [None])[0]

            res = NakshatraTyajyamCalculator.calculate_tyajyam(
                nakshatra, start_date_str, start_time_str, end_date_str, end_time_str
            )
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(res, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        elif path == "/api/tithi_tyajyam":
            params = urllib.parse.parse_qs(parsed.query)
            tithi = params.get("tithi", ["0"])[0]
            start_date_str = params.get("startDate", [datetime.now().strftime("%Y-%m-%d")])[0]
            start_time_str = params.get("startTime", ["06:00"])[0]
            end_date_str = params.get("endDate", [None])[0]
            end_time_str = params.get("endTime", [None])[0]

            res = TithiTyajyamCalculator.calculate_tyajyam(
                tithi, start_date_str, start_time_str, end_date_str, end_time_str
            )
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(res, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        elif path == "/api/vara_tyajyam":
            params = urllib.parse.parse_qs(parsed.query)
            weekday = params.get("weekday", [None])[0]
            date_str = params.get("date", [datetime.now().strftime("%Y-%m-%d")])[0]
            sunrise_str = params.get("sunrise", ["06:00"])[0]

            res = VaraTyajyamCalculator.calculate_tyajyam(weekday, date_str, sunrise_str)
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(res, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        elif path == "/api/hora":
            params = urllib.parse.parse_qs(parsed.query)
            date_str = params.get("date", [datetime.now().strftime("%Y-%m-%d")])[0]
            time_str = params.get("time", ["16:37"])[0]
            place_name = params.get("place", ["Chennai"])[0]
            try:
                lat = float(params.get("lat", [13.0827])[0])
                lon = float(params.get("lon", [80.2707])[0])
                tz = float(params.get("tz", [5.5])[0])
            except Exception:
                lat, lon, tz = 13.0827, 80.2707, 5.5

            res = PlanetaryHoraEngine.calculate_full_hora(date_str, time_str, place_name, lat, lon, tz)
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(res, ensure_ascii=False, indent=2).encode("utf-8"))
            return

        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint Not Found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/horoscope":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                name = data.get("name", "அன்பர்")
                gender = data.get("gender", "male")
                birth_date = data.get("birthDate", "1995-04-14")
                birth_time = data.get("birthTime", "06:15")
                place_name = data.get("placeName", "சென்னை (Chennai)")
                lat = float(data.get("latitude", 13.0827))
                lon = float(data.get("longitude", 80.2707))
                tz = float(data.get("timezoneOffset", 5.5))

                report = generate_tamil_astrology_report(
                    name=name,
                    gender=gender,
                    birth_date_str=birth_date,
                    birth_time_str=birth_time,
                    place_name=place_name,
                    latitude=lat,
                    longitude=lon,
                    timezone_offset=tz
                )

                self._set_cors_headers(200)
                self.wfile.write(json.dumps(report, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif path == "/api/lagna_tyajyam":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                sign = data.get("sign", 0)
                date_str = data.get("date", datetime.now().strftime("%Y-%m-%d"))
                time_str = data.get("time", "06:00")

                res = LagnaTyajyamCalculator.calculate_tyajyam(sign, date_str, time_str)
                self._set_cors_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif path == "/api/nakshatra_tyajyam":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                nakshatra = data.get("nakshatra", 0)
                start_date_str = data.get("startDate", datetime.now().strftime("%Y-%m-%d"))
                start_time_str = data.get("startTime", "06:00")
                end_date_str = data.get("endDate", None)
                end_time_str = data.get("endTime", None)

                res = NakshatraTyajyamCalculator.calculate_tyajyam(
                    nakshatra, start_date_str, start_time_str, end_date_str, end_time_str
                )
                self._set_cors_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif path == "/api/tithi_tyajyam":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                tithi = data.get("tithi", 0)
                start_date_str = data.get("startDate", datetime.now().strftime("%Y-%m-%d"))
                start_time_str = data.get("startTime", "06:00")
                end_date_str = data.get("endDate", None)
                end_time_str = data.get("endTime", None)

                res = TithiTyajyamCalculator.calculate_tyajyam(
                    tithi, start_date_str, start_time_str, end_date_str, end_time_str
                )
                self._set_cors_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif path == "/api/vara_tyajyam":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                weekday = data.get("weekday", None)
                date_str = data.get("date", datetime.now().strftime("%Y-%m-%d"))
                sunrise_str = data.get("sunrise", "06:00")

                res = VaraTyajyamCalculator.calculate_tyajyam(weekday, date_str, sunrise_str)
                self._set_cors_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif path == "/api/hora":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                date_str = data.get("date", datetime.now().strftime("%Y-%m-%d"))
                time_str = data.get("time", "16:37")
                place_name = data.get("place", "Chennai")
                lat = float(data.get("lat", 13.0827))
                lon = float(data.get("lon", 80.2707))
                tz = float(data.get("tz", 5.5))

                res = PlanetaryHoraEngine.calculate_full_hora(date_str, time_str, place_name, lat, lon, tz)
                self._set_cors_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        elif path == "/api/career":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)

            try:
                data = json.loads(post_data.decode("utf-8"))
                lagna_sign_id = int(data.get("lagnaSignId", 8))
                planets_data = data.get("planets", {})
                birth_year = int(data.get("birthYear", 1988))
                cur_dasha = data.get("currentDasha", "Sa")
                cur_bhukti = data.get("currentBhukti", "Me")

                education_level = data.get("educationLevel", data.get("education_level", "diploma_iti"))
                res = CareerCalculator.calculate(lagna_sign_id, planets_data, birth_year, cur_dasha, cur_bhukti, education_level)
                self._set_cors_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self._set_cors_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        else:
            self._set_cors_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint Not Found"}).encode("utf-8"))


def run_api_server(port: int = 8000):
    server_address = ("", port)
    httpd = HTTPServer(server_address, ThirukanithamAPIHandler)
    print(f"Thirukanitham API Server running on port {port} (http://localhost:{port}/)")
    httpd.serve_forever()


if __name__ == "__main__":
    run_api_server(8000)
