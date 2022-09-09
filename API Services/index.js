const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");

// Crear el servidor
const app = express();

// Cors options
const whitelist = ["http://192.168.1.80:3000"];
const corsOptions = {
  origin: (origin, callback) => {
    const existe = whitelist.some((dominio) => dominio === origin);
    if (existe) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

// Habilitar cors
//app.use(cors());

// Conectar a mongodb

const urlMongo =
  "mongodb+srv://admin:admin@cluster0.sdeye2z.mongodb.net/?retryWrites=true&w=majority";
const urlZero = "mongodb://localhost/services";
mongoose.Promise = global.Promise;
mongoose.connect(urlMongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Habilitar el body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar routing
app.use("/", routes());

// Puerto y arrancar el servidor

app.listen(4000, () => {
  console.log("Servidor funcionando");
});
