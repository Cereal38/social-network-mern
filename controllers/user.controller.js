
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
			const update = { $set: { bio: req.body.bio, } };

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
	
	if (!ObjectID.isValid(req.params.id)) { return res.status(400).send("ID unknown : " + req.params.id);  }
	else {
		try {
			const filter = { _id: req.params.id };
			
			// .remove() of tuto is deprecated
			await UserModel.deleteOne(filter);
			
			res.status(200).json({ message: "Successfully deleted" });

		} catch (err) {
			return res.status(500).json({ message: err })
		}
	}

};

// follow
// Take id of the user in url
// (Part 1) Add the ID of the person to follow (ID given in the JSON) in the followings list of the user
// (Part 2) Add the ID of the user in the followers list of the person to follow
module.exports.follow = async (req, res) => {

	// Here we check both id given
	if (!ObjectID.isValid(req.params.id)) { return res.status(400).send("ID unknown : " + req.params.id); }
	else if (!ObjectID.isValid(req.body.idToFollow)) { return res.status(400).send("ID unknow : " + req.body.idToFollow); }
	else {
		try {
			
			// Part 1
			const filter_following = { _id: req.params.id };
			const update_following = { $addToSet: { following: req.body.idToFollow } };
			const options_following = { new: true, upsert: true };

			// Add req.params.id to the follow list
			await UserModel.findByIdAndUpdate(filter_following, update_following, options_following)
			// No ".then(docs) => res" here, 'cause if we send a response now, we can't exec part 2
			.catch((err) => res.status(400).send({ message: err }));
			
			// Part 2
			const filter_followers = { _id: req.body.idToFollow };
			const update_followers = { $addToSet: { followers: req.params.id } };
			const options_followers = { new: true, upsert: true };

			await UserModel.findByIdAndUpdate(filter_followers, update_followers, options_followers)
			.then((docs) => res.status(201).send(docs))
			.catch((err) => res.status(400).send({ message: err }));

		} catch (err) { return res.status(500).json({ message: err }); }
	};

};

// unfollow
module.exports.unfollow = async (req, res) => {

	if (!ObjectID.isValid(req.params.id)) { return res.status(400).send("ID unknown : " + req.params.id) }
	else if (!ObjectID.isValid(req.body.idToUnfollow)) { return res.status(400).send("ID unknown" + req.body.idToUnfollow) }
	else {
		try {
			// General options for both parts	
			const options = { new: true, upsert: true }

			const filter_following = { _id: req.params.id }
			const update_following = { $pull: { following: req.body.idToUnfollow } }
			
			await UserModel.findByIdAndUpdate(filter_following, update_following, options)
			.catch((err) => res.status(400).send({ message: err }));

			const filter_followers = { _id: req.body.idToUnfollow }
			const update_followers = { $pull: { followers: req.params.id } }

			await UserModel.findByIdAndUpdate(filter_followers, update_followers, options)
			.then((docs) => res.status(201).send(docs))
			.catch((err) => res.status(400).send({ message: err }));

		} catch (err) { return res.status(500).json({ message: err }); }
	}

};








