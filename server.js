
// Import express
const express = require('express');

// Import env var file
require('dotenv').config({path: './config/.env'});

// Import DB connection file
require('./config/db.js');

const userRoutes = require('./routes/user.routes.js');


// Create app using express
const app = express();


// Modif req
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', (req, res, next) => {
	console.log("Request received !");
	next();
});

// Routes
app.use('/api/user', userRoutes);

// Listen on PORT given by env var file - Always at EOF
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${ process.env.PORT }`);
});