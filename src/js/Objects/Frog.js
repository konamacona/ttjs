import * as THREE from "three";
import { reMap } from "../Utilities";

const RADIUS = 2;
const REZ = 32;

const FLOOR = RADIUS + 2.5;

const EDGE_OF_SCREEN = 24;
const MAX_X_TRAVEL = 15;

const PERIOD = 50;
const JUMP_LENGTH = PERIOD / 2;
const MAX_JUMP_HEIGHT = 10;

export default class Frog extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry(RADIUS, REZ, REZ);
    const material = new THREE.MeshLambertMaterial({ color: 0xff5349 });
    super(geometry, material);

    // Used to track jump
    this.jumpProgress = 0;

    this.position.set(0, FLOOR, 80);
  }

  update(mouseX, width, speed) {
    // console.log(mouseX);

    // Map the mouse to screen position
    this.position.x = mouseX / width * EDGE_OF_SCREEN * 2 - EDGE_OF_SCREEN;

    // Lock movement within acceptable range
    this.position.x = Math.min(
      MAX_X_TRAVEL,
      Math.max(-MAX_X_TRAVEL, this.position.x)
    );

    // TODO: Setup bounce
    this.jumpProgress += speed;
    if (this.jumpProgress > JUMP_LENGTH) {
      this.jumpProgress -= JUMP_LENGTH;
    }
    const radians = reMap(this.jumpProgress, 0, JUMP_LENGTH, 0, Math.PI);
    this.position.y = FLOOR + Math.sin(radians) * MAX_JUMP_HEIGHT;
  }
}
