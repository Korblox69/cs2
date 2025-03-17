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

    let walls = [
        new THREE.Vector3(-5, 2.5, -5),
        new THREE.Vector3(5, 2.5, -5),
        new THREE.Vector3(-5, 2.5, 5),
        new THREE.Vector3(5, 2.5, 5)
    ];
    
    for (let pos of walls) {
        let wall = new THREE.Mesh(
            new THREE.BoxGeometry(10, 5, 1),
            new THREE.MeshStandardMaterial({ color: 0x777777 })
        );
        wall.position.copy(pos);
        scene.add(wall);
    }
}
