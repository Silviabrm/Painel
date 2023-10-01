import settings from "./settings.js";

let pedidoId = window.location.search.substring(1);

async function getpedido(pedidoId) {
  const response = await fetch(`${settings.ApiUrl}/getPedido/${pedidoId}`, {
    credentials: "include",
  });

  const data = await response.json();
  return data;
}

async function formatarData(data) {
  let dataFormatada = new Date(data);
  return dataFormatada.toLocaleDateString();
}

async function preencherPagina(pedido) {
  const dataPedido = document.getElementById("data-pedido");
  const numPedido = document.getElementById("num-pedido");
  const statusPedido = document.getElementById("status-pedido");
  const totalPedido = document.getElementById("total-pedido");
  const statusPagamento = document.getElementById("status-pagamento");

  numPedido.innerHTML = pedido.num_pedido;
  statusPedido.innerHTML = pedido.status;
  statusPedido.classList.add(
    pedido.status === "Cancelado"
      ? "danger"
      : pedido.status === "Pendente"
      ? "warning"
      : pedido.status === "Concluído"
      ? "success"
      : "primary"
  );
  totalPedido.innerHTML = pedido.total;
  statusPagamento.innerHTML = pedido.pagamento;
  dataPedido.innerHTML = await formatarData(pedido.data);
}

async function preencherProdutos(pedidoId) {
  const produtosGridDet = document.getElementById("produtosGridDet");
  const produtos = await fetch(
    `${settings.ApiUrl}/getProdutosPedido/${pedidoId}`,
    {}
  );
  const data = await produtos.json();
  console.log(data);
  data.forEach(async (produto) => {
    const Getproduto = await fetch(
      `${settings.ApiUrl}/produtos/${produto.produto_id}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const prouct = await Getproduto.json();
    const precototal = prouct.preco * produto.quantidade;
      produtosGridDet.innerHTML += `
      <div class="product-card">
              <div class="product-info">
                <h4>${prouct.nome}</h4>
                <p>Quantidade: ${produto.quantidade}</p>
                <p>Preço unidade: R$${prouct.preco}</p>
                <p>Preço total: R$${precototal}</p>
              </div>
            </div>
      `;
  });
}

document.addEventListener("DOMContentLoaded", async function (event) {
  let pedido = await getpedido(pedidoId);
  const concPedido = document.getElementById("concPedido");
  const cancelPedido = document.getElementById("cancelPedido");
  concPedido.disabled = false;
  cancelPedido.disabled = false;
  if(pedido.status == "Concluído"){
    concPedido.innerHTML = "Pedido Concluído";
    concPedido.style.backgroundColor = "#1b9c85";
    cancelPedido.style.backgroundColor = "#49494991";
    cancelPedido.disabled = true;
    concPedido.disabled = true;
  } else if( pedido.status == "Cancelado"){
    cancelPedido.innerHTML = "Pedido Cancelado";
    cancelPedido.style.backgroundColor = "#49494991";
    concPedido.style.backgroundColor = "#49494991";
    cancelPedido.disabled = true;
    concPedido.disabled = true;
  } else {
    cancelPedido.addEventListener("click", async function (event) {
      const response = await fetch(
        `${settings.ApiUrl}/cancelarPedido/${pedidoId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data == true) {
        window.location.reload();
      }
    });
    concPedido.addEventListener("click", async function (event) {
      const response = await fetch(
        `${settings.ApiUrl}/concluirPedido/${pedidoId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data == true) {
        window.location.reload();
      }
    });
  }
  await preencherPagina(pedido);
  await preencherProdutos(pedidoId);
});
