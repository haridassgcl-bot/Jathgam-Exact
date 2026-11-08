import os
import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser

# Add current dir to sys.path
sys.path.insert(0, os.path.abspath("."))
from thirukanitham_engine.api_server import ThirukanithamAPIHandler

class CustomWebHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.abspath("."), **kwargs)

def start_api():
    try:
        httpd = HTTPServer(("0.0.0.0", 8000), ThirukanithamAPIHandler)
        print("[1/2] Thirukanitham API Server running on http://localhost:8000/")
        httpd.serve_forever()
    except Exception as e:
        print(f"API Server error: {e}", file=sys.stderr)

def start_web():
    try:
        httpd = HTTPServer(("0.0.0.0", 8080), CustomWebHandler)
        print("[2/2] Exact Jathagam Web App running on http://localhost:8080/")
        httpd.serve_forever()
    except Exception as e:
        print(f"Web Server error: {e}", file=sys.stderr)

if __name__ == "__main__":
    t_api = threading.Thread(target=start_api, daemon=True)
    t_web = threading.Thread(target=start_web, daemon=True)
    
    t_api.start()
    t_web.start()
    
    time.sleep(1)
    print("\n========================================================")
    print("  Exact Jathagam Web Application : http://localhost:8080/")
    print("  Python API Health Endpoint     : http://localhost:8000/health")
    print("========================================================\n")
    
    try:
        webbrowser.open("http://localhost:8080/")
    except Exception:
        pass
        
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Servers shutting down.")

