import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

// Allow your frontend (Live Server origin) to call this API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/explain", async (req, res) => {
  try {
    const { studentInput, courseDescription, lang } = req.body;

    const systemPrompt =
      lang === "sr"
        ? "You are an academic advisor. Answer in Serbian."
        : "You are an academic advisor. Answer in English.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Student input: ${studentInput}\n\nCourse: ${courseDescription}\n\nWhy is this a good fit?` }
        ]
      })
    });

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "No explanation available.";
    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch explanation" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
