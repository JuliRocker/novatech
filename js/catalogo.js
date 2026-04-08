// Catálogo: mismas cards que index; clic en la tarjeta abre el detalle (no en los botones)

window.onProductosLoaded = function (productos) {
  const contenedor = document.getElementById('catalogo-productos');
  if (!contenedor) return;

  function render(lista) {
    contenedor.innerHTML = '';
    if (!lista.length) {
      contenedor.innerHTML =
        '<p class="subtitulo catalogo-sin-resultados">No hay productos que coincidan con la búsqueda.</p>';
      return;
    }

    lista.forEach(function (producto) {
      const card = document.createElement('div');
      card.classList.add('card', 'card--clickable');

      const imgSrc = producto.imagen || 'img/placeholder.png';
      const nombreEsc = producto.nombre.replace(/'/g, "\\'");

      const isFav = (JSON.parse(localStorage.getItem('favoritos')) || []).some(function (f) {
        return typeof f === 'string' ? f === producto.nombre : f.nombre === producto.nombre;
      });

      card.innerHTML =
        '<img src="' +
        imgSrc +
        '" alt="' +
        producto.nombre +
        '">' +
        '<h3>' +
        producto.nombre +
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
        '<button type="button" class="fav-btn ' +
        (isFav ? 'favorited' : '') +
        '" data-nombre="' +
        producto.nombre +
        '" ' +
        'onclick="toggleFavorito(\'' +
        nombreEsc +
        '\')">' +
        '<span class="heart">❤</span> ' +
        '<span class="fav-text">' +
        (isFav ? 'Favorito' : 'Agregar a favoritos') +
        '</span></button>' +
        '<button type="button" onclick="verMas(this)">Ver más</button>' +
        '</div>';

      card.addEventListener('click', function (e) {
        if (e.target.closest('.card-buttons')) return;
        window.location.href =
          'producto-detalle.html?nombre=' + encodeURIComponent(producto.nombre);
      });

      contenedor.appendChild(card);
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
