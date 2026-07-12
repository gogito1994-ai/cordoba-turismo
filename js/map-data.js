/* Datos específicos del mapa interactivo: categorías, puntos nuevos y rutas a pie.
   Los campos "verificar: true" señalan coordenadas aproximadas que conviene
   comprobar sobre el terreno antes de darlas por definitivas. */

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
};

const MIRADORES = [
  {
    id: "balcon-guadalquivir",
    nombre: "Balcón del Guadalquivir",
    categoria: "Mirador",
    icono: "camera",
    lat: 37.8785,
    lng: -4.7822,
    descripcion:
      "Paseo elevado junto al río, con vistas al Guadalquivir, el Puente Romano y la Mezquita. Uno de los rincones favoritos de los cordobeses para ver el atardecer.",
    horario: "Abierto 24h",
    precio: "Gratis",
    verificar: true,
  },
  {
    id: "mirador-ermitas",
    nombre: "Mirador de las Ermitas (Balcón del Mundo)",
    categoria: "Mirador",
    icono: "camera",
    lat: 37.9391,
    lng: -4.8064,
    descripcion:
      "Mirador panorámico en la Sierra de Córdoba, junto al conjunto de las Ermitas, con vistas a toda la ciudad y la campiña. A unos 14 km del centro; mejor en coche.",
    horario: "El mirador exterior es de acceso libre; el conjunto de las Ermitas tiene horario propio",
    precio: "Gratis",
    verificar: true,
  },
  {
    id: "cuesta-reventon",
    nombre: "Cuesta del Reventón",
    categoria: "Mirador",
    icono: "camera",
    lat: 37.92,
    lng: -4.795,
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
    lat: 37.883,
    lng: -4.778,
    descripcion:
      "Consigna de maletas en pleno centro de Córdoba, a 15 min a pie de la estación. Taquillas seguras con vigilancia 24h. 20% de descuento con el código CORDOBAPP.",
    horario: "Consultar disponibilidad en la web",
    precio: "Desde ~5-6€ por maleta y día",
    web: "https://dcanlock.com/",
    verificar: true,
  },
  {
    id: "cordoba-locker-estacion",
    nombre: "Córdoba Locker (Estación)",
    categoria: "Consigna",
    icono: "suitcase",
    lat: 37.892,
    lng: -4.7985,
    descripcion: "Consigna de equipaje junto a la estación de tren, abierta 24h todos los días del año.",
    horario: "24h",
    precio: "Desde ~6€ por maleta y día",
    web: "https://cordobalocker.com/",
    verificar: true,
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
    id: "hub-gran-capitan",
    nombre: "Glorieta de Colón / Gran Capitán",
    categoria: "Transporte",
    icono: "bus",
    lat: 37.8858,
    lng: -4.7745,
    descripcion: "Importante nudo de líneas urbanas e interurbanas al final de la Avenida del Gran Capitán.",
    horario: "Según líneas",
    precio: "Billete sencillo aprox. 1,30€",
    verificar: true,
  },
  {
    id: "hub-estacion",
    nombre: "Estación de Autobuses de Córdoba",
    categoria: "Transporte",
    icono: "bus",
    lat: 37.8919,
    lng: -4.7995,
    descripcion: "Estación de autobuses interurbanos, junto a la estación de tren.",
    horario: "Según empresas",
    precio: "Varía según destino",
    verificar: true,
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
  };
  const list = collections[ref.collection];
  return list && list.find((item) => item.id === ref.id);
}
