import * as THREE from "three";

export default class TestGroupObject extends THREE.Group {
  constructor() {
    super();
    const side = 5;
    const geometry = new THREE.BoxGeometry(side, side, side);
    const material = new THREE.MeshLambertMaterial({
      color: 0x228b22 // forest green
    });

    for (let i = 0; i < 50; i += 1) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = THREE.Math.randFloatSpread(50);
      mesh.position.y = THREE.Math.randFloatSpread(50);
      mesh.position.z = THREE.Math.randFloatSpread(50);
      mesh.rotation.x = Math.random() * 360 * (Math.PI / 180);
      mesh.rotation.y = Math.random() * 360 * (Math.PI / 180);
      mesh.rotation.z = Math.random() * 360 * (Math.PI / 180);
      this.add(mesh);
    }
    this.position.set(50, 20, 50);
  }
}
