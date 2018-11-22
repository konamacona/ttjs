import * as THREE from "three";

export default class MainRenderer extends THREE.WebGLRenderer {
  constructor(viewportWidth, viewportHeight) {
    super({ antialias: true });
    this.setClearColor(0x222222); // it's a dark gray
    // this.setClearColor(0xd3d3d3);  // it's a light gray
    this.setPixelRatio(window.devicePixelRatio || 1);
    this.setSize(viewportWidth, viewportHeight);
    this.shadowMap.enabled = true;
  }
}
