let scene, camera, renderer, controls;
let player, weapons, bomb, ui;
let socket;

window.onload = function() {
    init();
    animate();
    connectToServer();
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
    ui = new UI();
}

function animate() {
    requestAnimationFrame(animate);
    player.update();
    bomb.update();
    renderer.render(scene, camera);
}

function connectToServer() {
    socket = new WebSocket('ws://localhost:8080');
    socket.onmessage = function(event) {
        let message = JSON.parse(event.data);
        if (message.type === 'playerUpdate') {
            // Update other players
        }
    };
}

function sendPlayerData() {
    let data = {
        type: 'playerUpdate',
        position: player.camera.position
    };
    socket.send(JSON.stringify(data));
}

// Map Generation
function createMap(scene) {
    let ground = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50),
        new THREE.MeshStandardMaterial({ color: 0x555555 })
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    let bombSite = new THREE.Mesh(
        new THREE.CircleGeometry(2, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    bombSite.position.set(0, 0.1, 5);
    bombSite.rotation.x = -Math.PI / 2;
    scene.add(bombSite);
}

// Player Class
class Player {
    constructor(camera) {
        this.camera = camera;
        this.speed = 0.1;
        this.velocity = new THREE.Vector3();
        document.addEventListener("keydown", (e) => this.move(e));
    }

    move(event) {
        if (event.key === "w") this.velocity.z = -this.speed;
        if (event.key === "s") this.velocity.z = this.speed;
        if (event.key === "a") this.velocity.x = -this.speed;
        if (event.key === "d") this.velocity.x = this.speed;
    }

    update() {
        this.camera.position.add(this.velocity);
        this.velocity.set(0, 0, 0);
        sendPlayerData();  // Send player position to server
    }
}

// Weapons Class
class Weapons {
    constructor(player) {
        this.player = player;
        this.currentWeapon = "pistol";
        this.models = {
            pistol: this.createWeapon(0x222222),
            rifle: this.createWeapon(0x333333)
        };
        document.addEventListener("keydown", (e) => {
            if (e.key === "1") this.switchWeapon("pistol");
            if (e.key === "2") this.switchWeapon("rifle");
        });
    }

    createWeapon(color) {
        let weapon = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.15, 0.7),
            new THREE.MeshStandardMaterial({ color })
        );
        return weapon;
    }

    switchWeapon(type) {
        this.currentWeapon = type;
        document.getElementById("weapon").innerText = `Weapon: ${type}`;
    }
}

// Bomb Class
class Bomb {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.planted = false;
        this.timer = 30;
        document.addEventListener("keydown", (e) => this.plant(e));
    }

    plant(event) {
        if (event.key === "e" && !this.planted) {
            this.planted = true;
            document.getElementById("bombStatus").innerText = "Bomb: Planted!";
            setTimeout(() => alert("Bomb Exploded!"), this.timer * 1000);
        }
    }

    update() {
        // Bomb logic here (multiplayer sync as needed)
    }
}

// UI Class
class UI {
    constructor() {
        this.timeLeft = 60;
        setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        this.timeLeft--;
        document.getElementById("timer").innerText = `Time: ${this.timeLeft}`;
        if (this.timeLeft <= 0) alert("Round Over!");
    }
}
