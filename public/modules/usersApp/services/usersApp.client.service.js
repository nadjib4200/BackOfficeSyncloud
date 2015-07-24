'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('usersApp')
	.service('usersAppService', [ 'Restangular',
		function(Restangular) {

			return {
				getUsersApp: function(appId){
					// Just ONE GET to /apps/123/users
					return Restangular.all('apps/'+appId+'/users').getList();
				},
				getUserApp: function(userId){
					// Just ONE GET to /apps/123/users
					return Restangular.one('user/'+userId).get();
				},
				saveUser: function(user){
					return Restangular.all('auth/signup').post(user); //POST a new App
				},

				updateUser: function(app){
					return Restangular.one("user").customPUT(app, app._id);
				}/*,

				removeUser: function(appId){
					// Just ONE GET to /api/apps/123
					return Restangular.one('apps', appId).remove();
				}*/

			}
		}

]);
