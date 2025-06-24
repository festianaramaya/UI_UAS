// Articles page functionality
document.addEventListener("DOMContentLoaded", () => {
  loadArticles();
  setupFilters();
});

// Load articles from localStorage or use default data if empty
function getArticlesData() {
  const storedArticles = localStorage.getItem("articles");
  if (storedArticles) {
    return JSON.parse(storedArticles);
  }
  // Default articles if localStorage is empty
  const defaultArticles = [
    {
      id: "1",
      title: "Summer Fashion Trends 2024",
      excerpt: "Discover the hottest fashion trends for this summer season...",
      content: `
        <p>Summer is here, and with it comes a fresh wave of fashion trends that are set to dominate the season. From vibrant colors to sustainable fabrics, this year's summer fashion is all about making a statement while staying comfortable in the heat.</p>
        <h2>Bright and Bold Colors</h2>
        <p>This summer, fashion is embracing bold, vibrant colors that reflect the energy and optimism of the season. Think electric blues, sunny yellows, and coral pinks.</p>
        <h2>Sustainable Fashion</h2>
        <p>Sustainability continues to be a major trend in fashion, with more brands focusing on eco-friendly materials and ethical production practices.</p>
      `,
      image: "/placeholder.svg?height=200&width=400",
      author: "Sarah Johnson",
      date: "2024-06-15",
      category: "Trends",
      readTime: 5,
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "How to Style Your Wardrobe",
      excerpt: "Learn professional tips on how to mix and match your clothes...",
      content: `
        <p>Creating a versatile wardrobe that works for every occasion doesn't have to be complicated. With the right approach, you can mix and match pieces to create countless stylish outfits.</p>
        <h2>Start with Basics</h2>
        <p>Build your wardrobe foundation with quality basics in neutral colors that can be easily mixed and matched.</p>
        <h2>Add Statement Pieces</h2>
        <p>Incorporate a few statement pieces that reflect your personal style and can transform basic outfits.</p>
      `,
      image: "/placeholder.svg?height=200&width=400",
      author: "Mike Chen",
      date: "2024-06-10",
      category: "Style Guide",
      readTime: 7,
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Sustainable Fashion Choices",
      excerpt: "Make environmentally conscious decisions in your fashion choices...",
      content: `
        <p>The fashion industry is one of the world's largest polluters, but consumers are increasingly demanding more sustainable options. Here's how you can make more eco-friendly fashion choices.</p>
        <h2>Choose Quality Over Quantity</h2>
        <p>Invest in well-made pieces that will last longer rather than buying cheap, disposable fashion.</p>
        <h2>Support Sustainable Brands</h2>
        <p>Research brands that prioritize environmental responsibility and ethical manufacturing practices.</p>
      `,
      image: "/placeholder.svg?height=200&width=400",
      author: "Emma Davis",
      date: "2024-06-05",
      category: "Sustainability",
      readTime: 6,
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Winter Collection Preview",
      excerpt: "Get a sneak peek at the upcoming winter fashion collection...",
      content: `
        <p>As we transition into the colder months, it's time to preview what's coming in winter fashion. This season promises to bring comfort and style together in exciting new ways.</p>
        <h2>Cozy Textures</h2>
        <p>Expect to see lots of soft, cozy textures like cashmere, wool, and faux fur that provide both warmth and luxury.</p>
        <h2>Rich Colors</h2>
        <p>Deep, rich colors like burgundy, forest green, and navy blue will dominate the winter palette.</p>
      `,
      image: "/placeholder.svg?height=200&width=400",
      author: "Alex Rivera",
      date: "2024-05-28",
      category: "Collections",
      readTime: 4,
      status: "published",
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      title: "Fashion Photography Tips",
      excerpt: "Learn how to capture stunning fashion photographs...",
      content: `
        <p>Fashion photography is an art form that combines technical skill with creative vision. Whether you're a beginner or looking to improve your skills, these tips will help you capture stunning fashion images.</p>
        <h2>Lighting is Everything</h2>
        <p>Good lighting can make or break a fashion photograph. Learn to work with natural light and understand how to use artificial lighting effectively.</p>
        <h2>Focus on Details</h2>
        <p>Fashion is all about the details - textures, patterns, and accessories that make an outfit unique.</p>
      `,
      image: "/placeholder.svg?height=200&width=400",
      author: "Lisa Wong",
      date: "2024-05-20",
      category: "Photography",
      readTime: 8,
      status: "published",
      createdAt: new Date().toISOString(),
    },
  ];
  // Simpan default articles ke localStorage jika kosong
  localStorage.setItem("articles", JSON.stringify(defaultArticles));
  return defaultArticles;
}

function loadArticles() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search") || "";
  const category = urlParams.get("category") || "all";

  // Set filter values
  const searchInput = document.getElementById("articleSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  if (searchInput) searchInput.value = searchQuery;
  if (categoryFilter) categoryFilter.value = category;

  displayArticles(searchQuery, category);
}

function displayArticles(query = "", category = "all") {
  const container = document.getElementById("articlesGrid");
  const noResults = document.getElementById("noResults");

  if (!container) return;

  const articlesData = getArticlesData();
  const filtered = articlesData.filter((article) => {
    // Hanya tampilkan artikel dengan status "published"
    if (article.status !== "published") return false;
    const matchesQuery =
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || article.category === category;
    return matchesQuery && matchesCategory;
  });

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filtered.length === 0) {
    container.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  container.innerHTML = filtered
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
    `,
    )
    .join("");
}

function setupFilters() {
  const searchInput = document.getElementById("articleSearch");
  const categoryFilter = document.getElementById("categoryFilter");

  function updateArticles() {
    const query = searchInput ? searchInput.value : "";
    const category = categoryFilter ? categoryFilter.value : "all";
    displayArticles(query, category);
  }

  if (searchInput) {
    searchInput.addEventListener("input", updateArticles);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", updateArticles);
  }
}

// Function to get article by ID (used by article detail page)
function getArticleById(id) {
  const articlesData = getArticlesData();
  return articlesData.find((article) => article.id === id);
}

// Make function available globally
window.getArticleById = getArticleById;