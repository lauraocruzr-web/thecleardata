export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages, tool } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  const toolFocus = tool && tool !== 'all'
    ? ` El usuario quiere respuestas enfocadas en: ${tool.toUpperCase()}.`
    : '';

  const systemPrompt = `Eres TheClearData AI, experto senior en análisis de datos con 15+ años de experiencia.${toolFocus}

REGLAS:
- Da respuestas completas y funcionales siempre.
- Da fórmulas, código y queries LISTOS PARA USAR.
- Explica cada parte importante.
- Usa emojis para hacer las respuestas amigables.
- Habla en español de forma cercana y motivadora.
- Fórmulas Excel: escríbelas empezando con =
- Python/SQL: usa bloques de código.

Herramientas: Excel, Google Sheets, SQL, Python, Power BI, BigQuery.`;

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
        system: systemPrompt,
        messages: messages.slice(-12)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error del servidor de IA' });
    }

    const reply = data.content?.[0]?.text || 'Error al obtener respuesta.';
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
