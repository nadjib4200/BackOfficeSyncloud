'use strict';

angular.module('core')
  .directive('loader', function() {
    return {
      restrict: 'A',
      templateUrl: 'modules/core/directives/loader.client.view.html',
      controller : ['$rootScope','$scope' , 'Authentication', 'Menus',
			function($rootScope, $scope, Authentication, Menu) {
				$scope.authentication = Authentication;


				$rootScope.$on("loader_show", function (event) {
					console.log('show');
					$scope.showLoader = true;
				});

				$rootScope.$on("loader_hide", function (event) {
					console.log('hide');
					$scope.showLoader = false;
				});
			}
		],
	  link: function(scope, element, attrs){
	  		//Par défaut on affiche pas le loader
			scope.showLoader = false;
	   }
	};
});