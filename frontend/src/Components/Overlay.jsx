import {
  ArrowDownLeftFromCircleIcon,
  ArrowUp01,
  BicepsFlexed,
  ChartGantt,
  CircleX,
  Droplets,
  Expand,
  HomeIcon,
  Palette,
  Radius,
  Settings,
  TrainFront,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import ColorInput from "./GeneralComponents/ColorInput";
import Slider from "./GeneralComponents/Slider";

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

const colors = [
  {
    name: "Clicked",
    color: "#146FF9",
    opacity: 100,
    description: "Color of the node when clicked",
    globalVariableName: "test",
  },
  {
    name: "In Visinity",
    color: "#34D399",
    opacity: 100,
    description: "Color of the node when in the visinity",
    globalVariableName: "test",
  },
  {
    name: "Accepted",
    color: "#25DD91",
    opacity: 100,
    description: "Color of the node when accepted",
    globalVariableName: "test",
  },
  {
    name: "Rejected",
    color: "#FF3E3E",
    opacity: 100,
    description: "Color of the node when rejected",
    globalVariableName: "test",
  },
  {
    name: "Selected",
    color: "#D1D5DB",
    opacity: 100,
    description: "Default color of the node",
    globalVariableName: "test",
  },
  {
    name: "Connected",
    color: "#2563EB",
    opacity: 100,
    description: "Color of the node when connected",
    globalVariableName: "test",
  },
  {
    name: "Normal",
    color: "#BDBDBD",
    opacity: 100,
    description: "Color of node that is not connected",
    globalVariableName: "test",
  },
  {
    name: "Visited",
    color: "#D97706",
    opacity: 100,
    description: "Color of the node when visited",
    globalVariableName: "test",
  },
];

function Nodes() {
  const [colorValues, setColorValues] = useState(colors);
  const [sliders, setSliders] = useState([
    {
      name: "Polygon Count",
      value: 3,
      min: 3,
      max: 100,
      step: 1,
      icon: <ArrowUp01 className="stroke-1" size={18} />,
      description: "Number of polygons in the node",
    },
    {
      name: "Node Size",
      value: 50,
      min: 0,
      max: 100,
      step: 0.1,
      icon: <Radius className="stroke-1" size={18} />,
      description: "Size of the node",
    },
  ]);

  function setSliderValues(name, value) {
    setSliders((prev) => {
      const values = [...prev];
      values.find((slider) => slider.name === name).value = value;
      return values;
    });
  }

  function setValues(name, color, opacity) {
    setColorValues((prev) =>
      prev.map((value) =>
        value.name === name ? { ...value, color, opacity } : value
      )
    );
  }
  return (
    <>
      <Title Icon={<Palette size={18} />} title="Nodes Colors" />
      <span className="text-stone-400 text-sm">
        Select the colors for the nodes in different states from this page.
      </span>
      <div className="mx-2 mt-5 grid grid-cols-2 gap-2 gap-x-8 self-stretch  justify-center">
        {colorValues.map((color) => (
          <ColorInput
            key={color.name}
            name={color.name}
            values={{ color: color.color, opacity: color.opacity }}
            setValues={setValues}
            description={color.description}
          />
        ))}
      </div>
      <Divide />
      <Title Icon={<Expand size={18} />} title="Node Properties" />
      <span className="text-stone-400 text-sm">
        This section allows you to change the polygon count and size of Node.
      </span>
      <div className="flex flex-col gap-2 mx-2 mt-5">
        {sliders.map((slider) => (
          <Slider
            key={slider.name}
            name={slider.name}
            value={slider.value}
            min={slider.min}
            max={slider.max}
            icon={slider.icon}
            step={slider.step}
            setValue={setSliderValues}
            description={slider.description}
          />
        ))}
      </div>
    </>
  );
}
function Animation() {
  const [animationSpeed, setAnimationSpeed] = useState({
    value: 0.0001,
    name: "Animation Speed",
    min: 0.0001,
    max: 0.005,
    step: 0.0001,
    icon: <ChartGantt size={18} className="stroke-1" />,
    description: "Speed of the animation",
  });
  function setAnimationSpeedSlider(name, value) {
    setAnimationSpeed((prev) => ({ ...prev, value }));
  }
  return (
    <>
      <Title Icon={<ChartGantt size={18} />} title="Animation Pane" />
      <span className="text-stone-400 text-sm">
        This section allows you to change the speed of the animation.
      </span>
      <div className="flex flex-row gap-2 items-center mx-2 mt-5">
        <Slider
          name={animationSpeed.name}
          value={animationSpeed.value}
          min={animationSpeed.min}
          max={animationSpeed.max}
          icon={animationSpeed.icon}
          step={animationSpeed.step}
          setValue={setAnimationSpeedSlider}
          description={animationSpeed.description}
        />
      </div>
      <Divide />
    </>
  );
}
function Forces() {
  const [sliders, setSliders] = useState([
    {
      name: "Gravitation",
      value: 10,
      min: 0,
      max: 100,
      step: 1,
      icon: <BicepsFlexed className="stroke-1" size={18} />,
      description: "Gravitation force",
    },
    {
      name: "Viscosity",
      value: 20,
      min: 0,
      max: 100,
      step: 1,
      icon: <Droplets className="stroke-1" size={18} />,
      description: "Viscosity force",
    },
    {
      name: "Distance",
      value: 2,
      min: 0,
      max: 5,
      step: 0.5,
      icon: <TrainFront className="stroke-1" size={18} />,
      description: "Distance force",
    },
  ]);

  function setSliderValues(name, value) {
    setSliders((prev) => {
      const values = [...prev];
      values.find((slider) => slider.name === name).value = value;
      return values;
    });
  }
  return (
    <>
      <Title Icon={<ArrowDownLeftFromCircleIcon size={18} />} title="Forces" />
      <span className="text-stone-400 text-sm">
        This section allows you to change the forces of the animation.
      </span>
      <div className="flex flex-col gap-2 mx-2 mt-5">
        {sliders.map((slider) => (
          <Slider
            key={slider.name}
            name={slider.name}
            value={slider.value}
            min={slider.min}
            max={slider.max}
            icon={slider.icon}
            step={slider.step}
            setValue={setSliderValues}
            description={slider.description}
          />
        ))}
      </div>
      <Divide />
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
