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
function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date).toLocaleDateString());
    date.setDate(date.getDate() + 1);
  }
  return days;
}

exports.addVaccineDoses = CatchAsync(async (req, res, next) => {
  console.log(req.body.date);
  if (!req.body.date) {
    return next(
      new AppError(`Please enter first day of month ex. 2023-02-01`, 400)
    );
  }
  const date = req.body.date.split('-').map(Number);
  let count = getDaysInMonth(date[1] - 1, date[0]);
  // console.log(count);
  // req.body.date = `${count[0]} to ${count[count.length - 1]}`;
  const data = await Vaccine.create(req.body);
  for (let i = 0; i < count.length; ++i) {
    const date = count[i].split('/').reverse().join('-');
    const temp = { day: date, availableSlots: Obj };
    data.details.push(temp);
  }
  await data.save();
  res.status(201).json({
    status: true,
    message: 'Data added success!',
    data,
  });
});
