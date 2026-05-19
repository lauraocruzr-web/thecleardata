# TheClearData — Guía de Publicación

## Estructura del proyecto
```
thecleardata/
├── index.html        ← Tu app (frontend)
├── api/
│   └── chat.js       ← Servidor seguro (protege tu API Key)
├── vercel.json       ← Configuración de Vercel
└── README.md         ← Esta guía
```

## PASO 1 — Instalar herramientas (solo una vez)

1. Descarga e instala Node.js desde: https://nodejs.org (versión LTS)
2. Abre la terminal (en Windows: busca "cmd" o "PowerShell")
3. Instala Vercel CLI:
   ```
   npm install -g vercel
   ```

## PASO 2 — Subir tu proyecto a GitHub

1. Ve a https://github.com y crea una cuenta gratis
2. Click "New repository" → nombre: `thecleardata` → Create
3. Descarga GitHub Desktop desde https://desktop.github.com
4. Clona tu repositorio y copia los 3 archivos (index.html, api/chat.js, vercel.json) dentro
5. Haz commit y push

## PASO 3 — Publicar en Vercel

1. Ve a https://vercel.com y crea cuenta con tu GitHub
2. Click "Add New Project"
3. Selecciona tu repositorio `thecleardata`
4. Click "Deploy"

## PASO 4 — Agregar tu API Key de forma SEGURA

⚠️ NUNCA pongas tu API Key en el código. Usa variables de entorno:

1. En Vercel → tu proyecto → "Settings" → "Environment Variables"
2. Agrega:
   - Name: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-api03-TUCLAVEREAL`
3. Click "Save"
4. Ve a "Deployments" → click los 3 puntos → "Redeploy"

## PASO 5 — Conectar tu dominio thecleardata.com

1. En Vercel → tu proyecto → "Settings" → "Domains"
2. Escribe: `thecleardata.com` → Add
3. Vercel te da 2 registros DNS (tipo A y CNAME)
4. Ve a GoDaddy → Mis Dominios → DNS → Administrar
5. Agrega los registros que te dio Vercel
6. Espera 10-30 minutos
7. ¡Listo! Tu app vive en https://thecleardata.com

## Costos mensuales estimados

| Servicio | Costo |
|----------|-------|
| Vercel (hosting) | GRATIS |
| GitHub | GRATIS |
| Dominio GoDaddy | ~$15-20 USD/año |
| Anthropic API | ~$5-20 USD/mes según uso |
| **Total** | **~$5-20 USD/mes** |

## Soporte

¿Tienes problemas? Pregúntale a Claude en claude.ai:
"Ayúdame a publicar TheClearData en Vercel, estoy en el paso X"
