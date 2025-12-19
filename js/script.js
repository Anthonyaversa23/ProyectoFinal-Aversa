let menu = [];

const productoSelect = document.getElementById("productoSelect");
const cantidadInput = document.getElementById("cantidadInput");
const agregarBtn = document.getElementById("agregarBtn");
const listaCarrito = document.getElementById("listaCarrito");
const totalHTML = document.getElementById("total");
const vaciarBtn = document.getElementById("vaciarBtn");
const finalizarBtn = document.getElementById("finalizarBtn");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Cargar menú desde JSON
async function cargarMenuDesdeJSON() {
    try {
        const respuesta = await fetch("data/menu.json");
        menu = await respuesta.json();
        cargarMenu();
    } catch (error) {
        console.error("Error al cargar el menú");
    }
}

function cargarMenu() {
    productoSelect.innerHTML = "";
    menu.forEach((producto, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${producto.nombre} - $${producto.precio}`;
        productoSelect.appendChild(option);
    });
}

function agregarAlCarrito() {
    const index = productoSelect.value;
    const cantidad = parseInt(cantidadInput.value);

    if (cantidad <= 0) return;

    const item = {
        nombre: menu[index].nombre,
        precio: menu[index].precio,
        cantidad,
        subtotal: cantidad * menu[index].precio
    };

    carrito.push(item);
    guardarCarrito();
    renderCarrito();

    Swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: `${cantidad} x ${item.nombre}`,
        timer: 1200,
        showConfirmButton: false
    });
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.cantidad} x ${item.nombre} — $${item.subtotal}`;
        listaCarrito.appendChild(li);
        total += item.subtotal;
    });

    totalHTML.textContent = `Total: $${total}`;
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderCarrito();

    Swal.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "Se eliminaron todos los productos"
    });
}

function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Carrito vacío",
            text: "Agregá productos antes de finalizar la compra"
        });
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Compra realizada",
        text: "Gracias por tu pedido en Vita Café ☕"
    });

    carrito = [];
    guardarCarrito();
    renderCarrito();
}

// Eventos
agregarBtn.addEventListener("click", agregarAlCarrito);
vaciarBtn.addEventListener("click", vaciarCarrito);
finalizarBtn.addEventListener("click", finalizarCompra);

// Inicializar
cargarMenuDesdeJSON();
renderCarrito();
