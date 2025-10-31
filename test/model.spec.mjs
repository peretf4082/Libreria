import { expect } from 'chai';
import { Libreria, ROL } from '../public/libreria/js/model/model.mjs';

// Simple in-memory localStorage mock for Node.js tests
function installLocalStorageMock() {
  if (global.localStorage) return;
  const store = new Map();
  global.localStorage = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
}

function createLibro(overrides = {}) {
  return {
    isbn: overrides.isbn ?? 'ISBN-001',
    titulo: overrides.titulo ?? 'El Quijote',
    autores: overrides.autores ?? 'Cervantes',
    portada: overrides.portada ?? '',
    resumen: overrides.resumen ?? '',
    stock: overrides.stock ?? 5,
    precio: overrides.precio ?? 100,
  };
}

function createCliente(overrides = {}) {
  return {
    dni: overrides.dni ?? '12345678',
    nombre: overrides.nombre ?? 'Ana',
    apellidos: overrides.apellidos ?? 'Pérez',
    direccion: overrides.direccion ?? 'Calle 1',
    rol: ROL.CLIENTE,
    email: overrides.email ?? 'ana@example.com',
    password: overrides.password ?? 'secret',
  };
}

describe('Libreria - Pruebas', () => {
  let libreria;

  beforeEach(() => {
    installLocalStorageMock();
    // Crear una instancia fresca por prueba
    libreria = new Libreria();
    // Limpiar estado persistido para aislar pruebas
    global.localStorage.clear();
    libreria.libros = [];
    libreria.usuarios = [];
    libreria.facturas = [];
  });

  //Getters y Setters
  describe('Getters y Setters', () => {
    it('debe agregar libro y recuperarlo por id/título/isbn', () => {
      const l = libreria.addLibro(createLibro({ isbn: 'ABC', titulo: 'Aprendiendo JS' }));
      expect(libreria.getLibroPorId(l._id)).to.have.property('titulo', 'Aprendiendo JS');
      expect(libreria.getLibroPorIsbn('ABC')).to.have.property('isbn', 'ABC');
      expect(libreria.getLibroPorTitulo('aprendiendo')).to.have.property('titulo', 'Aprendiendo JS');
    });

    it('debe actualizar datos de libro', () => {
      const l = libreria.addLibro(createLibro({ titulo: 'A' }));
      const updated = libreria.updateLibro({ _id: l._id, titulo: 'B' });
      expect(updated.titulo).to.equal('B');
      expect(libreria.getLibroPorId(l._id).titulo).to.equal('B');
    });

    it('debe setear cantidad de item del carro del cliente', () => {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 10 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 });
      expect(libreria.getCarroCliente(cliente._id).subtotal).to.equal(20);
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 5);
      expect(libreria.getCarroCliente(cliente._id).subtotal).to.equal(50);
    });
  });

  // 2) Excepciones
  describe('Excepciones', () => {
    it('addLibro debe lanzar si falta ISBN', () => {
      expect(() => libreria.addLibro({ titulo: 'Sin ISBN' })).to.throw('El libro no tiene ISBN');
    });

    it('addLibro debe lanzar si ISBN ya existe', () => {
      libreria.addLibro(createLibro({ isbn: 'X' }));
      expect(() => libreria.addLibro(createLibro({ isbn: 'X' }))).to.throw('El ISBN X ya existe');
    });

    it('removeLibro debe lanzar si libro no existe', () => {
      expect(() => libreria.removeLibro(999)).to.throw('Libro no encontrado');
    });

    it('setItemCantidad debe lanzar si cantidad es negativa', () => {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro());
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 1 });
      expect(() => libreria.setClienteCarroItemCantidad(cliente._id, 0, -1)).to.throw('Cantidad inferior a 0');
    });

    it('autenticar debe fallar con contraseña incorrecta', () => {
      const cliente = libreria.addCliente(createCliente({ email: 'a@b.com', password: '123' }));
      expect(cliente).to.exist;
      expect(() => libreria.autenticar({ rol: ROL.CLIENTE, email: 'a@b.com', password: '000' }))
        .to.throw('Error en la contraseña');
    });

    it('facturarCompraCliente debe lanzar si carro está vacío', () => {
      const cliente = libreria.addCliente(createCliente());
      expect(() => libreria.facturarCompraCliente({ cliente: cliente._id }))
        .to.throw('No hay que comprar');
    });
  });

  // 3) Agregar, Modificar y Eliminar
  describe('Agregar, Modificar y Eliminar', () => {
    it('CRUD de libros', () => {
      const l = libreria.addLibro(createLibro({ isbn: 'C1', titulo: 'C' }));
      expect(libreria.getLibros()).to.have.length(1);
      libreria.updateLibro({ _id: l._id, titulo: 'C2' });
      expect(libreria.getLibroPorId(l._id).titulo).to.equal('C2');
      const removed = libreria.removeLibro(l._id);
      expect(removed._id).to.equal(l._id);
      expect(libreria.getLibros()).to.have.length(0);
    });

    it('Carro: agregar, modificar cantidad y eliminar item con cantidad 0', () => {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 20 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 });
      expect(libreria.getCarroCliente(cliente._id).items).to.have.length(1);
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 3);
      expect(libreria.getCarroCliente(cliente._id).items[0].cantidad).to.equal(3);
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 0);
      expect(libreria.getCarroCliente(cliente._id).items).to.have.length(0);
    });
  });

  // 4) Cálculos
  describe('Cálculos', () => {
    it('Carro calcula subtotal, iva y total', () => {
      const cliente = libreria.addCliente(createCliente());
      const l1 = libreria.addLibro(createLibro({ isbn: 'A1', precio: 10 }));
      const l2 = libreria.addLibro(createLibro({ isbn: 'A2', precio: 5 }));
      libreria.addClienteCarroItem(cliente._id, { libro: l1._id, cantidad: 3 }); // 30
      libreria.addClienteCarroItem(cliente._id, { libro: l2._id, cantidad: 2 }); // 10
      const carro = libreria.getCarroCliente(cliente._id);
      expect(carro.subtotal).to.equal(40);
      expect(carro.iva).to.be.closeTo(8.4, 0.0001); // 21%
      expect(carro.total).to.be.closeTo(48.4, 0.0001);
    });

    it('Factura calcula y genera número, y vacía carro al facturar', () => {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 50 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 }); // 100
      const factura = libreria.facturarCompraCliente({ cliente: cliente._id, razonSocial: 'RS' });
      expect(factura.numero).to.be.a('number');
      expect(factura.subtotal).to.equal(100);
      expect(factura.iva).to.be.closeTo(21, 0.0001);
      expect(factura.total).to.be.closeTo(121, 0.0001);
      // Carro vacío después de facturar
      expect(libreria.getCarroCliente(cliente._id).items).to.have.length(0);
    });
  });
});


