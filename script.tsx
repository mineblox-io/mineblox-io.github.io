import * as THREE from 'three';
import * as react from 'react';
import * as reactDom from 'react-dom';
import * as genkit from 'genkit';
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
		function genMap() {
			randomizeMapBlocksHeight();
		}
		genMap();
	}
}
async function genMobs() {
	const mobGeometry = new THREE.SphereGeometry(0.5, 32, 32);
	const mobMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	for (let i = 0; i < 5; i++) {
		const mob = new THREE.Mesh(mobGeometry, mobMaterial);
		mob.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
		scene.add(mob);
	}
}
genMobs();
function animateMobs() {
	const mobs = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) as THREE.Mesh[];
	mobs.forEach(mob => {
		mob.position.x += (Math.random() - 0.5) * 0.1;
		mob.position.z += (Math.random() - 0.5) * 0.1;
	});
}
setInterval(animateMobs, 100);
function genItems() {
	const itemGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const itemMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
	for (let i = 0; i < 5; i++) {
		const item = new THREE.Mesh(itemGeometry, itemMaterial);
		item.position.set(Math.random() * 10 - 5, 0.25, Math.random() * 10 - 5);
		scene.add(item);
	}
}
genItems();
function animateItems() {
	const items = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0x0000ff) as THREE.Mesh[];
	items.forEach(item => {
		item.position.y += Math.sin(Date.now() * 0.001) * 0.01;
	});
}
setInterval(animateItems, 100);
function genSkybox() {
	const skyboxGeometry = new THREE.BoxGeometry(100, 100, 100);
	const skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });
	const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
	scene.add(skybox);
}
genSkybox();
function genClouds() {
	const cloudGeometry = new THREE.SphereGeometry(1, 32, 32);
	const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
	for (let i = 0; i < 10; i++) {
		const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
		cloud.position.set(Math.random() * 50 - 25, Math.random() * 10 + 5, Math.random() * 50 - 25);
		scene.add(cloud);
	}
}
genClouds();
function animateClouds() {
	const clouds = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0xffffff) as THREE.Mesh[];
	clouds.forEach(cloud => {
		cloud.position.x += Math.sin(Date.now() * 0.001) * 0.01;
	});
}
setInterval(animateClouds, 100);
function genSun() {
	const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
	const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	const sun = new THREE.Mesh(sunGeometry, sunMaterial);
	sun.position.set(0, 20, -30);
	scene.add(sun);
}
genSun();
function animateSun() {
	const sun = scene.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0xffff00) as THREE.Mesh;
	if (sun) {
		sun.position.x += Math.sin(Date.now() * 0.001) * 0.01;
	}
}
setInterval(animateSun, 100);
function genMoon() {
	const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
	const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
	const moon = new THREE.Mesh(moonGeometry, moonMaterial);
	moon.position.set(10, 15, -20);
	scene.add(moon);
}
genMoon();
function animateMoon() {
	const moon = scene.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0xaaaaaa) as THREE.Mesh;
	if (moon) {
		moon.position.x += Math.sin(Date.now() * 0.001) * 0.01;
	}
}
setInterval(animateMoon, 100);
function genStars() {
	const starGeometry = new THREE.SphereGeometry(0.1, 32, 32);
	const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
	for (let i = 0; i < 100; i++) {
		const star = new THREE.Mesh(starGeometry, starMaterial);
		star.position.set(Math.random() * 100 - 50, Math.random() * 50 - 25, Math.random() * 100 - 50);
		scene.add(star);
	}
}
genStars();
function animateStars() {
	const stars = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0xffffff) as THREE.Mesh[];
	stars.forEach(star => {
		star.position.x += Math.sin(Date.now() * 0.001) * 0.01;
	});
}
setInterval(animateStars, 100);
function genLiquid() {
	const liquidGeometry = new THREE.PlaneGeometry(10, 10);
	const liquidMaterial = new THREE.MeshBasicMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.6 });
	const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
	liquid.rotation.x = -Math.PI / 2;
	liquid.position.set(0, 0.1, 0);
	scene.add(liquid);
}
genLiquid();
function animateLiquid() {
	const liquid = scene.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0x1E90FF) as THREE.Mesh;
	if (liquid) {
		liquid.position.y += Math.sin(Date.now() * 0.001) * 0.01;
	}
}
setInterval(animateLiquid, 100);
function PlayerModel() {
	const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
	const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const player = new THREE.Mesh(playerGeometry, playerMaterial);
	player.position.set(0, 1, 0);
	scene.add(player);
}
PlayerModel();
function animatePlayer() {
	const player = scene.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0x00ff00) as THREE.Mesh;
	if (player) {
		player.position.y += Math.sin(Date.now() * 0.001) * 0.01;
	}
}
setInterval(animatePlayer, 100);
function shaders() {
	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms: {
			time: { value: 0 }
		},
		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform float time;
			varying vec2 vUv;
			void main() {
				gl_FragColor = vec4(abs(sin(time + vUv.x * 3.14)), abs(sin(time + vUv.y * 3.14)), abs(sin(time)), 1.0);
			}
		`
	});
	const shaderPlaneGeometry = new THREE.PlaneGeometry(5, 5);
	const shaderPlane = new THREE.Mesh(shaderPlaneGeometry, shaderMaterial);
	shaderPlane.position.set(0, 2, -5);
	scene.add(shaderPlane);
	function animateShader() {
		shaderMaterial.uniforms.time.value += 0.01;
	}
	setInterval(animateShader, 100);
}
shaders();
function EXPERINCE() {
	const expGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
	// Create a material for the experience orbs with a bright green and yellow gradient
	const expMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
	for (let i = 0; i < 10; i++) {
		const exp = new THREE.Mesh(expGeometry, expMaterial);
		exp.position.set(Math.random() * 20 - 10, 1, Math.random() * 20 - 10);
		scene.add(exp);
	}
}
EXPERINCE();
function animateEXP() {
	const exps = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0xffff00) as THREE.Mesh[];
	// Rotate the experience orbs
	exps.forEach(exp => {
		exp.rotation.x += 0.01;
		exp.rotation.y += 0.01;
	});
	// Move the EXP orbs To Nearest Player
	const player = scene.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry && (child.material as THREE.MeshBasicMaterial).color.getHex() === 0x00ff00) as THREE.Mesh;
	if (player) {
		exps.forEach(exp => {
			const direction = new THREE.Vector3().subVectors(player.position, exp.position).normalize();
			exp.position.add(direction.multiplyScalar(0.05));
		});
	}
}
setInterval(animateEXP, 100);