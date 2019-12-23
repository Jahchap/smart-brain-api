const Clarifai = require('clarifai');

//Api Key from Clarifai
const app = new Clarifai.App({apiKey: 'a5e8f5d16b474133a234b917b0900dee'});

const handleImageApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => res.json(data))
		.catch(err => res.status(400).json('Unable to work with API'))
}

const handleImageGet = (req, res, db) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0])
		})
		.catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
	handleImageGet,
	handleImageApiCall
}