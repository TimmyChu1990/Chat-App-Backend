//index.js

const axios = require("axios");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;

// Function to call the ChatGPT API
async function callChatGPT(prompt) {
    const url = "https://api.chatanywhere.tech/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    const data = {
        // model: "gpt-3.5-turbo",
        model: "gpt-4o-audio-preview",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
        ],
    };

    try {
        const response = await axios.post(url, data, { headers });
        const result = response.data.choices[0].message.content;
        return result;
    } catch (error) {
        console.error(
            "Error calling ChatGPT API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

module.exports = {callChatGPT};