const CampData = require("../models/campModel");
const Subscriber = require("../models/subscribeModel");
const fetch = require("node-fetch");
const output = require("../public/output-data");
const { sendWelcomeEmail, sendNotificationEmail } = require("../db/email");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

// Check For Cowin Data
async function checkCowin() {
    const subs = await Subscriber.find();
  
    const today = new Date();
    const sendDate = new Date();
    sendDate.setDate(today.getDate() + 2);
    const datesendDate = sendDate.toISOString().split("T")[0];
  
    const year = datesendDate.slice(0, 4);
    const month = datesendDate.slice(5, 7);
    const date = datesendDate.slice(8, 10);
  
    //final date in dd-mm-yyyy
    const dateSearched = date + "-" + month + "-" + year;
  
    subs.map((sub) => {
      fetch(
        "https://dabjab.herokuapp.com/getcowindata?date=" +
          dateSearched +
          "&pincode=" +
          sub.pincode
      )
        .then((res) => {
          res
            .json()
            .then((data) => {
              data.map((abc, index) => {
                sendNotificationEmail(sub.name, sub.email, dateSearched);
              });
            })
            .catch((e) => {
              console.log("No Slot Found");
            });
        })
        .catch((e) => {
          console.log(e.message);
        });
    });
  }
  const d = new Date()
  const t = d.toISOString()
  if(t.split('T')[1].split(':')[0] == '16' && t.split('T')[1].split(':')[1] == '30') {
    checkCowin();
  }
  
  // Delete Old Camp Data
  // async function deleteOldCampData() {
      
  //     const camps = await CampData.find()
      
  //     if(!camps) {
  //         return
  //     }
  
  //     const today = new Date()
  //     const dateToday = today.toISOString().split("T")[0];
  
  //     camps.map((camp) => {
  //         const date = camp.date.slice(0,2)
  //         const month = camp.date.slice(3, 5)
  //         const year = camp.date.slice(6, 10)
          
  //         // converting to yyyy-mm-dd
  //         const campDate = `${year}-${month}-${date}`
  //         if(campDate<dateToday) {
  //             camp.deleteOne({_id: camp._id})
  //             console.log('camp deleted')
  //         }
  //     })
  // }
  // deleteOldCampData()

const SendOTP = async (req, res) => {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${req.body.phoneNumber}`,
        channel: "sms",
      })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  }

const VerifyOTP = async (req, res) => {
    if (req.body.phoneNumber && req.body.code.length === 6) {
      client.verify
        .services(process.env.SERVICE_ID)
        .verificationChecks.create({
          to: `+91${req.body.phoneNumber}`,
          code: req.body.code,
        })
        .then((data) => {
          console.log(data);
          if (data.status === "approved") {
            res.status(200).send({
              message: "User is Verified!!",
              data,
            });
          }
        });
    } else {
      res.status(400).send({
        message: "Wrong phone number or code :(",
        phonenumber: req.query.phoneNumber,
      });
    }
  }

const PostData = async (req, res) => {

    const camp = {...req.body,timeStart: req.body.startTime, timeEnd: req.body.endTime}
    const campData = new CampData(camp);
  
    const pincode = req.body.pincode;
    const dateOfCamp = req.body.date;
    campData.save().then(() => {
      res.send('Data Sent')
        console.log(campData)
        Subscriber.findByCredentials(pincode).then((subscribers) => {
          subscribers.map((subscriber) => {
            const name = subscriber.name;
            const email = subscriber.email;
            var date = new Date();
            date.setDate(date.getDate());
            sendNotificationEmail(name, email, dateOfCamp);
          });
        }); 
      })
      .catch((error) => {
        console.log(error.message);
        throw new Error(error.message)
      });
  }

const GetCowinData =  async (req, res) => {
    try {
      if (!req.query.pincode) {
        return res.status(401).send("please provide pincode");
      } else if (!req.query.date) {
        return res.status(401).send("please provide date");
      }
  
      output(req.query.pincode, req.query.date, (err, response) => {
        if (err) {
          console.log(err);
          return res.send(err).status(404);
        }
        res.send(
          response.map((data, index) => {
            return data
          })
        );
      });
    } catch (e) {
      console.log(e.message);
      res.status().send(e);
    }
  }

const GetCampData = async (req, res) => {
    try {
      if (!req.query.pincode) {
        return res.send("please provide pincode").status(404);
      } else if (!req.query.date) {
        return res.send("please provide date").status(404);
      }
      console.log(req.query.date)
      const pincode = req.query.pincode
      const campData = await CampData.findByCredentials(
        req.query.pincode,
        req.query.date
      );
      console.log(campData)
      if (!campData) {
        return res.send("No data found!").status(404);
      }
      res.send(
        campData.map((data, index) => {
          console.log("Lund",data)
          return {
            ...data._doc,
            availDoseOne: data.available_capacity_dose1,
            availDoseTwo: data.available_capacity_dose2,
            hospitalAddress: data.address
          }
        })
      );
    } catch (e) {
      console.log(e);
      res.status(500).send(e.message);
    }
  }

module.exports ={
    SendOTP,
    VerifyOTP,
    PostData,
    GetCowinData,
    GetCampData
}