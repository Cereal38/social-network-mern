// Configure the DB datas

const mongoose = require('mongoose');
// isEmail return true if valid email
const { isEmail } = require('validator');

// Create user schema (JS object)
const userSchema = new mongoose.Schema(

		{
			pseudo: {
				type: String,
				require: true, // Mandatory
				minLength: 3,
				maxLength: 50,
				unique: true,
				trim: true, // Space will be deleted
			},

			email: {
				type: String,
				require: true, 
				validate: [isEmail], // Use validator dependance - Check if email is valid
				lowercase:true,
				unique: true,
				trim: true,
			},

			password: {
				type: String,
				require: true,
				minLength: 6,
				maxLength: 1024, // Big number cause of crypted passwords
			},

			bio: {
				type: String,
				maxLength: 1024,
			},

			followers: {
				type: [String], // Contain IDs of followers
			},

			following: {
				type: [String],
			},

			likes: {
				type: [String], // Contain IDs of liked messages
			},
		},
		{
			timestamps: true, // Logs
		}
	);

// Export
const UserModel	= mongoose.model('user', userSchema);
module.exports = UserModel;