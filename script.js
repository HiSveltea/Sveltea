
// Minimal shop behavior: load products from products.json, add to cart, simple checkout mock.
let products = [];
let cart = [];

async function loadProducts(){
  try{
    const res = await fetch('products.json');
    products = await res.json();
    renderProducts();
  }catch(e){
    console.error('No products.json found or fetch failed', e);
  }
}

function renderProducts(){
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h4>${p.name}</h4>
      <div class="price">€${p.price.toFixed(2)}</div>
      <button class="btn" data-id="${p.id}">Agregar</button>
    `;
    list.appendChild(card);
  });

  // attach add listeners
  document.querySelectorAll('.product .btn').forEach(b=>{
    b.addEventListener('click',()=>{
      addToCart(b.dataset.id);
    });
  });
}

function addToCart(id){
  const prod = products.find(p=>p.id==id);
  if(!prod) return;
  const existing = cart.find(c=>c.id==id);
  if(existing) existing.qty++;
  else cart.push({id:prod.id,name:prod.name,price:prod.price,image:prod.image,qty:1});
  updateCartUI();
}

function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cart-count').innerText = count;
  const panel = document.getElementById('cart-items');
  panel.innerHTML = '';
  cart.forEach(item=>{
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${item.image}" />
      <div style="flex:1">
        <div>${item.name}</div>
        <div style="font-size:13px;color:#ccc">€${(item.price*item.qty).toFixed(2)} (${item.qty}x)</div>
      </div>
      <div>
        <button class="qty" data-id="${item.id}" data-op="+" style="margin-right:6px">+</button>
        <button class="qty" data-id="${item.id}" data-op="-">-</button>
      </div>
    `;
    panel.appendChild(el);
  });
  document.getElementById('cart-total').innerText = '€' + cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);

  document.querySelectorAll('.cart-item .qty').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.dataset.id;
      const op = btn.dataset.op;
      const it = cart.find(c=>c.id==id);
      if(!it) return;
      if(op=='+') it.qty++;
      else it.qty = Math.max(0, it.qty-1);
      // remove zeros
      cart = cart.filter(c=>c.qty>0);
      updateCartUI();
    });
  });
}

document.getElementById('cart-btn').addEventListener('click', ()=>{
  document.getElementById('cart-panel').classList.remove('hidden');
});
document.getElementById('close-cart').addEventListener('click', ()=>{
  document.getElementById('cart-panel').classList.add('hidden');
});
document.getElementById('checkout-btn').addEventListener('click', ()=>{
  if(cart.length===0){ alert('Tu carrito está vacío.'); return; }
  // Simple mock checkout: show options and clear cart
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
  const ok = confirm('Total €' + total + '\n\nElegir "Aceptar" para simular pago (Stripe/PayPal/Transferencia).');
  if(ok){
    alert('Pago simulado completado. Gracias por tu compra!');
    cart = [];
    updateCartUI();
    document.getElementById('cart-panel').classList.add('hidden');
  }
});

// hamburger for mobile
document.getElementById('hamburger').addEventListener('click', ()=>{
  const nav = document.querySelector('.main-nav');
  if(nav.style.display==='flex') nav.style.display='';
  else nav.style.display='flex';
});

// contact form basic behaviour
document.getElementById('contact-form').addEventListener('submit', (e)=>{
  e.preventDefault();
  alert('Mensaje enviado (simulado). Gracias!');
  e.target.reset();
});

// init
loadProducts();
