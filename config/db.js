
// Import mongoose - Help to connect to the Mongodb database
const mongoose = require('mongoose');
// Import env var file
require('dotenv').config({ path: './config/.env' });

// Connect to the DB
mongoose
	// Try to connect to the DB using username and password (env var)
	// useNewUrlParser etc... don't need to be specified anymore
	.connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.mcssh.mongodb.net/social-network-mern')
	// If connection work
	.then(() => console.log("Connected to the DB"))
	// If it fail
	.catch((err) => console.log("Connection to DB failed : ", err));