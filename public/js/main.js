
var app = angular.module('nurture', [])
	// main controller
	.controller('mainCtrl', function($scope){
		$scope.header = {
			scrolled: false
		};


	})
	// alter header menu on scroll
	.directive('nScroll', function($window, $document){
		return {
			scope: { nScroll: '=' },
			link: function(scope, elem, attrs) {
				angular.element($window).bind("scroll", function() {
					var top  = $window.pageYOffset;
					scope.nScroll = top > parseInt(attrs.nScrollOffset);
					$scope.$apply();
				});
			}
		};
	});