import settings from "./settings.js";
const sideMenu = document.querySelector("aside");
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");

const produtosLink = document.getElementById("produtos-link");
const historicoLink = document.getElementById("historico-link");
const dashboard = document.getElementById("dashboard");
const dashboardIcon = document.getElementById("dashboardIcon");
const secaoProdutos = document.getElementById("produtos");
const logEstoque = document.getElementById("logEstoque");
const logEstoqueBtn = document.getElementById("logEstoqueBtn");
const historico = document.getElementById("historico");
const estoqueNav = document.getElementById("estoque-link");
const estoque = document.getElementById("estoque");

menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

async function verificarCookie() {
  try {
    const response = await fetch(`${settings.ApiUrl}/verificarCookie`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success === true) {
        return data.success;
      } else {
        return data.success;
      }
    } else {
      console.error("Erro ao verificar o cookie:", response.status);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function ExibirLog() {
  try {
    const response = await fetch(`${settings.ApiUrl}/logs`, {
      credentials: "include",
    });
    const data = await response.json();
    document.querySelector("#gridProdutos3").innerHTML = ``;

    data.forEach((element) => {
      const quantidadeClass = element.quantidade < 0 ? "danger" : "success";
      const seta =
        element.quantidade < 0
          ? `<span class="material-symbols-outlined">
        arrow_downward_alt
        </span>`
          : `<span class="material-symbols-outlined">
        arrow_upward_alt
        </span>`;

      document.querySelector("#gridProdutos3").innerHTML += `
          <div id="itemDiv3" data="5">
            <div class="actions">
              <button class="">
                <span class="material-icons-sharp"> </span>
              </button>
            </div>
            <div class="itemProd3">
              <p class="primary">${element.nome}</p>
              <p class="primary">${element.categoria}</p>
              <p class="${quantidadeClass} bold">${seta} ${element.quantidade}</p>
              <p class="primary">${element.data}</p>
            </div>
          </div>
        `;
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const temCookie = await verificarCookie();
  if (!temCookie) {
    window.location.href = "index.html";
  }
  if (window.location.pathname != "/detalhes.html") {
    dashboard.style.display = "block";
    secaoProdutos.style.display = "none";
    estoque.style.display = "none";
    logEstoque.style.display = "none";
    historico.style.display = "none";

  logEstoqueBtn.addEventListener("click", function (event) {
    produtosLink.classList.remove("active");
    historicoLink.classList.remove("active");
    dashboardIcon.classList.remove("active");
    estoqueNav.classList.add("active");
    event.preventDefault();
    logEstoque.style.display = "block";
    dashboard.style.display = "none";
    secaoProdutos.style.display = "none";
    historico.style.display = "none";
    estoque.style.display = "none";
    ExibirLog();
  });

  produtosLink.addEventListener("click", function (event) {
    dashboardIcon.classList.remove("active");
    produtosLink.classList.add("active");
    historicoLink.classList.remove("active");
    estoqueNav.classList.remove("active");
    event.preventDefault();
    logEstoque.style.display = "none";
    dashboard.style.display = "none";
    estoque.style.display = "none";
    secaoProdutos.style.display = "block";
    historico.style.display = "none";
  });
  dashboardIcon.addEventListener("click", function (event) {
    produtosLink.classList.remove("active");
    estoqueNav.classList.remove("active");
    historicoLink.classList.remove("active");
    dashboardIcon.classList.add("active");
    logEstoque.style.display = "none";
    event.preventDefault();
    estoque.style.display = "none";
    secaoProdutos.style.display = "none";
    dashboard.style.display = "block";
    historico.style.display = "none";
  });
  estoqueNav.addEventListener("click", function (event) {
    produtosLink.classList.remove("active");
    dashboardIcon.classList.remove("active");
    estoqueNav.classList.add("active");
    event.preventDefault();
    historicoLink.classList.remove("active");
    logEstoque.style.display = "none";
    secaoProdutos.style.display = "none";
    estoque.style.display = "block";
    dashboard.style.display = "none";
    estoque.style.display = "block";
    historico.style.display = "none";
  });
  historicoLink.addEventListener("click", function (event) {
    produtosLink.classList.remove("active");
    dashboardIcon.classList.remove("active");
    estoqueNav.classList.remove("active");
    historicoLink.classList.add("active");
    event.preventDefault();
    logEstoque.style.display = "none";
    secaoProdutos.style.display = "none";
    historico.style.display = "block";
    estoque.style.display = "none";
    dashboard.style.display = "none";
  });
  
}
});
