const express = require('express');
const User = require('../models/User');
const { proteger, permitirRoles } = require('../middleware/auth');

const router = express.Router();
router.use(proteger);

// Perfil propio
router.get('/me', (req, res) => {
  const u = req.user;
  res.json({ id: u._id, nombre: u.nombre, email: u.email, rol: u.rol });
});

// Gestión de usuarios: solo admin
router.get('/', permitirRoles('admin'), async (req, res, next) => {
  try {
    res.json(await User.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
});

router.put('/:id/rol', permitirRoles('admin'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { rol: req.body.rol }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', permitirRoles('admin'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
