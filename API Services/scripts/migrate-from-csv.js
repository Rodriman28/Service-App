const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const SQLITE_PATH = path.join(__dirname, "..", "database.sqlite");
const CSV_PATH = ".\\migracion.csv";

function parseCSV(content) {
  const lines = [];
  let currentLine = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (
      (char === "\n" || (char === "\r" && nextChar === "\n")) &&
      !inQuotes
    ) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
      if (char === "\r") i++;
    } else if (char !== "\r") {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let currentValue = "";
    let inFieldQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      const nextChar = lines[i][j + 1];

      if (char === '"') {
        if (inFieldQuotes && nextChar === '"') {
          currentValue += '"';
          j++;
        } else {
          inFieldQuotes = !inFieldQuotes;
        }
      } else if (char === "," && !inFieldQuotes) {
        values.push(
          currentValue
            .trim()
            .replace(/^"|"$/g, "")
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, ""),
        );
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    values.push(
      currentValue
        .trim()
        .replace(/^"|"$/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, ""),
    );

    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || "";
    });
    rows.push(obj);
  }

  return rows;
}

function cleanPrice(value) {
  if (!value || value === "-" || value === "Pago") return "0";
  const numMatch = value.replace(/[^0-9]/g, "");
  return numMatch || "0";
}

function cleanSeña(value) {
  if (!value || value === "-" || value === "pago" || value === "") return "0";
  if (value.toLowerCase() === "pago") return "0";
  const numMatch = value.replace(/[^0-9]/g, "");
  return numMatch || "0";
}

async function migrate() {
  console.log("Inicializando SQLite...");
  const SQL = await initSqlJs();

  let db;
  if (fs.existsSync(SQLITE_PATH)) {
    const buffer = fs.readFileSync(SQLITE_PATH);
    db = new SQL.Database(buffer);
    console.log("Base de datos existente cargada");
  } else {
    db = new SQL.Database();

    db.run(`CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      apellido TEXT,
      telefono TEXT,
      cedula TEXT,
      services_id TEXT,
      services_num_service TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ingresos (
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
      estado TEXT
    )`);
    console.log("Tablas creadas");
  }

  console.log("Leyendo archivo CSV...");
  if (!fs.existsSync(CSV_PATH)) {
    console.error("Archivo CSV no encontrado:", CSV_PATH);
    process.exit(1);
  }

  const content = fs.readFileSync(CSV_PATH, "utf8");
  const ingresos = parseCSV(content);

  console.log(`- ${ingresos.length} registros encontrados`);

  console.log("Migrando ingresos...");
  let migrados = 0;

  for (const i of ingresos) {
    const numeroService = parseInt(i.numero_service) || null;
    if (!numeroService) continue;

    db.run(
      `INSERT INTO ingresos (numero_service, nombre_c, apellido_c, telefono, fecha_ingreso, hora_ingreso, marca, modelo, falla, precio, seña, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        numeroService,
        i.nombre_c || "",
        i.apellido_c || "",
        i.telefono || "",
        i.fecha_ingreso || "",
        i.hora_ingreso || "",
        i.marca || "",
        i.modelo || "",
        (i.falla || "").replace(/\n/g, " ").replace(/\\n/g, " "),
        cleanPrice(i.precio),
        cleanSeña(i.seña),
        i.estado || "Nuevo",
      ],
    );
    migrados++;
  }

  const data = db.export();
  fs.writeFileSync(SQLITE_PATH, Buffer.from(data));

  console.log("¡Migración completada!");
  console.log(`- Total registros procesados: ${ingresos.length}`);
  console.log(`- Ingresos migrados: ${migrados}`);

  const result = db.exec("SELECT COUNT(*) as total FROM ingresos");
  console.log(`- Total en BD SQLite: ${result[0]?.values[0][0] || 0}`);
}

migrate().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
