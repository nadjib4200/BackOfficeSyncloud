'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var url = require('../../config/config').db;
var pouchdb=require('pouchdb');
var db = new pouchdb(url+'_users');
/**
 * Get the error message from error object
 */

var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'client already exists';
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
 * Create a client
 */
exports.create = function(req, res) {
		var client = req.body;
		client._id = req.body.username;
		db.put(client)
		.then(function (response) {
			console.log('Successfully');
			console.log(response);
			res.jsonp(client);
		}).catch(function (err) {
			console.log('Error');
			console.log(err);
		});

};

/**
 * Show the current client
 */

exports.read = function(req, res) {
	console.log("get client");
	res.jsonp(req.client);
};

/**
 * List of clients
 */
exports.list = function(req, res) {
	db.allDocs({
	  include_docs: true,
	  attachments: true
	}).then(function (result) {
	  var rows=_.map(result.rows, 'doc');//pour avoir juste les document de la base de donne
		res.jsonp(_.filter(rows, { appID:	req.params.appID } )); //retourne les clients de l'utilisateur connecter
	}).catch(function (err) {
		console.log("list client error");
	  console.log(err);
	  res.jsonp(err);
	});
};

/**
 * client middleware
 */

exports.clientByID = function(req, res, next, id) {
	db.get(id).then(function (doc) {
	  req.client = doc;
		next();
	}).catch(function (err) {
	  return next(err);
	});
};
