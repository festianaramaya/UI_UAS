// product-detail.js

// Load product detail saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
  loadProductDetail();
});

// Ambil ID dari URL
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Ambil produk dari localStorage berdasarkan ID
function getProductById(id) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  return products.find((product) => product.id === id);
}

// Tampilkan detail produk ke HTML
function loadProductDetail() {
  const productId = getProductIdFromURL();
  const product = getProductById(productId);

  if (!product) {
    document.getElementById("productDetail").innerHTML = "<p>Product not found.</p>";
    return;
  }

  const stars = generateStars(product.rating || 0);

  document.getElementById("productDetail").innerHTML = `
    <div class="product-detail-grid">
      <div class="product-image-section">
        <img src="${product.image}" alt="${product.name}" class="product-detail-image">
      </div>

      <div class="product-info-section">
        <div class="product-badge">
          <span class="badge badge-primary">${product.category || "Uncategorized"}</span>
        </div>

        <h1 class="product-title">${product.name}</h1>

        <div class="product-rating">
          <div class="stars">${stars}</div>
          <span class="rating-text">${product.rating || 0} (${product.reviews || 0} reviews)</span>
        </div>

        <div class="product-price-large">$${product.price.toFixed(2)}</div>

        <div class="product-description">
          <p>${product.fullDescription || product.description || "No description available."}</p>
        </div>

        ${renderSizeOptions(product)}
        ${renderColorOptions(product)}

        <div class="product-options">
          <h3>Quantity</h3>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="changeQuantity(-1)"><i class="fas fa-minus"></i></button>
            <span class="quantity-display" id="quantity">1</span>
            <button class="quantity-btn" onclick="changeQuantity(1)"><i class="fas fa-plus"></i></button>
          </div>
        </div>

        <button onclick="addProductToCart()" class="btn btn-primary btn-lg w-100" id="addToCartBtn">
          Add to Cart - $${product.price.toFixed(2)}
        </button>
      </div>
    </div>
  `;

  setupProductOptions();
  updateAddToCartButton();
}

// Render size options
function renderSizeOptions(product) {
  if (!product.sizes || product.sizes.length === 0) return "";
  return `
    <div class="product-options">
      <h3>Size</h3>
      <div class="size-options" id="sizeOptions">
        ${product.sizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join("")}
      </div>
    </div>
  `;
}

// Render color options
function renderColorOptions(product) {
  if (!product.colors || product.colors.length === 0) return "";
  return `
    <div class="product-options">
      <h3>Color</h3>
      <div class="color-options" id="colorOptions">
        ${product.colors.map(color => `<button class="color-btn" data-color="${color}">${color}</button>`).join("")}
      </div>
    </div>
  `;
}

// Setup tombol size & color
function setupProductOptions() {
  const sizeButtons = document.querySelectorAll(".size-btn");
  sizeButtons.forEach(btn => btn.addEventListener("click", function () {
    sizeButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
  }));

  const colorButtons = document.querySelectorAll(".color-btn");
  colorButtons.forEach(btn => btn.addEventListener("click", function () {
    colorButtons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
  }));

  if (sizeButtons.length > 0) sizeButtons[0].classList.add("active");
  if (colorButtons.length > 0) colorButtons[0].classList.add("active");
}

// Rating bintang
function generateStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - Math.ceil(rating);

  return `${'<i class="fas fa-star"></i>'.repeat(full)}${half ? '<i class="fas fa-star-half-alt"></i>' : ''}${'<i class="far fa-star"></i>'.repeat(empty)}`;
}

let currentQuantity = 1;
function changeQuantity(change) {
  currentQuantity = Math.max(1, currentQuantity + change);
  document.getElementById("quantity").textContent = currentQuantity;
  updateAddToCartButton();
}

function updateAddToCartButton() {
  const productId = getProductIdFromURL();
  const product = getProductById(productId);
  if (product) {
    const total = (product.price * currentQuantity).toFixed(2);
    document.getElementById("addToCartBtn").textContent = `Add to Cart - $${total}`;
  }
}

function addProductToCart() {
  const productId = getProductIdFromURL();
  const product = getProductById(productId);
  if (!product) return;

  const selectedSize = document.querySelector(".size-btn.active")?.dataset.size;
  const selectedColor = document.querySelector(".color-btn.active")?.dataset.color;

  if ((product.sizes?.length && !selectedSize) || (product.colors?.length && !selectedColor)) {
    alert("Please select size and color.");
    return;
  }

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    size: selectedSize,
    color: selectedColor,
    quantity: currentQuantity,
  };

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(cartItem);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Product added to cart!");
}
