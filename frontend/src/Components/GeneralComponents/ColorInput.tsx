import { useEffect, useRef } from "react";
import { useState } from "react";
import ColorPicker from "./ColorPicker";
import { Info } from "lucide-react";

export default function ColorInput({
  name = "Color Input",
  description = "Color Input",
  values = { color: "#146FF9", opacity: 100 },
  setValues = () => {},
}: {
  name?: string;
  description?: string;
  values?: { color: string; opacity: number };
  setValues?: (name: string, color: string, opacity: number) => void;
}) {
  const opacityRef = useRef(document.createElement("input") as HTMLInputElement); // prettier-ignore
  const parentRef = useRef(document.createElement("div") as HTMLDivElement);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function onOpacityChange(value: number) {
    if (value > 100) value = 100;
    if (value < 0) value = 0;
    setValues(name, values.color, value);
  }

  useEffect(() => {
    const hexColor = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
    if (!hexColor.test(values.color)) {
      throw new Error("Invalid Hex Color");
    }
  }, [values.color]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs text-stone-500 font-bold">{name}</label>
      <div
        ref={parentRef}
        className="relative flex flex-row self-stretch w-full gap-2 rounded-sm px-[6px] h-fit w-fit outline outline-1 outline-stone-300"
      >
        {displayColorPicker && (
          <ColorPicker
            position={position}
            onClose={() => {
              setDisplayColorPicker(false);
            }}
            onApply={(color, opacity) => {
              setValues(name, color, opacity);
              setDisplayColorPicker(false);
            }}
            initialColor={values.color}
          />
        )}
        <div className="flex flex-row gap-2 my-[6px] items-center h-fit flex-1">
          <button
            className={`h-6 w-6 rounded-sm`}
            style={{
              backgroundColor: values.color,
              opacity: values.opacity / 100,
            }}
            onClick={() => {
              const rect = parentRef.current.getBoundingClientRect();
              let x = rect.x - rect.width;
              let y = rect.y + rect.height;

              if (window.innerWidth - rect.x < 286) {
                x = rect.x - 286;
              }
              if (window.innerHeight - rect.y < 450) {
                // only add required distance to the y position
                const distance = 450 - (window.innerHeight - rect.y);
                y = rect.y - distance;
              }
              setPosition({ x, y });

              setDisplayColorPicker((prev) => !prev);
            }}
          ></button>
          <span className="text-xs text-stone-700 cursor-copy">
            {values.color}
          </span>
        </div>
        <div className="w-[1px] bg-stone-300"></div>
        <div className="flex flex-row items-center">
          <input
            ref={opacityRef}
            className="h-6 w-6 text-xs text-stone-500 outline-none border-none"
            value={values.opacity}
            placeholder="100"
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            onFocus={(e) => e.target.select()}
          />
          <span
            onClick={() => opacityRef.current.focus()}
            className="text-xs text-stone-500 -translate-x-[2px]"
          >
            %
          </span>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-1 mb-4">
        <Info size={16} className="stroke-stone-500 stroke-[1.5px]" />
        <span className="text-xs font-light text-stone-500 line-clamp-3">
          {description}
        </span>
      </div>
    </div>
  );
}
