import AnimationTrain from "./world/components/AnimationTrain";
import Graph from "./world/components/Graph";
import MouseTrain from "./world/components/MouseTrain";
import { TravelMode } from "../Components/enums/TravelMode";

enum NodeState {
  clicked,
  inVisinity,
  visited,
  accepted,
  rejected,
  selected,
  connected,
  normal,
}

class GlobalVariables {
  static bounds = { maxX: 0, minX: 0, maxY: 0, minY: 0 };
  static graphScale = { scale: 100 };
  static screenDimensions = { height: 600, width: 800 };
  static gl: WebGL2RenderingContext;
  static canvas: HTMLCanvasElement;
  static nodeRadius: number;
  static noOfTriangles: number;
  static nodeRayTracingTolerance: number;
  static graph: Graph;
  static gravitationalConstant: number;
  static viscosity: number;
  static distancePropotionality: number;
  static nodeColors: number[][];
  static graphIsDirected: boolean;
  static timeElapsed: number;
  static connectionWidth: number;
  static backgroundColor: number[];
  static animationConnectionWidth: number;
  static isAlgoComputed: boolean;
  static canvasParent: HTMLDivElement;
  static startNode: number;
  static animationParams = {
    speed: 0.0001,
    start: false,
    frontendArray: [] as AnimationTrain[],
    backendArray: [] as [number, number, TravelMode, number[], boolean][],
    frontendArrayPtr: -1,
    backendArrayPtr: -1,
    isAnimationPaused: false,
  };
  static timeOut: NodeJS.Timeout;
  static shaders = {
    line: {
      fragmentShader: null as WebGLShader | null,
      vertexShader: null as WebGLShader | null,
    },
    node: {
      fragmentShader: null as WebGLShader | null,
      vertexShader: null as WebGLShader | null,
    },
  };
  static program = {
    line: null as WebGLProgram | null,
    node: null as WebGLProgram | null,
  };
  static mouseTrain: MouseTrain;
  static animationParamsInit() {
    // GlobalVariables.isAlgoComputed=false
    GlobalVariables.animationParams.speed = 0.001;
    GlobalVariables.animationParams.start = false;
    GlobalVariables.animationParams.frontendArray = [];
    GlobalVariables.animationParams.frontendArrayPtr = -1;
    GlobalVariables.animationParams.backendArray = [
      //   [0,1,TravelMode.forward,[],false],
      // [1,2,TravelMode.forward,[],false],
      // [1,2,TravelMode.backTrack,[],false],
      // [1,3,TravelMode.forward,[],false],
      // [-1,-1,TravelMode.pause,[0,1,3],true],
      // [1,3,TravelMode.backTrack,[],false],
      // [0,1,TravelMode.backTrack,[],false],
    ];
    GlobalVariables.animationParams.backendArrayPtr = -1;
    GlobalVariables.animationParams.isAnimationPaused = false;
  }
  static init(canvas: HTMLCanvasElement) {
    GlobalVariables.startNode = 0;
    GlobalVariables.canvasParent = document.querySelector("#canvas_parent")!;
    GlobalVariables.screenDimensions.height =
      GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.screenDimensions.width =
      GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.bounds = {
      maxX:
        GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale),
      minX:
        -GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale),
      maxY:
        GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale),
      minY:
        -GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale),
    };
    GlobalVariables.canvas = canvas;
    const renderingContext = canvas.getContext("webgl2", { antialias: true });
    if (!renderingContext) {
      alert("Webgl2 not supported");
      return;
    } else {
      GlobalVariables.gl = renderingContext;
    }
    canvas.height = GlobalVariables.screenDimensions.height;
    canvas.width = GlobalVariables.screenDimensions.width;
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.screenDimensions.width,
      GlobalVariables.screenDimensions.height
    );
    GlobalVariables.nodeRadius = 0.2;
    GlobalVariables.noOfTriangles = 30;
    GlobalVariables.nodeRayTracingTolerance = GlobalVariables.nodeRadius;
    GlobalVariables.graph = new Graph();
    this.mouseTrain = new MouseTrain();
    GlobalVariables.distancePropotionality = 2;
    GlobalVariables.gravitationalConstant = 10;
    GlobalVariables.viscosity = 20;
    GlobalVariables.nodeColors = [];
    GlobalVariables.timeElapsed = 0;
    GlobalVariables.backgroundColor = [255, 255, 255];
    GlobalVariables.nodeColors[0] = [131, 67, 193];
    GlobalVariables.nodeColors[1] = [172, 75, 222];
    GlobalVariables.nodeColors[2] = [28, 27, 24];
    GlobalVariables.nodeColors[3] = [4, 181, 82];
    GlobalVariables.nodeColors[4] = [227, 55, 55];
    GlobalVariables.nodeColors[5] = [92, 189, 222];
    GlobalVariables.nodeColors[6] = [167, 165, 180];
    GlobalVariables.nodeColors[7] = [203, 211, 230];
    GlobalVariables.animationParamsInit();
    GlobalVariables.graphIsDirected = false;
    GlobalVariables.connectionWidth = 0.03;
    GlobalVariables.animationConnectionWidth = 0.05;
    GlobalVariables.isAlgoComputed = false;
  }
  static playPause() {
    GlobalVariables.animationParams.isAnimationPaused =
      !GlobalVariables.animationParams.isAnimationPaused;
  }
  static start() {
    GlobalVariables.animationParams.start = true;
  }
  static reset() {
    GlobalVariables.killTimeOut();
    GlobalVariables.screenDimensions.height =
      GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.screenDimensions.width =
      GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.bounds = {
      maxX:
        GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale),
      minX:
        -GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale),
      maxY:
        GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale),
      minY:
        -GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale),
    };
    GlobalVariables.graph.reset();
    GlobalVariables.isAlgoComputed = false;
    GlobalVariables.animationParamsInit();
  }
  static killTimeOut() {
    clearTimeout(GlobalVariables.timeOut);
  }
  static resetNodeStates() {
    console.log("Hello");
    this.graph.resetStates();
  }
  static fastForward() {
    let ap = GlobalVariables.animationParams;
    if (ap.backendArrayPtr != ap.backendArray.length) {
      if (ap.backendArray[ap.backendArrayPtr][2] == TravelMode.forward) {
        ap.frontendArray[ap.frontendArrayPtr].setT(0.9999);
      } else if (
        ap.backendArray[ap.backendArrayPtr][2] == TravelMode.backTrack
      ) {
        ap.frontendArray[ap.frontendArrayPtr].setT(0.0001);
      }
    }
  }
}
export { GlobalVariables, NodeState, TravelMode };
