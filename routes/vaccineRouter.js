const router = require('express').Router();
const vaccinationController = require('../controller/vaccinationController');
const {protect} = require('../controller/authController');

router.get('/getAllVaccines',protect,vaccinationController.getAllVaccines);

module.exports = router;
