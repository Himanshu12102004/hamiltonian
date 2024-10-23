import { GlobalVariables, TravelMode } from '../GlobalVariables';
let visited: number[] = [];
let steps: [number, number, TravelMode, number[], boolean][] = [];
let nodes: number[] = [];
function allVisited() {
  for (let i = 0; i < visited.length; i++) {
    if (visited[i] == 0) return false;
  }
  return true;
}
function hamiltonianCycle(
  graph: number[][],
  currNode: number,
  startNode: number
) {
  if (currNode == startNode && allVisited()) {
    steps.push([-1, -1, TravelMode.pause, nodes, true]);
    return;
  }
  let failed=true;
  for (let i = 0; i < graph[currNode].length; i++) {
    if (
      visited[graph[currNode][i]] != 1 ||
      (graph[currNode][i] == startNode && allVisited())
    ) {
      failed=false;
      steps.push([currNode, graph[currNode][i], TravelMode.forward, [], false]);
      visited[graph[currNode][i]]++;
      hamiltonianCycle(graph, graph[currNode][i], startNode);
      visited[graph[currNode][i]]--;
      steps.push([
        currNode,
        graph[currNode][i],
        TravelMode.backTrack,
        [],
        false,
      ]);
    }
  }
  if(failed){
    let visitedNodes:number[]=[];
    for(let i=0;i<visited.length;i++)
    {
      if(visited[i]!=0)
        visitedNodes.push(i);
    }
    steps.push([-1, -1, TravelMode.pause, visitedNodes, false]);
  }
}
function computeAlgo() {
  let parsedGraph = GlobalVariables.graph.parseGraph();
  // console.log(parsedGraph);
  for (let i = 0; i < parsedGraph.length; i++) {
    visited.push(0);
    nodes.push(i);
  }
  visited[0] = 1;
  hamiltonianCycle(parsedGraph, 0, 0);
  GlobalVariables.animationParamsInit();
  GlobalVariables.animationParams.start = true;
  GlobalVariables.animationParams.backendArray = steps;
  // console.log(steps);
  // MAKE THE FETCH REQUEST HERE
}
export { computeAlgo };
