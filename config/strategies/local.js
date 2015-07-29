'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
	var url = require('../config').db;
	var pouchdb=require('pouchdb');
	var db = new pouchdb(url+'/users');
module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			db.get(username, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, {
						message: 'Unknown user'
					});
				}
				if (user.password!==password) {
					return done(null, false, {
						message: 'Invalid password'
					});
				}

				return done(null, user);
			});
		}
	));
};
