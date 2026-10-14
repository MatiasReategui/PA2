// Middleware de manejo de errores y rutas no encontradas
function noEncontrado(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function manejarErrores(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map((e) => e.message) });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID no válido' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = { noEncontrado, manejarErrores };
