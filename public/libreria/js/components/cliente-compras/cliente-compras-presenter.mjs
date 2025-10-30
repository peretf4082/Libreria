import { Presenter } from "../../commons/presenter.mjs";
import { libreriaSession } from "../../commons/libreria-session.mjs";
import { MensajesPresenter } from "../mensajes/mensajes-presenter.mjs";
import { router } from "../../commons/router.mjs";

export class ClienteComprasPresenter extends Presenter {
  constructor(model, view) {
    super(model, view);
    this.mensajesPresenter = new MensajesPresenter(model, 'mensajes', '#mensajesContainer');
  }

  get facturasBody() {
    return document.querySelector("#facturasBody");
  }

  get totalGeneral() {
    return document.querySelector("#totalGeneral");
  }

  async refresh() {
    await super.refresh();
    await this.mensajesPresenter.refresh();

    const clienteId = libreriaSession.getUsuarioId();

    const facturas = await this.model.getFacturasPorCliente(clienteId);
    
    this.renderTabla(facturas);
  }

  renderTabla(facturas) {
    
    this.facturasBody.innerHTML = "";
    let total = 0;
    facturas.forEach(factura => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="padding: 10px;">${factura.numero}</td>
        <td style="padding: 10px;">${factura.fecha}</td>
        <td style="padding: 10px;">${factura.total.toFixed(2)}</td>
        <td style="padding: 10px;">
          <button class="boton" onclick="window.location.href='cliente-ver-compra.html?numero=${factura.numero}'">Ver</button>
        </td>
      `;

      this.facturasBody.appendChild(row);
      total += factura.total;
    });

    
    this.totalGeneral.textContent = total.toFixed(2);
  }
}
