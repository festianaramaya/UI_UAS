// products-manager.js
window.productsManager = {
  getCategories() {
    const all = window.products || [];
    const categories = [...new Set(all.map(p => p.category))];
    return ["all", ...categories];
  },

  searchProducts(query, category, sortBy) {
    let result = [...(window.products || [])];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      result = result.filter(p => p.category === category);
    }

    switch (sortBy) {
      case "priceLowHigh":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }
};
