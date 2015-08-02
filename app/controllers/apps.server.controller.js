'use strict';

/**
 * Module dependencies.
 */
var uuid = require('node-uuid'),
	_ = require('lodash');
	var url = require('../../config/config').db;
	var pouchdb=require('pouchdb');
	var db = new pouchdb(url+'applications');
/**
 * Get the error message from error object
 */

var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'App already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a App
 */
exports.create = function(req, res) {

		var app = req.body;
		app.key = uuid.v1();
		app._id = req.body.name;
		db.put(app)
		.then(function (response) {
			console.log('Successfully');
			console.log(response);
			res.jsonp(app);
		}).catch(function (err) {
			console.log('Error');
			console.log(err);
		});

};

/**
 * Show the current App
 */
exports.read = function(req, res) {
	console.log("read");
	res.jsonp(req.App);
};

/**
 * Update a App
 */
exports.update = function(req, res) {
	var App = req.App;
	db.get(App.name).then(function(doc) {
			if(!App.key){
				App.key = uuid.v1();
			}
			App = _.extend(App, req.body);
			db.put(App)
			.then(function (response) {
				console.log('Successfully');
				console.log(response);
				res.jsonp(App);
			}).catch(function (err) {
				console.log('Error');
				console.log(err);
				res.json(err);
			});
	}).then(function(response) {
	  console.log(response);
	}).catch(function (err) {
	  console.log(err);
	});

};

/**
 * Delete an App
 */
exports.delete = function(req, res) {
	var App = req.App;
	db.get(App._id).then(function(doc) {
	  return db.remove(doc);
	}).then(function (result) {
	  res.jsonp(App);
	}).catch(function (err) {
		console.log(err);
		return res.send(400, {
			message: getErrorMessage(err)
		});
	});

};

/**
 * List of Apps
 */
exports.list = function(req, res) {
	db.allDocs({
	  include_docs: true,
	  attachments: true
	}).then(function (result) {
	  var rows=_.map(result.rows, 'doc');//pour avoir juste les document de la base de donne
		var User={ "userId" : req.params.userID }; //cree un abjet user pour le comparer avec les doc de la base de donne
	res.jsonp(_.filter(rows, User )); //retourne les apps de l'utilisateur connecter
	}).catch(function (err) {
		console.log(err);
	  res.jsonp(err);
	});
};

/**
 * App middleware
 */

exports.AppByID = function(req, res, next, id) {
	db.get(id).then(function (doc) {
	  req.App = doc;
		next();
	}).catch(function (err) {
	  return next(err);
	});
};

/**
 * App authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	if (req.App.user._id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
