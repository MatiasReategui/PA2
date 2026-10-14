const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const firmar = (user) =>
  jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h',
  });

// POST /api/auth/register  (siempre crea rol "estudiante")
router.post('/register', async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await User.create({ nombre, email, password, rol: 'estudiante' });
    res.status(201).json({
      token: firmar(user),
      user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user || !(await user.compararPassword(password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    res.json({
      token: firmar(user),
      user: { id: user._id, nombre: user.nombre, email: user.email, rol: user.rol },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
