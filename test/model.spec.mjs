import { assert } from 'chai';
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

function createAdmin(overrides = {}) {
  return {
    dni: overrides.dni ?? '87654321',
    nombre: overrides.nombre ?? 'Juan',
    apellidos: overrides.apellidos ?? 'García',
    direccion: overrides.direccion ?? 'Calle Admin',
    rol: ROL.ADMIN,
    email: overrides.email ?? 'admin@example.com',
    password: overrides.password ?? 'admin123',
  };
}

describe('Libreria - Pruebas', function () {
  let libreria;

  beforeEach(function () {
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
  describe('Getters y Setters', function () {
    it('debe agregar libro y recuperarlo por id/título/isbn', function () {
      const l = libreria.addLibro(createLibro({ isbn: 'ABC', titulo: 'Aprendiendo JS' }));
      assert.equal(libreria.getLibroPorId(l._id).titulo, 'Aprendiendo JS');
      assert.equal(libreria.getLibroPorIsbn('ABC').isbn, 'ABC');
      assert.equal(libreria.getLibroPorTitulo('aprendiendo').titulo, 'Aprendiendo JS');
    });

    it('debe actualizar datos de libro', function () {
      const l = libreria.addLibro(createLibro({ titulo: 'A' }));
      const updated = libreria.updateLibro({ _id: l._id, titulo: 'B' });
      assert.equal(updated.titulo, 'B');
      assert.equal(libreria.getLibroPorId(l._id).titulo, 'B');
    });

    it('debe setear cantidad de item del carro del cliente', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 10 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 });
      assert.equal(libreria.getCarroCliente(cliente._id).subtotal, 20);
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 5);
      assert.equal(libreria.getCarroCliente(cliente._id).subtotal, 50);
    });
  });

  // 2) Excepciones
  describe('Excepciones', function () {
    it('addLibro debe lanzar si falta ISBN', function () {
      assert.throws(() => libreria.addLibro({ titulo: 'Sin ISBN' }), /El libro no tiene ISBN/);
    });

    it('addLibro debe lanzar si ISBN ya existe', function () {
      libreria.addLibro(createLibro({ isbn: 'X' }));
      assert.throws(() => libreria.addLibro(createLibro({ isbn: 'X' })), /El ISBN X ya existe/);
    });

    it('removeLibro debe lanzar si libro no existe', function () {
      assert.throws(() => libreria.removeLibro(999), /Libro no encontrado/);
    });

    it('setItemCantidad debe lanzar si cantidad es negativa', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro());
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 1 });
      assert.throws(() => libreria.setClienteCarroItemCantidad(cliente._id, 0, -1), /Cantidad inferior a 0/);
    });

    it('autenticar debe fallar con contraseña incorrecta', function () {
      const cliente = libreria.addCliente(createCliente({ email: 'a@b.com', password: '123' }));
      assert.exists(cliente);
      assert.throws(() => libreria.autenticar({ rol: ROL.CLIENTE, email: 'a@b.com', password: '000' }), /Error en la contraseña/);
    });

    it('facturarCompraCliente debe lanzar si carro está vacío', function () {
      const cliente = libreria.addCliente(createCliente());
      assert.throws(() => libreria.facturarCompraCliente({ cliente: cliente._id }), /No hay que comprar/);
    });
  });

  // 3) Agregar, Modificar y Eliminar
  describe('Agregar, Modificar y Eliminar', function () {
    it('CRUD de libros', function () {
      const l = libreria.addLibro(createLibro({ isbn: 'C1', titulo: 'C' }));
      assert.lengthOf(libreria.getLibros(), 1);
      libreria.updateLibro({ _id: l._id, titulo: 'C2' });
      assert.equal(libreria.getLibroPorId(l._id).titulo, 'C2');
      const removed = libreria.removeLibro(l._id);
      assert.equal(removed._id, l._id);
      assert.lengthOf(libreria.getLibros(), 0);
    });

    it('Carro: agregar, modificar cantidad y eliminar item con cantidad 0', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 20 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 });
      assert.lengthOf(libreria.getCarroCliente(cliente._id).items, 1);
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 3);
      assert.equal(libreria.getCarroCliente(cliente._id).items[0].cantidad, 3);
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 0);
      assert.lengthOf(libreria.getCarroCliente(cliente._id).items, 0);
    });
  });

  // 4) Cálculos
  describe('Cálculos', function () {
    it('Carro calcula subtotal, iva y total', function () {
      const cliente = libreria.addCliente(createCliente());
      const l1 = libreria.addLibro(createLibro({ isbn: 'A1', precio: 10 }));
      const l2 = libreria.addLibro(createLibro({ isbn: 'A2', precio: 5 }));
      libreria.addClienteCarroItem(cliente._id, { libro: l1._id, cantidad: 3 }); // 30
      libreria.addClienteCarroItem(cliente._id, { libro: l2._id, cantidad: 2 }); // 10
      const carro = libreria.getCarroCliente(cliente._id);
      assert.equal(carro.subtotal, 40);
      assert.approximately(carro.iva, 8.4, 0.0001); // 21%
      assert.approximately(carro.total, 48.4, 0.0001);
    });

    it('Factura calcula y genera número, y vacía carro al facturar', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 50 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 }); // 100
      const factura = libreria.facturarCompraCliente({ cliente: cliente._id, razonSocial: 'RS' });
      assert.isNumber(factura.numero);
      assert.equal(factura.subtotal, 100);
      assert.approximately(factura.iva, 21, 0.0001);
      assert.approximately(factura.total, 121, 0.0001);
      // Carro vacío después de facturar
      assert.lengthOf(libreria.getCarroCliente(cliente._id).items, 0);
    });
  });

  // 5) Gestión de Stock
  describe('Gestión de Stock', function () {
    it('debe decrementar stock al facturar compra', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ stock: 10 }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 3 });
      libreria.facturarCompraCliente({ cliente: cliente._id, razonSocial: 'Test' });
      assert.equal(libreria.getLibroPorId(libro._id).stock, 7);
    });

    it('debe lanzar error si stock es insuficiente', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ stock: 2, titulo: 'Libro Limitado' }));
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 5 });
      assert.throws(() => libreria.facturarCompraCliente({ cliente: cliente._id, razonSocial: 'Test' }), /Stock insuficiente/);
    });

    it('incStockN debe incrementar el stock', function () {
      const libro = libreria.addLibro(createLibro({ stock: 5 }));
      libro.incStockN(3);
      assert.equal(libro.stock, 8);
    });

    it('decStockN debe decrementar el stock', function () {
      const libro = libreria.addLibro(createLibro({ stock: 10 }));
      libro.decStockN(4);
      assert.equal(libro.stock, 6);
    });
  });

  // 6) Usuarios y Autenticación
  describe('Usuarios y Autenticación', function () {
    it('debe agregar y recuperar cliente por email y dni', function () {
      const cliente = libreria.addCliente(createCliente({ email: 'test@test.com', dni: '11111111A' }));
      assert.exists(libreria.getClientePorEmail('test@test.com'));
      assert.equal(libreria.getClientePorEmail('test@test.com').dni, '11111111A');
      assert.exists(libreria.getUsuarioPorDni('11111111A'));
    });

    it('debe agregar y recuperar administrador', function () {
      const admin = libreria.addUsuario(createAdmin({ email: 'admin@test.com' }));
      assert.exists(libreria.getAdministradorPorEmail('admin@test.com'));
      assert.equal(libreria.getAdministradorPorEmail('admin@test.com').rol, ROL.ADMIN);
    });

    it('debe autenticar correctamente con credenciales válidas', function () {
      libreria.addCliente(createCliente({ email: 'user@test.com', password: 'pass123' }));
      const usuario = libreria.autenticar({ 
        rol: ROL.CLIENTE, 
        email: 'user@test.com', 
        password: 'pass123' 
      });
      assert.exists(usuario);
      assert.equal(usuario.email, 'user@test.com');
    });

    it('debe actualizar datos de usuario', function () {
      const cliente = libreria.addCliente(createCliente({ nombre: 'Pedro' }));
      const updated = libreria.updateUsuario({ 
        _id: cliente._id, 
        nombre: 'Pablo',
        apellidos: 'Nuevo Apellido'
      });
      assert.equal(updated.nombre, 'Pablo');
      assert.equal(updated.apellidos, 'Nuevo Apellido');
    });

    it('debe actualizar contraseña de usuario', function () {
      const cliente = libreria.addCliente(createCliente({ password: 'old' }));
      libreria.updateUsuario({ _id: cliente._id, password: 'new' });
      const usuario = libreria.autenticar({ 
        rol: ROL.CLIENTE, 
        email: cliente.email, 
        password: 'new' 
      });
      assert.exists(usuario);
    });

    it('debe lanzar error si usuario no encontrado en updateUsuario', function () {
      assert.throws(() => libreria.updateUsuario({ _id: 9999, nombre: 'Test' }), /Usuario no encontrado/);
    });
  });

  // 7) Facturas
  describe('Facturas', function () {
    it('debe recuperar facturas por cliente', function () {
      const cliente1 = libreria.addCliente(createCliente({ email: 'c1@test.com' }));
      const cliente2 = libreria.addCliente(createCliente({ email: 'c2@test.com' }));
      const libro = libreria.addLibro(createLibro());
      
      libreria.addClienteCarroItem(cliente1._id, { libro: libro._id, cantidad: 1 });
      libreria.facturarCompraCliente({ cliente: cliente1._id, razonSocial: 'RS1' });
      
      libreria.addClienteCarroItem(cliente2._id, { libro: libro._id, cantidad: 1 });
      libreria.facturarCompraCliente({ cliente: cliente2._id, razonSocial: 'RS2' });
      
      const facturasC1 = libreria.getFacturasPorCliente(cliente1._id);
      assert.lengthOf(facturasC1, 1);
      assert.equal(facturasC1[0].cliente._id, cliente1._id);
    });

    it('debe recuperar factura por número', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro());
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 1 });
      const factura = libreria.facturarCompraCliente({ cliente: cliente._id, razonSocial: 'Test' });
      
      const found = libreria.getFacturaPorNumero(factura.numero);
      assert.exists(found);
      assert.equal(found.numero, factura.numero);
    });

    it('debe guardar facturas en localStorage', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro());
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 1 });
      libreria.facturarCompraCliente({ cliente: cliente._id, razonSocial: 'Test' });
      
      const saved = global.localStorage.getItem('libreria_state');
      assert.exists(saved);
      const data = JSON.parse(saved);
      assert.lengthOf(data.facturas, 1);
    });
  });

  // 8) Carro - Casos especiales
  describe('Carro - Casos Especiales', function () {
    it('debe sumar cantidades al agregar mismo libro dos veces', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro({ precio: 10 }));
      
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 });
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 3 });
      
      const carro = libreria.getCarroCliente(cliente._id);
      assert.lengthOf(carro.items, 1);
      assert.equal(carro.items[0].cantidad, 5);
      assert.equal(carro.subtotal, 50);
    });

    it('debe eliminar item del carro al setear cantidad a 0', function () {
      const cliente = libreria.addCliente(createCliente());
      const libro = libreria.addLibro(createLibro());
      libreria.addClienteCarroItem(cliente._id, { libro: libro._id, cantidad: 2 });
      assert.lengthOf(libreria.getCarroCliente(cliente._id).items, 1);
      
      libreria.setClienteCarroItemCantidad(cliente._id, 0, 0);
      assert.lengthOf(libreria.getCarroCliente(cliente._id).items, 0);
    });
  });

  // 9) Métodos de modificación de precio
  describe('Métodos de Libro - Precios', function () {
    it('incPrecioP debe incrementar precio por porcentaje', function () {
      const libro = libreria.addLibro(createLibro({ precio: 100 }));
      libro.incPrecioP(10); // +10%
      assert.approximately(libro.precio, 110, 0.01);
    });

    it('dexPrecioP debe aplicar porcentaje al precio', function () {
      const libro = libreria.addLibro(createLibro({ precio: 100 }));
      libro.dexPrecioP(50); // 50% del precio
      assert.approximately(libro.precio, 50, 0.01);
    });
  });
});
