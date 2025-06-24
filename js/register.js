document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const password = this.password.value;
  registerUser(name, email, password);
});
