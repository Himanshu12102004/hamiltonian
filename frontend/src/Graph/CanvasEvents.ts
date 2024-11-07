import { GlobalVariables } from "./GlobalVariables";
// import Train from "./world/components/MouseTrain";
import Point from "./world/helpers/point";
import { gui } from "./main"; // Import the gui object
class CanvasEvents {
  static isPanning = false;
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static addEvents() {
    window.addEventListener("resize", () => {
      CanvasEvents.onResize();
    });
    GlobalVariables.canvas.addEventListener(
      "wheel",
      (e) => {
        CanvasEvents.onZoom(e);
      },
      { passive: true }
    );
    GlobalVariables.canvas.addEventListener("mousemove", (e) => {
      CanvasEvents.onPan(e);
    });
    GlobalVariables.canvas.addEventListener("mousedown", (e) => {
      CanvasEvents.isDragging = false;
      CanvasEvents.dragStartX = e.clientX - GlobalVariables.canvas.offsetLeft;
      CanvasEvents.dragStartY = e.clientY - GlobalVariables.canvas.offsetTop;
    });
    GlobalVariables.canvas.addEventListener("mouseup", (e) => {
      const dragEndX = e.clientX - GlobalVariables.canvas.offsetLeft;
      const dragEndY = e.clientY - GlobalVariables.canvas.offsetTop;
      const distance = Math.hypot(
        dragEndX - CanvasEvents.dragStartX,
        dragEndY - CanvasEvents.dragStartY
      );
      if (distance < 5) {
        CanvasEvents.onclick(e);
      } else {
        CanvasEvents.isDragging = true;
      }
      GlobalVariables.canvas.style.cursor = "pointer";
      const pt = CanvasEvents.convertClientToCanvas(
        e.clientX - GlobalVariables.canvas.offsetLeft,
        e.clientY - GlobalVariables.canvas.offsetTop
      );
      GlobalVariables.graph.checkForConnectionsAndConnect(pt);
    });
    GlobalVariables.canvas.setAttribute("tabindex", "0");
    GlobalVariables.canvas.addEventListener("keydown", (e: KeyboardEvent) => {
      CanvasEvents.handleKeyEvents(e);
    });
  }
  static onResize() {
    GlobalVariables.screenDimensions.height =
      GlobalVariables.canvasParent.clientHeight;
    GlobalVariables.screenDimensions.width =
      GlobalVariables.canvasParent.clientWidth;
    GlobalVariables.canvas!.height = GlobalVariables.screenDimensions.height;
    GlobalVariables.canvas!.width = GlobalVariables.screenDimensions.width;
    GlobalVariables.gl.viewport(
      0,
      0,
      GlobalVariables.screenDimensions.width,
      GlobalVariables.screenDimensions.height
    );

    const centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    const centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    GlobalVariables.bounds.maxX =
      centerX +
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minX =
      centerX -
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.maxY =
      centerY +
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minY =
      centerY -
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
  }

  static convertClientToCanvas(xi: number, yi: number) {
    const distance = GlobalVariables.graphScale.scale;
    const rightBound = GlobalVariables.screenDimensions.width / (2 * distance);
    const topBound = GlobalVariables.screenDimensions.height / (2 * distance);
    const leftBound = -rightBound;
    const bottomBound = -topBound;
    const centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    const centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    const x =
      (xi * (rightBound - leftBound)) / GlobalVariables.screenDimensions.width +
      leftBound +
      centerX;
    const y =
      -(
        (yi * (topBound - bottomBound)) /
          GlobalVariables.screenDimensions.height +
        bottomBound
      ) + centerY;
    return new Point(x, y);
  }
  static onclick(e: MouseEvent) {
    const pt = CanvasEvents.convertClientToCanvas(
      e.clientX - GlobalVariables.canvas.offsetLeft,
      e.clientY - GlobalVariables.canvas.offsetTop
    );
    GlobalVariables.graph.handleNodes(pt);
  }

  static onZoom(e: WheelEvent) {
    if (e.deltaY > 0) {
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 0.95;
    } else {
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 1.05;
    }
    const centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    const centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    GlobalVariables.bounds.maxX =
      centerX +
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minX =
      centerX -
      GlobalVariables.screenDimensions.width /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.maxY =
      centerY +
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
    GlobalVariables.bounds.minY =
      centerY -
      GlobalVariables.screenDimensions.height /
        (2 * GlobalVariables.graphScale.scale);
  }
  static onPan(e: MouseEvent) {
    if (e.buttons === 1) {
      const pt = CanvasEvents.convertClientToCanvas(
        e.clientX - GlobalVariables.canvas.offsetLeft,
        e.clientY - GlobalVariables.canvas.offsetTop
      );
      if (GlobalVariables.graph.isConnectionInitiated)
        GlobalVariables.mouseTrain.updateVector(pt);
      GlobalVariables.graph.handleConnections(pt);
      GlobalVariables.graph.handleConnectionVicinity(pt);
      if (!GlobalVariables.graph.isConnectionInitiated) {
        const iRange =
          GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY;
        const rRange =
          GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX;
        const iDelta =
          (e.movementY / GlobalVariables.canvas.clientHeight) * iRange;
        const rDelta =
          (e.movementX / GlobalVariables.canvas.clientWidth) * rRange;
        GlobalVariables.bounds.minY += iDelta;
        GlobalVariables.bounds.maxY += iDelta;
        GlobalVariables.bounds.minX -= rDelta;
        GlobalVariables.bounds.maxX -= rDelta;
        GlobalVariables.canvas.style.cursor = "grabbing";
      }
    }
  }
  static handleKeyEvents(e: KeyboardEvent) {
    if (e.code == "KeyK") {
      GlobalVariables.playPause();
    } else if (e.code == "KeyR") {
      GlobalVariables.reset();
    } else if (e.code == "KeyF") {
      GlobalVariables.fastForward();
    } else if (e.code == "KeyS") {
      GlobalVariables.start();
    } else if (e.code == "KeyH") {
      if (gui.domElement.style.display === "none") {
        gui.show();
      } else {
        gui.hide();
      }
    }
  }
}
export default CanvasEvents;
