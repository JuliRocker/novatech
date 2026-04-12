// Ficha de producto: favoritos y carrito (usa script.js)

window.onProductosLoaded = function (productos) {
  const root = document.getElementById('detalle-root');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const nombre = params.get('nombre');
  const producto = nombre
    ? productos.find(function (p) {
        return p.nombre === nombre;
      })
    : null;

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (!producto) {
    root.innerHTML =
      '<div class="detalle-error">' +
      '<p>Producto no encontrado.</p>' +
      '<a class="detalle-volver" href="catalogo.html">Volver al catálogo</a>' +
      '</div>';
    return;
  }

  const imgSrc = producto.imagen || 'img/placeholder.png';
  const isFav = (JSON.parse(localStorage.getItem('favoritos')) || []).some(function (f) {
    return typeof f === 'string' ? f === producto.nombre : f.nombre === producto.nombre;
  });

  root.innerHTML =
    '<a class="detalle-volver" href="catalogo.html">← Volver al catálogo</a>' +
    '<article class="producto-detalle">' +
    '<img src="' +
    escapeHtml(imgSrc) +
    '" alt="' +
    escapeHtml(producto.nombre) +
    '">' +
    '<div class="producto-detalle-info">' +
    '<h1>' +
    escapeHtml(producto.nombre) +
    '</h1>' +
    '<p class="detalle-desc">' +
    escapeHtml(producto.descripcion || '') +
    '</p>' +
    '<div class="detalle-caract"><strong>Características:</strong>' +
    '<p class="caract-body">' +
    escapeHtml(producto.caracteristicas || 'Información no disponible') +
    '</p></div>' +
    '<div class="detalle-acciones">' +
    '<button type="button" class="fav-btn ' +
    (isFav ? 'favorited' : '') +
    '" id="btn-fav-detalle" data-nombre="' +
    escapeHtml(producto.nombre).replace(/"/g, '&quot;') +
    '">' +
    '<span class="heart">❤</span> ' +
    '<span class="fav-text">' +
    (isFav ? 'Favorito' : 'Agregar a favoritos') +
    '</span></button>' +
    '<button type="button" id="btn-carrito-detalle">Agregar al carrito</button>' +
    '</div></div></article>';

  const btnFav = document.getElementById('btn-fav-detalle');
  const btnCarrito = document.getElementById('btn-carrito-detalle');

  if (btnFav) {
    btnFav.addEventListener('click', function () {
      if (typeof toggleFavorito === 'function') {
        toggleFavorito(producto.nombre);
      }
    });
  }

  if (btnCarrito && typeof agregarAlCarrito === 'function') {
    btnCarrito.addEventListener('click', function () {
      const copia = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        imagen: producto.imagen,
        caracteristicas: producto.caracteristicas
      };
      agregarAlCarrito(copia);
    });
  }
};
