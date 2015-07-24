'use strict';

// Setting up route
angular.module('usersApp').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('addUser', {
			url: '/apps/:appId/createUser',
			templateUrl: 'modules/usersApp/views/create-user.client.view.html'
		}).

		state('User', { //fau  voir sa
			url: '/usersApp/:userId/detail',
			templateUrl: 'modules/usersApp/views/user.client.view.html'

		});
	}
]);
