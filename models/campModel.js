const mongoose = require('mongoose')

const campSchema = new mongoose.Schema({
    nameOfPerson: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    placeName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        lowercase: true,
    },
    pincode: {
        required: true,
        type: String,
    },
    date: {
        type: String,
        required: true,
    },
    timeStart: {
        type: String,
        trim: true,
        required: true,
    },
    timeEnd: {
        type: String,
        trim: true,
        required: true,
    },
    vaccine: {
        type: String,
        uppercase: true,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
        default: 0
    },
    available_capacity_dose1: {
        type: Number,
        required: true,
    },
    available_capacity_dose2: {
        type: Number,
        required: true,
    }
},{
    timestamps: true
})

campSchema.statics.findByCredentials = async (pincode, date) => {
    // console.log(pincode, date);
    const data = await CampData.find({pincode, date})
    console.log(data)
    return data
}

campSchema.statics.findByCredentialsOfPincode = async (pincode) => {
    // console.log(pincode, date);
    const data = await CampData.find({pincode})
    console.log(data)
    return data
}
const CampData = mongoose.model('CampData', campSchema)
module.exports = CampData