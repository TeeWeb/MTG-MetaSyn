import os
import requests
from yaml import load, Loader
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

from mtgsdk import Card

from flaskr.synergyCalc import CalculatedSynergy

with open('./config.yaml', 'r') as f:
    config = dict(load(f, Loader=Loader))
    print(config["username"])

client = MongoClient("mongodb+srv://%s:%s@metasyndb.pat24.mongodb.net/admin?retryWrites=true&w=majority" % (config["username"], config["pw"]))
db = client["MetaSynDB"]
all_cards = db.AllCards

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )
    
    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    # enusre instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    def retrieve_all_types():
        print("Downloading MTG types data...")
        types_req = requests.get('https://api.magicthegathering.io/v1/types')
        if types_req.status_code is 200:
            with open('./data/types.yaml', 'w') as f:
                f.write(str(types_req.json()))
        else:
            print("types_req status code: ", types_req.status_code)

    def retrieve_all_sets():
        print("Downloading MTG sets data...")
        sets_req = requests.get('https://api.magicthegathering.io/v1/sets')
        if sets_req.status_code is 200:
            with open('./data/sets.yaml', 'w') as f:
                f.write(str(sets_req.json()))
        else:
            print("sets_req status code: ", sets_req.status_code)

    def retrieve_all_keywords():
        print("Downloading MTG keywords data...")
        keywords_req = requests.get('https://mtgjson.com/api/v5/Keywords.json')
        if keywords_req.status_code is 200:
            with open('./data/keywords.yaml', 'w') as f:
                f.write(str(keywords_req.json()))
        else:
            print("keywords_req status code: ", keywords_req.status_code)

    def retrieve_all_data():
        retrieve_all_types()
        retrieve_all_sets()
        retrieve_all_keywords()

    def get_all_sets():
        with open('./data/sets.yaml', 'r') as f:
            sets = load(f, Loader=Loader)
        return sets

    def get_all_types():
        with open('./data/types.yaml', 'r') as f:
            types = load(f, Loader=Loader)
        return types

    def get_all_keywords():
        with open('./data/keywords.yaml', 'r') as f:
            keywords = load(f, Loader=Loader)
        return keywords

    def merge_keywords_data():
        raw = get_all_keywords()
        merged = []
        for category in raw["data"]:
            for keyword in raw["data"][category]:
                if keyword not in merged:
                    merged.append(keyword)
        merged.sort()
        with open('./data/merged_keywords.yaml', 'w') as f:
            f.write(str(merged)) 

    @app.route('/api', methods=['GET'])
    def api():
        return {"data": 1234}

    @app.route('/api/synergize', methods=['POST'])
    def synergize():
        selected_card = request.args.get('card')
        data = request.get_json()
        synergy = CalculatedSynergy(selected_card, data['otherCards'])

        syn_calc = synergy.get_synergy_scores()

        return jsonify(syn_calc)

    return app
