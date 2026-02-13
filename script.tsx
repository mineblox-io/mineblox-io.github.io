import * as THREE from 'three';
import * as react from 'react';
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'Craig_Ballie_-_Building_Us_(mp3.pm).mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});
const loader = new THREE.CubeTextureLoader();
loader.setPath( 'assets/textures/grass/' );
const textureCube = loader.load( [
	'px.svg', 'nx.svg', 'py.svg', 'ny.svg', 'pz.svg', 'nz.svg'
] );
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, envMap: textureCube} );
const cube = new THREE.Mesh( geometry, material );
const scene = new THREE.Scene();
scene.add(cube);
