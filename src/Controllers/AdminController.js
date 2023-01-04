const { CatchAsync } = require('../Error/CatchAsync');
const Vaccine = require('../Models/VaccineSlotModel');
const Booking = require('../Models/bookingModel');
const AppError = require('../Error/AppError');
const User = require('../Models/userModel');
const APIFeature = require('../Utils/APIFeature');

const Obj = [
  { time: '10:00:00', quantity: 10 },
  { time: '10:30:00', quantity: 10 },
  { time: '11:00:00', quantity: 10 },
  { time: '11:30:00', quantity: 10 },
  { time: '12:00:00', quantity: 10 },
  { time: '12:30:00', quantity: 10 },
  { time: '13:00:00', quantity: 10 },
  { time: '13:30:00', quantity: 10 },
  { time: '14:00:00', quantity: 10 },
  { time: '14:30:00', quantity: 10 },
  { time: '15:00:00', quantity: 10 },
  { time: '15:30:00', quantity: 10 },
  { time: '16:00:00', quantity: 10 },
  { time: '16:30:00', quantity: 10 },
];

// ADD VACCINATION DATA FOR WHOLE MONTH
exports.addVaccineDoses = CatchAsync(async (req, res, next) => {
  await Vaccine.deleteMany();
  let [year, month, day] = req.body.date.split('-').map(Number);
  month -= 1;
  let date = new Date(year, month, day);
  const vaccine = await Vaccine.create({ date: req.body.date });

  while (date.getMonth() === month) {
    const dateNew = date.toLocaleDateString();
    Obj.map((each) => {
      const time = `${dateNew}-${each.time}`;
      vaccine.slots.push({ time, qty: 10 });
    });
    date.setDate(date.getDate() + 1);
  }
  await vaccine.save();
  res.status(201).json({
    status: true,
    message: 'Data added success!',
    // data,
  });
});

// GET USER DATA WITH ALL FILTER, SORT, LIMIT-FIELDS AND PAGINATION
exports.getUserData = CatchAsync(async (req, res, next) => {
  const features = new APIFeature(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const users = await features.query;
  if (!users) {
    return next(new AppError('No users found!', 404));
  }
  res.status(200).json({
    status: true,
    result: `${users.length} users found!`,
    message: 'success',
    users,
  });
});

// GET BOOKING DATA WITH FILTER, SORT, LIMIT-FIELDS PAGINATION
exports.getVaccinationData = CatchAsync(async (req, res, next) => {
  const features = new APIFeature(Booking.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const bookings = await features.query;
  if (!bookings) {
    return next(new AppError('No bookings found!', 404));
  }
  res.status(200).json({
    status: true,
    result: `${bookings.length} bookings found!`,
    message: 'success',
    bookings,
  });
});
