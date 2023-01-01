const { CatchAsync } = require('../Error/CatchAsync');
const Vaccine = require('../Models/VaccineSlotModel');
const AppError = require('../Error/AppError');

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
exports.addVaccineDoses = CatchAsync(async (req, res, next) => {
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
