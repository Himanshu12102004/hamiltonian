import { GlobalVariables, NodeState } from "../../GlobalVariables";
import createVao from "../../helpers/createVao";
import updateVao from "../../helpers/updateVao";
import Point from "../helpers/point";
class Connection {
  connectionTo: number;
  connectionFrom:number;
  vao:WebGLVertexArrayObject|null
  constructor(connectionFrom:number,connectionTo: number) {
    this.connectionTo = connectionTo;
    this.connectionFrom=connectionFrom;
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
  setVao(pt1:Point,pt2:Point){
    GlobalVariables.gl.useProgram(GlobalVariables.program.line);
    let vertexLocation=GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program.line!,
      'vertex'
    );
    let colorUniformLocation=GlobalVariables.gl.getUniformLocation(GlobalVariables.program.line!,"userColor");
    let connectionVertices=[...(Connection.getNormalizedPoint(pt1)),...Connection.getNormalizedPoint(pt2)];
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
      GlobalVariables.gl.LINES,
      0,
      2
    );
  }
}
export default Connection;
