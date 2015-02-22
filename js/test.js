var camera, controls, scene, renderer;
var plane;
var rot = [0,-1,0];

if ( ! Detector.webgl ) {

		Detector.addGetWebGLMessage();
		document.getElementById( 'container' ).innerHTML = "";

	}

	var container, stats;

	var mesh;

	var worldWidth = 200, worldDepth = 200,
	worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2,
	data = generateHeight( worldWidth, worldDepth );

	var clock = new THREE.Clock();

	init();
	animate();

	function init() {

		container = document.getElementById( 'container' );

		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 20000 );
		camera.position.y = getY( worldHalfWidth, worldHalfDepth ) * 100 + 100;

		controls = new THREE.FirstPersonControls( camera );

		controls.movementSpeed = 1000;
		controls.lookSpeed = 0.125;
		controls.lookVertical = true;
		controls.constrainVertical = true;
		controls.verticalMin = 1.1;
		controls.verticalMax = 2.2;

		scene = new THREE.Scene();

		// sides
		//Makes dem cubes
		var light = new THREE.Color( 0xffffff );
		var shadow = new THREE.Color( 0x505050 );

		var matrix = new THREE.Matrix4();

		var pxGeometry = new THREE.PlaneGeometry( 100, 100 );
		pxGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
		pxGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
		pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1;
		pxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1;
		pxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1;
		pxGeometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
		pxGeometry.applyMatrix( matrix.makeTranslation( 50, 0, 0 ) );

		var nxGeometry = new THREE.PlaneGeometry( 100, 100 );
		nxGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
		nxGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
		nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1;
		nxGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1;
		nxGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1;
		nxGeometry.applyMatrix( matrix.makeRotationY( - Math.PI / 2 ) );
		nxGeometry.applyMatrix( matrix.makeTranslation( - 50, 0, 0 ) );

		var pyGeometry = new THREE.PlaneGeometry( 100, 100 );
		pyGeometry.faces[ 0 ].vertexColors = [ light, light, light ];
		pyGeometry.faces[ 1 ].vertexColors = [ light, light, light ];
		pyGeometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0;
		pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0;
		pyGeometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0;
		pyGeometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
		pyGeometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

		var py2Geometry = new THREE.PlaneGeometry( 100, 100 );
		py2Geometry.faces[ 0 ].vertexColors = [ light, light, light ];
		py2Geometry.faces[ 1 ].vertexColors = [ light, light, light ];
		py2Geometry.faceVertexUvs[ 0 ][ 0 ][ 1 ].y = 0;
		py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 0 ].y = 0;
		py2Geometry.faceVertexUvs[ 0 ][ 1 ][ 1 ].y = 0;
		py2Geometry.applyMatrix( matrix.makeRotationX( - Math.PI / 2 ) );
		py2Geometry.applyMatrix( matrix.makeRotationY( Math.PI / 2 ) );
		py2Geometry.applyMatrix( matrix.makeTranslation( 0, 50, 0 ) );

		var pzGeometry = new THREE.PlaneGeometry( 100, 100 );
		pzGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
		pzGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
		pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1;
		pzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1;
		pzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1;
		pzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, 50 ) );

		var nzGeometry = new THREE.PlaneGeometry( 100, 100 );
		nzGeometry.faces[ 0 ].vertexColors = [ light, shadow, light ];
		nzGeometry.faces[ 1 ].vertexColors = [ shadow, shadow, light ];
		nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 0 ].y = 1;
		nzGeometry.faceVertexUvs[ 0 ][ 0 ][ 2 ].y = 1;
		nzGeometry.faceVertexUvs[ 0 ][ 1 ][ 2 ].y = 1;
		nzGeometry.applyMatrix( matrix.makeRotationY( Math.PI ) );
		nzGeometry.applyMatrix( matrix.makeTranslation( 0, 0, - 50 ) );

		//

		var geometry = new THREE.Geometry();
		var dummy = new THREE.Mesh();

		for ( var z = 0; z < worldDepth; z ++ ) {

			for ( var x = 0; x < worldWidth; x ++ ) {

				var h = getY( x, z );

				matrix.makeTranslation(
					x * 100 - worldHalfWidth * 100,
					h * 100,
					z * 100 - worldHalfDepth * 100
				);

				var px = getY( x + 1, z );
				var nx = getY( x - 1, z );
				var pz = getY( x, z + 1 );
				var nz = getY( x, z - 1 );

				var pxpz = getY( x + 1, z + 1 );
				var nxpz = getY( x - 1, z + 1 );
				var pxnz = getY( x + 1, z - 1 );
				var nxnz = getY( x - 1, z - 1 );

				var a = nx > h || nz > h || nxnz > h ? 0 : 1;
				var b = nx > h || pz > h || nxpz > h ? 0 : 1;
				var c = px > h || pz > h || pxpz > h ? 0 : 1;
				var d = px > h || nz > h || pxnz > h ? 0 : 1;

				if ( a + c > b + d ) {

					var colors = py2Geometry.faces[ 0 ].vertexColors;
					colors[ 0 ] = b === 0 ? shadow : light;
					colors[ 1 ] = c === 0 ? shadow : light;
					colors[ 2 ] = a === 0 ? shadow : light;

					var colors = py2Geometry.faces[ 1 ].vertexColors;
					colors[ 0 ] = c === 0 ? shadow : light;
					colors[ 1 ] = d === 0 ? shadow : light;
					colors[ 2 ] = a === 0 ? shadow : light;
					
					geometry.merge( py2Geometry, matrix );

				} else {

					var colors = pyGeometry.faces[ 0 ].vertexColors;
					colors[ 0 ] = a === 0 ? shadow : light;
					colors[ 1 ] = b === 0 ? shadow : light;
					colors[ 2 ] = d === 0 ? shadow : light;

					var colors = pyGeometry.faces[ 1 ].vertexColors;
					colors[ 0 ] = b === 0 ? shadow : light;
					colors[ 1 ] = c === 0 ? shadow : light;
					colors[ 2 ] = d === 0 ? shadow : light;
					
					geometry.merge( pyGeometry, matrix );

				}

				if ( ( px != h && px != h + 1 ) || x == 0 ) {

					var colors = pxGeometry.faces[ 0 ].vertexColors;
					colors[ 0 ] = pxpz > px && x > 0 ? shadow : light;
					colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

					var colors = pxGeometry.faces[ 1 ].vertexColors;
					colors[ 2 ] = pxnz > px && x > 0 ? shadow : light;

					geometry.merge( pxGeometry, matrix );

				}

				if ( ( nx != h && nx != h + 1 ) || x == worldWidth - 1 ) {

					var colors = nxGeometry.faces[ 0 ].vertexColors;
					colors[ 0 ] = nxnz > nx && x < worldWidth - 1 ? shadow : light;
					colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

					var colors = nxGeometry.faces[ 1 ].vertexColors;
					colors[ 2 ] = nxpz > nx && x < worldWidth - 1 ? shadow : light;

					geometry.merge( nxGeometry, matrix );

				}

				if ( ( pz != h && pz != h + 1 ) || z == worldDepth - 1 ) {

					var colors = pzGeometry.faces[ 0 ].vertexColors;
					colors[ 0 ] = nxpz > pz && z < worldDepth - 1 ? shadow : light;
					colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

					var colors = pzGeometry.faces[ 1 ].vertexColors;
					colors[ 2 ] = pxpz > pz && z < worldDepth - 1 ? shadow : light;

					geometry.merge( pzGeometry, matrix );

				}

				if ( ( nz != h && nz != h + 1 ) || z == 0 ) {

					var colors = nzGeometry.faces[ 0 ].vertexColors;
					colors[ 0 ] = pxnz > nz && z > 0 ? shadow : light;
					colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

					var colors = nzGeometry.faces[ 1 ].vertexColors;
					colors[ 2 ] = nxnz > nz && z > 0 ? shadow : light;

					geometry.merge( nzGeometry, matrix );

				}

			}

		}

		var texture = THREE.ImageUtils.loadTexture( 'textures/pusheen.gif' );
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;

		var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, ambient: 0xbbbbbb, vertexColors: THREE.VertexColors } ) );
		scene.add( mesh );

		var ambientLight = new THREE.AmbientLight( 0xcccccc );
		scene.add( ambientLight );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
		directionalLight.position.set( 1, 1, 0.5 ).normalize();
		scene.add( directionalLight );

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );

		container.innerHTML = "";

		container.appendChild( renderer.domElement );


		window.addEventListener( 'resize', onWindowResize, false );

		makeFancySkyBox();

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		controls.handleResize();

	}

	function loadTexture( path, callback ) {

		var image = new Image();

		image.onload = function () { callback(); };
		image.src = path;

		return image;

	}

	function generateHeight( width, height ) {

		var data = [], perlin = new ImprovedNoise(),
		size = width * height, quality = 2, z = Math.random() * 100;

		for ( var j = 0; j < 4; j ++ ) {

			if ( j == 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0;

			for ( var i = 0; i < size; i ++ ) {

				var x = i % width, y = ( i / width ) | 0;
				data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;

			}

			quality *= 4

		}

		return data;

	}

	function getY( x, z ) {

		return ( data[ x + z * worldWidth ] * 0.2 ) | 0;

	}

	//

	function animate() {
		requestAnimationFrame( animate );
		/*
	    plane.lookAt(new THREE.Vector3(
	        plane.position.x + rot[0]*Math.PI,
	        plane.position.y + rot[1]*Math.PI,
	        plane.position.z + rot[2]*Math.PI
	    ));
		*/
		render();
			//stats.update();

	}

function render() {
		controls.update( clock.getDelta() );
		renderer.render( scene, camera );

	}

	//Makes skybox
function makeFancySkyBox(){
		var axes = new THREE.AxisHelper(100);
		scene.add(axes);
		
		var imagePrefix = "textures/dawnmountain-";
		var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
		var imageSuffix = ".png";
		var skyGeometry = new THREE.CubeGeometry(20000, 20000, 20000);	
		
		var materialArray = [];
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		scene.add( skyBox );

	}

function makePlane(){
		var shaderMaterial = new THREE.ShaderMaterial({
	        attributes:     {},
	        uniforms:       {},
	        vertexShader:   shaders.vertex,
	        fragmentShader: shaders.fragment
	    });
	    var geometry = new THREE.BoxGeometry(200, 200, 100);

	    plane = new THREE.Mesh( geometry, shaderMaterial );
	    plane.up = new THREE.Vector3(0,0,1);
	    scene.add(plane);
	}

$(function() {
    makePlane();
    animate();

    Leap.loop(function (frame) {
        if(frame.hands.length > 0) {
            rot = frame.hands[0].palmNormal;
        }
    });
});