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

//! Error handlers
const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	}

	next(error);
};

app.use(errorHandler);

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

//! Routes
//? Get all Entries
app.get('/api/persons', (request, response) => {
	Entry.find({}).then(entries => {
		response.json(entries);
	});
});

//? Create Entry (and update it if it already exists)
app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(400).json({
			error: 'content missing',
		});
	}

	Entry.findOne({ name: body.name }).then(person => {
		if (person) {
			Entry.findOneAndUpdate({ name: body.name }, { number: body.number }, { new: true, runValidators: true, context: 'query' })
				.then(updatedPerson => {
					response.json(updatedPerson);
				})
				.catch(error => next(error));
		} else {
			const person = new Entry({
				name: body.name,
				number: body.number,
			});

			person.save().then(savedPerson => {
				response.json(savedPerson);
			});
		}

		//? for logging (see above, and see exercise 3.8)
		response.locals.data = person;
	});
});

//? Get one Entry by id
app.get('/api/persons/:id', (request, response, next) => {
	Entry.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});

//? Delete Entry by id
app.delete('/api/persons/:id', (request, response, next) => {
	Entry.findByIdAndDelete(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

//? Info
app.get('/info', (request, response) => {
	Entry.countDocuments({}).then(count => {
		response.send(`Phonebook has info for ${count} people. This page was generated @ ${new Date()}`);
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
