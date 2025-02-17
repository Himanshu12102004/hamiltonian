import { X } from "lucide-react";
import { useEffect, useRef, useState, MouseEvent, useCallback } from "react";
import { hslToRgb, rgbToHex, hexToRgb, rgbToHsl } from "./ColorHelpers";

interface ColorPickerProps {
  visible?: boolean;
  initialColor?: string;
  opacity?: number;
  onClose?: () => void;
  onApply?: (color: string, opacity: number) => void;
  position?: { x: number; y: number };
}

interface Color {
  hue: number;
  saturation: number;
  lightness: number;
  opacity: number;
}

const ColorPicker = ({
  visible = true,
  initialColor = "#f25aff",
  opacity = 100,
  onClose,
  onApply,
  position = { x: 0, y: 0 },
}: ColorPickerProps) => {
  console.log(initialColor);
  const [color, setColor] = useState<Color>({
    hue: 0,
    saturation: 100,
    lightness: 50,
    opacity: 100,
  });
  const [mode, setMode] = useState<"HEX" | "RGB" | "HSL">("HEX");
  const [isDragging, setIsDragging] = useState(false);
  const [activeControl, setActiveControl] = useState<
    "color" | "hue" | "opacity" | null
  >(null);

  const canvasColorRef = useRef<HTMLCanvasElement>(null);
  const canvasHueRef = useRef<HTMLCanvasElement>(null);
  const canvasOpacityRef = useRef<HTMLCanvasElement>(null);
  const colorMarkerRef = useRef<HTMLDivElement>(null);
  const hueMarkerRef = useRef<HTMLDivElement>(null);
  const opacityMarkerRef = useRef<HTMLDivElement>(null);

  const updateColorFromPosition = (
    x: number,
    y: number,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const saturation = Math.max(
      0,
      Math.min(100, ((x - rect.left) / rect.width) * 100)
    );
    const lightness = Math.max(
      0,
      Math.min(100, 100 - ((y - rect.top) / rect.height) * 100)
    );
    setColor((prev) => ({ ...prev, saturation, lightness }));
  };

  const updateHueFromPosition = (x: number) => {
    const rect = canvasHueRef.current!.getBoundingClientRect();
    const hue = Math.max(
      0,
      Math.min(360, ((x - rect.left) / rect.width) * 360)
    );
    setColor((prev) => ({ ...prev, hue }));
  };

  const updateOpacityFromPosition = (x: number) => {
    const rect = canvasOpacityRef.current!.getBoundingClientRect();
    const opacity = Math.max(
      0,
      Math.min(100, ((x - rect.left) / rect.width) * 100)
    );
    setColor((prev) => ({ ...prev, opacity }));
  };

  const handleMouseDown = (
    e: MouseEvent,
    control: "color" | "hue" | "opacity"
  ) => {
    setIsDragging(true);
    setActiveControl(control);
    const canvas = {
      color: canvasColorRef.current,
      hue: canvasHueRef.current,
      opacity: canvasOpacityRef.current,
    }[control];

    if (control === "color") {
      updateColorFromPosition(e.clientX, e.clientY, canvas!);
    } else if (control === "hue") {
      updateHueFromPosition(e.clientX);
    } else if (control === "opacity") {
      updateOpacityFromPosition(e.clientX);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      if (activeControl === "color") {
        updateColorFromPosition(e.clientX, e.clientY, canvasColorRef.current!);
      } else if (activeControl === "hue") {
        updateHueFromPosition(e.clientX);
      } else if (activeControl === "opacity") {
        updateOpacityFromPosition(e.clientX);
      }
    },
    [isDragging, activeControl]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveControl(null);
  }, []);

  useEffect(() => {
    setColor({
      hue: hexToRgb(initialColor)[0],
      saturation: hexToRgb(initialColor)[1],
      lightness: hexToRgb(initialColor)[2],
      opacity: opacity,
    });
  }, [initialColor, opacity]);

  useEffect(() => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexColorRegex.test(initialColor)) {
      const [r, g, b] = hexToRgb(initialColor);
      const [h, s, l] = rgbToHsl(r, g, b);
      setColor((prev) => ({ ...prev, hue: h, saturation: s, lightness: l }));
    } else if (Array.isArray(initialColor) && initialColor.length === 3) {
      const rgb = initialColor.match(/\d+/g);
      const [r, g, b] = rgb!.map(Number);
      const [h, s, l] = rgbToHsl(r, g, b);
      setColor((prev) => ({ ...prev, hue: h, saturation: s, lightness: l }));
    }
  }, [initialColor, setColor]);

  useEffect(() => {
    // @ts-expect-error This line is added to make the code dynamic
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      // @ts-expect-error This line is added to make the code dynamic
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, activeControl, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const canvas = canvasColorRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4;
        const s = (x / canvas.width) * 100;
        const l = 100 - (y / canvas.height) * 100;
        const [r, g, b] = hslToRgb(color.hue, s, l);
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [color.hue]);

  useEffect(() => {
    const canvas = canvasHueRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    for (let i = 0; i <= 360; i += 30) {
      gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasOpacityRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Checkerboard pattern
    const squareSize = 8;
    for (let i = 0; i < canvas.width; i += squareSize) {
      for (let j = 0; j < canvas.height; j += squareSize) {
        ctx.fillStyle =
          ((i + j) / squareSize) % 2 === 0 ? "#ffffff" : "#e5e5e5";
        ctx.fillRect(i, j, squareSize, squareSize);
      }
    }

    const [r, g, b] = hslToRgb(color.hue, color.saturation, color.lightness);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [color.hue, color.saturation, color.lightness]);

  const getCurrentColor = (): string => {
    const [r, g, b] = hslToRgb(color.hue, color.saturation, color.lightness);
    switch (mode) {
      case "RGB":
        return `rgb(${r}, ${g}, ${b})`;
      case "HSL":
        return `hsl(${Math.round(color.hue)}, ${Math.round(
          color.saturation
        )}%, ${Math.round(color.lightness)}%)`;
      case "HEX":
      default:
        return rgbToHex(r, g, b);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "hex" | "h" | "s" | "l"
  ) => {
    const value = e.target.value;
    if (type === "hex") {
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        // const [r, g, b] = hexToRgb(value);
        // Convert RGB to HSL (simplified conversion)
        setColor((prev) => ({ ...prev /* Add HSL conversion here */ }));
      }
    } else {
      const numValue = parseInt(value) || 0;
      switch (type) {
        case "h":
          setColor((prev) => ({
            ...prev,
            hue: Math.min(360, Math.max(0, numValue)),
          }));
          break;
        case "s":
          setColor((prev) => ({
            ...prev,
            saturation: Math.min(100, Math.max(0, numValue)),
          }));
          break;
        case "l":
          setColor((prev) => ({
            ...prev,
            lightness: Math.min(100, Math.max(0, numValue)),
          }));
          break;
      }
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
      className={`z-20 bg-white fixed flex flex-col w-72 rounded-lg shadow-xl animate-grow`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <span className="text-sm font-medium">Color Picker</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} onClick={onClose} />
        </button>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <canvas
            ref={canvasColorRef}
            className="w-full h-48 rounded cursor-crosshair"
            onMouseDown={(e) => handleMouseDown(e, "color")}
          />
          <div
            ref={colorMarkerRef}
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${color.saturation}%`,
              top: `${100 - color.lightness}%`,
              backgroundColor: getCurrentColor(),
            }}
          />
        </div>

        <div className="relative mb-4">
          <canvas
            ref={canvasHueRef}
            className="w-full h-4 rounded cursor-pointer"
            onMouseDown={(e) => handleMouseDown(e, "hue")}
          />
          <div
            ref={hueMarkerRef}
            className="absolute top-0 w-2 h-4 bg-white border border-gray-300 rounded transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${(color.hue / 360) * 100}%` }}
          />
        </div>

        <div className="relative mb-4">
          <canvas
            ref={canvasOpacityRef}
            className="w-full h-4 rounded cursor-pointer"
            onMouseDown={(e) => handleMouseDown(e, "opacity")}
          />
          <div
            ref={opacityMarkerRef}
            className="absolute top-0 w-2 h-4 bg-white border border-gray-300 rounded transform -translate-x-1/2 pointer-events-none"
            style={{ left: `${color.opacity}%` }}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "HEX" | "RGB" | "HSL")}
            className="px-2 py-1 text-sm border rounded"
          >
            <option value="HEX">HEX</option>
            <option value="RGB">RGB</option>
            <option value="HSL">HSL</option>
          </select>

          <div className="flex-1">
            {mode === "HEX" && (
              <input
                type="text"
                value={getCurrentColor()}
                onChange={(e) => handleInputChange(e, "hex")}
                className="w-full px-2 py-1 text-sm border rounded"
              />
            )}
            {mode === "RGB" && (
              <div className="flex gap-1">
                <input
                  type="number"
                  value={Math.round(
                    hslToRgb(color.hue, color.saturation, color.lightness)[0]
                  )}
                  className="w-full px-2 py-1 text-sm border rounded"
                  readOnly
                />
                <input
                  type="number"
                  value={Math.round(
                    hslToRgb(color.hue, color.saturation, color.lightness)[1]
                  )}
                  className="w-full px-2 py-1 text-sm border rounded"
                  readOnly
                />
                <input
                  type="number"
                  value={Math.round(
                    hslToRgb(color.hue, color.saturation, color.lightness)[2]
                  )}
                  className="w-full px-2 py-1 text-sm border rounded"
                  readOnly
                />
              </div>
            )}
            {mode === "HSL" && (
              <div className="flex gap-1">
                <input
                  type="number"
                  value={Math.round(color.hue)}
                  onChange={(e) => handleInputChange(e, "h")}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <input
                  type="number"
                  value={Math.round(color.saturation)}
                  onChange={(e) => handleInputChange(e, "s")}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
                <input
                  type="number"
                  value={Math.round(color.lightness)}
                  onChange={(e) => handleInputChange(e, "l")}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <div
            className="w-8 h-8 rounded border border-gray-200"
            style={{
              backgroundColor: getCurrentColor(),
              opacity: color.opacity / 100,
            }}
          />
          <button
            onClick={() => onApply?.(getCurrentColor(), color.opacity)}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
