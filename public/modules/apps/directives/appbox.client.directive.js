'use strict';

angular.module('apps')
  .directive('appbox', function() {
    return {
      restrict: 'A',
      require :"ngModel",
      templateUrl: 'modules/apps/directives/appbox.client.view.html',
      controller : ['$scope', 'Authentication', 'Menus',
			function($scope, Authentication, Menus) {
				$scope.authentication = Authentication;
			}
		],

	   link: function(scope, element, attrs, ngModel){



	   		//récupère la coulor via l'attribu color
	   		scope.bgColor = attrs.color;

	   		ngModel.$render = function(){
	   			//on récupère le model
	   			scope.project = ngModel.$viewValue;
	   		}
	   }
	};
});
