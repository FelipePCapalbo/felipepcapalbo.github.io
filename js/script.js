if (document.getElementById('my-work-link')) {
  document.getElementById('my-work-link').addEventListener('click', () => {
    document.getElementById('my-work-section').scrollIntoView({behavior: "smooth"})
  })
}

// Three.js animation
function initThreeJSAnimation() {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // Set background to white to avoid issues with alpha

    // Camera
    const initialCameraZ = 15; // Initial Z position for the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = initialCameraZ;

    // Renderer
    const renderer = new THREE.WebGLRenderer(); // Removed alpha: true as we set scene background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-1'; // Ensure it's behind other content
    document.body.appendChild(renderer.domElement);

    // Mouse position variables
    let mouseX = 0;
    let mouseY = 0;
    // Scroll position variable
    let currentScrollY = window.scrollY;

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('scroll', onWindowScroll, false);

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowScroll() {
        currentScrollY = window.scrollY;
    }

    // Adjust renderer and camera on window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Cubes
    const polyhedronGeometries = [
        new THREE.TetrahedronGeometry(0.5),    // 4 faces
        new THREE.BoxGeometry(0.5, 0.5, 0.5), // 6 faces (cubo)
        new THREE.OctahedronGeometry(0.5),   // 8 faces
        new THREE.DodecahedronGeometry(0.5), // 12 faces
        new THREE.IcosahedronGeometry(0.5)   // 20 faces
    ];

    const grayscaleColors = [
        0xaaaaaa, // Light Gray
        0x888888, // Medium Gray
        0x666666, // Dark Gray
        0x444444, // Darker Gray
        0xcccccc, // Lighter Gray
        0xeeeeee  // Very Light Gray (near white)
    ];
    
    const shapes = []; // Renamed from cubes to shapes for clarity
    for (let i = 0; i < 60; i++) { // Increased number of shapes
        const geometry = polyhedronGeometries[Math.floor(Math.random() * polyhedronGeometries.length)];
        const material = new THREE.MeshPhongMaterial({
            color: grayscaleColors[Math.floor(Math.random() * grayscaleColors.length)],
            shininess: 80, // Increased shininess for better definition on grayscale
            flatShading: true // Flat shading can look nice on low-poly shapes
        });
        const shape = new THREE.Mesh(geometry, material);
        shape.position.x = (Math.random() - 0.5) * 30; // Increased spread X
        shape.position.y = (Math.random() - 0.5) * 30; // Increased spread Y
        shape.position.z = (Math.random() - 0.5) * 30 - 15; // Positioned further away and spread along Z
        shape.rotation.x = Math.random() * 2 * Math.PI;
        shape.rotation.y = Math.random() * 2 * Math.PI;
        shape.rotation.z = Math.random() * 2 * Math.PI; // Added z rotation for more variety
        scene.add(shape);
        shapes.push(shape);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Update camera position based on mouse
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;

        // Update camera Z position based on scroll (move camera "into" the scene)
        const scrollFactor = 0.01; // Adjust for sensitivity
        const targetCameraZ = initialCameraZ - currentScrollY * scrollFactor;
        camera.position.z += (targetCameraZ - camera.position.z) * 0.05; // Smooth transition
        
        camera.lookAt(scene.position);

        shapes.forEach(shape => {
            shape.rotation.x += 0.005; // Slowed down rotation a bit
            shape.rotation.y += 0.005;
            shape.rotation.z += 0.003; // Added z rotation animation
        });

        renderer.render(scene, camera);
    }

    animate();
}

// Initialize the animation when the window loads
window.addEventListener('load', initThreeJSAnimation);