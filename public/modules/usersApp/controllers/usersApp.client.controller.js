'use strict';
var Events = window.Events;
var $ = window.$;
angular.module('usersApp').controller('usersAppController', ['$scope','$http', '$rootScope', '$stateParams', '$location', 'Authentication', 'usersAppService',
	function($scope,$http, $rootScope, $stateParams, $location, Authentication, usersAppService) {

		$scope.authentication = Authentication;
		$scope.appId= $stateParams.appId;
		$scope.create = function() {

			var user = {
				firstName:		this.firstName,
				appID:				$scope.appId,
				lastName:			this.lastName,
				email:				this.email,
				username:			this.username,
				password:			this.password
			};

			usersAppService.saveUser(user).then(function(){

				$location.path('/'+$stateParams.appId+'/page');
			})

		};


		$scope.find = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			usersAppService.getUsersApp($scope.appId).then(function(users){
				$scope.users = users;
				$rootScope.$broadcast(Events.LOADER_HIDE);
			})
		};

		$scope.findOne = function() {
			usersAppService.getUserApp($stateParams.userId).then(function (user) {
				console.log(user);
				$scope.user = user[0];
			});
		};

		$scope.edit = function(userId){
			$location.path('/usersApp/'+userId+'/detail')
		};
		$scope.update = function() {
			var user = $scope.user;
			usersAppService.updateUser(user).then(function() {
				$location.path('/apps');
			});
		};
		$scope.remove = function(){
			usersAppService.removeApp($stateParams.appId).then(function () {
				$location.path('/apps');
			});
		};

	}
]);
