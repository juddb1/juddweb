import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// global variables
var renderer;
var scene;
var camera;
var clock;
var mixer;

const cameraScale = 1.05;
const renderSize = 512;

init();
animate();

function init() {

    clock = new THREE.Clock();

    // create a render, sets the background color and the size
    var width = Math.min(window.innerWidth, renderSize)
    var height = Math.min(window.innerHeight, renderSize)

    var renderAspect = Math.min(width, height)

	renderer = new THREE.WebGLRenderer( { antialias: true} );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(renderAspect, renderAspect);
	renderer.gammaOutput = true;
	renderer.gammaFactor = 2.2;

    
	// create a camera, which defines where we're looking at.
	camera = new THREE.OrthographicCamera(-cameraScale,cameraScale,cameraScale,-cameraScale, 0.1, 1000 );
	camera.position.set(0,8,0);
	// clock

	

	// create a scene, that will hold all our elements such as objects, cameras and lights.
	scene = new THREE.Scene();

	scene.background = new THREE.Color( 0x222222 );

	// loading models

	var loader = new GLTFLoader();
	//'assets/models/Assets.glb'
	loader.load('dodecaload.glb', 
							function (gltf){
		const model = gltf.scene;
		const animations = gltf.animations;

		mixer = new THREE.AnimationMixer ( model );

		// play the first animation
		console.log( animations );

		const action = mixer.clipAction( animations[0]);
		action.play();
		scene.add( model );
	} );

	



	var dirLight = new THREE.DirectionalLight();
	dirLight.position.set( 2, 2, - 2 );
	scene.add(dirLight);

	// add the output of the renderer to the html element
	const container = document.getElementById( 'canvas' );
	container.appendChild( renderer.domElement );

	var controls = new OrbitControls( camera );
}

window.addEventListener('resize', () => {
    // update display width and height
    var width = Math.min(window.innerWidth, renderSize)
    var height = Math.min(window.innerHeight, renderSize)

    var renderAspect = Math.min(width, height)

    // update renderer
    renderer.setSize(renderAspect, renderAspect)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.render(scene, camera)
 })

// call the render function
function animate(){

	requestAnimationFrame( animate );

	const delta = clock.getDelta();

	if ( mixer ) mixer.update( delta );

	renderer.render( scene, camera );

}