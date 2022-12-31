const AppError = require('../Error/AppError');
const { CatchAsync } = require('../Error/CatchAsync');
const Vaccine = require('../Models/VaccineSlotModel');

exports.getVaccineAvailability = CatchAsync(async (req, res, next) => {
  const result = await Vaccine.find();
  if (!result.length) {
    return next(new AppError('Vaccine Not available! Please try again!', 404));
  }
  const data = result[0].details.find((el) => el.day === req.body.day);
  if (!data) {
    return next(
      new AppError(`Please select date between ${result[0].date}`, 400)
    );
  }
  res.send(data);
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
  const date = `${day}${data[0].date.substring(1, 8)}`;
  data[0].details[day - 1].availableSlots.find((el) => el.time === time)
    .quantity--;
  if (
    data[0].details[day - 1].availableSlots.find((el) => el.time === time)
      .quantity != -1
  ) {
    await data[0].save();
    return res.status(200).json({
      status: true,
      message: `Vaccination booking success date: ${date} time: ${time}`,
    });
  } else {
    return next('Booking fail slot not available!', 400);
  }
});
