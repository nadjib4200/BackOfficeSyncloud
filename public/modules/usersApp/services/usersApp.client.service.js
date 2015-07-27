'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('usersApp')
	.service('usersAppService', [ 'Restangular',
		function(Restangular) {

			return {
				getUsersApp: function(appId){
					return Restangular.all('clients/'+appId).getList();
				},
				getUserApp: function(userId){
					return Restangular.one('client',userId).get();
				},
				saveUser: function(user,appId){
					return Restangular.all('clients/'+appId).post(user); //POST a new App
				},

				updateUser: function(app){
					return Restangular.one("client").customPUT(app, app._id);
				},
				removeUser: function(userId){
					return Restangular.one('client', userId).remove();
				}

			}
		}

]);
