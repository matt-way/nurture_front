
var scene, camera, renderer, geometry, mesh;

// generates an array of 3 vetex faces based on a width/height
function generatePolygons(width, height) {
    var options = {
    	bleed: 5,
    	cellsize: 5,
    	cellpadding: 5
    };
    var cellsX = Math.ceil((width+options.bleed*2)/options.cellsize);
    var cellsY = Math.ceil((height+options.bleed*2)/options.cellsize);

    var vertices = d3.range(cellsX*cellsY).map(function(d) {
        // figure out which cell we are in
        var col = d % cellsX;
        var row = Math.floor(d / cellsX);
        var x = Math.round(-options.bleed + col*options.cellsize + Math.random() * (options.cellsize - options.cellpadding*2) + options.cellpadding);
        var y = Math.round(-options.bleed + row*options.cellsize + Math.random() * (options.cellsize - options.cellpadding*2) + options.cellpadding);
        // return [x*cellsize, y*cellsize];
        return [x, y]; // Populate the actual background with points
    });

    return d3.geom.voronoi().triangles(vertices);
}

// builds a geometry object based on veronoi faces
function createGeometry(width, height, points) {
	var g = new THREE.Geometry();

	var faces = generatePolygons(width, height);

	// create each face
	for(var i=0; i<faces.length; i++){
		var face = faces[i];
		for(var v=2; v>=0; v--){
		//for(var v=0; v<3; v++){
			var vert = face[v];
			g.vertices.push(
				new THREE.Vector3(vert[0], vert[1], 0)
			);	
		}
	
		var normal = new THREE.Vector3( 0, 0, 1 );

		var start = 3*i;
		g.faces.push( new THREE.Face3(start, start+1, start+2, normal));
	}
	//g.mergeVertices();
	g.computeFaceNormals();

	return g;
}


function messDepth(geom) {

	var total = geom.vertices.length;
	for(var i=0; i<total; i++){
		var vert = geom.vertices[i];
		vert.z -= Math.random()*5;
	}
	geom.computeFaceNormals();
	geom.verticesNeedUpdate = true;
}

var light, light2;

// Build the scene
function buildScene() {
	scene = new THREE.Scene();

	//scene.add( new THREE.AmbientLight( 0x002000 ) );
	light = new THREE.PointLight(0xffffff, 0.2, 100);
	light.position.set(0, 0, 2);
	scene.add(light);

	light2 = new THREE.PointLight(0xffffff, 0.2, 100);
	light2.position.set(0, 0, 2);
	scene.add(light2);

	geometry = new THREE.PlaneGeometry( 200, 100, 60, 30 );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff, shading: THREE.FlatShading, overdraw: 0.5 } );
	var plane = new THREE.Mesh( geometry, material );

	messDepth(geometry);


	scene.add( plane );


	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

	/*
	meshGeometry = createGeometry(800, 450, 100);

	//messDepth(meshGeometry);


	//var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
	//var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: false});
	var material = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
	mesh = new THREE.Mesh(meshGeometry, material);

	mesh.position.x -= 400;
	mesh.position.y -= 225;
	scene.add(mesh);
	*/

	camera.position.z = 50;


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	var container = document.getElementById('art');
	container.appendChild(renderer.domElement);
}

buildScene();

var x=0;

function positionLight() {

	light.position.x = 40*Math.sin(x);
	light.position.y = 40*Math.cos(x);

	light2.position.x = -light.position.x;
	light2.position.y = -light.position.y;
	x += 0.01;
}

function render(delta) {

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;

	//light.position.x += 0.1;
	//light.position.y += 0.1;
	//light.position.z += 0.1;

	for(var v=0; v<geometry.vertices.length; v++){
		var vert = geometry.vertices[v];
		vert.z += (Math.random()*0.5) - 0.25;
	}
	geometry.verticesNeedUpdate = true;

	positionLight();
/*
	for(var v=0; v<geometry.vertices.length; v++){
		var vert = geometry.vertices[v];
		vert.z += (Math.random() * 10) - 5;
	}
	geometry.verticesNeedUpdate = true;
*/

	//camera.rotation.x += 0.01;
	//camera.updateProjectionMatrix();

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();









































