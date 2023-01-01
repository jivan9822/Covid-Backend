const { CatchAsync } = require('../Error/CatchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../Error/AppError');
const User = require('../Models/userModel');
const { promisify } = require('util');

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

  // if (user.changedPasswordAfter(decode.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   );
  // }
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

const Obj = {
  user: ['address', 'fname', 'lname', 'mobileNumber', 'profileImage', 'phone'],
  product: [
    'title',
    'description',
    'price',
    'brand',
    'currencyId',
    'currencyFormat',
    'isFreeShipping',
    'productImage',
    'style',
    'availableSizes',
  ],
};

exports.updateOnly = (field) => {
  return (req, res, next) => {
    for (const i in req.body) {
      if (!Obj[field].includes(i)) {
        delete req.body[i];
      }
    }
    next();
  };
};
