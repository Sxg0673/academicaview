const { Router } = require('express');
const router = Router();
const usuariosModel = require('../models/usuariosModel');

// POST /api/usuarios/login
router.post('/api/usuarios/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuariosModel.buscarPorEmail(email);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/usuarios/registro
router.post('/api/usuarios/registro', async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    const existe = await usuariosModel.buscarPorEmail(email);
    if (existe) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const result = await usuariosModel.crearUsuario(nombre, apellido, email, password, rol || 'estudiante');
    res.status(201).json({ 
      mensaje: 'Usuario creado exitosamente',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

module.exports = router;
