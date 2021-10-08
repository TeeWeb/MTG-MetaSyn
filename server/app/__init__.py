import os
from flask import Flask
from flask_cors import CORS


app = Flask(__name__, instance_relative_config=True)
CORS(app)
app.config.from_mapping(
    SECRET_KEY='dev',
    DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
)
app.config.from_pyfile('config.py', silent=True)

# ensure instance folder exists
try:
    os.makedirs(app.instance_path)
except OSError:
    pass
  
from app import routes
