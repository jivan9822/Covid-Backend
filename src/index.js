require('dotenv').config({ path: 'config.env' });
const express = require('express');
const mongoose = require('mongoose');
const admin = require('./Routes/adminRoute');
const book = require('./Routes/bookRoute');
const user = require('./Routes/userRoute');
const AppError = require('./Error/AppError');
const { globalErrorHandler } = require('./Error/GlobalError');
const app = express();
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log('MongoDb Connection success!');
  })
  .catch((error) => {
    console.log(error);
  });

app.use('/admin', admin);
app.use('/book', book);
app.use('/user', user);

app.all('*', (req, res, next) => {
  return next(new AppError(`The ${req.originalUrl} not found on server!`, 400));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
