
var app = angular.module('nurture', [])
	// main controller
	.controller('mainCtrl', ['$scope',
	function($scope){
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
	}])
	.directive('headerArt', ['$window',
	function($window){
		return function(scope, elem, attrs){
			// scene
			var scene, renderer, camera;
			// lights
			var pointA, pointB;
			// mesh
			var geomerty, material, mesh;

			function buildScene(){
				scene = new THREE.Scene();

				// ambient light
				scene.add(new THREE.AmbientLight(0x060606));
				// point lights
				pointA = new THREE.PointLight(0xffffff, 0.25, 100);
				pointA.position.z = 2;
				scene.add(pointA);
				pointB = new THREE.PointLight(0xffffff, 0.25, 100);
				pointB.position.z = 2;
				scene.add(pointB);

				// mesh
				geometry = new THREE.PlaneGeometry(200, 100, 60, 30);
				var material = new THREE.MeshLambertMaterial({
					color: 0xffffff, 
					shading: THREE.FlatShading, 
					overdraw: 0.5
				});
				scene.add(new THREE.Mesh(geometry, material));

				// camera
				camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
				camera.position.z = 50;

				renderer = new THREE.WebGLRenderer();
				renderer.setSize(window.innerWidth, window.innerHeight);

				//var container = document.getElementById(contId);
				elem[0].appendChild(renderer.domElement);
			}

			var lightMod = 0;

			function animateLights(){
				pointA.position.x = 40*Math.sin(lightMod);
				pointA.position.y = 40*Math.cos(lightMod);

				pointB.position.x = -pointA.position.x;
				pointB.position.y = -pointA.position.y;
				lightMod += 0.01;
			}

			function animateMesh(){
				// go through each vert and modify
				for(var v=0; v<geometry.vertices.length; v++){
					var vert = geometry.vertices[v];
					vert.z += (Math.random() * 0.5) - 0.25;
				}
				geometry.computeFaceNormals();
				geometry.verticesNeedUpdate = true;
			}

			function render(){
				animateLights();
				animateMesh();

				requestAnimationFrame(render);      
				renderer.render(scene, camera);
			}

			angular.element($window).bind('resize', function(){
				renderer.setSize(window.innerWidth, window.innerHeight);
			});

			// run
			buildScene();
			render();
		};
	}])
	.directive('backImg', [
	function(){
		return function(scope, element, attrs){
			var url = 'url(' + attrs.backImg + ')';
			if(attrs.backOverlay){
				url = 'url(' + attrs.backOverlay + '), ' + url;
			}
			element.css({
				'background-image': url          
			});
		};
	}])
	// alter header menu on scroll
	.directive('nScroll', ['$window', '$document', '$timeout',
	function($window, $document, $timeout){
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
	}])
	/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	* Anchor Smooth Scroll - Smooth scroll to the given anchor on click
	*   adapted from this stackoverflow answer: http://stackoverflow.com/a/21918502/257494
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
	.directive('anchorSmoothScroll', ['$location',
	function($location) {
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
						//$location.hash($scope.anchorSmoothScroll);
	 
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
	}]);