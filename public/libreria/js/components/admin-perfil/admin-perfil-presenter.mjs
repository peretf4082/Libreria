import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";


export class AdminPerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get admin(){
    return model.getAdmins();
  }

  get dniInput() {
    return document.querySelector('#dniInput');
  }

  get dniInputText() {
    return this.dniInput.value;
  }

  get nombreInput() {
    return document.querySelector('#nombreInput');
  }

  get nombreInputText() {
    return this.nombreInput.value;
  }

  get apellidosInput() {
    return document.querySelector('#apellidosInput');
  }

  get apellidosInputText() {
    return this.apellidosInput.value;
  }

  get direccionInput() {
    return document.querySelector('#direccionArea');
  }

  get direccionInputText() {
    return this.direccionInput.value;
  }

  get emailInput() {
    return document.querySelector('#emailInput');
  }

  get emailInputText() {
    return this.emailInput.value;
  }

  get contrasenaInput() {
    return document.querySelector('#contrasenaInput');
  }

  get contrasenaInputText() {
    return this.contrasenaInput.value;
  }

  get guardarInput() {
    return document.querySelector('#guardarInput');
  }

  set perfil(admin) {
    this.dniInput.value = admin.dni;
    this.nombreInput.value = admin.nombre;
    this.apellidosInput.value = admin.apellidos;
    this.direccionInput.value = admin.direccion;
    this.emailInput.value = admin.email;
    this.contrasenaInput.value = admin.contrasena;
  }

  async guardarClick(event) {
    event.preventDefault();

    let perfilModificado = {
      dni: this.dniInputText.trim(),
      nombre: this.nombreInputText.trim(),
      apellidos: this.apellidosInputText.trim(),
      direccion: this.direccionInputText.trim(),
      email: this.emailInputText.trim(),
      contrasena: this.contrasenaInputText.trim()
    };

    //añadir
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    console.log(model.getAdmins());

    const libro = await this.getLibro();
    if (libro) {
      this.libro = libro; // Carga el libro en los campos del formulario
    } else {
      this.mensajesPresenter.error("Libro no encontrado");
      console.log("Libro no encontrado para el ID:", this.id);
    }

    document.querySelector('#guardarInput').onclick = (event) => this.guardarClick(event);
  }
}