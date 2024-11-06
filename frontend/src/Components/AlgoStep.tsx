import { successStatus } from "./enums/successState";

// const AlgoStep = ({
//   stepNumber
//   fromNode,
//   toNode,
//   isBacktracking,
//   isActive = false,
// }) => {

function AlgoStep({
  stepNumber,
  fromNode,
  toNode,
  action,
  isActive = false,
  sucessState = successStatus.neutral,
}: {
  stepNumber: number;
  fromNode: number;
  toNode: number;
  action: string;
  isActive: boolean;
  sucessState: successStatus;
}): JSX.Element {
  console.log("isActive", isActive);
  console.log("sucessStatus", sucessState);

  const boxColor = () => {
    // total six colors for the box
    // based on isActive and successStatus
    // priority -> successStatus.success > successStatus.fail > isActive.true > successStatus.neutral > isActive.false

    if (sucessState === successStatus.success) {
      return "bg-green-200";
    } else if (sucessState === successStatus.fail) {
      return "bg-red-200";
    } else if (isActive) {
      return "bg-blue-200";
    } else if (sucessState === successStatus.neutral) {
      return "bg-white outline outline-1 outline-gray-300";
    } else {
      return "bg-gray";
    }
  };

  const innerBoxColor = () => {
    if (sucessState === successStatus.success) {
      return "bg-green-300";
    } else if (sucessState === successStatus.fail) {
      return "bg-red-300";
    } else if (isActive) {
      return "bg-blue-300";
    } else if (sucessState === successStatus.neutral) {
      return "bg-gray-200";
    } else {
      return "bg-gray-300";
    }
  };

  return (
    <div
      className={`px-2 py-3 rounded-md self-stretch flex flex-col min-h-24 gap-2 m-1 flex-shrink-0 ${boxColor()}`}
    >
      <div className="flex flex-row gap-1 items-center">
        <span className="text-md">Step: </span>
        <span className="text-md font-bold">{stepNumber}</span>
        <span className="text-sm ml-auto text-stone-400 font-medium">
          {action}
        </span>
      </div>
      <div
        className={`flex flex-row gap-1 items-center ${innerBoxColor()} rounded-xl self-stretch py-2 px-3`}
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
}

export default AlgoStep;
