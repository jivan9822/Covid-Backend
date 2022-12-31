const { CatchAsync } = require('../Error/CatchAsync');
const Vaccine = require('../Models/VaccineSlotModel');
const AppError = require('../Error/AppError');

const Obj = [
  { time: '10.00am-10.30am', quantity: 10 },
  { time: '10.30am-11.00am', quantity: 10 },
  { time: '11.00am-11.30am', quantity: 10 },
  { time: '11.30am-12.00am', quantity: 10 },
  { time: '12.00am-12.30pm', quantity: 10 },
  { time: '12.30pm-01.00pm', quantity: 10 },
  { time: '01.00pm-01.30pm', quantity: 10 },
  { time: '01.30pm-02.00pm', quantity: 10 },
  { time: '02.00pm-02.30pm', quantity: 10 },
  { time: '02.30pm-03.00pm', quantity: 10 },
  { time: '03.00pm-03.30pm', quantity: 10 },
  { time: '03.30pm-04.00pm', quantity: 10 },
  { time: '04.00pm-04.30pm', quantity: 10 },
  { time: '04.30pm-05.00pm', quantity: 10 },
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
  if (!req.body.date) {
    return next(
      new AppError(`Please enter first day of month ex. 2023-02-01`, 400)
    );
  }
  const date = req.body.date.split('-').map(Number);
  let count = getDaysInMonth(date[1] - 1, date[0]);
  req.body.date = `${count[0]} to ${count[count.length - 1]}`;
  const data = await Vaccine.create(req.body);
  for (let i = 0; i < count.length; ++i) {
    const temp = { day: i + 1, availableSlots: Obj };
    data.details.push(temp);
  }
  await data.save();
  res.send(data);
  res.status(201).json({
    status: true,
    message: 'Data added success!',
    data,
  });
});
