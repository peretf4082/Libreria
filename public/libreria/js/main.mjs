 
import { model } from "./model/model.mjs";
import { seed } from "./model/seeder.mjs";
import { router } from "./commons/router.mjs";
import { InvitadoHomePresenter } from "./components/invitado-home/invitado-home-presenter.mjs";

import { AdminAgregarLibroPresenter } from "./components/admin-agregar-libro/admin-agregar-libro-presenter.mjs";
import { InvitadoVerLibroPresenter } from "./components/invitado-ver-libro/invitado-ver-libro-presenter.mjs";
import { ClienteVerLibroPresenter } from "./components/cliente-ver-libro/cliente-ver-libro-presenter.mjs";
import { AdminVerLibroPresenter } from "./components/admin-ver-libro/admin-ver-libro-presenter.mjs";
import { AdminModificarLibroPresenter } from "./components/admin-modificar-libro/admin-modificar-libro-presenter.mjs";
import { InvitadoRegistroPresenter } from "./components/invitado-registro/invitado-registro-presenter.mjs";
import { InvitadoIngresoPresenter } from "./components/invitado-ingreso/invitado-ingreso-presenter.mjs";
import { ClienteHomePresenter } from "./components/cliente-home/cliente-home-presenter.mjs";
import { AdminHomePresenter } from "./components/admin-home/admin-home-presenter.mjs";
import { AdminPerfilPresenter } from "./components/admin-perfil/admin-perfil-presenter.mjs";


//Añadido
import { ClienteListaComprasPresenter } from "./components/cliente-lista-compras/cliente-lista-compras-presenter.mjs";

//Añadido
// Nota: no existe componente cliente-carro en el proyecto
import { ClienteComprarPresenter } from "./components/cliente-comprar/cliente-comprar.mjs";

export function init() {
  seed();

  router.register(/^\/libreria\/index\.html$/, new InvitadoHomePresenter(model, 'invitado-home'));
  router.register(/^\/libreria\/home\.html$/, new InvitadoHomePresenter(model, 'invitado-home'));
  router.register(/^\/libreria$/, new InvitadoHomePresenter(model, 'invitado-home'));
  router.register(/^\/libreria\/cliente-home.html$/, new ClienteHomePresenter(model, 'cliente-home'));
  router.register(/^\/libreria\/admin-home.html$/, new AdminHomePresenter(model, 'admin-home'));

  router.register(/^\/libreria\/invitado-ingreso\.html$/, new InvitadoIngresoPresenter(model, 'invitado-ingreso'));
  router.register(/^\/libreria\/invitado-registro\.html$/, new InvitadoRegistroPresenter(model, 'invitado-registro'));


  router.register(/^\/libreria\/admin-agregar-libro.html$/, new AdminAgregarLibroPresenter(model, 'admin-agregar-libro'));
  router.register(/^\/libreria\/invitado-ver-libro.html/, new InvitadoVerLibroPresenter(model, 'invitado-ver-libro'));
  router.register(/^\/libreria\/admin-ver-libro.html/, new AdminVerLibroPresenter(model, 'admin-ver-libro'));
  router.register(/^\/libreria\/admin-modificar-libro.html/, new AdminModificarLibroPresenter(model, 'admin-modificar-libro'));
  router.register(/^\/libreria\/admin-perfil.html$/, new AdminPerfilPresenter(model, 'admin-perfil'));

  router.register(/^\/libreria\/cliente-ver-libro.html/, new ClienteVerLibroPresenter(model, 'cliente-ver-libro'));

  //Añadido
  router.register(/^\/libreria\/cliente-comprar\.html$/, new ClienteComprarPresenter(model, 'cliente-comprar'));
  router.register(/^\/libreria\/cliente-lista-compras\.html$/, new ClienteListaComprasPresenter(model, 'cliente-lista-compras'));

  router.handleLocation();
}