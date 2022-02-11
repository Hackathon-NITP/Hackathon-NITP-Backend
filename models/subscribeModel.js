const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
	name: {
		required: true,
		type: String
	},
	email: {
		required: true,
		unique: true,
		type: String,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error('Incorrect Email Id');
			}
		}
	},
	pincode: {
		type: String,
		required: true
	}
});

userSchema.statics.findByCredentials = async pincode => {
	const data = await Subscriber.find({ pincode });
	return data;
};

const Subscriber = mongoose.model('Subscriber', userSchema);
module.exports = Subscriber;
