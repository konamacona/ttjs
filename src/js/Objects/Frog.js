import * as THREE from "three";
import { reMap, dist } from "../Utilities";

const RADIUS = 2;
const REZ = 32;

const FLOOR = RADIUS;

const EDGE_OF_SCREEN = 12;
const MAX_X_TRAVEL = 10;

const PERIOD = 50;
const JUMP_LENGTH = PERIOD / 2;
const MAX_JUMP_HEIGHT = 10;

const BOTTOM_TOLERANCE = JUMP_LENGTH * 0.01;

console.log(BOTTOM_TOLERANCE);

export default class Frog extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry(RADIUS, REZ, REZ);
    const material = new THREE.MeshLambertMaterial({ color: 0xff5349 });
    super(geometry, material);

    this.name = "frog";

    // Used to track jump
    this.jumpProgress = 0;

    this.position.set(0, FLOOR, 75);
  }

  update(mouseX, width, speed, turtles, autoplay) {
    if (autoplay) {
      if (this.jumpProgress > 20 && this.jumpProgress < 22) {
        const nextTurtle = this.getClosestTurtle(turtles);
        console.log("chose", nextTurtle.name);
        this.position.x = nextTurtle.position.x;
      }
    } else {
      // Map the mouse to screen position
      this.position.x = mouseX / width * EDGE_OF_SCREEN * 2 - EDGE_OF_SCREEN;

      // Lock movement within acceptable range
      this.position.x = Math.min(
        MAX_X_TRAVEL,
        Math.max(-MAX_X_TRAVEL, this.position.x)
      );
    }

    this.jumpProgress += speed;

    if (Math.abs(JUMP_LENGTH - this.jumpProgress) < BOTTOM_TOLERANCE) {
      // Test for collision

      const turtle = this.getClosestTurtle(turtles);
      if (!turtle || !this.collidesWithTurtle(turtle)) {
        throw new Error(this.jumpProgress + "no collide");
      }
      console.log(this.jumpProgress, "found turtle", turtle);
    }

    if (this.jumpProgress > JUMP_LENGTH) {
      this.jumpProgress -= JUMP_LENGTH;
    }

    const radians = reMap(this.jumpProgress, 0, JUMP_LENGTH, 0, Math.PI);
    this.position.y = FLOOR + Math.sin(radians) * MAX_JUMP_HEIGHT;
  }

  getClosestTurtle(turtles) {
    const turtlesByDist = turtles.slice(0); // Clone
    turtlesByDist.sort((t1, t2) => {
      const d1 = dist(t1.position, this.position);
      const d2 = dist(t2.position, this.position);

      return d1 - d2;
    });
    return turtlesByDist[0];
  }

  collidesWithTurtle(turtle) {
    return (
      turtle.isAroundX(this.position.x, RADIUS / 2) &&
      turtle.isAroundZ(this.position.z)
    );
  }
}
