from flask import request, jsonify
from app import app
from app.synergyCalc import CalculatedSynergy

@app.route('/', methods=['GET'])
def index():
    return "HELLO"

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
