'use strict';

angular.module('core')
  .directive('sidemenu', function() {
    return {
      restrict: 'A',
      templateUrl: 'modules/core/directives/sidemenu.client.view.html',
      controller : ['$scope', 'Authentication', 'Menus',
			function($scope, Authentication, Menus) {
				$scope.authentication = Authentication;
			}
		],
	  link: function(scope, element, attrs){
	   		console.log('sidemenu directive');

	   		scope.$on('toggleCollapsibleMenu', function(){
	   			angular.element('.left-side').toggleClass("collapse-left");
            	angular.element(".right-side").toggleClass("strech");
	   		})
	   }
	};
});