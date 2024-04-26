require('dotenv').config();
const mongoose = require('mongoose');

// const password = encodeURI(process.argv[2]);
const url = process.env.MONGODB_URI;
console.log('Connecting to MongoDB...');

mongoose.set('strictQuery', false);
mongoose
	.connect(url)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message);
	});

const entrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

entrySchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = mongoose.model('Entry', entrySchema);
