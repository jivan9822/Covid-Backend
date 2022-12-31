const AppError = require('../Error/AppError');
const Vaccine = require('../Models/VaccineSlotModel');

const router = require('express').Router();
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

router.post('/addDose', async (req, res, next) => {
  const date = req.body.date.split('/').map(Number);
  let count = getDaysInMonth(date[1] - 1, date[0]);
  req.body.date = `${count[0]} to ${count[count.length - 1]}`;
  const data = await Vaccine.create(req.body);
  for (let i = 0; i < count.length; ++i) {
    const temp = { day: i + 1, availableSlots: Obj };
    data.details.push(temp);
  }
  await data.save();
  res.send(data);
});

router.get('/data', async (req, res, next) => {
  const result = await Vaccine.find();
  const data = result[0].details.find((el) => el.day === req.body.day);
  if (!data) {
    return res.status(400).json({
      status: false,
      message: `Please select date between ${result[0].date}`,
    });
  }
  res.send(data);
});

router.post('/book', async (req, res, next) => {
  const { day, time } = req.body;
  const data = await Vaccine.find();
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
    return res.status(400).json({
      status: false,
      message: 'Booking fail slot not available!',
    });
  }
});

module.exports = router;
