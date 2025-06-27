import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
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

const radius = 1.3;
const segments = 64;
const orbitRadius = 4.5;
const color = [0x0077ff, 0x00ff00, 0xff0000, 0xffff00, 0x00ffff, 0xff00ff];
const spheres = new THREE.Group();



for (let i = 0; i < 4; i++) {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshBasicMaterial({ color: color[i] });
  const cube = new THREE.Mesh(geometry, material);
  
  const angle = (i / 4) * (Math.PI * 2);
  cube.position.x = orbitRadius * Math.cos(angle);
  cube.position.z = orbitRadius * Math.sin(angle);
  spheres.add(cube);
}
spheres.rotation.x = 0.26
scene.add(spheres);
// Create a sphere geometry and add it to the scene

// Position the camera so we can see the cube
camera.position.z = 8;

// Add OrbitControls

const controls = new OrbitControls(camera, renderer.domElement);


setInterval(()=>{
gsap.to(spheres.rotation, {
  y: `+=${Math.PI / 2}`,
  duration: 2,
  ease: "expo.inOut",
});
},2000)


// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update()
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
