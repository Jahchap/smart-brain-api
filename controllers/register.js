const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password } = req.body;

	if(!email || !name || !password) {
		return res.status(400).json("You must fill in the fields properly");
	}
	//Use Bcrypt to hash the password
	const hash = bcrypt.hashSync(password);
	//Use a transaction to make sure that if a database operation fails, all database operations fail
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				}).then(user =>{
					res.json(user[0]);
				}).catch(err => {
					res.status(400).json('Unable to Register')
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
}

module.exports = {
	handleRegister: handleRegister
}