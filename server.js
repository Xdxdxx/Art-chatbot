require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors()); // allow your frontend to call this server
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn('Set OPENAI_API_KEY in environment variables');
}

app.get('/', (req, res) => res.send('Canva Chatbot server running'));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: 'message required' });

  try {
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant for my website.' },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 600
      })
    });

    const data = await openaiResp.json();
    const assistant = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? '';
    res.json({ reply: assistant, raw: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error', details: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
