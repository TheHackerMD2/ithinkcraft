const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);

// Textures
const loader = new THREE.TextureLoader();
const grassTexture = loader.load('https://threejs.org/examples/textures/grasslight-big.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(4, 4);

// Create terrain
let terrain;
function createTerrain() {
    const terrainGeometry = new THREE.PlaneGeometry(20, 20, 10, 10);
    const terrainMaterial = new THREE.MeshBasicMaterial({ map: grassTexture, side: THREE.DoubleSide });
    terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.rotation.x = - Math.PI / 2;
    scene.add(terrain);
}

// Create a basic tree model
function createTree() {
    const tree = new THREE.Group();

    // Create the trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.5;
    tree.add(trunk);

    // Create the foliage
    const foliageGeometry = new THREE.SphereGeometry(0.5);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 1.25;
    tree.add(foliage);

    return tree;
}

// Generate trees
let trees = [];
function createTrees() {
    trees.forEach(tree => scene.remove(tree));
    trees = [];
    for (let i = 0; i < 20; i++) {
        const tree = createTree();
        tree.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10);
        trees.push(tree);
        scene.add(tree);
    }
}

camera.position.set(0, 1.5, 5);
camera.lookAt(0, 0, 0);

const controls = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            controls.forward = true;
            break;
        case 'a':
            controls.left = true;
            break;
        case 's':
            controls.backward = true;
            break;
        case 'd':
            controls.right = true;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            controls.forward = false;
            break;
        case 'a':
            controls.left = false;
            break;
        case 's':
            controls.backward = false;
            break;
        case 'd':
            controls.right = false;
            break;
    }
});

function moveCamera() {
    if (controls.forward) camera.position.z -= 0.1;
    if (controls.backward) camera.position.z += 0.1;
    if (controls.left) camera.position.x -= 0.1;
    if (controls.right) camera.position.x += 0.1;
}

function animate() {
    requestAnimationFrame(animate);
    moveCamera();
    renderer.render(scene, camera);
}

document.getElementById('createWorld').addEventListener('click', () => {
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    createTerrain();
    createTrees();
    animate();
});

document.getElementById('deleteWorld').addEventListener('click', () => {
    if (terrain) scene.remove(terrain);
    trees.forEach(tree => scene.remove(tree));
    document.getElementById('titleScreen').style.display = 'flex';
    document.getElementById('gameCanvas').style.display = 'none';
});

animate();
