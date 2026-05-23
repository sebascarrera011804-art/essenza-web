// ══════════════════════════════════════════════
//  1. DATOS DE LOS PERFUMES REALS
// ══════════════════════════════════════════════
const productos = [
  {
    id: 1,
    imagen: 'img/chanel.png',
    brand: 'Chanel',
    name: 'No. 5',
    familia: 'Floral',
    tipo: 'EdP',
    duracion: '8h+',
    intensidad: 'Moderado',
    precioNum: 185,
    precio: '$185',
    salida: 'Aldehídos, Ylang-ylang',
    fondo: 'Sándalo, Vainilla, Vetiver',
    badge: 'Top ventas'
  },
  {
    id: 2,
    imagen: 'img/tomford.png',
    brand: 'Tom Ford',
    name: 'Oud Wood',
    familia: 'Amaderado',
    tipo: 'EdP',
    duracion: '10h+',
    intensidad: 'Intenso',
    precioNum: 245,
    precio: '$245',
    salida: 'Cardamomo, Pimienta',
    fondo: 'Madera de Oud, Sándalo, Vetiver',
    badge: 'Exclusivo'
  },
  {
    id: 3,
    imagen: 'img/dior.png',
    brand: 'Dior',
    name: 'Sauvage',
    familia: 'Cítrico',
    tipo: 'EdT',
    duracion: '6h',
    intensidad: 'Moderado',
    precioNum: 120,
    precio: '$120',
    salida: 'Bergamota de Calabria',
    fondo: 'Ambroxan, Cedro',
    badge: 'Popular'
  },
  {
    id: 4,
    imagen: 'img/acqua.png',
    brand: 'Giorgio Armani',
    name: 'Acqua Di Gio',
    familia: 'Acuático',
    tipo: 'EdT',
    duracion: '5h',
    intensidad: 'Ligero',
    precioNum: 110,
    precio: '$110',
    salida: 'Notas Marinas, Naranja',
    fondo: 'Pachulí, Cedro',
    badge: null
  },
  {
    id: 5,
    imagen: 'img/ysl.png',
    brand: 'Guerlain',
    name: 'Shalimar',
    familia: 'Oriental',
    tipo: 'EdP',
    duracion: '9h',
    intensidad: 'Intenso',
    precioNum: 160,
    precio: '$160',
    salida: 'Cítricos, Bergamota',
    fondo: 'Vainilla, Haba Tonka',
    badge: 'Clásico'
  }
];

// Estados globales
let compareList = [];
let carrito = [];
let metodoPagoActual = 'tarjeta'; // Estado para alternar pasarela de pago

// ══════════════════════════════════════════════
//  2. ARQUITECTURA DE NAVEGACIÓN (SPA)
// ══════════════════════════════════════════════
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById('page-' + pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    targetPage.classList.add('fade-up');
  }

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('nav-active');
    if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`'${pageId}'`)) {
      link.classList.add('nav-active');
    }
  });

  if (pageId === 'home') {
    renderGrid('product-grid-home', productos.slice(0, 3));
  } else if (pageId === 'catalogo') {
    applyFilters();
  } else if (pageId === 'carrito') {
    renderCarritoView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════
//  3. INYECCIÓN IMPECABLE DE TARJETAS
// ══════════════════════════════════════════════
function renderGrid(containerId, lista) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-2);">
        <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-style: italic;">No se encontraron elixires disponibles con esos filtros.</p>
        <button class="btn-primary" style="margin-top: 1rem;" onclick="resetFilters()">Limpiar Filtros</button>
      </div>`;
    return;
  }

  container.innerHTML = lista.map(p => {
    const isSelected = compareList.includes(p.id);
    const badgeHTML = p.badge ? `<span class="product-badge">${p.badge}</span>` : '';
    
    return `
      <article class="product-card fade-up" onclick="openProducto(${p.id})">
        ${badgeHTML}
        <div class="product-img">
          <img src="${p.imagen}" alt="${p.brand} ${p.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span style="display:none; font-size:4rem;">${p.emoji}</span>
          <button class="product-compare-btn ${isSelected ? 'selected' : ''}" 
                  onclick="event.stopPropagation(); toggleCompare(${p.id}, '${containerId}')">
            ${isSelected ? '✓ Añadido' : '⚖️ Comparar'}
          </button>
        </div>
        <div class="product-info">
          <p class="product-brand">${p.brand}</p>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-family">${p.familia} · ${p.tipo}</p>
          <div class="product-attrs">
            <span class="attr-tag">${p.duracion}</span>
            <span class="attr-tag">${p.intensidad}</span>
          </div>
          <div class="product-footer">
            <span class="product-price">${p.precio}<small>/ 50ml</small></span>
            <button class="btn-add" onclick="event.stopPropagation(); addToCart(${p.id})">
              + Bolsa
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ══════════════════════════════════════════════
//  4. MOTOR DE FILTROS Y BUSCADOR REAL
// ══════════════════════════════════════════════
function toggleChip(button) {
  button.classList.toggle('active');
  button.setAttribute('aria-pressed', button.classList.contains('active'));
  applyFilters();
}

function applyFilters() {
  const query = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
  
  const familias = Array.from(document.querySelectorAll('#filter-familia-group .chip.active')).map(c => c.textContent.trim());
  const intensidades = Array.from(document.querySelectorAll('#filter-intensidad-group .chip.active')).map(c => c.textContent.trim());
  const tipos = Array.from(document.querySelectorAll('#filter-tipo-group .chip.active')).map(c => c.textContent.trim());
  
  const priceInput = document.getElementById('price-range');
  const maxPrice = priceInput ? parseInt(priceInput.value) : 300;

  let filtrados = productos.filter(p => {
    const cumpleBusqueda = !query || 
                           p.name.toLowerCase().includes(query) || 
                           p.brand.toLowerCase().includes(query) || 
                           p.familia.toLowerCase().includes(query);
                           
    const cumpleFamilia = familias.length === 0 || familias.includes(p.familia);
    const cumpleIntensidad = intensidades.length === 0 || intensidades.includes(p.intensidad);
    const cumpleTipo = tipos.length === 0 || tipos.includes(p.tipo);
    const cumplePrecio = p.precioNum <= maxPrice;

    return cumpleBusqueda && cumpleFamilia && cumpleIntensidad && cumpleTipo && cumplePrecio;
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect?.value === 'precio-asc')  filtrados.sort((a,b) => a.precioNum - b.precioNum);
  if (sortSelect?.value === 'precio-desc') filtrados.sort((a,b) => b.precioNum - a.precioNum);

  const countEl = document.getElementById('productos-count');
  if (countEl) countEl.textContent = filtrados.length;

  renderGrid('product-grid-catalogo', filtrados);
}

function resetFilters() {
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.remove('active');
    c.setAttribute('aria-pressed', 'false');
  });

  const range = document.getElementById('price-range');
  if (range) {
    range.value = 300;
    document.getElementById('price-val').textContent = '$300';
  }
  applyFilters();
}

function filtrarPorFamilia(familia) {
  showPage('catalogo');
  setTimeout(() => {
    document.querySelectorAll('#filter-familia-group .chip').forEach(c => {
      const coincide = c.textContent.trim() === familia;
      c.classList.toggle('active', coincide);
      c.setAttribute('aria-pressed', coincide);
    });
    applyFilters();
  }, 50);
}

// ══════════════════════════════════════════════
//  5. BOLSA DE COMPRA Y OPCIONES DE PAGO MULTI-MÉTODO
// ══════════════════════════════════════════════
function addToCart(id) {
  const p = productos.find(x => x.id === id);
  if (p) {
    carrito.push(p);
    updateCartBadge();
    showToast(`✓ ${p.brand} ${p.name} añadido a la bolsa.`);
  }
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = carrito.length);
}

function switchMetodoPago(metodo) {
  metodoPagoActual = metodo;
  renderCarritoView();
}

function renderCarritoView() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (carrito.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 0; color: var(--text-2);">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem;">👜</span>
        <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-style: italic;">Su bolsa está vacía actualmente.</p>
        <button class="btn-primary" style="margin-top: 1.5rem;" onclick="showPage('catalogo')">Explorar Alta Perfumería</button>
      </div>`;
    return;
  }

  const subtotal = carrito.reduce((s, i) => s + i.precioNum, 0);

  // Inyección del selector elegante de métodos de pago
  let pasarelaFormHTML = '';
  
  if (metodoPagoActual === 'tarjeta') {
    pasarelaFormHTML = `
      <form onsubmit="event.preventDefault(); procesarCheckout('tarjeta');" style="display: flex; flex-direction: column; gap: 1rem;">
        <input type="text" placeholder="Número de Tarjeta (16 dígitos)" required maxlength="19" style="background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: .75rem 1rem; font-size: .88rem; outline: none; width:100%;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <input type="text" placeholder="MM/AA" required maxlength="5" style="background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: .75rem 1rem; font-size: .88rem; outline: none;">
          <input type="password" placeholder="CVC" required maxlength="4" style="background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: .75rem 1rem; font-size: .88rem; outline: none;">
        </div>
        <input type="text" placeholder="Nombre del Titular" required style="background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: .75rem 1rem; font-size: .88rem; outline: none; width:100%;">
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: .5rem; padding: .9rem;">Autorizar Compra de $${subtotal}</button>
      </form>
    `;
  } else {
    // Interfaz Pro de Transferencia Bancaria Directa
    pasarelaFormHTML = `
      <div style="background: rgba(15,14,12,0.6); padding: 1.25rem; border: 1px dashed var(--border); margin-bottom: 1.5rem; font-size: .9rem; line-height: 1.6;">
        <p style="color: var(--gold); margin-bottom: .5rem; text-transform: uppercase; font-size: .75rem; letter-spacing: .05em;">Datos de Cuenta Atelier Essenza:</p>
        <p style="color: var(--text);"><strong style="color:var(--text-2);">Banco:</strong> Banco Pichincha (Cuenta de Ahorros)</p>
        <p style="color: var(--text);"><strong style="color:var(--text-2);">Número de Cuenta:</strong> 2204598104</p>
        <p style="color: var(--text);"><strong style="color:var(--text-2);">Titular:</strong> Sebastian Carrera</p>
        <p style="color: var(--text);"><strong style="color:var(--text-2);">Identificación / CI:</strong> 1726943850</p>
        <p style="color: var(--text);"><strong style="color:var(--text-2);">Correo:</strong> sebascarrera011804@gmail.com</p>
      </div>
      <form onsubmit="event.preventDefault(); procesarCheckout('transferencia');" style="display: flex; flex-direction: column; gap: 1rem;">
        <p style="font-size: .8rem; color: var(--text-2); margin-bottom: .25rem;">Por favor, ingrese el código o número de comprobante de la transferencia efectuada:</p>
        <input type="text" placeholder="Número de Referencia / Comprobante" required style="background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: .75rem 1rem; font-size: .88rem; outline: none; width:100%;">
        <input type="text" placeholder="Nombre de la institución desde donde transfiere" required style="background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: .75rem 1rem; font-size: .88rem; outline: none; width:100%;">
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: .5rem; padding: .9rem;">Notificar Transferencia de $${subtotal}</button>
      </form>
    `;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem;">
      ${carrito.map((item, index) => `
        <div class="fade-up" style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div style="background: var(--surface2); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; padding: 5px;">
              <img src="${item.imagen}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div>
              <p style="font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--gold);">${item.brand}</p>
              <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 400; color: var(--cream);">${item.name}</h3>
              <p style="font-size: .75rem; color: var(--muted);">${item.familia} · ${item.tipo}</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <span style="font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: var(--gold); font-weight: 500;">$${item.precioNum}</span>
            <button onclick="removeFromCart(${index})" style="background: none; border: 1px solid var(--border); color: var(--text-2); padding: .25rem .5rem; cursor: pointer; font-size: .75rem;">✕</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: .75rem; font-size: .9rem; color: var(--text-2);">
        <span>Subtotal</span>
        <span>$${subtotal}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; padding-bottom: .75rem; border-bottom: 1px solid var(--border); font-size: .9rem; color: var(--text-2);">
        <span>Envío Asegurado Atelier</span>
        <span style="color: var(--success); font-size: .8rem; text-transform: uppercase;">Gratis</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 300;">Monto Total:</h3>
        <span style="font-family: 'Cormorant Garamond', serif; font-size: 2rem; color: var(--gold); font-weight: 600;">$${subtotal}</span>
      </div>
    </div>

    <div class="fade-up" style="background: linear-gradient(135deg, var(--surface) 0%, #171511 100%); border: 1px solid var(--gold); padding: 2rem; border-radius: var(--radius);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: var(--gold); font-weight: 400; letter-spacing: .02em;">⚙️ Pasarela de Pago Segura</h3>
        <div style="display: flex; gap: .5rem;">
          <button class="chip ${metodoPagoActual === 'tarjeta' ? 'active' : ''}" onclick="switchMetodoPago('tarjeta')">💳 Tarjeta</button>
          <button class="chip ${metodoPagoActual === 'transferencia' ? 'active' : ''}" onclick="switchMetodoPago('transferencia')">🏦 Transferencia</button>
        </div>
      </div>
      
      ${pasarelaFormHTML}
    </div>
  `;
}

function removeFromCart(index) {
  carrito.splice(index, 1);
  updateCartBadge();
  renderCarritoView();
}

function procesarCheckout(tipo) {
  if (tipo === 'tarjeta') {
    showToast("🔐 Autorizando cobro con la entidad bancaria...");
  } else {
    showToast("🏦 Verificando comprobante de transferencia bancaria...");
  }
  
  setTimeout(() => {
    showToast("✅ Transacción exitosa. Su orden ha sido registrada en el Atelier.");
    carrito = [];
    updateCartBadge();
    showPage('home');
  }, 2000);
}

// ══════════════════════════════════════════════
//  6. COMPARADOR DE PERFUMES
// ══════════════════════════════════════════════
function toggleCompare(id, containerId) {
  const index = compareList.indexOf(id);
  if (index > -1) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length >= 2) {
      showToast('Solo se permite la comparación simultánea de 2 elixires.');
      return;
    }
    compareList.push(id);
  }
  updateComparadorBar();
  if (containerId === 'product-grid-catalogo') applyFilters();
  else renderGrid(containerId, productos.slice(0, 3));
}

function updateComparadorBar() {
  const bar = document.getElementById('comparador-bar');
  if (!bar) return;
  compareList.length > 0 ? bar.classList.add('visible') : bar.classList.remove('visible');

  for (let i = 0; i < 2; i++) {
    const slot = document.getElementById('slot-' + i);
    if (!slot) continue;
    if (compareList[i]) {
      const p = productos.find(x => x.id === compareList[i]);
      slot.textContent = `${p.emoji} ${p.brand} ${p.name}`;
      slot.classList.add('filled');
    } else {
      slot.textContent = 'Selecciona un perfume';
      slot.classList.remove('filled');
    }
  }
}

function openComparador() {
  if (compareList.length < 2) return;
  const a = productos.find(x => x.id === compareList[0]);
  const b = productos.find(x => x.id === compareList[1]);

  document.getElementById('compare-name-0').textContent = `${a.brand} ${a.name}`;
  document.getElementById('compare-name-1').textContent = `${b.brand} ${b.name}`;

  const campos = ['familia', 'tipo', 'duracion', 'intensidad', 'salida', 'fondo', 'precio'];
  campos.forEach(c => {
    document.getElementById(`cf-0-${c}`).textContent = a[c];
    document.getElementById(`cf-1-${c}`).textContent = b[c];
  });

  document.getElementById('modal-comparador').classList.add('open');
}

// ══════════════════════════════════════════════
//  7. DETALLE EXPANDIDO DE FRAGANCIAS
// ══════════════════════════════════════════════
function openProducto(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;

  document.getElementById('product-detail-title').textContent = `${p.brand} — ${p.name}`;
  document.getElementById('product-detail-content').innerHTML = `
    <div class="product-detail">
      <div class="product-detail-img">
        <img src="${p.imagen}" alt="${p.name}" onerror="this.style.display='none';">
      </div>
      <div>
        <p class="product-detail-brand">${p.brand}</p>
        <h2 style="font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:300; margin-bottom:.5rem;">${p.name}</h2>
        <p style="color:var(--text-2); font-size:.85rem; margin-bottom:1.5rem;">${p.familia} · Concentración ${p.tipo}</p>
        
        <div class="notes-section">
          <p class="notes-title">Notas de Salida</p>
          <div class="notes-pills"><span class="note-pill">${p.salida}</span></div>
        </div>
        <div class="notes-section" style="margin-bottom: 1.5rem;">
          <p class="notes-title">Notas de Fondo</p>
          <div class="notes-pills"><span class="note-pill">${p.fondo}</span></div>
        </div>

        <div class="rating-bar">
          <span class="rating-label">Estela e Intensidad: ${p.intensidad}</span>
          <div class="rating-track"><div class="rating-fill" style="width: ${p.intensidad === 'Intenso' ? '100%' : p.intensidad === 'Moderado' ? '65%' : '35%'}"></div></div>
        </div>
        <div class="rating-bar" style="margin-bottom: 2rem;">
          <span class="rating-label">Longevidad Estimada: ${p.duracion}</span>
          <div class="rating-track"><div class="rating-fill" style="width: 85%"></div></div>
        </div>

        <div class="price-row">
          <span class="price-big">${p.precio}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${p.id}); closeModal('modal-producto');">Añadir a la bolsa</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modal-producto').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ══════════════════════════════════════════════
//  8. TOASTS Y AUXILIARES
// ══════════════════════════════════════════════
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function enviarContacto(form) {
  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Enviando al Atelier...';
  setTimeout(() => {
    showToast('✅ Solicitud de asesoría enviada con éxito.');
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje';
  }, 1200);
}

function activarPaso(index) {
  document.querySelectorAll('.step-pill').forEach((p, i) => p.classList.toggle('active', i === index));
  showPage('catalogo');
}

// ══════════════════════════════════════════════
//  9. INICIALIZADOR DEL DOM
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderGrid('product-grid-home', productos.slice(0, 3));
  updateCartBadge();

  document.getElementById('price-range')?.addEventListener('input', function() {
    const val = document.getElementById('price-val');
    if (val) val.textContent = '$' + this.value;
    applyFilters();
  });

  document.getElementById('search-input')?.addEventListener('input', applyFilters);
  document.getElementById('sort-select')?.addEventListener('change', applyFilters);
});
