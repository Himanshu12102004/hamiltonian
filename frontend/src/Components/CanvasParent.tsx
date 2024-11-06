import React, { useEffect } from "react";

import Canvas from "./Canvas";
import main from "../Graph/main";

const CanvasParent: React.FC = () => {
  let canva: HTMLCanvasElement;
  function getCanvas(canvas: HTMLCanvasElement) {
    canva = canvas;
  }
  useEffect(() => {
    main(canva);
  });
  return <Canvas onCanvasReady={getCanvas} />;
};

export default CanvasParent;
