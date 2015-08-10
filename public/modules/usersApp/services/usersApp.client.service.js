'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('usersApp')
	.service('usersAppService', [ 'Restangular',
		function(Restangular) {

			return {
				getUsersApp: function(appId){
					return Restangular.all('clients/'+appId+'?ts='+(new Date().getTime())).getList();
				},
				getUserApp: function(userId){
					return Restangular.one('client',userId).get({ts : new Date().getTime()});
				},
				saveUser: function(user){
					return Restangular.all('clients?ts='+(new Date().getTime())).post(user); //POST a new App
				},

				updateUser: function(user){
					return Restangular.one("client").customPUT(user, user._id, {ts : new Date().getTime()});
				},
				removeUser: function(userId){
					return Restangular.one('client', userId).remove({ts : new Date().getTime()});
				}

			}
		}

]);
