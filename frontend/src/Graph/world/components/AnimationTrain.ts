import { GlobalVariables, NodeState } from '../../GlobalVariables';
import createVao from '../../helpers/createVao';
import updateVao from '../../helpers/updateVao';
import Point from '../helpers/point';
import Vector from '../helpers/vector';

class AnimationTrain {
  t: number;
  from:number;
  to:number;
  vao: WebGLVertexArrayObject | null;
  constructor(
    from:number,to:number,t=0
  ) {
    this.from=from;
    this.t = t;
    this.to=to;
    this.vao = null;
  }
  calcTermination() {
    let start=GlobalVariables.graph.nodes[this.from].point;
    let end=GlobalVariables.graph.nodes[this.to].point
    let vec=new Vector(start,end)
    let pt =vec.multiplyInNewVector(this.t).addAPoint(start);
    return pt;
  }
  incrementT() {
    if(this.t<1)
    this.t =
      this.t + GlobalVariables.animationParams.speed * GlobalVariables.timeElapsed;
      if(this.t>1)
        this.t=1;
  }
  decrementT() {
    if(this.t>0)
    this.t =
      this.t - GlobalVariables.animationParams.speed * GlobalVariables.timeElapsed;
      if(this.t>1)
        this.t=1;
  }
  static getNormalizedPoint(point: Point): [number, number] {
    return [
      (2 * (point.x - GlobalVariables.bounds.minX)) /
        (GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX) -
        1,
      (2 * (point.y - GlobalVariables.bounds.minY)) /
        (GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY) -
        1,
    ];
  }
  calcPointsOfRect(pt1:Point,pt2:Point){
    let dy=(pt2.y-pt1.y);
    let perpM=(pt1.x-pt2.x)/dy;
    let vertexArray:Point[]=[];
    let lsinThetha=Math.sin(Math.atan(perpM))*GlobalVariables.animationConnectionWidth/2;
    let lcosThetha=Math.cos(Math.atan(perpM))*GlobalVariables.animationConnectionWidth/2;
    vertexArray.push(new Point(pt1.x+lcosThetha,pt1.y+lsinThetha),new Point(pt1.x-lcosThetha,pt1.y-lsinThetha),new Point(pt2.x+lcosThetha,pt2.y+lsinThetha),new Point(pt2.x-lcosThetha,pt2.y-lsinThetha));
    return vertexArray;
  }
  setVao() {
    GlobalVariables.gl.useProgram(GlobalVariables.program.line);
    let vertexLocation = GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program.line!,
      'vertex'
    );
    let colorUniformLocation = GlobalVariables.gl.getUniformLocation(
      GlobalVariables.program.line!,
      'userColor'
    );
    let start=GlobalVariables.graph.nodes[this.from].point;
    let rect=this.calcPointsOfRect(GlobalVariables.graph.nodes[this.from].point,this.calcTermination());
    let connectionVertices = [
      ...AnimationTrain.getNormalizedPoint(rect[0]),
      ...AnimationTrain.getNormalizedPoint(rect[1]),
      ...AnimationTrain.getNormalizedPoint(rect[2]),
      ...AnimationTrain.getNormalizedPoint(rect[3]),
    ];
    let float32vertex = new Float32Array(connectionVertices);
    GlobalVariables.gl.uniform3f(
      colorUniformLocation,
      GlobalVariables.nodeColors[NodeState.selected][0] / 255,
      GlobalVariables.nodeColors[NodeState.selected][1] / 255,
      GlobalVariables.nodeColors[NodeState.selected][2] / 255
    );
    if (this.vao == null) {
      this.vao = createVao(
        [
          {
            bufferArray: float32vertex,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 2,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    } else {
      updateVao(
        this.vao,
        [
          {
            bufferArray: float32vertex,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: vertexLocation,
            howToRead: 2,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    }
  }
  draw() {
    GlobalVariables.gl.useProgram(GlobalVariables.program.line);
    GlobalVariables.gl.bindVertexArray(this.vao);
    GlobalVariables.gl.drawArrays(GlobalVariables.gl.TRIANGLE_STRIP, 0, 4);
  }
}
export default AnimationTrain;
