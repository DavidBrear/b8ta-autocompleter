#!/usr/bin/env python

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import os
from urlparse import urlparse, parse_qs

import requests

# super simple caching
cache = {}

class B8taAPI(object):

    @classmethod
    def get_word(cls, query):
        b8ta_url = 'https://dev.b8ta.com/words/complete?query={}'.format(query)
        cached_val = cache.get(query)
        if cached_val:
            return cached_val
        r = requests.get(b8ta_url)

        cache[query] = r.text
        return r.text


class MyHTTPRequestHandler(BaseHTTPRequestHandler):

    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('ORIGIN', 'http://davidbrear.com')
        BaseHTTPRequestHandler.end_headers(self)

    def is_assets(self, path):
        return path.endswith('.css') or path.endswith('.js')

    def get_assets(self, rootdir, path):
        f = open(rootdir + path)
        self.send_response(200)
        if path.endswith('.css'):
            self.send_header('Content-type','text/css')
        elif path.endswith('.js'):
            self.send_header('Content-type','text/javascript')
        self.end_headers()
        self.wfile.write(f.read())
        f.close()
        return

    def is_api(self):
        return self.path.startswith('/api/v1/')

    def get_api_request(self):
        url = urlparse(self.path)
        qs = parse_qs(url.query)
        b8ta_response = B8taAPI.get_word(qs.get('query', [''])[0])
        self.send_response(200)
        self.send_header('Content-type','application/json')
        self.end_headers()
        self.wfile.write(b8ta_response)
        return

    def do_GET(self):
        rootdir = './' #file location
        path = urlparse(self.path).path
        try:

            if self.is_assets(path):
                return self.get_assets(rootdir, path)
            elif self.is_api():
                return self.get_api_request()
            else:
                f = open(rootdir + 'index.html')
                self.send_response(200)
                self.send_header('Content-type','text/html')
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
                return

        except IOError:
            self.send_error(404, 'file not found')

def run():
    print('http server is starting...')

    server_address = ('0.0.0.0', 8080)
    httpd = HTTPServer(server_address, MyHTTPRequestHandler)
    print('http server is running...')
    httpd.serve_forever()

if __name__ == '__main__':
  run()
