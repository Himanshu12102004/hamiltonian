import React, { useRef, useEffect } from 'react';

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

  return <canvas ref={canvasRef}/>;
};

export default Canvas;
