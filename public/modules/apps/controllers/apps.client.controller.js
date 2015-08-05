'use strict';
var Events = window.Events;
var $ = window.$;
var filepicker = window.filepicker;

filepicker.setKey("AxyphnToYSryOvLFNnrsAz");
angular.module('apps').controller('AppsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'AppService',
	function($scope, $rootScope, $stateParams, $location, Authentication, AppService) {

		$scope.authentication = Authentication;
		$scope.appId=$stateParams.appId;
		$scope.create = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			var app = {
				name: 		this.name,
				zipUrl: 	$scope.zipUrl,
				ownerId: 	$scope.authentication.user._id,
				iconUrl: 	$scope.iconUrl
			};

			AppService.saveApp(app).then(function(){
				$rootScope.$broadcast(Events.LOADER_HIDE);
				$location.path('apps');
			});

		};


		$scope.update = function() {
			var app = $scope.app;
			if($scope.zipUrl) app.zipUrl=	 $scope.zipUrl;
			if($scope.iconUrl) app.iconUrl= $scope.iconUrl;
			AppService.updateApp(app)
			.then(function() {
				$location.path('apps');
			});
		};

		$scope.find = function() {
			$rootScope.$broadcast(Events.LOADER_SHOW);
			AppService.getApps($scope.authentication.user._id).then(function(apps){
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
		$scope.pickZipFile = function(){
				// Settings
	    filepicker.pick({
					extensions: '.zip',
					container: 'window',
	        services: ['*']
	    }, function(blob){
					angular.element("#zipUrl").val(blob.url);
					$scope.zipUrl=blob.url;
	    });
		}
		$scope.pickIconFile = function(){
				// Settings
	    filepicker.pick({
	        mimetype: 'image/*',
	        maxSize: 1024 * 1024 * 5,
					container: 'window',
	        services: ['*'] 
	    }, function(blob){
					angular.element("#iconUrl").val(blob.url);
					$scope.iconUrl=blob.url;
	    });
		}

	}
]);
