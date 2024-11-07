import { useState } from "react";

import { ArrowUp01, Radius, Palette, Expand } from "lucide-react";

import ColorInput from "../../GeneralComponents/ColorInput.tsx";
import Slider from "../../GeneralComponents/Slider.tsx";

import { hexToRgb, rgbToHex } from "../../GeneralComponents/ColorHelpers.tsx";
import { GlobalVariables } from "../../../Graph/GlobalVariables.ts";
import { Divide } from "../Utils/Divide.tsx";
import { Title } from "../Utils/Title.tsx";

function Nodes() {
  const [colorValues, setColorValues] = useState([
    {
      name: "Clicked",
      color: GlobalVariables.nodeColors[0],
      opacity: 100,
      description: "Color of the node when clicked",
      globalVariableName: "test",
    },
    {
      name: "In Visinity",
      color: GlobalVariables.nodeColors[1],
      opacity: 100,
      description: "Color of the node when in the visinity",
      globalVariableName: "test",
    },
    {
      name: "Visited",
      color: GlobalVariables.nodeColors[2],
      opacity: 100,
      description: "Color of the node when visited",
      globalVariableName: "test",
    },
    {
      name: "Accepted",
      color: GlobalVariables.nodeColors[3],
      opacity: 100,
      description: "Color of the node when accepted",
      globalVariableName: "test",
    },
    {
      name: "Rejected",
      color: GlobalVariables.nodeColors[4],
      opacity: 100,
      description: "Color of the node when rejected",
      globalVariableName: "test",
    },
    {
      name: "Selected",
      color: GlobalVariables.nodeColors[5],
      opacity: 100,
      description: "Default color of the node",
      globalVariableName: "test",
    },
    {
      name: "Connected",
      color: GlobalVariables.nodeColors[6],
      opacity: 100,
      description: "Color of the node when connected",
      globalVariableName: "test",
    },
    {
      name: "Normal",
      color: GlobalVariables.nodeColors[7],
      opacity: 100,
      description: "Color of node that is not connected",
      globalVariableName: "test",
    },
  ]);
  const [sliders, setSliders] = useState([
    {
      name: "Polygon Count",
      value: GlobalVariables.noOfTriangles,
      min: 3,
      max: 100,
      step: 1,
      icon: <ArrowUp01 className="stroke-1" size={18} />,
      description: "Number of polygons in the node",
      globalVariableName: "noOfTriangles",
    },
    {
      name: "Node Size",
      value: GlobalVariables.nodeRadius,
      min: 0,
      max: 30,
      step: 0.1,
      icon: <Radius className="stroke-1" size={18} />,
      description: "Size of the node",
      globalVariableName: "nodeRadius",
    },
  ]);
  function setSliderValues(name: string, value: number) {
    const index = sliders.findIndex((slider) => slider.name === name);
    const values = [...sliders];
    values[index] = { ...values[index], value };
    setSliders(values);
    // @ts-expect-error This line is added to make the code dynamic
    GlobalVariables[sliders[index].globalVariableName] = value;
  }

  function setValues(name: string, color: string, opacity: number) {
    const index = colorValues.findIndex((value) => value.name === name);
    const values = [...colorValues];
    values[index] = { ...values[index], color: hexToRgb(color), opacity };
    setColorValues(values);

    GlobalVariables.nodeColors[index] = hexToRgb(color);
  }
  return (
    <>
      <Title Icon={<Palette size={18} />} title="Nodes Colors" />
      <span className="text-stone-400 text-sm">
        Select the colors for the nodes in different states from this page.
      </span>
      <div className="mx-2 mt-5 grid grid-cols-2 gap-2 gap-x-8 self-stretch justify-center">
        {colorValues.map((color) => (
          <ColorInput
            key={color.name}
            name={color.name}
            values={{
              color: rgbToHex(color.color[0], color.color[1], color.color[2]),
              opacity: color.opacity,
            }}
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

export default Nodes;
