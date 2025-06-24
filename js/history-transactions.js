// history-transactions.js
function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const userId = window.authManager?.getCurrentUser()?.id || "guest";
    const userTransactions = storedTransactions.filter(t => t.userId === userId); // ✅

    const tbody = document.getElementById("transactionsTableBody");
    const noTransactions = document.getElementById("noTransactions");

    if (userTransactions.length === 0) {
        tbody.style.display = "none";
        noTransactions.style.display = "block";
    } else {
        noTransactions.style.display = "none";
        tbody.style.display = "table-row-group";
        tbody.innerHTML = userTransactions
            .map(transaction => `
                <tr>
                    <td>${transaction.id.slice(-8)}</td>
                    <td>${transaction.items.length} item(s)</td>
                    <td>$${transaction.total.toFixed(2)}</td>
                    <td>${transaction.status}</td>
                    <td>${new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-outline" onclick="showTransactionDetail('${transaction.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                </tr>
            `).join("");
    }
}


function showTransactionDetail(transactionId) {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const transaction = storedTransactions.find(t => t.id === transactionId);

    if (transaction) {
        const content = document.getElementById("transactionDetailContent");
        content.innerHTML = `
            <h3>Transaction #${transaction.id.slice(-8)}</h3>
            <p><strong>Date:</strong> ${new Date(transaction.date).toLocaleString()}</p>
            <p><strong>Total:</strong> $${transaction.total.toFixed(2)}</p>
            <p><strong>Status:</strong> ${transaction.status}</p>
            <h4>Shipping Information</h4>
            <p>${transaction.shippingInfo.firstName} ${transaction.shippingInfo.lastName}</p>
            <p>${transaction.shippingInfo.address}, ${transaction.shippingInfo.city}, ${transaction.shippingInfo.state} ${transaction.shippingInfo.zipCode}</p>
            <p>Email: ${transaction.shippingInfo.email}</p>
            <p>Phone: ${transaction.shippingInfo.phone}</p>
            <h4>Payment Information</h4>
            <p>Name on Card: ${transaction.paymentInfo.cardName}</p>
            <p>Card Number: ${transaction.paymentInfo.cardNumber}</p>
            <p>Expiry Date: ${transaction.paymentInfo.expiryDate}</p>
            <h4>Items</h4>
            <ul>
                ${transaction.items.map(item => `
                    <li>${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>
                `).join("")}
            </ul>
        `;
        document.getElementById("transactionDetailModal").style.display = "block";
    }
}

function closeTransactionModal() {
    document.getElementById("transactionDetailModal").style.display = "none";
}

// const dummyTransaction = {
//   id: Date.now().toString(),
//   items: [
//     { id: "dummy1", name: "Summer Dress", quantity: 1, price: 89.99, image: "/fallback-image.jpg" },
//     { id: "dummy2", name: "Casual Jeans", quantity: 2, price: 59.99, image: "/fallback-image.jpg" }
//   ],
//   total: 209.97,
//   shippingInfo: {
//     firstName: "Festi",
//     lastName: "A.",
//     email: "festi@example.com",
//     phone: "08123456789",
//     address: "Jl. Mawar 123",
//     city: "Jakarta",
//     state: "DKI Jakarta",
//     zipCode: "12345"
//   },
//   paymentInfo: {
//     cardName: "Festi A.",
//     cardNumber: "**** **** **** 1234",
//     expiryDate: "12/26"
//   },
//   status: "completed",
//   date: new Date().toISOString(),
//   userId: "guest"  // ubah jika kamu login sebagai user lain
// };

// const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
// transactions.push(dummyTransaction);
// localStorage.setItem("transactions", JSON.stringify(transactions));
// alert("Dummy transaction added!");



// Ekspor fungsi agar bisa digunakan di HTML
window.loadTransactions = loadTransactions;
window.showTransactionDetail = showTransactionDetail;
window.closeTransactionModal = closeTransactionModal;