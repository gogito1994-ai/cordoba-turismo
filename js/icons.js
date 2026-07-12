/* Sistema de iconos SVG en línea, estilo trazo fino (Heroicons/Lucide-like) */

const ICON_PATHS = {
  landmark:
    '<path d="M3 21h18"/><path d="M5 21V9.5L12 4l7 5.5V21"/><path d="M9 21v-6h6v6"/><path d="M9 12h.01M12 12h.01M15 12h.01"/>',
  "map-pin":
    '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  map: '<path d="M3 6.5 9 4l6 2.5 6-2.5v14L15 20.5 9 18l-6 2.5Z"/><path d="M9 4v14M15 6.5v14"/>',
  route:
    '<circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><path d="M8 18.5h6a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4H10a4 4 0 0 1-4-4v-1"/>',
  calendar:
    '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  utensils:
    '<path d="M7 3v7a2 2 0 0 0 2 2v9M7 3v7a2 0 0 1-2 2M11 3v7"/><path d="M17 3c-1.5 0-2.5 1.5-2.5 4v4h5v-4c0-2.5-1-4-2.5-4Zm0 8v10"/>',
  bus: '<rect x="3.5" y="5" width="17" height="12" rx="2.5"/><path d="M3.5 12h17M7 17v2M17 17v2"/><circle cx="7.5" cy="19.5" r="1.2"/><circle cx="16.5" cy="19.5" r="1.2"/>',
  bike: '<circle cx="6" cy="17" r="3.3"/><circle cx="18" cy="17" r="3.3"/><path d="m9 17 3-8h3l2.5 4M9 17h6l-3-8-2-3H7"/>',
  taxi: '<path d="M5 17V10l1.6-4.2A2 2 0 0 1 8.5 4.5h7a2 2 0 0 1 1.9 1.3L19 10v7"/><path d="M5 17h14M5 17v2M19 17v2"/><circle cx="8" cy="17" r="1.2"/><circle cx="16" cy="17" r="1.2"/>',
  train:
    '<rect x="5.5" y="4" width="13" height="13" rx="3"/><path d="M5.5 11h13M9 17l-2 3M15 17l2 3"/><circle cx="9" cy="7.5" r="0"/>',
  plane:
    '<path d="M12 2.5c.9 0 1.5.9 1.5 2.5v5l6.5 4v2l-6.5-1.8V19l2 1.7V22l-3.5-1-3.5 1v-1.3l2-1.7v-4.8L4 15.8v-2l6.5-4v-5c0-1.6.6-2.5 1.5-2.5Z"/>',
  parking:
    '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9.5 16V8h3a2.75 2.75 0 0 1 0 5.5h-3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/>',
  heart:
    '<path d="M12 20.5s-7.8-4.9-10-9.4C.4 7.6 2.3 4 6 4c2.1 0 3.6 1.1 4.5 2.4a5.4 5.4 0 0 1 3 0C14.4 5.1 15.9 4 18 4c3.7 0 5.6 3.6 4 7.1-2.2 4.5-10 9.4-10 9.4Z"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
  "external-link":
    '<path d="M9 6H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4"/><path d="M14 4h6v6M20 4 11 13"/>',
  ticket:
    '<path d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1.5a1.8 1.8 0 0 0 0 3.4V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.6a1.8 1.8 0 0 0 0-3.4Z"/><path d="M10 7.5v9"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  globe:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.4 4 5.3 4 8.5s-1.4 6.1-4 8.5c-2.6-2.4-4-5.3-4-8.5s1.4-6.1 4-8.5Z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  tag: '<path d="M11.5 4H6a2 2 0 0 0-2 2v5.5c0 .5.2 1 .6 1.4l8 8a2 2 0 0 0 2.8 0l5.5-5.5a2 2 0 0 0 0-2.8l-8-8A2 2 0 0 0 11.5 4Z"/><circle cx="8.2" cy="8.2" r="1.3"/>',
  star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8Z"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.7v.1"/>',
  wine: '<path d="M8 3h8l-1 8a3 3 0 0 1-3 2.5A3 3 0 0 1 9 11Z"/><path d="M12 13.5V20M8.5 20h7"/>',
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V10"/><path d="M10 20.5V15h4v5.5"/>',
  compass:
    '<circle cx="12" cy="12" r="8.5"/><path d="m14.8 9.2-1.7 4.3-4.3 1.7 1.7-4.3Z"/>',
  camera:
    '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5Z"/><circle cx="12" cy="13" r="3.3"/>',
  building:
    '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M8.5 7h1M14.5 7h1M8.5 11h1M14.5 11h1M8.5 15h1M14.5 15h1"/><path d="M10.5 20.5V17h3v3.5"/>',
  trophy:
    '<path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 5.5H4.5A2.5 2.5 0 0 0 5.8 10M17 5.5h2.5A2.5 2.5 0 0 1 18.2 10"/><path d="M12 14v3M9 20.5h6M10 20.5v-3.2h4v3.2"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  instagram:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4.2"/><path d="M17 6.7h.01"/>',
  facebook:
    '<path d="M14 21v-7.5h2.5l.5-3.3H14V8.1c0-1 .3-1.7 1.7-1.7H17V3.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.6H8v3.3h2.5V21Z"/>',
  twitter:
    '<path d="M21 5.3a8 8 0 0 1-2.3.6 4 4 0 0 0 1.8-2.2 8.2 8.2 0 0 1-2.5 1 4 4 0 0 0-6.9 3.6A11.3 11.3 0 0 1 3 4.6a4 4 0 0 0 1.2 5.3 4 4 0 0 1-1.8-.5v.1a4 4 0 0 0 3.2 3.9 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.9a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.3-6.1 11.3-11.3v-.5A8 8 0 0 0 21 5.3Z"/>',
  chat: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4.8 3.6a.5.5 0 0 1-.8-.4v-3.2A2.5 2.5 0 0 1 4 12.5Z"/>',
  send: '<path d="M20.5 3.5 3 10.2c-.7.3-.6 1.3.1 1.5l6.8 2 2 6.8c.2.7 1.2.8 1.5.1L20.5 3.5Z"/><path d="M10 13.5 20.5 3.5"/>',
  bot: '<rect x="4.5" y="9" width="15" height="11" rx="3"/><circle cx="9" cy="14.5" r="1.2"/><circle cx="15" cy="14.5" r="1.2"/><path d="M12 9V5.5M9.5 5.5h5"/>',
  suitcase:
    '<rect x="3.5" y="7.5" width="17" height="12.5" rx="2"/><path d="M9 7.5V5.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3.5 13h17M11 13v2"/>',
  cart: '<circle cx="9.5" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/><path d="M3 4h2.2l2.2 12.4a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L21 8.2H6.4"/>',
  pharmacy: '<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M12 8.2v7.6M8.2 12h7.6"/>',
};

function Icon(name, className) {
  const path = ICON_PATHS[name];
  if (!path) return "";
  const cls = className ? ` ${className}` : "";
  return `<svg class="icon${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
