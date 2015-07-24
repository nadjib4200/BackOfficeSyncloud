'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	App = mongoose.model('App'),
	uuid = require('node-uuid'),
	_ = require('lodash');
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
		var key = uuid.v1();
		var app = new App(req.body);
		app.user = req.user;
		app.key = key;
		app.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(app);
			}
		});
};

/**
 * Show the current App
 */
exports.read = function(req, res) {
	res.jsonp(req.App);
};

/**
 * Update a App
 */
exports.update = function(req, res) {
	var App = req.App;

	if(!App.key){
		App.key = uuid.v1();
	}

	App = _.extend(App, req.body);

	App.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(App);
		}
	});
};

/**
 * Delete an App
 */
exports.delete = function(req, res) {
	var App = req.App;

	App.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(App);
		}
	});
};

/**
 * List of Apps
 */
exports.list = function(req, res) {
	App.find({user: req.user}).sort('-created').populate('user', 'displayName').exec(function(err, Apps) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(Apps);
		}
	});
};

/**
 * App middleware
 */

exports.AppByID = function(req, res, next, id) {
	App.find({'_id':id ,user: req.user}).populate('user', 'displayName').exec(function(err, Apps) {
		if (err) return next(err);
		if (!Apps) return next(new Error('Failed to load App ' + id));
		req.App = Apps[0];
		next();
	});
};

/**
 * App authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

	if (req.App.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};
