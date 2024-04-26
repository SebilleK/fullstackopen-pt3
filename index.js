const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const Entry = require('./models/entry');

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

//! Middlewares
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
app.use(morgan('tiny'));
//? Added for exercise 3.8 (extra Log line)
// custom token
morgan.token('response', (req, res) => JSON.stringify(res.locals.data));
// log similar to tiny but adding the custom token above
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :response`));

//! MongoDB | Mongoose
//? provide password to connect to database when running script: npm start <password>
//! check .env hardcoded url. security issue??
//? all code of this part is in models/entry.js

//! ______________________________________
// Default "tiny" token format/definition response:
/* 
	morgan(':method :url :status :res[content-length] - :response-time ms')
Example:
	GET /api/persons/3 200 53 - 3.998 ms
*/
// for custom token formats to be used and overwriting existing token definitions see docs (exercise 3.8)
//!______________________________________

app.get('/api/persons', (request, response) => {
	Entry.find({}).then(entries => {
		response.json(entries);
	});
});

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing',
		});
	}

	if (persons.find(person => person.name === body.name)) {
		return response.status(400).json({
			error: 'name must be unique',
		});
	}

	const person = new Entry({
		name: body.name,
		number: body.number,
	});

	//? for logging (see above, and see exercise 3.8)
	response.locals.data = person;

	person.save().then(savedPerson => {
		response.json(savedPerson);
	});
});

app.get('/api/persons/:id', (request, response) => {
	try {
		Entry.findById(request.params.id).then(person => {
			console.log('Matched to person: ', person);
			response.json(person);
		});
	} catch (error) {
		response.status(400).end();
		console.log(error);
	}
});

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);

	response.status(204).end();
});

app.get('/info', (request, response) => {
	let info = {
		description: `Phonebook has info for ${persons.length} people`,
		date: new Date(), // new Date(),
	};
	response.send(info);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
