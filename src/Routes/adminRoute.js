const admin = require('../Controllers/AdminController');
const router = require('express').Router();
const auth = require('../MiddleWare/authoriZation');
router.post(
  '/addDose',
  auth.protect,
  auth.restrictTo('admin'),
  admin.addVaccineDoses
);
router.get('/users', auth.protect, auth.restrictTo('admin'), admin.getUserData);
router.get(
  '/bookings',
  auth.protect,
  auth.restrictTo('admin'),
  admin.getVaccinationData
);

module.exports = router;
