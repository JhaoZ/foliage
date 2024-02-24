from flask import Flask, jsonify, request, render_template, redirect, url_for

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def home():
    return jsonify({'Home':'home'})

