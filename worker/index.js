/**
 * Cloudflare Worker — proxy seguro entre la web de Córdoba y la API de Anthropic.
 *
 * La API key de Anthropic vive SOLO aquí, como secreto de Cloudflare
 * (env.ANTHROPIC_API_KEY), nunca en el código del navegador.
 *
 * Despliegue: ver README-chat-ia.md en la raíz del proyecto.
 */

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 400;
const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_MESSAGES = 8;
const MAX_CONTEXT_FIELD_LENGTH = 120;
const REQUEST_TIMEOUT_MS = 20000;

// Orígenes permitidos a llamar este Worker. Añade aquí tu dominio de GitHub
// Pages si usas uno distinto, y quita localhost cuando ya no lo necesites.
const ALLOWED_ORIGINS = [
  "https://cordobapp.com",
  "https://www.cordobapp.com",
  "https://gogito1994-ai.github.io",
  "http://localhost:8765",
];

// Referencia compacta de lugares reales de la web, para que el asistente cite
// ids exactos (mecanismo PLACES:/ITINERARY:) y no invente precios ni enlaces.
const PLACES_REFERENCE = `
mezquita: Mezquita-Catedral de Córdoba (Monumento, imprescindible, de pago, entradas: https://tickets.mezquita-catedraldecordoba.es/)
alcazar: Alcázar de los Reyes Cristianos (Monumento, imprescindible, de pago, entradas: https://alcazardelosreyescristianos.cordoba.es/)
puente-romano: Puente Romano (Monumento, imprescindible, gratis)
juderia: Judería de Córdoba (Barrio histórico, imprescindible, gratis)
sinagoga: Sinagoga de Córdoba (Monumento, gratis para ciudadanos UE)
palacio-viana: Palacio de Viana (Museo, imprescindible, de pago, entradas: https://entradas.palaciodeviana.com/)
templo-romano: Templo Romano (Monumento, gratis, solo exterior)
calahorra: Torre de la Calahorra (Museo, de pago, entradas: https://www.torrecalahorra.es/horario-tarifas/)
corredera: Plaza de la Corredera (Plaza, gratis)
medina-azahara: Medina Azahara (Yacimiento arqueológico, imprescindible, gratis con reserva previa, info: https://www.museosdeandalucia.es/web/conjuntoarqueologicomadinatalzahra/)
molino-albolafia: Molino de la Albolafia (Monumento, gratis, solo exterior)
puerta-puente: Puerta del Puente (Monumento, de pago, mirador)
banos-califales: Baños del Alcázar Califal (Museo, de pago)
tendillas: Plaza de las Tendillas (Plaza, gratis)
casa-sefarad: Casa de Sefarad (Museo, de pago)
museo-arqueologico: Museo Arqueológico y Etnológico (Museo, gratis para ciudadanos UE)
san-lorenzo: Iglesia de San Lorenzo (Iglesia, gratis)
torre-malmuerta: Torre de la Malmuerta (Monumento, gratis, solo exterior)
caballerizas-reales: Caballerizas Reales (Monumento, de pago, entradas: https://caballerizasreales.com/)
`.trim();

const MARKER_INSTRUCTIONS = `
Tienes acceso a esta lista de lugares reales de la web (usa SIEMPRE estos identificadores exactos, nunca inventes otros):
${PLACES_REFERENCE}

Cuando tu respuesta mencione o recomiende uno o varios de estos lugares, añade al final, en una línea nueva, exactamente este formato (sin nada más en la línea, sin comillas):
PLACES: id1, id2

Si el usuario pide un plan, ruta o mini-itinerario, añade además otra línea nueva con este formato, con los ids en el orden sugerido:
ITINERARY: id1, id2, id3

Si no mencionas ningún lugar de la lista, omite ambas líneas por completo. Nunca escribas "PLACES:" ni "ITINERARY:" salvo con ese formato exacto al final del mensaje. No inventes precios ni horarios que no estén aquí: si no los sabes con certeza, remite a la ficha del lugar en la web o a su web oficial.
`.trim();

const SYSTEM_PROMPTS = {
  es: `Eres el asistente virtual de "Descubre Córdoba", una guía turística de Córdoba (España).

Reglas:
- Responde SIEMPRE en español.
- Sé breve, útil y amigable: como máximo 2-4 frases, salvo que el usuario pida explícitamente una lista o más detalle.
- Ayuda solo con temas de turismo, historia, gastronomía, rutas, eventos y transporte de Córdoba y su provincia.
- Si te preguntan algo sin relación con Córdoba o su turismo, redirige la conversación con amabilidad hacia cómo puedes ayudar con la visita a la ciudad.
- No inventes precios, horarios o datos concretos que no conozcas con certeza; en ese caso, sugiere consultar la web oficial del lugar en cuestión.
- No uses markdown ni encabezados, solo texto plano con saltos de línea si hace falta.

${MARKER_INSTRUCTIONS}`,

  en: `You are the virtual assistant for "Discover Córdoba", a tourist guide for Córdoba (Spain).

Rules:
- ALWAYS reply in English.
- Be brief, useful and friendly: at most 2-4 sentences, unless the user explicitly asks for a list or more detail.
- Only help with topics about tourism, history, food, routes, events and transport in Córdoba and its province.
- If asked about something unrelated to Córdoba or its tourism, kindly steer the conversation back to how you can help with visiting the city.
- Don't invent specific prices, hours or facts you're not sure about; instead, suggest checking the official website of that place.
- Don't use markdown or headings, just plain text with line breaks if needed.

${MARKER_INSTRUCTIONS}`,

  fr: `Tu es l'assistant virtuel de "Découvrez Cordoue", un guide touristique de Cordoue (Espagne).

Règles :
- Réponds TOUJOURS en français.
- Sois bref, utile et sympathique : 2-4 phrases maximum, sauf si l'utilisateur demande explicitement une liste ou plus de détails.
- Aide uniquement sur des sujets liés au tourisme, à l'histoire, à la gastronomie, aux itinéraires, aux événements et aux transports à Cordoue et sa province.
- Si on te pose une question sans rapport avec Cordoue ou son tourisme, réoriente gentiment la conversation vers la façon dont tu peux aider pour la visite de la ville.
- N'invente pas de prix, horaires ou faits précis dont tu n'es pas sûr ; suggère plutôt de consulter le site officiel du lieu concerné.
- N'utilise pas de markdown ni de titres, seulement du texte brut avec des retours à la ligne si nécessaire.

${MARKER_INSTRUCTIONS}`,
};

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders(origin) },
  });
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length <= MAX_MESSAGE_LENGTH
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));
}

function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value.slice(0, MAX_CONTEXT_FIELD_LENGTH).replace(/[\r\n]+/g, " ").trim();
}

function buildContextNote(body) {
  let note = "";
  const context = body.context;
  if (context && typeof context === "object") {
    const page = sanitizeText(context.page);
    const placeName = sanitizeText(context.placeName);
    if (page) note += `\n\nContexto de la sesión: el usuario está en la página "${page}" de la web.`;
    if (placeName) note += ` Está viendo la ficha de "${placeName}"; puedes asumir que pregunta sobre ese lugar si no especifica otro.`;
  }
  const location = body.location;
  if (
    location &&
    typeof location === "object" &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng) &&
    location.lat > 36 &&
    location.lat < 39 &&
    location.lng > -6 &&
    location.lng < -3
  ) {
    note += ` El usuario ha compartido su ubicación aproximada (latitud ${location.lat.toFixed(3)}, longitud ${location.lng.toFixed(3)}); puedes usarla para sugerir lugares cercanos si lo pide, pero no reveles las coordenadas exactas en tu respuesta.`;
  }
  return note;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method === "GET") {
      return json({ status: "ok", message: "Cordoba chat worker is running." }, 200, origin);
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return json(
        { error: "Server not configured: missing ANTHROPIC_API_KEY secret." },
        500,
        origin
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400, origin);
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    const lang = SYSTEM_PROMPTS[body.lang] ? body.lang : "es";

    if (!message) {
      return json({ error: "Missing message" }, 400, origin);
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return json({ error: "Message too long" }, 400, origin);
    }

    const history = sanitizeHistory(body.history);
    const messages = [...history, { role: "user", content: message }];
    const system = SYSTEM_PROMPTS[lang] + buildContextNote(body);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          messages,
          stream: true,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!anthropicRes.ok || !anthropicRes.body) {
        return json({ error: `Upstream error (${anthropicRes.status})` }, 502, origin);
      }

      return new Response(anthropicRes.body, {
        status: 200,
        headers: { "content-type": "text/event-stream", "cache-control": "no-cache", ...corsHeaders(origin) },
      });
    } catch (err) {
      clearTimeout(timeout);
      const timedOut = err?.name === "AbortError";
      return json(
        { error: timedOut ? "Upstream timeout" : "Unexpected error" },
        timedOut ? 504 : 500,
        origin
      );
    }
  },
};
