const { getDb, saveDatabase } = require('../config/database');

const Ingresos = {
  async getNextServiceNumber() {
    const db = getDb();
    const result = db.exec('SELECT MAX(numero_service) as max_num FROM ingresos');
    const maxNum = result[0]?.values[0][0];
    return maxNum ? maxNum + 1 : 1;
  },

  async count() {
    const db = getDb();
    const result = db.exec('SELECT COUNT(*) as total FROM ingresos');
    return result[0]?.values[0][0] || 0;
  },

  async findAll(limit = null, offset = 0) {
    const db = getDb();
    let query = 'SELECT * FROM ingresos ORDER BY id DESC';
    let params = [];
    if (limit !== null) {
      query += ' LIMIT ? OFFSET ?';
      params = [limit, offset];
    } else if (offset > 0) {
      query += ' LIMIT -1 OFFSET ?';
      params = [offset];
    }
    const stmt = db.prepare(query);
    if (params.length > 0) {
      stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  async findByPk(id) {
    const db = getDb();
    const numId = parseInt(id);
    const stmt = db.prepare('SELECT * FROM ingresos WHERE id = ?');
    stmt.bind([numId]);
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  },

  async create(data) {
    const db = getDb();
    const nextNum = await this.getNextServiceNumber();
    const dataWithNum = { ...data, numero_service: nextNum };
    
    const fields = Object.keys(dataWithNum);
    const values = Object.values(dataWithNum);
    const placeholders = fields.map(() => '?').join(', ');
    const columns = fields.join(', ');
    
    db.run(`INSERT INTO ingresos (${columns}) VALUES (${placeholders})`, values);
    saveDatabase();
    
    const lastId = db.exec('SELECT last_insert_rowid() as id')[0].values[0][0];
    return { id: lastId, ...dataWithNum };
  },

  async update(data, id) {
    const db = getDb();
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    db.run(`UPDATE ingresos SET ${setClause} WHERE id = ?`, [...values, id]);
    saveDatabase();
    
    return this.findByPk(id);
  },

  async destroy(id) {
    const db = getDb();
    db.run('DELETE FROM ingresos WHERE id = ?', [id]);
    saveDatabase();
  }
};

module.exports = Ingresos;