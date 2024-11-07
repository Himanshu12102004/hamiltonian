import { GUI } from "dat.gui";
import CanvasEvents from "./CanvasEvents";
import { GlobalVariables, NodeState, TravelMode } from "./GlobalVariables";
import { shaderCompiler } from "./helpers/compileShaders";
import { createProgram } from "./helpers/createProgram";
import {
  drawAnimation,
  drawConnections,
  drawMouseTrain,
  drawNodes,
} from "./rendering/draw";
import AnimationTrain from "./world/components/AnimationTrain";

async function loadShader(shaderPath: string): Promise<string> {
  const file = await fetch(shaderPath);
  return file.text();
}
function compileShader(
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  const vertexShader = shaderCompiler(
    vertexShaderSource,
    GlobalVariables.gl.VERTEX_SHADER,
    GlobalVariables.gl
  );
  const fragmentShader = shaderCompiler(
    fragmentShaderSource,
    GlobalVariables.gl.FRAGMENT_SHADER,
    GlobalVariables.gl
  );
  return { vertexShader, fragmentShader };
}

let gui: GUI;

function datInit() {
  gui = new GUI();
  const controls = gui.addFolder("Controls");
  const nodes = controls.addFolder("Nodes");
  const nodeColor = nodes.addFolder("Color");
  const backGround = controls.addFolder("Backgraound");
  const animation = controls.addFolder("Animation");
  controls.open();
  for (let state = 0; state < Object.keys(NodeState).length / 2; state++) {
    nodeColor
      .addColor({ color: GlobalVariables.nodeColors[state] }, "color")
      .name(NodeState[state])
      .onChange((value: number[]) => {
        GlobalVariables.nodeColors[state] = value;
      });
  }
  backGround
    .addColor({ color: GlobalVariables.backgroundColor }, "color")
    .onChange((value: number[]) => {
      GlobalVariables.backgroundColor = value;
    });
  const nodeBody = nodes.addFolder("Node Body");
  nodeBody
    .add({ radius: GlobalVariables.nodeRadius }, "radius", 0, 10)
    .onChange((value: number) => {
      GlobalVariables.nodeRadius = value;
      GlobalVariables.nodeRayTracingTolerance = value;
    });
  nodeBody
    .add({ polyCount: GlobalVariables.noOfTriangles }, "polyCount", 3, 100, 1)
    .onChange((value: number) => {
      GlobalVariables.noOfTriangles = value;
    });
  const forces = controls.addFolder("Forces");
  forces
    .add({ gravity: GlobalVariables.gravitationalConstant }, "gravity", 0, 100)
    .name("Gravitational Constant")
    .onChange((value: number) => {
      GlobalVariables.gravitationalConstant = value;
    });
  forces
    .add({ viscosity: GlobalVariables.viscosity }, "viscosity", 0, 100)
    .name("Viscosity")
    .onChange((value: number) => {
      GlobalVariables.viscosity = value;
    });
  forces
    .add(
      { distancePropotionality: GlobalVariables.distancePropotionality },
      "distancePropotionality",
      0,
      5
    )
    .name("Distance Propotionality")
    .onChange((value: number) => {
      GlobalVariables.distancePropotionality = value;
    });
  animation
    .add(GlobalVariables.animationParams, "speed", 0.001, 1)
    .onChange((value) => {
      GlobalVariables.animationParams.speed = value;
    });
}
function isAnimationCompleted() {
  const ap = GlobalVariables.animationParams;
  if (
    ap.backendArray[ap.backendArrayPtr][2] == TravelMode.backTrack &&
    ap.frontendArray[ap.frontendArrayPtr].t <= 0
  ) {
    ap.frontendArray.pop();
    ap.frontendArrayPtr--;
    ap.backendArrayPtr++;
    const event = new CustomEvent("pointerPostion");
    document.dispatchEvent(event);
    return true;
  } else if (
    ap.backendArray[ap.backendArrayPtr][2] == TravelMode.forward &&
    ap.frontendArray[ap.frontendArrayPtr].t >= 1
  ) {
    GlobalVariables.graph.nodes[
      ap.backendArray[ap.backendArrayPtr][1]
    ].addState(NodeState.selected);
    ap.backendArrayPtr++;
    const event = new CustomEvent("pointerPostion");
    document.dispatchEvent(event);
    return true;
  }
  return false;
}
function startAnimation() {
  const ap = GlobalVariables.animationParams;
  if (
    ap.backendArray.length != 0 &&
    ap.backendArrayPtr != ap.backendArray.length
  ) {
    if (ap.backendArrayPtr == -1) {
      ++ap.backendArrayPtr;
      const event = new CustomEvent("pointerPostion");
      document.dispatchEvent(event);
      ++ap.frontendArrayPtr;
      ap.frontendArray.push(
        new AnimationTrain(
          ap.backendArray[ap.backendArrayPtr][0],
          ap.backendArray[ap.backendArrayPtr][1]
        )
      );
      GlobalVariables.graph.nodes[
        ap.backendArray[ap.backendArrayPtr][0]
      ].addState(NodeState.selected);
    } else if (isAnimationCompleted()) {
      if (
        ap.backendArrayPtr != ap.backendArray.length &&
        ap.backendArray[ap.backendArrayPtr][2] == TravelMode.forward
      ) {
        ap.frontendArray.push(
          new AnimationTrain(
            ap.backendArray[ap.backendArrayPtr][0],
            ap.backendArray[ap.backendArrayPtr][1]
          )
        );
        ++ap.frontendArrayPtr;
      }
      if (
        ap.backendArrayPtr != ap.backendArray.length &&
        ap.backendArray[ap.backendArrayPtr][2] == TravelMode.pause &&
        !ap.isAnimationPaused
      ) {
        ap.isAnimationPaused = true;
        for (
          let i = 0;
          i < ap.backendArray[ap.backendArrayPtr][3].length;
          i++
        ) {
          if (ap.backendArray[ap.backendArrayPtr][4])
            GlobalVariables.graph.nodes[
              ap.backendArray[ap.backendArrayPtr][3][i]
            ].addState(NodeState.accepted);
          else
            GlobalVariables.graph.nodes[
              ap.backendArray[ap.backendArrayPtr][3][i]
            ].addState(NodeState.rejected);
        }
        for (let i = 0; i < ap.frontendArray.length; i++) {
          if (ap.backendArray[ap.backendArrayPtr][4])
            ap.frontendArray[i].addState(NodeState.accepted);
          else ap.frontendArray[i].addState(NodeState.rejected);
        }
        const currentAnimationWidth = GlobalVariables.animationConnectionWidth;
        GlobalVariables.animationConnectionWidth = currentAnimationWidth * 2;
        GlobalVariables.timeOut = setTimeout(() => {
          ap.isAnimationPaused = false;
          for (
            let i = 0;
            i < ap.backendArray[ap.backendArrayPtr][3].length;
            i++
          ) {
            if (ap.backendArray[ap.backendArrayPtr][4])
              GlobalVariables.graph.nodes[
                ap.backendArray[ap.backendArrayPtr][3][i]
              ].removeState(NodeState.accepted);
            else
              GlobalVariables.graph.nodes[
                ap.backendArray[ap.backendArrayPtr][3][i]
              ].removeState(NodeState.rejected);
          }
          for (let i = 0; i < ap.frontendArray.length; i++) {
            if (ap.backendArray[ap.backendArrayPtr][4])
              ap.frontendArray[i].removeState(NodeState.accepted);
            else ap.frontendArray[i].removeState(NodeState.rejected);
          }
          GlobalVariables.animationParams.backendArrayPtr++;
          const event = new CustomEvent("pointerPostion");
          document.dispatchEvent(event);
          GlobalVariables.animationConnectionWidth = currentAnimationWidth;
        }, 1000);
      }
    }
  }
}
let lastTime = performance.now();
function animate() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  GlobalVariables.timeElapsed = deltaTime;
  lastTime = currentTime;
  GlobalVariables.gl.clearColor(
    GlobalVariables.backgroundColor[0] / 255,
    GlobalVariables.backgroundColor[1] / 255,
    GlobalVariables.backgroundColor[2] / 255,
    1.0
  );
  GlobalVariables.gl.clear(
    GlobalVariables.gl.COLOR_BUFFER_BIT | GlobalVariables.gl.DEPTH_BUFFER_BIT
  );

  drawConnections();
  drawMouseTrain();
  if (GlobalVariables.animationParams.start) {
    if (
      GlobalVariables.animationParams.backendArray.length != 0 &&
      GlobalVariables.animationParams.backendArray[0][2] == TravelMode.forward
    ) {
      startAnimation();
      drawAnimation();
    }
  }
  drawNodes();
  requestAnimationFrame(animate);
}

async function init() {
  const vertexShaderLineSource = await loadShader(
    "./shaders/lines/lines.vs.glsl"
  );
  const fragmentShaderLineSource = await loadShader(
    "./shaders/lines/lines.fs.glsl"
  );
  GlobalVariables.shaders.line = compileShader(
    vertexShaderLineSource,
    fragmentShaderLineSource
  );
  GlobalVariables.program.line = createProgram(
    GlobalVariables.shaders.line.vertexShader!,
    GlobalVariables.shaders.line.fragmentShader!,
    GlobalVariables.gl
  );
  const vertexShaderBoxSource = await loadShader(
    "./shaders/nodes/nodes.vs.glsl"
  );
  const fragmentShaderBoxSource = await loadShader(
    "./shaders/nodes/nodes.fs.glsl"
  );
  GlobalVariables.shaders.node = compileShader(
    vertexShaderBoxSource,
    fragmentShaderBoxSource
  );
  GlobalVariables.program.node = createProgram(
    GlobalVariables.shaders.node.vertexShader!,
    GlobalVariables.shaders.node.fragmentShader!,
    GlobalVariables.gl
  );
}
function main(canvas: HTMLCanvasElement) {
  GlobalVariables.init(canvas);
  CanvasEvents.addEvents();
  datInit();
  gui.hide();
  init().then(() => {
    animate();
  });
}

export { gui };
export default main;
