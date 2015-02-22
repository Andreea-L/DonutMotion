var camera, controls, scene, renderer;
var plane;
var rot = [0,-1,0];
var collidableMeshes = [];
var keyStates = {};
var alive = true;

if ( ! Detector.webgl ) {

		Detector.addGetWebGLMessage();
		document.getElementById( 'container' ).innerHTML = "";

	}

	var fogExp2 = true;

	var container, stats;

	var mesh, mat;

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
        camera.up = new THREE.Vector3(0,1,0);

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0xffffff, 0.0001 );

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

    var texture = THREE.ImageUtils.loadTexture( 'textures/money.jpg' );

    // var material1 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('textures/red.jpg') } );
    // var material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('textures/snow.jpg') } );

    // var materials = [material2, material1, material1, material1, material1, material1];

    //var meshFaceMaterial = new THREE.MeshFaceMaterial( materials );


    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;


    var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { map: texture, ambient: 0xbbbbbb, vertexColors: THREE.VertexColors } ) );
    scene.add( mesh );
    //console.log(mesh);
    collidableMeshes.push(mesh);

  //   var lastz = 0, lasty = 0, lastx = 0;

  //   for (var i = 0; i < 20; i++) {
  //   	var torusRadius = Math.floor(Math.random()*(900-400+1)+400);
  //   	var torusTube = Math.floor(Math.random()*(200-60+1)+60);
		// var torusRadSegments = Math.floor(Math.random()*(16-8+1)+8);
		// var torusTubSegments = Math.floor(Math.random()*(120-6+1)+6);
		// var torusGeometry = new THREE.TorusGeometry( torusRadius, torusTube, torusRadSegments, torusTubSegments );
		// torus = new THREE.Mesh( torusGeometry, new THREE.MeshLambertMaterial( { ambient: 0xff3333, color:0xff0000 , vertexColors: THREE.VertexColors } ) );
		// torus.up = new THREE.Vector3(0,0,1);
		// torus.position.z += lastz/1.5+Math.pow(-1,Math.floor(Math.random()*10+1))*Math.floor(Math.random()*(4000-2000+1)+2000);
		// torus.position.y += lasty/1.5+Math.pow(-1,Math.floor(Math.random()*10+1))*Math.floor(Math.random()*(3000-1500+1)+1500);
		// torus.position.x += lastx/1.5+Math.pow(-1,Math.floor(Math.random()*10+1))*Math.floor(Math.random()*(4000-2000+1)+2000);;
		// torus.rotation.y += Math.pow(-1,Math.floor(Math.random()*10+1))*Math.PI/Math.floor(Math.random()*(16-2+1)+2);
		// scene.add(torus);

		// lastz = torus.position.z;
		// lasty = torus.position.y;
		// lastx = torus.position.x;

    	
  //   };

    //BIG THORUS
    var torusGeometry = new THREE.TorusGeometry( 850, 110, 16, 100 );
    torus = new THREE.Mesh( torusGeometry, new THREE.MeshLambertMaterial( { ambient: 0xff3333, color:0xff0000 , vertexColors: THREE.VertexColors } ) );
    torus.up = new THREE.Vector3(0,0,1);
    torus.position.z += 4000;
    torus.position.y += 2500;
    scene.add(torus);

    var torus2Geometry = new THREE.TorusGeometry( 750, 60, 16, 100 );
    torus2 = new THREE.Mesh( torus2Geometry, new THREE.MeshLambertMaterial( { ambient: 0x3333ff, color:0x0000ff , vertexColors: THREE.VertexColors } ) );
    torus2.up = new THREE.Vector3(0,0,1);
    torus2.position.z -= 2000;
    torus2.position.y += 3500;
    scene.add(torus2);

    var torus3Geometry = new THREE.TorusGeometry( 750, 150, 16, 100 );
    torus3 = new THREE.Mesh( torus3Geometry, new THREE.MeshLambertMaterial( { ambient: 0x33ff33, color:0x00ff00 , vertexColors: THREE.VertexColors } ) );
    torus3.up = new THREE.Vector3(0,0,1);
    torus3.position.z -= 5500;
    torus3.position.x -= 2000;
    torus3.rotation.y -= Math.PI/4;
    torus3.position.y += 5000;
    scene.add(torus3);

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
        size = width * height, quality = 2, z = Math.random() * 1;

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

var cameraZoom = 500;
var speed = 25;

function getY( x, z ) {

    return ( data[ x + z * worldWidth ] * 0.2 ) | 0;

}

//

var planeZAngle = 0;

function animate() {
    requestAnimationFrame( animate );

    if(keyStates.down){ rot[2] -= 0.03; }
    if(keyStates.up){ rot[2] += 0.03; }
    if(keyStates.right){ rot[0] -= 0.03; }
    if(keyStates.left){ rot[0] += 0.03; }
    if(keyStates.r && speed < 50){ speed += 0.1; }
    if(keyStates.f && speed > 0){ speed -= 0.2; }

    var falling = (speed < 15) ? ( (15-speed) ) : 0;

    if(plane){
        plane.position.x += Math.cos(planeZAngle - Math.PI/2)*speed;
        plane.position.z += Math.sin(planeZAngle - Math.PI/2)*speed;
        plane.position.y += -rot[2]*2*speed - falling;

        var rotationNormal = new THREE.Vector3(rot[0],rot[1],rot[2]);
        var axis = new THREE.Vector3( 0, 1, 0 );
        rotationNormal.applyAxisAngle( axis, -planeZAngle );
        rotationNormal.add(plane.position);

        planeZAngle -= rot[0]*0.05;

        plane.lookAt(rotationNormal);
        plane.rotateZ(planeZAngle);

        if(alive){
            camera.lookAt(plane.position);

            var direction = new THREE.Vector3(0, -1, 0);
            var axis = new THREE.Vector3( -1, 0, 0 );
            direction.applyAxisAngle( axis, Math.PI / 2 );
            var axis = new THREE.Vector3( 0, 1, 0 );
            direction.applyAxisAngle( axis, -planeZAngle );

            var cameraPosition = direction.multiplyScalar(cameraZoom).add(plane.position);
            camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
            checkCollision();
        }
    }

    render();

}

function render() {
    //controls.update( clock.getDelta() );
    renderer.render( scene, camera );

}

//Makes skybox
function makeFancySkyBox(){

    var imagePrefix = "textures/spires_";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";
    var skyGeometry = new THREE.CubeGeometry( 20000, 20000, 20000);

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
    var geometry = new THREE.CylinderGeometry(10, 20, 175, 32);
    plane = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial(
        { map: THREE.ImageUtils.loadTexture( 'textures/JP-Morgan-Logo1.jpg' ),
            ambient: 0x555555, //color:0x77ff77 ,
            vertexColors: THREE.VertexColors } ) );
    plane.up = new THREE.Vector3(0,0,1);

    var wingsGeometry = new THREE.BoxGeometry(300, 30, 5);
    wings = new THREE.Mesh( wingsGeometry, new THREE.MeshLambertMaterial( { ambient: 0xff9933, color:0xff6600 , vertexColors: THREE.VertexColors } ) );
    wings.up = new THREE.Vector3(0,0,1);
    wings.position.z += 10;
    wings.position.y -= 20;

    var rearGeometry = new THREE.BoxGeometry(80, 20, 4);
    rear = new THREE.Mesh( rearGeometry, new THREE.MeshLambertMaterial( { ambient: 0xff9933, color:0xff6600 , vertexColors: THREE.VertexColors } ) );
    rear.up = new THREE.Vector3(0,0,1);
    rear.position.z -= 8;
    rear.position.y += 75;

    plane.add(wings);
    plane.add(rear);
    scene.add(plane);
    plane.position.y = 1000;
}

function checkCollision(){
	var x = Math.round(plane.position.x/100)+worldHalfWidth;
	var z = Math.round(plane.position.z/100)+worldHalfWidth;
	if(getY(x,z) >= plane.position.y/100){
		console.log("you exlode");
		if(plane)
			makeBoom();
			//stopTheme();
			$( "#hidden-button" ).trigger( "click" );
	}
}

function makeBoom(){
    var mySound = new buzz.sound("sounds/boom.ogg", {
        autoplay: true,
        loop: false
    });
    alive = false
    scene.remove(plane);
}


function onKeyDown ( event ) {

    switch ( event.keyCode ) {
        case 38: /*up*/
        case 87: /*W*/ keyStates.up = true; break;

        case 37: /*left*/
        case 65: /*A*/ keyStates.left = true; break;

        case 40: /*down*/
        case 83: /*S*/ keyStates.down = true; break;

        case 39: /*right*/
        case 68: /*D*/ keyStates.right = true; break;

        case 82: /*R*/ keyStates.r = true; break;
        case 70: /*F*/ keyStates.f = true; break;

    }
}

function onKeyUp ( event ) {

    switch( event.keyCode ) {

        case 38: /*up*/
        case 87: /*W*/ keyStates.up = false; break;

        case 37: /*left*/
        case 65: /*A*/ keyStates.left= false; break;

        case 40: /*down*/
        case 83: /*S*/ keyStates.down = false; break;

        case 39: /*right*/
        case 68: /*D*/ keyStates.right = false; break;

        case 82: /*R*/ keyStates.r = false; break;
        case 70: /*F*/ keyStates.f = false; break;

    }

}

function bind( scope, fn ) {

    return function () {

        fn.apply( scope, arguments );

    };

}

$(function() {
    makePlane();

    window.addEventListener( 'keydown', bind( this, onKeyDown ), false );
    window.addEventListener( 'keyup', bind( this, onKeyUp ), false );

    Leap.loop(function (frame) {
        if(frame.hands.length > 0) {
            rot = frame.hands[0].palmNormal;
        }
    });
});