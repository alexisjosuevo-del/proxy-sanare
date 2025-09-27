const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");

const app = express();

// 🔑 Usuarios y contraseñas
app.use(
  basicAuth({
    users: {
      sanare: "2025",       // Usuario principal
      medico1: "clave1",    // Otro usuario
      medico2: "clave2",    // Otro usuario
      admin: "superseguro"  // Administrador
    },
    challenge: true,
    realm: Date.now().toString(), // 👈 fuerza a pedir login SIEMPRE
    unauthorizedResponse: () => "Acceso denegado. Usuario o contraseña incorrectos.",
  })
);

// Servir tu cotizador (carpeta /public)
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
