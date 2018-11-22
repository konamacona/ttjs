import * as THREE from "three";

const vertexShader = require("../../glsl/vertexShader.glsl");
const fragmentShader = require("../../glsl/fragmentShader.glsl");

export default class TestCustomObject extends THREE.Mesh {
  constructor() {
    // create an object that uses custom shaders
    const customUniforms = {
      delta: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: customUniforms
    });

    const geometry = new THREE.SphereBufferGeometry(5, 32, 32);

    const vertexDisplacement = new Float32Array(
      geometry.attributes.position.count
    );
    for (let i = 0; i < vertexDisplacement.length; i += 1) {
      vertexDisplacement[i] = Math.sin(i);
    }

    geometry.addAttribute(
      "vertexDisplacement",
      new THREE.BufferAttribute(vertexDisplacement, 1)
    );

    super(geometry, material);
    this.position.set(5, 5, 5);

    this.delta = 0;
    this.vertexDisplacement = vertexDisplacement;
  }

  update() {
    // update an object that uses custom shaders
    this.delta += 0.1;
    this.material.uniforms.delta.value = 0.5 + Math.sin(this.delta) * 0.5;
    for (let i = 0; i < this.vertexDisplacement.length; i += 1) {
      this.vertexDisplacement[i] = 0.5 + Math.sin(i + this.delta) * 0.25;
    }
    // attribute buffers are not refreshed automatically. To update custom
    // attributes we need to set the needsUpdate flag to true
    this.geometry.attributes.vertexDisplacement.needsUpdate = true;
  }
}
