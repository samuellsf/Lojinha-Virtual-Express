// js/cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];


const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');


function renderCart() {
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<li>Carrinho vazio</li>';
    cartTotal.textContent = 'Total: R$ 0,00';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.preco * item.qty; 

    const li = document.createElement('li');
    li.textContent = `${item.nome} - ${item.qty} x R$ ${item.preco.toFixed(2)}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.onclick = () => removeFromCart(index);

    li.appendChild(removeBtn);
    cartItemsContainer.appendChild(li);
  });

  cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
  
    existing.qty += 1;
  } else {
   
    cart.push({ ...product, qty: 1 });
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
  cart.forEach(item => {
    message += `- ${item.nome} (R$ ${item.preco.toFixed(2)})%0A`;
  });

  const total = cart.reduce((sum, item) => sum + item.preco, 0);
  message += `%0ATotal: R$ ${total.toFixed(2)}`;

  const phoneNumber = '5555555555'; // 
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}


checkoutBtn.addEventListener('click', checkoutWhatsApp);

renderCart();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/serviceWorker.js')
    .then(reg => console.log('Service Worker registrado', reg))
    .catch(err => console.error('Erro ao registrar Service Worker', err));
}
