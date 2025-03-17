let scene, camera, renderer, controls;
let player, weapons, bomb;

window.onload = function() {
    init();
    animate();
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    
    createMap(scene);
    player = new Player(camera);
    weapons = new Weapons(player);
    bomb = new Bomb(scene, player);
}

function animate() {
    requestAnimationFrame(animate);
    player.update();
    bomb.update();
    renderer.render(scene, camera);
}
