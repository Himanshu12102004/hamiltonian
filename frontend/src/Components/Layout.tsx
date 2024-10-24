// // disable is lint for this file because it is a jsx file
// /* eslint-disable */
import AlgoStep from "./AlgoStep";
import "../layout.css";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Settings,
  StepBack,
  StepForward,
} from "lucide-react";

function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 h-screen w-screen overflow-hidden p-3">
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
            <AlgoStep
              stepNumber={12}
              fromNode={0}
              toNode={1}
              isBacktracking={true}
              isActive={true}
            />
            <AlgoStep
              stepNumber={13}
              fromNode={1}
              toNode={2}
              isBacktracking={false}
              isActive={false}
            />
            <AlgoStep
              stepNumber={13}
              fromNode={1}
              toNode={2}
              isBacktracking={false}
              isActive={false}
            />
            <AlgoStep
              stepNumber={13}
              fromNode={1}
              toNode={2}
              isBacktracking={false}
              isActive={false}
            />
            <AlgoStep
              stepNumber={13}
              fromNode={1}
              toNode={2}
              isBacktracking={false}
              isActive={false}
            />
            <AlgoStep
              stepNumber={13}
              fromNode={1}
              toNode={2}
              isBacktracking={false}
              isActive={false}
            />
            <AlgoStep
              stepNumber={13}
              fromNode={1}
              toNode={2}
              isBacktracking={false}
              isActive={false}
            />
          </div>
          <div className="line"></div>
        </div>

        <div className="flex flex-col gap-4 h-32 bg-white p-3">
          <div className="flex items-center justify-center ml-auto outline outline-1 outline-stone-800 p-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer">
            <Settings size={20} strokeWidth={1.5} />
          </div>
          <div className="flex flex-row justify-around items-center">
            <StepBack strokeWidth={1.5} />
            <ChevronLeft strokeWidth={1.5} />
            <div className="flex items-center justify-center p-[2px] outline outline-2 outline-stone-600 rounded-lg">
              <Pause size={28} strokeWidth={1.5} />
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
