import {
  ArrowDownLeftFromCircleIcon,
  ChartGantt,
  CircleX,
  Expand,
  HomeIcon,
  Palette,
  Settings,
  Workflow,
} from "lucide-react";
import { useState } from "react";

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
function Divide() {
  return <div className="self-stretch bg-stone-100 h-[1px] my-4 mx-4"></div>;
}
function Title({ Icon = <></>, title = "" }) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {Icon}
      <h1 className="text-stone-600 text-lg font-semibold">{title}</h1>
    </div>
  );
}
function Home() {
  return (
    <>
      {/* <h1 className="text-stone-600 text-lg font-semibold">Home</h1> */}
      <Title Icon={<HomeIcon size={18} />} title="Home" />
      <span className="text-stone-400 text-sm">
        Please select a page from the sidebar
      </span>
    </>
  );
}
function Nodes() {
  return (
    <>
      <Title Icon={<Palette size={18} />} title="Nodes Colors" />
      <span className="text-stone-400 text-sm">
        Select the colors for the nodes in different states from this page.
      </span>
      <div className="mx-2 mt-5 grid grid-cols-2 gap-2 self-stretch items-center justify-center">
        <div className="w-3/4 h-8 text-xs outline outline-1 outline-stone-300">
          Chagne with color filler
        </div>
        <div className="w-3/4 h-8 text-xs outline outline-1 outline-stone-300">
          Chagne with color filler
        </div>
        <div className="w-3/4 h-8 text-xs outline outline-1 outline-stone-300">
          Chagne with color filler
        </div>
        <div className="w-3/4 h-8 text-xs outline outline-1 outline-stone-300">
          Chagne with color filler
        </div>
      </div>
      <Divide />
      <Title Icon={<Expand size={18} />} title="Node Properties" />
      <span className="text-stone-400 text-sm">
        This section allows you to change the polygon count and size of Node.
      </span>
      <div className="flex flex-col gap-2 mx-2 mt-5">
        {/* // filler */}
        <div className="self-stretch h-8 outline outline-1 outline-stone-200">
          filler boxes
        </div>
      </div>
    </>
  );
}
function Animation() {
  return (
    <>
      {/* <h1 className="text-stone-600 text-lg font-semibold">Animation Pane</h1> */}
      <Title Icon={<ChartGantt size={18} />} title="Animation Pane" />
      <span className="text-stone-400 text-sm">
        Animation page is under construction
      </span>
      <Divide />
    </>
  );
}
function Forces() {
  return (
    <>
      <Title Icon={<ArrowDownLeftFromCircleIcon size={18} />} title="Forces" />
      <span className="text-stone-400 text-sm">
        Forces page is under construction
      </span>
    </>
  );
}

function SideButton({ name, icon, selected = false, onClick = () => {} }) {
  return (
    <button
      onClick={() => onClick(name)}
      className={`flex flex-row items-center gap-2 px-2 py-2 rounded-md text-sm outline outline-1 ${
        selected
          ? "text-blue-400 outline-blue-500 font-semibold hover:bg-blue-100 hover:text-blue-500 transition-colors duration-100"
          : "text-stone-400 outline-stone-400 font-medium hover:bg-stone-100 hover:text-stone-500 transition-colors duration-100"
      }`}
    >
      {icon}
      {name}
    </button>
  );
}
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
        <div className="w-full py-3 flex flex-row justify-between items-center">
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
              <SideButton
                key={page.name}
                name={page.name}
                icon={page.icon}
                selected={selectedPage === page.name}
                onClick={handleClick}
              />
            ))}
          </div>
          <div className="self-stretch bg-stone-200 w-[1px]"></div>
          <div id="details" className="flex-1 flex flex-col gap-1">
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
