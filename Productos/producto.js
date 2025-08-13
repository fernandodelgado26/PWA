/* ===== Header behavior (mismo que en otras páginas) ===== */
const header = document.getElementById('header');
const onScroll = () => window.scrollY > 4 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
onScroll(); window.addEventListener('scroll', onScroll);

const navToggle = document.getElementById('navToggle');
navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  document.querySelector('.site-header')?.classList.toggle('open');
});

/* ===== Productos (mock) ===== */
const products = [
  {
    id: 'c1',
    name: 'Espresso Doble',
    desc: 'Shot intenso de café arábica recién molido.',
    price: 55.00,
    img: 'https://i.pinimg.com/736x/72/17/3d/72173da1e5862d2391959aebbec9097d.jpg'
  },
  {
    id: 'c2',
    name: 'Cappuccino',
    desc: 'Espresso, leche vaporizada y espuma cremosa.',
    price: 65.00,
    img: 'https://i.pinimg.com/1200x/60/16/24/601624588afbe86aa187efb9880629a6.jpg'
  },
  {
    id: 'c3',
    name: 'Latte Vainilla',
    desc: 'Latte suave con toque de vainilla natural.',
    price: 69.00,
    img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'c4',
    name: 'Americano',
    desc: 'Espresso rebajado con agua caliente, balance clásico.',
    price: 49.00,
    img: 'https://i.pinimg.com/1200x/8a/50/9e/8a509e80a255b25b54774a4437debf0e.jpg'
  },
  {
    id: 'c5',
    name: 'Mocha',
    desc: 'Latte con cacao y un toque de crema batida.',
    price: 72.00,
    img: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'c6',
    name: 'Cold Brew',
    desc: 'Infusión en frío de 16 horas, baja acidez.',
    price: 59.00,
    img: 'https://i.pinimg.com/736x/a2/99/68/a299681053f3653b0facb6c5d66fd22d.jpg'
  }
];


/* Render del grid */
const grid = document.getElementById('grid');
function money(n){ return n.toLocaleString('es-MX', { style:'currency', currency:'MXN' }); }

function renderGrid(){
  grid.innerHTML = products.map(p => `
    <article class="card">
      <div class="img"> <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px" loading="lazy"> </div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${money(p.price)}</div>
      <div class="actions">
        <button class="btn-ghost" data-id="${p.id}" data-action="details">Detalles</button>
        <button class="btn-buy" data-id="${p.id}" data-action="buy">Comprar</button>
      </div>
    </article>
  `).join('');
}
renderGrid();

/* Checkout panel */
const checkout = document.getElementById('checkout');
const closeCheckout = document.getElementById('closeCheckout');
const el = {
  img: document.getElementById('chkImg'),
  name: document.getElementById('chkName'),
  desc: document.getElementById('chkDesc'),
  price: document.getElementById('chkPrice'),
  paypal: document.getElementById('paypal-buttons'),
  msg: document.getElementById('payMsg')
};
let selected = null;

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const p = products.find(x => x.id === id);
  if (!p) return;

  if (btn.dataset.action === 'details') {
    alert(`${p.name}\n\n${p.desc}\n\nPrecio: ${money(p.price)}`);
  } else {
    openCheckout(p);
  }
});

function openCheckout(p){
  selected = p;
  el.img.src = p.img;
  el.img.alt = p.name;
  el.name.textContent = p.name;
  el.desc.textContent = p.desc;
  el.price.textContent = money(p.price);
  el.msg.textContent = '';
  checkout.classList.remove('hidden');

  // Limpia botones previos
  el.paypal.innerHTML = '';

  // Render PayPal (usa el SDK cargado en el HTML)
  if (!window.paypal) {
    el.msg.textContent = 'No se pudo cargar PayPal.';
    return;
  }

  paypal.Buttons({
    style: { layout: 'vertical', shape: 'pill' },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          description: p.name,
          amount: { value: p.price.toFixed(2), currency_code: 'MXN' }
        }]
      });
    },
    onApprove: async (data, actions) => {
      const order = await actions.order.capture();
      el.msg.textContent = 'Pago completado ✔ Gracias por tu compra.';
      console.log('ORDER', order);
    },
    onCancel: () => {
      el.msg.textContent = 'Pago cancelado.';
    },
    onError: (err) => {
      console.error(err);
      el.msg.textContent = 'Ocurrió un error con el pago.';
    }
  }).render('#paypal-buttons');
}

closeCheckout?.addEventListener('click', () => checkout.classList.add('hidden'));
