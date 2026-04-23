// ══════════════════════════════════════════════
//  DATOS DE PRODUCTOS
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
      precio: '$185',
      salida: 'Ylang-ylang',
      fondo: 'Sándalo',
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
      precio: '$245',
      salida: 'Cardamomo',
      fondo: 'Vetiver',
      badge: null
    },
    {
      id: 3,
      imagen: 'img/acqua.png',
      brand: 'Acqua di Parma',
      name: 'Colonia',
      familia: 'Cítrico',
      tipo: 'EdC',
      duracion: '4h',
      intensidad: 'Ligero',
      precio: '$98',
      salida: 'Limón',
      fondo: 'Vetiver',
      badge: 'Nuevo'
    },
    {
      id: 4,
      imagen: 'img/ysl.png',
      brand: 'YSL',
      name: 'Black Opium',
      familia: 'Oriental',
      tipo: 'EdP',
      duracion: '7h',
      intensidad: 'Intenso',
      precio: '$120',
      salida: 'Café',
      fondo: 'Vainilla',
      badge: null
    },
    {
      id: 5,
      imagen: 'img/dior.png',
      brand: 'Dior',
      name: 'Sauvage',
      familia: 'Acuático',
      tipo: 'EdT',
      duracion: '6h',
      intensidad: 'Moderado',
      precio: '$110',
      salida: 'Bergamota',
      fondo: 'Ámbar',
      badge: 'Top ventas'
    },
    {
      id: 6,
      imagen: 'img/jomalone.png',
      brand: 'Jo Malone',
      name: 'Rose & White Musk',
      familia: 'Floral',
      tipo: 'EdC',
      duracion: '5h',
      intensidad: 'Ligero',
      precio: '$135',
      salida: 'Rosa',
      fondo: 'Almizcle',
      badge: 'Nuevo'
    }
  ];
  
  // Lista de productos seleccionados para comparar (máximo 2)
  let compareList = [];
  
  // ══════════════════════════════════════════════
  //  NAVEGACIÓN ENTRE PÁGINAS
  // ══════════════════════════════════════════════
  function showPage(page) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(function(p) {
      p.classList.remove('active');
    });
  
    // Mostrar la página seleccionada
    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
    }
  
    // Renderizar productos si es necesario
    if (page === 'catalogo') {
      renderProductos('product-grid-catalogo');
    }
  
    if (page === 'home') {
      renderProductos('product-grid-home');
    }
  
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // ══════════════════════════════════════════════
  //  RENDERIZAR TARJETAS DE PRODUCTOS
  // ══════════════════════════════════════════════
  function renderProductos(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    container.innerHTML = productos.map(function(p) {
      const isSelected = compareList.includes(p.id);
  
      const badgeHTML = p.badge
        ? '<span class="product-badge ' + (p.badge === 'Nuevo' ? 'new' : '') + '" aria-label="Etiqueta: ' + p.badge + '">' + p.badge + '</span>'
        : '';
  
      return `
        <article class="product-card"
          tabindex="0"
          onclick="openProducto(${p.id})"
          onkeydown="if(event.key === 'Enter') openProducto(${p.id})"
          aria-label="${p.brand} ${p.name}, ${p.familia}, ${p.precio}">
  
          ${badgeHTML}
  
          <div class="product-img">
        
            <img src="${p.imagen}" alt="${p.brand} ${p.name}">
  
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
                onclick="event.stopPropagation(); addToCart('${p.brand} ${p.name}')"
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
  //  FILTROS
  // ══════════════════════════════════════════════
  function toggleChip(el) {
    el.classList.toggle('active');
    const isActive = el.classList.contains('active');
    el.setAttribute('aria-pressed', isActive);
  }
  
  function resetFilters() {
    document.querySelectorAll('.chip').forEach(function(chip) {
      chip.classList.remove('active');
      chip.setAttribute('aria-pressed', 'false');
    });
    showToast('Filtros limpiados');
  }
  
  // ══════════════════════════════════════════════
  //  COMPARADOR
  // ══════════════════════════════════════════════
  function toggleCompare(id, containerId) {
    const index = compareList.indexOf(id);
  
    if (index > -1) {
      // Quitar del comparador
      compareList.splice(index, 1);
    } else {
      // Agregar al comparador (máximo 2)
      if (compareList.length >= 2) {
        showToast('Máximo 2 perfumes para comparar. Quita uno primero.');
        return;
      }
      compareList.push(id);
    }
  
    updateComparadorBar();
    renderProductos(containerId);
  }
  
  function updateComparadorBar() {
    const bar = document.getElementById('comparador-bar');
  
    // Mostrar u ocultar la barra
    if (compareList.length > 0) {
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  
    // Actualizar los slots
    for (let i = 0; i < 2; i++) {
      const slot = document.getElementById('slot-' + i);
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
    document.getElementById('compare-name-0').textContent = a.emoji + ' ' + a.name;
    document.getElementById('compare-name-1').textContent = b.emoji + ' ' + b.name;
  
    // Llenar datos de la tabla
    const campos = ['familia', 'tipo', 'duracion', 'intensidad', 'salida', 'fondo', 'precio'];
    campos.forEach(function(campo) {
      document.getElementById('cf-0-' + campo).textContent = a[campo];
      document.getElementById('cf-1-' + campo).textContent = b[campo];
    });
  
    // Abrir modal
    document.getElementById('modal-comparador').classList.add('open');
  }
  
  // ══════════════════════════════════════════════
  //  MODAL: DETALLE DE PRODUCTO
  // ══════════════════════════════════════════════
  function openProducto(id) {
    const p = productos.find(function(x) { return x.id === id; });
    if (!p) return;
  
    // Calcular porcentaje de intensidad
    let intensidadPct = 65;
    if (p.intensidad === 'Ligero') intensidadPct = 40;
    if (p.intensidad === 'Intenso') intensidadPct = 90;
  
    // Actualizar título del modal
    document.getElementById('product-detail-title').textContent = p.brand + ' — ' + p.name;
  
    // Llenar contenido del modal
    document.getElementById('product-detail-content').innerHTML = `
      <div class="product-detail-img" aria-label="Imagen de ${p.brand} ${p.name}">${p.emoji}</div>
      <div class="product-detail-info">
        <p class="product-detail-brand">${p.brand}</p>
        <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.9rem; font-weight: 300; margin-bottom: .3rem;">${p.name}</h3>
        <p style="color: var(--text-2); font-size: .85rem; margin-bottom: 1.2rem;">${p.familia} · ${p.tipo}</p>
  
        <div class="notes-section">
          <p class="notes-title">Nota de salida</p>
          <div class="notes-pills">
            <span class="note-pill">${p.salida}</span>
          </div>
        </div>
  
        <div class="notes-section">
          <p class="notes-title">Nota de fondo</p>
          <div class="notes-pills">
            <span class="note-pill">${p.fondo}</span>
          </div>
        </div>
  
        <div style="margin: 1rem 0;">
          <div class="rating-bar">
            <span class="rating-label">Duración</span>
            <div class="rating-track">
              <div class="rating-fill" style="width: 85%;"></div>
            </div>
            <span style="font-size: .78rem; color: var(--gold); margin-left: .5rem;">${p.duracion}</span>
          </div>
          <div class="rating-bar">
            <span class="rating-label">Intensidad</span>
            <div class="rating-track">
              <div class="rating-fill" style="width: ${intensidadPct}%;"></div>
            </div>
            <span style="font-size: .78rem; color: var(--gold); margin-left: .5rem;">${p.intensidad}</span>
          </div>
        </div>
  
        <div class="price-row">
          <span class="price-big">${p.precio}</span>
          <button
            class="add-to-cart-btn"
            onclick="addToCart('${p.brand} ${p.name}'); closeModal('modal-producto')"
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
    document.getElementById(id).classList.remove('open');
  }
  
  // Cerrar con tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal('modal-comparador');
      closeModal('modal-producto');
    }
  });
  
  // ══════════════════════════════════════════════
  //  CARRITO Y TOAST
  // ══════════════════════════════════════════════
  function addToCart(name) {
    showToast('✓ ' + name + ' agregado al carrito');
  }
  
  function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.add('show');
  
    setTimeout(function() {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // ══════════════════════════════════════════════
  //  INICIALIZACIÓN AL CARGAR LA PÁGINA
  // ══════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', function() {
    // Renderizar productos en el home al cargar
    renderProductos('product-grid-home');
  });