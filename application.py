import os
import datetime
import json

from flask import Flask, session, render_template, request, redirect, url_for, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc, or_, and_

db = SQLAlchemy()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/addTask", methods = ["POST"])
def addTask():
    taskObj = request.get_json('taskObj')
    with open('person.json', 'a+') as f:
        f.seek(0)
        data = f.read(100)
        if len(data) > 0:
            f.write("\n")
            json.dump(taskObj, f)
        else:
            json.dump(taskObj, f)
    return jsonify({"success" : True})

@app.route("/api/deleteTask", methods = ["POST"])
def deleteTask():
    id = request.form.get('id')
    taskList = []
    with open('person.json', 'r') as f:
        for jsonObj in f.readlines():
            if not jsonObj.strip():
                continue
            else :
                taskObj = json.loads(jsonObj)
                if not taskObj['taskId'] == int(id):
                    taskList.append(jsonObj)
    with open('person.json', 'w') as f:
        f.writelines(''.join(taskList))
    return jsonify({"success" : True})

@app.route("/api/markTask", methods = ["POST"])
def markTask():
    id = request.form.get('id')
    taskList = []
    with open('person.json', 'r') as f:
        for jsonObj in f.readlines():
            if not jsonObj.strip():
                continue
            else: 
                taskObj = json.loads(jsonObj)
                if not taskObj['taskId'] == int(id):
                    taskList.append(jsonObj)
                else :
                    taskObj['isDone'] = True
                    jsonObj = json.dumps(taskObj)
                    taskList.append(jsonObj + "\n")
    with open('person.json', 'w') as f:
        f.writelines(''.join(taskList))
    return jsonify({"success" : True})

@app.route("/api/taskList", methods = ["GET","POST"])
def taskList():
    taskList = []
    with open('person.json', 'r') as f:
        for jsonObj in f.readlines():
            taskList.append(json.loads(jsonObj))
    return jsonify({"success" : True, "taskList" : taskList})