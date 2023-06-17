# Import the dependencies.
from flask import Flask, jsonify
import json

#################################################
# Flask Routes
#################################################

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_lifespan():
    # Read the JSON file
    with open('Resources/lifespan_world.json', 'r') as file:
        data = json.load(file)
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
