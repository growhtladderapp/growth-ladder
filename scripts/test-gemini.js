
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local");
    process.exit(1);
}

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

console.log(`Testing API Key: ${apiKey.substring(0, 5)}...`);

const ai = new GoogleGenAI({ apiKey });

async function test() {
    try {
        console.log("Testing generation with gemini-3-flash-preview...");
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Escribe una frase motivadora corta para un atleta.",
        });
        console.log("Success! API Response:", response.text);
    } catch (error) {
        console.error("API Error generating content:", error);
    }
}

test();
