import { GlobalVariables } from '../GlobalVariables';

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
      matrix[i][j].setVao(nodes[i].point, nodes[matrix[i][j].connectionTo].point);
      matrix[i][j].draw();
    }
  }
}
function drawMouseTrain(){
  GlobalVariables.mouseTrain.setVao();
  GlobalVariables.mouseTrain.draw();
}
export { drawNodes ,drawConnections,drawMouseTrain};
