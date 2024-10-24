// disable is lint for this file because it is a jsx file
/* eslint-disable */
import AlgoStep from "./AlgoStep";
import "../layout.css";

function Layout(props) {
  return (
    <div className="flex gap-3 h-screen w-screen overflow-hidden p-3">
      <div className="content">{props.children}</div>
      <div className="flex flex-col gap-2 shrink-0 w-80 h-full">
        <div className="flex flex-col gap-2 h-full bg-white p-3">
          <div className="heading">
            <h1 className="text-2xl font-bold">Steps</h1>
            <span className="text-md">
              This section will show the steps of the algorithm
            </span>
          </div>
          <div className="line"></div>
          <div className="steps">
            <AlgoStep
              stepNumber={12}
              fromNode={0}
              toNode={1}
              isBacktracking={true}
            />
          </div>
        </div>
        <div className="controls"></div>
      </div>
    </div>
  );
}

export default Layout;
