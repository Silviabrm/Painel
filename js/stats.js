import settings from "./settings.js";
const vendas = document.getElementById("vendas");
const totusers = document.getElementById("totuser");

const getVendas = async () => {
  const response = await fetch(`${settings.ApiUrl}/vendas`);
  const data = await response.json();
  vendas.innerHTML = "R$" + data[0].vendas;
  totusers.innerHTML = data[0].qtdUser;
}

document.addEventListener("DOMContentLoaded", async function (event) {
  getVendas();
});