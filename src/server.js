require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { noEncontrado, manejarErrores } = require('./middleware/errores');

const app = express();

// Middleware globales
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => res.json({ api: 'Gestión de Solicitudes Académicas', estado: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/solicitudes', require('./routes/solicitudes'));

app.use(noEncontrado);
app.use(manejarErrores);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  connectDB()
    .then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
    .catch((err) => {
      console.error('No se pudo iniciar:', err.message);
      process.exit(1);
    });
}

module.exports = app;
