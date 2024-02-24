

from tree import tree
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin



app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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
    return response

@app.route('/get_json_of_tree', methods = ['GET'])
def get_json_of_tree():
    response = jsonify(data.get_map())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response