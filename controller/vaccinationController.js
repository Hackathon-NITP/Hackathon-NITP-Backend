const Vaccine = require('../models/vaccineModel');
const User = require('../models/userModel');

const getAllVaccines = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
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

const addVaccine = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        const {name,doseNumber} = req.body;
        const docs = user.vaccinationDetails;
        for(var i=0; i<docs.length; i++) {
            if(docs[i].name == name) {
                docs[i].doses[doseNumber-1].isMarked = true;
                docs[i].doses[doseNumber-1].date = new Date();
            }
        }
        await user.save();
        res.status(200).json({
            status: "success",
            docs,
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            msg: error.message,
        });
    }
}

module.exports = {
    getAllVaccines,
    addVaccine
}
