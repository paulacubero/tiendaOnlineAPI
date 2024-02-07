document.addEventListener('DOMContentLoaded', function () {
  const productosContainer = document.querySelector('#productos-container');
  const carritoLista = document.querySelector('#carrito-lista');
  const totalPrecioContainer = document.getElementById('total-precio');
  const formularioBusqueda = document.getElementById('formulario-busqueda');
  const inputBusqueda = document.getElementById('input-busqueda');

  let productosOriginales = [];

  fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
      let productos = [];

      if (Array.isArray(data)) {
        productos = data;
      } else if (data && data.products) {
        productos = data.products;
      } else {
        console.error('La respuesta de la API no está en un formato esperado.');
        return;
      }

      productosOriginales = productos.slice(17, 29);

      productosOriginales.forEach((producto, index) => {
        const card = document.createElement('div');
        card.id = `producto-${index}`;
        card.className = 'col-md-4 mb-4 custom-card';

        const imagenProducto = producto.images && producto.images.length > 0 ? producto.images[0] : 'https://via.placeholder.com/150';

        card.innerHTML = `
          <div class="card" >
            <img src="${imagenProducto}" class="card-img-top" alt="${producto.title}">
            <div class="card-body text-center">
              <h5 class="card-title">${producto.title}</h5>
              <p class="card-text"><strong>Precio:</strong> €${producto.price.toFixed(2)}</p>
              <button class="btn btn-cart btn-block" onclick="agregarAlCarrito('${producto.title}', ${producto.price})" style="background-color: #c7ac80;">
                    <i class="fas fa-cart-plus"></i> Añadir al Carrito
                </button>
            </div>
          </div>
        `;

        productosContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error al obtener datos de la nueva API de productos:', error));

  formularioBusqueda.addEventListener('submit', function (event) {
    event.preventDefault();

    const terminoBusqueda = inputBusqueda.value.trim().toLowerCase();

    if (!terminoBusqueda) {
      // Si la búsqueda está vacía, mostrar todos los productos originales
      productosContainer.innerHTML = '';
      productosOriginales.forEach((producto, index) => {
        const card = document.createElement('div');
        card.id = `producto-${index}`;
        card.className = 'col-md-4 mb-4 custom-card';

        const imagenProducto = producto.images && producto.images.length > 0 ? producto.images[0] : 'https://via.placeholder.com/150';

        card.innerHTML = `
          <div class="card" >
            <img src="${imagenProducto}" class="card-img-top" alt="${producto.title}">
            <div class="card-body text-center">
              <h5 class="card-title">${producto.title}</h5>
              <p class="card-text"><strong>Precio:</strong> €${producto.price.toFixed(2)}</p>
              <button class="btn btn-primary btn-cart btn-block" onclick="agregarAlCarrito('${producto.title}', ${producto.price})" style="background-color: #c7ac80;">
                <i class="fas fa-cart-plus"></i> Añadir al Carrito
              </button>
            </div>
          </div>
        `;

        productosContainer.appendChild(card);
      });
    } else {
      // Si hay un término de búsqueda, filtrar productos y mostrar los resultados
      const productosFiltrados = productosOriginales.filter(producto =>
        producto.title.toLowerCase().includes(terminoBusqueda)
      );

      productosContainer.innerHTML = '';

      productosFiltrados.forEach(producto => {
        const index = productosOriginales.indexOf(producto);
        const card = document.createElement('div');
        card.id = `producto-${index}`;
        card.className = 'col-md-4 mb-4 custom-card';

        const imagenProducto = producto.images && producto.images.length > 0 ? producto.images[0] : 'https://via.placeholder.com/150';

        card.innerHTML = `
          <div class="card">
            <img src="${imagenProducto}" class="card-img-top" alt="${producto.title}">
            <div class="card-body text-center">
              <h5 class="card-title">${producto.title}</h5>
              <p class="card-text"><strong>Precio:</strong> €${producto.price.toFixed(2)}</p>
              <button class="btn btn-primary btn-cart btn-block" onclick="agregarAlCarrito('${producto.title}', ${producto.price})">
                <i class="fas fa-cart-plus"></i> Añadir al Carrito
              </button>
            </div>
          </div>
        `;

        productosContainer.appendChild(card);
      });
    }
  });

  document.querySelector('.cart-icon').addEventListener('click', function () {
    mostrarCarrito();
  });

  window.agregarAlCarrito = function (nombre, precio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({
      nombre,
      precio
    });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCantidadCarrito(carrito.length);
    actualizarTotalPrecio(carrito);
  };

  function mostrarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoLista.innerHTML = '';

    carrito.forEach(producto => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${producto.nombre} - €${producto.precio.toFixed(2)}`;
      carritoLista.appendChild(li);
    });

    actualizarTotalPrecio(carrito);
    $('#carritoModal').modal('show');
  }

  function actualizarCantidadCarrito(cantidad) {
    document.querySelector('#carrito-cantidad').textContent = cantidad;
  }

  function actualizarTotalPrecio(carrito) {
    const totalPrecio = carrito.reduce((total, producto) => total + producto.precio, 0);
    totalPrecioContainer.textContent = `Total: €${totalPrecio.toFixed(2)}`;
  }

  // Botón para borrar historial
  const btnBorrarHistorial = document.getElementById('btn-borrar-historial');
  btnBorrarHistorial.addEventListener('click', function () {
    borrarHistorial();
  });
});

// Borrar historial
function borrarHistorial() {
  // Obtén la referencia a la lista de elementos del carrito
  var carritoLista = document.getElementById('carrito-lista');

  // Borra todos los elementos hijos de la lista
  while (carritoLista.firstChild) {
    carritoLista.removeChild(carritoLista.firstChild);
  }

  // También puedes reiniciar el contador de cantidad en el icono del carrito
  var carritoCantidad = document.getElementById('carrito-cantidad');
  carritoCantidad.innerText = '0';

  // Elimina el historial del carrito de la memoria local
  localStorage.removeItem('carrito');

  // Cierra el modal después de borrar el historial
  $('#carritoModal').modal('hide');
}
