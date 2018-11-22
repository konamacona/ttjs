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

const MAX_X_SPEED = 1;

export default class Frog extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry(RADIUS, REZ, REZ);
    const material = new THREE.MeshLambertMaterial({ color: 0xff5349 });
    super(geometry, material);

    this.name = "frog";

    // Used to track jump
    this.jumpProgress = 0;

    this.position.set(0, FLOOR, 75);

    this.score = 0;
  }

  update(mouseX, width, speed, delta, turtles, autoplay) {
    if (autoplay) {
      this.doAutoPlay(turtles);
    } else {
      this.doMouseMove(mouseX, width);
    }

    this.jumpProgress += delta * speed;

    if (this.jumpProgress > JUMP_LENGTH) {
      this.detectCollision(turtles);
      this.jumpProgress -= JUMP_LENGTH;
    }

    this.doBounce();
  }

  doAutoPlay(turtles) {
    if (this.jumpProgress > 20 && this.jumpProgress < 22) {
      const nextTurtle = this.getClosestTurtle(turtles);
      this.position.x = nextTurtle.position.x;
    }
  }

  doMouseMove(mouseX, width) {
    if (!mouseX) {
      return;
    }

    // Mouse move with lerp
    // Map the mouse to screen position
    let target = mouseX / width * EDGE_OF_SCREEN * 2 - EDGE_OF_SCREEN;

    // Lock the target within acceptable range
    target = Math.min(MAX_X_TRAVEL, Math.max(-MAX_X_TRAVEL, target));

    const distance = this.position.x - target;
    if (Math.abs(distance) < MAX_X_SPEED) {
      this.position.x = target;
    } else if (distance < 0) {
      this.position.x += MAX_X_SPEED;
    } else if (distance > 0) {
      this.position.x -= MAX_X_SPEED;
    }
  }

  detectCollision(turtles) {
    const turtle = this.getClosestTurtle(turtles);
    if (!turtle || !this.collidesWithTurtle(turtle)) {
      throw new Error(this.jumpProgress + "no collide");
    }
    this.score += 1;
    console.log(
      `Bounce ${this.score}, Jump Progress ${this.jumpProgress}, Hit turtle ${
        turtle.name
      }, turtle z: ${turtle.position.z}`
    );
  }

  doBounce() {
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
    const distance = dist(turtle.position, this.position);
    console.log("distance", distance);
    return distance < RADIUS + 2;
  }
}
