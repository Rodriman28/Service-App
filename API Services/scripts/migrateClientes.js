/**
 * Script de migración: Crear clientes frecuentes a partir de servicios existentes.
 *
 * Este script:
 * 1. Lee todos los ingresos (servicios) existentes en la base de datos.
 * 2. Agrupa los servicios por cliente único (nombre + apellido + teléfono).
 * 3. Crea un registro en la tabla `clientes` por cada cliente único encontrado.
 * 4. Actualiza cada ingreso con el `cliente_id` correspondiente.
 *
 * Uso:  node scripts/migrateClientes.js
 */

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const SQL = await initSqlJs();

  const dbPath = path.join(__dirname, '..', 'database.sqlite');

  if (!fs.existsSync(dbPath)) {
    console.error('❌ No se encontró el archivo database.sqlite');
    process.exit(1);
  }

  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  // Asegurarse de que la columna cliente_id existe
  try {
    db.run("ALTER TABLE ingresos ADD COLUMN cliente_id INTEGER");
    console.log('✅ Columna cliente_id creada en ingresos.');
  } catch (e) {
    // Ya existe, continuar
  }

  // 1. Leer todos los ingresos
  const stmtIngresos = db.prepare('SELECT * FROM ingresos ORDER BY id ASC');
  const ingresos = [];
  while (stmtIngresos.step()) {
    ingresos.push(stmtIngresos.getAsObject());
  }
  stmtIngresos.free();

  console.log(`📋 Se encontraron ${ingresos.length} servicios en la base de datos.`);

  if (ingresos.length === 0) {
    console.log('ℹ️  No hay servicios para procesar. Saliendo.');
    process.exit(0);
  }

  // 2. Agrupar servicios por cliente único (clave: nombre_apellido_telefono normalizado)
  const clientesMap = new Map();

  for (const ing of ingresos) {
    const nombre = (ing.nombre_c || '').trim();
    const apellido = (ing.apellido_c || '').trim();
    const telefono = (ing.telefono || '').trim();

    if (!nombre && !apellido) continue; // Saltar registros sin datos de cliente

    const clave = `${nombre.toLowerCase()}|${apellido.toLowerCase()}|${telefono.toLowerCase()}`;

    if (!clientesMap.has(clave)) {
      clientesMap.set(clave, {
        nombre,
        apellido,
        telefono,
        servicios: []
      });
    }

    clientesMap.get(clave).servicios.push(ing.id);
  }

  console.log(`👥 Se identificaron ${clientesMap.size} clientes únicos.`);

  // 3. Crear clientes y asociar servicios
  let clientesCreados = 0;
  let serviciosActualizados = 0;

  for (const [clave, datos] of clientesMap) {
    // Verificar si ya existe un cliente con los mismos datos
    const stmtCheck = db.prepare(
      "SELECT id FROM clientes WHERE LOWER(TRIM(nombre)) = ? AND LOWER(TRIM(apellido)) = ? AND LOWER(TRIM(telefono)) = ?"
    );
    stmtCheck.bind([
      datos.nombre.toLowerCase(),
      datos.apellido.toLowerCase(),
      datos.telefono.toLowerCase()
    ]);

    let clienteId = null;

    if (stmtCheck.step()) {
      clienteId = stmtCheck.getAsObject().id;
      console.log(`  ↪ Cliente existente: ${datos.nombre} ${datos.apellido} (ID: ${clienteId})`);
    }
    stmtCheck.free();

    if (!clienteId) {
      // Crear el cliente
      db.run(
        "INSERT INTO clientes (nombre, apellido, telefono, cedula, services_id, services_num_service) VALUES (?, ?, ?, '', '', '')",
        [datos.nombre, datos.apellido, datos.telefono]
      );

      const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
      clienteId = lastIdResult[0].values[0][0];
      clientesCreados++;
      console.log(`  ✅ Cliente creado: ${datos.nombre} ${datos.apellido} (ID: ${clienteId}) — ${datos.servicios.length} servicio(s)`);
    }

    // 4. Actualizar los ingresos con el cliente_id
    for (const ingresoId of datos.servicios) {
      db.run("UPDATE ingresos SET cliente_id = ? WHERE id = ?", [clienteId, ingresoId]);
      serviciosActualizados++;
    }
  }

  // Guardar cambios
  const data = db.export();
  const bufferOut = Buffer.from(data);
  fs.writeFileSync(dbPath, bufferOut);

  console.log('\n══════════════════════════════════════');
  console.log('  📊 Resumen de Migración');
  console.log('══════════════════════════════════════');
  console.log(`  Clientes creados:       ${clientesCreados}`);
  console.log(`  Clientes ya existentes: ${clientesMap.size - clientesCreados}`);
  console.log(`  Servicios vinculados:   ${serviciosActualizados}`);
  console.log('══════════════════════════════════════');
  console.log('✅ Migración completada exitosamente.');

  db.close();
}

migrate().catch(err => {
  console.error('❌ Error durante la migración:', err);
  process.exit(1);
});
