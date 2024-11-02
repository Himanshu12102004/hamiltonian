import { PaintRoller } from "lucide-react";
import { Title } from "../Utils/Title";
import { useState } from "react";
import ColorInput from "../../GeneralComponents/ColorInput";
import { GlobalVariables } from "../../../Graph/GlobalVariables";
import { rgbToHex, hexToRgb } from "../../GeneralComponents/ColorHelpers";

export default function Background(): JSX.Element {
  // * Just to make this future proof instead of using single value I am adding this general function to update the value automatically
  // * You just need to add new property here
  const [Properties, setProperties] = useState([
    {
      name: "Background Color",
      color: rgbToHex(
        GlobalVariables.backgroundColor[0],
        GlobalVariables.backgroundColor[1],
        GlobalVariables.backgroundColor[2]
      ),
      opacity: 100,
      description: "Background color of drawing area.",
      GlobalVariableName: "backgroundColor",
    },
  ]);

  function setValue(name: string, color: string, opacity: number) {
    const index = Properties.findIndex((item) => item.name === name);
    const newBackgroundColor = [...Properties];
    newBackgroundColor[index] = {
      ...newBackgroundColor[index],
      color: color,
      opacity,
    };
    setProperties(newBackgroundColor);
    GlobalVariables[newBackgroundColor[index].GlobalVariableName] =
      hexToRgb(color);
  }

  return (
    <>
      <Title Icon={<PaintRoller size={18} />} title="Background" />
      <span className="text-stone-400 text-sm">
        The section allows you to change background color of the Canvas.
      </span>
      <div className="flex flex-row gap-2 items-center mx-2 mt-5">
        {Properties.map((property) => (
          <ColorInput
            key={property.name}
            name={property.name}
            values={{
              color: property.color,
              opacity: property.opacity,
            }}
            setValues={setValue}
            description={property.description}
          />
        ))}
      </div>
    </>
  );
}
