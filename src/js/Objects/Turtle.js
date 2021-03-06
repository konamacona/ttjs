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
    this.name = `turtle_${i}`;
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

  isAroundZ(zValue) {
    return (
      zValue < this.position.z + SIZE / 2 && zValue > this.position.z - SIZE / 2
    );
  }

  isAroundX(xValue, extraLeeway) {
    return (
      xValue < this.position.x + SIZE / 2 + extraLeeway &&
      xValue > this.position.x - SIZE / 2 - extraLeeway
    );
  }

  update(speed, delta) {
    this.position.z += delta * speed;
    if (this.position.z > DISSAPEAR_OFFSET) {
      this.position.x = this.getRandomX();
      this.position.z = this.getResetZ();
    }
  }
}
