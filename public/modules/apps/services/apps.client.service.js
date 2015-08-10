'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('apps')
	.service('AppService', [ 'Restangular',
		function(Restangular) {

			return {
				getApps: function(userID){
					return Restangular.all('apps/'+userID+'?ts='+(new Date().getTime())).getList();
				},

				getApp: function(appId){
					return Restangular.one('app', appId).get({ts : new Date().getTime()});
				},

				saveApp: function(app){
					return Restangular.all('apps?ts='+(new Date().getTime())).post(app); //POST a new App
				},

				updateApp: function(app){
					return Restangular.one("app").customPUT(app, app._id, {ts : new Date().getTime()});
				},

				removeApp: function(appId){
					// Just ONE GET to /api/apps/123
					return Restangular.one('app', appId).remove({ts : new Date().getTime()});
				}

			}
		}

]);
