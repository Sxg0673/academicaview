const { Router } = require('express');
const router = Router();
const analiticaModel = require('../models/analiticaModel');

// POST /api/analitica/predecir - calcula el puntaje estimado
router.post('/api/analitica/predecir', async (req, res) => {
  try {
    const { horas_estudio, promedio_previo, horas_sueno,
            modalidad, asistencia, uso_redes } = req.body;

    const puntaje = analiticaModel.calcularPuntaje(
      parseFloat(horas_estudio),
      parseFloat(promedio_previo),
      parseFloat(horas_sueno),
      modalidad,
      parseFloat(asistencia),
      parseFloat(uso_redes)
    );

    res.status(200).json({ puntaje_estimado: puntaje });
  } catch (error) {
    console.error('Error al predecir puntaje:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/analitica/estadisticas - estadísticas generales del curso
router.get('/api/analitica/estadisticas', async (req, res) => {
  try {
    const estadisticas = await analiticaModel.obtenerEstadisticasCurso();
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/analitica/distribucion - distribución de puntajes por rangos
router.get('/api/analitica/distribucion', async (req, res) => {
  try {
    const distribucion = await analiticaModel.obtenerDistribucionPuntajes();
    res.status(200).json(distribucion);
  } catch (error) {
    console.error('Error al obtener distribución:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
