// Register, SignUp, Deconnection

const UserModel = require('../models/user.model.js');

// Usefull to generate connection tokens for users
const jwt = require('jsonwebtoken');

// Create a connection token for the user using JWT : Need user's id, token_secret (env var), expireIn
const maxAge = 3 * 24 * 60 * 60 * 1000; // Expire after 3 days
const createToken = (id) => {

	return jwt.sign({id}, process.env.TOKEN_SECRET, { expiresIn: maxAge })

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
// Target user with email and compare password with one in DB
// If pw good, generate a private connection token and send it to cookies
module.exports.signIn = async (req, res) => {

	const { email, password } = req.body;

	try {

		const user = await UserModel.login(email, password);
		const token = createToken(user._id);

		// Send response to cookies
		// 'jwt' is the name of the token
		// token is the token generated before
		// { httpOnly: true } is for security
		// { maxAge: maxAge } is expiration delay
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge });
		res.status(200).json({ user: user._id });

	} catch (err) {
		res.status(200).json({ message: err });
	}

}

// Logout
// Remove connection token
module.exports.logout = async (req, res) => {
	
	// Overwrite old 'jwt' cookie with an empty one, and make it expire after 1ms
	res.cookie('jwt', '', { maxAge: 1 });

	// Request don't work without redirect at the end
	res.redirect('/');

}