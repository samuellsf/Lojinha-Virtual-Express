document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const clearFiltersBtn = document.getElementById("clear-filters");

  let products = [];
  let filteredProducts = [];

  // Gera uma imagem PNG automaticamente via Canvas com base no produto e categoria
  function gerarImagemAutomatica(nome, category) {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    const temas = {
      "Roupas": { c1: "#1976d2", c2: "#42a5f5", icone: "👕" },
      "Calçados": { c1: "#2e7d32", c2: "#66bb6a", icone: "👟" },
      "Acessórios": { c1: "#6a1b9a", c2: "#ab47bc", icone: "👜" },
      "Diversos": { c1: "#ef6c00", c2: "#ffa726", icone: "🛍️" }
    };

    const tema = temas[category] || temas["Diversos"];

    // Fundo degradê
    const grad = ctx.createLinearGradient(0, 0, 400, 300);
    grad.addColorStop(0, tema.c1);
    grad.addColorStop(1, tema.c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 300);

    // Círculo central translúcido
    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.beginPath();
    ctx.arc(200, 125, 65, 0, Math.PI * 2);
    ctx.fill();

    // Ícone central
    ctx.font = "64px Segoe UI Emoji, Apple Color Emoji, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tema.icone, 200, 128);

    // Nome do produto
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Poppins, Arial, sans-serif";
    ctx.fillText(nome, 200, 225);

    // Tag da categoria
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "14px Poppins, Arial, sans-serif";
    ctx.fillText((category || "Produto").toUpperCase(), 200, 255);

    return canvas.toDataURL("image/png");
  }

  fetch("data/produtos.json")
    .then(res => {
      if (!res.ok) throw new Error("Falha ao carregar JSON");
      return res.json();
    })
    .then(data => {
      products = data;
      filteredProducts = [...products];
      loadCategories(products);
      renderProducts(filteredProducts);
    })
    .catch(err => {
      console.error("Erro ao carregar produtos:", err);
      productsContainer.innerHTML = `<p style="text-align:center;width:100%;">Abra o projeto usando Live Server para carregar os produtos.</p>`;
    });

  function renderProducts(list) {
    productsContainer.innerHTML = "";
    list.forEach((product, idx) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product");

      const img = document.createElement("img");
      img.src = product.imagem;
      img.alt = product.nome;

      // Se o link do JSON falhar/expirar, gera a imagem automaticamente na hora
      img.onerror = function () {
        this.onerror = null;
        this.src = gerarImagemAutomatica(product.nome, product.category);
      };

      const title = document.createElement("h3");
      title.textContent = product.nome;

      const desc = document.createElement("p");
      desc.textContent = product.descricao;

      const price = document.createElement("p");
      price.classList.add("price");
      price.textContent = `R$ ${product.preco.toFixed(2)}`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.classList.add("buy-btn");
      btn.textContent = "Comprar";
      btn.addEventListener("click", () => {
        if (typeof window.addToCart === "function") {
          window.addToCart(product);
          const originalText = btn.textContent;
          btn.textContent = "Adicionado ✓";
          setTimeout(() => (btn.textContent = originalText), 700);
        }
      });

      productCard.append(img, title, desc, price, btn);
      productsContainer.appendChild(productCard);
    });
  }

  function loadCategories(list) {
    const categories = [...new Set(list.map(p => p.category || "Diversos"))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    filteredProducts = products.filter(p => p.nome.toLowerCase().includes(term));
    renderProducts(filteredProducts);
  });

  categoryFilter.addEventListener("change", () => {
    const cat = categoryFilter.value;
    filteredProducts = cat ? products.filter(p => (p.category || "Diversos") === cat) : [...products];
    renderProducts(filteredProducts);
  });

  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    sortSelect.value = "default";
    filteredProducts = [...products];
    renderProducts(filteredProducts);
  });

  sortSelect.addEventListener("change", () => {
    let sorted = [...filteredProducts];
    if (sortSelect.value === "price-asc") sorted.sort((a, b) => a.preco - b.preco);
    if (sortSelect.value === "price-desc") sorted.sort((a, b) => b.preco - a.preco);
    renderProducts(sorted);
  });

  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('js/serviceWorker.js')
      .then(() => console.log('Service Worker registrado'))
      .catch(err => console.error('Erro Service Worker:', err));
  }
});