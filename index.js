import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const openai = new OpenAI({
  apiKey: "null",
});

let savedPrompts = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/generate-prompt", async (req, res) => {
  const { topic, channel, purpose, audience, specifications } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a prompt generator assistant. Create an effective prompt for a GPT model to write an impact story.",
        },
        {
          role: "user",
          content: `Generate a prompt for topic: ${topic}, channel: ${channel.join(
            ", "
          )}, purpose: ${purpose}, audience: ${audience}, specifications: ${specifications}`,
        },
      ],
    });

    res.json({ generatedPrompt: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate prompt" });
  }
});

app.post("/save-prompt", (req, res) => {
  const { prompt, formData } = req.body;
  if (prompt) {
    const preview = prompt.length > 50 ? `${prompt.slice(0, 50)}...` : prompt;
    savedPrompts.push({
      fullText: prompt,
      preview: preview,
      formData: formData,
      timestamp: new Date().toISOString()
    });
    console.log('Prompt saved:', savedPrompts[savedPrompts.length - 1]);
  }
  res.json({ message: "Prompt saved successfully!" });
});

app.get("/saved-prompts", (req, res) => {
  console.log('Sending saved prompts:', savedPrompts);
  res.json({ savedPrompts });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
