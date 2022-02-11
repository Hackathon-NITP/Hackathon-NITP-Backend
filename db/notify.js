const express = require('express');
const app = express();

const CampData = require('../models/camp-data')
const SubscriberData = require('../models/subscribe-model')
const router = new express.Router()

const {sendWelcomeEmail, sendNotificationEmail} = require('../db/email')


router.get('/subscriberdata', async (req, res) => {
    const subscriber = new SubscriberData(req.body)
    await subscriber.save().then(() => {
       res.send(subscriber)
       sendWelcomeEmail(user.name, user.email)  
    }).catch((e) => {
        console.log(e)
        res.send(e.message).status(401)
    })
})

// const camps =  CampData.find()
// camps.map((camp) => {
//     const pincode = camp.pincode
//     const date = camp.date

//     const users = SubscriberData.find({pincode: pincode})
//     users.map((user) => {
//         const name = user.name
//         const email = user.email
   
//         date.setDate(date.getDate() - 2);
//         sendNotificationEmail(name, email, date)
//     })

// })

//     if(!user) {
//         throw new Error('No user found')
//     }
//     console.log(user)
// SubscriberData.findByCredentials = async (pincode, date) => {

//     const user = await SubscriberData.find({pincode, date})
//     if(!user) {
//         throw new Error('No user found')
//     }
//     const slot = await CampData.find({pincode, date})
//     if(!slot) {
//         throw new Error('No slot found')
//     }

//     sendNotificationEmail()

//     return user
// }


sendNotificationEmail()