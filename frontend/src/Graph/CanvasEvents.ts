import { GlobalVariables } from './GlobalVariables';
import Point from './world/helpers/point';

class CanvasEvents {
  static isPanning = false;
  static isDragging = false;
  static dragStartX = 0;
  static dragStartY = 0;
  static addEvents() {
    GlobalVariables.canvas.addEventListener(
      'wheel',
      (e) => {
        CanvasEvents.onZoom(e);
      },
      { passive: true }
    );
    GlobalVariables.canvas.addEventListener('mousemove', (e) => {
      CanvasEvents.onPan(e);
    });
    GlobalVariables.canvas.addEventListener('mousedown', (e) => {
      CanvasEvents.isDragging = false;
      CanvasEvents.dragStartX = e.clientX;
      CanvasEvents.dragStartY = e.clientY;
    });
    GlobalVariables.canvas.addEventListener('mouseup', (e) => {
      const dragEndX = e.clientX;
      const dragEndY = e.clientY;
      const distance = Math.hypot(
        dragEndX - CanvasEvents.dragStartX,
        dragEndY - CanvasEvents.dragStartY
      );
      if (distance < 5) {
        CanvasEvents.onclick(e);
      } else {
        CanvasEvents.isDragging = true;
      }
      GlobalVariables.canvas.style.cursor = 'pointer';
      let pt=CanvasEvents.convertClientToCanvas(e.clientX,e.clientY);
      GlobalVariables.graph.checkForConnectionsAndConnect(pt);
    });
  }
  static convertClientToCanvas(xi: number, yi: number) {
    let distance = GlobalVariables.graphScale.scale;
    let rightBound = GlobalVariables.screenDimensions.width / (2 * distance);
    let topBound = GlobalVariables.screenDimensions.height / (2 * distance);
    let leftBound = -rightBound;
    let bottomBound = -topBound;
    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
      (GlobalVariables.bounds.maxY + GlobalVariables.bounds.minY) / 2;
    let x =
      (xi * (rightBound - leftBound)) / GlobalVariables.screenDimensions.width +
      leftBound +
      centerX;
    let y =
      -(
        (yi * (topBound - bottomBound)) /
          GlobalVariables.screenDimensions.height +
        bottomBound
      ) + centerY;
    return new Point(x, y);
  }
  static onclick(e: MouseEvent) {
    let pt = CanvasEvents.convertClientToCanvas(e.clientX, e.clientY);
    GlobalVariables.graph.handleNodes(pt);
  }

  static onZoom(e: WheelEvent) {
    if (e.deltaY > 0) {
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 0.95;
      if (GlobalVariables.noOfTriangles >= 20) --GlobalVariables.noOfTriangles;
    } else {
      GlobalVariables.graphScale.scale =
        GlobalVariables.graphScale.scale * 1.05;
      if (GlobalVariables.noOfTriangles <= 100) ++GlobalVariables.noOfTriangles;
    }
    let centerX =
      (GlobalVariables.bounds.maxX + GlobalVariables.bounds.minX) / 2;
    let centerY =
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
      let pt = CanvasEvents.convertClientToCanvas(e.clientX, e.clientY);
      GlobalVariables.graph.handleConnections(pt);
      GlobalVariables.graph.handleConnectionVicinity(pt);
      if (!GlobalVariables.graph.isConnectionInitiated) {
        var iRange = GlobalVariables.bounds.maxY - GlobalVariables.bounds.minY;
        var rRange = GlobalVariables.bounds.maxX - GlobalVariables.bounds.minX;
        var iDelta =
          (e.movementY / GlobalVariables.canvas.clientHeight) * iRange;
        var rDelta =
          (e.movementX / GlobalVariables.canvas.clientWidth) * rRange;
        GlobalVariables.bounds.minY += iDelta;
        GlobalVariables.bounds.maxY += iDelta;
        GlobalVariables.bounds.minX -= rDelta;
        GlobalVariables.bounds.maxX -= rDelta;
        GlobalVariables.canvas.style.cursor = 'grabbing';
      }
    }
  }
}
export default CanvasEvents;
