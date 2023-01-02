const router = require('express').Router();
const user = require('../Controllers/userController');
const auth = require('../MiddleWare/authoriZation');

router.post('/register', user.userRegistration);
router.post('/login', auth.authentication, user.userLogin);

router
  .route('/')
  .post(auth.protect, auth.updateOnly, user.updateUser)
  .get(auth.protect, user.getUser);

module.exports = router;
