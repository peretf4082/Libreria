import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
<<<<<<< HEAD
import { model } from "../../model/model.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

=======
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
>>>>>>> origin/felipe-dev

export class AdminPerfilPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

<<<<<<< HEAD
  get admin(){
    return model.getAdmins();
  }

=======
>>>>>>> origin/felipe-dev
  get dniInput() {
    return document.querySelector('#dniInput');
  }

<<<<<<< HEAD
  get dniInputText() {
    return this.dniInput.value;
  }

=======
>>>>>>> origin/felipe-dev
  get nombreInput() {
    return document.querySelector('#nombreInput');
  }

<<<<<<< HEAD
  get nombreInputText() {
    return this.nombreInput.value;
  }

=======
>>>>>>> origin/felipe-dev
  get apellidosInput() {
    return document.querySelector('#apellidosInput');
  }

<<<<<<< HEAD
  get apellidosInputText() {
    return this.apellidosInput.value;
  }

=======
>>>>>>> origin/felipe-dev
  get direccionInput() {
    return document.querySelector('#direccionArea');
  }

<<<<<<< HEAD
  get direccionInputText() {
    return this.direccionInput.value;
  }

=======
>>>>>>> origin/felipe-dev
  get emailInput() {
    return document.querySelector('#emailInput');
  }

<<<<<<< HEAD
  get emailInputText() {
    return this.emailInput.value;
  }

=======
>>>>>>> origin/felipe-dev
  get contrasenaInput() {
    return document.querySelector('#contrasenaInput');
  }

<<<<<<< HEAD
  get contrasenaInputText() {
    return this.contrasenaInput.value;
  }

=======
>>>>>>> origin/felipe-dev
  get guardarInput() {
    return document.querySelector('#guardarInput');
  }

  set perfil(admin) {
    this.dniInput.value = admin.dni;
    this.nombreInput.value = admin.nombre;
    this.apellidosInput.value = admin.apellidos;
    this.direccionInput.value = admin.direccion;
    this.emailInput.value = admin.email;
<<<<<<< HEAD
    this.contrasenaInput.value = admin.contrasena;
=======
    this.contrasenaInput.value = admin.password;
>>>>>>> origin/felipe-dev
  }

  async guardarClick(event) {
    event.preventDefault();

<<<<<<< HEAD
    let perfilModificado = {
      dni: this.dniInputText.trim(),
      nombre: this.nombreInputText.trim(),
      apellidos: this.apellidosInputText.trim(),
      direccion: this.direccionInputText.trim(),
      email: this.emailInputText.trim(),
      contrasena: this.contrasenaInputText.trim()
    };

    //añadir
=======
    const perfilModificado = {
      _id: libreriaSession.getUsuarioId(),
      dni: this.dniInput.value.trim(),
      nombre: this.nombreInput.value.trim(),
      apellidos: this.apellidosInput.value.trim(),
      direccion: this.direccionInput.value.trim(),
      email: this.emailInput.value.trim(),
      password: this.contrasenaInput.value.trim(),
      rol: this.model.getUsuarioPorId(libreriaSession.getUsuarioId()).rol
    };

    try {
      await this.model.updateUsuario(perfilModificado);
      this.mensajesPresenter.mensaje("Perfil modificado");
      router.navigate('/libreria/admin-home.html');
    } catch (e) {
      this.mensajesPresenter.error("No se ha podido actualizar el perfil.");
    }
>>>>>>> origin/felipe-dev
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
<<<<<<< HEAD

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
=======
    
    const adminId = libreriaSession.getUsuarioId();
    const admin = await this.model.getUsuarioPorId(adminId);
    
    if (admin) {
      this.perfil = admin;
    } else {
      this.mensajesPresenter.error("Administrador no encontrado");
    }

    this.guardarInput.onclick = (event) => this.guardarClick(event);
  }
}
>>>>>>> origin/felipe-dev
