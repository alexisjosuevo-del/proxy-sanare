const express = require("express");
const basicAuth = require("express-basic-auth");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Usuarios permitidos
app.use(basicAuth({
  users: { "sanare": "2025", "admin": "1234" },
  challenge: true,
  unauthorizedResponse: () => "Credenciales inválidas. Intenta de nuevo."
}));

// 🚫 Forzar que siempre se pida login (no guardar en caché)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Ruta principal → index.html reescrito con rutas absolutas
app.get("/", async (req, res) => {
  const url = "https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/index.html";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontró el index.html");
    let data = await response.text();

    // Reemplazar rutas relativas por absolutas a GitHub Pages
    data = data.replace(/href="(?!http)([^"]+)"/g, 'href="https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/$1"');
    data = data.replace(/src="(?!http)([^"]+)"/g, 'src="https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/$1"');

    res.set("Content-Type", "text/html");
    res.send(data);
  } catch (err) {
    res.status(500).send("Error cargando el index.html");
  }
});

// Para cualquier otro archivo (ej: /app.js, /styles.css, etc.)
app.get("/:file", async (req, res) => {
  const file = req.params.file;
  const url = `https://alexisjosuevo-del.github.io/Cotizador-Sanare1.1/${file}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se encontró el archivo");

    const buffer = await response.buffer();
    res.send(buffer);

  } catch (err) {
    res.status(404).send("Archivo no encontrado");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
