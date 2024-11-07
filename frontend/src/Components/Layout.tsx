import AlgoStep from "./AlgoStep";
import Overlay from "./Modal/Overlay";

import { TravelMode } from "../Graph/GlobalVariables";

// todo replace overlay, setOverlay and related setting with areSettingsOpen, setAreSettingsOpen
// todo proper linking of global variables with the backend

import {
  Pause,
  Settings,
  Play,
  StepBack,
  StepForward,
  Trash2,
  //   RefreshCcw,
  HelpCircle,
} from "lucide-react";

import { useRef, useState, useEffect } from "react";
import { GlobalVariables } from "../Graph/GlobalVariables";
import GraphLoading from "./Loadings/GraphLoading";
import { successStatus } from "./enums/successState";
import { useMediaQuery } from "react-responsive";

interface LayoutProps {
  children: React.ReactNode;
}

interface RequestSolutionParams {
  graph: number[][];
  startNode: number;
  query: {
    type: string;
    path: string;
    graphType: string;
  };
  signal: AbortSignal;
}

function Layout(props: LayoutProps) {
  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [startNode, setStartNode] = useState(GlobalVariables.startNode || 0);

  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<
    [number, number, TravelMode, number[], boolean][]
  >([]);
  const [paths, setPaths] = useState<number[][]>([]);
  const [completePath, setCompletePath] = useState<
    [number, number, TravelMode, number[], boolean][]
  >([]);
  // const [visibleSteps, setVisibleSteps] = useState<Step[]>([]);

  const [dropdownLength, setDropdownLength] = useState(0);

  const [abortController, setAbortController] = useState(new AbortController());

  const activeAlgoStepRef = useRef<HTMLDivElement>(null);
  const AlgoStepBoxRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowMobileOverlay(true);
    }
  }, [isMobile]);

  function hideOverlay() {
    GlobalVariables.animationParams.isAnimationPaused = false;
    setIsPaused(false);
    setAreSettingsOpen(false);
  }

  async function generateSteps() {
    setShowLoading(true);
    setDropdownLength(0);

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    GlobalVariables.animationParams.isAnimationPaused = true;
    GlobalVariables.animationParams.frontendArray = [];
    GlobalVariables.animationParams.frontendArrayPtr = -1;
    GlobalVariables.animationParams.backendArrayPtr = -1;
    GlobalVariables.animationParams.backendArray = [];
    GlobalVariables.killTimeOut();
    GlobalVariables.resetNodeStates();

    const response = await requestSolution({
      graph: GlobalVariables.graph.parseGraph(),
      startNode: startNode,
      query: {
        type: "path",
        path: "all",
        graphType: "adjacency_list",
      },
      signal: newAbortController.signal,
    });

    setSteps(response.hamiltonian_cycles.complete);
    setPaths(response.hamiltonian_cycles.paths);
    setDropdownLength(response.hamiltonian_cycles.paths.length);

    GlobalVariables.animationParams.backendArrayPtr = -1;
    setCompletePath(response.hamiltonian_cycles.complete);
    setTimeout(() => {
      setShowLoading(false);
      GlobalVariables.animationParams.isAnimationPaused = false;
      GlobalVariables.animationParams.backendArray =
        response.hamiltonian_cycles.complete;
      GlobalVariables.start();
      setIsPaused(false);
    }, 1500);
  }

  useEffect(() => {
    document.addEventListener("pointerPostion", () => {
      setCurrentStep(GlobalVariables.animationParams.backendArrayPtr);
      AlgoStepBoxRef.current?.scrollTo({
        top: (activeAlgoStepRef.current?.offsetTop || 0) - 175,
        behavior: "smooth",
      });
      if (
        GlobalVariables.animationParams.backendArrayPtr === 0 ||
        GlobalVariables.animationParams.backendArrayPtr === -1
      ) {
        AlgoStepBoxRef.current?.scrollTo({
          top: 0,
          behavior: "instant",
        });
      }

      if (
        GlobalVariables.animationParams.backendArrayPtr ===
        GlobalVariables.animationParams.backendArray.length
      ) {
        GlobalVariables.animationParams.start = false;
        GlobalVariables.resetNodeStates();
        setIsPaused(true);
      }
    });
  }, []);

  // useEffect(() => {
  //   if(visibleSteps[visibleSteps]) {

  //     const twenty_steps = steps.filter((_, i) => {
  //       if (i < currentStep + 20) return true;
  //       return false;
  //     });

  //     setVisibleSteps(twenty_steps);
  //   }
  // }, [currentStep]);

  return (
    <div className="flex flex-col sm:flex-row relative gap-3 h-screen w-screen overflow-y-scroll sm:overflow-hidden p-3">
      {showMobileOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              Better Experience on Desktop
            </h2>
            <p className="mb-4">
              For the best user experience, please use a desktop device.
            </p>
            <button
              onClick={() => setShowMobileOverlay(false)}
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
      {showLoading && (
        <GraphLoading
          socketKey="HamiltonianCycle"
          onClose={() => {
            setTimeout(() => {
              setShowLoading(false);
              GlobalVariables.start();
            }, 1500);
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
            setCompletePath([]);
            setDropdownLength(0);
            GlobalVariables.reset();
            setShowLoading(false);
          }}
          className="flex items-center justify-end gap-2 bg-white shadow-xl shadow-neutral-300 px-5 py-3 rounded-full hover:bg-stone-100 cursor-pointer hover:translate-x-14 transition-all"
        >
          <Trash2 size={20} strokeWidth={1.5} />
          <span className="w-20 text-stone-800 text-sm select-none">
            Clear All
          </span>
        </div>
        <div
          className="flex relative items-center justify-end gap-2 bg-white shadow-xl shadow-neutral-300 px-5 py-3 rounded-full hover:bg-stone-100 cursor-pointer hover:translate-x-14 transition-all"
          onClick={() => {
            GlobalVariables.animationParams.isAnimationPaused = true;
            setIsPaused(true);
            setAreSettingsOpen((prev) => !prev);
          }}
        >
          <div className="h-full w-12"></div>
          <Settings size={20} strokeWidth={1.5} />
          <span className="w-20 text-stone-800 text-sm select-none">
            Settings{" "}
          </span>
        </div>
        <div
          className="flex relative items-center justify-end gap-2 bg-white shadow-xl shadow-neutral-300 px-5 py-3 rounded-full hover:bg-stone-100 cursor-pointer hover:translate-x-14 transition-all"
          onClick={() => setIsHelpOpen((prev) => !prev)}
        >
          <div className="h-full w-12"></div>
          <HelpCircle size={20} strokeWidth={1.5} />
          <span className="w-20 text-stone-800 text-sm select-none">
            Need Help
          </span>
        </div>
      </div>
      {areSettingsOpen && <Overlay hideOverlay={hideOverlay} />}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-3xl font-bold mb-4">Help</h2>
            <p className="text-left mb-4">
              Steps to create a cycle:
              <ol className="list-decimal list-inside text-left mt-2 space-y-2">
                <li>Click on canvas to add nodes.</li>
                <li>
                  Hold a node and connect to another node to make an edge,
                  repeat the process to make a graph.
                </li>
                <li>
                  General instruction: don't make a highly connected graph.
                </li>
                <li>
                  Click on "Generate Graph" to make the graph and start the
                  animation.
                </li>
                <li>
                  Use the pause and forward buttons to control the animation.
                </li>
                <li>
                  You can select a path to animate from the dropdown menu.
                </li>
                <li>
                  Click on "Settings" to control various properties about the
                  canvas, animation, UI, etc.
                </li>
              </ol>
            </p>
            <button
              onClick={() => setIsHelpOpen(false)}
              className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="h-[80vh] sm:h-full flex-1" id="canvas_parent">
        {props.children}
      </div>
      <div className="flex w-auto sm:self-stretch md:self-start flex-col gap-2 shrink-0 sm:w-80 h-full">
        <div className="divide-y-2 flex flex-col gap-2 h-full bg-white p-3 overflow-hidden">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Steps</h1>
            <span className="text-md">
              This section will show the steps of the algorithm
            </span>
          </div>
          <select
            disabled={dropdownLength === 0}
            onChange={async (e) => {
              const pathNumber = parseInt(e.target.value);
              console.log(pathNumber);
              const newAbortController = new AbortController();

              GlobalVariables.animationParams.frontendArray = [];
              GlobalVariables.animationParams.frontendArrayPtr = -1;
              GlobalVariables.animationParams.backendArrayPtr = -1;
              GlobalVariables.animationParams.start = true;
              GlobalVariables.resetNodeStates();
              GlobalVariables.killTimeOut();
              if (pathNumber === -1) {
                setSteps(completePath);
                GlobalVariables.animationParams.backendArray = completePath;
              } else {
                const stepsArray: [
                  number,
                  number,
                  TravelMode,
                  number[],
                  boolean
                ][] = [];
                for (let i = 0; i < paths[pathNumber].length; i++) {
                  stepsArray.push(completePath[paths[pathNumber][i]]);
                }
                setSteps(stepsArray);
                GlobalVariables.animationParams.backendArray = stepsArray;
                GlobalVariables.start();
              }
              setAbortController(newAbortController);
            }}
            className="self-stretch py-2 px-3 h-fit bg-white outline outline-1 rounded-md outline-gray-300"
          >
            <option value={-1} disabled={dropdownLength === 0}>
              Complete Path
            </option>

            {Array.from({ length: dropdownLength }, (_, i) => (
              <option key={i} value={i}>
                Path {i + 1}
              </option>
            ))}
          </select>
          <div className="flex flex-col gap-2 pt-4 pb-2">
            <div className="flex flex-row gap-4 items-center">
              <span className="text-md text-stone-600">Start Node</span>
              <input
                type="number"
                value={startNode}
                onChange={(e) => {
                  GlobalVariables.startNode = parseInt(e.target.value);
                  setStartNode(parseInt(e.target.value));
                }}
                className="flex-1 h-10 text-center border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={generateSteps}
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Generate Steps
            </button>
          </div>
          <div
            ref={AlgoStepBoxRef}
            className="flex flex-col gap-2 overflow-auto max-h-full py-4"
          >
            {steps.length ? (
              steps.map((step, index) => (
                <AlgoStep
                  className="null"
                  key={index + "step"}
                  ref={
                    currentStep === index
                      ? activeAlgoStepRef
                      : { current: null }
                  }
                  stepNumber={index + 1}
                  fromNode={step[2] === 1 ? step[1] : step[0]}
                  toNode={step[2] === 1 ? step[0] : step[1]}
                  action={
                    step[2] === 0
                      ? "Exploring"
                      : step[2] === 1
                      ? "Backtracking"
                      : step[4]
                      ? "Solution Found"
                      : "Solution Not Found"
                  }
                  isActive={currentStep === index}
                  sucessState={
                    step[0] === -1
                      ? step[4]
                        ? successStatus.success
                        : successStatus.fail
                      : successStatus.neutral
                  }
                />
              ))
            ) : (
              <p className="text-center">No steps available</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 h-fit py-4 bg-white p-3">
          <div className="flex flex-row justify-around items-center">
            <StepBack
              strokeWidth={1.5}
              className="stroke-slate-500 cursor-not-allowed"
            />
            <div
              onClick={() => {
                setIsPaused((prev) => !prev);
                GlobalVariables.animationParams.isAnimationPaused = !isPaused;
              }}
              className="flex items-center justify-center p-[4px] outline outline-2 outline-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {/* {showReload ? (
                <RefreshCcw size={28} strokeWidth={1.25} /> : */}
              {isPaused ? (
                <Play size={28} strokeWidth={1.25} />
              ) : (
                <Pause size={28} strokeWidth={1.25} />
              )}
            </div>
            <StepForward
              strokeWidth={1.5}
              onClick={() => {
                GlobalVariables.fastForward();
              }}
              className="stroke-slate-500 cursor-pointer hover:stroke-slate-800 tarnsition-all"
            />
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
}: RequestSolutionParams) {
  const URL = `http://localhost:5001/api/v1/hamiltonian-cycle?type=${type}&path=${path}&graph_type=${graphType}`;
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      graph: graph,
      startNode,
    }),
    signal,
  });

  const data = await response.json();
  return data;
}

export default Layout;
