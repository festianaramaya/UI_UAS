document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");

  // Ambil artikel dari localStorage
  const storedArticles = localStorage.getItem("articles");
  const articles = storedArticles ? JSON.parse(storedArticles) : [];

  const article = articles.find((a) => a.id === articleId);

  const detailContainer = document.getElementById("articleDetail");
  if (article) {
    detailContainer.innerHTML = `
      <div class="article-detail-card">
          <img src="${article.image}" alt="${article.title}" class="article-image">
          <div class="article-detail-info">
              <div class="article-category">${article.category}</div>
              <h2 class="article-title">${article.title}</h2>
              <div class="article-meta">
                  <div><i class="fas fa-user"></i> ${article.author}</div>
                  <div><i class="fas fa-calendar"></i> ${new Date(article.date).toLocaleDateString()}</div>
                  <div><i class="fas fa-clock"></i> ${article.readTime} min read</div>
              </div>
              <div class="article-content">${article.content}</div>
          </div>
      </div>
    `;
  } else {
    detailContainer.innerHTML = "<p>Artikel tidak ditemukan.</p>";
  }
});