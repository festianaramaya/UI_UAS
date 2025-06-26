const authManager = {
  isAdmin: function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    return user && user.role === "admin";
  }
};
