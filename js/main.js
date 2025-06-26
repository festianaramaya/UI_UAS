// Main JavaScript for homepage
document.addEventListener("DOMContentLoaded", () => {
  loadFeaturedProducts()
  loadFeaturedArticles()
  setupSearch()
})

// Gantilah produk ini jika kamu ingin ambil dari productsManager global yang sudah kamu buat di file lain
const productsManager = {
  getFeaturedProducts: () => [
    {
      id: "1",
      name: "Product 1",
      category: "Category 1",
      description: "Description of Product 1",
      price: 100,
      image: "./images/product1.jpg", // ✅ pakai gambar lokal
    },
    {
      id: "2",
      name: "Product 2",
      category: "Category 2",
      description: "Description of Product 2",
      price: 200,
      image: "./images/product2.jpg",
    },
    {
      id: "3",
      name: "Product 3",
      category: "Category 3",
      description: "Description of Product 3",
      price: 300,
      image: "./images/product3.jpg",
    },
  ]
}

function loadFeaturedProducts() {
  const container = document.getElementById("featuredProducts")
  if (!container) return

  const products = productsManager.getFeaturedProducts()

  container.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button onclick='addToCart(${JSON.stringify(product).replace(/"/g, "&quot;")})' class="btn btn-primary">
                        Add to Cart
                    </button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-outline">
                        View Details
                    </a>
                </div>
            </div>
        </div>
      `
    )
    .join("")
}

function loadFeaturedArticles() {
  const container = document.getElementById("featuredArticles")
  if (!container) return

  const articles = [
    {
      id: "1",
      title: "Summer Fashion Trends 2024",
      excerpt: "Discover the hottest fashion trends for this summer season...",
      image: "./images/article1.jpg", // ✅ ganti ke gambar lokal jika tersedia
      author: "Sarah Johnson",
      date: "2024-06-15",
      category: "Trends",
    },
    {
      id: "2",
      title: "How to Style Your Wardrobe",
      excerpt: "Learn professional tips on how to mix and match your clothes...",
      image: "./images/article2.jpg",
      author: "Mike Chen",
      date: "2024-06-10",
      category: "Style Guide",
    },
    {
      id: "3",
      title: "Sustainable Fashion Choices",
      excerpt: "Make environmentally conscious decisions in your fashion choices...",
      image: "./images/article3.jpg",
      author: "Emma Davis",
      date: "2024-06-05",
      category: "Sustainability",
    },
  ]

  container.innerHTML = articles
    .map(
      (article) => `
        <div class="article-card">
            <img src="${article.image}" alt="${article.title}" class="article-image">
            <div class="article-info">
                <div class="article-category">${article.category}</div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <div><i class="fas fa-user"></i> ${article.author}</div>
                    <div><i class="fas fa-calendar"></i> ${new Date(article.date).toLocaleDateString()}</div>
                </div>
                <a href="article-detail.html?id=${article.id}" class="btn btn-outline w-100">Read More</a>
            </div>
        </div>
      `
    )
    .join("")
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const query = this.value.trim()
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`
        }
      }
    })
  }
}

function addToCart(product) {
  console.log("Adding to cart:", product)
}
