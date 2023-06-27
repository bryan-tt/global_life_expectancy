# Import the dependencies.
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify
from flask_cors import CORS
#################################################
# Database Setup
#################################################

# create engine
engine = create_engine(f"postgresql+psycopg2://postgres:postgres@localhost:5432/life_expectancy")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)

# Save reference to the table
Lifespan = Base.classes.lifespan

#################################################
# Flask Routes
#################################################

app = Flask(__name__)
CORS(app)


@app.route("/")
def lifeExpectancy():
    session = Session(engine)

    """Return a list of all the data"""
    # Query all data without the id
    results = session.query(
        Lifespan.entity, Lifespan.code, Lifespan.year, Lifespan.life_expectancy
    ).all()

    my_list = []

    for entity, code, year, life_expectancy in results:
        my_dict = {}
        my_dict["Entity"] = entity
        my_dict["Code"] = code
        my_dict["Year"] = year
        my_dict["Life expectancy at birth, total (years)"] = life_expectancy
        my_list.append(my_dict)

    session.close()

    final_dict = {'lifespan': my_list}
    return jsonify(final_dict)


if __name__ == "__main__":
    app.run(debug=True)
