from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
'''from dotenv import load_dotenv

load_dotenv()
'''
# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Optional: enables cross-origin requests (for frontend integration)

# Load model and vectorizer
model = joblib.load("emotion_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# Text cleaning function
def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|https\S+", '', text, flags=re.MULTILINE)
    text = re.sub(r'\@w+|\#','', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\d+', '', text)
    return text

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if "text" not in data:
        return jsonify({"error": "Text input is required"}), 400

    raw_text = data["text"]
    cleaned_text = clean_text(raw_text)
    vectorized = vectorizer.transform([cleaned_text])
    prediction = model.predict(vectorized)[0]

    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True)



