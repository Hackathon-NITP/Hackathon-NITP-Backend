const Vaccine = require('../models/vaccineModel');
const User = require('../models/userModel');

const getAllVaccines = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).populate("vaccinationDetails");
        const docs = user.vaccinationDetails;
    
        res.status(200).json({
          status: "success",
          docs,
        });
      } catch (error) {
        res.status(400).json({
          status: "fail",
          msg: error.message,
        });
      }
}

module.exports = {
    getAllVaccines
}
