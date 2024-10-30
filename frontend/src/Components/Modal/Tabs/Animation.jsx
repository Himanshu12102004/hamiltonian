import { useState } from "react";

import { ChartGantt } from "lucide-react";

import Slider from "../../GeneralComponents/Slider";

import { Divide } from "../Utils/Divide";
import { Title } from "../Utils/Title";
import { GlobalVariables } from "../../../Graph/GlobalVariables";

function Animation() {
  const [animationSpeed, setAnimationSpeed] = useState({
    value: 0.0001,
    name: "Animation Speed",
    min: 0.0001,
    max: 0.005,
    step: 0.0001,
    icon: <ChartGantt size={18} className="stroke-1" />,
    description: "Speed of the animation",
    globalVariableName: "speed",
  });
  function setAnimationSpeedSlider(name, value) {
    setAnimationSpeed((prev) => ({ ...prev, value }));
    GlobalVariables.animationParams.speed = value;
  }
  return (
    <>
      <Title Icon={<ChartGantt size={18} />} title="Animation Pane" />
      <span className="text-stone-400 text-sm">
        This section allows you to change the speed of the animation.
      </span>
      ``
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

export default Animation;
