document.addEventListener("DOMContentLoaded", () => {
  loadCheckoutPage();
  setupCheckoutForm();
});

function loadCheckoutPage() {
  const cartItems = cartManager.getItems();

  if (cartItems.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  displayOrderSummary(cartItems);
  prefillUserInfo();
}

function displayOrderSummary(items) {
  const container = document.getElementById("orderSummary");
  const subtotal = cartManager.getTotal();
  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  container.innerHTML = `
        <div class="order-items">
            ${items
              .map(
                (item) => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="order-item-info">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-details">Qty: ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `
              )
              .join("")}
        </div>
        
        <div class="order-totals">
            <div class="order-total-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="order-total-row">
                <span>Shipping</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <div class="order-total-row">
                <span>Tax</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="order-total-row final">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        </div>
        
        <button type="submit" form="checkoutForm" class="btn btn-primary btn-lg w-100" id="placeOrderBtn">
            Place Order - $${total.toFixed(2)}
        </button>
    `;
}

function prefillUserInfo() {
  const user = authManager?.getCurrentUser();
  if (user) {
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
      emailInput.value = user.email;
    }
  }
}

function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    processOrder();
  });
}

function processOrder() {
  const form = document.getElementById("checkoutForm");
  const formData = new FormData(form);
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = "Processing...";

  setTimeout(() => {
    const cartItems = cartManager.getItems();
    const subtotal = cartManager.getTotal();
    const shipping = 10.0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const transaction = {
      id: Date.now().toString(),
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        size: item.size || "-",
        color: item.color || "-"
      })),
      total: total,
      shippingInfo: {
        firstName: formData.get("firstName") || "-",
        lastName: formData.get("lastName") || "-",
        email: formData.get("email") || "-",
        phone: formData.get("phone") || "-",
        address: formData.get("address") || "-",
        city: formData.get("city") || "-",
        state: formData.get("state") || "-",
        zipCode: formData.get("zipCode") || "-"
      },
      paymentInfo: {
        cardName: formData.get("cardName") || "-",
        cardNumber: "**** **** **** " + (formData.get("cardNumber")?.slice(-4) || "****"),
        expiryDate: formData.get("expiryDate") || "-"
      },
      status: "completed",
      date: new Date().toISOString(),
      userId: authManager?.getCurrentUser()?.id || "guest"
    };

    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    cartManager.clearCart();

    alert("Order placed successfully! Thank you for your purchase.");
    window.location.href = "history-transactions.html";
  }, 2000);
}