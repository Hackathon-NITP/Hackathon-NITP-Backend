const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const request = require('request');

const output = (pincode, date, callback) => {
    const cowinURL = process.env.COWIN_API + 'pincode=' + pincode +'&date=' + date
    request({url: cowinURL, json: true}, (err, res) => {
            if(err) {
                return callback(err, undefined);
            }
            else if(res.body.centers.length === 0) {
                return callback('No session found', undefined);
            }
            const hospitals = res.body.centers
            callback(undefined, 
                hospitals.map( (hospital) => { 
                    return ({
                        placeName: hospital.name,
                        hospitalAddress: hospital.address, 
                        pincode: hospital.pincode,
                        vaccine: hospital.sessions[0].vaccine,
                        // ifPaid: hospital.fee_type, 
                        // fee: hospital.vaccine_fees[0].fee,
                        date: hospital.sessions[0].date,
                        timeStart: hospital.from,
                        timeEnd: hospital.to,
                        slots: hospital.sessions[0].slots,
                        availDoseOne: hospital.sessions[0].available_capacity_dose1,
                        availDoseTwo: hospital.sessions[0].available_capacity_dose2
                    })
                })                
                
            )

    })
}


module.exports = output;