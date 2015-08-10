'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	apps = require('../../app/controllers/apps');



//
// Create a new instance of HttProxy to use in your server
//

module.exports = function(app) {
	//  Project Routes
	app.route('/api/apps/:userID')
		.get(apps.list);
		app.route('/api/apps')
			.post(users.requiresLogin,apps.create);

	app.route('/api/app/:appId')
		.get(apps.read)
		.put(users.requiresLogin, apps.update)
		.delete(users.requiresLogin, apps.delete);

	// Finish by binding the app middleware
	app.param('appId', apps.AppByID);
};
