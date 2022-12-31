const admin = require('../Controllers/AdminController');
const router = require('express').Router();

router.post('/addDose', admin.addVaccineDoses);

module.exports = router;
