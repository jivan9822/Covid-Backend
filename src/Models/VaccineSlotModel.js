const mongoose = require('mongoose');

const VaccineSchema = mongoose.Schema({
  date: {
    type: String,
    match: [/\d{4}-\d{2}-\d{2}/, 'Please provide a valid date ex. 2023-02-01'],
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
