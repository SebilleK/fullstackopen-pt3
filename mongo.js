const mongoose = require('mongoose');
require('dotenv').config();

if (process.argv.length > 5 || process.argv.length < 3) {
	console.log(
		`Please provide the password as an argument. The following formats are accepted: \n    node mongo.js <password> <name> <number> : Adds a new entry to the phonebook \n    node mongo.js <password> : Lists all entries in the database`,
	);
	process.exit(1);
} else {
	//? password needs to be encoded if it contains special characters
	// console.log('argument 2:', process.argv[2], 'argument 3:', process.argv[3], 'argument 4:', process.argv[4]);
	// const password = encodeURI(process.argv[2]);
	const name = process.argv[3];
	const number = process.argv[4];

	const url = process.env.MONGODB_URI;

	mongoose.set('strictQuery', false);

	mongoose.connect(url);

	const entrySchema = new mongoose.Schema({
		name: String,
		number: String,
	});

	const Entry = mongoose.model('Entry', entrySchema);

	// if user only provides password (the other arguments don't exist), it's a request for all entries
	if (!name) {
		try {
			console.log('Phonebook Database Results:');
			Entry.find({}).then(result => {
				result.forEach(entry => {
					console.log(`\n ${entry.name} | ${entry.number}`);
				});
				mongoose.connection.close();
			});
		} catch (error) {
			console.log(`Unable to find entries: ${error}`);
			mongoose.connection.close();
		}
		// else if the other arguments exists, it's a request to add a new entry
	} else {
		const entry = new Entry({
			name: name,
			number: Number(number),
		});

		entry.save().then(() => {
			console.log(`Added ${name} number ${number} to phonebook`);
			mongoose.connection.close();
		});
	}
}
