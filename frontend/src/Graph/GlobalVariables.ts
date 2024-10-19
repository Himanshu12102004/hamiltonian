import Graph from './world/components/Graph';
enum NodeState {
  clicked,
  inVisinity,
  visited,
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
  static graphIsDirected:boolean;
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
    GlobalVariables.noOfTriangles = 20;
    GlobalVariables.nodeRayTracingTolerance = GlobalVariables.nodeRadius;
    GlobalVariables.graph = new Graph();
    GlobalVariables.distancePropotionality = 2;
    GlobalVariables.gravitationalConstant = 0.001;
    GlobalVariables.viscosity = 0.09;
    GlobalVariables.nodeColors = [];
    for (let i = 0; i < Object.keys(NodeState).length; i++) {
      GlobalVariables.nodeColors.push([]);
      for (let j = 0; j < 3; j++)
        GlobalVariables.nodeColors[i].push(Math.random() * 255);
    }
    this.graphIsDirected=false;
  }
}
export { GlobalVariables, NodeState };
