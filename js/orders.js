import settings from "./settings.js";

async function getPedidos() {
  try {
    const response = await fetch(`${settings.ApiUrl}/getPedidos`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", async function (event) {
  const pedidos = await getPedidos();

  if (pedidos) {
    var contPedidos = 0;

    const historicoLink = document.getElementById("historico-link");
    historicoLink.addEventListener("click", () => {
      gridPedidos.innerHTML = "";
      setTimeout(() => {
        if (historicoLink.classList.contains("active")) {
          let gridPedidos = document.getElementById("gridPedidos");
          pedidos.forEach((order) => {
            gridPedidos.innerHTML += `
            <div id="itemDiv">
                <div class="itemProd">
                  <p>${order.num_pedido}</p>
                  <p>${order.total}</p>
                  <p>${order.pagamento}</p>
                  <p class="${
                    order.status === "Cancelado"
                      ? "danger"
                      : order.status === "Pendente"
                      ? "warning"
                      : order.status === "Concluído"
                      ? "success"
                      : "primary"
                  }">${order.status}</p>
                  <p>${order.data}</p>
                  <a href="detalhes.html?${order.num_pedido}">Detalhes</a>
                </div>
              </div>
            `;
          });
        }
      }, 100);
    });
    pedidos.forEach((order) => {
      if (contPedidos >= 13) return;
      const tr = document.createElement("tr");
      const trContent = `
            <td>${order.num_pedido}</td>
            <td>R$${order.total}</td>
            <td>${order.pagamento}</td>
            <td class="${
              order.status === "Cancelado"
                ? "danger"
                : order.status === "Pendente"
                ? "warning"
                : order.status === "Concluído"
                ? "success"
                : "primary"
            }">${order.status}</td>
        `;
      tr.innerHTML = trContent;
      document.querySelector("table tbody").appendChild(tr);
      contPedidos++;
    });
  } else {
    document.querySelector("table tbody").innerHTML = `
      <tr>
        <td colspan="5" class="primary">Nenhum pedido encontrado.</td>
      </tr>
    `;
  }
});
