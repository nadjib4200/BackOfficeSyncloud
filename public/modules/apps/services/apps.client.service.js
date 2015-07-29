'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('apps')
	.service('AppService', [ 'Restangular',
		function(Restangular) {

			return {
				getApps: function(userID){
					return Restangular.all('apps/'+userID).getList(); //GET api/apps
				},

				getApp: function(appId){
					// Just ONE GET to /api/apps/123
					return Restangular.one('app', appId).get();
				},

				saveApp: function(app){
					return Restangular.all('apps').post(app); //POST a new App
				},

				updateApp: function(app){
					return Restangular.one("app").customPUT(app, app._id);
				},

				removeApp: function(appId){
					// Just ONE GET to /api/apps/123
					return Restangular.one('app', appId).remove();
				}

			}
		}

]);
