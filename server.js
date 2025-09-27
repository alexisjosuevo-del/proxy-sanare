const express = require("express");
const basicAuth = require("express-basic-auth");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Configuración de usuarios
app.use(basicAuth({
  users: { 
    "sanare": "2025",   // Usuario principal
    "admin": "1234"     // Usuario adicional opcional
  },
  challenge: true,
  unauthorizedResponse: (req) => "Credenciales inválidas. Intenta de nuevo."
}));

// Ruta principal → carga index.html del cotizador
app.get("/", async (req, res) => {
  const url = "https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/index.html";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontró el index.html");
    const data = await response.text();
    res.send(data);
  } catch (err) {
    res.status(500).send("Error cargando el index.html");
  }
});

// Ruta genérica para otros archivos (ej: app.js, styles.css, etc.)
app.get("/:file", async (req, res) => {
  const file = req.params.file;
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
