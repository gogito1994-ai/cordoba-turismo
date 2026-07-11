# Configurar el asistente de chat con IA

La web incluye un widget de chat en la portada donde los visitantes pueden preguntar
libremente sobre Córdoba (monumentos, horarios, rutas, gastronomía, eventos,
transporte, historia...). Las respuestas las genera un modelo de Claude (Anthropic).

Como el sitio está en GitHub Pages (sin servidor propio), la API key **no puede
vivir en el código del navegador** — cualquiera podría robarla. Por eso el chat
llama a un pequeño servidor intermedio (un **Cloudflare Worker**) que guarda la
key de forma segura y reenvía la pregunta a Anthropic.

Sigue estos pasos una sola vez para activarlo. No hace falta instalar nada en tu
ordenador (opción A), aunque también se explica la vía por terminal (opción B).

---

## 1. Consigue una API key de Anthropic

1. Ve a **[console.anthropic.com](https://console.anthropic.com/)** y crea una cuenta si no tienes.
2. En el menú **"API Keys"**, crea una nueva key.
3. Cópiala (empieza por `sk-ant-...`) y guárdala en un lugar seguro. **No la pegues nunca en el código ni la compartas.**
4. Ten en cuenta que el uso de la API tiene coste (según tokens consumidos). Puedes revisar el gasto en [console.anthropic.com/settings/usage](https://console.anthropic.com/settings/usage).

---

## Opción A: desplegar desde el navegador (recomendado, sin instalar nada)

### 2. Crea el Worker en Cloudflare

1. Ve a **[dash.cloudflare.com](https://dash.cloudflare.com/)** y crea una cuenta gratuita si no tienes.
2. En el menú lateral, entra en **"Workers y Pages"** → **"Create"** → **"Create Worker"**.
3. Dale un nombre, por ejemplo `cordoba-chat`, y créalo.
4. Una vez creado, haz clic en **"Edit code"** (te abre un editor online).
5. Borra el código de ejemplo que trae por defecto.
6. Abre el archivo [`worker/index.js`](worker/index.js) de este proyecto, copia todo su contenido y pégalo en el editor de Cloudflare.
7. Haz clic en **"Deploy"** / **"Save and deploy"**.

### 3. Añade tu API key como secreto

Esto es lo que mantiene la key fuera del código:

1. En la página del Worker, ve a **"Settings"** → **"Variables and Secrets"**.
2. Añade una variable nueva de tipo **Secret** (no "texto plano"):
   - **Nombre:** `ANTHROPIC_API_KEY`
   - **Valor:** tu API key de Anthropic
3. Guarda los cambios.

### 4. Comprueba que el Worker funciona

Cloudflare te da una URL del tipo `https://cordoba-chat.tu-usuario.workers.dev`.
Ábrela directamente en el navegador: deberías ver algo como
`{"status":"ok","message":"Cordoba chat worker is running."}`.

### 5. Conecta el frontend con tu Worker

1. Abre el archivo [`js/chat.js`](js/chat.js) del proyecto.
2. Busca esta línea, cerca del principio:
   ```js
   const WORKER_URL = "https://cordoba-chat.YOUR-SUBDOMAIN.workers.dev";
   ```
3. Sustitúyela por la URL real de tu Worker (la del paso 4).
4. Guarda el archivo, haz commit y push para publicar el cambio en GitHub Pages.

### 6. Autoriza tu dominio en el Worker (CORS)

Por seguridad, el Worker solo acepta peticiones desde los dominios indicados en
`worker/index.js`, en la constante `ALLOWED_ORIGINS`. Ya incluye
`https://gogito1994-ai.github.io` y `http://localhost:8765` (para pruebas locales).
Si en el futuro cambias de dominio, añade la nueva URL a esa lista, vuelve a pegar
el código actualizado en el editor de Cloudflare y haz "Deploy" de nuevo.

---

## Opción B: desplegar con Wrangler (línea de comandos)

Requiere tener [Node.js](https://nodejs.org) instalado.

```bash
npm install -g wrangler
wrangler login

cd worker
wrangler secret put ANTHROPIC_API_KEY
# Pega tu API key cuando te la pida (no se guarda en ningún archivo)

wrangler deploy
```

Wrangler te mostrará la URL del Worker desplegado. Luego sigue el **paso 5** de
la Opción A para conectarla con `js/chat.js`.

---

## Control de costes y abuso (opcional pero recomendable)

Como el endpoint es público, cualquiera que descubra la URL podría enviarle
peticiones. El Worker ya limita la longitud de los mensajes y el historial, pero
para mayor tranquilidad puedes:

- Añadir una regla gratuita de **Rate Limiting** en Cloudflare (Workers y Pages →
  tu Worker → "Triggers" o "Security") para limitar peticiones por IP y minuto.
- Revisar periódicamente el consumo en el panel de Anthropic.
- Si el gasto se dispara, puedes desactivar el Worker temporalmente desde el
  dashboard de Cloudflare sin tocar el resto de la web.

## Solución de problemas

- **El chat responde "El asistente todavía no está configurado"**: no has
  sustituido `WORKER_URL` en `js/chat.js`, o el valor sigue siendo el de ejemplo.
- **El chat responde "Se produjo un error al conectar con el asistente"**: revisa
  en el dashboard de Cloudflare (pestaña "Logs" del Worker) si hay errores, y
  confirma que el secreto `ANTHROPIC_API_KEY` está bien configurado.
- **CORS / "blocked by CORS policy" en la consola del navegador**: añade tu
  dominio exacto a `ALLOWED_ORIGINS` en `worker/index.js` y vuelve a desplegar.
