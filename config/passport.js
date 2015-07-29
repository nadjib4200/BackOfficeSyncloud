'use strict';

var passport = require('passport'),
	//User = require('mongoose').model('User'),
	path = require('path'),
	config = require('./config');
	var url = require('./config').db;
	var pouchdb=require('pouchdb');
	var db = new pouchdb(url+'/users');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		console.log(id);
		db.get(id, function(err, doc) {
		  console.log(doc);
			done(err, doc);
		});
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};
