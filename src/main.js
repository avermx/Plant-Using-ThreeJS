import * as THREE from "three";
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// Create the scene
const scene = new THREE.Scene();

// Create a camera (PerspectiveCamera: fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// Create the renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new RGBELoader();
loader.load("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/moonlit_golf_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = texture;
  scene.environment = texture;
});

const radius = 1.3;
const segments = 64;
const orbitRadius = 4.5;
const color = [0x0077ff, 0x00ff00, 0xff0000, 0xffff00, 0x00ffff, 0xff00ff];
const textures = ['./csilla/color.png','./earth/map.jpg','./venus/map.jpg','volcanic/color.png']
const spheres = new THREE.Group();
// Create a large sphere to act as the star background
const starTextureLoader = new THREE.TextureLoader();
const starTexture = starTextureLoader.load('./stars.jpg'); // Make sure this texture exists in your project
starTexture.colorSpace = THREE.SRGBColorSpace;
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
  map: starTexture,

  side: THREE.BackSide // Render inside of sphere
});
const starSphere = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starSphere);

for (let i = 0; i < 4; i++) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  // Create a texture loader

  const angle = (i / 4) * (Math.PI * 2);
  cube.position.x = orbitRadius * Math.cos(angle);
  cube.position.z = orbitRadius * Math.sin(angle);
  spheres.add(cube);
}
spheres.rotation.x = 0.15
spheres.position.y = -0.8
scene.add(spheres);
// Create a sphere geometry and add it to the scene

// Position the camera so we can see the cube
camera.position.z = 8;

// Add OrbitControls



setInterval(()=>{
gsap.to(spheres.rotation, {
  y: `+=${Math.PI / 2}`,
  duration: 2,
  ease: "expo.inOut",
});
},2500)

let lastScrollTime = 0;
const throttleDelay = 2000; // 2 seconds in milliseconds
function handleScroll(event) {
const currentTime = Date.now();

if (currentTime - lastScrollTime >= throttleDelay) {
  // Your scroll event code here
  lastScrollTime = currentTime;
  console.log('Scroll event throttled - running once every 2 seconds');
  console.log(event.deltaY > 0 ? 'down' : 'up');
  // Update the last scroll time
}
}
window.addEventListener('scroll', handleScroll);
// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube for some basic animation


  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
