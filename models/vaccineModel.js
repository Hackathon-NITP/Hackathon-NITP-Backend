const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true,
    },
    totalDoses: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VaccineDetails", vaccinationSchema);
