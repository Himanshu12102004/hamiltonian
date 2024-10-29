import { ArrowUp01, Info } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Slider({
  name = "Polygon Count",
  description = "Slider",
  min = 0,
  max = 50,
  value = 50,
  step = 1,
  icon = <ArrowUp01 size={18} />,
  setValue = () => {},
}) {
  const canvasRef = useRef();
  const pointerRef = useRef();
  const parentRef = useRef();
  const isDragging = useRef(false);
  const currentValueRef = useRef(value);

  const updateCanvas = (displayValue) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#D1D5DB";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#2563EB";
    ctx.fillRect(0, 0, ((displayValue - min) / (max - min)) * width, height);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const parentRect = parentRef.current.getBoundingClientRect();
    const pointerRect = pointerRef.current.getBoundingClientRect();
    const pointerWidth = pointerRect.width;

    let newX = e.clientX - parentRect.left - pointerWidth / 2;
    newX = Math.max(0, Math.min(newX, parentRect.width));

    pointerRef.current.style.left = `${newX}px`;

    const newValue =
      min + (newX / (parentRect.width - pointerWidth)) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    currentValueRef.current = Math.max(min, Math.min(max, steppedValue));

    updateCanvas(currentValueRef.current);
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      setValue(name, currentValueRef.current);
      isDragging.current = false;
    }
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    if (e.currentTarget !== e.target) return;
    isDragging.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleCanvasClick = (e) => {
    const parentRect = parentRef.current.getBoundingClientRect();
    const position = e.clientX - parentRect.left;
    const value = (position / parentRect.width) * (max - min) + min;

    const roundOffValue = Math.round(value / step) * step;
    setValue(name, roundOffValue);
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    updateCanvas(value);
    currentValueRef.current = value;

    const parentRect = parentRef.current.getBoundingClientRect();
    const pointerRect = pointerRef.current.getBoundingClientRect();
    const initialX = ((value - min) / (max - min)) * parentRect.width;

    pointerRef.current.style.left = `${initialX}px`;

    pointerRef.current.addEventListener("mousedown", handleMouseDown);

    parentRef.current.addEventListener("mousedown", handleCanvasClick);

    return () => {
      pointerRef.current?.removeEventListener("mousedown", handleMouseDown);
      parentRef.current?.removeEventListener("mousedown", handleCanvasClick);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [value, min, max]);

  const handleInputChange = (e) => {
    const newValue = Math.max(min, Math.min(max, Number(e.target.value)));
    setValue(name, newValue);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row gap-1">
        {icon}
        <span className="text-stone-600 text-sm">{name}</span>
      </div>
      <div className="flex flex-row gap-6 items-center">
        <div className="flex flex-row gap-2 w-full items-center">
          <span className="text-sm text-stone-600">{min}</span>
          <div
            ref={parentRef}
            className="flex flex-row gap-2 h-3 items-center relative w-full"
          >
            <canvas ref={canvasRef} className="w-full h-[3px] rounded-md" />
            <div
              ref={pointerRef}
              className="absolute bg-white w-4 h-4 border-[5px] border-blue-500 rounded-full cursor-pointer hover:border-blue-600 active:border-blue-700"
              style={{ transform: "translateX(-50%)" }}
            ></div>
          </div>
          <span className="text-sm text-stone-600 ml-4">{max}</span>
        </div>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="px-1 min-w-10 h-9 text-center text-sm text-stone-600 outline outline-1 outline-stone-300 rounded-md"
        />
      </div>
      <div className="flex flex-row gap-2 mt-2 mb-8">
        <Info size={16} />
        <span className="text-stone-400 text-xs">{description}</span>
      </div>
    </div>
  );
}
