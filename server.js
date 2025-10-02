// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta a la base de datos (la crearemos después)
const dbPath = path.join(__dirname, 'billboards.db');

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a SQLite en:", dbPath);
  }
});

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint: obtener todas las vallas
app.get('/api/billboards', (req, res) => {
  const sql = "SELECT * FROM billboards";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener datos" });
    } else {
      res.json(rows);
    }
  });
});

// Endpoint: obtener detalles de una valla
app.get('/api/billboards/:id', (req, res) => {
  const sql = "SELECT * FROM billboards WHERE id = ?";
  const id = req.params.id;
  db.get(sql, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: "Error al obtener datos" });
    } else if (!row) {
      res.status(404).json({ error: "Billboard not found" });
    } else {
      res.json(row);
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
