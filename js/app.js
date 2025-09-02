// app.js com marcações para facilitar as alterações
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const clearFiltersBtn = document.getElementById("clear-filters"); 

  let products = [];  
  let filteredProducts = []; 

  fetch("data/produtos.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      filteredProducts = data;  
      renderProducts(filteredProducts);  
    })
    .catch(err => console.error("Erro ao carregar produtos:", err));

  // Função para renderizar os produtos na tela
  function renderProducts(list) {
    productsContainer.innerHTML = "";  
    list.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product");
      productCard.innerHTML = `
        <img src="${product.imagem}" alt="${product.nome}">
        <h3>${product.nome}</h3>
        <p>${product.descricao}</p>
        <p class="price">R$ ${product.preco.toFixed(2)}</p>
        <button class="buy-btn" data-id="${product.id}">Comprar</button>
      `;
      productsContainer.appendChild(productCard);  
    });

    // Adiciona o evento de clique aos botões "Comprar"
    document.querySelectorAll(".buy-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = e.target.dataset.id;
        const product = products.find(p => p.id == id);  
        addToCart(product);  
      });
    });
  }

  // Função para carregar as categorias no filtro
  function loadCategories(list) {
    const categories = [...new Set(list.map(p => p.category || "Diversos"))]; 
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);  
    });
  }

  // Filtra os produtos com base na pesquisa no campo de texto
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();  
    filteredProducts = products.filter(p => p.nome.toLowerCase().includes(term));  
    renderProducts(filteredProducts); 
  });

  // Filtra os produtos com base na categoria selecionada
  categoryFilter.addEventListener("change", () => {
    const cat = categoryFilter.value;
    filteredProducts = cat ? products.filter(p => (p.category || "Diversos") === cat) : products;
    renderProducts(filteredProducts);  
  });

  // Evento para limpar os filtros
  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";  
    categoryFilter.value = "";  
    sortSelect.value = "default";  
    filteredProducts = [...products];  
    renderProducts(filteredProducts);  
  });

  // Registra o Service Worker para funcionamento offline 
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/serviceWorker.js')
      .then(() => console.log('Service Worker registrado com sucesso'))
      .catch(err => console.error('Erro ao registrar Service Worker:', err));
  }

  // Ordenação dos produtos
  sortSelect.addEventListener("change", () => {
    let sorted = [...filteredProducts];  
    if (sortSelect.value === "price-asc") sorted.sort((a, b) => a.preco - b.preco);  
    if (sortSelect.value === "price-desc") sorted.sort((a, b) => b.preco - a.preco);  
    renderProducts(sorted);  
  });
});

// Função para adicionar o produto ao carrinho 
function addToCart(product) {
  console.log("Produto adicionado ao carrinho:", product);
}
