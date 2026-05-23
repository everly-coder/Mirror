const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body;

  console.log('Recebendo requisição...');
  console.log('Chave API:', process.env.REACT_APP_ANTHROPIC_KEY ? 'encontrada' : 'NÃO encontrada');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system,
        messages
      })
    });

    const data = await response.json();
    console.log('Resposta da API:', JSON.stringify(data).substring(0, 200));
    res.json(data);
  } catch (err) {
    console.error('Erro:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));