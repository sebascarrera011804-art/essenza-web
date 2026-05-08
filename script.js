// ══════════════════════════════════════════════
//  DATOS DE PRODUCTOS
// ══════════════════════════════════════════════
const productos = [
  {
    id: 1,
    emoji: '🌸',
    imagen: 'img/chanel.png',
    brand: 'Chanel',
    name: 'No. 5',
    familia: 'Floral',
    tipo: 'EdP',
    duracion: '8h+',
    intensidad: 'Moderado',
    precioNum: 185,
    precio: '$185',
    salida: 'Ylang-ylang',
    corazon: 'Jazmín',
    fondo: 'Sándalo',
    badge: 'Top ventas'
  },
  {
    id: 2,
    emoji: '🌲',
    imagen: 'img/tomford.png',
    brand: 'Tom Ford',
    name: 'Oud Wood',
    familia: 'Amaderado',
    tipo: 'EdP',
    duracion: '10h+',
    intensidad: 'Intenso',
    precioNum: 245,
    precio: '$245',
    salida: 'Cardamomo',
    corazon: 'Oud',
    fondo: 'Vetiver',
    badge: null
  },
  {
    id: 3,
    emoji: '🍋',
    imagen: 'img/acqua.png',
    brand: 'Acqua di Parma',
    name: 'Colonia',
    familia: 'Cítrico',
    tipo: 'EdC',
    duracion: '4h',
    intensidad: 'Ligero',
    precioNum: 98,
    precio: '$98',
    salida: 'Limón',
    corazon: 'Naranja',
    fondo: 'Vetiver',
    badge: 'Nuevo'
  },
  {
    id: 4,
    emoji: '🌙',
    imagen: 'img/ysl.png',
    brand: 'YSL',
    name: 'Black Opium',
    familia: 'Oriental',
    tipo: 'EdP',
    duracion: '7h',
    intensidad: 'Intenso',
    precioNum: 120,
    precio: '$120',
    salida: 'Café',
    corazon: 'Jazmín',
    fondo: 'Vainilla',
    badge: null
  },
  {
    id: 5,
    emoji: '🌊',
    imagen: 'img/dior.png',
    brand: 'Dior',
    name: 'Sauvage',
    familia: 'Acuático',
    tipo: 'EdT',
    duracion: '6h',
    intensidad: 'Moderado',
    precioNum: 110,
    precio: '$110',
    salida: 'Bergamota',
    corazon: 'Pimienta',
    fondo: 'Ámbar',
    badge: 'Top ventas'
  },
  {
    id: 6,
    emoji: '🌹',
    imagen: 'img/jomalone.png',
    brand: 'Jo Malone',
    name: 'Rose & White Musk',
    familia: 'Floral',
    tipo: 'EdC',
    duracion: '5h',
    intensidad: 'Ligero',
    precioNum: 135,
    precio: '$135',
    salida: 'Rosa',
    corazon: 'Peonía',
    fondo: 'Almizcle',
    badge: 'Nuevo'
  }
];

// Lista de productos seleccionados para comparar (máximo 2)
let compareList = [];

// Carrito simple
let carrito = [];

// ══════════════════════════════════════════════
//  NAVEGACIÓN ENTRE PÁGINAS
// ══════════════════════════════════════════════
function showPage(page) {
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('active');
  });

  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
  }

  // Actualizar nav activo
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('nav-active');
  });
  const navMap = { catalogo: 0, guia: 1, perfil: 2 };
  if (navMap[page] !== undefined) {
    const links = document.querySelectorAll('.nav-links a');
    if (links[navMap[page]]) links[navMap[page]].classList.add('nav-active');
  }

  if (page === 'catalogo') {
    renderProductos('product-grid-catalogo', productos);
  }
  if (page === 'home') {
    renderProductos('product-grid-home', productos);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════════════════════════════
//  RENDERIZAR TARJETAS DE PRODUCTOS
// ══════════════════════════════════════════════
function renderProductos(containerId, lista) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!lista || lista.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-2);">
        <div style="font-size:2.5rem; margin-bottom:1rem;">🔍</div>
        <p>No se encontraron perfumes con esos filtros.</p>
        <button class="btn-outline" style="margin-top:1rem" onclick="resetFilters()">Limpiar filtros</button>
      </div>`;
    return;
  }

  container.innerHTML = lista.map(function(p) {
    const isSelected = compareList.includes(p.id);

    const badgeHTML = p.badge
      ? `<span class="product-badge ${p.badge === 'Nuevo' ? 'new' : ''}" aria-label="Etiqueta: ${p.badge}">${p.badge}</span>`
      : '';

    // Imagen real del producto
    const imgHTML = `<img src="${p.imagen}" alt="${p.brand} ${p.name}" loading="lazy">`;

    return `
      <article class="product-card"
        tabindex="0"
        onclick="openProducto(${p.id})"
        onkeydown="if(event.key === 'Enter') openProducto(${p.id})"
        aria-label="${p.brand} ${p.name}, ${p.familia}, ${p.precio}">

        ${badgeHTML}

        <div class="product-img">
          ${imgHTML}
          <button
            class="product-compare-btn ${isSelected ? 'selected' : ''}"
            onclick="event.stopPropagation(); toggleCompare(${p.id}, '${containerId}')"
            aria-label="${isSelected ? 'Quitar de comparador' : 'Agregar al comparador'}: ${p.name}"
            aria-pressed="${isSelected}">
            ⚖️ ${isSelected ? 'En comparador' : 'Comparar'}
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
            <button
              class="btn-add"
              onclick="event.stopPropagation(); addToCart(${p.id})"
              aria-label="Agregar al carrito: ${p.brand} ${p.name}">
              + Carrito
            </button>
          </div>
        </div>

      </article>
    `;
  }).join('');
}

// ══════════════════════════════════════════════
//  FILTROS — FUNCIONALES
// ══════════════════════════════════════════════
function toggleChip(el) {
  el.classList.toggle('active');
  el.setAttribute('aria-pressed', el.classList.contains('active'));
}

function applyFilters() {
  // Familias seleccionadas
  const familias = Array.from(document.querySelectorAll('#filter-familia-group .chip.active'))
    .map(c => c.textContent.trim());

  // Intensidades
  const intensidades = Array.from(document.querySelectorAll('#filter-intensidad-group .chip.active'))
    .map(c => c.textContent.trim());

  // Tipos
  const tipos = Array.from(document.querySelectorAll('#filter-tipo-group .chip.active'))
    .map(c => c.textContent.trim());

  // Precio máximo
  const precioMax = parseInt(document.getElementById('price-range').value);

  let filtrados = productos.filter(function(p) {
    const pasaFamilia   = familias.length === 0    || familias.includes(p.familia);
    const pasaIntensidad= intensidades.length === 0 || intensidades.includes(p.intensidad);
    const pasaTipo      = tipos.length === 0        || tipos.includes(p.tipo);
    const pasaPrecio    = p.precioNum <= precioMax;
    return pasaFamilia && pasaIntensidad && pasaTipo && pasaPrecio;
  });

  // Ordenar
  const sortVal = document.getElementById('sort-select') ? document.getElementById('sort-select').value : '';
  if (sortVal === 'precio-asc')  filtrados.sort((a, b) => a.precioNum - b.precioNum);
  if (sortVal === 'precio-desc') filtrados.sort((a, b) => b.precioNum - a.precioNum);

  // Actualizar contador
  const countEl = document.getElementById('productos-count');
  if (countEl) countEl.textContent = filtrados.length;

  renderProductos('product-grid-catalogo', filtrados);
  showToast(`✓ ${filtrados.length} perfume${filtrados.length !== 1 ? 's' : ''} encontrado${filtrados.length !== 1 ? 's' : ''}`);
}

function resetFilters() {
  document.querySelectorAll('.chip').forEach(function(chip) {
    chip.classList.remove('active');
    chip.setAttribute('aria-pressed', 'false');
  });
  const range = document.getElementById('price-range');
  if (range) {
    range.value = 300;
    const valEl = document.getElementById('price-val');
    if (valEl) valEl.textContent = '$300';
  }
  const countEl = document.getElementById('productos-count');
  if (countEl) countEl.textContent = productos.length;
  renderProductos('product-grid-catalogo', productos);
  showToast('Filtros limpiados');
}

// ══════════════════════════════════════════════
//  BUSCADOR EN CATÁLOGO
// ══════════════════════════════════════════════
function buscarProductos(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    renderProductos('product-grid-catalogo', productos);
    const countEl = document.getElementById('productos-count');
    if (countEl) countEl.textContent = productos.length;
    return;
  }
  const filtrados = productos.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.familia.toLowerCase().includes(q) ||
    p.salida.toLowerCase().includes(q) ||
    p.fondo.toLowerCase().includes(q)
  );
  const countEl = document.getElementById('productos-count');
  if (countEl) countEl.textContent = filtrados.length;
  renderProductos('product-grid-catalogo', filtrados);
}

// ══════════════════════════════════════════════
//  COMPARADOR
// ══════════════════════════════════════════════
function toggleCompare(id, containerId) {
  const index = compareList.indexOf(id);

  if (index > -1) {
    compareList.splice(index, 1);
  } else {
    if (compareList.length >= 2) {
      showToast('Máximo 2 perfumes para comparar. Quita uno primero.');
      return;
    }
    compareList.push(id);
  }

  updateComparadorBar();
  // Re-render el grid correcto
  if (containerId === 'product-grid-catalogo') {
    const countEl = document.getElementById('productos-count');
    const currentCount = countEl ? parseInt(countEl.textContent) : productos.length;
    renderProductos(containerId, productos); // simple re-render con todos
  } else {
    renderProductos(containerId, productos);
  }
}

function updateComparadorBar() {
  const bar = document.getElementById('comparador-bar');
  if (!bar) return;

  if (compareList.length > 0) {
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }

  for (let i = 0; i < 2; i++) {
    const slot = document.getElementById('slot-' + i);
    if (!slot) continue;
    const producto = compareList[i] ? productos.find(function(x) { return x.id === compareList[i]; }) : null;

    if (producto) {
      slot.textContent = producto.emoji + ' ' + producto.name;
      slot.classList.add('filled');
    } else {
      slot.textContent = 'Selecciona un perfume';
      slot.classList.remove('filled');
    }
  }
}

function openComparador() {
  if (compareList.length < 2) {
    showToast('Selecciona 2 perfumes para comparar');
    return;
  }

  const a = productos.find(function(p) { return p.id === compareList[0]; });
  const b = productos.find(function(p) { return p.id === compareList[1]; });

  // Llenar encabezados
  document.getElementById('compare-name-0').textContent = a.emoji + ' ' + a.brand + ' ' + a.name;
  document.getElementById('compare-name-1').textContent = b.emoji + ' ' + b.brand + ' ' + b.name;

  // Llenar datos de la tabla
  const campos = ['familia', 'tipo', 'duracion', 'intensidad', 'salida', 'fondo', 'precio'];
  campos.forEach(function(campo) {
    const el0 = document.getElementById('cf-0-' + campo);
    const el1 = document.getElementById('cf-1-' + campo);
    if (el0) el0.textContent = a[campo];
    if (el1) el1.textContent = b[campo];
  });

  // Destacar diferencias
  campos.forEach(function(campo) {
    const el0 = document.getElementById('cf-0-' + campo);
    const el1 = document.getElementById('cf-1-' + campo);
    if (el0 && el1) {
      el0.style.color = '';
      el1.style.color = '';
      if (a[campo] !== b[campo]) {
        el0.style.color = 'var(--gold)';
        el1.style.color = 'var(--gold)';
      }
    }
  });

  document.getElementById('modal-comparador').classList.add('open');
}

// ══════════════════════════════════════════════
//  MODAL: DETALLE DE PRODUCTO
// ══════════════════════════════════════════════
function openProducto(id) {
  const p = productos.find(function(x) { return x.id === id; });
  if (!p) return;

  let intensidadPct = 65;
  if (p.intensidad === 'Ligero')  intensidadPct = 35;
  if (p.intensidad === 'Moderado') intensidadPct = 65;
  if (p.intensidad === 'Intenso') intensidadPct = 92;

  let duracionPct = 60;
  if (p.duracion === '4h')  duracionPct = 40;
  if (p.duracion === '5h')  duracionPct = 50;
  if (p.duracion === '6h')  duracionPct = 60;
  if (p.duracion === '7h')  duracionPct = 70;
  if (p.duracion === '8h+') duracionPct = 85;
  if (p.duracion === '10h+') duracionPct = 100;

  document.getElementById('product-detail-title').textContent = p.brand + ' — ' + p.name;

  document.getElementById('product-detail-content').innerHTML = `
    <div class="product-detail-img" aria-label="Imagen de ${p.brand} ${p.name}">
      <img src="${p.imagen}" alt="${p.brand} ${p.name}" style="max-width:100%; max-height:260px; object-fit:contain;">
    </div>
    <div class="product-detail-info">
      <p class="product-detail-brand">${p.brand}</p>
      <h3 style="font-family:'Cormorant Garamond',serif; font-size:1.9rem; font-weight:300; margin-bottom:.3rem;">${p.name}</h3>
      <p style="color:var(--text-2); font-size:.85rem; margin-bottom:1.2rem;">${p.familia} · ${p.tipo}</p>

      <div class="notes-section">
        <p class="notes-title">Nota de salida</p>
        <div class="notes-pills">
          <span class="note-pill">${p.salida}</span>
        </div>
      </div>

      <div class="notes-section">
        <p class="notes-title">Nota de corazón</p>
        <div class="notes-pills">
          <span class="note-pill">${p.corazon}</span>
        </div>
      </div>

      <div class="notes-section">
        <p class="notes-title">Nota de fondo</p>
        <div class="notes-pills">
          <span class="note-pill">${p.fondo}</span>
        </div>
      </div>

      <div style="margin:1rem 0;">
        <div class="rating-bar">
          <span class="rating-label">Duración</span>
          <div class="rating-track">
            <div class="rating-fill" style="width:${duracionPct}%;"></div>
          </div>
          <span style="font-size:.78rem; color:var(--gold); margin-left:.5rem;">${p.duracion}</span>
        </div>
        <div class="rating-bar">
          <span class="rating-label">Intensidad</span>
          <div class="rating-track">
            <div class="rating-fill" style="width:${intensidadPct}%;"></div>
          </div>
          <span style="font-size:.78rem; color:var(--gold); margin-left:.5rem;">${p.intensidad}</span>
        </div>
      </div>

      <div class="price-row">
        <span class="price-big">${p.precio}</span>
        <button
          class="add-to-cart-btn"
          onclick="addToCart(${p.id}); closeModal('modal-producto')"
          aria-label="Agregar ${p.name} al carrito de compras">
          Agregar al carrito
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-producto').classList.add('open');
}

// ══════════════════════════════════════════════
//  CERRAR MODALES
// ══════════════════════════════════════════════
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal('modal-comparador');
    closeModal('modal-producto');
  }
});

// ══════════════════════════════════════════════
//  CARRITO
// ══════════════════════════════════════════════
function addToCart(idOrName) {
  let nombre;
  if (typeof idOrName === 'number') {
    const p = productos.find(x => x.id === idOrName);
    nombre = p ? p.brand + ' ' + p.name : idOrName;
    if (p) carrito.push(p);
  } else {
    nombre = idOrName;
  }
  updateCartBadge();
  showToast('✓ ' + nombre + ' agregado al carrito');
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = carrito.length;
    badge.setAttribute('aria-label', carrito.length + ' productos');
  }
}

// ══════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

// ══════════════════════════════════════════════
//  FORMULARIO DE CONTACTO
// ══════════════════════════════════════════════
function enviarContacto(form) {
  const nombre  = form.querySelector('input[type="text"]').value.trim();
  const correo  = form.querySelector('input[type="email"]').value.trim();
  const mensaje = form.querySelector('textarea').value.trim();

  if (!nombre || !correo || !mensaje) {
    showToast('⚠️ Por favor completa todos los campos');
    return;
  }
  if (!correo.includes('@') || !correo.includes('.')) {
    showToast('⚠️ Correo no válido');
    return;
  }

  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  showToast('Enviando mensaje...');

  setTimeout(function() {
    showToast('✅ Mensaje enviado correctamente');
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje';
  }, 1500);
}

// ══════════════════════════════════════════════
//  GUÍA OLFATIVA — Filtrar por familia al hacer clic
// ══════════════════════════════════════════════
function filtrarPorFamilia(familia) {
  showPage('catalogo');
  // Desactivar todos los chips de familia y activar el seleccionado
  setTimeout(function() {
    document.querySelectorAll('#filter-familia-group .chip').forEach(function(chip) {
      if (chip.textContent.trim() === familia) {
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
      } else {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      }
    });
    applyFilters();
  }, 100);
}

// ══════════════════════════════════════════════
//  INICIALIZACIÓN
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  renderProductos('product-grid-home', productos);

  // Sincronizar badge del carrito inicial
  updateCartBadge();

  // Rango de precio: actualizar label en tiempo real
  const rangeInput = document.getElementById('price-range');
  if (rangeInput) {
    rangeInput.addEventListener('input', function() {
      const valEl = document.getElementById('price-val');
      if (valEl) valEl.textContent = '$' + this.value;
    });
  }

  // Buscador en catálogo
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      buscarProductos(this.value);
    });
  }

  // Ordenar
  const sortSel = document.getElementById('sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', function() {
      applyFilters();
    });
  }
});
