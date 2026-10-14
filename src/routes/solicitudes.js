const express = require('express');
const Solicitud = require('../models/Solicitud');
const { proteger, permitirRoles } = require('../middleware/auth');

const router = express.Router();
router.use(proteger);

// Un estudiante solo ve/modifica lo suyo; el admin ve todo
const filtroAcceso = (req) => (req.user.rol === 'admin' ? {} : { solicitante: req.user._id });

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const { titulo, descripcion, tipo } = req.body;
    const solicitud = await Solicitud.create({ titulo, descripcion, tipo, solicitante: req.user._id });
    res.status(201).json(solicitud);
  } catch (err) {
    next(err);
  }
});

// READ (lista, con filtros opcionales ?estado=&tipo=)
router.get('/', async (req, res, next) => {
  try {
    const filtro = filtroAcceso(req);
    if (req.query.estado) filtro.estado = req.query.estado;
    if (req.query.tipo) filtro.tipo = req.query.tipo;
    const lista = await Solicitud.find(filtro).populate('solicitante', 'nombre email').sort({ createdAt: -1 });
    res.json(lista);
  } catch (err) {
    next(err);
  }
});

// READ (una)
router.get('/:id', async (req, res, next) => {
  try {
    const s = await Solicitud.findOne({ _id: req.params.id, ...filtroAcceso(req) }).populate('solicitante', 'nombre email');
    if (!s) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.json(s);
  } catch (err) {
    next(err);
  }
});

// UPDATE (el estudiante edita título/descr./tipo; solo admin cambia estado)
router.put('/:id', async (req, res, next) => {
  try {
    const cambios = {};
    ['titulo', 'descripcion', 'tipo'].forEach((c) => {
      if (req.body[c] !== undefined) cambios[c] = req.body[c];
    });
    if (req.body.estado !== undefined) {
      if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo un admin puede cambiar el estado' });
      cambios.estado = req.body.estado;
    }
    const s = await Solicitud.findOneAndUpdate({ _id: req.params.id, ...filtroAcceso(req) }, cambios, {
      new: true,
      runValidators: true,
    });
    if (!s) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.json(s);
  } catch (err) {
    next(err);
  }
});

// DELETE (solo admin)
router.delete('/:id', permitirRoles('admin'), async (req, res, next) => {
  try {
    const s = await Solicitud.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.json({ mensaje: 'Solicitud eliminada' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
