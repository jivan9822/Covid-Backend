const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'Please provide first name of user'],
  },
  lname: {
    type: String,
    required: [true, 'Please provide last name of user'],
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please provide mobile number of user'],
    unique: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age of user'],
  },
  pinCode: {
    type: String,
    required: [true, 'Please provide pin code of user'],
  },
  aadharNumber: {
    type: String,
    required: [true, 'Please provide aadhar number of user'],
    unique: true,
  },
  firstDose: {
    type: Date,
    default: null,
  },
  secondDose: {
    type: Date,
    default: null,
  },
  password: {
    type: String,
    required: [true, 'Please provide password of user'],
    select: false,
  },
  roll: {
    type: String,
    default: 'user',
  },
  booking: {
    type: Date,
    default: null,
  },
  bookingId: {
    type: mongoose.Types.ObjectId,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.roll = 'user';
  next();
});

userSchema.methods.correctPass = async function (bodyPass, hashPass) {
  return await bcrypt.compare(bodyPass, hashPass);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
