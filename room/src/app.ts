import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { CubeTexture, Engine, Scene, ArcRotateCamera, Vector3, Color3, HemisphericLight, MeshBuilder, StandardMaterial, Texture } from "@babylonjs/core";

class App {
  private _canvas: HTMLCanvasElement;

  constructor() {
      // create the canvas html element and attach it to the webpage
      this._canvas = this._createCanvas();

      // initialize babylon scene and engine
      var engine = new Engine(this._canvas, true);
      var scene = new Scene(engine);

      var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new Vector3(0,1,3), scene);
      camera.attachControl(this._canvas, true);
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

      // Walls
      const plane1 = MeshBuilder.CreatePlane("plane1", {height: 4, width: 10, sideOrientation: 1});
      plane1.position.z = -5;
      plane1.position.y = 2;
      const plane2 = MeshBuilder.CreatePlane("plane2", {height: 4, width: 10, sideOrientation: 1});
      plane2.position.x = -5;
      plane2.position.y = 2;
      plane2.rotation.y = Math.PI / 2;
      const plane3 = MeshBuilder.CreatePlane("plane3", {height: 4, width: 10, sideOrientation: 1});
      plane3.position.x = 5;
      plane3.position.y = 2;
      plane3.rotation.y = Math.PI / -2;
      const plane4 = MeshBuilder.CreatePlane("plane4", {height: 4, width: 10});
      plane4.position.z = 5;
      plane4.position.y = 2;

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