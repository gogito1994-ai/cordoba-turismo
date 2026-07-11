/* Datos turísticos de Córdoba, España */

const PLACES = [
  {
    id: "mezquita",
    nombre: "Mezquita-Catedral de Córdoba",
    categoria: "Monumento",
    icono: "landmark",
    lat: 37.8790,
    lng: -4.7794,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Mosque_Cordoba_edited.jpg/500px-Mosque_Cordoba_edited.jpg",
    descripcion:
      "Patrimonio de la Humanidad y símbolo máximo de Córdoba. Antigua mezquita omeya con un impresionante bosque de columnas y arcos bicolores, con una catedral renacentista en su interior.",
    horario: "Lun-Sáb 10:00-19:00, Dom 8:30-11:30 y 15:00-19:00",
    precio: "13€ (visita diurna), gratis 8:30-9:30 (excepto domingos)",
    ticketUrl: "https://tickets.mezquita-catedraldecordoba.es/",
  },
  {
    id: "alcazar",
    nombre: "Alcázar de los Reyes Cristianos",
    categoria: "Monumento",
    icono: "landmark",
    lat: 37.8763,
    lng: -4.7807,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Spain_Cordoba_quality_image.jpg/500px-Spain_Cordoba_quality_image.jpg",
    descripcion:
      "Fortaleza medieval que fue residencia de los Reyes Católicos. Destacan sus jardines andalusíes con estanques, y las murallas con vistas a la ciudad.",
    horario: "Mar-Dom 8:15-20:00 (verano), horarios reducidos en invierno",
    precio: "5€, gratis los martes tarde (según temporada)",
    ticketUrl: "https://alcazardelosreyescristianos.cordoba.es/",
  },
  {
    id: "puente-romano",
    nombre: "Puente Romano",
    categoria: "Monumento",
    icono: "landmark",
    lat: 37.8770,
    lng: -4.7791,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Puente_Romano_Cordoba.jpg/500px-Puente_Romano_Cordoba.jpg",
    descripcion:
      "Puente de origen romano (siglo I a.C.) sobre el río Guadalquivir, con vistas privilegiadas de la Mezquita y la Torre de la Calahorra. Uno de los rincones más fotografiados de la ciudad.",
    horario: "Abierto 24h (peatonal)",
    precio: "Gratis",
  },
  {
    id: "juderia",
    nombre: "Judería de Córdoba",
    categoria: "Barrio histórico",
    icono: "map-pin",
    lat: 37.8797,
    lng: -4.7815,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Cordoba%2C_Spain_%2811174916253%29.jpg/500px-Cordoba%2C_Spain_%2811174916253%29.jpg",
    descripcion:
      "Barrio medieval de calles estrechas y encaladas, patios floridos y plazoletas con encanto. Fue el antiguo barrio judío y hoy es Patrimonio de la Humanidad.",
    horario: "Abierto 24h",
    precio: "Gratis",
  },
  {
    id: "sinagoga",
    nombre: "Sinagoga de Córdoba",
    categoria: "Monumento",
    icono: "landmark",
    lat: 37.8802,
    lng: -4.7810,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Sinagoga_de_C%C3%B3rdoba_%28Espa%C3%B1a%29.jpg/500px-Sinagoga_de_C%C3%B3rdoba_%28Espa%C3%B1a%29.jpg",
    descripcion:
      "Una de las tres sinagogas medievales mejor conservadas de España, con decoración mudéjar de yeserías. Pequeña joya escondida en la Judería.",
    horario: "Mar-Dom 9:00-21:00",
    precio: "Gratis (ciudadanos UE), 0,30€ resto",
  },
  {
    id: "palacio-viana",
    nombre: "Palacio de Viana",
    categoria: "Museo",
    icono: "building",
    lat: 37.8862,
    lng: -4.7746,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Portada_del_Palacio_de_Viana%2C_C%C3%B3rdoba.jpg/500px-Portada_del_Palacio_de_Viana%2C_C%C3%B3rdoba.jpg",
    descripcion:
      "Palacio-museo con doce patios distintos, cada uno con su propio estilo y jardín. Uno de los mejores lugares para entender la tradición de los patios cordobeses.",
    horario: "Lun-Sáb 10:00-19:00, Dom 10:00-15:00",
    precio: "8€ (patios), 10€ (patios + casa)",
    ticketUrl: "https://entradas.palaciodeviana.com/",
  },
  {
    id: "templo-romano",
    nombre: "Templo Romano",
    categoria: "Monumento",
    icono: "landmark",
    lat: 37.8827,
    lng: -4.7793,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Templo_romano_C%C3%B3rdoba_2025.jpg/500px-Templo_romano_C%C3%B3rdoba_2025.jpg",
    descripcion:
      "Restos monumentales de un templo romano del siglo I, con columnas corintias reconstruidas, ubicado junto al Ayuntamiento.",
    horario: "Exterior visible 24h",
    precio: "Gratis",
  },
  {
    id: "calahorra",
    nombre: "Torre de la Calahorra",
    categoria: "Museo",
    icono: "building",
    lat: 37.8752,
    lng: -4.7783,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Torre_de_la_Calahorra_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg/500px-Torre_de_la_Calahorra_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29.jpg",
    descripcion:
      "Fortaleza árabe al otro lado del Puente Romano que alberga un museo sobre la convivencia de las tres culturas (musulmana, judía y cristiana) en la Córdoba medieval.",
    horario: "Todos los días 10:00-18:00 (varía según temporada)",
    precio: "4,50€",
    ticketUrl: "https://www.torrecalahorra.es/horario-tarifas/",
  },
  {
    id: "corredera",
    nombre: "Plaza de la Corredera",
    categoria: "Plaza",
    icono: "map-pin",
    lat: 37.8838,
    lng: -4.7756,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Plaza_de_la_Corredera_desde_el_aire_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29_%28cropped%29.jpg/500px-Plaza_de_la_Corredera_desde_el_aire_%28C%C3%B3rdoba%2C_Espa%C3%B1a%29_%28cropped%29.jpg",
    descripcion:
      "Gran plaza porticada de estilo castellano, poco habitual en Andalucía. Antiguo escenario de corridas de toros y hoy llena de bares y un mercado de abastos.",
    horario: "Abierto 24h",
    precio: "Gratis",
  },
  {
    id: "medina-azahara",
    nombre: "Medina Azahara",
    categoria: "Yacimiento arqueológico",
    icono: "compass",
    lat: 37.9046,
    lng: -4.8734,
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Puerta_del_primer_ministro.JPG/500px-Puerta_del_primer_ministro.JPG",
    descripcion:
      "Ciudad palatina califal del siglo X, a unos 8 km del centro. Patrimonio de la Humanidad. Sus ruinas monumentales muestran el esplendor del Califato de Córdoba.",
    horario: "Mar-Sáb 9:00-18:30, Dom 9:00-15:30 (varía según temporada)",
    precio: "Gratis (entrada con reserva previa), autobús turístico opcional",
    ticketUrl: "https://www.museosdeandalucia.es/web/conjuntoarqueologicomadinatalzahra/",
  },
];

const EVENTS = [
  {
    id: "patios-fest",
    nombre: "Festival de los Patios de Córdoba",
    icono: "calendar",
    fecha: "Primeras dos semanas de mayo",
    lugar: "Barrios de San Basilio, Alcázar Viejo y otros",
    descripcion:
      "Los cordobeses abren las puertas de sus patios engalanados con flores en macetas. Patrimonio Inmaterial de la Humanidad por la UNESCO.",
  },
  {
    id: "cruces-mayo",
    nombre: "Festival de las Cruces de Mayo",
    icono: "calendar",
    fecha: "Primeros días de mayo",
    lugar: "Plazas de toda la ciudad",
    descripcion:
      "Cruces engalanadas con flores compiten en distintos barrios, acompañadas de casetas con música y gastronomía típica.",
  },
  {
    id: "feria-salud",
    nombre: "Feria de Nuestra Señora de la Salud",
    icono: "calendar",
    fecha: "Finales de mayo",
    lugar: "Recinto ferial El Arenal",
    descripcion:
      "La gran feria anual de Córdoba, con casetas, atracciones, flamenco y la tradicional feria de día en el Paseo de la Victoria.",
  },
  {
    id: "noche-flamenco",
    nombre: "Noche Blanca del Flamenco",
    icono: "calendar",
    fecha: "Mediados de junio",
    lugar: "Plazas y escenarios de todo el centro histórico",
    descripcion:
      "Una noche entera dedicada al flamenco en directo y gratuito, con decenas de actuaciones repartidas por la ciudad.",
  },
  {
    id: "semana-santa",
    nombre: "Semana Santa de Córdoba",
    icono: "calendar",
    fecha: "Marzo o abril (variable)",
    lugar: "Casco histórico",
    descripcion:
      "Declarada de Interés Turístico Nacional, con procesiones de hermandades centenarias recorriendo las calles del centro.",
  },
  {
    id: "concurso-flamenco",
    nombre: "Concurso Nacional de Arte Flamenco",
    icono: "calendar",
    fecha: "Cada 3 años (próxima edición a confirmar)",
    lugar: "Gran Teatro de Córdoba",
    descripcion:
      "Uno de los certámenes de flamenco más prestigiosos del mundo, celebrado en Córdoba desde 1956.",
  },
];

const FOOD = [
  {
    id: "salmorejo",
    nombre: "Salmorejo cordobés",
    icono: "utensils",
    tipo: "Plato típico",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Salmorejo_cordobes.jpg",
    descripcion:
      "Crema fría de tomate, pan, ajo y aceite de oliva virgen extra, servida con huevo duro y jamón picado. El plato más emblemático de Córdoba.",
  },
  {
    id: "flamenquin",
    nombre: "Flamenquín",
    icono: "utensils",
    tipo: "Plato típico",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flamenqu%C3%ADn%2C_C%C3%B3rdoba%2C_2016.jpg/500px-Flamenqu%C3%ADn%2C_C%C3%B3rdoba%2C_2016.jpg",
    descripcion:
      "Rollo de lomo de cerdo envuelto en jamón serrano, empanado y frito. Se sirve normalmente con patatas fritas y alioli.",
  },
  {
    id: "rabo-toro",
    nombre: "Rabo de toro",
    icono: "utensils",
    tipo: "Plato típico",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Rabo_de_toro-Estofado_%2801%29.JPG/500px-Rabo_de_toro-Estofado_%2801%29.JPG",
    descripcion:
      "Guiso tradicional de rabo de toro estofado a fuego lento con vino, verduras y especias, hasta quedar tierno y meloso.",
  },
  {
    id: "berenjenas-miel",
    nombre: "Berenjenas con miel de caña",
    icono: "utensils",
    tipo: "Tapa",
    descripcion:
      "Berenjenas cortadas en tiras finas, fritas y bañadas en miel de caña. Una tapa dulce-salada muy popular en las tabernas.",
  },
  {
    id: "vino-montilla",
    nombre: "Vino Montilla-Moriles",
    icono: "wine",
    tipo: "Bebida",
    descripcion:
      "Vino con Denominación de Origen propia de la provincia, elaborado con uva Pedro Ximénez. Ideal para acompañar el tapeo.",
  },
  {
    id: "mazamorra",
    nombre: "Mazamorra cordobesa",
    icono: "utensils",
    tipo: "Plato típico",
    descripcion:
      "Crema fría a base de almendras, pan y ajo, un antecedente del salmorejo con raíces árabes, servida con uvas pasas o manzana.",
  },
];

const TRANSPORT = [
  {
    id: "aucorsa",
    nombre: "Autobús urbano (Aucorsa)",
    icono: "bus",
    descripcion:
      "Red de autobuses urbanos que conecta el centro histórico con el resto de la ciudad. Billete sencillo o tarjeta recargable Bus+.",
    info: "Tarifa sencilla aprox. 1,30€, bonos de varios viajes disponibles",
  },
  {
    id: "cordobici",
    nombre: "Bicicleta pública (Cordobici)",
    icono: "bike",
    descripcion:
      "Sistema de bicicletas compartidas con estaciones repartidas por la ciudad, ideal para moverse por el carril bici del centro.",
    info: "Registro necesario, primeros 30 min gratis según abono",
  },
  {
    id: "taxi",
    nombre: "Taxi",
    icono: "taxi",
    descripcion:
      "Paradas de taxi en puntos clave como la Mezquita, la estación de tren y la Plaza de las Tendillas. También disponibles por app.",
    info: "Tarifa mínima aprox. 4€, aeropuerto y polígonos con tarifa especial",
  },
  {
    id: "tren",
    nombre: "Tren (Estación de Córdoba)",
    icono: "train",
    descripcion:
      "Estación bien conectada por AVE con Madrid (menos de 2h) y Sevilla (45 min), además de servicios regionales por Andalucía.",
    info: "A 15-20 min a pie del centro histórico, o bus/taxi",
  },
  {
    id: "aeropuerto",
    nombre: "Aeropuerto",
    icono: "plane",
    descripcion:
      "Córdoba cuenta con aeropuerto propio pero con vuelos muy limitados. La opción habitual es volar a Sevilla (~140 km) y llegar en tren o autobús.",
    info: "Aeropuerto de Sevilla: aprox. 1h20 en coche o AVE/autobús",
  },
  {
    id: "parking",
    nombre: "Aparcamiento",
    icono: "parking",
    descripcion:
      "El centro histórico tiene acceso restringido a vehículos (zona ZBE). Se recomienda usar parkings públicos en el perímetro del casco antiguo.",
    info: "Parkings recomendados: San Basilio, Aparcamiento Norte, Vial Norte",
  },
];

const RESTAURANTS = [
  {
    id: "noor",
    nombre: "Noor",
    icono: "star",
    distincion: "3 Estrellas Michelin",
    tipo: "Alta cocina andalusí de autor",
    chef: "Paco Morales",
    direccion: "Calle Pablo Ruiz Picasso, 8",
    precio: "Menú degustación desde ~240€",
    web: "https://noorrestaurant.es/",
    carta: [
      "Menú Tanwer",
      "Menú Thawra",
      "Menú Taqadum",
      "Sésamo blanco Karim con caviar del desierto",
    ],
  },
  {
    id: "choco",
    nombre: "Choco",
    icono: "star",
    distincion: "1 Estrella Michelin",
    tipo: "Cocina andaluza de autor",
    chef: "Kisko García",
    direccion: "Calle Compositor Serrano Lucena, 14",
    precio: "Menú degustación de gama alta",
    web: "https://restaurantechoco.com/",
    carta: [
      "Menús degustación de temporada",
      "Cocina de raíces andaluzas con técnica actual",
      "Maridaje con vinos de la D.O. Montilla-Moriles",
    ],
  },
  {
    id: "el-churrasco",
    nombre: "El Churrasco",
    icono: "utensils",
    distincion: "Selección Guía Michelin",
    tipo: "Cocina cordobesa tradicional (parrilla)",
    direccion: "Calle Romero, 16 (Judería)",
    precio: "Medio-alto",
    web: "https://elchurrasco.com/",
    carta: [
      "Churrasco cordobés con salsas roja y verde",
      "Rabo de toro",
      "Gazpacho blanco con piñones",
      "Solomillo ibérico a la brasa",
    ],
  },
  {
    id: "bodegas-campos",
    nombre: "Bodegas Campos",
    icono: "utensils",
    distincion: "Taberna histórica desde 1908",
    tipo: "Cocina cordobesa tradicional",
    direccion: "Calle Lineros, 32",
    precio: "Medio-alto",
    web: "https://bodegascampos.com/",
    carta: [
      "Rabo de toro",
      "Ensalada molinera con bacalao y naranja",
      "Manitas rellenas de foie y jamón",
      "Leche frita con helado de canela",
    ],
  },
  {
    id: "taberna-salinas",
    nombre: "Taberna Salinas",
    icono: "utensils",
    distincion: "Taberna histórica desde 1924",
    tipo: "Cocina cordobesa tradicional",
    direccion: "Calle Tundidores, 3",
    precio: "Económico-medio",
    web: "http://www.tabernasalinas.com/",
    carta: [
      "Ajo blanco",
      "Flamenquín",
      "Rabo de toro estofado",
      "Berenjenas fritas con miel de caña",
    ],
  },
  {
    id: "casa-pepe-juderia",
    nombre: "Casa Pepe de la Judería",
    icono: "utensils",
    distincion: "Selección Guía Michelin, desde 1928",
    tipo: "Cocina cordobesa tradicional",
    direccion: "Calle Romero, 1 (Judería)",
    precio: "Medio",
    web: "https://restaurantecasapepedelajuderia.com/",
    carta: [
      "Salmorejo cordobés",
      "Flamenquín",
      "Rabo de toro",
      "Mazamorra",
      "Berenjenas con miel de caña",
    ],
  },
];

const TAPAS = [
  {
    id: "bodegas-mezquita-cespedes",
    nombre: "Bodegas Mezquita Céspedes",
    icono: "trophy",
    distincion: "Mejor restaurante del mundo 2025 (TripAdvisor Traveler's Choice)",
    tipo: "Bar de tapas andaluzas",
    direccion: "Calle Céspedes (Judería)",
    precio: "Económico-medio",
    web: "https://www.bodegasmezquita.com/",
    carta: [
      "Salmorejo cordobés",
      "Berenjenas califales al PX",
      "Rabo de toro a la cordobesa",
    ],
  },
  {
    id: "casa-rubio",
    nombre: "Casa Rubio",
    icono: "utensils",
    distincion: "Taberna histórica desde 1920",
    tipo: "Bar de tapas con terraza en azotea",
    direccion: "Puerta de Almodóvar (Judería)",
    precio: "Económico-medio",
    web: "https://restaurantecasarubiocordoba.com/",
    carta: [
      "Berenjenas fritas con miel de caña",
      "Rabo de toro con patatas",
      "Tapas de raíz sefardí",
    ],
  },
  {
    id: "sociedad-plateros",
    nombre: "Sociedad de Plateros (San Francisco)",
    icono: "utensils",
    distincion: "Taberna cordobesa desde 1874",
    tipo: "Taberna tradicional con patio",
    direccion: "Calle Romero Barros, 6",
    precio: "Económico",
    web: "https://tabernaplateros.com/",
    carta: ["Salmorejo", "Guisos caseros de cuchara", "Vinos de Montilla-Moriles"],
  },
  {
    id: "bar-santos",
    nombre: "Bar Santos",
    icono: "utensils",
    distincion: "Icónico desde 1966, junto a la Mezquita",
    tipo: "Bar de tapas de barra (solo efectivo)",
    direccion: "Calle Magistral González Francés, 3",
    precio: "Económico",
    web: "https://www.facebook.com/barsantosCordoba/",
    carta: ["Tortilla de patatas gigante", "Tapas frías de barra"],
  },
  {
    id: "bodega-guzman",
    nombre: "Bodega Guzmán",
    icono: "wine",
    distincion: "Bodega centenaria en la Judería",
    tipo: "Bodega de vinos a granel",
    direccion: "Calle Judíos, 7",
    precio: "Económico",
    carta: ["Vino Amargoso y Fino a granel", "Salmorejo", "Embutidos y tapas frías"],
  },
];
