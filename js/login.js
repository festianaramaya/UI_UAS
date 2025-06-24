document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = this.email.value.trim();
  const password = this.password.value;
  loginWithEmail(email, password);
});

// login.js
function loginAsAdmin() {
  localStorage.setItem("userRole", "admin");
  window.location.href = "admin-articles.html";
}

function loginAsUser() {
  localStorage.setItem("userRole", "user");
  window.location.href = "index.html"; // atau halaman lain untuk user
}

// Bind fungsi ke elemen HTML saat DOM dimuat
document.addEventListener("DOMContentLoaded", () => {
  const adminLoginLink = document.querySelector('a[href="#"][onclick*="Login as Admin"]');
  const userLoginLink = document.querySelector('a[href="#"][onclick*="Login as User"]');

  if (adminLoginLink) {
    adminLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginAsAdmin();
    });
  }

  if (userLoginLink) {
    userLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginAsUser();
    });
  }
});