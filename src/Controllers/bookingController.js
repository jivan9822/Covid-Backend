const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Booking = require('../Models/bookingModel');
const Vaccine = require('../Models/VaccineSlotModel');

let today = new Date().getTime() / 1000;

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
  const date = new Date(getDate(req.body.day));

  req.body.user = req.user._id;

  const booking = await Booking.create(req.body);
  const { dose } = req.body;
  req.user.bookingId = booking._id;
  req.user.booking = date;

  dose == 'first' ? (req.user.firstDose = date) : (req.user.secondDose = date);

  await req.user.save();
  return res.status(201).json({
    status: true,
    message: 'booking success!',
    booking,
  });
});

exports.updateVaccineSlot = CatchAsync(async (req, res, next) => {
  const vaccine = await Vaccine.find();
  const flag = vaccine[0].slots.find((e) => e.time === req.body.day);
  if (flag && flag.qty) {
    const booking = await Booking.findByIdAndUpdate(
      req.user.bookingId,
      {
        $set: { day: req.body.day },
      },
      { new: true }
    );
    req.user.booking = new Date(getDate(req.body.day));

    booking.dose == 'first'
      ? (req.user.firstDose = req.user.booking)
      : (req.user.secondDose = req.user.booking);

    await req.user.save();
    return res.status(200).json({
      status: true,
      message: 'booking update success!',
      booking,
    });
  }
  next(new AppError(`Booking not available on this date`, 400));
});

exports.cancelVaccinationSlot = CatchAsync(async (req, res, next) => {
  const booking = await Booking.findOneAndDelete({ _id: req.user.bookingId });
  if (booking.dose == 'first') {
    req.user.firstDose = null;
  } else {
    req.user.secondDose = null;
  }
  await req.user.save();
  if (!booking) {
    return next(new AppError('No booking found!', 400));
  }
  return res.status(204).json({
    status: true,
  });
});
