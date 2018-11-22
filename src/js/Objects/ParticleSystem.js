import * as THREE from "three";
const star = require("../../textures/star.png");

export default class ParticleSystem extends THREE.Points {
  constructor() {
    const geometry = new THREE.Geometry();

    const count = 500;
    for (let i = 0; i < count; i += 1) {
      const particle = new THREE.Vector3();
      particle.x = THREE.Math.randFloatSpread(50);
      particle.y = THREE.Math.randFloatSpread(50);
      particle.z = THREE.Math.randFloatSpread(50);
      geometry.vertices.push(particle);
    }

    const texture = new THREE.TextureLoader().load(star);
    const material = new THREE.PointsMaterial({
      size: 5,
      map: texture,
      transparent: true,
      // alphaTest's default is 0 and the particles overlap. Any value > 0
      // prevents the particles from overlapping.
      alphaTest: 0.5
    });

    super(geometry, material);
    this.position.set(-50, 50, -50);
  }
}
