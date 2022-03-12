// Register, SignUp, Deconnection

const UserModel = require('../models/user.model.js');

// SignUp
// Informations dans la req -> (pseudo, email, password)
module.exports.signUp = async (req, res) => {
	// Log message
	console.log(req.body);

	// Extract var from req.body
	const {pseudo, email, password} = req.body;

	try {
		const user = await UserModel.create({pseudo, email, password});
		res.status(201).json({ user: user._id }); // Says that all worked well
	}

	catch(err) {
		res.status(200).send({err}); // Basic error message
	}
};