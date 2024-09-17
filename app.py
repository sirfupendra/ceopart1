from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Setup CORS
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Adjust origin as needed

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['CEODATABASE']
alumnies_collection = db['alumnies']

# Folder to store profile photos
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def home():
    return "Welcome"

# Alumni registration route
@app.route('/signup', methods=['POST'])
def register_alumni():
    try:
        data = request.form
        photo = request.files.get('profilephoto')
        
        if not photo:
            return jsonify({"error": "No profile photo uploaded"}), 400

        # Save the uploaded photo
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Insert alumni data into MongoDB (including the photo)
        alumni_data = {
            "name": data.get('name'),
            "email": data.get('email'),
            "degree": data.get('degree'),
            "yearofpassout": data.get('yearofpassout'),
            "currentlyworkingin": data.get('currentlyworkingin'),
            "experiencedCompanies": data.get('experiencedCompanies'),
            "github": data.get('github'),
            "message": data.get('message'),
            "profilephoto": filename
        }

        # Insert into the alumnies collection
        alumnies_collection.insert_one(alumni_data)
        return jsonify({"message": "Alumni registered successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Alumni search route
@app.route('/search', methods=['GET'])
def search_alumni():
    try:
        query = request.args.get('query')
        
        if not query:
            return jsonify({"error": "Query parameter is required"}), 400
        
        # Search for alumni by name or company (case-insensitive)
        alumni_list = alumnies_collection.find({
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"currentlyworkingin": {"$regex": query, "$options": "i"}}
            ]
        })
        
        # Preparing result to include all relevant alumni information
        result = []
        for alumni in alumni_list:
            result.append({
                "name": alumni.get('name'),
                "email": alumni.get('email'),
                "degree": alumni.get('degree'),
                "yearofpassout": alumni.get('yearofpassout'),
                "currentlyworkingin": alumni.get('currentlyworkingin'),
                "experiencedCompanies": alumni.get('experiencedCompanies', 'N/A'),
                "github": alumni.get('github', 'N/A'),
                "message": alumni.get('message', 'N/A'),
                "profilephoto": alumni.get('profilephoto')
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to serve profile images
@app.route('/uploads/<filename>', methods=['GET'])
def serve_profile_photo(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
