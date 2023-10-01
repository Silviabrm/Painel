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

app.put("/updateQuantidade/:itemId", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const itemId = req.params.itemId;
  const amount = parseInt(req.body.amount);

  const produto = await userDataReader.getProduto(itemId);
  try {
    const logData = {
      nome: produto.nome,
      categoria: produto.categoria,
      quantidade: amount,
    };
    const logResposta = await userDataReader.addLog(logData);
    const response = await userDataReader.updateQuantidade(itemId, amount);

    if (response.rowCount > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Erro ao atualizar a quantidade.");
  }
});

app.get("/logs", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const resposta = await userDataReader.getLogs();
  res.send(resposta);
});

app.get("/checkLogin/:email/:senha", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const email = req.params.email;
  const senha = req.params.senha;
  try {
    const user = await userDataReader.getCleinteByEmail(email);
    await userDataReader.createSessionId(user.id);
    const resposta = await userDataReader.checkLogin(email, senha);
    console.log(resposta + " " + user.id);
    const idSessao = await userDataReader.getSessionId(user.id);
    res.cookie("userId", idSessao, {
      maxAge: 604800000, // 1 semana
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    if (resposta) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/verificarCookie", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const userId = req.cookies["userId"];
  const data = await userDataReader.getUserBySession(userId);
  try {
    const sessionExists = await userDataReader.checkSessionExists(userId);
    if (!sessionExists) {
      res.json({ success: false });
      return;
    } else {
      res.json({ success: true, id: data.user_id });
      return;
    }
  } catch (error) {
    res.json({ redirect: "/index.html" });
    console.error("Erro ao verificar sessão:", error);
    //res.status(500).json({ message: 'Erro ao verificar sessão.' });
  }
});

app.post("/addLog", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const nome = req.body.nome;
  const categoria = req.body.categoria;
  const quantidade = req.body.quantidade;
  const data = req.body.data;
  const dataObject = {
    nome: nome,
    categoria: categoria,
    quantidade: quantidade,
    data: new Date(data),
  };
  const resposta = await userDataReader.addLog(dataObject);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.post("/addProduto", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
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
  };

  const logData = {
    nome: nome,
    categoria: categoria,
    quantidade: quantidade,
  };

  const logResposta = await userDataReader.addLog(logData);

  const resposta = await userDataReader.addProduto(data);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/getPedidos", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const resposta = await userDataReader.getPedidos();
  res.json(resposta);
});

app.get("/getPedido/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const id = req.params.id;
  const resposta = await userDataReader.getPedido(id);
  res.json(resposta);
});

app.get("/getStats", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const clientes = await userDataReader.getNumOfClientes();
  const vendas = await userDataReader.getVendas();
  const data = {
    qtdUser: clientes,
    vendas: vendas[0].vendas,
  };
  res.json(data);
});

app.get("/getProdutosPedido/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const id = req.params.id;
  const resposta = await userDataReader.getProdutosPedido(id);

  res.json(resposta);
});

app.put("/concluirPedido/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const id = req.params.id;
  const pedido = await userDataReader.getPedido(id);
  await userDataReader.addTotalVenda(pedido.total);
  await userDataReader.concluirPedido(id);
  try {
    const resposta = await userDataReader.getProdutosPedido(id);
    console.log(resposta);
    resposta.forEach(async (produto) => {
      await userDataReader.updateQuantidadeConc(
        produto.produto_id,
        produto.quantidade
      );
    });
  } catch (error) {
    console.log(error);
  }
});

app.put("/destaque/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const id = req.params.id;
  const destacado = await userDataReader.getDestaqueProduto(id);
  
  console.log(destacado);
  if (destacado) {
    await userDataReader.destaqueProduto(id, false);
    res.send(false);
  } else if (!destacado){
    console.log("entrou");
    await userDataReader.destaqueProduto(id, true);
    res.send(true);
  }
});

app.put("/cancelarPedido/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const id = req.params.id;
  const resposta = await userDataReader.cancelarPedido(id);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/produtos/:itemId", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const itemId = req.params.itemId;
  var resposta;
  if (itemId === "undefined") {
    resposta = await userDataReader.getProdutos();
  } else {
    resposta = await userDataReader.getProduto(itemId);
  }
  res.json(resposta);
});

app.get("/produtos", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const resposta = await userDataReader.getProdutos();
  res.send(resposta);
});

app.delete("/produtos/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  const id = req.params.id;
  const resposta = await userDataReader.deleteProduto(id);
  if (resposta) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.put("/produtos/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
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
  };
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
