const { format } = require("date-fns");
const e = require("express");

const { Pool } = require("pg");
const user = process.env.POSTGRES_USER || "postgres";
const host = process.env.POSTGRES_HOST || "localhost";
const database = process.env.POSTGRES_DATABASE || "PainelSilvia";
const password = process.env.POSTGRES_PASSWORD || "Zequinha2005";
const port = process.env.POSTGRES_PORT || 5432;

const { v4: uuidv4 } = require("uuid");
const pool = new Pool({
  //ssl: true,
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
});

class UserData {
  constructor() {}
  async checkLogin(email, senha) {
    let result = await pool.query(
      `SELECT * FROM usuarios WHERE email = '${email}' AND senha = '${senha}'`
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getNextProdutoId() {
    let result = await pool.query(`SELECT MAX(id) FROM produtos`);
    if (result.rowCount > 0) {
      return result.rows[0].max + 1;
    } else {
      return 1;
    }
  }

  async addProduto(produto) {
    const id = await this.getNextProdutoId();
  
    // if (isNaN(produto.preco)) {
    //   return false; 
    // }
  
    const precoNumerico = parseFloat(produto.preco);
  
    let result = await pool.query(
      `INSERT INTO produtos (id, nome, descricao, preco, categoria, quantidade, imagem) VALUES ('${id}', '${produto.nome}', '${produto.descricao}', ${precoNumerico}, '${produto.categoria}', '${produto.quantidade}', '${produto.imagem}')`
    );
  
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }
  async getVendas() {
    let result = await pool.query(`SELECT * FROM stats`);

    const data = result.rows.map((row) => {
      return {
        vendas: row.tot_venda,
        qtdUser: row.qtd_user,
      }
    });
    return data;
  }

  async getProdutos() {
    let result = await pool.query(`SELECT * FROM produtos`);

    const data = result.rows.map((row) => {
      return {
        id: row.id,
        nome: row.nome,
        descricao: row.descricao,
        preco: row.preco,
        categoria: row.categoria,
        quantidade: row.quantidade,
        imagem: row.imagem,
      };
    });  
    return data;  
  }

  async deleteProduto(id) {
    let result = await pool.query(`DELETE FROM produtos WHERE id = '${id}'`);
    if (result.rowCount > 0) {
      return true;
    }else{
      return false;
    }
  }

  async updateProduto(produto) {
    let result = await pool.query(
      `UPDATE produtos SET nome = '${produto.nome}', descricao = '${produto.descricao}', preco = '${produto.preco}', categoria = '${produto.categoria}', quantidade = '${produto.quantidade}' WHERE id = '${produto.id}'`
    );
    if (result.rowCount > 0) {
      return true;
    }else{
      return false;
    }
  }
}

module.exports = UserData;
