import {
  ArrowDownLeftFromCircleIcon,
  ChartGantt,
  CircleX,
  HomeIcon,
  Settings,
  Workflow,
} from "lucide-react";

import { useState } from "react";

import { ModalSideButton } from "./Utils/ModalSideButton";

import Animation from "./Tabs/Animation";
import Forces from "./Tabs/Forces";
import Home from "./Tabs/Home";
import Nodes from "./Tabs/Nodes";

const pages = [
  {
    name: "Home",
    icon: <HomeIcon size={18} />,
  },
  {
    name: "Nodes",
    icon: <Workflow size={18} />,
  },
  {
    name: "Animation",
    icon: <ChartGantt size={18} />,
  },
  {
    name: "Forces",
    icon: <ArrowDownLeftFromCircleIcon size={18} />,
  },
];

export default function Overlay({ hideOverlay = () => {} }) {
  const [selectedPage, setSelectedPage] = useState("Home");
  function handleClick(name) {
    setSelectedPage(name);
  }
  return (
    <div
      onClick={hideOverlay}
      className="fixed top-3 left-3 right-3 bottom-3 backdrop-blur-sm bg-blue-400/30 z-20 flex items-center justify-center animate-grow"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="px-4 pb-4 rounded-md w-1/2 h-3/5 bg-white shadow-xl flex flex-col overflow-hidden"
      >
        <div className="w-full py-3 flex flex-row justify-between items-center ">
          <div className="flex flex-row items-center gap-2">
            <Settings size={16} className="stroke-stone-6" />
            <span className="text-sm font-semibold text-stone-6">
              Settings | {selectedPage}
            </span>
          </div>
          <CircleX
            size={18}
            className="stroke-red-600 cursor-pointer"
            onClick={hideOverlay}
          />
        </div>
        <div className="w-full bg-stone-200 h-[1px]"></div>
        <div
          id="content"
          className="flex flex-row gap-4 mt-4 flex-1 overflow-hidden"
        >
          <div
            id="navigation"
            className="w-1/4 flex flex-col gap-3 max-h-full overflow-y-scroll p-1"
          >
            {pages.map((page) => (
              <ModalSideButton
                key={page.name}
                name={page.name}
                icon={page.icon}
                selected={selectedPage === page.name}
                onClick={handleClick}
              />
            ))}
          </div>
          <div className="self-stretch bg-stone-200 w-[1px]"></div>
          <div
            id="details"
            className="flex-1 flex flex-col gap-1 max-h-full overflow-scroll"
          >
            {selectedPage === "Home" && <Home />}
            {selectedPage === "Nodes" && <Nodes />}
            {selectedPage === "Animation" && <Animation />}
            {selectedPage === "Forces" && <Forces />}
          </div>
        </div>
      </div>
    </div>
  );
}
