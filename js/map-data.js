/* Datos específicos del mapa interactivo: categorías, puntos nuevos y rutas a pie.
   Coordenadas verificadas con la API de geocodificación de OpenStreetMap
   (Nominatim/Overpass) el 12/07/2026. Los campos "verificar: true" señalan
   ubicaciones sin coincidencia exacta en OSM (lugares informales o negocios
   no cartografiados): son la mejor aproximación disponible, pero conviene
   comprobarlas sobre el terreno antes de darlas por definitivas. */

const MAP_CATEGORIES = {
  Monumento: { icon: "landmark", color: "#bd4e2a" },
  "Barrio histórico": { icon: "map-pin", color: "#d99b46" },
  Museo: { icon: "building", color: "#2b4a5e" },
  Plaza: { icon: "map-pin", color: "#6e7b4a" },
  "Yacimiento arqueológico": { icon: "compass", color: "#8c3a22" },
  Iglesia: { icon: "landmark", color: "#7a5c8c" },
  Restaurante: { icon: "utensils", color: "#b83b5e" },
  Tapas: { icon: "wine", color: "#c9812f" },
  Mirador: { icon: "camera", color: "#1c8c8c" },
  Consigna: { icon: "suitcase", color: "#55565a" },
  Transporte: { icon: "bus", color: "#2e7d46" },
  Supermercado: { icon: "cart", color: "#3f7a3f" },
  Farmacia: { icon: "pharmacy", color: "#c0392b" },
};

const MIRADORES = [
  {
    id: "balcon-guadalquivir",
    nombre: "Balcón del Guadalquivir",
    categoria: "Mirador",
    icono: "camera",
    lat: 37.8759111,
    lng: -4.7676298,
    descripcion:
      "Parque-mirador junto al río, aguas abajo del centro histórico, con vistas abiertas al Guadalquivir. Uno de los rincones favoritos de los cordobeses para pasear al atardecer.",
    horario: "Abierto 24h",
    precio: "Gratis",
    verificar: false,
  },
  {
    id: "mirador-ermitas",
    nombre: "Mirador de las Ermitas (Balcón del Mundo)",
    categoria: "Mirador",
    icono: "camera",
    lat: 37.9167399,
    lng: -4.823816,
    descripcion:
      "Mirador panorámico en la Sierra de Córdoba, junto al conjunto de las Ermitas, con vistas a toda la ciudad y la campiña. A unos 9-10 km del centro; mejor en coche.",
    horario: "El mirador exterior es de acceso libre; el conjunto de las Ermitas tiene horario propio",
    precio: "Gratis",
    verificar: true,
  },
  {
    id: "cuesta-reventon",
    nombre: "Cuesta del Reventón",
    categoria: "Mirador",
    icono: "camera",
    lat: 37.908,
    lng: -4.814,
    descripcion:
      "Mirador informal en la carretera de subida a las Ermitas, muy popular entre los cordobeses para ver el atardecer sobre la ciudad.",
    horario: "Abierto 24h",
    precio: "Gratis",
    verificar: true,
  },
];

const CONSIGNAS = [
  {
    id: "dcanlock",
    nombre: "Dcanlock",
    categoria: "Consigna",
    icono: "suitcase",
    lat: 37.8851064,
    lng: -4.7769327,
    descripcion:
      "Consigna de maletas en Calle María Cristina, 3, en pleno centro de Córdoba, a 15 min a pie de la estación. Taquillas seguras con vigilancia 24h. 20% de descuento con el código CORDOBAPP.",
    horario: "Consultar disponibilidad en la web",
    precio: "Desde ~5-6€ por maleta y día",
    web: "https://dcanlock.com/",
  },
  {
    id: "cordoba-locker-estacion",
    nombre: "Córdoba Locker (Estación)",
    categoria: "Consigna",
    icono: "suitcase",
    lat: 37.8895489,
    lng: -4.7844384,
    descripcion: "Consigna de equipaje en Calle Fernando de Córdoba, cerca de la estación de tren, abierta 24h todos los días del año.",
    horario: "24h",
    precio: "Desde ~6€ por maleta y día",
    web: "https://cordobalocker.com/",
    verificar: false,
  },
];

const TRANSPORT_HUBS = [
  {
    id: "hub-tendillas",
    nombre: "Plaza de las Tendillas (parada)",
    categoria: "Transporte",
    icono: "bus",
    lat: 37.884491,
    lng: -4.779565,
    descripcion: "Una de las paradas con más líneas de Aucorsa en pleno centro de la ciudad.",
    horario: "Según líneas",
    precio: "Billete sencillo aprox. 1,30€",
    verificar: false,
  },
  {
    id: "hub-plaza-colon",
    nombre: "Plaza de Colón (Gran Capitán)",
    categoria: "Transporte",
    icono: "bus",
    lat: 37.8909922,
    lng: -4.7788653,
    descripcion: "Importante nudo de líneas urbanas e interurbanas al final de la Avenida del Gran Capitán.",
    horario: "Según líneas",
    precio: "Billete sencillo aprox. 1,30€",
    verificar: false,
  },
  {
    id: "hub-estacion-bus",
    nombre: "Estación de Autobuses de Córdoba",
    categoria: "Transporte",
    icono: "bus",
    lat: 37.889438,
    lng: -4.7902441,
    descripcion: "Estación de autobuses interurbanos, junto a la estación de tren.",
    horario: "Según empresas",
    precio: "Varía según destino",
    verificar: false,
  },
  {
    id: "hub-estacion-tren",
    nombre: "Estación de tren de Córdoba (Julio Anguita)",
    categoria: "Transporte",
    icono: "train",
    lat: 37.8885103,
    lng: -4.789516,
    descripcion: "Estación de alta velocidad, con AVE a Madrid (menos de 2h) y Sevilla (45 min).",
    horario: "Según horarios de Renfe",
    precio: "Varía según destino",
    verificar: false,
  },
];

const SUPERMERCADOS = [
  {
    id: "aldi-claudio-marcelo",
    nombre: "ALDI Claudio Marcelo",
    categoria: "Supermercado",
    icono: "cart",
    lat: 37.8844397,
    lng: -4.7785212,
    descripcion: "Supermercado en pleno centro, junto a la Plaza de las Tendillas.",
    horario: "Lun-Sáb 9:00-21:30",
    verificar: false,
  },
  {
    id: "carrefour-deanes",
    nombre: "Carrefour Express (Calle Deanes)",
    categoria: "Supermercado",
    icono: "cart",
    lat: 37.8800504,
    lng: -4.781081,
    descripcion: "Supermercado de conveniencia en plena Judería, a 2 min de la Mezquita.",
    horario: "Consultar horario en el establecimiento",
    verificar: false,
  },
  {
    id: "dia-sevilla",
    nombre: "Dia (Calle Sevilla)",
    categoria: "Supermercado",
    icono: "cart",
    lat: 37.8840501,
    lng: -4.7808373,
    descripcion: "Supermercado de barrio cerca de la Plaza de la Corredera.",
    horario: "Lun-Sáb 9:00-21:30",
    verificar: false,
  },
  {
    id: "dia-torres-cabrera",
    nombre: "Dia (Conde Torres Cabrera)",
    categoria: "Supermercado",
    icono: "cart",
    lat: 37.8889748,
    lng: -4.7781577,
    descripcion: "Supermercado cerca de la Plaza de las Tendillas.",
    horario: "Lun-Sáb 9:00-21:30",
    verificar: false,
  },
];

const FARMACIAS = [
  {
    id: "farmacia-el-globo",
    nombre: "Farmacia El Globo",
    categoria: "Farmacia",
    icono: "pharmacy",
    lat: 37.8853938,
    lng: -4.779014,
    descripcion: "Farmacia en la Plaza Mármol de Bañuelos, cerca de la Plaza de las Tendillas, con horario amplio.",
    horario: "Lun-Vie 7:30-23:30, Sáb-Dom 9:00-23:00",
    verificar: false,
  },
  {
    id: "farmacia-avenida-america",
    nombre: "Farmacia Av. América",
    categoria: "Farmacia",
    icono: "pharmacy",
    lat: 37.8910598,
    lng: -4.7813808,
    descripcion: "Farmacia con horario 24 horas, útil en caso de urgencia nocturna.",
    horario: "Abierta 24h",
    verificar: false,
  },
  {
    id: "farmacia-laguna",
    nombre: "Farmacia Laguna",
    categoria: "Farmacia",
    icono: "pharmacy",
    lat: 37.8827163,
    lng: -4.7845905,
    descripcion: "Farmacia cercana a la zona oeste de la Judería y el Alcázar.",
    horario: "Consultar horario en el establecimiento",
    verificar: false,
  },
];

const WALKING_ROUTES = [
  {
    id: "cordoba-un-dia",
    nombre: "Córdoba en un día",
    color: "#bd4e2a",
    duracion: "6-7 horas (con visitas incluidas)",
    paradas: [
      { collection: "places", id: "mezquita" },
      { collection: "places", id: "juderia" },
      { collection: "places", id: "sinagoga" },
      { collection: "places", id: "puente-romano" },
      { collection: "places", id: "calahorra" },
      { collection: "places", id: "alcazar" },
    ],
  },
  {
    id: "ruta-juderia",
    nombre: "Ruta de la Judería",
    color: "#d99b46",
    duracion: "1,5-2 horas",
    paradas: [
      { collection: "places", id: "mezquita" },
      { collection: "places", id: "juderia" },
      { collection: "places", id: "sinagoga" },
      { collection: "places", id: "casa-sefarad" },
      { collection: "places", id: "puerta-puente" },
    ],
  },
  {
    id: "cordoba-monumental",
    nombre: "Córdoba monumental",
    color: "#2b4a5e",
    duracion: "4-5 horas",
    paradas: [
      { collection: "places", id: "mezquita" },
      { collection: "places", id: "alcazar" },
      { collection: "places", id: "banos-califales" },
      { collection: "places", id: "puente-romano" },
      { collection: "places", id: "calahorra" },
      { collection: "places", id: "templo-romano" },
    ],
  },
  {
    id: "ruta-tabernas",
    nombre: "Ruta de las tabernas",
    color: "#6e7b4a",
    duracion: "2-3 horas (tapeo)",
    paradas: [
      { collection: "tapas", id: "bar-santos" },
      { collection: "tapas", id: "bodegas-mezquita-cespedes" },
      { collection: "tapas", id: "bodega-guzman" },
      { collection: "tapas", id: "casa-rubio" },
      { collection: "tapas", id: "sociedad-plateros" },
    ],
  },
];

function resolveMapPoint(ref) {
  const collections = {
    places: PLACES,
    restaurants: RESTAURANTS,
    tapas: TAPAS,
    miradores: MIRADORES,
    consignas: CONSIGNAS,
    transporte: TRANSPORT_HUBS,
    supermercados: SUPERMERCADOS,
    farmacias: FARMACIAS,
  };
  const list = collections[ref.collection];
  return list && list.find((item) => item.id === ref.id);
}
