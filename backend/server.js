import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Ensure installed via 'npm install node-fetch'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const GOOGLE_API_KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;

// --- MongoDB Connection ---
mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Helper: AI Response ---
async function getAIResponse(message, model, promptType = 'chat') {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`;

  let body;
  if (promptType === 'translate') {
    // For translation, message is an object { text, targetLanguage }
    body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate this into ${message.targetLanguage}: ${message.text}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        candidateCount: 1,
        maxOutputTokens: 250
      }
    };
  } else {
    // Default chat
    body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a helpful legal assistant. Answer this question concisely: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        candidateCount: 1,
        maxOutputTokens: 500
      }
    };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return response;
}

// --- Proxy Chat Endpoint (unchanged) ---
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'API Key not configured on the server.' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Try gemini-pro first
    let response = await getAIResponse(message, 'gemini-pro');
    let data;

    if (response.ok) {
      data = await response.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, no response from AI.";
      return res.json({ response: aiResponse, model: "gemini-pro" });
    }

    // Fallback to flash model for 404 or 400
    if (response.status === 404 || response.status === 400) {
      response = await getAIResponse(message, 'gemini-2.5-flash');
      if (response.ok) {
        data = await response.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, no response from AI (flash).";
        return res.json({ response: aiResponse, model: "flash" });
      } else {
        const errText = await response.text();
        return res.status(response.status).json({ error: `[Fallback] ${errText}` });
      }
    } else {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
  } catch (err) {
    console.error('❌ Chat API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Translation Endpoint (new) ---
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'API Key not configured on the server.' });
  }
  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'Text and targetLanguage are required' });
  }

  try {
    // Try Gemini-Pro for translation
    let response = await getAIResponse({ text, targetLanguage }, 'gemini-pro', 'translate');
    let data;

    if (response.ok) {
      data = await response.json();
      const translation = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No translation available.";
      return res.json({ translation });
    }

    // Fallback to flash if needed
    if (response.status === 404 || response.status === 400) {
      response = await getAIResponse({ text, targetLanguage }, 'gemini-2.5-flash', 'translate');
      if (response.ok) {
        data = await response.json();
        const translation = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No translation available (flash).";
        return res.json({ translation });
      } else {
        const errText = await response.text();
        return res.status(response.status).json({ error: `[Fallback] ${errText}` });
      }
    } else {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }
  } catch (err) {
    console.error('❌ Translate API Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
