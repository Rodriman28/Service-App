const { getDb, saveDatabase } = require('../config/database');

const Clientes = {
  async findAll() {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM clientes');
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  async findByPk(id) {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM clientes WHERE id = ?');
    stmt.bind([id]);
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  },

  async create(data) {
    const db = getDb();
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    const columns = fields.join(', ');
    
    db.run(`INSERT INTO clientes (${columns}) VALUES (${placeholders})`, values);
    saveDatabase();
    
    const lastId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    return { id: lastId, ...data };
  },

  async update(data, id) {
    const db = getDb();
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(f => `${f} = ?`). join(', ');
    
    db.run(`UPDATE clientes SET ${setClause} WHERE id = ?`, [...values, id]);
    saveDatabase();
    
    return this.findByPk(id);
  },

  async destroy(id) {
    const db = getDb();
    db.run('DELETE FROM clientes WHERE id = ?', [id]);
    saveDatabase();
  }
};

module.exports = Clientes;