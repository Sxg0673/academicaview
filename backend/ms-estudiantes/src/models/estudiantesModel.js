const db = require('./db');

async function obtenerTodos() {
  const [rows] = await db.query(
    'SELECT * FROM estudiantes ORDER BY apellido ASC'
  );
  return rows;
}

async function obtenerPorUsuarioId(usuario_id) {
  const [rows] = await db.query(
    'SELECT * FROM estudiantes WHERE usuario_id = ?',
    [usuario_id]
  );
  return rows[0];
}

async function actualizarHabitos(usuario_id, horas_estudio, promedio_previo, horas_sueno, modalidad, asistencia, uso_redes, puntaje_estimado) {
  const [result] = await db.query(
    `UPDATE estudiantes 
     SET horas_estudio = ?, promedio_previo = ?, horas_sueno = ?,
         modalidad = ?, asistencia = ?, uso_redes = ?, puntaje_estimado = ?
     WHERE usuario_id = ?`,
    [horas_estudio, promedio_previo, horas_sueno, modalidad, asistencia, uso_redes, puntaje_estimado, usuario_id]
  );
  return result;
}

async function crearEstudiante(usuario_id, nombre, apellido, email, horas_estudio, promedio_previo, horas_sueno, modalidad, asistencia, uso_redes, puntaje_estimado) {
  const [result] = await db.query(
    `INSERT INTO estudiantes 
     (usuario_id, nombre, apellido, email, horas_estudio, promedio_previo, 
      horas_sueno, modalidad, asistencia, uso_redes, puntaje_estimado) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [usuario_id, nombre, apellido, email, horas_estudio, promedio_previo,
     horas_sueno, modalidad, asistencia, uso_redes, puntaje_estimado]
  );
  return result;
}

async function asignarPuntajeReal(id, puntaje_real) {
  const [result] = await db.query(
    'UPDATE estudiantes SET puntaje_real = ? WHERE id = ?',
    [puntaje_real, id]
  );
  return result;
}

module.exports = { obtenerTodos, obtenerPorUsuarioId, actualizarHabitos, crearEstudiante, asignarPuntajeReal };
