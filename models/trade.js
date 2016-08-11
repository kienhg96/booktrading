var mongoose = require('mongoose');

module.exports = mongoose.model('Trade', {
	bookId: String, 
	title: String,
	from: String,
	to: String,
	accept: Boolean
});