const Favorites = {
  KEY: "cordoba-favoritos",

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },

  has(id) {
    return this.getAll().includes(id);
  },

  toggle(id) {
    const all = this.getAll();
    const idx = all.indexOf(id);
    if (idx >= 0) {
      all.splice(idx, 1);
    } else {
      all.push(id);
    }
    localStorage.setItem(this.KEY, JSON.stringify(all));
    return all.includes(id);
  },
};
