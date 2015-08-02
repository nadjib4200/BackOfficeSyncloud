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
				saveUser: function(user){
					return Restangular.all('clients').post(user); //POST a new App
				},

				updateUser: function(user){
					return Restangular.one("client").customPUT(user, user._id);
				},
				removeUser: function(userId){
					return Restangular.one('client', userId).remove();
				}

			}
		}

]);
