import { useEffect } from "react";

import Canvas from "./Canvas";
import main from "../Graph/main";

function CanvasParent(): JSX.Element {
  let canva: HTMLCanvasElement;
  function getCanvas(canvas: HTMLCanvasElement) {
    canva = canvas;
  }
  useEffect(() => {
    main(canva);
  });
  return <Canvas onCanvasReady={getCanvas} />;
}

export default CanvasParent;
