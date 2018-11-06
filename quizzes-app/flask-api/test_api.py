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

keys = ['Linear Algebra', 'History', 'Logic', 'Hacking']

@app.route('/rank', methods=['GET'])
def rank():
    ranks = [np.random.randint(1, 1000) for _ in range(len(keys))]

    return jsonify({"fetch_data": dict(zip(keys, ranks))})

@app.route('/chart', methods=['GET'])
def chart():
    data = []
    r = lambda: np.random.randint(0,255)
    for i, k in enumerate(keys):
        rand = np.random.randint(50, 300)
        rand_color = '#%02X%02X%02X' % (r(),r(),r())
        item = {
            "value": rand,
            "color": rand_color,
            "highlight": rand_color,
            "label": k
        }
        data.append(item)

    return jsonify({"fetch_data": data})

@app.route('/info', methods=['GET'])
def info():
    data = {
        'age': 21,
        'country': 'Vietnam',
        'edu': 'University of Engineering and Technology',
        'bio': 'emotional unstable :<'
    }

    return jsonify({"fetch_data": data})

app.run(host='0.0.0.0')