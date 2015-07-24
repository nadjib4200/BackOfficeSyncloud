'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var AppSchema = new Schema({

	name: {
		type: String,
		default: '',
		trim: true
	},
	zipUrl: {
		type: String,
		default: '',
		trim: true
	},
	key: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, {strict: false});

mongoose.model('App', AppSchema);
