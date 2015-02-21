var camera, scene, renderer;
var mesh;

var rot = [0,-1,0];

var shaders = {
    'vertex': ["varying vec3 vNormal;",
        "void main() {",
        "vNormal = normal;",
        "gl_Position = projectionMatrix *",
        "modelViewMatrix *",
        "vec4(position,1.0);",
        "}"].join("\n"),

    'fragment': ["varying vec3 vNormal;",
        "void main() {",
        "vec3 light = vec3(0.5,0.8,-1.0);",
        "light = normalize(light);",
        "float dProd = max(0.1, dot(vNormal, light));",
        "gl_FragColor = vec4(dProd, dProd, dProd, 1.0);",
        "}"].join("\n")
};

function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 400;

    scene = new THREE.Scene();

    var shaderMaterial = new THREE.ShaderMaterial({
        attributes:     {},
        uniforms:       {},
        vertexShader:   shaders.vertex,
        fragmentShader: shaders.fragment
    });
    var geometry = new THREE.BoxGeometry( 200, 200, 100 );

    mesh = new THREE.Mesh( geometry, shaderMaterial );
    mesh.up = new THREE.Vector3(0,0,1);
    scene.add( mesh );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    mesh.lookAt(new THREE.Vector3(
        mesh.position.x + rot[0]*Math.PI,
        mesh.position.y + rot[1]*Math.PI,
        mesh.position.z + rot[2]*Math.PI
    ));

    renderer.render( scene, camera );

}

$(function() {
    init();
    animate();


    Leap.loop(function (frame) {
        if(frame.hands.length > 0) {
            rot = frame.hands[0].palmNormal;
        }
    });
});
