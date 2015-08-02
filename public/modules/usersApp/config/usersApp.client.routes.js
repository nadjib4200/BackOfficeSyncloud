'use strict';

// Setting up route
angular.module('usersApp').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('addUser', {
			url: '/users/create',
			templateUrl: 'modules/usersApp/views/create-user.client.view.html'
		}).
		state('listUsers', {
			url: '/users',
			templateUrl: 'modules/usersApp/views/users.client.view.html'
		}).
		state('editUser', {
			url: '/users/:userId/edit',
			templateUrl: 'modules/usersApp/views/edit-user.client.view.html'
		});
	}
]);
