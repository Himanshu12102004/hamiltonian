// disable is lint for this file because it is a jsx file
/* eslint-disable */

const AlgoStep = ({
  stepNumber,
  fromNode,
  toNode,
  isBacktracking,
  isActive = false,
}) => {
  return (
    <div
      className={`self-stretch flex flex-col min-h-24 gap-2 m-1 flex-shrink-0 ${
        isActive ? "outline-green-300" : "outline-gray-300"
      } outline ${
        isActive ? "outline-2" : "outline-1"
      } p-3 border-r-2 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer`}
    >
      <div className="flex flex-row gap-1 items-center">
        <span className="text-md">Step: </span>
        <span className="text-md font-bold">{stepNumber}</span>
        <span className="text-sm ml-auto text-stone-400 font-medium">
          {isBacktracking ? "Backtracking" : "Exploring"}
        </span>
      </div>
      <div
        className={`flex flex-row gap-1 items-center ${
          isActive ? "bg-green-200" : "bg-gray-200"
        } rounded-xl self-stretch py-2 px-3`}
      >
        <div className="flex items-center bg-white h-8 w-8 justify-center outline outline-2 outline-gray-300 rounded-full">
          <span className="text-md font-bold">{fromNode}</span>
        </div>
        <span className="text-md font-bold">→</span>
        <div className="flex items-center bg-white h-8 w-8 justify-center outline outline-2 outline-gray-300 rounded-full">
          <span className="text-md font-bold">{toNode}</span>
        </div>
      </div>
    </div>
  );
};

export default AlgoStep;
