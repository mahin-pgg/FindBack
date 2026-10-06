import os
from functools import wraps
from flask import Flask, request, jsonify
from dotenv import load_dotenv

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

import open_clip
import torch

import numpy as np
from PIL import Image

load_dotenv()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("AI_MAX_REQUEST_BYTES", 5 * 1024 * 1024))
MAX_TEXT_LENGTH = int(os.getenv("AI_MAX_TEXT_LENGTH", "5000"))
AI_SERVICE_TOKEN = os.getenv("AI_SERVICE_TOKEN")

if not AI_SERVICE_TOKEN:
    raise RuntimeError("AI_SERVICE_TOKEN is not configured")

def require_service_auth(fn):
    @wraps(fn)
    def wrapped(*args, **kwargs):
        if request.headers.get("X-AI-Service-Token") != AI_SERVICE_TOKEN:
            return jsonify({"error": "Unauthorized"}), 401
        return fn(*args, **kwargs)
    return wrapped

def valid_text(value):
    return isinstance(value, str) and 0 < len(value.strip()) <= MAX_TEXT_LENGTH

text_model = SentenceTransformer("all-MiniLM-L6-v2")

image_model, _, image_preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="openai"
)

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "AI service is running"
    })

@app.route("/embedding", methods=["POST"])
@require_service_auth
def embedding():

    data = request.get_json()

    text = data.get("text", "")

    if not valid_text(text):
        return jsonify({
            "error": "Text is required"
        }), 400

    vector = text_model.encode(text)

    vector = vector.astype(float).tolist()

    return jsonify({
        "embedding": vector,
        "dimension": len(vector)
    })

@app.route("/similarity", methods=["POST"])
@require_service_auth
def similarity():

    data = request.get_json()

    text1 = data.get("text1", "")
    text2 = data.get("text2", "")

    if not valid_text(text1) or not valid_text(text2):
        return jsonify({
            "error": "Both text1 and text2 are required"
        }), 400

    embeddings = text_model.encode([
        text1,
        text2
    ])

    embedding1 = np.array([embeddings[0]])
    embedding2 = np.array([embeddings[1]])

    score = cosine_similarity(
        embedding1,
        embedding2
    )[0][0]

    return jsonify({
        "text1": text1,
        "text2": text2,
        "similarity": float(score)
    })

@app.route("/image-embedding", methods=["POST"])
@require_service_auth
def image_embedding():

    if "image" not in request.files:

        return jsonify({
            "error": "Image file is required"
        }), 400


    image_file = request.files["image"]

    try:
        image = Image.open(image_file)
        image.verify()
        image_file.stream.seek(0)
        image = Image.open(image_file).convert("RGB")
    except Exception:
        return jsonify({"error": "Invalid image"}), 400

    image_input = image_preprocess(
        image
    ).unsqueeze(0)

    with torch.no_grad():

        vector = image_model.encode_image(
            image_input
        )

    vector = vector.cpu().numpy()[0]

    vector = vector.astype(float).tolist()

    return jsonify({

        "embedding": vector,

        "dimension": len(vector)

    })

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )

