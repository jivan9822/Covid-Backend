const admin = require('../Controllers/AdminController');
const router = require('express').Router();
const auth = require('../MiddleWare/authoriZation');

//! ROUTE RESTRICTED FOR ADMIN ONLY

// THIS IS ADD FOR ADD DOSE FOR MONTH
router.post(
  '/addDose',
  auth.protect,
  auth.restrictTo('admin'),
  admin.addVaccineDoses
);

// THIS IS TO GET USER AND BOOKINGS DATA
router.get('/users', auth.protect, auth.restrictTo('admin'), admin.getUserData);
router.get(
  '/bookings',
  auth.protect,
  auth.restrictTo('admin'),
  admin.getVaccinationData
);

module.exports = router;
