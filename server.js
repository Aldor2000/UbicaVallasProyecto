const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta a la base de datos
const dbPath = path.join(__dirname, process.env.DB_PATH || 'billboards.db');

// Inicializar la base de datos si no existe
const dbExists = fs.existsSync(dbPath);
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  if (!dbExists) {
    console.log('🗄️  Base de datos no encontrada. Creando nueva base de datos...');
  }

  // Crear tabla billboards
  db.run(`
    CREATE TABLE IF NOT EXISTS billboards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT,
      status TEXT,
      size TEXT,
      latitude REAL,
      longitude REAL
    )
  `);

  // Insertar datos de prueba si la tabla está vacía
  db.get("SELECT COUNT(*) AS count FROM billboards", (err, row) => {
    if (err) {
      console.error('Error verificando la tabla billboards:', err.message);
      return;
    }
    if (row.count === 0) {
      console.log('🌟 Insertando datos de prueba en billboards...');
      const stmt = db.prepare(`
        INSERT INTO billboards (location, status, size, latitude, longitude)
        VALUES (?, ?, ?, ?, ?)
      `);

      const sampleData = [
        ['Billboard 1', 'available', 'large', -16.5, -68.1],
        ['Billboard 2', 'occupied', 'medium', -16.6, -68.2],
        ['Billboard 3', 'available', 'small', -16.55, -68.15],
      ];

      sampleData.forEach(item => stmt.run(item));
      stmt.finalize();
    }
  });
});

// Servir archivos estáticos desde /public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint: obtener todas las vallas
app.get('/api/billboards', (req, res) => {
  db.all("SELECT * FROM billboards", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Endpoint: obtener billboard por id
app.get('/api/billboards/:id', (req, res) => {
  db.get("SELECT * FROM billboards WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Billboard not found" });
    res.json(row);
  });
});

// Endpoint: obtener marcadores para Leaflet con filtros
app.get('/api/billboards/locations', (req, res) => {
  let sql = `
    SELECT id, location, status, size, latitude, longitude
    FROM billboards
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
  `;
  const params = [];

  if (req.query.status) {
    sql += " AND status = ?";
    params.push(req.query.status);
  }
  if (req.query.size) {
    sql += " AND size = ?";
    params.push(req.query.size);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error en /api/billboards/locations:', err.message);
      return res.status(500).json([]); // Siempre devuelve array
    }
    res.json(rows); // rows siempre es un array
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
