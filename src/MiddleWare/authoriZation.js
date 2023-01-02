const { CatchAsync } = require('../Error/CatchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../Error/AppError');
const User = require('../Models/userModel');
const { promisify } = require('util');
const Vaccine = require('../Models/VaccineSlotModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETE_STRING, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.authentication = CatchAsync(async (req, res, next) => {
  const { mobileNumber, password } = req.body;
  if (!mobileNumber || !password) {
    return next(
      new AppError(`Please provide your mobileNumber and password!`, 400)
    );
  }
  const user = await User.findOne({ mobileNumber }).select('+password');
  if (!user || !(await user.correctPass(password, user.password))) {
    return next(new AppError(`Invalid mobileNumber or password!`, 400));
  }
  const token = generateToken(user._id);
  user.password = undefined;
  req.token = token;
  req.user = user;
  next();
});

exports.protect = CatchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decode = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRETE_STRING
  );

  const user = await User.findById(decode.id);
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  req.user = user;
  next();
});

exports.restrictTo = (roll) => {
  return (req, res, next) => {
    if (req.user.roll !== roll) {
      return next(
        new AppError(`You are not authorize to perform this operation!`, 403)
      );
    }
    next();
  };
};

exports.isValidDose = CatchAsync(async (req, res, next) => {
  const { dose } = req.body;
  if (req.user.firstDose && req.user.secondDose) {
    return next(
      new AppError('You done all doses! No need to book any slot', 400)
    );
  }
  if (dose == 'first' && req.user.firstDose) {
    return next(new AppError('No multiple booking allowed!', 400));
  }
  if (dose == 'second' && !req.user.firstDose) {
    return next(new AppError('Please take first-dose before second!', 400));
  }
  const dateFirst = req.user.booking ? req.user.booking.getTime() : null;
  const today = new Date().getTime();
  if (dose == 'second' && today < dateFirst) {
    return next(
      new AppError(
        'Your first dose is already booked! first complete it and then go for second.',
        400
      )
    );
  }
  next();
});

const Obj = {
  user: ['fname', 'lname', 'mobileNumber', 'age', 'pinCode', 'aadharNumber'],
};

exports.updateOnly = (req, res, next) => {
  for (const i in req.body) {
    if (!Obj.user.includes(i)) delete req.body[i];
  }
  next();
};

exports.isSlotAvailable = CatchAsync(async (req, res, next) => {
  if (new Date(req.body.day) < new Date()) {
    return next(
      new AppError(
        'Booking date and time should be greater than current time',
        400
      )
    );
  }
  const vaccine = await Vaccine.find();
  if (!vaccine.length) {
    return next(new AppError('Vaccine Not available! Please try again!', 404));
  }
  const flag = vaccine[0].slots.find(
    (e) => e.time.split('-')[0] === req.body.day.split('-')[0]
  );
  if (flag && flag.qty) {
    return next();
  }
  next('No slot available to given time!', 404);
});

exports.isValidUpdateTime = CatchAsync(async (req, res, next) => {
  const today = new Date(); //?
  const tomorrow = new Date(today); //?
  tomorrow.setDate(tomorrow.getDate() + 1); //?
  let prevDate = req.user.booking;
  if (prevDate < new Date(tomorrow)) {
    return next(
      new AppError('You can update or cancel only 24 hours prior!', 400)
    );
  }
  next();
});

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

exports.isValidBookTime = CatchAsync(async (req, res, next) => {
  let prevDate = new Date(getDate(req.body.day));
  if (prevDate < new Date()) {
    return next('Book time should be greater than current time!', 400);
  }
  next();
});
