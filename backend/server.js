const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = process.env.PORT || 3000;

const UserData = require("./UserData");

const userDataReader = new UserData();

const fs = require("fs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      "https://adotesuapatinha.com",
      "http://127.0.0.1:5500/",
      "http://localhost:5500",
    ],
  })
);

app.get("/checkLogin/:email/:senha", async (req, res) => {
  const email = req.params.email;
  const senha = req.params.senha;
  const resposta = await userDataReader.checkLogin(email, senha)
  console.log(resposta);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.post("/addProduto", async (req, res) => {
  console.log(req.body);
  const nome = req.body.nome;
  const descricao = req.body.descricao;
  const preco = req.body.preco;
  const categoria = req.body.categoria;
  const quantidade = req.body.quantidade;
  const imagem = req.body.imagem;
  const data = {
    nome: nome,
    descricao: descricao,
    preco: preco,
    categoria: categoria,
    quantidade: quantidade,
    imagem: imagem,
  }
  const resposta = await userDataReader.addProduto(data);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/vendas", async (req, res) => {
  const resposta = await userDataReader.getVendas();
  res.send(resposta);
});

app.get("/produtos", async (req, res) => {
  const resposta = await userDataReader.getProdutos();
  res.send(resposta);
});

app.delete("/produtos/:id", async (req, res) => {
  const id = req.params.id;
  const resposta = await userDataReader.deleteProduto(id);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.put("/produtos/:id", async (req, res) => {
  const id = req.params.id;
  const nome = req.body.nome;
  const descricao = req.body.descricao;
  const preco = req.body.preco;
  const categoria = req.body.categoria;
  const quantidade = req.body.quantidade;

  const data = {
    id: id,
    nome: nome,
    descricao: descricao,
    preco: preco,
    categoria: categoria,
    quantidade: quantidade,
  }
  const resposta = await userDataReader.updateProduto(data);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});


module.exports = app;
