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
  if (flag && flag.qty) {
    req.body.user = req.user._id;
    const booking = await Booking.create(req.body);
    return res.status(201).json({
      status: true,
      message: 'booking success!',
      booking,
    });
  }
  next(new AppError(`Booking not available on this date`, 400));
});

exports.updateVaccineSlot = CatchAsync(async (req, res, next) => {
  const vaccine = await Vaccine.find();
  const flag = vaccine[0].slots.find((e) => e.time === req.body.day);
  if (flag && flag.qty) {
    const booking = await Booking.findByIdAndUpdate(
      { _id: req.body.bookingId },
      {
        $set: { day: req.body.day },
      },
      { new: true }
    );
    return res.status(200).json({
      status: true,
      message: 'booking update success!',
      booking,
    });
  }
  next(new AppError(`Booking not available on this date`, 400));
});
