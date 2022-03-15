// Configure the DB datas

// Help to create object and connect to the Mangodb database
const mongoose = require('mongoose');

// isEmail return true if valid email
const { isEmail } = require('validator');

// Encrypt passwords
const bcrypt = require('bcrypt');

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

			picture: {
				type: String, // Can't stock image itself (just the link)
				default: './uploads/profil/random-user.png', // If no picture selected
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

// Encrypt password before send it to the DB using bcrypt dependence
// Not an arrow function 'cause of the this
userSchema.pre("save", async function(next) {
	// Salt password = Add some randoms char to the password to improve crack difficulty
	const salt = await bcrypt.genSalt();
	// Encrypt it
	this.password = await bcrypt.hash(this.password, salt);

	next();
});


// Encrypt password while login
userSchema.statics.login = async function (email, password) {

	// Find the user with email
	const user = await this.findOne({ email });
	if (user) {

		// Check if password is right, using bcrypt
		const auth = await bcrypt.compare(password, user.password);

		// If password is right
		if (auth) {
			return user;
		}
		throw Error('Incorrect password');
	}
	throw Error('Incorrect Email');
};


// Export
const UserModel	= mongoose.model('user', userSchema);
module.exports = UserModel;