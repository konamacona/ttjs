import * as THREE from "three";
// import * as checkerboard from "../../textures/checkerboard.jpg";
import * as water from "../../textures/water.jpg";

const HUNDREDS_WIDE = 16;
const HUNDREDS_LONG = 8;
const REPEAT_MULT = 1;

export default class Floor extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.PlaneGeometry(
      HUNDREDS_WIDE * 100,
      HUNDREDS_LONG * 100,
      1,
      1
    );
    const texture = new THREE.TextureLoader().load(water);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(
      HUNDREDS_WIDE * REPEAT_MULT,
      HUNDREDS_LONG * REPEAT_MULT
    );
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: texture
    });

    super(geometry, material);
    this.name = "floor";

    this.position.z = 0;
    this.position.y = -0.5;
    this.rotation.x = Math.PI / 2;
  }

  update(speed, delta) {
    this.position.z += delta * speed;

    // TODO: Wander in the x axis to create moving water effect

    if (this.position.z > 100) {
      this.position.z = 0;
    }
  }
}
