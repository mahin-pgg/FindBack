from flask import Flask, request, jsonify

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

import open_clip
import torch

import numpy as np
from PIL import Image


app = Flask(__name__)


# ==================================================
# TEXT MODEL
# ==================================================

text_model = SentenceTransformer("all-MiniLM-L6-v2")


# ==================================================
# IMAGE MODEL
# ==================================================

image_model, _, image_preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="openai"
)


# ==================================================
# HEALTH CHECK
# ==================================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "status": "AI service is running"
    })


# ==================================================
# TEXT EMBEDDING
# ==================================================

@app.route("/embedding", methods=["POST"])
def embedding():

    data = request.get_json()

    text = data.get("text", "")

    if not text:
        return jsonify({
            "error": "Text is required"
        }), 400

    vector = text_model.encode(text)

    vector = vector.astype(float).tolist()

    return jsonify({
        "embedding": vector,
        "dimension": len(vector)
    })


# ==================================================
# TEXT SIMILARITY
# ==================================================

@app.route("/similarity", methods=["POST"])
def similarity():

    data = request.get_json()

    text1 = data.get("text1", "")
    text2 = data.get("text2", "")

    if not text1 or not text2:
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


# ==================================================
# IMAGE EMBEDDING
# ==================================================

@app.route("/image-embedding", methods=["POST"])
def image_embedding():

    # Check whether an image was uploaded
    if "image" not in request.files:

        return jsonify({
            "error": "Image file is required"
        }), 400


    image_file = request.files["image"]


    # Open image
    image = Image.open(
        image_file
    ).convert("RGB")


    # Preprocess image
    image_input = image_preprocess(
        image
    ).unsqueeze(0)


    # Generate CLIP embedding
    with torch.no_grad():

        vector = image_model.encode_image(
            image_input
        )


    # Convert tensor to normal Python list
    vector = vector.cpu().numpy()[0]

    vector = vector.astype(float).tolist()


    return jsonify({

        "embedding": vector,

        "dimension": len(vector)

    })


# ==================================================
# START SERVER
# ==================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

