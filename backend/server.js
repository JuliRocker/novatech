const express = require('express'); 
const cors = require('cors'); 
const app = express(); 
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

// Catálogo de productos de la tienda Novatech 
const productos = [ 
    { id: 1, nombre: 'Laptop Novatech Pro', precio: 1200, categoria: 'Portátiles' }, 
    { id: 2, nombre: 'Mouse Inalámbrico RGB', precio: 25, categoria: 'Accesorios' }, 
    { id: 3, nombre: 'Teclado Mecánico', precio: 75, categoria: 'Periféricos' }, 
    { id: 4, nombre: 'Monitor 27" 4K', precio: 350, categoria: 'Pantallas' }
];

app.get('/api/productos', (req, res) => { 
    res.json(productos); 
}); 
app.get('/', (req, res) => { 
    res.send('API de Novatech funcionando correctamente 🚀'); 
}); 
app.listen(PORT, () => { 
    console.log(`Servidor backend de Novatech corriendo en el puerto ${PORT}`); 
});