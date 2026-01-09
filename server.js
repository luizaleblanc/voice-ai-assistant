import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: "./recordings.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recordings (
      id TEXT PRIMARY KEY,
      transcription TEXT,
      aiResponse TEXT,
      createdAt TEXT,
      duration INTEGER
    )
  `);
})();

app.post("/api/recordings", async (req, res) => {
  const { id, transcription, aiResponse, createdAt, duration } = req.body;
  try {
    await db.run(
      "INSERT INTO recordings (id, transcription, aiResponse, createdAt, duration) VALUES (?, ?, ?, ?, ?)",
      [id, transcription, aiResponse, createdAt, duration]
    );
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ
app.get("/api/recordings", async (req, res) => {
  try {
    const recordings = await db.all("SELECT * FROM recordings ORDER BY createdAt DESC");
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (Single)
app.delete("/api/recordings/:id", async (req, res) => {
  try {
    await db.run("DELETE FROM recordings WHERE id = ?", req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/recordings", async (req, res) => {
  try {
    await db.run("DELETE FROM recordings");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server persistence running on http://localhost:${PORT}`);
});
