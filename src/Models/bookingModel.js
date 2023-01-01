const mongoose = require('mongoose');
const Vaccine = require('./VaccineSlotModel');

const bookSchema = mongoose.Schema({
  day: {
    type: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  dose: {
    type: String,
    enum: ['first', 'second'],
  },
});

bookSchema.statics.updateData = async function () {
  const Obj = {};
  const bookings = await Booking.find();
  bookings.map((each) => {
    Obj[each.day] = Obj[each.day] ? Obj[each.day] + 1 : 1;
  });
  const vaccine = await Vaccine.find();
  vaccine[0].slots.map((each) => {
    each.qty = 10 - (Obj[each.time] ? Obj[each.time] : 0);
  });
  await vaccine[0].save();
};

bookSchema.post('save', function () {
  this.constructor.updateData();
});

const Booking = mongoose.model('Booking', bookSchema);
module.exports = Booking;
