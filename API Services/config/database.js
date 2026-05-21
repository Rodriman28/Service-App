const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.sqlite');

async function initDatabase() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    // Crear el directorio padre si no existe
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new SQL.Database();
  }
  
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      apellido TEXT,
      telefono TEXT,
      cedula TEXT,
      services_id TEXT,
      services_num_service TEXT
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS ingresos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_service INTEGER,
      nombre_c TEXT,
      apellido_c TEXT,
      telefono TEXT,
      fecha_ingreso TEXT,
      hora_ingreso TEXT,
      marca TEXT,
      modelo TEXT,
      falla TEXT,
      precio TEXT,
      seña TEXT,
      estado TEXT,
      cliente_id INTEGER
    )
  `);

  try {
    db.run("ALTER TABLE ingresos ADD COLUMN cliente_id INTEGER");
  } catch (e) {
    // Ignorar si la columna ya existe
  }
  
  saveDatabase();
  
  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

function getDb() {
  return db;
}

module.exports = { initDatabase, getDb, saveDatabase };