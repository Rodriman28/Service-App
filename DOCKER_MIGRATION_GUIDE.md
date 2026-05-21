# Guía de Despliegue en Docker y Scripts de Migración

Esta guía contiene las instrucciones necesarias para desplegar la aplicación en cualquier computadora mediante Docker, qué archivos necesitas transferir y cómo funcionan los scripts de migración de datos.

---

## 1. Archivos necesarios para el Despliegue

Si vas a instalar la aplicación en otra computadora, **no necesitas copiar todo el código fuente del proyecto** (evitando transferir archivos pesados como `node_modules` o compilados locales). Solo necesitas copiar la siguiente estructura de archivos:

```text
📁 service-app-despliegue/
├── 📁 "API Services"/
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 index.js
│   ├── 📁 config/
│   ├── 📁 controllers/
│   ├── 📁 models/
│   └── 📁 routes/
├── 📁 frontend-services/
│   ├── 📄 Dockerfile
│   ├── 📄 nginx.conf
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📄 index.html
│   ├── 📄 .env.production
│   └── 📁 src/
└── 📄 docker-compose.yml
```

> [!TIP]
> **Carpetas a excluir al copiar**: `node_modules` (en ambas carpetas), `dist` (en frontend-services) y carpetas ocultas de configuración como `.git`, `.agents` o `.claude`.

---

## 2. Instrucciones para levantar con Docker

### Requisitos previos:
- Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/macOS) o Docker Engine (Linux).

### Pasos para iniciar la aplicación:
1. Copia la carpeta `service-app-despliegue` a la computadora destino.
2. Abre una terminal (PowerShell o CMD en Windows, Terminal en Linux/macOS) en esa carpeta.
3. Ejecuta el comando para construir e iniciar los contenedores en segundo plano:
   ```bash
   docker compose up -d --build
   ```
4. Abre tu navegador e ingresa a: **`http://localhost`** (Puerto 80).

---

## 3. Cómo Cargar una Base de Datos Existente

Como el backend utiliza **sql.js** (base de datos en memoria que se vuelca a disco periódicamente), es **obligatorio detener el contenedor antes de copiar el archivo** para evitar que el servidor sobrescriba la base de datos importada con los datos vacíos que tiene en memoria.

Ejecuta estos comandos en orden dentro de la carpeta del proyecto en la máquina destino:

1. **Detener el backend:**
   ```bash
   docker compose stop backend
   ```
2. **Copiar tu base de datos local `database.sqlite` dentro del volumen del contenedor:**
   ```bash
   docker cp "API Services/database.sqlite" service-app-backend:/data/database.sqlite
   ```
3. **Iniciar el backend nuevamente:**
   ```bash
   docker compose start backend
   ```

---

## 4. Acceder por Red Local (Sin escribir la IP)

### Opción A (Recomendada): Usar el Hostname Local
1. Identifica el nombre de la PC servidor (ej: `servidor-zero`).
2. Desde cualquier celular o PC en la misma red Wi-Fi ingresa a: **`http://servidor-zero.local`**.

### Opción B: Usar Dominio Falso (Archivo `hosts`)
Edita el archivo `hosts` en las PCs clientes (Ruta en Windows: `C:\Windows\System32\drivers\etc\hosts`) y agrega al final:
```text
[IP_DEL_SERVIDOR] zero.lan
```
Luego podrás acceder escribiendo: **`http://zero.lan`**.

---

## 5. Scripts de Migración Disponibles

Los scripts se encuentran en `API Services/scripts/` y se ejecutan desde esa misma carpeta con Node.js.

### A. Migración de MongoDB a SQLite
**Archivo:** `migrate-data.js`
- **Función:** Conecta a un clúster remoto de MongoDB, extrae los clientes e ingresos y los inserta en la base de datos local de SQLite.
- **Ejecución:**
  ```bash
  cd "API Services"
  node scripts/migrate-data.js
  ```

### B. Migración de CSV a SQLite
**Archivo:** `migrate-from-csv.js`
- **Función:** Lee un archivo CSV histórico de servicios, aplica reglas de limpieza para precios y señas, y los inserta en la tabla `ingresos`.
- **Configuración:** Ajusta la ruta del archivo CSV en la línea 6 del script (`CSV_PATH`).
- **Ejecución:**
  ```bash
  cd "API Services"
  node scripts/migrate-from-csv.js
  ```

### C. Generación y Vinculación de Clientes Frecuentes
**Archivo:** `migrateClientes.js`
- **Función:** Analiza todos los servicios de la tabla `ingresos`, crea clientes únicos en la tabla `clientes` (agrupando por nombre, apellido y teléfono sin duplicados) y los enlaza de forma automática insertando el respectivo `cliente_id` en cada servicio.
- **Ejecución:**
  ```bash
  cd "API Services"
  node scripts/migrateClientes.js
  ```
