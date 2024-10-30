import AlgoStep from "./AlgoStep";
import Overlay from "./Modal/Overlay";

import "../layout.css";

// todo replace overlay, setOverlay and related setting with areSettingsOpen, setAreSettingsOpen
// todo proper linking of global variables with the backend
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Settings,
  Play,
  StepBack,
  StepForward,
} from "lucide-react";

import { useState } from "react";
import { GlobalVariables } from "../Graph/GlobalVariables";

function Layout(props: { children: React.ReactNode }): JSX.Element {
  const [overlay, setOverlay] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [steps, setSteps] = useState(
    [] as [number, number, number, number[], boolean][]
  );

  function hideOverlay(): void {
    setOverlay(false);
  }

  return (
    <div className="flex relative gap-3 h-screen w-screen overflow-hidden p-3">
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
          <select className="self-stretch py-2 px-3 h-fit bg-white outline outline-1 rounded-md outline-gray-300">
            <option value={0}>Path 0</option>
            <option value={1}>Path 1</option>
            <option value={2}>Path 2</option>
            <option value={3}>Path 3</option>
            <option value={4}>Path 4</option>
          </select>
          <div className="divide-y-2"></div>
          <div className="flex flex-col gap-2 overflow-auto max-h-full">
            {steps.length ? (
              steps.map((step, index) => {
                let motion;
                switch (step[2]) {
                  case 0:
                    motion = "forward";
                    break;
                  case 1:
                    motion = "backtrack";
                    break;
                  case 2:
                    motion = "pause";
                    break;
                  default:
                    motion = "forward";
                }
                return (
                  <AlgoStep
                    stepNumber={index}
                    fromNode={step[0]}
                    toNode={step[1]}
                    isBacktracking={motion}
                    isActive={false}
                  />
                );
              })
            ) : (
              <p className="text-center">No steps available</p>
            )}
          </div>
          <div className="line"></div>
        </div>

        <div className="flex flex-col gap-4 h-32 bg-white p-3">
          <div
            onClick={() => setOverlay((prev) => !prev)}
            className="flex items-center justify-center ml-auto outline outline-1 outline-stone-800 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Settings size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-row justify-around items-center">
            <StepBack strokeWidth={1.5} />
            <ChevronLeft strokeWidth={1.5} />
            <div
              onClick={() => {
                if (!GlobalVariables.animationParams.start) {
                  setSteps(GlobalVariables.animationParams.backendArray);
                  GlobalVariables.animationParams.start = true;
                  return;
                }

                setIsPaused((prev) => {
                  GlobalVariables.animationParams.isAnimationPaused = !prev;
                  return !prev;
                });
              }}
              className="flex items-center justify-center p-[4px] outline outline-2 outline-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {isPaused ? (
                <Play size={28} strokeWidth={1.25} />
              ) : (
                <Pause size={28} strokeWidth={1.25} />
              )}
            </div>
            <ChevronRight strokeWidth={1.5} />
            <StepForward strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
