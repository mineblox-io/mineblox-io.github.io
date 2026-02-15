import * as THREE from 'three';
import * as react from 'react';
import * as reactDom from 'react-dom';
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
function animate() {
	requestAnimationFrame( animate );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
animate();
const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.Audio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'Craig_Ballie_-_Building_Us_(mp3.pm).mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
} );
function moveCamera(event: KeyboardEvent) {
	const speed = 0.1;
	if (event.key === 'w') {
		camera.position.z -= speed;
	} else if (event.key === 's') {
		camera.position.z += speed;
	} else if (event.key === 'a') {
		camera.position.x -= speed;
	} else if (event.key === 'd') {
		camera.position.x += speed;
	}
};
window.addEventListener('keydown', moveCamera);
function mobileControls() {
	let touchStartX = 0;
	let touchStartY = 0;
	const speed = 0.1;
	window.addEventListener('touchstart', (event) => {
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
	});
	window.addEventListener('touchmove', (event) => {
		const touchEndX = event.touches[0].clientX;
		const touchEndY = event.touches[0].clientY;
		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			if (deltaX > 0) {
				camera.position.x += speed; // Move right
			} else {
				camera.position.x -= speed; // Move left
			}
		} else {
			if (deltaY > 0) {
				camera.position.z += speed; // Move down
			} else {
				camera.position.z -= speed; // Move up
			}
		}
	});
}
function mobileDetection() {
	if (/Mobi|Android/i.test(navigator.userAgent)) {
		mobileControls();
	}
}
setInterval(mobileDetection, 1);
function handleResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleResize);
function buildMap() {
	const mapSize = 10;
	const tileSize = 1;
	for (let x = -mapSize / 2; x < mapSize / 2; x++) {
		for (let z = -mapSize / 2; z < mapSize / 2; z++) {
			const tileGeometry = new THREE.PlaneGeometry(tileSize, tileSize);
			const tileMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
			const tile = new THREE.Mesh(tileGeometry, tileMaterial);
			tile.rotation.x = -Math.PI / 2;
			tile.position.set(x * tileSize, 0, z * tileSize);
			scene.add(tile);
		}
	}
}
const mapButton = document.createElement('button');
mapButton.textContent = 'Build Map';
mapButton.style.position = 'absolute';
mapButton.style.top = '10px';
mapButton.style.right = '10px';
mapButton.style.padding = '10px';
document.body.appendChild(mapButton);
mapButton.addEventListener('click', buildMap);
const menu = document.createElement('div');
function buildMenu() {
	menu.style.position = 'absolute';
	menu.style.top = '10px';
	menu.style.left = '10px';
	menu.style.padding = '10px';
	menu.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	menu.style.color = 'white';
	menu.innerHTML = `
		<h3>Menu</h3>
		<p>Use WASD to move</p>
		<p>Use touch controls on mobile</p>
	`;
	document.body.appendChild(menu);
}
buildMenu();
function RandomizeMapBlocks() {
	const blocks = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) as THREE.Mesh[];
	blocks.forEach(block => {
		const randomColor = Math.random() * 0xffffff;
		(block.material as THREE.MeshBasicMaterial).color.setHex(randomColor);
	});
}
function randomizeMapBlocksHeight() {
	const blocks = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry) as THREE.Mesh[];
	blocks.forEach(block => {
		const randomHeight = Math.random() * 2 + 0.5; // Random height between 0.5 and 2.5
		block.scale.y = randomHeight;
	});
}
function HandleMenuButtons() {
	const menuButtons = document.querySelector('div');
	if (menuButtons !== null) {
		menuButtons.addEventListener('click', () => {
		menuButtons.style.display = 'none';
	});
}
}
HandleMenuButtons();
function onMenuButtonClick() {
	const menuButtonClick = document.querySelector('div');
	if (menuButtonClick !== null) {
		menuButtonClick.style.display = 'none';
	}
}