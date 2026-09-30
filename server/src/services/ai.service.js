const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");


const AI_SERVICE_URL = "http://127.0.0.1:5000";


// ==================================================
// TEXT SIMILARITY
// ==================================================

async function getTextSimilarity(text1, text2) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/similarity`,
            {
                text1: text1,
                text2: text2
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


// ==================================================
// TEXT EMBEDDING
// ==================================================

async function getTextEmbedding(text) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/embedding`,
            {
                text: text
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


// ==================================================
// IMAGE EMBEDDING
// ==================================================

async function getImageEmbedding(imagePath) {

    try {

        // Create multipart/form-data
        const form = new FormData();


        // Attach image file
        form.append(
            "image",
            fs.createReadStream(imagePath)
        );


        // Send image to Python AI service
        const response = await axios.post(
            `${AI_SERVICE_URL}/image-embedding`,
            form,
            {
                headers: {
                    ...form.getHeaders()
                },

                maxContentLength: Infinity,

                maxBodyLength: Infinity
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