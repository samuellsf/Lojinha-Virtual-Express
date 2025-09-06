// js/app.js
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const clearFiltersBtn = document.getElementById("clear-filters");

  let products = [];
  let filteredProducts = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ---- FETCH PRODUTOS --------------------
  fetch("data/produtos.json")
    .then(res => res.json())
    .then(data => {
      products = data.map(p => ({ ...p }));
      filteredProducts = [...products];
      renderProducts(filteredProducts);
      loadCategories(products);
      renderCart();
    })
    .catch(err => console.error("Erro ao carregar produtos:", err));
    
// ---- FILTRO DE BUSCA --------------------
    searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  filteredProducts = products.filter(product => 
    product.nome.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
});


  // ---- RENDERIZA PRODUTOS --------------------
  function renderProducts(list) {
    productsContainer.innerHTML = "";
    list.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product");

      const remainingStock = product.estoque - getCartQuantity(product, null);

      let productHTML = `
        <img src="${product.imagem}" alt="${product.nome}">
        <h3>${product.nome}</h3>
        <p>${product.descricao}</p>
        <p class="price">R$ ${product.preco.toFixed(2)}</p>
        <p>Estoque: <span class="stock-count">${remainingStock}</span></p>
      `;

      if (product.tamanhos) {
        productHTML += `
          <label for="tamanhoProduto${product.id}">Escolha o Tamanho:</label>
          <select id="tamanhoProduto${product.id}">
            ${product.tamanhos.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        `;
      }

      productHTML += `<button class="buy-btn" data-id="${product.id}" ${remainingStock === 0 ? "disabled" : ""}>
                        Comprar
                      </button>`;

      productCard.innerHTML = productHTML;
      productsContainer.appendChild(productCard);

      const buyBtn = productCard.querySelector(".buy-btn");
      buyBtn.addEventListener("click", () => {
        const tamanhoSelecionado = document.getElementById(`tamanhoProduto${product.id}`)?.value || null;
        addToCart(product, tamanhoSelecionado);
      });
    });
  }

  // ---- ADICIONAR PRODUTO AO CARRINHO --------------------
  function addToCart(product, tamanho) {
    const uniqueId = product.id + (tamanho ? "-" + tamanho : "");
    const existing = cart.find(item => (item.id + (item.tamanho || "")) === uniqueId);

    const inCartQty = existing ? existing.quantidade : 0;
    const estoqueDisponivel = (product.estoque || 5) - inCartQty;

    if (estoqueDisponivel <= 0) {
      alert("Produto esgotado!");
      return;
    }

    if (existing) {
      existing.quantidade += 1;
    } else {
      const productToCart = { ...product, quantidade: 1 };
      if (tamanho) productToCart.tamanho = tamanho;
      cart.push(productToCart);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    renderStock();
  }

  // ---- REMOVE PRODUTO DO CARRINHO --------------------
  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    renderStock();
  }

  // ---- RENDERIZA CARRINHO --------------------
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<li>Carrinho vazio</li>";
      cartTotal.textContent = "Total: R$ 0,00";
      return;
    }

    cart.forEach((item, index) => {
      total += item.preco * item.quantidade;

      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nome} ${item.tamanho ? `(${item.tamanho})` : ''} - 
        R$ ${item.preco.toFixed(2)} x ${item.quantidade} 
        <button class="remove-btn">Remover</button>
      `;
      li.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(index));
      cartItemsContainer.appendChild(li);
    });

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  // ---- RENDERIZA ESTOQUE --------------------
  function renderStock() {
    document.querySelectorAll(".product").forEach(card => {
      const id = parseInt(card.querySelector(".buy-btn").dataset.id);
      const product = products.find(p => p.id === id);
      const tamanho = card.querySelector("select")?.value || null;
      const remainingStock = (product.estoque || 5) - getCartQuantity(product, tamanho);

      card.querySelector(".stock-count").textContent = remainingStock;
      card.querySelector(".buy-btn").disabled = remainingStock <= 0;
    });
  }

  // ---- QUANTIDADE NO CARRINHO --------------------
  function getCartQuantity(product, tamanho) {
    return cart
      .filter(p => p.id === product.id && (p.tamanho || null) === tamanho)
      .reduce((sum, p) => sum + p.quantidade, 0);
  }

  // ---- CHECKOUT WHATSAPP --------------------
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    let message = "Olá! Quero comprar:\n";
    cart.forEach(item => {
      message += `- ${item.nome} ${item.tamanho ? `(${item.tamanho})` : ''} - ${item.quantidade}x R$ ${item.preco.toFixed(2)}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const phoneNumber = "5511999999999"; 
    const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");

    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    renderStock();
  });

  // ---- FILTRAR CATEGORIAS --------------------
  function loadCategories(list) {
    const categories = [...new Set(list.map(p => p.category || "Diversos"))];
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  // ---- FILTRO POR CATEGORIA --------------------
  categoryFilter.addEventListener("change", () => {
    const cat = categoryFilter.value;
    filteredProducts = cat ? products.filter(p => (p.category || "Diversos") === cat) : products;
    renderProducts(filteredProducts);
  });

  // ---- LIMPAR FILTROS --------------------
  clearFiltersBtn.addEventListener("click", () => {
    searchInput.value = "";
    categoryFilter.value = "";
    sortSelect.value = "default";
    filteredProducts = [...products];
    renderProducts(filteredProducts);
  });

  // ---- ORDENAR PRODUTOS --------------------
  sortSelect.addEventListener("change", () => {
    let sorted = [...filteredProducts];
    if (sortSelect.value === "price-asc") sorted.sort((a, b) => a.preco - b.preco);
    if (sortSelect.value === "price-desc") sorted.sort((a, b) => b.preco - a.preco);
    renderProducts(sorted);
  });
});
