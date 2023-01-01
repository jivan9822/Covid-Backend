const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
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
  const { day, time } = req.body;
  if (!day || !time) {
    return next(`Please send day and time for booking!`, 400);
  }
  const data = await Vaccine.find();
  if (!data.length) {
    return next(new AppError('No slots available!', 404));
  }
  const dayQuery = day.split('-')[2];
  if (
    data[0].details[dayQuery - 1].availableSlots.find((el) => el.time === time)
      .quantity--
  ) {
    await data[0].save({ validateBeforeSave: false });
    await User.findByIdAndUpdate(req.user._id, {
      'booking.day': day,
      'booking.time': time,
    });

    return res.status(200).json({
      status: true,
      message: `Vaccination booking success date: ${day} time: ${time}`,
    });
  } else {
    return next('Booking fail slot not available!', 400);
  }
});

exports.updateVaccineSlot = CatchAsync(async (req, res, next) => {
  const { day, time } = req.body;
  if (!day || !time) {
    return next(`Please send day and time for booking!`, 400);
  }
  const data = await Vaccine.find();
  if (!data.length) {
    return next(new AppError('No slots available!', 404));
  }
  let dayQuery = day.split('-')[2];
  if (
    data[0].details[dayQuery - 1].availableSlots.find((el) => el.time === time)
      .quantity--
  ) {
    dayQuery = req.user.booking.day.split('-')[2];

    data[0].details[dayQuery - 1].availableSlots.find((el) => el.time === time)
      .quantity++;

    await data[0].save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(req.user._id, {
      'booking.day': day,
      'booking.time': time,
    });

    return res.status(200).json({
      status: true,
      message: `Vaccination booking success date: ${day} time: ${time}`,
    });
  } else {
    return next('Booking fail slot not available!', 400);
  }
});
