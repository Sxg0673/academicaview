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

module.exports = { obtenerTodos, obtenerPorUsuarioId, actualizarHabitos };
