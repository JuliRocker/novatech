// Catálogo: lista clickeable hacia producto-detalle.html

window.onProductosLoaded = function (productos) {
  const contenedor = document.getElementById('catalogo-productos');
  if (!contenedor) return;

  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render(lista) {
    contenedor.innerHTML = '';
    if (!lista.length) {
      contenedor.innerHTML =
        '<p class="subtitulo catalogo-sin-resultados">No hay productos que coincidan con la búsqueda.</p>';
      return;
    }

    lista.forEach(function (producto) {
      const a = document.createElement('a');
      a.className = 'card card--clickable';
      a.href = 'producto-detalle.html?nombre=' + encodeURIComponent(producto.nombre);
      const imgSrc = producto.imagen || 'img/placeholder.png';
      a.innerHTML =
        '<img src="' +
        escapeHtml(imgSrc) +
        '" alt="' +
        escapeHtml(producto.nombre) +
        '">' +
        '<h3>' +
        escapeHtml(producto.nombre) +
        '</h3>' +
        '<p>' +
        escapeHtml(producto.descripcion || '') +
        '</p>' +
        '<p class="ver-detalle-hint">Ver detalle →</p>';
      contenedor.appendChild(a);
    });
  }

  render(productos);

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const texto = e.target.value.toLowerCase();
      const filtrados = productos.filter(function (p) {
        return p.nombre.toLowerCase().includes(texto);
      });
      render(filtrados);
    });
  }
};
