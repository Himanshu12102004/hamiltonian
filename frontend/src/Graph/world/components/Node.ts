import { GlobalVariables, NodeState } from "../../GlobalVariables";
import createVao from "../../helpers/createVao";
import updateVao from "../../helpers/updateVao";
import Point from "../helpers/point";
import Vector from "../helpers/vector";

class Node {
  point: Point;
  points: Point[];
  vao: WebGLVertexArrayObject | null;
  establishedOn: number;
  netForce: Vector;
  states: NodeState[];
  constructor(pt: Point) {
    this.point = pt;
    this.points = [];
    this.establishedOn = 0;
    this.generatePoints();
    this.vao = null;
    this.states = [NodeState.normal];
    this.setVao();
    this.netForce = new Vector();
  }
  addState(state: NodeState) {
    for (let i = 0; i < this.states.length; i++) {
      if (this.states[i] == state) return;
    }
    this.states.push(state);
  }
  applyState() {
    let min: number = this.states[0];
    for (let i = 1; i < this.states.length; i++) {
      if (min > this.states[i]) min = this.states[i];
    }
    return min;
  }
  removeState(state: NodeState) {
    const index = this.states.indexOf(state);
    if (index !== -1) {
      this.states.splice(index, 1);
    }
  }

  setVao() {
    GlobalVariables.gl.useProgram(GlobalVariables.program.node);
    const nodeVertices = [];
    const color = [];
    color.push(1, 1, 1, 1);
    for (let i = 0; i < this.points.length; i++) {
      nodeVertices.push(...Node.getNormalizedPoint(this.points[i]));
      const appliedState = this.applyState();
      color.push(
        GlobalVariables.nodeColors[appliedState][0] / 255,
        GlobalVariables.nodeColors[appliedState][1] / 255,
        GlobalVariables.nodeColors[appliedState][2] / 255,
        1.0
      );
    }
    const vertexLocation = GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program.node!,
      "vertex"
    );
    const colorLocation = GlobalVariables.gl.getAttribLocation(
      GlobalVariables.program.node!,
      "color"
    );
    const float32color = new Float32Array(color);
    const float32vertex = new Float32Array(nodeVertices);
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

          {
            bufferArray: float32color,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: colorLocation,
            howToRead: 4,
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
          {
            bufferArray: float32color,
            type: GlobalVariables.gl.ARRAY_BUFFER,
            location: colorLocation,
            howToRead: 4,
            normalized: false,
            startFrom: 0,
          },
        ],
        GlobalVariables.gl
      );
    }
  }
  draw() {
    this.establishedOn++;
    GlobalVariables.gl.useProgram(GlobalVariables.program.node);
    GlobalVariables.gl.bindVertexArray(this.vao);
    GlobalVariables.gl.drawArrays(
      GlobalVariables.gl.TRIANGLE_FAN,
      0,
      this.points.length
    );
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
  generatePoints() {
    this.points = [];
    const radius = GlobalVariables.nodeRadius;
    const noOfTriangles = GlobalVariables.noOfTriangles;
    const angleStep = (2 * Math.PI) / noOfTriangles;
    this.points.push(this.point);
    for (let i = 0; i <= noOfTriangles; i++) {
      const angle = i * angleStep;
      const outerX =
        this.point.x +
        (Math.exp(-this.establishedOn * 0.01) *
          Math.sin(this.establishedOn * 0.1) *
          0.05 +
          radius) *
          Math.cos(angle);
      const outerY =
        this.point.y +
        (Math.exp(-this.establishedOn * 0.01) *
          Math.sin(this.establishedOn * 0.1) *
          0.05 +
          radius) *
          Math.sin(angle);
      this.points.push(new Point(outerX, outerY));
    }
  }
  updatePosition() {
    const viscosity = GlobalVariables.viscosity * 0.00001;
    const firctionX =
      viscosity > Math.abs(this.netForce.x)
        ? -this.netForce.x
        : -Math.sign(this.netForce.x) * viscosity;
    const firctionY =
      viscosity > Math.abs(this.netForce.y)
        ? -this.netForce.y
        : -Math.sign(this.netForce.y) * viscosity;
    this.point.x += (this.netForce.x + firctionX) * GlobalVariables.timeElapsed;
    this.point.y += (this.netForce.y + firctionY) * GlobalVariables.timeElapsed;
  }
  findNetForce() {
    this.netForce = new Vector(new Point(0, 0), new Point(0, 0));
    const gravitationalConstant =
      0.0005 * GlobalVariables.gravitationalConstant;
    for (let i = 0; i < GlobalVariables.graph.nodes.length; i++) {
      const node = GlobalVariables.graph.nodes[i];

      if (node.point === this.point) continue;

      const force = new Vector(node.point, this.point);
      const distance = Point.distance(this.point, node.point);

      let forceMagnitude: number;
      if (distance === 0) {
        forceMagnitude = gravitationalConstant * GlobalVariables.nodeRadius;
      } else {
        forceMagnitude =
          (gravitationalConstant * GlobalVariables.nodeRadius) /
          Math.pow(distance, GlobalVariables.distancePropotionality);
      }

      force.convertToUnit();
      force.multiply(forceMagnitude);

      this.netForce = this.netForce.add(force);
    }
    return this.netForce;
  }
  resetStates() {
    this.states = this.states.filter((state) => {
      return state == NodeState.connected || state == NodeState.normal;
    });
    console.log(this.states);
  }
}

export default Node;
