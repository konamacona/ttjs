require("../css/index.scss");

import * as THREE from "three";
// TODO: OrbitControls import three.js on its own, so the webpack bundle includes three.js twice!
import OrbitControls from "orbit-controls-es6";
import * as Detector from "../js/vendor/Detector";
import * as DAT from "../js/vendor/dat.gui.min";

import MainCamera from "./Cameras/MainCamera";
import MainRenderer from "./Renderers/MainRenderer";
import Floor from "./Objects/Floor";
import Turtle from "./Objects/Turtle";
import Frog from "./Objects/Frog";
import TestCustomObject from "./Objects/TestCustomObject";

require("../sass/home.sass");

class Application {
  constructor(opts = {}) {
    this.width = Math.min(window.innerWidth, 400);
    this.height = Math.min(window.innerHeight, 600);

    this.runSpeed = 0.5;

    if (opts.container) {
      this.container = opts.container;
    } else {
      const div = Application.createContainer();
      document.body.appendChild(div);
      this.container = div;
    }

    if (Detector.webgl) {
      this.firstTimeInit();
      this.resetGame();
      this.render();
    } else {
      // TODO: style warning message
      console.log("WebGL NOT supported in your browser!");
      const warning = Detector.getWebGLErrorMessage();
      this.container.appendChild(warning);
    }
  }

  firstTimeInit() {
    this.autoplay = false;
    this.ignoreFailure = false;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.setupRenderer();
    this.setupCamera();
    this.setupHelpers();
    // this.setupControls();
    this.setupGUI();

    this.cursorX = 0;
    document.onmousemove = e => {
      e.preventDefault();
      this.cursorX = e.pageX;
      return false;
    };
    document.addEventListener("touchstart", e => this.onTouch(e));
    document.addEventListener("touchmove", e => this.onTouch(e));
  }

  onTouch(event) {
    console.log(event);
    event.preventDefault();
    this.cursorX = event.changedTouches[0].clientX; // / window.innerWidth * 2 - 1;
    return false;
  }

  resetGame() {
    this.pause = false;

    // Remove any existing objects from the scene
    this.clearScene();

    this.setupLights();

    this.floor = new Floor();
    this.scene.add(this.floor);

    this.frog = new Frog();
    this.scene.add(this.frog);

    this.turtles = this.setUpTurtles();
    this.turtles.forEach(t => this.scene.add(t));
  }

  clearScene() {
    while (this.scene.children.length) {
      this.scene.remove(this.scene.children[0]);
    }
  }

  setUpTurtles() {
    const turtles = [];
    const NUM_TURTLES = 15;
    const OFFSET_PER_TURTLE = 25;
    for (let i = 0; i < NUM_TURTLES; i++) {
      turtles.push(
        new Turtle(i, OFFSET_PER_TURTLE, (NUM_TURTLES - 1) * OFFSET_PER_TURTLE)
      );
    }
    return turtles;
  }

  render() {
    if (this.controls) {
      this.controls.update();
    }

    if (!this.pause) {
      this.updateGameState();
    }

    this.renderer.render(this.scene, this.camera);

    // when render is invoked via requestAnimationFrame(this.render) there is
    // no 'this', so either we bind it explicitly or use an es6 arrow function.
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(() => this.render());
  }

  updateGameState() {
    this.runSpeed += 0.0001;
    this.floor.update(this.runSpeed);
    this.turtles.forEach(t => t.update(this.runSpeed));

    try {
      this.frog.update(
        this.cursorX,
        this.width,
        this.runSpeed,
        this.turtles,
        this.autoplay
      );
    } catch (e) {
      if (!this.ignoreFailure) {
        this.pause = true;
        console.error(e);
        alert("game over click restart in the top right to reset");
      }
    }
  }

  static createContainer() {
    const div = document.createElement("div");
    div.setAttribute("id", "canvas-container");
    div.setAttribute("class", "container");
    // div.setAttribute('width', window.innerWidth);
    // div.setAttribute('height', window.innerHeight);
    return div;
  }

  setupRenderer() {
    this.renderer = new MainRenderer(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    this.camera = new MainCamera(this.width, this.height);
    this.camera.lookAt(this.scene.position);
  }

  setupLights() {
    // // directional light
    // this.dirLight = new THREE.DirectionalLight(0x4682b4, 1); // steelblue
    // this.dirLight.position.set(120, 30, -200);
    // this.dirLight.castShadow = true;
    // this.dirLight.shadow.camera.near = 10;
    // this.scene.add(this.dirLight);

    // // spotlight
    // this.spotLight = new THREE.SpotLight(0xffaa55);
    // this.spotLight.position.set(120, 30, 0);
    // this.spotLight.castShadow = true;
    // this.dirLight.shadow.camera.near = 10;
    // this.scene.add(this.spotLight);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffaa55);
    this.scene.add(ambientLight);
  }

  setupHelpers() {
    // floor grid helper
    // const gridHelper = new THREE.GridHelper(200, 16);
    // this.scene.add(gridHelper);
    // // XYZ axes helper (XYZ axes are RGB colors, respectively)
    // const axisHelper = new THREE.AxisHelper(75);
    // this.scene.add(axisHelper);
    // // directional light helper + shadow camera helper
    // const dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight, 10);
    // this.scene.add(dirLightHelper);
    // const dirLightCameraHelper = new THREE.CameraHelper(
    //   this.dirLight.shadow.camera
    // );
    // this.scene.add(dirLightCameraHelper);
    // // spot light helper + shadow camera helper
    // const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.scene.add(spotLightHelper);
    // const spotLightCameraHelper = new THREE.CameraHelper(
    //   this.spotLight.shadow.camera
    // );
    // this.scene.add(spotLightCameraHelper);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = true;
    this.controls.maxDistance = 1500;
    this.controls.minDistance = 0;
    this.controls.autoRotate = false;
  }

  setupGUI() {
    const gui = new DAT.GUI();
    // gui
    //   .add(this.camera.position, "x")
    //   .name("Camera X")
    //   .min(0)
    //   .max(100);
    // gui
    //   .add(this.camera.position, "y")
    //   .name("Camera Y")
    //   .min(0)
    //   .max(100);
    // gui
    //   .add(this.camera.position, "z")
    //   .name("Camera Z")
    //   .min(0)
    //   .max(100);

    gui
      .add(this, "runSpeed")
      .name("Speed")
      .min(0)
      .max(4)
      .listen();

    gui.add(this, "autoplay").name("Autoplay");
    gui.add(this, "ignoreFailure").name("Don't Die");

    gui.add(this, "resetGame").name("Restart");
    gui.add(this, "setupControls").name("Add Orbital Controlls");
  }

  setupCustomObject() {
    this.customMesh = new TestCustomObject();
    this.scene.add(this.customMesh);
  }

  updateCustomObject() {
    this.customMesh.update();
  }
}

// wrap everything inside a function scope and invoke it (IIFE, a.k.a. SEAF)
(() => {
  const app = new Application({
    container: document.getElementById("canvas-container")
  });
  console.log(app);
})();
