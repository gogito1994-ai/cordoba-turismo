/**
 * Cloudflare Worker — proxy seguro entre la web de Córdoba y la API de Anthropic.
 *
 * La API key de Anthropic vive SOLO aquí, como secreto de Cloudflare
 * (env.ANTHROPIC_API_KEY), nunca en el código del navegador.
 *
 * Despliegue: ver README-chat-ia.md en la raíz del proyecto.
 */

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 350;
const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_MESSAGES = 8;
const REQUEST_TIMEOUT_MS = 15000;

// Orígenes permitidos a llamar este Worker. Añade aquí tu dominio de GitHub
// Pages si usas uno distinto, y quita localhost cuando ya no lo necesites.
const ALLOWED_ORIGINS = [
  "https://gogito1994-ai.github.io",
  "http://localhost:8765",
];

const SYSTEM_PROMPTS = {
  es: `Eres el asistente virtual de "Descubre Córdoba", una guía turística de Córdoba (España).

Reglas:
- Responde SIEMPRE en español.
- Sé breve, útil y amigable: como máximo 2-4 frases, salvo que el usuario pida explícitamente una lista o más detalle.
- Ayuda solo con temas de turismo, historia, gastronomía, rutas, eventos y transporte de Córdoba y su provincia.
- Si te preguntan algo sin relación con Córdoba o su turismo, redirige la conversación con amabilidad hacia cómo puedes ayudar con la visita a la ciudad.
- No inventes precios, horarios o datos concretos que no conozcas con certeza; en ese caso, sugiere consultar la web oficial del lugar en cuestión.
- No uses markdown ni encabezados, solo texto plano con saltos de línea si hace falta.`,

  en: `You are the virtual assistant for "Discover Córdoba", a tourist guide for Córdoba (Spain).

Rules:
- ALWAYS reply in English.
- Be brief, useful and friendly: at most 2-4 sentences, unless the user explicitly asks for a list or more detail.
- Only help with topics about tourism, history, food, routes, events and transport in Córdoba and its province.
- If asked about something unrelated to Córdoba or its tourism, kindly steer the conversation back to how you can help with visiting the city.
- Don't invent specific prices, hours or facts you're not sure about; instead, suggest checking the official website of that place.
- Don't use markdown or headings, just plain text with line breaks if needed.`,

  fr: `Tu es l'assistant virtuel de "Découvrez Cordoue", un guide touristique de Cordoue (Espagne).

Règles :
- Réponds TOUJOURS en français.
- Sois bref, utile et sympathique : 2-4 phrases maximum, sauf si l'utilisateur demande explicitement une liste ou plus de détails.
- Aide uniquement sur des sujets liés au tourisme, à l'histoire, à la gastronomie, aux itinéraires, aux événements et aux transports à Cordoue et sa province.
- Si on te pose une question sans rapport avec Cordoue ou son tourisme, réoriente gentiment la conversation vers la façon dont tu peux aider pour la visite de la ville.
- N'invente pas de prix, horaires ou faits précis dont tu n'es pas sûr ; suggère plutôt de consulter le site officiel du lieu concerné.
- N'utilise pas de markdown ni de titres, seulement du texte brut avec des retours à la ligne si nécessaire.`,
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
          system: SYSTEM_PROMPTS[lang],
          messages,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!anthropicRes.ok) {
        return json(
          { error: `Upstream error (${anthropicRes.status})` },
          502,
          origin
        );
      }

      const data = await anthropicRes.json();
      const reply = data?.content?.find((block) => block.type === "text")?.text;

      if (!reply) {
        return json({ error: "Empty response from model" }, 502, origin);
      }

      return json({ reply: reply.trim() }, 200, origin);
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
