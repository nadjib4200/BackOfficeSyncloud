'use strict';

module.exports = {
	couchdb: 	'http://zahir:syncloud@195.154.223.114:5984/',
	//couchdb: 		'http://127.0.0.1:5984/',
	//db:			 		'mongodb://localhost/app27617059',
	db: 			'mongodb://heroku:JxL7nQ_bIkbkZKlO0kwXzTJz8YlariNwWJb-sGA_JllQH6oadtrRMBvagQf3ekGDueJzhOY5RrLcyPKJH8yPNw@linus.mongohq.com:10086/app30629384',

	app: {
		title: 'syncloud - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
	}
};
