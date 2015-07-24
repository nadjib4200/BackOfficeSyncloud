'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.toggleCollapsibleMenu = function(){
			console.log('toggleCollapsibleMenu in HeaderController')
			//angular.element('.left-side').toggleClass("collapse-left");
            //angular.element(".right-side").toggleClass("strech");

            //If window is small enough, enable sidebar push menu
	        if (angular.element(window).width() <= 992) {
	            angular.element('.row-offcanvas').toggleClass('active');
	            angular.element('.left-side').removeClass("collapse-left");
	            angular.element(".right-side").removeClass("strech");
	            angular.element('.row-offcanvas').toggleClass("relative");
	        } else {
	            //Else, enable content streching
	            angular.element('.left-side').toggleClass("collapse-left");
	            angular.element(".right-side").toggleClass("strech");
	        }
		}
	}
]);