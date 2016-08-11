var mongoose = require('mongoose');

module.exports = mongoose.model('Book', {
	bookId: String,
	title: String,
	authors: [],
	thumbnail: String,
	user: String, 
	trade: Boolean
});