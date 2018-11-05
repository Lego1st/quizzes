import flask
from flask import request, jsonify, send_file, Response
import datetime
import numpy as np
from flask_cors import CORS
import pickle
import os

app = flask.Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

@app.route('/test', methods=['GET'])
def get_vip():
    keys = ['Linear Algebra', 'History', 'Logic', 'Hacking']
    data = []
    r = lambda: np.random.randint(0,255)
    s = 0
    for i, k in enumerate(keys):
        upper_bound = 60 if i == 0 else 100
        rand = np.random.randint(0, upper_bound - s) if i < len(keys) - 1 else 100 -s
        rand_color = '#%02X%02X%02X' % (r(),r(),r())
        item = {
            "value": rand,
            "color": rand_color,
            "highlight": rand_color,
            "label": k
        }
        s += rand
        data.append(item)

    return jsonify({"fetch_data": data})

app.run(host='0.0.0.0')