const express = require("express");
const path = require("path");

const app = express();

// Servir el cotizador (carpeta /public)
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
