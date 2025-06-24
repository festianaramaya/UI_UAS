// Products Data and Management
class ProductsManager {
  constructor() {
    this.products = this.loadProducts();
  }

  loadProducts() {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }

    // Default products
    const defaultProducts = [
      {
        id: "1",
        name: "Summer Dress",
        price: 89.99,
        image: "/fallback-image.jpg",
        category: "Dresses",
        description: "Beautiful summer dress perfect for warm weather",
        fullDescription: "This stunning summer dress is crafted from lightweight, breathable fabric...",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blue", "Red", "Green", "Black"],
        rating: 4.5,
        reviews: 128,
        stock: 25,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Casual Jeans",
        price: 59.99,
        image: "/fallback-image.jpg",
        category: "Jeans",
        description: "Comfortable casual jeans for everyday wear",
        fullDescription: "These premium denim jeans offer the perfect blend of comfort and style...",
        sizes: ["28", "30", "32", "34"],
        colors: ["Blue", "Black", "Gray"],
        rating: 4.2,
        reviews: 89,
        stock: 15,
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];

    this.saveProducts(defaultProducts);
    return defaultProducts;
  }

  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
    this.products = products;
  }

  getAllProducts() {
    return this.products.filter(p => p.status === "active");
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  getFeaturedProducts(limit = 4) {
    return this.products.filter(p => p.status === "active").slice(0, limit);
  }

  searchProducts(query, category = "all", sortBy = "name") {
    const filtered = this.products.filter((product) => {
      if (product.status !== "active") return false;
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }

  getCategories() {
    const categories = [...new Set(this.products.map((p) => p.category))];
    return ["all", ...categories.sort()];
  }

  addProduct(product) {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    this.products.push(newProduct);
    this.saveProducts(this.products);
    return newProduct;
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts(this.products);
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    this.products = this.products.filter((p) => p.id !== id);
    this.saveProducts(this.products);
  }
}

// Initialize products manager
window.productsManager = new ProductsManager();

