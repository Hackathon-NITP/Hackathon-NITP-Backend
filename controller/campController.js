const fetch = require("node-fetch");

const Camp = require("../models/campModel");
const Subscriber = require("../models/subscribeModel");
const output = require("../utils/output-data");
const { sendWelcomeEmail, sendNotificationEmail } = require("../utils/email");

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

  subs.map(async (sub) => {
    try {
      const res = await fetch(
        "https://dabjab.herokuapp.com/getcowindata?date=" +
          dateSearched +
          "&pincode=" +
          sub.pincode
      );

      res.json().then((data) => {
        data.map((abc, index) => {
          sendNotificationEmail(sub.name, sub.email, dateSearched);
        });
      });
    } catch (error) {
      console.log("No Slot Found");
    }
  });
}

const d = new Date();
const t = d.toISOString();
if (
  t.split("T")[1].split(":")[0] == "16" &&
  t.split("T")[1].split(":")[1] == "30"
) {
  checkCowin();
}

// Delete Old Camp Data
// async function deleteOldCamp() {
// 	const camps = await Camp.find();

// 	if (!camps) {
// 		return;
// 	}

// 	const today = new Date();
// 	const dateToday = today.toISOString().split('T')[0];

// 	camps.map(camp => {
// 		const date = camp.date.slice(0, 2);
// 		const month = camp.date.slice(3, 5);
// 		const year = camp.date.slice(6, 10);

// 		// converting to yyyy-mm-dd
// 		const campDate = `${year}-${month}-${date}`;
// 		if (campDate < dateToday) {
// 			camp.deleteOne({ _id: camp._id });
// 			console.log('camp deleted');
// 		}
// 	});
// }
// deleteOldCamp();

exports.SendOTP = async (req, res, next) => {
  try {
    console.log("number", req.body.phoneNumber);
    const data = await client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${req.body.phoneNumber}`,
        channel: "sms",
      });
    cosnole.log("ujjwal ", data);
    res.status(200).send(data);
  } catch (error) {
    console.log("ujjwal error", error);
    res.status(400).send(error);
  }
};

// exports.SendOTP = async (req, res, next) => {
//   try {
//     const data = await client.verify
//       .services(process.env.SERVICE_ID)
//       .verifications.create({
//         to: `+91${req.body.phoneNumber}`,
//         channel: "sms",
//       });

//     res.status(200).send(data);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

exports.VerifyOTP = async (req, res, next) => {
  try {
    if (req.body.phoneNumber && req.body.code.length === 6) {
      const data = await client.verify
        .services(process.env.SERVICE_ID)
        .verificationChecks.create({
          to: `+91${req.body.phoneNumber}`,
          code: req.body.code,
        });

      if (data.status === "approved") {
        res.status(200).send({
          message: "User is Verified!!",
          data,
        });
      } else {
        throw new Error("Not approved");
      }
    } else {
      throw new Error("Wrong phone number or code");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.PostData = async (req, res, next) => {
  try {
    const camp = {
      ...req.body,
      timeStart: req.body.startTime,
      timeEnd: req.body.endTime,
    };
    const campData = new Camp(camp);

    const pincode = req.body.pincode;
    const dateOfCamp = req.body.date;
    await campData.save();
    // console.log(campData);
    const subscribers = await Subscriber.findByCredentials(pincode);

    subscribers.map((subscriber) => {
      const name = subscriber.name;
      const email = subscriber.email;
      var date = new Date();
      date.setDate(date.getDate());
      sendNotificationEmail(name, email, dateOfCamp);
    });

    res.status(200).send("Data Sent");
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.GetCowinData = async (req, res, next) => {
  try {
    if (!req.query.pincode) {
      throw new Error("please provide pincode");
    } else if (!req.query.date) {
      throw new Error("please provide date");
    }

    output(req.query.pincode, req.query.date, (err, response) => {
      if (err) {
        throw new Error(err);
      }
      res.send(
        response.map((data, index) => {
          return data;
        })
      );
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.GetCampData = async (req, res, next) => {
  try {
    if (!req.query.pincode) {
      throw new Error("please provide pincode");
    } else if (!req.query.date) {
      throw new Error("please provide date");
    }
    // console.log(req.query.date);

    const pincode = req.query.pincode;
    const campData = await Camp.findByCredentials(
      req.query.pincode,
      req.query.date
    );
    // console.log(campData);

    if (!campData) {
      return res.send("No data found!").status(404);
    }

    res.send(
      campData.map((data, index) => {
        return {
          ...data._doc,
          availDoseOne: data.available_capacity_dose1,
          availDoseTwo: data.available_capacity_dose2,
          hospitalAddress: data.address,
        };
      })
    );
  } catch (e) {
    // console.log(e);
    res.status(500).send(e.message);
  }
};
