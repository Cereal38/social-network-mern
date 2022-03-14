// Register, SignUp, Deconnection

const UserModel = require('../models/user.model.js');

// Usefull to generate connection tokens for users
const jwt = require('jsonwebtoken');

// Create a connection token for the user using JWT : Need user's id, token_secret (env var), expireIn
const maxAge = 3 * 24 * 60 * 60 * 1000; // Expire after 3 days
const createToken = (id) => {
	return jwt.sign({id}, process.env.TOKEN_SECRET, {
		expireIn: maxAge 
	})
};

// SignUp
// Informations in req -> (pseudo, email, password)
module.exports.signUp = async (req, res) => {

	// Extract var from req.body (destructuring)
	const {pseudo, email, password} = req.body;

	try {
		const user = await UserModel.create({pseudo, email, password});
		res.status(201).json({ user: user._id }); // Says that all worked well
	}

	catch(err) {
		res.status(200).send({err}); // Basic error message
	}
};


// SignIn
module.exports.signIn =  async (req, res) => {

	const { email, password } = req.body;

	try {
		const user = await userModel.login(email, password);
		const token = createToken(user._id)

		// Send response to cookies
		// 'jwt' is the name of the token
		// token is the token generated before
		// { httpOnly: true } is for security
		// { maxAge: maxAge } is expiration delay
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });

	} catch (err) {

	}

}

// Logout
module.exports.logout = async (req, res) => {

}