import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

// Lade Umgebungsvariablen aus der .env-Datei
dotenv.config();

// Überprüfe, ob der API-Key geladen wurde
if (!process.env.VITE_OPENAI_API_KEY) {
    console.error("Fehler: Der API-Key wurde nicht gefunden. Bitte überprüfe die .env-Datei.");
    process.exit(1); // Beende den Prozess, wenn der Schlüssel fehlt
}

console.log("API-Key erfolgreich geladen:", process.env.VITE_OPENAI_API_KEY ? "Ja" : "Nein");

// Initialisiere Express
const app = express();
app.use(express.json()); // Middleware, um JSON-Daten zu parsen

// Initialisiere OpenAI-Client
const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY, // API-Schlüssel aus der Umgebungsvariable
});

// OpenAI-Endpunkt
app.post("/api/openai", async (req, res) => {
    const { prompt } = req.body; // Extrahiere das Prompt aus der Anfrage

    console.log("Prompt erhalten:", prompt); // Debugging-Ausgabe

    // Überprüfe, ob das Prompt vorhanden ist
    if (!prompt) {
        return res.status(400).json({ error: "Prompt ist erforderlich" });
    }

    try {
        // Anfrage an OpenAI senden
        const response = await openai.chat.completions.create({
            model: "gpt-4", // Verwende ein verfügbares Modell
            messages: [{ role: "user", content: prompt }],
            max_tokens: 150,
        });

        console.log("Antwort von OpenAI erhalten:", response.choices[0].message.content); // Debugging-Ausgabe

        // Antwort an den Client senden
        res.json({ content: response.choices[0].message.content });
    } catch (error) {
        console.error("Fehler bei der OpenAI-Anfrage:", error.message); // Zeige den Fehler an
        res.status(500).json({ error: "Fehler bei der Verarbeitung der Anfrage" });
    }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
