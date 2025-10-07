import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";

export class AdminVerLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

  // para acceder al modelo, siempre con métodos, no con getters!
  getLibro() {
    return this.model.getLibroPorId(this.id);
  }

  get isbnText() {
    console.log(document);
    return document.querySelector('#isbnText');
  }

  set isbn(isbn) {
    this.isbnText.textContent = isbn;
  }
  get tituloText() {
    return document.querySelector('#tituloText');
  }

  set titulo(titulo) {
    this.tituloText.textContent = titulo;
  }
  get autoresText() {
    return document.querySelector('#autoresText');
  }

  set autores(autores) {
    this.autoresText.textContent = autores;
  }

  get resumenText() {
    return document.querySelector('#resumenText');
  }

  set resumen(resumen) {
    this.resumenText.textContent = resumen;
  }
  get precioText() {
    return document.querySelector('#precioText');
  }

  set precio(precio) {
    this.precioText.textContent = precio;
  }

  get stockText() {
    return document.querySelector('#stockText');
  }

  set stock(stock) {
    this.stockText.textContent = stock;
  }

  get borrarLink() {
    return document.querySelector('#borrarLink');
  }

  borrarClick(event) {
    event.preventDefault();
    try {
      this.model.removeLibro(this.id);
      this.mensajesPresenter.mensaje('Libro borrado!');
      router.navigate('/libreria/admin-home.html');
    } catch (e) {
      console.error(e);
      this.mensajesPresenter.error(e.message);
      this.mensajesPresenter.refresh();
    }
  }

  set libro(libro) {
    this.isbn = libro.isbn;
    this.titulo = libro.titulo;
    this.autores = libro.autores;
    this.resumen = libro.resumen;
    this.stock = libro.stock;
    this.precio = libro.precio;
  }


  get modificarLink(){
    return document.querySelector('#modificarLink');
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    console.log(this._id);
    let libro = await this.getLibro();
    if (libro) this.libro = libro;
    else console.error(`Libro ${this._id} not found!`);

    if(this.modificarLink){
      this.modificarLink.href = `/libreria/admin-modificar-libro.html?id=${this.id}`;
    }

    if (!!libro.borrado)
      this.borrarLink.parentElement.classList.add('oculto');
    
    this.borrarLink.onclick = event => this.borrarClick(event);
   
  }

}