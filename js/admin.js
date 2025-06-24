// Admin dashboard functionality
document.addEventListener("DOMContentLoaded", () => {
  // Declare authManager and productsManager variables
  const authManager = {
    isAdmin: () => {
      // Simulated admin check
      return true
    },
  }

  const productsManager = {
    getAllProducts: () => {
      // Simulated products retrieval
      return []
    },
  }

  // Check admin access
  if (!authManager.isAdmin()) {
    window.location.href = "index.html"
    return
  }

  loadDashboardStats()
})

function loadDashboardStats() {
  const container = document.getElementById("statsGrid")
  if (!container) return

  // Get data from localStorage
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]")
  const products = productsManager.getAllProducts()
  const articles = JSON.parse(localStorage.getItem("articles") || "[]")

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: "fas fa-box",
      color: "blue",
    },
    {
      title: "Total Articles",
      value: articles.length || 5, // Default articles
      icon: "fas fa-newspaper",
      color: "green",
    },
    {
      title: "Total Users",
      value: 150, // Simulated
      icon: "fas fa-users",
      color: "purple",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: "fas fa-shopping-cart",
      color: "orange",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: "fas fa-chart-line",
      color: "red",
    },
  ]

  container.innerHTML = stats
    .map(
      (stat) => `
        <div class="stat-card">
            <div class="stat-info">
                <h3>${stat.title}</h3>
                <div class="stat-value">${stat.value}</div>
            </div>
            <div class="stat-icon ${stat.color}">
                <i class="${stat.icon}"></i>
            </div>
        </div>
    `,
    )
    .join("")
}
