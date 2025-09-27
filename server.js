const express = require("express");
const basicAuth = require("express-basic-auth");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Usuarios permitidos
app.use(basicAuth({
  users: { "sanare": "2025", "admin": "1234" },
  challenge: true,
  unauthorizedResponse: () => "Credenciales inválidas. Intenta de nuevo."
}));

// 🚫 Forzar siempre login (no cache)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Función para asignar Content-Type según extensión
function getContentType(file) {
  const ext = path.extname(file).toLowerCase();
  switch (ext) {
    case ".css": return "text/css";
    case ".js": return "application/javascript";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".gif": return "image/gif";
    case ".svg": return "image/svg+xml";
    case ".json": return "application/json";
    default: return "text/html";
  }
}

// Ruta principal → index.html
app.get("/", async (req, res) => {
  const url = "https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/index.html";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontró el index.html");
    const data = await response.text();
    res.set("Content-Type", "text/html");
    res.send(data);
  } catch (err) {
    res.status(500).send("Error cargando el index.html");
  }
});

// Rutas genéricas (css, js, imágenes, etc.)
app.get("/:file", async (req, res) => {
  const file = req.params.file;
  const url = `https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/${file}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontró el archivo");

    const buffer = await response.buffer();
    res.set("Content-Type", getContentType(file));
    res.send(buffer);

  } catch (err) {
    res.status(404).send("Archivo no encontrado");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
