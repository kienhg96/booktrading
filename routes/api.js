var express = require('express');
var router = express.Router();
var request = require('request');
var Book = require('../models/book')
/* GET home page. */
router.get('/search', function(req, res) {
	if (!req.query.q){
		return res.json({errCode: -4, msg: 'Missing argument \'q\''});
	}
	var url = 'https://www.googleapis.com/books/v1/volumes?key=' + process.env.GOOGLE_BOOK_API_KEY + '&q=' + req.query.q;
	console.log(url);
	request(url, function(err, response, body){
		result = JSON.parse(body);
		if (result.totalItems === 0) {
			return res.json({items: []});
		}
		var items = result.items.map(function(elem){
			return {
				bookId: elem.id,
				title: elem.volumeInfo.title,
				authors: elem.volumeInfo.authors,
				thumbnail: elem.volumeInfo.imageLinks.thumbnail
			}
		});
		res.json({items: items});
	});
});

router.post('/addbook', function(req, res){
	if (!req.isAuthenticated()){
		return res.json({errCode: -3, msg: 'Not login'});
	}
	if (!req.body.bookId) {
		return res.json({errCode: -3, msg: 'Missing argument \'bookId\''});
	}
	var bookId = req.body.bookId;
	var url = 'https://www.googleapis.com/books/v1/volumes?key=' + process.env.GOOGLE_BOOK_API_KEY + '&q=' + bookId;
	request(url, function(err, response, body){
		if (err) throw err;
		if (response.statusCode !== 200){
			res.json({errCode: response.statusCode, msg: 'Error in getting infomation'});
		}
		var result = JSON.parse(body);
		if (result.totalItems === 0){
			res.json({errCode: -4, msg: 'Book not fount'});
		}
		var book = new Book();
		var item = result.items[0];
		book.bookId = item.id;
		book.title = item.volumeInfo.title;
		book.authors = item.volumeInfo.authors;
		book.thumbnail = item.volumeInfo.imageLinks.thumbnail;
		book.user = req.user.username;
		book.save();
		res.json({
			bookId: book.bookId,
			title: book.title,
			authors: book.authors,
			thumbnail: book.thumbnail
		});
	});
});

router.get('/allbook', function(req, res){
	Book.find({}, function(err, arr){
		if (err) throw err;
		res.json({items: arr.map(function(book){
			return {
				bookId: book.bookId,
				title: book.title,
				authors: book.authors,
				thumbnail: book.thumbnail,
				user: book.user
			}
		})});
	});
});

module.exports = router;
