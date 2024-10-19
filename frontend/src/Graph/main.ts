import CanvasEvents from './CanvasEvents';
import {GlobalVariables} from './GlobalVariables';
import { shaderCompiler } from './helpers/compileShaders';
import { createProgram } from './helpers/createProgram';
import { drawConnections, drawNodes } from './rendering/drawNodes';
function loadShader(shaderUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('GET', shaderUrl, true);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status === 200) {
          resolve(req.responseText);
        } else {
          reject(new Error(`Failed to load shader: ${shaderUrl}`));
        }
      }
    };
    req.send();
  });
}
function compileShader(
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  let vertexShader = shaderCompiler(
    vertexShaderSource,
    GlobalVariables.gl.VERTEX_SHADER,
    GlobalVariables.gl
  );
  let fragmentShader = shaderCompiler(
    fragmentShaderSource,
    GlobalVariables.gl.FRAGMENT_SHADER,
    GlobalVariables.gl
  );
  return { vertexShader, fragmentShader };
}
function animate() {
  GlobalVariables.gl.clearColor(0.0, 0.0, 0.0, 1.0); 
  GlobalVariables.gl.clear(GlobalVariables.gl.COLOR_BUFFER_BIT|GlobalVariables.gl.DEPTH_BUFFER_BIT);
  drawConnections();
  drawNodes();
  requestAnimationFrame(animate);
}

async function init() {
  const vertexShaderLineSource = await loadShader(
    './shaders/lines/lines.vs.glsl'
  );
  const fragmentShaderLineSource = await loadShader(
    './shaders/lines/lines.fs.glsl'
  );
  GlobalVariables.shaders.line = compileShader(
    vertexShaderLineSource,
    fragmentShaderLineSource
  );
  GlobalVariables.program.line = createProgram(
    GlobalVariables.shaders.line.vertexShader!,
    GlobalVariables.shaders.line.fragmentShader!,
    GlobalVariables.gl
  );
  const vertexShaderBoxSource = await loadShader(
    './shaders/nodes/nodes.vs.glsl'
  );
  const fragmentShaderBoxSource = await loadShader(
    './shaders/nodes/nodes.fs.glsl'
  );
  GlobalVariables.shaders.node = compileShader(
    vertexShaderBoxSource,
    fragmentShaderBoxSource
  );
  GlobalVariables.program.node = createProgram(
    GlobalVariables.shaders.node.vertexShader!,
    GlobalVariables.shaders.node.fragmentShader!,
    GlobalVariables.gl
  );
}
function main(canvas: HTMLCanvasElement) {
  GlobalVariables.init(canvas);
  CanvasEvents.addEvents();
  init();
  animate();
}
export default main;
