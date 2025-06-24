// Admin Products Management

// Pastikan hanya admin yang bisa mengakses
document.addEventListener("DOMContentLoaded", () => {
  if (!authManager.isAdmin()) {
    window.location.href = "index.html";
    return;
  }
  loadProducts();
  setupFilters();
  setupForm();
});

let products = [];
let editingProductId = null;

function loadProducts() {
  const storedProducts = localStorage.getItem("products");
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    // Default products
    products = [
      {
        id: "1",
        name: "Summer Dress",
        category: "Dresses",
        price: 89.99,
        stock: 25,
        description: "Beautiful summer dress perfect for warm weather",
        fullDescription: "This stunning summer dress is crafted from lightweight, breathable fabric...",
        image: "/fallback-image.jpg",
        status: "active",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blue", "Red", "Green", "Black"],
        rating: 4.5,
        reviews: 128,
        createdAt: new Date().toISOString(),
      }
    ];
    saveProducts();
  }
  displayProducts();
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function saveProduct() {
  const formData = {
    name: document.getElementById("productName").value,
    category: document.getElementById("productCategory").value,
    price: parseFloat(document.getElementById("productPrice").value),
    stock: parseInt(document.getElementById("productStock").value),
    description: document.getElementById("productDescription").value,
    image: document.getElementById("imageData").value || "/fallback-image.jpg",
    status: document.getElementById("productStatus").value,
  };

  if (!formData.name || !formData.category || isNaN(formData.price) || isNaN(formData.stock)) {
    showAlert("Silakan isi semua field yang wajib!", "danger");
    return;
  }

  if (editingProductId) {
    const index = products.findIndex((p) => p.id === editingProductId);
    if (index !== -1) {
      products[index] = { ...products[index], ...formData };
      showAlert("Produk berhasil diperbarui!", "success");
    }
  } else {
    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    showAlert("Produk berhasil ditambahkan!", "success");
  }

  saveProducts();
  loadProducts();
  closeProductModal();
}

function displayProducts(filteredProducts = null) {
  const tbody = document.getElementById("productsTableBody");
  const productsToShow = filteredProducts || products;

  tbody.innerHTML = productsToShow.map(product => `
    <tr>
      <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.stock}</td>
      <td>
        <span class="badge ${product.status === "active" ? "badge-success" : "badge-secondary"}">
          ${product.status === "active" ? "Aktif" : "Tidak Aktif"}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-outline" onclick="editProduct('${product.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`).join("");
}

function setupFilters() {
  const searchInput = document.getElementById("searchProducts");
  const categoryFilter = document.getElementById("filterCategory");

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
}

function setupForm() {
  const form = document.getElementById("productForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveProduct();
  });
}

function showAddProductModal() {
  editingProductId = null;
  document.getElementById("modalTitle").textContent = "Tambah Produk";
  document.getElementById("productForm").reset();
  document.getElementById("imagePreview").src = "";
  document.getElementById("imageData").value = "";
  document.getElementById("productModal").classList.add("show");
}

function editProduct(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  editingProductId = id;
  document.getElementById("modalTitle").textContent = "Edit Produk";
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productDescription").value = product.description;
  document.getElementById("productStatus").value = product.status;
  document.getElementById("imageData").value = product.image;
  document.getElementById("imagePreview").src = product.image;
  document.getElementById("productModal").classList.add("show");
}

function deleteProduct(id) {
  if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
    products = products.filter(p => p.id !== id);
    saveProducts();
    loadProducts();
    showAlert("Produk berhasil dihapus!", "success");
  }
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("show");
  editingProductId = null;
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alert.style.position = "fixed";
  alert.style.top = "20px";
  alert.style.right = "20px";
  alert.style.zIndex = "9999";
  alert.style.minWidth = "300px";

  document.body.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

window.getProductById = function(id) {
  const storedProducts = localStorage.getItem("products");
  return storedProducts ? JSON.parse(storedProducts).find((product) => product.id === id) : null;
};

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64Image = e.target.result;
    document.getElementById("imagePreview").src = base64Image;
    document.getElementById("imageData").value = base64Image;
  };
  reader.readAsDataURL(file);
}

document.getElementById("imageInput").addEventListener("change", handleImageUpload);
