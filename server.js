import express from "express";
import cors from "cors";
import multer from "multer";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Áudio não fornecido." });

  const originalPath = req.file.path;
  const newPath = `${req.file.path}.webm`;

  try {
    fs.renameSync(originalPath, newPath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(newPath),
      model: "whisper-1",
    });

    if (fs.existsSync(newPath)) fs.unlinkSync(newPath);

    res.json({ text: transcription.text });
  } catch (error) {
    if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
    else if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    res.status(500).json({ error: "Erro ao transcrever áudio." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Texto não fornecido." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente útil e conciso." },
        { role: "user", content: text },
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar resposta da IA." });
  }
});

app.listen(port, () => {
  console.log(`BFF rodando em http://localhost:${port}`);
});
