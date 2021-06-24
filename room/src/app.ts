// import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  CubeTexture,
  Engine,
  Scene,
  UniversalCamera,
  Vector3,
  Color3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

class App {
  private _canvas: HTMLCanvasElement;

  constructor() {
      // create the canvas html element and attach it to the webpage
      this._canvas = this._createCanvas();

      // initialize babylon scene and engine
      var engine = new Engine(this._canvas, true);
      var scene = new Scene(engine);
      scene.gravity = new Vector3(0, -0.9, 0);
      scene.collisionsEnabled = true;

      // Camera
      var camera: UniversalCamera = new UniversalCamera("Camera", new Vector3(0,1,-3.5), scene);
      camera.setTarget(Vector3.Zero());
      camera.attachControl(this._canvas, true);
      camera.applyGravity = true;
      camera.checkCollisions = true;
      camera.ellipsoid = new Vector3(1.5, 1, 1.5);
      camera.ellipsoidOffset = new Vector3(0, 1, 0);

      var moveForward = false;
      var moveBackward = false;
      var moveRight = false;
      var moveLeft = false;
      
      var onKeyDown = function (event) {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
              moveForward = true;
              break;

          case 37: // left
          case 65: // a
              moveLeft = true; break;

          case 40: // down
          case 83: // s
              moveBackward = true;
              break;

          case 39: // right
          case 68: // d
              moveRight = true;
              break;

          case 32: // space
              break;
        }
      };

      var onKeyUp = function (event) {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
              moveForward = false;
              break;

          case 37: // left
          case 65: // a
              moveLeft = false;
              break;

          case 40: // down
          case 83: // a
              moveBackward = false;
              break;

          case 39: // right
          case 68: // d
              moveRight = false;
              break;
        }
      };

      document.addEventListener('keydown', onKeyDown, false);
      document.addEventListener('keyup', onKeyUp, false);
      camera.keysUp.push(87); 
      camera.keysDown.push(83);            
      camera.keysRight.push(68);
      camera.keysLeft.push(65);

      // Lighting
      var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

      //Skybox
      const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
      const skyboxMaterial = new StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new CubeTexture("https://arweave.net/f7lPpg9mJVadPlJ8u6Hohj_2iAuxeol8lkTecLtNcXo/skybox", scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
      skyboxMaterial.specularColor = new Color3(0, 0, 0);
      skybox.material = skyboxMaterial;

      // Ground
      var ground = MeshBuilder.CreateGround("ground1", {width: 10, height: 10}, scene);
      var groundMtr = new StandardMaterial("myMaterial", scene);
      groundMtr.diffuseColor = new Color3(.25, .2, .2);
      ground.material = groundMtr;
      ground.checkCollisions = true;
      ground.material.backFaceCulling = false;

      // Walls
      const plane1 = MeshBuilder.CreatePlane("plane1", {height: 4, width: 10, sideOrientation: 1});
      plane1.position.z = -5;
      plane1.position.y = 2;
      plane1.checkCollisions = true;
      const plane2 = MeshBuilder.CreatePlane("plane2", {height: 4, width: 10, sideOrientation: 1});
      plane2.position.x = -5;
      plane2.position.y = 2;
      plane2.rotation.y = Math.PI / 2;
      plane2.checkCollisions = true;
      const plane3 = MeshBuilder.CreatePlane("plane3", {height: 4, width: 10, sideOrientation: 1});
      plane3.position.x = 5;
      plane3.position.y = 2;
      plane3.rotation.y = Math.PI / -2;
      plane3.checkCollisions = true;
      const plane4 = MeshBuilder.CreatePlane("plane4", {height: 4, width: 10});
      plane4.position.z = 5;
      plane4.position.y = 2;
      plane4.checkCollisions = true;

      // hide/show the Inspector
      window.addEventListener("keydown", (ev) => {
          // Shift+Ctrl+Alt+I
          if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
              if (scene.debugLayer.isVisible()) {
                  scene.debugLayer.hide();
              } else {
                  scene.debugLayer.show();
              }
          }
      });

      // run the main render loop
      engine.runRenderLoop(() => {
          scene.render();
      });
  }

  private _createCanvas(): HTMLCanvasElement {

      //Commented out for development
      document.documentElement.style["overflow"] = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.width = "100%";
      document.documentElement.style.height = "100%";
      document.documentElement.style.margin = "0";
      document.documentElement.style.padding = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.margin = "0";
      document.body.style.padding = "0";

      //create the canvas html element and attach it to the webpage
      this._canvas = document.createElement("canvas");
      this._canvas.style.width = "100%";
      this._canvas.style.height = "100%";
      this._canvas.id = "gameCanvas";
      document.body.appendChild(this._canvas);

      return this._canvas;
  }
}
new App();