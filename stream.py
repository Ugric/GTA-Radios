import math
import threading
from flask import Flask, Response, render_template, send_from_directory, jsonify
import time
from mutagen.mp3 import MP3
from datetime import datetime

app = Flask(__name__,
            static_url_path='',
            static_folder='gtaradios/build',
            template_folder='gtaradios/build')
radiodata = {}


def startradio(songs, radioname, looping=True, cachesize=10):
    def radiothread():
        print(
            "(radio)",
            "-",
            datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "-",
            radioname + ":",
            "starting!",
        )
        num = 1
        while True:

            print(
                "(radio)",
                "-",
                datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                "-",
                radioname + ":",
                "loop",
                num,
            )
            for song in songs:
                print(
                    "(radio)",
                    "-",
                    datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    "-",
                    radioname + ":",
                    "playing",
                    song,
                )
                kbps = round(MP3(song).info.bitrate / 1000)
                print(
                    "(radio)",
                    "-",
                    datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                    "-",
                    radioname + ":",
                    kbps,
                    "kbps",
                )
                downloadseconds = 1
                file = open(song, "rb")
                data = file.seek(kbps * 125)
                radiodata[radioname] = {
                    'requests': 0,
                    'data': b'',
                    'cache': [file.read(math.ceil(kbps * 125 * (downloadseconds))) for _ in range(math.ceil(cachesize/downloadseconds))],
                    'downloadseconds': downloadseconds
                }
                while data:
                    data = file.read(
                        math.ceil(kbps * 125 * (downloadseconds)))
                    radiodata[radioname]["cache"].append(
                        radiodata[radioname]["data"])
                    del radiodata[radioname]["cache"][0]
                    radiodata[radioname]["data"] = data
                    radiodata[radioname]["downloadseconds"] = downloadseconds
                    time.sleep(downloadseconds)
            if not looping:
                del radiodata[radioname]
                break
            num += 1
        print(
            "(radio)",
            "-",
            datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "-",
            radioname + ":",
            "ended!",
        )

    x = threading.Thread(target=radiothread)
    x.start()


startime = time.time()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/starttime")
def starting():
    return jsonify(startime)


@app.route("/buffersound")
def buffersound():
    return send_from_directory("sounds", "buffering.mp3")


@app.route("/pausedsound")
def pausedsound():
    return send_from_directory("sounds", "paused.mp3")


@app.route("/backgroundvideo")
def backgroundvideo():
    return send_from_directory("videos", "backgroundvideo.mp4")


@app.route("/radiostream/<path:radio>")
def radiostream(radio):
    def generate(radio):
        if radio in radiodata:
            radiodata[radio]["requests"] += 1
            yield b''.join(radiodata[radio]["cache"])
            while True:
                if radio in radiodata:
                    yield radiodata[radio]["data"]
                else:
                    break
                time.sleep(radiodata[radio]["downloadseconds"])

    return Response(generate(radio), mimetype="audio/mp3")


startradio(
    [
        "radios/nsp.mp3"
    ],
    "nsp",
    True,
)
startradio(
    ["radios/rl.mp3"], "rl", True,
)
startradio(
    ["radios/lsrr.mp3"], "lsrr", True,
)
startradio(
    ["radios/tba.mp3"],
    "tba",
    True,
)
startradio(
    ["radios/rmp.mp3"], "rmp", True,
)
startradio(
    ["radios/flfm.mp3"], "flfm", True,
)
startradio(
    ["radios/wwfm.mp3"], "wwfm", True,
)
startradio(
    ["radios/tl.mp3"], "tl", True,
)
startradio(
    ["radios/vwbr.mp3"], "vwbr", True,
)
startradio(
    ["radios/bls.mp3"], "bls", True,
)
startradio(
    ["radios/tld.mp3"], "tld", True,
)
startradio(
    ["radios/s.mp3"], "s", True,
)
startradio(
    ["radios/cx.mp3"], "cx", True,
)


startradio(
    ["radios/wctr.mp3"], "wctr", True,
)
startradio(
    ["radios/rr.mp3"], "rr", True,
)
startradio(
    ["radios/swfm.mp3"], "swfm", True,
)
startradio(
    ["radios/elfm.mp3"], "elfm", True,
)
startradio(
    ["radios/wcc.mp3"], "wcc", True,
)
startradio(
    ["radios/ifr.mp3"], "ifr", True,
)
startradio(
    ["radios/lsur.mp3"], "lsur", True,
)

app.run(port=7070, debug=False, host="0.0.0.0")
