const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { initDatabase } = require("./config/database");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 4040;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Permitir CORS desde cualquier origen para facilitar el acceso en red local
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inyectar io a las peticiones express para emitir eventos
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/", routes());

initDatabase().then(() => {
  server.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor funcionando en puerto " + PORT);
  });
}).catch(err => {
  console.error("Error al inicializar la base de datos:", err);
});