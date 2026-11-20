let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');
const cartCount = document.getElementById('cart-count');

const cartSidebar = document.getElementById('cart');
const cartToggleBtn = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');

function openCart() {
  if (cartSidebar) cartSidebar.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('active');
}

function closeCart() {
  if (cartSidebar) cartSidebar.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('active');
}

if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

function renderCart() {
  if (!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';

  // Soma o total de unidades no ícone do menu ☰
  const totalItems = cart.reduce((acc, item) => acc + (item.quantidade || 1), 0);
  if (cartCount) cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li>Carrinho vazio</li>';
    if (cartTotal) cartTotal.textContent = 'Total: R$ 0,00';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const qtd = item.quantidade || 1;
    const subtotal = item.preco * qtd;
    total += subtotal;

    const li = document.createElement('li');
    li.classList.add('cart-item');

    li.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.nome}</strong>
        <span>R$ ${item.preco.toFixed(2)} x ${qtd} = <b>R$ ${subtotal.toFixed(2)}</b></span>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn minus" data-index="${index}">-</button>
        <span class="qty-value">${qtd}</span>
        <button class="qty-btn plus" data-index="${index}">+</button>
        <button class="remove-btn" data-index="${index}">✕</button>
      </div>
    `;

    cartItemsContainer.appendChild(li);
  });

  // Eventos dos botões -, + e remover
  document.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', e => changeQuantity(Number(e.target.dataset.index), -1));
  });

  document.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', e => changeQuantity(Number(e.target.dataset.index), 1));
  });

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => removeFromCart(Number(e.target.dataset.index)));
  });

  if (cartTotal) cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Adiciona ou incrementa quantidade se o produto já existir no carrinho
window.addToCart = function(product) {
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantidade = (cart[existingIndex].quantidade || 1) + 1;
  } else {
    cart.push({ ...product, quantidade: 1 });
  }

  saveCart();
  renderCart();
};

function changeQuantity(index, delta) {
  if (!cart[index]) return;
  cart[index].quantidade = (cart[index].quantidade || 1) + delta;

  if (cart[index].quantidade <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert('Carrinho vazio!');
    return;
  }

  let message = 'Olá! Quero comprar:%0A';
  let total = 0;

  cart.forEach(item => {
    const qtd = item.quantidade || 1;
    const subtotal = item.preco * qtd;
    total += subtotal;
    message += `- ${qtd}x ${item.nome} (R$ ${subtotal.toFixed(2)})%0A`;
  });

  message += `%0ATotal: R$ ${total.toFixed(2)}`;

  const phoneNumber = '5555555555';
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

if (checkoutBtn) checkoutBtn.addEventListener('click', checkoutWhatsApp);
renderCart();