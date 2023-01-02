const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Booking = require('../Models/bookingModel');
const User = require('../Models/userModel');
const Vaccine = require('../Models/VaccineSlotModel');

const getDate = (date) => {
  return (
    date
      .split('-')[0]
      .split('/')
      .map((each) => (each.length == 1 ? '0' + each : each))
      .reverse()
      .join('-') +
    'T' +
    date.split('-')[1]
  );
};

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
  const date = new Date(getDate(req.body.day)).getTime();
  if (new Date().getTime() > date) {
    return next(new AppError('Date should be greater than today!', 400));
  }
  const vaccine = await Vaccine.find();
  const flag = vaccine[0].slots.find((e) => e.time === req.body.day);
  if (flag && flag.qty) {
    req.body.user = req.user._id;

    const booking = await Booking.create(req.body);
    const { dose } = req.body;

    req.user.booking = date;

    dose == 'first'
      ? (req.user.firstDose = date)
      : (req.user.secondDose = date);

    await req.user.save();
    return res.status(201).json({
      status: true,
      message: 'booking success!',
      booking,
    });
  }
  next(new AppError(`Booking not available on this date`, 400));
});

exports.updateVaccineSlot = CatchAsync(async (req, res, next) => {
  let date = new Date(getDate(req.body.day)).getTime();
  if (date - new Date().getTime() + 86400 < 0) {
    return next('You can update slots only before 24 hour!', 400);
  }
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
