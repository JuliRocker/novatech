// Cleaned script.js — single copy. Fetches productos.json and renders products + favorites
let productosGlobal = [];

// --- Utilities: toast + fav count ---
function showToast(message, timeout = 2500) {
  const container = document.getElementById('toast-container');
  if (!container) return alert(message);

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  container.appendChild(t);

  // Force reflow to enable transition
  void t.offsetWidth;
  t.classList.add('show');

  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => {
      if (container.contains(t)) container.removeChild(t);
    }, 300);
  }, timeout);
}

function updateFavCount() {
  const span = document.getElementById('fav-count');
  if (!span) return;
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  span.textContent = favoritos.length;
}

// --- Carga y render de productos ---
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    productosGlobal = Array.isArray(data) ? data : [];
    console.log('productosGlobal cargados:', productosGlobal);
    if (!productosGlobal.length) {
      const cont = document.getElementById('productos');
      if (cont) cont.innerHTML = '<p>No hay productos para mostrar.</p>';
    } else {
      mostrarProductos(productosGlobal);
    }
    updateFavCount();
  })
  .catch(err => {
    console.error('Error cargando productos:', err);
    const contenedor = document.getElementById('productos');
    if (contenedor) contenedor.innerHTML = '<p>No se pudieron cargar los productos. Revisa la consola.</p>';
  });

function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  if (!productos || productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos para mostrar.</p>';
    return;
  }

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('card');

    // Use safe interpolation for attributes
    const imgSrc = producto.imagen || 'img/placeholder.png';
    // Determine favorite state
    const nombreEsc = producto.nombre.replace(/'/g, "\\'");
    const isFav = (JSON.parse(localStorage.getItem('favoritos')) || []).some(f => (typeof f === 'string' ? f === producto.nombre : f && f.nombre === producto.nombre));

    card.innerHTML = `
      <img src="${imgSrc}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <div class="card-buttons">
        <button type="button" class="fav-btn ${isFav ? 'favorited' : ''}" data-nombre="${producto.nombre}" onclick="toggleFavorito('${nombreEsc}')"> <span class="heart">❤</span> <span class="fav-text">${isFav ? 'Favorito' : 'Agregar a favoritos'}</span></button>
        <button type="button" onclick="verMas('${nombreEsc}')">Ver más</button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// 🔍 BUSCADOR
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const texto = e.target.value.toLowerCase();
      const filtrados = productosGlobal.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
      mostrarProductos(filtrados);
    });
  }

  // Inicializar contador
  updateFavCount();

  // Si la URL contiene #productos al cargar, hacer scroll suave a la sección
  if (window.location.hash === '#productos') {
    const el = document.getElementById('productos');
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
  }
});

function agregarFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  if (favoritos.some(f => (typeof f === 'string' ? f === nombre : f && f.nombre === nombre))) {
    // already favorite - keep previous behavior: show toast
    showToast('Este producto ya está en favoritos');
    return;
  }

  const producto = productosGlobal.find(p => p.nombre === nombre);
  if (!producto) return showToast('No se pudo encontrar el producto');

  favoritos.push(producto);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  updateFavCount();
  // update any buttons on the page
  updateFavoriteButtons(nombre, true);
  showToast('Agregado a favoritos');
}

// Check if a product is in favorites
function isFavorito(nombre) {
  const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  return favoritos.some(f => (typeof f === 'string' ? f === nombre : f && f.nombre === nombre));
}

// Toggle favorite state (add/remove) and update button visuals
function toggleFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  const existe = favoritos.some(f => (typeof f === 'string' ? f === nombre : f && f.nombre === nombre));
  if (existe) {
    favoritos = favoritos.filter(f => (typeof f === 'string' ? f !== nombre : f.nombre !== nombre));
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    updateFavCount();
    updateFavoriteButtons(nombre, false);
    showToast('Eliminado de favoritos');
    return;
  }

  const producto = productosGlobal.find(p => p.nombre === nombre);
  if (!producto) return showToast('No se pudo encontrar el producto');

  favoritos.push(producto);
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  updateFavCount();
  updateFavoriteButtons(nombre, true);
  showToast('Agregado a favoritos');
}

function updateFavoriteButtons(nombre, isFav) {
  const selector = `.fav-btn[data-nombre="${nombre}"]`;
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(b => {
    if (isFav) {
      b.classList.add('favorited');
      const t = b.querySelector('.fav-text'); if (t) t.textContent = 'Favorito';
    } else {
      b.classList.remove('favorited');
      const t = b.querySelector('.fav-text'); if (t) t.textContent = 'Agregar a favoritos';
    }
  });
}

function verMas(nombre) {
  const producto = productosGlobal.find(p => p.nombre === nombre);
  if (!producto) return;
  showToast(`${producto.nombre}: ${producto.descripcion}`, 3500);
}
