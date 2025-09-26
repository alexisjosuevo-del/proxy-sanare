const express = require("express");
const basicAuth = require("express-basic-auth");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Usuario y contraseña para entrar
app.use(basicAuth({
  users: { "sanare": "2025" },  // Usuario: sanare | Contraseña: 2025
  challenge: true
}));

// Ruta para acceder a archivos de GitHub
app.get("/:file", async (req, res) => {
  const file = req.params.file;

  // 👇 Aquí cambias el usuario y repo por los tuyos
  const url = `https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/${file}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontró el archivo");
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(404).send("Archivo no encontrado");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
