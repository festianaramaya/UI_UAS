// Admin Users Management
const authManager = {
  isAdmin: () => true, // Placeholder for actual implementation
}

document.addEventListener("DOMContentLoaded", () => {
  if (!authManager.isAdmin()) {
    window.location.href = "index.html"
    return
  }

  loadUsers()
  setupFilters()
  setupForm()
})

let users = []
let editingUserId = null

function loadUsers() {
  const storedUsers = localStorage.getItem("admin_users")
  if (storedUsers) {
    users = JSON.parse(storedUsers)
  } else {
    // Default users
    users = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@feastion.com",
        role: "admin",
        status: "active",
        phone: "+62 812-3456-7890",
        address: "Jakarta, Indonesia",
        registeredAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
      {
        id: "2",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        status: "active",
        phone: "+62 813-4567-8901",
        address: "Bandung, Indonesia",
        registeredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "user",
        status: "active",
        phone: "+62 814-5678-9012",
        address: "Surabaya, Indonesia",
        registeredAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    saveUsers()
  }
  displayUsers()
}

function saveUsers() {
  localStorage.setItem("admin_users", JSON.stringify(users))
}

function displayUsers(filteredUsers = null) {
  const tbody = document.getElementById("usersTableBody")
  const usersToShow = filteredUsers || users

  tbody.innerHTML = usersToShow
    .map(
      (user) => `
        <tr>
            <td>#${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.role === "admin" ? "badge-danger" : "badge-primary"}">
                    ${user.role.toUpperCase()}
                </span>
            </td>
            <td>
                <span class="badge ${user.status === "active" ? "badge-success" : "badge-secondary"}">
                    ${user.status === "active" ? "Aktif" : "Tidak Aktif"}
                </span>
            </td>
            <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')" ${user.role === "admin" ? "disabled" : ""}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `,
    )
    .join("")
}

function setupFilters() {
  const searchInput = document.getElementById("searchUsers")
  const roleFilter = document.getElementById("filterRole")
  const statusFilter = document.getElementById("filterStatus")

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedRole = roleFilter.value
    const selectedStatus = statusFilter.value

    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
      const matchesRole = !selectedRole || user.role === selectedRole
      const matchesStatus = !selectedStatus || user.status === selectedStatus

      return matchesSearch && matchesRole && matchesStatus
    })

    displayUsers(filtered)
  }

  searchInput.addEventListener("input", applyFilters)
  roleFilter.addEventListener("change", applyFilters)
  statusFilter.addEventListener("change", applyFilters)
}

function setupForm() {
  const form = document.getElementById("userForm")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    saveUser()
  })
}

function showAddUserModal() {
  editingUserId = null
  document.getElementById("modalTitle").textContent = "Tambah Pengguna"
  document.getElementById("userForm").reset()
  document.getElementById("userModal").classList.add("show")
}

function editUser(id) {
  const user = users.find((u) => u.id === id)
  if (!user) return

  editingUserId = id
  document.getElementById("modalTitle").textContent = "Edit Pengguna"

  // Fill form with user data
  document.getElementById("userId").value = user.id
  document.getElementById("userName").value = user.name
  document.getElementById("userEmail").value = user.email
  document.getElementById("userRole").value = user.role
  document.getElementById("userStatus").value = user.status
  document.getElementById("userPhone").value = user.phone || ""
  document.getElementById("userAddress").value = user.address || ""

  // Clear password fields for editing
  document.getElementById("userPassword").value = ""
  document.getElementById("userPasswordConfirm").value = ""

  document.getElementById("userModal").classList.add("show")
}

function saveUser() {
  const password = document.getElementById("userPassword").value
  const passwordConfirm = document.getElementById("userPasswordConfirm").value

  // Validate passwords if provided
  if (password && password !== passwordConfirm) {
    showAlert("Password dan konfirmasi password tidak cocok!", "danger")
    return
  }

  const formData = {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    role: document.getElementById("userRole").value,
    status: document.getElementById("userStatus").value,
    phone: document.getElementById("userPhone").value,
    address: document.getElementById("userAddress").value,
  }

  // Check if email already exists (for new users or different email for existing user)
  const existingUser = users.find((u) => u.email === formData.email && u.id !== editingUserId)
  if (existingUser) {
    showAlert("Email sudah digunakan oleh pengguna lain!", "danger")
    return
  }

  if (editingUserId) {
    // Update existing user
    const index = users.findIndex((u) => u.id === editingUserId)
    if (index !== -1) {
      users[index] = { ...users[index], ...formData }
      showAlert("Pengguna berhasil diupdate!", "success")
    }
  } else {
    // Add new user
    if (!password) {
      showAlert("Password wajib diisi untuk pengguna baru!", "danger")
      return
    }

    const newUser = {
      id: Date.now().toString(),
      ...formData,
      registeredAt: new Date().toISOString(),
      lastLogin: null,
    }
    users.push(newUser)
    showAlert("Pengguna berhasil ditambahkan!", "success")
  }

  saveUsers()
  displayUsers()
  closeUserModal()
}

function deleteUser(id) {
  const user = users.find((u) => u.id === id)
  if (!user) return

  if (user.role === "admin") {
    showAlert("Admin tidak dapat dihapus!", "danger")
    return
  }

  if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
    users = users.filter((u) => u.id !== id)
    saveUsers()
    displayUsers()
    showAlert("Pengguna berhasil dihapus!", "success")
  }
}

function closeUserModal() {
  document.getElementById("userModal").classList.remove("show")
  editingUserId = null
}

function showAlert(message, type = "info") {
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message
  alert.style.position = "fixed"
  alert.style.top = "20px"
  alert.style.right = "20px"
  alert.style.zIndex = "9999"
  alert.style.minWidth = "300px"

  document.body.appendChild(alert)

  setTimeout(() => {
    if (alert.parentNode) {
      alert.parentNode.removeChild(alert)
    }
  }, 3000)
}
