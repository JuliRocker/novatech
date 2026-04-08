// Cleaned script.js — versión corregida con "Ver más" funcional
let productosGlobal = [];

// --- Utilities: toast + fav count ---
function showToast(message, timeout = 2500) {
  const container = document.getElementById('toast-container');
  if (!container) return alert(message);

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = message;
  container.appendChild(t);

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

function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

function agregarAlCarrito(producto) {
  if (!producto || !producto.nombre) return;
  let items = obtenerCarrito();
  const idx = items.findIndex(function (i) {
    return i.nombre === producto.nombre;
  });
  if (idx >= 0) {
    items[idx].cantidad = (items[idx].cantidad || 1) + 1;
  } else {
    var copia = Object.assign({}, producto);
    copia.cantidad = 1;
    items.push(copia);
  }
  localStorage.setItem('carrito', JSON.stringify(items));
  if (typeof showToast === 'function') showToast('Producto agregado al carrito');
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;
  const items = obtenerCarrito();
  var total = items.reduce(function (s, i) {
    return s + (i.cantidad || 1);
  }, 0);
  el.textContent = total;
}

// --- Carga de productos ---
fetch('productos.json')
  .then(response => response.json())
  .then(data => {
    productosGlobal = Array.isArray(data) ? data : [];
    mostrarProductos(productosGlobal);
    if (typeof window.onProductosLoaded === 'function') {
      try {
        window.onProductosLoaded(productosGlobal);
      } catch (e) {
        console.error(e);
      }
    }
    updateFavCount();
  })
  .catch(err => {
    console.error('Error cargando productos:', err);
  });

// --- Mostrar productos ---
function mostrarProductos(productos) {
  const contenedor = document.getElementById('productos');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  productos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('card');

    const imgSrc = producto.imagen || 'img/placeholder.png';
    const nombreEsc = producto.nombre.replace(/'/g, "\\'");

    const isFav = (JSON.parse(localStorage.getItem('favoritos')) || [])
      .some(f => (typeof f === 'string' ? f === producto.nombre : f.nombre === producto.nombre));

    card.innerHTML = `
      <img src="${imgSrc}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>

      <div class="extra-info" style="display: none;">
        <p><strong>Características:</strong></p>
        <p>${producto.caracteristicas || "Información no disponible"}</p>
      </div>

      <div class="card-buttons">
        <button type="button" class="fav-btn ${isFav ? 'favorited' : ''}" 
          data-nombre="${producto.nombre}" 
          onclick="toggleFavorito('${nombreEsc}')">
          <span class="heart">❤</span> 
          <span class="fav-text">${isFav ? 'Favorito' : 'Agregar a favoritos'}</span>
        </button>

        <button type="button" onclick="verMas(this)">Ver más</button>
      </div>
    `;

    contenedor.appendChild(card);
  });
}

// --- Función Ver más ---
function verMas(boton) {
  const card = boton.closest('.card');
  const info = card.querySelector('.extra-info');

  if (info.style.display === "none") {
    info.style.display = "block";
    boton.textContent = "Ver menos";
  } else {
    info.style.display = "none";
    boton.textContent = "Ver más";
  }
}

// --- Buscador ---
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

  updateFavCount();
  updateCartCount();
});

// --- Favoritos ---
function toggleFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  const existe = favoritos.some(f =>
    (typeof f === 'string' ? f === nombre : f.nombre === nombre)
  );

  if (existe) {
    favoritos = favoritos.filter(f =>
      (typeof f === 'string' ? f !== nombre : f.nombre !== nombre)
    );

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    updateFavCount();
    updateFavoriteButtons(nombre, false);
    showToast('Eliminado de favoritos');
    return;
  }

  const producto = productosGlobal.find(p => p.nombre === nombre);

  if (!producto) return;

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
      const t = b.querySelector('.fav-text');
      if (t) t.textContent = 'Favorito';
    } else {
      b.classList.remove('favorited');
      const t = b.querySelector('.fav-text');
      if (t) t.textContent = 'Agregar a favoritos';
    }
  });
}