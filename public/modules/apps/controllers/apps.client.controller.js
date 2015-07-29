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
				iconUrl: 	$scope.iconUrl,
				user:			$scope.authentication.user
			};

			AppService.saveApp(app).then(function(){
				$rootScope.$broadcast(Events.LOADER_HIDE);
				$location.path('apps');
			});

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
	        mimetype: 'application/*', /* Images only */
	        maxSize: 1024 * 1024 * 5, /* 5mb */
	        services: ['*'] /* All available third-parties */
	    }, function(blob){
	        // Returned Stuff
	        /*var filename = blob.filename;
	        var url = blob.url;
	        var id = blob.id;
	        var isWriteable = blob.isWriteable;
	        var mimetype = blob.mimetype;
	        var size = blob.size;*/
					$scope.zipUrl=blob.url;
	        console.log(blob);
	    });
		}
		$scope.pickIconFile = function(){
				// Settings
	    filepicker.pick({
	        mimetype: 'image/*', /* Images only */
	        maxSize: 1024 * 1024 * 5, /* 5mb */
	        services: ['*'] /* All available third-parties */
	    }, function(blob){
	        // Returned Stuff
	        /*var filename = blob.filename;
	        var url = blob.url;
	        var id = blob.id;
	        var isWriteable = blob.isWriteable;
	        var mimetype = blob.mimetype;
	        var size = blob.size;*/
					$scope.iconUrl=blob.url;
	        console.log(blob)
	    });
		}

	}
]);
