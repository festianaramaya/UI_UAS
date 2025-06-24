// Authentication Management
class AuthManager {
  constructor() {
    this.currentUser = this.loadUser()
    this.updateUI()
  }

  loadUser() {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  }

  saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUser = user
  }

  login(role) {
    const userData = {
      id: Date.now().toString(),
      name: role === "admin" ? "Admin User" : "Regular User",
      email: role === "admin" ? "admin@feastion.com" : "user@feastion.com",
      role: role,
    }

    this.saveUser(userData)
    this.updateUI()
    this.showAlert("Login successful!", "success")
  }

  logout() {
    localStorage.removeItem("user")
    this.currentUser = null
    this.updateUI()
    this.showAlert("Logged out successfully!", "info")

    // Redirect to home if on admin page
    if (window.location.pathname.includes("admin")) {
      window.location.href = "index.html"
    }
  }

  updateUI() {
    const loginSection = document.getElementById("loginSection")
    const userSection = document.getElementById("userSection")
    const adminLink = document.getElementById("adminLink")

    if (this.currentUser) {
      if (loginSection) loginSection.style.display = "none"
      if (userSection) userSection.style.display = "block"
      if (adminLink && this.currentUser.role === "admin") {
        adminLink.style.display = "block"
      }
    } else {
      if (loginSection) loginSection.style.display = "block"
      if (userSection) userSection.style.display = "none"
      if (adminLink) adminLink.style.display = "none"
    }

    // Check admin access
    this.checkAdminAccess()
  }

  checkAdminAccess() {
    const isAdminPage = window.location.pathname.includes("admin")
    if (isAdminPage && (!this.currentUser || this.currentUser.role !== "admin")) {
      window.location.href = "index.html"
    }
  }

  showAlert(message, type = "info") {
    // Create alert element
    const alert = document.createElement("div")
    alert.className = `alert alert-${type}`
    alert.textContent = message
    alert.style.position = "fixed"
    alert.style.top = "20px"
    alert.style.right = "20px"
    alert.style.zIndex = "9999"
    alert.style.minWidth = "300px"

    document.body.appendChild(alert)

    // Remove after 3 seconds
    setTimeout(() => {
      if (alert.parentNode) {
        alert.parentNode.removeChild(alert)
      }
    }, 3000)
  }

  getCurrentUser() {
    return this.currentUser
  }

  isLoggedIn() {
    return this.currentUser !== null
  }

  isAdmin() {
    return this.currentUser && this.currentUser.role === "admin"
  }
}

// Initialize auth manager
const authManager = new AuthManager()

function registerUser(name, email, password) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.find(u => u.email === email);
  if (exists) return authManager.showAlert("Email sudah terdaftar", "danger");

  const newUser = { id: Date.now().toString(), name, email, password, role: "user" };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  authManager.showAlert("Registrasi berhasil!", "success");
  setTimeout(() => window.location.href = "login.html", 1000);
}

function loginWithEmail(email, password) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return authManager.showAlert("Login gagal", "danger");

  authManager.saveUser(user);
  authManager.updateUI();
  authManager.showAlert("Login berhasil!", "success");
  setTimeout(() => window.location.href = "index.html", 1000);
}


// Global functions for login/logout
function login(role) {
  authManager.login(role)
}

function logout() {
  authManager.logout()
}

// User dropdown toggle
document.addEventListener("DOMContentLoaded", () => {
  const userBtn = document.getElementById("userBtn")
  const userDropdown = document.getElementById("userDropdown")

  if (userBtn && userDropdown) {
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      userDropdown.classList.toggle("show")
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      userDropdown.classList.remove("show")
    })

    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }
})
