import * as THREE from "three";

export default class MainCamera extends THREE.PerspectiveCamera {
  constructor(viewportWidth, viewportHeight) {
    const fov = 75;
    const aspect = viewportWidth / viewportHeight;
    const near = 0.1;
    const far = 10000;

    super(fov, aspect, near, far);
    this.position.set(0, 10, 100);
  }
}
