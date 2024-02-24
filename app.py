

from tree import tree
from flask import Flask, jsonify, request, render_template, redirect, url_for

app = Flask(__name__)

data = tree()

@app.route('/', methods = ['GET'])
def home():
    return jsonify({'Home':'home'})

@app.route('/get_text_by_name/<name>', methods = ['GET'])
def get_text_by_name(name):
    text = data.find_by_name(name).text
    return jsonify({'text': text})

@app.route('/add_node/<parent_name>/<name>/<text>', methods = ['POST'])
def add_node(parent_name, name, text):
    parent = data.find_by_name(parent_name)
    if parent.name == "":
        data.append_by_name("root", name, text)
    else:
        data.append_by_name(parent_name, name, text)
    return jsonify({})

@app.route('/get_json_of_tree', methods = ['GET'])
def get_json_of_tree():
    return jsonify(data.get_map())