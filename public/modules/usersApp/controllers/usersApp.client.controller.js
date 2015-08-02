'use strict';
var Events = window.Events;
var $ = window.$;
var _ = window._;
angular.module('usersApp').controller('usersAppController', ['$scope','$http', '$rootScope', '$stateParams', '$location', 'Authentication', 'usersAppService', 'AppService',
	function($scope,$http, $rootScope, $stateParams, $location, Authentication, usersAppService, AppService) {

		$("#roles").tagsinput();

		$scope.authentication = Authentication;
		$scope.appId= $stateParams.appId;

		$scope.create = function() {
			console.log('create function');
			var user = {
				firstName:		this.firstName,
				lastName:			this.lastName,
				email:				this.email,
				username:			this.username,
				password:			this.password,
				apps:					_.pluck(this.appSelected,'_id'),
				userID: 			$scope.authentication.user._id,
				roles: 				this.roles.split(",")
			};
			usersAppService.saveUser(user,$scope.appId).then(function(){
				$location.path('/users');
			});

		};


		$scope.find = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			usersAppService.getUsersApp($scope.authentication.user._id).then(function(users){
				$scope.users = users;
				$rootScope.$broadcast(Events.LOADER_HIDE);
			})
		};

		$scope.getApps = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			AppService.getApps($scope.authentication.user._id).then(function(apps){
				$scope.apps = apps;
				$scope.appSelected = [];
				$rootScope.$broadcast(Events.LOADER_HIDE);
			})
		};

		$scope.findOne = function() {
			usersAppService.getUserApp($stateParams.userId).then(function (user) {
				$scope.user = user;
				$("#roles").tagsinput('add' , (user.roles).toString());
			});
		};
		$scope.update = function() {
			var user = $scope.user;
			user.roles = user.roles.split(",");
			user.apps[1] = user.apps[1]._id;
			usersAppService.updateUser(user)
			.then(function() {
				$location.path('users');
			});
		};
		$scope.edit = function(userId){
			$location.path('/users/'+userId+'/edit')
		};
		$scope.inArray = function(tab,element){
			return (_.indexOf(tab, element) !== -1);
		};
		$scope.remove = function(){
			usersAppService.removeUser($stateParams.userId).then(function () {
				$location.path('/users');
			});
		};

	}
]);
