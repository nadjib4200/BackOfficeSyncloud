'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('apps')
	.service('AppService', [ 'Restangular',
		function(Restangular) {

			return {
				getApps: function(){
					return Restangular.all('apps').getList(); //GET api/apps
				},

				getApp: function(appId){
					// Just ONE GET to /api/apps/123
					return Restangular.one('apps', appId).get();
				},

				saveApp: function(app){
					return Restangular.all('apps').post(app); //POST a new App
				},

				updateApp: function(app){
					return Restangular.one("apps").customPUT(app, app._id);
				},

				removeApp: function(appId){
					// Just ONE GET to /api/apps/123
					return Restangular.one('apps', appId).remove();
				}

			}
		}

]);
