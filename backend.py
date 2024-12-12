import csv
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend to make requests

CSV_FILE_PATH = 'contact_submissions.csv'

# Ensure CSV file exists with headers
def initialize_csv():
    if not os.path.exists(CSV_FILE_PATH):

        with open(CSV_FILE_PATH, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['Name', 'Email', 'Message', 'Submission Date'])

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    try:
        # Get JSON data from the request
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['name', 'email', 'message']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Import datetime to add submission timestamp
        from datetime import datetime
        
        name=str(data['name'])
        mail=str(data['email'])
        message=str(data['message'])
        date=str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
        # Prepare row to write to CSV
        row = [name,mail,message,date]
        
        # Append to CSV file
        with open(CSV_FILE_PATH, 'a', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(row)
        
        return jsonify({'message': 'Submission successful'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize CSV file when script starts
initialize_csv()

if __name__ == '__main__':
    app.run(debug=True, port=5000)