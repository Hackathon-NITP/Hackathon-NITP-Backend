const sgMail = require('@sendgrid/mail')
const sendGridAPI = (process.env.SENDGRID_API_KEY)
sgMail.setApiKey(sendGridAPI)


const sendWelcomeEmail = (name, email) => {
    sgMail.send({
        to: email,
        from: 'manansdsh@gmail.com',
        subject: 'Welcome to DabJab',
        text: "Welcome to the community of DabJab," + name + " . We are delighted that you beleived in us and we hope we are able to serve you best services! You'll be notified whenever a lot is available near you loction."
      }).then(() => {
          console.log('email sent');
      }).catch((e) => {
          console.log(e);
      })
}
const sendNotificationEmail = (name, email, date) => {
    const link = 'https://dabjab.netlify.app/'
    sgMail.send({
        to: email,
        from: 'manansdsh@gmail.com',
        subject: 'Vaccine Notification',
        text: `Greetings from DabJab, ${name}. You have a vaccine slot available on ${date}. Please check dabjab.herokuapp.com to know more details. Thanks!`
      }).then(() => {
          console.log('email sent');
      }).catch((e) => {
          console.log(e);
      })
}

const sendNotificationEmailIfCampExists = (name, email) => {
    const link = 'https://dabjab.netlify.app/'
    sgMail.send({
        to: email,
        from: 'manansdsh@gmail.com',
        subject: 'Vaccine Notification',
        text: `Greetings from DabJab, ${name}. You have a vaccine slot available. Please check dabjab.netlify.com to know more details. Thanks!`
      }).then(() => {
          console.log('email sent');
      }).catch((e) => {
          console.log(e);
      })
}
module.exports = {
    sendWelcomeEmail,
    sendNotificationEmail,
    sendNotificationEmailIfCampExists
}