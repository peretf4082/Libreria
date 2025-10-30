import { Presenter } from "../../commons/presenter.mjs";
<<<<<<< HEAD
// import { Router } from "../../commons/router.mjs";
import { model } from "../../model/model.mjs";
=======
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { router } from "../../commons/router.mjs";
>>>>>>> origin/felipe-dev

export class ClienteVerLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
<<<<<<< HEAD
=======
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
>>>>>>> origin/felipe-dev
  }

  get searchParams() {
    return new URLSearchParams(document.location.search);
  }

  get id() {
    return this.searchParams.get('id');
  }

<<<<<<< HEAD
  // para acceder al modelo, siempre con métodos, no con getters!
  getLibro() {
    return model.getLibroPorId(this.id);
  }

  get isbnParagraph() {
    console.log(document);
    return document.querySelector('#isbnParagraph');
  }

  set isbn(isbn) {
    this.isbnParagraph.textContent = isbn;
  }
  get tituloParagraph() {
    return document.querySelector('#tituloParagraph');
  }

  set titulo(titulo) {
    this.tituloParagraph.textContent = titulo;
  }
  get autoresParagraph() {
    return document.querySelector('#autoresParagraph');
  }

  set autores(autores) {
    this.autoresParagraph.textContent = autores;
  }

  get resumenParagraph() {
    return document.querySelector('#resumenParagraph');
  }

  set resumen(resumen) {
    this.resumenParagraph.textContent = resumen;
  }
  get precioParagraph() {
    return document.querySelector('#precioParagraph');
  }

  set precio(precio) {
    this.precioParagraph.textContent = precio;
  }

  get stockParagraph() {
    return document.querySelector('#stockParagraph');
  }

  set stock(stock) {
    this.stockParagraph.textContent = stock;
  }

  set libro(libro) {    
=======
  getLibro() {
    return this.model.getLibroPorId(this.id);
  }

  get isbnText() {
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

  get agregarCarroInput() {
    return document.querySelector('#agregarCarroInput');
  }

  set libro(libro) {
>>>>>>> origin/felipe-dev
    this.isbn = libro.isbn;
    this.titulo = libro.titulo;
    this.autores = libro.autores;
    this.resumen = libro.resumen;
    this.stock = libro.stock;
    this.precio = libro.precio;
  }

<<<<<<< HEAD
  async refresh() {
    await super.refresh();
    console.log(this.id);
    let libro = this.getLibro();
    if (libro) this.libro = libro;
    else console.error(`Libro ${id} not found!`);


    
    // cuidado no asignar directamente el método, se pierde this!
    // document.querySelector('#agregarButton').onclick = event => this.agregarClick(event);
    // let self = this;
    // document.querySelector('#agregarButton').onclick = function (event) { self.agregarClick(event) };
  }

}
=======
  async agregarCarroClick(event) {
    event.preventDefault();
    try {
      const clienteId = libreriaSession.getUsuarioId();
      await this.model.addClienteCarroItem(clienteId, {
        libro: this.id,
        cantidad: 1
      });

      this.mensajesPresenter.mensaje("Libro añadido al carro");
      router.navigate('/libreria/cliente-carro.html');
    } catch (error) {
      console.error(error);
      this.mensajesPresenter.error("Error al añadir al carro");
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    const libro = await this.getLibro();
    if (libro) {
      this.libro = libro;
    } else {
      this.mensajesPresenter.error(`Libro ${this.id} no encontrado`);
    }

    if (this.agregarCarroInput) {
      this.agregarCarroInput.onclick = (event) => this.agregarCarroClick(event);
    }
  }
}
>>>>>>> origin/felipe-dev
