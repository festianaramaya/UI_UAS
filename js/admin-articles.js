// Admin Articles Management
document.addEventListener("DOMContentLoaded", () => {
    const authManager = {
        isAdmin: () => localStorage.getItem("userRole") === "admin", // Asumsi autentikasi sederhana
    };

    if (!authManager.isAdmin()) {
        window.location.href = "index.html";
        return;
    }

    loadArticles();
    setupFilters();
    setupForm();
});

let articles = [];
let editingArticleId = null;

function loadArticles() {
    const storedArticles = localStorage.getItem("articles");
    if (storedArticles) {
        articles = JSON.parse(storedArticles);
    } else {
        articles = [];
        saveArticles();
    }
    displayArticles();
}

function saveArticles() {
    localStorage.setItem("articles", JSON.stringify(articles));
}

function displayArticles(filteredArticles = null) {
    const tbody = document.getElementById("articlesTableBody");
    const articlesToShow = filteredArticles || articles;

    tbody.innerHTML = articlesToShow
        .map(
            (article) => `
        <tr>
            <td>
                <img src="${article.image}" alt="${article.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
            </td>
            <td>
                <div style="max-width: 200px;">
                    <strong>${article.title}</strong>
                    <br>
                    <small class="text-muted">${article.excerpt.substring(0, 50)}...</small>
                </div>
            </td>
            <td>${article.category}</td>
            <td>${article.author}</td>
            <td>${new Date(article.date).toLocaleDateString()}</td>
            <td>
                <span class="badge ${article.status === "published" ? "badge-success" : "badge-warning"}">
                    ${article.status === "published" ? "Published" : "Draft"}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="editArticle('${article.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteArticle('${article.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
        )
        .join("");
}

function setupFilters() {
    const searchInput = document.getElementById("searchArticles");
    const categoryFilter = document.getElementById("filterCategory");

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        const filtered = articles.filter((article) => {
            const matchesSearch =
                article.title.toLowerCase().includes(searchTerm) ||
                article.excerpt.toLowerCase().includes(searchTerm) ||
                article.author.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || article.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        displayArticles(filtered);
    }

    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
}

function setupForm() {
    const form = document.getElementById("articleForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        saveArticle();
    });
}

function showAddArticleModal() {
    editingArticleId = null;
    document.getElementById("modalTitle").textContent = "Tambah Artikel";
    document.getElementById("articleForm").reset();
    document.getElementById("articleImageFile").value = '';
    document.getElementById("articleModal").classList.add("show");
}

function editArticle(id) {
    const article = articles.find((a) => a.id === id);
    if (!article) return;

    editingArticleId = id;
    document.getElementById("modalTitle").textContent = "Edit Artikel";

    document.getElementById("articleId").value = article.id;
    document.getElementById("articleTitle").value = article.title;
    document.getElementById("articleCategory").value = article.category;
    document.getElementById("articleAuthor").value = article.author;
    document.getElementById("articleReadTime").value = article.readTime;
    document.getElementById("articleExcerpt").value = article.excerpt;
    document.getElementById("articleContent").value = article.content;
    document.getElementById("articleStatus").value = article.status;

    document.getElementById("articleImageFile").value = '';
    document.getElementById("articleModal").classList.add("show");
    document.getElementById("articleLink").value = article.link || "";
  }

async function saveArticle() {
    const fileInput = document.getElementById("articleImageFile");
    let imageData = "";

    if (fileInput && fileInput.files.length > 0) {
        imageData = await convertFileToBase64(fileInput.files[0]);
    } else if (editingArticleId) {
        const existingArticle = articles.find((a) => a.id === editingArticleId);
        imageData = existingArticle ? existingArticle.image : "";
    } else {
        imageData = "/fallback-image.jpg";
    }

    const formData = {
        title: document.getElementById("articleTitle").value,
        category: document.getElementById("articleCategory").value,
        author: document.getElementById("articleAuthor").value,
        readTime: Number.parseInt(document.getElementById("articleReadTime").value),
        excerpt: document.getElementById("articleExcerpt").value,
        content: document.getElementById("articleContent").value,
        image: imageData,
        status: document.getElementById("articleStatus").value,
        link: document.getElementById("articleLink").value, // 🔥 Tambahan URL artikel
    };

    if (!formData.title || !formData.category || !formData.author || !formData.readTime) {
        showAlert("Please fill in all required fields!", "danger");
        return;
    }

    if (editingArticleId) {
        const index = articles.findIndex((a) => a.id === editingArticleId);
        if (index !== -1) {
            articles[index] = {
                ...articles[index],
                ...formData,
                date: new Date().toISOString(),
            };
            showAlert("Artikel berhasil diupdate!", "success");
        }
    } else {
        const newArticle = {
            id: Date.now().toString(),
            ...formData,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };
        articles.push(newArticle);
        showAlert("Artikel berhasil ditambahkan!", "success");
    }

    saveArticles();
    loadArticles();
    closeArticleModal();
}

function deleteArticle(id) {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
        articles = articles.filter((a) => a.id !== id);
        saveArticles();
        loadArticles();
        showAlert("Artikel berhasil dihapus!", "success");
    }
}

function closeArticleModal() {
    document.getElementById("articleModal").classList.remove("show");
    editingArticleId = null;
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

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Make getArticleById available for article-detail.html
window.getArticleById = function (id) {
    const storedArticles = localStorage.getItem("articles");
    return storedArticles ? JSON.parse(storedArticles).find((article) => article.id === id) : null;
};
