const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

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
	response.send(persons);
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

	const person = {
		id: Math.random() * 1000,
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	//? for logging (see above, and see exercise 3.8)
	response.locals.data = person;

	response.json(person);
});

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find(person => person.id === id);

	if (person) {
		console.log('Matched to person: ', person);
		response.json(person);
	} else {
		console.log('No matching person found for the provided id!!');
		response.status(404).end();
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

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
