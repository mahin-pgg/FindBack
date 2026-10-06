const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const AI_SERVICE_URL =
    process.env.AI_SERVICE_URL || "http://127.0.0.1:5000";

const AI_SERVICE_TOKEN = process.env.AI_SERVICE_TOKEN;
const AI_TIMEOUT_MS = Number.parseInt(
    process.env.AI_TIMEOUT_MS || "10000",
    10
);

const authHeaders = AI_SERVICE_TOKEN
    ? { "X-AI-Service-Token": AI_SERVICE_TOKEN }
    : {};

async function getTextSimilarity(text1, text2) {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/similarity`,
            {
                text1,
                text2
            },
            {
                headers: authHeaders,
                timeout: AI_TIMEOUT_MS
            }
        );

        return response.data.similarity;
    } catch (error) {
        console.error(
            "AI similarity service error:",
            error.message
        );

        throw new Error(
            "Could not connect to AI similarity service"
        );
    }
}

async function getTextEmbedding(text) {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/embedding`,
            {
                text
            },
            {
                headers: authHeaders,
                timeout: AI_TIMEOUT_MS
            }
        );

        return response.data.embedding;
    } catch (error) {
        console.error(
            "AI embedding service error:",
            error.message
        );

        throw new Error(
            "Could not generate text embedding"
        );
    }
}

async function getImageEmbedding(imagePath) {
    try {
        const form = new FormData();

        form.append(
            "image",
            fs.createReadStream(imagePath)
        );

        const response = await axios.post(
            `${AI_SERVICE_URL}/image-embedding`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    ...authHeaders
                },
                timeout: AI_TIMEOUT_MS,
                maxContentLength: 5 * 1024 * 1024,
                maxBodyLength: 5 * 1024 * 1024
            }
        );

        return response.data.embedding;
    } catch (error) {
        console.error(
            "AI image embedding service error:",
            error.message
        );

        throw new Error(
            "Could not generate image embedding"
        );
    }
}

module.exports = {
    getTextSimilarity,
    getTextEmbedding,
    getImageEmbedding
};