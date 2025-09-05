document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const clearFiltersBtn = document.getElementById("clear-filters");

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout");

  let products = [];
  let filteredProducts = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // -------------------- FETCH PRODUTOS --------------------
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

  // -------------------- RENDERIZA PRODUTOS --------------------
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
        const productToCart = { ...product };
        if (tamanhoSelecionado) productToCart.tamanho = tamanhoSelecionado;

        const remainingStock = product.estoque - getCartQuantity(product, tamanhoSelecionado);

        const existingIndex = cart.findIndex(
          p => p.id === productToCart.id && p.tamanho === productToCart.tamanho
        );

        if (existingIndex > -1) {
          if (cart[existingIndex].quantidade < remainingStock) {
            cart[existingIndex].quantidade += 1;
          } else {
            alert("Quantidade máxima em estoque atingida!");
            return;
          }
        } else {
          if (remainingStock > 0) {
            cart.push({ ...productToCart, quantidade: 1 });
          } else {
            alert("Produto esgotado!");
            return;
          }
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        renderStock();
      });
    });
  }

  // -------------------- RENDERIZA ESTOQUE --------------------
  function renderStock() {
    const productCards = document.querySelectorAll(".product");
    productCards.forEach(card => {
      const id = parseInt(card.querySelector(".buy-btn").dataset.id);
      const product = products.find(p => p.id === id);
      const tamanho = card.querySelector("select")?.value || null;
      const remainingStock = product.estoque - getCartQuantity(product, tamanho);

      card.querySelector(".stock-count").textContent = remainingStock;
      card.querySelector(".buy-btn").disabled = remainingStock <= 0;
    });
  }

  // -------------------- QUANTIDADE NO CARRINHO --------------------
  function getCartQuantity(product, tamanho) {
    return cart
      .filter(p => p.id === product.id && p.tamanho === tamanho)
      .reduce((sum, p) => sum + p.quantidade, 0);
  }

  // -------------------- FILTRAR CATEGORIAS --------------------
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
    filteredProducts = cat ? products.filter(p => (p.category || "Diversos") === cat) : products;
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

  // -------------------- CARRINHO --------------------
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.preco * item.quantidade;

      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nome} ${item.tamanho ? `(${item.tamanho})` : ''} - 
        R$ ${item.preco.toFixed(2)} x ${item.quantidade} 
        <button class="remove-btn">Remover</button>
      `;

      li.querySelector(".remove-btn").addEventListener("click", () => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        renderStock();
      });

      cartItemsContainer.appendChild(li);
    });

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
  }

  // -------------------- CHECKOUT WHATSAPP --------------------
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return alert("O carrinho está vazio!");

    // Monta mensagem
    let message = "Olá! Quero comprar:\n";
    cart.forEach(item => {
      message += `- ${item.nome} ${item.tamanho ? `(${item.tamanho})` : ''} - ${item.quantidade}x R$ ${item.preco.toFixed(2)}\n`;
    });
    const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
    message += `\nTotal: R$ ${total.toFixed(2)}`;

    const phoneNumber = "5511999999999"; // substitua pelo seu número com DDD
    const waUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank");

    // Limpa carrinho
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    renderStock();
  });
});
