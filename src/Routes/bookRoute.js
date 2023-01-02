const router = require('express').Router();
const book = require('../Controllers/bookingController');
const auth = require('../MiddleWare/authoriZation');

router.get('/data', auth.protect, book.getVaccineAvailability);
router.post(
  '/book',
  auth.protect,
  auth.isValidDose,
  auth.isSlotAvailable,
  book.bookVaccineSlot
);
router.post(
  '/update',
  auth.protect,
  auth.isSlotAvailable,
  auth.isValidUpdateTime,
  book.updateVaccineSlot
);
router.delete(
  '/cancel',
  auth.protect,
  auth.isValidUpdateTime,
  book.cancelVaccinationSlot
);

module.exports = router;
