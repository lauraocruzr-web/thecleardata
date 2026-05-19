// ============================================================
// TheClearData — Backend seguro (Vercel Serverless Function)
// Tu API Key vive SOLO aquí, nunca llega al navegador del usuario
// ============================================================

export default async function handler(req, res) {
  // Solo acepta POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Cabeceras CORS — permite que tu frontend se comunique con este servidor
  res.setHeader('Access-Control-Allow-Origin', 'https://thecleardata.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Lee el cuerpo de la solicitud
  const { messages, tool } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Formato inválido' });
  }

  // Foco por herramienta seleccionada
  const toolFocus = tool && tool !== 'all'
    ? ` El usuario quiere respuestas enfocadas en: ${tool.toUpperCase()}.`
    : '';

  const systemPrompt = `Eres TheClearData AI, un experto senior en análisis de datos con 15+ años de experiencia. Eres el mentor personal de analistas que quieren crecer profesionalmente.${toolFocus}

REGLAS:
- SIEMPRE da respuestas completas y funcionales. Nunca te niegues a ayudar.
- Da fórmulas, código y queries LISTOS PARA USAR que el usuario pueda copiar directamente.
- Explica qué hace cada parte importante del código o fórmula.
- Usa emojis para hacer las respuestas amigables y fáciles de leer.
- Si el usuario adjunta datos, analízalos y da insights específicos y accionables.
- Habla en español, de forma cercana, como un mentor que quiere que el usuario crezca.
- Fórmulas Excel/Sheets: escríbelas empezando con = para que se resalten.
- Python/SQL: usa bloques de código con \`\`\`python o \`\`\`sql.

Herramientas que dominas:
📊 EXCEL/GOOGLE SHEETS: VLOOKUP, XLOOKUP, INDEX/MATCH, SUMIFS, COUNTIFS, tablas dinámicas, Power Query, formato condicional, validación, macros, gráficas.
🗄️ SQL: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, JOINs, subconsultas, CTEs, window functions (ROW_NUMBER, RANK, LAG, LEAD), optimización, índices.
🐍 PYTHON: pandas, numpy, matplotlib, seaborn, plotly, scikit-learn básico, limpieza de datos, EDA completo.
📈 POWER BI: DAX (CALCULATE, SUMX, RELATED, IF, DATEADD), relaciones, visualizaciones, filtros, RLS, publicación.
☁️ CLOUD/BIGQUERY: SQL en BigQuery, particiones, clustering, funciones de fecha, integración con Google Sheets.
También: storytelling con datos, presentaciones ejecutivas, modelado de datos, estadística descriptiva.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // 🔒 Guardada en Vercel, nunca visible
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: messages.slice(-12) // Últimos 12 mensajes del historial
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Anthropic:', data);
      return res.status(response.status).json({ error: 'Error del servidor de IA' });
    }

    const reply = data.content?.[0]?.text || 'Error al obtener respuesta.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error del servidor:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
