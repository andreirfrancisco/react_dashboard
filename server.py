from flask import Flask, jsonify, abort
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

DATASET_PATH = 'data/unemployed_sample_dataset.xlsx'

def read_data():
    try:
        df = pd.read_excel(DATASET_PATH)
        return df
    except Exception as e:
        print(f"Error reading dataset: {e}")
        abort(500)  # Internal server error

@app.route('/dashboard')
def dashboard():
    datasets = 'data'
    unique_regions_list = set()  # Use a set to avoid duplicates

    for data in os.listdir(datasets):
        try:
            df = pd.read_excel(os.path.join(datasets, data), index_col=0)
            unique_regions = df['Region'].unique()
            unique_regions_list.update(unique_regions)  # Add unique regions to the set
        except Exception as e:
            print(f"Error reading {data}: {e}")

    # Convert the set to a list and then to a JSON object
    json_object = pd.Series(list(unique_regions_list)).to_json(orient='values')
    return json_object

def time_method(region):
    df = read_data()
    filtered_data = df[df['Region'].str.contains(region)]
    # Assuming filtered_data['Date'] contains dates in 'DD-MM-YYYY' format
    x_data = filtered_data['Date'].tolist()

    # Convert each date to 'MM-DD-YYYY' format
    x_data = [datetime.strptime(date, '%d-%m-%Y').strftime('%m-%d-%Y') for date in x_data]
    y_data = filtered_data['Unemployed'].tolist()

    title = 'Unemployed'
    time_object = {
        'Title': title + ' time data',
        'x_axis': x_data,
        'y_axis': y_data
    }

    return jsonify(time_object)


def metric_method(region):
    df = read_data()
    
    # Filter data for the specified region
    data = df[df['Region'].str.contains(region)]
    
    if data.empty:
        abort(404, description="Region not found")  # Return a 404 if no data found

    # Convert 'Date' column to datetime and drop rows with invalid dates
    data['Date'] = pd.to_datetime(data['Date'], errors='coerce')
    data = data.dropna(subset=['Date'])

    # Get a list of dates and ensure they are sorted
    x_data = data['Date'].dt.strftime('%d-%m-%Y').tolist()
    
    if len(x_data) < 2:
        abort(404, description="Not enough data to calculate metrics")  # Not enough dates

    # Get the last two dates
    last_two_dates = x_data[-2:]

    # Get the unemployment values for the last two dates
    recent_value = data[data['Date'] == pd.to_datetime(last_two_dates[1], format='%d-%m-%Y')]['Unemployed'].values
    previous_value = data[data['Date'] == pd.to_datetime(last_two_dates[0], format='%d-%m-%Y')]['Unemployed'].values

    # Handle cases where the values might not exist
    if len(recent_value) == 0 or len(previous_value) == 0:
        percent_change = None  # Not enough data to calculate change
    else:
        recent_value = recent_value[0]
        previous_value = previous_value[0]

        # Calculate percentage change
        if previous_value != 0:  # Avoid division by zero
            percent_change = round(((recent_value - previous_value) / previous_value) * 100, 2)
        else:
            percent_change = None  # Handle case where previous_value is zero

    # Calculate unemployment metrics
    avg_unemployed = round(float(data['Unemployed'].mean()), 2)
    min_unemployed = int(data['Unemployed'].min())
    max_unemployed = int(data['Unemployed'].max())
    median_unemployed = float(data['Unemployed'].median())
    total_unemployed = int(data['Unemployed'].sum())  # Convert to int for JSON serialization

    # Prepare the metric object for JSON serialization
    metric_object = {
        'Avg': avg_unemployed,
        'Min': min_unemployed,
        'Max': max_unemployed,
        'Median': median_unemployed,
        'Total': total_unemployed,
        '% Change':(str(percent_change) + "%")
    }
    
    return metric_object  # Return as a JSON serializable dictionary
def time_method(region):
    df = read_data()
    filtered_data = df[df['Region'].str.contains(region)]
    x_data = filtered_data['Date'].tolist()

    # Convert each date to 'MM-DD-YYYY' format
    x_data = [datetime.strptime(date, '%d-%m-%Y').strftime('%m-%d-%Y') for date in x_data]
    y_data = filtered_data['Unemployed'].tolist()

    title = 'Unemployed'
    time_object = {
        'Title': title + ' time data',
        'x_axis': x_data,
        'y_axis': y_data
    }

    return time_object  # Return as a dictionary

def performance_method(region):
    df = read_data()  
    
    # Group by 'Region' and sum the 'Unemployed' counts
    region_totals = df.groupby('Region')['Unemployed'].sum().reset_index()

    # Get the top 5 regions with the largest total unemployed
    largest_regions = region_totals.nlargest(5, 'Unemployed').to_dict(orient='records')
    
    # Get the top 5 regions with the smallest total unemployed
    smallest_regions = region_totals.nsmallest(5, 'Unemployed').to_dict(orient='records')

    # Structure the response to include both largest and smallest regions
    top_regions = {
        'Largest': [{'Region': region['Region'], 'Unemployed': region['Unemployed']} for region in largest_regions],
        'Smallest': [{'Region': region['Region'], 'Unemployed': region['Unemployed']} for region in smallest_regions]
    }
    
    return top_regions
@app.route('/dashboard/<region>')
def region_data(region):
    data_object = {
        'metrics': metric_method(region),
        'time': time_method(region),
        'performance': performance_method(region)
    }
    
    return jsonify(data_object)  # Now you can jsonify the entire data_object

if __name__ == '__main__':
    app.run(debug=True)