import { GlobalVariables, NodeState } from "../../GlobalVariables";
import createVao from "../../helpers/createVao";
import updateVao from "../../helpers/updateVao";
import Point from "../helpers/point";
class Connection {
  connectionTo: number;
  vao:WebGLVertexArrayObject|null
  constructor(connectionTo: number) {
    this.connectionTo = connectionTo;
    this.vao=null;
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
    let lsinThetha=Math.sin(Math.atan(perpM))*GlobalVariables.connectionWidth/2;
    let lcosThetha=Math.cos(Math.atan(perpM))*GlobalVariables.connectionWidth/2;
    vertexArray.push(new Point(pt1.x+lcosThetha,pt1.y+lsinThetha),new Point(pt1.x-lcosThetha,pt1.y-lsinThetha),new Point(pt2.x+lcosThetha,pt2.y+lsinThetha),new Point(pt2.x-lcosThetha,pt2.y-lsinThetha));
    return vertexArray;
  }
  setVao(pt1:Point,pt2:Point){
    GlobalVariables.gl.useProgram(GlobalVariables.program.line);
    let vertexLocation=GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program.line!,
      'vertex'
    );
    let colorUniformLocation=GlobalVariables.gl.getUniformLocation(GlobalVariables.program.line!,"userColor");
    let rect=this.calcPointsOfRect(pt1,pt2);
    let connectionVertices = [
      ...Connection.getNormalizedPoint(rect[0]),
      ...Connection.getNormalizedPoint(rect[1]),
      ...Connection.getNormalizedPoint(rect[2]),
      ...Connection.getNormalizedPoint(rect[3]),
    ];
    let float32vertex = new Float32Array(connectionVertices);
    GlobalVariables.gl.uniform3f(colorUniformLocation,GlobalVariables.nodeColors[NodeState.connected][0]/255,GlobalVariables.nodeColors[NodeState.connected][1]/255,GlobalVariables.nodeColors[NodeState.connected][2]/255)
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
          }
        ],
        GlobalVariables.gl
      );
    }
  }
  draw() {
    GlobalVariables.gl.useProgram(GlobalVariables.program.line);
    GlobalVariables.gl.bindVertexArray(this.vao);
    GlobalVariables.gl.drawArrays(
      GlobalVariables.gl.TRIANGLE_STRIP,
      0,
      4
    );
  }
}
export default Connection;
