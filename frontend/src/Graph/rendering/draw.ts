import { GlobalVariables, NodeState, TravelMode } from '../GlobalVariables';

function drawNodes() {
  for (let i = 0; i < GlobalVariables.graph.nodes.length; i++) {
    const node = GlobalVariables.graph.nodes[i];
    node.findNetForce();
  }
  for (let i = 0; i < GlobalVariables.graph.nodes.length; i++) {
    const node = GlobalVariables.graph.nodes[i];
    node.updatePosition();
  }
  for (let i = 0; i < GlobalVariables.graph.nodes.length; i++) {
    const node = GlobalVariables.graph.nodes[i];
    const { x, y } = node.point;
    if (
      x >= GlobalVariables.bounds.minX - 1 &&
      x <= GlobalVariables.bounds.maxX + 1 &&
      y >= GlobalVariables.bounds.minY - 1 &&
      y <= GlobalVariables.bounds.maxY + 1
    ) {
      node.generatePoints();
      node.setVao();
      node.draw();
    }
  }
}
function drawConnections() {
  let matrix = GlobalVariables.graph.adjacencyMatrix;
  let nodes = GlobalVariables.graph.nodes;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j].setVao(
        nodes[i].point,
        nodes[matrix[i][j].connectionTo].point
      );
      matrix[i][j].draw();
    }
  }
}
function drawMouseTrain() {
  GlobalVariables.mouseTrain.setVao();
  GlobalVariables.mouseTrain.draw();
}
function drawAnimation() {
  let ap = GlobalVariables.animationParams;
if(ap.backendArrayPtr!=ap.backendArray.length){
  let currAni = ap.frontendArray[ap.frontendArrayPtr];
  if (ap.backendArray[ap.backendArrayPtr][2] == TravelMode.forward) {
    currAni.incrementT();
  } else if (ap.backendArray[ap.backendArrayPtr][2] == TravelMode.backTrack) {
    GlobalVariables.graph.nodes[ap.backendArray[ap.backendArrayPtr][1]].removeState(NodeState.selected);
    currAni.decrementT();
  }}
  else {
    GlobalVariables.graph.nodes[ap.backendArray[0][0]].removeState(NodeState.selected);

  }
  for (let i = 0; i <= ap.frontendArrayPtr; i++) {
    ap.frontendArray[i].setVao();
    ap.frontendArray[i].draw();
  }
}
export { drawNodes, drawConnections, drawMouseTrain,drawAnimation };
