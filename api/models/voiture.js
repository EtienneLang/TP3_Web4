const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voitureSchema = new Schema(
  {
    marque: {
      type: String,
      required: true,
      maxlength: [50, 'La marque doit contenir au plus 50 caractères'],
      minlength: [1, 'La marque doit contenir au moins 1 caractères']
    },
    modele: {
      type: String,
      required: true,
      maxlength: [50, 'Le modèle doit contenir au plus 50 caractères'],
      minlength: [1, 'Le modèle doit contenir au moins 1 caractères']
    },
    couleur: {
      type: String,
      required: true,
      maxlength: [50, 'La couleur doit contenir au plus 50 caractères'],
      minlength: [3, 'La couleur doit contenir au moins 3 caractères']
    },
    plaque: {
      type: String,
      required: true,
      length: [6, 'La plaque doit contenir 6 caractères'],
    },
    valet: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isParked: {
      type: Boolean,
      default: false,
    },
    isMoving: {
      type: Boolean,
      default: false,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    timeToLeave: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Voiture', voitureSchema);
