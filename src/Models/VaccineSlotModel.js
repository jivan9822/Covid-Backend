const mongoose = require('mongoose');

const VaccineSchema = mongoose.Schema({
  date: {
    type: String,
  },
  details: [
    {
      day: {
        type: String,
      },
      availableSlots: {
        type: [
          {
            time: {
              type: String,
            },
            quantity: {
              type: Number,
              default: 10,
            },
          },
        ],
      },
    },
  ],
});

const Vaccine = mongoose.model('Vaccine', VaccineSchema);
module.exports = Vaccine;
