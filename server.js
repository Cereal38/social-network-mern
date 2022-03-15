
const express = require('express');
const cookieParser = require('cookie-parser');

// Import env var file
require('dotenv').config({path: './config/.env'});

// Import DB connection file
require('./config/db.js');

const userRoutes = require('./routes/user.routes.js');
const { checkUser } = require('./middleware/auth.middleware.js');


// Create app using express
const app = express();


// Modif req - Convert to json
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// JWT - Check 'jwt' cookie
app.get('*', checkUser);

// Routes
app.use('/api/user', userRoutes);

// Listen on PORT given by env var file - Always at EOF
app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${ process.env.PORT }`);
});