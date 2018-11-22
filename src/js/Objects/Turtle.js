import * as THREE from "three";

const DISSAPEAR_OFFSET = 100;
const START_OFFSET = 75;
const MAX_X_OFFSET = 10;
const SIZE = 5;

export default class Turtle extends THREE.Mesh {
  constructor(i, offset, movementBeforeReset) {
    const side = SIZE;
    const geometry = new THREE.CubeGeometry(side, side / 2, side);
    const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    super(geometry, material);
    this.offset = -offset;
    this.movementBeforeReset = -movementBeforeReset;
    // console.log("turtle created at ", START_OFFSET + i * this.offset);
    const z = START_OFFSET + i * this.offset;
    // console.log("turtle created at ", z);
    this.position.set(this.getRandomX(), 0, z);
  }

  getResetZ() {
    return this.offset + this.movementBeforeReset + DISSAPEAR_OFFSET;
  }

  getRandomX() {
    return Math.random() * 2 * MAX_X_OFFSET - MAX_X_OFFSET;
  }

  update(speed) {
    this.position.z += speed || 0.3;
    if (this.position.z > DISSAPEAR_OFFSET) {
      this.position.x = this.getRandomX();
      this.position.z = this.getResetZ();
    }
  }
}
