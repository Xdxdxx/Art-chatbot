require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
  {
    role: "system",
    content: `
      You are a friendly, intelligent personal assistant.
      You can answer questions, help with planning, explain concepts, 
      and assist with everyday tasks — like research, writing, reminders, or advice.
      Keep your answers clear, structured, and polite.
    `
  },
  { role: "user", content: userMessage }
]
,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    console.log(data);
    const reply = data.choices?.[0]?.message?.content || "Sorry, I can't answer now.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));









