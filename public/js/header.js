
var scene, camera, renderer, cube;

function createGeometry(width, height, points) {
	var g = new THREE.Geometry();

	/*
	// go across the mesh
	for(var y=0; y<width; y+=0.5){
		for(var x=0; x<height; x+=0.5){

		}
	}*/

	var faces = generatePolygons(width, height);

	// create each face
	for(var i=0; i<faces.length; i++){
		var face = faces[i];
		for(var v=0; v<3; v++){
			var vert = face[v];
			g.vertices.push(
				new THREE.Vector3(vert[0], vert[1], 0)
			);	
		}
		
		var start = 3*i;
		g.faces.push( new THREE.Face3(start, start+1, start+2));
	}

	return g;
}

function generatePolygons(width, height) {
    var options = {
    	bleed: 15,
    	cellsize: 15,
    	cellpadding: 1.5
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

function buildScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var geometry = createGeometry(1600, 900, 100);

	

	//var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
	cube = new THREE.Mesh( geometry, material );

	cube.position.x -= 800;
	cube.position.y -= 450;
	scene.add( cube );

	camera.position.z = 80;


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	var container = document.getElementById('art');
	container.appendChild(renderer.domElement);
}

buildScene();

function render(delta) {

	//cube.rotation.x += 0.1;
	//cube.rotation.y += 0.1;

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();