// Admin Transactions Management
document.addEventListener("DOMContentLoaded", () => {
  if (!authManager.isAdmin()) {
    window.location.href = "index.html";
    return;
  }

  loadTransactions();
  setupFilters();
  setupStatusForm();
  updateStats();
});




function loadTransactions() {
let storedTransactions = localStorage.getItem("transactions");
transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
  displayTransactions();
}

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function displayTransactions(filteredTransactions = null) {
  const tbody = document.getElementById("transactionsTableBody");
  const transactionsToShow = filteredTransactions || transactions;

  tbody.innerHTML = transactionsToShow.map((transaction) => {
    const shipping = transaction.shippingInfo || {};
    return `
      <tr>
        <td><strong>${transaction.id}</strong></td>
        <td>
          <div>
            <strong>${(shipping.firstName || "Guest")} ${(shipping.lastName || "")}</strong><br>
            <small class="text-muted">${shipping.email || "No email"}</small>
          </div>
        </td>
        <td>
          <div style="max-width: 150px;">
            ${transaction.items.slice(0, 2).map((item) => `<small>${item.name} (${item.quantity}x)</small>`).join("<br>")}
            ${transaction.items.length > 2 ? `<br><small>+${transaction.items.length - 2} more...</small>` : ""}
          </div>
        </td>
        <td><strong>$${transaction.total.toFixed(2)}</strong></td>
        <td>
          <span class="badge ${getStatusBadgeClass(transaction.status)}">${transaction.status.toUpperCase()}</span>
        </td>
        <td>${new Date(transaction.date).toLocaleDateString()}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-sm btn-outline" onclick="viewTransaction('${transaction.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-primary" onclick="updateTransactionStatus('${transaction.id}')">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function getStatusBadgeClass(status) {
  switch (status) {
    case "completed": return "badge-success";
    case "pending": return "badge-warning";
    case "cancelled": return "badge-danger";
    case "refunded": return "badge-secondary";
    default: return "badge-secondary";
  }
}

function setupFilters() {
  const searchInput = document.getElementById("search");
  const statusFilter = document.getElementById("filterStatus");
  const dateFromFilter = document.getElementById("filterDateFrom");
  const dateToFilter = document.getElementById("filterDateTo");

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;
    const dateFrom = dateFromFilter.value;
    const dateTo = dateToFilter.value;

    const filtered = transactions.filter((transaction) => {
      const shipping = transaction.shippingInfo || {};

      const matchesSearch =
        transaction.id.toLowerCase().includes(searchTerm) ||
        (shipping.firstName || "").toLowerCase().includes(searchTerm) ||
        (shipping.lastName || "").toLowerCase().includes(searchTerm) ||
        (shipping.email || "").toLowerCase().includes(searchTerm);

      const transactionDate = new Date(transaction.date).toISOString().split("T")[0];
      const matchesDateFrom = !dateFrom || transactionDate >= dateFrom;
      const matchesDateTo = !dateTo || transactionDate <= dateTo;

      const matchesStatus = !selectedStatus || transaction.status === selectedStatus;

      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    displayTransactions(filtered);
    updateStats(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  dateFromFilter.addEventListener("change", applyFilters);
  dateToFilter.addEventListener("change", applyFilters);
}

function setupStatusForm() {
  const form = document.getElementById("statusForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateStatus();
  });
}

function updateStats(transactionsToCount = null) {
  const transactionsData = transactionsToCount || transactions;
  const totalTransactions = transactionsData.length;
  const totalRevenue = transactionsData.reduce((sum, t) => sum + t.total, 0);

  document.getElementById("totalTransactions").textContent = totalTransactions;
  document.getElementById("totalRevenue").textContent = `$${totalRevenue.toFixed(2)}`;
}

function viewTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  const shipping = transaction.shippingInfo || {
    firstName: "Guest",
    lastName: "",
    email: "unknown",
    phone: "-",
    address: "-",
    city: "-",
    state: "-",
    zipCode: "-"
  };

  const payment = transaction.paymentInfo || {
    cardNumber: "**** **** ****"
  };

  const detailHtml = `
    <div class="transaction-detail">
      <div class="detail-section">
        <h4>Informasi Transaksi</h4>
        <div class="detail-grid">
          <div class="detail-item"><label>ID Transaksi:</label><span>${transaction.id}</span></div>
          <div class="detail-item"><label>Status:</label>
            <span class="badge ${getStatusBadgeClass(transaction.status)}">${transaction.status.toUpperCase()}</span>
          </div>
          <div class="detail-item"><label>Tanggal:</label><span>${new Date(transaction.date).toLocaleString()}</span></div>
          <div class="detail-item"><label>Total:</label><span><strong>$${transaction.total.toFixed(2)}</strong></span></div>
        </div>
      </div>

      <div class="detail-section">
        <h4>Informasi Pengiriman</h4>
        <div class="detail-grid">
          <div class="detail-item"><label>Nama:</label><span>${shipping.firstName} ${shipping.lastName}</span></div>
          <div class="detail-item"><label>Email:</label><span>${shipping.email}</span></div>
          <div class="detail-item"><label>Alamat:</label><span>${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zipCode}</span></div>
          <div class="detail-item"><label>Telepon:</label><span>${shipping.phone}</span></div>
        </div>
      </div>

      <div class="detail-section">
        <h4>Items</h4>
        <div class="items-list">
          ${transaction.items.map(item => `
            <div class="item-row">
              <span class="item-name">${item.name}</span>
              <span class="item-qty">Qty: ${item.quantity}</span>
              <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="detail-section">
        <h4>Informasi Pembayaran</h4>
        <div class="detail-grid">
          <div class="detail-item"><label>Metode:</label><span>Credit Card</span></div>
          <div class="detail-item"><label>Kartu:</label><span>${payment.cardNumber}</span></div>
        </div>
      </div>
    </div>
  `;
  document.getElementById("transactionDetail").innerHTML = detailHtml;
  document.getElementById("transactionModal").classList.add("show");
}

function updateTransactionStatus(id) {
  currentTransactionId = id;
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  document.getElementById("transactionStatus").value = transaction.status;
  document.getElementById("statusModal").classList.add("show");
}

function updateStatus() {
  if (!currentTransactionId) return;

  const newStatus = document.getElementById("transactionStatus").value;
  const index = transactions.findIndex((t) => t.id === currentTransactionId);

  if (index !== -1) {
    transactions[index].status = newStatus;
    saveTransactions();
    displayTransactions();
    updateStats();
    closeStatusModal();
    showAlert("Status transaksi berhasil diperbarui!", "success");
  }
}

function closeTransactionModal() {
  document.getElementById("transactionModal").classList.remove("show");
}

function closeStatusModal() {
  document.getElementById("statusModal").classList.remove("show");
  currentTransactionId = null;
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
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert);
    }
  }, 3000);
}
