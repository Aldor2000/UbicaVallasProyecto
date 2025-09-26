const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'billboards.db');
const db = new sqlite3.Database(dbPath);

// Crear tablas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS billboards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT,
      address TEXT,
      status TEXT,
      size TEXT,
      width REAL,
      height REAL,
      total_area REAL,
      material TEXT,
      photo_url TEXT,
      price REAL,
      description TEXT,
      latitude REAL,
      longitude REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS owners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      billboard_id INTEGER,
      owner_name TEXT,
      owner_phone TEXT,
      owner_email TEXT,
      FOREIGN KEY (billboard_id) REFERENCES billboards(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Tablas creadas correctamente");
});

db.close();
