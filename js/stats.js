import settings from "./settings.js";
const vendas = document.getElementById("vendas");
const totusers = document.getElementById("totuser");

const getVendas = async () => {
  const response = await fetch(`${settings.ApiUrl}/getStats`,
  {
    credentials: "include",
  });
  const data = await response.json();
  console.log(data);
  vendas.innerHTML = "R$" + data.vendas;
  totusers.innerHTML = data.qtdUser;
}

document.addEventListener("DOMContentLoaded", async function (event) {
  getVendas();
});