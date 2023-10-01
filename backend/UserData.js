const { format } = require("date-fns");
const { tr } = require("date-fns/locale");
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

  async getQuantidade(itemId) {
    let result = await pool.query(
      `SELECT quantidade FROM produtos WHERE id = '${itemId}'`
    );
    if (result.rowCount > 0) {
      return result.rows[0].quantidade;
    } else {
      return 0;
    }
  }

  async getPedido(pedidoId) {
    let result = await pool.query(
      `SELECT * FROM pedidos WHERE num_pedido = '${pedidoId}'`
    );
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async getSessionId(userId) {
    let result = await pool.query(
      `SELECT session_id FROM session_adm WHERE user_id = '${userId}' ORDER BY data DESC LIMIT 1`
    );
    if (result.rowCount > 0) {
      return result.rows[0].session_id;
    } else {
      return null;
    }
  }

  async createSessionId(clienteId) {
    const sessionId = uuidv4();
    const result = await pool.query(
      `INSERT INTO session_adm (session_id, user_id) VALUES ('${sessionId}', '${clienteId}')`
    );
    if (result.rowCount > 0) {
      return sessionId;
    } else {
      return null;
    }
  }

  async checkSessionExists(sessionId) {
    try {
      const query = {
        text: "SELECT * FROM session_adm WHERE session_id = $1",
        values: [sessionId],
      };
      const result = await pool.query(query);
      return result.rows.length > 0;
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      throw error;
    }
  }

  async deleteSessionByUserId(sessionid) {
    try {
      const query = {
        text: "DELETE FROM session_adm WHERE session_id = $1",
        values: [sessionid],
      };
      const result = await pool.query(query);
      return result.rowCount;
    } catch (error) {
      console.error("Erro ao excluir sessão por ID do usuário:", error);
      throw error;
    }
  }

  async getSessionByUserId(userId) {
    try {
      const query = {
        text: "SELECT * FROM session_adm WHERE user_id = $1 ORDER BY data DESC LIMIT 1",
        values: [userId],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao buscar sessão por ID do usuário:", error);
      throw error;
    }
  }

  async getUserBySession(sessionId) {
    try {
      const query = {
        text: "SELECT * FROM session_adm WHERE session_id = $1 ORDER BY data DESC LIMIT 1",
        values: [sessionId],
      };
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error("Erro ao buscar sessão por ID:", error);
      return 0;
    }
  }

  async getCleinteByEmail(email) {
   let result = await pool.query(
      `SELECT * FROM usuarios WHERE email = '${email}'`
    );
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async getClienteBySessionId(sessionId) {
    let result = await pool.query(
      `SELECT * FROM usuarios WHERE id = (SELECT user_id FROM session WHERE session_id = '${sessionId}')`
    );
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async updateQuantidade (itemId, amount) {
    let result = await pool.query(
      `UPDATE produtos SET quantidade = quantidade + $1 WHERE id = $2`,
      [amount, itemId]
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }
  async updateQuantidadeConc (itemId, amount) {
    console.log(itemId, amount);
    let result = await pool.query(
      `UPDATE produtos SET quantidade = quantidade - $1 WHERE id = $2`,
      [amount, itemId]
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getDestaqueProduto(itemId) {
    let result = await pool.query(
      `SELECT destaque FROM produtos WHERE id = '${itemId}'`
    );
    console.log(result.rows[0].destaque);
    if (result.rows[0].destaque == true) {
      return true;
    } else {
      return false;
    }
  }

  async addTotalVenda(total) {
    let result = await pool.query(
      `UPDATE stats SET tot_venda = tot_venda + ${total}`
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async destaqueProduto(itemId, bool) {
    let result = await pool.query(
      `UPDATE produtos SET destaque = '${bool}' WHERE id = '${itemId}'`
    );
    if (result.rowCount > 0) {
      return true;
    }
  }


  async cancelarPedido(pedidoId) {
    let result = await pool.query(
      `UPDATE pedidos SET status = 'Cancelado' WHERE num_pedido = '${pedidoId}'`
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getProdutosPedido(pedidoId) {
    let result = await pool.query(
      `SELECT * FROM pedido_produtos WHERE pedido_id = '${pedidoId}'`
    );
    if (result.rowCount > 0) {
      return result.rows;
    } else {
      return null;
    }
  }

  async addProduto(produto) {
    const id = await this.getNextProdutoId();
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

  async getPedidos() {
    let result = await pool.query(`SELECT * FROM pedidos ORDER BY data DESC`);
    if (result.rowCount > 0) {
      return result.rows;
    } else {
      return null;
    }
  }

  async getNumOfClientes() {
    let result = await pool.query(`SELECT COUNT(*) FROM clientes`);
    if (result.rowCount > 0) {
      return result.rows[0].count;
    } else {
      return 0;
    }
  }
  
  async getVendas() {
    let result = await pool.query(`SELECT * FROM stats`);

    const data = result.rows.map((row) => {
      return {
        vendas: row.tot_venda,
      };
    });
    return data;
  }

  async getLogs() {
    let result = await pool.query(`SELECT * FROM log_estoque ORDER BY data DESC`);

    const data = result.rows.map((row) => {
      return {
        id: row.id,
        data: format(new Date(row.data), "dd/MM/yyyy HH:mm:ss"),
        nome: row.nome,
        quantidade: row.quantidade,
        categoria: row.categoria,
      };
    });
    return data;
  }

  async concluirPedido(pedidoId) {
    let result = await pool.query(
      `UPDATE pedidos SET status = 'Concluído', pagamento = 'Aprovado' WHERE num_pedido = '${pedidoId}'`
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getProduto(id) {
    let result = await pool.query(`SELECT * FROM produtos WHERE id = '${id}'`);
    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async addLog(log) {
    const quantidadeNumerico = parseInt(log.quantidade);
    let result = await pool.query(
      `INSERT INTO log_estoque (nome, categoria, quantidade) VALUES ('${log.nome}', '${log.categoria}', ${quantidadeNumerico})`
    );
    if (result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async getProdutos() {
    let result = await pool.query(`SELECT * FROM produtos ORDER BY nome ASC`);

    const data = result.rows.map((row) => {
      return {
        id: row.id,
        nome: row.nome,
        descricao: row.descricao,
        preco: row.preco,
        categoria: row.categoria,
        quantidade: row.quantidade,
        imagem: row.imagem,
        destaque: row.destaque,
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
