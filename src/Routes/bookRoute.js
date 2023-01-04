const router = require('express').Router();
const book = require('../Controllers/bookingController');
const auth = require('../MiddleWare/authoriZation');

//! ROUTE IS FOR BOOK, UPDATE AND CANCEL BOOKING

// GET AVAILABILITY OF DOSES
router.get(
  '/data',
  auth.protect,
  auth.isSlotAvailable,
  book.getVaccineAvailability
);

// BOOK SLOT FOR PARTICULAR DAY AND TIME
router.post(
  '/book',
  auth.protect,
  auth.isValidDose,
  auth.isSlotAvailable,
  auth.isValidBookTime,
  book.bookVaccineSlot
);

// UPDATE SLOT FOR PARTICULAR DAY AND TIME ONLY BEFORE 24 HOUR
router.post(
  '/update',
  auth.protect,
  auth.isSlotAvailable,
  auth.isValidUpdateTime,
  book.updateVaccineSlot
);

// CANCEL BOOKING ONLY BEFORE 24 HOURS
router.delete(
  '/cancel',
  auth.protect,
  auth.isValidUpdateTime,
  book.cancelVaccinationSlot
);

module.exports = router;
