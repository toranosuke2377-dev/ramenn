
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parsing
const envPath = path.resolve(process.cwd(), '.env');
let apiKey = '';
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const match = content.match(/VITE_GEMINI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

if (!apiKey) {
    console.error("No API KEY found in .env");
    process.exit(1);
}

console.log(`Using Key: ${apiKey.slice(0, 5)}...`);

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach((m: any) => console.log(` - ${m.name}`));
        } else {
            console.log("No models found or error. Response:", JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
