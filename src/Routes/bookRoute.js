const router = require('express').Router();
const book = require('../Controllers/bookingController');
const auth = require('../MiddleWare/authoriZation');

router.get('/data', auth.protect, book.getVaccineAvailability);
router.post('/book', auth.protect, book.bookVaccineSlot);
router.post('/update', auth.protect, book.updateVaccineSlot);

module.exports = router;
