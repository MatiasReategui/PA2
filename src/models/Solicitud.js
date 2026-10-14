const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: [true, 'El título es obligatorio'], trim: true, maxlength: 120 },
    descripcion: { type: String, required: [true, 'La descripción es obligatoria'], trim: true },
    tipo: {
      type: String,
      enum: ['constancia', 'reclamo', 'retiro', 'convalidacion', 'otro'],
      default: 'otro',
    },
    estado: { type: String, enum: ['pendiente', 'en_proceso', 'aprobada', 'rechazada'], default: 'pendiente' },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Solicitud', solicitudSchema);
