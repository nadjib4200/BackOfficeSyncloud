'use strict';

// Setting up route
angular.module('apps').config(['$stateProvider',
	function($stateProvider) {
		// Apps state routing
		$stateProvider.
		state('listApps', {
			url: '/apps',
			templateUrl: 'modules/apps/views/list-apps.client.view.html'
		}).
		state('createApp', {
			url: '/apps/create',
			templateUrl: 'modules/apps/views/create-app.client.view.html'
		}).
		state('App', {
			url: '/:appId/page',
			templateUrl: 'modules/apps/views/app-page.client.view.html'
		}).
		state('editApp', {
			url: '/apps/:appId/edit',
			templateUrl: 'modules/apps/views/edit-app.client.view.html'
		});
	}
]);
