import { Presenter } from "../../commons/presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { model } from "../../model/model.mjs";
import { mensajes } from "../../commons/mensajes.mjs";

export class ClienteComprarPresenter extends Presenter {
    constructor(model, view) {
        super(model, view);
    }

    async refresh() {
        this.cargarDatosCliente();
        this.cargarCarrito();
        this.calcularTotal();
        document.querySelector('#pagarButton').onclick = () => this.pagarCompra();
    }

    cargarDatosCliente() {
        const usuario = libreriaSession.getUsuarioId();
        const cliente = model.getClientePorId(usuario);

        document.getElementById('razonSocialInput').value = cliente.nombre;
        document.getElementById('dniInput').value = cliente.dni;
        document.getElementById('direccionInput').value = cliente.direccion;
        document.getElementById('emailInput').value = cliente.email;
        document.getElementById('fechaInput').value = new Date().toISOString().split('T')[0];
    }

    cargarCarrito() {
        const carrito = libreriaSession.obtenerCarro();
        const tbody = document.querySelector('#detalleCompra tbody');
        tbody.innerHTML = ''; // Vaciar el contenido previo

        carrito.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.cantidad}</td>
                <td>${item.libro.titulo}</td>
                <td>${item.libro.precio.toFixed(2)}</td>
                <td>${(item.cantidad * item.libro.precio).toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    calcularTotal() {
        const carrito = libreriaSession.obtenerCarro();
        let subtotal = carrito.reduce((sum, item) => sum + item.cantidad * item.libro.precio, 0);
        let iva = subtotal * 0.21;  // 21% IVA
        let total = subtotal + iva;

        document.getElementById("ivaTotal").textContent = iva.toFixed(2);
        document.getElementById("totalCompra").textContent = total.toFixed(2);
    }

    pagarCompra() {
        try {
            const carrito = libreriaSession.obtenerCarro();
            if (carrito.length === 0) throw new Error("El carrito está vacío.");

            const total = parseFloat(document.getElementById("totalCompra").textContent);
            const iva = parseFloat(document.getElementById("ivaTotal").textContent);

            model.facturarCompraCliente({
                cliente: libreriaSession.getUsuarioId(),
                items: carrito,
                total: total,
                iva: iva,
            });

            libreriaSession.limpiarCarro();  // Limpia el carrito después de pagar
            mensajes.mensaje("Compra realizada con éxito.");
            window.location.href = 'cliente-compras.html';

        } catch (error) {
            mensajes.error("No se pudo realizar la compra: " + error.message);
        }
    }
}
