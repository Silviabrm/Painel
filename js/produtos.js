import settings from "./settings.js";
const produtoslink = document.getElementById("produtos-link");
const sidebar = document.querySelector(".sidebar");
const gridProdutos = document.getElementById("gridProdutos");
const addbtn = document.getElementById("addproduto");
const addProd = document.getElementById("addProd");
const overlay = document.getElementById("overlay");
const fecharModal = document.getElementById("fecharModal");

function getValueFromFieldOrParagraph(field, inputField) {
  if (inputField.style.display === "block") {
    return inputField.value;
  } else {
    return field.textContent;
  }
}

async function ExibirProdutos() {
  if (produtoslink.classList.contains("active")) {
    try {
      const response = await fetch(`${settings.ApiUrl}/produtos`);
      const data = await response.json();
      gridProdutos.innerHTML = ``;
      data.forEach((element) => {
        gridProdutos.innerHTML += `
            <div id="itemDiv">
                <div class="actions">
                    <button class="delete" data-id="${element.id}">
                        <span class="material-icons-sharp">
                             delete
                        </span>
                    </button>
                </div>
                <div class="itemProd">
                <p class="editable nome">${element.nome}</p>
                <input type="text" class="edit editNome" value="${element.nome}">
                <p class="editable descricao">${element.descricao}</p>
                <input type="text" class="edit editDesc" value="${element.descricao}">
                <p class="editable preco">${element.preco}</p>
                <input type="text" class="edit editPreco" value="${element.preco}">
                <p class="editable categoria">${element.categoria}</p>
                <input type="text" class="edit editCate" value="${element.categoria}">
                <p class="editable quantidade">${element.quantidade}</p>
                <input type="text" class="edit editQtd" value="${element.quantidade}">
                    <div class="img">
                        <img src="${element.imagem}" alt="">
                    </div>
                </div>
                <div class="actions">
                    <button class="save">
                        <span class="material-icons-sharp">
                             save
                        </span>
                    </button>
                </div>
            </div>
                `;
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    gridProdutos.innerHTML = ``;
  }
}

sidebar.addEventListener("click", async function (event) {
  ExibirProdutos();
});

document.addEventListener("DOMContentLoaded", async function () {
  ExibirProdutos();
  const actualBtn = document.getElementById("imagemInput");

  const fileChosen = document.getElementById("file-chosen");

  addbtn.addEventListener("click", function (event) {
    console.log("click");
    addProd.classList.toggle("active");
    overlay.classList.toggle("active");
  });
  fecharModal.addEventListener("click", function (event) {
    console.log("click");
    addProd.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  actualBtn.addEventListener("change", function () {
    fileChosen.innerHTML =
      this.files[0].name + `<span class="material-icons-sharp">task_alt</span>`;
  });

  gridProdutos.addEventListener("click", async function (event) {
    const editableElement = event.target.closest(".editable");
    const deleteButton = event.target.closest(".delete");

    if (editableElement) {
      const editInput = editableElement.nextElementSibling;

      if (editInput && editInput.classList.contains("edit")) {
        editableElement.style.display = "none";
        editInput.style.display = "block";
        editInput.focus();
      }
    }
    if (deleteButton) {
      const itemId = deleteButton.getAttribute("data-id");
      console.log(itemId);
      const confirmed = confirm("Deseja excluir este item?");

      if (confirmed) {
        try {
          const response = await fetch(
            `${settings.ApiUrl}/produtos/${itemId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            ExibirProdutos();
          } else {
            console.log("Erro ao excluir o item.");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    gridProdutos.addEventListener("click", async function (event) {
      const saveButton = event.target.closest(".save");

      if (saveButton) {
        const itemDiv = saveButton.closest("#itemDiv");
        const itemId = itemDiv.querySelector(".delete").getAttribute("data-id");

        const nomeP = itemDiv.querySelector(".nome");
        const nomeInput = itemDiv.querySelector(".editNome");
        const nome = getValueFromFieldOrParagraph(nomeP, nomeInput);

        const descricaoP = itemDiv.querySelector(".descricao");
        const descricaoInput = itemDiv.querySelector(".editDesc");
        const descricao = getValueFromFieldOrParagraph(
          descricaoP,
          descricaoInput
        );

        const precoP = itemDiv.querySelector(".preco");
        const precoInput = itemDiv.querySelector(".editPreco");
        const preco = getValueFromFieldOrParagraph(precoP, precoInput);

        const categoriaP = itemDiv.querySelector(".categoria");
        const categoriaInput = itemDiv.querySelector(".editCate");
        const categoria = getValueFromFieldOrParagraph(
          categoriaP,
          categoriaInput
        );

        const quantidadeP = itemDiv.querySelector(".quantidade");
        const quantidadeInput = itemDiv.querySelector(".editQtd");
        const quantidade = getValueFromFieldOrParagraph(
          quantidadeP,
          quantidadeInput
        );

        try {
          const response = await fetch(
            `${settings.ApiUrl}/produtos/${itemId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                nome,
                descricao,
                preco,
                categoria,
                quantidade,
              }),
            }
          );

          if (response.ok) {
            gridProdutos.innerHTML = ``;
            ExibirProdutos();
          } else {
            console.log("Erro ao atualizar o item.");
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  });
});