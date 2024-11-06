export function createBuffer(
  cpuArray: Float32Array,
  bufferType:GLenum,
  gl: WebGL2RenderingContext
) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, cpuArray, gl.STATIC_DRAW);
  return buffer;
}
