import * as THREE from 'three';
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );
// create a global audio source
const sound = new THREE.Audio( listener );
// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'Craig_Ballie_-_Building_Us_(mp3.pm).mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});
