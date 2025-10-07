import { Presenter } from "../../commons/presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { mensajes } from "../../commons/mensajes.mjs";

export class ClienteListaComprasPresenter extends Presenter {
    constructor(model, view) {
        super(model, view);
    }

    get listaComprasTable() {
        return document.querySelector('#listaCompras tbody');
    }

    async refresh() {
        this.cargarCompras();
    }

    cargarCompras() {
        const compras = libreriaSession.obtenerFacturas();
        
        if (compras.length === 0) {
            mensajes.mensaje("No hay compras registradas.");
        } else {
            compras.forEach(compra => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${compra.fecha}</td>
                    <td>${compra.numero}</td>
                    <td>${compra.razonSocial}</td>
                    <td>${compra.total.toFixed(2)}</td>
                `;
                this.listaComprasTable.appendChild(row);
            });
        }
    }
}
