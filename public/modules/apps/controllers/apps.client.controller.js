'use strict';
var Events = window.Events;
var $ = window.$;
angular.module('apps').controller('AppsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'AppService',
	function($scope, $rootScope, $stateParams, $location, Authentication, AppService) {

		$scope.authentication = Authentication;
		$scope.appId=$stateParams.appId;
		$scope.create = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			var app = {
				name: 		this.name,
				zipUrl: 	this.zipUrl,
				key: 			this.key
			};

			AppService.saveApp(app).then(function(){
				$rootScope.$broadcast(Events.LOADER_HIDE);
				$location.path('apps');
			})

		};


		$scope.update = function() {
			var app = $scope.app;
			AppService.updateApp(app)
			.then(function() {
				$location.path('apps');
			});
		};

		$scope.find = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			AppService.getApps().then(function(apps){
				console.log(apps);
				$scope.apps = apps;
				$rootScope.$broadcast(Events.LOADER_HIDE);
			})
		};

		$scope.findOne = function() {
			AppService.getApp($stateParams.appId).then(function (app) {
				$scope.app = app;
			});
		};

		$scope.edit = function(app){
			$location.path('/apps/'+app._id+'/edit')
		};

		$scope.remove = function(){
			AppService.removeApp($stateParams.appId).then(function () {
				$location.path('/apps');
			});
		};

		$scope.getColor = function(index){
			console.log('getColor');
			var COLORS = ['#7761a7','#19b698', '#3d566d', '#ea6153', '#001f3f', '#f012be'];
			var colorSize = COLORS.length;
			return COLORS[index%colorSize];
		}

	}
]);
