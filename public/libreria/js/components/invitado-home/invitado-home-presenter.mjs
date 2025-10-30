import { mensajes } from "../../commons/mensajes.mjs";
import { Presenter } from "../../commons/presenter.mjs";
<<<<<<< HEAD
import { model } from "../../model/model.mjs";
=======
>>>>>>> origin/felipe-dev
import { InvitadoCatalogoLibroPresenter } from "../invitado-catalogo-libro/invitado-catalogo-libro-presenter.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class InvitadoHomePresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get catalogo() {
    return document.querySelector('catalogo');
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
<<<<<<< HEAD
    let libros = model.getLibros();
=======
    let libros = await this.model.getLibros();

>>>>>>> origin/felipe-dev
    // Importante!
    await Promise.all(libros.map(async (l) => { return await new InvitadoCatalogoLibroPresenter(l, 'invitado-catalogo-libro', '#catalogo').refresh() }));    
  }

}