

from tree import tree
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
import matplotlib.pyplot as plt

from io import BytesIO
import base64

import matplotlib
matplotlib.use('agg')


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

commits = [0.0]

data = tree()

@app.route('/', methods = ['GET'])
def home():
    return jsonify({'Home':'home'})

@app.route('/get_text_by_name/<name>', methods = ['GET'])
def get_text_by_name(name):
    text = data.find_by_name(name).text
    response = jsonify({'text': text})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/add_node/<parent_name>/<name>/', methods = ['POST'])
def add_node(parent_name, name):
    text = request.json['text']
    print(text)
    parent = data.find_by_name(parent_name)
    if parent.name == "":
        data.append_by_name("root", name, text)
    else:
        data.append_by_name(parent_name, name, text)
    response = jsonify({})
    commits.append(data.find_by_name(name).get_weight())
    return response

@app.route('/get_json_of_tree', methods = ['GET'])
def get_json_of_tree():
    response = jsonify(data.get_map())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/get_graph", methods = ['GET'])
def get_graph():
    img = BytesIO()
    x = range(0, len(commits))
    
    plt.plot(x, commits, color = "pink", marker = ".")
    plt.title("Differences Across Commits")
    plt.xlabel("Number of Commits")
    plt.ylabel("Difference Percentage Between Commits")
    plt.savefig(img, format = 'png')
    plt.close()
    img.seek(0)
    return jsonify({'text' : base64.b64encode(img.getvalue()).decode('utf8')})