import AnimationTrain from './world/components/AnimationTrain';
import Graph from './world/components/Graph';
import MouseTrain from './world/components/MouseTrain';
enum NodeState {
  clicked,
  inVisinity,
  visited,
  selected,
  connected,
  normal,
}
enum TravelMode{
  forward,
  backTrack,
  pause
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
  static connectionWidth:number;
  static backgroundColor: number[];
  static animationConnectionWidth:number;
  static animationParams={
     speed: 0.01,
     start: false,
     frontendArray:[] as AnimationTrain[],
     backendArray:[]as [number,number,TravelMode][],
     frontendArrayPtr:-1,
     backendArrayPtr:-1
  }

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
  static init(canvas: HTMLCanvasElement) {
    GlobalVariables.screenDimensions.height = window.innerHeight;
    GlobalVariables.screenDimensions.width = window.innerWidth;
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
    let renderingContext = canvas.getContext('webgl2');
    if (!renderingContext) {
      alert('Webgl2 not supported');
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

    for (let i = 0; i < Object.keys(NodeState).length / 2; i++) {
      GlobalVariables.nodeColors.push([]);
      for (let j = 0; j < 3; j++)
        GlobalVariables.nodeColors[i].push(Math.random() * 255);
    }
    GlobalVariables.graphIsDirected = false;
  GlobalVariables.animationParams.speed = 0.001;
  GlobalVariables.animationParams.start=false;
  GlobalVariables.animationParams.frontendArray=[];
  GlobalVariables.animationParams.frontendArrayPtr=-1;
  GlobalVariables.animationParams.backendArray=
  [[0,1,TravelMode.forward],
  [1,2,TravelMode.forward],
  [1,2,TravelMode.backTrack],
  [1,3,TravelMode.forward],
  [1,3,TravelMode.backTrack],
  [0,1,TravelMode.backTrack]];
  GlobalVariables.animationParams.backendArrayPtr=-1;
  GlobalVariables.connectionWidth=0.03;
  GlobalVariables.animationConnectionWidth=0.05;
  }
}
export { GlobalVariables, NodeState,TravelMode };
