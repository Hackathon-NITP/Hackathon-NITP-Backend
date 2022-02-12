const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true,
    },
    doses:{
        type:Array,
        doseNumber:Number,
		date:String,
		isMarked:{
            type:Boolean,
            default:false
        }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VaccineDetails", vaccinationSchema);
