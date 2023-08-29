const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');

const produtosLink = document.getElementById("produtos-link");
const dashboard = document.getElementById("dashboard");
const dashboardIcon = document.getElementById("dashboardIcon");
const secaoProdutos = document.getElementById("produtos");
const estoqueNav = document.getElementById("estoque-link");
const estoque = document.getElementById("estoque");

menuBtn.addEventListener('click', () => {
    sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
});

Orders.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${order.productName}</td>
        <td>${order.productNumber}</td>
        <td>${order.paymentStatus}</td>
        <td class="${order.status === 'Recusado' ? 'danger' : order.status === 'Pendente' ? 'warning' : 'primary'}">${order.status}</td>
        <td class="primary">Details</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});

document.addEventListener("DOMContentLoaded", function () {
    dashboard.style.display = "block";
    secaoProdutos.style.display = "none";
    estoque.style.display = "none"; 
    produtosLink.addEventListener("click", function (event) {
        dashboardIcon.classList.remove("active");
        produtosLink.classList.add("active");
        estoqueNav.classList.remove("active");
        event.preventDefault();
        dashboard.style.display = "none"; 
        estoque.style.display = "none"; 
        secaoProdutos.style.display = "block"; 
    });
    dashboardIcon.addEventListener("click", function (event) {
        produtosLink.classList.remove("active");
        estoqueNav.classList.remove("active");
        dashboardIcon.classList.add("active");
        event.preventDefault();
        estoque.style.display = "none"; 
        secaoProdutos.style.display = "none"; 
        dashboard.style.display = "block"; 
    });
    estoqueNav.addEventListener("click", function (event) {
        produtosLink.classList.remove("active");
        dashboardIcon.classList.remove("active");
        estoqueNav.classList.add("active");
        event.preventDefault();
        secaoProdutos.style.display = "none"; 
        estoque.style.display = "block"; 
        dashboard.style.display = "none"; 
    });
});