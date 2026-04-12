// favoritos.js — grid como catálogo; Ver más = verMas(); Eliminar en rojo

function mostrarFavoritos() {
  const contenedor = document.getElementById('favoritos');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  fetch('productos.json')
    .then(r => r.json())
    .then(productos => {
      const mapped = favoritos.map(f => {
        if (typeof f === 'string') return productos.find(p => p.nombre === f) || { nombre: f };
        if (f && typeof f === 'object') {
          if (f.nombre && f.imagen && f.descripcion) return f;
          if (f.nombre) {
            const found = productos.find(p => p.nombre === f.nombre);
            return found ? Object.assign({}, found, f) : Object.assign({ nombre: f.nombre }, f);
          }
          return { nombre: JSON.stringify(f) };
        }
        return { nombre: String(f) };
      }).filter(Boolean);

      renderFavoritos(mapped, contenedor);
      if (typeof updateFavCount === 'function') updateFavCount();
    })
    .catch(err => {
      console.error('Error cargando productos.json:', err);
      renderFavoritos(favoritos, contenedor);
      if (typeof updateFavCount === 'function') updateFavCount();
    });
}

function renderFavoritos(favoritos, contenedor) {
  if (!favoritos || favoritos.length === 0) {
    contenedor.innerHTML = `
      <div class="no-favoritos">
        <p>Aún no tienes productos agregados a favoritos.</p>
        <button id="ir-productos-btn" class="btn-primary">Haz clic aquí</button>
      </div>
    `;
    const btn = contenedor.querySelector('#ir-productos-btn');
    if (btn) btn.addEventListener('click', () => window.location.href = 'catalogo.html');
    return;
  }

  favoritos.forEach(producto => {
    const card = document.createElement('div');
    card.classList.add('card', 'card--clickable');

    const imgSrc = producto && producto.imagen ? producto.imagen : 'img/placeholder.png';
    const nombreEsc = (producto.nombre || '').replace(/'/g, "\\'");

    card.innerHTML =
      '<img src="' +
      imgSrc +
      '" alt="' +
      (producto.nombre || '') +
      '">' +
      '<h3>' +
      (producto.nombre || '') +
      '</h3>' +
      '<p>' +
      (producto.descripcion || '') +
      '</p>' +
      '<div class="extra-info" style="display: none;">' +
      '<p><strong>Características:</strong></p>' +
      '<p>' +
      (producto.caracteristicas || 'Información no disponible') +
      '</p>' +
      '</div>' +
      '<div class="card-buttons">' +
      '<button type="button" class="btn-eliminar-fav" onclick="quitarFavorito(\'' +
      nombreEsc +
      '\')">Eliminar</button>' +
      '<button type="button" onclick="verMas(this)">Ver más</button>' +
      '</div>';

    card.addEventListener('click', function (e) {
      if (e.target.closest('.card-buttons')) return;
      if (!producto.nombre) return;
      window.location.href =
        'producto-detalle.html?nombre=' + encodeURIComponent(producto.nombre);
    });

    contenedor.appendChild(card);
  });
}

function quitarFavorito(nombre) {
  let favoritosList = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritosList = favoritosList.filter(f =>
    (typeof f === 'string' ? f !== nombre : f.nombre !== nombre)
  );
  localStorage.setItem('favoritos', JSON.stringify(favoritosList));
  if (typeof showToast === 'function') showToast('Producto eliminado de favoritos');
  if (typeof updateFavCount === 'function') updateFavCount();
  mostrarFavoritos();
}

document.addEventListener('DOMContentLoaded', () => {
  mostrarFavoritos();
});

window.addEventListener('storage', e => {
  if (e.key === 'favoritos') mostrarFavoritos();
});
