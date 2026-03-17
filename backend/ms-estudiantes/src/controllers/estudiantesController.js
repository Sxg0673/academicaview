const { Router } = require('express');
const router = Router();
const estudiantesModel = require('../models/estudiantesModel');

// GET /api/estudiantes - obtener todos (para el profesor)
router.get('/api/estudiantes', async (req, res) => {
  try {
    const estudiantes = await estudiantesModel.obtenerTodos();
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /api/estudiantes/:usuario_id - obtener uno (para el estudiante)
router.get('/api/estudiantes/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const estudiante = await estudiantesModel.obtenerPorUsuarioId(usuario_id);
    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/estudiantes - crear registro vacio (cuando profesor registra estudiante)
router.post('/api/estudiantes', async (req, res) => {
  try {
    const { usuario_id, nombre, apellido, email } = req.body;
    await estudiantesModel.crearEstudianteVacio(usuario_id, nombre, apellido, email);
    res.status(201).json({ mensaje: 'Registro de estudiante creado correctamente' });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PUT /api/estudiantes/:usuario_id - estudiante actualiza sus habitos
router.put('/api/estudiantes/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const { horas_estudio, promedio_previo, horas_sueno,
            modalidad, asistencia, uso_redes, puntaje_estimado } = req.body;
    await estudiantesModel.actualizarHabitos(
      usuario_id, horas_estudio, promedio_previo, horas_sueno,
      modalidad, asistencia, uso_redes, puntaje_estimado
    );
    res.status(200).json({ mensaje: 'Datos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PUT /api/estudiantes/:id/puntaje - profesor asigna puntaje real
router.put('/api/estudiantes/:id/puntaje', async (req, res) => {
  try {
    const { id } = req.params;
    const { puntaje_real } = req.body;
    await estudiantesModel.asignarPuntajeReal(id, puntaje_real);
    res.status(200).json({ mensaje: 'Puntaje real asignado correctamente' });
  } catch (error) {
    console.error('Error al asignar puntaje:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
