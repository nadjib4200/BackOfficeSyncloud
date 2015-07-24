'use strict';

module.exports = {
	db: 'mongodb://localhost/app27617059',
	//db: 'mongodb://admin:admin@162.252.108.122:12738/ninou',
	//db: 'mongodb://heroku:JxL7nQ_bIkbkZKlO0kwXzTJz8YlariNwWJb-sGA_JllQH6oadtrRMBvagQf3ekGDueJzhOY5RrLcyPKJH8yPNw@linus.mongohq.com:10086/app30629384',
	rabbitmq:'amqp://wnxwjwav:IVxuSn0dwjl-T2Zx6Imj3IB2SUCk0EKT@lemur.cloudamqp.com/wnxwjwav',
	app: {
		title: 'user-track - Development Environment'
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
