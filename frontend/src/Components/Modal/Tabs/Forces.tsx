import { useState } from "react";

import {
  ArrowDownLeftFromCircleIcon,
  BicepsFlexed,
  Droplets,
  TrainFront,
} from "lucide-react";

import Slider from "../../GeneralComponents/Slider";

import { Divide } from "../Utils/Divide";
import { Title } from "../Utils/Title";
import { GlobalVariables } from "../../../Graph/GlobalVariables";

function Forces(): JSX.Element {
  const [sliders, setSliders] = useState([
    {
      name: "Repulsion",
      value: GlobalVariables.gravitationalConstant,
      min: 0,
      max: 100,
      step: 1,
      icon: <BicepsFlexed className="stroke-1" size={18} />,
      description: "Repulsion force",
      globalVariableName: "gravitationalConstant",
    },
    {
      name: "Viscosity",
      value: GlobalVariables.viscosity,
      min: 0,
      max: 100,
      step: 1,
      icon: <Droplets className="stroke-1" size={18} />,
      description: "Viscosity force",
      globalVariableName: "viscosity",
    },
    {
      name: "Distance",
      value: GlobalVariables.distancePropotionality,
      min: 0,
      max: 5,
      step: 0.5,
      icon: <TrainFront className="stroke-1" size={18} />,
      description: "Distance force",
      globalVariableName: "distancePropotionality",
    },
  ]);

  function setSliderValues(name: string, value: number) {
    setSliders((prev) => {
      const values = [...prev];
      const findVal = values.find((slider) => slider.name === name);
      if (!findVal) return values;

      findVal.value = value;
      const globalName = findVal.globalVariableName;
      // @ts-expect-error This line is added to make the code dynamic
      GlobalVariables[globalName] = value;
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

export default Forces;
