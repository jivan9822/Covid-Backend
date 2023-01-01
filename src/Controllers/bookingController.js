const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Booking = require('../Models/bookingModel');
const User = require('../Models/userModel');
const Vaccine = require('../Models/VaccineSlotModel');

exports.getVaccineAvailability = CatchAsync(async (req, res, next) => {
  const result = await Vaccine.find();
  if (!result.length) {
    return next(new AppError('Vaccine Not available! Please try again!', 404));
  }
  const date = result[0].slots.filter((each) => {
    return each.time.startsWith(req.body.day);
  });
  res.send(date);
});

exports.bookVaccineSlot = CatchAsync(async (req, res, next) => {
  const vaccine = await Vaccine.find();
  const flag = vaccine[0].slots.find((e) => e.time === req.body.day);
  if (flag.qty) {
    req.body.user = req.user._id;
    const booking = await Booking.create(req.body);
    return res.send(booking);
  }
  res.send('Booking fail');
});

exports.updateVaccineSlot = CatchAsync(async (req, res, next) => {
  await Booking.findOneAndDelete({ user: req.user._id });
  req.body.user = req.user._id;
  const booking = await Booking.create(req.body);

  res.send(booking);
});
