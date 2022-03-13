
const UserModel = require('../models/user.model.js');
const ObjectID = require("mongoose").Types.ObjectId;

// getAllUsers
module.exports.getAllUsers = async (req, res) => {

	// .find() -> Find UserModel
	// .select('-password -email') -> Select all except password & email (To hide it)
	const users = await UserModel.find().select('-password -email');
	
	// Send response (all users in the DB) with good exit status
	res.status(200).json(users);
};

//userInfo - About a specific user
module.exports.userInfo = async (req, res) => {

	// ObjectID return true if ID is in the DB
	if (!ObjectID.isValid(req.params.id)) { return res.status(400).send("ID unknown : " + req.params.id); }
	else {
		UserModel.findById(req.params.id, (err, docs) => {	
			// If no error then send datas
			if (!err) { res.send(docs) }
			else { console.log('ID unknown + ' + req.params.id) };
		}).select('-password -email');
	};
};

// updateUser
// Many fix needed about the tuto version - Link that helped me
// https://stackoverflow.com/questions/69090486/nodejs-express-mongodb-err-http-headers-sent
// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
module.exports.updateUser = async (req, res) => {

	if (!ObjectID.isValid(req.params.id)) { return res.status(400).send("ID unknown : " + req.params.id) }
	else {
		try {
			// Filter = ID of the user to update
			const filter = { _id: req.params.id };

			// Update = Changes to make
			const update = { bio: req.body.bio, };

			const options = {
				new: true, // Update DB with a new doc
				upsert: true // Make this update into an upsert
			}

			await UserModel.findOneAndUpdate(filter, update, options)

			.then((docs) => res.send(docs))
			.catch((err) => res.status(500).send({ message: err }));

		} catch (err) {
			return res.status(500).json({ message: err })
		}
	};
};

// deleteUser
module.exports.deleteUser = async (req, res) => {
	
	if (!ObjectID.isValid(req.params.id)) { return res.status(400).send("Unknown ID : " + req.params.id);  }
	else {
		try {
			const filter = { _id: req.params.body };

			await deleteOne(filter);
		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}

};
