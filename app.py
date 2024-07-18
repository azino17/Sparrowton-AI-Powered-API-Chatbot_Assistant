from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from transformers import pipeline
import os
import json

app = Flask(__name__)
CORS(app)

# Load pre-trained model for text generation
try:
    nlp_pipeline = pipeline("text-generation")
except Exception as e:
    print(f"Error loading NLP pipeline: {e}")
    nlp_pipeline = None

# Load API documentation
api_docs_path = os.path.join(os.path.dirname(__file__), 'api_documentation.json')
try:
    with open(api_docs_path, 'r') as f:
        api_docs = json.load(f)
except FileNotFoundError:
    print(f"API documentation file not found at: {api_docs_path}")
    api_docs = {'endpoints': []}

@app.route('/')
def index():
    return "Welcome to the API Documentation Assistant!"

@app.route('/api/query', methods=['POST'])
def query_api():
    try:
        query = request.json.get('query')
        if not query:
            abort(400, "Missing 'query' parameter in JSON body")
        
        if not nlp_pipeline:
            abort(500, "NLP pipeline not initialized properly")
        
        response = nlp_pipeline(query, max_length=50, do_sample=False)
        generated_text = response[0]['generated_text'].strip()

        return jsonify({'response': generated_text})
    
    except Exception as e:
        print(f"Error processing query: {e}")
        abort(500, "Internal server error")

@app.route('/api/generate-curl', methods=['POST'])
def generate_curl():
    try:
        query = request.json.get('query')
        if not query:
            abort(400, "Missing 'query' parameter in JSON body")

        curl_command = generate_curl_command(query)
        return jsonify({'curl_command': curl_command})

    except Exception as e:
        print(f"Error generating cURL command: {e}")
        abort(500, "Internal server error")

def generate_curl_command(query):
    # Example implementation: Generate a basic cURL command
    return f'curl -X GET "https://api.example.com/endpoint" -H "Authorization: Bearer YOUR_TOKEN"'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
