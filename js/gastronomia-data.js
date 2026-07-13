/*
 * Datos y ayudantes específicos de la página de gastronomía: glosario para
 * visitantes extranjeros, resolución de "dónde probarlo" y filtros prácticos.
 */

const GLOSSARY = [
  {
    id: "tapa",
    es: { termino: "Tapa", significado: "Pequeña porción de comida para acompañar una bebida. En Córdoba se suele pedir y pagar por separado, a diferencia de Granada, donde suele venir gratis con cada bebida." },
    en: { termino: "Tapa", significado: "A small dish meant to go with a drink. In Córdoba it's usually ordered and paid for separately, unlike Granada, where a free tapa often comes with every drink." },
    fr: { termino: "Tapa", significado: "Une petite portion à accompagner d'une boisson. À Cordoue, on la commande et la paie généralement à part, contrairement à Grenade, où elle est souvent offerte avec chaque boisson." },
    de: { termino: "Tapa", significado: "Eine kleine Portion Essen, die zu einem Getränk serviert wird. In Córdoba wird sie meist separat bestellt und bezahlt, anders als in Granada, wo sie oft kostenlos zu jedem Getränk dazukommt." },
  },
  {
    id: "media-racion",
    es: { termino: "Media ración", significado: "Media porción de un plato, más grande que una tapa pero más pequeña que una ración completa. Ideal para probar varias cosas entre dos personas." },
    en: { termino: "Media ración", significado: "A half portion of a dish, bigger than a tapa but smaller than a full ración. Great for trying several dishes between two people." },
    fr: { termino: "Media ración", significado: "Une demi-portion d'un plat, plus grande qu'une tapa mais plus petite qu'une ración complète. Idéale pour goûter plusieurs plats à deux." },
    de: { termino: "Media ración", significado: "Eine halbe Portion eines Gerichts, größer als eine Tapa, aber kleiner als eine ganze Ración. Ideal, um zu zweit mehrere Gerichte zu probieren." },
  },
  {
    id: "racion",
    es: { termino: "Ración", significado: "Porción completa de un plato, pensada para compartir en la mesa entre varios comensales, no para una sola persona." },
    en: { termino: "Ración", significado: "A full portion of a dish, meant to be shared at the table among several people rather than eaten by one person." },
    fr: { termino: "Ración", significado: "Une portion complète d'un plat, destinée à être partagée à table entre plusieurs personnes, pas par une seule." },
    de: { termino: "Ración", significado: "Eine vollständige Portion eines Gerichts, gedacht zum Teilen am Tisch unter mehreren Personen, nicht für eine einzelne Person." },
  },
  {
    id: "menu-del-dia",
    es: { termino: "Menú del día", significado: "Menú fijo de mediodía (entrante, plato principal, postre y bebida) a precio cerrado, disponible de lunes a viernes en la mayoría de restaurantes." },
    en: { termino: "Menú del día", significado: "A fixed weekday lunch menu (starter, main, dessert and a drink) for a set price, offered by most restaurants Monday to Friday." },
    fr: { termino: "Menú del día", significado: "Un menu fixe du midi (entrée, plat, dessert et boisson) à prix unique, proposé du lundi au vendredi dans la plupart des restaurants." },
    de: { termino: "Menú del día", significado: "Ein festes Mittagsmenü (Vorspeise, Hauptgericht, Dessert und Getränk) zu einem Festpreis, das die meisten Restaurants von Montag bis Freitag anbieten." },
  },
  {
    id: "sobremesa",
    es: { termino: "Sobremesa", significado: "La charla tranquila de después de comer, sentados a la mesa sin prisa por levantarse. Tan española como la comida misma." },
    en: { termino: "Sobremesa", significado: "The relaxed chat after a meal, staying at the table with no rush to leave. As Spanish a custom as the meal itself." },
    fr: { termino: "Sobremesa", significado: "Le moment de conversation détendue après le repas, sans se presser de quitter la table. Une coutume aussi espagnole que le repas lui-même." },
    de: { termino: "Sobremesa", significado: "Das entspannte Gespräch nach dem Essen, bei dem man ohne Eile am Tisch sitzen bleibt. Ein ebenso spanischer Brauch wie das Essen selbst." },
  },
  {
    id: "horarios",
    es: { termino: "Horario de comidas", significado: "En España se come más tarde que en el resto de Europa: la comida (almuerzo) suele ser de 14:00 a 16:00, y la cena de 21:00 a 23:00 o más tarde." },
    en: { termino: "Meal times", significado: "Spaniards eat later than most of Europe: lunch (comida) is usually 2-4pm, and dinner (cena) 9-11pm or later." },
    fr: { termino: "Horaires des repas", significado: "En Espagne, on mange plus tard que dans le reste de l'Europe : le déjeuner (comida) se prend vers 14h-16h, et le dîner (cena) à partir de 21h, parfois plus tard." },
    de: { termino: "Essenszeiten", significado: "In Spanien isst man später als im übrigen Europa: das Mittagessen (comida) findet meist zwischen 14 und 16 Uhr statt, das Abendessen (cena) zwischen 21 und 23 Uhr oder noch später." },
  },
  {
    id: "barra-mesa",
    es: { termino: "Barra vs. mesa", significado: "Tapear de pie en la barra suele ser más rápido y a veces más barato que sentarse en una mesa, donde algunos bares cobran un pequeño suplemento." },
    en: { termino: "Barra vs. mesa", significado: "Having tapas standing at the bar (barra) is usually faster and sometimes cheaper than sitting at a table (mesa), where some bars add a small surcharge." },
    fr: { termino: "Barra vs. mesa", significado: "Manger des tapas debout au comptoir (barra) est souvent plus rapide et parfois moins cher qu'à une table (mesa), où certains bars ajoutent un léger supplément." },
    de: { termino: "Barra vs. Mesa", significado: "Tapas im Stehen an der Theke (barra) zu essen ist meist schneller und manchmal günstiger, als sich an einen Tisch (mesa) zu setzen, wo manche Bars einen kleinen Aufpreis berechnen." },
  },
  {
    id: "fino",
    es: { termino: "Fino", significado: "Vino generoso, seco y ligero de la Denominación de Origen Montilla-Moriles, el acompañante clásico del tapeo cordobés." },
    en: { termino: "Fino", significado: "A dry, light fortified wine from the Montilla-Moriles designation of origin, the classic companion to tapas in Córdoba." },
    fr: { termino: "Fino", significado: "Un vin de liqueur sec et léger de l'appellation Montilla-Moriles, l'accompagnement classique des tapas à Cordoue." },
    de: { termino: "Fino", significado: "Ein trockener, leichter Likörwein der Herkunftsbezeichnung Montilla-Moriles, der klassische Begleiter beim Tapas-Essen in Córdoba." },
  },
];

function glossaryLang() {
  const lang = Lang.get();
  return GLOSSARY.map((entry) => entry[lang] || entry.es);
}

function resolveDondeProbar(refs) {
  if (!Array.isArray(refs)) return [];
  const collections = { restaurants: RESTAURANTS, tapas: TAPAS };
  return refs
    .map((ref) => {
      if (ref.collection) {
        const list = collections[ref.collection];
        const venue = list && list.find((v) => v.id === ref.id);
        if (!venue) return null;
        return { nombre: venue.nombre, zona: venue.direccion, precio: venue.precio, collection: ref.collection, id: ref.id };
      }
      return { nombre: ref.nombre, zona: ref.zona, precio: ref.precio || null };
    })
    .filter(Boolean);
}

const GASTRO_DAY_ORDER = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const GASTRO_DAY_ALIASES = { Mie: "Mié", Sab: "Sáb" };

function gastroNormalizeDay(d) {
  return GASTRO_DAY_ALIASES[d] || d;
}

function gastroOpenStatus(horario, now) {
  if (!horario) return "unknown";
  if (/24\s*h/i.test(horario)) return "open";

  const segments = horario.split(",");
  const currentDayName = GASTRO_DAY_ORDER[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let foundAnyDayPattern = false;
  let matchedToday = false;
  let openNow = false;

  segments.forEach((seg) => {
    const dayMatch = seg.match(
      /(Todos los días|Lun|Mar|Mié|Mie|Jue|Vie|Sáb|Sab|Dom)(?:-(Lun|Mar|Mié|Mie|Jue|Vie|Sáb|Sab|Dom))?/
    );
    if (!dayMatch) return;
    foundAnyDayPattern = true;

    let daysIncluded;
    if (/Todos los días/i.test(dayMatch[0])) {
      daysIncluded = GASTRO_DAY_ORDER;
    } else {
      const startDay = gastroNormalizeDay(dayMatch[1]);
      const endDay = dayMatch[2] ? gastroNormalizeDay(dayMatch[2]) : startDay;
      const startIdx = GASTRO_DAY_ORDER.indexOf(startDay);
      const endIdx = GASTRO_DAY_ORDER.indexOf(endDay);
      if (startIdx === -1 || endIdx === -1) return;
      daysIncluded = [];
      let i = startIdx;
      while (true) {
        daysIncluded.push(GASTRO_DAY_ORDER[i]);
        if (i === endIdx) break;
        i = (i + 1) % 7;
      }
    }

    if (!daysIncluded.includes(currentDayName)) return;
    matchedToday = true;

    const timeMatches = [...seg.matchAll(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g)];
    timeMatches.forEach((m) => {
      const startMin = parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
      const endMin = parseInt(m[3], 10) * 60 + parseInt(m[4], 10);
      if (currentMinutes >= startMin && currentMinutes <= endMin) openNow = true;
    });
  });

  if (!foundAnyDayPattern) return "unknown";
  if (!matchedToday) return "closed";
  return openNow ? "open" : "closed";
}

function matchesGastroFilters(venue, filters) {
  if (filters.vegetariano && !venue.vegetariano) return false;
  if (filters.conNinos && !venue.conNinos) return false;
  if (filters.terraza && !venue.terraza) return false;
  if (filters.cercaJuderia && !venue.cercaJuderia) return false;
  if (filters.abiertoAhora && gastroOpenStatus(venue.horario, new Date()) !== "open") return false;
  return true;
}

function buildTapasRouteMapUrl() {
  return "mapa.html?ruta=ruta-tabernas";
}

function buildTapasRoutePlannerUrl() {
  const route = WALKING_ROUTES.find((r) => r.id === "ruta-tabernas");
  if (!route) return null;
  const compact = {
    p: { days: "1", companions: "pareja", interests: ["gastronomia"], pace: "tranquilo", date: "" },
    d: [route.paradas.map((ref) => [ref.collection, "noche", ref.id])],
  };
  try {
    return `planificar.html#i=${btoa(unescape(encodeURIComponent(JSON.stringify(compact))))}`;
  } catch {
    return null;
  }
}
