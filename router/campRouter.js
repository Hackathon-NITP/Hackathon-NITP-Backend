const express = require("express");
const router = express.Router();
const campController = require("../controller/CampController");


// Send OTP
router.post("/sendotp", campController.SendOTP);
//  Verify OTP
router.post("/verifyotp", campController.VerifyOTP);
// Post Camp Data to db
router.post("/postdata", campController.PostData);
// Get Cowin Data from db
router.get("/getcowindata", campController.GetCowinData);
//  Get Camp Data from db
router.get("/getcampdata",campController.GetCampData);

module.exports = router;
