
var app = angular.module('nurture', [])
	// main controller
	.controller('mainCtrl', function($scope, $location, $anchorScroll){
		$scope.header = {
			scrolled: false
		};

		$scope.articles = [
			{ 
				title: 'The Future of AI Looks Nothing Like Software Development',
				subtitle: '...as you know it.',
				background: 'http://i.imgur.com/t5uue.jpg',
				url: 'https://medium.com/@matt__way/the-future-of-ai-looks-nothing-like-software-development-as-you-know-it-f7d6358c864b'
			},
			{
				title: 'What you don’t understand about the coming robot revolution',
				subtitle: 'It\'s Yours',
				background: 'https://d262ilb51hltx0.cloudfront.net/max/1800/1*l1hKwnWBy-fbSSHcZiDuFw.png',
				url: 'https://medium.com/@matt__way/what-you-dont-understand-about-the-coming-robot-revolution-9d5b6a4f75e1'
			},
			{
				title: 'Building Conscious Machines',
				subtitle: 'The Hard Problem Delusion',
				background: 'https://s3.amazonaws.com/compressionaddict/mind_games.jpg',
				url: 'http://www.compressionaddict.com/posts/mind/building-conscious-machines-the-hard-problem-delusion'
			}
		];

		$scope.scrollTo = function(id) {
			$location.hash(id);
			$anchorScroll();
		};
	})
	.directive('backImg', function(){
	    return function(scope, element, attrs){
	        var url = 'url(' + attrs.backImg + ')';
	        if(attrs.backOverlay){
	        	url = 'url(' + attrs.backOverlay + '), ' + url;
	        }
	        element.css({
	        	'background-image': url          
	        });
	    };
	})
	// alter header menu on scroll
	.directive('nScroll', function($window, $document, $timeout){
		return {
			scope: { nScroll: '=' },
			link: function(scope, elem, attrs) {

				function handleScroll() {
					var top  = $window.pageYOffset;
					scope.nScroll = top > parseInt(attrs.nScrollOffset);
					scope.$apply();
				}

				angular.element($window).bind("scroll", function() {
					handleScroll();
				});

				// run on load
				$timeout(handleScroll);
			}
		};
	})
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* Anchor Smooth Scroll - Smooth scroll to the given anchor on click
	*   adapted from this stackoverflow answer: http://stackoverflow.com/a/21918502/257494
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	.directive('anchorSmoothScroll', function($location) {
	    'use strict';
	 
	    return {
	        scope: {
	            'anchorSmoothScroll': '@'
	        },	 
	        link: function($scope, $element, $attrs) {
	 
	            initialize();

	            var offset = -50;	            
	    
	            /* initialize -
	            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	            function initialize() {
	                createEventListeners();
	            }
	 
	            /* createEventListeners -
	            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	            function createEventListeners() {
	                // listen for a click
	                $element.on('click', function() {
	                    // set the hash like a normal anchor scroll
	                    $location.hash($scope.anchorSmoothScroll);
	 
	                    // smooth scroll to the passed in element
	                    scrollTo($scope.anchorSmoothScroll);
	                });
	            }
	 
	            /* scrollTo -
	            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	            function scrollTo(eID) {
	 
	                // This scrolling function 
	                // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
	                
	                var i;
	                var startY = currentYPosition();
	                var stopY = Math.max(0, elmYPosition(eID) + offset);
	                var distance = stopY > startY ? stopY - startY : startY - stopY;
	                if (distance < 100) {
	                    scrollTo(0, stopY); return;
	                }
	                var speed = Math.round(distance / 100);
	                speed = Math.min(speed, 25);	                
	                var step = Math.round(distance / 25);
	                var leapY = stopY > startY ? startY + step : startY - step;
	                var timer = 0;
	                if (stopY > startY) {
	                    for (i = startY; i < stopY; i += step) {
	                        setTimeout('window.scrollTo(0, '+leapY+')', timer * speed);
	                        leapY += step; if (leapY > stopY) leapY = stopY; timer++;
	                    } return;
	                }
	                for (i = startY; i > stopY; i -= step) {
	                    setTimeout('window.scrollTo(0, '+leapY+')', timer * speed);
	                    leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
	                }
	            }
	            
	            /* currentYPosition -
	            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	            function currentYPosition() {
	                // Firefox, Chrome, Opera, Safari
	                if (window.pageYOffset) {
	                    return window.pageYOffset;
	                }
	                // Internet Explorer 6 - standards mode
	                if (document.documentElement && document.documentElement.scrollTop) {
	                    return document.documentElement.scrollTop;
	                }
	                // Internet Explorer 6, 7 and 8
	                if (document.body.scrollTop) {
	                    return document.body.scrollTop;
	                }
	                return 0;
	            }
	 
	            /* scrollTo -
	            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	            function elmYPosition(eID) {
	                var elm = document.getElementById(eID);
	                var y = elm.offsetTop;
	                var node = elm;
	                while (node.offsetParent && node.offsetParent != document.body) {
	                    node = node.offsetParent;
	                    y += node.offsetTop;
	                } return y;
	            }
	        }
	    };
	});;