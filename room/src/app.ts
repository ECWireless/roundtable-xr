import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, Color3, HemisphericLight, Mesh, StandardMaterial } from "@babylonjs/core";

class App {
  private _canvas: HTMLCanvasElement;

  constructor() {
      // create the canvas html element and attach it to the webpage
      this._canvas = this._createCanvas();

      // initialize babylon scene and engine
      var engine = new Engine(this._canvas, true);
      var scene = new Scene(engine);

      var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2.5, 2, new Vector3(0,1,3), scene);
      camera.attachControl(this._canvas, true);
      var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
      var ground = Mesh.CreateGround("ground1", 10, 10, 10, scene);
      var groundMtr = new StandardMaterial("myMaterial", scene);
      groundMtr.diffuseColor = new Color3(.25, .2, .2);

      ground.material = groundMtr;

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