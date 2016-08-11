var express = require('express');
var router = express.Router();
var request = require('request');
var Book = require('../models/book');
var Trade = require('../models/trade');
/* GET home page. */
router.get('/search', function(req, res) {
	if (!req.query.q){
		return res.json({errCode: -4, msg: 'Missing argument \'q\''});
	}
	var url = 'https://www.googleapis.com/books/v1/volumes?key=' + process.env.GOOGLE_BOOK_API_KEY + '&q=' + req.query.q;
	console.log(url);
	request(url, function(err, response, body){
		result = JSON.parse(body);
		if (!result.items) {
			return res.json(result);
		}
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
		return res.json({errCode: -4, msg: 'Missing argument \'bookId\''});
	}

	var bookId = req.body.bookId;
	Book.findOne({bookId : bookId}, function(err, data){
		if (data) {
			return res.json({errCode: -6, msg: 'You already have this book'});
		}
		var url = 'https://www.googleapis.com/books/v1/volumes?key=' + process.env.GOOGLE_BOOK_API_KEY + '&q=' + bookId;
		request(url, function(err, response, body){
			if (err) throw err;
			if (response.statusCode !== 200){
				res.json({errCode: response.statusCode, msg: 'Error in getting infomation'});
			}
			var result = JSON.parse(body);
			if (result.totalItems === 0){
				res.json({errCode: -4, msg: 'Book not found'});
			}
			if (!result.items) {
				res.json({errCode: -9, result: result, msg: 'Error network, please see console'});
			}
			var book = new Book();
			var item = result.items[0];
			book.bookId = item.id;
			book.title = item.volumeInfo.title;
			book.authors = item.volumeInfo.authors;
			book.thumbnail = item.volumeInfo.imageLinks.thumbnail;
			book.user = req.user.username;
			book.trade = false;
			book.save();
			res.json({
				errCode: 0, 
				book:{
					bookId: book.bookId,
					title: book.title,
					authors: book.authors,
					thumbnail: book.thumbnail,
					trade: book.trade
				}
			});
		});
	})
});

router.get('/allbook', function(req, res){
	Book.find({}, function(err, arr){
		if (err) throw err;
		res.json({errCode: 0, items: arr.map(function(book){
			return {
				bookId: book.bookId,
				title: book.title,
				authors: book.authors,
				thumbnail: book.thumbnail,
				user: book.user,
				trade: book.trade
			}
		})});
	});
});

router.get('/mybook', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}
	Book.find({user: req.user.username}, function(err, arr){
		if (err) throw err;
		res.json({errCode: 0, items: arr.map(function(book){
			return {
				bookId: book.bookId,
				title: book.title,
				authors: book.authors,
				thumbnail: book.thumbnail,
				user: book.user,
				trade: book.trade
			}
		})})
	});
});

router.post('/maketrade', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}
	if (!req.body.bookId) {
		return res.json({errCode: -4, msg: 'Missing argument \'bookId\''});
	}
	if (!req.body.user) {
		return res.json({errCode: -4, msg: 'Missing argument \'user\''});
	}
	var bookId = req.body.bookId;
	var user = req.body.user;
	if (user === req.user.username) {
		return res.json({errCode: -7, msg: 'The book is belong to you'});
	}
	var title;
	Book.findOne({bookId: bookId, user: user}, function(err, book){
		if (err) throw err;
		if (book) {
			if (!book.trade){
				title = book.title;
				Trade.findOne({bookId: bookId, from: req.user.username, to: user}, function(err, trade){
					if (trade) {
						res.json({errCode: -7, msg: 'You requested this book'});
					}
					else {
						console.log('title: ', title);
						newtrade = new Trade();
						newtrade.bookId = bookId;
						newtrade.title = title;
						newtrade.from = req.user.username;
						newtrade.to = user;
						newtrade.accept = false;
						newtrade.save();
						res.json({errCode: 0, msg: 'OK'});
					}
				});
			}
			else {
				res.json({errCode: -7, msg: 'The book is traded'});
			}
		}
		else {
			res.json({errCode: -4, msg: 'Book not found'});
		}
	});
});

router.get('/incomingtrade', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}	
	Trade.find({to: req.user.username}, function(err, arr){
		if (err) throw err;

		res.json({errCode: 0, trades: arr.map(function(trade){
			return {
				tradeId: trade._id,
				bookId: trade.bookId,
				title: trade.title,
				from: trade.from,
				to: trade.to,
				accept: trade.accept
			}
		})});
	});
});

router.get('/outcomingtrade', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}
	Trade.find({from: req.user.username}, function(err, arr){
		if (err) throw err;
		res.json({errCode: 0, trades: arr.map(function(trade){
			return {
				tradeId: trade._id,
				bookId: trade.bookId,
				title: trade.title,
				from: trade.from,
				to: trade.to,
				accept: trade.accept
			}
		})});
	});
});

router.post('/accept', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}
	if (!req.body.tradeId) {
		return res.json({errCode: -4, msg: 'Missing argument \'tradeId\''});
	}

	var tradeId = req.body.tradeId;

	Trade.findById(tradeId, function(err, trade){
		if (err) throw err;
		if (trade) {
			trade.accept = true;
			trade.save();
			Book.findOne({bookId: trade.bookId, user: req.user.username}, function(err, book){
				if (err) throw err;
				book.trade = true;
				book.save();
			});
			Trade.remove({bookId: trade.bookId, to: req.user.username, from : {$ne: trade.from}}, function(err){
				if (err) throw err;
				res.json({errCode: 0, msg: 'OK'})
			});
		}
		else {
			res.json({errCode: -4, msg: 'Trade not found'})
		}
	});
});

router.post('/cancel', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}
	if (!req.body.tradeId) {
		return res.json({errCode: -4, msg: 'Missing argument \'tradeId\''});
	}
	var tradeId = req.body.tradeId;
	Trade.findById(tradeId, function(err, trade){
		if (err) throw err;
		if (!trade) {
			return res.json({errCode: -4, msg: 'Trade not found'});
		}
		if ((req.user.username !== trade.to) && (req.user.username !== trade.from)) {
			return res.json({errCode: -4, msg: 'Trade not belong to you'});
		}
		if (trade.accept) {
			Book.findOne({bookId: trade.bookId}, function(err, book){
				if (err) throw err;
				book.trade = false;
				book.save();
			});
		}
		Trade.remove({_id: tradeId}, function(err){
			if (err) throw err;
			res.json({errCode: 0, msg: 'OK'});
		});
	})
});

router.post('/delbook', function(req, res){
	if (!req.isAuthenticated()) {
		return res.json({errCode: -3, msg: 'Not login'});
	}
	if (!req.body.bookId) {
		return res.json({errCode: -4, msg: 'Missing argument \'bookId\''});
	}
	var bookId = req.body.bookId;
	Book.remove({bookId: bookId, user: req.user.username}, function(err){
		if (err) throw err;
	});
	Trade.remove({bookId: bookId, to: req.user.username}, function(err){
		if (err) throw err;
	})
	res.json({errCode: 0, msg: 'OK'});
});

router.post('/bookinfo', function(req, res){
	if (!req.body.bookId) {
		return res.json({errCode: -4, msg: 'Missing argument \'bookId\''});
	}
	var bookId = req.body.bookId;
	Book.findOne({bookId: bookId}, function(err, book){
		if (err) throw err;
		if (!book) {
			res.json(null);
		}
		else {
			res.json(book);
		}
	})
});

module.exports = router;
