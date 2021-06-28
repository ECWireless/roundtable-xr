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
  private _engine: Engine;
  private _scene: Scene;

  constructor() {
    // create the canvas html element and attach it to the webpage
    this._canvas = this._createCanvas();

    // initialize babylon scene and engine
    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);
    this._scene.gravity = new Vector3(0, -0.9, 0);
    this._scene.collisionsEnabled = true;

    this.start();
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

  private async start() {
    this._engine.displayLoadingUI();
    // Camera
    var camera: UniversalCamera = new UniversalCamera("Camera", new Vector3(0,1.3,-3.5), this._scene);
    camera.setTarget(new Vector3(0,1,0));
    camera.attachControl(this._canvas, true);
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera.ellipsoid = new Vector3(1.3, 1, 1.3);
    camera.ellipsoidOffset = new Vector3(0, 1, 0);
    camera.inertia = 0;
    camera.speed = 2.5;

    if(!camera) {
      console.error('You need to add a camera to the level to enable pointer lock');
    }
    let canvas = this._canvas;
    // On click event, request pointer lock
    canvas.addEventListener("click", function(evt) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        if (canvas.requestPointerLock) {
            canvas.requestPointerLock();
        }
    }, false);
    
    var onKeyDown = function (event) {
      switch (event.keyCode) {
        case 16: // shift
          camera.speed = 6;
            break;
      }
    };

    var onKeyUp = function (event) {
      switch (event.keyCode) {
        case 16: // shift
          camera.speed = 2.5;
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
    var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);

    //Skybox
    const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, this._scene);
    const skyboxMaterial = new StandardMaterial("skyBox", this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture("https://arweave.net/f7lPpg9mJVadPlJ8u6Hohj_2iAuxeol8lkTecLtNcXo/skybox", this._scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Ground
    var ground = MeshBuilder.CreateGround("ground1", {width: 10, height: 10}, this._scene);
    var groundMtr = new StandardMaterial("myMaterial", this._scene);
    // groundMtr.diffuseColor = new Color3(.25, .2, .2);
    groundMtr.diffuseTexture = new Texture("https://arweave.net/7Z7E2th4MhpxLydsO1_FJM2ZOM_k56vRU3qRm9DA1Ps/Wood_Floor_Diffuse.jpg", this._scene);
    groundMtr.bumpTexture = new Texture("https://arweave.net/7Z7E2th4MhpxLydsO1_FJM2ZOM_k56vRU3qRm9DA1Ps/Wood_Floor_Normal.jpg", this._scene);
    groundMtr.detailMap.texture = new Texture("https://arweave.net/7Z7E2th4MhpxLydsO1_FJM2ZOM_k56vRU3qRm9DA1Ps/Wood_Floor_Glass_Roughness.jpg", this._scene);
    groundMtr.diffuseTexture.scale(.02);
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

    await this._scene.whenReadyAsync();
    this._engine.hideLoadingUI();

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
        // Shift+Ctrl+Alt+I
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
            if (this._scene.debugLayer.isVisible()) {
                this._scene.debugLayer.hide();
            } else {
                this._scene.debugLayer.show();
            }
        }
    });

    // run the main render loop
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
  }
}
new App();