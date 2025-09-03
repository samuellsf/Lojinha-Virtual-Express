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
      loadCategories(data);
    })
    .catch(err => console.error("Erro ao carregar produtos:", err));

  // Função para renderizar os produtos na tela
  function renderProducts(list) {
    productsContainer.innerHTML = "";  // Limpar o container de produtos

    list.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product");

      let productHTML = `
        <img src="${product.imagem}" alt="${product.nome}">
        <h3>${product.nome}</h3>
        <p>${product.descricao}</p>
        <p class="price">R$ ${product.preco.toFixed(2)}</p>
      `;

      // Se o produto tiver tamanhos (camisas, jaquetas, calçados), adicione o seletor
      if (product.tamanhos) {
        productHTML += `
          <label for="tamanhoProduto${product.id}">Escolha o Tamanho:</label>
          <select id="tamanhoProduto${product.id}">
            ${product.tamanhos.map(tamanho => `<option value="${tamanho}">${tamanho}</option>`).join('')}
          </select>
        `;
      }

      productHTML += `<button class="buy-btn" data-id="${product.id}">Comprar</button>`;

      productCard.innerHTML = productHTML;
      productsContainer.appendChild(productCard);

      // Adiciona o evento de clique aos botões "Comprar"
      document.querySelectorAll(".buy-btn").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.target.dataset.id;
          const product = products.find(p => p.id == id);  // Encontre o produto
          const tamanhoSelecionado = document.getElementById(`tamanhoProduto${id}`)?.value;
          if (tamanhoSelecionado) {
            product.tamanho = tamanhoSelecionado;  // Adiciona o tamanho selecionado ao produto
          }
          addToCart(product);  // Adiciona o produto ao carrinho
        });
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

  // Ordenação dos produtos
  sortSelect.addEventListener("change", () => {
    let sorted = [...filteredProducts];
    if (sortSelect.value === "price-asc") sorted.sort((a, b) => a.preco - b.preco);
    if (sortSelect.value === "price-desc") sorted.sort((a, b) => b.preco - a.preco);
    renderProducts(sorted);
  });
});
