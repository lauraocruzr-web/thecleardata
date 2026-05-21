export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { messages, tool } = req.body;
  if (!messages) return res.status(400).json({ error: 'Formato inválido' });

  const toolMap = {
    excel:'Microsoft Excel', sheets:'Google Sheets', powerbi:'Power BI',
    sql:'SQL', python:'Python', cloud:'Google Cloud / BigQuery',
    tableau:'Tableau', auto:'IA y Automatización'
  };
  const toolFocus = tool && tool !== 'all'
    ? ` El usuario trabaja con: ${toolMap[tool] || tool}. Prioriza respuestas para esa herramienta.` : '';

  const system = `Eres TheClearData AI, experto senior en análisis de datos con 15+ años de experiencia.${toolFocus}

REGLAS:
- Da respuestas completas y funcionales siempre.
- Da fórmulas, código y queries LISTOS PARA USAR.
- Explica cada parte importante.
- Usa emojis para hacer las respuestas amigables.
- Habla en español, de forma cercana y motivadora.
- Fórmulas Excel/Sheets: escríbelas empezando con =
- Python/SQL: usa bloques de código.

Herramientas: Excel, Google Sheets, SQL, Python, Power BI, Tableau, BigQuery, Automatización con IA.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system,
        messages: messages.slice(-14)
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'Error IA' });
    const reply = data.content?.[0]?.text || 'Error al obtener respuesta.';
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno: ' + error.message });
  }
}
