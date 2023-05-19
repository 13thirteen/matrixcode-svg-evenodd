import http.server

class HttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        '.js':'application/javascript',
    }

# Run the server (like `python -m http.server` does)
http.server.test(HttpRequestHandler, port=8000)