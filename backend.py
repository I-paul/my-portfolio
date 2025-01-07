from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    conn = sqlite3.connect('portfolio.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/submit-contact', methods=['POST'])
def submit_contact():
    conn = sqlite3.connect('portfolio.db')
    try:
        data = request.json
        
        # Validate required fields
        if not all(key in data for key in ['name', 'email', 'message']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Store in database

        c = conn.cursor()
        c.execute('''
            INSERT INTO messages (name, email, message)
            VALUES (?, ?, ?)
        ''', (data['name'], data['email'], data['message']))
        conn.commit()
        conn.close()
        
        return jsonify({
            'name': data['name']
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database when script starts
init_db()

if __name__ == '__main__':
    app.run(debug=True, port=5000)