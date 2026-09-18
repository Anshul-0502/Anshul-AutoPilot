from wsgiref.simple_server import make_server
from .app import app
if __name__ == '__main__':
    with make_server('127.0.0.1', 5000, app) as server:
        print('AutoPilot API: http://127.0.0.1:5000/api/v1/health')
        server.serve_forever()
