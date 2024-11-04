import AlgoStep from "./AlgoStep";
import Overlay from "./Modal/Overlay";

import "../layout.css";

// todo replace overlay, setOverlay and related setting with areSettingsOpen, setAreSettingsOpen
// todo proper linking of global variables with the backend

import {
  Pause,
  Settings,
  Play,
  StepBack,
  StepForward,
  Trash2,
} from "lucide-react";

import { useState } from "react";
import { GlobalVariables } from "../Graph/GlobalVariables";
import GraphLoading from "./Loadings/GraphLoading";
import AdjacencyGraphToMatrixGraph from "./temp_util/adj_graph_to_matrix";

function Layout(props) {
  const [overlay, setOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  const [paths, setPaths] = useState([]);
  const [dropdownLength, setDropdownLength] = useState(0);
  const [abortController, setAbortController] = useState(new AbortController());

  const [steps, setSteps] = useState([]);

  function hideOverlay() {
    setOverlay(false);
  }

  async function generateSteps() {
    setShowLoading(true);
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    const response = await requestSolution({
      graph: GlobalVariables.graph.parseGraph(),
      startNode: 0,
      query: {
        type: "path",
        path: "all",
        graphType: "matrix_graph",
      },
      signal: newAbortController.signal,
    });
    setSteps(response.hamiltonian_cycles.complete);
    setPaths(response.hamiltonian_cycles.paths);
    setDropdownLength(response.hamiltonian_cycles.paths.length);

    setTimeout(() => {
      setShowLoading(false);
      GlobalVariables.start();
    }, 3000);

    GlobalVariables.animationParams.backendArray =
      response.hamiltonian_cycles.complete;

    GlobalVariables.animationParams.isAnimationPaused = false;
    GlobalVariables.animationParams.backendArrayPtr = -1;
  }

  return (
    <div className="flex relative gap-3 h-screen w-screen overflow-hidden p-3">
      {showLoading && (
        <GraphLoading
          onClose={() => {
            setTimeout(() => {
              setShowLoading(false);
              GlobalVariables.start();
            }, 3000);
          }}
          abortController={abortController}
        />
      )}
      <div className="absolute top-6 -translate-x-28 roundedshadow-2xl shadow-slate-100 flex flex-col gap-4 justify-between self-stretch">
        <div
          onClick={() => {
            setShowLoading(true);
            setSteps([]);
            setPaths([]);
            setDropdownLength(0);
            GlobalVariables.reset();
            setShowLoading(false);
          }}
          className="flex items-center justify-end gap-2 bg-white shadow-xl shadow-neutral-300 px-5 py-3 rounded-full hover:bg-stone-100 cursor-pointer hover:translate-x-14 transition-all"
        >
          <Trash2 size={20} strokeWidth={1.5} />
          <span className="text-stone-800 text-sm select-none">Clear All</span>
        </div>
        <div
          className="flex relative items-center justify-end gap-2 bg-white shadow-xl shadow-neutral-300 px-5 py-3 rounded-full hover:bg-stone-100 cursor-pointer hover:translate-x-14 transition-all"
          onClick={() => setOverlay((prev) => !prev)}
        >
          <div className="h-full w-12"></div>
          <Settings size={20} strokeWidth={1.5} />
          <span className="text-stone-800 text-sm select-none">Settings</span>
        </div>
      </div>
      {overlay && <Overlay hideOverlay={hideOverlay} />}
      <div className="content" id="canvas_parent">
        {props.children}
      </div>
      <div className="flex flex-col gap-2 shrink-0 w-80 h-full">
        <div className="flex flex-col gap-2 h-full bg-white p-3 overflow-hidden">
          <div className="heading">
            <h1 className="text-2xl font-bold">Steps</h1>
            <span className="text-md">
              This section will show the steps of the algorithm
            </span>
          </div>
          <div className="line"></div>
          <select
            disabled={dropdownLength === 0}
            onChange={async (e) => {
              setShowLoading(true);
              const pathNumber = parseInt(e.target.value);
              const newAbortController = new AbortController();
              setAbortController(newAbortController);
              let response;
              if (pathNumber === -1) {
                response = await requestSolution({
                  graph: GlobalVariables.graph.parseGraph(),
                  startNode: 0,
                  query: {
                    type: "path",
                    path: "all",
                    graphType: "matrix_graph",
                  },
                  signal: newAbortController.signal,
                });
                setSteps(response.hamiltonian_cycles.complete);
                GlobalVariables.animationParams.backendArray =
                  response.hamiltonian_cycles.complete;
              } else if (paths.length === 0) {
                response = await requestSolution({
                  graph: GlobalVariables.graph.parseGraph(),
                  startNode: 0,
                  query: {
                    type: "path",
                    path: pathNumber,
                    graphType: "matrix_graph",
                  },
                  signal: newAbortController.signal,
                });
                setSteps(response.hamiltonian_cycles.nth_path);
                GlobalVariables.animationParams.backendArray =
                  response.hamiltonian_cycles.nth_path;
              } else {
                if (pathNumber > paths.length || pathNumber < 0) return;
                response = paths[pathNumber];
                setSteps(response);
                GlobalVariables.animationParams.backendArray = response;
              }
              GlobalVariables.animationParams.backendArrayPtr = -1;

              GlobalVariables.animationParams.frontendArray = [];
              GlobalVariables.animationParams.isAnimationPaused = false;

              GlobalVariables.resetNodeStates();
              GlobalVariables.killTimeOut();
              GlobalVariables.animationParams.backendArrayPtr = -1;
              GlobalVariables.animationParams.frontendArrayPtr = -1;

              setTimeout(() => {
                setShowLoading(false);
                GlobalVariables.start();
              }, 3000);
            }}
            className="self-stretch py-2 px-3 h-fit bg-white outline outline-1 rounded-md outline-gray-300"
          >
            <option value={-1}>Complete Path</option>
            {Array.from({ length: dropdownLength }, (_, i) => (
              <option value={i}>Path {i + 1}</option>
            ))}
          </select>
          <div className="divide-y-2"></div>
          <div className="flex flex-col gap-2 overflow-auto max-h-full">
            {steps.length ? (
              steps.map((step, index) => (
                <AlgoStep
                  stepNumber={index}
                  fromNode={step[0]}
                  toNode={step[1]}
                  isBacktracking={step[2] === 1}
                  isActive={false}
                />
              ))
            ) : (
              <>
                <p className="text-center">No steps available</p>
                <button
                  onClick={generateSteps}
                  className="self-center py-2 px-4 bg-blue-500 text-white rounded-md"
                >
                  Generate Steps
                </button>
              </>
            )}
          </div>
          <div className="line"></div>
        </div>

        <div className="flex flex-col gap-4 h-fit py-4 bg-white p-3">
          <div className="flex flex-row justify-around items-center">
            <StepBack strokeWidth={1.5} className="stroke-slate-500" />
            <div
              onClick={() => {
                setIsPaused((prev) => !prev);
                GlobalVariables.animationParams.isAnimationPaused = !isPaused;
              }}
              className="flex items-center justify-center p-[4px] outline outline-2 outline-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {isPaused ? (
                <Play size={28} strokeWidth={1.25} />
              ) : (
                <Pause size={28} strokeWidth={1.25} />
              )}
            </div>
            <StepForward strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function requestSolution({
  graph,
  startNode,
  query: { type, path, graphType },
  signal,
}) {
  const URL = `http://localhost:5000/api/v1/hamiltonian-cycle?type=${type}&path=${path}&graph_type=${graphType}`;
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      graph: AdjacencyGraphToMatrixGraph(graph),
      startNode,
    }),
    signal,
  });

  const data = await response.json();
  return data;
}

export default Layout;
