let productosGlobal = [];

fetch("productos.json")
  .then(response => response.json())
  .then(data => {
    productosGlobal = data;
    mostrarProductos(data);
  });

function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";

  productos.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <button onclick="agregarFavorito('${producto.nombre}')">Ver más</button>
    `;

    contenedor.appendChild(card);
  });
}

// 🔍 BUSCADOR
document.getElementById("search").addEventListener("input", e => {
  const texto = e.target.value.toLowerCase();

  const filtrados = productosGlobal.filter(producto =>
    producto.nombre.toLowerCase().includes(texto)
  );

  mostrarProductos(filtrados);
});

function agregarFavorito(nombre) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos.push(nombre);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  alert("Agregado a favoritos");
}