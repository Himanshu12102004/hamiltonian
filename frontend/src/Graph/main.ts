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
import { computeAlgo } from "./backendInteraction/computeAlgo";

async function loadShader(shaderPath: string): Promise<string> {
  const file = await fetch(shaderPath);
  return file.text();
}
function compileShader(
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  let vertexShader = shaderCompiler(
    vertexShaderSource,
    GlobalVariables.gl.VERTEX_SHADER,
    GlobalVariables.gl
  );
  let fragmentShader = shaderCompiler(
    fragmentShaderSource,
    GlobalVariables.gl.FRAGMENT_SHADER,
    GlobalVariables.gl
  );
  return { vertexShader, fragmentShader };
}

function datInit() {
  const gui = new GUI();
  let controls = gui.addFolder("Controls");
  let nodes = controls.addFolder("Nodes");
  let nodeColor = nodes.addFolder("Color");
  let backGround = controls.addFolder("Backgraound");
  let animation = controls.addFolder("Animation");
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
  let nodeBody = nodes.addFolder("Node Body");
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
  let forces = controls.addFolder("Forces");
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
  let ap = GlobalVariables.animationParams;
  if (
    ap.backendArray[ap.backendArrayPtr][2] == TravelMode.backTrack &&
    ap.frontendArray[ap.frontendArrayPtr].t <= 0
  ) {
    ap.frontendArray.pop();
    ap.frontendArrayPtr--;
    ap.backendArrayPtr++;
    return true;
  } else if (
    ap.backendArray[ap.backendArrayPtr][2] == TravelMode.forward &&
    ap.frontendArray[ap.frontendArrayPtr].t >= 1
  ) {
    GlobalVariables.graph.nodes[
      ap.backendArray[ap.backendArrayPtr][1]
    ].addState(NodeState.selected);
    ap.backendArrayPtr++;
    return true;
  }
  return false;
}
function startAnimation() {
  let ap = GlobalVariables.animationParams;
  if (
    ap.backendArray.length != 0 &&
    ap.backendArrayPtr != ap.backendArray.length
  ) {
    if (ap.backendArrayPtr == -1) {
      ++ap.backendArrayPtr;
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
        let currentAnimationWidth = GlobalVariables.animationConnectionWidth;
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
          GlobalVariables.animationConnectionWidth = currentAnimationWidth;
        }, 1000);
      }
    }
  }
}
let lastTime = performance.now();
let x = true;

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
    if (!GlobalVariables.isAlgoComputed) {
      GlobalVariables.isAlgoComputed = true;
      // computeAlgo();
    }
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
  // datInit();
  init().then(() => {
    animate();
  });
}

export default main;
