/*
 * Datos de la agenda de eventos: grandes citas fijas del calendario cordobés
 * (FIXED_EVENTS) y eventos puntuales (PUNCTUAL_EVENTS, conciertos, exposiciones...).
 *
 * Para añadir un evento puntual nuevo, añade un objeto al array PUNCTUAL_EVENTS
 * con este formato (no hace falta tocar nada más del código):
 * {
 *   id: "identificador-unico",
 *   nombre: "Nombre del evento",
 *   fecha: "2026-09-12",       // fecha ISO (o "2026-09-12/2026-09-20" para un rango)
 *   lugar: "Dónde se celebra",
 *   descripcion: "Una frase describiéndolo",
 *   enlace: "https://...",     // opcional
 * }
 */

const FIXED_EVENTS = [
  {
    id: "cruces-mayo",
    nombre: "Fiesta de las Cruces de Mayo",
    icono: "calendar",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/C%C3%B3rdoba%2C_Cruces_de_Mayo_1990_06.jpg/960px-C%C3%B3rdoba%2C_Cruces_de_Mayo_1990_06.jpg",
    meses: [4, 5],
    fechaTexto: "Últimos días de abril y primeros de mayo",
    queEs:
      "Cruces engalanadas con flores, mantones y objetos de plata compiten en patios y plazas de toda la ciudad. Cada cruz suele ir acompañada de una caseta con música en directo, baile y catavinos de vino fino.",
    consejos: [
      "Recorre varios barrios a la vez: San Basilio, San Lorenzo y la Judería suelen tener las cruces más cuidadas.",
      "Ve al atardecer, cuando las cruces se iluminan y el ambiente de caseta empieza a animarse.",
      "Es un buen aperitivo antes de los Patios: dura pocos días y marca el arranque de la temporada grande de mayo.",
    ],
    impacto:
      "Al ser el primero de los festejos de mayo, todavía no satura la ciudad como los Patios o la Feria, pero coincide con el inicio de la subida de precios de alojamiento del mes.",
  },
  {
    id: "patios-fest",
    nombre: "Festival de los Patios de Córdoba",
    icono: "camera",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Typical_interior_patio_with_flowers_at_the_Patio_Festival_in_C%C3%B3rdoba%2C_Andaluc%C3%ADa%2C_Spain.jpg/960px-Typical_interior_patio_with_flowers_at_the_Patio_Festival_in_C%C3%B3rdoba%2C_Andaluc%C3%ADa%2C_Spain.jpg",
    meses: [5],
    fechaTexto: "Primeras dos semanas de mayo (fechas exactas cada año en patios.cordoba.es)",
    queEs:
      "Los cordobeses abren las puertas de sus patios privados, engalanados con cientos de macetas de geranios, claveles y aljibes centenarios. Declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2012.",
    consejos: [
      "Ve a primera hora de la mañana o al atardecer: al mediodía las colas en los patios más famosos pueden superar la hora.",
      "Los barrios de San Basilio y Alcázar Viejo concentran los patios más premiados, pero los del Naranjo o Santa Marina tienen menos aglomeración.",
      "Lleva agua y sombrero: en mayo el sol de Córdoba ya aprieta y buena parte del recorrido es a pie y al aire libre.",
    ],
    impacto:
      "Es el pico turístico del año: los alojamientos del centro suelen subir entre un 30% y un 50% (picos puntuales de hasta el doble en la semana central) y las habitaciones se agotan con meses de antelación, así que conviene reservar cuanto antes si vienes en estas fechas.",
  },
  {
    id: "cata-vino",
    nombre: "Cata del Vino Fino Montilla-Moriles",
    icono: "wine",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Cordoba_-_Plaza_de_la_Corredera_-_01.jpg/960px-Cordoba_-_Plaza_de_la_Corredera_-_01.jpg",
    meses: [5],
    fechaTexto: "Un fin de semana de mayo, coincidiendo con la Feria",
    queEs:
      "Feria de vinos en la Plaza de la Corredera dedicada a los vinos finos de la Denominación de Origen Montilla-Moriles, con casetas de bodegas locales, catas guiadas y tapeo.",
    consejos: [
      "Combínalo con una visita a la propia Plaza de la Corredera, la única plaza mayor porticada de Andalucía.",
      "Pide el vino fino bien frío y acompañado de jamón o queso, el maridaje clásico cordobés.",
      "Si te ha gustado, Montilla y Lucena (a menos de una hora de Córdoba) se pueden visitar para conocer sus bodegas.",
    ],
    impacto:
      "Se solapa con la semana de la Feria, así que el centro y el recinto ferial están especialmente concurridos por las noches.",
  },
  {
    id: "feria-salud",
    nombre: "Feria de Nuestra Señora de la Salud",
    icono: "ticket",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Feria_de_Nuestra_Se%C3%B1ora_de_la_Salud_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg/960px-Feria_de_Nuestra_Se%C3%B1ora_de_la_Salud_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg",
    meses: [5, 6],
    fechaTexto: "Última semana de mayo (a veces se alarga a principios de junio)",
    queEs:
      "La gran feria anual de Córdoba: recinto ferial en El Arenal con casetas, atracciones y conciertos por la noche, y la tradicional \"feria de día\" con paseos a caballo y trajes de flamenca en el Paseo de la Victoria.",
    consejos: [
      "La feria de día (Paseo de la Victoria, por la mañana) es gratuita y más familiar que el recinto ferial de noche.",
      "Muchas casetas son privadas: para entrar sin invitación busca las municipales, abiertas a cualquier visitante.",
      "El tráfico y los autobuses cambian de recorrido esa semana: revisa transporte.html antes de moverte por la ciudad.",
    ],
    impacto:
      "Junto con los Patios, es la semana de mayor ocupación hotelera del año en Córdoba; el ambiente nocturno y el ruido en el centro también aumentan notablemente.",
  },
  {
    id: "noche-flamenco",
    nombre: "Noche Blanca del Flamenco",
    icono: "star",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Noche_Blanca_del_Flamenco_2008_%281%29.jpg/960px-Noche_Blanca_del_Flamenco_2008_%281%29.jpg",
    meses: [6],
    fechaTexto: "Mediados o finales de junio (un sábado, toda la noche)",
    queEs:
      "Una única noche con decenas de actuaciones de flamenco en directo y gratuitas repartidas por plazas y escenarios de todo el centro histórico, hasta la madrugada.",
    consejos: [
      "Consigue el programa con horarios y escenarios con antelación: hay demasiadas actuaciones simultáneas para verlas todas.",
      "Llega pronto a los escenarios más pequeños y céntricos, que se llenan antes que los grandes.",
      "Lleva calzado cómodo: es habitual moverse a pie entre varios escenarios durante toda la noche.",
    ],
    impacto:
      "Es una noche muy concurrida en el centro, aunque al ser un evento de un solo día no suele disparar los precios de alojamiento como Patios o Feria.",
  },
  {
    id: "festival-guitarra",
    nombre: "Festival Internacional de la Guitarra de Córdoba",
    icono: "calendar",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Josemi_Carmona.jpg/960px-Josemi_Carmona.jpg",
    meses: [7],
    fechaTexto: "Primeras dos semanas de julio",
    queEs:
      "Uno de los festivales de guitarra más veteranos del mundo (se celebra desde 1981), con conciertos de guitarra clásica, flamenca y rock en escenarios de toda la ciudad, además de cursos y talleres internacionales.",
    consejos: [
      "Revisa la programación gratuita en la calle además de los conciertos de pago: suele haber actuaciones abiertas en plazas del centro.",
      "En julio el calor aprieta de día; los conciertos son sobre todo nocturnos, así que aprovecha las mañanas para lo demás.",
      "Los cursos y masterclasses atraen a estudiantes de guitarra de todo el mundo, así que el ambiente musical se nota en toda la ciudad esas semanas.",
    ],
    impacto:
      "Aumenta la ocupación hotelera en pleno julio, aunque de forma más moderada que los festejos de mayo, ya que coincide con temporada alta de verano por el calor.",
  },
  {
    id: "concurso-flamenco",
    nombre: "Concurso Nacional de Arte Flamenco",
    icono: "trophy",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Bailaora_at_the_Plaza_de_Espa%C3%B1a_in_Seville.jpg/960px-Bailaora_at_the_Plaza_de_Espa%C3%B1a_in_Seville.jpg",
    meses: [],
    periodico: true,
    fechaTexto: "Sin periodicidad fija; la última edición se celebró en noviembre de 2025",
    queEs:
      "Uno de los certámenes de flamenco más prestigiosos del mundo, celebrado en Córdoba desde 1956 en el Gran Teatro. Consagra a nuevas figuras del cante, el baile y la guitarra flamenca.",
    consejos: [
      "No tiene fecha fija cada año: consulta la web del Gran Teatro de Córdoba para saber si coincide con tu visita.",
      "Las entradas para las finales se agotan con antelación entre aficionados al flamenco de toda España.",
      "Si no coincides con el concurso, los tablaos flamencos del centro ofrecen espectáculos en directo todo el año.",
    ],
    impacto:
      "Al no ser anual ni tener fecha fija, no tiene un efecto predecible en precios de alojamiento salvo en los días concretos de la final.",
  },
  {
    id: "semana-santa",
    nombre: "Semana Santa de Córdoba",
    icono: "calendar",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Marcher_in_the_Cordoba_Holy_Week_parade_%283317358193%29.jpg/960px-Marcher_in_the_Cordoba_Holy_Week_parade_%283317358193%29.jpg",
    meses: [3, 4],
    esSemanaSanta: true,
    fechaTexto: "Semana móvil de marzo o abril (depende del calendario litúrgico)",
    queEs:
      "Declarada Fiesta de Interés Turístico Nacional. Cofradías centenarias procesionan con sus pasos de Cristo y de la Virgen por las calles del centro histórico, de madrugada en muchos casos, acompañadas de bandas de música y el olor a incienso y azahar.",
    consejos: [
      "Consulta el recorrido oficial de cada cofradía: algunos pasos cruzan puntos emblemáticos como la Mezquita-Catedral o el Puente Romano.",
      "La Madrugá (noche del Jueves al Viernes Santo) concentra los pasos más solemnes y multitudinarios.",
      "Muchas calles del centro cortan el tráfico y cambian su recorrido habitual: revisa el mapa antes de moverte esos días.",
    ],
    impacto:
      "El centro histórico se llena de sillas y vallas para las procesiones; el alojamiento sube de precio y conviene reservar con antelación, aunque de forma más moderada que en mayo.",
  },
  {
    id: "navidad",
    nombre: "Navidad en Córdoba",
    icono: "star",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Plaza_Circular%2C_Murcia._Navidad_2018.jpg/960px-Plaza_Circular%2C_Murcia._Navidad_2018.jpg",
    meses: [12],
    fechaTexto: "Todo diciembre, hasta la Cabalgata de Reyes el 5 de enero",
    queEs:
      "La ciudad se ilumina con el alumbrado navideño del centro, se instala el Belén Municipal y las plazas acogen mercadillos y conciertos, hasta la Cabalgata de Reyes Magos la noche del 5 de enero.",
    consejos: [
      "El encendido del alumbrado suele ser a finales de noviembre o inicios de diciembre: es un buen momento para pasear de noche por el centro.",
      "El Belén Municipal y los de las cofradías e iglesias son gratuitos y están repartidos por el centro histórico.",
      "Diciembre es temporada baja para el turismo de sol, así que los precios de alojamiento suelen ser más asequibles que en mayo, salvo en Nochevieja.",
    ],
    impacto:
      "Es temporada baja frente a mayo o Semana Santa, con mejores precios de alojamiento en general, aunque el centro se anima especialmente los fines de semana y en Nochevieja.",
  },
];

const PUNCTUAL_EVENTS = [];

function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function getSemanaSantaRange(year) {
  const easter = easterSunday(year);
  const palmSunday = new Date(easter);
  palmSunday.setDate(easter.getDate() - 7);
  return { start: palmSunday, end: easter };
}

function isFixedEventActive(event, date) {
  if (event.esSemanaSanta) {
    const { start, end } = getSemanaSantaRange(date.getFullYear());
    return date >= start && date <= end;
  }
  if (event.periodico) return false;
  return event.meses.includes(date.getMonth() + 1);
}

function getActiveFixedEvents(date) {
  return FIXED_EVENTS.filter((ev) => isFixedEventActive(ev, date));
}

function getFixedEventsForMonth(monthNumber) {
  return FIXED_EVENTS.filter((ev) => !ev.periodico && ev.meses.includes(monthNumber));
}

function parsePunctualDate(fecha) {
  const [start] = fecha.split("/");
  return new Date(`${start}T00:00:00`);
}

function getUpcomingPunctualEvents(date, limit) {
  return PUNCTUAL_EVENTS.map((ev) => ({ ev, start: parsePunctualDate(ev.fecha) }))
    .filter(({ start }) => start >= new Date(date.getFullYear(), date.getMonth(), date.getDate()))
    .sort((a, b) => a.start - b.start)
    .slice(0, limit || PUNCTUAL_EVENTS.length)
    .map(({ ev }) => ev);
}

const SEASONS = {
  "semana-santa": {
    id: "semana-santa",
    labelKey: "season_semana_santa_label",
    bannerKey: "season_semana_santa_banner",
    ctaHref: "eventos.html#semana-santa",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Marcher_in_the_Cordoba_Holy_Week_parade_%283317358193%29.jpg/1920px-Marcher_in_the_Cordoba_Holy_Week_parade_%283317358193%29.jpg",
  },
  patios: {
    id: "patios",
    labelKey: "season_patios_label",
    bannerKey: "season_patios_banner",
    ctaHref: "eventos.html#patios-fest",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Typical_interior_patio_with_flowers_at_the_Patio_Festival_in_C%C3%B3rdoba%2C_Andaluc%C3%ADa%2C_Spain.jpg/1920px-Typical_interior_patio_with_flowers_at_the_Patio_Festival_in_C%C3%B3rdoba%2C_Andaluc%C3%ADa%2C_Spain.jpg",
  },
  feria: {
    id: "feria",
    labelKey: "season_feria_label",
    bannerKey: "season_feria_banner",
    ctaHref: "eventos.html#feria-salud",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Feria_de_Nuestra_Se%C3%B1ora_de_la_Salud_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg/1920px-Feria_de_Nuestra_Se%C3%B1ora_de_la_Salud_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg",
  },
  navidad: {
    id: "navidad",
    labelKey: "season_navidad_label",
    bannerKey: "season_navidad_banner",
    ctaHref: "eventos.html#navidad",
    heroImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Plaza_Circular%2C_Murcia._Navidad_2018.jpg/1920px-Plaza_Circular%2C_Murcia._Navidad_2018.jpg",
  },
};

function getCurrentSeason(date) {
  const { start, end } = getSemanaSantaRange(date.getFullYear());
  if (date >= start && date <= end) return SEASONS["semana-santa"];

  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 5 && day <= 17) return SEASONS.patios;
  if ((month === 5 && day >= 22) || (month === 6 && day <= 2)) return SEASONS.feria;
  if (month === 12) return SEASONS.navidad;
  return null;
}

/* ---------- bloque compartido "Este mes en Córdoba" (portada + agenda) ---------- */

function renderThisMonthBlock(container, opts) {
  if (!container) return;
  const compact = !!(opts && opts.compact);
  const now = new Date();
  const monthName = now.toLocaleDateString(localeForLang(), { month: "long" });
  const active = getActiveFixedEvents(now);
  const upcoming = getUpcomingPunctualEvents(now, compact ? 2 : 4);

  const fixedHtml = active
    .map(
      (ev) => `
        <a class="month-highlight-item" href="eventos.html#${ev.id}">
          <span class="month-highlight-icon">${Icon(ev.icono)}</span>
          <span>
            <strong>${tr(ev, "events", "nombre")}</strong>
            <small>${tr(ev, "events", "fechaTexto")}</small>
          </span>
        </a>`
    )
    .join("");

  const punctualHtml = upcoming
    .map(
      (ev) => `
        <a class="month-highlight-item" href="${ev.enlace || "eventos.html"}" ${ev.enlace ? 'target="_blank" rel="noopener noreferrer"' : ""}>
          <span class="month-highlight-icon">${Icon("calendar")}</span>
          <span>
            <strong>${ev.nombre}</strong>
            <small>${ev.lugar || ""}</small>
          </span>
        </a>`
    )
    .join("");

  const emptyHtml = `<p class="empty-state">${t("events_this_month_empty")}</p>`;

  container.innerHTML = `
    <div class="month-highlight-head">
      <h2 class="section-title">${t("events_this_month_title", { month: monthName })}</h2>
      ${compact ? `<a class="month-highlight-cta" href="eventos.html">${t("home_month_highlight_cta")}</a>` : ""}
    </div>
    <div class="month-highlight-items">
      ${fixedHtml}${punctualHtml}${!fixedHtml && !punctualHtml ? emptyHtml : ""}
    </div>
  `;
}
