import { ROL } from "../model/model.mjs";

const USUARIO_ID = 'USUARIO_ID';
const USUARIO_ROL = 'USUARIO_ROL';
<<<<<<< HEAD
//Añadido
const CARRO_ID = 'CARRO';
const FACTURAS_ID = 'FACTURAS';
=======
>>>>>>> origin/felipe-dev

class LibreriaSession {

  formatoMoneda;

  constructor() {
    this.formatoMoneda = Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits:2,
      currencySign: "accounting",
    });
  }

  ingreso(usuario) {
    this.setUsuarioId(usuario._id);
    this.setUsuarioRol(usuario.rol);
  }

  setUsuarioId(id) { sessionStorage.setItem(USUARIO_ID, id); }
  getUsuarioId() {
    if (this.esInvitado()) throw new Error('Es un invitado');
    return sessionStorage.getItem(USUARIO_ID);
  }

  setUsuarioRol(rol) { sessionStorage.setItem(USUARIO_ROL, rol); }
  getUsuarioRol() { return sessionStorage.getItem(USUARIO_ROL); }

  salir() {
    sessionStorage.removeItem(USUARIO_ID);
    sessionStorage.removeItem(USUARIO_ROL);
  }

  esInvitado() { return !this.getUsuarioRol(); }
  esCliente() { return !this.esInvitado() && this.getUsuarioRol() == ROL.CLIENTE; }
  esAdmin() { return !this.esInvitado() && this.getUsuarioRol() == ROL.ADMIN; }

  formatearMoneda(valor) {

    return this.formatoMoneda.format(valor);
  }
<<<<<<< HEAD

  //Añadido
  obtenerCarro() {
    const usuarioId = this.getUsuarioId();
    return model.getCarroCliente(usuarioId); // Obtiene el carrito directamente del modelo
  }

  guardarCarro(carrito) {
    const usuarioId = this.getUsuarioId();
    carrito.forEach(item => {
        model.addClienteCarroItem(usuarioId, item); // Agrega cada ítem al carrito del cliente en el modelo
    });
  }

  limpiarCarro() {
    const usuarioId = this.getUsuarioId();
    model.getClientePorId(usuarioId).getCarro().removeItems(); // Vacía el carrito en el modelo
  }
  
  //Añadido
  obtenerFacturas() {
    
    return JSON.parse(sessionStorage.getItem(FACTURAS_ID)) || [];
  }

  guardarFactura(factura) {
    
    let facturas = this.obtenerFacturas();
    facturas.push(factura);
    sessionStorage.setItem(FACTURAS_ID, JSON.stringify(facturas));
  }

  //Añadido
  obtenerDatosCliente() {
    const usuarioId = this.getUsuarioId();
    return model.getClientePorId(usuarioId); // Devuelve los datos completos del cliente
  }

  //Añadido 
  calcularTotalCarrito() {
    const carrito = this.obtenerCarro();
    let subtotal = carrito.reduce((sum, item) => sum + item.cantidad * item.libro.precio, 0);
    let iva = subtotal * 0.21;  // IVA del 21%
    let total = subtotal + iva;
    return { subtotal, iva, total };
  }

=======
>>>>>>> origin/felipe-dev
}

export let libreriaSession = new LibreriaSession();