const db = require('./db');

// Fórmula del modelo_2 extraída del código R
function calcularPuntaje(horas_estudio, promedio_previo, horas_sueno, modalidad, asistencia, uso_redes) {
  const puntaje = 64.5619
    + 1.6483  * horas_estudio
    + 5.5341  * promedio_previo
    - 1.6507  * horas_sueno
    + 7.5828  * (modalidad === 'Presencial' ? 1 : 0)
    + 0.2015  * asistencia
    - 1.3381  * uso_redes;
  return Math.round(puntaje * 100) / 100;
}

// Estadísticas generales del curso para el dashboard del profesor
async function obtenerEstadisticasCurso() {
  const [rows] = await db.query(`
    SELECT
      COUNT(*)                        AS total_estudiantes,
      ROUND(AVG(puntaje_real), 2)     AS promedio_puntaje,
      ROUND(MAX(puntaje_real), 2)     AS puntaje_maximo,
      ROUND(MIN(puntaje_real), 2)     AS puntaje_minimo,
      ROUND(AVG(horas_estudio), 2)    AS promedio_horas_estudio,
      ROUND(AVG(horas_sueno), 2)      AS promedio_horas_sueno,
      ROUND(AVG(uso_redes), 2)        AS promedio_uso_redes,
      ROUND(AVG(asistencia), 2)       AS promedio_asistencia
    FROM estudiantes
  `);
  return rows[0];
}

// Distribución de puntajes por rangos para gráfica
async function obtenerDistribucionPuntajes() {
  const [rows] = await db.query(`
    SELECT
      CASE
        WHEN puntaje_real < 100 THEN 'Menos de 100'
        WHEN puntaje_real < 130 THEN '100 - 129'
        WHEN puntaje_real < 160 THEN '130 - 159'
        WHEN puntaje_real < 190 THEN '160 - 189'
        ELSE '190 o más'
      END AS rango,
      COUNT(*) AS cantidad
    FROM estudiantes
    GROUP BY rango
    ORDER BY rango
  `);
  return rows;
}

module.exports = { calcularPuntaje, obtenerEstadisticasCurso, obtenerDistribucionPuntajes };
