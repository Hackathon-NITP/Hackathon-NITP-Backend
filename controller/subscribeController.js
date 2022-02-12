const {
	sendWelcomeEmail,
	sendNotificationEmailIfCampExists
} = require('../utils/email');
const Subscriber = require('../models/subscribeModel');
const Camp = require('../models/campModel');

const Subscribe = async (req, res) => {
	try {
		const subscriber = new Subscriber(req.body);
		await subscriber.save();

		res.status(200).send(subscriber);
		const pincode = subscriber.pincode;

		sendWelcomeEmail(subscriber.name, subscriber.email);

		Camp.findByCredentialsOfPincode(pincode).then(camps => {
			if (!camps) {
				return;
			}
			sendNotificationEmailIfCampExists(subscriber.name, subscriber.email);
			// console.log('Notification Mail Sent');
		});
	} catch (error) {
		res.status(400).send(e.message);
	}
};

module.exports = {
	Subscribe
};
