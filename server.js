const app = require('express')();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = require('knex')({
	client: 'pg',
	//using ternary operator to check if in production or dev environment
	//This is for the knex connection
	connection: process.env.NODE_ENV === 'production'? {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	} : {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB
	}
});

/*
// This is same as the above (where Knex is imported and called at the same time )
const knex = require('knex');
const db = knex({
	client: 'pg',
	connection: {
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASS,
		database: DB
	}
});
*/

/*
const express = require('express');
const app = express();
This is same as
const app = require('express')()
*/

app.use(bodyParser.json());
app.use(cors());

// Home route
app.get('/', (req, res) => {
	res.json('Welcome. Please visit the front end at nc-smart-brain.herokuapp.com to access this app')
	// db.select('*')
	// 	.from('users')
	// 	.then(allUsers => {
	// 		res.json(allUsers);
	// 	})
	// 	.catch(err => {
	// 		res.status(404).json('Unable to Get all Users');
	// 	})
});

// Register endpoint (route)) '/register'
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)});
//Sign in route
app.post('/signin', signin.handleSignIn(db, bcrypt)); // This is same as above by using higher order function
// Profile route /profile/:userId --> GET res = user
app.get('/profile/:id', (req, res) => profile.handleProfileGet(db)(req, res)); // This is another of using higher order function
//Image route /image --> PUT --> user
app.put('/image', (req, res) => { image.handleImageGet(req, res, db)});
//Image Api Call --> Post
app.post('/imageurl', (req, res) => { image.handleImageApiCall(req, res)});
// Error 404 Route
app.get('*', (req, res) => {res.status(404).send('That page doesn\'t exist!')});

// Set up the port
app.listen(process.env.NODE_ENV === 'production'? process.env.PORT : 4000, () => {
	console.log(`App started on port ${process.env.PORT}`);
});