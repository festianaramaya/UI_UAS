// product-page.js

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  setupFilters();
});

function loadProducts() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search") || "";
  const category = urlParams.get("category") || "all";
  const sort = urlParams.get("sort") || "name";

  // Populate category filter
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = window.productsManager.getCategories();
  categoryFilter.innerHTML = categories
    .map((cat) => `<option value="${cat}">${cat === "all" ? "All Categories" : cat}</option>`)
    .join("");

  // Set filter values
  document.getElementById("productSearch").value = searchQuery;
  document.getElementById("categoryFilter").value = category;
  document.getElementById("sortFilter").value = sort;

  displayProducts(searchQuery, category, sort);
}

function displayProducts(query = "", category = "all", sortBy = "name") {
  const container = document.getElementById("productsGrid");
  const noResults = document.getElementById("noResults");

  if (!container) return;

  const products = window.productsManager.searchProducts(query, category, sortBy);

  if (products.length === 0) {
    container.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  container.innerHTML = products
    .map((product) => {
      const encodedProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size || "M",
        color: product.color || "Default"
      };

      return `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="action-buttons product-actions">
              <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(encodedProduct).replace(/"/g, "&quot;")})'>
                Add to Cart
              </button>
              <a href="product-detail.html?id=${product.id}" class="btn btn-outline">View Details</a>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function setupFilters() {
  const searchInput = document.getElementById("productSearch");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  function updateProducts() {
    const query = searchInput.value;
    const category = categoryFilter.value;
    const sort = sortFilter.value;
    displayProducts(query, category, sort);
  }

  if (searchInput) {
    searchInput.addEventListener("input", updateProducts);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", updateProducts);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", updateProducts);
  }
}

// ✅ Single clean global function to handle Add to Cart
function addToCart(product) {
  const cart = window.cartManager;
  if (cart && typeof cart.addToCart === "function") {
    cart.addToCart(product, 1);
  } else {
    console.error("cartManager or addToCart not available");
  }
}
