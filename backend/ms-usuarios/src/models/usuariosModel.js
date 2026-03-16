const db = require('./db');

async function buscarPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  return rows[0];
}

async function crearUsuario(nombre, apellido, email, password, rol) {
  const [result] = await db.query(
    'INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, apellido, email, password, rol]
  );
  return result;
}

module.exports = { buscarPorEmail, crearUsuario };
