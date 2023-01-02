const router = require('express').Router();
const book = require('../Controllers/bookingController');
const auth = require('../MiddleWare/authoriZation');

router.get('/data', auth.protect, book.getVaccineAvailability);
router.post('/book', auth.protect, auth.isValidDose, book.bookVaccineSlot);
router.post('/update', auth.protect, book.updateVaccineSlot);
router.delete('/cancel', auth.protect, book.cancelVaccinationSlot);

module.exports = router;
