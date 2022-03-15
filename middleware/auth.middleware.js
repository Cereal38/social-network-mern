// Contain verifications (if user got the right token to make a request)

const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model.js');


// Test if the user is connected (All requests call it)
module.exports.checkUser = (req, res, next) => {

	// Get the cookie called jwt from cookies
	const token = req.cookies.jwt;

	// If a cookie called 'jwt' exist we verify it
	if (token) {
		jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {

			// If the user got a wrong cookie called 'jwt'
			if(err) {
				res.locals.user = null;
				// Remove the false cookie
				res.cookie('jwt', '', { maxAge: 1 })
				next();

			// If the user got the right cookie called 'jwt'
			} else {
				console.log(decodedToken);
				let user = await UserModel.findById(decodedToken.id);
				res.locals.user = user;
				console.log(user);
				next()
			}

		});
	// If the user got no cookies
	} else {
		res.locals.user = null;
		next();
	}

};