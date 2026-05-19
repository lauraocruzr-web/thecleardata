export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { messages, tool } = req.body;
  if (!messages) return res.status(400).json({ error: 'Formato inválido' });

  const toolFocus = tool && tool !== 'all' ? ` Enfócate en: ${tool.toUpperCase()}.` : '';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `Eres TheClearData AI, experto en análisis de datos.${toolFocus} Responde siempre en español, con emojis, dando código y fórmulas completas listas para usar.`,
        messages: messages.slice(-12)
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Error al obtener respuesta.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno: ' + error.message });
  }
}
