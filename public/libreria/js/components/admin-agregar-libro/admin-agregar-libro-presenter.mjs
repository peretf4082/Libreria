import { Presenter } from "../../commons/presenter.mjs";
import { router } from "../../commons/router.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";


export class AdminAgregarLibroPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get isbnInput() {
    return document.querySelector('#isbnInput');
  }

  get isbnInputText() {
    return this.isbnInput.value;
  }

  get tituloArea() {
    return document.querySelector('#tituloArea');
  }

  get tituloAreaText() {
    return this.tituloArea.textContent;
  }

  get autoresArea() {
    return document.querySelector('#autoresArea');
  }

  get autoresAreaText() {
    return this.autoresArea.textContent;
  }

  get resumenArea() {
    return document.querySelector('#resumenArea');
  }

  get resumenAreaText() {
    return this.resumenArea.textContent;
  }

  get stockInput() {
    return document.querySelector('#stockInput');
  }

  get stockInputText() {
    return this.stockInput.value;
  }

  get precioInput() {
    return document.querySelector('#precioInput');
  }

  get precioInputText() {
    return this.precioInput.value;
  }

  get agregarInput() {
    return document.querySelector('#agregarInput');
  }


  async agregarClick(event) {
    event.preventDefault();
    console.log('Prevented!', event);
    let obj = {
      isbn: this.isbnInputText,
      isbn: this.isbnInput.value,
      titulo: this.tituloArea.value,
      autores: this.autoresArea.value,
      resumen: this.resumenArea.value,
      stock: parseInt(this.stockInput.value),
      precio: parseFloat(this.precioInput.value)
    }
    console.log("Agregar libro:", JSON.stringify(obj, null, 2));
    try {
      let result = await this.model.addLibro(obj);
      this.mensajesPresenter.mensaje('Libro agregado!');
      router.navigate('/libreria/admin-home.html');
    } catch (err) {
      console.log(err);
      this.mensajesPresenter.error(err.message);
      await this.mensajesPresenter.refresh();
    }
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();
    this.isbnInput.value = crypto.randomUUID();

    // cuidado no asignar directamente el método, se pierde this!
    this.agregarInput.onclick = event => this.agregarClick(event);
  }

}