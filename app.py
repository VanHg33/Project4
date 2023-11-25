
from flask import Flask, render_template, jsonify

import numpy as np
import pandas as pd

import sqlite3

# conn = sqlite3.connect('Data Wrangling/JSearchdata.sqlite')

# Check to see if the connection to db is successful.
# test_df = pd.read_sql('SELECT * FROM json_data', conn)
# print("\n================== CHECK ==========================\n")
# print(test_df.head(2))
# print("\n===================================================\n")

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/map")
def map():
    return render_template("map.html")



@app.route("/api/mapping")
def mapping():
    print("\n================== /api/map ==========================\n")
    
    conn = sqlite3.connect('Data Wrangling/JSearchdata.sqlite')
    cursor = conn.cursor()
    
    sql_string = f"SELECT job_state, COUNT(*) as count, job_latitude, job_longitude FROM json_data GROUP BY job_state"
    cursor.execute(sql_string)

    results = cursor.fetchall()
    conn.close()
    
    print("\n================== city_count ==========================\n")
    print(results)
    print("\n===================================================\n")

    data = []
    
    for result in results:
        row = {
            'state': result[0],
            'count': result[1],
            'latitude': result[2],
            'longitude': result[3]
        }
        
        data.append(row)
    
    return jsonify(data)






if __name__ == '__main__':
    app.run(debug=True)



