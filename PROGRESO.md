# PROGRESO.md — Estado del proyecto Cordobapp

> Última actualización: 17 de julio de 2026.
> Web en producción: **https://cordobapp.com** (GitHub Pages, dominio propio).

## Qué es

Guía turística estática de Córdoba en 4 idiomas (**ES/EN/FR/DE**), usada
principalmente por los huéspedes de ~70 apartamentos turísticos del centro
(acceden vía QR en el apartamento) y por visitantes orgánicos desde Google.
HTML/CSS/JS puro, sin frameworks ni build; todo se publica con `git push` a
`main`.

## Arquitectura

| Pieza | Dónde | Notas |
|---|---|---|
| Páginas | `*.html` en la raíz + 19 fichas estáticas en `/lugares/` | Las fichas estáticas son las URLs canónicas; `lugar.html?id=` y `buscar.html` llevan `noindex` |
| Estilos | `css/styles.css` | Único archivo; paleta terracota `#bd4e2a`, modo oscuro, móvil-first |
| Contenido editorial | `js/data.js`, `js/map-data.js`, `js/events-data.js`, `js/gastronomia-data.js` | Lugares (19), restaurantes (11), tapas (13), platos (8), transporte, eventos, rutas, glosario |
| **Datos de negocio** | `data/partners.json`, `data/afiliados.json`, `data/extras.json` | **Se editan sin tocar código** (ver más abajo) |
| Configuración | `js/config.js` | WhatsApp de la gestora y endpoint de Formspree |
| Idiomas | `js/i18n-ui.js` (interfaz) + `js/i18n-data.js` (contenido) + `js/lang.js` | El idioma elegido persiste en localStorage |
| Chat IA | `worker/index.js` (Cloudflare Worker → API de Anthropic) | Streaming + tarjetas de lugares (marcadores `PLACES:`/`ITINERARY:`); despliegue manual del propietario (ver `README-chat-ia.md`) |
| PWA | `manifest.json` + `sw.js` (caché `cordoba-v2`) | Funciona offline tras la primera visita, incluidos los JSON de negocio |
| Analítica | Umami Cloud (región EU), script en las 30 páginas | Sin cookies ni banner; eventos personalizados vía `trackEvent()` |

## Hecho — roadmap original (Prompts 1–9)

1. **Fichas de lugares**: 19 monumentos con historia, horarios, precios, consejos de local, accesibilidad y mapa; investigación con datos reales.
2. **Mapa interactivo**: categorías (monumentos, restaurantes, tapas, miradores, consignas, supermercados, farmacias), rutas a pie, geolocalización, buscador con autocompletado, bottom sheet.
3. **Planificador**: quiz de 5 preguntas → itinerario por franjas con mini-mapas, alternativas por parada, compartir por URL/WhatsApp/PDF, avisos de temporada.
4. **Rediseño visual**: hero con arcos de herradura, patrón andalusí, modo oscuro, contraste AA.
5. **PWA**: manifest, service worker, banner de instalación, táctiles ≥44px, nav inferior móvil.
6. **Chat IA**: Worker de Cloudflare como proxy seguro (la API key nunca toca el navegador), streaming, contexto de página/ubicación, tarjetas de lugares y botón "abrir en el planificador", límites anti-abuso.
7. **Eventos vivos**: 9 grandes citas anuales + eventos puntuales mantenibles, calendario por meses, banner de temporada (Patios/Feria/Semana Santa/Navidad), "Este mes en Córdoba" en portada.
8. **Gastronomía**: fichas de platos con "dónde probarlo", tabernas históricas con año de fundación documentado, filtros prácticos, Ruta de la Tapa, glosario para visitantes.
9. **SEO + alemán**: metadatos únicos por página, JSON-LD (TouristAttraction, Event, Restaurant/BarOrPub, FAQPage), sitemap/robots, lazy-loading, alemán como 4º idioma completo.

## Hecho — mejoras posteriores

- Marca renombrada a **Cordobapp** en todo el sitio, manifest y Worker.
- Favicon propio (arco de herradura de la Mezquita, SVG + PNG).
- Sección "Ahora" eliminada; el consejo del día y el tiempo viven en la portada.
- Transporte con tarjetas desplegables; Aparcamiento incluye 4 parkings públicos reales del centro con dirección.
- Fotos reales (Wikimedia Commons, verificadas) de los 7 locales de gastronomía que las tienen con licencia libre; el resto sin foto a propósito.
- Buscador del mapa arreglado en móvil vertical (bug de flexbox) y mapa más protagonista.
- Navegación rápida por secciones en Gastronomía; tarjeta de Gastronomía en el hero.

## Hecho — versión 2: monetización + huésped (5 fases completas)

**Fase 1 — Analítica y datos**
- `trackEvent()` sobre Umami. Eventos activos: `qr_scan`, `partner_click`, `affiliate_click`, `codigo_copiado`, `extra_solicitado`, `whatsapp_click`, `citypass_interes`, `itinerario_generado`.
- **`bienvenida.html?apt=XX`** → URL para los QR físicos. Guarda el apartamento, registra `qr_scan` y ofrece accesos (itinerario, cenar cerca, WhatsApp prellenado).
- `data/partners.json` con 11 negocios investigados y geocodificados.

**Fase 2 — Partners y recomendados**
- Tarjeta de partner reutilizable: badge, código copiable, botón de acción, "Cómo llegar" a Google Maps.
- `recomendados.html` filtrable por categoría; bloques contextuales en gastronomía/eventos/lugares/transporte que se ocultan solos si no hay partners activos de esa categoría.
- Banner de Dcanlock de la portada migrado al JSON (partner `destacado`).
- Transparencia: línea de aviso junto a cada bloque + `aviso-legal.html` enlazada desde todos los footers.

**Fase 3 — Afiliación de actividades**
- `data/afiliados.json` con mapeo monumento→actividades (URLs reales verificadas en Civitatis).
- **ID de afiliado de Civitatis ACTIVO**: `ag_aid=83750&ag_cmp=Dcanturis` en todos los enlaces.
- Bloques "Reserva tu visita" en fichas y listado; "Reservar entrada →" en el planificador; "Experiencias en Córdoba" en eventos y gastronomía.

**Fase 4 — Servicios para huéspedes**
- `estancia.html` + `data/extras.json` (late check-out, early check-in, traslado AVE, cesta gourmet, consigna) con "Solicitar por WhatsApp" prellenado con extra + nº de apartamento.
- "Mi estancia" en menú y barra inferior + botón flotante de WhatsApp: **solo visibles para huéspedes** (con `apt` en localStorage).
- Córdoba Pass (preventa con captura de email vía Formspree): la sección de portada aparece sola al configurar el endpoint.

**Fase 5 — Experiencia y visuales**
- Barra inferior móvil con 5 iconos: Inicio, Lugares, Mapa, Planificar, Mi estancia/Gastronomía.
- Aviso "Hoy aprieta el calor" en portada si la máxima supera 38 °C → nueva `planes-calor.html`.
- **Arreglo importante**: el service worker llevaba roto desde la eliminación de "Ahora" (el modo offline no funcionaba); reparado con caché v2.
- "Mi lista" (favoritos) en el footer; breadcrumbs JSON-LD en fichas; LocalBusiness para partners; `srcset` con variantes de 320px de Wikimedia; pre-render estático de los 19 enlaces del listado de lugares.

## Cómo se gestiona el negocio (sin tocar código)

| Quiero… | Edito… |
|---|---|
| Activar/desactivar un partner, cambiar su código o descuento | `data/partners.json` → `"activo": true/false`, `codigo`, `descuento` |
| Cambiar precios o textos de los extras de la estancia | `data/extras.json` |
| Añadir/quitar actividades de afiliado o cambiar IDs | `data/afiliados.json` |
| Cambiar el número de WhatsApp o el formulario del Pass | `js/config.js` |
| Añadir un evento puntual (concierto, exposición) | `js/events-data.js` → array `PUNCTUAL_EVENTS` (instrucciones dentro) |

URL de los QR físicos: `https://cordobapp.com/bienvenida.html?apt=NUMERO`

## Pendiente (requiere datos o acción del propietario)

1. **Redesplegar el Worker de Cloudflare** (pendiente desde hace días): el código local ya tiene el alemán y el nombre "Cordobapp", pero hay que pegarlo en el dashboard → Edit code → Deploy. Ver `README-chat-ia.md`.
2. **Número de WhatsApp real** en `js/config.js` (ahora placeholder `34XXXXXXXXX` — los botones de WhatsApp no funcionan hasta entonces).
3. **Endpoint de Formspree** en `js/config.js` para que aparezca la sección del Córdoba Pass.
4. **partner_id de GetYourGuide** en `data/afiliados.json` (opcional; Civitatis ya está activo).
5. **Activar partners** cuando se firmen acuerdos (`"activo": true`) y resolver: dirección real de ArtenCórdoba y de Woow Córdoba (dos direcciones distintas en fuentes públicas), teléfono de El Rincón de Carmen, y confirmar que Elektrik y Rent a Bike son el mismo negocio (la investigación indica que sí; están fusionados en una ficha).
6. **Precios definitivos de los extras** en `data/extras.json` (varios en "Consultar").
7. **Redes sociales propias**: el footer enlaza a las cuentas oficiales de Turismo de Córdoba, no a cuentas de la marca.
8. **Lighthouse móvil ≥ 90**: pendiente de verificar por el propietario (Chrome → F12 → Lighthouse) en portada y una ficha.
9. **Fotos de los otros 17 locales de gastronomía**: no existen con licencia libre; se añadirán si el propietario consigue fotos propias o autorizadas.
10. **Dato a confirmar**: el horario de la Sinagoga difiere entre el texto español (9:00-21:00) y el inglés/francés (9:00-15:00); confirmar el real y unificar.

## Decisiones técnicas documentadas

- **Sin hreflang**: el cambio de idioma es en cliente sobre las mismas URLs; hreflang exige URLs distintas por idioma y añadirlo sería contraproducente.
- **Sin WebP autoalojado**: las imágenes se sirven desde Wikimedia (que ya genera miniaturas optimizadas por ancho); se usa `srcset` con sus variantes en lugar de descargar/convertir, al no existir pipeline de build ni herramientas de conversión.
- **Enlaces de Civitatis siempre en `/es/`**: son las URLs verificadas; Civitatis ofrece el cambio de idioma al visitante. No se inventaron slugs por idioma.
- **Los enlaces de afiliado sin ID configurado se generan limpios** (sin parámetro): funcionan igual para el usuario, solo que sin comisión.
