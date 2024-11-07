import React, { useRef, useEffect } from "react";
import { GlobalVariables } from "../Graph/GlobalVariables";

interface CanvasProps {
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

const Canvas: React.FC<CanvasProps> = ({ onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      onCanvasReady(canvas);
    }
  }, [onCanvasReady]);

  return (
    <canvas
      onResize={() => {
        GlobalVariables.gl.viewport(
          0,
          0,
          GlobalVariables.gl.canvas.width,
          GlobalVariables.gl.canvas.height
        );
      }}
      className="h-full w-full"
      ref={canvasRef}
    />
  );
};

export default Canvas;
