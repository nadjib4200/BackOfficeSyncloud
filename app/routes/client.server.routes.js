'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	clients = require('../../app/controllers/clients');



//
// Create a new instance of HttProxy to use in your server
//
module.exports = function(client) {
	//  Project Routes
	client.route('/api/clients/:userID')
		.get(clients.list);
	client.route('/api/clients')
		.post(users.requiresLogin,clients.create);
	client.route('/api/client/Login')
			.post(clients.loginClient);
	client.route('/api/client/:clientId')
		.get(clients.read)
		.put(users.requiresLogin, clients.update)
		.delete(users.requiresLogin, clients.delete);

	// Finish by binding the client middleware
	client.param('clientId', clients.clientByID);
};
