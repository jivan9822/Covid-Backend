const router = require('express').Router();
const book = require('../Controllers/bookingController');

router.get('/data', book.getVaccineAvailability);
router.post('/book', book.bookVaccineSlot);

module.exports = router;
