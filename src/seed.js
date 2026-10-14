// Crea un usuario administrador inicial. Uso: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

(async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@ejemplo.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';
  if (await User.findOne({ email })) {
    console.log('El admin ya existe:', email);
  } else {
    await User.create({ nombre: 'Administrador', email, password, rol: 'admin' });
    console.log('Admin creado:', email);
  }
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
