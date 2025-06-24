// cart.js
// Shopping Cart Management
class CartManager {
  constructor() {
    this.items = this.loadCart();
    console.log("Initializing CartManager, initial items:", this.items); // Debugging
if (this.items.length === 0) {
  console.log("Cart is empty.");
}

    this.updateCartCount();
    this.initializeBroadcast();
  }

  loadCart() {
    const cartData = localStorage.getItem("cart");
    console.log("Loading cart from localStorage:", cartData); // Debugging
    return cartData ? JSON.parse(cartData) : [];
  }

  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.items));
    console.log("Cart saved to localStorage:", this.items); // Debugging
    this.updateCartCount();
    this.broadcastUpdate();
  }

  addToCart(product, quantity = 1) {
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: product.size,
        color: product.color,
      });
    }

    this.saveCart();
    this.showAlert(`${product.name} added to cart!`, "success");
  }

  removeFromCart(productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  getItems() {
    return this.items;
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  updateCartCount() {
    const cartCountElements = document.querySelectorAll("#cartCount, .cart-count");
    const count = this.getItemCount();

    cartCountElements.forEach((element) => {
      element.textContent = count;
      element.style.display = count > 0 ? "flex" : "none";
    });
  }

  showAlert(message, type = "info") {
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
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert);
      }
    }, 3000);
  }

  // Inisialisasi Broadcast Channel
  initializeBroadcast() {
    this.bc = new BroadcastChannel("cart_updates");
    this.bc.onmessage = (event) => {
      if (event.data === "update") {
        this.items = this.loadCart();
        this.updateCartCount();
        if (document.getElementById("cartContent")) {
          loadCartPage(); // Panggil fungsi loadCartPage jika ada
        }
      }
    };
  }

  // Kirim pembaruan ke semua tab
  broadcastUpdate() {
    if (this.bc) {
      this.bc.postMessage("update");
    }
  }
}

function addToCart(item) {
  const cart = window.cartManager;
  cart.addItem(item);
  alert(`${item.name} added to cart`);
}


// Initialize cart manager
const cartManager = new CartManager();

// Global functions
window.addToCart = function (product, quantity = 1) {
  cartManager.addToCart(product, quantity);
};

window.removeFromCart = function (productId) {
  cartManager.removeFromCart(productId);
};

window.updateCartQuantity = function (productId, quantity) {
  cartManager.updateQuantity(productId, quantity);
};

window.cartManager = cartManager; // Ekspor cartManager ke global scope