'use strict';

var PUBNUB = window.PUBNUB;
angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		if(!Authentication.user){
			$location.path('/signin');
		}
		console.log('/home ', '$scope.authentication', $scope.authentication);
		
	}
]);