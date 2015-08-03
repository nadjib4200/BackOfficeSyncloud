'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var url = require('../../config/config').couchdb;
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
		client._id = "org.couchdb.user:"+req.body.username;
		client.type="user";
		client.name=req.body.username;
		client.motDePass=req.body.password;
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
		res.jsonp(_.filter(rows, { ownerID:	req.params.userID } )); //retourne les clients de l'utilisateur connecter
	}).catch(function (err) {
		console.log("list client error");
	  console.log(err);
	  res.jsonp(err);
	});
};

/**
 * Update a App
 */
exports.update = function(req, res) {

	db.get(req.params.clientId).then(function(doc) {
			doc = _.extend(doc, req.body);
			db.put(doc)
			.then(function (response) {
				console.log('Successfully');
				console.log(response);
				res.jsonp(doc);
			}).catch(function (err) {
				console.log('Error');
				console.log(err);
				res.json(err);
			});
	}).then(function(response) {
		console.log("success");
	  console.log(response);
	}).catch(function (err) {
		console.log("error");
	  console.log(err);
	});

};

/**
 * Delete an App
 */
exports.delete = function(req, res) {
	db.get(req.params.clientId).then(function(doc) {
	  return db.remove(doc);
	}).then(function (result) {
	  console.log("successfully");
		res.jsonp(result);
	}).catch(function (err) {
		console.log(err);
		return res.send(400, {
			message: getErrorMessage(err)
		});
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
