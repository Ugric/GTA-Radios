from cefpython3 import cefpython as cef
import urllib
import sys
import os
import threading


def formaturl(url):
    p = urllib.parse.urlparse(url, "http")
    netloc = p.netloc or p.path
    path = p.path if p.netloc else ""

    p = urllib.parse.ParseResult("http", netloc, path, *p[3:])
    return p.geturl()


def open_link(url):
    url = formaturl(url)
    sys.excepthook = cef.ExceptHook  # To shutdown all CEF processes on error
    cef.Initialize()
    cef.CreateBrowserSync(url=url, window_title=url)
    cef.MessageLoop()


while True:
    open_link(input("url: "))
    os.system("cls")
