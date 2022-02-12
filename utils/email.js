const sgMail = require('@sendgrid/mail');
const sendGridAPI = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridAPI);

const sendWelcomeEmail = (name, email) => {
	sgMail
		.send({
			to: email,
			from: 'manansdsh@gmail.com',
			subject: 'Welcome to MediVault',
			text:
				'Welcome to the community of MediVault,' +
				name +
				" . We are delighted that you beleived in us and we hope we are able to serve you best services! You'll be notified whenever a lot is available near you loction."
		})
		.then(() => {
			console.log('email sent');
		})
		.catch(e => {
			console.log(e);
		});
};
const sendNotificationEmail = (name, email, date) => {
	sgMail
		.send({
			to: email,
			from: 'manansdsh@gmail.com',
			subject: 'Vaccine Notification',
			text: `Greetings from MediVault, ${name}. You have a vaccine slot available on ${date}. Thanks!`
		})
		.then(() => {
			console.log('email sent');
		})
		.catch(e => {
			console.log(e);
		});
};

const sendNotificationEmailIfCampExists = (name, email) => {
	sgMail
		.send({
			to: email,
			from: 'manansdsh@gmail.com',
			subject: 'Vaccine Notification',
			text: `Greetings from MediVault, ${name}. You have a vaccine slot available. Thanks!`
		})
		.then(() => {
			console.log('email sent');
		})
		.catch(e => {
			console.log(e);
		});
};
module.exports = {
	sendWelcomeEmail,
	sendNotificationEmail,
	sendNotificationEmailIfCampExists
};
