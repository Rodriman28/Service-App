const mongoose = require('mongoose');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const MONGO_URI = 'mongodb+srv://admin:admin@cluster0.sdeye2z.mongodb.net/?retryWrites=true&w=majority';
const SQLITE_PATH = path.join(__dirname, '..', 'database.sqlite');

const clientesSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  telefono: String,
  cedula: String,
  services: {
    id: String,
    num_service: String
  }
});

const ingresosSchema = new mongoose.Schema({
  numero_service: Number,
  nombre_c: String,
  apellido_c: String,
  telefono: String,
  fecha_ingreso: String,
  hora_ingreso: String,
  marca: String,
  modelo: String,
  falla: String,
  precio: String,
  seña: String,
  estado: String
});

async function migrate() {
  console.log('Conectando a MongoDB...');
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const Clientes = mongoose.model('Clientes', clientesSchema);
  const Ingresos = mongoose.model('Ingresos', ingresosSchema);

  console.log('Extrayendo datos de MongoDB...');
  const mongoClientes = await Clientes.find({}).lean();
  const mongoIngresos = await Ingresos.find({}).lean();

  console.log(`Encontrados: ${mongoClientes.length} clientes, ${mongoIngresos.length} ingresos`);

  await mongoose.disconnect();

  console.log('Inicializando SQLite...');
  const SQL = await initSqlJs();
  
  let db;
  if (fs.existsSync(SQLITE_PATH)) {
    const buffer = fs.readFileSync(SQLITE_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  console.log('Migrando clientes...');
  for (const c of mongoClientes) {
    const servicesId = c.services?.id || null;
    const servicesNum = c.services?.num_service || null;
    
    db.run(
      `INSERT INTO clientes (nombre, apellido, telefono, cedula, services_id, services_num_service) VALUES (?, ?, ?, ?, ?, ?)`,
      [c.nombre, c.apellido, c.telefono, c.cedula, servicesId, servicesNum]
    );
  }

  console.log('Migrando ingresos...');
  for (const i of mongoIngresos) {
    db.run(
      `INSERT INTO ingresos (numero_service, nombre_c, apellido_c, telefono, fecha_ingreso, hora_ingreso, marca, modelo, falla, precio, seña, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [i.numero_service, i.nombre_c, i.apellido_c, i.telefono, i.fecha_ingreso, i.hora_ingreso, i.marca, i.modelo, i.falla, i.precio, i.seña, i.estado]
    );
  }

  const data = db.export();
  fs.writeFileSync(SQLITE_PATH, Buffer.from(data));

  console.log('¡Migración completada!');
  console.log(`- Clientes migrados: ${mongoClientes.length}`);
  console.log(`- Ingresos migrados: ${mongoIngresos.length}`);
}

migrate().catch(err => {
  console.error('Error en migración:', err);
  process.exit(1);
});