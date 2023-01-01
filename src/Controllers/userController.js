const { CatchAsync } = require('../Error/CatchAsync');
const User = require('../Models/userModel');

exports.userRegistration = CatchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.create(req.body);
  res.send(user);
});

exports.userLogin = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: true,
    message: 'login success!',
    data: {
      token: req.token,
      user: req.user,
    },
  });
});
