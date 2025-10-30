import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";

export class ClientePerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get dniInput() {
    return document.querySelector('#dniInput');
  }

  get nombreInput() {
    return document.querySelector('#nombreInput');
  }

  get apellidosInput() {
    return document.querySelector('#apellidosInput');
  }

  get direccionInput() {
    return document.querySelector('#direccionArea');
  }

  get emailInput() {
    return document.querySelector('#emailInput');
  }

  get contrasenaInput() {
    return document.querySelector('#contrasenaInput');
  }

  get guardarInput() {
    return document.querySelector('#guardarInput');
  }

  set perfil(cliente) {
    this.dniInput.value = cliente.dni;
    this.nombreInput.value = cliente.nombre;
    this.apellidosInput.value = cliente.apellidos;
    this.direccionInput.value = cliente.direccion;
    this.emailInput.value = cliente.email;
    this.contrasenaInput.value = cliente.password;
  }

  async guardarClick(event) {
    event.preventDefault();

    const perfilModificado = {
      _id: libreriaSession.getUsuarioId(),
      dni: this.dniInput.value.trim(),
      nombre: this.nombreInput.value.trim(),
      apellidos: this.apellidosInput.value.trim(),
      direccion: this.direccionInput.value.trim(),
      email: this.emailInput.value.trim(),
      password: this.contrasenaInput.value.trim(),
      rol: await this.model.getUsuarioPorId(libreriaSession.getUsuarioId()).rol
    };

    try {
      await this.model.updateUsuario(perfilModificado);
      this.mensajesPresenter.mensaje("Perfil modificado");
      router.navigate('/libreria/cliente-home.html');
    } catch (e) {
      this.mensajesPresenter.error("No se ha podido actualizar el perfil.");
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    const clienteId = libreriaSession.getUsuarioId();
    const cliente = await this.model.getUsuarioPorId(clienteId);

    if (cliente) {
      this.perfil = cliente;
    } else {
      this.mensajesPresenter.error("Cliente no encontrado");
    }

    this.guardarInput.onclick = (event) => this.guardarClick(event);
  }
}
