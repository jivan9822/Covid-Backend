const { JsonWebTokenError } = require('jsonwebtoken');
const AppError = require('../Error/AppError');

const duplicateErrHandler = (err) => {
  const msg = err.message.match(/{.*?}/);
  return new AppError(`Duplicate not allowed! ${msg[0]}`, 409);
};

const validationError = (err) => new AppError(`${err.message}`, 400);

const TokenExpiredErrorHandler = (err) =>
  new AppError('Your token has expired! Please log in again.', 401);

const JsonWebTokenErrorHandler = (err) =>
  new AppError('Invalid token. Please log in again!', 401);

const CastErrorHandler = (err) =>
  new AppError(`Incorrect id ${err.value}`, 400);

exports.globalErrorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') err = validationError(err);

  if (err.code === 11000) err = duplicateErrHandler(err);

  if (err.name == 'TokenExpiredError') err = TokenExpiredErrorHandler(err);

  if (err.name == 'JsonWebTokenError') err = JsonWebTokenErrorHandler(err);

  if (err.name == 'CastError') err = CastErrorHandler(err);
  res.status(err.statusCode || 500).json({
    status: false,
    message: err.message,
    err,
  });
};
