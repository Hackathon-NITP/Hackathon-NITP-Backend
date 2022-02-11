const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
	try {
		const { username, email, password, passwordConfirm } = req.body;
		const user = new User({
			username,
			email,
			password,
			passwordConfirm
		});

		await user.save();
		const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '2d'
		});

		res.status(200).json({
			status: 'success',
			token,
			user
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user || !user.verifyPassword(password, user.password)) {
			throw new Error('Incorrect credentials!');
		}

		const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '2d'
		});

		user.password = undefined;

		res.status(200).json({
			status: 'success',
			token,
			user
		});
	} catch (error) {
		res.status(400).json({
			status: 'fail',
			msg: error.message
		});
	}
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
			throw new Error('You are not logged in! Please Log in again!')
		}

		const decodedUser = await jwt.verify(token, process.env.JWT_SECRET)

		const user = await User.findOne({ _id: decodedUser.id })

    if (!user) {
			throw new Error('The user belonging to this token no longer exist.')
		}

		req.user = user
		next()
  } catch (error) {
    res.status(400).json({
			status: 'fail',
			msg: error.message
		});
  }
}