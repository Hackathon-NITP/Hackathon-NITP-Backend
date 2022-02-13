const router = require('express').Router();
const vaccinationController = require('../controller/vaccinationController');
const {protect} = require('../controller/authController');

router.get('/getAllVaccines',protect,vaccinationController.getAllVaccines);
router.post('/addVaccine',protect,vaccinationController.addVaccine);

module.exports = router;
