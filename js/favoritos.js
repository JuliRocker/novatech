// favoritos.js — versión limpia y única

// Normaliza y muestra favoritos en #favoritos
function mostrarFavoritos() {
  const contenedor = document.getElementById('favoritos');
  if (!contenedor) return;
  contenedor.innerHTML = '';

  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  // Cargar productos para completar datos cuando sea necesario
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
    card.className = 'card';
    const imgSrc = producto && producto.imagen ? producto.imagen : 'img/placeholder.png';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion || ''}</p>
      <div class="card-buttons">
        <button type="button" onclick="quitarFavorito('${(producto.nombre||'').replace(/'/g,"\\'")}')">Eliminar</button>
        <button type="button" onclick="verMasFavorito('${(producto.nombre||'').replace(/'/g,"\\'")}')">Ver más</button>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

function quitarFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  favoritos = favoritos.filter(f => (typeof f === 'string' ? f !== nombre : f.nombre !== nombre));
  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  if (typeof showToast === 'function') showToast('Producto eliminado de favoritos');
  if (typeof updateFavCount === 'function') updateFavCount();
  mostrarFavoritos();
}

function verMasFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  if (favoritos.length > 0 && typeof favoritos[0] === 'string') {
    fetch('productos.json').then(r => r.json()).then(productos => {
      const producto = productos.find(p => p.nombre === nombre);
      if (producto) {
        if (typeof showToast === 'function') showToast(`${producto.nombre}: ${producto.descripcion}`, 3500);
        else alert(`${producto.nombre}\n\n${producto.descripcion}`);
      }
    });
    return;
  }
  const producto = favoritos.find(p => p.nombre === nombre);
  if (producto) {
    if (typeof showToast === 'function') showToast(`${producto.nombre}: ${producto.descripcion}`, 3500);
    else alert(`${producto.nombre}\n\n${producto.descripcion}`);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  mostrarFavoritos();
});

window.addEventListener('storage', (e) => {
  if (e.key === 'favoritos') mostrarFavoritos();
});
