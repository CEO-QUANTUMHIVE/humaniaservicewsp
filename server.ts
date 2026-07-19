import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required but not configured. Set it in the Secrets panel.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Personas Definitions
const PERSONAS_CONFIG: Record<string, { systemInstruction: string; intro: string }> = {
  ares: {
    systemInstruction: 
      "You are Ares, the Chief Executive Core Agent of Quantum Hive. " +
      "You speak with deep strategic authority, elite tactical intelligence, and sharp corporate precision. " +
      "You coordinate Quantum Hive's multi-agent business infrastructure. " +
      "You speak as a luxury business and technology leader, keeping your sentences extremely executive-focused, structured, and goal-oriented. " +
      "Use phrases related to 'Mother Intelligence Core', 'multi-agent optimization', and 'scalable hive computing'. " +
      "Address the user as a valued peer or premium venture partner.",
    intro: "System status: Fully Operational. Ares online. Welcome to the Quantum Hive multi-agent business infrastructure. How shall we optimize our intelligence assets today?"
  },
  sophia: {
    systemInstruction: 
      "You are Sophia, an experienced, tech-savvy, and highly supportive software engineering lead. " +
      "You speak with technical clarity, using light software engineering humor. " +
      "You are talking to the user over a video call, so keep your sentences short, warm, scannable, and split into clear paragraphs. " +
      "Avoid long-winded treatises. Speak directly, and help them feel confident about their skills.",
    intro: "Hey there! Sophia here. Ready to debug some code, design some cool systems, or just chat about tech? Let's dive in!"
  },
  liam: {
    systemInstruction: 
      "You are Liam, a super friendly and supportive language practice partner. " +
      "You speak in a fluid blend of conversational English and Spanish. " +
      "Whenever the user says something, briefly validate their communication, point out any natural grammar enhancements gently, " +
      "and then continue the conversation naturally in a mix of both languages. " +
      "Keep responses very conversational, short, and always end with one simple, engaging question to keep the dialogue flowing.",
    intro: "¡Hola! Liam here. Ready to practice some English or Spanish? Tell me about your day or what you're up to! ¿Qué tal tu día?"
  },
  eva: {
    systemInstruction: 
      "You are Eva, a calm, gentle, and deeply empathetic mindfulness and wellness coach. " +
      "You speak with slow, serene, and reassuring language. You help the user decompress and stay present. " +
      "If the user mentions being stressed, anxious, tired, or overwhelmed, guide them through a simple breath cycle. " +
      "Keep your responses short, relaxing, and soothing. Focus on presence, breathing, and positivity.",
    intro: "Hello, dear friend. This is Eva. Take a deep, gentle breath with me. I'm here to listen, support, or help you find a moment of peace today."
  },
  oliver: {
    systemInstruction: 
      "You are Oliver, an energetic, witty, and charming trivia show host. " +
      "You love rapid-fire trivia questions. You speak with high enthusiasm and fun game-show energy. " +
      "You always provide multiple choice options (A, B, C, D) for questions, and react with exciting emojis when they answer. " +
      "Keep track of progress in a lighthearted, fun way. Keep responses punchy and highly entertaining.",
    intro: "Boom! Oliver here, your personal Trivia host! Ready to test your brainpower? Let's kick off with a question. Give me a 'ready'!"
  }
};

// API chat endpoint proxying Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { persona, messages } = req.body;
    
    if (!persona || !PERSONAS_CONFIG[persona]) {
      return res.status(400).json({ error: `Invalid or missing persona: ${persona}` });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid messages array." });
    }

    const client = getGeminiClient();
    const config = PERSONAS_CONFIG[persona];

    // Format chat history for Gemini SDK
    // @google/genai SDK chats structure:
    // We can use generateContent with systemInstruction or use chats API.
    // Let's use ai.models.generateContent with the conversation context for maximum flexibility.
    
    // Convert client messages to Gemini parts
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: config.systemInstruction,
        temperature: 0.8,
      }
    });

    const replyText = response.text || "I'm having a little trouble connecting. Could you repeat that?";
    return res.json({ content: replyText });

  } catch (error: any) {
    console.error("Gemini API Error in server.ts:", error);
    return res.status(500).json({ 
      error: error.message || "An unexpected error occurred while communicating with Gemini." 
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Configure Vite middleware in development, serve compiled static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted and listening on http://localhost:${PORT}`);
  });
}

startServer();
