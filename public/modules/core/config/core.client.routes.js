'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',
	function($stateProvider, $urlRouterProvider, RestangularProvider) {
		RestangularProvider.setBaseUrl('/api');
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);