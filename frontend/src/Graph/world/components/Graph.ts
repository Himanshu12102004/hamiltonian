import { GlobalVariables, NodeState } from '../../GlobalVariables';
import Point from '../helpers/point';
import Connection from './Connection';
import Node from './Node';

class Graph {
  nodes: Node[];
  adjacencyMatrix: Connection[][];
  nodeCount: number;
  isConnectionInitiated: boolean;
  connectionInitiatedFrom: number;
  constructor() {
    this.nodes = [];
    this.adjacencyMatrix = [];
    this.nodeCount = 0;
    this.isConnectionInitiated = false;
    this.connectionInitiatedFrom = -1;
  }
  reset() {
    this.nodes = [];
    this.adjacencyMatrix = [];
    this.nodeCount = 0;
    this.isConnectionInitiated = false;
    this.connectionInitiatedFrom = -1;
  }
  handleNodes(pt: Point) {
    if(!GlobalVariables.animationParams.start){
    for (let i = 0; i < this.nodes.length; i++) {
      if (
        Point.distance(pt, this.nodes[i].point) <
        GlobalVariables.nodeRayTracingTolerance
      ) {
        this.removeNode(i);
        return;
      }
    }
    this.addNode(pt);}
  }
  handleConnections(pt: Point) {
    if(!GlobalVariables.animationParams.start){
    if (!this.isConnectionInitiated) {
      for (let i = 0; i < this.nodes.length; i++) {
        if (
          Point.distance(pt, this.nodes[i].point) <
          GlobalVariables.nodeRayTracingTolerance
        ) {
          this.nodes[i].addState(NodeState.clicked);
          this.isConnectionInitiated = true;
          this.connectionInitiatedFrom = i;
          GlobalVariables.mouseTrain.initialize(
            this.nodes[this.connectionInitiatedFrom].point
          );
          GlobalVariables.mouseTrain.updateVector(pt);
          GlobalVariables.mouseTrain.updateT(1);

          return;
        }
      }
    }}
  }
  handleConnectionVicinity(pt: Point) {
    if (this.isConnectionInitiated) {
      for (let i = 0; i < this.nodes.length; i++) {
        if (
          i != this.connectionInitiatedFrom &&
          Point.distance(pt, this.nodes[i].point) <
            GlobalVariables.nodeRayTracingTolerance
        ) {
          this.nodes[i].addState(NodeState.inVisinity);
          return;
        } else {
          this.nodes[i].removeState(NodeState.inVisinity);
        }
      }
    }
  }
  rollBack() {
    this.isConnectionInitiated = false;
    this.nodes[this.connectionInitiatedFrom].removeState(NodeState.clicked);
  }
  checkForConnectionsAndConnect(pt: Point) {
    if (this.isConnectionInitiated) {
      if (this.isConnectionInitiated) {
        for (let i = 0; i < this.nodes.length; i++) {
          if (
            i != this.connectionInitiatedFrom &&
            Point.distance(pt, this.nodes[i].point) <
              GlobalVariables.nodeRayTracingTolerance
          ) {
            this.nodes[i].addState(NodeState.connected);
            this.nodes[i].removeState(NodeState.inVisinity);
            this.nodes[this.connectionInitiatedFrom].removeState(
              NodeState.clicked
            );
            this.nodes[this.connectionInitiatedFrom].addState(
              NodeState.connected
            );
            this.connect(this.connectionInitiatedFrom, i);
            if (!GlobalVariables.graphIsDirected) {
              this.connect(i, this.connectionInitiatedFrom);
            }
            this.isConnectionInitiated = false;
            GlobalVariables.mouseTrain.updateT(0);
            return;
          }
        }
        GlobalVariables.mouseTrain.updateT(0);
        this.rollBack();
      }
    }
  }
  addNode(pt: Point): void {
    this.nodeCount++;
    let myNode = new Node(pt);
    this.nodes.push(myNode);
    this.adjacencyMatrix.push([]);
  }

  removeNode(i: number): void {
    this.nodes.splice(i, 1);
    this.adjacencyMatrix.splice(i, 1);

    for (let j = 0; j < this.adjacencyMatrix.length; j++) {
      this.adjacencyMatrix[j] = this.adjacencyMatrix[j].filter(
        (connection) => connection.connectionTo !== i
      );

      for (let k = 0; k < this.adjacencyMatrix[j].length; k++) {
        if (this.adjacencyMatrix[j][k].connectionTo > i) {
          this.adjacencyMatrix[j][k].connectionTo--;
        }
      }
    }

    this.nodeCount--;
  }

  connect(nodeIndex1: number, nodeIndex2: number): void {
    if (
      nodeIndex1 >= this.nodes.length ||
      nodeIndex2 >= this.nodes.length ||
      nodeIndex1 === nodeIndex2
    ) {
      throw new Error('Invalid node indices');
    }

    const existingConnection = this.adjacencyMatrix[nodeIndex1].some(
      (connection) => connection.connectionTo === nodeIndex2
    );

    if (existingConnection) {
      console.log(
        `Connection already exists between node ${nodeIndex1} and node ${nodeIndex2}`
      );
      return;
    }
    let connection = new Connection(nodeIndex2);
    this.adjacencyMatrix[nodeIndex1].push(connection);
  }
  parseGraph() {
    let adjMat: number[][] = [];
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
      adjMat.push([]);
      for (let j = 0; j < this.adjacencyMatrix[i].length; j++) {
        adjMat[i].push(this.adjacencyMatrix[i][j].connectionTo);
      }
    }
    return adjMat;
  }
  resetStates(){
    for(let i=0;i<this.nodes.length;i++){
    this.nodes[i].resetStates();
    }
  }
}

export default Graph;
