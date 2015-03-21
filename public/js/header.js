
(function(id){
	var contId = id;
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

		var container = document.getElementById(contId);
		container.appendChild(renderer.domElement);
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

	// run
	buildScene();
	render();

})('art');



