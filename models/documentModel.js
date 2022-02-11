const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
	{
		link: {
			type: string,
			required: true
		},
		name: {
			type: string,
			required: true,
			unique: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Document', documentSchema);
